'use strict';

import DS4Controller from './ds4-controller.js';
import DS5Controller from './ds5-controller.js';
import XboxController from './xbox-controller.js';
import { dec2hex } from '../utils.js';

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

// Export for use in other modules
export default ControllerFactory;