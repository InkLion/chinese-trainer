// js/modules/settings.js
import { getSettings, applyTheme, applyFontSize } from '../core/theme.js';

export function init(container) {
  const { theme: currentTheme, fontSize: currentFontSize } = getSettings();

  container.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div style="text-align: center; margin-bottom: 40px; margin-top: 20px;">
        <h1 style="font-size: 48px; font-weight: 900; color: var(--gold); margin: 0; text-shadow: 0 0 30px rgba(244,196,48,0.3); letter-spacing: 2px;">Настройки</h1>
        <p class="subtitle" style="margin-top: 10px;">Настройте внешний вид под себя</p>
      </div>

      <div class="card" style="max-width: 500px; margin: 0 auto;">
        <h3>Тема</h3>
        <div class="settings-btn-group" style="display: flex; gap: 10px; margin-top: 10px;">
          <button type="button" id="theme-dark" class="opt ${currentTheme === 'dark' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center;">Тёмная</button>
          <button type="button" id="theme-light" class="opt ${currentTheme === 'light' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center;">Светлая</button>
        </div>

        <h3 style="margin-top: 24px;">Размер шрифта</h3>
        <div class="settings-btn-group" style="display: flex; gap: 10px; margin-top: 10px;">
          <button type="button" id="font-small" class="opt ${currentFontSize === '14' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center; font-size: 14px;">Мелкий</button>
          <button type="button" id="font-normal" class="opt ${currentFontSize === '16' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center; font-size: 16px;">Обычный</button>
          <button type="button" id="font-large" class="opt ${currentFontSize === '18' ? 'correct' : ''}" style="flex: 1; justify-content: center; text-align: center; font-size: 18px;">Крупный</button>
        </div>
      </div>
    </div>
  `;

  const setTheme = (theme) => {
    applyTheme(theme);
    container.querySelector('#theme-dark').classList.toggle('correct', theme === 'dark');
    container.querySelector('#theme-light').classList.toggle('correct', theme === 'light');
  };

  const setFontSize = (size) => {
    applyFontSize(size);
    container.querySelector('#font-small').classList.toggle('correct', size === '14');
    container.querySelector('#font-normal').classList.toggle('correct', size === '16');
    container.querySelector('#font-large').classList.toggle('correct', size === '18');
  };

  container.querySelector('#theme-dark').addEventListener('click', () => setTheme('dark'));
  container.querySelector('#theme-light').addEventListener('click', () => setTheme('light'));

  container.querySelector('#font-small').addEventListener('click', () => setFontSize('14'));
  container.querySelector('#font-normal').addEventListener('click', () => setFontSize('16'));
  container.querySelector('#font-large').addEventListener('click', () => setFontSize('18'));

  return () => {};
}
