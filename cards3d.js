// cards3d.js - Modelo 3D Interactivo de la Caja de Cartas de Cuadriculando en Three.js

(function () {
  let scene, camera, renderer, controls;
  let cardsContainer;
  let trayGroup, sleeveGroup;
  let autoRotate = true;
  let isOpened = false;
  let targetY = 0;

  const COLORS = {
    matteBlack: '#181a1b',
    white: '#ffffff',
    mdf: '#23272a'
  };

  function init() {
    const container = document.getElementById('canvas-cards3d');
    if (!container) return;

    // 1. Escena
    scene = new THREE.Scene();

    // 2. Cámara
    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      20
    );
    camera.position.set(2.0, 1.8, 2.5); // angled perspective view

    // 3. Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 1.0;
    controls.maxDistance = 5.0;
    controls.enabled = false; // Disabled by default in the gallery

    // 5. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight1.position.set(3, 5, 2);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    dirLight1.shadow.bias = -0.0003;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-3, 3, -2);
    scene.add(dirLight2);

    // 6. Grupo principal
    cardsContainer = new THREE.Group();
    cardsContainer.position.set(0, -0.4, 0);
    scene.add(cardsContainer);

    // 7. Construir caja y cartas
    buildCardsBox();

    // 8. Raycaster para click / abrir
    setupRaycaster();

    // 9. UI
    setupUI();

    // 10. Animación
    animate();

    // 11. Resize
    window.addEventListener('resize', onWindowResize, false);
  }

  function drawLogo(ctx, text, centerX, centerY, fontSize) {
    ctx.save();
    ctx.font = `normal ${fontSize}px Inlanders`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    
    let totalWidth = 0;
    const letterSpacing = fontSize * 0.05;
    const widths = [];
    for (let i = 0; i < text.length; i++) {
      const w = ctx.measureText(text[i]).width;
      widths.push(w);
      totalWidth += w + (i < text.length - 1 ? letterSpacing : 0);
    }
    
    let currentX = centerX - totalWidth / 2;
    
    const accents = {
      0: '#3c6ed4',  // C -> Blue
      2: '#f0cf3c',  // A -> Yellow
      4: '#d23434',  // R -> Red
      6: '#3c6ed4',  // C -> Blue
      9: '#f0cf3c',  // A -> Yellow
      11: '#d23434'  // D -> Red
    };
    
    const squareSize = fontSize * 0.24;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const w = widths[i];
      
      if (accents[i] !== undefined) {
        ctx.fillStyle = accents[i];
        const sqX = currentX - letterSpacing * 0.2;
        const sqY = centerY + fontSize * 0.22;
        ctx.fillRect(sqX, sqY, squareSize, squareSize);
      }
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(char, currentX, centerY);
      
      currentX += w + letterSpacing;
    }
    ctx.restore();
  }

  function createCardTexture(shape) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');

    // Fondo negro de la carta
    ctx.fillStyle = '#151515';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Borde blanco redondeado
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    const radius = 16;
    ctx.beginPath();
    ctx.moveTo(8 + radius, 8);
    ctx.lineTo(canvas.width - 8 - radius, 8);
    ctx.quadraticCurveTo(canvas.width - 8, 8, canvas.width - 8, 8 + radius);
    ctx.lineTo(canvas.width - 8, canvas.height - 8 - radius);
    ctx.quadraticCurveTo(canvas.width - 8, canvas.height - 8, canvas.width - 8 - radius, canvas.height - 8);
    ctx.lineTo(8 + radius, canvas.height - 8);
    ctx.quadraticCurveTo(8, canvas.height - 8, 8, canvas.height - 8 - radius);
    ctx.lineTo(8, 8 + radius);
    ctx.quadraticCurveTo(8, 8, 8 + radius, 8);
    ctx.closePath();
    ctx.stroke();

    // Texto CUADRICULANDO arriba
    drawLogo(ctx, 'CUADRICULANDO', canvas.width / 2, 28, 16);

    // Grilla (5 columnas x 5 filas) que abarca casi toda la tarjeta
    const gridYStart = 55;
    const gridWidth = 220;
    const gridHeight = 300;
    const gridXStart = (canvas.width - gridWidth) / 2;

    const cellW = gridWidth / 5;
    const cellH = gridHeight / 5;

    // Bloque negro sólido en las filas 3 y 4 (3 columnas x 2 filas)
    ctx.fillStyle = '#151515';
    ctx.fillRect(gridXStart + cellW, gridYStart + 2 * cellH, 3 * cellW, 2 * cellH);

    // Dibujar líneas de grilla
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2;

    // Dibujar líneas verticales (se saltan las filas 3 y 4 en las columnas del medio)
    for (let c = 0; c <= 5; c++) {
      const x = gridXStart + c * cellW;
      ctx.beginPath();
      ctx.moveTo(x, gridYStart);
      if (c === 2 || c === 3) {
        // Detenerse al inicio de la fila 3 y continuar en la fila 5
        ctx.lineTo(x, gridYStart + 2 * cellH);
        ctx.moveTo(x, gridYStart + 4 * cellH);
        ctx.lineTo(x, gridYStart + 5 * cellH);
      } else {
        // Ir hasta abajo (fila 5)
        ctx.lineTo(x, gridYStart + 5 * cellH);
      }
      ctx.stroke();
    }

    // Dibujar líneas horizontales (la fila 3 central queda libre para la figura)
    for (let r = 0; r <= 5; r++) {
      const y = gridYStart + r * cellH;
      ctx.beginPath();
      if (r === 3) {
        // Solo dibujar en la columna 1 y columna 5
        ctx.moveTo(gridXStart, y);
        ctx.lineTo(gridXStart + cellW, y);
        ctx.moveTo(gridXStart + 4 * cellW, y);
        ctx.lineTo(gridXStart + 5 * cellW, y);
      } else {
        // Ir de extremo a extremo
        ctx.moveTo(gridXStart, y);
        ctx.lineTo(gridXStart + gridWidth, y);
      }
      ctx.stroke();
    }

    // Dibujar figura (círculo o rombo) centrada verticalmente en la fila 3 (sobre el labio de la caja)
    const shapeCX = gridXStart + 2.5 * cellW;
    const shapeCY = gridYStart + 2.5 * cellH;
    ctx.fillStyle = '#ffffff';

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(shapeCX, shapeCY, 26, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'diamond') {
      const r = 26;
      ctx.beginPath();
      ctx.moveTo(shapeCX, shapeCY - r);
      ctx.lineTo(shapeCX + r, shapeCY);
      ctx.lineTo(shapeCX, shapeCY + r);
      ctx.lineTo(shapeCX - r, shapeCY);
      ctx.closePath();
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function createCustomProfileGeometry(width, yBackBottom, yFrontBottom, yBackTop, yFrontTop, depth) {
    const geometry = new THREE.BufferGeometry();
    
    const w = width / 2;
    const d = depth / 2;
    
    const vertices = new Float32Array([
      -w, yBackBottom, -d,  // 0: back-bottom-left
       w, yBackBottom, -d,  // 1: back-bottom-right
      -w, yFrontBottom,  d, // 2: front-bottom-left
       w, yFrontBottom,  d, // 3: front-bottom-right
      -w, yBackTop, -d,     // 4: back-top-left
       w, yBackTop, -d,     // 5: back-top-right
      -w, yFrontTop,  d,    // 6: front-top-left
       w, yFrontTop,  d     // 7: front-top-right
    ]);
    
    const indices = [
      2, 0, 1,
      3, 2, 1,
      
      4, 6, 5,
      6, 7, 5,
      
      0, 4, 1,
      4, 5, 1,
      
      2, 3, 6,
      3, 7, 6,
      
      0, 2, 4,
      2, 6, 4,
      
      1, 5, 3,
      5, 7, 3
    ];
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }

  function createSleeveTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 347; // height adjusted to matches the 1.18 x 0.80 cover ratio
    const ctx = canvas.getContext('2d');

    // Fondo negro satinado
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto CUADRICULANDO grande en el centro
    drawLogo(ctx, 'CUADRICULANDO', canvas.width / 2, canvas.height / 2, 38);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function createTrayFrontTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 138; // height adjusted to matches the 1.15 x 0.31 tray front lip
    const ctx = canvas.getContext('2d');

    // Fondo negro satinado
    ctx.fillStyle = '#181a1b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto CUADRICULANDO en el centro
    drawLogo(ctx, 'CUADRICULANDO', canvas.width / 2, canvas.height / 2, 28);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function buildCardsBox() {
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.matteBlack),
      roughness: 0.85,
      metalness: 0.08
    });

    const cardSideMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      roughness: 0.9,
      metalness: 0.02
    });

    // 1. Grupo de la Bandeja / Base Interior
    trayGroup = new THREE.Group();
    cardsContainer.add(trayGroup);

    // Bandeja base
    const trayBase = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.02, 0.3), darkMaterial);
    trayBase.position.y = 0.01;
    trayBase.castShadow = true;
    trayBase.receiveShadow = true;
    trayGroup.add(trayBase);

    // Bordes de la bandeja (izquierdo y derecho) con corte diagonal en la parte superior
    const traySideGeo = createCustomProfileGeometry(0.02, 0, 0, 0.8, 0.31, 0.3);
    
    const rimLeft = new THREE.Mesh(traySideGeo, darkMaterial);
    rimLeft.position.set(-0.565, 0, 0);
    rimLeft.castShadow = true;
    rimLeft.receiveShadow = true;
    trayGroup.add(rimLeft);

    const rimRight = new THREE.Mesh(traySideGeo, darkMaterial);
    rimRight.position.set(0.565, 0, 0);
    rimRight.castShadow = true;
    rimRight.receiveShadow = true;
    trayGroup.add(rimRight);

    // Borde trasero
    const rimBack = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.8, 0.02), darkMaterial);
    rimBack.position.set(0, 0.4, -0.14);
    rimBack.castShadow = true;
    rimBack.receiveShadow = true;
    trayGroup.add(rimBack);

    // Borde frontal
    const trayFrontTex = createTrayFrontTexture();
    const trayFrontMat = new THREE.MeshStandardMaterial({
      map: trayFrontTex,
      roughness: 0.85,
      metalness: 0.08
    });

    const trayFrontMaterials = [
      darkMaterial, // +X
      darkMaterial, // -X
      darkMaterial, // +Y
      darkMaterial, // -Y
      trayFrontMat, // +Z (Front)
      darkMaterial  // -Z
    ];

    const rimFront = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.31, 0.02), trayFrontMaterials);
    rimFront.position.set(0, 0.155, 0.14);
    rimFront.castShadow = true;
    rimFront.receiveShadow = true;
    trayGroup.add(rimFront);

    // Divisor central
    const trayDivider = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.8, 0.26), darkMaterial);
    trayDivider.position.set(0, 0.4, 0);
    trayDivider.castShadow = true;
    trayDivider.receiveShadow = true;
    trayGroup.add(trayDivider);

    // 2. Mazo Izquierdo (Círculo)
    const leftCardTex = createCardTexture('circle');
    const leftCardFrontMat = new THREE.MeshStandardMaterial({
      map: leftCardTex,
      roughness: 0.45,
      metalness: 0.05
    });

    const leftDeckMaterials = [
      cardSideMat, // +X
      cardSideMat, // -X
      cardSideMat, // +Y
      cardSideMat, // -Y
      leftCardFrontMat, // +Z (Front)
      cardSideMat  // -Z
    ];

    const deckLeft = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.74, 0.24), leftDeckMaterials);
    deckLeft.position.set(-0.2875, 0.39, 0);
    deckLeft.castShadow = true;
    deckLeft.receiveShadow = true;
    trayGroup.add(deckLeft);

    // 3. Mazo Derecho (Rombo)
    const rightCardTex = createCardTexture('diamond');
    const rightCardFrontMat = new THREE.MeshStandardMaterial({
      map: rightCardTex,
      roughness: 0.45,
      metalness: 0.05
    });

    const rightDeckMaterials = [
      cardSideMat, // +X
      cardSideMat, // -X
      cardSideMat, // +Y
      cardSideMat, // -Y
      rightCardFrontMat, // +Z (Front)
      cardSideMat  // -Z
    ];

    const deckRight = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.74, 0.24), rightDeckMaterials);
    deckRight.position.set(0.2875, 0.39, 0);
    deckRight.castShadow = true;
    deckRight.receiveShadow = true;
    trayGroup.add(deckRight);

    // 4. Grupo de la Funda Deslizable (abre hacia arriba)
    sleeveGroup = new THREE.Group();
    cardsContainer.add(sleeveGroup);

    // Textura de la funda
    const sleeveTex = createSleeveTexture();
    const sleeveFrontMat = new THREE.MeshStandardMaterial({
      map: sleeveTex,
      roughness: 0.55,
      metalness: 0.1
    });

    const sleeveFrontMaterials = [
      darkMaterial, // +X
      darkMaterial, // -X
      darkMaterial, // +Y
      darkMaterial, // -Y
      sleeveFrontMat, // +Z (Front)
      darkMaterial  // -Z
    ];

    // Tapas de la funda (superior, frontal, trasera, lateral izquierda, lateral derecha)
    const sleeveTop = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.01, 0.33), darkMaterial);
    sleeveTop.position.set(0, 0.805, 0);
    sleeveTop.castShadow = true;
    sleeveTop.receiveShadow = true;
    sleeveGroup.add(sleeveTop);

    // Funda frontal: cubre toda la altura (y=0.0 hasta y=0.8, alto=0.8)
    const sleeveFront = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.8, 0.01), sleeveFrontMaterials);
    sleeveFront.position.set(0, 0.4, 0.16);
    sleeveFront.castShadow = true;
    sleeveFront.receiveShadow = true;
    sleeveGroup.add(sleeveFront);

    // Funda trasera: cubre toda la altura (y=0.0 hasta y=0.8, alto=0.8)
    const sleeveBack = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.8, 0.01), darkMaterial);
    sleeveBack.position.set(0, 0.4, -0.16);
    sleeveBack.castShadow = true;
    sleeveBack.receiveShadow = true;
    sleeveGroup.add(sleeveBack);

    // Laterales de la funda: simples rectángulos (cubre toda la altura)
    const sleeveLeft = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.8, 0.33), darkMaterial);
    sleeveLeft.position.set(-0.585, 0.4, 0);
    sleeveLeft.castShadow = true;
    sleeveLeft.receiveShadow = true;
    sleeveGroup.add(sleeveLeft);

    const sleeveRight = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.8, 0.33), darkMaterial);
    sleeveRight.position.set(0.585, 0.4, 0);
    sleeveRight.castShadow = true;
    sleeveRight.receiveShadow = true;
    sleeveGroup.add(sleeveRight);

    // 5. Plano de sombra
    const floorGeo = new THREE.PlaneGeometry(6, 6);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    cardsContainer.add(floorMesh);
  }

  function setupRaycaster() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      const container = document.getElementById('canvas-cards3d');
      if (!container || !controls.enabled) return; // Only clickable in lightbox mode

      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check intersection with the sleeve or the container
      const intersects = raycaster.intersectObjects(sleeveGroup.children, true);
      if (intersects.length > 0) {
        toggleOpen();
      }
    };

    const container = document.getElementById('canvas-cards3d');
    if (container) {
      container.addEventListener('pointerup', onClick);
    }
  }

  function toggleOpen() {
    isOpened = !isOpened;
    targetY = isOpened ? 0.85 : 0;
  }

  function setupUI() {
    const rotateBtn = document.getElementById('btn-cards3d-rotate');
    const topBtn = document.getElementById('btn-cards3d-top');
    const perspectiveBtn = document.getElementById('btn-cards3d-persp');

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
        animateCamera(0, 3.2, 0.01);
      });
    }

    if (perspectiveBtn) {
      perspectiveBtn.addEventListener('click', () => {
        autoRotate = false;
        if (rotateBtn) rotateBtn.classList.remove('is-active');
        animateCamera(2.0, 1.8, 2.5);
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

  function animate() {
    requestAnimationFrame(animate);

    if (autoRotate) {
      cardsContainer.rotation.y += 0.003;
    }

    // Interpolate sleeve sliding
    if (Math.abs(sleeveGroup.position.y - targetY) > 0.001) {
      sleeveGroup.position.y += (targetY - sleeveGroup.position.y) * 0.1;
    } else {
      sleeveGroup.position.y = targetY;
    }

    // Interpolate camera positioning
    if (cameraAnim.active) {
      camera.position.x += (cameraAnim.targetX - camera.position.x) * cameraAnim.speed;
      camera.position.y += (cameraAnim.targetY - camera.position.y) * cameraAnim.speed;
      camera.position.z += (cameraAnim.targetZ - camera.position.z) * cameraAnim.speed;

      if (
        Math.abs(camera.position.x - cameraAnim.targetX) < 0.005 &&
        Math.abs(camera.position.y - cameraAnim.targetY) < 0.005 &&
        Math.abs(camera.position.z - cameraAnim.targetZ) < 0.005
      ) {
        camera.position.set(cameraAnim.targetX, cameraAnim.targetY, cameraAnim.targetZ);
        cameraAnim.active = false;
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    const container = document.getElementById('canvas-cards3d');
    if (!container) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function checkAndInit() {
    if (typeof THREE !== 'undefined' && THREE.OrbitControls) init();
    else setTimeout(checkAndInit, 50);
  }

  // Public API
  window.Cards3D = {
    init: checkAndInit,
    setMode: function (isLarge) {
      controls.enabled = isLarge;
      autoRotate = !isLarge;
      
      const rotateBtn = document.getElementById('btn-cards3d-rotate');
      if (rotateBtn) {
        rotateBtn.classList.toggle('is-active', autoRotate);
      }

      // Reset when closed
      if (!isLarge) {
        isOpened = false;
        targetY = 0;
        sleeveGroup.position.y = 0;
        cardsContainer.rotation.set(0, 0, 0);
        camera.position.set(2.0, 1.8, 2.5);
      }
    },
    resize: function () {
      onWindowResize();
    }
  };
})();
