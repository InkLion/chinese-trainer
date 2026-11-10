// js/modules/tests.js
import { resolveQuestion, normalizeAnswer } from '../core/template.js';
import { addStat, getStats, addMistake, removeMistake, getMistakes } from '../core/storage.js';

let allTests = [];
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let currentTestName = "";
let isReviewMode = false; // Флаг: проходим ли мы тест по ошибкам

export async function init(container) {
  try {
    const res = await fetch('tests.json');
    if (!res.ok) throw new Error('Не удалось загрузить tests.json');
    allTests = await res.json();
  } catch (e) {
    container.innerHTML = `<div class="card" style="color:red;">Ошибка загрузки тестов: ${e.message}</div>`;
    return () => {};
  }

  renderTestList(container);
  return () => {}; 
}

// === ОТРИСОВКА СПИСКА ТЕСТОВ ===
function renderTestList(container) {
  let html = `
    <div class="card">
      <h1 style="text-align:center;margin-top:8px;">Тесты</h1>
      <p class="subtitle" style="text-align:center;">Выберите тему для проверки знаний</p>
      <div id="testGrid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; margin-top: 20px;"></div>
    </div>
  `;
  container.innerHTML = html;

  const grid = container.querySelector('#testGrid');

  allTests.forEach((test, index) => {
    const mistakes = getMistakes(test.name);
    const stats = getStats(test.name);
    
    // Формируем статистику для отображения
    let statsHtml = `<div style="font-size: 13px; color: #b9a9d4; margin-top: 4px;">Вопросов: ${test.questions.length}</div>`;
    if (stats.length > 0) {
      const last = stats[stats.length - 1];
      const pct = Math.round((last.correct / last.total) * 100);
      statsHtml += `<div style="font-size: 12px; color: #f4c430; margin-top: 4px;">Последний раз: ${last.correct}/${last.total} (${pct}%)</div>`;
    }

    const card = document.createElement('div');
    card.className = 'player-row';
    card.style.cssText = 'flex-direction: column; align-items: flex-start; padding: 16px;';
    
    // Сама карточка теста
    card.innerHTML = `
      <div style="width: 100%; cursor: pointer;" id="test-name-${index}">
        <div style="font-weight: 800; font-size: 18px; color: #f4c430; margin-bottom: 8px;">${test.name}</div>
        ${statsHtml}
      </div>
    `;
    
    // Кнопка запуска обычного теста
    card.querySelector(`#test-name-${index}`).addEventListener('click', () => {
      startQuiz(container, index, false);
    });

    // Если есть ошибки, добавляем кнопку "Повторить ошибки"
    if (mistakes.length > 0) {
      const reviewBtn = document.createElement('button');
      reviewBtn.textContent = `Повторить ошибки (${mistakes.length})`;
      reviewBtn.style.cssText = 'margin-top: 12px; font-size: 13px; padding: 6px 12px; background: rgba(255, 138, 138, 0.2); border: 1px solid #ff8a8a; color: #ff8a8a; width: 100%;';
      reviewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startQuiz(container, index, true);
      });
      card.appendChild(reviewBtn);
    }
    
    grid.appendChild(card);
  });
}

// === ЗАПУСК ТЕСТА ===
function startQuiz(container, testIndex, reviewMode = false) {
  const test = allTests[testIndex];
  currentTestName = test.name;
  isReviewMode = reviewMode;

  if (reviewMode) {
    const mistakes = getMistakes(test.name);
    // Берем только те вопросы, где prompt совпадает с сохраненными ошибками
    currentQuestions = test.questions.filter(q => mistakes.includes(q.prompt));
  } else {
    // Берем все вопросы и перемешиваем
    currentQuestions = [...test.questions].sort(() => Math.random() - 0.5);
  }

  currentIndex = 0;
  correctCount = 0;

  showQuestion(container);
}

// === ОТРИСОВКА ВОПРОСА ===
function showQuestion(container) {
  if (currentIndex >= currentQuestions.length) {
    showResult(container);
    return;
  }

  const rawQ = currentQuestions[currentIndex];
  const q = resolveQuestion(rawQ);

  let html = `
    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: #b9a9d4; font-size: 14px;">
        <span>Вопрос ${currentIndex + 1} из ${currentQuestions.length} ${isReviewMode ? '(Повторение)' : ''}</span>
        <span>Верно: ${correctCount}</span>
        <button id="abortBtn" style="background: transparent; border: 1px solid #ff8a8a; color: #ff8a8a; padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 13px;">Прервать</button>
      </div>
      
      <div class="q-text" style="margin-bottom: 24px; font-size: 22px;">${q.prompt}</div>
      <div id="answerArea" style="display: flex; flex-direction: column; gap: 10px;"></div>
      <div id="feedback" style="margin-top: 16px; font-weight: bold; min-height: 24px;"></div>
      
      <div style="margin-top: 24px;">
        <button id="nextBtn" class="primary hidden">Далее</button>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  const answerArea = document.getElementById('answerArea');
  const nextBtn = document.getElementById('nextBtn');
  
  document.getElementById('abortBtn').addEventListener('click', () => {
    renderTestList(container);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex++;
    showQuestion(container);
  });

  if (q.qtype === 'choice') {
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'opt';
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(btn, opt, q.options[q.correct], nextBtn, rawQ.prompt);
      answerArea.appendChild(btn);
    });
  } 
  else if (q.qtype === 'input') {
    const input = document.createElement('input');
    input.className = 'fill-input';
    input.placeholder = 'Введите ответ...';
    input.spellcheck = false;
    input.autocomplete = 'off';
    answerArea.appendChild(input);
    
    const btn = document.createElement('button');
    btn.className = 'primary';
    btn.textContent = 'Проверить';
    btn.onclick = () => {
      input.disabled = true;
      btn.classList.add('hidden');
      checkAnswer(null, input.value, q.answer, nextBtn, rawQ.prompt);
    };
    answerArea.appendChild(btn);
    
    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    setTimeout(() => input.focus(), 50);
  }
  else if (q.qtype === 'fill') {
    const parts = q.fill_text.split('{}');
    const inputs = [];
    const wrapper = document.createElement('div');
    wrapper.style.lineHeight = '2.5';
    
    parts.forEach((part, i) => {
      wrapper.appendChild(document.createTextNode(part));
      if (i < parts.length - 1) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'fill-input';
        input.spellcheck = false;
        input.autocomplete = 'off';
        input.style.cssText = 'width: 100px; display: inline-block; margin: 0 4px;';
        wrapper.appendChild(input);
        inputs.push(input);
      }
    });
    answerArea.appendChild(wrapper);

    const btn = document.createElement('button');
    btn.className = 'primary';
    btn.textContent = 'Проверить';
    btn.onclick = () => {
      let allOk = true;
      inputs.forEach((inp, idx) => {
        const correct = q.fill_answers[idx];
        if (normalizeAnswer(inp.value) !== normalizeAnswer(correct)) {
          allOk = false;
          inp.style.borderColor = '#e63946';
        } else {
          inp.style.borderColor = '#4cc9a0';
        }
        inp.disabled = true;
      });
      btn.classList.add('hidden');
      finishQuestion(allOk, nextBtn, q.fill_answers.join(', '), rawQ.prompt);
    };
    answerArea.appendChild(btn);
    if(inputs.length > 0) setTimeout(() => inputs[0].focus(), 50);
  }
  else if (q.qtype === 'match') {
    const leftCol = document.createElement('div');
    leftCol.className = 'match-col';
    const rightCol = document.createElement('div');
    rightCol.className = 'match-col';
    const grid = document.createElement('div');
    grid.className = 'match-grid';
    grid.appendChild(leftCol); grid.appendChild(rightCol);

    let selectedLeft = null;
    let matched = 0;
    let mistakes = 0;
    const total = q.pairs.length;
    const rights = q.pairs.map(p => p[1]).sort(() => Math.random() - 0.5);

    q.pairs.forEach((pair) => {
      const l = document.createElement('button');
      l.className = 'match-item';
      l.textContent = pair[0];
      l.onclick = () => {
        if (l.classList.contains('matched')) return;
        if (selectedLeft) selectedLeft.classList.remove('selected');
        selectedLeft = l;
        l.classList.add('selected');
      };
      leftCol.appendChild(l);
    });

    rights.forEach(rText => {
      const r = document.createElement('button');
      r.className = 'match-item';
      r.textContent = rText;
      r.onclick = () => {
        if (!selectedLeft || r.classList.contains('matched')) return;
        
        const leftText = selectedLeft.textContent;
        const isCorrect = q.pairs.some(p => p[0] === leftText && p[1] === r.textContent);

        if (isCorrect) {
          selectedLeft.classList.remove('selected');
          selectedLeft.classList.add('matched');
          r.classList.add('matched');
          selectedLeft = null;
          matched++;
          
          if (matched === total) {
            if (mistakes === 0) {
              finishQuestion(true, nextBtn, '', rawQ.prompt);
            } else {
              finishQuestion(false, nextBtn, `Все пары собраны, но допущено ошибок: ${mistakes}`, rawQ.prompt);
            }
          }
        } else {
          mistakes++;
          r.classList.add('wrong');
          selectedLeft.classList.add('wrong');
          setTimeout(() => {
            r.classList.remove('wrong');
            if (selectedLeft) {
              selectedLeft.classList.remove('wrong');
              selectedLeft.classList.remove('selected');
            }
            selectedLeft = null;
          }, 600);
        }
      };
      rightCol.appendChild(r);
    });

    answerArea.appendChild(grid);
  }
}

function checkAnswer(btn, userAns, correctAns, nextBtn, rawPrompt) {
  const isCorrect = normalizeAnswer(userAns) === normalizeAnswer(correctAns);
  
  if (btn) {
    btn.disabled = true;
    if (btn.classList.contains('opt')) {
      if (isCorrect) btn.classList.add('correct');
      else {
        btn.classList.add('wrong');
        const allBtns = Array.from(btn.parentElement.querySelectorAll('.opt'));
        const correctBtn = allBtns.find(b => b.textContent === correctAns);
        if (correctBtn) correctBtn.classList.add('correct');
      }
    }
  }

  finishQuestion(isCorrect, nextBtn, correctAns, rawPrompt);
}

function finishQuestion(isCorrect, nextBtn, correctAnsText = '', rawPrompt = '') {
  nextBtn.classList.remove('hidden');

  const fb = document.getElementById('feedback');
  if (isCorrect) {
    correctCount++;
    fb.textContent = '✅ Верно!';
    fb.style.color = '#7ef0b0';
    
    // Если ответ верный — УДАЛЯЕМ вопрос из списка ошибок
    if (rawPrompt) removeMistake(currentTestName, rawPrompt);
    
  } else {
    fb.textContent = `❌ Неверно. ${correctAnsText ? correctAnsText : ''}`;
    fb.style.color = '#ff8a8a';
    
    // Если ответ неверный — ДОБАВЛЯЕМ вопрос в список ошибок
    if (rawPrompt) addMistake(currentTestName, rawPrompt);
  }
}

function showResult(container) {
  const pct = Math.round((correctCount / currentQuestions.length) * 100);
  
  // Сохраняем статистику попытки (только если это не режим повторения ошибок)
  // Или можно сохранять всегда, но давайте сохранять только полные тесты
  if (!isReviewMode) {
    addStat(currentTestName, correctCount, currentQuestions.length);
  }

  container.innerHTML = `
    <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <h1 style="color: #f4c430;">${isReviewMode ? 'Повторение завершено!' : 'Тест завершён!'}</h1>
      <p style="font-size: 24px; margin: 20px 0;">Результат: <b>${correctCount} из ${currentQuestions.length}</b> (${pct}%)</p>
      <button id="backToTestsBtn" class="primary" style="margin-top: 20px;">Вернуться к тестам</button>
    </div>
  `;

  document.getElementById('backToTestsBtn').addEventListener('click', () => {
    renderTestList(container);
  });
}