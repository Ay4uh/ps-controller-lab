// Initialize WebGL and get GPU info
function getGPUInfo() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) {
    return { error: 'WebGL not supported', vram: 0 };
  }

  // Get GPU model from WebGL
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  let model = 'Unknown GPU';
  
  if (debugInfo) {
    model = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  }

  // Detect VRAM by trying texture uploads
  const vram = detectVRAM(gl);

  // Get capabilities
  const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxRenderBuffer = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

  return {
    model: model,
    vram: vram,
    maxTextureSize: maxTexture,
    maxRenderBuffer: maxRenderBuffer,
    webgl2: gl.getParameter(gl.VERSION).indexOf('2.0') !== -1,
    type: (model.includes('Intel') || model.includes('Radeon(TM) Graphics') || model.includes('Vega') || model.includes('Apple M') || model.includes('Basic Render')) ? 'integrated' : 'discrete'
  };
}

// Detect VRAM size
function detectVRAM(gl) {
  const sizes = [256, 512, 1024, 2048, 4096, 6144, 8192];
  
  for (let size of sizes) {
    try {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      
      const pixels = (size * 1024 * 1024) / 4;
      const dim = Math.sqrt(pixels);
      
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA,
        dim, dim, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null
      );
      
      gl.deleteTexture(texture);
    } catch (e) {
      return sizes[sizes.indexOf(size) - 1] || 256;
    }
  }
  
  return 8192;
}

window.getGPUInfo = getGPUInfo;
