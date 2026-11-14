// js/modules/settings.js

export function init(container) {
  // Загружаем текущие настройки (по умолчанию темная тема и стандартный шрифт)
  const currentTheme = localStorage.getItem('theme') || 'dark';
  const currentFontSize = localStorage.getItem('fontSize') || '16';

  container.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div style="text-align: center; margin-bottom: 40px; margin-top: 20px;">
        <h1 style="font-size: 48px; font-weight: 900; color: var(--gold); margin: 0; text-shadow: 0 0 30px rgba(244,196,48,0.3); letter-spacing: 2px;">Настройки</h1>
        <p style="font-size: 16px; color: #b9a9d4; margin-top: 10px;">Настройте внешний вид под себя</p>
      </div>

      <div class="card" style="max-width: 500px; margin: 0 auto;">
        
        <!-- Выбор темы -->
          <div class="settings-btn-group" style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="theme-dark" class="opt ${currentTheme === 'dark' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center;">Тёмная</button>
            <button id="theme-light" class="opt ${currentTheme === 'light' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center;">Светлая</button>
          </div>

        <!-- Выбор размера шрифта -->
          <div class="settings-btn-group" style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="font-small" class="opt ${currentFontSize === '14' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center; font-size: 14px;">Мелкий</button>
            <button id="font-normal" class="opt ${currentFontSize === '16' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center; font-size: 16px;">Обычный</button>
            <button id="font-large" class="opt ${currentFontSize === '18' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center; font-size: 18px;">Крупный</button>
          </div>

      </div>
    </div>
  `;

  // Логика смены темы
  const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    // Перерисовываем кнопки, чтобы подсветить активную
    document.getElementById('theme-dark').classList.toggle('correct', theme === 'dark');
    document.getElementById('theme-light').classList.toggle('correct', theme === 'light');
  };

  document.getElementById('theme-dark').onclick = () => setTheme('dark');
  document.getElementById('theme-light').onclick = () => setTheme('light');

  // Логика смены шрифта
  const setFontSize = (size) => {
    localStorage.setItem('fontSize', size);
    document.documentElement.style.fontSize = size + 'px';
    // Перерисовываем кнопки
    document.getElementById('font-small').classList.toggle('correct', size === '14');
    document.getElementById('font-normal').classList.toggle('correct', size === '16');
    document.getElementById('font-large').classList.toggle('correct', size === '18');
  };

  document.getElementById('font-small').onclick = () => setFontSize('14');
  document.getElementById('font-normal').onclick = () => setFontSize('16');
  document.getElementById('font-large').onclick = () => setFontSize('18');

  return () => {};
}