// js/modules/jeopardy.js
import { TASKS, TOPICS } from '../../tasks.js';

// Настройки игры
const COLS = 5;
const ROWS = 5;
const POINTS = [100, 200, 300, 400, 500];

export function init(container) {
  // 1. Фильтруем только вопросы с выбором ответа
  const pool = TASKS.filter(t => t.type === 'choice');
  
  // 2. Группируем по темам
  const byTopic = {};
  pool.forEach(q => {
    if (!byTopic[q.topic]) byTopic[q.topic] = [];
    byTopic[q.topic].push(q);
  });

  // 3. Выбираем 5 случайных тем, в которых достаточно вопросов
  const availableTopics = Object.keys(byTopic).filter(t => byTopic[t].length >= ROWS);
  const selectedTopics = availableTopics.sort(() => Math.random() - 0.5).slice(0, COLS);

  if (selectedTopics.length < COLS) {
    container.innerHTML = '<div class="card">Недостаточно тем для создания поля.</div>';
    return () => {};
  }

  // 4. Генерируем структуру поля
  const boardData = selectedTopics.map(topicId => {
    // Берем 5 случайных вопросов из темы и сортируем по сложности (здесь просто случайно)
    const questions = byTopic[topicId].sort(() => Math.random() - 0.5).slice(0, ROWS);
    return {
      id: topicId,
      name: TOPICS[topicId] || topicId,
      questions: questions.map((q, i) => ({ ...q, value: POINTS[i] }))
    };
  });

  let score = 0;
  let answeredCount = 0;

  // === ОТРИСОВКА ПОЛЯ ===
  function renderBoard() {
    // 1. Шапка с темами (выводим отдельно, чтобы она была ровно над колонками)
    let headerHtml = `
      <div style="display: grid; grid-template-columns: repeat(${COLS}, 1fr); gap: 10px; margin-bottom: 20px;">
        ${boardData.map(cat => `
          <div style="background: rgba(244,196,48,.15); border: 1px solid var(--gold); padding: 15px; text-align: center; font-weight: bold; color: var(--gold); border-radius: 10px; font-size: 14px;">
            ${cat.name}
          </div>
        `).join('')}
      </div>
    `;

    // 2. Сетка с кнопками (выводим СТРОКАМИ: сначала 100 везде, потом 200 везде...)
    let cellsHtml = '';
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const q = boardData[col].questions[row];
        cellsHtml += `
          <button class="jeopardy-cell" data-col="${col}" data-row="${row}" 
            style="background: #2c1533; border: 1px solid var(--border); color: #fff; font-size: 24px; font-weight: bold; padding: 20px 10px; border-radius: 10px; cursor: pointer; transition: 0.2s;">
            ${q.value}
          </button>
        `;
      }
    }

    container.innerHTML = `
      <div class="card" style="padding: 20px; max-width: 1000px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h1 style="margin: 0; color: var(--gold);">Своя игра</h1>
          <div style="font-size: 20px; font-weight: bold;">Счёт: <span id="jeopardyScore" style="color: #4cc9a0;">${score}</span></div>
        </div>
        
        ${headerHtml}
        
        <div id="jeopardyGrid" style="display: grid; grid-template-columns: repeat(${COLS}, 1fr); gap: 10px;">
          ${cellsHtml}
        </div>
      </div>
    `;

    // Вешаем обработчики на кнопки поля
    container.querySelectorAll('.jeopardy-cell').forEach(btn => {
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
    // 1. Объединяем правильный ответ и неправильные варианты, затем перемешиваем
    const allOptions = [q.answer, ...q.options].sort(() => Math.random() - 0.5);

    const modal = document.createElement('div');
    modal.className = 'overlay';
    modal.innerHTML = `
      <div class="modal-card" style="position: relative;">
        <div style="font-size: 14px; color: var(--gold); margin-bottom: 16px; text-transform: uppercase;">Вопрос на ${q.value} очков</div>
        <div class="q-text" style="font-size: 22px; margin-bottom: 24px;">${q.q}</div>
        <div class="q-options" style="display: flex; flex-direction: column; gap: 10px;">
          <!-- ИСПОЛЬЗУЕМ allOptions ВМЕСТО q.options -->
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
        
        // Подсветка кнопок
        modal.querySelectorAll('.opt').forEach(b => {
          b.disabled = true;
          if (b.dataset.opt === q.answer) b.classList.add('correct');
          else if (b.dataset.opt === chosen) b.classList.add('wrong');
        });

        const fb = modal.querySelector('#jeopardyFeedback');
        if (isCorrect) {
          score += q.value;
          fb.textContent = `✅ Верно! +${q.value} очков`;
          fb.style.color = '#4cc9a0';
        } else {
          score -= q.value;
          fb.textContent = `❌ Неверно! -${q.value} очков`;
          fb.style.color = '#ff8a8a';
        }

        container.querySelector('#jeopardyScore').textContent = score;

        // Добавляем кнопку закрытия
        const closeBtn = document.createElement('button');
        closeBtn.className = 'primary';
        closeBtn.style.marginTop = '20px';
        closeBtn.textContent = 'Продолжить';
        closeBtn.onclick = () => {
          modal.remove();
          // Помечаем клетку как сыгранную
          cellBtn.style.background = 'transparent';
          cellBtn.style.borderColor = 'transparent';
          cellBtn.style.color = 'transparent';
          cellBtn.style.pointerEvents = 'none';
          
          answeredCount++;
          if (answeredCount === COLS * ROWS) {
            setTimeout(() => showEndScreen(), 300);
          }
        };
        modal.querySelector('.modal-card').appendChild(closeBtn);
      });
    });
  }
  
  // === КОНЕЦ ИГРЫ ===
  function showEndScreen() {
    container.innerHTML = `
      <div class="card" style="text-align: center; max-width: 600px; margin: 0 auto;">
        <h1 style="color: var(--gold);">Игра окончена!</h1>
        <p style="font-size: 24px; margin: 20px 0;">Ваш итоговый счёт: <b style="color: #4cc9a0;">${score}</b></p>
        <button id="restartJeopardyBtn" class="primary">Играть снова</button>
      </div>
    `;

    // Вызываем init(container) заново, чтобы полностью сбросить и пересоздать поле
    document.getElementById('restartJeopardyBtn').addEventListener('click', () => {
      init(container);
    });
  }

  // Запуск
  renderBoard();
  
  return () => {};
}