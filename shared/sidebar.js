function injectSidebar(activeToolId = null) {
  const isToolsPath = window.location.pathname.startsWith('/tools/') || activeToolId !== null;

  const subnavHTML = activeToolId === 'controller-lab' ? `
    <ul class="nav-list" style="margin-top: 4px; padding-left: 16px;">
      <li class="nav-item"><button class="tab-btn active" data-tab="tab-overview" title="Overview"><i class="fa-solid fa-sliders" style="width:14px; text-align:center;"></i> <span class="item-text">Overview</span></button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-calibration" title="Calibration"><i class="fa-solid fa-wrench" style="width:14px; text-align:center;"></i> <span class="item-text">Calibration</span></button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-tester" title="Input Tester"><i class="fa-solid fa-keyboard" style="width:14px; text-align:center;"></i> <span class="item-text">Input Tester</span></button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-vibration" title="Vibration"><i class="fa-solid fa-water" style="width:14px; text-align:center;"></i> <span class="item-text">Vibration</span></button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-touchpad" title="Touchpad"><i class="fa-solid fa-fingerprint" style="width:14px; text-align:center;"></i> <span class="item-text">Touchpad</span></button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-drift" title="Drift Check"><i class="fa-solid fa-compass" style="width:14px; text-align:center;"></i> <span class="item-text">Drift Check</span></button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-sensors" title="Sensor Lab"><i class="fa-solid fa-microchip" style="width:14px; text-align:center;"></i> <span class="item-text">Sensor Lab</span></button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-info" title="Info & Logs"><i class="fa-solid fa-circle-info" style="width:14px; text-align:center;"></i> <span class="item-text">Info & Logs</span></button></li>
      <li class="nav-item"><button class="tab-btn" data-tab="tab-docs" title="Documentation"><i class="fa-solid fa-book" style="width:14px; text-align:center;"></i> <span class="item-text">Documentation</span></button></li>
    </ul>
  ` : '';

  const topNavHTML = `
    <nav class="top-navbar">
      <div class="topnav-left">
        <button id="sidebarToggle" class="sidebar-toggle-btn desktop-only" title="Toggle Sidebar" style="${isToolsPath ? '' : 'display: none !important;'}">
          <i class="fa-solid fa-bars"></i>
        </button>
        <a href="/" class="topnav-brand">
          <i class="fa-solid fa-screwdriver-wrench text-accent"></i>
          <span>TechTest</span>
        </a>
        <div class="topnav-divider"></div>
        <div class="topnav-links">
          <a href="/" class="topnav-link ${window.location.pathname === '/' || window.location.pathname.startsWith('/tools/') ? 'active' : ''}">Tools</a>
          <a href="/repair-guides/" class="topnav-link ${window.location.pathname.startsWith('/repair-guides/') ? 'active' : ''}">Repair Guides</a>
          <a href="/answers/" class="topnav-link ${window.location.pathname.startsWith('/answers/') ? 'active' : ''}">Answers</a>
        </div>
      </div>
      <div class="topnav-right">
        <button class="topnav-search" id="btnToggleSearch"><i class="fa-solid fa-search"></i></button>
        <button class="topnav-hamburger" id="btnToggleMobileMenu"><i class="fa-solid fa-bars"></i></button>
      </div>
    </nav>
    
    <!-- Search Drawer -->
    <div class="search-drawer" id="searchDrawer">
      <i class="fa-solid fa-search" style="color: #9CA3AF; margin-right: 12px;"></i>
      <input type="text" id="searchInput" placeholder="Search devices, repair guides, tools...">
    </div>

    <!-- Mobile Dropdown -->
    <div class="mobile-dropdown" id="mobileDropdown">
      <a href="/" class="${window.location.pathname === '/' || window.location.pathname.startsWith('/tools/') ? 'active' : ''}">Tools</a>
      <a href="/repair-guides/" class="${window.location.pathname.startsWith('/repair-guides/') ? 'active' : ''}">Repair Guides</a>
      <a href="/answers/" class="${window.location.pathname.startsWith('/answers/') ? 'active' : ''}">Answers</a>
    </div>
  `;

  const sidebarHTML = `
    <!-- Mobile Hamburger Toggle -->
    <button class="mobile-menu-btn" id="hamburgerBtn" style="position: absolute; top: 68px; left: 16px; z-index: 1000; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; cursor: pointer; color: var(--text-primary); font-size: 20px; display: none;">☰</button>

    <aside class="global-sidebar" id="globalSidebar">
      
      <div class="sidebar-scroll-area">
        <div class="nav-section">
          <div class="nav-category"><span>GAMEPAD</span> <span class="nav-category-pill">1</span></div>
          <ul class="nav-list">
            <li class="nav-item"><a href="/tools/controller-lab/" id="nav-controller-lab" title="Controller Lab">
              <i class="fa-solid fa-gamepad nav-icon"></i> <span class="item-text">Controller Lab</span>
            </a></li>
          </ul>
          ${subnavHTML}
        </div>

        <div class="nav-section">
          <div class="nav-category"><span>LAPTOP / MACBOOK</span> <span class="nav-category-pill">7</span></div>
          <ul class="nav-list">
            <li class="nav-item"><a href="/tools/keyboard-test/" id="nav-keyboard-test" title="Keyboard Test">
              <i class="fa-solid fa-keyboard nav-icon"></i> <span class="item-text">Keyboard Test</span>
            </a></li>
            <li class="nav-item"><a href="/tools/mouse-test/" id="nav-mouse-test" title="Mouse & Trackpad">
              <i class="fa-solid fa-computer-mouse nav-icon"></i> <span class="item-text">Mouse & Trackpad</span>
            </a></li>
            <li class="nav-item"><a href="/tools/mic-test/" id="nav-mic-test" title="Mic Test">
              <i class="fa-solid fa-microphone nav-icon"></i> <span class="item-text">Mic Test</span>
            </a></li>
            <li class="nav-item"><a href="/tools/speaker-test/" id="nav-speaker-test" title="Speaker Test">
              <i class="fa-solid fa-volume-high nav-icon"></i> <span class="item-text">Speaker Test</span>
            </a></li>
            <li class="nav-item"><a href="/tools/display-test/" id="nav-display-test" title="Display Test">
              <i class="fa-solid fa-desktop nav-icon"></i> <span class="item-text">Display Test</span>
            </a></li>
            <li class="nav-item"><a href="/tools/dead-pixel-test/" id="nav-dead-pixel-test" title="Dead Pixel Test">
              <i class="fa-solid fa-border-all nav-icon"></i> <span class="item-text">Dead Pixel Test</span>
            </a></li>
            <li class="nav-item"><a href="/tools/webcam-test/" id="nav-webcam-test" title="Webcam Test">
              <i class="fa-solid fa-camera nav-icon"></i> <span class="item-text">Webcam Test</span>
            </a></li>
          </ul>
        </div>

        <div class="nav-section">
          <div class="nav-category"><span>PHONE</span> <span class="nav-category-pill">1</span></div>
          <ul class="nav-list">
            <li class="nav-item"><a href="/tools/phone-diagnostics/" id="nav-phone-diagnostics" title="Phone Diagnostics">
              <i class="fa-solid fa-mobile-screen nav-icon"></i> <span class="item-text">Phone Diagnostics</span>
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

  // Inject Top Navbar
  if (!document.querySelector('.top-navbar')) {
    document.body.insertAdjacentHTML('afterbegin', topNavHTML);
  }

  const layout = document.querySelector('.app-layout');
  
  if (isToolsPath && layout && !document.querySelector('.global-sidebar')) {
    // Inject sidebar
    layout.insertAdjacentHTML('afterbegin', sidebarHTML);

    // Apply saved collapse state
    const savedState = localStorage.getItem('ay5uh_sidebar_state');
    if (savedState === 'collapsed') {
      document.body.classList.add('sidebar-collapsed');
    }

    // Highlight active tool
    if (activeToolId) {
      const activeLink = document.getElementById(`nav-${activeToolId}`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }

    // Toggle button event listener
    // Desktop sidebar toggle
    const toggleBtn = document.getElementById('sidebarToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
        const isCollapsed = document.body.classList.contains('sidebar-collapsed');
        localStorage.setItem('ay5uh_sidebar_state', isCollapsed ? 'collapsed' : 'expanded');
      });
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

    // Top Navbar Logic
    const btnToggleSearch = document.getElementById('btnToggleSearch');
    const searchDrawer = document.getElementById('searchDrawer');
    const searchInput = document.getElementById('searchInput');
    const btnToggleMobileMenu = document.getElementById('btnToggleMobileMenu');
    const mobileDropdown = document.getElementById('mobileDropdown');

    if (btnToggleSearch && searchDrawer) {
      btnToggleSearch.addEventListener('click', (e) => {
        e.stopPropagation();
        searchDrawer.classList.toggle('open');
        if (searchDrawer.classList.contains('open')) {
          setTimeout(() => searchInput.focus(), 50);
        }
      });

      // Close search on click outside
      document.addEventListener('click', (e) => {
        if (!searchDrawer.contains(e.target) && e.target !== btnToggleSearch) {
          searchDrawer.classList.remove('open');
        }
      });

      // Close search on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchDrawer.classList.remove('open');
        }
      });
    }

    if (btnToggleMobileMenu && mobileDropdown) {
      btnToggleMobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileDropdown.classList.toggle('open');
      });

      // Close dropdown when clicking a link
      mobileDropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileDropdown.classList.remove('open');
        });
      });

      // Close dropdown on click outside
      document.addEventListener('click', (e) => {
        if (!mobileDropdown.contains(e.target) && e.target !== btnToggleMobileMenu) {
          mobileDropdown.classList.remove('open');
        }
      });
    }

  } else if (!isToolsPath && layout) {
    layout.classList.add('no-sidebar');
  }

  // Inject Tool Page AdBlock
  if (isToolsPath) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !document.getElementById('ad-tool-bottom')) {
      const toolAdHTML = `
        <div style="margin-top: 48px; margin-bottom: 24px;">
          <div class="ad-slot ad-300x250" id="ad-tool-bottom">Advertisement</div>
        </div>
      `;
      mainContent.insertAdjacentHTML('beforeend', toolAdHTML);
    }
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

// Global hook to increment Devices Tested counter
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if ((path.startsWith('/tools/') || path.startsWith('/test/')) && path !== '/tools/' && path !== '/test/') {
    // We are on a tool page
    let count = parseInt(localStorage.getItem('techtest_devices_tested') || '0', 10);
    
    // To prevent rapid refreshing from spiking the number, we can store a session flag for this specific URL
    // Or just increment by 1 every load. The prompt says "increment ... every time a user runs any tool"
    // We'll just increment on load
    count += 1;
    localStorage.setItem('techtest_devices_tested', count.toString());
  }
});

