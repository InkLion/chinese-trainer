import { init as testsInit } from './modules/tests.js';
import { init as jeopardyInit } from './modules/jeopardy.js';
import { init as profileInit } from './modules/profile.js';
import { init as flashcardsInit } from './modules/flashcards.js';
import { init as settingsInit } from './modules/settings.js';
import { initFeedbackWidget } from './core/feedback.js';
import { getCurrentUser, logout } from './core/storage.js';
import { supabase } from './core/supabase.js'; // ДОБАВИЛИ ИМПОРТ SUPABASE

// Применяем настройки при старте
const savedTheme = localStorage.getItem('theme') || 'dark';
const savedFontSize = localStorage.getItem('fontSize') || '16';
document.documentElement.setAttribute('data-theme', savedTheme);
document.documentElement.style.fontSize = savedFontSize + 'px';

const app = document.getElementById('app');
const nav = document.getElementById('app-nav');
const header = document.querySelector('.app-header');

const routes = {
  '':         homeView,
  'login':    profileInit,
  'tests':    testsInit,
  'jeopardy': jeopardyInit,
  'flashcards': flashcardsInit,
  'settings': settingsInit,
};

let currentCleanup = null;
let navId = 0;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Доброе утро';
  if (hour >= 12 && hour < 18) return 'Добрый день';
  if (hour >= 18 && hour < 23) return 'Добрый вечер';
  return 'Доброй ночи';
}

function homeView(container) {
  const user = getCurrentUser();
  const greeting = getGreeting();

  // ... (код homeView оставьте без изменений, он не относится к проблеме) ...
  container.innerHTML = `
    <div style="min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.5s ease-out;">
      
      <!-- Мини-профиль в углу -->
      <div style="position: absolute; top: 20px; right: 20px; display: flex; align-items: center; gap: 15px; background: var(--bg-panel); padding: 8px 16px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
        <span style="color: var(--gold); font-weight: bold; margin-right: 5px;">👤 ${user}</span>
        <div style="display: flex; gap: 8px;">
          <a href="#/settings" style="padding: 6px 12px; font-size: 14px; font-weight: 600; background: var(--bg-hover); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; color: var(--text-main); text-decoration: none; transition: 0.2s; display: flex; align-items: center;">
            ⚙️ Настройки
          </a>
          <button id="logoutBtnHome" style="padding: 6px 12px; font-size: 14px; font-weight: 600; background: var(--bg-hover); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; color: var(--text-main); transition: 0.2s;">Выйти</button>
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 72px; font-weight: 900; color: var(--gold); margin: 0; text-shadow: 0 0 40px var(--gold-glow); letter-spacing: 6px;">汉语</h1>
        <div style="font-size: 20px; color: var(--text-muted); letter-spacing: 4px; text-transform: uppercase; margin-top: 8px;">Тренажёр</div>
      </div>

      <h2 style="font-size: 28px; margin-bottom: 50px; font-weight: 400; text-align: center; color: var(--text-main);">
        ${greeting}, <span style="color: var(--gold); font-weight: 800;">${user}</span>!
      </h2>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; width: 100%; max-width: 800px;">
        <a href="#/tests" class="menu-card">
          <div>📝</div>
          <div>Тесты</div>
          <div>Проверка слов, чисел, времени и грамматики</div>
        </a>
        <a href="#/jeopardy" class="menu-card">
          <div>🎯</div>
          <div>Своя игра</div>
          <div>Викторина для игры в компании</div>
        </a>
        <a href="#/flashcards" class="menu-card">
          <div>🃏</div>
          <div>Карточки</div>
          <div>Запоминание слов с помощью флеш-карточек</div>
        </a>
        <a href="#" class="menu-card" style="opacity: 0.5; cursor: not-allowed;" onclick="event.preventDefault(); alert('Этот раздел находится в разработке! 🚧');">
          <div style="filter: grayscale(1);">✍️</div>
          <div>Прописи</div>
          <div>Рукописный ввод иероглифов</div>
        </a>
      </div>
    </div>
  `;

  document.getElementById('logoutBtnHome').addEventListener('click', () => {
    logout();
    window.location.hash = '#/login';
    window.location.reload();
  });
}

async function route() {
  const myId = ++navId;
  const hash = location.hash.replace(/^#\/?/, '');
  const name = hash.split('/')[0];

  // 1. Проверяем реальную сессию в Supabase (а не только localStorage)
  const { data: { session } } = await supabase.auth.getSession();
  const localUser = getCurrentUser();

  // 2. Если в localStorage есть ник, но сессии в Supabase нет (истекла или удалена)
  if (localUser && !session) {
    localStorage.removeItem('hsk_current_user'); // Очищаем ник
    window.location.hash = '#/login';            // Кидаем на вход
    return;
  }

  // 3. Если нет ни сессии, ни локал юзера (и мы не на странице входа)
  if (!session && !localUser && name !== 'login') {
    window.location.hash = '#/login';
    return;
  }

  // Скрываем шапку на логине и на главной
  if (name === 'login' || name === '') {
    if (header) header.style.display = 'none';
  } else {
    if (header) header.style.display = 'flex';
    
    [...nav.querySelectorAll('a')].forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#/' + name);
    });
  }

  if (currentCleanup) {
    try { currentCleanup(); } catch (e) { console.error(e); }
    currentCleanup = null;
  }

  const container = document.createElement('div');
  app.replaceChildren(container);

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

window.addEventListener('hashchange', () => setTimeout(route, 0));
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(route, 0);
  initFeedbackWidget();
});

// 4. ГЛОБАЛЬНЫЙ СЛУШАТЕЛЬ СОСТОЯНИЯ АВТОРИЗАЦИИ
// Если Supabase разлогинит пользователя (например, истечет токен), мы это поймаем
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || !session) {
    localStorage.removeItem('hsk_current_user');
    if (location.hash !== '#/login') {
      window.location.hash = '#/login';
    }
  }
});
