// js/modules/jeopardy.js
import { TASKS, TOPICS } from '../../tasks.js';
import { shuffle, escapeHtml } from '../core/utils.js';

const ROWS = 5;
const MAX_COLS = 5;
const POINTS = [100, 200, 300, 400, 500];
const COLORS = ['#e63946', '#3a86ff', '#2a9d8f', '#f4a261'];

let players = [];
let currentPlayerIndex = 0;
/** @type {Array<{id: string, name: string, questions: any[]}>} */
let boardData = [];
let answeredCount = 0;
let totalCells = 0;
let containerRef = null;

export function init(container) {
  containerRef = container;
  renderSetup(container);
  return cleanup;
}

/**
 * Модалка вопроса добавляется в document.body, а не в контейнер страницы.
 * Без явной очистки оверлей оставался висеть поверх нового раздела.
 */
function cleanup() {
  document.querySelectorAll('.overlay.jeopardy-modal').forEach((el) => el.remove());
}

// === НАСТРОЙКА ИГРЫ ===
function renderSetup(container) {
  players = [];
  boardData = [];
  answeredCount = 0;
  totalCells = 0;

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

        <button type="button" id="startJeopardyBtn" class="primary">Начать игру</button>
      </div>
    </div>
  `;

  const countSelect = container.querySelector('#playerCount');
  const namesContainer = container.querySelector('#namesContainer');

  const renderNameInputs = () => {
    const count = Math.max(1, Math.min(COLORS.length, parseInt(countSelect.value, 10) || 1));
    namesContainer.replaceChildren();
    for (let i = 0; i < count; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'fill-input player-name';
      input.dataset.idx = String(i);
      input.maxLength = 20;
      input.placeholder = `Игрок ${i + 1}`;
      input.value = `Игрок ${i + 1}`;
      namesContainer.appendChild(input);
    }
  };

  countSelect.addEventListener('change', renderNameInputs);
  renderNameInputs();

  container.querySelector('#startJeopardyBtn').addEventListener('click', () => {
    const inputs = [...container.querySelectorAll('.player-name')];
    players = inputs.map((inp, i) => ({
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
  const pool = TASKS.filter(
    (t) => t.type === 'choice' && Array.isArray(t.options) && typeof t.answer === 'string'
  );

  /** @type {Map<string, any[]>} */
  const byTopic = new Map();
  pool.forEach((q) => {
    if (!byTopic.has(q.topic)) byTopic.set(q.topic, []);
    byTopic.get(q.topic).push(q);
  });

  const availableTopics = [...byTopic.keys()].filter((topic) => byTopic.get(topic).length >= ROWS);
  if (!availableTopics.length) {
    alert('В банке заданий нет тем с пятью вопросами для «Своей игры».');
    return;
  }

  const selectedTopics = shuffle(availableTopics).slice(0, MAX_COLS);

  boardData = selectedTopics.map((topicId) => {
    const questions = shuffle(byTopic.get(topicId))
      .slice(0, ROWS)
      .map((q, i) => ({ ...q, value: POINTS[i], isAnswered: false }));
    return {
      id: topicId,
      name: TOPICS[topicId] || topicId,
      questions
    };
  });

  // Считаем реальные клетки: раньше проверка была на 5×5, и при меньшем
  // числе тем игра никогда не заканчивалась.
  totalCells = boardData.reduce((sum, cat) => sum + cat.questions.length, 0);
  answeredCount = 0;

  renderBoard();
}

// === ОТРИСОВКА ПОЛЯ ===
function renderBoard() {
  const cols = boardData.length;
  if (!cols) return;

  const headerHtml = `
    <div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 10px; margin-bottom: 20px;">
      ${boardData.map((cat) => `
        <div class="jeopardy-header" style="background: rgba(244,196,48,.15); border: 1px solid var(--gold); padding: 15px; text-align: center; font-weight: bold; color: var(--gold); border-radius: 10px; font-size: 13px;">
          ${escapeHtml(cat.name)}
        </div>
      `).join('')}
    </div>
  `;

  let cellsHtml = '';
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < cols; col++) {
      const q = boardData[col].questions[row];
      if (!q) {
        cellsHtml += '<div style="border: 1px solid transparent;"></div>';
      } else if (q.isAnswered) {
        cellsHtml += '<div style="background: transparent; border: 1px solid rgba(255,255,255,0.05); padding: 20px 10px; border-radius: 10px;"></div>';
      } else {
        cellsHtml += `
          <button type="button" class="jeopardy-cell" data-col="${col}" data-row="${row}">
            ${q.value}
          </button>
        `;
      }
    }
  }

  const currentP = players[currentPlayerIndex];
  if (!currentP) return;

  const playersHtml = players.map((p, i) => `
    <div style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 10px; background: ${i === currentPlayerIndex ? 'var(--gold-glow)' : 'var(--bg-card)'}; border: 1px solid ${i === currentPlayerIndex ? 'var(--gold)' : 'var(--border-color)'};">
      <span class="dot" style="background:${p.color}; width:12px; height:12px; border-radius:50%;"></span>
      <span style="font-weight: ${i === currentPlayerIndex ? 'bold' : 'normal'}; color: ${i === currentPlayerIndex ? 'var(--gold)' : 'var(--text-main)'};">${escapeHtml(p.name)}</span>
      <span style="margin-left: auto; font-weight: bold; color: var(--success);">${p.score}</span>
    </div>
  `).join('');

  containerRef.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div class="card" style="padding: 20px; max-width: 1000px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <h1 style="margin: 0; color: var(--gold);">Своя игра</h1>
            <div style="margin-top: 10px; font-size: 14px; color: var(--text-muted);">Сейчас ходит: <b style="color:${currentP.color}">${escapeHtml(currentP.name)}</b></div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end;">
            ${playersHtml}
          </div>
        </div>

        <div class="jeopardy-board-wrapper">
          <div>
            ${headerHtml}
            <div id="jeopardyGrid" style="display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 10px;">
              ${cellsHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  containerRef.querySelectorAll('.jeopardy-cell').forEach((btn) => {
    btn.addEventListener('click', () => {
      const col = parseInt(btn.dataset.col, 10);
      const row = parseInt(btn.dataset.row, 10);
      const q = boardData[col]?.questions[row];
      if (q && !q.isAnswered) openQuestion(q);
    });
  });
}

// === ОТКРЫТИЕ ВОПРОСА ===
function openQuestion(q) {
  // Уже открыт один вопрос — второй оверлей не создаём.
  if (document.querySelector('.overlay.jeopardy-modal')) return;

  const currentP = players[currentPlayerIndex];
  if (!currentP) return;

  const allOptions = shuffle([q.answer, ...q.options]);

  const modal = document.createElement('div');
  modal.className = 'overlay jeopardy-modal';
  modal.innerHTML = `
    <div class="modal-card" style="position: relative;">
      <div style="display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; font-size: 14px; margin-bottom: 16px;">
        <span style="color: var(--gold); text-transform: uppercase;">Вопрос на ${q.value} очков</span>
        <span style="color: ${currentP.color}; font-weight: bold;">Отвечает: ${escapeHtml(currentP.name)}</span>
      </div>

      <div class="q-text" id="jeopardyQuestion" style="font-size: 22px; margin-bottom: 24px;"></div>
      <div class="q-options" style="display: flex; flex-direction: column; gap: 10px;"></div>
      <div id="jeopardyFeedback" role="status" aria-live="polite" style="margin-top: 20px; font-size: 18px; font-weight: bold; min-height: 24px; text-align: center;"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Текст вопроса — только через textContent: раньше он вставлялся как HTML.
  modal.querySelector('#jeopardyQuestion').textContent = q.q || '';

  const optionsBox = modal.querySelector('.q-options');
  const feedback = modal.querySelector('#jeopardyFeedback');
  let answered = false;

  const closeAndContinue = () => {
    modal.remove();
    q.isAnswered = true;
    answeredCount++;

    if (answeredCount >= totalCells) {
      showEndScreen();
    } else {
      renderBoard();
    }
  };

  allOptions.forEach((opt) => {
    const optBtn = document.createElement('button');
    optBtn.type = 'button';
    optBtn.className = 'opt';
    optBtn.textContent = opt;

    optBtn.addEventListener('click', () => {
      if (answered) return;
      answered = true;

      // Значение сравниваем напрямую, а не через data-атрибут:
      // кавычки и «&» в тексте больше не ломают разметку и проверку.
      const isCorrect = opt === q.answer;

      optionsBox.querySelectorAll('.opt').forEach((b) => {
        b.disabled = true;
        if (b.textContent === String(q.answer)) b.classList.add('correct');
        else if (b === optBtn) b.classList.add('wrong');
      });

      if (isCorrect) {
        currentP.score += q.value;
        feedback.textContent = `✅ Верно! ${currentP.name} получает +${q.value} очков`;
        feedback.style.color = 'var(--success)';
      } else {
        currentP.score -= q.value;
        feedback.textContent = `❌ Неверно! ${currentP.name} теряет ${q.value} очков. Переход хода.`;
        feedback.style.color = 'var(--danger)';
        if (players.length > 1) {
          currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        }
      }

      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'primary';
      closeBtn.style.marginTop = '20px';
      closeBtn.textContent = 'Продолжить';
      closeBtn.addEventListener('click', closeAndContinue);
      modal.querySelector('.modal-card').appendChild(closeBtn);
    });

    optionsBox.appendChild(optBtn);
  });
}

// === КОНЕЦ ИГРЫ ===
function showEndScreen() {
  cleanup();

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const medals = ['🥇', '🥈', '🥉'];

  containerRef.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div class="card" style="text-align: center; max-width: 600px; margin: 0 auto;">
        <h1 style="color: var(--gold);">Игра окончена!</h1>
        <div style="margin: 30px 0; display: flex; flex-direction: column; gap: 10px;">
          ${sorted.map((p, i) => `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 20px; background: ${i === 0 ? 'rgba(244,196,48,.2)' : 'rgba(255,255,255,.05)'}; border-radius: 10px; border: 1px solid ${i === 0 ? 'var(--gold)' : 'transparent'};">
              <span style="font-size: 20px;">${medals[i] || (i + 1) + '.'}</span>
              <span style="font-weight: bold; color: ${p.color};">${escapeHtml(p.name)}</span>
              <span style="font-weight: bold; font-size: 20px; color: var(--success);">${p.score}</span>
            </div>
          `).join('')}
        </div>
        <button type="button" id="restartJeopardyBtn" class="primary">Играть снова</button>
      </div>
    </div>
  `;

  containerRef.querySelector('#restartJeopardyBtn').addEventListener('click', () => {
    init(containerRef);
  });
}
