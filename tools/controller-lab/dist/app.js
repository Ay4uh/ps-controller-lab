/**
* Utility functions for controller lab
*/

/**
* Sleep for a specified number of milliseconds
* @param {number} ms - Milliseconds to sleep
* @returns {Promise} Promise that resolves after sleep
*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* Convert buffer to hex string
* @param {ArrayBuffer} buffer - Buffer to convert
* @returns {string} Hexadecimal string representation
*/
function buf2hex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/**
* Convert decimal to hex string
* @param {number} num - Number to convert
* @returns {string} Hexadecimal string representation
*/
function dec2hex(num) {
  return num.toString(16);
}

/**
* Convert decimal to 32-bit hex string (zero-padded to 8 characters)
* @param {number} num - Number to convert
* @returns {string} 32-bit hexadecimal string representation
*/
function dec2hex32$1(num) {
  return ('00000000' + num.toString(16)).slice(-8);
}

/**
* Format MAC address from DataView
* @param {DataView} view - DataView containing MAC address bytes
* @param {number} start - Starting index of MAC address in view
* @returns {string} Formatted MAC address (XX:XX:XX:XX:XX:XX)
*/
function format_mac_from_view(view, start) {
  const bytes = [];
  for (let i = 0; i < 6; i++) {
    bytes.push(view.getUint8(start + i).toString(16).toUpperCase().padStart(2, '0'));
  }
  return bytes.join(':');
}

/**
* Reverse a string
* @param {string} str - String to reverse
* @returns {string} Reversed string
*/
function reverse_str(str) {
  return str.split('').reverse().join('');
}

/**
* Simple translation utility
*/
const translations = {
  en: {
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Information",
    "unknown": "Unknown",
    "original": "Original",
    "clone": "Clone",
    "locked": "Locked",
    "unlocked": "Unlocked",
    "pending_reboot": "Pending Reboot",
    "USB Req.": "USB Required",
    "No controller connected": "No controller connected",
    "NVS Lock failed": "NVS Lock failed",
    "Adaptive triggers are only supported on DualSense controllers": "Adaptive triggers are only supported on DualSense controllers",
    "Controller does not support adaptive trigger control": "Controller does not support adaptive trigger control",
    "Failed to disable adaptive trigger": "Failed to disable adaptive trigger",
    "Invalid preset": "Invalid preset",
    "Custom preset requires start, end, and force parameters": "Custom preset requires start, end, and force parameters",
    "Failed to set vibration": "Failed to set vibration",
    "Failed to set speaker tone": "Failed to set speaker tone",
    "Failed to reset speaker settings": "Failed to reset speaker settings",
    "Failed to set lightbar color": "Failed to set lightbar color",
    "Failed to set player indicator": "Failed to set player indicator",
    "Failed to reset lights": "Failed to reset lights",
    "Failed to set mute LED": "Failed to set mute LED",
    "Stick range calibration begin failed": "Stick range calibration begin failed",
    "Stick range calibration end failed": "Stick range calibration end failed",
    "Stick center calibration begin failed": "Stick center calibration begin failed",
    "Stick center calibration sample failed": "Stick center calibration sample failed",
    "Stick center calibration end failed": "Stick center calibration end failed",
    "Stick calibration failed": "Stick calibration failed",
    "Range calibration completed": "Range calibration completed",
    "Stick calibration completed": "Stick calibration completed",
    "Changes saved successfully": "Changes saved successfully",
    "Error while saving changes": "Error while saving changes",
    "NVS Unlock failed": "NVS Unlock failed",
    "Range calibration appears to have failed. Please try again and make sure you rotate the sticks.": "Range calibration appears to have failed. Please try again and make sure you rotate the sticks.",
    "It appears the latest joystick calibration has not been saved.": "It appears the latest joystick calibration has not been saved.",
    "You should save your changes, or reboot the controller to revert back to the previous state.": "You should save your changes, or reboot the controller to revert back to the previous state.",
    "Xbox controllers don't support flashing via this interface. Use Xbox Accessories app for firmware updates.": "Xbox controllers don't support flashing via this interface. Use Xbox Accessories app for firmware updates.",
    "Controller reset not supported via HID": "Controller reset not supported via HID",
    "NVS lock not applicable to Xbox controllers": "NVS lock not applicable to Xbox controllers",
    "NVS unlock not applicable to Xbox controllers": "NVS unlock not applicable to Xbox controllers",
    "Calibration not supported on Xbox controllers": "Calibration not supported on Xbox controllers",
    "This controller does not support adaptive triggers": "This controller does not support adaptive triggers",
    "This controller does not support adaptive trigger presets": "This controller does not support adaptive trigger presets",
    "This controller does not support speaker tone via HID": "This controller does not support speaker tone via HID",
    "This controller does not support configurable lights": "This controller does not support configurable lights",
    "This controller does not support mute LED": "This controller does not support mute LED",
    "This controller does not support lightbar color": "This controller does not support lightbar color",
    "This controller does not support player indicators": "This controller does not support player indicators",
    "Build Date": "Build Date",
    "HW Version": "HW Version",
    "SW Version": "SW Version",
    "Device Type": "Device Type",
    "Board Model": "Board Model",
    "Bluetooth Address": "Bluetooth Address",
    "Color": "Color",
    "MCU Unique ID": "MCU Unique ID",
    "PCBA ID": "PCBA ID",
    "Battery Barcode": "Battery Barcode",
    "VCM Left Barcode": "VCM Left Barcode",
    "VCM Right Barcode": "VCM Right Barcode",
    "FW Build Date": "FW Build Date",
    "FW Type": "FW Type",
    "FW Series": "FW Series",
    "HW Model": "HW Model",
    "FW Version": "FW Version",
    "FW Update": "FW Update",
    "FW Update Info": "FW Update Info",
    "SBL FW Version": "SBL FW Version",
    "Venom FW Version": "Venom FW Version",
    "Spider FW Version": "Spider FW Version",
    "Touchpad ID": "Touchpad ID",
    "Touchpad FW Version": "Touchpad FW Version",
    "Serial Number": "Serial Number",
    "Controller Type": "Controller Type",
    "Replaceable Sticks": "Replaceable Sticks",
    "Customizable Buttons": "Customizable Buttons",
    "Trigger Stops": "Trigger Stops",
    "Battery Level": "Battery Level",
    "Connection Type": "Connection Type",
    "Model": "Model",
    "Vendor ID": "Vendor ID",
    "Product ID": "Product ID",
    "Xbox Wireless Controller (Model 1708)": "Xbox Wireless Controller (Model 1708)",
    "Xbox Elite Wireless Controller Series 2": "Xbox Elite Wireless Controller Series 2",
    "Xbox Adaptive Controller": "Xbox Adaptive Controller",
    "Xbox Series X|S Controller": "Xbox Series X|S Controller",
    "Unknown Xbox Controller": "Unknown Xbox Controller"
  }
};

/**
* Get translated string
* @param {string} key - Translation key
* @returns {string} Translated string or key if not found
*/
function l(key) {
  // Default to English if no translation found
  return translations.en[key] || key;
}

/**
* Simple storage wrapper for persistent data
*/
class Storage {
  constructor() {
    this.prefix = 'techtest_controller_lab_';
  }

  _getKey(key) {
    return this.prefix + key;
  }

  // String storage
  setString(key, value) {
    try {
      localStorage.setItem(this._getKey(key), value);
    } catch (e) {
      console.warn(`Failed to save string ${key}:`, e);
    }
  }

  getString(key) {
    try {
      return localStorage.getItem(this._getKey(key));
    } catch (e) {
      console.warn(`Failed to get string ${key}:`, e);
      return null;
    }
  }

  // Object storage (JSON)
  set(key, value) {
    try {
      localStorage.setItem(this._getKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to save object ${key}:`, e);
    }
  }

  get(key) {
    try {
      const value = localStorage.getItem(this._getKey(key));
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.warn(`Failed to get object ${key}:`, e);
      return null;
    }
  }

  // Boolean storage
  setBoolean(key, value) {
    this.set(key, value);
  }

  getBoolean(key) {
    const value = this.get(key);
    return value !== null ? value : false;
  }

  // Remove item
  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
    } catch (e) {
      console.warn(`Failed to remove ${key}:`, e);
    }
  }

  // Clear all items with our prefix
  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.warn(`Failed to clear storage:`, e);
    }
  }

  // Specific storage instances for different data types
  static get hasChangesState() {
    if (!this._hasChangesState) {
      this._hasChangesState = new Storage();
      this._hasChangesState.prefix = 'techtest_controller_lab_hasChanges_';
    }
    return this._hasChangesState;
  }

  static get lastConnectedController() {
    if (!this._lastConnectedController) {
      this._lastConnectedController = new Storage();
      this._lastConnectedController.prefix = 'techtest_controller_lab_lastConnected_';
    }
    return this._lastConnectedController;
  }

  static get centerCalibrationMethod() {
    if (!this._centerCalibrationMethod) {
      this._centerCalibrationMethod = new Storage();
      this._centerCalibrationMethod.prefix = 'techtest_controller_lab_centerCalibrationMethod_';
    }
    return this._centerCalibrationMethod;
  }

  static get rangeCalibrationMethod() {
    if (!this._rangeCalibrationMethod) {
      this._rangeCalibrationMethod = new Storage();
      this._rangeCalibrationMethod.prefix = 'techtest_controller_lab_rangeCalibrationMethod_';
    }
    return this._rangeCalibrationMethod;
  }

  static get failedCalibrationCount() {
    if (!this._failedCalibrationCount) {
      this._failedCalibrationCount = new Storage();
      this._failedCalibrationCount.prefix = 'techtest_controller_lab_failedCalibrationCount_';
    }
    return this._failedCalibrationCount;
  }

  static get edgeModalDontShowAgain() {
    if (!this._edgeModalDontShowAgain) {
      this._edgeModalDontShowAgain = new Storage();
      this._edgeModalDontShowAgain.prefix = 'techtest_controller_lab_edgeModalDontShowAgain_';
    }
    return this._edgeModalDontShowAgain;
  }

  static get welcomeAccepted() {
    if (!this._welcomeAccepted) {
      this._welcomeAccepted = new Storage();
      this._welcomeAccepted.prefix = 'techtest_controller_lab_welcomeAccepted_';
    }
    return this._welcomeAccepted;
  }
}

const NOT_GENUINE_SONY_CONTROLLER_MSG = "Your device might not be a genuine Sony controller. If it is not a clone then please report this issue.";

/**
* Controller Manager - Manages the current controller instance and provides unified interface
*/
class ControllerManager {
  constructor(uiDependencies = {}) {
    this.currentController = null;
    this.handleNvStatusUpdate = uiDependencies.handleNvStatusUpdate;
    this.has_changes_to_write = null;
    this.inputHandler = null; // Callback function for input processing

    // Button and stick states for UI updates
    this.button_states = {
      // e.g. 'square': false, 'cross': false, ...
      sticks: {
        left: {
          x: 0,
          y: 0
        },
        right: {
          x: 0,
          y: 0
        }
      }
    };

    // Touch points for touchpad input
    this.touchPoints = [];

    // Battery status tracking
    this.batteryStatus = {
      bat_txt: "",
      changed: false,
      charge_level: 0,
      cable_connected: false,
      is_charging: false,
      is_error: false
    };
    this._lastBatteryText = "";
  }

  /**
  * Save has_changes_to_write state to storage
  */
  async _saveHasChangesState() {
    if (!this.currentController) return;
    try {
      const serialNumber = await this.currentController.getSerialNumber();
      Storage.hasChangesState.set(serialNumber, this.has_changes_to_write);
    } catch (e) {
      console.warn('Failed to save changes state:', e);
    }
  }

  /**
  * Restore has_changes_to_write state from storage
  */
  async _restoreHasChangesState() {
    if (!this.currentController) return;
    try {
      const serialNumber = await this.currentController.getSerialNumber();
      const restoredState = Storage.hasChangesState.get(serialNumber);
      if (restoredState !== null) {
        this.has_changes_to_write = restoredState;
        this._updateUI();
      }
    } catch (e) {
      console.warn('Failed to restore changes state:', e);
    }
  }

  /**
  * Update UI based on current has_changes_to_write state
  */
  _updateUI() {
    const saveBtn = document.getElementById("savechanges");
    if (saveBtn) {
      saveBtn
        .prop('disabled', !this.has_changes_to_write)
        .toggleClass('btn-success', this.has_changes_to_write)
        .toggleClass('btn-outline-secondary', !this.has_changes_to_write);
    }
  }

  /**
  * Clear controller state: remove storage entry and reset UI
  * @private
  */
  async _clearControllerState() {
    if (this.currentController) {
      try {
        const serialNumber = await this.currentController.getSerialNumber();
        Storage.hasChangesState.clear(serialNumber);
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    this.has_changes_to_write = false;
    this._updateUI();
  }

  /**
  * Set the current controller instance
  * @param {BaseController} controller Controller instance
  */
  setControllerInstance(instance) {
    this.currentController = instance;
    if (instance) {
      this._restoreHasChangesState().catch(e => console.warn('Failed to restore changes state:', e));
    }
  }

  /**
  * Get the current device (for backward compatibility)
  * @returns {HIDDevice|null} Current device or null if none set
  */
  getDevice() {
    return this.currentController?.getDevice() || null;
  }

  getInputConfig() {
    return this.currentController?.getInputConfig() || null;
  }

  async getDeviceInfo() {
    if (!this.currentController) return null;
    return await this.currentController.getInfo();
  }

  getFinetuneMaxValue() {
    if (!this.currentController) return null;
    return this.currentController.getFinetuneMaxValue();
  }

  /**
  * Set input report handler on the underlying device
  * @param {Function|null} handler Input report handler function or null to clear
  */
  setInputReportHandler(handler) {
    if (!this.currentController) return;
    this.currentController.device.oninputreport = handler;
  }

  /**
  * Query NVS (Non-Volatile Storage) status
  * @returns {Promise<Object>} NVS status object
  */
  async queryNvStatus() {
    if (!this.currentController) return null;
    const nv = await this.currentController.queryNvStatus();
    if (this.handleNvStatusUpdate) {
      this.handleNvStatusUpdate(nv);
    }
    return nv;
  }

  /**
  * Get in-memory module data (finetune data)
  * @returns {Promise<Array>} Module data array
  */
  async getInMemoryModuleData() {
    if (!this.currentController) return null;
    return await this.currentController.getInMemoryModuleData();
  }

  /**
  * Write finetune data to controller
  * @param {Array} data Finetune data array
  */
  async writeFinetuneData(data) {
    if (!this.currentController) return;
    await this.currentController.writeFinetuneData(data);
  }

  getModel() {
    if (!this.currentController) return null;
    return this.currentController.getModel();
  }

  /**
   * Get the list of supported quick tests for the current controller
   * @returns {Array<string>} Array of supported test types
   */
  getSupportedQuickTests() {
    if (!this.currentController) {
      return [];
    }
    return this.currentController.getSupportedQuickTests();
  }

  /**
   * Check if a controller is connected
   * @returns {boolean} True if controller is connected
   */
  isConnected() {
    return this.currentController !== null;
  }

  /**
   * Set the input callback function
   * @param {Function} callback - Function to call after processing input
   */
  setInputHandler(callback) {
    this.inputHandler = callback;
  }

  /**
   * Disconnect the current controller
   */
  async disconnect() {
    if (this.currentController) {
      await this.currentController.close();
      this.currentController = null;
    }
  }

  /**
   * Update NVS changes status and UI
   * @param {boolean} hasChanges Changes status
  */
  setHasChangesToWrite(hasChanges) {
    if (hasChanges === this.has_changes_to_write)
      return;

    this.has_changes_to_write = hasChanges;
    this._updateUI();
    this._saveHasChangesState().catch(e => console.warn('Failed to save changes state:', e));
  }

  // Unified controller operations that delegate to the current controller

  /**
  * Flash/save changes to the controller
  */
  async flash(progressCallback = null) {
    if (!this.currentController) throw new Error("No controller connected");
    await this._clearControllerState();
    return this.currentController.flash(progressCallback);
  }

  /**
  * Reset the controller
  */
  async reset() {
    if (!this.currentController) throw new Error("No controller connected");
    await this._clearControllerState();
    return this.currentController.reset();
  }

  /**
  * Unlock NVS (Non-Volatile Storage)
  */
  async nvsUnlock() {
    if (!this.currentController) throw new Error("No controller connected");
    await this.currentController.nvsUnlock();
    await this.queryNvStatus(); // Refresh NVS status
  }

  /**
  * Lock NVS (Non-Volatile Storage)
  */
  async nvsLock() {
    if (!this.currentController) throw new Error("No controller connected");
    const res = await this.currentController.nvsLock();
    if (!res.ok) {
      throw new Error(l("NVS Lock failed"), { cause: res.error });
    }

    await this.queryNvStatus(); // Refresh NVS status
    return res;
  }

  /**
  * Begin stick calibration
  */
  async calibrateSticksBegin() {
    if (!this.currentController) throw new Error("No controller connected");
    const res = await this.currentController.calibrateSticksBegin();
    if (!res.ok) {
      throw new Error(l(NOT_GENUINE_SONY_CONTROLLER_MSG), { cause: res.error });
    }
  }

  /**
  * Sample stick position during calibration
  */
  async calibrateSticksSample() {
    if (!this.currentController) throw new Error("No controller connected");
    const res = await this.currentController.calibrateSticksSample();
    if (!res.ok) {
      await sleep(500);
      throw new Error(l("Stick calibration failed"), { cause: res.error });
    }
  }

  /**
  * End stick calibration
  */
  async calibrateSticksEnd() {
    if (!this.currentController) throw new Error("No controller connected");
    const res = await this.currentController.calibrateSticksEnd();
    if (!res.ok) {
      await sleep(500);
      throw new Error(l("Stick calibration failed"), { cause: res.error });
    }

    this.setHasChangesToWrite(true);
  }

  /**
  * Begin stick range calibration (for UI-driven calibration)
  */
  async calibrateRangeBegin() {
    if (!this.currentController) throw new Error("No controller connected");
    const res = await this.currentController.calibrateRangeBegin();
    if (!res.ok) {
      throw new Error(l(NOT_GENUINE_SONY_CONTROLLER_MSG), { cause: res.error });
    }
  }

  /**
  * Handle range calibration on close
  */
  async calibrateRangeOnClose() {
    if (!this.currentController) {
      return { success: false };
    }
    const res = await this.currentController.calibrateRangeEnd();
    if (res?.ok) {
      this.setHasChangesToWrite(true);
      return { success: true, message: l("Range calibration completed") };
    } else {
      // Check if the error is code 3 (DS4/DS5) or codes 4/5 (DS5 Edge), which typically means
      // the calibration was already ended or the controller is not in range calibration mode
      if (res?.code === 3 || res?.code === 4 || res?.code === 5) {
        console.log("Range calibration end returned expected error code", res.code, "- treating as successful completion");
        // This is likely not an error - the calibration may have already been completed
        // or the user closed the window without starting calibration
        return { success: true };
      }

      console.log("Range calibration end failed with unexpected error:", res);
      await sleep(500);
      const msg = res?.code ? (`${l("Range calibration failed")}. ${l("Error")} ${res.code}`) : (`${l("Range calibration failed")}. ${res?.error || ""}`);
      return { success: false, message: msg, error: res?.error };
    }
  }

  /**
  * Full stick calibration process ("OLD" fully automated calibration)
  * @param {Function} progressCallback - Callback function to report progress (0-100)
  */
  async calibrateSticks(progressCallback) {
    if (!this.currentController) throw new Error("No controller connected");
    try {
      // la("multi_calibrate_sticks");

      if (progressCallback) progressCallback(20);
      await this.calibrateSticksBegin();
      if (progressCallback) progressCallback(30);

      // Sample multiple times during the process
      const sampleCount = 5;
      for (let i = 0; i < sampleCount; i++) {
        await sleep(100);
        await this.calibrateSticksSample();

        // Progress from 30% to 80% during sampling
        if (progressCallback) {
          const sampleProgress = 30 + ((i + 1) / sampleCount) * 50;
          progressCallback(Math.round(sampleProgress));
        }
      }

      if (progressCallback) progressCallback(90);
      await this.calibrateSticksEnd();
      if (progressCallback) progressCallback(100);

      return { success: true, message: l("Stick calibration completed") };
    } catch (e) {
      // la("multi_calibrate_sticks_failed", {"r": e});
      throw e;
    }
  }

  /**
   * Disable left adaptive trigger effects (DS5 only)
   * @returns {Promise<Object>} Result object with success status and message
   */
  async disableLeftAdaptiveTrigger() {
    if (!this.currentController) {
      throw new Error(l("No controller connected"));
    }

    // Check if the controller supports adaptive triggers (DS5 only)
    if (this.getModel() !== "DS5" && this.getModel() !== "DS5_Edge") {
      throw new Error(l("Adaptive triggers are only supported on DualSense controllers"));
    }

    // Check if the controller has the disableLeftAdaptiveTrigger method
    if (typeof this.currentController.disableLeftAdaptiveTrigger !== 'function') {
      throw new Error(l("Controller does not support adaptive trigger control"));
    }

    try {
      const result = await this.currentController.disableLeftAdaptiveTrigger();
      return result;
    } catch (error) {
      throw new Error(l("Failed to disable adaptive trigger"), { cause: error });
    }
  }

  /**
   * Set left adaptive trigger with preset configurations (DS5 only)
   * @param {string} preset - Preset name: 'light', 'medium', 'heavy', 'custom'
   * @param {Object} customParams - Custom parameters for 'custom' preset {start, end, force}
   * @returns {Promise<Object>} Result object with success status and message
   */
  async setAdaptiveTriggerPreset({left, right}/* , customParams = {} */) {
    if (!this.currentController) {
      throw new Error(l("No controller connected"));
    }

    // Check if the controller supports adaptive triggers (DS5 only)
    if (this.getModel() !== "DS5" && this.getModel() !== "DS5_Edge") {
      throw new Error(l("Adaptive triggers are only supported on DualSense controllers"));
    }

    const presets = {
      'off': { start: 0, end: 0, force: 0, mode: 'off' },
      'light': { start: 10, end: 80, force: 150, mode: 'single' },
      'medium': { start: 15, end: 100, force: 200, mode: 'single' },
      'heavy': { start: 20, end: 120, force: 255, mode: 'single' },
      // 'custom': customParams
    };

    if (!presets[left] || !presets[right]) {
      throw new Error(`Invalid preset. Available presets: light, medium, heavy, custom. Got "${left}" and "${right}".`);
    }

    const leftPreset = presets[left];
    const rightPreset = presets[right];

    // if (preset === 'custom') {
    //   // Validate custom parameters
    //   if (typeof start !== 'number' || typeof end !== 'number' || typeof force !== 'number') {
    //     throw new Error(l("Custom preset requires start, end, and force parameters"));
    //   }
    // }

    return await this.currentController.setAdaptiveTrigger(leftPreset, rightPreset);
  }

  /**
   * Set vibration motors for haptic feedback (DS5 only)
   * @param {Object} options - Vibration options
   * @param {number} options.heavyLeft - Left motor intensity (0-255)
   * @param {number} options.lightRight - Right motor intensity (0-255)
   * @param {number} options.duration - Duration in milliseconds (optional)
   * @param {Function} doneCb - Callback function called when vibration ends (optional)
   */
  async setVibration({heavyLeft, lightRight, duration = 0}, doneCb = ({success}) => {}) {
    if (!this.currentController) {
      if (doneCb) doneCb({ success: false});
      return;
    }

    try {
      await this.currentController.setVibration(heavyLeft, lightRight);

      // If duration is specified, automatically turn off vibration after the duration
      if (duration > 0) {
        setTimeout(async () => {
          if (!this.currentController) {
            if (doneCb) doneCb({success: true});
            return;
          }
          await this.currentController.setVibration(0, 0); // Turn off vibration
          if (doneCb) doneCb({success: true});
        }, duration);
      }
    } catch (error) {
      if (!this.currentController) {
        if (doneCb) doneCb({ success: false});
        return;
      }
      if (duration && doneCb) doneCb({ success: false});
      throw new Error(l("Failed to set vibration"), { cause: error });
    }
  }

  /**
   * Test speaker tone (DS5 only)
   * @param {number} duration - Duration in milliseconds (optional)
   * @param {Function} doneCb - Callback function called when tone ends (optional)
   * @param {string} output - Audio output destination: "speaker" (default) or "headphones" (optional)
   */
  async setSpeakerTone(duration = 1000, doneCb = ({success}) => {}, output = "speaker") {
    if (!this.currentController) {
      if (doneCb) doneCb({ success: false});
      return;
    }

    try {
      await this.currentController.setSpeakerTone(output);

      // If duration is specified, automatically reset speaker after the duration
      if (duration > 0) {
        setTimeout(async () => {
          if (!this.currentController) {
            if (doneCb) doneCb({success: true});
            return;
          }
          // Reset speaker settings to default by calling setSpeakerTone with reset parameters
          try {
            if (this.currentController.resetSpeakerSettings) {
              await this.currentController.resetSpeakerSettings();
            }
          } catch (resetError) {
            console.warn("Failed to reset speaker settings:", resetError);
          }
          if (doneCb) doneCb({success: true});
        }, duration);
      }
    } catch (error) {
      if (!this.currentController) {
        if (doneCb) doneCb({ success: false});
        return;
      }
      if (duration && doneCb) doneCb({ success: false});
      throw new Error(l("Failed to set speaker tone"), { cause: error });
    }
  }

  /**
   * Helper function to check if stick positions have changed
   */
  _sticksChanged(current, newValues) {
    return current.left.x !== newValues.left.x || current.left.y !== newValues.left.y ||
    current.right.x !== newValues.right.x || current.right.y !== newValues.right.y;
  }

  /**
   * Generic button processing for DS4/DS5/Xbox
   * Records button states and returns changes
   */
  _recordButtonStates(data, BUTTON_MAP, dpad_byte, l2_analog_byte, r2_analog_byte) {
    const changes = {};

    // Stick positions (always at bytes 0-3 for most controllers)
    const [new_lx, new_ly, new_rx, new_ry] = [0, 1, 2, 3]
      .map(i => data.getUint8(i))
      .map(v => Math.round((v - 127.5) / 128 * 100) / 100);

    const newSticks = {
      left: { x: new_lx, y: new_ly },
      right: { x: new_rx, y: new_ry }
    };

    if (this._sticksChanged(this.button_states.sticks, newSticks)) {
      this.button_states.sticks = newSticks;
      changes.sticks = newSticks;
    }

    // L2/R2 analog values
    [
      ['l2', l2_analog_byte],
      ['r2', r2_analog_byte]
    ].forEach(([name, byte]) => {
      const val = data.getUint8(byte);
      const key = name + '_analog';
      if (val !== this.button_states[key]) {
        this.button_states[key] = val;
        changes[key] = val;
      }
    });

    // Dpad is a 4-bit hat value
    const hat = data.getUint8(dpad_byte) & 0x0F;
    const dpad_map = {
      up:    (hat === 0 || hat === 1 || hat === 7),
      right: (hat === 1 || hat === 2 || hat === 3),
      down:  (hat === 3 || hat === 4 || hat === 5),
      left:  (hat === 5 || hat === 6 || hat === 7)
    };
    for (const dir of ['up', 'right', 'down', 'left']) {
      const pressed = dpad_map[dir];
      if (this.button_states[dir] !== pressed) {
        this.button_states[dir] = pressed;
        changes[dir] = pressed;
      }
    }

    // Other buttons
    for (const btn of BUTTON_MAP) {
      if (['up', 'right', 'down', 'left'].includes(btn.name)) continue; // Dpad handled above
      const pressed = (data.getUint8(btn.byte) & btn.mask) !== 0;
      if (this.button_states[btn.name] !== pressed) {
        this.button_states[btn.name] = pressed;
        changes[btn.name] = pressed;
      }
    }

    return changes;
  }

  /**
   * Process controller input data and call callback if set
   * This is the first part of the split process_controller_input function
   * @param {Object} inputData - The input data from the controller
   * @returns {Object} Changes object containing processed input data
   */
  processControllerInput(inputData) {
    const { data } = inputData;

    const inputConfig = this.currentController.getInputConfig();
    if (!inputConfig) return {};

    const { buttonMap, dpadByte, l2AnalogByte, r2AnalogByte } = inputConfig;
    const { touchpadOffset } = inputConfig;

    // Process button states using the device-specific configuration
    const changes = this._recordButtonStates(data, buttonMap, dpadByte, l2AnalogByte, r2AnalogByte);

    // Parse and store touch points if touchpad data is available
    if (touchpadOffset) {
      this.touchPoints = this._parseTouchPoints(data, touchpadOffset);
    }

    // Parse and store battery status
    this.batteryStatus = this._parseBatteryStatus(data);

    const result = {
      changes,
      inputConfig: { buttonMap },
      touchPoints: this.touchPoints,
      batteryStatus: this.batteryStatus,
    };

    if (this.inputHandler) {
      this.inputHandler(result);
    }

    return result;
  }

  /**
   * Parse touch points from input data
   * @param {DataView} data - Input data view
   * @param {number} offset - Offset to touchpad data
   * @returns {Array} Array of touch points with {active, id, x, y} properties
   */
  _parseTouchPoints(data, offset) {
    // Returns array of up to 2 points: {active, id, x, y}
    const points = [];
    for (let i = 0; i < 2; i++) {
      const base = offset + i * 4;
      const arr = [];
      for (let j = 0; j < 4; j++) arr.push(data.getUint8(base + j));
      const b0 = data.getUint8(base);
      const active = (b0 & 0x80) === 0; // 0 = finger down, 1 = up
      const id = b0 & 0x7F;
      const b1 = data.getUint8(base + 1);
      const b2 = data.getUint8(base + 2);
      const b3 = data.getUint8(base + 3);
      // x: 12 bits, y: 12 bits
      const x = ((b2 & 0x0F) << 8) | b1;
      const y = (b3 << 4) | (b2 >> 4);
      points.push({ active, id, x, y });
    }
    return points;
  }

  /**
   * Parse battery status from input data
   */
  _parseBatteryStatus(data) {
    const batteryInfo = this.currentController.parseBatteryStatus(data);
    const bat_txt = this._batteryPercentToText(batteryInfo);

    const changed = bat_txt !== this._lastBatteryText;
    this._lastBatteryText = bat_txt;

    return { bat_txt, changed, ...batteryInfo };
  }

  /**
   * Convert battery percentage to display text with icons
   */
  _batteryPercentToText({charge_level, is_charging, is_error}) {
    if (is_error) {
      return '<font color="red">' + l("error") + '</font>';
    }

    const batteryIcons = [
      { threshold: 20, icon: 'fa-battery-empty' },
      { threshold: 40, icon: 'fa-battery-quarter' },
      { threshold: 60, icon: 'fa-battery-half' },
      { threshold: 80, icon: 'fa-battery-three-quarters' },
    ];

    const icon_txt = batteryIcons.find(item => charge_level < item.threshold)?.icon || 'fa-battery-full';
    const icon_full = `<i class="fa-solid ${icon_txt}"></i>`;
    const bolt_txt = is_charging ? '<i class="fa-solid fa-bolt"></i>' : '';
    return [`${charge_level}%`, icon_full, bolt_txt].join(' ');
  }

  /**
   * Get a bound input handler function that can be assigned to device.oninputreport
   * @returns {Function} Bound input handler function
   */
  getInputHandler() {
    return this.processControllerInput.bind(this);
  }
}

// Function to initialize the controller manager with dependencies
function initControllerManager(dependencies = {}) {
  const self = new ControllerManager(dependencies);

  // This disables the save button until something actually changes
  self.setHasChangesToWrite(false);
  return self;
}

/**
* Base Controller class that provides common functionality for all controller types
*/
class BaseController {
  constructor(device) {
    this.device = device;
    this.model = "undefined"; // to be set by subclasses
    this.finetuneMaxValue; // to be set by subclasses
  }

  getModel() {
    return this.model;
  }

  /**
  * Get the underlying HID device
  * @returns {HIDDevice} The HID device
  */
  getDevice() {
    return this.device;
  }

  getInputConfig() {
    throw new Error('getInputConfig() must be implemented by subclass');
  }

  /**
   * Get the maximum value for finetune data
   * @returns {number} Maximum value for finetune adjustments
   */
  getFinetuneMaxValue() {
    if(!this.finetuneMaxValue) throw new Error('getFinetuneMaxValue() must be implemented by subclass');
    return this.finetuneMaxValue;
  }

  getNumberOfSticks() {
    return 0;
  }

  /**
  * Set input report handler
  * @param {Function} handler Input report handler function
  */
  setInputReportHandler(handler) {
    this.device.oninputreport = handler;
  }

  /**
  * Allocate request buffer with proper size based on device feature reports
  * @param {number} id Report ID
  * @param {Array} data Data array to include in the request
  * @returns {Uint8Array} Allocated request buffer
  */
  alloc_req(id, data = []) {
    const fr = this.device.collections[0].featureReports;
    const [report] = fr.find(e => e.reportId === id)?.items || [];
    const maxLen = report?.reportCount || data.length;

    const len = Math.min(data.length, maxLen);
    const out = new Uint8Array(maxLen);
    out.set(data.slice(0, len));
    return out;
  }

  /**
  * Send feature report to device
  * @param {number} reportId Report ID
  * @param {ArrayBuffer|Array} data Data to send (if Array, will be processed through allocReq)
  */
  async sendFeatureReport(reportId, data) {
    // If data is an array, use allocReq to create proper buffer
    if (Array.isArray(data)) {
      data = this.alloc_req(reportId, data);
    }

    try {
      return await this.device.sendFeatureReport(reportId, data);
    } catch (error) {
      // HID doesn't throw proper Errors with stack (stack is "name: message") so generate a new stack here
      throw new Error(error.stack);
    }
  }

  /**
  * Receive feature report from device
  * @param {number} reportId Report ID
  */
  async receiveFeatureReport(reportId) {
    return await this.device.receiveFeatureReport(reportId);
  }

  /**
  * Close the HID device connection
  */
  async close() {
    if (this.device?.opened) {
      await this.device.close();
    }
  }

  /**
  * Get the serial number of the device
  * @returns {Promise<string>} The device serial number
  */
  async getSerialNumber() {
    throw new Error('getSerialNumber() must be implemented by subclass');
  }

  // Abstract methods that must be implemented by subclasses
  async getInfo() {
    throw new Error('getInfo() must be implemented by subclass');
  }

  async flash(progressCallback = null) {
    throw new Error('flash() must be implemented by subclass');
  }

  async reset() {
    throw new Error('reset() must be implemented by subclass');
  }

  async nvsLock() {
    throw new Error('nvsLock() must be implemented by subclass');
  }

  async nvsUnlock() {
    throw new Error('nvsUnlock() must be implemented by subclass');
  }

  async calibrateSticksBegin() {
    throw new Error('calibrateSticksBegin() must be implemented by subclass');
  }

  async calibrateSticksEnd() {
    throw new Error('calibrateSticksEnd() must be implemented by subclass');
  }

  async calibrateSticksSample() {
    throw new Error('calibrateSticksSample() must be implemented by subclass');
  }

  async calibrateRangeBegin() {
    throw new Error('calibrateRangeBegin() must be implemented by subclass');
  }

  async calibrateRangeEnd() {
    throw new Error('calibrateRangeEnd() must be implemented by subclass');
  }

  parseBatteryStatus(data) {
    throw new Error('parseBatteryStatus() must be implemented by subclass');
  }

  async setAdaptiveTrigger(left, right) {
    // Default no-op implementation for controllers that don't support adaptive triggers
    return { success: true, message: "This controller does not support adaptive triggers" };
  }

  async setVibration(heavyLeft = 0, lightRight = 0) {
    // Default no-op implementation for controllers that don't support vibration
    return { success: true, message: "This controller does not support vibration" };
  }

  async setAdaptiveTriggerPreset(config) {
    // Default no-op implementation for controllers that don't support adaptive trigger presets
    return { success: true, message: "This controller does not support adaptive trigger presets" };
  }

  async setSpeakerTone(output = 'speaker') {
    // Default no-op implementation for controllers that don't support speaker audio
    return { success: true, message: "This controller does not support speaker audio" };
  }

  async resetLights() {
    // Default no-op implementation for controllers that don't support controllable lights
    return { success: true, message: "This controller does not support controllable lights" };
  }

  async setMuteLed(mode) {
    // Default no-op implementation for controllers that don't support mute LED
    return { success: true, message: "This controller does not support mute LED" };
  }

  async setLightbarColor(r, g, b) {
    // Default no-op implementation for controllers that don't support lightbar colors
    return { success: true, message: "This controller does not support lightbar colors" };
  }

  async setPlayerIndicator(pattern) {
    // Default no-op implementation for controllers that don't support player indicators
    return { success: true, message: "This controller does not support player indicators" };
  }

  /**
   * Get the list of supported quick tests for this controller
   * @returns {Array<string>} Array of supported test types
   */
  getSupportedQuickTests() {
    // Default implementation - supports all tests
    return ['usb', 'buttons', 'adaptive', 'haptic', 'lights', 'speaker', 'headphone', 'microphone'];
  }
}

// DS4 Button mapping configuration
const DS4_BUTTON_MAP = [
  { name: 'up', byte: 4, mask: 0x0 }, // Dpad handled separately
  { name: 'right', byte: 4, mask: 0x1 },
  { name: 'down', byte: 4, mask: 0x2 },
  { name: 'left', byte: 4, mask: 0x3 },
  { name: 'square', byte: 4, mask: 0x10, svg: 'Square' },
  { name: 'cross', byte: 4, mask: 0x20, svg: 'Cross' },
  { name: 'circle', byte: 4, mask: 0x40, svg: 'Circle' },
  { name: 'triangle', byte: 4, mask: 0x80, svg: 'Triangle' },
  { name: 'l1', byte: 5, mask: 0x01, svg: 'L1' },
  { name: 'l2', byte: 5, mask: 0x04, svg: 'L2' }, // analog handled separately
  { name: 'r1', byte: 5, mask: 0x02, svg: 'R1' },
  { name: 'r2', byte: 5, mask: 0x08, svg: 'R2' }, // analog handled separately
  { name: 'create', byte: 5, mask: 0x10, svg: 'Create' },
  { name: 'options', byte: 5, mask: 0x20, svg: 'Options' },
  { name: 'l3', byte: 5, mask: 0x40, svg: 'L3' },
  { name: 'r3', byte: 5, mask: 0x80, svg: 'R3' },
  { name: 'ps', byte: 6, mask: 0x01, svg: 'PS' },
  { name: 'touchpad', byte: 6, mask: 0x02, svg: 'Trackpad' },
  // No mute button on DS4
];

// DS4 Input processing configuration
const DS4_INPUT_CONFIG = {
  buttonMap: DS4_BUTTON_MAP,
  dpadByte: 4,
  l2AnalogByte: 7,
  r2AnalogByte: 8,
  touchpadOffset: 34,
};

// DS4 Output Report Constants
const DS4_OUTPUT_REPORT = {
  USB_REPORT_ID: 0x05,
  BT_REPORT_ID: 0x11,
};

const DS4_VALID_FLAG0 = {
  RUMBLE: 0x01,           // Bit 0 for rumble motors
  LED: 0x02,              // Bit 1 for LED control
  LED_BLINK: 0x04,        // Bit 2 for LED blink control
};

// Basic DS4 Output Structure for vibration and LED control
class DS4OutputStruct {
  constructor(currentState = null) {
    // Create a 32-byte buffer for DS4 output report (USB)
    this.buffer = new ArrayBuffer(31);
    this.view = new DataView(this.buffer);

    // Control flags
    this.validFlag0 = currentState?.validFlag0 || 0;
    this.validFlag1 = currentState?.validFlag1 || 0;

    // Vibration motors
    this.rumbleRight = currentState?.rumbleRight || 0;
    this.rumbleLeft = currentState?.rumbleLeft || 0;

    // LED control
    this.ledRed = currentState?.ledRed || 0;
    this.ledGreen = currentState?.ledGreen || 0;
    this.ledBlue = currentState?.ledBlue || 0;

    // LED timing
    this.ledFlashOn = currentState?.ledFlashOn || 0;
    this.ledFlashOff = currentState?.ledFlashOff || 0;
  }

  // Pack the data into the output buffer
  pack() {
    // Based on DS4 output report structure
    // Byte 0-2: Valid flags and padding
    this.view.setUint8(0, this.validFlag0);
    this.view.setUint8(1, this.validFlag1);
    this.view.setUint8(2, 0x00);

    // Byte 3-4: Rumble motors
    this.view.setUint8(3, this.rumbleRight);
    this.view.setUint8(4, this.rumbleLeft);

    // Bytes 5-7: LED RGB
    this.view.setUint8(5, this.ledRed);
    this.view.setUint8(6, this.ledGreen);
    this.view.setUint8(7, this.ledBlue);

    // Bytes 8-9: LED flash timing
    this.view.setUint8(8, this.ledFlashOn);
    this.view.setUint8(9, this.ledFlashOff);

    return this.buffer;
  }
}

/**
* DualShock 4 Controller implementation
*/
class DS4Controller extends BaseController {
  constructor(device) {
    super(device);
    this.model = "DS4";

    // Initialize current output state to track controller settings
    this.currentOutputState = {
      validFlag0: 0,
      validFlag1: 0,
      rumbleRight: 0,
      rumbleLeft: 0,
      ledRed: 0,
      ledGreen: 0,
      ledBlue: 0,
      ledFlashOn: 0,
      ledFlashOff: 0,
    };
  }

  getInputConfig() {
    return DS4_INPUT_CONFIG;
  }

  async getSerialNumber() {
    return await this.getBdAddr();
  }

  async getInfo() {
    // Device-only: collect info and return a common structure; do not touch the DOM
    try {
      let deviceTypeText = l("unknown");
      let is_clone = false;

      const view = await this.receiveFeatureReport(0xa3);

      const cmd = view.getUint8(0, true);

      if(cmd != 0xa3 || view.buffer.byteLength < 49) {
        if(view.buffer.byteLength != 49) {
          deviceTypeText = l("clone");
          is_clone = true;
        }
      }

      const k1 = new TextDecoder().decode(view.buffer.slice(1, 0x10)).replace(/\0/g, '');
      const k2 = new TextDecoder().decode(view.buffer.slice(0x10, 0x20)).replace(/\0/g, '');

      const hw_ver_major = view.getUint16(0x21, true);
      const hw_ver_minor = view.getUint16(0x23, true);
      const sw_ver_major = view.getUint32(0x25, true);
      const sw_ver_minor = view.getUint16(0x25+4, true);
      try {
        if(!is_clone) {
          // If this feature report succeeds, it's an original device
          await this.receiveFeatureReport(0x81);
          deviceTypeText = l("original");
        }
      } catch(e) {
        l("clone");
        is_clone = true;
        deviceTypeText = l("clone");
      }

      const hw_version = `${dec2hex(hw_ver_major)}:${dec2hex(hw_ver_minor)}`;
      const sw_version = `${dec2hex(sw_ver_major)}:${dec2hex(sw_ver_minor)}`;
      const infoItems = [
        { key: l("Build Date"), value: `${k1} ${k2}`, cat: "fw" },
        { key: l("HW Version"), value: hw_version, cat: "hw" },
        { key: l("SW Version"), value: sw_version, cat: "fw" },
        { key: l("Device Type"), value: deviceTypeText, cat: "hw", severity: is_clone ? 'danger' : undefined },
      ];

      const board_model = this.hwToBoardModel(hw_ver_minor);
      const bd_addr = await this.getBdAddr();

      if(!is_clone) {
        // Add Board Model (UI will append the info icon)
        infoItems.push({ key: l("Board Model"), value: board_model, cat: "hw", addInfoIcon: 'board', copyable: true });
        infoItems.push({ key: l("Bluetooth Address"), value: bd_addr, cat: "hw" });
      }

      const nv = await this.queryNvStatus();
      const rare = this.isRare(hw_ver_minor);
      const disable_bits = is_clone ? 1 : 0; // 1: clone

      // la("ds4_get_info", { hw_version, board_model, bd_addr, is_clone });  // Collect Bluetooth address for analytics

      return { ok: true, infoItems, nv, disable_bits, rare };
    } catch(error) {
      // Return error but do not touch DOM
      return { ok: false, error, disable_bits: 1 };
    }
  }

  async flash(progressCallback = null) {
    // la("ds4_flash");
    try {
      await this.nvsUnlock();
      const lockRes = await this.nvsLock();
      if(!lockRes.ok) throw (lockRes.error || new Error("NVS lock failed"));

      return { success: true, message: l("Changes saved successfully") };
    } catch(error) {
      throw new Error(l("Error while saving changes"), { cause: error });
    }
  }

  async reset() {
    // la("ds4_reset");
    try {
      await this.sendFeatureReport(0xa0, [4,1,0]);
    } catch(error) {
    }
  }

  async nvsLock() {
    // la("ds4_nvlock");
    try {
      await this.sendFeatureReport(0xa0, [10,1,0]);
      return { ok: true };
    } catch(error) {
      return { ok: false, error };
    }
  }

  async nvsUnlock() {
    // la("ds4_nvunlock");
    try {
      await this.sendFeatureReport(0xa0, [10,2,0x3e,0x71,0x7f,0x89]);
      return { ok: true };
    } catch(error) {
      return { ok: false, error };
    }
  }

  async getBdAddr() {
    const view = await this.receiveFeatureReport(0x12);
    return format_mac_from_view(view, 1);
  }

  async calibrateRangeBegin() {
    // la("ds4_calibrate_range_begin");
    try {
      // Begin
      await this.sendFeatureReport(0x90, [1,1,2]);
      await sleep(200);

      // Assert
      const data = await this.receiveFeatureReport(0x91);
      const data2 = await this.receiveFeatureReport(0x92);
      const [d1, d2] = [data, data2].map(v => v.buffer.byteLength == 4 ? v.getUint32(0, false) : undefined);
      if(d1 != 0x91010201 || d2 != 0x920102ff) {
        // la("ds4_calibrate_range_begin_failed", {"d1": d1, "d2": d2});
        return {
          ok: false,
          error: new Error(`Stick range calibration begin failed: ${d1}, ${d2}`),
          code: 1, d1, d2
        };
      }
      return { ok: true };
    } catch(error) {
      // la("ds4_calibrate_range_begin_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async calibrateRangeEnd() {
    // la("ds4_calibrate_range_end");
    try {
      // Write
      await this.sendFeatureReport(0x90, [2,1,2]);
      await sleep(200);

      const data = await this.receiveFeatureReport(0x91);
      const data2 = await this.receiveFeatureReport(0x92);
      const [d1, d2] = [data, data2].map(v => v.getUint32(0, false));
      if(d1 != 0x91010202 || d2 != 0x92010201) {
        // la("ds4_calibrate_range_end_failed", {"d1": d1, "d2": d2});
        return { ok: false, code: 3, d1, d2 };
      }

      return { ok: true };
    } catch(error) {
      // la("ds4_calibrate_range_end_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async calibrateSticksBegin() {
    // la("ds4_calibrate_sticks_begin");
    try {
      // Begin
      await this.sendFeatureReport(0x90, [1,1,1]);
      await sleep(200);

      // Assert
      const data = await this.receiveFeatureReport(0x91);
      const data2 = await this.receiveFeatureReport(0x92);
      const [d1, d2] = [data, data2].map(v => v.buffer.byteLength == 4 ? v.getUint32(0, false) : undefined);
      if(d1 != 0x91010101 || d2 != 0x920101ff) {
        // la("ds4_calibrate_sticks_begin_failed", {"d1": d1, "d2": d2});
        return {
          ok: false,
          error: new Error(`Stick center calibration begin failed: ${d1}, ${d2}`),
          code: 1, d1, d2,
        };
      }

      return { ok: true };
    } catch(error) {
      // la("ds4_calibrate_sticks_begin_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async calibrateSticksSample() {
    // la("ds4_calibrate_sticks_sample");
    try {
      // Sample
      await this.sendFeatureReport(0x90, [3,1,1]);
      await sleep(200);

      // Assert
      const data = await this.receiveFeatureReport(0x91);
      const data2 = await this.receiveFeatureReport(0x92);
      if(data.getUint32(0, false) != 0x91010101 || data2.getUint32(0, false) != 0x920101ff) {
        const [d1, d2] = [data, data2].map(v => dec2hex32(v.getUint32(0, false)));
        // la("ds4_calibrate_sticks_sample_failed", {"d1": d1, "d2": d2});
        return { ok: false, code: 2, d1, d2 };
      }
      return { ok: true };
    } catch(error) {
      return { ok: false, error };
    }
  }

  async calibrateSticksEnd() {
    // la("ds4_calibrate_sticks_end");
    try {
      // Write
      await this.sendFeatureReport(0x90, [2,1,1]);
      await sleep(200);

      const data = await this.receiveFeatureReport(0x91);
      const data2 = await this.receiveFeatureReport(0x92);
      if(data.getUint32(0, false) != 0x91010102 || data2.getUint32(0, false) != 0x92010101) {
        const [d1, d2] = [data, data2].map(v => dec2hex32(v.getUint32(0, false)));
        // la("ds4_calibrate_sticks_end_failed", {"d1": d1, "d2": d2});
        return { ok: false, code: 3, d1, d2 };
      }

      return { ok: true };
    } catch(error) {
      // la("ds4_calibrate_sticks_end_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async queryNvStatus() {
    try {
      await this.sendFeatureReport(0x08, [0xff,0, 12]);
      const data = await this.receiveFeatureReport(0x11);
      const ret = data.getUint8(1, false);
      const res = { device: 'ds4', code: ret };
      switch(ret) {
        case 1:
          return { ...res, status: 'locked', locked: true, mode: 'temporary' };
        case 0:
          return { ...res, status: 'unlocked', locked: false, mode: 'permanent' };
        default:
          return { ...res, status: 'unknown', locked: null };
      }
    } catch (error) {
      return { device: 'ds4', status: 'error', locked: null, code: 2, error };
    }
  }

  hwToBoardModel(hw_ver) {
    const a = hw_ver >> 8;
    if(a == 0x31) {
      return "JDM-001";
    } else if(a == 0x43) {
      return "JDM-011";
    } else if(a == 0x54) {
      return "JDM-030";
    } else if(a >= 0x64 && a <= 0x74) {
      return "JDM-040";
    } else if((a > 0x80 && a < 0x84) || a == 0x93) {
      return "JDM-020";
    } else if(a == 0xa4 || a == 0x90 || a == 0xa0) {
      return "JDM-050";
    } else if(a == 0xb0) {
      return "JDM-055 (Scuf?)";
    } else if(a == 0xb4) {
      return "JDM-055";
    } else {
      if(this.isRare(hw_ver))
        return "WOW!";
      return l("Unknown");
    }
  }

  isRare(hw_ver) {
    const a = hw_ver >> 8;
    const b = a >> 4;
    return ((b == 7 && a > 0x74) || (b == 9 && a != 0x93 && a != 0x90));
  }

  /**
  * Parse DS4 battery status from input data
  */
  parseBatteryStatus(data) {
    const bat = data.getUint8(29); // DS4 battery byte is at position 29

    // DS4: bat_data = low 4 bits, bat_status = bit 4
    const bat_data = bat & 0x0f;
    const bat_status = (bat >> 4) & 1;
    const cable_connected = bat_status === 1;

    let charge_level = 0;
    let is_charging = false;
    let is_error = false;

    if (cable_connected) {
      if (bat_data < 10) {
        charge_level = Math.min(bat_data * 10 + 5, 100);
        is_charging = true;
      } else if (bat_data === 10) {
        charge_level = 100;
        is_charging = true;
      } else if (bat_data === 11) {
        charge_level = 100; // Fully charged
      } else {
        charge_level = 0;
        is_error = true;
      }
    } else {
      // On battery power
      charge_level = bat_data < 10 ? bat_data * 10 + 5 : 100;
    }

    return { charge_level, cable_connected, is_charging, is_error };
  }

  /**
   * Send output report to the DS4 controller
   * @param {ArrayBuffer} data - The output report data
   */
  async sendOutputReport(data, reason = "") {
    if (!this.device?.opened) {
      throw new Error('Device is not opened');
    }
    try {
      // console.log(`Sending output report${ reason ? ` to ${reason}` : '' }:`, DS4_OUTPUT_REPORT.USB_REPORT_ID, buf2hex(data));
      await this.device.sendReport(DS4_OUTPUT_REPORT.USB_REPORT_ID, new Uint8Array(data));
    } catch (error) {
      throw new Error(`Failed to send output report: ${error.message}`);
    }
  }

  /**
   * Update the current output state with values from an OutputStruct
   * @param {DS4OutputStruct} outputStruct - The output structure to copy state from
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
   * This method sets up reasonable defaults for the DS4 controller.
   */
  async initializeCurrentOutputState() {
    try {
      // Reset all output state to known defaults
      this.currentOutputState = {
        ...this.getCurrentOutputState(),
        validFlag0: DS4_VALID_FLAG0.RUMBLE | DS4_VALID_FLAG0.LED,
        ledRed: 0,
        ledGreen: 0,
        ledBlue: 255, // Default to blue
        ledFlashOn: 0,
        ledFlashOff: 0
      };

      // Send a "reset" output report to ensure the controller is in a known state
      const resetOutputStruct = new DS4OutputStruct(this.currentOutputState);
      await this.sendOutputReport(resetOutputStruct.pack(), 'init default states');

      // Update our state to reflect what we just sent
      this.updateCurrentOutputState(resetOutputStruct);
    } catch (error) {
      console.warn("Failed to initialize DS4 output state:", error);
      // Even if the reset fails, we still have the default state initialized
    }
  }

  /**
   * Set vibration motors for haptic feedback
   * @param {number} heavyLeft - Left motor intensity (0-255)
   * @param {number} lightRight - Right motor intensity (0-255)
   */
  async setVibration(heavyLeft = 0, lightRight = 0) {
    try {
      const { validFlag0 } = this.currentOutputState;
      const outputStruct = new DS4OutputStruct({
        ...this.currentOutputState,
        rumbleLeft: Math.max(0, Math.min(255, heavyLeft)),
        rumbleRight: Math.max(0, Math.min(255, lightRight)),
        validFlag0: validFlag0 | DS4_VALID_FLAG0.RUMBLE,
      });
      await this.sendOutputReport(outputStruct.pack(), 'set vibration');
      outputStruct.validFlag0 &= ~DS4_VALID_FLAG0.RUMBLE;

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);

      return { success: true, message: "Vibration set successfully" };
    } catch (error) {
      throw new Error("Failed to set vibration", { cause: error });
    }
  }

  /**
   * Set lightbar color
   * @param {number} red - Red component (0-255)
   * @param {number} green - Green component (0-255)
   * @param {number} blue - Blue component (0-255)
   */
  async setLightbarColor(red = 0, green = 0, blue = 0) {
    try {
      const { validFlag0 } = this.currentOutputState;
      const outputStruct = new DS4OutputStruct({
        ...this.currentOutputState,
        ledRed: Math.max(0, Math.min(255, red)),
        ledGreen: Math.max(0, Math.min(255, green)),
        ledBlue: Math.max(0, Math.min(255, blue)),
        validFlag0: validFlag0 | DS4_VALID_FLAG0.LED,
      });
      await this.sendOutputReport(outputStruct.pack(), 'set lightbar color');
      outputStruct.validFlag0 &= ~DS4_VALID_FLAG0.LED;

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);
    } catch (error) {
      throw new Error("Failed to set lightbar color", { cause: error });
    }
  }

  /**
   * Set lightbar blink pattern
   * @param {number} red - Red component (0-255)
   * @param {number} green - Green component (0-255)
   * @param {number} blue - Blue component (0-255)
   * @param {number} flashOn - On duration in deciseconds (0-255)
   * @param {number} flashOff - Off duration in deciseconds (0-255)
   */
  async setLightbarBlink(red = 0, green = 0, blue = 0, flashOn = 0, flashOff = 0) {
    try {
      const { validFlag0 } = this.currentOutputState;
      const outputStruct = new DS4OutputStruct({
        ...this.currentOutputState,
        ledRed: Math.max(0, Math.min(255, red)),
        ledGreen: Math.max(0, Math.min(255, green)),
        ledBlue: Math.max(0, Math.min(255, blue)),
        ledFlashOn: Math.max(0, Math.min(255, flashOn)),
        ledFlashOff: Math.max(0, Math.min(255, flashOff)),
        validFlag0: validFlag0 | DS4_VALID_FLAG0.LED | DS4_VALID_FLAG0.LED_BLINK,
      });
      await this.sendOutputReport(outputStruct.pack(), 'set lightbar blink');
      outputStruct.validFlag0 &= ~(DS4_VALID_FLAG0.LED | DS4_VALID_FLAG0.LED_BLINK);

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);
    } catch (error) {
      throw new Error("Failed to set lightbar blink", { cause: error });
    }
  }

  /**
   * Set speaker tone for audio output through the controller's headphone jack
   * Note: DS4 only supports playing sound through headphones connected to the controller.
   * The built-in speaker is not supported. DS4 audio is a standard USB audio device,
   * not controlled via HID output reports.
   * @param {string} output - Audio output destination: "headphones" only (throws error if "speaker")
   * @throws {Error} If output is set to "speaker" (not supported on DS4)
   */
  async setSpeakerTone(output = "speaker") {
    // Throw error if trying to use the built-in speaker
    if (output === "speaker") {
      throw new Error("DS4 does not support playing sound through the built-in speaker. Only 'headphones' output is supported.");
    }

    // DS4 speaker works as a standard USB audio device (class-compliant)
    // It cannot be controlled through HID output reports like DS5

    // Create Web Audio Context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Try to get microphone permission to see device labels
    let hasPermission = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      hasPermission = true;
    } catch (error) {
      throw new Error('Microphone permission required to enumerate audio devices', { cause: error });
    }

    // Check if we have access to audio devices and setSinkId support
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devices.filter(device => device.kind === 'audiooutput');

      // Look for DualShock 4 audio device
      const ds4AudioDevice = audioOutputs.find(device =>
        device.label && /wireless controller|dualshock|sony/i.test(device.label)
      );

      // Create audio elements for tone generation
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

      // Configure volume envelope (fade in/out to avoid clicks)
      // Use max volume for better audibility
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.5);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.25);

      // Connect audio graph
      oscillator.connect(gainNode);

      let audioElement = null;

      // If DS4 audio device is found and setSinkId is supported, route to it
      if (ds4AudioDevice && typeof HTMLMediaElement !== 'undefined' && HTMLMediaElement.prototype.setSinkId) {
        try {
          // Create a MediaStreamDestination to capture the audio
          const streamDestination = audioContext.createMediaStreamDestination();
          gainNode.connect(streamDestination);

          // Create an audio element to play the stream
          audioElement = new Audio();
          audioElement.autoplay = false;
          audioElement.volume = 1.0; // Max volume

          // Set the audio output to the DS4 speaker BEFORE setting srcObject
          await audioElement.setSinkId(ds4AudioDevice.deviceId);
          audioElement.srcObject = streamDestination.stream;

          // Play the audio element FIRST
          await audioElement.play();

          // THEN start the oscillator (so the stream is already being consumed)
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.8);
        } catch (error) {
          throw new Error('Could not set DS4 as audio sink', { cause: error });
        }
      }

      // Clean up audio context and element after tone completes
      setTimeout(() => {
        if (audioElement) {
          audioElement.pause();
          audioElement.srcObject = null;
        }
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      }, 1000);
    } else {
      throw new Error('WebRTC getUserMedia API or mediaDevices enumeration not available.');
    }
  }

  getNumberOfSticks() {
    return 2;
  }

  /**
   * Get the list of supported quick tests for DS4 controller
   * DS4 does not support adaptive triggers, speaker, or microphone
   * @returns {Array<string>} Array of supported test types
   */
  getSupportedQuickTests() {
    return ['usb', 'buttons', 'haptic', 'lights', 'headphone'];
  }
}

// DS5 Button mapping configuration
const DS5_BUTTON_MAP = [
  { name: 'up', byte: 7, mask: 0x0 }, // Dpad handled separately
  { name: 'right', byte: 7, mask: 0x1 },
  { name: 'down', byte: 7, mask: 0x2 },
  { name: 'left', byte: 7, mask: 0x3 },
  { name: 'square', byte: 7, mask: 0x10, svg: 'Square' },
  { name: 'cross', byte: 7, mask: 0x20, svg: 'Cross' },
  { name: 'circle', byte: 7, mask: 0x40, svg: 'Circle' },
  { name: 'triangle', byte: 7, mask: 0x80, svg: 'Triangle' },
  { name: 'l1', byte: 8, mask: 0x01, svg: 'L1' },
  { name: 'l2', byte: 4, mask: 0xff }, // analog handled separately
  { name: 'r1', byte: 8, mask: 0x02, svg: 'R1' },
  { name: 'r2', byte: 5, mask: 0xff }, // analog handled separately
  { name: 'create', byte: 8, mask: 0x10, svg: 'Create' },
  { name: 'options', byte: 8, mask: 0x20, svg: 'Options' },
  { name: 'l3', byte: 8, mask: 0x40, svg: 'L3' },
  { name: 'r3', byte: 8, mask: 0x80, svg: 'R3' },
  { name: 'ps', byte: 9, mask: 0x01, svg: 'PS' },
  { name: 'touchpad', byte: 9, mask: 0x02, svg: 'Trackpad' },
  { name: 'mute', byte: 9, mask: 0x04, svg: 'Mute' },
];

// DS5 Input processing configuration
const DS5_INPUT_CONFIG = {
  buttonMap: DS5_BUTTON_MAP,
  dpadByte: 7,
  l2AnalogByte: 4,
  r2AnalogByte: 5,
  touchpadOffset: 32,
};

// DS5 Adaptive Trigger Effect Modes
const DS5_TRIGGER_EFFECT_MODE = {
  OFF: 0x00,           // No effect
  RESISTANCE: 0x01,    // Constant resistance
  TRIGGER: 0x02,       // Single-trigger effect with release
  AUTO_TRIGGER: 0x06,  // Automatic trigger with vibration
};

// DS5 Output Report Constants
const DS5_OUTPUT_REPORT = {
  USB_REPORT_ID: 0x02,
  BT_REPORT_ID: 0x31,
};

const DS5_VALID_FLAG0 = {
  RIGHT_VIBRATION: 0x01,  // Bit 0 for right vibration motor
  LEFT_VIBRATION: 0x02,   // Bit 1 for left vibration motor
  LEFT_TRIGGER: 0x04,     // Bit 2 for left adaptive trigger
  RIGHT_TRIGGER: 0x08,    // Bit 3 for right adaptive trigger
  HEADPHONE_VOLUME: 0x10, // Bit 4 for headphone volume control
  SPEAKER_VOLUME: 0x20,   // Bit 5 for speaker volume control
  MIC_VOLUME: 0x40,       // Bit 6 for microphone volume control
  AUDIO_CONTROL: 0x80,    // Bit 7 for audio control
};

const DS5_VALID_FLAG1 = {
  MUTE_LED: 0x01,          // Bit 0 for mute LED control
  POWER_SAVE_MUTE: 0x02,   // Bit 1 for power-save mute control
  LIGHTBAR_COLOR: 0x04,    // Bit 2 for lightbar color control
  RESERVED_BIT_3: 0x08,    // Bit 3 (reserved)
  PLAYER_INDICATOR: 0x10,  // Bit 4 for player indicator LED control
  LED_BRIGHTNESS: 0x20,    // Bit 6 for LED brightness control
  LIGHTBAR_SETUP: 0x40,    // Bit 6 for lightbar setup control
  RESERVED_BIT_7: 0x80,    // Bit 7 (reserved)
};

// Basic DS5 Output Structure for adaptive trigger control
class DS5OutputStruct {
  constructor(currentState = null) {
    // Create a 47-byte buffer for DS5 output report (USB)
    this.buffer = new ArrayBuffer(47);
    this.view = new DataView(this.buffer);

    // Control flags
    this.validFlag0 = currentState.validFlag0 || 0;
    this.validFlag1 = currentState.validFlag1 || 0;
    this.validFlag2 = currentState.validFlag2 || 0;

    // Vibration motors
    this.bcVibrationRight = currentState.bcVibrationRight || 0;
    this.bcVibrationLeft = currentState.bcVibrationLeft || 0;

    // Audio control
    this.headphoneVolume = currentState.headphoneVolume || 0;
    this.speakerVolume = currentState.speakerVolume || 0;
    this.micVolume = currentState.micVolume || 0;
    this.audioControl = currentState.audioControl || 0;
    this.audioControl2 = currentState.audioControl2 || 0;

    // LED and indicator control
    this.muteLedControl = currentState.muteLedControl || 0;
    this.powerSaveMuteControl = currentState.powerSaveMuteControl || 0;
    this.lightbarSetup = currentState.lightbarSetup || 0;
    this.ledBrightness = currentState.ledBrightness || 0;
    this.playerIndicator = currentState.playerIndicator || 0;
    this.ledCRed = currentState.ledCRed || 0;
    this.ledCGreen = currentState.ledCGreen || 0;
    this.ledCBlue = currentState.ledCBlue || 0;

    // Adaptive trigger parameters
    this.adaptiveTriggerLeftMode = currentState.adaptiveTriggerLeftMode || 0;
    this.adaptiveTriggerLeftParam0 = currentState.adaptiveTriggerLeftParam0 || 0;
    this.adaptiveTriggerLeftParam1 = currentState.adaptiveTriggerLeftParam1 || 0;
    this.adaptiveTriggerLeftParam2 = currentState.adaptiveTriggerLeftParam2 || 0;

    this.adaptiveTriggerRightMode = currentState.adaptiveTriggerRightMode || 0;
    this.adaptiveTriggerRightParam0 = currentState.adaptiveTriggerRightParam0 || 0;
    this.adaptiveTriggerRightParam1 = currentState.adaptiveTriggerRightParam1 || 0;
    this.adaptiveTriggerRightParam2 = currentState.adaptiveTriggerRightParam2 || 0;

    // Haptic feedback
    this.hapticVolume = currentState.hapticVolume || 0;
  }

  // Pack the data into the output buffer
  pack() {
    // Based on DS5 output report structure from HID descriptor
    // Byte 0-1: Control flags (16-bit little endian)
    this.view.setUint16(0, (this.validFlag1 << 8) | this.validFlag0, true);

    // Byte 2-3: Vibration motors
    this.view.setUint8(2, this.bcVibrationRight);
    this.view.setUint8(3, this.bcVibrationLeft);

    // Bytes 4-7: Audio control (reserved for now)
    this.view.setUint8(4, this.headphoneVolume);
    this.view.setUint8(5, this.speakerVolume);
    this.view.setUint8(6, this.micVolume);
    this.view.setUint8(7, this.audioControl);

    // Byte 8: Mute LED control
    this.view.setUint8(8, this.muteLedControl);

    // Byte 9: Reserved
    this.view.setUint8(9, 0);

    // Bytes 10-20: Right adaptive trigger
    this.view.setUint8(10, this.adaptiveTriggerRightMode);
    this.view.setUint8(11, this.adaptiveTriggerRightParam0);
    this.view.setUint8(12, this.adaptiveTriggerRightParam1);
    this.view.setUint8(13, this.adaptiveTriggerRightParam2);
    // Additional trigger parameters (bytes 14-20 reserved for extended params)
    for (let i = 14; i <= 20; i++) {
      this.view.setUint8(i, 0);
    }

    // Bytes 21-31: Left adaptive trigger
    this.view.setUint8(21, this.adaptiveTriggerLeftMode);
    this.view.setUint8(22, this.adaptiveTriggerLeftParam0);
    this.view.setUint8(23, this.adaptiveTriggerLeftParam1);
    this.view.setUint8(24, this.adaptiveTriggerLeftParam2);
    // Additional trigger parameters (bytes 25-31 reserved for extended params)
    for (let i = 25; i <= 31; i++) {
      this.view.setUint8(i, 0);
    }

    // Bytes 32-42: Reserved
    for (let i = 32; i <= 42; i++) {
      this.view.setUint8(i, 0);
    }

    // Byte 43: Player LED indicator
    this.view.setUint8(43, this.playerIndicator);

    // Bytes 44-46: Lightbar RGB
    this.view.setUint8(44, this.ledCRed);
    this.view.setUint8(45, this.ledCGreen);
    this.view.setUint8(46, this.ledCBlue);

    return this.buffer;
  }
}

function ds5_color(serialNumber) {
  // Color is obtained by the 5th and 6th characters of the serial number
  // e.g. A12305xxx0000000 -> '05' -> Starlight Blue
  const colorMap = {
    '00': 'White',
    '01': 'Midnight Black',
    '02': 'Cosmic Red',
    '03': 'Nova Pink',
    '04': 'Galactic Purple',
    '05': 'Starlight Blue',
    '06': 'Grey Camouflage',
    '07': 'Volcanic Red',
    '08': 'Sterling Silver',
    '09': 'Cobalt Blue',
    '10': 'Chroma Teal',
    '11': 'Chroma Indigo',
    '12': 'Chroma Pearl',
    '30': '30th Anniversary',
    'Z1': 'God of War Ragnarok',
    'Z2': 'Spider-Man 2',
    'Z3': 'Astro Bot',
    'Z4': 'Fortnite',
    'Z6': 'The Last of Us',
    'ZB': 'Icon Blue Limited Edition',
  };

  const colorCode = serialNumber.slice(4, 6);
  const colorName = colorMap[colorCode] || 'Unknown';
  return colorName;
}

/**
* DualSense (DS5) Controller implementation
*/
class DS5Controller extends BaseController {
  constructor(device) {
    super(device);
    this.model = "DS5";
    this.finetuneMaxValue = 65535; // 16-bit max value for DS5

    // Initialize current output state to track controller settings
    this.currentOutputState = {
      validFlag0: 0,
      validFlag1: 0,
      validFlag2: 0,
      bcVibrationRight: 0,
      bcVibrationLeft: 0,
      headphoneVolume: 0,
      speakerVolume: 0,
      micVolume: 0,
      audioControl: 0,
      audioControl2: 0,
      muteLedControl: 0,
      powerSaveMuteControl: 0,
      lightbarSetup: 0,
      ledBrightness: 0,
      playerIndicator: 0,
      ledCRed: 0,
      ledCGreen: 0,
      ledCBlue: 0,
      adaptiveTriggerLeftMode: 0,
      adaptiveTriggerLeftParam0: 0,
      adaptiveTriggerLeftParam1: 0,
      adaptiveTriggerLeftParam2: 0,
      adaptiveTriggerRightMode: 0,
      adaptiveTriggerRightParam0: 0,
      adaptiveTriggerRightParam1: 0,
      adaptiveTriggerRightParam2: 0,
      hapticVolume: 0
    };
  }

  getInputConfig() {
    return DS5_INPUT_CONFIG;
  }

  async getSerialNumber() {
    return await this.getSystemInfo(1, 19, 17);
  }

  async getInfo() {
    return this._getInfo(false);
  }

  async _getInfo(is_edge) {
    // Device-only: collect info and return a common structure; do not touch the DOM
    try {
      console.log("Fetching DS5 info...");
      const view = await this.receiveFeatureReport(0x20);
      console.log("Got DS5 info report:", buf2hex(view.buffer));
      const cmd = view.getUint8(0, true);
      if(cmd != 0x20 || view.buffer.byteLength != 64)
        return { ok: false, error: new Error("Invalid response for ds5_info") };

      const build_date = new TextDecoder().decode(view.buffer.slice(1, 1+11));
      const build_time = new TextDecoder().decode(view.buffer.slice(12, 20));

      const fwtype     = view.getUint16(20, true);
      const swseries   = view.getUint16(22, true);
      const hwinfo     = view.getUint32(24, true);
      const fwversion  = view.getUint32(28, true);

      const updversion = view.getUint16(44, true);
      const unk        = view.getUint8(46, true);

      const fwversion1 = view.getUint32(48, true);
      const fwversion2 = view.getUint32(52, true);
      const fwversion3 = view.getUint32(56, true);

      const serial_number = await this.getSystemInfo(1, 19, 17);
      const color = ds5_color(serial_number);
      const infoItems = [
        { key: l("Serial Number"), value: serial_number, cat: "hw", copyable: true },
        { key: l("MCU Unique ID"), value: await this.getSystemInfo(1, 9, 9, false), cat: "hw", isExtra: true, copyable: true },
        { key: l("PCBA ID"), value: reverse_str(await this.getSystemInfo(1, 17, 14)), cat: "hw", isExtra: true },
        { key: l("Battery Barcode"), value: await this.getSystemInfo(1, 24, 23), cat: "hw", isExtra: true, copyable: true },
        { key: l("VCM Left Barcode"), value: await this.getSystemInfo(1, 26, 16), cat: "hw", isExtra: true, copyable: true },
        { key: l("VCM Right Barcode"), value: await this.getSystemInfo(1, 28, 16), cat: "hw", isExtra: true, copyable: true },

        { key: l("Color"), value: l(color), cat: "hw", addInfoIcon: 'color', copyable: true },

        ...(is_edge ? [] : [{ key: l("Board Model"), value: this.hwToBoardModel(hwinfo), cat: "hw", addInfoIcon: 'board', copyable: true }]),

        { key: l("FW Build Date"), value: build_date + " " + build_time, cat: "fw" },
        { key: l("FW Type"), value: "0x" + dec2hex(fwtype), cat: "fw", isExtra: true },
        { key: l("FW Series"), value: "0x" + dec2hex(swseries), cat: "fw", isExtra: true },
        { key: l("HW Model"), value: "0x" + dec2hex32$1(hwinfo), cat: "hw", isExtra: true },
        { key: l("FW Version"), value: "0x" + dec2hex32$1(fwversion), cat: "fw", isExtra: true },
        { key: l("FW Update"), value: "0x" + dec2hex(updversion), cat: "fw", isExtra: true },
        { key: l("FW Update Info"), value: "0x" + dec2hex8(unk), cat: "fw", isExtra: true },
        { key: l("SBL FW Version"), value: "0x" + dec2hex32$1(fwversion1), cat: "fw", isExtra: true },
        { key: l("Venom FW Version"), value: "0x" + dec2hex32$1(fwversion2), cat: "fw", isExtra: true },
        { key: l("Spider FW Version"), value: "0x" + dec2hex32$1(fwversion3), cat: "fw", isExtra: true },

        { key: l("Touchpad ID"), value: await this.getSystemInfo(5, 2, 8, false), cat: "hw", isExtra: true, copyable: true },
        { key: l("Touchpad FW Version"), value: await this.getSystemInfo(5, 4, 8, false), cat: "fw", isExtra: true },
      ];

      const old_controller = build_date.search(/ 2020| 2021/);
      let disable_bits = 0;
      if(old_controller != -1) {
        // la("ds5_info_error", {"r": "old"})
        disable_bits |= 2; // 2: outdated firmware
      }

      const nv = await this.queryNvStatus();
      const bd_addr = await this.getBdAddr();
      infoItems.push({ key: l("Bluetooth Address"), value: bd_addr, cat: "hw", isExtra: true });

      const pending_reboot = (nv?.status === 'pending_reboot');

      return { ok: true, infoItems, nv, disable_bits, pending_reboot };
    } catch(error) {
      // la("ds5_info_error", {"r": error})
      return { ok: false, error, disable_bits: 1 };
    }
  }

  async flash(progressCallback = null) {
    // la("ds5_flash");
    try {
      await this.nvsUnlock();
      const lockRes = await this.nvsLock();
      if(!lockRes.ok) throw (lockRes.error || new Error("NVS lock failed"));

      return { success: true, message: l("Changes saved successfully") };
    } catch(error) {
      throw new Error(l("Error while saving changes"), { cause: error });
    }
  }

  async reset() {
    // la("ds5_reset");
    try {
      await this.sendFeatureReport(0x80, [1,1]);
    } catch(error) {
    }
  }

  async nvsLock() {
    // la("ds5_nvlock");
    try {
      await this.sendFeatureReport(0x80, [3,1]);
      await this.receiveFeatureReport(0x81);
      return { ok: true };
    } catch(error) {
      return { ok: false, error };
    }
  }

  async nvsUnlock() {
    // la("ds5_nvunlock");
    try {
      await this.sendFeatureReport(0x80, [3,2, 101, 50, 64, 12]);
      const data = await this.receiveFeatureReport(0x81);
    } catch(error) {
      await sleep(500);
      throw new Error(l("NVS Unlock failed"), { cause: error });
    }
  }

  async getBdAddr() {
    await this.sendFeatureReport(0x80, [9,2]);
    const data = await this.receiveFeatureReport(0x81);
    return format_mac_from_view(data, 4);
  }

  async getSystemInfo(base, num, length, decode = true) {
    await this.sendFeatureReport(128, [base,num]);
    const pcba_id = await this.receiveFeatureReport(129);
    if(pcba_id.getUint8(1) != base || pcba_id.getUint8(2) != num || pcba_id.getUint8(3) != 2) {
      return l("error");
    }
    if(decode)
      return new TextDecoder().decode(pcba_id.buffer.slice(4, 4+length));

    return buf2hex(pcba_id.buffer.slice(4, 4+length));
  }

  async calibrateSticksBegin() {
    // la("ds5_calibrate_sticks_begin");
    try {
      // Begin
      await this.sendFeatureReport(0x82, [1,1,1]);

      // Assert
      const data = await this.receiveFeatureReport(0x83);
      if(data.getUint32(0, false) != 0x83010101) {
        const d1 = dec2hex32$1(data.getUint32(0, false));
        // la("ds5_calibrate_sticks_begin_failed", {"d1": d1});
        throw new Error(`Stick center calibration begin failed: ${d1}`);
      }
      return { ok: true };
    } catch(error) {
      // la("ds5_calibrate_sticks_begin_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async calibrateSticksSample() {
    // la("ds5_calibrate_sticks_sample");
    try {
      // Sample
      await this.sendFeatureReport(0x82, [3,1,1]);

      // Assert
      const data = await this.receiveFeatureReport(0x83);
      if(data.getUint32(0, false) != 0x83010101) {
        const d1 = dec2hex32$1(data.getUint32(0, false));
        // la("ds5_calibrate_sticks_sample_failed", {"d1": d1});
        throw new Error(`Stick center calibration sample failed: ${d1}`);
      }
      return { ok: true };
    } catch(error) {
      // la("ds5_calibrate_sticks_sample_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async calibrateSticksEnd() {
    // la("ds5_calibrate_sticks_end");
    try {
      // Write
      await this.sendFeatureReport(0x82, [2,1,1]);

      const data = await this.receiveFeatureReport(0x83);

      if(data.getUint32(0, false) != 0x83010102) {
        const d1 = dec2hex32$1(data.getUint32(0, false));
        // la("ds5_calibrate_sticks_failed", {"s": 3, "d1": d1});
        throw new Error(`Stick center calibration end failed: ${d1}`);
      }

      return { ok: true };
    } catch(error) {
      // la("ds5_calibrate_sticks_end_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async calibrateRangeBegin() {
    // la("ds5_calibrate_range_begin");
    try {
      // Begin
      await this.sendFeatureReport(0x82, [1,1,2]);

      // Assert
      const data = await this.receiveFeatureReport(0x83);
      if(data.getUint32(0, false) != 0x83010201) {
        const d1 = dec2hex32$1(data.getUint32(0, false));
        // la("ds5_calibrate_range_begin_failed", {"d1": d1});
        throw new Error(`Stick range calibration begin failed: ${d1}`);
      }
      return { ok: true };
    } catch(error) {
      // la("ds5_calibrate_range_begin_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async calibrateRangeEnd() {
    // la("ds5_calibrate_range_end");
    try {
      // Write
      await this.sendFeatureReport(0x82, [2,1,2]);

      // Assert
      const data = await this.receiveFeatureReport(0x83);

      if(data.getUint32(0, false) != 0x83010202) {
        const d1 = dec2hex32$1(data.getUint32(0, false));
        // la("ds5_calibrate_range_end_failed", {"d1": d1});
        throw new Error(`Stick range calibration end failed: ${d1}`);
      }

      return { ok: true };
    } catch(error) {
      // la("ds5_calibrate_range_end_failed", {"r": error});
      return { ok: false, error };
    }
  }

  async queryNvStatus() {
    try {
      await this.sendFeatureReport(0x80, [3,3]);
      const data = await this.receiveFeatureReport(0x81);
      const ret = data.getUint32(1, false);
      if (ret === 0x15010100) {
        return { device: 'ds5', status: 'pending_reboot', locked: null, code: 4, raw: ret };
      }
      if (ret === 0x03030201) {
        return { device: 'ds5', status: 'locked', locked: true, mode: 'temporary', code: 1, raw: ret };
      }
      if (ret === 0x03030200) {
        return { device: 'ds5', status: 'unlocked', locked: false, mode: 'permanent', code: 0, raw: ret };
      }
      if (ret === 1 || ret === 2) {
        return { device: 'ds5', status: 'unknown', locked: null, code: 2, raw: ret };
      }
      return { device: 'ds5', status: 'unknown', locked: null, code: ret, raw: ret };
    } catch (error) {
      return { device: 'ds5', status: 'error', locked: null, code: 2, error };
    }
  }

  hwToBoardModel(hw_ver) {
    const a = (hw_ver >> 8) & 0xff;
    if(a == 0x03) return "BDM-010";
    if(a == 0x04) return "BDM-020";
    if(a == 0x05) return "BDM-030";
    if(a == 0x06) return "BDM-040";
    if(a == 0x07 || a == 0x08) return "BDM-050";
    // TODO 0x09..0x10?
    if(a == 0x11) return "BDM-060M";
    // TODO 0x12?
    if(a == 0x13) return "BDM-060X";
    return l("Unknown");
  }

  async getInMemoryModuleData() {
    // DualSense
    await this.sendFeatureReport(0x80, [12, 2]);
    await sleep(100);
    const data = await this.receiveFeatureReport(0x81);
    const cmd = data.getUint8(0, true);
    const [p1, p2, p3] = [1, 2, 3].map(i => data.getUint8(i, true));

    if(cmd != 129 || p1 != 12 || (p2 != 2 && p2 != 4) || p3 != 2)
      return null;

    return Array.from({ length: 12 }, (_, i) => data.getUint16(4 + i * 2, true));
  }

  async writeFinetuneData(data) {
    const pkg = data.reduce((acc, val) => acc.concat([val & 0xff, val >> 8]), [12, 1]);
    await this.sendFeatureReport(0x80, pkg);
  }

  /**
   * Send output report to the DS5 controller
   * @param {ArrayBuffer} data - The output report data
   */
  async sendOutputReport(data, reason = "") {
    if (!this.device?.opened) {
      throw new Error('Device is not opened');
    }
    try {
      // console.log(`Sending output report${ reason ? ` to ${reason}` : '' }:`, DS5_OUTPUT_REPORT.USB_REPORT_ID, buf2hex(data));
      await this.device.sendReport(DS5_OUTPUT_REPORT.USB_REPORT_ID, new Uint8Array(data));
    } catch (error) {
      throw new Error(`Failed to send output report: ${error.message}`);
    }
  }

  /**
   * Update the current output state with values from an OutputStruct
   * @param {DS5OutputStruct} outputStruct - The output structure to copy state from
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
   * Since DS5 controllers don't provide a way to read the current output state,
   * this method sets up reasonable defaults and attempts to detect any current settings.
   */
  async initializeCurrentOutputState() {
    try {
      // Reset all output state to known defaults
      this.currentOutputState = {
        ...this.getCurrentOutputState(),
        validFlag1: 0b1111_0111,
        ledCRed: 0,
        ledCGreen: 0,
        ledCBlue: 255,
      };

      // Send a "reset" output report to ensure the controller is in a known state
      // This will turn off any existing effects and set the controller to defaults
      const resetOutputStruct = new DS5OutputStruct(this.currentOutputState);
      await this.sendOutputReport(resetOutputStruct.pack(), 'init default states');

      // Update our state to reflect what we just sent
      this.updateCurrentOutputState(resetOutputStruct);
    } catch (error) {
      console.warn("Failed to initialize DS5 output state:", error);
      // Even if the reset fails, we still have the default state initialized
    }
  }

  /**
   * Set left adaptive trigger to single-trigger mode
   */
  async setAdaptiveTrigger(left, right) {
    try {
      const modeMap = {
        'off': DS5_TRIGGER_EFFECT_MODE.OFF,
        'single': DS5_TRIGGER_EFFECT_MODE.TRIGGER,
        'auto': DS5_TRIGGER_EFFECT_MODE.AUTO_TRIGGER,
        'resistance': DS5_TRIGGER_EFFECT_MODE.RESISTANCE,
      };

      // Create output structure with current controller state
      const { validFlag0 } = this.currentOutputState;
      const outputStruct = new DS5OutputStruct({
        ...this.currentOutputState,
        adaptiveTriggerLeftMode: modeMap[left.mode],
        adaptiveTriggerLeftParam0: left.start,
        adaptiveTriggerLeftParam1: left.end,
        adaptiveTriggerLeftParam2: left.force,

        adaptiveTriggerRightMode: modeMap[right.mode],
        adaptiveTriggerRightParam0: right.start,
        adaptiveTriggerRightParam1: right.end,
        adaptiveTriggerRightParam2: right.force,

        validFlag0: validFlag0 | DS5_VALID_FLAG0.LEFT_TRIGGER | DS5_VALID_FLAG0.RIGHT_TRIGGER,
      });
      await this.sendOutputReport(outputStruct.pack(), 'set adaptive trigger mode');
      outputStruct.validFlag0 &= ~(DS5_VALID_FLAG0.LEFT_TRIGGER | DS5_VALID_FLAG0.RIGHT_TRIGGER);

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);

      return { success: true };
    } catch (error) {
      throw new Error("Failed to set left adaptive trigger mode", { cause: error });
    }
  }

  /**
   * Set vibration motors for haptic feedback
   * @param {number} heavyLeft - Left motor intensity (0-255)
   * @param {number} lightRight - Right motor intensity (0-255)
   */
  async setVibration(heavyLeft = 0, lightRight = 0) {
    try {
      const { validFlag0 } = this.currentOutputState;
      const outputStruct = new DS5OutputStruct({
        ...this.currentOutputState,
        bcVibrationLeft: Math.max(0, Math.min(255, heavyLeft)),
        bcVibrationRight: Math.max(0, Math.min(255, lightRight)),
        validFlag0: validFlag0 | DS5_VALID_FLAG0.LEFT_VIBRATION | DS5_VALID_FLAG0.RIGHT_VIBRATION, // Update both vibration motors
      });
      await this.sendOutputReport(outputStruct.pack(), 'set vibration');
      outputStruct.validFlag0 &= ~(DS5_VALID_FLAG0.LEFT_VIBRATION | DS5_VALID_FLAG0.RIGHT_VIBRATION);

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);
    } catch (error) {
      throw new Error("Failed to set vibration", { cause: error });
    }
  }

  /**
   * Test speaker tone by controlling speaker volume and audio settings
   * This creates a brief audio feedback through the controller's speaker or headphones
   * @param {string} output - Audio output destination: "speaker" (default) or "headphones"
   */
  async setSpeakerTone(output = "speaker") {
    try {
      const { validFlag0 } = this.currentOutputState;
      const outputStruct = new DS5OutputStruct({
        ...this.currentOutputState,
        speakerVolume: 85,
        headphoneVolume: 55,
        validFlag0: validFlag0 | DS5_VALID_FLAG0.HEADPHONE_VOLUME | DS5_VALID_FLAG0.SPEAKER_VOLUME | DS5_VALID_FLAG0.AUDIO_CONTROL,
      });
      await this.sendOutputReport(outputStruct.pack(), output === "headphones" ? 'play headphone tone' : 'play speaker tone');
      outputStruct.validFlag0 &= ~(DS5_VALID_FLAG0.HEADPHONE_VOLUME | DS5_VALID_FLAG0.SPEAKER_VOLUME | DS5_VALID_FLAG0.AUDIO_CONTROL);

      // Send feature reports to enable audio
      if (output === "headphones") {
        // Audio configuration command for headphones
        await this.sendFeatureReport(128, [6, 4, 0, 0, 0, 0, 4, 0, 6]);
        // Enable headphone tone
        await this.sendFeatureReport(128, [6, 2, 1, 1, 0]);
      } else {
        // Audio configuration command for speakers
        await this.sendFeatureReport(128, [6, 4, 0, 0, 8]);
        // Enable speaker tone
        await this.sendFeatureReport(128, [6, 2, 1, 1, 0]);
      }

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);
    } catch (error) {
      throw new Error("Failed to set speaker tone", { cause: error });
    }
  }

  /**
   * Reset speaker settings to default (turn off speaker)
   */
  async resetSpeakerSettings() {
    try {
      // Disable speaker tone first via feature report
      await this.sendFeatureReport(128, [6, 2, 0, 1, 0]);

      const { validFlag0 } = this.currentOutputState;
      const outputStruct = new DS5OutputStruct({
        ...this.currentOutputState,
        speakerVolume: 0,
        validFlag0: validFlag0 | DS5_VALID_FLAG0.SPEAKER_VOLUME | DS5_VALID_FLAG0.AUDIO_CONTROL,
      });
      // outputStruct.audioControl = 0x00;
      await this.sendOutputReport(outputStruct.pack(), 'stop speaker tone');
      outputStruct.validFlag0 &= ~(DS5_VALID_FLAG0.SPEAKER_VOLUME | DS5_VALID_FLAG0.AUDIO_CONTROL);

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);
    } catch (error) {
      throw new Error("Failed to reset speaker settings", { cause: error });
    }
  }

  /**
   * Set lightbar color
   * @param {number} red - Red component (0-255)
   * @param {number} green - Green component (0-255)
   * @param {number} blue - Blue component (0-255)
   */
  async setLightbarColor(red = 0, green = 0, blue = 0) {
    try {
      const { validFlag1 } = this.currentOutputState;
      const outputStruct = new DS5OutputStruct({
        ...this.currentOutputState,
        ledCRed: Math.max(0, Math.min(255, red)),
        ledCGreen: Math.max(0, Math.min(255, green)),
        ledCBlue: Math.max(0, Math.min(255, blue)),
        validFlag1: validFlag1 | DS5_VALID_FLAG1.LIGHTBAR_COLOR,
      });
      await this.sendOutputReport(outputStruct.pack(), 'set lightbar color');
      outputStruct.validFlag1 &= ~DS5_VALID_FLAG1.LIGHTBAR_COLOR;

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);
    } catch (error) {
      throw new Error("Failed to set lightbar color", { cause: error });
    }
  }

  /**
   * Set player indicator lights
   * @param {number} pattern - Player indicator pattern (0-31, each bit represents a light)
   */
  async setPlayerIndicator(pattern = 0) {
    try {
      const { validFlag1 } = this.currentOutputState;
      const outputStruct = new DS5OutputStruct({
        ...this.currentOutputState,
        playerIndicator: Math.max(0, Math.min(31, pattern)),
        validFlag1: validFlag1 | DS5_VALID_FLAG1.PLAYER_INDICATOR,
      });
      await this.sendOutputReport(outputStruct.pack(), 'set player indicator');
      outputStruct.validFlag1 &= ~DS5_VALID_FLAG1.PLAYER_INDICATOR;

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);
    } catch (error) {
      throw new Error("Failed to set player indicator", { cause: error });
    }
  }

  /**
   * Reset lights to default state (turn off)
   */
  async resetLights() {
    try {
      await this.setLightbarColor(0, 0, 0);
      await this.setPlayerIndicator(0);
      await this.setMuteLed(0);
    } catch (error) {
      throw new Error("Failed to reset lights", { cause: error });
    }
  }

  /**
   * Set mute button LED state
   * @param {number} state - Mute LED state (0 = off, 1 = solid, 2 = pulsing)
   */
  async setMuteLed(state = 0) {
    try {
      const { validFlag1 } = this.currentOutputState;
      const outputStruct = new DS5OutputStruct({
        ...this.currentOutputState,
        muteLedControl: Math.max(0, Math.min(2, state)),
        validFlag1: validFlag1 | DS5_VALID_FLAG1.MUTE_LED,
      });
      await this.sendOutputReport(outputStruct.pack(), 'set mute LED');
      outputStruct.validFlag1 &= ~DS5_VALID_FLAG1.MUTE_LED;

      // Update current state to reflect the changes
      this.updateCurrentOutputState(outputStruct);
    } catch (error) {
      throw new Error("Failed to set mute LED", { cause: error });
    }
  }

  getNumberOfSticks() {
    return 2;
  }

  /**
  * Parse DS5 battery status from input data
  */
  parseBatteryStatus(data) {
    const bat = data.getUint8(52); // DS5 battery byte is at position 52

    // DS5: bat_charge = low 4 bits, bat_status = high 4 bits
    const bat_charge = bat & 0x0f;
    const bat_status = bat >> 4;

    let charge_level = 0;
    let cable_connected = false;
    let is_charging = false;
    let is_error = false;

    switch (bat_status) {
      case 0:
        // On battery power
        charge_level = Math.min(bat_charge * 10 + 5, 100);
        break;
      case 1:
        // Charging
        charge_level = Math.min(bat_charge * 10 + 5, 100);
        is_charging = true;
        cable_connected = true;
        break;
      case 2:
        // Fully charged
        charge_level = 100;
        cable_connected = true;
        break;
      case 15:
        // Battery is flat
        charge_level = 0;
        is_charging = true;
        cable_connected = true;
        break;
      case 11: // not sure yet what this error means
      default:
        // Error state
        is_error = true;
        break;
    }

    return { charge_level, cable_connected, is_charging, is_error };
  }
}

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

/**
* Controller Factory - Creates the appropriate controller instance based on device type
*/
class ControllerFactory {
  static getSupportedModels() {
    const ds4v1 = { vendorId: 0x054c, productId: 0x05c4 };
    const ds4v2 = { vendorId: 0x054c, productId: 0x09cc };
    const ds5 = { vendorId: 0x054c, productId: 0x0ce6 };
    const ds5edge = { vendorId: 0x054c, productId: 0x0df2 };
    const xbox = { vendorId: 0x045e, productId: 0x0b00 }; // Xbox Wireless Controller
    const xboxElite = { vendorId: 0x045e, productId: 0x0b05 }; // Xbox Elite Wireless Controller Series 2
    const xboxAdaptive = { vendorId: 0x045e, productId: 0x0b06 }; // Xbox Adaptive Controller
    const xboxSeriesXS = { vendorId: 0x045e, productId: 0x0b12 }; // Xbox Series X|S Controller
    return [ds4v1, ds4v2, ds5, ds5edge, xbox, xboxElite, xboxAdaptive, xboxSeriesXS];
  }


  /**
  * Create a controller instance based on the HID device product ID
  * @param {HIDDevice} device The HID device
  * @returns {BaseController} The appropriate controller instance
  */
  static createControllerInstance(device) {
    switch (device.productId) {
      case 0x05c4: // DS4 v1
      case 0x09cc: // DS4 v2
        return new DS4Controller(device);

      case 0x0ce6: // DS5
        return new DS5Controller(device);

      case 0x0df2: // DS5 Edge
        return new DS5EdgeController(device);

      case 0x0b00: // Xbox Wireless Controller
      case 0x0b05: // Xbox Elite Wireless Controller Series 2
      case 0x0b06: // Xbox Adaptive Controller
      case 0x0b12: // Xbox Series X|S Controller
        return new XboxController(device);

      default:
        throw new Error(`Unsupported device: ${dec2hex(device.vendorId)}:${dec2hex(device.productId)}`);
    }
  }

  /**
  * Get device name based on product ID
  * @param {number} vendorId Vendor ID
  * @param {number} productId Product ID
  * @returns {string} Device name
  */
  static getDeviceName(vendorId, productId) {
    if (vendorId === 0x054c) {
      switch (productId) {
        case 0x05c4: return "Sony DualShock 4 V1";
        case 0x09cc: return "Sony DualShock 4 V2";
        case 0x0ce6: return "Sony DualSense";
        case 0x0df2: return "Sony DualSense Edge";
        default: return "Unknown Sony Device";
      }
    } else if (vendorId === 0x045e) {
      switch (productId) {
        case 0x0b00: return "Xbox Wireless Controller";
        case 0x0b05: return "Xbox Elite Wireless Controller Series 2";
        case 0x0b06: return "Xbox Adaptive Controller";
        case 0x0b12: return "Xbox Series X|S Controller";
        default: return "Unknown Xbox Device";
      }
    }
    return "Unknown Device";
  }

  /**
  * Get UI configuration based on product ID
  * @param {number} vendorId Vendor ID
  * @param {number} productId Product ID
  * @returns {Object} UI configuration
  */
  static getUIConfig(vendorId, productId) {
    if (vendorId === 0x054c) {
      switch (productId) {
        case 0x05c4: // DS4 v1
        case 0x09cc: // DS4 v2
          return {
            showInfo: false,
            showFinetune: false,
            showInfoTab: false,
            showQuickTests: true,
            showFourStepCalib: true,
            showQuickCalib: false,
            showCalibrationHistory: false
          };

        case 0x0ce6: // DS5
        case 0x0df2: // DS5 Edge
          return {
            showInfo: true,
            showFinetune: true,
            showInfoTab: true,
            showQuickTests: true,
            showFourStepCalib: false,
            showQuickCalib: true,
            showCalibrationHistory: true
          };

        default:
          return {
            showInfo: false,
            showFinetune: false,
            showInfoTab: false,
            showQuickTests: false,
            showFourStepCalib: false,
            showQuickCalib: false,
            showCalibrationHistory: false
          };
      }
    } else if (vendorId === 0x045e) {
      // Xbox controllers
      return {
        showInfo: true,
        showFinetune: false,
        showInfoTab: true,
        showQuickTests: true,
        showFourStepCalib: false,
        showQuickCalib: true,
        showCalibrationHistory: false
      };
    }

    return {
      showInfo: false,
      showFinetune: false,
      showInfoTab: false,
      showQuickTests: false,
      showFourStepCalib: false,
      showQuickCalib: false,
      showCalibrationHistory: false
    };
  }
}

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
  const connectionRequiredScreen = document.getElementById("connectionRequiredScreen");
  if (connectionRequiredScreen) {
    connectionRequiredScreen.classList.add("d-none");
  }
  const appDashboardContent = document.getElementById("appDashboardContent");
  if (appDashboardContent) {
    appDashboardContent.classList.remove("d-none");
  }

  // Reset variables
  app.btMacAddress = "";
  app.hwVersionHex = "";
  app.boardModel = "";
  app.compileDate = "";
  app.compileTime = "";
  app.swVersion = "";

  // Find Gamepad API Index and Connection Type
  locateGamepadIndex();

  // Show/hide appropriate buttons
  const btnDisconnect = document.getElementById("btnDisconnect");
  const btnConnect = document.getElementById("btnConnect");
  const overviewInfoCard = document.getElementById("overviewInfoCard");
  const driftResultsRow = document.getElementById("driftResultsRow");

  if (btnDisconnect) {
    btnDisconnect.classList.remove("d-none");
  }
  if (btnConnect) {
    btnConnect.classList.add("d-none");
  }
  if (overviewInfoCard) {
    overviewInfoCard.classList.remove("opacity-50");
  }
  if (driftResultsRow) {
    driftResultsRow.classList.remove("opacity-50");
  }

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
  const overviewDevName = document.getElementById("overviewDevName");
  if (overviewDevName) {
    overviewDevName.innerText = devName;
  }
  const footerModelName = document.getElementById("footerModelName");
  if (footerModelName) {
    footerModelName.innerText = devName;
  }
  const overviewDevStatus = document.getElementById("overviewDevStatus");
  if (overviewDevStatus) {
    overviewDevStatus.innerText = "Connected via WebHID interface.";
  }

  // Log connection
  console.log(`Connected: ${devName} (VID: 0x${device.vendorId.toString(16)}, PID: 0x${device.productId.toString(16)})`);

  // Show/hide Edge warning banner
  const edgeWarningBanner = document.getElementById("edgeWarningBanner");
  if (edgeWarningBanner) {
    if (app.isEdge) {
      edgeWarningBanner.classList.remove("d-none");
    } else {
      edgeWarningBanner.classList.add("d-none");
    }
  }

  // Read reports to get details
  try {
    if (isDualShock) {
      const ds4BoardModelContainer = document.getElementById("ds4BoardModelContainer");
      if (ds4BoardModelContainer) {
        ds4BoardModelContainer.classList.remove("d-none");
      }

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
          const infoMac = document.getElementById("infoMac");
          if (infoMac) {
            infoMac.innerText = app.btMacAddress;
          }
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
        const infoBuildDate = document.getElementById("infoBuildDate");
        if (infoBuildDate) {
          infoBuildDate.innerText = `${app.compileDate} ${app.compileTime}`;
        }

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

        const infoBoardModel = document.getElementById("infoBoardModel");
        if (infoBoardModel) {
          infoBoardModel.innerText = app.boardModel;
        }
      }

      // Clone detection 2: try report 0x81
      try {
        await receiveFeatureReport(device, 0x81);
      } catch (e) {
        console.warn("Report 0x81 failed, clone likely", e);
        app.isClone = true;
      }
    } else if (isDualSense) {
      const ds4BoardModelContainer = document.getElementById("ds4BoardModelContainer");
      if (ds4BoardModelContainer) {
        ds4BoardModelContainer.classList.add("d-none");
      }
      const dualsenseFineTuneCard = document.getElementById("dualsenseFineTuneCard");
      if (dualsenseFineTuneCard) {
        dualsenseFineTuneCard.classList.remove("d-none");
      }

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
        const infoBuildDate = document.getElementById("infoBuildDate");
        if (infoBuildDate) {
          infoBuildDate.innerText = `${app.compileDate} ${app.compileTime}`;
        }

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
            const infoMac = document.getElementById("infoMac");
            if (infoMac) {
              infoMac.innerText = app.btMacAddress;
            }
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
      const nvsStatusText = document.getElementById("nvsStatusText");
      if (nvsStatusText) {
        nvsStatusText.innerHTML = `<span class="badge-custom badge-success"><i class="fa-solid fa-lock-open"></i> Unlocked (Ready)</span>`;
      }
      app.nvsState = 0;
    }

    // Register Touchpad inputs if connected via WebHID
    if (device) {
      device.addEventListener("inputreport", handleInputReport);
    }

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
  const offlinebar = document.getElementById("offlinebar");
  if (offlinebar) {
    offlinebar.show();
  }
  const onlinebar = document.getElementById("onlinebar");
  if (onlinebar) {
    onlinebar.hide();
  }
  const mainmenu = document.getElementById("mainmenu");
  if (mainmenu) {
    mainmenu.hide();
  }
  const aboutdrift = document.getElementById("aboutdrift");
  if (aboutdrift) {
    aboutdrift.show();
  }
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
        const infoConnectionType = document.getElementById("infoConnectionType");
        if (infoConnectionType) {
          infoConnectionType.innerText = gp.id.includes("Bluetooth") ? "Bluetooth" : "USB";
        }
        app.connectionType = gp.id.includes("Bluetooth") ? "Bluetooth" : "USB";
        return;
      }
    }
  }
  app.gamepadIndex = 0;
  const infoConnectionType = document.getElementById("infoConnectionType");
  if (infoConnectionType) {
    infoConnectionType.innerText = "USB (Auto)";
  }
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

  navigator.getGamepads()[app.gamepadIndex];

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
//# sourceMappingURL=app.js.map
