// Global ad and auth stats management helpers
window.incrementAdImpression = function() {
  const adsenseEnabled = localStorage.getItem('adsense_enabled') !== 'false';
  const user = localStorage.getItem('techtest_user');
  if (!adsenseEnabled || user) return;
  const val = parseInt(localStorage.getItem('ad_stats_impressions') || '0', 10) + 1;
  localStorage.setItem('ad_stats_impressions', val.toString());
  window.dispatchEvent(new CustomEvent('adStatsUpdated'));
};

window.incrementAdClick = function() {
  const adsenseEnabled = localStorage.getItem('adsense_enabled') !== 'false';
  const user = localStorage.getItem('techtest_user');
  if (!adsenseEnabled || user) return;
  const val = parseInt(localStorage.getItem('ad_stats_clicks') || '0', 10) + 1;
  localStorage.setItem('ad_stats_clicks', val.toString());
  window.dispatchEvent(new CustomEvent('adStatsUpdated'));
};

window.incrementAffiliateClick = function() {
  const val = parseInt(localStorage.getItem('ad_stats_aff_clicks') || '0', 10) + 1;
  localStorage.setItem('ad_stats_aff_clicks', val.toString());
  
  // Simulate a conversion randomly (10% chance) to log affiliate commission!
  if (Math.random() < 0.10) {
    const conversions = parseInt(localStorage.getItem('ad_stats_aff_conversions') || '0', 10) + 1;
    localStorage.setItem('ad_stats_aff_conversions', conversions.toString());
    const commission = parseFloat(localStorage.getItem('ad_stats_aff_commission') || '0.00') + 4.50; // $4.50 average commission
    localStorage.setItem('ad_stats_aff_commission', commission.toFixed(2));
  }
  
  window.dispatchEvent(new CustomEvent('adStatsUpdated'));
};

// Inject Global Styles for Auth Modal and Ad Slots
if (!document.getElementById('techtest-ads-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'techtest-ads-styles';
  styleEl.innerHTML = `
    /* Ad Slots styling */
    .ad-slot {
      background: var(--bg-hover) !important;
      border: 1px dashed var(--border) !important;
      border-radius: 8px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      padding: 16px !important;
      position: relative !important;
      overflow: hidden !important;
      min-height: 120px !important;
      transition: all 0.2s ease !important;
    }
    .ad-slot::before {
      content: 'SPONSORED' !important;
      position: absolute !important;
      top: 8px !important;
      left: 12px !important;
      font-size: 9px !important;
      font-weight: 700 !important;
      color: var(--text-muted) !important;
      letter-spacing: 0.5px !important;
    }
    
    /* Affiliate ad banner inside ad slot */
    .ad-affiliate-banner {
      width: 100% !important;
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 16px !important;
      text-decoration: none !important;
      color: var(--text-primary) !important;
    }
    .ad-affiliate-img {
      font-size: 32px !important;
      background: rgba(217, 119, 6, 0.1) !important;
      color: var(--accent-gold) !important;
      width: 50px !important;
      height: 50px !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }
    .ad-affiliate-content {
      flex: 1 !important;
      text-align: left !important;
    }
    .ad-affiliate-title {
      font-weight: 700 !important;
      font-size: 14px !important;
      margin: 0 0 4px 0 !important;
    }
    .ad-affiliate-desc {
      font-size: 12px !important;
      color: var(--text-secondary) !important;
      margin: 0 !important;
      line-height: 1.4 !important;
    }
    .ad-affiliate-btn {
      background: var(--accent-gold) !important;
      color: white !important;
      padding: 8px 16px !important;
      border-radius: 6px !important;
      font-weight: 600 !important;
      font-size: 12px !important;
      border: none !important;
      cursor: pointer !important;
      flex-shrink: 0 !important;
      transition: opacity 0.2s !important;
    }
    .ad-affiliate-btn:hover {
      opacity: 0.9 !important;
    }
    
    /* Auth Modal Overlay */
    .auth-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .auth-modal-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .auth-modal {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      width: 360px;
      padding: 32px;
      position: relative;
      transform: translateY(-20px);
      transition: transform 0.3s ease;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    .auth-modal-overlay.show .auth-modal {
      transform: translateY(0);
    }
    .auth-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--text-secondary);
    }
    .auth-modal-tabs {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
    }
    .auth-tab {
      background: none;
      border: none;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      color: var(--text-muted);
      padding-bottom: 8px;
      transition: all 0.2s;
    }
    .auth-tab.active {
      color: var(--text-primary);
      border-bottom: 2px solid var(--text-primary);
      font-weight: 700;
    }
    
    .auth-form-group {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .auth-form-group label {
      font-weight: 600;
      font-size: 12px;
      color: var(--text-secondary);
    }
    .auth-form-input {
      background: var(--bg-base);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px;
      font-size: 14px;
      color: var(--text-primary);
      outline: none;
      width: 100%;
    }
    .auth-submit-btn {
      width: 100%;
      background: var(--text-primary);
      color: var(--bg-card);
      border: none;
      padding: 12px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .auth-submit-btn:hover {
      opacity: 0.9;
    }
  `;
  document.head.appendChild(styleEl);
}

// Global modal management
window.openAuthModal = function() {
  let modalOverlay = document.getElementById('authModalOverlay');
  if (!modalOverlay) {
    const modalHTML = `
      <div class="auth-modal-overlay" id="authModalOverlay">
        <div class="auth-modal">
          <button class="auth-modal-close" id="btnAuthClose">&times;</button>
          
          <div class="auth-modal-tabs">
            <button id="authTabLogin" class="auth-tab active">Log In</button>
            <button id="authTabSignup" class="auth-tab">Sign Up</button>
          </div>
          
          <form id="authForm">
            <div class="auth-form-group">
              <label for="authUsername">Username</label>
              <input type="text" id="authUsername" required placeholder="Enter username" class="auth-form-input">
            </div>
            <div class="auth-form-group">
              <label for="authPassword">Password</label>
              <input type="password" id="authPassword" required placeholder="Enter password" class="auth-form-input">
            </div>
            <button type="submit" id="authSubmitBtn" class="auth-submit-btn">Log In</button>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalOverlay = document.getElementById('authModalOverlay');
    
    const btnAuthClose = document.getElementById('btnAuthClose');
    const authTabLogin = document.getElementById('authTabLogin');
    const authTabSignup = document.getElementById('authTabSignup');
    const authForm = document.getElementById('authForm');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    let isSignup = false;
    
    btnAuthClose.addEventListener('click', window.closeAuthModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) window.closeAuthModal();
    });
    
    authTabLogin.addEventListener('click', () => {
      isSignup = false;
      authTabLogin.classList.add('active');
      authTabSignup.classList.remove('active');
      authSubmitBtn.textContent = 'Log In';
    });
    
    authTabSignup.addEventListener('click', () => {
      isSignup = true;
      authTabSignup.classList.add('active');
      authTabLogin.classList.remove('active');
      authSubmitBtn.textContent = 'Sign Up';
    });
    
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('authUsername').value.trim();
      if (username) {
        localStorage.setItem('techtest_user', username);
        localStorage.setItem('techtest_karma', isSignup ? '1' : '100');
        window.updateNavbarUser();
        window.closeAuthModal();
        window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { loggedIn: true, username } }));
      }
    });
  }
  
  modalOverlay.classList.add('show');
};

window.closeAuthModal = function() {
  const modalOverlay = document.getElementById('authModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('show');
  }
};

window.updateNavbarUser = function() {
  const container = document.getElementById('userNavbarContainer');
  if (!container) return;
  
  const user = localStorage.getItem('techtest_user');
  const karma = localStorage.getItem('techtest_karma') || '100';
  
  if (user) {
    container.innerHTML = `
      <div class="user-nav-profile" style="display: flex; align-items: center; gap: 8px; background: var(--bg-hover); border: 1px solid var(--border); padding: 4px 10px; border-radius: 20px;">
        <span class="user-nav-name" style="font-weight: 600; font-size: 12px; color: var(--text-primary);">u/${user}</span>
        <span class="user-nav-karma" style="font-size: 11px; color: var(--accent-gold); font-weight: 700; background: rgba(217,119,6,0.1); padding: 2px 6px; border-radius: 10px; display: flex; align-items: center; gap: 3px;"><i class="fa-solid fa-star"></i> ${karma}</span>
        <button id="btnNavbarLogout" title="Logout" style="background: none; border: none; padding: 0; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; margin-left: 4px;"><i class="fa-solid fa-right-from-bracket"></i></button>
      </div>
    `;
    
    document.getElementById('btnNavbarLogout').addEventListener('click', () => {
      localStorage.removeItem('techtest_user');
      localStorage.removeItem('techtest_karma');
      window.updateNavbarUser();
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { loggedIn: false } }));
    });
  } else {
    container.innerHTML = `
      <button id="btnNavbarLogin" style="background: var(--text-primary); color: var(--bg-card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; transition: opacity 0.2s;">Log In</button>
    `;
    
    document.getElementById('btnNavbarLogin').addEventListener('click', () => {
      window.openAuthModal();
    });
  }
};

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
          <img src="/logo.png" alt="TechTest Logo" class="logo-img">
          <span>TechTest</span>
        </a>
        <div class="topnav-divider"></div>
        <div class="topnav-links">
          <a href="/" class="topnav-link ${window.location.pathname === '/' || window.location.pathname.startsWith('/tools/') ? 'active' : ''}">Tools</a>
          <a href="/repair-guides/" class="topnav-link ${window.location.pathname.startsWith('/repair-guides/') ? 'active' : ''}">Repair Guides</a>
          <a href="/answers/" class="topnav-link ${window.location.pathname.startsWith('/answers/') ? 'active' : ''}">Answers</a>
        </div>
      </div>
      <div class="topnav-right" style="display: flex; align-items: center; gap: 8px;">
        <div id="userNavbarContainer" style="display: inline-flex; align-items: center; gap: 8px;"></div>
        <button class="topnav-theme-toggle" id="btnToggleTheme" title="Toggle Theme" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 16px; padding: 8px; display: flex; align-items: center; justify-content: center; transition: color 0.2s;"><i class="fa-solid fa-moon"></i></button>
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
  window.updateNavbarUser();

  // Hook up global navbar logic (drawer, mobile menu, dark mode)
  const btnToggleSearch = document.getElementById('btnToggleSearch');
  const searchDrawer = document.getElementById('searchDrawer');
  const searchInput = document.getElementById('searchInput');
  const btnToggleMobileMenu = document.getElementById('btnToggleMobileMenu');
  const mobileDropdown = document.getElementById('mobileDropdown');
  const btnToggleTheme = document.getElementById('btnToggleTheme');

  if (btnToggleSearch && searchDrawer) {
    btnToggleSearch.addEventListener('click', (e) => {
      e.stopPropagation();
      searchDrawer.classList.toggle('open');
      if (searchDrawer.classList.contains('open')) {
        setTimeout(() => searchInput.focus(), 50);
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchDrawer.contains(e.target) && e.target !== btnToggleSearch) {
        searchDrawer.classList.remove('open');
      }
    });

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

    mobileDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDropdown.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileDropdown.contains(e.target) && e.target !== btnToggleMobileMenu) {
        mobileDropdown.classList.remove('open');
      }
    });
  }

  if (btnToggleTheme) {
    const icon = btnToggleTheme.querySelector('i');
    
    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('techtest_theme', theme);
      if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    };

    // Initialize theme based on localStorage or system preferences
    const savedTheme = localStorage.getItem('techtest_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    btnToggleTheme.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
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



  } else if (!isToolsPath && layout) {
    layout.classList.add('no-sidebar');
  }

  // Inject Tool Page AdBlock
  if (isToolsPath) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      // Inject container if missing
      let adContainer = document.getElementById('dynamic-tool-ad-container');
      if (!adContainer) {
        mainContent.insertAdjacentHTML('beforeend', `<div id="dynamic-tool-ad-container" style="margin-top: 48px; margin-bottom: 24px; display: flex; justify-content: center;"></div>`);
        adContainer = document.getElementById('dynamic-tool-ad-container');
      }
      
      const renderToolAd = () => {
        const adsenseEnabled = localStorage.getItem('adsense_enabled') !== 'false';
        const user = localStorage.getItem('techtest_user');
        
        if (adsenseEnabled && !user) {
          adContainer.innerHTML = `
            <div class="ad-slot ad-300x250" id="ad-tool-bottom" style="cursor: pointer; width: 100%; max-width: 600px;">
              <a href="https://www.amazon.com/Arctic-MX-6-Carbon-Based-Performance-Durability/dp/B09VDNKY14" target="_blank" class="ad-affiliate-banner" data-ad-id="mx6_paste_tool">
                <div class="ad-affiliate-img">🧪</div>
                <div class="ad-affiliate-content">
                  <h4 class="ad-affiliate-title">Fix Thermal Throttling: ARCTIC MX-6 (4g)</h4>
                  <p class="ad-affiliate-desc">Ultimate performance carbon-based thermal paste. Perfect for GPU/CPU repasting. 20% cooler temps guaranteed.</p>
                </div>
                <button class="ad-affiliate-btn">Buy on Amazon</button>
              </a>
            </div>
          `;
          
          // Track impressions
          if (window.incrementAdImpression) {
            window.incrementAdImpression();
          }
          
          // Add click listener
          adContainer.querySelector('a').addEventListener('click', () => {
            if (window.incrementAdClick) window.incrementAdClick();
            if (window.incrementAffiliateClick) window.incrementAffiliateClick();
          });
        } else {
          adContainer.innerHTML = '';
        }
      };
      
      renderToolAd();
      
      // Re-render when auth changes or ads settings change
      window.addEventListener('authStateChanged', renderToolAd);
      window.addEventListener('adsSettingsChanged', renderToolAd);
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

// Global hook to increment Devices Tested counter and check Legal Consent
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if ((path.startsWith('/tools/') || path.startsWith('/test/')) && path !== '/tools/' && path !== '/test/') {
    // We are on a tool page
    let count = parseInt(localStorage.getItem('devices_tested') || '0', 10);
    count += 1;
    localStorage.setItem('devices_tested', count.toString());
  }

  // Legal Consent Check
  if (!localStorage.getItem('techtest_legal_consent')) {
    const isToolsPage = (path.startsWith('/tools/') || path.startsWith('/test/')) && path !== '/tools/' && path !== '/test/';
    
    if (isToolsPage) {
      const modalHTML = `
        <div class="legal-consent-overlay" id="legalConsentOverlay">
          <div class="legal-consent-modal">
            <h2><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i> Legal Disclaimer</h2>
            <div class="legal-alert">
              <p style="color: #b91c1c; font-weight: 700; margin-bottom: 4px;">WARNING: EXTREMELY IMPORTANT LIABILITY DISCLAIMER</p>
              <p style="color: #991b1b; font-size: 14px;">By using this website, you agree that TechTest and its creators are NOT liable for any damages, hardware failure, data loss, or illegal activities resulting from the use of our tools or repair guides. All tools and guides are provided "AS IS" without warranty of any kind.</p>
            </div>
            <p>Please review our <a href="/policies/" target="_blank" style="color: var(--accent-blue);">Policies & Legal</a> terms. You must agree to these terms to use any of the diagnostic tools or guides provided on this platform.</p>
            <div class="legal-consent-actions">
              <button class="legal-btn-cancel" id="btnLegalCancel">Cancel</button>
              <button class="legal-btn-agree" id="btnLegalAgree">Yes, I agree</button>
            </div>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      
      setTimeout(() => {
        document.getElementById('legalConsentOverlay').classList.add('show');
      }, 10);

      document.getElementById('btnLegalAgree').addEventListener('click', () => {
        localStorage.setItem('techtest_legal_consent', 'true');
        const overlay = document.getElementById('legalConsentOverlay');
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
        
        const banner = document.getElementById('legalConsentBanner');
        if (banner) banner.remove();
      });

      document.getElementById('btnLegalCancel').addEventListener('click', () => {
        if (window.history.length > 1 && document.referrer) {
          window.history.back();
        } else {
          window.location.href = 'https://google.com';
        }
      });
    } else {
      const bannerHTML = `
        <div class="legal-consent-banner" id="legalConsentBanner">
          <div class="legal-banner-content">
            <span class="legal-banner-title"><i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-yellow);"></i> Disclaimer Notice</span>
            <p class="legal-banner-text">By using our services, you agree to our <a href="/policies/" target="_blank">Policies & Legal</a> terms. We are not liable for damages resulting from using our browser diagnostic tools or guides.</p>
          </div>
          <div class="legal-banner-actions">
            <button class="legal-btn-agree-banner" id="btnLegalAgreeBanner">I Agree</button>
            <button class="legal-btn-close-banner" id="btnLegalCloseBanner" title="Dismiss"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', bannerHTML);
      
      setTimeout(() => {
        const banner = document.getElementById('legalConsentBanner');
        if (banner) banner.classList.add('show');
      }, 10);

      document.getElementById('btnLegalAgreeBanner').addEventListener('click', () => {
        localStorage.setItem('techtest_legal_consent', 'true');
        const banner = document.getElementById('legalConsentBanner');
        if (banner) {
          banner.classList.remove('show');
          setTimeout(() => banner.remove(), 300);
        }
      });

      document.getElementById('btnLegalCloseBanner').addEventListener('click', () => {
        const banner = document.getElementById('legalConsentBanner');
        if (banner) {
          banner.classList.remove('show');
          setTimeout(() => banner.remove(), 300);
        }
      });
    }
  }
});


