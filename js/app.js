import { init as gameInit } from './modules/game.js';
import { init as testsInit } from './modules/tests.js';
import { init as jeopardyInit } from './modules/jeopardy.js';
import { init as profileInit } from './modules/profile.js'; // НОВЫЙ ИМПОРТ
import { getCurrentUser, logout } from './core/storage.js'; // НОВЫЙ ИМПОРТ

const app = document.getElementById('app');
const nav = document.getElementById('app-nav');
const userBar = document.getElementById('user-bar'); // Элемент в шапке

const routes = {
  '':         homeView,
  'login':    profileInit,
  'game':     gameInit,
  'tests':    testsInit,
  'jeopardy': jeopardyInit,
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

async function route() {
  const myId = ++navId;
  const hash = location.hash.replace(/^#\/?/, '');
  const name = hash.split('/')[0];

  // ПРОВЕРКА АВТОРИЗАЦИИ
  const user = getCurrentUser();
  if (!user && name !== 'login') {
    window.location.hash = '#/login'; // Принудительный редирект
    return;
  }

  if (currentCleanup) {
    try { currentCleanup(); } catch (e) { console.error(e); }
    currentCleanup = null;
  }

  const container = document.createElement('div');
  app.replaceChildren(container);

  // Обновляем шапку
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
    nav.style.display = 'flex'; // Показываем меню, если залогинен
  } else {
    userBar.innerHTML = '';
    nav.style.display = 'none'; // Скрываем меню на экране входа
  }

  [...nav.querySelectorAll('a')].forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + name);
  });

  const view = routes[name] || homeView;
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

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);