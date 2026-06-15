// phone-diagnostics/app.js

const State = {
  tests: [],
  score: 0,
  isRunningAll: false,
  currentTestIndex: -1,
};

const TestDefinitions = [
  // DISPLAY & TOUCH
  {
    id: 'deadPixel',
    category: 'Display & Touch',
    title: 'Dead Pixel Test',
    desc: 'Cycle through solid colors to spot dead pixels.',
    icon: 'fa-solid fa-palette',
    run: async () => runDeadPixelTest()
  },
  {
    id: 'touchResponse',
    category: 'Display & Touch',
    title: 'Touch Screen Draw',
    desc: 'Draw on the screen to verify all zones register touch.',
    icon: 'fa-solid fa-hand-pointer',
    run: async () => runTouchDrawTest()
  },
  {
    id: 'multiTouch',
    category: 'Display & Touch',
    title: 'Multi-Touch Test',
    desc: 'Place multiple fingers on the screen simultaneously.',
    icon: 'fa-solid fa-hands',
    run: async () => runMultiTouchTest()
  },
  
  // AUDIO
  {
    id: 'speakerSweep',
    category: 'Audio',
    title: 'Speaker Freq Sweep',
    desc: 'Play a tone sweeping from low bass to high treble.',
    icon: 'fa-solid fa-volume-high',
    run: async () => runFrequencySweep()
  },
  {
    id: 'micTest',
    category: 'Audio',
    title: 'Microphone Test',
    desc: 'Record a short audio clip and play it back.',
    icon: 'fa-solid fa-microphone',
    run: async () => runMicTest()
  },

  // CAMERA
  {
    id: 'cameraFront',
    category: 'Camera',
    title: 'Front Camera Preview',
    desc: 'Verify the front selfie camera works.',
    icon: 'fa-solid fa-camera-rotate',
    run: async () => runCameraTest('user')
  },
  {
    id: 'cameraRear',
    category: 'Camera',
    title: 'Rear Camera Preview',
    desc: 'Verify the main rear camera works.',
    icon: 'fa-solid fa-camera',
    run: async () => runCameraTest('environment')
  },

  // SENSORS
  {
    id: 'accelerometer',
    category: 'Sensors',
    title: 'Accelerometer & Gyro',
    desc: 'Test device motion and orientation sensors.',
    icon: 'fa-solid fa-compass',
    run: async () => runMotionTest()
  },

  // CONNECTIVITY
  {
    id: 'gps',
    category: 'Connectivity',
    title: 'GPS / Location',
    desc: 'Check if device can lock onto GPS coordinates.',
    icon: 'fa-solid fa-location-dot',
    run: async () => runGpsTest()
  },

  // PERFORMANCE
  {
    id: 'performance',
    category: 'Performance',
    title: 'CPU & RAM Check',
    desc: 'Run a math benchmark and check memory limits.',
    icon: 'fa-solid fa-microchip',
    run: async () => runPerformanceTest()
  },

  // VIBRATION
  {
    id: 'vibration',
    category: 'Hardware',
    title: 'Vibration Motor',
    desc: 'Trigger the haptic feedback motor.',
    icon: 'fa-solid fa-mobile-button',
    run: async () => runVibrationTest()
  }
];

function detectDevice() {
  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  let model = 'Unknown Device';
  
  if (/android/i.test(ua)) {
    os = 'Android';
    const match = ua.match(/\bAndroid[^;]*;(.*?)(Build|;)/);
    if (match && match[1]) model = match[1].trim();
  } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    os = 'iOS';
    model = /iPad/.test(ua) ? 'iPad' : 'iPhone';
  }

  const res = `${window.screen.width}x${window.screen.height}`;
  
  document.getElementById('deviceInfoBanner').innerHTML = `
    <span><i class="fa-solid fa-mobile"></i> ${model}</span>
    <span><i class="fa-solid fa-gear"></i> ${os}</span>
    <span><i class="fa-solid fa-expand"></i> ${res} px</span>
  `;
}

function initUI() {
  const container = document.getElementById('testsContainer');
  container.innerHTML = '';

  TestDefinitions.forEach(test => {
    State.tests.push({ ...test, status: 'untested' });
    
    const card = document.createElement('div');
    card.className = 'test-card';
    card.id = `card-${test.id}`;
    
    card.innerHTML = `
      <div class="test-card-header">
        <i class="${test.icon} test-icon"></i>
        <h3 class="test-title">${test.title}</h3>
        <span class="test-status-badge status-untested" id="badge-${test.id}">UNTESTED</span>
      </div>
      <p class="test-desc">${test.desc}</p>
      <div class="test-controls">
        <button class="btn btn-run" onclick="startSingleTest('${test.id}')">Run Test</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateScore() {
  const total = State.tests.length;
  const passed = State.tests.filter(t => t.status === 'pass').length;
  const failed = State.tests.filter(t => t.status === 'fail').length;
  const warning = State.tests.filter(t => t.status === 'warning').length;
  
  let score = 0;
  if (total > 0) {
    // 100% base, subtract 10 for fail, 5 for warning
    const penalty = (failed * 100 / total) + (warning * 50 / total);
    score = Math.max(0, 100 - penalty);
    if (passed === 0 && failed === 0 && warning === 0) score = 0;
  }
  
  const scoreEl = document.getElementById('healthScoreValue');
  scoreEl.innerText = passed === 0 && failed === 0 ? '--' : Math.round(score);
}

function updateBadge(id, status) {
  const test = State.tests.find(t => t.id === id);
  if (test) test.status = status;
  
  const badge = document.getElementById(`badge-${id}`);
  badge.className = `test-status-badge status-${status}`;
  badge.innerText = status.toUpperCase();
  updateScore();
}

async function startSingleTest(id) {
  const test = State.tests.find(t => t.id === id);
  if (!test) return;
  
  updateBadge(id, 'running');
  
  try {
    const result = await test.run();
    updateBadge(id, result || 'pass');
  } catch (e) {
    console.error(e);
    updateBadge(id, 'fail');
    alert('Test Error: ' + e.message);
  }
}

document.getElementById('btnRunAll').addEventListener('click', async () => {
  if (State.isRunningAll) return;
  State.isRunningAll = true;
  document.getElementById('btnRunAll').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...';
  
  for (const test of State.tests) {
    await startSingleTest(test.id);
  }
  
  State.isRunningAll = false;
  document.getElementById('btnRunAll').innerHTML = '<i class="fa-solid fa-play"></i> Run All Tests';
  alert('All tests completed!');
});

// ==========================================
// TEST IMPLEMENTATIONS (STUBS FOR NOW)
// ==========================================

const overlay = document.getElementById('testOverlay');
const overlayContent = document.getElementById('overlayContent');
const overlayTitle = document.getElementById('overlayTitle');

function showOverlay(title) {
  overlayTitle.innerText = title;
  overlayContent.innerHTML = '';
  overlay.classList.remove('hidden');
}
function hideOverlay() {
  overlay.classList.add('hidden');
  overlayContent.innerHTML = '';
}

document.getElementById('btnCancelTest').addEventListener('click', hideOverlay);

function promptPassFail(resolve, customHtml = '') {
  overlayContent.innerHTML = `
    ${customHtml}
    <div class="results-modal">
      <h3>Did this test pass?</h3>
      <p>Please manually confirm if the hardware behaved as expected.</p>
      <div class="test-pass-fail-btns">
        <button class="btn btn-primary" id="btnOverlayPass">Pass</button>
        <button class="btn btn-danger" id="btnOverlayFail">Fail</button>
      </div>
    </div>
  `;
  
  document.getElementById('btnOverlayPass').onclick = () => { hideOverlay(); resolve('pass'); };
  document.getElementById('btnOverlayFail').onclick = () => { hideOverlay(); resolve('fail'); };
}

// 1. Dead Pixel
async function runDeadPixelTest() {
  return new Promise((resolve) => {
    showOverlay('Dead Pixel Test');
    const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
    let idx = 0;
    
    overlayContent.innerHTML = `<div id="colorLayer" class="color-test-layer" style="background:${colors[idx]}">Tap to change color</div>`;
    
    document.getElementById('colorLayer').addEventListener('click', () => {
      idx++;
      if (idx < colors.length) {
        document.getElementById('colorLayer').style.background = colors[idx];
      } else {
        promptPassFail(resolve);
      }
    });
  });
}

// 2. Touch Draw
async function runTouchDrawTest() {
  return new Promise((resolve) => {
    showOverlay('Touch Screen Draw Test');
    overlayContent.innerHTML = `
      <canvas id="touchCanvas" class="touch-canvas"></canvas>
      <div class="overlay-instruction">Scribble everywhere. Tap Done when finished. <button id="btnTouchDone" class="btn btn-sm" style="margin-left:10px;">Done</button></div>
    `;
    
    const canvas = document.getElementById('touchCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00ff00';
    
    let isDrawing = false;
    
    const startPos = (e) => { isDrawing = true; draw(e); };
    const endPos = () => { isDrawing = false; ctx.beginPath(); };
    const draw = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      let touch = e.touches ? e.touches[0] : e;
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    };
    
    canvas.addEventListener('mousedown', startPos);
    canvas.addEventListener('mouseup', endPos);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', startPos);
    canvas.addEventListener('touchend', endPos);
    canvas.addEventListener('touchmove', draw);
    
    document.getElementById('btnTouchDone').onclick = () => {
      promptPassFail(resolve, `<img src="${canvas.toDataURL()}" style="max-height:200px; margin:auto; display:block; margin-bottom:20px;">`);
    };
  });
}

// 3. Multi-Touch
async function runMultiTouchTest() {
  return new Promise((resolve) => {
    showOverlay('Multi-Touch Test');
    overlayContent.innerHTML = `
      <div id="touchArea" style="width:100%; height:100%; background:#111; touch-action:none; position:relative;">
        <div class="overlay-instruction">Place up to 10 fingers on screen. <br>Tap 'Done' when finished. <button id="btnMtDone" class="btn btn-sm">Done</button></div>
      </div>
    `;
    const area = document.getElementById('touchArea');
    let maxTouches = 0;
    
    const colors = ['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4caf50'];
    
    const handleTouch = (e) => {
      e.preventDefault();
      area.innerHTML = area.firstElementChild.outerHTML; // Keep instruction, clear circles
      if (e.touches.length > maxTouches) maxTouches = e.touches.length;
      
      for(let i=0; i<e.touches.length; i++) {
        const t = e.touches[i];
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.left = (t.clientX - 40) + 'px';
        circle.style.top = (t.clientY - 40) + 'px';
        circle.style.width = '80px';
        circle.style.height = '80px';
        circle.style.borderRadius = '50%';
        circle.style.background = colors[i % colors.length];
        circle.style.opacity = '0.8';
        circle.style.pointerEvents = 'none';
        area.appendChild(circle);
      }
    };
    
    area.addEventListener('touchstart', handleTouch);
    area.addEventListener('touchmove', handleTouch);
    area.addEventListener('touchend', handleTouch);
    
    document.getElementById('btnMtDone').onclick = () => {
      promptPassFail(resolve, `<h3 style="color:var(--text-primary);">Max Fingers Detected: ${maxTouches}</h3>`);
    };
  });
}

// 4. Frequency Sweep
async function runFrequencySweep() {
  return new Promise((resolve) => {
    showOverlay('Speaker Test (Sweep)');
    overlayContent.innerHTML = `
      <div style="padding:40px; text-align:center;">
        <h3 style="color:var(--text-primary)">Turn up your volume!</h3>
        <p style="color:var(--text-secondary)">Playing a sweep from 100Hz to 15,000Hz...</p>
        <button id="btnStopAudio" class="btn btn-danger">Stop</button>
      </div>
    `;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(15000, ctx.currentTime + 3);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    
    osc.start();
    
    const stopAudio = () => {
      try { osc.stop(); ctx.close(); } catch(e){}
    };
    
    setTimeout(() => {
      stopAudio();
      promptPassFail(resolve, '<h3 style="color:var(--text-primary)">Did you hear the sweep smoothly?</h3>');
    }, 3500);
    
    document.getElementById('btnStopAudio').onclick = () => {
      stopAudio();
      promptPassFail(resolve);
    };
  });
}

// 5. Microphone
async function runMicTest() {
  return new Promise(async (resolve) => {
    showOverlay('Microphone Test');
    overlayContent.innerHTML = `
      <div style="padding:40px; text-align:center;">
        <h3 style="color:var(--text-primary)">Recording 3 seconds...</h3>
        <div id="micStatus" style="font-size:24px; margin:20px 0;">🎙️ Speak now!</div>
      </div>
    `;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];
      
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        const audioURL = window.URL.createObjectURL(blob);
        
        overlayContent.innerHTML = `
          <div style="padding:40px; text-align:center;">
            <h3 style="color:var(--text-primary)">Playback</h3>
            <audio controls src="${audioURL}" style="margin:20px 0;"></audio>
            <br>
            <button class="btn btn-primary" id="btnMicDone">Done</button>
          </div>
        `;
        document.getElementById('btnMicDone').onclick = () => {
          stream.getTracks().forEach(track => track.stop());
          promptPassFail(resolve);
        };
      };
      
      mediaRecorder.start();
      setTimeout(() => {
        document.getElementById('micStatus').innerText = "Stopping...";
        mediaRecorder.stop();
      }, 3000);
      
    } catch(err) {
      promptPassFail(resolve, `<p style="color:var(--accent-red)">Error accessing mic: ${err.message}</p>`);
    }
  });
}

// 6. Camera Test
async function runCameraTest(facingMode) {
  return new Promise(async (resolve) => {
    showOverlay(facingMode === 'user' ? 'Front Camera' : 'Rear Camera');
    overlayContent.innerHTML = `
      <video id="camVideo" class="camera-preview" autoplay playsinline></video>
      <div class="overlay-instruction"><button id="btnCamDone" class="btn btn-primary">Done</button></div>
    `;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode }
      });
      document.getElementById('camVideo').srcObject = stream;
      
      document.getElementById('btnCamDone').onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        promptPassFail(resolve);
      };
    } catch(err) {
      promptPassFail(resolve, `<p style="color:var(--accent-red)">Camera Error: ${err.message}</p>`);
    }
  });
}

// 7. Sensors (Motion)
async function runMotionTest() {
  return new Promise((resolve) => {
    showOverlay('Motion Sensors');
    
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      overlayContent.innerHTML = `
        <div style="padding:40px; text-align:center;">
          <p style="color:var(--text-primary)">iOS requires permission to read sensors.</p>
          <button id="btnRequestSensors" class="btn btn-primary">Grant Permission</button>
        </div>
      `;
      document.getElementById('btnRequestSensors').onclick = () => {
        DeviceMotionEvent.requestPermission()
          .then(res => { if(res === 'granted') startSensors(resolve); else resolve('fail'); })
          .catch(console.error);
      };
    } else {
      startSensors(resolve);
    }
  });
}

function startSensors(resolve) {
  overlayContent.innerHTML = `
    <div class="sensor-readings">
      <div class="sensor-row"><span>Accel X:</span> <span id="accX">0</span></div>
      <div class="sensor-row"><span>Accel Y:</span> <span id="accY">0</span></div>
      <div class="sensor-row"><span>Accel Z:</span> <span id="accZ">0</span></div>
      <div class="sensor-row"><span>Gyro Alpha:</span> <span id="gyrA">0</span></div>
      <div class="sensor-row"><span>Gyro Beta:</span> <span id="gyrB">0</span></div>
      <div class="sensor-row"><span>Gyro Gamma:</span> <span id="gyrG">0</span></div>
      <button class="btn btn-primary w-100" id="btnSensorDone" style="margin-top:20px;">Stop & Evaluate</button>
    </div>
  `;
  
  const handleMotion = (e) => {
    if(e.accelerationIncludingGravity) {
      document.getElementById('accX').innerText = (e.accelerationIncludingGravity.x||0).toFixed(2);
      document.getElementById('accY').innerText = (e.accelerationIncludingGravity.y||0).toFixed(2);
      document.getElementById('accZ').innerText = (e.accelerationIncludingGravity.z||0).toFixed(2);
    }
  };
  const handleOrientation = (e) => {
    document.getElementById('gyrA').innerText = (e.alpha||0).toFixed(2);
    document.getElementById('gyrB').innerText = (e.beta||0).toFixed(2);
    document.getElementById('gyrG').innerText = (e.gamma||0).toFixed(2);
  };
  
  window.addEventListener('devicemotion', handleMotion);
  window.addEventListener('deviceorientation', handleOrientation);
  
  document.getElementById('btnSensorDone').onclick = () => {
    window.removeEventListener('devicemotion', handleMotion);
    window.removeEventListener('deviceorientation', handleOrientation);
    promptPassFail(resolve);
  };
}

// 8. GPS
async function runGpsTest() {
  return new Promise((resolve) => {
    showOverlay('GPS Test');
    overlayContent.innerHTML = `<div style="padding:40px; text-align:center;"><h3 style="color:var(--text-primary)">Locating...</h3><p style="color:var(--text-secondary)">Please allow location access if prompted.</p></div>`;
    
    if (!navigator.geolocation) {
      promptPassFail(resolve, `<p style="color:var(--accent-red)">Geolocation is not supported by your browser.</p>`);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        promptPassFail(resolve, `
          <h3 style="color:var(--text-primary)">Location Found!</h3>
          <p style="color:var(--text-secondary)">Lat: ${pos.coords.latitude.toFixed(4)}<br>Lon: ${pos.coords.longitude.toFixed(4)}<br>Accuracy: ${pos.coords.accuracy} meters</p>
        `);
      },
      (err) => {
        promptPassFail(resolve, `<p style="color:var(--accent-red)">GPS Error: ${err.message}</p>`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// 9. Performance
async function runPerformanceTest() {
  return new Promise((resolve) => {
    showOverlay('Performance Check');
    
    let html = `<div style="padding:40px; color:var(--text-primary); text-align:center;">`;
    html += `<h3>Specs:</h3>`;
    
    if (navigator.deviceMemory) {
      html += `<p>Est. RAM: ${navigator.deviceMemory} GB</p>`;
    } else {
      html += `<p>Est. RAM: Unsupported (iOS/Safari)</p>`;
    }
    
    html += `<h3>CPU Benchmark:</h3><p id="cpuScore">Running Math Loop...</p>`;
    html += `</div>`;
    
    overlayContent.innerHTML = html;
    
    setTimeout(() => {
      const start = performance.now();
      let res = 0;
      for (let i = 0; i < 20000000; i++) {
        res += Math.sqrt(i) * Math.sin(i);
      }
      const end = performance.now();
      const timeMs = end - start;
      const score = Math.round(1000000 / timeMs);
      
      document.getElementById('cpuScore').innerHTML = `Score: <strong>${score}</strong> (Time: ${Math.round(timeMs)}ms)`;
      
      setTimeout(() => promptPassFail(resolve), 1500);
    }, 100);
  });
}

// 10. Vibration
async function runVibrationTest() {
  return new Promise((resolve) => {
    showOverlay('Vibration Test');
    overlayContent.innerHTML = `
      <div style="padding:40px; text-align:center;">
        <h3 style="color:var(--text-primary)">Vibration Motor</h3>
        <p style="color:var(--text-secondary)">Does not work on iOS devices or some Android browsers.</p>
        <button class="btn btn-primary" id="btnVibrate" style="margin-bottom:20px; font-size:18px; padding:15px 30px;">📳 Vibrate Now</button>
        <br><br>
        <button class="btn btn-run" id="btnVibDone" style="background:var(--bg-hover); color:var(--text-primary); border:1px solid var(--border);">Done Testing</button>
      </div>
    `;
    
    document.getElementById('btnVibrate').onclick = () => {
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      } else {
        alert("Vibration API not supported on this device/browser.");
      }
    };
    
    document.getElementById('btnVibDone').onclick = () => {
      promptPassFail(resolve);
    };
  });
}

document.addEventListener('DOMContentLoaded', () => {
  detectDevice();
  initUI();
});
