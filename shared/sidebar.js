function injectSidebar(activeToolId = null) {
  const sidebarHTML = `
    <aside class="global-sidebar" id="globalSidebar">
      <div class="sidebar-brand">
        <a href="/">
          <span>🔧</span>
          <div>
            <h2>ay5uh</h2>
            <p>Hardware Diagnostics</p>
          </div>
        </a>
      </div>
      
      <div class="nav-section">
        <div class="nav-category">Laptop</div>
        <ul class="nav-list">
          <li class="nav-item"><a href="/tools/battery-tester/" id="nav-battery-tester"><span class="nav-icon">🔋</span> Battery Health</a></li>
          <li class="nav-item"><a href="/tools/thermal-test/" id="nav-thermal-test"><span class="nav-icon">🌡️</span> Thermal Profiler</a></li>
          <li class="nav-item"><a href="/tools/ssd-test/" id="nav-ssd-test"><span class="nav-icon">💾</span> SSD Health</a></li>
          <li class="nav-item"><a href="/tools/ram-test/" id="nav-ram-test"><span class="nav-icon">🧠</span> RAM Test</a></li>
          <li class="nav-item"><a href="/tools/benchmark/" id="nav-benchmark"><span class="nav-icon">⚡</span> Benchmark</a></li>
        </ul>
      </div>

      <div class="nav-section">
        <div class="nav-category">Peripherals</div>
        <ul class="nav-list">
          <li class="nav-item"><a href="/tools/controller-lab/" id="nav-controller-lab"><span class="nav-icon">🎮</span> Controller Lab</a></li>
          <li class="nav-item"><a href="/tools/keyboard-test/" id="nav-keyboard-test"><span class="nav-icon">⌨️</span> Keyboard Test</a></li>
          <li class="nav-item"><a href="/tools/mouse-test/" id="nav-mouse-test"><span class="nav-icon">🖱️</span> Mouse Test</a></li>
          <li class="nav-item"><a href="/tools/mic-test/" id="nav-mic-test"><span class="nav-icon">🎤</span> Mic Test</a></li>
          <li class="nav-item"><a href="/tools/speaker-test/" id="nav-speaker-test"><span class="nav-icon">🔊</span> Speaker Test</a></li>
        </ul>
      </div>

      <div class="nav-section">
        <div class="nav-category">Display</div>
        <ul class="nav-list">
          <li class="nav-item"><a href="/tools/display-test/" id="nav-display-test"><span class="nav-icon">🖥️</span> Display Test</a></li>
          <li class="nav-item"><a href="/tools/dead-pixel-test/" id="nav-dead-pixel-test"><span class="nav-icon">💀</span> Dead Pixel Test</a></li>
          <li class="nav-item"><a href="/tools/webcam-test/" id="nav-webcam-test"><span class="nav-icon">📷</span> Webcam Test</a></li>
        </ul>
      </div>

      <div class="sidebar-ad">
        <p>Ad · keeps tool free</p>
        <ins class="adsbygoogle"
             style="display:block;width:100%;height:100px;"
             data-ad-client="ca-pub-4806235756537260"
             data-ad-slot="8013321574"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
        </script>
      </div>
    </aside>
  `;

  // Inject sidebar at the start of app-layout
  const layout = document.querySelector('.app-layout');
  if (layout) {
    layout.insertAdjacentHTML('afterbegin', sidebarHTML);
  } else {
    console.error('No .app-layout element found to inject sidebar.');
  }

  // Highlight active tool
  if (activeToolId) {
    const activeLink = document.getElementById(`nav-${activeToolId}`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Setup mobile hamburger toggle if it exists
  const hamburger = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('globalSidebar');
  
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && 
          !sidebar.contains(e.target) && 
          !hamburger.contains(e.target) && 
          sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  }
}

// Global Analytics Base Function
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
