'use strict';

import BaseController from '../controllers/base-controller.js';

describe('BaseController', () => {
  let mockDevice;
  let controller;

  beforeEach(() => {
    // Mock HID device
    mockDevice = {
      opened: true,
      collections: [
        {
          featureReports: [
            { reportId: 0x05, items: [{ reportCount: 47 }] },
            { reportId: 0x02, items: [{ reportCount: 47 }] },
          ],
        },
      ],
      close: jest.fn(),
      sendFeatureReport: jest.fn(() => Promise.resolve()),
      receiveFeatureReport: jest.fn(() => Promise.resolve(new Uint8Array(47))),
    };

    controller = new BaseController(mockDevice);
  });

  describe('HID Operation Timeouts', () => {
    test('should send feature report within timeout', async () => {
      mockDevice.sendFeatureReport.mockResolvedValueOnce(undefined);

      const result = await controller.sendFeatureReport(0x05, [1, 2, 3]);
      expect(result).toBeUndefined();
      expect(mockDevice.sendFeatureReport).toHaveBeenCalled();
    });

    test('should receive feature report within timeout', async () => {
      const mockData = new Uint8Array(47);
      mockDevice.receiveFeatureReport.mockResolvedValueOnce(mockData);

      const result = await controller.receiveFeatureReport(0x05);
      expect(result).toEqual(mockData);
    });

    test('should timeout if sendFeatureReport takes too long', async () => {
      // Mock a slow operation
      mockDevice.sendFeatureReport.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 15000)) // 15 seconds
      );

      // Use shorter timeout for testing
      const timeoutPromise = controller.sendFeatureReport(0x05, [1, 2, 3], 1000);

      await expect(timeoutPromise).rejects.toThrow('timed out after 1000ms');
    }, 3000);

    test('should timeout if receiveFeatureReport takes too long', async () => {
      // Mock a slow operation
      mockDevice.receiveFeatureReport.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 15000)) // 15 seconds
      );

      // Use shorter timeout for testing
      const timeoutPromise = controller.receiveFeatureReport(0x05, 1000);

      await expect(timeoutPromise).rejects.toThrow('timed out after 1000ms');
    }, 3000);

    test('should use default timeout when not specified', async () => {
      const defaultTimeout = BaseController.HID_OPERATION_TIMEOUT;
      expect(defaultTimeout).toBe(10000);
    });

    test('should allow custom timeout', async () => {
      mockDevice.sendFeatureReport.mockResolvedValueOnce(undefined);

      const result = await controller.sendFeatureReport(0x05, [1, 2, 3], 5000);
      expect(result).toBeUndefined();
    });
  });

  describe('Buffer Allocation', () => {
    test('should allocate request buffer with correct size', () => {
      const buffer = controller.alloc_req(0x05, [1, 2, 3]);
      expect(buffer instanceof Uint8Array).toBe(true);
      expect(buffer.length).toBe(47); // Based on mock report count
    });

    test('should pad buffer with zeros', () => {
      const buffer = controller.alloc_req(0x05, [1, 2, 3]);
      expect(buffer[0]).toBe(1);
      expect(buffer[1]).toBe(2);
      expect(buffer[2]).toBe(3);
      expect(buffer[3]).toBe(0); // Padded
    });
  });

  describe('Device Management', () => {
    test('should return device instance', () => {
      expect(controller.getDevice()).toBe(mockDevice);
    });

    test('should close device connection', async () => {
      await controller.close();
      expect(mockDevice.close).toHaveBeenCalled();
    });

    test('should handle close on already closed device', async () => {
      mockDevice.opened = false;
      await controller.close();
      expect(mockDevice.close).not.toHaveBeenCalled();
    });
  });

  describe('Abstract Methods', () => {
    test('should throw for getInputConfig', () => {
      expect(() => controller.getInputConfig()).toThrow('getInputConfig() must be implemented by subclass');
    });

    test('should throw for getSerialNumber', async () => {
      await expect(controller.getSerialNumber()).rejects.toThrow('getSerialNumber() must be implemented by subclass');
    });

    test('should throw for getInfo', async () => {
      await expect(controller.getInfo()).rejects.toThrow('getInfo() must be implemented by subclass');
    });

    test('should throw for flash', async () => {
      await expect(controller.flash()).rejects.toThrow('flash() must be implemented by subclass');
    });

    test('should throw for calibrateSticksBegin', async () => {
      await expect(controller.calibrateSticksBegin()).rejects.toThrow(
        'calibrateSticksBegin() must be implemented by subclass'
      );
    });
  });

  describe('Default Implementations', () => {
    test('should provide default no-op for setAdaptiveTrigger', async () => {
      const result = await controller.setAdaptiveTrigger();
      expect(result.success).toBe(true);
    });

    test('should provide default no-op for setVibration', async () => {
      const result = await controller.setVibration(100, 100);
      expect(result.success).toBe(true);
    });

    test('should provide default no-op for setSpeakerTone', async () => {
      const result = await controller.setSpeakerTone();
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should throw on HID operation error', async () => {
      mockDevice.sendFeatureReport.mockRejectedValueOnce(new Error('HID error'));

      await expect(controller.sendFeatureReport(0x05, [1, 2, 3])).rejects.toThrow('HID error');
    });

    test('should wrap error messages properly', async () => {
      mockDevice.sendFeatureReport.mockRejectedValueOnce({ stack: 'HID protocol error' });

      await expect(controller.sendFeatureReport(0x05, [1, 2, 3])).rejects.toThrow('HID protocol error');
    });
  });
});
