'use strict';

/**
* Utility functions for controller lab
*/

/**
* Sleep for a specified number of milliseconds
* @param {number} ms - Milliseconds to sleep
* @returns {Promise} Promise that resolves after sleep
*/
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* Convert buffer to hex string
* @param {ArrayBuffer} buffer - Buffer to convert
* @returns {string} Hexadecimal string representation
*/
export function buf2hex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/**
* Convert decimal to hex string
* @param {number} num - Number to convert
* @returns {string} Hexadecimal string representation
*/
export function dec2hex(num) {
  return num.toString(16);
}

/**
* Convert decimal to 32-bit hex string (zero-padded to 8 characters)
* @param {number} num - Number to convert
* @returns {string} 32-bit hexadecimal string representation
*/
export function dec2hex32(num) {
  return ('00000000' + num.toString(16)).slice(-8);
}

/**
* Convert decimal to 8-bit hex string (zero-padded to 2 characters)
* @param {number} num - Number to convert
* @returns {string} 8-bit hexadecimal string representation
*/
export function dec2hex8(num) {
  return ('00' + num.toString(16)).slice(-2);
}

/**
* Format MAC address from DataView
* @param {DataView} view - DataView containing MAC address bytes
* @param {number} start - Starting index of MAC address in view
* @returns {string} Formatted MAC address (XX:XX:XX:XX:XX:XX)
*/
export function format_mac_from_view(view, start) {
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
export function reverse_str(str) {
  return str.split('').reverse().join('');
}

/**
* Linear interpolation between two colors
* @param {string} color1 - Starting color (hex format)
* @param {string} color2 - Ending color (hex format)
* @param {number} t - Interpolation factor (0-1)
* @returns {string} Interpolated color (hex format)
*/
export function lerp_color(color1, color2, t) {
  // Parse hex colors
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  // Interpolate
  const r = Math.round(r1 + t * (r2 - r1));
  const g = Math.round(g1 + t * (g2 - g1));
  const b = Math.round(b1 + t * (b2 - b1));

  // Return as hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
* Initialize analytics API (placeholder)
* @param {Object} app - App state object
*/
export function initAnalyticsApi(app) {
  // Placeholder for analytics initialization
  // In a real implementation, this would set up analytics tracking
  app.gu = app.gu || crypto.randomUUID();
}

/**
* Log analytics event (placeholder)
* @param {string} event - Event name
* @param {Object} data - Event data
*/
export function la(event, data = {}) {
  // Placeholder for analytics logging
  // In a real implementation, this would send analytics events
  console.log(`Analytics: ${event}`, data);
}

export default {
  sleep,
  buf2hex,
  dec2hex,
  dec2hex32,
  dec2hex8,
  format_mac_from_view,
  reverse_str,
  lerp_color,
  initAnalyticsApi,
  la
};