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

// 1. Dead Pixel & Display
async function runDeadPixelTest() {
  return new Promise((resolve) => {
    showOverlay('Display & Dead Pixel Test');
    
    const backgrounds = [
      '#000000', // Black
      '#ffffff', // White
      '#ff0000', // Red
      '#00ff00', // Green
      '#0000ff', // Blue
      '#00ffff', // Cyan
      '#ff00ff', // Magenta
      '#ffff00', // Yellow
      'linear-gradient(to right, #000000, #ffffff)' // Banding test
    ];
    let idx = 0;
    
    // Request fullscreen to hide UI
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(()=>{});
    }
    
    overlayContent.innerHTML = `<div id="colorLayer" class="color-test-layer" style="background:${backgrounds[idx]}">Tap to cycle colors<br><span style="font-size:14px;opacity:0.7">(Look for stuck pixels or backlight bleed)</span></div>`;
    
    document.getElementById('colorLayer').addEventListener('click', () => {
      idx++;
      if (idx < backgrounds.length) {
        document.getElementById('colorLayer').style.background = backgrounds[idx];
        if (idx > 0) document.getElementById('colorLayer').innerHTML = ''; // Hide text after first tap
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(()=>{});
        promptPassFail(resolve, '<p style="color:var(--text-secondary)">Did you spot any dead pixels, stuck colors, or severe color banding?</p>');
      }
    });
  });
}

// 2. Touch Draw (Grid Validation)
async function runTouchDrawTest() {
  return new Promise((resolve) => {
    showOverlay('Touch Screen Grid Test');
    
    // Create an 8x12 grid
    const cols = 8;
    const rows = 12;
    const totalCells = cols * rows;
    
    overlayContent.innerHTML = `
      <div id="touchGrid" class="touch-grid-container" style="grid-template-columns: repeat(${cols}, 1fr); grid-template-rows: repeat(${rows}, 1fr);">
        <div class="overlay-instruction" style="pointer-events:none; z-index:100; font-size:14px; padding:8px 16px;">Swipe all blocks to turn them green</div>
      </div>
      <button id="btnCancelTouch" class="btn btn-danger" style="position:absolute; bottom:20px; left:50%; transform:translateX(-50%); z-index:100;">Cancel</button>
    `;
    
    const grid = document.getElementById('touchGrid');
    let touchedCount = 0;
    const touchedCells = new Set();
    
    // Generate cells
    for(let i=0; i<totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'touch-grid-cell';
      cell.id = `cell-${i}`;
      grid.appendChild(cell);
    }
    
    const handleTouch = (e) => {
      e.preventDefault();
      const touches = e.touches ? e.touches : [e];
      for(let i=0; i<touches.length; i++) {
        const t = touches[i];
        // Find the element under this touch point
        const el = document.elementFromPoint(t.clientX, t.clientY);
        if (el && el.classList.contains('touch-grid-cell') && !el.classList.contains('touched')) {
          el.classList.add('touched');
          touchedCells.add(el.id);
          touchedCount = touchedCells.size;
          
          if (touchedCount === totalCells) {
            // Auto pass
            grid.removeEventListener('touchmove', handleTouch);
            grid.removeEventListener('mousemove', handleTouch);
            hideOverlay();
            resolve('pass');
          }
        }
      }
    };
    
    grid.addEventListener('touchmove', handleTouch);
    grid.addEventListener('touchstart', handleTouch);
    grid.addEventListener('mousemove', (e) => { if (e.buttons === 1) handleTouch(e); });
    grid.addEventListener('mousedown', handleTouch);
    
    document.getElementById('btnCancelTouch').onclick = () => {
      hideOverlay();
      resolve('fail');
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

// 4. Stereo & Frequency Sweep
async function runFrequencySweep() {
  return new Promise(async (resolve) => {
    showOverlay('Stereo Speaker Test');
    overlayContent.innerHTML = `
      <div style="padding:40px; text-align:center;">
        <h3 style="color:var(--text-primary)">Turn up your volume!</h3>
        <p id="speakerStatus" style="color:var(--accent-blue); font-size:20px; font-weight:700; margin: 24px 0;">Preparing audio...</p>
        <button id="btnStopAudio" class="btn btn-danger">Stop Test</button>
      </div>
    `;
    
    let ctx, osc, gain, panner;
    
    const playTone = (freq, panValue, duration, statusText) => {
      return new Promise(res => {
        document.getElementById('speakerStatus').innerText = statusText;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        osc = ctx.createOscillator();
        gain = ctx.createGain();
        panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        if (panner) {
          panner.pan.value = panValue;
          osc.connect(panner);
          panner.connect(gain);
        } else {
          osc.connect(gain);
        }
        
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.8, ctx.currentTime + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
        
        setTimeout(() => {
          ctx.close();
          res();
        }, duration * 1000 + 100);
      });
    };

    const playSweep = (duration) => {
      return new Promise(res => {
        document.getElementById('speakerStatus').innerText = '🎵 Full Frequency Sweep (Both Speakers)';
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        osc = ctx.createOscillator();
        gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(15000, ctx.currentTime + duration);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
        
        setTimeout(() => {
          ctx.close();
          res();
        }, duration * 1000 + 100);
      });
    };

    const stopAudio = () => {
      try { if (osc) osc.stop(); if (ctx) ctx.close(); } catch(e){}
    };
    
    document.getElementById('btnStopAudio').onclick = () => {
      stopAudio();
      promptPassFail(resolve);
    };

    try {
      await playTone(440, -1, 1.5, '🔊 Playing LEFT Speaker...');
      await new Promise(r => setTimeout(r, 500));
      await playTone(440, 1, 1.5, '🔊 Playing RIGHT Speaker...');
      await new Promise(r => setTimeout(r, 500));
      await playSweep(3.0);
      
      promptPassFail(resolve, '<h3 style="color:var(--text-primary)">Did you hear Left, Right, and the Sweep?</h3>');
    } catch(err) {
      stopAudio();
      promptPassFail(resolve);
    }
  });
}

// 5. Microphone
async function runMicTest() {
  return new Promise(async (resolve) => {
    showOverlay('Microphone Test');
    overlayContent.innerHTML = `
      <div style="padding:40px; text-align:center;">
        <h3 style="color:var(--text-primary)">Recording 3 seconds...</h3>
        <canvas id="micCanvas" width="300" height="100" style="background:#111; border-radius:8px; margin:20px auto; display:block;"></canvas>
        <div id="micStatus" style="font-size:24px; color:var(--text-secondary);">🎙️ Speak now!</div>
      </div>
    `;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      
      const canvas = document.getElementById('micCanvas');
      const canvasCtx = canvas.getContext('2d');
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let drawVisual;
      
      const draw = () => {
        drawVisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = '#111';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'var(--accent-blue)';
        canvasCtx.beginPath();
        
        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;
        for(let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * canvas.height/2;
          if(i === 0) canvasCtx.moveTo(x, y);
          else canvasCtx.lineTo(x, y);
          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
      };
      draw();

      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];
      
      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        cancelAnimationFrame(drawVisual);
        audioCtx.close();
        
        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        const audioURL = window.URL.createObjectURL(blob);
        
        overlayContent.innerHTML = `
          <div style="padding:40px; text-align:center;">
            <h3 style="color:var(--text-primary)">Playback</h3>
            <p style="color:var(--text-secondary)">Did your voice record clearly?</p>
            <audio controls src="${audioURL}" style="margin:20px 0;"></audio>
            <br>
            <button class="btn btn-primary" id="btnMicDone">Evaluate</button>
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
      <div class="overlay-instruction" style="display:flex; gap:10px; align-items:center;">
        <button id="btnCycleCam" class="btn btn-secondary" style="background:rgba(255,255,255,0.2); color:#fff; border:1px solid #fff;"><i class="fa-solid fa-rotate"></i> Cycle Camera</button>
        <button id="btnCamDone" class="btn btn-primary">Done</button>
      </div>
    `;
    
    let currentStream = null;
    let videoDevices = [];
    let currentDeviceIndex = 0;
    
    const startStream = async (deviceId, facing) => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      try {
        const constraints = deviceId ? { video: { deviceId: { exact: deviceId } } } : { video: { facingMode: facing } };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        document.getElementById('camVideo').srcObject = currentStream;
      } catch (err) {
        console.error(err);
      }
    };
    
    try {
      // initial request to trigger permissions
      await startStream(null, facingMode);
      
      // then enumerate
      const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = devices.filter(d => d.kind === 'videoinput');
      
      // Try to match the initial facing mode with the enumerated devices if possible
      if (videoDevices.length > 0) {
        document.getElementById('btnCycleCam').onclick = async () => {
          currentDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
          await startStream(videoDevices[currentDeviceIndex].deviceId, null);
        };
      } else {
        document.getElementById('btnCycleCam').style.display = 'none';
      }
      
      document.getElementById('btnCamDone').onclick = () => {
        if (currentStream) currentStream.getTracks().forEach(track => track.stop());
        promptPassFail(resolve, '<p style="color:var(--text-secondary)">Did the camera feed look clear without artifacts or spots?</p>');
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
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;">
      <h3 style="color:var(--text-primary); margin-bottom:10px;">Bubble Level</h3>
      <p style="color:var(--text-secondary); margin-bottom:40px; text-align:center;">Tilt your phone. The bubble should move smoothly.</p>
      
      <div style="width:200px; height:200px; border-radius:50%; border:4px solid var(--border); position:relative; background:var(--bg-card); display:flex; align-items:center; justify-content:center; overflow:hidden;">
        <!-- Crosshairs -->
        <div style="position:absolute; width:100%; height:1px; background:var(--border);"></div>
        <div style="position:absolute; width:1px; height:100%; background:var(--border);"></div>
        <!-- Bubble -->
        <div id="tiltBubble" style="position:absolute; width:40px; height:40px; background:var(--accent-blue); border-radius:50%; transition: transform 0.1s ease-out;"></div>
      </div>
      
      <div class="sensor-readings" style="margin-top:40px; width:100%; max-width:300px;">
        <div class="sensor-row"><span>Accel X:</span> <span id="accX">0</span></div>
        <div class="sensor-row"><span>Accel Y:</span> <span id="accY">0</span></div>
        <div class="sensor-row"><span>Accel Z:</span> <span id="accZ">0</span></div>
      </div>
      
      <button class="btn btn-primary" id="btnSensorDone" style="margin-top:auto; width:100%; max-width:300px;">Evaluate</button>
    </div>
  `;
  
  const bubble = document.getElementById('tiltBubble');
  const maxMove = 80; // pixels from center
  
  const handleMotion = (e) => {
    if(e.accelerationIncludingGravity) {
      const x = e.accelerationIncludingGravity.x || 0;
      const y = e.accelerationIncludingGravity.y || 0;
      const z = e.accelerationIncludingGravity.z || 0;
      
      document.getElementById('accX').innerText = x.toFixed(2);
      document.getElementById('accY').innerText = y.toFixed(2);
      document.getElementById('accZ').innerText = z.toFixed(2);
      
      // Calculate bubble position (invert X for natural feel, invert Y depending on OS)
      // Usually X is left/right tilt (-9.8 to 9.8), Y is up/down tilt
      let bx = (x / 9.8) * maxMove;
      let by = (y / 9.8) * maxMove * -1; // inverted for natural bubble feel
      
      // Constrain to circle
      const dist = Math.sqrt(bx*bx + by*by);
      if (dist > maxMove) {
        bx = (bx / dist) * maxMove;
        by = (by / dist) * maxMove;
      }
      
      bubble.style.transform = `translate(${bx}px, ${by}px)`;
    }
  };
  
  window.addEventListener('devicemotion', handleMotion);
  
  document.getElementById('btnSensorDone').onclick = () => {
    window.removeEventListener('devicemotion', handleMotion);
    promptPassFail(resolve, '<p style="color:var(--text-secondary)">Did the bubble move smoothly when tilting the phone?</p>');
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
