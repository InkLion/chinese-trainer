// js/core/storage.js
import { supabase } from './supabase.js';

const USER_KEY = 'hsk_current_user';

// === УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЕМ ===
export function getCurrentUser() {
  return localStorage.getItem(USER_KEY);
}

export function setCurrentUser(name) {
  localStorage.setItem(USER_KEY, name.trim());
}

export async function logout() {
  localStorage.removeItem(USER_KEY);
  await supabase.auth.signOut(); // Выход из Supabase
}

export async function getAllUsers() {
  const { data } = await supabase.from('profiles').select('username');
  return (data || []).map(d => d.username);
}

// === РАБОТА С ДАННЫМИ ===
export async function addStat(testName, correct, total) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Теперь пишем в новую таблицу test_stats
  await supabase.from('test_stats').insert({
    user_id: user.id,
    test_name: testName,
    correct_answers: correct,
    total_questions: total
  });
}

export async function getStats(testName) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('test_stats') // Читаем из новой таблицы
    .select('*')
    .eq('user_id', user.id)
    .eq('test_name', testName)
    .order('created_at', { ascending: false });

  return (data || []).map(d => ({
    date: d.created_at,
    correct: d.correct_answers,
    total: d.total_questions
  }));
}

export async function addMistake(testName, prompt) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Сначала проверяем, есть ли уже такая ошибка у пользователя
  const { data: existing } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('test_name', testName)
    .eq('question_id', prompt)
    .eq('is_correct', false)
    .limit(1);

  // 2. Если ошибки нет, только тогда добавляем
  if (!existing || existing.length === 0) {
    await supabase.from('user_progress').insert({
      user_id: user.id,
      test_name: testName,
      question_id: prompt,
      is_correct: false
    });
  }
}

export async function removeMistake(testName, prompt) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('test_name', testName)
    .eq('question_id', prompt);
}

export async function getMistakes(testName) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('user_progress')
    .select('question_id')
    .eq('user_id', user.id)
    .eq('test_name', testName)
    .eq('is_correct', false)
    .neq('question_id', 'STATS'); // <-- ВАЖНО: Исключаем служебную запись STATS из списка ошибок!

  // Убираем дубликаты на всякий случай
  const uniqueMistakes = [...new Set((data || []).map(d => d.question_id))];
  return uniqueMistakes;
}