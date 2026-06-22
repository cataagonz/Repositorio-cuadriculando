(function() {
  const BASE64_TOKEN = "data:image/png;base64,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";

  let scene, camera, renderer, controls;
  let piecesGroup;
  let autoRotate = true;
  let isGalleryMode = true;
  let animationFrameId = null;

  let meshes = [];
  let isGridMode = false;
  let isAnimating = false;
  
  // Predictable pile offsets to avoid jumping on resets
  let pileOffsets = [];
  for (let i = 0; i < 16; i++) {
    pileOffsets.push({
      x: (Math.sin(i * 1.7) * 0.015),
      z: (Math.cos(i * 2.3) * 0.015),
      rotY: (i * 0.12) + (Math.sin(i * 0.9) * 0.05)
    });
  }

  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  let pointerDownPos = new THREE.Vector2();

  // Helper to create a diagonal X-shaped path for the cutout hole
  function createXHole(armLength, armWidth) {
    const hole = new THREE.Path();
    const crossPoints = [
      [-armWidth/2, armLength],
      [armWidth/2, armLength],
      [armWidth/2, armWidth/2],
      [armLength, armWidth/2],
      [armLength, -armWidth/2],
      [armWidth/2, -armWidth/2],
      [armWidth/2, -armLength],
      [-armWidth/2, -armLength],
      [-armWidth/2, -armWidth/2],
      [-armLength, -armWidth/2],
      [-armLength, armWidth/2],
      [-armWidth/2, armWidth/2]
    ];
    
    const angle = Math.PI / 4; // 45 degrees
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    crossPoints.forEach((pt, idx) => {
      const rx = pt[0] * cos - pt[1] * sin;
      const ry = pt[0] * sin + pt[1] * cos;
      if (idx === 0) {
        hole.moveTo(rx, ry);
      } else {
        hole.lineTo(rx, ry);
      }
    });
    
    hole.closePath();
    return hole;
  }

  function init() {
    const container = document.getElementById('canvas-pieces3d');
    if (!container) return;

    container.innerHTML = '';

    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10);
    camera.position.set(0, 1.8, 2.5); // Angled view to see the 3D stack height and cutouts

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.80);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.70);
    dirLight1.position.set(2, 4, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.30);
    dirLight2.position.set(-2, -2, 2);
    scene.add(dirLight2);

    // Texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load(BASE64_TOKEN);
    texture.anisotropy = 4;
    texture.minFilter = THREE.LinearFilter;

    // Materials
    // Face 0: Caps (mapped with the token image)
    const capMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.15,
      metalness: 0.05
    });
    // Face 1: Sides (glossy transparent dark teal-grey acrylic)
    const sideMat = new THREE.MeshStandardMaterial({
      color: 0x1f343a,
      roughness: 0.08,
      metalness: 0.10,
      transparent: true,
      opacity: 0.92
    });

    // Create beveled geometry with X hole
    const shape = new THREE.Shape();
    // 3x3 cm tile -> scale: 0.3 x 0.3 units
    shape.moveTo(-0.15, -0.15);
    shape.lineTo( 0.15, -0.15);
    shape.lineTo( 0.15,  0.15);
    shape.lineTo(-0.15,  0.15);
    shape.closePath();

    const hole = createXHole(0.09, 0.03); // Fits beautifully inside the 0.3x0.3 square
    shape.holes.push(hole);

    // Extrude shape along Z axis (which acts as the thickness)
    const extrudeSettings = {
      depth: 0.03, // 3 mm thickness
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.002,
      bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center geometry so rotation/placement is from center
    geometry.center();

    piecesGroup = new THREE.Group();
    meshes = [];

    // Instantiate 16 pieces
    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(geometry, [capMat, sideMat]);
      
      // Face cap is along Z, so orient the piece to lie flat in the XZ plane
      mesh.rotation.x = -Math.PI / 2;
      
      // Set initial pile position
      mesh.position.set(
        pileOffsets[i].x,
        i * 0.035 - 0.25, // Stacked up from -0.25 to +0.25
        pileOffsets[i].z
      );
      // Extra rotation in Y axis (rotation.z in local coordinates since it was rotated in X)
      mesh.rotation.z = pileOffsets[i].rotY;

      piecesGroup.add(mesh);
      meshes.push(mesh);
    }

    scene.add(piecesGroup);

    setupUI();
    
    // Add event listeners on the container to bypass OrbitControls click interception
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

    // Filter out camera drags
    const moveDistance = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
    if (moveDistance > 6) return;

    // Toggle scattering grid vs pile mode
    isGridMode = !isGridMode;
  }

  function setupUI() {
    const rotateBtn = document.getElementById('btn-pieces3d-rotate');
    const topBtn = document.getElementById('btn-pieces3d-top');
    const perspectiveBtn = document.getElementById('btn-pieces3d-persp');

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
        
        // Reset pile mode instantly on exit
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
    const rotateBtn = document.getElementById('btn-pieces3d-rotate');
    if (rotateBtn) {
      rotateBtn.classList.toggle('is-active', autoRotate);
    }
  }

  function resize() {
    const container = document.getElementById('canvas-pieces3d');
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

      // Smooth interpolation for pieces scattering vs stacking
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
          rotZ = 0; // lie perfectly aligned in the grid
        } else {
          // Stacking in pile
          tx = pileOffsets[i].x;
          tz = pileOffsets[i].z;
          ty = i * 0.035 - 0.25;
          rotZ = pileOffsets[i].rotY;
        }

        // Smooth lerping
        mesh.position.x += (tx - mesh.position.x) * 0.15;
        mesh.position.y += (ty - mesh.position.y) * 0.15;
        mesh.position.z += (tz - mesh.position.z) * 0.15;
        
        // Wrap local Z-rotation (which is Y-rotation in global coordinates)
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

  window.Pieces3D = {
    init: function() {
      checkAndInit();
    },
    setMode,
    resize
  };
})();