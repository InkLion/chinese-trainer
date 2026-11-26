import { init as testsInit } from './modules/tests.js';
import { init as jeopardyInit } from './modules/jeopardy.js';
import { init as profileInit } from './modules/profile.js';
import { getCurrentUser, logout, clearCurrentUser, watchAuthState } from './core/storage.js';
import { init as flashcardsInit } from './modules/flashcards.js';
import { init as settingsInit } from './modules/settings.js';
import { initFeedbackWidget } from './core/feedback.js';
import { applySavedSettings } from './core/theme.js';
import { escapeHtml } from './core/utils.js';

applySavedSettings();

const app = document.getElementById('app');
const nav = document.getElementById('app-nav');
const header = document.querySelector('.app-header');

const routes = {
  '':          homeView,
  'login':     profileInit,
  'tests':     testsInit,
  'jeopardy':  jeopardyInit,
  'flashcards': flashcardsInit,
  'settings':  settingsInit
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
  const user = getCurrentUser() || '';
  const safeUser = escapeHtml(user);
  const greeting = getGreeting();

  container.innerHTML = `
    <div style="min-height: 80vh; display: flex; flex-direction: column; padding: 20px; animation: fadeIn 0.5s ease-out;">
      
      <!-- Верхняя панель с профилем (всегда наверху, ничего не перекрывает) -->
      <div style="display: flex; justify-content: flex-end; width: 100%; margin-bottom: 20px;">
        <div class="home-profile-box" style="display: flex; align-items: center; gap: 10px; background: var(--bg-panel); padding: 8px 12px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <span style="color: var(--gold); font-weight: bold;">👤 ${safeUser}</span>
          
          <a href="#/settings" class="profile-btn" title="Настройки" style="padding: 6px 12px; font-size: 14px; font-weight: 600; background: var(--bg-hover); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; color: var(--text-main); text-decoration: none; display: flex; align-items: center; gap: 5px;">
            ⚙️ <span class="settings-text">Настройки</span>
          </a>
          
          <button id="logoutBtnHome" class="profile-btn" style="padding: 6px 12px; font-size: 14px; font-weight: 600; background: var(--bg-hover); border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; color: var(--text-main);">Выйти</button>
        </div>
      </div>

      <!-- Центральная часть с логотипом и карточками -->
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 50px;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 72px; font-weight: 900; color: var(--gold); margin: 0; text-shadow: 0 0 40px var(--gold-glow); letter-spacing: 6px;">汉语</h1>
          <div style="font-size: 20px; color: var(--text-muted); letter-spacing: 4px; text-transform: uppercase; margin-top: 8px;">Тренажёр</div>
        </div>

        <h2 style="font-size: 28px; margin-bottom: 50px; font-weight: 400; text-align: center; color: var(--text-main);">
          ${greeting}, <span style="color: var(--gold); font-weight: 800;">${safeUser}</span>!
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
          <a href="#" class="menu-card" style="opacity: 0.5; cursor: not-allowed;" data-wip="1">
            <div style="filter: grayscale(1);">✍️</div>
            <div>Прописи</div>
            <div>Рукописный ввод иероглифов</div>
          </a>
        </div>
      </div>
    </div>
  `;

  // Инлайн-обработчик заменён на обычный listener: меньше сюрпризов с CSP.
  const wip = container.querySelector('[data-wip]');
  if (wip) {
    wip.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Этот раздел находится в разработке! 🚧');
    });
  }

  const logoutBtn = container.querySelector('#logoutBtnHome');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      // Кнопка блокируется, чтобы повторный клик не запускал второй выход.
      logoutBtn.disabled = true;
      await logout();
      if (location.hash === '#/login') route();
      else window.location.hash = '#/login';
    });
  }
}

function renderError(container, error) {
  container.innerHTML = `
    <div class="card" style="max-width: 600px; margin: 40px auto; text-align: center;">
      <h2 style="color: var(--danger); margin-bottom: 10px;">Что-то пошло не так</h2>
      <p style="color: var(--text-muted);">Не удалось открыть раздел. Попробуйте обновить страницу.</p>
      <p style="color: var(--text-muted); font-size: 13px;">${escapeHtml(error?.message || error || '')}</p>
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

  // Скрываем шапку на логине и на главной
  if (header) header.style.display = (name === 'login' || name === '') ? 'none' : 'flex';

  if (nav && name !== 'login' && name !== '') {
    [...nav.querySelectorAll('a')].forEach((a) => {
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
    if (myId === navId) renderError(container, e);
  }

  if (myId !== navId) {
    // Пока вью ждала данные, пользователь ушёл в другой раздел:
    // отдаём ей шанс освободить ресурсы.
    if (typeof result === 'function') {
      try { result(); } catch (e) { console.error(e); }
    }
    return;
  }

  currentCleanup = typeof result === 'function' ? result : null;

  // Долгая загрузка могла оставить прокрутку с предыдущей страницы.
  window.scrollTo(0, 0);
}

/**
 * Внешний выход/истечение сессии: убираем локальный флаг и уходим на логин,
 * иначе интерфейс выглядит «залогиненным», а данные молча пустые.
 */
function handleSignedOut() {
  if (!getCurrentUser()) return;
  clearCurrentUser();
  if (location.hash === '#/login') {
    route();
  } else {
    window.location.hash = '#/login';
  }
}

window.addEventListener('hashchange', () => setTimeout(route, 0));
window.addEventListener('DOMContentLoaded', () => {
  watchAuthState(handleSignedOut);
  setTimeout(route, 0);
  initFeedbackWidget();
});
