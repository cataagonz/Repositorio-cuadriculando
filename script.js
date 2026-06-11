const PAD  = 32;
const COLS = 4;
const ROWS = 3;

const HERO_DOTS = [
  { id:'h1', col:0, row:0, ox:0.30, oy:0.28 },
  { id:'h2', col:1, row:0, ox:0.42, oy:0.42 },
  { id:'h3', col:2, row:0, ox:0.35, oy:0.26 },
  { id:'h4', col:3, row:0, ox:0.55, oy:0.28 },
  { id:'h5', col:0, row:2, ox:0.45, oy:0.55 },
  { id:'h6', col:1, row:2, ox:0.55, oy:0.52 },
  { id:'h7', col:2, row:2, ox:0.38, oy:0.68 },
  { id:'h8', col:3, row:2, ox:0.62, oy:0.54 },
];

const DESC_DOTS = [
  { id:'d1', col:3, row:0, ox:0.55, oy:0.35 },
  { id:'d2', col:0, row:0, ox:0.60, oy:0.72 },
  { id:'d3', col:2, row:0, ox:0.45, oy:0.72 },
  { id:'d4', col:1, row:1, ox:0.25, oy:0.52 },
  { id:'d5', col:0, row:2, ox:0.15, oy:0.30 },
  { id:'d6', col:2, row:2, ox:0.52, oy:0.52 },
  { id:'d7', col:3, row:2, ox:0.62, oy:0.60 },
  { id:'d8', col:1, row:2, ox:0.40, oy:0.78 },
];

const DESC_TEXTS = [
  { id: 'desc1', col: 0, span: 2.5, row: 0 },
  { id: 'desc2', col: 1, span: 2.5, row: 1 },
  { id: 'desc3', col: 0, span: 2.5, row: 2 },
];

const F_DOTS = [
  { id:'f1', col:0, row:0, ox:0.30, oy:0.28 },
  { id:'f2', col:1, row:0, ox:0.42, oy:0.42 },
  { id:'f3', col:2, row:0, ox:0.35, oy:0.26 },
  { id:'f4', col:3, row:0, ox:0.55, oy:0.28 },
  { id:'f5', col:0, row:2, ox:0.45, oy:0.55 },
  { id:'f6', col:1, row:2, ox:0.55, oy:0.52 },
  { id:'f7', col:2, row:2, ox:0.38, oy:0.68 },
  { id:'f8', col:3, row:2, ox:0.62, oy:0.54 },
];


function getCell() {
  return Math.floor(Math.min((window.innerWidth - PAD*2) / COLS, (window.innerHeight - PAD*2) / ROWS));
}

function layout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cell = getCell();

  const gridW = cell * COLS;
  const gridH = cell * ROWS;

  const offX = Math.floor((vw - gridW) / 2);
  const offY = Math.floor((vh - gridH) / 2);

  const lc = 'rgba(255,255,255,0.30)', lw = 1.5;
  const svgW = document.documentElement.scrollWidth;
const leftExtra  = offX; // cuánto sobra a la izquierda
const rightExtra = vw - (offX + gridW); // cuánto sobra a la derecha

let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${svgW}' height='${gridH}'>`;
svg += `<line x1="0" y1="0.75" x2="${svgW}" y2="0.75" stroke="${lc}" stroke-width="${lw}"/>`;
svg += `<line x1="0" y1="${gridH-0.75}" x2="${svgW}" y2="${gridH-0.75}" stroke="${lc}" stroke-width="${lw}"/>`;
svg += `<line x1="0.75" y1="0" x2="0.75" y2="${gridH}" stroke="${lc}" stroke-width="${lw}"/>`;
svg += `<line x1="${svgW-0.75}" y1="0" x2="${svgW-0.75}" y2="${gridH}" stroke="${lc}" stroke-width="${lw}"/>`;
for (let c=1; c<COLS; c++) svg += `<line x1="${offX + c*cell}" y1="0" x2="${offX + c*cell}" y2="${gridH}" stroke="${lc}" stroke-width="${lw}"/>`;
for (let r=1; r<ROWS; r++) svg += `<line x1="0" y1="${r*cell}" x2="${svgW}" y2="${r*cell}" stroke="${lc}" stroke-width="${lw}"/>`;
svg += `</svg>`;

  const svgUrl = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// REEMPLAZA POR esto:
const gridOverlay = document.getElementById('grid-overlay');
gridOverlay.style.backgroundImage    = svgUrl;
gridOverlay.style.backgroundRepeat   = 'repeat-y';
gridOverlay.style.backgroundPosition = `0px ${offY}px`;
gridOverlay.style.backgroundSize     = `${svgW}px ${gridH}px`;

  function cx(col) { return offX + col * cell; }
  function cy(row) { return offY + row * cell; }

  const dotSz = Math.floor(cell * 0.13);

  // ── S1: Hero ──
  const ht = document.getElementById('hero-title');
  if (ht) {
    ht.style.fontSize = `${Math.floor(cell * 0.55)}px`;
    ht.style.left     = offX + 'px';
    ht.style.width    = gridW + 'px';
    ht.style.top      = Math.floor(cy(1) + (cell - ht.offsetHeight) / 2) + 'px';
  }

  // ── S1: Cuadrados de color sobre el título ──
const sqSz = Math.floor(cell * 0.10);
const titleEl = document.getElementById('hero-title');
const titleTop = parseInt(titleEl.style.top) || Math.floor(cy(1) + (cell - titleEl.offsetHeight) / 2);
const titleH = titleEl.offsetHeight;

// Verde → esquina superior izquierda de la C inicial
const sq1 = document.getElementById('sq1');
if (sq1) {
  sq1.style.width  = sqSz + 'px';
  sq1.style.height = sqSz + 'px';
  sq1.style.left   = Math.floor(offX + gridW * 0.051) + 'px';
  sq1.style.top    = Math.floor(titleTop + titleH * 0.11) + 'px';
}

// Amarillo → parte inferior de la I
const sq2 = document.getElementById('sq2');
if (sq2) {
  sq2.style.width  = sqSz + 'px';
  sq2.style.height = sqSz + 'px';
  sq2.style.left   = Math.floor(offX + gridW * 0.330) + 'px';
  sq2.style.top    = Math.floor(titleTop + titleH * 0.63) + 'px';
}

// Azul → parte superior de la C central
const sq3 = document.getElementById('sq3');
if (sq3) {
  sq3.style.width  = sqSz + 'px';
  sq3.style.height = sqSz + 'px';
  sq3.style.left   = Math.floor(offX + gridW * 0.520) + 'px';
  sq3.style.top    = Math.floor(titleTop + titleH * 0.11) + 'px';
}

// Rojo → parte superior de la N
const sq4 = document.getElementById('sq4');
if (sq4) {
  sq4.style.width  = sqSz + 'px';
  sq4.style.height = sqSz + 'px';
  sq4.style.left   = Math.floor(offX + gridW * 0.800) + 'px';
  sq4.style.top    = Math.floor(titleTop + titleH * 0.11) + 'px';
}


  HERO_DOTS.forEach(({id, col, row, ox, oy}) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.left   = Math.floor(cx(col) + ox * cell) + 'px';
    el.style.top    = Math.floor(cy(row) + oy * cell) + 'px';
    el.style.width  = dotSz + 'px';
    el.style.height = dotSz + 'px';
  });

  // ── S2: Dots ──
  DESC_DOTS.forEach(({id, col, row, ox, oy}) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.left   = Math.floor(cx(col) + ox * cell) + 'px';
    el.style.top    = Math.floor(cy(row) + oy * cell) + 'px';
    el.style.width  = dotSz + 'px';
    el.style.height = dotSz + 'px';
  });

  // ── S2: Textos ──
  DESC_TEXTS.forEach(({id, col, span, row}) => {
    const el = document.getElementById(id);
    if (!el) return;
    const paddingX = 16;
    el.style.left  = (cx(col) + paddingX) + 'px';
    el.style.width = (cell * span - (paddingX * 2)) + 'px';
    requestAnimationFrame(() => {
      el.style.top = Math.floor(cy(row) + (cell - el.offsetHeight) / 2) + 'px';
    });
  });

  // ── Títulos de Secciones S3/S4/S5 ──
  const titles = [
    { id: 'cuad-title',     col: 0, row: 0, span: 2.5 },
    { id: 'descifra-title', col: 2, row: 0, span: 2   },
    { id: 'ataca-title',    col: 0, row: 0, span: 1.5 },
  ];

  titles.forEach(t => {
    const el = document.getElementById(t.id);
    if (!el) return;
    el.style.fontSize = `${Math.floor(cell * 0.40)}px`;
    el.style.left     = cx(t.col) + 'px';
    el.style.width    = (cell * t.span) + 'px';
    el.style.top      = cy(t.row) + 'px';
    el.style.height   = cell + 'px';
  });

  // ── Bloques y Textos S3/S4/S5 ──
  document.querySelectorAll('.cuad-block, .cuad-text').forEach(el => {
    const col = +el.dataset.col, row = +el.dataset.row;
    el.style.left   = cx(col) + 'px';
    el.style.top    = cy(row) + 'px';
    el.style.width  = cell + 'px';
    el.style.height = cell + 'px';
  });

  // ── S6: Título centrado en fila del medio ──
  const s6Title = document.getElementById('s6-title');
  if (s6Title) {
    s6Title.style.fontSize  = `${Math.floor(cell * 0.28)}px`;
    s6Title.style.left      = offX + 'px';
    s6Title.style.width     = gridW + 'px';
    s6Title.style.top       = cy(1) + 'px';
    s6Title.style.height    = cell + 'px';
    s6Title.style.transform = 'none';
  }

  // ── S6: Flecha debajo del título ──
  const s6Arrow = document.getElementById('s6-arrow');
  if (s6Arrow) {
    s6Arrow.style.left  = offX + 'px';
    s6Arrow.style.width = gridW + 'px';
    s6Arrow.style.top   = Math.floor(cy(1) + cell + 12) + 'px';
  }

  // ── S6: Dots ──
  F_DOTS.forEach(({id, col, row, ox, oy}) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.left   = Math.floor(cx(col) + ox * cell) + 'px';
    el.style.top    = Math.floor(cy(row) + oy * cell) + 'px';
    el.style.width  = dotSz + 'px';
    el.style.height = dotSz + 'px';
  });

// ── Separadores ──
document.querySelectorAll('.sep-row').forEach(sep => {
  sep.style.height = cell + 'px';
});

  updateBlocks('s3', scrollProgressS3);
  updateBlocks('s4', scrollProgressS4);
  updateBlocks('s5', scrollProgressS5);
}

const DIRS = {
  s3: { azul: {x:0,y:-1}, verde: {x:0,y:-1}, rojo: {x:1,y:0}, amarillo: {x:1,y:0} },
  s4: { azul: {x:1,y:0}, amarillo: {x:1,y:0}, rojo: {x:-1,y:0}, verde: {x:-1,y:0} },
  s5: { amarillo: {x:1,y:0}, rojo: {x:-1,y:0}, verde: {x:0,y:1}, azul: {x:1,y:0} },
};

function updateBlocks(sectionId, p) {
  const cell = getCell();
  document.querySelectorAll(`#${sectionId} .cuad-block`).forEach(el => {
    const d = DIRS[sectionId][el.dataset.color] || {x:0,y:0};
    el.style.transform = `translate(${cell * p * d.x}px, ${cell * p * d.y}px)`;
  });
}

let scrollProgressS3 = 0, accDeltaS3 = 0;
let scrollProgressS4 = 0, accDeltaS4 = 0;
let scrollProgressS5 = 0, accDeltaS5 = 0;
let isInS3 = false, isInS4 = false, isInS5 = false;

const SCROLL_RANGE = 450;

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.target.id === 's3') isInS3 = e.isIntersecting;
    if (e.target.id === 's4') isInS4 = e.isIntersecting;
    if (e.target.id === 's5') isInS5 = e.isIntersecting;
  });
}, { threshold: 0.6 });

obs.observe(document.getElementById('s3'));
obs.observe(document.getElementById('s4'));
obs.observe(document.getElementById('s5'));

window.addEventListener('wheel', (e) => {
  if (isInS3) {
    if (scrollProgressS3 >= 1 && e.deltaY > 0) return;
    if (scrollProgressS3 <= 0 && e.deltaY < 0) return;
    e.preventDefault();
    accDeltaS3 = Math.max(0, Math.min(SCROLL_RANGE, accDeltaS3 + e.deltaY));
    scrollProgressS3 = accDeltaS3 / SCROLL_RANGE;
    updateBlocks('s3', scrollProgressS3);
  } else if (isInS4) {
    if (scrollProgressS4 >= 1 && e.deltaY > 0) return;
    if (scrollProgressS4 <= 0 && e.deltaY < 0) return;
    e.preventDefault();
    accDeltaS4 = Math.max(0, Math.min(SCROLL_RANGE, accDeltaS4 + e.deltaY));
    scrollProgressS4 = accDeltaS4 / SCROLL_RANGE;
    updateBlocks('s4', scrollProgressS4);
  } else if (isInS5) {
    if (scrollProgressS5 >= 1 && e.deltaY > 0) return;
    if (scrollProgressS5 <= 0 && e.deltaY < 0) return;
    e.preventDefault();
    accDeltaS5 = Math.max(0, Math.min(SCROLL_RANGE, accDeltaS5 + e.deltaY));
    scrollProgressS5 = accDeltaS5 / SCROLL_RANGE;
    updateBlocks('s5', scrollProgressS5);
  }
}, { passive: false });

layout();
window.addEventListener('resize', layout);

