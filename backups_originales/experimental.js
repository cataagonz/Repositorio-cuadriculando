const boardEl = document.getElementById("board");
const instructionEl = document.getElementById("instruction");
const groupEl = document.getElementById("travel-group");
const blueOverlayEl = document.getElementById("blue-overlay");
const nextScreenEl = document.getElementById("next-screen");

const COLS = 4;
const ROWS = 4;
const key = (c, r) => `${c}-${r}`;

/* ========== ESTADOS TABLERO ========== */

// Celdas especiales clickeables en el estado final
const specialCellsKeys = new Set([
  key(0, 1),
  key(1, 1),
  key(2, 1),
  key(3, 1),
  key(1, 2),
  key(2, 2),
]);

/* Estado 1: 3 cuadros */
const state1 = new Set([
  key(1, 1),
  key(2, 1),
  key(1, 2),
]);

/* Estado 2: suma 3 nuevos */
const state2On = new Set([
  ...state1,
  key(2, 2),
  key(0, 1),
  key(3, 1),
]);

/* Estado 3: suma 6 nuevos */
const state3On = new Set([
  ...state2On,
  key(0, 0),
  key(1, 0),
  key(2, 0),
  key(3, 0),
  key(0, 2),
  key(3, 2),
]);

/* Estado 4: cuadrícula completa */
const state4On = new Set();
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    state4On.add(key(c, r));
  }
}

/* ========== CREAR CELDAS TABLERO ========== */

const cells = [];

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const cell = document.createElement("div");
    cell.className = "tablero-cell";
    cell.dataset.key = key(c, r);

    const fill = document.createElement("div");
    fill.className = "tablero-fill";
    cell.appendChild(fill);

    boardEl.appendChild(cell);
    cells.push(cell);
  }
}

// Marcar las celdas especiales según sus claves
cells.forEach((cell) => {
  const k = cell.dataset.key;
  if (specialCellsKeys.has(k)) {
    cell.classList.add("special");
  }
});

/* ========== PANTALLA AZUL: GRILLA TIPO BUSCAMINAS ========== */

function buildBlueGrid() {
  blueOverlayEl.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "blue-grid";

  const size = 6; // 6x6 → 36 celdas
  const total = size * size;

  const colorKeys = ["verde", "amarillo", "azul", "rojo", "verde2", "rojo2"];
  const colorMap = {
    verde: "#74d643",
    amarillo: "#f0cf3c",
    azul: "#3c6ed4",
    rojo: "#d23434",
    verde2: "#74d643",
    rojo2: "#d23434",
  };

  // 6 posiciones únicas
  const indices = [];
  while (indices.length < colorKeys.length) {
    const idx = Math.floor(Math.random() * total);
    if (!indices.includes(idx)) indices.push(idx);
  }

  const coloredCells = {};
  indices.forEach((idx, i) => {
    coloredCells[idx] = colorMap[colorKeys[i]];
  });

  let discoveredCount = 0;
  const totalColors = colorKeys.length;
  const foundColors = []; // guardaremos los 6 colores descubiertos

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "blue-cell";

    const bg = document.createElement("div");
    bg.className = "blue-cell-bg";

    if (coloredCells[i]) {
      // celdas con color: cuadrito pequeño
      const color = coloredCells[i];
      bg.style.color = color;          // se usa en CSS como currentColor
      bg.classList.add("small-color");
      cell.dataset.hasColor = "true";
      cell.dataset.colorValue = color;
    } else {
      // celdas sin color: negro a pantalla completa
      bg.style.backgroundColor = "#000";
      cell.dataset.hasColor = "false";
    }

    const overlay = document.createElement("div");
    overlay.className = "blue-cell-overlay";

    cell.appendChild(bg);
    cell.appendChild(overlay);
    grid.appendChild(cell);

    cell.addEventListener("click", () => {
      if (cell.dataset.hasColor === "true" && !cell.classList.contains("discovered")) {
        cell.classList.add("discovered");
        discoveredCount += 1;
        foundColors.push(cell.dataset.colorValue);

        if (discoveredCount === totalColors) {
          // encontraste los 6 → construir pantalla final y mostrarla
          buildNextScreenDots(foundColors);
          nextScreenEl.classList.add("is-visible");
        }
      }
    });
  }

  blueOverlayEl.appendChild(grid);
}

function buildNextScreenDots(foundColors) {
  // limpiamos pantalla final
  nextScreenEl.innerHTML = "";

  const container = document.createElement("div");
  container.className = "next-dots";
  nextScreenEl.appendChild(container);

  // paleta base: los 6 encontrados + los 4 colores del juego
  const extraPalette = ["#74d643", "#f0cf3c", "#3c6ed4", "#d23434"];
  const allColors = [...foundColors, ...extraPalette];

  const totalDots = 200; // número total de puntos

  const dots = [];

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("div");
    dot.className = "next-dot";

    const color = allColors[i % allColors.length];
    dot.style.backgroundColor = color;
    dot.dataset.colorValue = color;

    // posición inicial aleatoria (con cierto margen)
    const top = Math.random() * 80 + 10;   // 10–90%
    const left = Math.random() * 80 + 10;
    dot.dataset.baseTop = top;
    dot.dataset.baseLeft = left;
    dot.style.top = `${top}%`;
    dot.style.left = `${left}%`;

    container.appendChild(dot);
    dots.push(dot);
  }

  let activeColor = null;
  let dragQuadrant = null;

  // calcula cuadrante en función de la posición del cursor
  function getQuadrant(clientX, clientY) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const xMid = vw / 2;
    const yMid = vh / 2;

    if (clientX < xMid && clientY < yMid) return "tl"; // top-left
    if (clientX >= xMid && clientY < yMid) return "tr"; // top-right
    if (clientX < xMid && clientY >= yMid) return "bl"; // bottom-left
    return "br"; // bottom-right
  }

  // centro de cada cuadrante (en %)
  const quadrantCenters = {
    tl: { top: 25, left: 25 },
    tr: { top: 25, left: 75 },
    bl: { top: 75, left: 25 },
    br: { top: 75, left: 75 },
  };

  function onPointerDown(e) {
    const dot = e.target.closest(".next-dot");
    if (!dot) return;

    activeColor = dot.dataset.colorValue;
    dragQuadrant = getQuadrant(e.clientX, e.clientY);

    const center = quadrantCenters[dragQuadrant];

    // acercamos los puntos de ese color hacia el centro del cuadrante y vibran
    dots.forEach((d) => {
      if (d.dataset.colorValue !== activeColor) return;

      const baseTop = parseFloat(d.dataset.baseTop);
      const baseLeft = parseFloat(d.dataset.baseLeft);

      const newTop = center.top + (baseTop - center.top) * 0.3;
      const newLeft = center.left + (baseLeft - center.left) * 0.3;

      d.style.top = `${newTop}%`;
      d.style.left = `${newLeft}%`;
      d.classList.add("near");
    });
  }

  function onPointerMove(e) {
    if (!activeColor) return;

    // mientras arrastras, actualizamos el cuadrante destino
    dragQuadrant = getQuadrant(e.clientX, e.clientY);
    const center = quadrantCenters[dragQuadrant];

    dots.forEach((d) => {
      if (d.dataset.colorValue !== activeColor) return;

      const baseTop = parseFloat(d.dataset.baseTop);
      const baseLeft = parseFloat(d.dataset.baseLeft);

      const newTop = center.top + (baseTop - center.top) * 0.3;
      const newLeft = center.left + (baseLeft - center.left) * 0.3;

      d.style.top = `${newTop}%`;
      d.style.left = `${newLeft}%`;
    });
  }

  function onPointerUp() {
    if (!activeColor || !dragQuadrant) {
      activeColor = null;
      dragQuadrant = null;
      return;
    }

    const center = quadrantCenters[dragQuadrant];

    // al soltar, fijamos nuevas posiciones base dentro del cuadrante
    dots.forEach((d) => {
      if (d.dataset.colorValue !== activeColor) return;

      d.classList.remove("near");

      // pequeña dispersión alrededor del centro para que no se solapen
      const offsetTop = (Math.random() - 0.5) * 15;  // ±7.5%
      const offsetLeft = (Math.random() - 0.5) * 15;

      const newTop = center.top + offsetTop;
      const newLeft = center.left + offsetLeft;

      d.dataset.baseTop = newTop;
      d.dataset.baseLeft = newLeft;
      d.style.top = `${newTop}%`;
      d.style.left = `${newLeft}%`;
    });

    activeColor = null;
    dragQuadrant = null;
  }

  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointerleave", onPointerUp);
}

/* ========== CLICK EN CELDAS ESPECIALES (TABLERO) ========== */

function checkAllSpecialClicked() {
  const specialCells = cells.filter((cell) =>
    cell.classList.contains("special")
  );

  const allClicked = specialCells.every((cell) =>
    cell.classList.contains("is-active")
  );

  if (allClicked) {
    buildBlueGrid();
    blueOverlayEl.classList.add("is-visible");
  }
}

// Click en celdas especiales: solo en estado 4
cells.forEach((cell) => {
  if (!cell.classList.contains("special")) return;

  cell.addEventListener("click", () => {
    if (currentState !== 4) return;

    cell.classList.add("is-active");
    checkAllSpecialClicked();
  });
});

/* ========== APLICAR ESTADO (sin animación de grupo) ========== */

function applyStateSet(targetSet) {
  cells.forEach((cell) => {
    const k = cell.dataset.key;
    cell.classList.toggle("on", targetSet.has(k));
  });
}

/* ========== UTILIDADES DE TRANSICIÓN ========== */

function diffNewCells(prevSet, nextSet) {
  const result = [];
  nextSet.forEach((k) => {
    if (!prevSet.has(k)) result.push(k);
  });
  return result;
}

function animateTransition(prevSet, nextSet, onDone) {
  const newCells = diffNewCells(prevSet, nextSet);

  if (!newCells.length) {
    applyStateSet(nextSet);
    if (onDone) onDone();
    return;
  }

  groupEl.classList.remove("is-active");
  groupEl.style.transition = "none";
  groupEl.style.opacity = "0";
  groupEl.style.transform =
    "translate(-50%, -50%) translateX(-200%) rotate(-270deg)";

  requestAnimationFrame(() => {
    groupEl.style.transition = "transform 0.6s ease, opacity 0.6s ease";

    requestAnimationFrame(() => {
      groupEl.classList.add("is-active");
      groupEl.style.opacity = "1";
      groupEl.style.transform =
        "translate(-50%, -50%) translateX(0) rotate(0deg)";

      setTimeout(() => {
        groupEl.classList.remove("is-active");
        groupEl.style.opacity = "0";
        applyStateSet(nextSet);
        if (onDone) onDone();
      }, 700);
    });
  });
}

/* ========== INTERACCIÓN DE ARRASTRE ========== */

let currentState = 1;
applyStateSet(state1);

const scene = document.getElementById("s-experimental");
let dragging = false;
let startX = 0;
let lockTransition = false;

function getX(e) {
  if (e.touches && e.touches.length) return e.touches[0].clientX;
  return e.clientX;
}

function onDown(e) {
  dragging = true;
  startX = getX(e);
}

function onMove(e) {
  if (!dragging || lockTransition) return;
  const delta = getX(e) - startX;
  const abs = Math.abs(delta);

  // 1 -> 2
  if (abs > 80 && currentState === 1) {
    lockTransition = true;
    animateTransition(state1, state2On, () => {
      currentState = 2;
      lockTransition = false;
    });
  }

  // 2 -> 3
  if (abs > 160 && currentState === 2) {
    lockTransition = true;
    animateTransition(state2On, state3On, () => {
      currentState = 3;
      lockTransition = false;
    });
  }

  // 3 -> 4 (cuadrícula completa)
  if (abs > 240 && currentState === 3) {
    lockTransition = true;
    animateTransition(state3On, state4On, () => {
      currentState = 4;
      instructionEl.classList.add("hidden");
      lockTransition = false;
    });
  }
}

function onUp() {
  dragging = false;
}

scene.addEventListener("pointerdown", onDown);
scene.addEventListener("pointermove", onMove);
scene.addEventListener("pointerup", onUp);
scene.addEventListener("pointerleave", onUp);

scene.addEventListener("touchstart", onDown, { passive: true });
scene.addEventListener("touchmove", onMove, { passive: true });
scene.addEventListener("touchend", onUp);
