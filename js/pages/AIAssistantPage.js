/**
 * TRADITION IA - AI ASSISTANT PAGE VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';

export function renderAIAssistantPage() {
  const messages = Store.chatMessages || [];
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `
    <div class="layout-container">
      ${renderSidebar('user')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Assistant Virtuel IA</h1>
            <p class="page-subtitle">Explorez la grammaire, le vocabulaire et les traditions du Gabon avec notre intelligence artificielle</p>
          </div>
        </div>

        <div class="glass-card chat-container">
          <!-- Chat Header Bar -->
          <div class="chat-header-bar">
            <div class="chat-header-left">
              <div class="chat-avatar-wrapper">
                <img src="images/tradiia_icon.png" alt="Assistant Tradition IA" class="chat-avatar-img">
                <div class="chat-status-indicator" title="En ligne"></div>
              </div>
              <div class="chat-header-info">
                <h3>Assistant Tradition IA <span class="badge badge-gold" style="font-size: 0.7rem; padding: 2px 7px;">v2.0 Pro</span></h3>
                <p>Spécialiste du patrimoine linguistique & culturel du Gabon</p>
              </div>
            </div>

            <div class="chat-header-actions">
              <select id="chat-persona-mode-spa" class="chat-mode-select" title="Choisir le rôle de l'assistant">
                <option value="tuteur">🎓 Mode Tuteur Linguistique</option>
                <option value="culture">🏛️ Mode Guide Culturel & Rites</option>
                <option value="traducteur">⚡ Mode Traduction & Vocabulaire</option>
              </select>
              <button id="btn-clear-chat-spa" class="btn btn-secondary btn-icon" title="Effacer la discussion" style="font-size: 0.85rem;">🗑️</button>
            </div>
          </div>

          <!-- Suggestions rapides -->
          <div class="chat-suggestions">
            <button class="suggestion-chip btn-shortcut-chat" data-prompt="Comment dit-on 'Bonjour' et 'Merci' dans les 9 langues du Gabon ?">👋 Salutations 9 langues</button>
            <button class="suggestion-chip btn-shortcut-chat" data-prompt="Explique-moi les règles de grammaire et prononciation en Fang">📚 Grammaire Fang</button>
            <button class="suggestion-chip btn-shortcut-chat" data-prompt="Raconte-moi l'histoire et la symbolique du masque Mukudj Punu">🎭 Masque Mukudj Punu</button>
            <button class="suggestion-chip btn-shortcut-chat" data-prompt="Donne-moi 5 proverbes ancestraux gabonais avec leur signification">📜 Proverbes gabonais</button>
            <button class="suggestion-chip btn-shortcut-chat" data-prompt="Comment compter de 1 à 10 en Nzébi et en Myènè ?">🔢 Compter en Nzébi/Myènè</button>
          </div>

          <div id="chat-messages-list-spa" class="chat-messages">
            ${messages.map((m, idx) => {
              const isUser = m.role === 'user';
              const rawText = m.text || '';
              const isError = rawText.startsWith('❌');
              const formattedText = rawText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code style="background:rgba(245,158,11,0.15);color:var(--gold);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.9em;">$1</code>')
                .replace(/\n/g, '<br>');

              if (isUser) {
                return `
                  <div class="chat-msg-row user-row">
                    <div class="chat-msg-avatar">
                      ${Store.user?.name ? Store.user.name.charAt(0).toUpperCase() : '👤'}
                    </div>
                    <div class="chat-bubble-wrapper">
                      <div class="chat-bubble chat-bubble-user">
                        ${formattedText}
                      </div>
                      <div class="chat-msg-meta">
                        <span>Vous</span> • <span>${m.time || currentTime}</span>
                      </div>
                    </div>
                  </div>
                `;
              } else {
                return `
                  <div class="chat-msg-row ai-row">
                    <div class="chat-msg-avatar ai-avatar">
                      <img src="images/tradiia_icon.png" alt="Tradition IA">
                    </div>
                    <div class="chat-bubble-wrapper">
                      <div class="chat-bubble chat-bubble-ai ${isError ? 'chat-bubble-error' : ''}">
                        ${formattedText}
                      </div>
                      <div class="chat-msg-meta">
                        <span>Tradition IA</span> • <span>${m.time || currentTime}</span>
                      </div>
                      ${!isError ? `
                        <div class="chat-msg-actions">
                          <button class="chat-action-btn btn-copy-msg-spa" data-idx="${idx}">📋 Copier</button>
                          <button class="chat-action-btn btn-speak-msg-spa" data-idx="${idx}">🔊 Écouter</button>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `;
              }
            }).join('')}
          </div>

          <div class="chat-input-bar">
            <button id="btn-voice-chat-spa" class="btn btn-secondary btn-icon" title="Parler au micro (Saisie vocale)">🎙️</button>
            <div id="voice-chat-status-spa" class="voice-recording-status" style="display: none;">
              <span class="pulse-recording-dot"></span> Écoute en cours...
            </div>
            <div class="chat-input-field-wrapper">
              <input type="text" id="chat-input-text-spa" class="form-input" placeholder="Posez votre question sur les langues gabonaises (ex: Mbolo, grammaire Fang, rites Obamba)...">
            </div>
            <button id="btn-chat-send-spa" class="btn btn-primary">
              <span>Envoyer</span> ➔
            </button>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function initAIAssistantPageEvents() {
  const btnSend = document.getElementById('btn-chat-send-spa');
  const chatInput = document.getElementById('chat-input-text-spa');
  const messagesList = document.getElementById('chat-messages-list-spa');
  const btnVoice = document.getElementById('btn-voice-chat-spa');
  const voiceStatus = document.getElementById('voice-chat-status-spa');
  const btnClear = document.getElementById('btn-clear-chat-spa');

  if (messagesList) {
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  // ─── Reconnaissance Vocale ───────────────────────────────────────────────
  let isRecording = false;
  let recognition = null;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      isRecording = true;
      btnVoice?.classList.add('btn-recording-active');
      if (voiceStatus) voiceStatus.style.display = 'inline-flex';
    };

    recognition.onresult = (e) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        transcript += e.results[i][0].transcript;
      }
      if (chatInput && transcript) {
        chatInput.value = transcript;
      }
    };

    recognition.onerror = (e) => {
      isRecording = false;
      btnVoice?.classList.remove('btn-recording-active');
      if (voiceStatus) voiceStatus.style.display = 'none';
      if (window.showToast) window.showToast('Erreur microphone : ' + e.error, 'error');
    };

    recognition.onend = () => {
      isRecording = false;
      btnVoice?.classList.remove('btn-recording-active');
      if (voiceStatus) voiceStatus.style.display = 'none';
      if (chatInput && chatInput.value.trim()) {
        sendMessage();
      }
    };
  }

  btnVoice?.addEventListener('click', () => {
    if (!SpeechRecognition) {
      if (window.showToast) window.showToast('Reconnaissance vocale non disponible sur ce navigateur.', 'error');
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  });

  // ─── Suggestions Rapides ──────────────────────────────────────────────────
  document.querySelectorAll('.btn-shortcut-chat').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt && chatInput) {
        chatInput.value = prompt;
        sendMessage();
      }
    });
  });

  // ─── Effacer la Discussion ────────────────────────────────────────────────
  btnClear?.addEventListener('click', () => {
    Store.chatMessages = [
      {
        id: 'init_' + Date.now(),
        role: 'assistant',
        text: 'Mbolo ! 🇬🇦 Je suis votre assistant Tradition IA. Posez-moi vos questions sur la grammaire, le vocabulaire ou la culture gabonaise !',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    Store.notify();
    if (window.showToast) window.showToast('Discussion réinitialisée.');
  });

  // ─── Actions sur les messages (Copier & Écouter) ──────────────────────────
  document.querySelectorAll('.btn-copy-msg-spa').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-idx');
      const msg = Store.chatMessages[idx];
      if (msg?.text) {
        navigator.clipboard.writeText(msg.text);
        if (window.showToast) window.showToast('Message copié dans le presse-papier !');
      }
    });
  });

  document.querySelectorAll('.btn-speak-msg-spa').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-idx');
      const msg = Store.chatMessages[idx];
      if (msg?.text && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const clean = msg.text.replace(/[\*\#\`\_]/g, '');
        const utt = new SpeechSynthesisUtterance(clean);
        utt.lang = 'fr-FR';
        window.speechSynthesis.speak(utt);
      }
    });
  });

  // ─── Envoi du Message ────────────────────────────────────────────────────
  async function sendMessage() {
    const text = chatInput?.value?.trim();
    if (!text) return;

    chatInput.value = '';
    Store.addChatMessage('user', text);

    // Typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.id = 'typing-indicator-spa';
    typingBubble.className = 'chat-msg-row ai-row';
    typingBubble.innerHTML = `
      <div class="chat-msg-avatar ai-avatar">
        <img src="images/tradiia_icon.png" alt="IA">
      </div>
      <div class="chat-bubble-wrapper">
        <div class="chat-bubble chat-bubble-ai">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    messagesList?.appendChild(typingBubble);
    if (messagesList) messagesList.scrollTop = messagesList.scrollHeight;

    const persona = document.getElementById('chat-persona-mode-spa')?.value || 'tuteur';

    try {
      let reply;
      const isDeployed = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

      if (isDeployed) {
        const history = (Store.chatMessages || [])
          .filter(m => m.id !== '1' && !m.id?.startsWith('init_'))
          .slice(-16)
          .map(m => ({ role: m.role, text: m.text }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history, persona })
        });
        const data = await res.json();
        reply = data.reply || data.error;
      } else {
        reply = window.generateAIResponseFromPDF
          ? window.generateAIResponseFromPDF(text)
          : `Mbolo ! J'ai bien reçu votre question sur **"${text}"**.`;
      }

      document.getElementById('typing-indicator-spa')?.remove();
      Store.addChatMessage('assistant', reply);

    } catch (e) {
      document.getElementById('typing-indicator-spa')?.remove();
      Store.addChatMessage('assistant', '❌ Erreur de communication avec le serveur IA.');
    }
  }

  btnSend?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}
