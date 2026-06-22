class GPUStress {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800; // 800x600 is enough for heavy shader stress without timing out low-end GPUs
    this.canvas.height = 600;
    this.gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
    this.running = false;
    this.frameCount = 0;
    this.frameHistory = [];
    this.results = {};
    
    this.program = null;
    this.buffer = null;
  }

  // Initialize WebGL resources once
  initWebGLResources() {
    const gl = this.gl;
    if (!gl) return;

    // Compile and link shader program once
    this.program = this.createShaderProgram(gl);
    
    // Create static buffer once
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, 1, 1
    ]), gl.STATIC_DRAW);
  }

  // Clean up WebGL resources
  cleanupWebGLResources() {
    const gl = this.gl;
    if (!gl) return;

    if (this.buffer) {
      gl.deleteBuffer(this.buffer);
      this.buffer = null;
    }
    if (this.program) {
      gl.deleteProgram(this.program);
      this.program = null;
    }
  }

  // Start GPU stress
  async start(durationSeconds, onUpdate) {
    if (!this.gl) {
      console.error('WebGL not supported');
      return { error: 'WebGL not supported', score: 0 };
    }

    this.initWebGLResources();

    this.running = true;
    this.frameCount = 0;
    this.frameHistory = [];

    const startTime = Date.now();
    let lastFrameTime = startTime;

    return new Promise((resolve) => {
      const renderFrame = () => {
        if (!this.running) {
          this.cleanupWebGLResources();
          resolve(this.getResults());
          return;
        }

        const now = Date.now();
        const elapsed = now - startTime;

        // Render using compiled shader resources
        this.renderStressFrame();

        // Calculate FPS
        const frameTime = Math.max(1, now - lastFrameTime); // avoid divide by zero
        const fps = 1000 / frameTime;
        
        // Ignore the first few frames to stabilize FPS readings
        if (this.frameCount > 5) {
          this.frameHistory.push(fps);
        }
        lastFrameTime = now;

        const percent = Math.min(100, (elapsed / (durationSeconds * 1000)) * 100);

        if (onUpdate) {
          onUpdate({
            progress: percent,
            fps: fps.toFixed(1),
            frames: this.frameCount,
            elapsed,
            memoryUsed: performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(0) + ' MB' : 'N/A'
          });
        }

        if (elapsed >= durationSeconds * 1000) {
          this.stop();
          this.cleanupWebGLResources();
          resolve(this.getResults());
        } else {
          requestAnimationFrame(renderFrame);
        }

        this.frameCount++;
      };

      renderFrame();
    });
  }

  // Render heavy GPU workload
  renderStressFrame() {
    const gl = this.gl;
    if (!this.program || !this.buffer) return;

    gl.useProgram(this.program);

    const posAttrib = gl.getAttribLocation(this.program, 'position');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);

    // Pass time uniform for animation
    const timeUniform = gl.getUniformLocation(this.program, 'time');
    gl.uniform1f(timeUniform, Date.now() / 1000);

    // Pass resolution uniform
    const resUniform = gl.getUniformLocation(this.program, 'resolution');
    if (resUniform !== -1) {
      gl.uniform2f(resUniform, this.canvas.width, this.canvas.height);
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // Create heavy fragment shader
  createShaderProgram(gl) {
    const vertexShader = this.compileShader(gl, `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `, gl.VERTEX_SHADER);

    // Heavy compute shader (Sierpinski / Mandelbrot style iteration)
    const fragmentShader = this.compileShader(gl, `
      precision highp float;
      uniform float time;
      uniform vec2 resolution;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        float color = 0.0;
        
        // Iterations count is high to stress the GPU cores
        for(int i = 0; i < 200; i++) {
          float angle = float(i) * 0.05 + time * 0.1;
          vec2 shift = vec2(sin(angle), cos(angle)) * 0.3;
          color += sin(length(uv - 0.5 - shift) * 40.0 - time);
        }
        
        gl_FragColor = vec4(vec3(sin(color * 0.02) * 0.5 + 0.5), 1.0);
      }
    `, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Check link status
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader linking failed:', gl.getProgramInfoLog(program));
    }

    return program;
  }

  // Compile shader helper
  compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  // Get results
  getResults() {
    if (this.frameHistory.length === 0) {
      return { passed: false, avgFps: '0', minFps: '0', maxFps: '0', frames: 0, score: 0 };
    }
    const avgFps = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
    const minFps = Math.min(...this.frameHistory);
    const maxFps = Math.max(...this.frameHistory);

    return {
      passed: avgFps > 20, // 20 FPS threshold for heavy stress
      avgFps: avgFps.toFixed(1),
      minFps: minFps.toFixed(1),
      maxFps: maxFps.toFixed(1),
      frames: this.frameCount,
      score: Math.min(100, Math.round(avgFps / 60 * 100))
    };
  }

  // Stop stress
  stop() {
    this.running = false;
  }
}

window.GPUStress = GPUStress;
