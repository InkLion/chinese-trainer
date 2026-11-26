// js/core/storage.js
import { supabase } from './supabase.js';

const USER_KEY = 'hsk_current_user';

/**
 * Ошибки Supabase раньше игнорировались полностью: пользователь видел
 * «пустую статистику» вместо сообщения о проблеме. Теперь они хотя бы
 * попадают в консоль с понятным префиксом.
 */
function logError(scope, error) {
  if (!error) return;
  console.error(`[storage:${scope}]`, error.message || error);
}

/**
 * Идентификатор пользователя из уже загруженной сессии.
 * getSession() читает localStorage и не делает сетевой запрос,
 * в отличие от getUser(), который раньше вызывался по 2 раза на каждый тест.
 * @returns {Promise<string|null>}
 */
async function currentUserId() {
  try {
    const { data, error } = await supabase.auth.getSession();
    logError('getSession', error);
    return data?.session?.user?.id || null;
  } catch (e) {
    logError('getSession', e);
    return null;
  }
}

// === УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЕМ ===
export function getCurrentUser() {
  try {
    return localStorage.getItem(USER_KEY);
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(name) {
  try {
    localStorage.setItem(USER_KEY, String(name).trim());
  } catch (e) {
    logError('setCurrentUser', e);
  }
}

export function clearCurrentUser() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    logError('clearCurrentUser', e);
  }
}

export async function logout() {
  // Сначала локальный флаг: даже если сеть недоступна, UI разлогинится.
  clearCurrentUser();
  try {
    const { error } = await supabase.auth.signOut();
    logError('signOut', error);
  } catch (e) {
    logError('signOut', e);
  }
}

/**
 * Следит за состоянием авторизации Supabase.
 * Нужно, чтобы истёкшая/отозванная сессия выкидывала пользователя на логин,
 * а не оставляла «залогиненный» интерфейс с молча пустыми данными.
 * @param {() => void} onSignedOut
 * @returns {() => void} отписка
 */
export function watchAuthState(onSignedOut) {
  try {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') onSignedOut();
    });
    return () => {
      try {
        data?.subscription?.unsubscribe?.();
      } catch (e) {
        /* no-op */
      }
    };
  } catch (e) {
    logError('onAuthStateChange', e);
    return () => {};
  }
}

// === РАБОТА С ДАННЫМИ ===
export async function addStat(testName, correct, total) {
  const userId = await currentUserId();
  if (!userId) return;

  const { error } = await supabase.from('test_stats').insert({
    user_id: userId,
    test_name: testName,
    correct_answers: correct,
    total_questions: total
  });
  logError('addStat', error);
}

/**
 * Сводка по списку тестов одним проходом: ошибки и последний результат.
 * Раньше renderTestList делал по 2 запроса на тест, и каждый из них
 * дополнительно ходил в auth.getUser() — до 40 HTTP-запросов на экран.
 * @param {string[]} testNames
 * @returns {Promise<Record<string, {mistakes: string[], lastStat: {correct: number, total: number, date: string}|null}>>}
 */
export async function getTestsOverview(testNames = []) {
  const names = [...new Set((testNames || []).filter(Boolean))];
  /** @type {Record<string, {mistakes: string[], lastStat: any}>} */
  const result = {};
  names.forEach((n) => {
    result[n] = { mistakes: [], lastStat: null };
  });
  if (!names.length) return result;

  const userId = await currentUserId();
  if (!userId) return result;

  const [progressRes, statsRes] = await Promise.all([
    supabase
      .from('user_progress')
      .select('test_name, question_id')
      .eq('user_id', userId)
      .eq('is_correct', false)
      .neq('question_id', 'STATS')
      .in('test_name', names),
    // По одному самому свежему результату на тест: полную историю тянуть незачем.
    Promise.all(names.map(async (name) => {
      const { data, error } = await supabase
        .from('test_stats')
        .select('correct_answers, total_questions, created_at')
        .eq('user_id', userId)
        .eq('test_name', name)
        .order('created_at', { ascending: false })
        .limit(1);
      logError('getTestsOverview:stat', error);
      return [name, data?.[0] || null];
    }))
  ]);

  logError('getTestsOverview:progress', progressRes.error);
  (progressRes.data || []).forEach((row) => {
    const bucket = result[row.test_name];
    if (!bucket) return;
    // Дедупликация на клиенте остаётся, но теперь это дёшево: один запрос.
    if (!bucket.mistakes.includes(row.question_id)) bucket.mistakes.push(row.question_id);
  });

  statsRes.forEach(([name, row]) => {
    const bucket = result[name];
    if (!bucket || !row) return;
    bucket.lastStat = {
      correct: row.correct_answers,
      total: row.total_questions,
      date: row.created_at
    };
  });

  return result;
}

export async function addMistake(testName, prompt) {
  const userId = await currentUserId();
  if (!userId) return;

  // Проверка «уже есть?» + вставка не атомарны: гонка возможна, если
  // в user_progress нет уникального индекса (user_id, test_name, question_id).
  const { data: existing, error: selectError } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('test_name', testName)
    .eq('question_id', prompt)
    .eq('is_correct', false)
    .limit(1);
  logError('addMistake:select', selectError);

  if (existing && existing.length > 0) return;

  const { error } = await supabase.from('user_progress').insert({
    user_id: userId,
    test_name: testName,
    question_id: prompt,
    is_correct: false
  });
  logError('addMistake:insert', error);
}

export async function removeMistake(testName, prompt) {
  const userId = await currentUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', userId)
    .eq('test_name', testName)
    .eq('question_id', prompt);
  logError('removeMistake', error);
}
