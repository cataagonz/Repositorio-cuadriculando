const boardEl = document.getElementById("board");
const instructionEl = document.getElementById("instruction");

const COLS = 4;
const ROWS = 4;
const key = (c, r) => `${c}-${r}`;

// Estado 1: bloque central (primera foto)
const state1 = new Set([
  key(0, 1),
  key(1, 1),
  key(2, 1),
  key(3, 1),
  key(0, 2),
  key(1, 2),
  key(2, 2),
  key(3, 2),
]);

// Estado 2: patrón intermedio (segunda foto, ajustable)
const state2On = new Set([
  key(0, 1),
  key(2, 1),
  key(3, 1),
  key(0, 2),
  key(3, 2),
  key(0, 3),
  key(2, 3),
  key(3, 3),
]);

// Estado 3: patrón final (tercera foto, ajustable)
const state3On = new Set([
  key(0, 1),
  key(2, 1),
  key(3, 1),
  key(1, 2),
  key(3, 2),
  key(0, 3),
  key(2, 3),
]);

const cells = [];

// crear 4x4
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

function applyState(stateIndex) {
  cells.forEach((cell) => {
    cell.classList.remove("on", "cut");
    const k = cell.dataset.key;

    if (stateIndex === 1 && state1.has(k)) cell.classList.add("on");
    if (stateIndex === 2 && state2On.has(k)) cell.classList.add("on");
    if (stateIndex === 3 && state3On.has(k)) cell.classList.add("on");
  });
}

// arrancamos en estado 1
let currentState = 1;
applyState(1);

// interacción de arrastre
const scene = document.getElementById("s-experimental");
let dragging = false;
let startX = 0;

function getX(e) {
  if (e.touches && e.touches.length) return e.touches[0].clientX;
  return e.clientX;
}

function onDown(e) {
  dragging = true;
  startX = getX(e);
}

function onMove(e) {
  if (!dragging) return;
  const delta = getX(e) - startX;
  const abs = Math.abs(delta);

  // primer umbral → estado 2
  if (abs > 80 && currentState === 1) {
    currentState = 2;
    applyState(2);
  }

  // segundo umbral → estado 3
  if (abs > 180 && currentState === 2) {
    currentState = 3;
    applyState(3);
    instructionEl.classList.add("hidden");
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