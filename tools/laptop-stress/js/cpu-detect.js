// Get CPU info - simple and direct
function getCPUInfo() {
  const cores = navigator.hardwareConcurrency || 4;
  const ram = navigator.deviceMemory || 8;
  
  return {
    cores: cores,
    threads: cores * 2,
    ram: ram,
    model: 'CPU (via browser APIs)',
    frequency: 3400, // MHz estimate
    type: ram >= 16 && cores >= 8 ? 'high-end' : 'mid-range'
  };
}

// Check if CPU is thermal throttling
function isThrottling(currentFreq, baseFreq) {
  return currentFreq < (baseFreq * 0.85); // 15% drop = throttling
}

// Export
window.getCPUInfo = getCPUInfo;
window.isThrottling = isThrottling;
