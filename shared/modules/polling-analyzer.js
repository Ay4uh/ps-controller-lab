/**
 * TechTest Polling Rate & Input Latency Analyzer
 * Computes report frequency (Hz), frame intervals, jitter standard deviation, and delivery variance.
 */

export class PollingAnalyzer {
  constructor(windowSize = 100) {
    this.windowSize = windowSize;
    this.timestamps = [];
    this.intervals = [];
    this.lastTimestamp = null;
  }

  reset() {
    this.timestamps = [];
    this.intervals = [];
    this.lastTimestamp = null;
  }

  /**
   * Records an input event occurrence.
   * @param {number} [timestamp] High resolution timestamp (performance.now())
   * @returns {Object} Current polling statistics
   */
  recordEvent(timestamp = performance.now()) {
    if (this.lastTimestamp !== null) {
      const dt = timestamp - this.lastTimestamp;
      if (dt > 0.05 && dt < 2000) { // filter duplicate re-entrancy and pause intervals
        this.intervals.push(dt);
        if (this.intervals.length > this.windowSize) {
          this.intervals.shift();
        }
      }
    }
    this.lastTimestamp = timestamp;

    return this.getStats();
  }

  /**
   * Computes statistics across the current rolling window.
   */
  getStats() {
    if (this.intervals.length < 5) {
      return {
        frequencyHz: 0,
        avgIntervalMs: 0,
        minIntervalMs: 0,
        maxIntervalMs: 0,
        jitterMs: 0,
        stabilityScore: 100,
        sampleCount: this.intervals.length
      };
    }

    let sum = 0;
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < this.intervals.length; i++) {
      const v = this.intervals[i];
      sum += v;
      if (v < min) min = v;
      if (v > max) max = v;
    }

    const n = this.intervals.length;
    const avg = sum / n;

    // Standard deviation (jitter)
    let varianceSum = 0;
    for (let i = 0; i < n; i++) {
      const diff = this.intervals[i] - avg;
      varianceSum += diff * diff;
    }
    const jitter = Math.sqrt(varianceSum / n);
    const frequencyHz = avg > 0 ? (1000 / avg) : 0;

    // Stability score 0-100% based on jitter relative to avg interval
    const stabilityScore = Math.max(0, Math.min(100, Math.round(100 - (jitter / avg) * 100)));

    return {
      frequencyHz: Math.round(frequencyHz),
      avgIntervalMs: parseFloat(avg.toFixed(2)),
      minIntervalMs: parseFloat(min.toFixed(2)),
      maxIntervalMs: parseFloat(max.toFixed(2)),
      jitterMs: parseFloat(jitter.toFixed(2)),
      stabilityScore,
      sampleCount: n
    };
  }
}

if (typeof window !== 'undefined') {
  window.PollingAnalyzer = PollingAnalyzer;
}
