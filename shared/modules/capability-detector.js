/**
 * TechTest Hardware Capability & Browser Compatibility Detector
 * Evaluates WebHID, WebUSB, WebGPU, WebGL2, Web Audio API, Gamepad API, and Service Workers.
 */

export class CapabilityDetector {
  static checkCapabilities() {
    const isChromium = !!(window.chrome || navigator.userAgent.includes('Edg/'));
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

    return {
      webhid: 'hid' in navigator,
      webusb: 'usb' in navigator,
      webgpu: 'gpu' in navigator,
      webgl2: (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
          return false;
        }
      })(),
      webgl: (() => {
        try {
          const canvas = document.createElement('canvas');
          return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
          return false;
        }
      })(),
      webaudio: !!(window.AudioContext || window.webkitAudioContext),
      gamepad: 'getGamepads' in navigator,
      serviceworker: 'serviceWorker' in navigator,
      wakelock: 'wakeLock' in navigator,
      touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      browser: {
        isChromium,
        isSafari,
        isFirefox,
        userAgent: navigator.userAgent
      }
    };
  }

  /**
   * Injects a persistent or dismissible compatibility banner if WebHID is unavailable on a tool that requires it.
   * @param {string} toolName 
   * @param {HTMLElement} mountTarget 
   */
  static renderNoticeIfUnsupported(toolName = 'Hardware Calibration', mountTarget = document.body) {
    const caps = this.checkCapabilities();
    if (caps.webhid) return; // WebHID is supported, no alert needed

    if (document.getElementById('techtest-browser-compat-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'techtest-browser-compat-banner';
    banner.className = 'techtest-compat-banner';
    banner.setAttribute('role', 'alert');
    banner.innerHTML = `
      <div class="techtest-compat-content">
        <div class="techtest-compat-icon">⚠️</div>
        <div class="techtest-compat-text">
          <strong>Chromium Browser Recommended:</strong>
          <span>${toolName} requires direct WebHID communication. Your current browser (${caps.browser.isSafari ? 'Safari' : caps.browser.isFirefox ? 'Firefox' : 'Unsupported Browser'}) blocks low-level USB/Bluetooth device access. Please use <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, or <strong>Brave</strong> on Desktop for full hardware diagnostics and NVS calibration.</span>
        </div>
        <button type="button" class="techtest-compat-dismiss" aria-label="Dismiss banner" onclick="this.closest('#techtest-browser-compat-banner').remove()">×</button>
      </div>
    `;

    // Inject styles if not present
    if (!document.getElementById('techtest-compat-banner-style')) {
      const style = document.createElement('style');
      style.id = 'techtest-compat-banner-style';
      style.textContent = `
        .techtest-compat-banner {
          background: #fffbeb;
          border-bottom: 2px solid #f59e0b;
          color: #92400e;
          padding: 12px 20px;
          position: sticky;
          top: 0;
          z-index: 10000;
          font-family: var(--font-body, system-ui, sans-serif);
          font-size: 13px;
          line-height: 1.5;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        [data-theme="dark"] .techtest-compat-banner {
          background: #451a03;
          border-color: #b45309;
          color: #fef3c7;
        }
        .techtest-compat-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .techtest-compat-icon {
          font-size: 20px;
          flex-shrink: 0;
        }
        .techtest-compat-text {
          flex: 1;
        }
        .techtest-compat-dismiss {
          background: transparent;
          border: none;
          font-size: 20px;
          line-height: 1;
          color: inherit;
          cursor: pointer;
          padding: 4px 8px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .techtest-compat-dismiss:hover {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }

    mountTarget.prepend(banner);
  }
}

if (typeof window !== 'undefined') {
  window.CapabilityDetector = CapabilityDetector;
}
