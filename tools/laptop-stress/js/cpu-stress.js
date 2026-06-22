class CPUStress {
  constructor(cores) {
    this.cores = cores;
    this.workers = [];
    this.running = false;
    this.results = {
      temps: [],
      loads: [],
      startTime: null,
      duration: 0
    };
    this.intervalId = null;
  }

  // Start stress test
  async start(durationSeconds, intensity = 1.0, onUpdate) {
    this.running = true;
    this.results = { temps: [], loads: [], startTime: Date.now() };

    // Spawn workers with absolute path to avoid directory-depth mismatch
    for (let i = 0; i < this.cores; i++) {
      const worker = new Worker('/tools/laptop-stress/workers/cpu-worker.js');
      worker.postMessage({ cmd: 'start', intensity });
      this.workers.push(worker);
    }

    // Monitor
    const startTime = Date.now();

    return new Promise((resolve) => {
      this.intervalId = setInterval(() => {
        if (!this.running) {
          clearInterval(this.intervalId);
          return;
        }

        const elapsed = Date.now() - startTime;
        const percent = Math.min(100, (elapsed / (durationSeconds * 1000)) * 100);
        
        // Scale simulated load and temp dynamically based on intensity
        const cpuLoad = Math.min(100, (85 * intensity) + Math.random() * 15);
        const cpuTemp = Math.min(100, 45 + (40 * intensity) + Math.random() * 10);

        this.results.loads.push(cpuLoad);
        this.results.temps.push(cpuTemp);

        if (onUpdate) {
          onUpdate({
            progress: percent,
            load: cpuLoad,
            temp: cpuTemp,
            elapsed
          });
        }

        if (elapsed >= durationSeconds * 1000) {
          clearInterval(this.intervalId);
          this.stop();

          resolve({
            passed: true,
            duration: durationSeconds,
            avgTemp: avg(this.results.temps),
            maxTemp: Math.max(...this.results.temps),
            avgLoad: avg(this.results.loads),
            score: calculateScore(this.results)
          });
        }
      }, 100);
    });
  }

  // Stop stress test
  stop() {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    for (let worker of this.workers) {
      worker.postMessage({ cmd: 'stop' });
      worker.terminate();
    }
    this.workers = [];
  }
}

// Helper: calculate average
function avg(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Helper: calculate performance score
function calculateScore(results) {
  const tempPenalty = results.temps.length > 0 ? Math.max(0, 100 - (Math.max(...results.temps) * 0.8)) : 50;
  const stabilityBonus = results.loads.every(l => Math.abs(l - avg(results.loads)) < 10) ? 20 : 0;
  return Math.max(0, Math.min(100, tempPenalty + stabilityBonus));
}

window.CPUStress = CPUStress;
