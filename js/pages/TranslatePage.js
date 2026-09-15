/**
 * TRADITION IA - TRANSLATE PAGE VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export function renderTranslatePage() {
  const languages = Store.languages;

  return `
    <div class="layout-container">
      ${renderSidebar('user')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Traducteur Intelligent</h1>
            <p class="page-subtitle">Traduisez instantanément entre le Français et les langues locales du Gabon</p>
          </div>
        </div>

        <div class="glass-card" style="overflow: hidden;">
          <div class="translation-box">
            <!-- Source Box -->
            <div style="border-right: 1px solid var(--border-color); padding: 24px;">
              <div class="lang-select-bar">
                <span class="badge badge-green">Langue Source</span>
                <select id="translate-src-lang" class="form-select" style="width: auto; padding: 6px 12px; font-weight: 600;">
                  <option value="Français">Français</option>
                </select>
              </div>
              <textarea id="translate-source-text" class="translation-textarea" placeholder="Saisissez votre texte à traduire ici (ex: Bonjour, comment allez-vous ?)..."></textarea>
              <div class="translation-actions">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <button id="btn-voice-input" class="btn btn-secondary btn-icon" title="Parler au micro (Saisie vocale)">🎙️</button>
                  <div id="voice-recording-status" class="voice-recording-status" style="display: none;">
                    <span class="pulse-recording-dot"></span> Écoute en cours...
                  </div>
                  <span id="voice-recording-hint" style="font-size: 0.8rem; color: var(--text-dim);">Traduction instantanée IA</span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <button id="btn-clear-source" class="btn btn-secondary" style="display: none; padding: 8px 14px; font-size: 0.88rem;" title="Effacer le texte">✕ Effacer</button>
                  <button id="btn-do-translate" class="btn btn-primary">
                    <span>Traduire</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Target Box -->
            <div style="padding: 24px;">
              <div class="lang-select-bar">
                <span class="badge badge-blue">Langue Cible</span>
                <select id="translate-target-lang" class="form-select" style="width: auto; padding: 6px 12px; font-weight: 600;">
                  ${languages.map(l => `<option value="${l.name}">${l.name}</option>`).join('')}
                </select>
              </div>
              <div class="target-box-wrapper">
                <div id="target-mask-watermark" class="target-mask-watermark" style="background-image: url('images/fang.png');"></div>
                <textarea id="translate-target-text" class="translation-textarea target-textarea-with-mask" placeholder="La traduction en langue locale s'affichera ici..." readonly style="color: var(--primary); font-weight: 600;"></textarea>
              </div>
              <div class="translation-actions">
                <div style="display: flex; gap: 8px;">
                  <button id="btn-copy-translation" class="btn btn-secondary btn-icon" title="Copier">📋</button>
                  <button id="btn-speak-translation" class="btn btn-secondary btn-icon" title="Écouter">🔊</button>
                </div>
                <span class="badge badge-gold">Moteur Tradition IA</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Raccourcis d'expressions courantes -->
        <div style="margin-top: 36px;">
          <h3 style="font-size: 1.1rem; margin-bottom: 16px;">Expressions Courantes Rapides</h3>
          <div class="grid-3">
            ${Store.expressions.slice(0, 3).map(e => `
              <div class="glass-card glass-card-interactive" style="padding: 16px;" data-quick-expr="${e.phrase}" data-quick-lang="${e.targetLang}">
                <div style="font-weight: 700; color: #FFF; margin-bottom: 4px;">"${e.phrase}"</div>
                <div style="color: var(--primary); font-weight: 700; font-size: 0.95rem;">➔ ${e.translation}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 6px;">Langue: ${e.targetLang} (${e.context})</div>
              </div>
            `).join('')}
          </div>
        </div>
      </main>
    </div>
  `;
}

export function initTranslatePageEvents() {
  const btnTranslate = document.getElementById('btn-do-translate');
  const srcInput = document.getElementById('translate-source-text');
  const targetOutput = document.getElementById('translate-target-text');
  const srcLangSelect = document.getElementById('translate-src-lang');
  const targetLangSelect = document.getElementById('translate-target-lang');
  const btnCopy = document.getElementById('btn-copy-translation');
  const btnSpeak = document.getElementById('btn-speak-translation');
  const btnClear = document.getElementById('btn-clear-source');
  const btnVoice = document.getElementById('btn-voice-input');
  const voiceStatus = document.getElementById('voice-recording-status');
  const voiceHint = document.getElementById('voice-recording-hint');
  const watermarkEl = document.getElementById('target-mask-watermark');

  // ─── Reconnaissance Vocale (Speech-to-Text) ──────────────────────────
  let recognition = null;
  let isRecording = false;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => {
      isRecording = true;
      if (btnVoice) btnVoice.classList.add('btn-recording-active');
      if (voiceStatus) voiceStatus.style.display = 'inline-flex';
      if (voiceHint) voiceHint.style.display = 'none';
      showToast('Microphone activé : Parlez maintenant...');
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      if (srcInput && transcript) {
        srcInput.value = transcript;
        handleSourceInput();
      }
    };

    recognition.onerror = (event) => {
      console.warn('[SpeechRecognition Error]', event.error);
      stopVoiceRecording();
      if (event.error === 'not-allowed') {
        showToast('Accès au micro refusé. Veuillez autoriser le microphone.', 'error');
      } else if (event.error === 'no-speech') {
        showToast('Aucune voix détectée.', 'info');
      } else {
        showToast('Erreur micro : ' + event.error, 'error');
      }
    };

    recognition.onend = () => {
      stopVoiceRecording();
      if (srcInput && srcInput.value.trim()) {
        handleSourceInput();
        btnTranslate?.click();
      }
    };
  }

  function stopVoiceRecording() {
    isRecording = false;
    if (btnVoice) btnVoice.classList.remove('btn-recording-active');
    if (voiceStatus) voiceStatus.style.display = 'none';
    if (voiceHint) voiceHint.style.display = 'inline-block';
  }

  btnVoice?.addEventListener('click', () => {
    if (!SpeechRecognition) {
      showToast('La reconnaissance vocale n\'est pas supportée sur ce navigateur.', 'error');
      return;
    }

    if (isRecording) {
      recognition.stop();
      stopVoiceRecording();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
        stopVoiceRecording();
      }
    }
  });

  function updateTargetMask() {
    if (!watermarkEl) return;
    const targetLang = targetLangSelect ? targetLangSelect.value : 'Fang';
    const maskUrl = (window.Masks && typeof window.Masks.getImage === 'function')
      ? window.Masks.getImage(targetLang)
      : `images/${targetLang.toLowerCase()}.png`;
    watermarkEl.style.backgroundImage = `url('${maskUrl}')`;
  }

  targetLangSelect?.addEventListener('change', updateTargetMask);

  // Sélection automatique de la langue cible depuis l'URL ou le hash
  if (targetLangSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    let targetParam = urlParams.get('target') || urlParams.get('to') || urlParams.get('lang');
    if (!targetParam && window.location.hash.includes('target=')) {
      const hashQuery = window.location.hash.split('?')[1];
      if (hashQuery) {
        const hashParams = new URLSearchParams(hashQuery);
        targetParam = hashParams.get('target') || hashParams.get('to') || hashParams.get('lang');
      }
    }

    if (targetParam && targetLangSelect.options.length > 0) {
      const searchVal = decodeURIComponent(targetParam).trim().toLowerCase();
      for (let i = 0; i < targetLangSelect.options.length; i++) {
        const opt = targetLangSelect.options[i];
        if (opt.value.toLowerCase() === searchVal || opt.text.toLowerCase() === searchVal) {
          targetLangSelect.selectedIndex = i;
          break;
        }
      }
    }
    updateTargetMask();
  }

  // Effacer la traduction cible dès que la zone source est vide
  const handleSourceInput = () => {
    if (srcInput && targetOutput) {
      if (!srcInput.value.trim()) {
        targetOutput.value = '';
        if (btnClear) btnClear.style.display = 'none';
      } else {
        if (btnClear) btnClear.style.display = 'inline-flex';
      }
    }
  };

  if (srcInput) {
    srcInput.addEventListener('input', handleSourceInput);
    srcInput.addEventListener('keyup', handleSourceInput);
    srcInput.addEventListener('change', handleSourceInput);
    srcInput.addEventListener('paste', () => setTimeout(handleSourceInput, 50));
  }

  btnClear?.addEventListener('click', () => {
    if (srcInput) srcInput.value = '';
    if (targetOutput) targetOutput.value = '';
    if (btnClear) btnClear.style.display = 'none';
    srcInput?.focus();
  });

  if (btnTranslate && srcInput && targetOutput) {
    btnTranslate.addEventListener('click', async () => {
      const text = srcInput.value;
      const srcLang = srcLangSelect ? srcLangSelect.value : 'Français';
      const targetLang = targetLangSelect ? targetLangSelect.value : 'Fang';

      if (!text.trim()) {
        targetOutput.value = '';
        showToast('Veuillez saisir un texte à traduire.', 'error');
        return;
      }

      btnTranslate.innerHTML = `<span>Traduction en cours...</span>`;
      btnTranslate.disabled = true;

      setTimeout(async () => {
        const result = await Store.translateText(text, srcLang, targetLang);
        targetOutput.value = result;

        btnTranslate.innerHTML = `<span>Traduire</span>`;
        btnTranslate.disabled = false;
        showToast('Traduction générée avec succès !');
      }, 400);
    });
  }

  if (btnCopy && targetOutput) {
    btnCopy.addEventListener('click', () => {
      if (targetOutput.value) {
        navigator.clipboard.writeText(targetOutput.value);
        showToast('Texte copié dans le presse-papier !');
      }
    });
  }

  if (btnSpeak && targetOutput) {
    btnSpeak.addEventListener('click', () => {
      if (targetOutput.value && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(targetOutput.value);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
        showToast('Lecture audio de la traduction...');
      }
    });
  }

  // Raccourcis expressions
  document.querySelectorAll('[data-quick-expr]').forEach(card => {
    card.addEventListener('click', () => {
      const expr = card.getAttribute('data-quick-expr');
      const lang = card.getAttribute('data-quick-lang');
      if (srcInput && targetLangSelect) {
        srcInput.value = expr;
        targetLangSelect.value = lang;
        btnTranslate?.click();
      }
    });
  });
}
