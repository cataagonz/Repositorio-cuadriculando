const CONFIG = {
  pad: 32,
  cols: 4,
  rows: 3,
  scrollRange: 450
};

const GALLERY_IMAGES = [
  'Assets/Imagen caja 1.png',
  'Assets/Imagen tablero 1.png',
  'Assets/piezas acrilico.png',
  'Assets/piezas especiales 1.png',
  'Assets/ruleta 1..png',
  'Assets/Cuadriculas 1.png',
  'Assets/Imagen cartas 1.png'
];

const HERO_DOTS = [
  { id: 'h1', col: 0, row: 0, ox: 0.30, oy: 0.28 },
  { id: 'h2', col: 1, row: 0, ox: 0.42, oy: 0.42 },
  { id: 'h3', col: 2, row: 0, ox: 0.35, oy: 0.26 },
  { id: 'h4', col: 3, row: 0, ox: 0.55, oy: 0.28 },
  { id: 'h5', col: 0, row: 2, ox: 0.45, oy: 0.55 },
  { id: 'h6', col: 1, row: 2, ox: 0.55, oy: 0.52 },
  { id: 'h7', col: 2, row: 2, ox: 0.38, oy: 0.68 },
  { id: 'h8', col: 3, row: 2, ox: 0.62, oy: 0.54 }
];

const DESC_DOTS = [
  { id: 'd1', col: 3, row: 0, ox: 0.55, oy: 0.35 },
  { id: 'd2', col: 0, row: 0, ox: 0.60, oy: 0.12 },
  { id: 'd3', col: 2, row: 0, ox: 0.45, oy: 0.12 },
  { id: 'd4', col: 1, row: 1, ox: 0.25, oy: 0.12 },
  { id: 'd5', col: 0, row: 2, ox: 0.15, oy: 0.12 },
  { id: 'd6', col: 2, row: 2, ox: 0.52, oy: 0.12 },
  { id: 'd7', col: 3, row: 2, ox: 0.62, oy: 0.60 },
  { id: 'd8', col: 1, row: 2, ox: 0.40, oy: 0.12 }
];

const FOOTER_DOTS = [
  { id: 'f5', col: 0, row: 2, ox: 0.45, oy: 0.70 },
  { id: 'f6', col: 1, row: 2, ox: 0.55, oy: 0.67 },
  { id: 'f7', col: 2, row: 2, ox: 0.38, oy: 0.83 },
  { id: 'f8', col: 3, row: 2, ox: 0.62, oy: 0.69 }
];

const DESC_TEXTS = [
  { id: 'desc1', col: 0, span: 2.5, row: 0 },
  { id: 'desc2', col: 1, span: 2.5, row: 1 },
  { id: 'desc3', col: 0, span: 2.5, row: 2 }
];

const TITLES = [
  { id: 'cuad-title', col: 0, row: 0, span: 2.5 },
  { id: 'descifra-title', col: 2, row: 0, span: 2 },
  { id: 'ataca-title', col: 0, row: 0, span: 1.5 }
];

const BLOCK_DIRECTIONS = {
  s3: {
    azul: { x: 0, y: -1 },
    verde: { x: 0, y: -1 },
    rojo: { x: 1, y: 0 },
    amarillo: { x: 1, y: 0 }
  },
  s4: {
    azul: { x: 1, y: 0 },
    amarillo: { x: 1, y: 0 },
    rojo: { x: -1, y: 0 },
    verde: { x: -1, y: 0 }
  },
  s5: {
    amarillo: { x: 1, y: 0 },
    rojo: { x: -1, y: 0 },
    verde: { x: 0, y: 1 },
    azul: { x: 1, y: 0 }
  }
};

const sectionState = {
  s3: { progress: 0, delta: 0, active: false },
  s4: { progress: 0, delta: 0, active: false },
  s5: { progress: 0, delta: 0, active: false }
};

const cursorSq = document.getElementById('cursor-sq');
const gridOverlay = document.getElementById('grid-overlay');
const heroTitle = document.getElementById('hero-title');

function getCellSize() {
  return Math.floor(
    Math.min(
      (window.innerWidth - CONFIG.pad * 2) / CONFIG.cols,
      (window.innerHeight - CONFIG.pad * 2) / CONFIG.rows
    )
  );
}

function getMetrics() {
  const cell = getCellSize();
  const gridW = cell * CONFIG.cols;
  const gridH = cell * CONFIG.rows;
  const offX = Math.floor((window.innerWidth - gridW) / 2);
  const offY = Math.floor((window.innerHeight - gridH) / 2);

  return {
    cell,
    gridW,
    gridH,
    offX,
    offY,
    cx: col => offX + col * cell,
    cy: row => offY + row * cell
  };
}

function setBox(el, left, top, width, height) {
  if (!el) return;
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
}

function placeDots(items, metrics) {
  const size = Math.floor(metrics.cell * 0.24);

  items.forEach(({ id, col, row, ox, oy }) => {
    const el = document.getElementById(id);
    if (!el) return;

    setBox(
      el,
      Math.floor(metrics.cx(col) + ox * metrics.cell),
      Math.floor(metrics.cy(row) + oy * metrics.cell),
      size,
      size
    );
  });
}

function updateGridOverlay(metrics) {
  const svgW = window.innerWidth;
  const svgH = metrics.gridH;
  const lineColor = 'rgba(255,255,255,0.30)';
  const lineWidth = 1.5;

  let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${svgW}' height='${svgH}'>`;

  for (let r = 0; r <= CONFIG.rows; r++) {
    const y = Math.min(r * metrics.cell, svgH) - (r === CONFIG.rows ? 0.75 : -0.75);
    svg += `<line x1="0" y1="${y}" x2="${svgW}" y2="${y}" stroke="${lineColor}" stroke-width="${lineWidth}"/>`;
  }

  for (let x = metrics.offX; x >= 0; x -= metrics.cell) {
    svg += `<line x1="${x}" y1="0" x2="${x}" y2="${svgH}" stroke="${lineColor}" stroke-width="${lineWidth}"/>`;
  }

  for (let x = metrics.offX + metrics.cell; x <= svgW; x += metrics.cell) {
    svg += `<line x1="${x}" y1="0" x2="${x}" y2="${svgH}" stroke="${lineColor}" stroke-width="${lineWidth}"/>`;
  }

  svg += `</svg>`;

  gridOverlay.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  gridOverlay.style.backgroundRepeat = 'repeat-y';
  gridOverlay.style.backgroundPosition = `0px ${metrics.offY}px`;
  gridOverlay.style.backgroundSize = `${svgW}px ${svgH}px`;
}

function layoutHero(metrics) {
  const title = document.getElementById('hero-title');
  if (!title) return;

  const titleSize = Math.floor(metrics.cell * 0.80);
  title.style.fontSize = `${titleSize}px`;
  title.style.left = `${metrics.offX}px`;
  title.style.width = `${metrics.gridW}px`;
  
  const titleTop = Math.floor(metrics.cy(1) + metrics.cell * 0.20);
  title.style.top = `${titleTop}px`;
}

function layoutDescriptionTexts(metrics) {
  const paddingX = 16;

  DESC_TEXTS.forEach(({ id, col, span, row }) => {
    const el = document.getElementById(id);
    if (!el) return;

    const width = metrics.cell * span - paddingX * 2;
    const top = Math.floor(metrics.cy(row) + (metrics.cell - el.offsetHeight) / 2);

    el.style.width = `${width}px`;
    el.style.top = `${top}px`;

    if (id === 'desc2') {
      el.style.left = `${metrics.cx(col) + metrics.cell * 0.5}px`;
      el.style.textAlign = 'right';
    } else {
      el.style.left = `${metrics.cx(col) + paddingX}px`;
      el.style.textAlign = 'left';
    }
  });
}

function layoutSectionTitles(metrics) {
  TITLES.forEach(({ id, col, row, span }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.style.fontSize = `${Math.floor(metrics.cell * 0.40)}px`;
    el.style.left = `${metrics.cx(col)}px`;
    el.style.top = `${metrics.cy(row)}px`;
    el.style.width = `${metrics.cell * span}px`;
    el.style.height = `${metrics.cell}px`;
  });
}

function layoutBlocksAndTexts(metrics) {
  document.querySelectorAll('.cuad-block, .cuad-text').forEach(el => {
    const col = Number(el.dataset.col);
    const row = Number(el.dataset.row);
    setBox(el, metrics.cx(col), metrics.cy(row), metrics.cell, metrics.cell);
  });
}

function layoutSection6(metrics) {
  // Discontinuado: El diseño es manejado estática y responsivamente por flexbox en CSS
}

function layoutSeparators(metrics) {
  const separators = document.querySelectorAll('.sep-row');
  const dotSize = Math.floor(metrics.cell * 0.24);

  separators.forEach(sep => {
    sep.style.height = `${metrics.cell}px`;

    const dots = sep.querySelectorAll('.sep-dot');
    if (dots.length < 4) return;

    const positions = [
      { col: 0, ox: 0.30, oy: 0.32 },
      { col: 1, ox: 0.58, oy: 0.58 },
      { col: 2, ox: 0.26, oy: 0.34 },
      { col: 3, ox: 0.62, oy: 0.56 }
    ];

    dots.forEach((dot, i) => {
      const p = positions[i];
      dot.style.width = `${dotSize}px`;
      dot.style.height = `${dotSize}px`;
      dot.style.left = `${Math.floor(metrics.cx(p.col) + p.ox * metrics.cell)}px`;
      dot.style.top = `${Math.floor(p.oy * metrics.cell)}px`;
    });
  });
}

function layoutGallery(metrics) {
  const wrap = document.querySelector('.carousel-wrap');
  if (!wrap) return;

  wrap.style.left = `${metrics.offX}px`;
  wrap.style.top = `0px`;
  wrap.style.width = `${metrics.gridW}px`;
  wrap.style.height = `${metrics.cell}px`;
}

function renderGallery() {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  track.innerHTML = '';

  GALLERY_IMAGES.forEach((src, index) => {
    const slide = document.createElement('article');

    if (src === 'Assets/Imagen caja 1.png') {
      slide.className = 'gallery-slide box-3d-slide';
      slide.id = 'box-3d-slide';
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', `Ver modelo 3D de la caja de cerca`);

      const canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-box3d';
      slide.appendChild(canvasContainer);
      track.appendChild(slide);
      return;
    }

    if (src === 'Assets/Imagen tablero 1.png') {
      slide.className = 'gallery-slide board-3d-slide';
      slide.id = 'board-3d-slide';
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', `Ver modelo 3D del tablero de cerca`);

      const canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-3d';
      slide.appendChild(canvasContainer);
      track.appendChild(slide);
      return;
    }

    if (src === 'Assets/Imagen cartas 1.png') {
      slide.className = 'gallery-slide cards-3d-slide';
      slide.id = 'cards-3d-slide';
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', `Ver modelo 3D de la caja de cartas de cerca`);

      const canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-cards3d';
      slide.appendChild(canvasContainer);
      track.appendChild(slide);
      return;
    }

    if (src === 'Assets/ruleta 1..png') {
      slide.className = 'gallery-slide ruleta-3d-slide';
      slide.id = 'ruleta-3d-slide';
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', `Ver modelo 3D de la ruleta de cerca`);

      const canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-ruleta3d';
      slide.appendChild(canvasContainer);
      track.appendChild(slide);
      return;
    }

    if (src === 'Assets/Cuadriculas 1.png') {
      slide.className = 'gallery-slide cuadriculas-3d-slide';
      slide.id = 'cuadriculas-3d-slide';
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', `Ver modelo 3D de las cuadrículas de colores de cerca`);

      const canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-cuadriculas3d';
      slide.appendChild(canvasContainer);
      track.appendChild(slide);
      return;
    }

    if (src === 'Assets/piezas especiales 1.png') {
      slide.className = 'gallery-slide pieces-3d-slide';
      slide.id = 'pieces-3d-slide';
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', `Ver modelo 3D de las piezas especiales de cerca`);

      const canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-pieces3d';
      slide.appendChild(canvasContainer);
      track.appendChild(slide);
      return;
    }

    if (src === 'Assets/piezas acrilico.png') {
      slide.className = 'gallery-slide acrylic-3d-slide';
      slide.id = 'acrylic-3d-slide';
      slide.setAttribute('tabindex', '0');
      slide.setAttribute('role', 'button');
      slide.setAttribute('aria-label', `Ver modelo 3D de las piezas de acrílico de cerca`);

      const canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-acrylic3d';
      slide.appendChild(canvasContainer);
      track.appendChild(slide);
      return;
    }

    slide.className = 'gallery-slide';
    slide.dataset.full = src;
    slide.setAttribute('tabindex', '0');
    slide.setAttribute('role', 'button');
    slide.setAttribute('aria-label', `Ver imagen ${index + 1} más de cerca`);

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Imagen ${index + 1}`;
    img.loading = 'lazy';

    img.onerror = () => {
      slide.classList.add('is-missing');
      slide.removeAttribute('data-full');
      slide.innerHTML = '<span>imagen</span>';
    };

    slide.appendChild(img);
    track.appendChild(slide);
  });
}

function clearInlineStyles() {
  const selectors = [
    '.dot', '#hero-title', '.hero-sq', '.t-body', '.section-title',
    '.cuad-block', '.cuad-text', '#s6-title', '#s6-arrow',
    '.sep-row', '.sep-dot', '.carousel-wrap', '#s-gallery'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.left = '';
      el.style.top = '';
      el.style.width = '';
      el.style.height = '';
      el.style.fontSize = '';
      el.style.transform = '';
      el.style.opacity = '';
      el.style.filter = '';
    });
  });
}

function updateBlocks(sectionId, progress) {
  if (window.innerWidth <= 768) {
    document.querySelectorAll(`#${sectionId} .cuad-block`).forEach(el => {
      el.style.transform = '';
    });
    document.querySelectorAll(`#${sectionId} .cuad-text`).forEach(el => {
      el.style.opacity = '';
      el.style.filter = '';
    });
    return;
  }

  const cell = getCellSize();
  const directions = BLOCK_DIRECTIONS[sectionId];

  document.querySelectorAll(`#${sectionId} .cuad-block`).forEach(el => {
    const dir = directions[el.dataset.color] || { x: 0, y: 0 };
    const tx = cell * progress * dir.x;
    const ty = cell * progress * dir.y;
    el.style.transform = `translate(${tx}px, ${ty}px)`;
  });

  document.querySelectorAll(`#${sectionId} .cuad-text`).forEach(el => {
    el.style.opacity = Math.min(1, progress * 1.1);
    const blurVal = 8 * Math.pow(1 - progress, 2);
    el.style.filter = blurVal > 0.1 ? `blur(${blurVal}px)` : 'none';
  });
}

function updateScrollProgress(onlyActive = true) {
  if (window.innerWidth <= 768) return;

  Object.keys(sectionState).forEach(id => {
    const state = sectionState[id];
    if (onlyActive && !state.active) return;

    const section = document.getElementById(id);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const startY = window.innerHeight * 0.85;
    const endY = window.innerHeight * 0.15;
    const progress = Math.max(0, Math.min(1, (startY - rect.top) / (startY - endY)));

    state.progress = progress;
    updateBlocks(id, progress);
  });
}

function layout() {
  if (window.innerWidth <= 768) {
    document.body.classList.add('is-mobile-view');
    clearInlineStyles();
    Object.keys(sectionState).forEach(id => {
      updateBlocks(id, 0);
    });
    return;
  }

  document.body.classList.remove('is-mobile-view');
  const metrics = getMetrics();

  const gallerySection = document.getElementById('s-gallery');
  if (gallerySection) {
    gallerySection.style.height = `${metrics.cell}px`;
  }

  updateGridOverlay(metrics);
  layoutHero(metrics);
  placeDots(HERO_DOTS, metrics);
  placeDots(DESC_DOTS, metrics);
  placeDots(FOOTER_DOTS, metrics);
  layoutDescriptionTexts(metrics);
  layoutSectionTitles(metrics);
  layoutBlocksAndTexts(metrics);
  layoutSection6(metrics);
  layoutSeparators(metrics);
  layoutGallery(metrics);
  updateScrollProgress(false);
}

function setupCursor() {
  if (!cursorSq) return;

  document.addEventListener('mousemove', event => {
    cursorSq.style.left = `${event.clientX}px`;
    cursorSq.style.top = `${event.clientY}px`;
  });
}

function setupGalleryControls() {
  const prev = document.getElementById('gallery-prev');
  const next = document.getElementById('gallery-next');
  const track = document.getElementById('gallery-track');

  if (!track) return;

  function getStep() {
    const firstSlide = track.querySelector('.gallery-slide');
    return firstSlide ? firstSlide.offsetWidth : track.clientWidth;
  }

  prev?.addEventListener('click', () => {
    track.scrollBy({
      left: -getStep(),
      behavior: 'smooth'
    });
  });

  next?.addEventListener('click', () => {
    track.scrollBy({
      left: getStep(),
      behavior: 'smooth'
    });
  });
}

function setupSectionObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (sectionState[entry.target.id]) {
        sectionState[entry.target.id].active = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateScrollProgress(false);
        }
      }
    });
  }, { threshold: 0.05 });

  ['s3', 's4', 's5'].forEach(id => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

function setupScrollAnimation() {
  window.addEventListener('scroll', () => {
    updateScrollProgress(true);
  }, { passive: true });
}

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const track = document.getElementById('gallery-track');

  if (!lightbox || !lightboxImage || !track) return;

  function openLightbox(src, alt = 'Vista ampliada') {
    const container3d = document.getElementById('lightbox-3d-container');
    if (container3d) container3d.style.display = 'none';
    const containerBox3d = document.getElementById('lightbox-box3d-container');
    if (containerBox3d) containerBox3d.style.display = 'none';
    const containerCards3d = document.getElementById('lightbox-cards3d-container');
    if (containerCards3d) containerCards3d.style.display = 'none';
    const containerRuleta3d = document.getElementById('lightbox-ruleta3d-container');
    if (containerRuleta3d) containerRuleta3d.style.display = 'none';
    lightboxImage.style.display = 'block';

    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function hideAll3DContainers() {
    const ids = [
      'lightbox-3d-container',
      'lightbox-box3d-container',
      'lightbox-cards3d-container',
      'lightbox-ruleta3d-container',
      'lightbox-cuadriculas3d-container',
      'lightbox-pieces3d-container',
      'lightbox-acrylic3d-container'
    ];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  function open3DLightbox() {
    hideAll3DContainers();
    const container3d = document.getElementById('lightbox-3d-container');
    const canvas3d = document.getElementById('canvas-3d');
    if (!container3d || !canvas3d) return;

    lightboxImage.style.display = 'none';
    container3d.style.display = 'block';
    container3d.appendChild(canvas3d);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.Board3D) {
      window.Board3D.setMode(true);
      window.Board3D.resize();
    }
  }

  function openBox3DLightbox() {
    hideAll3DContainers();
    const containerBox3d = document.getElementById('lightbox-box3d-container');
    const canvasBox3d = document.getElementById('canvas-box3d');
    if (!containerBox3d || !canvasBox3d) return;

    lightboxImage.style.display = 'none';
    containerBox3d.style.display = 'block';
    containerBox3d.appendChild(canvasBox3d);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.Box3D) {
      window.Box3D.setMode(true);
      window.Box3D.resize();
    }
  }

  function openCards3DLightbox() {
    hideAll3DContainers();
    const containerCards3d = document.getElementById('lightbox-cards3d-container');
    const canvasCards3d = document.getElementById('canvas-cards3d');
    if (!containerCards3d || !canvasCards3d) return;

    lightboxImage.style.display = 'none';
    containerCards3d.style.display = 'block';
    containerCards3d.appendChild(canvasCards3d);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.Cards3D) {
      window.Cards3D.setMode(true);
      window.Cards3D.resize();
    }
  }

  function openRuleta3DLightbox() {
    hideAll3DContainers();
    const containerRuleta3d = document.getElementById('lightbox-ruleta3d-container');
    const canvasRuleta3d = document.getElementById('canvas-ruleta3d');
    if (!containerRuleta3d || !canvasRuleta3d) return;

    lightboxImage.style.display = 'none';
    containerRuleta3d.style.display = 'block';
    containerRuleta3d.appendChild(canvasRuleta3d);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.Ruleta3D) {
      window.Ruleta3D.setMode(true);
      window.Ruleta3D.resize();
    }
  }

  function openCuadriculas3DLightbox() {
    hideAll3DContainers();
    const containerCuadriculas3d = document.getElementById('lightbox-cuadriculas3d-container');
    const canvasCuadriculas3d = document.getElementById('canvas-cuadriculas3d');
    if (!containerCuadriculas3d || !canvasCuadriculas3d) return;

    lightboxImage.style.display = 'none';
    containerCuadriculas3d.style.display = 'block';
    containerCuadriculas3d.appendChild(canvasCuadriculas3d);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.Cuadriculas3D) {
      window.Cuadriculas3D.setMode(true);
      window.Cuadriculas3D.resize();
    }
  }

  function openPieces3DLightbox() {
    hideAll3DContainers();
    const containerPieces3d = document.getElementById('lightbox-pieces3d-container');
    const canvasPieces3d = document.getElementById('canvas-pieces3d');
    if (!containerPieces3d || !canvasPieces3d) return;

    lightboxImage.style.display = 'none';
    containerPieces3d.style.display = 'block';
    containerPieces3d.appendChild(canvasPieces3d);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.Pieces3D) {
      window.Pieces3D.setMode(true);
      window.Pieces3D.resize();
    }
  }

  function openAcrylic3DLightbox() {
    hideAll3DContainers();
    const containerAcrylic3d = document.getElementById('lightbox-acrylic3d-container');
    const canvasAcrylic3d = document.getElementById('canvas-acrylic3d');
    if (!containerAcrylic3d || !canvasAcrylic3d) return;

    lightboxImage.style.display = 'none';
    containerAcrylic3d.style.display = 'block';
    containerAcrylic3d.appendChild(canvasAcrylic3d);

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.Acrylic3D) {
      window.Acrylic3D.setMode(true);
      window.Acrylic3D.resize();
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';

    const container3d = document.getElementById('lightbox-3d-container');
    const canvas3d = document.getElementById('canvas-3d');
    const slide3d = document.getElementById('board-3d-slide');
    if (container3d && canvas3d && slide3d && container3d.style.display === 'block') {
      slide3d.appendChild(canvas3d);
      container3d.style.display = 'none';
      if (window.Board3D) {
        window.Board3D.setMode(false);
        window.Board3D.resize();
      }
    }

    const containerBox3d = document.getElementById('lightbox-box3d-container');
    const canvasBox3d = document.getElementById('canvas-box3d');
    const slideBox3d = document.getElementById('box-3d-slide');
    if (containerBox3d && canvasBox3d && slideBox3d && containerBox3d.style.display === 'block') {
      slideBox3d.appendChild(canvasBox3d);
      containerBox3d.style.display = 'none';
      if (window.Box3D) {
        window.Box3D.setMode(false);
        window.Box3D.resize();
      }
    }

    const containerCards3d = document.getElementById('lightbox-cards3d-container');
    const canvasCards3d = document.getElementById('canvas-cards3d');
    const slideCards3d = document.getElementById('cards-3d-slide');
    if (containerCards3d && canvasCards3d && slideCards3d && containerCards3d.style.display === 'block') {
      slideCards3d.appendChild(canvasCards3d);
      containerCards3d.style.display = 'none';
      if (window.Cards3D) {
        window.Cards3D.setMode(false);
        window.Cards3D.resize();
      }
    }

    const containerRuleta3d = document.getElementById('lightbox-ruleta3d-container');
    const canvasRuleta3d = document.getElementById('canvas-ruleta3d');
    const slideRuleta3d = document.getElementById('ruleta-3d-slide');
    if (containerRuleta3d && canvasRuleta3d && slideRuleta3d && containerRuleta3d.style.display === 'block') {
      slideRuleta3d.appendChild(canvasRuleta3d);
      containerRuleta3d.style.display = 'none';
      if (window.Ruleta3D) {
        window.Ruleta3D.setMode(false);
        window.Ruleta3D.resize();
      }
    }

    const containerCuadriculas3d = document.getElementById('lightbox-cuadriculas3d-container');
    const canvasCuadriculas3d = document.getElementById('canvas-cuadriculas3d');
    const slideCuadriculas3d = document.getElementById('cuadriculas-3d-slide');
    if (containerCuadriculas3d && canvasCuadriculas3d && slideCuadriculas3d && containerCuadriculas3d.style.display === 'block') {
      slideCuadriculas3d.appendChild(canvasCuadriculas3d);
      containerCuadriculas3d.style.display = 'none';
      if (window.Cuadriculas3D) {
        window.Cuadriculas3D.setMode(false);
        window.Cuadriculas3D.resize();
      }
    }

    const containerPieces3d = document.getElementById('lightbox-pieces3d-container');
    const canvasPieces3d = document.getElementById('canvas-pieces3d');
    const slidePieces3d = document.getElementById('pieces-3d-slide');
    if (containerPieces3d && canvasPieces3d && slidePieces3d && containerPieces3d.style.display === 'block') {
      slidePieces3d.appendChild(canvasPieces3d);
      containerPieces3d.style.display = 'none';
      if (window.Pieces3D) {
        window.Pieces3D.setMode(false);
        window.Pieces3D.resize();
      }
    }

    const containerAcrylic3d = document.getElementById('lightbox-acrylic3d-container');
    const canvasAcrylic3d = document.getElementById('canvas-acrylic3d');
    const slideAcrylic3d = document.getElementById('acrylic-3d-slide');
    if (containerAcrylic3d && canvasAcrylic3d && slideAcrylic3d && containerAcrylic3d.style.display === 'block') {
      slideAcrylic3d.appendChild(canvasAcrylic3d);
      containerAcrylic3d.style.display = 'none';
      if (window.Acrylic3D) {
        window.Acrylic3D.setMode(false);
        window.Acrylic3D.resize();
      }
    }
  }

  track.addEventListener('click', event => {
    const slide = event.target.closest('.gallery-slide');
    if (!slide) return;

    if (slide.id === 'board-3d-slide') {
      open3DLightbox();
      return;
    }

    if (slide.id === 'box-3d-slide') {
      openBox3DLightbox();
      return;
    }

    if (slide.id === 'cards-3d-slide') {
      openCards3DLightbox();
      return;
    }

    if (slide.id === 'ruleta-3d-slide') {
      openRuleta3DLightbox();
      return;
    }

    if (slide.id === 'cuadriculas-3d-slide') {
      openCuadriculas3DLightbox();
      return;
    }

    if (slide.id === 'pieces-3d-slide') {
      openPieces3DLightbox();
      return;
    }

    if (slide.id === 'acrylic-3d-slide') {
      openAcrylic3DLightbox();
      return;
    }

    if (!slide.dataset.full) return;
    const img = slide.querySelector('img');
    openLightbox(slide.dataset.full, img?.alt || 'Vista ampliada');
  });

  track.addEventListener('keydown', event => {
    const slide = event.target.closest('.gallery-slide');
    if (!slide) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (slide.id === 'board-3d-slide') {
        open3DLightbox();
      } else if (slide.id === 'box-3d-slide') {
        openBox3DLightbox();
      } else if (slide.id === 'cards-3d-slide') {
        openCards3DLightbox();
      } else if (slide.id === 'ruleta-3d-slide') {
        openRuleta3DLightbox();
      } else if (slide.id === 'cuadriculas-3d-slide') {
        openCuadriculas3DLightbox();
      } else if (slide.id === 'pieces-3d-slide') {
        openPieces3DLightbox();
      } else if (slide.id === 'acrylic-3d-slide') {
        openAcrylic3DLightbox();
      } else if (slide.dataset.full) {
        const img = slide.querySelector('img');
        openLightbox(slide.dataset.full, img?.alt || 'Vista ampliada');
      }
    }
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}


function setupMobileCards() {
  document.addEventListener('click', event => {
    const card = event.target.closest('.mobile-card');
    if (card && window.innerWidth <= 768) {
      card.classList.toggle('is-revealed');
    }
  });
}

function init() {
  renderGallery();
  layout();

  if (window.Board3D && window.Board3D.init) {
    window.Board3D.init();
  }

  if (window.Box3D && window.Box3D.init) {
    window.Box3D.init();
  }

  if (window.Cards3D && window.Cards3D.init) {
    window.Cards3D.init();
  }

  if (window.Ruleta3D && window.Ruleta3D.init) {
    window.Ruleta3D.init();
  }

  if (window.Cuadriculas3D && window.Cuadriculas3D.init) {
    window.Cuadriculas3D.init();
  }

  if (window.Pieces3D && window.Pieces3D.init) {
    window.Pieces3D.init();
  }

  if (window.Acrylic3D && window.Acrylic3D.init) {
    window.Acrylic3D.init();
  }

  setupCursor();
  setupGalleryControls();
  setupLightbox();
  setupSectionObserver();
  setupScrollAnimation();
  setupMobileCards();
  window.addEventListener('resize', layout);
  updateScrollProgress(false);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      init();
    });
  } else {
    setTimeout(init, 500);
  }
});