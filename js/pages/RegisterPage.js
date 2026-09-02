/**
 * TRADITION IA - REGISTER PAGE VIEW
 */

import { Store } from '../store.js';
import { Router } from '../router.js';
import { showToast } from '../components/Toast.js';

export function renderRegisterPage() {
  return `
    <main class="main-content" style="max-width: 1140px; margin: 0 auto; width: 100%;">
      <div class="auth-container">
        <div class="auth-left">
          <div class="auth-left-content">
            <div class="auth-img-glow-wrapper">
              <img src="images/carte_gabon_nobg.png" alt="Carte du Gabon - Tradition IA" class="auth-gabon-img">
            </div>
            <h2 class="auth-left-title">Rejoignez l'Aventure</h2>
            <p class="auth-left-subtitle">Contribuez à la sauvegarde et à l'apprentissage des traditions linguistiques gabonaises.</p>
          </div>
        </div>

        <div class="auth-right">
          <div style="margin-bottom: 18px; display: flex; justify-content: center; align-items: center;">
            <img src="images/drapeau%20gabon.png" alt="Drapeau du Gabon" style="width: 76px; height: auto; max-height: 48px; object-fit: contain; filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 15px rgba(0, 230, 118, 0.3)); display: block;">
          </div>
          <h1 style="font-size: 1.7rem; margin-bottom: 4px; text-align: center;">Créer un Compte</h1>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px; text-align: center;">Rejoignez la communauté Tradition IA</p>

          <form id="form-register-spa" style="display: flex; flex-direction: column; gap: 14px; text-align: left;">
            <div class="form-group">
              <label class="form-label">Nom Complet</label>
              <input type="text" id="reg-name" class="form-input" placeholder="ex: Jean-Marc Nzeng" required>
            </div>

            <div class="form-group">
              <label class="form-label">Adresse Email</label>
              <input type="email" id="reg-email" class="form-input" placeholder="ex: jm.nzeng@mail.ga" required>
            </div>

            <div class="form-group">
              <label class="form-label">Mot de passe</label>
              <input type="password" id="reg-password" class="form-input" placeholder="••••••••" required minlength="6">
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 11px; font-size: 0.95rem; margin-top: 4px;">
              S'inscrire Maintenant ➔
            </button>
          </form>

          <div style="margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 0.85rem; color: var(--text-muted); text-align: center;">
            Déjà un compte ? <a href="#login" style="color: var(--primary); font-weight: 600;">Se connecter</a>
          </div>
        </div>
      </div>
    </main>
  `;
}

export function initRegisterPageEvents() {
  const form = document.getElementById('form-register-spa');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;

    const user = Store.login(email, pass, 'user');
    user.name = name;
    Store.updateProfile({ name });

    showToast(`Compte créé avec succès ! Bienvenue ${name}.`);
    Router.navigate('dashboard');
  });
}
