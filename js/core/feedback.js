// js/core/feedback.js
import { supabase } from './supabase.js';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);
const MIME_TO_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

function extensionFor(file) {
  const fromName = (file.name.split('.').pop() || '').toLowerCase();
  if (ALLOWED_EXTENSIONS.has(fromName)) return fromName;
  return MIME_TO_EXT[file.type] || null;
}

export function initFeedbackWidget() {
  // Если виджет уже создан — второй не нужен.
  if (document.getElementById('feedbackWidget')) return;

  const widget = document.createElement('div');
  widget.id = 'feedbackWidget';
  widget.innerHTML = `
    <button type="button" id="feedbackToggleBtn" title="Сообщить об ошибке">🐞</button>

    <div id="feedbackModal" class="hidden">
      <div class="feedback-card">
        <h3 style="margin-top:0; color:var(--gold);">Сообщить об ошибке</h3>
        <textarea id="feedbackText" class="fill-input" rows="4" placeholder="Опишите проблему..." maxlength="2000" style="resize:none; margin-bottom:10px; width:100%;"></textarea>

        <label style="display:block; margin-bottom:15px; color:var(--text-muted); font-size:14px;">
          Прикрепить скриншот (необязательно, до 5 МБ):
          <input type="file" id="feedbackFile" accept="image/*" style="display:block; margin-top:5px; color:var(--text-main);">
        </label>

        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button type="button" id="feedbackCancelBtn" style="background:transparent; border:1px solid var(--border-color); color:var(--text-main);">Отмена</button>
          <button type="button" id="feedbackSubmitBtn" class="primary" style="width:auto; padding:8px 20px; font-size:15px;">Отправить</button>
        </div>
        <div id="feedbackStatus" role="status" aria-live="polite" style="margin-top:10px; font-size:13px; text-align:center;"></div>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  const modal = widget.querySelector('#feedbackModal');
  const textEl = widget.querySelector('#feedbackText');
  const fileInput = widget.querySelector('#feedbackFile');
  const statusEl = widget.querySelector('#feedbackStatus');
  const submitBtn = widget.querySelector('#feedbackSubmitBtn');
  const cancelBtn = widget.querySelector('#feedbackCancelBtn');

  const resetForm = () => {
    textEl.value = '';
    fileInput.value = '';
    statusEl.textContent = '';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
  };

  const openModal = () => {
    resetForm();
    modal.classList.remove('hidden');
    setTimeout(() => textEl.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.add('hidden');
  };

  widget.querySelector('#feedbackToggleBtn').addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);

  // Закрытие по клику на фон и по Esc — раньше модалку нельзя было
  // закрыть иначе как кнопкой «Отмена».
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  submitBtn.addEventListener('click', async () => {
    const text = textEl.value.trim();

    if (!text) {
      statusEl.textContent = 'Пожалуйста, опишите проблему.';
      statusEl.style.color = 'var(--danger)';
      return;
    }

    const file = fileInput.files[0] || null;
    let ext = null;

    if (file) {
      if (!file.type.startsWith('image/')) {
        statusEl.textContent = 'Можно прикрепить только изображение.';
        statusEl.style.color = 'var(--danger)';
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        statusEl.textContent = 'Файл больше 5 МБ. Пожалуйста, сожмите скриншот.';
        statusEl.style.color = 'var(--danger)';
        return;
      }
      ext = extensionFor(file);
      if (!ext) {
        statusEl.textContent = 'Неизвестный формат файла. Подойдут png, jpg, webp или gif.';
        statusEl.style.color = 'var(--danger)';
        return;
      }
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    statusEl.textContent = '';

    let uploadedPath = null;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id || null;
      let screenshotUrl = null;

      if (file) {
        uploadedPath = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('bug_screenshots')
          .upload(uploadedPath, file, { contentType: file.type || 'image/png' });

        if (uploadError) throw new Error('Ошибка загрузки скриншота: ' + uploadError.message);

        const { data: urlData } = supabase.storage.from('bug_screenshots').getPublicUrl(uploadedPath);
        screenshotUrl = urlData?.publicUrl || null;
      }

      const { error: dbError } = await supabase.from('bug_reports').insert({
        user_id: userId,
        message: text,
        screenshot_url: screenshotUrl,
        page_url: window.location.href
      });

      if (dbError) throw dbError;

      statusEl.textContent = '✅ Спасибо! Отчёт отправлен.';
      statusEl.style.color = 'var(--success)';

      setTimeout(() => {
        closeModal();
        resetForm();
      }, 2000);
    } catch (err) {
      console.error(err);

      // Файл уже загружен, а запись не создана — убираем сироту.
      if (uploadedPath) {
        try {
          await supabase.storage.from('bug_screenshots').remove([uploadedPath]);
        } catch (removeError) {
          console.error(removeError);
        }
      }

      statusEl.textContent = '❌ Ошибка: ' + (err?.message || String(err));
      statusEl.style.color = 'var(--danger)';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
    }
  });
}
