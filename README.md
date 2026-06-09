# Controller Diagnostic Lab

![Controller Diagnostic Lab Screenshot](https://ay5uh.com/favicon.ico)

**[Visit the Live App](https://ay5uh.com)**

A free, browser-based diagnostic and calibration tool for PlayStation controllers (DualSense and DualShock 4). Built entirely with web technologies and leveraging the WebHID API, it allows you to test, analyze, and repair controller issues without downloading any software.

## Features

- **Stick Drift Testing**: Visualize raw analog stick inputs to detect minute hardware drift.
- **Center Calibration**: Recalibrate the center deadzones of your analog sticks, writing directly to the controller's permanent storage (NVS mirror).
- **Haptic Feedback & Rumble**: Test the left and right vibration motors (DualShock 4 & DualSense) and the DualSense's advanced haptic actuators.
- **Adaptive Trigger Testing**: Evaluate trigger resistance and functionality (DualSense).
- **Live Button Viewer**: See real-time input from all face buttons, triggers, bumpers, D-pad, and the touchpad.
- **No Installation Required**: Runs entirely in the browser (Chrome or Edge required for WebHID support).

## Supported Controllers

- PlayStation 5 DualSense
- PlayStation 4 DualShock 4
- Most WebHID-compatible gamepads

## Usage

1. Open Chrome or Edge (Firefox and Safari do not currently support the WebHID API).
2. Go to [https://ay5uh.com](https://ay5uh.com).
3. Connect your controller via USB.
4. Click **Connect Controller** and grant the browser permission to access the device.
5. Use the tabs to navigate between the live viewer, drift testing, and calibration tools.

## Disclaimer

Controller Diagnostic Lab is an independent open-source utility. Not affiliated with, endorsed by, or connected to Sony Interactive Entertainment Inc. or PlayStation. "PlayStation", "DualShock", and "DualSense" are registered trademarks of Sony Interactive Entertainment Inc. All other product names and trademarks are property of their respective owners.
