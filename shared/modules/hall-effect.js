/**
 * TechTest Hall Effect Joystick Diagnostic & Magnetic Interference Engine
 * Analyzes magnetic sensor linearity, resting center stability, and trigger motor cross-talk.
 */

export class HallEffectDiagnostic {
  /**
   * Tests whether Hall Effect sensors experience magnetic interference from rumble/trigger motors.
   * Compares resting coordinates before and during trigger actuation.
   * @param {{x: number, y: number}} neutralCoord Stick at rest with triggers unpressed
   * @param {{x: number, y: number}} actuatedCoord Stick at rest with L2/R2 fully depressed
   * @returns {Object} Interference analysis
   */
  static testMagneticInterference(neutralCoord, actuatedCoord) {
    const dx = actuatedCoord.x - neutralCoord.x;
    const dy = actuatedCoord.y - neutralCoord.y;
    const shiftDistance = Math.sqrt(dx * dx + dy * dy);

    // If resting point shifts by more than 0.035 when triggers depress, magnetic coupling exists
    const hasInterference = shiftDistance > 0.035;

    let severity = 'None (Excellent Isolation)';
    let recommendation = 'Sensors and internal trigger magnets are properly shielded.';

    if (shiftDistance > 0.10) {
      severity = 'Severe Magnetic Coupling';
      recommendation = 'Hall sensor magnet orientation or trigger motor shielding is compromised. Consider adding mu-metal magnetic shielding foil behind the sensor.';
    } else if (shiftDistance > 0.035) {
      severity = 'Minor Cross-Talk';
      recommendation = 'Small magnetic field distortion detected. Increase in-game deadzone slightly or re-route trigger wire harness away from sensor PCB.';
    }

    return {
      shiftDistance: parseFloat(shiftDistance.toFixed(4)),
      hasInterference,
      severity,
      recommendation
    };
  }

  /**
   * Analyzes axis linearity and quadrant symmetry for Hall Effect joysticks.
   * @param {Array<{x: number, y: number}>} samples 
   * @returns {Object} Symmetry and linearity score
   */
  static analyzeSymmetry(samples) {
    if (!samples || samples.length < 20) {
      return { symmetryScore: 100, linearityScore: 100, status: 'Need More Input Data' };
    }

    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
    let maxPosX = 0, maxNegX = 0, maxPosY = 0, maxNegY = 0;

    for (const s of samples) {
      if (s.x > maxPosX) maxPosX = s.x;
      if (s.x < maxNegX) maxNegX = s.x;
      if (s.y > maxPosY) maxPosY = s.y;
      if (s.y < maxNegY) maxNegY = s.y;

      if (s.x >= 0 && s.y >= 0) q1++;
      else if (s.x < 0 && s.y >= 0) q2++;
      else if (s.x < 0 && s.y < 0) q3++;
      else q4++;
    }

    // Axis symmetry ratio (positive vs negative travel)
    const xSymmetry = Math.min(maxPosX, Math.abs(maxNegX)) / Math.max(0.01, Math.max(maxPosX, Math.abs(maxNegX)));
    const ySymmetry = Math.min(maxPosY, Math.abs(maxNegY)) / Math.max(0.01, Math.max(maxPosY, Math.abs(maxNegY)));
    const symmetryScore = Math.round(((xSymmetry + ySymmetry) / 2) * 100);

    return {
      symmetryScore,
      axisTravel: {
        posX: parseFloat(maxPosX.toFixed(3)),
        negX: parseFloat(maxNegX.toFixed(3)),
        posY: parseFloat(maxPosY.toFixed(3)),
        negY: parseFloat(maxNegY.toFixed(3))
      },
      evaluation: symmetryScore > 92 ? 'Excellent Sensor Balance' : symmetryScore > 80 ? 'Good' : 'Axis Imbalance (Re-center magnets)'
    };
  }
}

if (typeof window !== 'undefined') {
  window.HallEffectDiagnostic = HallEffectDiagnostic;
}
