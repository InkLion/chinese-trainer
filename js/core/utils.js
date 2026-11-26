// js/core/utils.js
// Общие утилиты, которые раньше дублировались в разных модулях.

/**
 * Перемешивание копии массива (Fisher–Yates).
 * Не использовать sort(() => Math.random() - 0.5): такой компаратор
 * нетранзитивен и даёт смещённое, а иногда и почти не перемешанное распределение.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffle(arr) {
  const a = Array.isArray(arr) ? arr.slice() : [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Случайный элемент массива (или null для пустого).
 * @template T
 * @param {T[]} arr
 * @returns {T | null}
 */
export function randomItem(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Экранирование текста перед вставкой через innerHTML.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

/**
 * Ограничивает частоту вызова (для «дребезга» кликов/ввода).
 * @param {Function} fn
 * @param {number} wait
 */
export function debounce(fn, wait = 200) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
