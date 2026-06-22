'use strict';

import { initControllerManager } from '../controller-manager.js';

describe('ControllerManager', () => {
  let manager;
  let mockController;

  beforeEach(() => {
    // Mock controller
    mockController = {
      getDevice: jest.fn(),
      getModel: jest.fn(() => 'DS5'),
      getInputConfig: jest.fn(() => ({
        buttonMap: [],
        dpadByte: 7,
        l2AnalogByte: 4,
        r2AnalogByte: 5,
        touchpadOffset: 32,
      })),
      close: jest.fn(),
      setVibration: jest.fn(),
      parseBatteryStatus: jest.fn(() => ({
        charge_level: 80,
        is_charging: false,
        is_error: false,
        cable_connected: false,
      })),
    };

    manager = initControllerManager();
  });

  describe('Initialization', () => {
    test('should initialize with null controller', () => {
      expect(manager.isConnected()).toBe(false);
    });

    test('should initialize with has_changes_to_write as false', () => {
      expect(manager.has_changes_to_write).toBe(false);
    });
  });

  describe('Validation Methods', () => {
    describe('_validateVibrationValue', () => {
      test('should accept valid vibration value', () => {
        expect(() => {
          manager._validateVibrationValue(128, 'test');
        }).not.toThrow();
      });

      test('should reject non-numeric vibration value', () => {
        expect(() => {
          manager._validateVibrationValue('invalid', 'test');
        }).toThrow('test must be a number');
      });

      test('should reject vibration value below minimum', () => {
        expect(() => {
          manager._validateVibrationValue(-1, 'test');
        }).toThrow('must be between 0 and 255');
      });

      test('should reject vibration value above maximum', () => {
        expect(() => {
          manager._validateVibrationValue(256, 'test');
        }).toThrow('must be between 0 and 255');
      });

      test('should accept minimum vibration value', () => {
        expect(() => {
          manager._validateVibrationValue(0, 'test');
        }).not.toThrow();
      });

      test('should accept maximum vibration value', () => {
        expect(() => {
          manager._validateVibrationValue(255, 'test');
        }).not.toThrow();
      });
    });

    describe('_validateDuration', () => {
      test('should accept valid duration', () => {
        expect(() => {
          manager._validateDuration(5000);
        }).not.toThrow();
      });

      test('should reject non-numeric duration', () => {
        expect(() => {
          manager._validateDuration('invalid');
        }).toThrow('duration must be a number');
      });

      test('should reject negative duration', () => {
        expect(() => {
          manager._validateDuration(-1);
        }).toThrow('must be between 0 and 60000ms');
      });

      test('should reject duration exceeding maximum', () => {
        expect(() => {
          manager._validateDuration(60001);
        }).toThrow('must be between 0 and 60000ms');
      });

      test('should accept zero duration', () => {
        expect(() => {
          manager._validateDuration(0);
        }).not.toThrow();
      });
    });

    describe('_validatePreset', () => {
      test('should accept valid presets', () => {
        ['off', 'light', 'medium', 'heavy'].forEach(preset => {
          expect(() => {
            manager._validatePreset(preset);
          }).not.toThrow();
        });
      });

      test('should reject non-string preset', () => {
        expect(() => {
          manager._validatePreset(123);
        }).toThrow('preset must be a string');
      });

      test('should reject invalid preset string', () => {
        expect(() => {
          manager._validatePreset('ultra-heavy');
        }).toThrow('Invalid preset');
      });
    });

    describe('_validateCallback', () => {
      test('should accept function callback', () => {
        expect(() => {
          manager._validateCallback(() => {}, 'test');
        }).not.toThrow();
      });

      test('should accept null callback', () => {
        expect(() => {
          manager._validateCallback(null, 'test');
        }).not.toThrow();
      });

      test('should reject non-function callback', () => {
        expect(() => {
          manager._validateCallback('not a function', 'test');
        }).toThrow('test must be a function or null');
      });

      test('should reject object callback', () => {
        expect(() => {
          manager._validateCallback({}, 'test');
        }).toThrow('test must be a function or null');
      });
    });
  });

  describe('Controller Connection', () => {
    test('should set controller instance', () => {
      manager.setControllerInstance(mockController);
      expect(manager.currentController).toBe(mockController);
    });

    test('should report connected status when controller set', () => {
      manager.setControllerInstance(mockController);
      expect(manager.isConnected()).toBe(true);
    });

    test('should return model from connected controller', () => {
      manager.setControllerInstance(mockController);
      expect(manager.getModel()).toBe('DS5');
    });
  });

  describe('Vibration Control', () => {
    beforeEach(() => {
      manager.setControllerInstance(mockController);
    });

    test('should validate vibration parameters before sending', async () => {
      const callback = jest.fn();

      // Test invalid heavyLeft
      await expect(
        manager.setVibration({ heavyLeft: 300, lightRight: 100, duration: 0 }, callback)
      ).rejects.toThrow('heavyLeft must be between 0 and 255');

      // Test invalid lightRight
      await expect(
        manager.setVibration({ heavyLeft: 100, lightRight: -1, duration: 0 }, callback)
      ).rejects.toThrow('lightRight must be between 0 and 255');
    });

    test('should validate duration parameter', async () => {
      const callback = jest.fn();

      await expect(
        manager.setVibration({ heavyLeft: 100, lightRight: 100, duration: 70000 }, callback)
      ).rejects.toThrow('duration must be between 0 and 60000ms');
    });

    test('should validate callback parameter', async () => {
      await expect(
        manager.setVibration({ heavyLeft: 100, lightRight: 100, duration: 0 }, 'not a function')
      ).rejects.toThrow('doneCb must be a function or null');
    });

    test('should accept valid vibration parameters', async () => {
      const callback = jest.fn();
      await manager.setVibration({ heavyLeft: 100, lightRight: 150, duration: 0 }, callback);
      expect(mockController.setVibration).toHaveBeenCalledWith(100, 150);
    });
  });

  describe('Adaptive Trigger Control', () => {
    beforeEach(() => {
      mockController.setAdaptiveTrigger = jest.fn();
      manager.setControllerInstance(mockController);
    });

    test('should validate trigger preset parameters', async () => {
      // Invalid left preset
      await expect(
        manager.setAdaptiveTriggerPreset({ left: 'invalid', right: 'light' })
      ).rejects.toThrow('Invalid preset');

      // Invalid right preset
      await expect(
        manager.setAdaptiveTriggerPreset({ left: 'light', right: 'invalid' })
      ).rejects.toThrow('Invalid preset');
    });

    test('should accept valid trigger presets', async () => {
      await manager.setAdaptiveTriggerPreset({ left: 'light', right: 'medium' });
      expect(mockController.setAdaptiveTrigger).toHaveBeenCalled();
    });

    test('should map preset names to correct configurations', async () => {
      await manager.setAdaptiveTriggerPreset({ left: 'light', right: 'heavy' });

      const calls = mockController.setAdaptiveTrigger.mock.calls[0];
      const [leftPreset, rightPreset] = calls;

      expect(leftPreset.start).toBe(10); // light preset
      expect(rightPreset.start).toBe(20); // heavy preset
    });
  });

  describe('Speaker Tone Control', () => {
    beforeEach(() => {
      mockController.setSpeakerTone = jest.fn();
      manager.setControllerInstance(mockController);
    });

    test('should validate duration parameter', async () => {
      const callback = jest.fn();

      await expect(
        manager.setSpeakerTone(70000, callback, 'speaker')
      ).rejects.toThrow('duration must be between 0 and 60000ms');
    });

    test('should validate output parameter', async () => {
      const callback = jest.fn();

      await expect(
        manager.setSpeakerTone(1000, callback, 'invalid-output')
      ).rejects.toThrow('output must be one of');
    });

    test('should accept valid speaker parameters', async () => {
      const callback = jest.fn();
      await manager.setSpeakerTone(1000, callback, 'speaker');
      expect(mockController.setSpeakerTone).toHaveBeenCalledWith('speaker');
    });
  });

  describe('Error Handling', () => {
    test('should handle disconnected controller gracefully', async () => {
      const callback = jest.fn();
      await manager.setVibration({ heavyLeft: 100, lightRight: 100, duration: 0 }, callback);
      expect(callback).toHaveBeenCalledWith({ success: false });
    });

    test('should throw error when no controller connected for operations', async () => {
      await expect(
        manager.calibrateSticksBegin()
      ).rejects.toThrow('No controller connected');
    });
  });
});
