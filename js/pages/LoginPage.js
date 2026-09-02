/**
 * TRADITION IA - LOGIN PAGE VIEW
 */

import { Store } from '../store.js';
import { Router } from '../router.js';
import { showToast } from '../components/Toast.js';

export function renderLoginPage() {
  return `
    <main class="main-content" style="max-width: 1140px; margin: 0 auto; width: 100%;">
      <div class="auth-container">
        <div class="auth-left">
          <div class="auth-left-content">
            <div class="auth-img-glow-wrapper">
              <img src="images/carte_gabon_nobg.png" alt="Carte du Gabon - Tradition IA" class="auth-gabon-img">
            </div>
            <h2 class="auth-left-title">Patrimoine & Culture</h2>
            <p class="auth-left-subtitle">Explorez et préservez la richesse des langues vernaculaires du Gabon grâce à l'Intelligence Artificielle.</p>
          </div>
        </div>

        <div class="auth-right">
          <div style="margin-bottom: 20px; display: flex; justify-content: center; align-items: center;">
            <img src="images/drapeau%20gabon.png" alt="Drapeau du Gabon" style="width: 76px; height: auto; max-height: 48px; object-fit: contain; filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 15px rgba(0, 230, 118, 0.3)); display: block;">
          </div>
          <h1 style="font-size: 1.7rem; margin-bottom: 6px; text-align: center;">Connexion</h1>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 22px; text-align: center;">Connectez-vous à la plateforme Tradition IA</p>

          <form id="form-login-spa" style="display: flex; flex-direction: column; gap: 16px; text-align: left;">
            <div class="form-group">
              <label class="form-label">Adresse Email</label>
              <input type="email" id="login-email" class="form-input" placeholder="ex: user@tradition.ga" required value="user@tradition.ga">
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label class="form-label">Mot de passe</label>
                <a href="#forgot-password" style="font-size: 0.8rem; color: var(--primary);">Oublié ?</a>
              </div>
              <input type="password" id="login-password" class="form-input" placeholder="••••••••" required value="123456">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 11px; font-size: 0.95rem; margin-top: 4px;">
              Se Connecter ➔
            </button>
          </form>

          <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--border-color); font-size: 0.85rem; color: var(--text-muted); text-align: center;">
            Pas encore de compte ? <a href="#register" style="color: var(--primary); font-weight: 600;">S'inscrire gratuitement</a>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function initLoginPageEvents() {
  const form = document.getElementById('form-login-spa');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    const user = Store.login(email, pass);
    showToast(`Bienvenue, ${user.name} !`);

    if (user.role === 'admin') {
      Router.navigate('admin');
    } else {
      Router.navigate('dashboard');
    }
  });
}
