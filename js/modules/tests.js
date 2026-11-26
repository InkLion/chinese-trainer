// js/modules/tests.js
import { resolveQuestion, normalizeAnswer } from '../core/template.js';
import { addStat, addMistake, removeMistake, getTestsOverview } from '../core/storage.js';
import { shuffle, escapeHtml } from '../core/utils.js';

const MOBILE_BREAKPOINT = 768;
// На телефоне ввод и пропуски неудобны — оставляем только выбор/пары/сборку.
const MOBILE_TYPES = new Set(['choice', 'match', 'order']);

let allTests = [];

/**
 * Текущая попытка. Раньше состояние лежало в пяти модульных переменных,
 * из-за чего после ухода со страницы «хвосты» старой попытки могли
 * дорисовываться в отсоединённый контейнер.
 * @type {null | {container: HTMLElement, testName: string, questions: any[], index: number, correct: number, review: boolean}}
 */
let session = null;

const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

function visibleQuestions(test) {
  const questions = Array.isArray(test?.questions) ? test.questions : [];
  return isMobile() ? questions.filter((q) => MOBILE_TYPES.has(q.qtype)) : questions;
}

/**
 * Для fill-вопроса prompt почти дословно повторяет fill_text.
 * Убираем дублирующую строку, чтобы текст не показывался дважды,
 * и подстраховываемся от оставшихся «{}» в формулировке.
 */
function fillPromptText(q) {
  const fill = String(q.fill_text || '').trim();
  const lines = String(q.prompt || '').split('\n');
  const filtered = lines.filter((line) => line.trim() !== fill);
  return filtered.join('\n').trim().replace(/\{\}/g, '____');
}

/** Сравнение свободного ответа с учётом альтернатив через «/». */
function matchesAnswer(userAnswer, correct) {
  const variants = Array.isArray(correct) ? correct : String(correct ?? '').split('/');
  const normalizedUser = normalizeAnswer(userAnswer);
  if (!normalizedUser) return false;
  return variants.some((variant) => normalizeAnswer(variant) === normalizedUser);
}

/** Человекочитаемый вид правильного ответа для сообщения об ошибке. */
function displayAnswer(correct) {
  if (Array.isArray(correct)) return correct.map(String).join(', ');
  return String(correct ?? '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' или ');
}

export async function init(container) {
  try {
    // Cache-busting оставлен: tests.json правится вручную и должен подхватываться.
    const res = await fetch('tests.json?v=' + Date.now());
    if (!res.ok) throw new Error('Не удалось загрузить tests.json');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('tests.json должен содержать массив разделов');
    allTests = data;
  } catch (e) {
    container.innerHTML = `<div class="card" style="color: var(--danger);">Ошибка загрузки тестов: ${escapeHtml(e.message)}</div>`;
    return () => {};
  }

  await renderTestList(container);
  return () => { session = null; };
}

async function renderTestList(container) {
  container.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div style="text-align: center; margin-bottom: 40px; margin-top: 20px;">
        <h1 style="font-size: 48px; font-weight: 900; color: var(--gold); margin: 0; text-shadow: 0 0 30px var(--gold-glow); letter-spacing: 2px;">Тесты</h1>
        <p class="subtitle" style="margin-top: 10px;">Выберите тему для проверки знаний</p>
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

  const grid = container.querySelector('#testGrid');
  if (!grid) return;

  // Один запрос на ошибки + по одному лёгкому запросу на последний результат.
  let overview = {};
  try {
    overview = await getTestsOverview(allTests.map((t) => t.name));
  } catch (e) {
    console.error('[tests] не удалось загрузить статистику', e);
  }

  if (!container.isConnected) return;

  grid.innerHTML = '';
  allTests.forEach((test, index) => {
    grid.appendChild(buildTestCard(container, test, index, overview[test.name] || {}));
  });

  if (!allTests.length) {
    grid.innerHTML = '<div style="color: var(--text-muted); grid-column: 1 / -1;">В tests.json пока нет тестов.</div>';
  }
}

function buildTestCard(container, test, index, info) {
  const pool = visibleQuestions(test);
  const allCount = Array.isArray(test.questions) ? test.questions.length : 0;
  const limit = Number(test.limit) > 0 ? Number(test.limit) : 0;
  const displayCount = limit ? Math.min(limit, pool.length) : pool.length;
  const mistakes = Array.isArray(info.mistakes) ? info.mistakes : [];
  const lastStat = info.lastStat || null;

  const lastResultHtml = lastStat
    ? `<div style="font-size: 13px; color: ${lastStat.correct === lastStat.total ? 'var(--success)' : 'var(--danger)'}; margin-top: 8px; background: var(--bg-card); padding: 4px 8px; border-radius: 6px; display: inline-block;">
        Последний раз: ${lastStat.correct} из ${lastStat.total}
      </div>`
    : '';

  const limitNote = limit && limit < allCount
    ? ` <span style="font-size:12px;font-weight:normal;">(из ${allCount})</span>`
    : '';

  const card = document.createElement('div');
  card.className = 'test-card';
  card.innerHTML = `
    <div class="test-click-area" style="cursor: pointer; width: 100%; flex: 1;">
      <div style="font-weight: 800; font-size: 20px; color: var(--gold); margin-bottom: 10px;">${escapeHtml(test.name)}</div>
      ${lastResultHtml}
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
      <div style="font-size: 14px; color: var(--text-muted);">
        <span aria-hidden="true">📚</span> Вопросов: <b>${displayCount}${limitNote}</b>
      </div>
      ${mistakes.length ? `<button type="button" class="review-btn-small" data-review="1">🔄 Повторить (${mistakes.length})</button>` : ''}
    </div>
  `;

  card.querySelector('.test-click-area').addEventListener('click', () => {
    // Передаем пустой массив ошибок, так как это обычный запуск
    startQuiz(container, index, false, []);
  });

  const reviewBtn = card.querySelector('[data-review]');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Передаем найденные ошибки для повторения
      startQuiz(container, index, true, mistakes);
    });
  }

  return card;
}

// ДОБАВЛЕН 4-й АРГУМЕНТ mistakes
async function startQuiz(container, testIndex, reviewMode = false, mistakes = []) {
  const test = allTests[testIndex];
  
  // Используем вашу функцию visibleQuestions, чтобы отфильтровать вопросы для мобилок
  let baseQuestions = visibleQuestions(test);

  if (baseQuestions.length === 0) {
    alert('Этот тест состоит только из заданий на ввод текста. Пожалуйста, используйте компьютер.');
    return;
  }

  if (reviewMode) {
    // ИСПОЛЬЗУЕМ ПЕРЕДАННЫЙ МАССИВ mistakes, а не вызываем несуществующую функцию
    let reviewQuestions = baseQuestions.filter(q => mistakes.includes(q.prompt));
    
    if (reviewQuestions.length === 0) {
      alert('Нет подходящих ошибок для повторения.');
      renderTestList(container);
      return;
    }

    // Инициализируем ваш объект session
    session = {
      container,
      testName: test.name,
      questions: reviewQuestions,
      index: 0,
      correct: 0,
      review: true
    };
    
    showQuestion();
  } else {
    // === ЛОГИКА С ОБЯЗАТЕЛЬНЫМИ ВОПРОСАМИ И ЛИМИТОМ ===
    const mandatoryQuestions = baseQuestions.filter(q => q.mandatory);
    const optionalQuestions = baseQuestions.filter(q => !q.mandatory);
    
    // Перемешиваем только необязательные вопросы
    let shuffledOptional = shuffle(optionalQuestions);
    let selectedQuestions = [...mandatoryQuestions];
    
    // Применяем лимит
    if (test.limit && test.limit > 0) {
      const needed = test.limit - mandatoryQuestions.length;
      if (needed > 0) {
        selectedQuestions = selectedQuestions.concat(shuffledOptional.slice(0, needed));
      }
    } else {
      selectedQuestions = selectedQuestions.concat(shuffledOptional);
    }
    
    // Инициализируем ваш объект session
    session = {
      container,
      testName: test.name,
      questions: shuffle(selectedQuestions), // Финальное перемешивание всего списка
      index: 0,
      correct: 0,
      review: false
    };
    
    showQuestion();
  }
}

function showQuestion() {
  const s = session;
  if (!s || !s.container.isConnected) return;

  if (s.index >= s.questions.length) {
    showResult();
    return;
  }

  const rawQ = s.questions[s.index];
  const q = resolveQuestion(rawQ);
  const promptText = q.qtype === 'fill' ? fillPromptText(q) : String(q.prompt || '');
  const hint = typeof q.hint === 'string' ? q.hint.trim() : '';

  s.container.innerHTML = `
    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div style="display:flex; justify-content: space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom: 16px; color: var(--text-muted); font-size: 14px;">
        <span>Вопрос ${s.index + 1} из ${s.questions.length}${s.review ? ' (Повторение)' : ''}</span>
        <span>Верно: ${s.correct}</span>
        <button type="button" id="abortBtn" style="background: transparent; border: 1px solid var(--danger); color: var(--danger); padding: 4px 10px; border-radius: 8px; cursor: pointer; font-size: 13px;">Прервать</button>
      </div>

      ${promptText ? `<div class="q-text">${escapeHtml(promptText)}</div>` : ''}
      ${hint ? `<details class="hint-box"><summary>💡 Подсказка</summary><div>${escapeHtml(hint)}</div></details>` : ''}

      <div id="answerArea" style="display: flex; flex-direction: column; gap: 10px;"></div>
      <div id="feedback" class="feedback" role="status" aria-live="polite" style="margin-top: 16px;"></div>

      <div style="margin-top: 24px;">
        <button type="button" id="nextBtn" class="primary hidden">Далее</button>
      </div>
    </div>
  `;

  const root = s.container;
  const answerArea = root.querySelector('#answerArea');
  const nextBtn = root.querySelector('#nextBtn');
  const feedback = root.querySelector('#feedback');
  const abortBtn = root.querySelector('#abortBtn');

  let answered = false;

  const finish = (isCorrect, correctText = '') => {
    if (answered) return;
    answered = true;
    finishQuestion({ isCorrect, nextBtn, feedback, correctText, rawPrompt: rawQ.prompt });
  };

  abortBtn.addEventListener('click', () => {
    answered = true;
    renderTestList(root);
  });

  nextBtn.addEventListener('click', () => {
    if (!answered || nextBtn.disabled) return;
    nextBtn.disabled = true;
    s.index++;
    showQuestion();
  });

  if (q.qtype === 'choice') {
    const options = Array.isArray(q.options) ? q.options : [];
    const correctText = Number.isInteger(q.correct) ? options[q.correct] : undefined;

    if (!options.length || correctText === undefined) {
      answered = true;
      feedback.textContent = 'Вопрос настроен некорректно: не заданы варианты или номер правильного ответа.';
      feedback.style.color = 'var(--danger)';
      nextBtn.classList.remove('hidden');
      return;
    }

    shuffle(options).forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (answered) return;
        answerArea.querySelectorAll('.opt').forEach((b) => { b.disabled = true; });
        const isCorrect = opt === correctText;
        if (isCorrect) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
          [...answerArea.querySelectorAll('.opt')]
            .find((b) => b.textContent === correctText)
            ?.classList.add('correct');
        }
        finish(isCorrect, isCorrect ? '' : correctText);
      });
      answerArea.appendChild(btn);
    });
    return;
  }

  if (q.qtype === 'input') {
    const input = document.createElement('input');
    input.className = 'fill-input';
    input.type = 'text';
    input.placeholder = 'Введите ответ...';
    input.spellcheck = false;
    input.autocomplete = 'off';
    input.setAttribute('aria-label', 'Ответ');
    answerArea.appendChild(input);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'primary';
    btn.textContent = 'Проверить';
    answerArea.appendChild(btn);

    const submit = () => {
      if (answered) return;
      const value = input.value.trim();
      if (!value) {
        input.focus();
        return;
      }
      input.disabled = true;
      btn.disabled = true;
      btn.classList.add('hidden');
      const isCorrect = matchesAnswer(value, q.answer);
      finish(isCorrect, isCorrect ? '' : displayAnswer(q.answer));
    };

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });
    setTimeout(() => { if (root.isConnected) input.focus(); }, 50);
    return;
  }

  if (q.qtype === 'order') {
    const words = Array.isArray(q.words) ? q.words : [];
    const pool = shuffle(words.map((w, i) => ({ text: w, id: i })));
    const picked = [];
    const answerVariants = Array.isArray(q.answer) && Array.isArray(q.answer[0])
      ? q.answer
      : [Array.isArray(q.answer) ? q.answer : []];

    const answerBox = document.createElement('div');
    answerBox.className = 'order-answer';
    const poolBox = document.createElement('div');
    poolBox.className = 'order-pool';
    poolBox.style.marginTop = '0';

    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'primary';
    checkBtn.textContent = 'Проверить';
    checkBtn.disabled = true;

    answerArea.appendChild(answerBox);
    answerArea.appendChild(poolBox);
    answerArea.appendChild(checkBtn);

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
          b.addEventListener('click', () => {
            if (answered) return;
            picked.splice(idx, 1);
            redraw();
          });
          answerBox.appendChild(b);
        });
      }

      poolBox.innerHTML = '';
      pool.forEach((item) => {
        if (picked.includes(item)) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'word-chip';
        b.textContent = item.text;
        b.addEventListener('click', () => {
          if (answered) return;
          picked.push(item);
          redraw();
        });
        poolBox.appendChild(b);
      });

      checkBtn.disabled = answered || picked.length !== pool.length;
    }

    checkBtn.addEventListener('click', () => {
      if (answered || picked.length !== pool.length) return;
      const built = picked.map((x) => x.text);
      const ok = answerVariants.some((variant) =>
        Array.isArray(variant) &&
        variant.length === built.length &&
        built.every((w, i) => w === variant[i])
      );
      answerArea.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      finish(ok, ok ? '' : displayAnswer(answerVariants[0]));
    });

    redraw();
    return;
  }

  if (q.qtype === 'fill') {
    const parts = String(q.fill_text || '').split('{}');
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
        input.setAttribute('aria-label', `Пропуск ${i + 1}`);
        input.style.cssText = 'width: 120px; display: inline-block; margin: 0 4px;';
        wrapper.appendChild(input);
        inputs.push(input);
      }
    });
    answerArea.appendChild(wrapper);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'primary';
    btn.textContent = 'Проверить';
    answerArea.appendChild(btn);

    const submit = () => {
      if (answered) return;
      const emptyInput = inputs.find((inp) => !inp.value.trim());
      if (emptyInput) {
        emptyInput.focus();
        return;
      }

      const answers = Array.isArray(q.fill_answers) ? q.fill_answers : [];
      let allOk = true;
      inputs.forEach((inp, idx) => {
        const ok = matchesAnswer(inp.value, answers[idx] ?? '');
        if (!ok) allOk = false;
        inp.style.borderColor = ok ? 'var(--success)' : 'var(--danger)';
        inp.disabled = true;
      });
      btn.disabled = true;
      btn.classList.add('hidden');
      finish(allOk, allOk ? '' : answers.join(', '));
    };

    btn.addEventListener('click', submit);
    inputs.forEach((inp) => {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submit();
        }
      });
    });
    if (inputs.length) setTimeout(() => { if (root.isConnected) inputs[0].focus(); }, 50);
    return;
  }

  if (q.qtype === 'match') {
    const pairs = Array.isArray(q.pairs) ? q.pairs : [];
    if (!pairs.length) {
      answered = true;
      feedback.textContent = 'Вопрос настроен некорректно: нет пар для соединения.';
      feedback.style.color = 'var(--danger)';
      nextBtn.classList.remove('hidden');
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'match-grid';
    const leftCol = document.createElement('div');
    leftCol.className = 'match-col';
    const rightCol = document.createElement('div');
    rightCol.className = 'match-col';
    grid.appendChild(leftCol);
    grid.appendChild(rightCol);

    let selectedLeft = null;
    let matched = 0;
    let errors = 0;
    const total = pairs.length;

    shuffle(pairs.map((pair, i) => ({ text: pair[0], id: i }))).forEach((left) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'match-item';
      btn.textContent = left.text;
      btn.addEventListener('click', () => {
        if (answered || btn.classList.contains('matched')) return;
        if (selectedLeft && selectedLeft !== btn) selectedLeft.classList.remove('selected');
        selectedLeft = btn;
        btn.classList.add('selected');
      });
      leftCol.appendChild(btn);
    });

    shuffle(pairs.map((pair) => ({ text: pair[1] }))).forEach((right) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'match-item';
      btn.textContent = right.text;
      btn.addEventListener('click', () => {
        if (answered || !selectedLeft || btn.classList.contains('matched')) return;

        const leftBtn = selectedLeft;
        const leftText = leftBtn.textContent;
        const isCorrect = pairs.some((pair) => pair[0] === leftText && pair[1] === right.text);

        if (isCorrect) {
          leftBtn.classList.remove('selected');
          leftBtn.classList.add('matched');
          btn.classList.add('matched');
          leftBtn.disabled = true;
          btn.disabled = true;
          selectedLeft = null;
          matched++;

          if (matched === total) {
            const ok = errors === 0;
            finish(ok, ok ? '' : `допущено ошибок: ${errors}`);
          }
        } else {
          errors++;
          btn.classList.add('wrong');
          leftBtn.classList.add('wrong');
          setTimeout(() => {
            btn.classList.remove('wrong');
            leftBtn.classList.remove('wrong');
            if (!answered) {
              leftBtn.classList.remove('selected');
              if (selectedLeft === leftBtn) selectedLeft = null;
            }
          }, 600);
        }
      });
      rightCol.appendChild(btn);
    });

    answerArea.appendChild(grid);
    return;
  }

  // Неизвестный qtype: не оставляем пользователя с пустым экраном.
  answered = true;
  feedback.textContent = `Неизвестный тип вопроса: «${q.qtype || 'не указан'}».`;
  feedback.style.color = 'var(--danger)';
  nextBtn.classList.remove('hidden');
}

async function finishQuestion({ isCorrect, nextBtn, feedback, correctText = '', rawPrompt = '' }) {
  const s = session;
  if (!s) return;

  nextBtn.classList.remove('hidden');

  if (isCorrect) {
    s.correct++;
    feedback.textContent = '✅ Верно!';
    feedback.style.color = 'var(--success)';
  } else {
    feedback.textContent = correctText ? `❌ Неверно. Правильный ответ: ${correctText}` : '❌ Неверно.';
    feedback.style.color = 'var(--danger)';
  }

  if (!rawPrompt) return;

  try {
    if (isCorrect) await removeMistake(s.testName, rawPrompt);
    else await addMistake(s.testName, rawPrompt);
  } catch (e) {
    // Сбой сети/RLS не должен ломать прохождение теста.
    console.error('[tests] не удалось обновить список ошибок', e);
  }
}

function showResult() {
  const s = session;
  if (!s || !s.container.isConnected) return;

  const total = s.questions.length;
  const pct = total ? Math.round((s.correct / total) * 100) : 0;

  if (!s.review) {
    addStat(s.testName, s.correct, total).catch((e) => console.error('[tests] addStat', e));
  }

  s.container.innerHTML = `
    <div class="card" style="max-width: 600px; margin: 0 auto; text-align: center;">
      <h1 style="color: var(--gold);">${s.review ? 'Повторение завершено!' : 'Тест завершён!'}</h1>
      <p style="font-size: 24px; margin: 20px 0;">Результат: <b>${s.correct} из ${total}</b> (${pct}%)</p>
      <p class="subtitle" style="margin-bottom: 20px;">${pct === 100 ? 'Отличная работа!' : pct >= 70 ? 'Хороший результат, но есть что повторить.' : 'Стоит повторить тему ещё раз.'}</p>
      <button type="button" id="backToTestsBtn" class="primary">Вернуться к тестам</button>
    </div>
  `;

  s.container.querySelector('#backToTestsBtn').addEventListener('click', () => {
    renderTestList(s.container);
  });
}