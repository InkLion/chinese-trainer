// js/core/storage.js

const USER_KEY = 'hsk_current_user';

// === УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЕМ ===
export function getCurrentUser() {
  return localStorage.getItem(USER_KEY);
}

export function setCurrentUser(name) {
  localStorage.setItem(USER_KEY, name.trim());
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

// Получаем список всех профилей, которые когда-либо заходили с этого браузера
export function getAllUsers() {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('hsk_data_')) {
      users.push(key.replace('hsk_data_', ''));
    }
  }
  return users.sort();
}

// === РАБОТА С ДАННЫМИ (ПРИВЯЗАНА К ПОЛЬЗОВАТЕЛЮ) ===
function getData() {
  const user = getCurrentUser();
  if (!user) return { stats: {}, mistakes: {} }; // Если не залогинен, пусто

  const key = `hsk_data_${user}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Ошибка чтения localStorage', e);
  }
  return { stats: {}, mistakes: {} };
}

function saveData(data) {
  const user = getCurrentUser();
  if (!user) return;
  localStorage.setItem(`hsk_data_${user}`, JSON.stringify(data));
}

export function addStat(testName, correct, total) {
  const data = getData();
  if (!data.stats[testName]) data.stats[testName] = [];
  
  data.stats[testName].push({
    date: new Date().toISOString(),
    correct,
    total
  });
  saveData(data);
}

export function getStats(testName) {
  const data = getData();
  return data.stats[testName] || [];
}

export function addMistake(testName, prompt) {
  const data = getData();
  if (!data.mistakes[testName]) data.mistakes[testName] = [];
  
  if (!data.mistakes[testName].includes(prompt)) {
    data.mistakes[testName].push(prompt);
    saveData(data);
  }
}

export function removeMistake(testName, prompt) {
  const data = getData();
  if (!data.mistakes[testName]) return;
  
  data.mistakes[testName] = data.mistakes[testName].filter(p => p !== prompt);
  if (data.mistakes[testName].length === 0) {
    delete data.mistakes[testName];
  }
  saveData(data);
}

export function getMistakes(testName) {
  const data = getData();
  return data.mistakes[testName] || [];
}