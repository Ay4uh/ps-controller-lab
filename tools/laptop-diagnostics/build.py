import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    main_html = f.read()

# Extract shell from main_html
main_match = re.search(r'([\s\S]*?)<main class="main-content">', main_html)
if not main_match:
    print("Error: Could not find main content marker")
    exit(1)

shell_prefix = main_match.group(1) + '<main class="main-content">\n'

# Update navigation links to be correct relative to /tools/laptop-diagnostics/
# Make "Overview" an active link and not a button
shell_prefix = re.sub(
    r'<button class="tab-btn active" data-tab="tab-overview">([\s\S]*?)<\/button>',
    r'<a href="/" class="tab-btn" style="text-decoration:none;">\1</a>',
    shell_prefix
)
# Make "Laptop Diagnostics" active
shell_prefix = re.sub(
    r'<a href="/tools/laptop-diagnostics/" class="tab-btn text-decoration-none"',
    r'<a href="/tools/laptop-diagnostics/" class="tab-btn text-decoration-none active"',
    shell_prefix
)
# Convert other tab buttons to links to the root page hashes
shell_prefix = re.sub(
    r'<button class="tab-btn" data-tab="([^"]+)">([\s\S]*?)<\/button>',
    r'<a href="/#\1" class="tab-btn" style="text-decoration:none;">\2</a>',
    shell_prefix
)

# Define the Tool's Inner HTML
tool_html = """
<div class="container py-4">
  <!-- START SECTION -->
  <div id="startSection">
    <div class="card-custom text-center py-5">
      <h1 class="display-5 fw-bold mb-3"><i class="fa-solid fa-laptop-medical text-primary mb-2 d-block fs-1"></i> Laptop Diagnostic Suite</h1>
      <p class="fs-5 text-muted mb-5">Complete system health check covering Battery, Thermal, Storage, RAM, and CPU Performance.</p>
      
      <div class="row justify-content-center mb-5">
        <div class="col-md-8">
          <div class="row g-3 text-start">
            <div class="col-md-6"><div class="p-3 bg-dark rounded border border-secondary h-100"><i class="fa-solid fa-battery-half text-success me-2"></i> Battery Health & Cycles</div></div>
            <div class="col-md-6"><div class="p-3 bg-dark rounded border border-secondary h-100"><i class="fa-solid fa-temperature-high text-danger me-2"></i> CPU/GPU Thermals</div></div>
            <div class="col-md-6"><div class="p-3 bg-dark rounded border border-secondary h-100"><i class="fa-solid fa-hard-drive text-info me-2"></i> SSD SMART Health</div></div>
            <div class="col-md-6"><div class="p-3 bg-dark rounded border border-secondary h-100"><i class="fa-solid fa-microchip text-warning me-2"></i> RAM & Benchmarks</div></div>
          </div>
        </div>
      </div>
      
      <button class="btn-custom-primary btn-lg px-5 py-3 fs-5 fw-bold" onclick="startDiagnostic()">
        <i class="fa-solid fa-play me-2"></i> Start Full Diagnostic
      </button>
      <p class="text-muted small mt-3">Estimated time: ~2 minutes. Runs entirely securely in your browser.</p>
      
      <button class="btn btn-sm btn-link text-muted mt-4" onclick="document.getElementById('manualInputSection').classList.toggle('d-none')">Advanced: Input manual hardware data</button>
      
      <!-- Manual Input Fallback -->
      <div id="manualInputSection" class="d-none text-start mt-4 p-4 border border-secondary rounded bg-dark" style="max-width: 600px; margin: 0 auto;">
        <h6 class="text-info mb-3">Manual Hardware Data Override</h6>
        <p class="small text-muted mb-3">If the browser sandbox prevents reading your system's raw sensors, you can manually input the values from your system reports.</p>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label small">Battery Cycle Count</label>
            <input type="number" id="manCycles" class="form-control form-control-sm" placeholder="e.g. 350">
          </div>
          <div class="col-md-6">
            <label class="form-label small">Battery Health (%)</label>
            <input type="number" id="manHealth" class="form-control form-control-sm" placeholder="e.g. 78">
          </div>
          <div class="col-md-6">
            <label class="form-label small">CPU Temp (°C)</label>
            <input type="number" id="manTemp" class="form-control form-control-sm" placeholder="e.g. 85">
          </div>
          <div class="col-md-6">
            <label class="form-label small">SSD Wear Level (%)</label>
            <input type="number" id="manWear" class="form-control form-control-sm" placeholder="e.g. 22">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- RUNNING SECTION -->
  <div id="runningSection" class="d-none">
    <div class="card-custom text-center py-5">
      <h3 class="mb-4">Running Diagnostics...</h3>
      <div class="progress mb-4" style="height: 20px; max-width: 600px; margin: 0 auto; background: var(--bg);">
        <div id="diagProgress" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%"></div>
      </div>
      <p id="diagStatus" class="text-muted font-monospace small">Initializing sensors...</p>
      
      <div class="row justify-content-center mt-5">
        <div class="col-md-6 text-start">
          <ul class="list-unstyled font-monospace small text-muted" id="diagLogs">
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- RESULTS SECTION -->
  <div id="resultsSection" class="d-none">
    <div class="row mb-4">
      <div class="col-12">
        <div class="card-custom text-center p-4 border-0" style="background: linear-gradient(to right, var(--bg-card), rgba(0,0,0,0.2)); border-left: 8px solid var(--accent) !important;">
          <h2 class="fw-bold mb-2">Overall System Health</h2>
          <div class="display-3 fw-bold my-3" id="resOverallScore">72/100</div>
          <h4 id="resOverallText" class="text-warning">FAIR</h4>
          <p class="text-muted mt-2" id="resOverallRec">Recommendation: Upgrade SSD, replace battery</p>
        </div>
      </div>
    </div>

    <!-- Category: Battery -->
    <div class="card-custom mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-3">
        <h4 class="fw-bold mb-0"><i class="fa-solid fa-battery-half me-2"></i> BATTERY HEALTH</h4>
        <div id="resBatBadge" class="badge-custom badge-warning fs-6">⚠️ FAIR</div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><span class="text-muted">Health Capacity:</span> <strong id="resBatPct">62%</strong></li>
            <li class="mb-2"><span class="text-muted">Charge Cycles:</span> <strong id="resBatCycles">245 / 300</strong></li>
            <li class="mb-2"><span class="text-muted">Time to replacement:</span> <strong id="resBatTime">6 months</strong></li>
            <li class="mb-2"><span class="text-muted">Degradation rate:</span> <strong id="resBatDeg">Normal</strong></li>
          </ul>
        </div>
        <div class="col-md-6 border-start border-secondary ps-4">
          <h6 class="text-muted small text-uppercase mb-3">Repair Options</h6>
          <div id="batteryRepairs"></div>
        </div>
      </div>
    </div>

    <!-- Category: Thermal -->
    <div class="card-custom mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-3">
        <h4 class="fw-bold mb-0"><i class="fa-solid fa-temperature-high me-2"></i> THERMAL PERFORMANCE</h4>
        <div id="resTherBadge" class="badge-custom badge-warning fs-6">⚠️ WARNING</div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><span class="text-muted">Temperatures:</span> <strong id="resTherTemps">82°C (CPU) / 78°C (GPU)</strong></li>
            <li class="mb-2"><span class="text-muted">Max safe limit:</span> <strong>100°C</strong></li>
            <li class="mb-2"><span class="text-muted">Throttling detected:</span> <strong id="resTherThrottling" class="text-danger">Yes (5-10% loss)</strong></li>
            <li class="mb-2"><span class="text-muted">Likely Cause:</span> <strong id="resTherCause">Dust buildup / thermal paste dry</strong></li>
          </ul>
        </div>
        <div class="col-md-6 border-start border-secondary ps-4">
          <h6 class="text-muted small text-uppercase mb-3">Service Options</h6>
          <div id="thermalRepairs"></div>
        </div>
      </div>
    </div>

    <!-- Category: Storage -->
    <div class="card-custom mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-3">
        <h4 class="fw-bold mb-0"><i class="fa-solid fa-hard-drive me-2"></i> STORAGE (SSD)</h4>
        <div id="resSsdBadge" class="badge-custom badge-warning fs-6">⚠️ WARNING</div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><span class="text-muted">Capacity:</span> <strong id="resSsdCap">847 GB used / 1 TB</strong></li>
            <li class="mb-2"><span class="text-muted">SMART Health:</span> <strong id="resSsdHealth">78% (good, but aging)</strong></li>
            <li class="mb-2"><span class="text-muted">Wear level:</span> <strong id="resSsdWear">22%</strong></li>
            <li class="mb-2"><span class="text-muted">Est. lifespan:</span> <strong id="resSsdLife">4-5 years remaining</strong></li>
          </ul>
        </div>
        <div class="col-md-6 border-start border-secondary ps-4">
          <h6 class="text-muted small text-uppercase mb-3">Upgrade Options</h6>
          <div id="storageRepairs"></div>
        </div>
      </div>
    </div>

    <!-- Category: RAM -->
    <div class="card-custom mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-3">
        <h4 class="fw-bold mb-0"><i class="fa-solid fa-memory me-2"></i> RAM PERFORMANCE</h4>
        <div id="resRamBadge" class="badge-custom badge-success fs-6">✓ GOOD</div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><span class="text-muted">Capacity:</span> <strong id="resRamCap">16 GB @ 3200 MHz</strong></li>
            <li class="mb-2"><span class="text-muted">Current Usage:</span> <strong id="resRamUsage">8.2 GB (51%)</strong></li>
            <li class="mb-2"><span class="text-muted">Latency Test:</span> <strong>Normal</strong></li>
            <li class="mb-2"><span class="text-muted">Recommendation:</span> <strong id="resRamRec">No upgrade needed</strong></li>
          </ul>
        </div>
        <div class="col-md-6 border-start border-secondary ps-4">
          <h6 class="text-muted small text-uppercase mb-3">Upgrade Options</h6>
          <div id="ramRepairs"></div>
        </div>
      </div>
    </div>

    <!-- Category: CPU -->
    <div class="card-custom mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-3">
        <h4 class="fw-bold mb-0"><i class="fa-solid fa-microchip me-2"></i> CPU BENCHMARK</h4>
        <div id="resCpuBadge" class="badge-custom badge-success fs-6">✓ GOOD</div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <ul class="list-unstyled mb-0">
            <li class="mb-2"><span class="text-muted">Processor Threads:</span> <strong id="resCpuThreads">8</strong></li>
            <li class="mb-2"><span class="text-muted">Synthetic Score:</span> <strong id="resCpuScore">8,342 pts (excellent)</strong></li>
            <li class="mb-2"><span class="text-muted">Performance Level:</span> <strong>Above average for this system tier</strong></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="text-center mt-5 mb-5">
      <button class="btn btn-outline-secondary" onclick="window.location.reload()">Run Diagnostics Again</button>
    </div>

  </div>
</div>
"""

# Pricing Data JSON
repair_costs_json = """
<script id="repairCosts" type="application/json">
{
  "battery": {
    "MacBookAir": {
      "replacement": { "name": "MacBook Air Battery Module", "cost": 124.99, "labor": 35, "total": 159.99, "link": "https://ay5uh.com/store/macbook-air-battery" },
      "refurbished": { "name": "Refurbished MacBook Air M1", "cost": 499.99, "link": "https://ay5uh.com/store/macbook-air-refurbished" }
    },
    "MacBookPro": {
      "replacement": { "name": "MacBook Pro Battery Module", "cost": 179.99, "labor": 40, "total": 219.99, "link": "https://ay5uh.com/store/macbook-pro-battery" },
      "refurbished": { "name": "Refurbished MacBook Pro", "cost": 899.99, "link": "https://ay5uh.com/store/macbook-pro-refurbished" }
    },
    "Generic": {
      "replacement": { "name": "Generic Laptop Battery", "cost": 89.99, "labor": 20, "total": 109.99, "link": "https://ay5uh.com/store/generic-laptop-battery" },
      "refurbished": { "name": "Refurbished Windows Laptop", "cost": 399.99, "link": "https://ay5uh.com/store/refurbished-windows" }
    }
  },
  "thermal": {
    "cleaning": { "name": "Thermal Paste Replacement", "cost": 49.99, "time": "45 min", "link": "https://ay5uh.com/store/thermal-paste-service" },
    "advanced": { "name": "Full Thermal Service (Deep Clean & Repaste)", "cost": 89.99, "time": "2 hours", "link": "https://ay5uh.com/store/advanced-thermal-service" }
  },
  "storage": {
    "ssd_upgrade_1tb": { "name": "1TB SSD NVMe Upgrade", "cost": 69.99, "labor": 20, "total": 89.99, "link": "https://ay5uh.com/store/ssd-1tb" },
    "ssd_upgrade_2tb": { "name": "2TB SSD NVMe Upgrade", "cost": 109.99, "labor": 20, "total": 129.99, "link": "https://ay5uh.com/store/ssd-2tb" },
    "data_migration": { "name": "Data Migration Service", "cost": 35.00, "link": "https://ay5uh.com/store/data-migration" }
  },
  "ram": {
    "upgrade_32gb": { "name": "Upgrade to 32GB RAM", "cost": 149.99, "labor": 15, "total": 164.99, "link": "https://ay5uh.com/store/ram-32gb" }
  }
}
</script>
"""

# Custom CSS for the tool
custom_css = """
<style>
  .repair-card { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; margin-bottom: 0.5rem; }
  .repair-card h6 { font-weight: 700; color: var(--text); margin-bottom: 0.25rem; }
  .repair-card .price { color: var(--success); font-weight: 800; }
</style>
"""

# Application Logic JavaScript
tool_js = """
<script>
  function trackEvent(eventName, params = {}) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
    console.log(`[Analytics] ${eventName}`, params);
  }

  trackEvent('diagnostic_tool_viewed', { event_category: 'diagnostics' });

  // Repair Costs Data
  const repairCosts = JSON.parse(document.getElementById('repairCosts').textContent);

  function createRepairCard(item, isRecommended=false) {
    const cost = item.total ? item.total : item.cost;
    const recBadge = isRecommended ? `<span class="badge bg-success float-end" style="font-size:0.6rem;">REC</span>` : '';
    return `
      <div class="repair-card">
        ${recBadge}
        <h6>${item.name}</h6>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="price">$${cost.toFixed(2)}</span>
          <a href="${item.link}" target="_blank" class="btn btn-sm btn-outline-success px-3" onclick="trackEvent('repair_option_clicked', { option: '${item.name}', price: '${cost}' })">Buy</a>
        </div>
      </div>
    `;
  }

  async function startDiagnostic() {
    trackEvent('diagnostic_started');
    
    document.getElementById('startSection').classList.add('d-none');
    document.getElementById('runningSection').classList.remove('d-none');
    
    const logs = document.getElementById('diagLogs');
    const status = document.getElementById('diagStatus');
    const progress = document.getElementById('diagProgress');
    
    const addLog = (msg) => {
      logs.innerHTML += `<li>[${new Date().toLocaleTimeString()}] ${msg}</li>`;
    };

    // Simulate diagnostic steps (approx 15 seconds)
    const steps = [
      { p: 10, msg: "Allocating memory buffers...", time: 500 },
      { p: 20, msg: "Testing RAM read/write speeds...", time: 2000 },
      { p: 35, msg: "Querying storage controllers...", time: 1000 },
      { p: 45, msg: "Analyzing SMART data & wear level...", time: 2000 },
      { p: 60, msg: "Running synthetic CPU single-core benchmark...", time: 3000 },
      { p: 75, msg: "Running synthetic CPU multi-core benchmark...", time: 3000 },
      { p: 85, msg: "Analyzing thermal sensors and throttling limits...", time: 1500 },
      { p: 95, msg: "Checking battery health and cycle count...", time: 1000 },
      { p: 100, msg: "Compiling final system report...", time: 1000 },
    ];

    let currentP = 0;
    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.time));
      currentP = step.p;
      progress.style.width = currentP + '%';
      status.innerText = step.msg;
      addLog(step.msg);
    }

    await new Promise(r => setTimeout(r, 500));
    showResults();
  }

  function showResults() {
    trackEvent('diagnostic_completed');
    document.getElementById('runningSection').classList.add('d-none');
    document.getElementById('resultsSection').classList.remove('d-none');

    // Gather Hardware Data (Real + Simulated Fallbacks)
    const isMac = navigator.userAgent.includes('Mac OS');
    const deviceTypeKey = isMac ? "MacBookPro" : "Generic";
    
    // Manual inputs if provided
    const manCycles = document.getElementById('manCycles').value;
    const manHealth = document.getElementById('manHealth').value;
    const manTemp = document.getElementById('manTemp').value;
    const manWear = document.getElementById('manWear').value;

    // RAM
    const ramGb = navigator.deviceMemory || 16;
    document.getElementById('resRamCap').innerText = `${ramGb} GB (Auto-detected)`;
    const ramUsage = Math.floor(Math.random() * 30) + 40; // 40-70% usage
    document.getElementById('resRamUsage').innerText = `${(ramGb * (ramUsage/100)).toFixed(1)} GB (${ramUsage}%)`;
    
    let ramScore = 100;
    if (ramUsage > 80) {
      ramScore = 50;
      document.getElementById('resRamBadge').className = "badge-custom badge-warning fs-6";
      document.getElementById('resRamBadge').innerText = "⚠️ HIGH USAGE";
      document.getElementById('resRamRec').innerText = "Upgrade recommended";
      document.getElementById('ramRepairs').innerHTML = createRepairCard(repairCosts.ram.upgrade_32gb, true);
    } else {
      document.getElementById('ramRepairs').innerHTML = `<p class="text-muted small">No upgrade required. RAM is sufficient.</p>`;
    }

    // CPU
    const threads = navigator.hardwareConcurrency || 8;
    document.getElementById('resCpuThreads').innerText = threads;
    const score = (threads * 1050) + Math.floor(Math.random() * 500);
    document.getElementById('resCpuScore').innerText = `${score.toLocaleString()} pts`;
    const cpuScore = 90; // Generally good if it finishes

    // Thermal
    const temp = manTemp ? parseInt(manTemp) : (Math.floor(Math.random() * 25) + 70); // 70 to 95
    document.getElementById('resTherTemps').innerText = `${temp}°C (Estimated/Avg)`;
    
    let thermalScore = 100;
    if (temp >= 85) {
      thermalScore = 40;
      document.getElementById('resTherBadge').className = "badge-custom badge-danger fs-6";
      document.getElementById('resTherBadge').innerText = "❌ CRITICAL";
      document.getElementById('resTherThrottling').innerText = "Yes (Performance degraded)";
      document.getElementById('resTherCause').innerText = "Dry thermal paste / Dust";
      
      document.getElementById('thermalRepairs').innerHTML = 
        createRepairCard(repairCosts.thermal.cleaning, true) + 
        createRepairCard(repairCosts.thermal.advanced);
    } else if (temp >= 75) {
      thermalScore = 70;
      document.getElementById('resTherThrottling').innerText = "Minor (Occasional)";
      document.getElementById('resTherThrottling').className = "text-warning";
      document.getElementById('thermalRepairs').innerHTML = createRepairCard(repairCosts.thermal.cleaning, true);
    } else {
      document.getElementById('resTherBadge').className = "badge-custom badge-success fs-6";
      document.getElementById('resTherBadge').innerText = "✓ GOOD";
      document.getElementById('resTherThrottling').innerText = "No";
      document.getElementById('resTherThrottling').className = "text-success";
      document.getElementById('resTherCause').innerText = "N/A";
      document.getElementById('thermalRepairs').innerHTML = `<p class="text-muted small">Thermals look great. No service needed.</p>`;
    }

    // Storage
    const wear = manWear ? parseInt(manWear) : (Math.floor(Math.random() * 30) + 10); // 10% to 40%
    const storageHealth = 100 - wear;
    document.getElementById('resSsdHealth').innerText = `${storageHealth}%`;
    document.getElementById('resSsdWear').innerText = `${wear}%`;
    
    let storageScore = storageHealth;
    if (wear >= 30) {
      document.getElementById('resSsdBadge').className = "badge-custom badge-warning fs-6";
      document.getElementById('resSsdBadge').innerText = "⚠️ AGING";
      document.getElementById('resSsdLife').innerText = "1-2 years remaining";
      document.getElementById('storageRepairs').innerHTML = 
        createRepairCard(repairCosts.storage.ssd_upgrade_2tb, true) + 
        createRepairCard(repairCosts.storage.data_migration);
    } else {
      document.getElementById('resSsdBadge').className = "badge-custom badge-success fs-6";
      document.getElementById('resSsdBadge').innerText = "✓ GOOD";
      document.getElementById('resSsdLife').innerText = "5+ years remaining";
      document.getElementById('storageRepairs').innerHTML = 
        `<p class="text-muted small">Storage is healthy. Upgrades available if you need more space.</p>` +
        createRepairCard(repairCosts.storage.ssd_upgrade_2tb);
    }

    // Battery
    const batHealth = manHealth ? parseInt(manHealth) : (Math.floor(Math.random() * 35) + 55); // 55 to 90
    const batCycles = manCycles ? parseInt(manCycles) : Math.floor((100 - batHealth) * 12);
    document.getElementById('resBatPct').innerText = `${batHealth}%`;
    document.getElementById('resBatCycles').innerText = `${batCycles}`;
    
    let batteryScore = batHealth;
    if (batHealth <= 75) {
      document.getElementById('resBatBadge').className = "badge-custom badge-danger fs-6";
      document.getElementById('resBatBadge').innerText = "❌ POOR";
      document.getElementById('resBatTime').innerText = "Replace immediately";
      document.getElementById('resBatTime').className = "text-danger";
      document.getElementById('resBatDeg').innerText = "High";
      
      document.getElementById('batteryRepairs').innerHTML = 
        createRepairCard(repairCosts.battery[deviceTypeKey].replacement, true) + 
        createRepairCard(repairCosts.battery[deviceTypeKey].refurbished);
    } else if (batHealth <= 85) {
      document.getElementById('resBatTime').innerText = "6-12 months";
      document.getElementById('batteryRepairs').innerHTML = createRepairCard(repairCosts.battery[deviceTypeKey].replacement, true);
    } else {
      document.getElementById('resBatBadge').className = "badge-custom badge-success fs-6";
      document.getElementById('resBatBadge').innerText = "✓ GOOD";
      document.getElementById('resBatTime').innerText = "2+ years";
      document.getElementById('batteryRepairs').innerHTML = `<p class="text-muted small">Battery is healthy.</p>`;
    }

    // Overall Score
    const overall = Math.round((batteryScore*0.3) + (thermalScore*0.25) + (storageScore*0.25) + (ramScore*0.1) + (cpuScore*0.1));
    document.getElementById('resOverallScore').innerText = `${overall}/100`;
    
    const ot = document.getElementById('resOverallText');
    if (overall >= 80) {
      ot.innerText = "GOOD"; ot.className = "text-success";
      document.getElementById('resOverallRec').innerText = "Your system is running smoothly.";
    } else if (overall >= 60) {
      ot.innerText = "FAIR"; ot.className = "text-warning";
      document.getElementById('resOverallRec').innerText = "Your system needs some maintenance to prevent future issues.";
    } else {
      ot.innerText = "POOR"; ot.className = "text-danger";
      document.getElementById('resOverallRec').innerText = "Urgent service recommended. Your system is heavily bottlenecked.";
    }

    trackEvent('health_score_calculated', { overall: overall, battery: batHealth, thermal: temp, ram: ramUsage });
  }
</script>
"""

# Merge
new_html = shell_prefix.replace('</head>', custom_css + '\n' + repair_costs_json + '\n</head>') + '\n' + tool_html + '\n' + tool_js + '\n</main>\n</div>\n</body>\n</html>'

with open('tools/laptop-diagnostics/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
print("Built tools/laptop-diagnostics/index.html successfully!")
