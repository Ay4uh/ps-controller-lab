'use strict';

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

export default Storage;