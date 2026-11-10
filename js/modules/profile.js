// js/modules/profile.js
import { setCurrentUser, getAllUsers } from '../core/storage.js';

export function init(container) {
  // Получаем список уже существующих профилей в этом браузере
  const existingUsers = getAllUsers();

  let html = `
    <div class="card" style="max-width: 500px; margin: 40px auto; text-align: center;">
      <h1 style="color: var(--gold);">Вход в тренажёр</h1>
      <p class="subtitle">Введите ваше имя, чтобы сохранять прогресс отдельно от других.</p>
      
      <input type="text" id="usernameInput" class="fill-input" placeholder="Ваше имя (например, Иван)" autocomplete="off" style="text-align: center; margin-bottom: 16px;">
      
      <button id="loginBtn" class="primary">Войти</button>
  `;

  // Если есть сохраненные профили, показываем их как быстрые кнопки
  if (existingUsers.length > 0) {
    html += `
      <div style="margin-top: 30px; border-top: 1px solid var(--border); padding-top: 20px;">
        <div style="font-size: 14px; color: #b9a9d4; margin-bottom: 10px;">Или выберите профиль:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
          ${existingUsers.map(u => `<button class="quick-user" data-name="${u}" style="padding: 6px 12px; font-size: 14px; background: rgba(255,255,255,.1);">${u}</button>`).join('')}
        </div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;

  const input = document.getElementById('usernameInput');
  const btn = document.getElementById('loginBtn');

  // Логика входа
  const doLogin = (name) => {
    if (!name || name.trim().length < 2) {
      alert('Имя должно содержать хотя бы 2 символа.');
      return;
    }
    setCurrentUser(name);
    window.location.hash = '#/'; // Перекидываем на главную
    window.location.reload(); // Перезагружаем, чтобы обновить меню
  };

  btn.addEventListener('click', () => doLogin(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(input.value); });

  // Обработка кнопок быстрого входа
  container.querySelectorAll('.quick-user').forEach(b => {
    b.addEventListener('click', () => doLogin(b.dataset.name));
  });

  setTimeout(() => input.focus(), 50);
  return () => {};
}