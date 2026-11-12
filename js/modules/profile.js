// js/modules/profile.js
import { setCurrentUser } from '../core/storage.js';
import { supabase } from '../core/supabase.js';

export function init(container) {
  let view = 'login'; // 'login' | 'register'

  function render() {
    container.innerHTML = `
      <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div class="card" style="width: 100%; max-width: 400px; padding: 30px 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.6); border: 1px solid rgba(244,196,48,0.2);">
          
          <!-- Крупный логотип -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 72px; font-weight: 900; color: var(--gold); line-height: 1; text-shadow: 0 0 30px rgba(244,196,48,0.4); letter-spacing: 4px;">汉语</div>
            <div style="font-size: 16px; color: #b9a9d4; margin-top: 8px; letter-spacing: 2px; text-transform: uppercase;">Тренажёр</div>
          </div>

          <!-- Переключатель Вход / Регистрация -->
          <div style="display: flex; margin-bottom: 24px; background: rgba(0,0,0,0.4); border-radius: 12px; padding: 4px; border: 1px solid var(--border);">
            <button id="tabLogin" style="flex:1; padding:12px; border-radius:8px; background:${view === 'login' ? 'var(--gold)' : 'transparent'}; color:${view === 'login' ? '#000' : '#fff'}; border:none; cursor:pointer; font-weight:bold; transition: 0.2s;">Вход</button>
            <button id="tabRegister" style="flex:1; padding:12px; border-radius:8px; background:${view === 'register' ? 'var(--gold)' : 'transparent'}; color:${view === 'register' ? '#000' : '#fff'}; border:none; cursor:pointer; font-weight:bold; transition: 0.2s;">Регистрация</button>
          </div>

          <div id="formArea" style="display:flex; flex-direction:column; gap:16px;">
            
            <!-- Строго одинаковые поля -->
            <input type="text" id="username" class="fill-input login-input" placeholder="Ваш ник (латиницей)" autocomplete="off" spellcheck="false">
            <input type="password" id="password" class="fill-input login-input" placeholder="Пароль (от 6 символов)" autocomplete="off">
            
            <button id="submitBtn" class="primary" style="margin-top: 8px;">
              ${view === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
            
            <div id="authMsg" style="color: #ff8a8a; font-size: 14px; min-height: 20px; text-align: center; line-height: 1.4;"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('tabLogin').onclick = () => { view = 'login'; render(); };
    document.getElementById('tabRegister').onclick = () => { view = 'register'; render(); };
    document.getElementById('submitBtn').onclick = handleSubmit;
    
    setTimeout(() => document.getElementById('username').focus(), 50);
  }

  async function handleSubmit() {
    const rawUsername = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const msgEl = document.getElementById('authMsg');
    const btn = document.getElementById('submitBtn');

    if (!rawUsername || !password) {
      msgEl.textContent = 'Заполните все поля.';
      return;
    }

    // Проверка на латиницу, цифры, дефис и подчеркивание
    const loginRegex = /^[a-zA-Z0-9_-]+$/;
    if (!loginRegex.test(rawUsername)) {
      msgEl.textContent = 'Ник должен содержать только английские буквы, цифры, знаки _ и -.';
      return;
    }

    // Превращаем ник в служебный email (приводим к нижнему регистру, чтобы избежать путаницы)
    const technicalEmail = `${rawUsername.toLowerCase()}@trenerzh.local`;

    btn.disabled = true;
    btn.textContent = 'Подождите...';
    msgEl.textContent = '';

    try {
      if (view === 'register') {
        // 1. Регистрация в Auth (передаем ник в метаданные)
        const { data, error } = await supabase.auth.signUp({ 
          email: technicalEmail, 
          password: password,
          options: {
            data: {
              username: rawUsername // <-- Передаем ник для триггера
            }
          }
        });
        if (error) throw error;

        // ВАЖНО: Мы больше не делаем insert вручную! 
        // База данных сама создаст профиль через триггер.

        setCurrentUser(rawUsername);
        window.location.hash = '#/';
        window.location.reload();

      } else {
        // Вход
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: technicalEmail, 
          password: password 
        });
        if (error) throw error;

        // Получаем ник из профиля (на случай, если регистр изменился)
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          setCurrentUser(profile.username);
          window.location.hash = '#/';
          window.location.reload();
        } else {
          throw new Error('Профиль не найден в базе.');
        }
      }
    } catch (err) {
      // Переводим частые ошибки Supabase на понятный язык
      if (err.message.includes('User already registered')) {
        msgEl.textContent = 'Этот ник уже занят. Попробуйте другой.';
      } else if (err.message.includes('Invalid login credentials')) {
        msgEl.textContent = 'Неверный ник или пароль.';
      } else {
        msgEl.textContent = err.message;
      }
      btn.disabled = false;
      btn.textContent = view === 'login' ? 'Войти' : 'Зарегистрироваться';
    }
  }

  render();
  return () => {};
}
