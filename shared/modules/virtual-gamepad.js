/**
 * TechTest Virtual Hardware Simulator & Physics Engine
 * Generates mathematically realistic HID telemetry for QA testing, development,
 * and users without a physical controller plugged in.
 */

export class VirtualGamepadSimulator {
  constructor() {
    this.isActive = false;
    this.preset = 'pristine'; // 'pristine' | 'moderate_drift' | 'severe_drift' | 'hall_effect'
    this.animationId = null;
    this.onFrame = null;
    this.tick = 0;

    // Adjustable virtual parameters
    this.params = {
      driftX: 0.0,
      driftY: 0.0,
      noiseAmp: 0.002,
      circularityRadius: 1.0,
      cardinalSnap: false,
      hzRate: 250
    };

    this.setPreset('pristine');
  }

  setPreset(presetName) {
    this.preset = presetName;
    if (presetName === 'pristine') {
      this.params = { driftX: 0.001, driftY: -0.002, noiseAmp: 0.001, circularityRadius: 1.0, cardinalSnap: false, hzRate: 500 };
    } else if (presetName === 'moderate_drift') {
      this.params = { driftX: 0.14, driftY: -0.08, noiseAmp: 0.015, circularityRadius: 0.94, cardinalSnap: false, hzRate: 250 };
    } else if (presetName === 'severe_drift') {
      this.params = { driftX: 0.38, driftY: 0.22, noiseAmp: 0.04, circularityRadius: 1.15, cardinalSnap: true, hzRate: 125 };
    } else if (presetName === 'hall_effect') {
      this.params = { driftX: 0.0, driftY: 0.0, noiseAmp: 0.0005, circularityRadius: 1.0, cardinalSnap: false, hzRate: 1000 };
    }
  }

  start(onFrameCallback) {
    if (this.isActive) return;
    this.isActive = true;
    this.onFrame = onFrameCallback;

    const loop = () => {
      if (!this.isActive) return;
      this.tick++;

      const noiseX = (Math.random() - 0.5) * this.params.noiseAmp;
      const noiseY = (Math.random() - 0.5) * this.params.noiseAmp;

      // Simulated physical rotation when benchmarking
      let lx = this.params.driftX + noiseX;
      let ly = this.params.driftY + noiseY;

      // Gentle orbital motion to simulate physical thumb rotation
      const orbitSpeed = 0.03;
      const angle = this.tick * orbitSpeed;
      let rx = Math.cos(angle) * this.params.circularityRadius + noiseX;
      let ry = Math.sin(angle) * this.params.circularityRadius + noiseY;

      if (this.params.cardinalSnap) {
        if (Math.abs(rx) < 0.08) rx = 0;
        if (Math.abs(ry) < 0.08) ry = 0;
      }

      // Simulated buttons
      const buttons = {
        cross: (this.tick % 60) < 5,
        circle: false,
        square: false,
        triangle: false,
        l1: false,
        r1: false
      };

      // Simulated trigger force
      const l2 = (Math.sin(this.tick * 0.05) + 1) * 0.5;
      const r2 = (Math.cos(this.tick * 0.05) + 1) * 0.5;

      // Simulated IMU gyro oscillation
      const rawImu = {
        gx: Math.round(Math.sin(this.tick * 0.04) * 320),
        gy: Math.round(Math.cos(this.tick * 0.04) * 240),
        gz: Math.round(Math.sin(this.tick * 0.02) * 160),
        ax: Math.round(Math.sin(this.tick * 0.04) * 800),
        ay: Math.round(Math.cos(this.tick * 0.04) * 600),
        az: 8192 // 1G gravity
      };

      if (this.onFrame) {
        this.onFrame({
          axes: [lx, ly, rx, ry],
          buttons,
          triggers: { l2, r2 },
          rawImu,
          isSimulated: true,
          preset: this.preset
        });
      }

      if (typeof requestAnimationFrame === 'function') {
        this.animationId = requestAnimationFrame(loop);
      } else {
        this.animationId = setTimeout(loop, 16);
      }
    };

    if (typeof requestAnimationFrame === 'function') {
      this.animationId = requestAnimationFrame(loop);
    } else {
      this.animationId = setTimeout(loop, 16);
    }
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      if (typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(this.animationId);
      } else {
        clearTimeout(this.animationId);
      }
      this.animationId = null;
    }
  }
}

if (typeof window !== 'undefined') {
  window.VirtualGamepadSimulator = VirtualGamepadSimulator;
}
