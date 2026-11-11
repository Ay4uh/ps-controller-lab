/**
 * TechTest 3D Interactive Controller Visualizer Engine (Three.js)
 * Provides physical 3D analog stick tilt, trigger hinge compression, button depression,
 * lightbar emissive glow, and 6-axis IMU orientation tracking.
 */

export class Controller3DVisualizer {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controllerGroup = null;
    this.parts = {};
    this.animationId = null;
    this.isInitialized = false;

    // Default lightbar color
    this.lightbarColor = 0x2563eb;
  }

  /**
   * Initializes Three.js scene, camera, lighting, and procedural PBR controller mesh.
   */
  async init() {
    if (this.isInitialized) return;

    // Dynamically ensure Three.js is available
    if (typeof THREE === 'undefined') {
      await this._loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
    }

    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 420;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 3.5, 4.5);
    this.camera.lookAt(0, 0, 0);

    // Renderer with graceful fallback if WebGL is disabled/unavailable
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.container.appendChild(this.renderer.domElement);
    } catch (err) {
      this.container.innerHTML = `<div style="padding:32px;text-align:center;color:#94a3b8;font-size:13px;"><i class="fa-solid fa-cube" style="font-size:28px;margin-bottom:8px;display:block;color:#3b82f6;"></i>3D WebGL viewport unavailable in this graphics context. All telemetry, circularity, polling, IMU, and Hall Effect diagnostics remain active.</div>`;
      return;
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 8, 5);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(-4, -2, -3);
    this.scene.add(rimLight);

    // Build Procedural Controller
    this._buildControllerMesh();

    // Resize observer
    window.addEventListener('resize', () => this.handleResize());

    // Mouse drag rotation
    this._setupInteraction();

    // Start render loop
    this.isInitialized = true;
    this._animate();
  }

  _buildControllerMesh() {
    this.controllerGroup = new THREE.Group();

    // Materials
    const shellWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      roughness: 0.35,
      metalness: 0.05
    });
    const shellDarkMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      metalness: 0.1
    });
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.3,
      metalness: 0.2
    });
    const stickCapMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.8
    });
    const lightbarMat = new THREE.MeshBasicMaterial({
      color: this.lightbarColor
    });

    // Main Body Chassis
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.6, 1.4);
    const bodyMesh = new THREE.Mesh(bodyGeo, shellWhiteMat);
    bodyMesh.position.set(0, 0, 0);
    this.controllerGroup.add(bodyMesh);

    // Ergonomic Grips (Left and Right)
    const gripGeo = new THREE.CylinderGeometry(0.35, 0.42, 1.6, 24);
    
    // Left Grip
    const leftGrip = new THREE.Mesh(gripGeo, shellWhiteMat);
    leftGrip.position.set(-1.3, -0.4, 0.4);
    leftGrip.rotation.z = Math.PI / 6;
    leftGrip.rotation.x = -Math.PI / 12;
    this.controllerGroup.add(leftGrip);

    // Right Grip
    const rightGrip = new THREE.Mesh(gripGeo, shellWhiteMat);
    rightGrip.position.set(1.3, -0.4, 0.4);
    rightGrip.rotation.z = -Math.PI / 6;
    rightGrip.rotation.x = -Math.PI / 12;
    this.controllerGroup.add(rightGrip);

    // Lower Midsection (Matte Black)
    const lowerBodyGeo = new THREE.BoxGeometry(1.6, 0.4, 1.0);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, shellDarkMat);
    lowerBody.position.set(0, -0.2, 0.2);
    this.controllerGroup.add(lowerBody);

    // Touchpad Plate
    const touchpadGeo = new THREE.BoxGeometry(0.9, 0.04, 0.6);
    const touchpadMesh = new THREE.Mesh(touchpadGeo, shellDarkMat);
    touchpadMesh.position.set(0, 0.32, -0.05);
    this.controllerGroup.add(touchpadMesh);
    this.parts.touchpad = touchpadMesh;

    // Lightbar Frame
    const lightbarGeo = new THREE.BoxGeometry(0.96, 0.05, 0.66);
    const lightbarMesh = new THREE.Mesh(lightbarGeo, lightbarMat);
    lightbarMesh.position.set(0, 0.30, -0.05);
    this.controllerGroup.add(lightbarMesh);
    this.parts.lightbar = lightbarMesh;

    // Left Thumbstick Gimbal & Cap
    const leftStickGroup = new THREE.Group();
    leftStickGroup.position.set(-0.48, 0.32, 0.28);
    const stickShaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
    const stickCapGeo = new THREE.CylinderGeometry(0.32, 0.30, 0.08, 24);
    const shaftL = new THREE.Mesh(stickShaftGeo, shellDarkMat);
    shaftL.position.y = 0.15;
    const capL = new THREE.Mesh(stickCapGeo, stickCapMat);
    capL.position.y = 0.28;
    leftStickGroup.add(shaftL);
    leftStickGroup.add(capL);
    this.controllerGroup.add(leftStickGroup);
    this.parts.leftStick = leftStickGroup;

    // Right Thumbstick Gimbal & Cap
    const rightStickGroup = new THREE.Group();
    rightStickGroup.position.set(0.48, 0.32, 0.28);
    const shaftR = new THREE.Mesh(stickShaftGeo, shellDarkMat);
    shaftR.position.y = 0.15;
    const capR = new THREE.Mesh(stickCapGeo, stickCapMat);
    capR.position.y = 0.28;
    rightStickGroup.add(shaftR);
    rightStickGroup.add(capR);
    this.controllerGroup.add(rightStickGroup);
    this.parts.rightStick = rightStickGroup;

    // D-Pad Cross
    const dpadGroup = new THREE.Group();
    dpadGroup.position.set(-0.8, 0.34, -0.15);
    const dpadVertGeo = new THREE.BoxGeometry(0.18, 0.1, 0.54);
    const dpadHorizGeo = new THREE.BoxGeometry(0.54, 0.1, 0.18);
    const dpadV = new THREE.Mesh(dpadVertGeo, buttonMat);
    const dpadH = new THREE.Mesh(dpadHorizGeo, buttonMat);
    dpadGroup.add(dpadV);
    dpadGroup.add(dpadH);
    this.controllerGroup.add(dpadGroup);
    this.parts.dpad = dpadGroup;

    // Face Buttons (Cross, Circle, Square, Triangle)
    const buttonGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const btnCross = new THREE.Mesh(buttonGeo, buttonMat);
    btnCross.position.set(0.8, 0.35, 0.02);
    const btnCircle = new THREE.Mesh(buttonGeo, buttonMat);
    btnCircle.position.set(0.98, 0.35, -0.15);
    const btnSquare = new THREE.Mesh(buttonGeo, buttonMat);
    btnSquare.position.set(0.62, 0.35, -0.15);
    const btnTriangle = new THREE.Mesh(buttonGeo, buttonMat);
    btnTriangle.position.set(0.8, 0.35, -0.32);

    this.controllerGroup.add(btnCross);
    this.controllerGroup.add(btnCircle);
    this.controllerGroup.add(btnSquare);
    this.controllerGroup.add(btnTriangle);

    this.parts.cross = btnCross;
    this.parts.circle = btnCircle;
    this.parts.square = btnSquare;
    this.parts.triangle = btnTriangle;

    // Triggers and Bumpers (L1, R1, L2, R2)
    const triggerGeo = new THREE.BoxGeometry(0.42, 0.24, 0.3);
    
    // L2 Trigger
    const l2Trigger = new THREE.Mesh(triggerGeo, shellDarkMat);
    l2Trigger.position.set(-0.8, 0.1, -0.75);
    this.controllerGroup.add(l2Trigger);
    this.parts.l2 = l2Trigger;

    // R2 Trigger
    const r2Trigger = new THREE.Mesh(triggerGeo, shellDarkMat);
    r2Trigger.position.set(0.8, 0.1, -0.75);
    this.controllerGroup.add(r2Trigger);
    this.parts.r2 = r2Trigger;

    this.scene.add(this.controllerGroup);
  }

  /**
   * Updates 3D model with real-time controller state.
   * @param {Object} state 
   */
  updateInputs(state) {
    if (!this.parts.leftStick || !this.parts.rightStick) return;

    // Left Stick Tilt
    if (state.axes) {
      const lx = state.axes[0] || 0;
      const ly = state.axes[1] || 0;
      this.parts.leftStick.rotation.x = ly * 0.45;
      this.parts.leftStick.rotation.z = -lx * 0.45;

      const rx = state.axes[2] || 0;
      const ry = state.axes[3] || 0;
      this.parts.rightStick.rotation.x = ry * 0.45;
      this.parts.rightStick.rotation.z = -rx * 0.45;
    }

    // Triggers compression
    if (state.triggers) {
      const l2Val = state.triggers.l2 || 0;
      const r2Val = state.triggers.r2 || 0;
      this.parts.l2.position.z = -0.75 - l2Val * 0.12;
      this.parts.l2.rotation.x = -l2Val * 0.3;
      this.parts.r2.position.z = -0.75 - r2Val * 0.12;
      this.parts.r2.rotation.x = -r2Val * 0.3;
    }

    // Button depressions
    if (state.buttons) {
      this.parts.cross.position.y = state.buttons.cross ? 0.30 : 0.35;
      this.parts.circle.position.y = state.buttons.circle ? 0.30 : 0.35;
      this.parts.square.position.y = state.buttons.square ? 0.30 : 0.35;
      this.parts.triangle.position.y = state.buttons.triangle ? 0.30 : 0.35;
    }

    // 6-Axis IMU Orientation Rotation
    if (state.quaternion && this.controllerGroup) {
      this.controllerGroup.quaternion.set(
        state.quaternion.x,
        state.quaternion.y,
        state.quaternion.z,
        state.quaternion.w
      );
    }
  }

  /**
   * Changes the lightbar emissive color (e.g. 0x00ff00 for battery full, 0xff0000 for critical).
   * @param {number|string} hexColor 
   */
  setLightbarColor(hexColor) {
    if (this.parts.lightbar) {
      this.parts.lightbar.material.color.set(hexColor);
    }
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 400;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  _setupInteraction() {
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    this.container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !this.controllerGroup) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;

      this.controllerGroup.rotation.y += dx * 0.008;
      this.controllerGroup.rotation.x += dy * 0.008;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });
  }

  _animate() {
    this.animationId = requestAnimationFrame(() => this._animate());
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  _loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}

if (typeof window !== 'undefined') {
  window.Controller3DVisualizer = Controller3DVisualizer;
}
