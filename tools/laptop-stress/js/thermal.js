class ThermalMonitor {
  constructor() {
    this.history = [];
    this.monitoring = false;
    this.intervalId = null;
  }

  // Start monitoring
  start(onUpdate) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.monitoring = true;
    this.history = [];

    this.intervalId = setInterval(() => {
      if (!this.monitoring) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
        return;
      }

      // Simulate thermal reading (browser doesn't expose real temps)
      const temp = 45 + Math.random() * 40; // 45-85°C
      this.history.push({
        time: Date.now(),
        temp: temp,
        throttling: temp > 95
      });

      if (onUpdate) {
        onUpdate(temp);
      }
    }, 100);
  }

  // Stop monitoring
  stop() {
    this.monitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Get average temp
  getAverage() {
    if (this.history.length === 0) return 0;
    return this.history.reduce((a, b) => a + b.temp, 0) / this.history.length;
  }

  // Get max temp
  getMax() {
    if (this.history.length === 0) return 0;
    return Math.max(...this.history.map(h => h.temp));
  }

  // Check if throttling
  isThrottling() {
    return this.history.some(h => h.throttling);
  }
}

window.ThermalMonitor = ThermalMonitor;
