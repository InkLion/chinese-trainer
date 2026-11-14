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
  document.body.classList.remove('flashcards-active');
  renderSetup(container);
  return () => {
    document.body.classList.remove('flashcards-active');
  };
}

// === ЭКРАН НАСТРОЙКИ ===
function renderSetup(container) {
  document.body.classList.remove('flashcards-active');
  
  let html = `
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

  // МАКЕТ БЕЗ ИНЛАЙН-СТИЛЕЙ ДЛЯ КОНТЕЙНЕРОВ
  container.innerHTML = `
    <div class="flashcards-wrapper">
      
      <!-- Верхняя панель -->
      <div class="fc-top-bar">
        <button id="backToSetup" class="fc-back-btn">← Настройки</button>
        <div class="fc-counter">Осталось: <span id="cardsLeft" style="color: var(--gold);">${mainDeck.length}</span></div>
      </div>

      <!-- Игровое поле -->
      <div class="flashcards-play-area">
        
        <div id="deckLeft" class="card-deck">
          <div class="deck-pile" id="deckLeftPile">
            <div class="card-back" style="font-size: 40px; color: var(--text-muted);">?</div>
          </div>
          <div class="deck-label">Новые</div>
        </div>

        <div id="activeZone"></div>

        <div id="deckRight" class="card-deck">
          <div class="deck-pile" id="deckRightPile" style="border-color: var(--gold);">
            <div class="card-back" style="font-size: 40px; color: var(--gold);">✓</div>
          </div>
          <div class="deck-label gold-label">Изучено</div>
        </div>
      </div>

      <!-- Кнопка Перевернуть -->
      <div class="fc-controls" id="controls">
        <button id="flipBtn" class="primary" style="max-width: 200px;">Перевернуть</button>
      </div>
    </div>
  `;

  document.getElementById('backToSetup').addEventListener('click', () => {
    document.body.classList.remove('flashcards-active');
    renderSetup(container);
  });

  const deckLeft = document.getElementById('deckLeft');
  const deckRight = document.getElementById('deckRight');
  const activeZone = document.getElementById('activeZone');
  const flipBtn = document.getElementById('flipBtn');
  const controls = document.getElementById('controls');
  const cardsLeftEl = document.getElementById('cardsLeft');

  deckLeft.addEventListener('click', () => {
    if (currentWord) return; 
    if (mainDeck.length === 0) return;

    currentWord = mainDeck.pop();
    isFlipped = false;
    cardsLeftEl.textContent = mainDeck.length;
    updateDeckVisuals(deckLeft, mainDeck.length);
    
    playSwish();
    renderCard(activeZone, currentWord, 'left');
    controls.style.opacity = '1';
    controls.style.pointerEvents = 'auto';
  });

  deckRight.addEventListener('click', () => {
    if (doneDeck.length === 0) return;
    
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
    renderCard(activeZone, currentWord, 'right');
    controls.style.opacity = '1';
    controls.style.pointerEvents = 'auto';
  });

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
          <div class="fc-hint">Нажмите на карту, чтобы скрыть</div>
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
    inner.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      
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
        
        <button id="finishSetupBtn" class="primary" style="margin-bottom: 15px;">
          Выбрать другую колоду
        </button>
        <button id="restartDeckBtn" style="background: transparent; border: 1px solid var(--border-color); color: var(--text-main); width: 100%; padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.2s;">
          Повторить эту же колоду
        </button>
      </div>
    </div>
  `;

  document.getElementById('finishSetupBtn').addEventListener('click', () => {
    renderSetup(container);
  });

  document.getElementById('restartDeckBtn').addEventListener('click', () => {
    const wordsToRepeat = [...doneDeck]; 
    startGame(container, wordsToRepeat);
  });
}