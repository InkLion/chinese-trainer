// js/core/theme.js
// Единая точка для темы и размера шрифта (раньше эта логика дублировалась
// в js/app.js и js/modules/settings.js).

const THEME_KEY = 'theme';
const FONT_KEY = 'fontSize';

export const THEMES = ['dark', 'light'];
export const FONT_SIZES = ['14', '16', '18'];

const DEFAULT_THEME = 'dark';
const DEFAULT_FONT_SIZE = '16';

// localStorage может быть недоступен (приватный режим, запрет cookies),
// поэтому все обращения обёрнуты: падение здесь ломало бы весь старт приложения.
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    /* тихо игнорируем: тема просто не запомнится */
  }
}

/** @returns {{theme: string, fontSize: string}} */
export function getSettings() {
  const theme = readStorage(THEME_KEY);
  const fontSize = readStorage(FONT_KEY);
  return {
    theme: THEMES.includes(theme) ? theme : DEFAULT_THEME,
    fontSize: FONT_SIZES.includes(fontSize) ? fontSize : DEFAULT_FONT_SIZE
  };
}

/** Применяет тему к документу и запоминает выбор. */
export function applyTheme(theme) {
  const next = THEMES.includes(theme) ? theme : DEFAULT_THEME;
  document.documentElement.setAttribute('data-theme', next);
  writeStorage(THEME_KEY, next);
  return next;
}

/** Применяет размер шрифта к документу и запоминает выбор. */
export function applyFontSize(size) {
  const next = FONT_SIZES.includes(String(size)) ? String(size) : DEFAULT_FONT_SIZE;
  document.documentElement.style.fontSize = next + 'px';
  writeStorage(FONT_KEY, next);
  return next;
}

/** Применяет сохранённые настройки (вызывается при старте приложения). */
export function applySavedSettings() {
  const { theme, fontSize } = getSettings();
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.fontSize = fontSize + 'px';
}
