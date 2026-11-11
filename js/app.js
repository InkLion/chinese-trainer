// Убрали импорт gameInit, так как скрываем игру
import { init as testsInit } from './modules/tests.js';
import { init as jeopardyInit } from './modules/jeopardy.js';
import { init as profileInit } from './modules/profile.js';
import { getCurrentUser, logout } from './core/storage.js';

const app = document.getElementById('app');
const nav = document.getElementById('app-nav');
const userBar = document.getElementById('user-bar');

const routes = {
  '':         homeView,
  'login':    profileInit,
  'tests':    testsInit,
  'jeopardy': jeopardyInit,
  // 'game':  gameInit,  <-- ИГРА ОТКЛЮЧЕНА
};

let currentCleanup = null;
let navId = 0;

function homeView(container) {
  const user = getCurrentUser();
  container.innerHTML = `
    <div class="card">
      <h1 style="text-align:center;margin-top:8px;">Привет, ${user}!</h1>
      <p class="subtitle" style="text-align:center;">Выберите активность в меню сверху 👆</p>
    </div>
  `;
}

function notReady(container) {
  container.innerHTML = `
    <div class="card">
      <h1>Скоро</h1>
      <p class="subtitle">Этот модуль в разработке.</p>
    </div>
  `;
}

async function route() {
  const myId = ++navId;
  const hash = location.hash.replace(/^#\/?/, '');
  const name = hash.split('/')[0];

  const user = getCurrentUser();
  if (!user && name !== 'login') {
    window.location.hash = '#/login';
    return;
  }

  if (currentCleanup) {
    try { currentCleanup(); } catch (e) { console.error(e); }
    currentCleanup = null;
  }

  const container = document.createElement('div');
  app.replaceChildren(container);

  if (user) {
    userBar.innerHTML = `
      <span style="color: var(--gold); font-weight: bold; margin-right: 10px;">👤 ${user}</span>
      <button id="logoutBtn" style="padding: 4px 10px; font-size: 12px; background: transparent; border: 1px solid var(--border);">Выйти</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      logout();
      window.location.hash = '#/login';
      window.location.reload();
    });
    nav.style.display = 'flex';
  } else {
    userBar.innerHTML = '';
    nav.style.display = 'none';
  }

  [...nav.querySelectorAll('a')].forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + name);
  });

  // Если кто-то вручную введет #/game, покажем заглушку
  const view = routes[name] || (name === 'game' ? notReady : homeView);
  
  let result;
  try {
    result = await view(container);
  } catch (e) {
    console.error(e);
  }

  if (myId !== navId) {
    if (typeof result === 'function') {
      try { result(); } catch (e) { console.error(e); }
    }
    return;
  }

  currentCleanup = typeof result === 'function' ? result : null;
}

// ФИКС ОШИБКИ startTime:
// Оборачиваем в setTimeout, чтобы браузер сначала завершил 
// свои внутренние процессы клика, а потом мы меняли DOM.
window.addEventListener('hashchange', () => setTimeout(route, 0));
window.addEventListener('DOMContentLoaded', () => setTimeout(route, 0));
