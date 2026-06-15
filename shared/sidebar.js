function injectSidebar(activeToolId = null) {
  const headerHTML = `
    <header class="global-header">
      <div class="header-left">
        <button class="mobile-menu-btn" id="hamburgerBtn">☰</button>
        <a href="/" class="header-logo">
          <span>🔧</span> ay5uh
        </a>
      </div>
      <div class="header-tagline">Hardware Diagnostics</div>
    </header>
  `;

  const sidebarHTML = `
    <aside class="global-sidebar" id="globalSidebar">
      
      <div class="nav-section">
        <div class="nav-category">GAMEPAD</div>
        <ul class="nav-list">
          <li class="nav-item"><a href="/tools/controller-lab/" id="nav-controller-lab">
            <div class="nav-item-left"><span class="nav-icon">🎮</span> Controller Lab</div>
          </a></li>
        </ul>
      </div>

      <div class="nav-section">
        <div class="nav-category">LAPTOP/MACBOOK</div>
        <ul class="nav-list">
          <li class="nav-item"><a href="/tools/keyboard-test/" id="nav-keyboard-test">
            <div class="nav-item-left"><span class="nav-icon">⌨️</span> Keyboard Test</div>
          </a></li>
          <li class="nav-item"><a href="/tools/mouse-test/" id="nav-mouse-test">
            <div class="nav-item-left"><span class="nav-icon">🖱️</span> Mouse Test</div>
          </a></li>
          <li class="nav-item"><a href="/tools/mic-test/" id="nav-mic-test">
            <div class="nav-item-left"><span class="nav-icon">🎤</span> Mic Test</div>
          </a></li>
          <li class="nav-item"><a href="/tools/speaker-test/" id="nav-speaker-test">
            <div class="nav-item-left"><span class="nav-icon">🔊</span> Speaker Test</div>
          </a></li>
          <li class="nav-item"><a href="/tools/display-test/" id="nav-display-test">
            <div class="nav-item-left"><span class="nav-icon">🖥️</span> Display Test</div>
          </a></li>
          <li class="nav-item"><a href="/tools/dead-pixel-test/" id="nav-dead-pixel-test">
            <div class="nav-item-left"><span class="nav-icon">💀</span> Dead Pixel Test</div>
          </a></li>
          <li class="nav-item"><a href="/tools/webcam-test/" id="nav-webcam-test">
            <div class="nav-item-left"><span class="nav-icon">📷</span> Webcam Test</div>
          </a></li>
          <li class="nav-item"><a href="/tools/battery-tester/" id="nav-battery-tester">
            <div class="nav-item-left"><span class="nav-icon">🔋</span> Battery Health</div>
          </a></li>
          <li class="nav-item"><a href="/tools/thermal-test/" id="nav-thermal-test">
            <div class="nav-item-left"><span class="nav-icon">🌡️</span> Thermal Profiler</div>
          </a></li>
          <li class="nav-item"><a href="/tools/ssd-test/" id="nav-ssd-test">
            <div class="nav-item-left"><span class="nav-icon">💾</span> SSD Health</div>
          </a></li>
          <li class="nav-item"><a href="/tools/ram-test/" id="nav-ram-test">
            <div class="nav-item-left"><span class="nav-icon">🧠</span> RAM Test</div>
          </a></li>
        </ul>
      </div>

      <div class="nav-section">
        <div class="nav-category">PHONE</div>
        <ul class="nav-list">
          <li class="nav-item"><a href="/tools/phone-diagnostics/" id="nav-phone-diagnostics">
            <div class="nav-item-left"><span class="nav-icon">📱</span> Phone Diagnostics</div>
          </a></li>
        </ul>
      </div>
    </aside>
  `;

  // Inject header at body start
  if (!document.querySelector('.global-header')) {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
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

    // Reset timer on interaction with the sidebar
    sidebar.addEventListener('touchstart', resetTimer, { passive: true });
    sidebar.addEventListener('mousemove', resetTimer, { passive: true });
    sidebar.addEventListener('scroll', resetTimer, { passive: true });

    // Close sidebar when clicking outside on mobile
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
