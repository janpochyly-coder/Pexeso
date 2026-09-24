'use strict';

/* ---------------------------------------------------------
   DATA: categories (ordered from easiest to hardest) and
   the 3 difficulty levels shared by every category.
--------------------------------------------------------- */

const CATEGORIES = [
  {
    id: 'shapes',
    name: 'Tvary a farby',
    desc: 'Najľahšie',
    emoji: '🔺',
    colors: ['#ff9a8b', '#ff6a88'],
    items: [
      { emoji: '🔴', name: 'Červený kruh' },
      { emoji: '🟠', name: 'Oranžový kruh' },
      { emoji: '🟡', name: 'Žltý kruh' },
      { emoji: '🟢', name: 'Zelený kruh' },
      { emoji: '🔵', name: 'Modrý kruh' },
      { emoji: '🟣', name: 'Fialový kruh' },
      { emoji: '⭐', name: 'Hviezda' },
      { emoji: '🔶', name: 'Diamant' },
      { emoji: '🔷', name: 'Modrý diamant' },
      { emoji: '⬛', name: 'Štvorec' },
      { emoji: '⬜', name: 'Biely štvorec' },
      { emoji: '🔺', name: 'Trojuholník' },
    ],
  },
  {
    id: 'fruits',
    name: 'Ovocie',
    desc: 'Ľahké',
    emoji: '🍎',
    colors: ['#ffd166', '#ff9f43'],
    items: [
      { emoji: '🍎', name: 'Jablko' },
      { emoji: '🍌', name: 'Banán' },
      { emoji: '🍇', name: 'Hrozno' },
      { emoji: '🍓', name: 'Jahoda' },
      { emoji: '🍊', name: 'Pomaranč' },
      { emoji: '🍉', name: 'Melón' },
      { emoji: '🍑', name: 'Broskyňa' },
      { emoji: '🍍', name: 'Ananás' },
      { emoji: '🥝', name: 'Kivi' },
      { emoji: '🍒', name: 'Čerešne' },
      { emoji: '🍋', name: 'Citrón' },
      { emoji: '🥭', name: 'Mango' },
    ],
  },
  {
    id: 'animals',
    name: 'Zvieratká',
    desc: 'Stredné',
    emoji: '🐶',
    colors: ['#8bd3a0', '#4fb286'],
    items: [
      { emoji: '🐶', name: 'Pes' },
      { emoji: '🐱', name: 'Mačka' },
      { emoji: '🐭', name: 'Myš' },
      { emoji: '🐹', name: 'Škrečok' },
      { emoji: '🐰', name: 'Zajac' },
      { emoji: '🦊', name: 'Líška' },
      { emoji: '🐻', name: 'Medveď' },
      { emoji: '🐼', name: 'Panda' },
      { emoji: '🐨', name: 'Koala' },
      { emoji: '🐷', name: 'Prasiatko' },
      { emoji: '🐸', name: 'Žaba' },
      { emoji: '🦁', name: 'Lev' },
    ],
  },
  {
    id: 'vehicles',
    name: 'Vozidlá',
    desc: 'Stredné',
    emoji: '🚗',
    colors: ['#6ec6ff', '#4a9de8'],
    items: [
      { emoji: '🚗', name: 'Auto' },
      { emoji: '🚕', name: 'Taxík' },
      { emoji: '🚙', name: 'Terénne auto' },
      { emoji: '🚌', name: 'Autobus' },
      { emoji: '🚓', name: 'Policajné auto' },
      { emoji: '🚑', name: 'Sanitka' },
      { emoji: '🚒', name: 'Hasičské auto' },
      { emoji: '🚜', name: 'Traktor' },
      { emoji: '🚁', name: 'Vrtuľník' },
      { emoji: '✈️', name: 'Lietadlo' },
      { emoji: '🛵', name: 'Skúter' },
      { emoji: '🚲', name: 'Bicykel' },
    ],
  },
  {
    id: 'space',
    name: 'Vesmír',
    desc: 'Náročné',
    emoji: '🚀',
    colors: ['#7b6ef6', '#5b4fd6'],
    items: [
      { emoji: '🚀', name: 'Raketa' },
      { emoji: '🌟', name: 'Hviezda' },
      { emoji: '🪐', name: 'Planéta' },
      { emoji: '🌙', name: 'Mesiac' },
      { emoji: '☄️', name: 'Kométa' },
      { emoji: '🛸', name: 'UFO' },
      { emoji: '🌍', name: 'Zem' },
      { emoji: '👽', name: 'Mimozemšťan' },
      { emoji: '🔭', name: 'Ďalekohľad' },
      { emoji: '✨', name: 'Iskry' },
      { emoji: '🌌', name: 'Galaxia' },
      { emoji: '🛰️', name: 'Satelit' },
    ],
  },
  {
    id: 'fairytale',
    name: 'Rozprávkové postavičky',
    desc: 'Najťažšie',
    emoji: '🧚',
    colors: ['#f78fb3', '#c56cf0'],
    items: [
      { emoji: '🧚', name: 'Víla' },
      { emoji: '👸', name: 'Princezná' },
      { emoji: '🤴', name: 'Princ' },
      { emoji: '🧙', name: 'Čarodejník' },
      { emoji: '🧜‍♀️', name: 'Morská víla' },
      { emoji: '🦄', name: 'Jednorožec' },
      { emoji: '🐉', name: 'Drak' },
      { emoji: '👑', name: 'Koruna' },
      { emoji: '🏰', name: 'Hrad' },
      { emoji: '🧞', name: 'Džin' },
      { emoji: '🪄', name: 'Čarovná palička' },
      { emoji: '🦸', name: 'Superhrdina' },
    ],
  },
];

const LEVELS = [
  { pairs: 4, cols: 4, label: 'Ľahká' },
  { pairs: 6, cols: 4, label: 'Stredná' },
  { pairs: 9, cols: 6, label: 'Ťažká' },
];

const STORAGE_KEY = 'pexeso-progress-v1';
const MUTE_KEY = 'pexeso-muted';

/* ---------------------------------------------------------
   PROGRESS (localStorage)
--------------------------------------------------------- */

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { stars: {} };
    const parsed = JSON.parse(raw);
    if (!parsed.stars) parsed.stars = {};
    return parsed;
  } catch (e) {
    return { stars: {} };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) { /* ignore quota / privacy-mode errors */ }
}

let progress = loadProgress();

function starsFor(catId, levelIndex) {
  return progress.stars[`${catId}_${levelIndex}`] || 0;
}

function setStars(catId, levelIndex, stars) {
  const key = `${catId}_${levelIndex}`;
  const prev = progress.stars[key] || 0;
  if (stars > prev) {
    progress.stars[key] = stars;
    saveProgress(progress);
  }
}

function categoryTotalStars(catIndex) {
  const cat = CATEGORIES[catIndex];
  let total = 0;
  for (let i = 0; i < LEVELS.length; i++) total += starsFor(cat.id, i);
  return total;
}

/* ---------------------------------------------------------
   SOUND (WebAudio, no external files)
--------------------------------------------------------- */

let audioCtx = null;
let muted = localStorage.getItem(MUTE_KEY) === '1';

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  return audioCtx;
}

function beep(freq, duration, type = 'sine', delay = 0, vol = 0.18) {
  if (muted) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function sfxFlip() { beep(520, 0.12, 'triangle'); }
function sfxMatch() { beep(660, 0.14, 'sine'); beep(880, 0.16, 'sine', 0.1); }
function sfxMismatch() { beep(180, 0.18, 'sawtooth'); }
function sfxWin() {
  [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.22, 'sine', i * 0.13, 0.16));
}

/* ---------------------------------------------------------
   NAVIGATION
--------------------------------------------------------- */

const screens = {
  categories: document.getElementById('screen-categories'),
  levels: document.getElementById('screen-levels'),
  game: document.getElementById('screen-game'),
};

let currentCatIndex = 0;
let currentLevelIndex = 0;

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove('active'));
  screens[name].classList.add('active');
}

function goHome() {
  stopTimer();
  renderCategories();
  showScreen('categories');
}

function goToLevels(catIndex) {
  stopTimer();
  currentCatIndex = catIndex;
  renderLevels();
  showScreen('levels');
}

function goToGame(catIndex, levelIndex) {
  currentCatIndex = catIndex;
  currentLevelIndex = levelIndex;
  startGame();
  showScreen('game');
}

/* ---------------------------------------------------------
   RENDER: category select
--------------------------------------------------------- */

function renderCategories() {
  const grid = document.getElementById('category-grid');
  grid.innerHTML = '';
  CATEGORIES.forEach((cat, i) => {
    const total = categoryTotalStars(i);
    const btn = document.createElement('button');
    btn.className = 'category-card';
    btn.style.background = `linear-gradient(150deg, ${cat.colors[0]}, ${cat.colors[1]})`;
    btn.innerHTML = `
      <span class="cat-badge">${cat.emoji}</span>
      <span class="cat-emoji">${cat.emoji}</span>
      <span class="cat-name">${cat.name}</span>
      <span class="cat-desc">${cat.desc}</span>
      <span class="cat-stars">${'⭐'.repeat(Math.min(total, 9)) || 'Nová!'}</span>
    `;
    btn.addEventListener('click', () => goToLevels(i));
    grid.appendChild(btn);
  });
}

/* ---------------------------------------------------------
   RENDER: level select
--------------------------------------------------------- */

function renderLevels() {
  const cat = CATEGORIES[currentCatIndex];
  document.getElementById('levels-title').textContent = `${cat.emoji} ${cat.name}`;
  const grid = document.getElementById('level-grid');
  grid.innerHTML = '';
  LEVELS.forEach((lvl, i) => {
    const stars = starsFor(cat.id, i);
    const btn = document.createElement('button');
    btn.className = 'level-card';
    btn.innerHTML = `
      <div class="lvl-num">Úroveň ${i + 1}</div>
      <div class="lvl-label">${lvl.label} · ${lvl.pairs} párov</div>
      <div class="lvl-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
    `;
    btn.addEventListener('click', () => goToGame(currentCatIndex, i));
    grid.appendChild(btn);
  });
}

/* ---------------------------------------------------------
   GAME LOGIC
--------------------------------------------------------- */

let deck = [];
let flipped = [];
let matchedCount = 0;
let moves = 0;
let boardLocked = false;
let timerInterval = null;
let elapsedSeconds = 0;
let timerStarted = false;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function startTimer() {
  stopTimer();
  elapsedSeconds = 0;
  timerStarted = true;
  document.getElementById('hud-time').textContent = formatTime(0);
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    document.getElementById('hud-time').textContent = formatTime(elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  timerStarted = false;
}

function startGame() {
  const cat = CATEGORIES[currentCatIndex];
  const lvl = LEVELS[currentLevelIndex];
  const chosenItems = cat.items.slice(0, lvl.pairs);
  deck = shuffle([...chosenItems, ...chosenItems]).map((item, idx) => ({
    id: idx,
    item,
    flipped: false,
    matched: false,
  }));
  flipped = [];
  matchedCount = 0;
  moves = 0;
  boardLocked = false;

  document.getElementById('hud-moves').textContent = '0';
  document.getElementById('hud-pairs').textContent = `0/${lvl.pairs}`;
  document.getElementById('hud-time').textContent = '0:00';
  stopTimer();

  const board = document.getElementById('board');
  board.innerHTML = '';

  deck.forEach((card) => {
    const el = document.createElement('button');
    el.className = 'card';
    el.dataset.id = card.id;
    el.setAttribute('aria-label', 'Skrytá karta');
    el.innerHTML = `
      <span class="card-face back"><span class="card-back-icon">${cat.emoji}</span></span>
      <span class="card-face front" style="--badge-grad: linear-gradient(150deg, ${cat.colors[0]}, ${cat.colors[1]})">
        <span class="card-icon-badge">${card.item.emoji}</span>
        <span class="card-name">${card.item.name}</span>
      </span>
    `;
    el.addEventListener('click', () => onCardClick(card.id, el));
    board.appendChild(el);
  });

  requestAnimationFrame(layoutBoard);
}

/* ---------------------------------------------------------
   BOARD LAYOUT: fit the card grid to fill the visible screen,
   sizing cards up or down to match the current card count.
--------------------------------------------------------- */

function layoutBoard() {
  const board = document.getElementById('board');
  if (!screens.game.classList.contains('active')) return;
  const count = deck.length;
  if (!count) return;

  const gap = window.innerWidth <= 480 ? 8 : 12;
  const hud = document.querySelector('.game-hud');
  const hudRect = hud.getBoundingClientRect();

  const availWidth = document.documentElement.clientWidth - 36;
  const availHeight = window.innerHeight - hudRect.bottom - 24;

  const ratio = 3 / 4; // card width / height
  let best = null;
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const cellW = (availWidth - gap * (cols - 1)) / cols;
    const cellH = (availHeight - gap * (rows - 1)) / rows;
    if (cellW <= 0 || cellH <= 0) continue;
    let cardW, cardH;
    if (cellW / ratio <= cellH) {
      cardW = cellW;
      cardH = cellW / ratio;
    } else {
      cardH = cellH;
      cardW = cellH * ratio;
    }
    const area = cardW * cardH;
    if (!best || area > best.area) {
      best = { cols, cardW, cardH, area };
    }
  }
  if (!best) return;

  board.style.gridTemplateColumns = `repeat(${best.cols}, ${best.cardW}px)`;
  board.style.gridAutoRows = `${best.cardH}px`;
  board.style.gap = `${gap}px`;
}

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(layoutBoard, 120);
});

function onCardClick(id, el) {
  if (boardLocked) return;
  const card = deck.find((c) => c.id === id);
  if (!card || card.flipped || card.matched) return;

  if (!timerStarted) startTimer();

  card.flipped = true;
  el.classList.add('flipped');
  sfxFlip();
  flipped.push({ card, el });

  if (flipped.length === 2) {
    moves++;
    document.getElementById('hud-moves').textContent = moves;
    boardLocked = true;
    const [a, b] = flipped;
    if (a.card.item.emoji === b.card.item.emoji) {
      setTimeout(() => {
        a.card.matched = true;
        b.card.matched = true;
        a.el.classList.add('matched');
        b.el.classList.add('matched');
        matchedCount++;
        document.getElementById('hud-pairs').textContent =
          `${matchedCount}/${LEVELS[currentLevelIndex].pairs}`;
        sfxMatch();
        flipped = [];
        boardLocked = false;
        if (matchedCount === LEVELS[currentLevelIndex].pairs) {
          onWin();
        }
      }, 350);
    } else {
      sfxMismatch();
      a.el.classList.add('shake');
      b.el.classList.add('shake');
      setTimeout(() => {
        a.card.flipped = false;
        b.card.flipped = false;
        a.el.classList.remove('flipped', 'shake');
        b.el.classList.remove('flipped', 'shake');
        flipped = [];
        boardLocked = false;
      }, 900);
    }
  }
}

/* ---------------------------------------------------------
   WIN HANDLING
--------------------------------------------------------- */

function computeStars(pairs, moveCount) {
  if (moveCount <= Math.ceil(pairs * 1.4)) return 3;
  if (moveCount <= Math.ceil(pairs * 2.2)) return 2;
  return 1;
}

function onWin() {
  stopTimer();
  sfxWin();
  const cat = CATEGORIES[currentCatIndex];
  const lvl = LEVELS[currentLevelIndex];
  const stars = computeStars(lvl.pairs, moves);
  setStars(cat.id, currentLevelIndex, stars);

  document.getElementById('win-summary').textContent =
    `Čas: ${formatTime(elapsedSeconds)} · Ťahy: ${moves}`;

  const starEls = document.querySelectorAll('#win-stars .star');
  starEls.forEach((s, i) => s.classList.toggle('lit', i < stars));

  const nextBtn = document.getElementById('btn-next-level');
  const hasNextLevel = currentLevelIndex < LEVELS.length - 1;
  const hasNextCat = currentCatIndex < CATEGORIES.length - 1;
  if (hasNextLevel || hasNextCat) {
    nextBtn.style.display = '';
    nextBtn.textContent = hasNextLevel ? 'Ďalšia úroveň ➡' : 'Ďalšia kategória ➡';
  } else {
    nextBtn.style.display = 'none';
  }

  spawnConfetti();
  document.getElementById('modal-win').classList.add('active');
}

function spawnConfetti() {
  const holder = document.getElementById('confetti');
  holder.innerHTML = '';
  const emojis = ['🎉', '⭐', '🎈', '✨', '🌟'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = `${Math.random() * 100}%`;
    s.style.animationDelay = `${Math.random() * 0.6}s`;
    s.style.fontSize = `${1 + Math.random()}rem`;
    holder.appendChild(s);
  }
}

function closeWinModal() {
  document.getElementById('modal-win').classList.remove('active');
}

/* ---------------------------------------------------------
   EVENT WIRING
--------------------------------------------------------- */

document.getElementById('btn-home').addEventListener('click', goHome);

document.querySelectorAll('[data-back]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.back;
    if (target === 'categories') goHome();
    if (target === 'levels') goToLevels(currentCatIndex);
  });
});

document.getElementById('btn-restart').addEventListener('click', () => {
  startGame();
});

document.getElementById('btn-replay').addEventListener('click', () => {
  closeWinModal();
  startGame();
});

document.getElementById('btn-to-levels').addEventListener('click', () => {
  closeWinModal();
  goToLevels(currentCatIndex);
});

document.getElementById('btn-next-level').addEventListener('click', () => {
  closeWinModal();
  const hasNextLevel = currentLevelIndex < LEVELS.length - 1;
  if (hasNextLevel) {
    goToGame(currentCatIndex, currentLevelIndex + 1);
  } else if (currentCatIndex < CATEGORIES.length - 1) {
    goToGame(currentCatIndex + 1, 0);
  } else {
    goToLevels(currentCatIndex);
  }
});

const muteBtn = document.getElementById('btn-mute');
function updateMuteBtn() {
  muteBtn.textContent = muted ? '🔇' : '🔊';
}
muteBtn.addEventListener('click', () => {
  muted = !muted;
  localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  updateMuteBtn();
});
updateMuteBtn();

/* ---------------------------------------------------------
   INIT
--------------------------------------------------------- */

renderCategories();
showScreen('categories');
