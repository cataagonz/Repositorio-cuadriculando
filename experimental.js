// ==========================================
// CUADRICULANDO: EXPERIMENTAL EXPERIENCE (DO SCRATCH)
// ==========================================

const D_COORDS = [
  // Top/bottom detached segments and middle horizontal cuts to make it abstract
  // Row 4
  [1,4], [2,4],         [5,4], [6,4],
  // Row 5
  [1,5], [2,5],         [5,5], [6,5], [7,5],
  // Row 6
  [1,6], [2,6],         [5,6], [6,6], [7,6],
  // Row 7 (cut on left)
                        [5,7], [6,7], [7,7],
  // Row 8 (cut on right)
  [1,8], [2,8],
  // Row 9
  [1,9], [2,9],         [5,9], [6,9], [7,9],
  // Row 10
  [1,10], [2,10],       [5,10], [6,10], [7,10],
  // Row 11
  [1,11], [2,11],       [5,11], [6,11]
];

const O_COORDS = [
  // Four corner bracket-like disjoint strokes
  // Row 4
  [10,4],               [13,4],
  // Row 5
  [9,5], [10,5],        [13,5], [14,5],
  // Row 6
  [9,6], [10,6],        [13,6], [14,6],
  // Row 7 (cut on left)
                        [13,7], [14,7],
  // Row 8 (cut on right)
  [9,8], [10,8],
  // Row 9
  [9,9], [10,9],        [13,9], [14,9],
  // Row 10
  [9,10], [10,10],      [13,10], [14,10],
  // Row 11
  [10,11],              [13,11]
];

const CUA_COORDS = [
  // C (disjoint stenciled bars and arcs)
  [1, 4], [2, 4], [3, 4],
  [1, 5], [2, 5],
  [1, 6], [2, 6],
  [1, 8], [2, 8],
  [1, 9], [2, 9],
  [1, 10], [2, 10],
  [1, 11], [2, 11], [3, 11],

  // U (disjoint stenciled vertical walls and bottom)
  [6, 4], [9, 4],
  [6, 5], [9, 5],
  [6, 6], [9, 6],
  [6, 7],
  [9, 8],
  [6, 9], [9, 9],
  [6, 10], [9, 10],
  [6, 11], [9, 11],

  // A (disjoint stenciled walls, horizontal bars and apex)
  [12, 4], [13, 4],
  [11, 5], [14, 5],
  [11, 6],
  [11, 7], [14, 7],
  [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 9],
  [11, 10], [14, 10],
  [11, 11], [14, 11]
];

const CU_COORDS = [
  // C
  [3, 4], [4, 4], [5, 4],
  [3, 5], [4, 5],
  [3, 6], [4, 6],
  [3, 7],
  [3, 8],
  [3, 9], [4, 9],
  [3, 10], [4, 10],
  [3, 11], [4, 11], [5, 11],

  // U
  [10, 4], [13, 4],
  [10, 5], [13, 5],
  [10, 6], [13, 6],
  [10, 7], [13, 7],
  [10, 8], [13, 8],
  [10, 9], [13, 9],
  [10, 10], [13, 10],
  [10, 11], [11, 11], [12, 11], [13, 11]
];

const DRI_COORDS = [
  // D
  [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11],
  [2, 4], [3, 4], [4, 4],
  [2, 11], [3, 11], [4, 11],
  [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 10],

  // R
  [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9], [7, 10], [7, 11],
  [8, 4], [9, 4], [10, 4],
  [8, 7], [9, 7], [10, 7],
  [11, 5], [11, 6],
  [9, 8], [10, 9], [11, 10], [11, 11],

  // I
  [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9], [13, 10], [13, 11],
  [12, 4], [14, 4],
  [12, 11], [14, 11]
];

const LAN_COORDS = [
  // L
  [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11],
  [2, 11], [3, 11], [4, 11],

  // A
  [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [6, 11],
  [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10], [10, 11],
  [7, 4], [8, 4], [9, 4],
  [7, 8], [8, 8], [9, 8],

  // N
  [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9], [12, 10], [12, 11],
  [15, 4], [15, 5], [15, 6], [15, 7], [15, 8], [15, 9], [15, 10], [15, 11],
  [13, 5], [13, 6], [13, 7], [14, 8], [14, 9], [14, 10]
];

const letterSet = new Set();

const DRAG_COLUMNS = {
  1: [0, 1, 2],
  2: [3, 4],
  3: [5, 6, 7, 8],
  4: [9, 10],
  5: [11, 12],
  6: [13, 14, 15]
};

// Stage 2 Hotspots (X, Y coordinate and the drag column index it reveals)
const STAGE2_HOTSPOTS = [
  { x: 2, y: 3, columnSlice: 1, colorName: "verde", colorHex: "#74d643", colorRgb: "116, 214, 67" },
  { x: 5, y: 9, columnSlice: 2, colorName: "amarillo", colorHex: "#f0cf3c", colorRgb: "240, 207, 60" },
  { x: 8, y: 5, columnSlice: 3, colorName: "azul", colorHex: "#3c6ed4", colorRgb: "60, 110, 212" },
  { x: 11, y: 12, columnSlice: 4, colorName: "rojo", colorHex: "#d23434", colorRgb: "210, 52, 52" },
  { x: 13, y: 2, columnSlice: 5, colorName: "verde", colorHex: "#74d643", colorRgb: "116, 214, 67" },
  { x: 7, y: 14, columnSlice: 6, colorName: "azul", colorHex: "#3c6ed4", colorRgb: "60, 110, 212" }
];

// Stage 3 Simon Nodes definitions (4 corners of C and U stencil)
const STAGE3_NODES = [
  { x: 3, y: 4, colorName: "rojo", colorHex: "#d23434", colorRgb: "210, 52, 52" },      // C Top-Left
  { x: 3, y: 11, colorName: "azul", colorHex: "#3c6ed4", colorRgb: "60, 110, 212" },    // C Bottom-Left
  { x: 13, y: 4, colorName: "amarillo", colorHex: "#f0cf3c", colorRgb: "240, 207, 60" }, // U Top-Right
  { x: 13, y: 11, colorName: "verde", colorHex: "#74d643", colorRgb: "116, 214, 67" }   // U Bottom-Right
];

// The 6-step Simon sequence
const STAGE3_SEQUENCE = [0, 2, 1, 3, 0, 3]; // Rojo -> Amarillo -> Azul -> Verde -> Rojo -> Verde

// Sizing
const GRID_SIZE = 16;

// State Variables
let currentStage = 1; // 1 = DO, 2 = CUA, 3 = CU, 4 = DRI, 5 = LAN, 6 = SORT
let currentDrag = 0; // 0 to 6 (Stage 1 swipes)
let currentClicks = 0; // 0 to 6 (Stage 2 hotspot clicks)
let activatedHotspots = new Set(); // Column slices already revealed in Stage 2
let stage3UserClicks = []; // User clicks for the current attempt
let isSequencePlaying = false; // Disable user pointer events while sequence is playing
let sequencePlaybackTimeout = null; // Reference to cancel playback
let scratchedInkedCount = 0; // Number of inked cells revealed in Level 4
let isScratching = false; // State to track free scratching drag in Level 4
let stage5LockedCount = 0; // Number of permanently locked cells in Level 5
let lanFloaters = [];
let currentLanPlaced = 0;

const LAN_MISSING = [
  { x: 3, y: 11 },
  { x: 8, y: 4 },
  { x: 8, y: 8 },
  { x: 13, y: 6 },
  { x: 14, y: 9 },
  { x: 15, y: 11 }
];
let isDragging = false;
let startX = 0;
let startY = 0;
let cellsMap = {}; // key -> DOM element
let inactivityTimer = null;
let phantom = { x: 8, y: 8, vx: 0.08, vy: 0.08 }; // Floating phantom cursor particle
let userPointer = { active: false, x: 8, y: 8, lastActive: 0 }; // Track user pointer coordinates
let victoryCells = []; // Active DOM elements for victory screen wave

// ==========================================
// AUDIO SYNTHESIZER (WEB AUDIO API)
// ==========================================
const AudioSynth = {
  ctx: null,

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  },

  playSwipe() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    const t = this.ctx.currentTime;
    
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(580, t + 0.25);
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.26);
  },

  playHotspot() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const t = this.ctx.currentTime;
    
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.35);
    
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.36);
  },

  playSimonTone(index) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    const frequencies = [261.63, 329.63, 392.00, 523.25];
    const freq = frequencies[index] || 440;
    
    osc.type = 'triangle';
    const t = this.ctx.currentTime;
    
    osc.frequency.setValueAtTime(freq, t);
    
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.45);
  },

  playError() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    const t = this.ctx.currentTime;
    
    osc.frequency.setValueAtTime(120, t);
    
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.35);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.36);
  },

  playScratch() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 3.0;
    
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noiseNode.start(t);
  }
};

// DOM elements
const canvasEl = document.getElementById("interaction-canvas");
const wrapperEl = document.getElementById("game-wrapper");
const dragCounterEl = document.getElementById("drag-counter");
const gestureHintEl = document.getElementById("gesture-hint");
const victoryOverlayEl = document.getElementById("victory-overlay");
const victoryGridEl = document.getElementById("victory-grid");
const btnRestartEl = document.getElementById("btn-restart");
const btnNextEl = document.getElementById("btn-next");

document.addEventListener("DOMContentLoaded", () => {
  setupApp();
  initGame();
});

function setupApp() {
  // Restart Button - resets the whole game back to Level 1
  if (btnRestartEl) {
    btnRestartEl.addEventListener("click", () => {
      victoryOverlayEl.classList.remove("show");
      currentStage = 1;
      initGame();
    });
  }

  // Next Button - moves to the next level
  if (btnNextEl) {
    btnNextEl.addEventListener("click", () => {
      victoryOverlayEl.classList.remove("show");
      currentStage++;
      initGame();
    });
  }

  // Track Inactivity for hinting
  resetInactivityTimer();
  window.addEventListener("pointerdown", resetInactivityTimer);
  window.addEventListener("pointermove", resetInactivityTimer);

  // Track user cursor coordinate mappings dynamically across the canvas
  canvasEl.addEventListener("pointermove", (e) => {
    const rect = canvasEl.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      userPointer.x = px / (rect.width / GRID_SIZE);
      userPointer.y = py / (rect.height / GRID_SIZE);
      userPointer.active = true;
      userPointer.lastActive = Date.now();
    }
  });

  canvasEl.addEventListener("pointerleave", () => {
    userPointer.active = false;
  });

  // Pointer event listeners on canvas (which now has active hit-test dimensions in CSS)
  canvasEl.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  if (victoryGridEl) {
    victoryGridEl.addEventListener("pointermove", (e) => {
      const rect = victoryGridEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        userPointer.x = px / (rect.width / GRID_SIZE);
        userPointer.y = py / (rect.height / GRID_SIZE);
        userPointer.active = true;
        userPointer.lastActive = Date.now();
      }
    });

    victoryGridEl.addEventListener("pointerleave", () => {
      userPointer.active = false;
    });
  }

  // Start the continuous color animation loop
  animateColorWave();
}

function resetInactivityTimer() {
  gestureHintEl.classList.remove("visible");
  clearTimeout(inactivityTimer);
  if (currentDrag < 6) {
    inactivityTimer = setTimeout(() => {
      gestureHintEl.classList.add("visible");
    }, 6000);
  }
}

function initGame() {
  // Clear and populate letterSet based on the active stage
  letterSet.clear();
  if (currentStage === 1) {
    D_COORDS.forEach(([x, y]) => letterSet.add(`${x}-${y}`));
    O_COORDS.forEach(([x, y]) => letterSet.add(`${x}-${y}`));
    document.getElementById("hint-text").textContent = "Arrastra para revelar el patrón";
  } else if (currentStage === 2) {
    CUA_COORDS.forEach(([x, y]) => letterSet.add(`${x}-${y}`));
    document.getElementById("hint-text").textContent = "Busca los 6 cuadritos con el cursor y haz clic";
  } else if (currentStage === 3) {
    CU_COORDS.forEach(([x, y]) => letterSet.add(`${x}-${y}`));
    document.getElementById("hint-text").textContent = "Observa el patrón de destellos y repítelo";
  } else if (currentStage === 4) {
    DRI_COORDS.forEach(([x, y]) => letterSet.add(`${x}-${y}`));
    document.getElementById("hint-text").textContent = "Arrastra sobre el tablero para raspar y revelar el patrón";
  } else if (currentStage === 5) {
    LAN_COORDS.forEach(([x, y]) => letterSet.add(`${x}-${y}`));
    document.getElementById("hint-text").textContent = "Arrastra los cuadros flotantes para formar la sílaba LAN";
  } else {
    document.getElementById("hint-text").textContent = "Arrastra y ordena las sílabas para descifrar CUADRICULANDO";
  }

  currentDrag = 0;
  currentClicks = 0;
  activatedHotspots.clear();
  stage3UserClicks = [];
  isSequencePlaying = false;
  if (sequencePlaybackTimeout) {
    clearTimeout(sequencePlaybackTimeout);
    sequencePlaybackTimeout = null;
  }
  scratchedInkedCount = 0;
  isScratching = false;
  stage5LockedCount = 0;
  wrapperEl.classList.remove("shake-grid");
  canvasEl.innerHTML = "";
  cellsMap = {};
  victoryCells = []; // Reset victory grid list
  wrapperEl.classList.remove("has-started");
  
  if (victoryOverlayEl) {
    victoryOverlayEl.style.display = "none";
    victoryOverlayEl.classList.remove("show");
  }

  // Clean up any remaining floaters from Stage 5
  if (typeof lanFloaters !== 'undefined' && lanFloaters.length > 0) {
    lanFloaters.forEach(f => {
      if (f.element) f.element.remove();
    });
    lanFloaters = [];
  }
  currentLanPlaced = 0;

  // Reset phantom position to center
  phantom.x = GRID_SIZE / 2;
  phantom.y = GRID_SIZE / 2;
  phantom.vx = 0.08;
  phantom.vy = 0.08;

  // Update Header indicators
  updateHeader();

  // If Stage 6 (Syllable sorting), run it and return
  if (currentStage === 6) {
    canvasEl.classList.add("sorting-mode");
    wrapperEl.classList.add("sorting-mode");
    initSyllableSorting();
    return;
  } else {
    canvasEl.classList.remove("sorting-mode");
    wrapperEl.classList.remove("sorting-mode");
  }

  // Create 16x16 grid of cells using percentages for responsiveness
  const cellPercent = 100 / GRID_SIZE;
  
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement("div");
      if (currentStage === 3 || currentStage === 5) {
        cell.className = "grid-cell revealed";
      } else {
        cell.className = "grid-cell blackout";
      }
      cell.style.width = `${cellPercent}%`;
      cell.style.height = `${cellPercent}%`;
      cell.style.left = `${c * cellPercent}%`;
      cell.style.top = `${r * cellPercent}%`;
      
      const key = `${c}-${r}`;
      cell.dataset.x = c;
      cell.dataset.y = r;
      cell.dataset.key = key;

      // In Stage 5, pre-ink non-missing cells and set placeholder styles
      if (currentStage === 5) {
        cell.style.pointerEvents = "none";
        if (letterSet.has(key)) {
          const isMissing = LAN_MISSING.some(m => m.x === c && m.y === r);
          if (isMissing) {
            cell.classList.add("lan-target-placeholder");
          } else {
            cell.classList.add("inked");
          }
        }
      }

      // Stage 3 Simon Node styling
      const simonNodeIndex = STAGE3_NODES.findIndex(n => n.x === c && n.y === r);
      if (currentStage === 3 && simonNodeIndex !== -1) {
        const node = STAGE3_NODES[simonNodeIndex];
        cell.classList.add("simon-node");
        cell.style.backgroundColor = node.colorHex;
        cell.style.borderColor = node.colorHex;
        cell.dataset.simonIndex = simonNodeIndex;
      }

      // Add click handler
      cell.addEventListener("click", () => {
        onCellClick(c, r);
      });

      canvasEl.appendChild(cell);
      cellsMap[key] = cell;
    }
  }

  // Trigger stage 3 sequence playback
  if (currentStage === 3) {
    isSequencePlaying = true;
    sequencePlaybackTimeout = setTimeout(() => {
      playStage3Sequence();
    }, 1200);
  }

  // Trigger stage 5 floaters initialization
  if (currentStage === 5) {
    initLanFloaters();
  }
}

function updateHeader() {
  const progressContainerEl = document.querySelector(".progress-container");
  if (progressContainerEl) {
    if (currentStage === 6) {
      progressContainerEl.style.display = "none";
    } else {
      progressContainerEl.style.display = "flex";
    }
  }

  if (currentStage === 1) {
    dragCounterEl.textContent = `SWIPES: ${currentDrag} / 6`;
  } else if (currentStage === 2) {
    dragCounterEl.textContent = `HALLADOS: ${currentClicks} / 6`;
  } else if (currentStage === 3) {
    dragCounterEl.textContent = `PATRÓN: ${stage3UserClicks.length} / 6`;
  } else if (currentStage === 4) {
    const percent = Math.min(100, Math.floor((scratchedInkedCount / 40) * 100));
    dragCounterEl.textContent = `RASPADO: ${percent}%`;
  } else if (currentStage === 5) {
    dragCounterEl.textContent = `COLOCADOS: ${currentLanPlaced} / 6`;
  } else {
    dragCounterEl.textContent = `ORDENAR SÍLABAS`;
  }
  
  let currentCount = 0;
  if (currentStage === 1) currentCount = currentDrag;
  else if (currentStage === 2) currentCount = currentClicks;
  else if (currentStage === 3) currentCount = stage3UserClicks.length;
  else if (currentStage === 4) currentCount = Math.min(6, Math.floor((scratchedInkedCount / 40) * 6));
  else if (currentStage === 5) currentCount = currentLanPlaced;
  else currentCount = 0;

  for (let i = 1; i <= 6; i++) {
    const seg = document.getElementById(`seg-${i}`);
    if (seg) {
      if (i <= currentCount) {
        seg.classList.add("solved");
        seg.classList.remove("active");
      } else if (i === currentCount + 1) {
        seg.classList.add("active");
        seg.classList.remove("solved");
      } else {
        seg.classList.remove("active", "solved");
      }
    }
  }
}

function onPointerDown(e) {
  if (victoryOverlayEl && victoryOverlayEl.classList.contains("show")) return;
  if (currentStage === 6) return;
  if (currentStage === 1) {
    if (currentDrag >= 6) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    wrapperEl.classList.add("has-started");
  } else if (currentStage === 4) {
    if (scratchedInkedCount >= 40) return;
    isScratching = true;
    scratchCellAtPointer(e);
  }
}

function onPointerMove(e) {
  if (victoryOverlayEl && victoryOverlayEl.classList.contains("show")) return;
  if (currentStage === 6) return;
  if (currentStage === 1) {
    if (!isDragging) return;

    const rect = canvasEl.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Calculate cell index dynamically based on actual canvas size
    const cellWidth = rect.width / GRID_SIZE;
    const cellHeight = rect.height / GRID_SIZE;

    const cellX = Math.floor(px / cellWidth);
    const cellY = Math.floor(py / cellHeight);

    // Illuminate hovered cell if still blacked out
    const targetKey = `${cellX}-${cellY}`;
    const cell = cellsMap[targetKey];
    if (cell && cell.classList.contains("blackout")) {
      cell.classList.add("hover-temp");
      setTimeout(() => {
        cell.classList.remove("hover-temp");
      }, 400);
    }
  } else if (currentStage === 4) {
    if (!isScratching || scratchedInkedCount >= 40) return;
    scratchCellAtPointer(e);
  }
}

function onPointerUp(e) {
  if (victoryOverlayEl && victoryOverlayEl.classList.contains("show")) return;
  if (currentStage === 6) return;
  if (currentStage === 1) {
    if (!isDragging) return;
    isDragging = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const dist = Math.hypot(dx, dy);

    // If swiped/dragged a sufficient distance (80px), reveal the next column batch
    if (dist > 80 && currentDrag < 6) {
      revealNextBatch();
    }
  } else if (currentStage === 4) {
    isScratching = false;
  }
}

function revealNextBatch() {
  currentDrag++;
  updateHeader();
  AudioSynth.playSwipe();

  const activeCols = DRAG_COLUMNS[currentDrag];
  const cellsToReveal = [];

  // Gather all cells in these columns
  for (let r = 0; r < GRID_SIZE; r++) {
    activeCols.forEach(c => {
      const cell = cellsMap[`${c}-${r}`];
      if (cell && cell.classList.contains("blackout")) {
        cellsToReveal.push(cell);
      }
    });
  }

  // Staggered 3D flip animation
  cellsToReveal.sort((a, b) => {
    const ax = parseInt(a.dataset.x);
    const ay = parseInt(a.dataset.y);
    const bx = parseInt(b.dataset.x);
    const by = parseInt(b.dataset.y);
    return ax !== bx ? ax - bx : ay - by;
  });

  const startCol = activeCols[0];
  cellsToReveal.forEach(cell => {
    const cx = parseInt(cell.dataset.x);
    const cy = parseInt(cell.dataset.y);

    // Calculate delay based on distance/offset
    const delay = (cx - startCol) * 80 + cy * 15;

    setTimeout(() => {
      cell.classList.remove("blackout");
      cell.classList.add("revealed");
      
      const key = cell.dataset.key;
      if (letterSet.has(key)) {
        cell.classList.add("inked");
      }
    }, delay);
  });

  // Check victory
  if (currentDrag === 6) {
    setTimeout(triggerVictory, 1400);
  }
}

// STAGE 2 HOTSPOT CLICKS & STAGE 3 SIMON SEQUENCE
function onCellClick(c, r) {
  if (victoryOverlayEl && victoryOverlayEl.classList.contains("show")) return;
  
  if (currentStage === 2) {
    const hotspot = STAGE2_HOTSPOTS.find(h => h.x === c && h.y === r);
    if (!hotspot) return;
    if (activatedHotspots.has(hotspot.columnSlice)) return;
    
    revealHotspotColumns(hotspot.columnSlice);
  } else if (currentStage === 3) {
    if (isSequencePlaying) return;
    if (stage3UserClicks.length >= STAGE3_SEQUENCE.length) return;
    
    // Check if clicked cell is one of the 4 Simon nodes
    const simonIndex = STAGE3_NODES.findIndex(n => n.x === c && n.y === r);
    if (simonIndex === -1) return;
    
    const cell = cellsMap[`${c}-${r}`];
    
    // Flash clicked node for immediate feedback
    if (cell) {
      cell.classList.add("flash-active");
      AudioSynth.playSimonTone(simonIndex);
      setTimeout(() => {
        cell.classList.remove("flash-active");
      }, 200);
    }
    
    // Validate sequence step
    const expectedIndex = STAGE3_SEQUENCE[stage3UserClicks.length];
    if (simonIndex === expectedIndex) {
      // Correct click!
      stage3UserClicks.push(simonIndex);
      updateHeader();
      
      // If sequence is completed
      if (stage3UserClicks.length === STAGE3_SEQUENCE.length) {
        revealStage3Victory();
        setTimeout(triggerVictory, 1800);
      }
    } else {
      // Incorrect click!
      isSequencePlaying = true;
      setSimonNodesActive(false); // Disable breathing during shake/replay
      wrapperEl.classList.add("shake-grid");
      document.getElementById("hint-text").textContent = "¡Incorrecto! Observa de nuevo";
      AudioSynth.playError();
      
      // Reset clicks and update header
      stage3UserClicks = [];
      updateHeader();
      
      setTimeout(() => {
        wrapperEl.classList.remove("shake-grid");
        playStage3Sequence();
      }, 1200);
    }
  } else if (currentStage === 6) {
    if (isSequencePlaying) return;
    
    // Always emit a sonar pulse from clicked cell
    triggerSonarPulse(c, r);
    
    const key = `${c}-${r}`;
    const cell = cellsMap[key];
    if (cell && letterSet.has(key) && !cell.classList.contains("revealed")) {
      cell.classList.remove("blackout");
      cell.classList.add("revealed", "inked");
      stage5LockedCount++;
      updateHeader();
      
      if (stage5LockedCount >= 42) {
        isSequencePlaying = true; // Block clicks
        revealAllGrid();
        setTimeout(triggerVictory, 1500);
      }
    }
  }
}

function setSimonNodesActive(active) {
  const nodes = document.querySelectorAll(".simon-node");
  nodes.forEach(node => {
    if (active) {
      node.classList.add("user-turn-active");
    } else {
      node.classList.remove("user-turn-active");
    }
  });
}

function playStage3Sequence() {
  isSequencePlaying = true;
  setSimonNodesActive(false); // Disable breathing during playback
  document.getElementById("hint-text").textContent = "Observa el patrón de destellos...";
  
  let i = 0;
  
  function nextStep() {
    // If the stage changed or game reset while playing, abort
    if (currentStage !== 3 || victoryOverlayEl.classList.contains("show")) return;

    if (i >= STAGE3_SEQUENCE.length) {
      isSequencePlaying = false;
      setSimonNodesActive(true); // Enable breathing on user's turn
      document.getElementById("hint-text").textContent = "¡Tu turno! Repite el patrón";
      return;
    }
    
    const nodeIndex = STAGE3_SEQUENCE[i];
    const node = STAGE3_NODES[nodeIndex];
    const key = `${node.x}-${node.y}`;
    const cell = cellsMap[key];
    
    if (cell) {
      cell.classList.add("flash-active");
      AudioSynth.playSimonTone(nodeIndex);
      setTimeout(() => {
        cell.classList.remove("flash-active");
      }, 500);
    }
    
    i++;
    sequencePlaybackTimeout = setTimeout(nextStep, 900);
  }
  
  nextStep();
}

function revealStage3Victory() {
  isSequencePlaying = true;
  setSimonNodesActive(false); // Disable breathing on victory
  document.getElementById("hint-text").textContent = "¡Patrón correcto!";
  
  // Gather and sort all CU_COORDS cells to reveal in a wave
  const cellsToReveal = [];
  for (const key of letterSet) {
    const cell = cellsMap[key];
    if (cell) {
      cellsToReveal.push(cell);
    }
  }
  
  cellsToReveal.sort((a, b) => {
    const ax = parseInt(a.dataset.x);
    const ay = parseInt(a.dataset.y);
    const bx = parseInt(b.dataset.x);
    const by = parseInt(b.dataset.y);
    return ax !== bx ? ax - bx : ay - by;
  });
  
  cellsToReveal.forEach((cell, idx) => {
    setTimeout(() => {
      cell.classList.add("inked");
      cell.style.transform = "scale(1.2) translateZ(10px)";
      setTimeout(() => {
        cell.style.transform = "";
      }, 250);
    }, idx * 40);
  });
}

function scratchCellAtPointer(e) {
  if (currentStage !== 4) return;
  const rect = canvasEl.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  
  if (px < 0 || px > rect.width || py < 0 || py > rect.height) return;
  
  const cellWidth = rect.width / GRID_SIZE;
  const cellHeight = rect.height / GRID_SIZE;
  const cellX = Math.floor(px / cellWidth);
  const cellY = Math.floor(py / cellHeight);
  
  if (cellX >= 0 && cellX < GRID_SIZE && cellY >= 0 && cellY < GRID_SIZE) {
    const key = `${cellX}-${cellY}`;
    const cell = cellsMap[key];
    if (cell && cell.classList.contains("blackout")) {
      revealScratchedCell(cell, key);
    }
  }
}

function revealScratchedCell(cell, key) {
  cell.classList.remove("blackout");
  cell.classList.add("revealed");
  AudioSynth.playScratch();
  
  const isInked = letterSet.has(key);
  if (isInked) {
    cell.classList.add("inked");
    scratchedInkedCount++;
    updateHeader();
    
    // Victory limit is 40 for DRI (85% of 48)
    if (scratchedInkedCount >= 40) {
      isScratching = false;
      revealAllGrid();
      setTimeout(triggerVictory, 1500);
    }
  }

  // Temporary 4-color rainbow splash effect (verde, amarillo, azul, rojo)
  const colors = ["#74d643", "#f0cf3c", "#3c6ed4", "#d23434"];
  const cx = parseInt(cell.dataset.x);
  const cy = parseInt(cell.dataset.y);
  const color = colors[(cx + cy) % 4];

  cell.style.backgroundColor = color;
  cell.style.borderColor = color;

  // Transition to default paper/ink style
  setTimeout(() => {
    cell.style.transition = "background-color 0.8s ease, border-color 0.8s ease";
    cell.style.backgroundColor = "";
    cell.style.borderColor = "";
    setTimeout(() => {
      cell.style.transition = "";
    }, 800);
  }, 50);
}

function revealAllGrid() {
  for (const key in cellsMap) {
    const cell = cellsMap[key];
    if (cell && cell.classList.contains("blackout")) {
      const tx = parseInt(cell.dataset.x);
      const ty = parseInt(cell.dataset.y);
      // Staggered reveal sweep from top-left to bottom-right
      const delay = tx * 40 + ty * 15;

      setTimeout(() => {
        cell.classList.remove("blackout");
        cell.classList.add("revealed");
        if (letterSet.has(key)) {
          cell.classList.add("inked");
        }
        cell.style.transform = "";
        cell.style.backgroundColor = "";
        cell.style.borderColor = "";
        cell.style.opacity = "";
        cell.style.boxShadow = "";
      }, delay);
    }
  }
}

function triggerSonarPulse(cx, cy) {
  const cellsByDist = {};
  
  for (const key in cellsMap) {
    const cell = cellsMap[key];
    if (!cell) continue;
    
    const tx = parseInt(cell.dataset.x);
    const ty = parseInt(cell.dataset.y);
    const d = Math.abs(tx - cx) + Math.abs(ty - cy);
    
    if (!cellsByDist[d]) {
      cellsByDist[d] = [];
    }
    cellsByDist[d].push(cell);
  }
  
  const maxDistance = 30;
  for (let d = 0; d <= maxDistance; d++) {
    const list = cellsByDist[d];
    if (!list || list.length === 0) continue;
    
    setTimeout(() => {
      if (currentStage !== 6 || victoryOverlayEl.classList.contains("show")) return;
      
      list.forEach(cell => {
        const key = cell.dataset.key;
        
        if (letterSet.has(key)) {
          const colors = ["#ff3b30", "#ffd60a", "#0a84ff", "#30d158"];
          const tx = parseInt(cell.dataset.x);
          const ty = parseInt(cell.dataset.y);
          const color = colors[(tx + ty) % 4];
          cell.style.setProperty("--sonar-bg", color);
          cell.style.setProperty("--sonar-border", color);
        } else {
          cell.style.setProperty("--sonar-bg", "rgba(255, 255, 255, 0.12)");
          cell.style.setProperty("--sonar-border", "rgba(255, 255, 255, 0.22)");
        }
        
        cell.classList.add("sonar-pulse-active");
        
        setTimeout(() => {
          cell.classList.remove("sonar-pulse-active");
        }, 600);
      });
    }, d * 80);
  }
}

function revealHotspotColumns(sliceIndex) {
  if (activatedHotspots.has(sliceIndex)) return;
  activatedHotspots.add(sliceIndex);

  currentClicks++;
  updateHeader();
  AudioSynth.playHotspot();

  const activeCols = DRAG_COLUMNS[sliceIndex];
  const cellsToReveal = [];

  // Gather all cells in these columns
  for (let r = 0; r < GRID_SIZE; r++) {
    activeCols.forEach(c => {
      const cell = cellsMap[`${c}-${r}`];
      if (cell && cell.classList.contains("blackout")) {
        cellsToReveal.push(cell);
      }
    });
  }

  // Staggered 3D flip animation
  cellsToReveal.sort((a, b) => {
    const ax = parseInt(a.dataset.x);
    const ay = parseInt(a.dataset.y);
    const bx = parseInt(b.dataset.x);
    const by = parseInt(b.dataset.y);
    return ax !== bx ? ax - bx : ay - by;
  });

  const startCol = activeCols[0];
  cellsToReveal.forEach(cell => {
    const cx = parseInt(cell.dataset.x);
    const cy = parseInt(cell.dataset.y);
    const delay = (cx - startCol) * 80 + cy * 15;

    setTimeout(() => {
      cell.classList.remove("blackout");
      cell.classList.add("revealed");
      
      const key = cell.dataset.key;
      if (letterSet.has(key)) {
        cell.classList.add("inked");
      }
    }, delay);
  });

  // Check victory
  if (currentClicks === 6) {
    setTimeout(triggerVictory, 1400);
  }
}

// VICTORY SCREEN
function triggerVictory() {
  const victoryGridAssembledEl = document.getElementById("victory-grid-assembled");

  if (currentStage === 6) {
    if (victoryGridEl) victoryGridEl.style.display = "none";
    if (victoryGridAssembledEl) {
      victoryGridAssembledEl.style.display = "flex";
      victoryGridAssembledEl.classList.add("unified-assembled");
      victoryGridAssembledEl.innerHTML = "";
      
      const syllables = [
        { coords: CUA_COORDS, label: "CUA", color: "#74d643", glow: "rgba(116, 214, 67, 0.35)" },
        { coords: DRI_COORDS, label: "DRI", color: "#d23434", glow: "rgba(210, 52, 52, 0.35)" },
        { coords: CU_COORDS, label: "CU", color: "#f0cf3c", glow: "rgba(240, 207, 60, 0.35)" },
        { coords: LAN_COORDS, label: "LAN", color: "#3c6ed4", glow: "rgba(60, 110, 212, 0.35)" },
        { coords: D_COORDS.concat(O_COORDS), label: "DO", color: "#ffffff", glow: "rgba(255, 255, 255, 0.35)" }
      ];
      
      syllables.forEach((syll, idx) => {
        const miniGrid = document.createElement("div");
        miniGrid.className = "mini-grid";
        miniGrid.style.setProperty("--theme-color", syll.color);
        miniGrid.style.setProperty("--theme-color-glow", syll.glow);
        miniGrid.style.animationDelay = `${idx * 180}ms`;
        
        const cellPercent = 100 / GRID_SIZE;
        const set = new Set(syll.coords.map(coord => coord[0] + "-" + coord[1]));
        
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement("div");
            cell.className = "mini-cell";
            cell.style.width = `${cellPercent}%`;
            cell.style.height = `${cellPercent}%`;
            cell.style.left = `${c * cellPercent}%`;
            cell.style.top = `${r * cellPercent}%`;
            
            if (set.has(`${c}-${r}`)) {
              cell.classList.add("inked");
            }
            
            miniGrid.appendChild(cell);
          }
        }
        
        const label = document.createElement("div");
        label.className = "mini-grid-label";
        label.textContent = syll.label;
        miniGrid.appendChild(label);
        
        victoryGridAssembledEl.appendChild(miniGrid);
      });
    }
  } else {
    if (victoryGridAssembledEl) {
      victoryGridAssembledEl.style.display = "none";
      victoryGridAssembledEl.classList.remove("unified-assembled");
    }
    if (victoryGridEl) {
      victoryGridEl.style.display = "block";
      victoryGridEl.innerHTML = "";
      
      const cells = [];
      const cellPercent = 100 / GRID_SIZE;
      
      // Render 16x16 grid for victory screen
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const cell = document.createElement("div");
          cell.className = "victory-cell";
          cell.style.width = `${cellPercent}%`;
          cell.style.height = `${cellPercent}%`;
          cell.style.left = `${c * cellPercent}%`;
          cell.style.top = `${r * cellPercent}%`;
          cell.dataset.x = c;
          cell.dataset.y = r;

          if (letterSet.has(`${c}-${r}`)) {
            cell.classList.add("inked");
          }

          victoryGridEl.appendChild(cell);
          cells.push(cell);
        }
      }

      // Assign to global victoryCells array for the animation wave
      victoryCells = cells;
      
      // Wave entrance animation
      cells.forEach(cell => {
        cell.style.transform = "scale(0) rotateY(90deg)";
        cell.style.opacity = "0";
      });

      setTimeout(() => {
        cells.forEach(cell => {
          const col = parseInt(cell.dataset.x);
          const row = parseInt(cell.dataset.y);
          const delay = col * 35 + row * 10;
          
          cell.style.transition = `
            transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.25) ${delay}ms,
            opacity 0.6s ease ${delay}ms,
            background-color 0.2s ease
          `;
          cell.style.transform = "scale(1) rotateY(0deg)";
          cell.style.opacity = "1";
        });

        // Clear transitions after animation completes to allow smooth 60fps searchlight wave
        setTimeout(() => {
          cells.forEach(cell => {
            cell.style.transition = "";
          });
        }, 1400);
      }, 100);
    }
  }

  // Toggle stage elements
  if (currentStage === 1) {
    document.getElementById("victory-word").textContent = "¡DESCIFRADO!";
    document.getElementById("victory-subtitle").textContent = "Patrón completado en 6 arrastres";
    if (btnNextEl) btnNextEl.style.display = "block";
  } else if (currentStage === 2) {
    document.getElementById("victory-word").textContent = "¡DESCIFRADO!";
    document.getElementById("victory-subtitle").textContent = "Patrón completado hallando los 6 cuadritos";
    if (btnNextEl) btnNextEl.style.display = "block";
  } else if (currentStage === 3) {
    document.getElementById("victory-word").textContent = "¡DESCIFRADO!";
    document.getElementById("victory-subtitle").textContent = "Patrón completado siguiendo la secuencia de colores";
    if (btnNextEl) btnNextEl.style.display = "block";
  } else if (currentStage === 4) {
    document.getElementById("victory-word").textContent = "¡DESCIFRADO!";
    document.getElementById("victory-subtitle").textContent = "Patrón completado raspando el tablero";
    if (btnNextEl) btnNextEl.style.display = "block";
  } else if (currentStage === 5) {
    document.getElementById("victory-word").textContent = "¡DESCIFRADO!";
    document.getElementById("victory-subtitle").textContent = "Patrón completado ordenando los cuadros flotantes";
    if (btnNextEl) btnNextEl.style.display = "block";
  } else {
    document.getElementById("victory-word").textContent = "¡CUADRICULANDO!";
    document.getElementById("victory-subtitle").textContent = "Has ordenado las sílabas completando la palabra";
    if (btnNextEl) btnNextEl.style.display = "none";
  }

  if (victoryOverlayEl) {
    victoryOverlayEl.style.display = "flex";
    void victoryOverlayEl.offsetWidth; // force reflow
    victoryOverlayEl.classList.add("show");
  }
}

function animateColorWave() {
  const now = Date.now();
  const timeSec = now * 0.001; // time in seconds

  // Smooth wandering path covering the 16x16 grid (using Lissajous curves)
  // Auto path sweeps from approximately -3.2 to 19.2 so it naturally moves off/on grid edges.
  const autoX = (Math.sin(timeSec * 0.9) * 0.35 + Math.sin(timeSec * 0.4) * 0.35 + 0.5) * GRID_SIZE;
  const autoY = (Math.cos(timeSec * 0.8) * 0.35 + Math.cos(timeSec * 0.3) * 0.35 + 0.5) * GRID_SIZE;

  let targetX = autoX;
  let targetY = autoY;

  // Blend from automatic path to user cursor if user is hovering inside grid boundaries
  if (userPointer.active) {
    const idleTime = now - userPointer.lastActive;
    if (idleTime < 1000) {
      // 1.0 at start of idle, 0.0 at 1000ms
      const blend = 1.0 - (idleTime / 1000);
      const t = blend * blend * (3 - 2 * blend); // smoothstep
      targetX = autoX + (userPointer.x - autoX) * t;
      targetY = autoY + (userPointer.y - autoY) * t;
    }
  }

  // Smoothly interpolate the phantom cursor toward the target
  phantom.x += (targetX - phantom.x) * 0.08;
  phantom.y += (targetY - phantom.y) * 0.08;

  // Update LAN floaters physics in Stage 5
  if (currentStage === 5 && typeof lanFloaters !== 'undefined' && lanFloaters.length > 0) {
    lanFloaters.forEach(floater => {
      if (!floater.isDragged && !floater.isSnapped) {
        floater.px += floater.vx;
        floater.py += floater.vy;

        // Bounce off walls (0 to 100 minus size)
        const sizePct = 100 / GRID_SIZE;
        if (floater.px < 0) {
          floater.px = 0;
          floater.vx *= -1;
        } else if (floater.px > 100 - sizePct) {
          floater.px = 100 - sizePct;
          floater.vx *= -1;
        }

        if (floater.py < 0) {
          floater.py = 0;
          floater.vy *= -1;
        } else if (floater.py > 100 - sizePct) {
          floater.py = 100 - sizePct;
          floater.vy *= -1;
        }

        floater.element.style.left = `${floater.px}%`;
        floater.element.style.top = `${floater.py}%`;
      }
    });
  }

  // 1. Gameplay cells (Apply dynamic dome ripple to both revealed and blackout cells)
  for (const key in cellsMap) {
    const cell = cellsMap[key];
    if (!cell) continue;

    const cx = parseInt(cell.dataset.x);
    const cy = parseInt(cell.dataset.y);
    const dist = Math.hypot(cx - phantom.x, cy - phantom.y);
    const r = 4.0; // Dome ripple radius

    if (cell.classList.contains("revealed")) {
      // Permanently revealed cells
      if (dist < r) {
        const factor = (r - dist) / r;
        cell.style.transform = `scale(${1 + factor * 0.2}) translateZ(${factor * 10}px)`;
        if (!cell.classList.contains("simon-node") && !cell.classList.contains("lan-target-placeholder")) {
          cell.style.backgroundColor = cell.classList.contains("inked") ? "#333" : "rgba(17, 17, 17, 0.15)";
          if (cell.classList.contains("inked")) {
            cell.style.borderColor = "#333";
          }
        }
      } else {
        cell.style.transform = "";
        if (!cell.classList.contains("simon-node") && !cell.classList.contains("lan-target-placeholder")) {
          cell.style.backgroundColor = "";
          cell.style.borderColor = "";
        }
      }
    } else {
      // Blackout cells (temporary reveal lens that matches hover style)
      if (dist < r) {
        const factor = (r - dist) / r;
        cell.style.opacity = factor;
        // Flip from 180deg to 0deg, scale to 1.2x, and elevate 10px
        cell.style.transform = `rotateY(${180 - factor * 180}deg) scale(${0.95 + factor * 0.25}) translateZ(${factor * 10}px)`;
        cell.style.backgroundColor = letterSet.has(key) ? "#333" : "rgba(17, 17, 17, 0.15)";
        cell.style.borderColor = letterSet.has(key) ? "#333" : "rgba(17, 17, 17, 0.15)";
      } else {
        cell.style.opacity = "";
        cell.style.transform = "";
        cell.style.backgroundColor = "";
        cell.style.borderColor = "";
      }
    }
  }

  // 1.5 Stage 2 Hotspots Hover/Glow Overlay
  if (currentStage === 2) {
    STAGE2_HOTSPOTS.forEach((hotspot) => {
      const key = `${hotspot.x}-${hotspot.y}`;
      const cell = cellsMap[key];
      if (cell && !activatedHotspots.has(hotspot.columnSlice)) {
        const cx = hotspot.x;
        const cy = hotspot.y;
        const dist = Math.hypot(cx - phantom.x, cy - phantom.y);
        const r = 4.0;

        // Strong pulsing effect for hidden hotspots (between 0.35 and 0.75 opacity for high visibility)
        const pulse = Math.sin(timeSec * 3.0) * 0.2 + 0.55;

        if (dist < r) {
          const factor = (r - dist) / r;
          const op = pulse + factor * (1.0 - pulse);
          cell.style.opacity = op;
          cell.style.transform = `rotateY(${180 - factor * 180}deg) scale(${0.95 + factor * 0.25}) translateZ(${factor * 10}px)`;
          cell.style.backgroundColor = `rgba(${hotspot.colorRgb}, ${0.35 + factor * 0.65})`;
          cell.style.borderColor = `rgba(255, 255, 255, ${0.6 + factor * 0.4})`;
          cell.style.boxShadow = `0 0 15px rgba(${hotspot.colorRgb}, ${0.5 + factor * 0.5})`;
          cell.style.cursor = "pointer";
        } else {
          cell.style.opacity = pulse;
          cell.style.transform = "";
          cell.style.backgroundColor = `rgba(${hotspot.colorRgb}, ${pulse * 0.55})`;
          cell.style.borderColor = `rgba(${hotspot.colorRgb}, ${pulse})`;
          cell.style.boxShadow = `0 0 8px rgba(${hotspot.colorRgb}, ${pulse * 0.3})`;
          cell.style.cursor = "pointer";
        }
      }
    });
  }

  // 2. Victory cells (Apply dynamic dome ripple to all victory cells)
  victoryCells.forEach(cell => {
    const cx = parseInt(cell.dataset.x);
    const cy = parseInt(cell.dataset.y);
    const dist = Math.hypot(cx - phantom.x, cy - phantom.y);
    const r = 4.0;

    if (dist < r) {
      const factor = (r - dist) / r;
      cell.style.transform = `scale(${1 + factor * 0.2}) translateZ(${factor * 10}px)`;
      cell.style.backgroundColor = cell.classList.contains("inked") ? "#333" : "rgba(17, 17, 17, 0.15)";
      if (cell.classList.contains("inked")) {
        cell.style.borderColor = "#333";
      }
    } else {
      cell.style.transform = "";
      cell.style.backgroundColor = "";
      cell.style.borderColor = "";
    }
  });

  requestAnimationFrame(animateColorWave);
}

// ==========================================
// STAGE 5 - LAN FLOATING SQUARES
// ==========================================
function initLanFloaters() {
  if (lanFloaters && lanFloaters.length > 0) {
    lanFloaters.forEach(f => {
      if (f.element) f.element.remove();
    });
  }
  lanFloaters = [];
  currentLanPlaced = 0;

  const missingCoords = [
    { x: 3, y: 11 },
    { x: 8, y: 4 },
    { x: 8, y: 8 },
    { x: 13, y: 6 },
    { x: 14, y: 9 },
    { x: 15, y: 11 }
  ];

  missingCoords.forEach(coord => {
    const floaterEl = document.createElement("div");
    floaterEl.className = "lan-floater";
    
    // Choose random starting position outside the target area
    let startX, startY;
    do {
      startX = Math.random() * 85 + 5; // percentage: 5% to 90%
      startY = Math.random() * 85 + 5;
    } while (Math.abs(startX - coord.x * 6.25) < 15 && Math.abs(startY - coord.y * 6.25) < 15);

    floaterEl.style.left = `${startX}%`;
    floaterEl.style.top = `${startY}%`;

    // Random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.08 + Math.random() * 0.06; // speed in percentage per frame
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    canvasEl.appendChild(floaterEl);

    const floater = {
      element: floaterEl,
      c: coord.x,
      r: coord.y,
      px: startX,
      py: startY,
      vx: vx,
      vy: vy,
      isDragged: false,
      isSnapped: false
    };

    setupFloaterDrag(floater);
    lanFloaters.push(floater);
  });
}

function setupFloaterDrag(floater) {
  let startPointerX = 0;
  let startPointerY = 0;
  let startFloaterPx = 0;
  let startFloaterPy = 0;

  floater.element.addEventListener("pointerdown", (e) => {
    if (floater.isSnapped) return;
    floater.isDragged = true;
    floater.element.setPointerCapture(e.pointerId);

    const rect = canvasEl.getBoundingClientRect();
    startPointerX = e.clientX;
    startPointerY = e.clientY;
    startFloaterPx = floater.px;
    startFloaterPy = floater.py;

    floater.element.style.transform = "scale(1.15) translateZ(35px)";

    // Highlight the target position on the grid
    const targetCell = cellsMap[`${floater.c}-${floater.r}`];
    if (targetCell) {
      targetCell.classList.add("lan-active-target");
    }
  });

  floater.element.addEventListener("pointermove", (e) => {
    if (!floater.isDragged || floater.isSnapped) return;

    const rect = canvasEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dx = e.clientX - startPointerX;
    const dy = e.clientY - startPointerY;

    // Convert pixel offset to percentage offset
    const dxPct = (dx / rect.width) * 100;
    const dyPct = (dy / rect.height) * 100;

    let newX = startFloaterPx + dxPct;
    let newY = startFloaterPy + dyPct;

    // Clamp inside boundaries (0 to 100 minus width)
    const sizePct = 100 / GRID_SIZE;
    newX = Math.max(0, Math.min(100 - sizePct, newX));
    newY = Math.max(0, Math.min(100 - sizePct, newY));

    floater.px = newX;
    floater.py = newY;

    floater.element.style.left = `${newX}%`;
    floater.element.style.top = `${newY}%`;

    // Visual snap guidance: check if near target
    const currentGridX = newX / sizePct;
    const currentGridY = newY / sizePct;
    const distToTarget = Math.hypot(currentGridX - floater.c, currentGridY - floater.r);

    if (distToTarget < 1.2) {
      floater.element.style.borderColor = "#74d643"; // turns green when in range
      floater.element.style.boxShadow = "0 0 15px rgba(116, 214, 67, 0.8)";
    } else {
      floater.element.style.borderColor = "";
      floater.element.style.boxShadow = "";
    }
  });

  floater.element.addEventListener("pointerup", (e) => {
    if (!floater.isDragged) return;
    floater.isDragged = false;
    floater.element.releasePointerCapture(e.pointerId);

    floater.element.style.transform = "";

    // Remove high-light target styling
    const targetCell = cellsMap[`${floater.c}-${floater.r}`];
    if (targetCell) {
      targetCell.classList.remove("lan-active-target");
    }

    const sizePct = 100 / GRID_SIZE;
    const currentGridX = floater.px / sizePct;
    const currentGridY = floater.py / sizePct;
    const distToTarget = Math.hypot(currentGridX - floater.c, currentGridY - floater.r);

    if (distToTarget < 1.2) {
      // Snap to correct target!
      floater.isSnapped = true;
      floater.px = floater.c * sizePct;
      floater.py = floater.r * sizePct;
      floater.element.style.left = `${floater.px}%`;
      floater.element.style.top = `${floater.py}%`;
      floater.element.style.borderColor = "";
      floater.element.style.boxShadow = "";
      floater.element.classList.add("snapped");
      floater.element.style.cursor = "default";
      floater.element.style.pointerEvents = "none";

      // Ink the cell in the grid underneath
      const cellKey = `${floater.c}-${floater.r}`;
      const cell = cellsMap[cellKey];
      if (cell) {
        cell.classList.remove("lan-target-placeholder");
        cell.classList.add("inked");
      }

      AudioSynth.playHotspot();
      currentLanPlaced++;
      updateHeader();

      // Check if all 6 are placed
      if (currentLanPlaced === 6) {
        // Staggered remove/fade of floater borders and complete the stage
        setTimeout(() => {
          lanFloaters.forEach(f => {
            f.element.style.transition = "opacity 0.6s ease";
            f.element.style.opacity = "0";
          });
          setTimeout(() => {
            lanFloaters.forEach(f => {
              if (f.element) f.element.remove();
            });
            triggerVictory();
          }, 600);
        }, 800);
      }
    } else {
      // Re-initialize random drift velocity so it doesn't stay stationary
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.06;
      floater.vx = Math.cos(angle) * speed;
      floater.vy = Math.sin(angle) * speed;
    }
  });

  floater.element.addEventListener("pointercancel", (e) => {
    if (!floater.isDragged) return;
    floater.isDragged = false;
    floater.element.style.transform = "";

    // Remove high-light target styling
    const targetCell = cellsMap[`${floater.c}-${floater.r}`];
    if (targetCell) {
      targetCell.classList.remove("lan-active-target");
    }

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.08 + Math.random() * 0.06;
    floater.vx = Math.cos(angle) * speed;
    floater.vy = Math.sin(angle) * speed;
  });
}

// ==========================================
// STAGE 6 - SYLLABLE SORTING & UNIFICATION
// ==========================================
let sortOrder = [];
let isSortingComplete = false;

function initSyllableSorting() {
  isSortingComplete = false;

  // Syllables definitions
  const syllables = [
    { coords: CUA_COORDS, label: "CUA", color: "#74d643", glow: "rgba(116, 214, 67, 0.35)" },
    { coords: DRI_COORDS, label: "DRI", color: "#d23434", glow: "rgba(210, 52, 52, 0.35)" },
    { coords: CU_COORDS, label: "CU", color: "#f0cf3c", glow: "rgba(240, 207, 60, 0.35)" },
    { coords: LAN_COORDS, label: "LAN", color: "#3c6ed4", glow: "rgba(60, 110, 212, 0.35)" },
    { coords: D_COORDS.concat(O_COORDS), label: "DO", color: "#ffffff", glow: "rgba(255, 255, 255, 0.35)" }
  ];

  // Generate scrambled order that is NOT correct (i.e. not [0, 1, 2, 3, 4])
  sortOrder = [0, 1, 2, 3, 4];
  do {
    sortOrder.sort(() => Math.random() - 0.5);
  } while (sortOrder.join(",") === "0,1,2,3,4");

  // Clear canvas
  canvasEl.innerHTML = "";

  // Create container for unified label
  const unifiedWordEl = document.createElement("div");
  unifiedWordEl.id = "unified-word";
  unifiedWordEl.className = "unified-word-label";
  unifiedWordEl.textContent = "CUADRICULANDO";
  canvasEl.appendChild(unifiedWordEl);

  sortOrder.forEach((syllIdx, slotIdx) => {
    const syll = syllables[syllIdx];
    const card = document.createElement("div");
    card.className = "sort-card";
    card.dataset.index = syllIdx;
    card.style.setProperty("--theme-color", syll.color);
    card.style.setProperty("--theme-color-glow", syll.glow);

    // Entry animation values: random scatter
    card.style.opacity = "0";
    const angle = Math.random() * Math.PI * 2;
    const dist = 300 + Math.random() * 200;
    const flyX = Math.cos(angle) * dist;
    const flyY = Math.sin(angle) * dist;
    card.style.transform = `translate3d(${flyX}px, ${flyY}px, 0) scale(0.5) rotate(${Math.random() * 90 - 45}deg)`;

    // Responsive left slot: cards occupy 18% width, slot intervals are 20%
    const targetLeft = slotIdx * 20 + 1;

    // Render 16x16 grid of mini cells inside the card
    const cellPercent = 100 / GRID_SIZE;
    const set = new Set(syll.coords.map(coord => coord[0] + "-" + coord[1]));

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = document.createElement("div");
        cell.className = "mini-cell";
        cell.style.width = `${cellPercent}%`;
        cell.style.height = `${cellPercent}%`;
        cell.style.left = `${c * cellPercent}%`;
        cell.style.top = `${r * cellPercent}%`;

        if (set.has(`${c}-${r}`)) {
          cell.classList.add("inked");
        }
        card.appendChild(cell);
      }
    }

    // Individual syllable label
    const label = document.createElement("div");
    label.className = "sort-card-label";
    label.textContent = syll.label;
    card.appendChild(label);

    canvasEl.appendChild(card);

    // Staggered entry animation trigger
    setTimeout(() => {
      card.style.transition = "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease";
      card.style.opacity = "1";
      card.style.transform = "translate3d(0, 0, 0) scale(1) rotate(0deg)";
      card.style.left = `${targetLeft}%`;

      // Assign transition styles for sorting movements after entry completes
      setTimeout(() => {
        if (!isSortingComplete) {
          card.style.transition = "left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.2s ease, box-shadow 0.2s ease";
        }
      }, 800);
    }, slotIdx * 120);

    // Setup drag-and-drop mechanics
    setupCardDrag(card);
  });
}

function setupCardDrag(card) {
  let isDraggingCard = false;
  let dragOffsetX = 0;

  card.addEventListener("pointerdown", (e) => {
    if (isSortingComplete) return;
    isDraggingCard = true;
    card.setPointerCapture(e.pointerId);

    const rect = canvasEl.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    dragOffsetX = e.clientX - cardRect.left;

    card.classList.add("dragging");
  });

  card.addEventListener("pointermove", (e) => {
    if (!isDraggingCard || isSortingComplete) return;

    const rect = canvasEl.getBoundingClientRect();
    let currentLeftPx = e.clientX - rect.left - dragOffsetX;
    let newLeftPct = (currentLeftPx / rect.width) * 100;

    // Clamp inside boundaries (1% to 81% left offset)
    newLeftPct = Math.max(1, Math.min(81, newLeftPct));
    card.style.left = `${newLeftPct}%`;

    const draggedIdx = parseInt(card.dataset.index);
    const currentSlot = sortOrder.indexOf(draggedIdx);

    // Determine target slot by dividing current left percentage by slot width
    let targetSlot = Math.round((newLeftPct - 1) / 20);
    targetSlot = Math.max(0, Math.min(4, targetSlot));

    if (targetSlot !== currentSlot) {
      // Swap order inside the state array
      const temp = sortOrder[currentSlot];
      sortOrder[currentSlot] = sortOrder[targetSlot];
      sortOrder[targetSlot] = temp;

      // Animate the displaced card to its new slot position
      const otherSyllIdx = sortOrder[currentSlot];
      const otherCard = canvasEl.querySelector(`.sort-card[data-index="${otherSyllIdx}"]`);
      if (otherCard) {
        otherCard.style.left = `${currentSlot * 20 + 1}%`;
      }
    }
  });

  card.addEventListener("pointerup", (e) => {
    if (!isDraggingCard) return;
    isDraggingCard = false;
    card.releasePointerCapture(e.pointerId);
    card.classList.remove("dragging");

    // Snap to its current slot position
    const draggedIdx = parseInt(card.dataset.index);
    const finalSlot = sortOrder.indexOf(draggedIdx);
    card.style.left = `${finalSlot * 20 + 1}%`;

    // Check if sorted order spells "CUA - DRI - CU - LAN - DO" (0,1,2,3,4)
    if (sortOrder.join(",") === "0,1,2,3,4") {
      unifySyllables();
    }
  });

  card.addEventListener("pointercancel", (e) => {
    if (!isDraggingCard) return;
    isDraggingCard = false;
    card.classList.remove("dragging");
    const draggedIdx = parseInt(card.dataset.index);
    const finalSlot = sortOrder.indexOf(draggedIdx);
    card.style.left = `${finalSlot * 20 + 1}%`;
  });
}

function unifySyllables() {
  isSortingComplete = true;

  const cards = canvasEl.querySelectorAll(".sort-card");
  cards.forEach((card, idx) => {
    card.style.transition = "left 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), border-radius 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease";

    // Slide together to form a unified block (width is 18%, left starts at 5%)
    card.style.left = `${idx * 18 + 5}%`;

    // Fade out individual labels
    const label = card.querySelector(".sort-card-label");
    if (label) {
      label.style.transition = "opacity 0.5s ease";
      label.style.opacity = "0";
    }

    // Apply seamless borders styling
    setTimeout(() => {
      card.classList.add("unified");
    }, 400);
  });

  // Reveal unified text label
  setTimeout(() => {
    const unifiedLabel = document.getElementById("unified-word");
    if (unifiedLabel) {
      unifiedLabel.classList.add("show");
    }
  }, 800);

  // Trigger final victory overlay after animations complete
  setTimeout(() => {
    triggerVictory();
  }, 2200);
}