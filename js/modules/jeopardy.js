// js/modules/jeopardy.js
import { TASKS, TOPICS } from '../../tasks.js';

const COLS = 5;
const ROWS = 5;
const POINTS = [100, 200, 300, 400, 500];
const COLORS = ['#e63946', '#3a86ff', '#2a9d8f', '#f4a261'];

let players = [];
let currentPlayerIndex = 0;
let boardData = [];
let answeredCount = 0;
let containerRef = null;

export function init(container) {
  containerRef = container;
  renderSetup(container);
  return () => {}; 
}

// === НАСТРОЙКА ИГРЫ ===
function renderSetup(container) {
  container.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div class="card" style="max-width: 500px; margin: 0 auto; text-align: center;">
        <h1 style="color: var(--gold); margin-bottom: 8px;">Своя игра</h1>
        <p class="subtitle">Выберите количество игроков и введите их имена</p>
        
        <select id="playerCount" class="fill-input" style="margin-bottom: 20px;">
          <option value="1">1 игрок</option>
          <option value="2" selected>2 игрока</option>
          <option value="3">3 игрока</option>
          <option value="4">4 игрока</option>
        </select>

        <div id="namesContainer" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;"></div>

        <button id="startJeopardyBtn" class="primary">Начать игру</button>
      </div>
    </div>
  `;

  const countSelect = document.getElementById('playerCount');
  const namesContainer = document.getElementById('namesContainer');

  const renderNameInputs = () => {
    const count = parseInt(countSelect.value, 10);
    namesContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      namesContainer.innerHTML += `
        <input type="text" class="fill-input player-name" data-idx="${i}" placeholder="Игрок ${i + 1}" value="Игрок ${i + 1}">
      `;
    }
  };

  countSelect.addEventListener('change', renderNameInputs);
  renderNameInputs();

  document.getElementById('startJeopardyBtn').addEventListener('click', () => {
    const inputs = document.querySelectorAll('.player-name');
    players = Array.from(inputs).map((inp, i) => ({
      name: inp.value.trim() || `Игрок ${i + 1}`,
      score: 0,
      color: COLORS[i % COLORS.length]
    }));
    currentPlayerIndex = 0;
    answeredCount = 0;
    generateBoard();
  });
}

// === ГЕНЕРАЦИЯ ПОЛЯ ===
function generateBoard() {
  const pool = TASKS.filter(t => t.type === 'choice');
  const byTopic = {};
  pool.forEach(q => {
    if (!byTopic[q.topic]) byTopic[q.topic] = [];
    byTopic[q.topic].push(q);
  });

  const availableTopics = Object.keys(byTopic).filter(t => byTopic[t].length >= ROWS);
  const selectedTopics = availableTopics.sort(() => Math.random() - 0.5).slice(0, COLS);

  boardData = selectedTopics.map(topicId => {
    const questions = byTopic[topicId].sort(() => Math.random() - 0.5).slice(0, ROWS);
    return {
      id: topicId,
      name: TOPICS[topicId] || topicId,
      questions: questions.map((q, i) => ({ ...q, value: POINTS[i], isAnswered: false }))
    };
  });

  renderBoard();
}

// === ОТРИСОВКА ПОЛЯ ===
function renderBoard() {
  // 1. Шапка с темами (выводим отдельно, чтобы она была ровно над колонками)
  let headerHtml = `
    <div style="display: grid; grid-template-columns: repeat(${COLS}, 1fr); gap: 10px; margin-bottom: 20px;">
      ${boardData.map(cat => `
        <div class="jeopardy-header" style="background: rgba(244,196,48,.15); border: 1px solid var(--gold); padding: 15px; text-align: center; font-weight: bold; color: var(--gold); border-radius: 10px; font-size: 13px;">
          ${cat.name}
        </div>
      `).join('')}
    </div>
  `;

  let cellsHtml = '';
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const q = boardData[col].questions[row];
      
      if (q.isAnswered) {
        // Пустая клетка
        cellsHtml += `
          <div style="background: transparent; border: 1px solid rgba(255,255,255,0.05); padding: 20px 10px; border-radius: 10px;"></div>
        `;
      } else {
        // Используем класс .jeopardy-cell вместо инлайн-стилей
        cellsHtml += `
          <button class="jeopardy-cell" data-col="${col}" data-row="${row}">
            ${q.value}
          </button>
        `;
      }
    }
  }

  // Отрисовка таблицы игроков
  const currentP = players[currentPlayerIndex];
  let playersHtml = players.map((p, i) => `
    <div style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 10px; background: ${i === currentPlayerIndex ? 'var(--gold-glow)' : 'var(--bg-card)'}; border: 1px solid ${i === currentPlayerIndex ? 'var(--gold)' : 'var(--border-color)'};">
      <span class="dot" style="background:${p.color}; width:12px; height:12px; border-radius:50%;"></span>
      <span style="font-weight: ${i === currentPlayerIndex ? 'bold' : 'normal'}; color: ${i === currentPlayerIndex ? 'var(--gold)' : 'var(--text-main)'};">${p.name}</span>
      <span style="margin-left: auto; font-weight: bold; color: var(--success);">${p.score}</span>
    </div>
  `).join('');

containerRef.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div class="card" style="padding: 20px; max-width: 1000px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 20px;">
          <div style="flex: 1;">
            <h1 style="margin: 0; color: var(--gold);">Своя игра</h1>
            <div style="margin-top: 10px; font-size: 14px; color: #b9a9d4;">Сейчас ходит: <b style="color:${currentP.color}">${currentP.name}</b></div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end;">
            ${playersHtml}
          </div>
        </div>
        
        <div class="jeopardy-board-wrapper">
          <div>
            ${headerHtml}
            <div id="jeopardyGrid" style="display: grid; grid-template-columns: repeat(${COLS}, 1fr); gap: 10px;">
              ${cellsHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  containerRef.querySelectorAll('.jeopardy-cell').forEach(btn => {
    btn.addEventListener('click', () => {
      const col = parseInt(btn.dataset.col, 10);
      const row = parseInt(btn.dataset.row, 10);
      const q = boardData[col].questions[row];
      openQuestion(q, btn);
    });
  });
}

// === ОТКРЫТИЕ ВОПРОСА ===
function openQuestion(q, cellBtn) {
  const allOptions = [q.answer, ...q.options].sort(() => Math.random() - 0.5);
  const currentP = players[currentPlayerIndex];

  const modal = document.createElement('div');
  modal.className = 'overlay';
  modal.innerHTML = `
    <div class="modal-card" style="position: relative;">
      <div style="display:flex; justify-content: space-between; font-size: 14px; margin-bottom: 16px;">
        <span style="color: var(--gold); text-transform: uppercase;">Вопрос на ${q.value} очков</span>
        <span style="color: ${currentP.color}; font-weight: bold;">Отвечает: ${currentP.name}</span>
      </div>
      
      <div class="q-text" style="font-size: 22px; margin-bottom: 24px;">${q.q}</div>
      <div class="q-options" style="display: flex; flex-direction: column; gap: 10px;">
        ${allOptions.map(opt => `<button class="opt" data-opt="${opt}">${opt}</button>`).join('')}
      </div>
      <div id="jeopardyFeedback" style="margin-top: 20px; font-size: 18px; font-weight: bold; min-height: 24px; text-align: center;"></div>
    </div>
  `;
  document.body.appendChild(modal);

  let answered = false;

  modal.querySelectorAll('.opt').forEach(optBtn => {
    optBtn.addEventListener('click', () => {
      if (answered) return;
      answered = true;

      const chosen = optBtn.dataset.opt;
      const isCorrect = chosen === q.answer;
      
      modal.querySelectorAll('.opt').forEach(b => {
        b.disabled = true;
        if (b.dataset.opt === q.answer) b.classList.add('correct');
        else if (b.dataset.opt === chosen) b.classList.add('wrong');
      });

      const fb = modal.querySelector('#jeopardyFeedback');
      if (isCorrect) {
        currentP.score += q.value;
        fb.innerHTML = `✅ Верно!<br><b>${currentP.name}</b> получает +${q.value} очков`;
        fb.style.color = '#4cc9a0';
      } else {
        currentP.score -= q.value;
        fb.innerHTML = `❌ Неверно!<br><b>${currentP.name}</b> теряет -${q.value} очков.<br>Переход хода.`;
        fb.style.color = '#ff8a8a';
        // Передаем ход следующему игроку (если игроков > 1)
        if (players.length > 1) {
          currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        }
      }

      const closeBtn = document.createElement('button');
      closeBtn.className = 'primary';
      closeBtn.style.marginTop = '20px';
      closeBtn.textContent = 'Продолжить';
      closeBtn.onclick = () => {
        modal.remove();
        
        q.isAnswered = true;
        
        answeredCount++;
        if (answeredCount === COLS * ROWS) {
          setTimeout(() => showEndScreen(), 300);
        } else {
          renderBoard(); 
        }
      };
      modal.querySelector('.modal-card').appendChild(closeBtn);
    });
  });
}

// === КОНЕЦ ИГРЫ ===
function showEndScreen() {
  // Сортируем игроков по очкам
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉'];

  containerRef.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div class="card" style="text-align: center; max-width: 600px; margin: 0 auto;">
        <h1 style="color: var(--gold);">Игра окончена!</h1>
        <div style="margin: 30px 0; display: flex; flex-direction: column; gap: 10px;">
          ${sorted.map((p, i) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: ${i === 0 ? 'rgba(244,196,48,.2)' : 'rgba(255,255,255,.05)'}; border-radius: 10px; border: 1px solid ${i === 0 ? 'var(--gold)' : 'transparent'};">
              <span style="font-size: 20px;">${medals[i] || (i+1) + '.'}</span>
              <span style="font-weight: bold; color: ${p.color};">${p.name}</span>
              <span style="font-weight: bold; font-size: 20px; color: #4cc9a0;">${p.score}</span>
            </div>
          `).join('')}
        </div>
        <button id="restartJeopardyBtn" class="primary">Играть снова</button>
      </div>
    </div>
  `;

  document.getElementById('restartJeopardyBtn').addEventListener('click', () => {
    init(containerRef);
  });
}