'use strict';

import BaseController from './base-controller.js';
import { sleep, buf2hex, dec2hex, format_mac_from_view } from '../utils.js';
import { l } from '../translations.js';

// Xbox Button mapping configuration
const XBOX_BUTTON_MAP = [
  { name: 'up', byte: 1, mask: 0x0 }, // Dpad handled separately
  { name: 'right', byte: 1, mask: 0x1 },
  { name: 'down', byte: 1, mask: 0x2 },
  { name: 'left', byte: 1, mask: 0x3 },
  { name: 'x', byte: 2, mask: 0x10, svg: 'X' },
  { name: 'y', byte: 2, mask: 0x20, svg: 'Y' },
  { name: 'a', byte: 2, mask: 0x40, svg: 'A' },
  { name: 'b', byte: 2, mask: 0x80, svg: 'B' },
  { name: 'lb', byte: 3, mask: 0x01, svg: 'LB' },
  { name: 'lt', byte: 3, mask: 0x02, svg: 'LT' }, // analog handled separately
  { name: 'rb', byte: 3, mask: 0x04, svg: 'RB' },
  { name: 'rt', byte: 3, mask: 0x08, svg: 'RT' }, // analog handled separately
  { name: 'view', byte: 3, mask: 0x10, svg: 'View' },
  { name: 'menu', byte: 3, mask: 0x20, svg: 'Menu' },
  { name: 'xbox', byte: 3, mask: 0x40, svg: 'Xbox' },
  { name: 'ls', byte: 3, mask: 0x80, svg: 'LS' },
  { name: 'rs', byte: 4, mask: 0x01, svg: 'RS' },
  { name: 'share', byte: 4, mask: 0x02, svg: 'Share' },
];

// Xbox Input processing configuration
const XBOX_INPUT_CONFIG = {
  buttonMap: XBOX_BUTTON_MAP,
  dpadByte: 1,
  l2AnalogByte: 6, // LT analog
  r2AnalogByte: 7, // RT analog
  lxAnalogByte: 0, // Left stick X
  lyAnalogByte: 0, // Left stick Y (same byte, different bits)
  rxAnalogByte: 2, // Right stick X
  ryAnalogByte: 2, // Right stick Y (same byte, different bits)
};

// Xbox Output Report Constants (simplified)
const XBOX_OUTPUT_REPORT = {
  USB_REPORT_ID: 0x01,
};

// Basic Xbox Output Structure for vibration control
class XboxOutputStruct {
  constructor(currentState = null) {
    // Create a 20-byte buffer for Xbox output report (USB)
    this.buffer = new ArrayBuffer(20);
    this.view = new DataView(this.buffer);

    // Control flags
    this.flags = currentState?.flags || 0;

    // Vibration motors
    this.leftMotor = currentState?.leftMotor || 0;
    this.rightMotor = currentState?.rightMotor || 0;

    // LED control (if supported)
    this.ledNumber = currentState?.ledNumber || 0;
    this.ledMode = currentState?.ledMode || 0;
  }

  // Pack the data into the output buffer
  pack() {
    // Byte 0: Report ID
    this.view.setUint8(0, 0x01);

    // Byte 1: Flags
    this.view.setUint8(1, this.flags);

    // Bytes 2-3: Left motor (rumble)
    this.view.setUint16(2, this.leftMotor, true);

    // Bytes 4-5: Right motor (rumble)
    this.view.setUint16(4, this.rightMotor, true);

    // Bytes 6-7: LED control
    this.view.setUint8(6, this.ledNumber);
    this.view.setUint8(7, this.ledMode);

    // Bytes 8-19: Reserved/zero
    for (let i = 8; i < 20; i++) {
      this.view.setUint8(i, 0);
    }

    return this.buffer;
  }
}

/**
* Xbox Controller implementation
*/
class XboxController extends BaseController {
  constructor(device) {
    super(device);
    this.model = "Xbox";

    // Initialize current output state to track controller settings
    this.currentOutputState = {
      flags: 0,
      leftMotor: 0,
      rightMotor: 0,
      ledNumber: 0,
      ledMode: 0,
    };
  }

  getInputConfig() {
    return XBOX_INPUT_CONFIG;
  }

  async getSerialNumber() {
    // For Xbox controllers, we'll try to get a unique identifier
    // This is a simplified implementation - in reality, Xbox controllers
    // don't expose serial numbers via standard HID feature reports
    try {
      // Try to get device info first
      const info = await this.getInfo();
      if (info.ok && info.infoItems) {
        // Look for Bluetooth address or other unique identifier
        for (const item of info.infoItems) {
          if (item.key === l("Bluetooth Address") ||
              item.key === l("Device Path") ||
              item.key === l("USB Serial Number")) {
            return item.value;
          }
        }
      }
    } catch (e) {
      console.warn("Could not get serial number from info:", e);
    }

    // Fallback to a placeholder based on device ID
    return `Xbox_${this.device.vendorId.toString(16)}_${this.device.productId.toString(16)}`;
  }

  async getInfo() {
    // Device-only: collect info and return a common structure; do not touch the DOM
    try {
      // Xbox controllers typically don't have extensive feature reports like PlayStation controllers
      // We'll provide basic information
      const infoItems = [
        { key: l("Device Type"), value: "Xbox Controller", cat: "hw" },
        { key: l("Vendor ID"), value: `0x${this.device.vendorId.toString(16).toUpperCase()}`, cat: "hw" },
        { key: l("Product ID"), value: `0x${this.device.productId.toString(16).toUpperCase()}`, cat: "hw" },
        { key: l("Connection Type"), value: "USB", cat: "hw" },
      ];

      // Try to get additional info based on controller type
      switch (this.device.productId) {
        case 0x0b00: // Xbox Wireless Controller
          infoItems.push({ key: l("Model"), value: "Xbox Wireless Controller (Model 1708)", cat: "hw" });
          break;
        case 0x0b05: // Xbox Elite Wireless Controller Series 2
          infoItems.push({ key: l("Model"), value: "Xbox Elite Wireless Controller Series 2", cat: "hw" });
          break;
        case 0x0b06: // Xbox Adaptive Controller
          infoItems.push({ key: l("Model"), value: "Xbox Adaptive Controller", cat: "hw" });
          break;
        case 0x0b12: // Xbox Series X|S Controller
          infoItems.push({ key: l("Model"), value: "Xbox Series X|S Controller", cat: "hw" });
          break;
        default:
          infoItems.push({ key: l("Model"), value: "Unknown Xbox Controller", cat: "hw" });
      }

      // Add battery info placeholder
      infoItems.push({ key: l("Battery Level"), value: "Unknown", cat: "fw" });

      return { ok: true, infoItems, nv: { status: 'unknown' }, disable_bits: 0 };
    } catch (error) {
      return { ok: false, error, disable_bits: 1 };
    }
  }

  async flash(progressCallback = null) {
    // Xbox controllers don't have NVS to flash in the same way as PlayStation controllers
    // This would typically involve firmware updates via Windows/Xbox accessories app
    return { success: true, message: "Xbox controllers don't support flashing via this interface. Use Xbox Accessories app for firmware updates." };
  }

  async reset() {
    // Xbox controllers don't have a standard HID reset command
    return { success: true, message: "Controller reset not supported via HID" };
  }

  async nvsLock() {
    // Xbox controllers don't have NVS in the same sense as PlayStation controllers
    return { ok: true, message: "NVS lock not applicable to Xbox controllers" };
  }

  async nvsUnlock() {
    // Xbox controllers don't have NVS in the same sense as PlayStation controllers
    return { ok: true, message: "NVS unlock not applicable to Xbox controllers" };
  }

  async getBdAddr() {
    // Try to get Bluetooth address if available
    try {
      // This would be controller-specific and might not work for all Xbox controllers
      // For now, return placeholder
      return "00:00:00:00:00:00";
    } catch (error) {
      return "00:00:00:00:00:00";
    }
  }

  // Xbox controllers don't support the same calibration features as PlayStation controllers
  async calibrateRangeBegin() {
    return { ok: false, error: new Error("Calibration not supported on Xbox controllers") };
  }

  async calibrateRangeEnd() {
    return { ok: false, error: new Error("Calibration not supported on Xbox controllers") };
  }

  async calibrateSticksBegin() {
    return { ok: false, error: new Error("Calibration not supported on Xbox controllers") };
  }

  async calibrateSticksSample() {
    return { ok: false, error: new Error("Calibration not supported on Xbox controllers") };
  }

  async calibrateSticksEnd() {
    return { ok: false, error: new Error("Calibration not supported on Xbox controllers") };
  }

  async queryNvStatus() {
    return { device: 'xbox', status: 'unknown', locked: null };
  }

  /**
   * Send output report to the Xbox controller
   * @param {ArrayBuffer} data - The output report data
   */
  async sendOutputReport(data, reason = "") {
    if (!this.device?.opened) {
      throw new Error('Device is not opened');
    }
    try {
      await this.device.sendReport(XBOX_OUTPUT_REPORT.USB_REPORT_ID, new Uint8Array(data));
    } catch (error) {
      throw new Error(`Failed to send output report: ${error.message}`);
    }
  }

  /**
   * Update the current output state with values from an OutputStruct
   * @param {XboxOutputStruct} outputStruct - The output structure to copy state from
   */
  updateCurrentOutputState(outputStruct) {
    this.currentOutputState = { ...outputStruct };
  }

  /**
   * Get a copy of the current output state
   * @returns {Object} A copy of the current output state
   */
  getCurrentOutputState() {
    return { ...this.currentOutputState };
  }

  /**
   * Initialize the current output state when the controller is first connected.
   */
  async initializeCurrentOutputState() {
    try {
      // Reset all output state to known defaults
      this.currentOutputState = {
        ...this.getCurrentOutputState(),
        flags: 0,
        leftMotor: 0,
        rightMotor: 0,
        ledNumber: 0,
        ledMode: 0,
      };

      // Send a "reset" output report to ensure the controller is in a known state
      const resetOutputStruct = new XboxOutputStruct(this.currentOutputState);
      await this.sendOutputReport(resetOutputStruct.pack(), 'init default states');

      // Update our state to reflect what we just sent
      this.updateCurrentOutputState(resetOutputStruct);
    } catch (error) {
      console.warn("Failed to initialize Xbox output state:", error);
      // Even if the reset fails, we still have the default state initialized
    }
  }

  /**
   * Set vibration motors for haptic feedback
   * @param {number} left - Left motor intensity (0-65535)
   * @param {number} right - Right motor intensity (0-65535)
   */
  async setVibration(left = 0, right = 0) {
    try {
      // Clamp values to valid range
      const leftClamped = Math.max(0, Math.min(65535, Math.floor(left)));
      const rightClamped = Math.max(0, Math.min(65535, Math.floor(right)));

      const { flags } = this.currentOutputState;
      const outputStruct = new XboxOutputStruct({
        ...this.currentOutputState,
        leftMotor: leftClamped,
        rightMotor: rightClamped,
        flags: flags | 0x08, // Enable vibration
      });
      await this.sendOutputReport(outputStruct.pack(), 'set vibration');
      outputStruct.flags &= ~0x08; // Disable vibration flag after sending

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);

      return { success: true, message: "Vibration set successfully" };
    } catch (error) {
      throw new Error("Failed to set vibration", { cause: error });
    }
  }

  /**
   * Xbox controllers don't support adaptive triggers
   */
  async setAdaptiveTrigger(left, right) {
    return { success: true, message: "This controller does not support adaptive triggers" };
  }

  /**
   * Xbox controllers don't support adaptive trigger presets
   */
  async setAdaptiveTriggerPreset(config) {
    return { success: true, message: "This controller does not support adaptive trigger presets" };
  }

  /**
   * Xbox controllers don't support speaker tone via HID
   */
  async setSpeakerTone(output = "speaker") {
    return { success: true, message: "This controller does not support speaker tone via HID" };
  }

  /**
   * Xbox controllers don't support configurable lights via HID
   */
  async resetLights() {
    return { success: true, message: "This controller does not support configurable lights" };
  }

  /**
   * Xbox controllers don't support mute LED via HID
   */
  async setMuteLed(mode) {
    return { success: true, message: "This controller does not support mute LED" };
  }

  /**
   * Xbox controllers don't support lightbar color via HID
   */
  async setLightbarColor(r, g, b) {
    return { success: true, message: "This controller does not support lightbar color" };
  }

  /**
   * Xbox controllers don't support player indicators via HID
   */
  async setPlayerIndicator(pattern) {
    return { success: true, message: "This controller does not support player indicators" };
  }

  getNumberOfSticks() {
    return 2;
  }

  /**
   * Parse Xbox battery status from input data
   * Note: Xbox controller battery reporting varies by model and connection type
   */
  parseBatteryStatus(data) {
    // This is a simplified implementation - actual Xbox battery reporting
    // is more complex and varies by controller type and connection method
    try {
      // For many Xbox controllers, battery info is in specific reports
      // This is a placeholder implementation

      // Try to get battery level from certain known positions
      // This will vary significantly by controller model and firmware
      let charge_level = 50; // Default placeholder
      let is_charging = false;
      let cable_connected = false;
      let is_error = false;

      // Some Xbox controllers report battery in byte 10 or similar
      // This is highly speculative and would need to be adjusted based on actual controller behavior
      if (data.byteLength > 10) {
        const batteryByte = data.getUint8(10);
        if (batteryByte !== 0xff) { // 0xff often means unknown/not available
          charge_level = Math.min(batteryByte, 100);
        }
      }

      return { charge_level, cable_connected, is_charging, is_error };
    } catch (error) {
      // Return default values if we can't parse battery status
      return { charge_level: 0, cable_connected: false, is_charging: false, is_error: true };
    }
  }

  /**
   * Get the list of supported quick tests for Xbox controller
   * Xbox controllers don't support adaptive triggers, touchpad, or some other features
   * @returns {Array<string>} Array of supported test types
   */
  getSupportedQuickTests() {
    return ['usb', 'buttons', 'haptic', 'lights']; // Xbox controllers support rumble/vibration
  }
}

export default XboxController;