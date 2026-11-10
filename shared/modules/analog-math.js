/**
 * TechTest Professional Analog Stick Math & Diagnostics Engine
 * Provides accurate circularity calculation, drift accumulation, jitter variance, and deadzone mapping.
 */

export class AnalogMath {
  /**
   * Calculates circularity error and outer deadzone characteristics from a series of recorded (x, y) coordinates.
   * Coordinates are expected in normalized [-1.0, 1.0] range.
   * @param {Array<{x: number, y: number}>} samples 
   * @returns {Object} Circularity metrics and bin radial data
   */
  static calculateCircularity(samples) {
    if (!samples || samples.length === 0) {
      return {
        errorPercentage: 0,
        averageRadius: 0,
        minRadius: 0,
        maxRadius: 0,
        cardinalSnapping: false,
        outerDeadzoneClipping: false,
        binData: [],
        rating: 'Insufficient Data'
      };
    }

    const NUM_BINS = 36; // 10-degree angular slices
    const binMaxRadii = new Array(NUM_BINS).fill(0);
    const binCounts = new Array(NUM_BINS).fill(0);
    let cardinalSnapCount = 0;
    let clippingCount = 0;

    for (let i = 0; i < samples.length; i++) {
      const { x, y } = samples[i];
      const r = Math.sqrt(x * x + y * y);
      
      // Check cardinal snapping (locking to exact horizontal or vertical within 0.005)
      if ((Math.abs(x) < 0.005 && Math.abs(y) > 0.5) || (Math.abs(y) < 0.005 && Math.abs(x) > 0.5)) {
        cardinalSnapCount++;
      }

      if (r >= 0.999) {
        clippingCount++;
      }

      // We only analyze outer circumference movements (r > 0.4)
      if (r > 0.4) {
        let angle = Math.atan2(y, x); // [-PI, PI]
        if (angle < 0) angle += 2 * Math.PI; // [0, 2PI]
        const binIndex = Math.min(NUM_BINS - 1, Math.floor((angle / (2 * Math.PI)) * NUM_BINS));

        if (r > binMaxRadii[binIndex]) {
          binMaxRadii[binIndex] = r;
        }
        binCounts[binIndex]++;
      }
    }

    // Filter populated bins
    const activeRadii = binMaxRadii.filter(r => r > 0.4);
    if (activeRadii.length < 10) {
      return {
        errorPercentage: 0,
        averageRadius: 0,
        minRadius: 0,
        maxRadius: 0,
        cardinalSnapping: false,
        outerDeadzoneClipping: false,
        binData: binMaxRadii,
        rating: 'Need More Full Rotations'
      };
    }

    let sumDeviation = 0;
    let minRadius = Infinity;
    let maxRadius = -Infinity;
    let sumRadius = 0;

    for (let i = 0; i < activeRadii.length; i++) {
      const r = activeRadii[i];
      sumRadius += r;
      if (r < minRadius) minRadius = r;
      if (r > maxRadius) maxRadius = r;
      // Deviation from ideal unit circle (r = 1.0)
      sumDeviation += Math.abs(r - 1.0);
    }

    const averageRadius = sumRadius / activeRadii.length;
    // Error percentage based on mean absolute deviation from unit circle
    const errorPercentage = parseFloat(((sumDeviation / activeRadii.length) * 100).toFixed(2));
    const cardinalSnapping = cardinalSnapCount > (samples.length * 0.08);
    const outerDeadzoneClipping = (clippingCount / samples.length) > 0.2;

    let rating = 'Excellent';
    if (errorPercentage > 18.0) rating = 'Severe Error (Drift/Defective)';
    else if (errorPercentage > 12.0) rating = 'Fair (Standard OEM DualShock/Xbox)';
    else if (errorPercentage > 7.0) rating = 'Good (Typical DualSense)';
    else rating = 'Superb (Near Perfect Circularity / Hall Effect)';

    return {
      errorPercentage,
      averageRadius: parseFloat(averageRadius.toFixed(3)),
      minRadius: parseFloat(minRadius.toFixed(3)),
      maxRadius: parseFloat(maxRadius.toFixed(3)),
      cardinalSnapping,
      outerDeadzoneClipping,
      binData: binMaxRadii,
      rating
    };
  }

  /**
   * Analyzes resting position stability and drift over time.
   * @param {Array<{x: number, y: number, timestamp: number}>} samples 
   * @returns {Object} Drift analysis results
   */
  static analyzeDrift(samples) {
    if (!samples || samples.length === 0) {
      return {
        restingX: 0,
        restingY: 0,
        offsetDistance: 0,
        microJitter: 0,
        maxExcursion: 0,
        grade: 'No Data',
        status: 'Untested'
      };
    }

    let sumX = 0;
    let sumY = 0;
    let maxExcursion = 0;

    for (let i = 0; i < samples.length; i++) {
      const { x, y } = samples[i];
      sumX += x;
      sumY += y;
      const d = Math.sqrt(x * x + y * y);
      if (d > maxExcursion) maxExcursion = d;
    }

    const n = samples.length;
    const avgX = sumX / n;
    const avgY = sumY / n;
    const offsetDistance = Math.sqrt(avgX * avgX + avgY * avgY);

    // Micro-jitter variance
    let sumVariance = 0;
    for (let i = 0; i < samples.length; i++) {
      const dx = samples[i].x - avgX;
      const dy = samples[i].y - avgY;
      sumVariance += (dx * dx + dy * dy);
    }
    const microJitter = Math.sqrt(sumVariance / n);

    let grade = 'Grade A+ (Pristine)';
    let status = 'Pass';
    if (offsetDistance > 0.30) {
      grade = 'Grade F (Severe Hardware Drift)';
      status = 'Fail';
    } else if (offsetDistance > 0.15) {
      grade = 'Grade C (Moderate Drift - Calibration Recommended)';
      status = 'Warning';
    } else if (offsetDistance > 0.08) {
      grade = 'Grade B (Minor Drift - In-Game Deadzone Sufficient)';
      status = 'Acceptable';
    }

    return {
      restingX: parseFloat(avgX.toFixed(4)),
      restingY: parseFloat(avgY.toFixed(4)),
      offsetDistance: parseFloat(offsetDistance.toFixed(4)),
      microJitter: parseFloat(microJitter.toFixed(5)),
      maxExcursion: parseFloat(maxExcursion.toFixed(4)),
      grade,
      status
    };
  }

  /**
   * Applies custom inner/outer deadzones and non-linear response curves to an input coordinate.
   * @param {number} x Raw input X [-1, 1]
   * @param {number} y Raw input Y [-1, 1]
   * @param {number} innerDeadzone Inner threshold [0.0 - 0.5]
   * @param {number} outerDeadzone Outer threshold [0.8 - 1.0]
   * @param {string} curveType 'linear' | 'exponential' | 's-curve'
   */
  static applyDeadzoneAndCurve(x, y, innerDeadzone = 0.05, outerDeadzone = 1.0, curveType = 'linear') {
    const rawR = Math.sqrt(x * x + y * y);
    if (rawR <= innerDeadzone) {
      return { x: 0, y: 0, radius: 0 };
    }

    const angle = Math.atan2(y, x);
    // Normalize radius between inner and outer deadzone
    const normalizedR = Math.min(1.0, (rawR - innerDeadzone) / Math.max(0.001, outerDeadzone - innerDeadzone));

    let mappedR = normalizedR;
    if (curveType === 'exponential') {
      mappedR = Math.pow(normalizedR, 2.0); // quadratic response
    } else if (curveType === 's-curve') {
      // Smoothstep S-curve
      mappedR = normalizedR * normalizedR * (3 - 2 * normalizedR);
    }

    return {
      x: Math.cos(angle) * mappedR,
      y: Math.sin(angle) * mappedR,
      radius: mappedR
    };
  }
}

if (typeof window !== 'undefined') {
  window.AnalogMath = AnalogMath;
}
