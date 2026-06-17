  const subnavHTML = activeToolId === 'controller-lab' ? \`
    <ul class="nav-list" style="margin-top: 4px; padding-left: 16px;">
      <li class="nav-item"><button class="tab-btn active" data-tab="tab-overview" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-sliders" style="width:14px; text-align:center;"></i> Overview</button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-calibration" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-wrench" style="width:14px; text-align:center;"></i> Calibration</button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-tester" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-keyboard" style="width:14px; text-align:center;"></i> Input Tester</button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-vibration" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-water" style="width:14px; text-align:center;"></i> Vibration</button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-touchpad" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-fingerprint" style="width:14px; text-align:center;"></i> Touchpad</button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-drift" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-compass" style="width:14px; text-align:center;"></i> Drift Check</button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-sensors" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-microchip" style="width:14px; text-align:center;"></i> Sensor Lab</button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-info" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-circle-info" style="width:14px; text-align:center;"></i> Info & Logs</button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-docs" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; text-align:left; width:100%; padding:4px 8px; border-radius:4px; font-size:13px; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-book" style="width:14px; text-align:center;"></i> Documentation</button></li>
    </ul>
  \` : '';

  const sidebarHTML = \`
    <!-- Mobile Hamburger Toggle -->
    <button class="mobile-menu-btn" id="hamburgerBtn" style="position: absolute; top: 16px; left: 16px; z-index: 1000; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; cursor: pointer; color: var(--text-primary); font-size: 20px; display: none;">☰</button>

    <aside class="global-sidebar" id="globalSidebar">
      <div class="brand-container">
        <div class="brand-logo"><i class="fa-solid fa-screwdriver-wrench"></i></div>
        <a href="/" class="brand-title" style="text-decoration:none;">ay5uh</a>
      </div>
      
      <div class="sidebar-scroll-area">
        <div class="nav-section">
          <div class="nav-category"><span>GAMEPAD</span> <span class="nav-category-pill">1</span></div>
          <ul class="nav-list">
            <li class="nav-item"><a href="/tools/controller-lab/" id="nav-controller-lab">
              <i class="fa-solid fa-gamepad nav-icon"></i> Controller Lab
            </a></li>
          </ul>
          \${subnavHTML}
        </div>

        <div class="nav-section">
          <div class="nav-category"><span>LAPTOP / MACBOOK</span> <span class="nav-category-pill">7</span></div>
          <ul class="nav-list">
            <li class="nav-item"><a href="/tools/keyboard-test/" id="nav-keyboard-test">
              <i class="fa-solid fa-keyboard nav-icon"></i> Keyboard Test
            </a></li>
            <li class="nav-item"><a href="/tools/mouse-test/" id="nav-mouse-test">
              <i class="fa-solid fa-computer-mouse nav-icon"></i> Mouse & Trackpad
            </a></li>
            <li class="nav-item"><a href="/tools/mic-test/" id="nav-mic-test">
              <i class="fa-solid fa-microphone nav-icon"></i> Mic Test
            </a></li>
            <li class="nav-item"><a href="/tools/speaker-test/" id="nav-speaker-test">
              <i class="fa-solid fa-volume-high nav-icon"></i> Speaker Test
            </a></li>
            <li class="nav-item"><a href="/tools/display-test/" id="nav-display-test">
              <i class="fa-solid fa-desktop nav-icon"></i> Display Test
            </a></li>
            <li class="nav-item"><a href="/tools/dead-pixel-test/" id="nav-dead-pixel-test">
              <i class="fa-solid fa-border-all nav-icon"></i> Dead Pixel Test
            </a></li>
            <li class="nav-item"><a href="/tools/webcam-test/" id="nav-webcam-test">
              <i class="fa-solid fa-camera nav-icon"></i> Webcam Test
            </a></li>
          </ul>
        </div>

        <div class="nav-section">
          <div class="nav-category"><span>PHONE</span> <span class="nav-category-pill">1</span></div>
          <ul class="nav-list">
            <li class="nav-item"><a href="/tools/phone-diagnostics/" id="nav-phone-diagnostics">
              <i class="fa-solid fa-mobile-screen nav-icon"></i> Phone Diagnostics
            </a></li>
          </ul>
        </div>
      </div>
    </aside>
  `;

  // Inject FontAwesome if missing
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(faLink);
  }

  // Inject sidebar inside app-layout
  const layout = document.querySelector('.app-layout');
  if (layout && !document.querySelector('.global-sidebar')) {
    layout.insertAdjacentHTML('afterbegin', sidebarHTML);
  }

  // Highlight active tool
  if (activeToolId) {
    const activeLink = document.getElementById(`nav-${activeToolId}`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Setup mobile hamburger toggle
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('globalSidebar');
  
  if (hamburger && sidebar) {
    let sidebarTimeout;

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      clearTimeout(sidebarTimeout);
    };

    const resetTimer = () => {
      clearTimeout(sidebarTimeout);
      if (sidebar.classList.contains('open')) {
        sidebarTimeout = setTimeout(closeSidebar, 5000);
      }
    };

    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      resetTimer();
    });

    sidebar.addEventListener('touchstart', resetTimer, { passive: true });
    sidebar.addEventListener('mousemove', resetTimer, { passive: true });
    sidebar.addEventListener('scroll', resetTimer, { passive: true });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          !sidebar.contains(e.target) && 
          !hamburger.contains(e.target) && 
          sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });
  }
}

function trackToolEvent(toolName, eventType, data = {}) {
  const event = {
    tool: toolName,
    event: eventType,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  console.log('[Analytics]', event);
  
  if (typeof gtag === 'function') {
    gtag('event', eventType, {
      event_category: 'diagnostics',
      tool_name: toolName,
      ...data
    });
  }
}
