// js/modules/flashcards.js
import { WORDS, CATEGORIES } from '../data/words.js';

let mainDeck = [];
let doneDeck = [];
let currentWord = null;
let isFlipped = false;
let audioCtx = null;

// Звук перелистывания
function playSwish() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
}

export function init(container) {
  renderSetup(container);
  return () => {};
}

// === ЭКРАН НАСТРОЙКИ ===
function renderSetup(container) {
  let html = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div class="card" style="max-width: 600px; margin: 40px auto;">
        <h1 style="text-align: center; color: var(--gold); margin-bottom: 8px;">Карточки</h1>
        <p class="subtitle" style="text-align: center; margin-bottom: 24px;">Выберите категории или включите блиц</p>
        
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <label style="display: flex; align-items: center; gap: 10px; font-size: 16px; cursor: pointer; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px;">
            <input type="checkbox" id="blitzMode" style="width: 20px; height: 20px; accent-color: var(--gold);">
            <b>Блиц-режим (случайные 20 слов)</b>
          </label>
          
          <div id="categoryList" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${Object.entries(CATEGORIES).map(([key, name]) => `
              <label class="cat-label" style="display: flex; align-items: center; gap: 8px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; cursor: pointer; opacity: 1; transition: 0.2s;">
                <input type="checkbox" class="cat-checkbox" value="${key}" checked style="width: 18px; height: 18px; accent-color: var(--gold);">
                ${name}
              </label>
            `).join('')}
          </div>
        </div>
        
        <button id="startCardsBtn" class="primary">Начать</button>
      </div>
    </div>
  `;
  container.innerHTML = html;

  const blitzCb = document.getElementById('blitzMode');
  const catLabels = container.querySelectorAll('.cat-label');
  
  blitzCb.addEventListener('change', (e) => {
    catLabels.forEach(l => {
      l.style.opacity = e.target.checked ? '0.4' : '1';
      l.style.pointerEvents = e.target.checked ? 'none' : 'auto';
      l.querySelector('input').checked = !e.target.checked;
    });
  });

  document.getElementById('startCardsBtn').addEventListener('click', () => {
    let selectedWords = [];
    
    if (blitzCb.checked) {
      selectedWords = [...WORDS].sort(() => Math.random() - 0.5).slice(0, 20);
    } else {
      const selectedCats = Array.from(container.querySelectorAll('.cat-checkbox:checked')).map(cb => cb.value);
      if (selectedCats.length === 0) {
        alert('Выберите хотя бы одну категорию!');
        return;
      }
      selectedWords = WORDS.filter(w => selectedCats.includes(w.category));
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

  mainDeck = [...words].sort(() => Math.random() - 0.5);
  doneDeck = [];
  currentWord = null;
  isFlipped = false;

  container.innerHTML = `
    <div class="flashcards-wrapper">
      
      <!-- Верхняя панель (Настройки и Счетчик) -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; z-index: 30; flex-shrink: 0;">
        <button id="backToSetup" style="background: transparent; border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 8px; cursor: pointer; color: var(--text-main);">← Настройки</button>
        <div style="font-weight: bold; font-size: 16px; color: var(--text-main);">Осталось: <span id="cardsLeft" style="color: var(--gold);">${mainDeck.length}</span></div>
      </div>

      <!-- Игровое поле (все инлайн-стили убраны!) -->
      <div class="flashcards-play-area">
        
        <!-- Левая колода -->
        <div id="deckLeft" class="card-deck">
          <div class="deck-pile" id="deckLeftPile">
            <div class="card-back" style="font-size: 40px; color: var(--text-muted);">?</div>
          </div>
          <div class="deck-label">Новые</div>
        </div>

        <!-- Центральная зона -->
        <div id="activeZone"></div>

        <!-- Правая колода -->
        <div id="deckRight" class="card-deck">
          <div class="deck-pile" id="deckRightPile" style="border-color: var(--gold);">
            <div class="card-back" style="font-size: 40px; color: var(--gold);">✓</div>
          </div>
          <div class="deck-label gold-label">Изучено</div>
        </div>
      </div>

      <!-- Кнопка Перевернуть (внизу) -->
      <div id="controls" style="position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center; z-index: 30;">
        <button id="flipBtn" class="primary" style="max-width: 200px;">Перевернуть</button>
      </div>
    </div>
  `;

  document.getElementById('backToSetup').addEventListener('click', () => renderSetup(container));

  const deckLeft = document.getElementById('deckLeft');
  const deckRight = document.getElementById('deckRight');
  const activeZone = document.getElementById('activeZone');
  const flipBtn = document.getElementById('flipBtn');
  const controls = document.getElementById('controls');
  const cardsLeftEl = document.getElementById('cardsLeft');

  // Клик по левой колоде (вытянуть новую)
  deckLeft.addEventListener('click', () => {
    if (currentWord) return; 
    if (mainDeck.length === 0) return;

    currentWord = mainDeck.pop();
    isFlipped = false;
    cardsLeftEl.textContent = mainDeck.length;
    updateDeckVisuals(deckLeft, mainDeck.length);
    
    playSwish();
    renderCard(activeZone, currentWord, 'left'); // Анимация слева
    controls.style.opacity = '1';
    controls.style.pointerEvents = 'auto';
  });

  // Клик по правой колоде (вернуть карту)
  deckRight.addEventListener('click', () => {
    if (doneDeck.length === 0) return;
    
    // Если есть активная карта, сначала прячем её в левую колоду
    if (currentWord) {
      mainDeck.push(currentWord);
      currentWord = null;
      activeZone.innerHTML = '';
      controls.style.opacity = '0';
      controls.style.pointerEvents = 'none';
      updateDeckVisuals(deckLeft, mainDeck.length);
    }

    currentWord = doneDeck.pop();
    isFlipped = false;
    cardsLeftEl.textContent = mainDeck.length;
    updateDeckVisuals(deckRight, doneDeck.length);
    
    playSwish();
    renderCard(activeZone, currentWord, 'right'); // Анимация справа
    controls.style.opacity = '1';
    controls.style.pointerEvents = 'auto';
  });

  // Переворот карты
  flipBtn.addEventListener('click', () => {
    if (!currentWord) return;
    isFlipped = !isFlipped;
    const inner = document.querySelector('.flashcard-inner');
    if (inner) {
      inner.style.transform = isFlipped ? 'translateX(0) scale(1) rotateY(180deg)' : 'translateX(0) scale(1) rotateY(0deg)';
    }
    playSwish();
  });

  function renderCard(zone, word, origin) {
    document.body.classList.remove('flashcards-active');
    const startX = origin === 'left' ? '-150px' : '150px';
    
    zone.innerHTML = `
      <div class="flashcard-inner" style="
        transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); 
        transform-style: preserve-3d; 
        width: 100%; height: 100%; position: relative;
        transform: translateX(${startX}) scale(0.6) rotateY(0deg);
        opacity: 0;
      ">
        <!-- Лицевая сторона -->
        <div class="flashcard-face flashcard-front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="hanzi-display">${word.hanzi}</div>
          <div style="position: absolute; bottom: 15px; color: var(--text-muted); font-size: 12px; font-style: italic; text-align: center; width: 100%;">
            Нажмите на карту, чтобы скрыть
          </div>
        </div>

        <!-- Обратная сторона -->
        <div class="flashcard-face flashcard-back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 24px; color: #3a86ff; margin-bottom: 10px; font-weight: bold;">${word.pinyin}</div>
          <div style="font-size: 32px; font-weight: bold; text-align: center; padding: 0 20px;">${word.translation}</div>
        </div>
      </div>
    `;

    const inner = zone.querySelector('.flashcard-inner');
    
    // Плавный вылет в центр
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        inner.style.transform = 'translateX(0) scale(1) rotateY(0deg)';
        inner.style.opacity = '1';
      });
    });

    // --- ЛОГИКА КЛИКОВ ---
    inner.style.cursor = 'pointer';
    inner.addEventListener('click', (e) => {
      if (!currentWord) return;
      
      // Улетает вправо
      inner.style.transform = 'translateX(200px) rotate(20deg) scale(0.5)';
      inner.style.opacity = '0';
      playSwish();

      setTimeout(() => {
        doneDeck.push(currentWord);
        currentWord = null;
        zone.innerHTML = '';
        controls.style.opacity = '0';
        controls.style.pointerEvents = 'none';
        updateDeckVisuals(deckRight, doneDeck.length);

        if (mainDeck.length === 0) {
          showVictoryScreen(container);
        }
      }, 400);
    });
  }

  function updateDeckVisuals(deckEl, count) {
    const pile = deckEl.querySelector('.deck-pile');
    if (count > 0) {
      pile.style.transform = 'scale(1)';
      pile.style.boxShadow = `0 0 20px rgba(76,201,160,0.3), ${Math.min(count, 5) * -2}px ${Math.min(count, 5) * -2}px 0px rgba(255,255,255,0.1)`;
      pile.style.borderStyle = 'solid';
      pile.style.borderColor = 'rgba(255,255,255,0.3)';
    } else {
      pile.style.transform = 'scale(0.9)';
      pile.style.boxShadow = 'none';
      pile.style.borderStyle = 'dashed';
      pile.style.borderColor = 'rgba(255,255,255,0.2)';
    }
  }
}

// === ЭКРАН ЗАВЕРШЕНИЯ ===
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
        
        <button id="finishSetupBtn" class="primary" style="margin-bottom: 15px;">
          Выбрать другую колоду
        </button>
        <button id="restartDeckBtn" style="background: transparent; border: 1px solid var(--border-color); color: var(--text-main); width: 100%; padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
          Повторить эту же колоду
        </button>
      </div>
    </div>
  `;

  // Возврат к выбору категорий
  document.getElementById('finishSetupBtn').addEventListener('click', () => {
    renderSetup(container);
  });

  // Повторить те же слова
  document.getElementById('restartDeckBtn').addEventListener('click', () => {
    // Берем все слова, которые мы только что изучили
    const wordsToRepeat = [...doneDeck]; 
    startGame(container, wordsToRepeat);
  });
}