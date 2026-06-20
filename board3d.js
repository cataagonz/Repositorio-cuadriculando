// board3d.js - Modelo 3D Interactivo de Cuadriculando en Three.js

(function () {
  let scene, camera, renderer, controls;
  let boardContainer;
  let autoRotate = true;

  const COLORS = {
    verde: '#4caf50',
    verdeLight: '#a5d6a7',
    verdeBgD: '#1b7a60',
    verdeBgC: '#a5d6a7',
    verdeShapeD: '#1b7a60',
    verdeShapeC: '#ffffff',
    verdeEarBg: '#1b7a60',
    verdeEarBadge: '#4caf50',

    amarillo: '#fbc02d',
    amarilloLight: '#fff59d',
    amarilloBgD: '#d48c00',
    amarilloBgC: '#fff59d',
    amarilloShapeD: '#d48c00',
    amarilloShapeC: '#ffffff',
    amarilloEarBg: '#d48c00',
    amarilloEarBadge: '#fbc02d',

    azul: '#2e5fae',
    azulLight: '#4776c7',
    azulBgD: '#0f2b5c',
    azulBgC: '#2e5fae',
    azulShapeD: '#5c8ae0',
    azulShapeC: '#ffffff',
    azulEarBg: '#0f2b5c',
    azulEarBadge: '#2e5fae',

    rojoBgD: '#e57373',
    rojoBgC: '#8d2424',
    rojoShapeD: '#8f1d1d',
    rojoShapeC: '#ffffff',
    rojoEarBg: '#5d2525',
    rojoEarBadge: '#8f1d1d',
    rojo: '#e53935',

    mdf: '#23272a',      // Slate grey MDF
    blanco: '#ffffff',
    gris: '#e0e0e0',
    grisOscuro: '#888888',
    acrilico: '#ffffff'
  };

  // Dimensiones del Tablero (1 unidad = 10 cm)
  const BOARD_SIZE = 3.5;       // 35 cm tablero superior
  const BASE_SIZE = 4.5;        // 45 cm tablero inferior
  const HEIGHT_MDF = 0.03;      // 3 mm MDF
  const HEIGHT_SLIDE = 0.025;   // rieles
  const OPENING_SIZE = 1.2;     // 12 cm ventana (referencia)

  function init() {
    const container = document.getElementById('canvas-3d');
    if (!container) return;

    // 1. Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');

    // 2. Cámara
    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      20
    );
    camera.position.set(4.5, 4.2, 5.0); // vista isométrica

    // 3. Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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
    controls.minDistance = 2.0;
    controls.maxDistance = 8.0;

    // 5. Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(5, 8, 4);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    dirLight1.shadow.bias = -0.0003;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3c6ed4, 0.35);
    dirLight2.position.set(-6, 4, -6);
    scene.add(dirLight2);

    const specLight = new THREE.DirectionalLight(0xffffff, 1.4);
    specLight.position.set(-1, 8, 3.5);
    scene.add(specLight);

    // 6. Grupo principal
    boardContainer = new THREE.Group();
    boardContainer.position.set(0, -0.4, 0);
    scene.add(boardContainer);

    // 7. Tablero
    buildBoard();

    // 8. UI
    setupUI();

    // 9. Animación
    animate();

    // 10. Resize
    window.addEventListener('resize', onWindowResize, false);
  }

  // --------- helpers 2D para la textura (se usarán después) ---------

  function drawCell(ctx, x, y, w, h, bgColor, shapeType, shapeColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.fillStyle = shapeColor;

    if (shapeType === 'circle') {
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.22, 0, Math.PI * 2);
      ctx.fill();
    } else if (shapeType === 'diamond') {
      const r = Math.min(w, h) * 0.25;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r, cy);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawEar(ctx, x, y, w, h, earBg, badgeBg, text, arrowDirX, arrowDirY) {
    ctx.fillStyle = earBg;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, w, h);

    const cx = x + w / 2;
    const cy = y + h / 2;

    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, cy);

    ctx.fillStyle = '#ffffff';
    const drawArrow = (ax, ay, rot) => {
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.lineTo(2, -4);
      ctx.lineTo(2, -10);
      ctx.lineTo(12, 0);
      ctx.lineTo(2, 10);
      ctx.lineTo(2, 4);
      ctx.lineTo(-10, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    if (arrowDirX !== 0) {
      drawArrow(cx + arrowDirX * 46, cy, arrowDirX > 0 ? 0 : Math.PI);
    }
    if (arrowDirY !== 0) {
      drawArrow(cx, cy + arrowDirY * 46, arrowDirY > 0 ? Math.PI / 2 : -Math.PI / 2);
    }
  }

  function drawCenterCell(ctx, x, y, w, h) {
    ctx.fillStyle = '#d0d0d0';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    const cx = x + w / 2;
    const cy = y + h / 2;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#888888';
    ctx.font = 'bold 18px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('x2', cx, cy);
  }

  // --------- textura de prueba (4 cuadrantes de color) ---------

  function createVinylTexture() {
  // Canvas donde trabajaremos
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Creamos la textura de Three asociada al canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;

  // Cargamos la imagen final del tablero (ajusta la ruta si es distinta)
  const img = new Image();
  img.src = 'assets/tablerovacio.png';

  img.onload = () => {
    // Ajustamos el canvas al tamaño de la imagen
    canvas.width = img.width;
    canvas.height = img.height;

    // Dibujamos el tablero completo
    ctx.drawImage(img, 0, 0);

    // Asumimos grilla 12x12 casillas en la imagen
    const COLS = 12;
    const ROWS = 12;
    const cellW = img.width / COLS;
    const cellH = img.height / ROWS;

    // Función para vaciar un bloque 4x4 de casillas
    function clearBlock(startCol, startRow) {
      const blockCols = 4;
      const blockRows = 4;
      ctx.fillStyle = '#ffffff'; // color "vacío"
      for (let r = 0; r < blockRows; r++) {
        for (let c = 0; c < blockCols; c++) {
          const x = (startCol + c) * cellW;
          const y = (startRow + r) * cellH;
          ctx.fillRect(x, y, cellW, cellH);
        }
      }
    }

    // Índices aproximados de los 4 bloques internos 4x4 (puede que ajustemos 1 celda)
    // Azul interno (arriba-izquierda)
    clearBlock(2, 2);
    // Amarillo interno (arriba-derecha)
    clearBlock(6, 2);
    // Verde interno (abajo-izquierda)
    clearBlock(2, 6);
    // Rojo interno (abajo-derecha)
    clearBlock(6, 6);

    // Marcamos la textura como actualizada
    texture.needsUpdate = true;
  };

  return texture;
}
  // --------- construcción 3D ---------

  function buildBoard() {
    const mdfMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.mdf),
      roughness: 0.82,
      metalness: 0.08
    });

    // 1. Tablero inferior
    const lowerShape = new THREE.Shape();
    lowerShape.moveTo(-2.25, -2.25);
    lowerShape.lineTo(-2.25, 2.25);
    lowerShape.lineTo(2.25, 2.25);
    lowerShape.lineTo(2.25, -2.25);
    lowerShape.closePath();

    const addWindowHoles = (s) => {
      const w1 = new THREE.Path();
      w1.moveTo(-1.45, -1.45);
      w1.lineTo(-1.45, -0.15);
      w1.lineTo(-0.15, -0.15);
      w1.lineTo(-0.15, -1.45);
      w1.closePath();
      s.holes.push(w1);

      const w2 = new THREE.Path();
      w2.moveTo(0.15, -1.45);
      w2.lineTo(0.15, -0.15);
      w2.lineTo(1.45, -0.15);
      w2.lineTo(1.45, -1.45);
      w2.closePath();
      s.holes.push(w2);

      const w3 = new THREE.Path();
      w3.moveTo(-1.45, 0.15);
      w3.lineTo(-1.45, 1.45);
      w3.lineTo(-0.15, 1.45);
      w3.lineTo(-0.15, 0.15);
      w3.closePath();
      s.holes.push(w3);

      const w4 = new THREE.Path();
      w4.moveTo(0.15, 0.15);
      w4.lineTo(0.15, 1.45);
      w4.lineTo(1.45, 1.45);
      w4.lineTo(1.45, 0.15);
      w4.closePath();
      s.holes.push(w4);
    };

    addWindowHoles(lowerShape);

    const lowerGeo = new THREE.ExtrudeGeometry(lowerShape, {
      depth: HEIGHT_MDF,
      bevelEnabled: false
    });
    const lowerBoard = new THREE.Mesh(lowerGeo, mdfMaterial);
    lowerBoard.rotation.x = -Math.PI / 2;
    lowerBoard.position.y = 0.6;
    lowerBoard.castShadow = true;
    lowerBoard.receiveShadow = true;
    boardContainer.add(lowerBoard);

    // 2. Rieles
    const yCanal = 0.6 + HEIGHT_MDF + HEIGHT_SLIDE / 2;
    const railLength = 4.9;

    const rails = [
      { pos: [0, yCanal, 0], dim: [railLength, HEIGHT_SLIDE, 0.3] },
      { pos: [0, yCanal, -1.5], dim: [railLength, HEIGHT_SLIDE, 0.3] },
      { pos: [0, yCanal, 1.5], dim: [railLength, HEIGHT_SLIDE, 0.3] },
      { pos: [0, yCanal, 0], dim: [0.3, HEIGHT_SLIDE, railLength] },
      { pos: [-1.5, yCanal, 0], dim: [0.3, HEIGHT_SLIDE, railLength] },
      { pos: [1.5, yCanal, 0], dim: [0.3, HEIGHT_SLIDE, railLength] }
    ];

    rails.forEach(r => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(...r.dim), mdfMaterial);
      rail.position.set(...r.pos);
      rail.castShadow = true;
      rail.receiveShadow = true;
      boardContainer.add(rail);
    });

    // 3. Tablero superior (MDF + orejas)
    const ySuperior = 0.6 + HEIGHT_MDF + HEIGHT_SLIDE + HEIGHT_MDF / 2;

    const upperShape = new THREE.Shape();
    upperShape.moveTo(-1.75, -1.45);
    upperShape.lineTo(-1.75, 1.45);

    // oreja inferior izquierda
    upperShape.lineTo(-1.85, 1.45);
    upperShape.lineTo(-1.85, 1.85);
    upperShape.lineTo(-1.45, 1.85);
    upperShape.lineTo(-1.45, 1.75);

    // borde inferior
    upperShape.lineTo(1.45, 1.75);

    // oreja inferior derecha
    upperShape.lineTo(1.45, 1.85);
    upperShape.lineTo(1.85, 1.85);
    upperShape.lineTo(1.85, 1.45);
    upperShape.lineTo(1.75, 1.45);

    // borde derecho
    upperShape.lineTo(1.75, -1.45);

    // oreja superior derecha
    upperShape.lineTo(1.85, -1.45);
    upperShape.lineTo(1.85, -1.85);
    upperShape.lineTo(1.45, -1.85);
    upperShape.lineTo(1.45, -1.75);

    // borde superior
    upperShape.lineTo(-1.45, -1.75);

    // oreja superior izquierda
    upperShape.lineTo(-1.45, -1.85);
    upperShape.lineTo(-1.85, -1.85);
    upperShape.lineTo(-1.85, -1.45);
    upperShape.lineTo(-1.75, -1.45);
    upperShape.closePath();

    addWindowHoles(upperShape);

    const addSlotsToShape = (s) => {
      const makeSlot = (cx, cy, w, h) => {
        const p = new THREE.Path();
        p.moveTo(cx - w / 2, cy - h / 2);
        p.lineTo(cx - w / 2, cy + h / 2);
        p.lineTo(cx + w / 2, cy + h / 2);
        p.lineTo(cx + w / 2, cy - h / 2);
        p.closePath();
        s.holes.push(p);
      };

      // ranuras en orejas
      makeSlot(-1.75, -1.625, 0.03, 0.25);
      makeSlot(-1.625, -1.75, 0.25, 0.03);

      makeSlot(1.75, -1.625, 0.03, 0.25);
      makeSlot(1.625, -1.75, 0.25, 0.03);

      makeSlot(-1.75, 1.625, 0.03, 0.25);
      makeSlot(-1.625, 1.75, 0.25, 0.03);

      makeSlot(1.75, 1.625, 0.03, 0.25);
      makeSlot(1.625, 1.75, 0.25, 0.03);
    };

    addSlotsToShape(upperShape);

    const upperGeo = new THREE.ExtrudeGeometry(upperShape, {
      depth: HEIGHT_MDF,
      bevelEnabled: false
    });
    const upperBoard = new THREE.Mesh(upperGeo, mdfMaterial);
    upperBoard.rotation.x = -Math.PI / 2;
    upperBoard.position.y = ySuperior - HEIGHT_MDF / 2;
    upperBoard.castShadow = true;
    upperBoard.receiveShadow = true;
    boardContainer.add(upperBoard);

    // 4. Vinilo: plano completo 35x35 cm dentro del marco
    const vinylTex = createVinylTexture();
    const vinylMat = new THREE.MeshStandardMaterial({
      map: vinylTex,
      transparent: false,
      roughness: 0.5,
      metalness: 0.1
    });

    const vinylGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const vinyl = new THREE.Mesh(vinylGeo, vinylMat);
    vinyl.rotation.x = -Math.PI / 2;
    vinyl.position.y = ySuperior + HEIGHT_MDF *  2 + 0.005;
    vinyl.receiveShadow = true;
    boardContainer.add(vinyl);

    // 5. Acrílico
    const acrylicMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 120,
      transparent: true,
      opacity: 0.15,
      depthWrite: true
    });

    const acrylicGeo = new THREE.ExtrudeGeometry(upperShape, {
      depth: HEIGHT_MDF,
      bevelEnabled: false
    });
    const acrylic = new THREE.Mesh(acrylicGeo, acrylicMat);
    acrylic.rotation.x = -Math.PI / 2;
    acrylic.position.y = ySuperior + HEIGHT_MDF / 2 + 0.02;
    boardContainer.add(acrylic);

    const edgesGeo = new THREE.EdgesGeometry(acrylicGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    acrylic.add(edges);

    // 6. Pernos
    const pegHeight = 0.11;
    const pegGeoV = new THREE.BoxGeometry(0.024, pegHeight, 0.23);
    const pegGeoH = new THREE.BoxGeometry(0.23, pegHeight, 0.024);

    const createPeg = (geo, px, pz) => {
      const peg = new THREE.Mesh(geo, mdfMaterial);
      peg.position.set(px, 0.63 + pegHeight / 2, pz);
      peg.castShadow = true;
      boardContainer.add(peg);
    };

    createPeg(pegGeoV, -1.75, -1.625);
    createPeg(pegGeoH, -1.625, -1.75);
    createPeg(pegGeoV, 1.75, -1.625);
    createPeg(pegGeoH, 1.625, -1.75);
    createPeg(pegGeoV, -1.75, 1.625);
    createPeg(pegGeoH, -1.625, 1.75);
    createPeg(pegGeoV, 1.75, 1.625);
    createPeg(pegGeoH, 1.625, 1.75);
  }

  // --------- UI ---------

  function setupUI() {
    const rotateBtn = document.getElementById('btn-3d-rotate');
    const topBtn = document.getElementById('btn-3d-top');
    const perspectiveBtn = document.getElementById('btn-3d-persp');

    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        rotateBtn.classList.toggle('is-active', autoRotate);
      });
    }
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        autoRotate = false;
        animateCamera(0, 6.0, 0.01);
      });
    }
    if (perspectiveBtn) {
      perspectiveBtn.addEventListener('click', () => {
        autoRotate = false;
        animateCamera(4.5, 4.2, 5.0);
      });
    }
  }

  // --------- animación ---------

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
      boardContainer.rotation.y += 0.003;
    }

    if (cameraAnim.active) {
      camera.position.x += (cameraAnim.targetX - camera.position.x) * cameraAnim.speed;
      camera.position.y += (cameraAnim.targetY - camera.position.y) * cameraAnim.speed;
      camera.position.z += (cameraAnim.targetZ - camera.position.z) * cameraAnim.speed;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    const container = document.getElementById('canvas-3d');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function checkAndInit() {
    if (typeof THREE !== 'undefined' && THREE.OrbitControls) init();
    else setTimeout(checkAndInit, 50);
  }

  document.addEventListener('DOMContentLoaded', checkAndInit);
})();