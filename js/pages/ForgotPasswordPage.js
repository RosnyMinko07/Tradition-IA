/**
 * TRADITION IA - FORGOT PASSWORD PAGE VIEW
 */

import { Router } from '../router.js';
import { showToast } from '../components/Toast.js';

export function renderForgotPasswordPage() {
  return `
    <main class="main-content" style="max-width: 480px; margin: 40px auto; width: 100%;">
      <div class="glass-card" style="padding: 36px; text-align: center;">
        <div style="margin-bottom: 20px; display: flex; justify-content: center; align-items: center;">
          <img src="images/drapeau%20gabon.png" alt="Drapeau du Gabon" style="width: 76px; height: auto; max-height: 48px; object-fit: contain; filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 15px rgba(0, 230, 118, 0.3)); display: block;">
        </div>
        <h1 style="font-size: 1.8rem; margin-bottom: 8px;">Mot de passe oublié</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 28px;">Saisissez votre email pour recevoir un lien de réinitialisation</p>

        <form id="form-forgot-spa" style="display: flex; flex-direction: column; gap: 20px; text-align: left;">
          <div class="form-group">
            <label class="form-label">Adresse Email</label>
            <input type="email" id="forgot-email" class="form-input" placeholder="ex: votre.email@mail.ga" required>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 1rem; margin-top: 10px;">
            Envoyer le lien de secours ➔
          </button>
        </form>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-color); font-size: 0.88rem; color: var(--text-muted);">
          Retour à la <a href="#login" style="color: var(--primary); font-weight: 600;">Page de Connexion</a>
        </div>
      </div>
    </main>
  `;
}

export function initForgotPasswordPageEvents() {
  const form = document.getElementById('form-forgot-spa');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    showToast(`Un email de réinitialisation a été envoyé à ${email}`);
    setTimeout(() => Router.navigate('login'), 1500);
  });
}
