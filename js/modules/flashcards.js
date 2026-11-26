// js/modules/flashcards.js
import { WORDS, CATEGORIES } from '../data/words.js';
import { shuffle } from '../core/utils.js';

let mainDeck = [];
let doneDeck = [];
let currentWord = null;
let isFlipped = false;
let audioCtx = null;

// Звук перелистывания
function playSwish() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // На iOS/Chrome контекст часто создаётся в состоянии suspended.
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    // Звук — необязательная часть: без него карточки должны работать.
  }
}

export function init(container) {
  document.body.classList.remove('flashcards-active');
  renderSetup(container);
  return () => {
    document.body.classList.remove('flashcards-active');
  };
}

// === ЭКРАН НАСТРОЙКИ ===
function renderSetup(container) {
  document.body.classList.remove('flashcards-active');

  container.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div class="card" style="max-width: 600px; margin: 40px auto;">
        <h1 style="text-align: center; color: var(--gold); margin-bottom: 8px;">Карточки</h1>
        <p class="subtitle" style="text-align: center; margin-bottom: 24px;">Выберите категории или включите блиц</p>

        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <label style="display: flex; align-items: center; gap: 10px; font-size: 16px; cursor: pointer; background: var(--bg-card); padding: 12px; border-radius: 10px; border: 1px solid var(--border-color);">
            <input type="checkbox" id="blitzMode" style="width: 20px; height: 20px; accent-color: var(--gold);">
            <b>Блиц-режим (случайные 20 слов)</b>
          </label>

          <div id="categoryList" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${Object.entries(CATEGORIES).map(([key, name]) => `
              <label class="cat-label" style="display: flex; align-items: center; gap: 8px; padding: 10px; background: var(--bg-card); border-radius: 8px; cursor: pointer; opacity: 1; transition: 0.2s; border: 1px solid var(--border-color);">
                <input type="checkbox" class="cat-checkbox" value="${key}" checked style="width: 18px; height: 18px; accent-color: var(--gold);">
                ${name}
              </label>
            `).join('')}
          </div>
        </div>

        <button type="button" id="startCardsBtn" class="primary">Начать</button>
      </div>
    </div>
  `;

  const blitzCb = container.querySelector('#blitzMode');
  const catLabels = container.querySelectorAll('.cat-label');

  blitzCb.addEventListener('change', (e) => {
    // Раньше здесь сбрасывались все галочки категорий, и после выключения
    // блица пользователь терял свой выбор. Теперь только блокируем ввод.
    catLabels.forEach((label) => {
      label.style.opacity = e.target.checked ? '0.4' : '1';
      label.style.pointerEvents = e.target.checked ? 'none' : 'auto';
    });
  });

  container.querySelector('#startCardsBtn').addEventListener('click', () => {
    let selectedWords = [];

    if (blitzCb.checked) {
      selectedWords = shuffle(WORDS).slice(0, 20);
    } else {
      const selectedCats = [...container.querySelectorAll('.cat-checkbox:checked')].map((cb) => cb.value);
      if (selectedCats.length === 0) {
        alert('Выберите хотя бы одну категорию!');
        return;
      }
      selectedWords = WORDS.filter((w) => selectedCats.includes(w.category));
    }

    if (selectedWords.length === 0) {
      alert('В выбранных категориях нет слов.');
      return;
    }

    startGame(container, selectedWords);
  });
}

// === ИГРА ===
function startGame(container, words) {
  document.body.classList.add('flashcards-active');

  mainDeck = shuffle(words);
  doneDeck = [];
  currentWord = null;
  isFlipped = false;

  container.innerHTML = `
    <div class="flashcards-wrapper">

      <!-- Верхняя панель -->
      <div class="fc-top-bar">
        <button type="button" id="backToSetup" class="fc-back-btn">← Настройки</button>
        <div class="fc-counter">Осталось: <span id="cardsLeft" style="color: var(--gold);">${mainDeck.length}</span></div>
      </div>

      <!-- Игровое поле -->
      <div class="flashcards-play-area">

        <div id="deckLeft" class="card-deck" role="button" tabindex="0" aria-label="Взять новую карточку">
          <div class="deck-pile" id="deckLeftPile">
            <div class="card-back" style="font-size: 40px; color: var(--text-muted);">?</div>
          </div>
          <div class="deck-label">Новые</div>
        </div>

        <div id="activeZone"></div>

        <div id="deckRight" class="card-deck" role="button" tabindex="0" aria-label="Вернуться к изученной карточке">
          <div class="deck-pile" id="deckRightPile" style="border-color: var(--gold);">
            <div class="card-back" style="font-size: 40px; color: var(--gold);">✓</div>
          </div>
          <div class="deck-label gold-label">Изучено</div>
        </div>
      </div>

      <!-- Кнопка Перевернуть -->
      <div class="fc-controls" id="controls">
        <button type="button" id="flipBtn" class="primary" style="max-width: 200px;">Перевернуть</button>
      </div>
    </div>
  `;

  const deckLeft = container.querySelector('#deckLeft');
  const deckRight = container.querySelector('#deckRight');
  const activeZone = container.querySelector('#activeZone');
  const flipBtn = container.querySelector('#flipBtn');
  const controls = container.querySelector('#controls');
  const cardsLeftEl = container.querySelector('#cardsLeft');

  // Пока карточка улетает (400 мс), взаимодействие блокируется:
  // иначе второй клик и клики по колодам создавали null-карточки.
  let busy = false;

  container.querySelector('#backToSetup').addEventListener('click', () => {
    document.body.classList.remove('flashcards-active');
    renderSetup(container);
  });

  function setControlsVisible(visible) {
    controls.style.opacity = visible ? '1' : '0';
    controls.style.pointerEvents = visible ? 'auto' : 'none';
  }

  deckLeft.addEventListener('click', () => {
    if (busy || currentWord) return;
    if (mainDeck.length === 0) return;

    currentWord = mainDeck.pop();
    isFlipped = false;
    cardsLeftEl.textContent = mainDeck.length;
    updateDeckVisuals(deckLeft, mainDeck.length);

    playSwish();
    renderCard(activeZone, currentWord, 'left');
    setControlsVisible(true);
  });

  deckRight.addEventListener('click', () => {
    if (busy || doneDeck.length === 0) return;

    if (currentWord) {
      // Возвращаем недоизученную карточку в колоду новых.
      mainDeck.push(currentWord);
      currentWord = null;
      activeZone.innerHTML = '';
      setControlsVisible(false);
      updateDeckVisuals(deckLeft, mainDeck.length);
    }

    currentWord = doneDeck.pop();
    isFlipped = false;
    cardsLeftEl.textContent = mainDeck.length;
    updateDeckVisuals(deckRight, doneDeck.length);

    playSwish();
    renderCard(activeZone, currentWord, 'right');
    setControlsVisible(true);
  });

  flipBtn.addEventListener('click', () => {
    if (!currentWord) return;
    isFlipped = !isFlipped;
    const inner = activeZone.querySelector('.flashcard-inner');
    if (inner) {
      inner.style.transform = isFlipped
        ? 'translateX(0) scale(1) rotateY(180deg)'
        : 'translateX(0) scale(1) rotateY(0deg)';
    }
    playSwish();
  });

  function renderCard(zone, word, origin) {
    const startX = origin === 'left' ? '-150px' : '150px';

    zone.innerHTML = `
      <div class="flashcard-inner" style="
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        transform-style: preserve-3d;
        width: 100%; height: 100%; position: relative;
        transform: translateX(${startX}) scale(0.6) rotateY(0deg);
        opacity: 0;
      ">
        <div class="flashcard-face flashcard-front">
          <div class="hanzi-display">${word.hanzi}</div>
          <div class="fc-hint">Нажмите на карту, чтобы отметить изученной</div>
        </div>

        <div class="flashcard-face flashcard-back">
          <div class="fc-pinyin">${word.pinyin}</div>
          <div class="fc-translation">${word.translation}</div>
        </div>
      </div>
    `;

    const inner = zone.querySelector('.flashcard-inner');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        inner.style.transform = 'translateX(0) scale(1) rotateY(0deg)';
        inner.style.opacity = '1';
      });
    });

    inner.style.cursor = 'pointer';
    inner.addEventListener('click', () => {
      // Запоминаем карточку в замыкании: currentWord мог измениться,
      // пока шла анимация, и в doneDeck раньше попадал null.
      const word = currentWord;
      if (!word || busy) return;

      busy = true;
      inner.style.pointerEvents = 'none';
      inner.style.transform = 'translateX(200px) rotate(20deg) scale(0.5)';
      inner.style.opacity = '0';
      playSwish();

      setTimeout(() => {
        busy = false;
        if (!zone.isConnected) return;

        if (currentWord === word) {
          doneDeck.push(word);
          currentWord = null;
        }
        zone.innerHTML = '';
        setControlsVisible(false);
        updateDeckVisuals(deckRight, doneDeck.length);

        if (mainDeck.length === 0) {
          showVictoryScreen(container);
        }
      }, 400);
    });
  }

  function updateDeckVisuals(deckEl, count) {
    const pile = deckEl.querySelector('.deck-pile');
    if (!pile) return;
    if (count > 0) {
      pile.style.transform = 'scale(1)';
      pile.style.boxShadow = `0 0 20px var(--gold-glow), ${Math.min(count, 5) * -2}px ${Math.min(count, 5) * -2}px 0px rgba(255,255,255,0.1)`;
      pile.style.borderStyle = 'solid';
      pile.style.borderColor = 'var(--border-color)';
    } else {
      pile.style.transform = 'scale(0.9)';
      pile.style.boxShadow = 'none';
      pile.style.borderStyle = 'dashed';
      pile.style.borderColor = 'var(--border-color)';
    }
  }

  // Начальное состояние колод: пустая правая и полная левая.
  updateDeckVisuals(deckLeft, mainDeck.length);
  updateDeckVisuals(deckRight, doneDeck.length);
  setControlsVisible(false);
}

function showVictoryScreen(container) {
  document.body.classList.remove('flashcards-active');

  container.innerHTML = `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.5s ease-out;">
      <div class="card" style="max-width: 500px; width: 100%; text-align: center; padding: 40px 20px;">
        <div style="font-size: 80px; margin-bottom: 20px; filter: drop-shadow(0 0 20px var(--gold-glow));">🎉</div>
        <h1 style="color: var(--gold); margin-bottom: 10px;">Отличная работа!</h1>
        <p style="font-size: 18px; color: var(--text-muted); margin-bottom: 30px;">
          Вы просмотрели все карточки в этой колоде.
        </p>

        <button type="button" id="finishSetupBtn" class="primary" style="margin-bottom: 15px;">
          Выбрать другую колоду
        </button>
        <button type="button" id="restartDeckBtn" style="background: transparent; border: 1px solid var(--border-color); color: var(--text-main); width: 100%; padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
          Повторить эту же колоду
        </button>
      </div>
    </div>
  `;

  container.querySelector('#finishSetupBtn').addEventListener('click', () => {
    renderSetup(container);
  });

  container.querySelector('#restartDeckBtn').addEventListener('click', () => {
    const wordsToRepeat = [...doneDeck];
    if (!wordsToRepeat.length) {
      renderSetup(container);
      return;
    }
    startGame(container, wordsToRepeat);
  });
}
