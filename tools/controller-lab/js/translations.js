'use strict';

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
export function l(key) {
  // Default to English if no translation found
  return translations.en[key] || key;
}

/**
* Initialize language system (placeholder)
* @param {Object} app - App state object
* @param {Function} handleLanguageChange - Callback for language changes
* @param {Function} show_welcome_modal - Function to show welcome modal
*/
export function lang_init(app, handleLanguageChange, show_welcome_modal) {
  // Placeholder for language initialization
  app.lang_cur = {};
  app.lang_cur_direction = "ltr";
  app.lang_disabled = false;
}

/**
* Handle language change (placeholder)
*/
export function handleLanguageChange() {
  // Placeholder for language change handling
}

export default {
  l,
  lang_init,
  handleLanguageChange
};