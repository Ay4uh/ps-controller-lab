'use strict';

// Main entry point for the Controller Lab application
import { initControllerManager } from './controller-manager.js';
import ControllerFactory from './controllers/controller-factory.js';
import { Storage } from './storage.js';
import { sleep } from './utils.js';
import { l } from './translations.js';

// Application State
const app = {
  controller: null,
  isConnected: false,
  isClone: false,
  isEdge: false,
  demoModeActive: false,
  hidDevice: null,
  btMacAddress: "",
  hwVersionHex: "",
  boardModel: "",
  compileDate: "",
  compileTime: "",
  swVersion: "",
  connectionType: "USB",
  gamepadIndex: -1,
  requestAnimationFrameId: 0,
  lastWebHidAxes: [0, 0, 0, 0],
  isTouchpadClicked: false,
  touchpadPoints: [
    { x: 0, y: 0, active: false, trail: [] },
    { x: 0, y: 0, active: false, trail: [] }
  ],
  sensorState: {
    gyroX: 0, gyroY: 0, gyroZ: 0,
    accelX: 0, accelY: 0, accelZ: 0
  },
  nvsState: 0,
  disable_btn: 0,
  last_disable_btn: 0,
  shownRangeCalibrationWarning: false,
  failedCalibrationDetectionsCount: 0,
  failedCalibrationModalShownCount: 0,
  centerCalibrationMethod: 'four-step',
  rangeCalibrationMethod: 'normal',
  lang_orig_text: {},
  lang_cur: {},
  lang_disabled: true,
  lang_cur_direction: "ltr",
  gj: 0,
  gu: 0
};

// Initialize the application
async function gboot() {
  app.gu = crypto.randomUUID();

  // Initialize controller manager
  app.controller = initControllerManager({ handleNvStatusUpdate });
  app.controller.setInputHandler(handleControllerInput);

  // Load templates, initialize analytics, language, etc.
  await initializeApp();

  // Check for HID support
  if (!("hid" in navigator)) {
    document.getElementById("offlinebar")?.hide();
    document.getElementById("onlinebar")?.hide();
    document.getElementById("missinghid")?.show();
    return;
  }

  // Show online status and update last connected info
  document.getElementById("offlinebar")?.show();
  document.getElementById("aboutdrift")?.show();
  updateLastConnectedInfo();

  // Set up disconnection handler
  navigator.hid.addEventListener("disconnect", handleDisconnectedDevice);
}

// Initialize the application (DOMContentLoaded or immediate)
async function initializeApp() {
  // Placeholder for template loading, analytics, language init, etc.
  console.log("Initializing application...");

  // In a real implementation, this would:
  // 1. Load all HTML templates
  // 2. Initialize analytics
  // 3. Initialize language system
  // 4. Show welcome modal
  // 5. Initialize calibration method preferences
  // 6. Set up event listeners

  // For now, just set up basic UI
  setupBasicEventListeners();
}

function setupBasicEventListeners() {
  // Connect button
  const connectBtn = document.getElementById("btnConnect");
  if (connectBtn) {
    connectBtn.addEventListener("click", triggerConnectDevice);
  }

  // Disconnect button
  const disconnectBtn = document.getElementById("btnDisconnect");
  if (disconnectBtn) {
    disconnectBtn.addEventListener("click", () => {
      handleDisconnect();
    });
  }
}

// Connect controller
async function triggerConnectDevice() {
  try {
    if (!navigator.hid) {
      showNotification("WebHID is not supported by your browser. Please use Chrome, Edge, or Opera.", "danger");
      return;
    }

    const supportedModels = ControllerFactory.getSupportedModels();
    const requestParams = { filters: supportedModels };
    let devices = await navigator.hid.getDevices(); // Already connected?
    if (devices.length === 0) {
      devices = await navigator.hid.requestDevice(requestParams);
    }
    if (devices.length === 0) {
      return;
    }

    const device = devices[0];
    await device.open();

    await handleConnect(device);
  } catch (err) {
    if (err.name === 'SecurityError' || err.message.includes('No device selected') || err.name === 'NotFoundError') {
      console.log("Device selection cancelled by user.");
      return;
    }
    console.error("Connection failed", err);
    showNotification("Connection failed: " + err.message, "danger");
  }
}

// Handle connected device
async function handleConnect(device) {
  app.hidDevice = device;
  app.isConnected = true;
  app.isClone = false;
  app.isEdge = false;
  app.demoModeActive = false;

  // Hide connection required screen, show app content
  document.getElementById("connectionRequiredScreen")?.classList.add("d-none");
  document.getElementById("appDashboardContent")?.classList.remove("d-none");

  // Reset variables
  app.btMacAddress = "";
  app.hwVersionHex = "";
  app.boardModel = "";
  app.compileDate = "";
  app.compileTime = "";
  app.swVersion = "";

  // Find Gamepad API Index and Connection Type
  locateGamepadIndex(device);

  // Show/hide appropriate buttons
  document.getElementById("btnDisconnect")?.classList.remove("d-none");
  document.getElementById("btnConnect")?.classList.add("d-none");
  document.getElementById("overviewInfoCard")?.classList.remove("opacity-50");
  document.getElementById("driftResultsRow")?.classList.remove("opacity-50");

  // Determine controller type
  const isDualSense = device.productId === 0x0CE6 || device.productId === 0x0DF2;
  const isDualShock = device.productId === 0x05C4 || device.productId === 0x09CC;
  app.isEdge = device.productId === 0x0DF2;

  let devName = device.productName || "Unknown Controller";
  if (device.productId === 0x05C4) devName = "DualShock 4 V1";
  if (device.productId === 0x09CC) devName = "DualShock 4 V2";
  if (device.productId === 0x0CE6) devName = "DualSense";
  if (device.productId === 0x0DF2) devName = "DualSense Edge";

  // Update device name in UI
  document.getElementById("overviewDevName")?.innerText = devName;
  document.getElementById("footerModelName")?.innerText = devName;
  document.getElementById("overviewDevStatus")?.innerText = "Connected via WebHID interface.";

  // Log connection
  console.log(`Connected: ${devName} (VID: 0x${device.vendorId.toString(16)}, PID: 0x${device.productId.toString(16)})`);

  // Show/hide Edge warning banner
  if (app.isEdge) {
    document.getElementById("edgeWarningBanner")?.classList.remove("d-none");
  } else {
    document.getElementById("edgeWarningBanner")?.classList.add("d-none");
  }

  // Read reports to get details
  try {
    if (isDualShock) {
      document.getElementById("ds4BoardModelContainer")?.classList.remove("d-none");

      // Read Bluetooth MAC Address from 0x12
      try {
        const macData = await receiveFeatureReport(device, 0x12);
        if (macData.byteLength >= 7) {
          const bytes = [];
          for (let i = 0; i < 6; i++) {
            const idx = 1 + (5 - i);
            bytes.push(macData.getUint8(idx).toString(16).toUpperCase().padStart(2, '0'));
          }
          app.btMacAddress = bytes.join(':');
          document.getElementById("infoMac")?.innerText = app.btMacAddress;
        }
      } catch (e) {
        console.warn("Failed to read MAC address", e);
      }

      // Read Version / Build Info from 0xA3
      let infoData = null;
      let failed0xA3 = false;
      try {
        infoData = await receiveFeatureReport(device, 0xA3);
      } catch (e) {
        console.warn("Failed to read report 0xA3", e);
        failed0xA3 = true;
      }

      // Clone detection 1: 0xA3 failed or size too small
      if (failed0xA3 || !infoData || infoData.byteLength < 48) {
        app.isClone = true;
      } else {
        // Parse compile date & time
        const bytes = new Uint8Array(infoData.buffer, infoData.byteOffset, infoData.byteLength);

        const dateBytes = bytes.subarray(0, 16);
        const timeBytes = bytes.subarray(16, 32);

        app.compileDate = new TextDecoder("ascii").decode(dateBytes).replace(/\0/g, '').trim();
        app.compileTime = new TextDecoder("ascii").decode(timeBytes).replace(/\0/g, '').trim();
        document.getElementById("infoBuildDate")?.innerText = `${app.compileDate} ${app.compileTime}`;

        // Hardware & software versions (little endian)
        const hwMajor = bytes[32] | (bytes[33] << 8);
        const hwMinor = bytes[34] | (bytes[35] << 8);
        const swMajor = bytes[36] | (bytes[37] << 8) | (bytes[38] << 16) | (bytes[39] << 24);
        const swMinor = bytes[40] | (bytes[41] << 8);

        app.hwVersionHex = `0x${hwMinor.toString(16).toUpperCase().padStart(4, '0')}`;
        app.swVersion = `${swMajor}.${swMinor}`;

        // Hardware board model parsing
        const hwUpperByte = (hwMinor >> 8) & 0xFF;
        if (hwUpperByte === 0x31) { app.boardModel = "JDM-001 (Type V1)"; }
        else if (hwUpperByte === 0x43) { app.boardModel = "JDM-011 (Type V1)"; }
        else if (hwUpperByte === 0x54) { app.boardModel = "JDM-030 (Type V2)"; }
        else if (hwUpperByte >= 0x64 && hwUpperByte <= 0x74) { app.boardModel = "JDM-040 (Type V2)"; }
        else if ((hwUpperByte >= 0x81 && hwUpperByte <= 0x83) || hwUpperByte === 0x93) { app.boardModel = "JDM-020 (Type V1)"; }
        else if (hwUpperByte === 0xA4 || hwUpperByte === 0x90 || hwUpperByte === 0xA0) { app.boardModel = "JDM-050 (Type V2)"; }
        else if (hwUpperByte === 0xB0) { app.boardModel = "JDM-055 (Scuf?) (Type V2)"; }
        else if (hwUpperByte === 0xB4) { app.boardModel = "JDM-055 (Type V2)"; }
        else { app.boardModel = `Unknown (Upper: 0x${hwUpperByte.toString(16).toUpperCase()})`; }

        document.getElementById("infoBoardModel")?.innerText = app.boardModel;
      }

      // Clone detection 2: try report 0x81
      try {
        await receiveFeatureReport(device, 0x81);
      } catch (e) {
        console.warn("Report 0x81 failed, clone likely", e);
        app.isClone = true;
      }
    } else if (isDualSense) {
      document.getElementById("ds4BoardModelContainer")?.classList.add("d-none");
      document.getElementById("dualsenseFineTuneCard")?.classList.remove("d-none");

      // Read feature report 0x20
      let infoData = null;
      let failed0x20 = false;
      try {
        infoData = await receiveFeatureReport(device, 0x20);
      } catch (e) {
        console.warn("Failed to read report 0x20", e);
        failed0x20 = true;
      }

      // Clone detection
      if (failed0x20 || !infoData || infoData.byteLength < 63) {
        app.isClone = true;
      } else {
        const bytes = new Uint8Array(infoData.buffer, infoData.byteOffset, infoData.byteLength);

        // build_date is 11 bytes, build_time is 8 bytes
        const dateBytes = bytes.subarray(0, 11);
        const timeBytes = bytes.subarray(11, 19);

        app.compileDate = new TextDecoder("ascii").decode(dateBytes).replace(/\0/g, '').trim();
        app.compileTime = new TextDecoder("ascii").decode(timeBytes).replace(/\0/g, '').trim();
        document.getElementById("infoBuildDate")?.innerText = `${app.compileDate} ${app.compileTime}`;

        // Check if build date contains letters (months) to confirm validity
        if (!/[A-Za-z]/.test(app.compileDate) || app.compileDate.length < 5) {
          app.isClone = true;
        }

        const fwVersion = bytes[27] | (bytes[28] << 8) | (bytes[29] << 16) | (bytes[30] << 24);
        const hwInfo = bytes[23] | (bytes[24] << 8) | (bytes[25] << 16) | (bytes[26] << 24);

        app.hwVersionHex = `0x${hwInfo.toString(16).toUpperCase().padStart(8, '0')}`;
        app.swVersion = `0x${fwVersion.toString(16).toUpperCase().padStart(8, '0')}`;

        // Read Bluetooth MAC Address for DualSense from report 0x81
        try {
          await sendFeatureReport(device, 0x80, new Uint8Array([9, 2]));
          await new Promise(r => setTimeout(r, 100));
          const macData = await receiveFeatureReport(device, 0x81);
          if (macData.byteLength >= 10) {
            const macBytes = [];
            for (let i = 0; i < 6; i++) {
              const idx = 4 + (5 - i);
              macBytes.push(macData.getUint8(idx).toString(16).toUpperCase().padStart(2, '0'));
            }
            app.btMacAddress = macBytes.join(':');
            document.getElementById("infoMac")?.innerText = app.btMacAddress;
          }
        } catch (e) {
          console.warn("Failed to read DualSense MAC address", e);
        }
      }
    }

    // Lock / Unlock status check for DS4
    if (isDualShock && !app.isClone) {
      await queryNvsStatus();
    } else {
      document.getElementById("nvsStatusText")?.innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-lock-open"></i> Unlocked (Ready)</span>`;
      app.nvsState = 0;
    }

    // Register Touchpad inputs if connected via WebHID
    device.addEventListener("inputreport", handleInputReport);

    // Start Gamepad loop
    if (app.requestAnimationFrameId) cancelAnimationFrame(app.requestAnimationFrameId);
    app.requestAnimationFrameId = requestAnimationFrame(pollGamepad);

    showNotification("Successfully connected to controller!", "success");
  } catch (err) {
    console.error("Failed to parse controller diagnostic", err);
    showNotification("Failed to fetch diagnostics: " + err.message, "danger");
    await disconnect();
  }
}

// Handle disconnection
async function handleDisconnect() {
  console.log("Disconnecting controller");

  if (!app.controller?.isConnected()) {
    app.controller = null;
    return;
  }

  app.gj = 0;
  app.disable_btn = 0;
  app.shownRangeCalibrationWarning = false;
  app.failedCalibrationDetectionsCount = 0;
  update_disable_btn();

  await app.controller.disconnect();
  app.controller = null;

  // Close all modals
  close_all_modals();

  // Update UI
  document.getElementById("offlinebar")?.show();
  document.getElementById("onlinebar")?.hide();
  document.getElementById("mainmenu")?.hide();
  document.getElementById("aboutdrift")?.show();
  updateLastConnectedInfo();
}

// Handle disconnected device event
async function handleDisconnectedDevice(e) {
  console.log("Disconnected: " + e.device.productName);
  await handleDisconnect();
}

// Locate Gamepad index
function locateGamepadIndex(hidDev) {
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i];
    if (gp) {
      if (gp.id.toLowerCase().includes("54c") || gp.id.toLowerCase().includes("playstation") || gp.id.toLowerCase().includes("sony")) {
        app.gamepadIndex = i;
        document.getElementById("infoConnectionType")?.innerText = gp.id.includes("Bluetooth") ? "Bluetooth" : "USB";
        app.connectionType = gp.id.includes("Bluetooth") ? "Bluetooth" : "USB";
        return;
      }
    }
  }
  app.gamepadIndex = 0;
  document.getElementById("infoConnectionType")?.innerText = "USB (Auto)";
}

// Placeholder functions for features that would need to be implemented
function showNotification(message, type) {
  console.log(`[${type}] ${message}`);
  // In a real implementation, this would show a toast notification
}

function close_all_modals() {
  // Placeholder for closing all modals
  console.log("Closing all modals");
}

function updateLastConnectedInfo() {
  // Placeholder for updating last connected info
  console.log("Updating last connected info");
}

function update_disable_btn() {
  // Placeholder for updating disable button state
  console.log("Updating disable button state");
}

// Poll Gamepad API for input
function pollGamepad() {
  if (app.gamepadIndex === -1) {
    app.requestAnimationFrameId = requestAnimationFrame(pollGamepad);
    return;
  }

  const gp = navigator.getGamepads()[app.gamepadIndex];
  if (gp) {
    // Process gamepad input
    // This would update the UI with button presses, axis movements, etc.
  }

  app.requestAnimationFrameId = requestAnimationFrame(pollGamepad);
}

// Handle input report from HID device
function handleInputReport(event) {
  // Process the input report and update controller state
  // This would delegate to the controller manager's processControllerInput method
  if (app.controller && app.controller.isConnected()) {
    app.controller.processControllerInput(event);
  }
}

// Send feature report to device
async function sendFeatureReport(device, reportId, data) {
  if (!device?.opened) {
    throw new Error('Device is not opened');
  }

  try {
    await device.sendFeatureReport(reportId, data);
  } catch (error) {
    throw new Error(`Failed to send feature report: ${error.message}`);
  }
}

// Receive feature report from device
async function receiveFeatureReport(device, reportId) {
  if (!device?.opened) {
    throw new Error('Device is not opened');
  }

  try {
    return await device.receiveFeatureReport(reportId);
  } catch (error) {
    throw new Error(`Failed to receive feature report: ${error.message}`);
  }
}

// Query NVS status
async function queryNvsStatus() {
  if (!app.controller?.isConnected()) return null;
  return await app.controller.queryNvStatus();
}

// Placeholder for showing popup
function show_popup(text, is_html = false) {
  console.log("Popup:", text);
  // In a real implementation, this would show a modal popup
}

// Export functions to global scope for HTML onclick handlers
window.gboot = gboot;
window.connect = triggerConnectDevice;
window.disconnect = handleDisconnect;

// Initialize the application when the module loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', gboot);
} else {
  gboot();
}