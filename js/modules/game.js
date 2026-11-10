// js/modules/game.js
// Игра «汉语大冒险» как модуль хаба.

import { TASKS } from '../../tasks.js';

export async function init(container) {
  const response = await fetch('js/modules/game.html');
  if (!response.ok) {
    container.innerHTML = '<div class="card">Не удалось загрузить игру.</div>';
    return () => {};
  }
  container.innerHTML = await response.text();
  return setup();
}

function setup() {

  /* =========================================================
   КОНСТАНТЫ
   ========================================================= */
  const COLORS = ['#e63946', '#3a86ff', '#2a9d8f', '#f4a261', '#9d4edd', '#ff006e'];
  const TYPE_LABELS = {
    choice: 'выберите ответ',
    image:  'картинка',
    fill:   'заполните пропуск',
    match:  'соедините пары',
    order:  'соберите предложение'
  };
  const SPECIALS = {
    gift: { icon: '🎁', label: 'Подарок' },
    trap: { icon: '💀', label: 'Ловушка' },
    star: { icon: '⭐', label: 'Звезда' },
    boost:{ icon: '🌀', label: 'Ускорение' }
  };
  const FINISH_BONUS = [6, 3, 1];
  // Обработка кнопки "Сдаться"
  const giveUpBtn = document.getElementById('giveUpBtn');
  if (giveUpBtn) {
    giveUpBtn.addEventListener('click', () => {
      // Проверяем, что сейчас реально идет вопрос и он еще не отвечен
      if (phase === 'question' && !taskLocked) {
        // Вызываем функцию неверного ответа. 
        // Она сбросит pending-очки, остановит таймер и покажет кнопку "Продолжить".
        resolveAnswer(false, 'Вы решили завершить ход');
      }
    });
  }

  /* =========================================================
     СОСТОЯНИЕ
     ========================================================= */
  let cfg = {
    boardSize: 15,
    topics: ['greetings','acquaintance','pronouns','family','numbers','time','date','daily','colors','pinyin'],
    taskTypes: ['choice','image','fill','match','order'],
    timer: true,
    timerSec: 25,
    specialCells: true,
    lifelines: true
  };

  let players = [];
  let specials = {};
  let cellEls = {};
  let currentIdx = 0;
  let phase = 'setup';       // setup | idle | rolling | question | animating | over
  let taskQueue = [];
  let finishCounter = 0;

  let turnState = { pending: 0, questionsLeft: 0, diceRoll: 0 };

  let currentPlayer = null;
  let currentTask = null;
  let currentTaskUI = { fifty: null, hint: null };
  let taskLocked = false;
  let afterWrong = false;

  let timerHandle = null;
  let timerEndTime = 0;
  let timerTotal = 0;

  let audioCtx = null;

  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* =========================================================
     УТИЛИТЫ
     ========================================================= */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }
  function normalizeAnswer(s) {
    const str = String(s).trim();
    // Если ответ содержит иероглифы — сравниваем только по ним
    if (/[\u4e00-\u9fff]/.test(str)) {
      return str.replace(/[^\u4e00-\u9fff]/g, '');
    }
    // Иначе — пиньинь: без тонов, пробелов, цифр-тонов
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[1-5]/g, '')
      .replace(/[^a-zа-яё]/g, '')
      .replace(/ё/g, 'е');
  }

  function getAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { audioCtx = null; }
    }
    return audioCtx;
  }
  function beep(freq, dur, type = 'sine', vol = 0.07) {
    const ctx = getAudio();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }
  const playTick    = () => beep(700, 0.03, 'square', 0.025);
  const playRoll    = () => beep(300, 0.12, 'triangle', 0.07);
  const playCorrect = () => { beep(660, 0.1, 'sine', 0.09); setTimeout(() => beep(880, 0.16, 'sine', 0.09), 100); };
  const playWrong   = () => { beep(220, 0.2, 'sawtooth', 0.07); setTimeout(() => beep(170, 0.26, 'sawtooth', 0.07), 120); };
  const playFinish  = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.22, 'sine', 0.09), i * 120));

  /* =========================================================
     НАСТРОЙКА
     ========================================================= */
  function buildNameInputs() {
    const count = +$('playerCount').value;
    const box = $('nameInputs');
    box.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const row = document.createElement('div');
      row.className = 'name-row';
      row.innerHTML = `
        <span class="dot" style="background:${COLORS[i]}"></span>
        <input id="name${i}" type="text" maxlength="14" value="Игрок ${i + 1}">
      `;
      box.appendChild(row);
    }
  }
  $('playerCount').addEventListener('change', buildNameInputs);
  buildNameInputs();

  $('startBtn').addEventListener('click', startGame);
  $('quitBtn').addEventListener('click', () => location.reload());
  $('rollBtn').addEventListener('click', rollDice);
  $('continueBtn').addEventListener('click', continueTurn);
  $('lockInBtn').addEventListener('click', lockIn);
  $('allTopicsBtn').addEventListener('click', () => {
    document.querySelectorAll('.task-types input[data-topic]').forEach(i => i.checked = true);
  });
  $('noneTopicsBtn').addEventListener('click', () => {
    document.querySelectorAll('.task-types input[data-topic]').forEach(i => i.checked = false);
  });

  /* Показать число заданий рядом с каждой темой */
  document.querySelectorAll('.task-types input[data-topic]').forEach(cb => {
    const n = TASKS.filter(t => t.topic === cb.dataset.topic).length;
    cb.parentElement.appendChild(document.createTextNode(' (' + n + ')'));
  });

  /* =========================================================
     СТАРТ
     ========================================================= */
  function startGame() {
    cfg.boardSize = +$('boardSize').value;
    cfg.timer = $('timerOn').checked;
    cfg.timerSec = +$('timerSec').value;
    cfg.specialCells = $('specialOn').checked;
    cfg.lifelines = $('lifelineOn').checked;
    cfg.taskTypes = [...document.querySelectorAll('.task-types input:checked')].map(i => i.dataset.type);
    cfg.topics = [...document.querySelectorAll('.task-types input[data-topic]:checked')].map(i => i.dataset.topic);

    if (!cfg.topics.length) {
      alert('Выберите хотя бы одну тему!');
      return;
    }
    if (!cfg.taskTypes.length) {
      alert('Выберите хотя бы один тип заданий!');
      return;
    }
    const allowed = getFilteredTasks();
    if (!allowed.length) {
      alert('В банке нет заданий с выбранными типами и темами.');
      return;
    }
    if (allowed.length < 30 && !confirm(
      `В выбранных темах всего ${allowed.length} заданий. ` +
      `При игре они будут часто повторяться. Продолжить?`
    )) return;

    players = [];
    const count = +$('playerCount').value;
    for (let i = 0; i < count; i++) {
      const name = ($('name' + i).value || '').trim() || ('Игрок ' + (i + 1));
      players.push({
        name,
        color: COLORS[i],
        pos: 0,
        score: 0,
        finished: false,
        finishOrder: 0,
        streak: 0,
        lifelines: { fifty: 2, hint: 1 },
        stats: { attempted: 0, correct: 0, byType: {} }
      });
    }

    currentIdx = 0;
    finishCounter = 0;
    phase = 'idle';
    turnState = { pending: 0, questionsLeft: 0, diceRoll: 0 };

    assignSpecials();
    refillQueue();

    $('setup').classList.add('hidden');
    $('game').classList.remove('hidden');

    buildBoard();
    render();
    log(`Игра началась! Поле: ${cfg.boardSize} клеток.`, 'sys');
    log(`Ход: ${players[0].name}`, 'sys');
  }

  /* =========================================================
     СПЕЦКЛЕТКИ
     ========================================================= */
  function assignSpecials() {
    specials = {};
    if (!cfg.specialCells) return;
    const total = cfg.boardSize;
    const candidates = [];
    for (let i = 3; i < total; i++) candidates.push(i);
    const count = Math.min(6, Math.floor(candidates.length * 0.35));
    const picked = shuffle(candidates).slice(0, count);
    const types = ['gift', 'trap', 'star', 'boost'];
    picked.forEach((cell, i) => { specials[cell] = types[i % types.length]; });
  }

  /* =========================================================
     ДОСКА
     ========================================================= */
  function buildBoard() {
    const board = $('board');
    board.innerHTML = '';
    cellEls = {};

    const cols = cfg.boardSize <= 15 ? 5 : cfg.boardSize <= 20 ? 5 : 6;
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 1; i <= cfg.boardSize; i++) {
      const row = Math.floor((i - 1) / cols);
      const colRaw = (i - 1) % cols;
      const col = (row % 2 === 0) ? colRaw : cols - 1 - colRaw;

      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.n = i;
      cell.style.gridRow = row + 1;
      cell.style.gridColumn = col + 1;

      let inner = `<span class="num">${i}</span>`;
      if (i === cfg.boardSize) {
        cell.classList.add('finish');
        inner += '🏁';
      } else if (specials[i]) {
        cell.classList.add('special-cell');
        inner += `<span class="special">${SPECIALS[specials[i]].icon}</span>`;
      }
      inner += '<div class="tokens"></div>';
      cell.innerHTML = inner;

      board.appendChild(cell);
      cellEls[i] = cell;
    }
  }

  /* =========================================================
     ОТРИСОВКА
     ========================================================= */
  function makeToken(p, active, ghost) {
    const t = document.createElement('div');
    t.className = 'token' + (active ? ' active' : '') + (ghost ? ' ghost' : '');
    t.style.background = p.color;
    t.textContent = p.name.charAt(0).toUpperCase();
    t.title = `${p.name} · ${p.score} б.`;
    return t;
  }

  function render() {
    Object.values(cellEls).forEach(c => {
      const t = c.querySelector('.tokens');
      if (t) t.innerHTML = '';
    });
    $('startTokens').innerHTML = '';

    players.forEach((p, idx) => {
      // Актуальная фишка
      const isCurrent = idx === currentIdx && phase !== 'over' && !p.finished;
      const token = makeToken(p, isCurrent, false);
      if (p.pos === 0) $('startTokens').appendChild(token);
      else if (cellEls[p.pos]) cellEls[p.pos].querySelector('.tokens').appendChild(token);

      // Призрачная фишка (где окажешься, если зафиксируешься)
      if (isCurrent && turnState.pending > 0) {
        const ghostPos = Math.min(p.pos + turnState.pending, cfg.boardSize);
        if (ghostPos !== p.pos) {
          const ghost = makeToken(p, false, true);
          if (ghostPos === 0) $('startTokens').appendChild(ghost);
          else if (cellEls[ghostPos]) cellEls[ghostPos].querySelector('.tokens').appendChild(ghost);
        }
      }
    });

    renderScoreboard();
    renderTurnInfo();
  }

  function renderScoreboard() {
    const sb = $('scoreboard');
    sb.innerHTML = '';
    players.forEach((p, idx) => {
      const row = document.createElement('div');
      row.className = 'player-row';
      if (idx === currentIdx && phase !== 'over' && !p.finished) row.classList.add('current');
      if (p.finished) row.classList.add('done');

      let status = p.finished ? `🏁 #${p.finishOrder}` : `${p.pos}/${cfg.boardSize}`;
      if (idx === currentIdx && turnState.pending > 0 && !p.finished) {
        status += ` <b style="color:#f4c430">+${turnState.pending}</b>`;
      }
      const streak = p.streak >= 2 ? ` <span class="streak">🔥${p.streak}</span>` : '';

      row.innerHTML = `
        <span class="dot" style="background:${p.color}"></span>
        <span class="nm">${escapeHtml(p.name)}${streak}</span>
        <span class="sc">${p.score}</span>
        <span class="ps">${status}</span>
      `;
      sb.appendChild(row);
    });
  }

  function renderTurnInfo() {
    if (phase === 'over') { $('turnInfo').textContent = '🏆 Игра окончена'; return; }
    const p = players[currentIdx];
    if (!p) return;
    let info = `Ход: <b style="color:${p.color}">${escapeHtml(p.name)}</b> · баллов: <b style="color:#f4c430">${p.score}</b>`;
    if (turnState.pending > 0) info += ` · в копилке: <b style="color:#f4c430">+${turnState.pending}</b>`;
    $('turnInfo').innerHTML = info;

    if (phase === 'idle') {
      $('rollBtn').disabled = false;
      $('rollBtn').textContent = 'Бросить кубик';
    } else {
      $('rollBtn').disabled = true;
      $('rollBtn').textContent = '...';
    }
  }

  function log(text, cls = '') {
    const el = document.createElement('div');
    el.className = cls;
    el.textContent = text;
    const box = $('log');
    box.prepend(el);
    while (box.children.length > 60) box.lastChild.remove();
  }

  /* =========================================================
     ОЧЕРЕДЬ ЗАДАНИЙ
     ========================================================= */
  function getFilteredTasks() {
    return TASKS.filter(t =>
      cfg.taskTypes.includes(t.type) && cfg.topics.includes(t.topic)
    );
  }

  function refillQueue() {
    taskQueue = shuffle(getFilteredTasks());
  }
  function nextTask() {
    if (!taskQueue.length) refillQueue();
    return taskQueue.pop() || null;
  }

  /* =========================================================
     КУБИК
     ========================================================= */
  async function animateDiceRoll(finalValue) {
    const diceEl = $('dice');
    for (let i = 0; i < 8; i++) {
      diceEl.textContent = 1 + Math.floor(Math.random() * 6);
      playTick();
      await sleep(60);
    }
    diceEl.textContent = finalValue;
  }

  async function rollDice() {
    if (phase !== 'idle') return;
    const p = players[currentIdx];
    if (p.finished) { endTurn(); return; }

    phase = 'rolling';
    $('rollBtn').disabled = true;

    const d = 1 + Math.floor(Math.random() * 6);
    await animateDiceRoll(d);
    playRoll();

    turnState.pending = 0;
    turnState.questionsLeft = d;
    turnState.diceRoll = d;

    log(`${p.name} бросает кубик: ${d} — доступно вопросов: ${d}`, 'sys');
    render();

    setTimeout(askNextQuestion, 400);
  }

  /* =========================================================
     ВОПРОСЫ ВНУТРИ ХОДА
     ========================================================= */
  function askNextQuestion() {
    afterWrong = false;
    if (turnState.questionsLeft <= 0) {
      bankAndEndTurn();
      return;
    }

    const p = players[currentIdx];
    const task = nextTask();
    if (!task) { bankAndEndTurn(); return; }

    taskLocked = false;
    currentPlayer = p;
    currentTask = task;
    currentTaskUI = { fifty: null, hint: null };

    const questionNum = turnState.diceRoll - turnState.questionsLeft + 1;

    $('qPlayer').textContent = p.name;
    $('qPlayer').style.color = p.color;
    $('qType').textContent = `${TYPE_LABELS[task.type] || 'задание'} · ${questionNum}/${turnState.diceRoll}`;
    $('qFeedback').textContent = '';
    $('qFeedback').className = 'feedback';
    $('choiceBtns').classList.add('hidden');
    $('lockInBtn').classList.remove('hidden'); 

    renderTask(task);
    updateLifelines();

    if (cfg.timer) startTimer();
    $('modal').classList.remove('hidden');
    phase = 'question';
  }

  function renderTask(task) {
    const body = $('qBody');
    body.innerHTML = '';
    switch (task.type) {
      case 'image': renderImage(task, body); break;
      case 'fill':  renderFill(task, body);  break;
      case 'match': renderMatch(task, body); break;
      case 'order': renderOrder(task, body); break;
      default:      renderChoice(task, body);
    }
  }

  function addQuestionText(body, html) {
    const el = document.createElement('div');
    el.className = 'q-text';
    el.innerHTML = html;
    body.appendChild(el);
  }

  /* ---------- выбор / картинка ---------- */
  function buildOptions(body, options, answer) {
    const box = document.createElement('div');
    box.className = 'q-options';

    shuffle([answer, ...options]).forEach(opt => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.textContent = opt;

      b.addEventListener('click', () => {
        if (taskLocked) return;
        if (opt === answer) {
          b.classList.add('correct');
          resolveAnswer(true);
        } else {
          b.classList.add('wrong');
          box.querySelectorAll('.opt').forEach(x => {
            if (x.textContent === answer) x.classList.add('correct');
          });
          resolveAnswer(false, 'Правильный ответ: ' + answer);
        }
      });

      box.appendChild(b);
    });

    body.appendChild(box);

    const wrongButtons = () =>
      [...box.querySelectorAll('.opt')].filter(b => !b.disabled && b.textContent !== answer);

    currentTaskUI.fifty = () => {
      const w = wrongButtons();
      if (w.length < 2) return false;
      shuffle(w).slice(0, 2).forEach(b => {
        b.disabled = true;
        b.style.opacity = '.25';
        b.style.textDecoration = 'line-through';
      });
      return true;
    };

    currentTaskUI.hint = () => {
      const w = wrongButtons();
      if (!w.length) return false;
      const b = shuffle(w)[0];
      b.disabled = true;
      b.style.opacity = '.25';
      b.style.textDecoration = 'line-through';
      return true;
    };
  }

  function renderChoice(task, body) {
    addQuestionText(body, escapeHtml(task.q));
    buildOptions(body, task.options, task.answer);
  }

  function renderImage(task, body) {
    const box = document.createElement('div');
    box.className = 'img-box';
    if (task.img) {
      const im = document.createElement('img');
      im.src = task.img; im.alt = 'картинка';
      box.appendChild(im);
    } else {
      box.textContent = task.emoji || '❓';
    }
    body.appendChild(box);
    addQuestionText(body, escapeHtml(task.q || 'Что это по-китайски?'));
    buildOptions(body, task.options, task.answer);
  }

  /* ---------- пропуск ---------- */
  function renderFill(task, body) {
    addQuestionText(body, task.q);

    const input = document.createElement('input');
    input.className = 'fill-input';
    input.type = 'text';
    input.placeholder = task.placeholder || 'Введите ответ…';
    input.autocomplete = 'off';
    input.spellcheck = false;
    body.appendChild(input);

    const hintBox = document.createElement('div');
    hintBox.className = 'hint-box';
    body.appendChild(hintBox);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'primary';
    btn.textContent = 'Ответить';
    body.appendChild(btn);

    const submit = () => {
      if (taskLocked) return;
      const val = normalizeAnswer(input.value);
      if (!val) { input.focus(); return; }
      input.disabled = true;
      btn.disabled = true;
      const ok = task.answers.some(a => normalizeAnswer(a) === val);
      if (ok) resolveAnswer(true);
      else resolveAnswer(false, 'Правильный ответ: ' + task.answers[0]);
    };

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
    });
    setTimeout(() => input.focus(), 60);

    currentTaskUI.hint = () => {
      const ans = task.answers[0];
      hintBox.textContent = `Подсказка: начинается на «${ans.slice(0, 2)}…»`;
      hintBox.style.display = 'block';
      return true;
    };
  }

  /* ---------- пары ---------- */
  function renderMatch(task, body) {
    addQuestionText(body, escapeHtml(task.q || 'Соедините пары'));

    const pairs = task.pairs;
    const total = pairs.length;
    let selectedLeft = null;
    let matchedCount = 0;
    let mistakes = 0;

    const grid = document.createElement('div');
    grid.className = 'match-grid';
    const colL = document.createElement('div'); colL.className = 'match-col';
    const colR = document.createElement('div'); colR.className = 'match-col';

    const leftEls = new Array(total);
    const rightEls = new Array(total);

    shuffle(pairs.map((_, i) => i)).forEach(i => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'match-item';
      el.textContent = pairs[i][0];
      el.dataset.pair = i;
      leftEls[i] = el;
      el.addEventListener('click', () => {
        if (taskLocked || el.classList.contains('matched')) return;
        if (selectedLeft && selectedLeft !== el) selectedLeft.classList.remove('selected');
        selectedLeft = el;
        el.classList.add('selected');
      });
      colL.appendChild(el);
    });

    shuffle(pairs.map((_, i) => i)).forEach(i => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'match-item';
      el.textContent = pairs[i][1];
      el.dataset.pair = i;
      rightEls[i] = el;
      el.addEventListener('click', () => {
        if (taskLocked || el.classList.contains('matched') || !selectedLeft) return;
        const leftEl = selectedLeft;
        const leftPair = +leftEl.dataset.pair;
        selectedLeft = null;
        if (leftPair === i) {
          el.classList.add('matched');
          leftEl.classList.remove('selected');
          leftEl.classList.add('matched');
          matchedCount++;
          checkFinish();
        } else {
          mistakes++;
          el.classList.add('wrong');
          leftEl.classList.add('wrong');
          leftEl.classList.remove('selected');
          setTimeout(() => { el.classList.remove('wrong'); leftEl.classList.remove('wrong'); }, 650);
        }
      });
      colR.appendChild(el);
    });

    grid.appendChild(colL);
    grid.appendChild(colR);
    body.appendChild(grid);

    const hintEl = document.createElement('div');
    hintEl.style.cssText = 'font-size:12.5px;color:#b9a9d4;margin-top:8px;';
    hintEl.textContent = 'Выберите слово слева, затем перевод справа. Балл — только за все пары без ошибок.';
    body.appendChild(hintEl);

    function checkFinish() {
      if (matchedCount === total) {
        setTimeout(() => {
          if (mistakes === 0) resolveAnswer(true, 'Все пары верны!');
          else resolveAnswer(false, `Ошибок при соединении: ${mistakes}`);
        }, 450);
      }
    }

    currentTaskUI.hint = () => {
      for (let i = 0; i < total; i++) {
        if (!leftEls[i].classList.contains('matched')) {
          leftEls[i].classList.remove('selected');
          leftEls[i].classList.add('matched');
          rightEls[i].classList.add('matched');
          matchedCount++;
          checkFinish();
          return true;
        }
      }
      return false;
    };
  }

  /* ---------- порядок слов ---------- */
  function renderOrder(task, body) {
    addQuestionText(body, escapeHtml(task.q || 'Соберите предложение'));

    const pool = shuffle(task.words.map((w, i) => ({ text: w, id: i })));
    const picked = [];

    const answerBox = document.createElement('div');
    answerBox.className = 'order-answer';
    const poolBox = document.createElement('div');
    poolBox.className = 'order-pool';
    body.appendChild(answerBox);
    body.appendChild(poolBox);

    function redraw() {
      answerBox.innerHTML = '';
      if (!picked.length) {
        const h = document.createElement('span');
        h.className = 'order-hint';
        h.textContent = 'Нажимайте слова ниже, чтобы составить предложение…';
        answerBox.appendChild(h);
      } else {
        picked.forEach((item, idx) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'word-chip';
          b.textContent = item.text;
          b.addEventListener('click', () => {
            if (taskLocked) return;
            picked.splice(idx, 1);
            redraw();
          });
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
        b.addEventListener('click', () => {
          if (taskLocked) return;
          picked.push(item);
          redraw();
          check();
        });
        poolBox.appendChild(b);
      });
    }

    function check() {
      if (picked.length !== pool.length) return;
      const built = picked.map(x => x.text);
      const ok = built.length === task.answer.length &&
                 built.every((w, i) => w === task.answer[i]);
      if (ok) resolveAnswer(true, 'Предложение собрано верно!');
      else resolveAnswer(false, 'Правильно: ' + task.answer.join(' '));
    }

    currentTaskUI.hint = () => {
      const nextPos = picked.length;
      if (nextPos >= task.answer.length) return false;
      const w = task.answer[nextPos];
      const idx = pool.findIndex(item => item.text === w && !picked.includes(item));
      if (idx < 0) return false;
      picked.push(pool[idx]);
      redraw();
      check();
      return true;
    };

    redraw();
  }

  /* =========================================================
     ОТВЕТ
     ========================================================= */
  function resolveAnswer(correct, detail = '') {
    if (taskLocked) return;
    taskLocked = true;
    stopTimer();
    updateLifelines();

    const p = players[currentIdx];
    const task = currentTask;

    p.stats.attempted++;
    if (!p.stats.byType[task.type]) p.stats.byType[task.type] = { attempted: 0, correct: 0 };
    p.stats.byType[task.type].attempted++;

    if (correct) {
      p.stats.correct++;
      p.stats.byType[task.type].correct++;
      p.streak++;

      let reward = 1;
      let streakBonus = 0;
      if (p.streak % 3 === 0) streakBonus = 1;

      p.score += reward + streakBonus;
      turnState.pending += reward;
      turnState.questionsLeft--;

      playCorrect();

      // Проверка финиша: если копилка покрывает путь до конца
      if (p.pos + turnState.pending >= cfg.boardSize) {
        $('qFeedback').innerHTML = `✅ +${reward}${streakBonus ? ' <b>+1 серия</b>' : ''}. <b>Финиш!</b>`;
        $('qFeedback').className = 'feedback good';
        render();
        setTimeout(() => { closeModal(); finishPlayer(p); }, 900);
        return;
      }

      $('qFeedback').innerHTML =
        `✅ +${reward}${streakBonus ? ' <b>+1 серия</b>' : ''}. ` +
        `В копилке: <b>${turnState.pending}</b>. Осталось вопросов: <b>${turnState.questionsLeft}</b>.`;
      $('qFeedback').className = 'feedback good';
      render();

      if (turnState.questionsLeft <= 0) {
        // Вопросы кончились — автофиксация
        setTimeout(() => { closeModal(); bankAndEndTurn(); }, 1100);
        return;
      }

      $('continueBtn').textContent = `Продолжить (${turnState.questionsLeft})`;
      $('lockInBtn').textContent = `Зафиксировать (+${turnState.pending})`;
      $('choiceBtns').classList.remove('hidden');
    } else {
      p.streak = 0;
      const lost = turnState.pending;
      turnState.pending = 0;
      turnState.questionsLeft = 0;

      $('qFeedback').innerHTML =
        `❌ Неверно.${detail ? ' ' + detail + '.' : ''}` +
        (lost > 0 ? ` Потеряно клеток: <b>${lost}</b>.` : '') +
        ` Ход завершён.`;
      $('qFeedback').className = 'feedback bad';
      playWrong();
      render();

      afterWrong = true;
      $('continueBtn').textContent = 'Продолжить';
      $('lockInBtn').classList.add('hidden');
      $('choiceBtns').classList.remove('hidden');
    }
  }

  function closeModal() {
    stopTimer();
    $('modal').classList.add('hidden');
    $('choiceBtns').classList.add('hidden');
  }

  /* =========================================================
     ПРОДОЛЖИТЬ / ЗАФИКСИРОВАТЬ
     ========================================================= */
  function continueTurn() {
    if (!taskLocked) return;

    if (afterWrong) {
      // Игрок сам нажал «Продолжить» после ошибки — завершаем ход
      afterWrong = false;
      closeModal();
      endTurn();
      return;
    }

    // Обычный путь: следующий вопрос из броска
    closeModal();
    phase = 'question';
    setTimeout(askNextQuestion, 120);
  }

  function lockIn() {
    if (!taskLocked) return;
    $('choiceBtns').classList.add('hidden');
    closeModal();
    bankAndEndTurn();
  }

  /* =========================================================
     ФИКСАЦИЯ И ФИНИШ
     ========================================================= */
  async function bankAndEndTurn() {
    const p = players[currentIdx];
    const oldPos = p.pos;
    const target = Math.min(oldPos + turnState.pending, cfg.boardSize);

    turnState.pending = 0;
    turnState.questionsLeft = 0;

    if (target > oldPos) {
      log(`${p.name}: фиксация +${target - oldPos} клеток.`);
      for (let i = oldPos + 1; i <= target; i++) {
        p.pos = i;
        render();
        playTick();
        await sleep(130);
      }
    }

    if (p.pos >= cfg.boardSize) {
      finishPlayer(p);
      return;
    }

    const sp = specials[p.pos];
    if (sp) {
      await applySpecial(p, sp);
      if (p.pos >= cfg.boardSize) { finishPlayer(p); return; }
      render();
      await sleep(500);
    }

    endTurn();
  }

  async function applySpecial(p, sp) {
    switch (sp) {
      case 'gift':
        p.score += 1;
        log(`🎁 ${p.name}: +1 бонусный балл.`, 'good');
        playCorrect();
        break;
      case 'trap':
        p.score = Math.max(0, p.score - 1);
        log(`💀 ${p.name}: -1 балл.`, 'bad');
        playWrong();
        break;
      case 'star':
        p.score += 2;
        log(`⭐ ${p.name}: +2 бонусных балла!`, 'good');
        playCorrect();
        break;
      case 'boost':
        if (p.pos < cfg.boardSize) {
          p.pos++;
          log(`🌀 ${p.name}: +1 клетка → ${p.pos}.`, 'sys');
          playTick();
          if (p.pos < cfg.boardSize && specials[p.pos]) {
            await applySpecial(p, specials[p.pos]);
          }
        }
        break;
    }
  }

  function finishPlayer(p) {
    p.pos = cfg.boardSize;
    p.finished = true;
    p.finishOrder = ++finishCounter;
    const bonus = FINISH_BONUS[p.finishOrder - 1] || 0;
    p.score += bonus;
    log(`🏁 ${p.name} финиширует ${p.finishOrder}-м! Бонус +${bonus}.`, 'finish');
    playFinish();

    turnState.pending = 0;
    turnState.questionsLeft = 0;
    render();

    setTimeout(() => {
      closeModal();
      if (players.every(x => x.finished)) {
        gameOver();
      } else {
        endTurn();
      }
    }, 1400);
  }

  /* =========================================================
     ТАЙМЕР
     ========================================================= */
  function startTimer() {
    if (!cfg.timer) return;
    timerTotal = cfg.timerSec;
    timerEndTime = Date.now() + cfg.timerSec * 1000;
    $('timerWrap').classList.remove('hidden');
    updateTimerUI();
    clearInterval(timerHandle);
    timerHandle = setInterval(() => {
      const remain = Math.max(0, (timerEndTime - Date.now()) / 1000);
      updateTimerUI(remain);
      if (remain <= 0) {
        clearInterval(timerHandle);
        resolveAnswer(false, 'Время вышло');
      }
    }, 100);
  }

  function updateTimerUI(remain) {
    if (remain === undefined) remain = (timerEndTime - Date.now()) / 1000;
    remain = Math.max(0, remain);
    const pct = timerTotal > 0 ? (remain / timerTotal) * 100 : 0;
    $('timerFill').style.width = pct + '%';
    $('timerText').textContent = Math.ceil(remain) + ' с';
  }

  function stopTimer() {
    clearInterval(timerHandle);
    $('timerWrap').classList.add('hidden');
    $('timerText').textContent = '';
  }

  /* =========================================================
     ЛАЙФЛАЙНЫ
     ========================================================= */
  function updateLifelines() {
    const box = $('lifelines');
    if (!cfg.lifelines || !currentPlayer || !currentTask) {
      box.classList.add('hidden');
      return;
    }
    box.classList.remove('hidden');
    box.innerHTML = '';

    const fifty = document.createElement('button');
    fifty.type = 'button';
    fifty.className = 'lifeline-btn';
    fifty.textContent = `50/50 (${currentPlayer.lifelines.fifty})`;
    fifty.disabled = taskLocked || currentPlayer.lifelines.fifty <= 0 || !currentTaskUI.fifty;
    fifty.addEventListener('click', () => {
      if (taskLocked) return;
      if (currentTaskUI.fifty && currentTaskUI.fifty()) {
        currentPlayer.lifelines.fifty--;
        updateLifelines();
      }
    });
    box.appendChild(fifty);

    const hint = document.createElement('button');
    hint.type = 'button';
    hint.className = 'lifeline-btn';
    hint.textContent = `Подсказка (${currentPlayer.lifelines.hint})`;
    hint.disabled = taskLocked || currentPlayer.lifelines.hint <= 0 || !currentTaskUI.hint;
    hint.addEventListener('click', () => {
      if (taskLocked) return;
      if (currentTaskUI.hint && currentTaskUI.hint()) {
        currentPlayer.lifelines.hint--;
        updateLifelines();
      }
    });
    box.appendChild(hint);
  }

  /* =========================================================
     СМЕНА ХОДА / КОНЕЦ ИГРЫ
     ========================================================= */
  function endTurn() {
    if (players.every(p => p.finished)) { gameOver(); return; }

    do {
      currentIdx = (currentIdx + 1) % players.length;
    } while (players[currentIdx].finished);

    phase = 'idle';
    turnState.pending = 0;
    turnState.questionsLeft = 0;
    render();
    log(`Ход: ${players[currentIdx].name}`, 'sys');
  }

  function gameOver() {
    phase = 'over';
    render();
    playFinish();

    const sorted = players.slice().sort((a, b) =>
      (b.score - a.score) || (a.finishOrder - b.finishOrder)
    );

    const medals = ['🥇', '🥈', '🥉'];
    const body = $('endBody');
    body.innerHTML = '';

    const win = sorted[0];
    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom:16px;font-size:18px;';
    header.innerHTML =
      `Победитель: <b style="color:${win.color}">${escapeHtml(win.name)}</b> — ${win.score} балл(ов)!`;
    body.appendChild(header);

    sorted.forEach((p, i) => {
      const row = document.createElement('div');
      row.className = 'end-row' + (i === 0 ? ' win' : '');
      const acc = p.stats.attempted ? Math.round(p.stats.correct / p.stats.attempted * 100) : 0;
      const types = Object.entries(p.stats.byType).map(([t, s]) => {
        const a = s.attempted ? Math.round(s.correct / s.attempted * 100) : 0;
        return `${TYPE_LABELS[t] || t}: ${s.correct}/${s.attempted} (${a}%)`;
      }).join(' · ');

      row.innerHTML = `
        <span class="place">${medals[i] || (i + 1) + '.'}</span>
        <span class="dot" style="background:${p.color}"></span>
        <div class="end-info">
          <div class="end-top">
            <span class="nm">${escapeHtml(p.name)}</span>
            <span class="sc">${p.score} б.</span>
          </div>
          <div class="stat-line">Точность: ${p.stats.correct}/${p.stats.attempted} (${acc}%) · финиш #${p.finishOrder}</div>
          <div class="stat-line">${types}</div>
        </div>
      `;
      body.appendChild(row);
    });

    log(`🏆 Победитель: ${win.name} (${win.score} б.)`, 'finish');
    $('endModal').classList.remove('hidden');
  }

  /* =========================================================
     ПРОВЕРКА ЗАГРУЗКИ
     ========================================================= */
  (function checkTasks() {
    const ok = Array.isArray(TASKS) && TASKS.length > 0;
    if (!ok) {
      $('startBtn').disabled = true;
      $('loadErr').classList.remove('hidden');
      console.error('tasks.js не загружен или массив TASKS пуст.');
    }
  })();

  // === В САМОМ КОНЦЕ setup() добавьте эту функцию очистки: ===
  return function cleanup() {
    if (timerHandle) clearInterval(timerHandle);
    timerHandle = null;
    const m1 = document.getElementById('modal');
    const m2 = document.getElementById('endModal');
    if (m1) m1.classList.add('hidden');
    if (m2) m2.classList.add('hidden');
  };
}




