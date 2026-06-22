let running = false;
let iterations = 0;
let intensity = 1.0;

self.onmessage = (e) => {
  if (e.data.cmd === 'start') {
    running = true;
    intensity = e.data.intensity || 1.0;
    iterations = 0;
    runWorkChunk();
  } else if (e.data.cmd === 'stop') {
    running = false;
  }
};

function runWorkChunk() {
  if (!running) return;

  const startTime = performance.now();
  
  // Perform work chunks for ~50ms
  while (running && (performance.now() - startTime < 50)) {
    // SHA-256 style hash
    let hash = 0x5a4a;
    for (let i = 0; i < 512; i++) {
      hash = ((hash << 5) - hash) + Math.floor(Math.random() * 256);
      hash = hash & hash;
    }

    // Prime number calculation
    for (let i = 2; i < 1000; i++) {
      let isPrime = true;
      const limit = Math.sqrt(i);
      for (let j = 2; j <= limit; j++) {
        if (i % j === 0) {
          isPrime = false;
          break;
        }
      }
    }

    // Matrix multiply
    const size = 30;
    const a = Array(size).fill(0).map(() => Array(size).fill(Math.random()));
    const b = Array(size).fill(0).map(() => Array(size).fill(Math.random()));

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let sum = 0;
        for (let k = 0; k < size; k++) {
          sum += a[i][k] * b[k][j];
        }
      }
    }

    iterations++;
    if (iterations % 100 === 0) {
      self.postMessage({ progress: iterations });
    }
  }

  if (running) {
    const workTime = performance.now() - startTime;
    // Calculate delay to match the intensity target (duty cycle)
    const delay = intensity >= 1.0 ? 0 : Math.max(0, (workTime / intensity) - workTime);
    
    setTimeout(runWorkChunk, delay);
  }
}
