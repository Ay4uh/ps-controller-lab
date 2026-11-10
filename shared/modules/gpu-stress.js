/**
 * TechTest High-Performance GPU Stress & Compute Benchmark Engine
 * Uses modern WebGPU Compute Shaders with automated WebGL2 raymarching fallback.
 */

export class GpuStressTester {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.gl = null;
    this.gpuDevice = null;
    this.isRunning = false;
    this.animationFrameId = null;
    this.mode = 'detect'; // 'webgpu' | 'webgl'
    this.stats = {
      fps: 0,
      minFps: Infinity,
      maxFps: 0,
      frameCount: 0,
      durationMs: 0,
      droppedFrames: 0,
      computePasses: 0,
      gflopsEstimate: 0
    };
    this.onUpdate = null;
    this.startTime = 0;
    this.lastFrameTime = 0;
  }

  /**
   * Initializes WebGPU or falls back to WebGL2.
   */
  async init() {
    if ('gpu' in navigator) {
      try {
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
        if (adapter) {
          this.gpuDevice = await adapter.requestDevice();
          this.mode = 'webgpu';
          return { supported: true, api: 'WebGPU', adapterInfo: adapter.info || {} };
        }
      } catch (e) {
        console.warn('WebGPU initialization failed, falling back to WebGL:', e);
      }
    }

    // WebGL Fallback
    this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
    if (this.gl) {
      this.mode = 'webgl';
      return { supported: true, api: this.canvas.getContext('webgl2') ? 'WebGL 2.0' : 'WebGL 1.0' };
    }

    return { supported: false, api: 'None' };
  }

  /**
   * Starts the stress test.
   * @param {string} intensity 'light' | 'standard' | 'intensive'
   * @param {number} durationSeconds Duration in seconds
   * @param {Function} updateCallback 
   */
  async start(intensity = 'standard', durationSeconds = 30, updateCallback = null) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.onUpdate = updateCallback;
    this.startTime = performance.now();
    this.lastFrameTime = performance.now();
    this.stats = {
      fps: 0,
      minFps: Infinity,
      maxFps: 0,
      frameCount: 0,
      durationMs: 0,
      droppedFrames: 0,
      computePasses: 0,
      gflopsEstimate: 0
    };

    const targetDurationMs = durationSeconds * 1000;

    if (this.mode === 'webgpu' && this.gpuDevice) {
      await this._runWebGpuLoop(intensity, targetDurationMs);
    } else {
      this._runWebGlLoop(intensity, targetDurationMs);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  async _runWebGpuLoop(intensity, targetDurationMs) {
    const context = this.canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device: this.gpuDevice,
      format: presentationFormat,
      alphaMode: 'premultiplied'
    });

    // Compute Shader: Matrix multiplication & chaotic attractor calculation
    const iterationsPerFrame = intensity === 'intensive' ? 120 : intensity === 'standard' ? 60 : 25;
    const computeShaderCode = `
      @group(0) @binding(0) var<storage, read_write> data: array<f32>;

      @compute @workgroup_size(64)
      fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
        let index = global_id.x;
        if (index >= arrayLength(&data)) { return; }
        
        var val = data[index];
        for (var i = 0u; i < ${iterationsPerFrame}u; i = i + 1u) {
          val = fract(sin(val * 12.9898 + f32(i)) * 43758.5453);
        }
        data[index] = val;
      }
    `;

    const computeModule = this.gpuDevice.createShaderModule({ code: computeShaderCode });
    const bufferSize = 65536 * 4; // 64K floats
    const computeBuffer = this.gpuDevice.createBuffer({
      size: bufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });

    const computePipeline = this.gpuDevice.createComputePipeline({
      layout: 'auto',
      compute: { module: computeModule, entryPoint: 'main' }
    });

    const bindGroup = this.gpuDevice.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: computeBuffer } }]
    });

    const renderLoop = (now) => {
      if (!this.isRunning) return;

      const elapsed = now - this.startTime;
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      const currentFps = delta > 0 ? (1000 / delta) : 60;
      this.stats.frameCount++;
      this.stats.durationMs = elapsed;
      this.stats.fps = Math.round(currentFps);
      if (currentFps < this.stats.minFps) this.stats.minFps = Math.round(currentFps);
      if (currentFps > this.stats.maxFps) this.stats.maxFps = Math.round(currentFps);
      if (delta > 34) this.stats.droppedFrames++; // Missed 30fps threshold

      // Dispatch Compute Pass
      const commandEncoder = this.gpuDevice.createCommandEncoder();
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(computePipeline);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.dispatchWorkgroups(1024);
      passEncoder.end();

      // Clear & Draw visual frame
      const renderPassDescriptor = {
        colorAttachments: [{
          view: context.getCurrentTexture().createView(),
          clearValue: { r: (Math.sin(elapsed * 0.002) + 1) * 0.1, g: 0.15, b: 0.3, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }]
      };
      const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
      renderPass.end();

      this.gpuDevice.queue.submit([commandEncoder.finish()]);
      this.stats.computePasses += iterationsPerFrame * 65536;
      this.stats.gflopsEstimate = parseFloat(((this.stats.computePasses * 4) / (elapsed * 1000000)).toFixed(2));

      if (this.onUpdate) {
        this.onUpdate(this.stats);
      }

      if (elapsed >= targetDurationMs) {
        this.stop();
        if (this.onUpdate) this.onUpdate({ ...this.stats, completed: true });
        return;
      }

      this.animationFrameId = requestAnimationFrame(renderLoop);
    };

    this.animationFrameId = requestAnimationFrame(renderLoop);
  }

  _runWebGlLoop(intensity, targetDurationMs) {
    if (!this.gl) return;
    const gl = this.gl;

    // Simple procedural shader to stress fragment processing
    const vsSource = `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `;
    const iterations = intensity === 'intensive' ? 120 : intensity === 'standard' ? 60 : 30;
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      void main() {
        vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
        vec3 col = vec3(0.0);
        vec2 z = st;
        for (int i = 0; i < ${iterations}; i++) {
          z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + vec2(sin(u_time * 0.5) * 0.4, cos(u_time * 0.3) * 0.4);
          if (dot(z, z) > 4.0) {
            col = vec3(float(i) / float(${iterations}), sin(float(i) * 0.1), 0.8);
            break;
          }
        }
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');

    const renderLoop = (now) => {
      if (!this.isRunning) return;

      const elapsed = now - this.startTime;
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      const currentFps = delta > 0 ? (1000 / delta) : 60;
      this.stats.frameCount++;
      this.stats.durationMs = elapsed;
      this.stats.fps = Math.round(currentFps);
      if (currentFps < this.stats.minFps) this.stats.minFps = Math.round(currentFps);
      if (currentFps > this.stats.maxFps) this.stats.maxFps = Math.round(currentFps);
      if (delta > 34) this.stats.droppedFrames++;

      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.uniform2f(uResolution, this.canvas.width, this.canvas.height);
      gl.uniform1f(uTime, elapsed * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      this.stats.computePasses += iterations * (this.canvas.width * this.canvas.height);

      if (this.onUpdate) {
        this.onUpdate(this.stats);
      }

      if (elapsed >= targetDurationMs) {
        this.stop();
        if (this.onUpdate) this.onUpdate({ ...this.stats, completed: true });
        return;
      }

      this.animationFrameId = requestAnimationFrame(renderLoop);
    };

    this.animationFrameId = requestAnimationFrame(renderLoop);
  }
}

if (typeof window !== 'undefined') {
  window.GpuStressTester = GpuStressTester;
}
