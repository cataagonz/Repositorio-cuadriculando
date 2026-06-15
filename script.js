const CONFIG = {
  pad: 32,
  cols: 4,
  rows: 3,
  scrollRange: 450
};

const GALLERY_IMAGES = [
  'Assets/Imagen caja 1.png',
  'Assets/Imagen tablero 1.png',
  'Assets/Imagen cartas 1.png',
  'Assets/Imagen paleta 1.png',
  'Assets/Cuadriculas 1.png',
  'Assets/ruleta 1..png',
  'Assets/piezas especiales 1.png',
  'Assets/foto8.jpg',
  'Assets/foto9.jpg',
  'Assets/foto10.jpg',
  'Assets/foto11.jpg',
  'Assets/foto12.jpg'
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
  { id: 'd2', col: 0, row: 0, ox: 0.60, oy: 0.72 },
  { id: 'd3', col: 2, row: 0, ox: 0.45, oy: 0.72 },
  { id: 'd4', col: 1, row: 1, ox: 0.25, oy: 0.52 },
  { id: 'd5', col: 0, row: 2, ox: 0.15, oy: 0.30 },
  { id: 'd6', col: 2, row: 2, ox: 0.52, oy: 0.52 },
  { id: 'd7', col: 3, row: 2, ox: 0.62, oy: 0.60 },
  { id: 'd8', col: 1, row: 2, ox: 0.40, oy: 0.78 }
];

const FOOTER_DOTS = [
  { id: 'f1', col: 0, row: 0, ox: 0.30, oy: 0.28 },
  { id: 'f2', col: 1, row: 0, ox: 0.42, oy: 0.42 },
  { id: 'f3', col: 2, row: 0, ox: 0.35, oy: 0.26 },
  { id: 'f4', col: 3, row: 0, ox: 0.55, oy: 0.28 },
  { id: 'f5', col: 0, row: 2, ox: 0.45, oy: 0.55 },
  { id: 'f6', col: 1, row: 2, ox: 0.55, oy: 0.52 },
  { id: 'f7', col: 2, row: 2, ox: 0.38, oy: 0.68 },
  { id: 'f8', col: 3, row: 2, ox: 0.62, oy: 0.54 }
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
  const size = Math.floor(metrics.cell * 0.13);

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

  title.style.fontSize = `${Math.floor(metrics.cell * 0.80)}px`;
  title.style.left = `${metrics.offX}px`;
  title.style.width = `${metrics.gridW}px`;
  title.style.top = `${Math.floor(metrics.cy(1) + metrics.cell * 0.2)}px`;

  const sqSize = Math.floor(metrics.cell * 0.17);
  const titleTop = parseInt(title.style.top, 10) || metrics.cy(1);
  const titleHeight = title.offsetHeight || Math.floor(metrics.cell * 0.55);

  const squares = [
    { id: 'sq1', left: metrics.offX - 153, top: titleTop + titleHeight * 0.11 },
    { id: 'sq2', left: metrics.offX + metrics.gridW * 0.315, top: titleTop + titleHeight * 0.60 },
    { id: 'sq3', left: metrics.offX + metrics.gridW * 0.528, top: titleTop + titleHeight * 0.12 },
    { id: 'sq4', left: metrics.offX + metrics.gridW * 0.93, top: titleTop + titleHeight * 0.12 }
  ];

  squares.forEach(({ id, left, top }) => {
    setBox(document.getElementById(id), Math.floor(left), Math.floor(top), sqSize, sqSize);
  });
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
  const title = document.getElementById('s6-title');
  const arrow = document.getElementById('s6-arrow');

  if (title) {
    title.style.fontSize = `${Math.floor(metrics.cell * 0.28)}px`;
    title.style.left = `${metrics.offX}px`;
    title.style.top = `${metrics.cy(1)}px`;
    title.style.width = `${metrics.gridW}px`;
    title.style.height = `${metrics.cell}px`;
  }

  if (arrow) {
    arrow.style.left = `${metrics.offX}px`;
    arrow.style.top = `${Math.floor(metrics.cy(1) + metrics.cell + 12)}px`;
    arrow.style.width = `${metrics.gridW}px`;
  }
}

function layoutSeparators(metrics) {
  const separators = document.querySelectorAll('.sep-row');
  const dotSize = Math.floor(metrics.cell * 0.13);

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

function updateBlocks(sectionId, progress) {
  const cell = getCellSize();
  const directions = BLOCK_DIRECTIONS[sectionId];

  document.querySelectorAll(`#${sectionId} .cuad-block`).forEach(el => {
    const dir = directions[el.dataset.color] || { x: 0, y: 0 };
    const tx = cell * progress * dir.x;
    const ty = cell * progress * dir.y;
    el.style.transform = `translate(${tx}px, ${ty}px)`;
  });
}

function updateAllBlockAnimations() {
  Object.entries(sectionState).forEach(([id, state]) => {
    updateBlocks(id, state.progress);
  });
}

function layout() {
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
  updateAllBlockAnimations();
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
      }
    });
  }, { threshold: 0.6 });

  ['s3', 's4', 's5'].forEach(id => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

function setupScrollAnimation() {
  window.addEventListener('wheel', event => {
    const activeEntry = Object.entries(sectionState).find(([, state]) => state.active);
    if (!activeEntry) return;

    const [sectionId, state] = activeEntry;
    const nextDelta = Math.max(0, Math.min(CONFIG.scrollRange, state.delta + event.deltaY));
    const nextProgress = nextDelta / CONFIG.scrollRange;

    const blockedDown = state.progress >= 1 && event.deltaY > 0;
    const blockedUp = state.progress <= 0 && event.deltaY < 0;

    if (blockedDown || blockedUp) return;

    event.preventDefault();
    state.delta = nextDelta;
    state.progress = nextProgress;
    updateBlocks(sectionId, state.progress);
  }, { passive: false });
}

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const track = document.getElementById('gallery-track');

  if (!lightbox || !lightboxImage || !track) return;

  function openLightbox(src, alt = 'Vista ampliada') {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  }

  track.addEventListener('click', event => {
    const slide = event.target.closest('.gallery-slide');
    if (!slide || !slide.dataset.full) return;

    const img = slide.querySelector('img');
    openLightbox(slide.dataset.full, img?.alt || 'Vista ampliada');
  });

  track.addEventListener('keydown', event => {
    const slide = event.target.closest('.gallery-slide');
    if (!slide || !slide.dataset.full) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const img = slide.querySelector('img');
      openLightbox(slide.dataset.full, img?.alt || 'Vista ampliada');
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

function bindHeroSquareHover() {
  const pairs = [
    { letterId: 'lc', squareId: 'sq1' },
    { letterId: 'lr', squareId: 'sq2' },
    { letterId: 'lcu', squareId: 'sq3' },
    { letterId: 'ln', squareId: 'sq4' }
  ];

  pairs.forEach(({ letterId, squareId }) => {
    const letter = document.getElementById(letterId);
    const square = document.getElementById(squareId);

    if (!letter || !square) return;

    letter.addEventListener('mouseenter', () => {
      square.style.opacity = '0';
    });

    letter.addEventListener('mouseleave', () => {
      square.style.opacity = '1';
    });
  });
}

function init() {
  renderGallery();
  layout();
  setupCursor();
  setupGalleryControls();
  setupLightbox();
  setupSectionObserver();
  setupScrollAnimation();
  bindHeroSquareHover();
  window.addEventListener('resize', layout);
}


document.addEventListener('DOMContentLoaded', init);

