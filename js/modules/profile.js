// js/modules/profile.js
import { setCurrentUser } from '../core/storage.js';
import { supabase } from '../core/supabase.js';

const MIN_PASSWORD_LENGTH = 6;

export function init(container) {
  let view = 'login'; // 'login' | 'register'

  function render() {
    container.innerHTML = `
      <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div class="card" style="width: 100%; max-width: 400px; padding: 30px 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.6); border: 1px solid rgba(244,196,48,0.2);">

          <!-- Крупный логотип -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 72px; font-weight: 900; color: var(--gold); line-height: 1; text-shadow: 0 0 30px rgba(244,196,48,0.4); letter-spacing: 4px;">汉语</div>
            <div style="font-size: 16px; color: var(--text-muted); margin-top: 8px; letter-spacing: 2px; text-transform: uppercase;">Тренажёр</div>
          </div>

          <!-- Переключатель Вход / Регистрация -->
          <div style="display: flex; margin-bottom: 24px; background: rgba(0,0,0,0.4); border-radius: 12px; padding: 4px; border: 1px solid var(--border-color);">
            <button type="button" id="tabLogin" style="flex:1; padding:12px; border-radius:8px; background:${view === 'login' ? 'var(--gold)' : 'transparent'}; color:${view === 'login' ? '#000' : 'var(--text-main)'}; border:none; cursor:pointer; font-weight:bold; transition: 0.2s;">Вход</button>
            <button type="button" id="tabRegister" style="flex:1; padding:12px; border-radius:8px; background:${view === 'register' ? 'var(--gold)' : 'transparent'}; color:${view === 'register' ? '#000' : 'var(--text-main)'}; border:none; cursor:pointer; font-weight:bold; transition: 0.2s;">Регистрация</button>
          </div>

          <div id="formArea" style="display:flex; flex-direction:column; gap:16px;">

            <!-- Строго одинаковые поля -->
            <input type="text" id="username" class="fill-input login-input" placeholder="Ваш ник (латиницей)" autocomplete="off" spellcheck="false" maxlength="24">
            <input type="password" id="password" class="fill-input login-input" placeholder="Пароль (от 6 символов)" autocomplete="current-password" maxlength="72">

            <button type="button" id="submitBtn" class="primary" style="margin-top: 8px;">
              ${view === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>

            <div id="authMsg" role="status" aria-live="polite" style="color: var(--danger); font-size: 14px; min-height: 20px; text-align: center; line-height: 1.4;"></div>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#tabLogin').addEventListener('click', () => { view = 'login'; render(); });
    container.querySelector('#tabRegister').addEventListener('click', () => { view = 'register'; render(); });
    container.querySelector('#submitBtn').addEventListener('click', handleSubmit);

    // Enter отправляет форму: раньше работал только клик по кнопке.
    container.querySelectorAll('.login-input').forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        }
      });
      input.addEventListener('input', () => {
        const msg = container.querySelector('#authMsg');
        if (msg) msg.textContent = '';
      });
    });

    setTimeout(() => {
      if (container.isConnected) container.querySelector('#username')?.focus();
    }, 50);
  }

  async function handleSubmit() {
    const usernameEl = container.querySelector('#username');
    const passwordEl = container.querySelector('#password');
    const msgEl = container.querySelector('#authMsg');
    const btn = container.querySelector('#submitBtn');
    if (!usernameEl || !passwordEl || !msgEl || !btn) return;

    const rawUsername = usernameEl.value.trim();
    const password = passwordEl.value;

    msgEl.textContent = '';

    if (!rawUsername || !password) {
      msgEl.textContent = 'Заполните все поля.';
      return;
    }

    // Проверка на латиницу, цифры, дефис и подчеркивание
    if (!/^[a-zA-Z0-9_-]+$/.test(rawUsername)) {
      msgEl.textContent = 'Ник должен содержать только английские буквы, цифры, знаки _ и -.';
      return;
    }

    if (view === 'register' && password.length < MIN_PASSWORD_LENGTH) {
      msgEl.textContent = `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`;
      return;
    }

    // Превращаем ник в служебный email (нижний регистр, чтобы не путать Ivan/ivan)
    const technicalEmail = `${rawUsername.toLowerCase()}@trenerzh.local`;

    btn.disabled = true;
    btn.textContent = 'Подождите...';

    try {
      if (view === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email: technicalEmail,
          password
        });
        if (error) throw error;

        // Supabase может не вернуть пользователя (например, если в проекте
        // включено подтверждение e-mail) — раньше это падало на data.user.id.
        const userId = data?.user?.id;
        if (!userId) {
          throw new Error('Аккаунт создан, но вход не выполнен. Проверьте настройки подтверждения e-mail в Supabase.');
        }

        const { error: profileErr } = await supabase
          .from('profiles')
          .insert({ id: userId, username: rawUsername });

        if (profileErr) throw profileErr;

        setCurrentUser(rawUsername);
        window.location.hash = '#/';
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: technicalEmail,
        password
      });
      if (error) throw error;

      const userId = data?.user?.id;
      if (!userId) throw new Error('Не удалось получить профиль пользователя.');

      // Получаем ник из профиля (на случай, если регистр изменился)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 — «строка не найдена», обрабатываем ниже как отсутствие профиля.
        throw profileError;
      }
      if (!profile?.username) {
        throw new Error('Профиль не найден в базе.');
      }

      setCurrentUser(profile.username);
      window.location.hash = '#/';
    } catch (err) {
      const message = err?.message || String(err);
      if (message.includes('User already registered')) {
        msgEl.textContent = 'Этот ник уже занят. Попробуйте другой.';
      } else if (message.includes('Invalid login credentials')) {
        msgEl.textContent = 'Неверный ник или пароль.';
      } else if (message.includes('Password should be')) {
        msgEl.textContent = `Слишком простой пароль: нужно не короче ${MIN_PASSWORD_LENGTH} символов.`;
      } else {
        msgEl.textContent = message;
      }
      btn.disabled = false;
      btn.textContent = view === 'login' ? 'Войти' : 'Зарегистрироваться';
    }
  }

  render();
  return () => {};
}
