// js/modules/dialogues.js
import { DIALOGUES } from '../data/dialogues.js';
import { getCurrentUser } from '../core/storage.js';

export function init(container) {
  renderList(container);
  return () => {};
}

function renderList(container) {
  container.innerHTML = `
    <div style="min-height: 80vh; padding: 20px; animation: fadeIn 0.4s ease-out;">
      <div style="text-align: center; margin-bottom: 40px; margin-top: 20px;">
        <h1 style="font-size: 48px; font-weight: 900; color: var(--gold); margin: 0; text-shadow: 0 0 30px var(--gold-glow); letter-spacing: 2px;">Диалоги</h1>
        <p style="font-size: 16px; color: var(--text-muted); margin-top: 10px;">Тренировка реальных фраз в формате чата</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto;">
        ${DIALOGUES.map((dlg, index) => `
          <div class="menu-card" style="cursor: pointer; padding: 20px; align-items: flex-start; text-align: left;" onclick="window.startDialogue(${index})">
            <div style="font-size: 40px; margin-bottom: 10px;">💬</div>
            <div style="font-weight: 800; font-size: 20px; color: var(--gold); margin-bottom: 5px;">${dlg.title}</div>
            <div style="font-size: 14px; color: var(--text-muted);">${dlg.description}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  window.startDialogue = (index) => startDialogue(container, index);
}

function startDialogue(container, dialogueIndex) {
  const dialogue = DIALOGUES[dialogueIndex];
  let currentStep = 0;
  
  // Получаем имя пользователя (или "Иван", если имя не задано)
  const userName = getCurrentUser() || 'Иван';
  
  // Функция для подстановки имени в текст
  const formatText = (text) => text.replace(/\{\{username\}\}/g, userName);

  container.innerHTML = `
    <div class="chat-container">
      <div class="chat-header">
        <button id="backToDialogs" style="background: transparent; border: none; color: var(--gold); font-size: 24px; cursor: pointer; padding-right: 15px;">←</button>
        <div>
          <div style="font-weight: bold; color: var(--text-main);">${dialogue.title}</div>
          <div style="font-size: 12px; color: var(--success);">В сети</div>
        </div>
      </div>
      
      <div class="chat-messages" id="chatMessages"></div>
      
      <div class="chat-options" id="chatOptions"></div>
    </div>
  `;

  document.getElementById('backToDialogs').addEventListener('click', () => renderList(container));

  const messagesArea = document.getElementById('chatMessages');
  const optionsArea = document.getElementById('chatOptions');

  function showBotMessage(text) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-bubble bot typing';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    messagesArea.appendChild(typingDiv);
    scrollToBottom();

    setTimeout(() => {
      typingDiv.remove();
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-bubble bot';
      // Убрали перевод, оставили только китайский текст
      msgDiv.innerHTML = `<div style="font-size: 20px; font-weight: bold;">${formatText(text)}</div>`;
      messagesArea.appendChild(msgDiv);
      scrollToBottom();
      
      showOptions();
    }, 800);
  }

  function showOptions() {
    const step = dialogue.steps[currentStep];
    if (!step) return;

    optionsArea.innerHTML = '';
    
    // Перемешиваем и сразу подставляем имя в варианты ответов
    const shuffled = [...step.options].sort(() => Math.random() - 0.5);
    
    shuffled.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-option-btn';
      btn.textContent = formatText(opt);
      btn.onclick = () => handleAnswer(opt, step.correct);
      optionsArea.appendChild(btn);
    });
  }

  function handleAnswer(chosen, correct) {
    optionsArea.innerHTML = ''; 

    // Сравниваем оригинальные строки (с плейсхолдерами)
    const isCorrect = chosen === correct;
    
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble user';
    if (!isCorrect) userMsg.classList.add('wrong');
    userMsg.textContent = formatText(chosen);
    messagesArea.appendChild(userMsg);
    scrollToBottom();

    if (isCorrect) {
      currentStep++;
      if (currentStep >= dialogue.steps.length) {
        setTimeout(() => finishDialogue(), 1000);
      } else {
        setTimeout(() => {
          const nextStep = dialogue.steps[currentStep];
          showBotMessage(nextStep.bot); // Передаем только текст
        }, 1000);
      }
    } else {
      setTimeout(() => {
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = 'text-align: center; color: var(--danger); font-size: 14px; margin: 10px 0;';
        errorMsg.textContent = `Правильный ответ: ${formatText(correct)}`;
        messagesArea.appendChild(errorMsg);
        scrollToBottom();

        setTimeout(() => showOptions(), 1500);
      }, 500);
    }
  }

  function finishDialogue() {
    optionsArea.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 50px; margin-bottom: 10px;">🎉</div>
        <h3 style="color: var(--gold);">Диалог завершён!</h3>
        <button class="primary" onclick="window.location.reload()" style="margin-top: 15px;">Вернуться к списку</button>
      </div>
    `;
  }

  function scrollToBottom() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Запускаем первый шаг
  showBotMessage(dialogue.steps[0].bot);
}