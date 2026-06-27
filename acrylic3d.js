(function() {
  let scene, camera, renderer, controls;
  let piecesGroup;
  let autoRotate = true;
  let isGalleryMode = true;
  let animationFrameId = null;

  let meshes = [];
  let isGridMode = false;
  
  // Predictable pile offsets to avoid jumping on resets
  let pileOffsets = [];
  for (let i = 0; i < 16; i++) {
    pileOffsets.push({
      x: (Math.sin(i * 1.7) * 0.015),
      z: (Math.cos(i * 2.3) * 0.015),
      rotY: (i * 0.12) + (Math.sin(i * 0.9) * 0.05)
    });
  }

  let pointerDownPos = new THREE.Vector2();

  function init() {
    const container = document.getElementById('canvas-acrylic3d');
    if (!container) return;

    container.innerHTML = '';

    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10);
    camera.position.set(0, 1.8, 2.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enabled = false;
    controls.minDistance = 1.0;
    controls.maxDistance = 5.0;
    controls.target.set(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.70);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.80);
    dirLight1.position.set(2, 4, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.40);
    dirLight2.position.set(-2, -2, 2);
    scene.add(dirLight2);

    // Materials - colored transparent physical materials representing acrylic
    const colors = [
      0xd23434, // Red
      0x3c6ed4, // Blue
      0x74d643, // Green
      0xf0cf3c  // Yellow
    ];

    const materials = colors.map(color => new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    }));

    // Create simple square shape (no hole)
    const shape = new THREE.Shape();
    // 3x3 cm tile -> scale: 0.3 x 0.3 units
    shape.moveTo(-0.15, -0.15);
    shape.lineTo( 0.15, -0.15);
    shape.lineTo( 0.15,  0.15);
    shape.lineTo(-0.15,  0.15);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.03, // 3 mm thickness
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.002,
      bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    piecesGroup = new THREE.Group();
    meshes = [];

    // Instantiate 16 pieces: 4 of each color
    for (let i = 0; i < 16; i++) {
      const colorIndex = Math.floor(i / 4); // 0 = Red, 1 = Blue, 2 = Green, 3 = Yellow
      const material = materials[colorIndex];
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Orient the piece flat in the XZ plane
      mesh.rotation.x = -Math.PI / 2;
      
      // Stack position
      mesh.position.set(
        pileOffsets[i].x,
        i * 0.035 - 0.25, // Stacked up
        pileOffsets[i].z
      );
      mesh.rotation.z = pileOffsets[i].rotY;

      piecesGroup.add(mesh);
      meshes.push(mesh);
    }

    scene.add(piecesGroup);

    setupUI();
    
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerup', onPointerUp);

    autoRotate = true;
    isGalleryMode = true;
    isGridMode = false;
    animate();
  }

  function onPointerDown(event) {
    pointerDownPos.set(event.clientX, event.clientY);
  }

  function onPointerUp(event) {
    if (isGalleryMode) return;
    const moveDistance = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
    if (moveDistance > 6) return;
    isGridMode = !isGridMode;
  }

  function setupUI() {
    const rotateBtn = document.getElementById('btn-acrylic3d-rotate');
    const topBtn = document.getElementById('btn-acrylic3d-top');
    const perspectiveBtn = document.getElementById('btn-acrylic3d-persp');

    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        rotateBtn.classList.toggle('is-active', autoRotate);
      });
    }
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        autoRotate = false;
        if (rotateBtn) rotateBtn.classList.remove('is-active');
        animateCamera(0, 2.5, 0.01);
        if (piecesGroup) piecesGroup.rotation.set(0, 0, 0);
      });
    }
    if (perspectiveBtn) {
      perspectiveBtn.addEventListener('click', () => {
        autoRotate = false;
        if (rotateBtn) rotateBtn.classList.remove('is-active');
        animateCamera(0, 1.8, 2.5);
      });
    }
  }

  let cameraAnim = {
    active: false,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    speed: 0.08
  };

  function animateCamera(x, y, z) {
    cameraAnim.targetX = x;
    cameraAnim.targetY = y;
    cameraAnim.targetZ = z;
    cameraAnim.active = true;
  }

  function setMode(isLarge) {
    autoRotate = !isLarge;
    isGalleryMode = !isLarge;
    if (controls) {
      controls.enabled = isLarge;
      if (!isLarge) {
        camera.position.set(0, 1.8, 2.5);
        controls.target.set(0, 0, 0);
        if (piecesGroup) piecesGroup.rotation.set(0, 0, 0);
        
        isGridMode = false;
        for (let i = 0; i < 16; i++) {
          meshes[i].position.set(
            pileOffsets[i].x,
            i * 0.035 - 0.25,
            pileOffsets[i].z
          );
          meshes[i].rotation.z = pileOffsets[i].rotY;
        }
      }
    }
    const rotateBtn = document.getElementById('btn-acrylic3d-rotate');
    if (rotateBtn) {
      rotateBtn.classList.toggle('is-active', autoRotate);
    }
  }

  function resize() {
    const container = document.getElementById('canvas-acrylic3d');
    if (!renderer || !camera || !container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    function loop() {
      animationFrameId = requestAnimationFrame(loop);

      if (autoRotate && piecesGroup) {
        piecesGroup.rotation.y += 0.008;
      }

      for (let i = 0; i < 16; i++) {
        const mesh = meshes[i];
        if (!mesh) continue;

        let tx, ty, tz, rotZ;

        if (isGridMode) {
          // 4x4 Grid in XZ plane
          const row = Math.floor(i / 4);
          const col = i % 4;
          tx = (col - 1.5) * 0.42;
          tz = (row - 1.5) * 0.42;
          ty = 0;
          rotZ = 0;
        } else {
          // Stacking in pile
          tx = pileOffsets[i].x;
          tz = pileOffsets[i].z;
          ty = i * 0.035 - 0.25;
          rotZ = pileOffsets[i].rotY;
        }

        mesh.position.x += (tx - mesh.position.x) * 0.15;
        mesh.position.y += (ty - mesh.position.y) * 0.15;
        mesh.position.z += (tz - mesh.position.z) * 0.15;
        
        let diffRot = rotZ - mesh.rotation.z;
        mesh.rotation.z += diffRot * 0.15;
      }

      if (cameraAnim.active) {
        camera.position.x += (cameraAnim.targetX - camera.position.x) * cameraAnim.speed;
        camera.position.y += (cameraAnim.targetY - camera.position.y) * cameraAnim.speed;
        camera.position.z += (cameraAnim.targetZ - camera.position.z) * cameraAnim.speed;
        if (Math.abs(camera.position.x - cameraAnim.targetX) < 0.01 &&
            Math.abs(camera.position.y - cameraAnim.targetY) < 0.01 &&
            Math.abs(camera.position.z - cameraAnim.targetZ) < 0.01) {
          cameraAnim.active = false;
        }
      }

      if (controls && controls.enabled) {
        controls.update();
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }
    loop();
  }

  function checkAndInit() {
    if (typeof THREE !== 'undefined' && THREE.OrbitControls) init();
    else setTimeout(checkAndInit, 50);
  }

  window.Acrylic3D = {
    init: function() {
      checkAndInit();
    },
    setMode,
    resize
  };
})();
