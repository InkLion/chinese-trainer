// js/core/feedback.js
import { supabase } from './supabase.js';

export function initFeedbackWidget() {
  // Если кнопка уже есть, не создаем вторую
  if (document.getElementById('feedbackWidget')) return;

  // Создаем контейнер
  const widget = document.createElement('div');
  widget.id = 'feedbackWidget';
  widget.innerHTML = `
    <button id="feedbackToggleBtn" title="Сообщить об ошибке">🐞</button>
    
    <div id="feedbackModal" class="hidden">
      <div class="feedback-card">
        <h3 style="margin-top:0; color:var(--gold);">Сообщить об ошибке</h3>
        <textarea id="feedbackText" class="fill-input" rows="4" placeholder="Опишите проблему..." style="resize:none; margin-bottom:10px; width:100%;"></textarea>
        
        <label style="display:block; margin-bottom:15px; color:var(--text-muted); font-size:14px;">
          Прикрепить скриншот (необязательно):
          <input type="file" id="feedbackFile" accept="image/*" style="display:block; margin-top:5px; color:var(--text-main);">
        </label>
        
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button id="feedbackCancelBtn" style="background:transparent; border:1px solid var(--border-color); color:var(--text-main);">Отмена</button>
          <button id="feedbackSubmitBtn" class="primary" style="width:auto; padding:8px 20px; font-size:15px;">Отправить</button>
        </div>
        <div id="feedbackStatus" style="margin-top:10px; font-size:13px; text-align:center;"></div>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  // Логика открытия/закрытия
  const modal = document.getElementById('feedbackModal');
  document.getElementById('feedbackToggleBtn').onclick = () => modal.classList.remove('hidden');
  document.getElementById('feedbackCancelBtn').onclick = () => modal.classList.add('hidden');

  // Обработка отправки
  document.getElementById('feedbackSubmitBtn').onclick = async () => {
    const text = document.getElementById('feedbackText').value.trim();
    const fileInput = document.getElementById('feedbackFile');
    const statusEl = document.getElementById('feedbackStatus');
    const submitBtn = document.getElementById('feedbackSubmitBtn');

    if (!text) {
      statusEl.textContent = 'Пожалуйста, опишите проблему.';
      statusEl.style.color = 'var(--danger)';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    statusEl.textContent = '';

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let screenshotUrl = null;

      // 1. Если есть файл, загружаем его в Storage
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('bug_screenshots')
          .upload(fileName, file);

        if (uploadError) throw new Error('Ошибка загрузки скриншота: ' + uploadError.message);

        // Получаем публичную ссылку
        const { data: urlData } = supabase.storage
          .from('bug_screenshots')
          .getPublicUrl(fileName);
          
        screenshotUrl = urlData.publicUrl;
      }

      // 2. Сохраняем запись в базу
      const { error: dbError } = await supabase.from('bug_reports').insert({
        user_id: user?.id || null,
        message: text,
        screenshot_url: screenshotUrl,
        page_url: window.location.href // Записываем, на какой странице была ошибка
      });

      if (dbError) throw dbError;

      // Успех
      statusEl.textContent = '✅ Спасибо! Отчёт отправлен.';
      statusEl.style.color = 'var(--success)';
      
      setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('feedbackText').value = '';
        fileInput.value = '';
        statusEl.textContent = '';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
      }, 2000);

    } catch (err) {
      console.error(err);
      statusEl.textContent = '❌ Ошибка: ' + err.message;
      statusEl.style.color = 'var(--danger)';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
    }
  };
}