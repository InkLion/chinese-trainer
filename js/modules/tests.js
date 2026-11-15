// js/modules/tests.js
import { resolveQuestion, normalizeAnswer } from '../core/template.js';
import { addStat, getStats, addMistake, removeMistake, getMistakes } from '../core/storage.js';

let allTests = [];
let currentQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let currentTestName = "";
let isReviewMode = false;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export async function init(container) {
  try {
    const res = await fetch('tests.json?v=' + new Date().getTime());
    if (!res.ok) throw new Error('Не удалось загрузить tests.json');
    allTests = await res.json();
  } catch (e) {
    container.innerHTML = `<div class="card" style="color:red;">Ошибка загрузки тестов: ${e.message}</div>`;
    return () => {};
  }

  await renderTestList(container);
  return () => {}; 
}

async function renderTestList(container) {
  let html = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div style="text-align: center; margin-bottom: 40px; margin-top: 20px;">
        <h1 style="font-size: 48px; font-weight: 900; color: var(--gold); margin: 0; text-shadow: 0 0 30px var(--gold-glow); letter-spacing: 2px;">Тесты</h1>
        <p style="font-size: 16px; color: var(--text-muted); margin-top: 10px;">Выберите тему для проверки знаний</p>
      </div>
      <div id="testGrid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto;">
        ${Array(6).fill(`
          <div class="test-card" style="opacity: 0.5; pointer-events: none;">
            <div style="width: 60%; height: 24px; background: var(--bg-hover); border-radius: 4px; margin-bottom: 12px;"></div>
            <div style="width: 40%; height: 16px; background: var(--bg-hover); border-radius: 4px;"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  container.innerHTML = html;

  const grid = container.querySelector('#testGrid');

  try {
    const testData = await Promise.all(allTests.map(async (test) => {
      const [mistakes, stats] = await Promise.all([
        getMistakes(test.name),
        getStats(test.name)
      ]);
      return { test, mistakes, stats };
    }));

    grid.innerHTML = '';

    testData.forEach((data, index) => {
      const { test, mistakes, stats } = data;

      let displayCount = test.limit && test.limit < test.questions.length ? test.limit : test.questions.length;
      let bottomRowHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
          <div style="font-size: 14px; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 16px;">📚</span> Вопросов: <b>${displayCount}</b>
          </div>
      `;

      if (mistakes.length > 0) {
        bottomRowHtml += `<button class="review-btn-small" data-index="${index}">🔄 Повторить (${mistakes.length})</button>`;
      }
      bottomRowHtml += `</div>`;

      let lastResultHtml = '';
      if (stats.length > 0) {
        const last = stats[0];
        const isPerfect = (Number(last.correct) === Number(last.total) && Number(last.total) > 0);
        lastResultHtml = `<div style="font-size: 13px; color: ${isPerfect ? 'var(--success)' : 'var(--danger)'}; margin-top: 8px; background: var(--bg-card); padding: 4px 8px; border-radius: 6px; display: inline-block;">
          Последний раз: ${isPerfect ? 'Без ошибок' : 'С ошибками'}
        </div>`;
      }

      const card = document.createElement('div');
      card.className = 'test-card';
      card.innerHTML = `
        <div style="cursor: pointer; width: 100%; flex: 1;" class="test-click-area">
          <div style="font-weight: 800; font-size: 20px; color: var(--gold); margin-bottom: 10px;">${test.name}</div>
          ${lastResultHtml}
        </div>
        ${bottomRowHtml}
      `;

      card.querySelector('.test-click-area').addEventListener('click', () => startQuiz(container, index, false));
      
      const reviewBtn = card.querySelector('.review-btn-small');
      if (reviewBtn) {
        reviewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          startQuiz(container, index, true);
        });
      }

      grid.appendChild(card);
    });
  } catch (error) {
    grid.innerHTML = `<div style="color: var(--danger); text-align: center; grid-column: 1/-1;">Ошибка загрузки данных: ${error.message}</div>`;
  }
}

function startQuiz(container, testIndex, reviewMode = false) {
  const test = allTests[testIndex];
  currentTestName = test.name;
  isReviewMode = reviewMode;
  currentIndex = 0;
  correctCount = 0;

  const isMobile = window.innerWidth <= 768;
  let baseQuestions = test.questions;

  if (isMobile) {
    baseQuestions = baseQuestions.filter(q => q.qtype === 'choice' || q.qtype === 'match' || q.qtype === 'order');
  }

  if (baseQuestions.length === 0) {
    alert('Этот тест состоит только из заданий на ввод текста. Пожалуйста, используйте компьютер.');
    return;
  }

  if (reviewMode) {
    getMistakes(test.name).then(mistakes => {
      currentQuestions = baseQuestions.filter(q => mistakes.includes(q.prompt));
      if (currentQuestions.length === 0) {
        alert('Нет подходящих ошибок для повторения.');
        renderTestList(container);
        return;
      }
      showQuestion(container);
    });
  } else {
    let shuffled = [...baseQuestions].sort(() => Math.random() - 0.5);
    if (test.limit && test.limit > 0 && shuffled.length > test.limit) {
      shuffled = shuffled.slice(0, test.limit);
    }
    currentQuestions = shuffled;
    showQuestion(container);
  }
}

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
      <div style="margin-top: 24px;"><button id="nextBtn" class="primary hidden">Далее</button></div>
    </div>
  `;
  
  container.innerHTML = html;
  const answerArea = document.getElementById('answerArea');
  const nextBtn = document.getElementById('nextBtn');
  
  document.getElementById('abortBtn').addEventListener('click', () => renderTestList(container));
  nextBtn.addEventListener('click', () => {
    currentIndex++;
    showQuestion(container);
  });

  if (q.qtype === 'choice') {
    const correctText = q.options[q.correct];
    const shuffledOptions = shuffle(q.options);
    shuffledOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'opt';
      btn.textContent = opt;
      btn.onclick = async () => await checkAnswer(btn, opt, correctText, nextBtn, rawQ.prompt);
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
    btn.onclick = async () => {
      input.disabled = true;
      btn.classList.add('hidden');
      await checkAnswer(null, input.value, q.answer, nextBtn, rawQ.prompt);
    };
    answerArea.appendChild(btn);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    setTimeout(() => input.focus(), 50);
  }
  else if (q.qtype === 'order') {
    const pool = shuffle(q.words.map((w, i) => ({ text: w, id: i })));
    const picked = [];

    const answerBox = document.createElement('div');
    answerBox.className = 'order-answer';
    const poolBox = document.createElement('div');
    poolBox.className = 'order-pool';
    poolBox.style.marginBottom = '10px';
    
    answerArea.appendChild(answerBox);
    answerArea.appendChild(poolBox);

    function redraw() {
      answerBox.innerHTML = '';
      if (!picked.length) {
        const h = document.createElement('span');
        h.className = 'order-hint';
        h.textContent = 'Нажимайте на слова ниже, чтобы составить предложение…';
        answerBox.appendChild(h);
      } else {
        picked.forEach((item, idx) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'word-chip';
          b.textContent = item.text;
          b.onclick = () => {
            if (!nextBtn.classList.contains('hidden')) return;
            picked.splice(idx, 1);
            redraw();
          };
          answerBox.appendChild(b);
        });
      }

      poolBox.innerHTML = '';
      pool.forEach(item => {
        if (picked.includes(item)) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'word-chip';
        b.textContent = item.text;
        b.onclick = () => {
          if (!nextBtn.classList.contains('hidden')) return;
          picked.push(item);
          redraw();
          check();
        };
        poolBox.appendChild(b);
      });
    }

    async function check() {
      if (picked.length !== pool.length) return;
      const built = picked.map(x => x.text);
      
      let validAnswers = Array.isArray(q.answer[0]) ? q.answer : [q.answer];
      const ok = validAnswers.some(ans => built.length === ans.length && built.every((w, i) => w === ans[i]));
      
      answerArea.querySelectorAll('button').forEach(b => b.disabled = true);
      poolBox.querySelectorAll('button').forEach(b => b.disabled = true);

      await finishQuestion(ok, nextBtn, validAnswers[0].join(' '), rawQ.prompt);
    }

    redraw();
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
    btn.onclick = async () => {
      let allOk = true;
      inputs.forEach((inp, idx) => {
        const correct = q.fill_answers[idx];
        // Разбиваем правильные ответы по слэшу для каждого пропуска
        const validAnswers = String(correct).split('/').map(a => normalizeAnswer(a.trim()));
        
        if (!validAnswers.includes(normalizeAnswer(inp.value))) {
          allOk = false;
          inp.style.borderColor = 'var(--danger)';
        } else {
          inp.style.borderColor = 'var(--success)';
        }
        inp.disabled = true;
      });
      btn.classList.add('hidden');
      await finishQuestion(allOk, nextBtn, q.fill_answers.join(', '), rawQ.prompt);
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
    const rights = shuffle(q.pairs.map(p => p[1]));

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
      r.onclick = async () => {
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
            if (mistakes === 0) await finishQuestion(true, nextBtn, '', rawQ.prompt);
            else await finishQuestion(false, nextBtn, `Все пары собраны, но допущено ошибок: ${mistakes}`, rawQ.prompt);
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

async function checkAnswer(btn, userAns, correctAns, nextBtn, rawPrompt) {
  // Разбиваем правильный ответ по слэшу (если там несколько вариантов)
  const validAnswers = String(correctAns).split('/').map(a => normalizeAnswer(a.trim()));
  
  // Проверяем, совпадает ли ввод хотя бы с одним из вариантов
  const isCorrect = validAnswers.includes(normalizeAnswer(userAns));
  
  if (btn) {
    btn.disabled = true;
    if (btn.classList.contains('opt')) {
      if (isCorrect) btn.classList.add('correct');
      else {
        btn.classList.add('wrong');
        const allBtns = Array.from(btn.parentElement.querySelectorAll('.opt'));
        // Для подсветки правильной кнопки берем первый вариант
        const correctText = String(correctAns).split('/')[0].trim();
        const correctBtn = allBtns.find(b => b.textContent === correctText);
        if (correctBtn) correctBtn.classList.add('correct');
      }
    }
  }

  await finishQuestion(isCorrect, nextBtn, correctAns, rawPrompt);
}

async function finishQuestion(isCorrect, nextBtn, correctAnsText = '', rawPrompt = '') {
  nextBtn.classList.remove('hidden');
  const fb = document.getElementById('feedback');

  if (isCorrect) {
    correctCount++;
    fb.textContent = '✅ Верно!';
    fb.style.color = 'var(--success)';
    if (rawPrompt) await removeMistake(currentTestName, rawPrompt);
  } else {
    fb.textContent = `❌ Неверно. ${correctAnsText ? correctAnsText : ''}`;
    fb.style.color = 'var(--danger)';
    if (rawPrompt) await addMistake(currentTestName, rawPrompt);
  }
}

async function showResult(container) {
  const pct = Math.round((correctCount / currentQuestions.length) * 100);
  
  if (!isReviewMode) {
    await addStat(currentTestName, correctCount, currentQuestions.length);
  }

  container.innerHTML = `
    <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <h1 style="color: #f4c430;">${isReviewMode ? 'Повторение завершено!' : 'Тест завершён!'}</h1>
      <p style="font-size: 24px; margin: 20px 0;">Результат: <b>${correctCount} из ${currentQuestions.length}</b> (${pct}%)</p>
      <button id="backToTestsBtn" class="primary" style="margin-top: 20px;">Вернуться к тестам</button>
    </div>
  `;

  document.getElementById('backToTestsBtn').addEventListener('click', () => renderTestList(container));
}