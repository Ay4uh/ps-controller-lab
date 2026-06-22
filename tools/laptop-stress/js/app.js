class StressTestApp {
  constructor() {
    this.cpuInfo = null;
    this.gpuInfo = null;
    this.thermalMonitor = null;
    
    this.cpuStress = null;
    this.gpuStress = null;
    this.report = null;
    
    // Config state
    this.duration = 60; // default 60s
    this.intensity = 1.0; // default 1.0 (Maximum)
    
    // Telemetry history for chart (last 50 points)
    this.telemetryHistory = [];
    this.maxChartPoints = 60;
  }

  // Initialize
  async init() {
    console.log('Initializing Stress Test App...');

    // Detect hardware
    this.cpuInfo = getCPUInfo();
    this.gpuInfo = getGPUInfo();
    this.thermalMonitor = new ThermalMonitor();

    // Populate UI
    this.displayHardwareInfo();
    this.setupConfigControls();
    this.resetTelemetryGauges();
    this.drawChartBackground();

    // Setup action button
    const actionBtn = document.getElementById('btnAction');
    actionBtn.addEventListener('click', () => this.handleActionClick());
  }

  displayHardwareInfo() {
    document.getElementById('hw-cpu-cores').textContent = `${this.cpuInfo.cores} Cores / ${this.cpuInfo.threads} Threads`;
    document.getElementById('hw-cpu-ram').textContent = `${this.cpuInfo.ram} GB`;
    document.getElementById('hw-cpu-type').textContent = this.cpuInfo.type === 'high-end' ? 'High-Performance' : 'Standard-Range';
    
    const gpuName = this.gpuInfo.model.replace(/ANGLE \(([^)]+)\)/, '$1');
    document.getElementById('hw-gpu-model').textContent = gpuName;
    document.getElementById('hw-gpu-vram').textContent = this.gpuInfo.vram > 0 ? `${this.gpuInfo.vram} MB` : 'Dynamic';
    document.getElementById('hw-gpu-type').textContent = this.gpuInfo.type === 'discrete' ? 'Discrete GPU' : 'Integrated graphics';
  }

  setupConfigControls() {
    // Duration selectors
    const durationPills = document.querySelectorAll('.duration-pill');
    durationPills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (this.cpuStress?.running || this.gpuStress?.running) return;
        durationPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.duration = parseInt(pill.dataset.val, 10);
      });
    });

    // Intensity selectors
    const intensityPills = document.querySelectorAll('.intensity-pill');
    intensityPills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (this.cpuStress?.running || this.gpuStress?.running) return;
        intensityPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.intensity = parseFloat(pill.dataset.val);
      });
    });
  }

  resetTelemetryGauges() {
    this.updateGauge('cpu', 0, '%');
    this.updateGauge('temp', 0, '°C');
    this.updateGauge('gpu', 0, 'FPS');
  }

  updateGauge(type, val, unit) {
    const fillEl = document.getElementById(`${type}-gauge-fill`);
    const valEl = document.getElementById(`${type}-gauge-val`);
    if (!fillEl || !valEl) return;

    // Clamp value
    const maxVal = type === 'temp' ? 100 : (type === 'gpu' ? 120 : 100);
    const clampedVal = Math.max(0, Math.min(maxVal, val));

    // Gauge circle length: 2 * PI * r = 2 * 3.1416 * 50 = 314.16
    const circumference = 314.16;
    const offset = circumference - (clampedVal / maxVal) * circumference;
    
    fillEl.style.strokeDashoffset = offset;
    valEl.textContent = `${Math.round(val)}${unit}`;
  }

  // Draw background grids for SVG chart
  drawChartBackground() {
    const svg = document.getElementById('chartSvg');
    if (!svg) return;
    
    // Clear old lines
    const grids = svg.querySelectorAll('.chart-grid-line');
    grids.forEach(g => g.remove());

    const width = svg.clientWidth || 400;
    const height = svg.clientHeight || 150;

    // Draw horizontal grid lines (0%, 25%, 50%, 75%, 100%)
    for (let i = 0; i <= 4; i++) {
      const y = (i * height) / 4;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'chart-grid-line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', y.toString());
      line.setAttribute('x2', '100%');
      line.setAttribute('y2', y.toString());
      svg.appendChild(line);
    }
  }

  // Plot new point on the SVG chart
  pushTelemetryPoint(cpuLoad, cpuTemp) {
    this.telemetryHistory.push({ load: cpuLoad, temp: cpuTemp });
    if (this.telemetryHistory.length > this.maxChartPoints) {
      this.telemetryHistory.shift();
    }
    this.renderChartPaths();
  }

  renderChartPaths() {
    const svg = document.getElementById('chartSvg');
    const cpuPathEl = document.getElementById('cpuPath');
    const tempPathEl = document.getElementById('tempPath');
    if (!svg || !cpuPathEl || !tempPathEl || this.telemetryHistory.length === 0) return;

    const width = svg.clientWidth || 450;
    const height = svg.clientHeight || 168;

    let cpuPoints = [];
    let tempPoints = [];

    const totalPoints = this.telemetryHistory.length;
    this.telemetryHistory.forEach((pt, index) => {
      // Calculate X coordinate
      const x = totalPoints > 1 ? (index / (totalPoints - 1)) * width : 0;
      
      // Calculate Y coordinates (0-100 scale)
      const cpuY = height - (pt.load / 100) * height;
      const tempY = height - (pt.temp / 100) * height;

      cpuPoints.push(`${x.toFixed(1)},${cpuY.toFixed(1)}`);
      tempPoints.push(`${x.toFixed(1)},${tempY.toFixed(1)}`);
    });

    cpuPathEl.setAttribute('d', `M ${cpuPoints.join(' L ')}`);
    tempPathEl.setAttribute('d', `M ${tempPoints.join(' L ')}`);
  }

  setUIState(running, phaseText = '') {
    const actionBtn = document.getElementById('btnAction');
    const statusText = document.getElementById('statusText');
    const statusBox = document.getElementById('statusIndicator');
    const configPills = document.querySelectorAll('.btn-pill');

    if (running) {
      actionBtn.className = 'btn-action btn-stop';
      actionBtn.innerHTML = '<i class="fa-solid fa-square"></i> Stop Stress Test';
      statusBox.classList.add('status-active');
      statusText.textContent = phaseText;
      configPills.forEach(p => p.setAttribute('disabled', 'true'));
    } else {
      actionBtn.className = 'btn-action btn-start';
      actionBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run All stress Tests';
      statusBox.classList.remove('status-active');
      statusText.textContent = 'System Idle';
      configPills.forEach(p => p.removeAttribute('disabled'));
    }
  }

  async handleActionClick() {
    if (this.cpuStress?.running || this.gpuStress?.running) {
      // User requested abort
      this.abortTests();
    } else {
      // Start stress tests sequence
      this.runAllTests();
    }
  }

  abortTests() {
    console.log('Stress testing aborted by user.');
    if (this.cpuStress) this.cpuStress.stop();
    if (this.gpuStress) this.gpuStress.stop();
    if (this.thermalMonitor) this.thermalMonitor.stop();
    
    this.setUIState(false);
    this.resetTelemetryGauges();
    
    const resultsBox = document.getElementById('resultsBox');
    resultsBox.style.display = 'block';
    resultsBox.innerHTML = `
      <h3 style="margin-top: 0; color: #ef4444; font-size: 16px;"><i class="fa-solid fa-circle-xmark"></i> Test Cancelled</h3>
      <p style="font-size: 13px; color: var(--text-secondary); margin: 4px 0 0 0;">The hardware stress test was stopped before completion. No report was generated.</p>
    `;
    document.getElementById('exportBox').style.display = 'none';
  }

  // Run sequential tests
  async runAllTests() {
    this.telemetryHistory = [];
    document.getElementById('resultsBox').style.display = 'none';
    document.getElementById('exportBox').style.display = 'none';
    this.report = null;

    // --- Phase 1: CPU Stress ---
    this.setUIState(true, 'Stressing CPU...');
    this.cpuStress = new CPUStress(this.cpuInfo.cores);
    
    // Start thermal monitor
    this.thermalMonitor.start((temp) => {
      // Sync temp gauge
      this.updateGauge('temp', temp, '°C');
    });

    let cpuResult;
    try {
      cpuResult = await this.cpuStress.start(this.duration, this.intensity, (data) => {
        document.getElementById('progressText').textContent = `Running CPU Stress... ${data.progress.toFixed(0)}%`;
        
        // Sync gauges
        this.updateGauge('cpu', data.load, '%');
        
        // Push to telemetry plot
        this.pushTelemetryPoint(data.load, data.temp);
      });
    } catch (err) {
      console.error(err);
      this.abortTests();
      return;
    }

    if (!this.cpuStress.running) return; // aborted

    // Stop CPU stress workers
    this.cpuStress.stop();
    this.updateGauge('cpu', 0, '%');

    // --- Phase 2: GPU Stress ---
    this.setUIState(true, 'Stressing GPU...');
    this.gpuStress = new GPUStress();

    let gpuResult;
    try {
      gpuResult = await this.gpuStress.start(this.duration, (data) => {
        document.getElementById('progressText').textContent = `Running GPU Stress... ${data.progress.toFixed(0)}%`;
        
        // Sync gauges
        this.updateGauge('gpu', data.fps, 'FPS');
        
        // GPU load is high during rendering
        const simLoad = 90 + Math.random() * 10;
        const currentTemp = this.thermalMonitor.getMax(); // fetch latest max temperature from thermal monitor
        
        this.updateGauge('cpu', simLoad, '%');
        this.pushTelemetryPoint(simLoad, currentTemp);
      });
    } catch (err) {
      console.error(err);
      this.abortTests();
      return;
    }

    // Stop thermal monitor
    this.thermalMonitor.stop();
    this.setUIState(false);
    this.resetTelemetryGauges();

    // --- Phase 3: Report & Display ---
    this.report = new Report(cpuResult, gpuResult, this.thermalMonitor);
    const summary = this.report.generate();
    this.displayResults(summary);
  }

  // Render results
  displayResults(summary) {
    const resultsBox = document.getElementById('resultsBox');
    resultsBox.style.display = 'block';

    const resultColor = summary.overall.passed ? '#10b981' : '#ef4444';
    const resultIcon = summary.overall.passed ? 'fa-circle-check' : 'fa-circle-exclamation';

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: var(--text-primary);">Test Complete</h3>
        <span style="color: ${resultColor}; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; text-transform: uppercase;">
          <i class="fa-solid ${resultIcon}"></i> ${summary.overall.passed ? 'PASSED' : 'STRESS DETECTED'}
        </span>
      </div>
      
      <div class="results-grid">
        <div class="results-card">
          <div class="results-card-label">Overall Score</div>
          <div class="results-card-value" style="color: #3b82f6;">${summary.overall.score}/100</div>
        </div>
        <div class="results-card">
          <div class="results-card-label">CPU Score</div>
          <div class="results-card-value">${summary.cpu.score}/100</div>
        </div>
        <div class="results-card">
          <div class="results-card-label">GPU Score</div>
          <div class="results-card-value">${summary.gpu.score}/100</div>
        </div>
        <div class="results-card">
          <div class="results-card-label">Max Temp</div>
          <div class="results-card-value" style="color: ${summary.thermal.maxTemp > 85 ? '#ef4444' : 'var(--text-primary)'};">
            ${summary.thermal.maxTemp.toFixed(1)}°C
          </div>
        </div>
      </div>
    `;

    if (summary.issues.length > 0) {
      html += `
        <div class="issues-title">
          <i class="fa-solid fa-triangle-exclamation"></i> Optimization Issues Detected
        </div>
        <ul class="issues-list">
          ${summary.issues.map(issue => `<li>${issue}</li>`).join('')}
        </ul>
      `;
    } else {
      html += `
        <div style="margin-top: 14px; color: #10b981; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-shield-halved"></i> Thermal status stable. Cooling system functioning normally.
        </div>
      `;
    }

    resultsBox.innerHTML = html;

    // Enable download buttons
    document.getElementById('exportBox').style.display = 'block';
  }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
  const app = new StressTestApp();
  app.init();

  // Export events
  document.getElementById('btnExportJson').addEventListener('click', () => {
    if (app.report) app.report.download('json');
  });
  document.getElementById('btnExportCsv').addEventListener('click', () => {
    if (app.report) app.report.download('csv');
  });
  
  // Handle resize events to redraw grid backgrounds
  window.addEventListener('resize', () => {
    app.drawChartBackground();
    app.renderChartPaths();
  });
});
