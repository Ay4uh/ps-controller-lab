/**
 * TechTest 6-Axis IMU Sensor Fusion & Motion Tracker
 * Decodes DualSense and DualShock 4 Gyroscope + Accelerometer reports.
 * Computes calibrated pitch, roll, yaw Euler angles and rotation quaternion for real-time 3D orientation.
 */

export class ImuTracker {
  constructor() {
    this.pitch = 0; // degrees
    this.roll = 0;  // degrees
    this.yaw = 0;   // degrees

    // Zero-bias offsets
    this.gyroBias = { x: 0, y: 0, z: 0 };
    this.accelBias = { x: 0, y: 0, z: 0 };

    this.lastTimestamp = null;
    this.isCalibrating = false;
    this.calibrationSamples = [];

    // Scaling constants for PS DualSense / DS4 16-bit registers
    // DualSense reports ~2000 deg/sec full-scale (approx 16.4 LSB / deg/s)
    this.GYRO_SCALE = 1 / 16.4; 
    // Accelerometer reports ~4g full-scale (approx 8192 LSB / g)
    this.ACCEL_SCALE = 1 / 8192.0; 
  }

  /**
   * Resets orientation to level zero.
   */
  resetOrientation() {
    this.pitch = 0;
    this.roll = 0;
    this.yaw = 0;
    this.lastTimestamp = null;
  }

  /**
   * Begins zero-bias calibration (controller must sit flat and still on desk for ~1 second).
   */
  startCalibration() {
    this.isCalibrating = true;
    this.calibrationSamples = [];
  }

  /**
   * Ingests raw IMU values from DualSense / DS4 HID report.
   * @param {number} rawGx Gyro X 16-bit signed
   * @param {number} rawGy Gyro Y 16-bit signed
   * @param {number} rawGz Gyro Z 16-bit signed
   * @param {number} rawAx Accel X 16-bit signed
   * @param {number} rawAy Accel Y 16-bit signed
   * @param {number} rawAz Accel Z 16-bit signed
   * @param {number} [timestamp]
   */
  updateRaw(rawGx, rawGy, rawGz, rawAx, rawAy, rawAz, timestamp = performance.now()) {
    if (this.isCalibrating) {
      this.calibrationSamples.push({ gx: rawGx, gy: rawGy, gz: rawGz, ax: rawAx, ay: rawAy, az: rawAz });
      if (this.calibrationSamples.length >= 60) {
        let sumGx = 0, sumGy = 0, sumGz = 0;
        let sumAx = 0, sumAy = 0, sumAz = 0;
        for (const s of this.calibrationSamples) {
          sumGx += s.gx; sumGy += s.gy; sumGz += s.gz;
          sumAx += s.ax; sumAy += s.ay; sumAz += s.az;
        }
        const len = this.calibrationSamples.length;
        this.gyroBias = { x: sumGx / len, y: sumGy / len, z: sumGz / len };
        // Az should sit at 1G (~8192), Ax and Ay at 0
        this.accelBias = { x: sumAx / len, y: sumAy / len, z: (sumAz / len) - 8192 };
        this.isCalibrating = false;
        this.resetOrientation();
      }
      return this.getState();
    }

    // Apply zero bias
    const gx = (rawGx - this.gyroBias.x) * this.GYRO_SCALE; // deg/s
    const gy = (rawGy - this.gyroBias.y) * this.GYRO_SCALE;
    const gz = (rawGz - this.gyroBias.z) * this.GYRO_SCALE;

    const ax = (rawAx - this.accelBias.x) * this.ACCEL_SCALE; // g
    const ay = (rawAy - this.accelBias.y) * this.ACCEL_SCALE;
    const az = (rawAz - this.accelBias.z) * this.ACCEL_SCALE;

    const dt = this.lastTimestamp ? Math.min(0.1, (timestamp - this.lastTimestamp) / 1000) : 0.008;
    this.lastTimestamp = timestamp;

    // Pitch and Roll from Accelerometer (gravity vector)
    const accelPitch = Math.atan2(ay, Math.sqrt(ax * ax + az * az)) * (180 / Math.PI);
    const accelRoll = Math.atan2(-ax, az) * (180 / Math.PI);

    // Complementary Filter Fusion (98% Gyro integration, 2% Accelerometer leveling)
    const ALPHA = 0.97;
    this.pitch = ALPHA * (this.pitch + gx * dt) + (1 - ALPHA) * accelPitch;
    this.roll = ALPHA * (this.roll + gy * dt) + (1 - ALPHA) * accelRoll;
    this.yaw += gz * dt; // Yaw integrates gyro (accelerometer cannot absolute-reference yaw without magnetometer)

    // Normalize yaw to [-180, 180]
    while (this.yaw > 180) this.yaw -= 360;
    while (this.yaw < -180) this.yaw += 360;

    return this.getState(gx, gy, gz, ax, ay, az);
  }

  getState(gx = 0, gy = 0, gz = 0, ax = 0, ay = 0, az = 0) {
    // Convert Euler angles (in radians) to Quaternion [x, y, z, w]
    const pRad = (this.pitch * Math.PI) / 360;
    const rRad = (this.roll * Math.PI) / 360;
    const yRad = (this.yaw * Math.PI) / 360;

    const c1 = Math.cos(yRad), s1 = Math.sin(yRad);
    const c2 = Math.cos(pRad), s2 = Math.sin(pRad);
    const c3 = Math.cos(rRad), s3 = Math.sin(rRad);

    const qw = c1 * c2 * c3 - s1 * s2 * s3;
    const qx = s1 * s2 * c3 + c1 * c2 * s3;
    const qy = s1 * c2 * c3 + c1 * s2 * s3;
    const qz = c1 * s2 * c3 - s1 * c2 * s3;

    return {
      euler: {
        pitch: parseFloat(this.pitch.toFixed(1)),
        roll: parseFloat(this.roll.toFixed(1)),
        yaw: parseFloat(this.yaw.toFixed(1))
      },
      quaternion: { x: qx, y: qy, z: qz, w: qw },
      rates: { gx: parseFloat(gx.toFixed(1)), gy: parseFloat(gy.toFixed(1)), gz: parseFloat(gz.toFixed(1)) },
      accel: { ax: parseFloat(ax.toFixed(2)), ay: parseFloat(ay.toFixed(2)), az: parseFloat(az.toFixed(2)) },
      calibrating: this.isCalibrating
    };
  }
}

if (typeof window !== 'undefined') {
  window.ImuTracker = ImuTracker;
}
