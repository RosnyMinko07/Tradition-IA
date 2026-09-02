/**
 * TRADITION IA - USER PROFILE PAGE VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';
const Masks = window.Masks || { render: (v, s) => `<div class="mask-img-wrapper" style="width:${s||180}px;height:${s||180}px"><img src="images/${(v||'fang').toLowerCase()}.png" class="mask-real-img"/></div>` };

export function renderProfilePage() {
  const user = Store.user;
  const languages = Store.languages;

  return `
    <div class="layout-container">
      ${renderSidebar('user')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Profil & Paramètres</h1>
            <p class="page-subtitle">Gérez vos informations personnelles et vos préférences d'apprentissage</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- Carte Profil -->
          <div class="glass-card" style="padding: 28px;">
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
              <div class="user-avatar" style="width: 72px; height: 72px; font-size: 2rem;">${user?.name?.charAt(0) || 'U'}</div>
              <div>
                <h2 style="font-size: 1.4rem; color: #FFF;">${user?.name}</h2>
                <div style="color: var(--primary); font-weight: 600; font-size: 0.9rem;">${user?.role === 'admin' ? '⚡ Administrateur Système' : '👤 Membre Utilisateur'}</div>
                <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">${user?.email}</div>
              </div>
            </div>

            <form id="form-profile-spa" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Nom d'affichage</label>
                <input type="text" id="profile-name-spa" class="form-input" value="${user?.name || ''}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Adresse Email</label>
                <input type="email" class="form-input" value="${user?.email || ''}" disabled style="opacity: 0.6; cursor: not-allowed;">
              </div>

              <div class="form-group">
                <label class="form-label">Langue Gabonaise Préférée</label>
                <select id="profile-pref-lang-spa" class="form-select">
                  ${languages.map(l => `<option value="${l.name}" ${user?.preferredLang === l.name ? 'selected' : ''}>${l.name} (${l.nativeName})</option>`).join('')}
                </select>
              </div>

              <button type="submit" class="btn btn-primary" style="margin-top: 10px; justify-content: center;">
                Enregistrer les Modifications
              </button>
            </form>
          </div>

          <!-- Carte Masque Identité Culturelle -->
          <div class="glass-card" style="padding: 28px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <h3 style="font-size: 1.2rem; color: #FFF; margin-bottom: 16px;">Votre Masque Culturel Représentatif</h3>
            <div style="margin: 16px 0;" id="profile-mask-preview-spa">
              ${Masks.render(user?.preferredLang?.toLowerCase() || 'fang', 180)}
            </div>
            <span class="badge badge-green" style="font-size: 0.9rem;" id="profile-mask-label-spa">Masque ${user?.preferredLang || 'Fang'}</span>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 12px; max-width: 320px;">
              Symbole traditionnel de sagesse et de préservation du patrimoine gabonais.
            </p>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function initProfilePageEvents() {
  const form = document.getElementById('form-profile-spa');
  const prefSelect = document.getElementById('profile-pref-lang-spa');
  const maskPreview = document.getElementById('profile-mask-preview-spa');
  const maskLabel = document.getElementById('profile-mask-label-spa');

  if (prefSelect) {
    prefSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (maskPreview) {
        maskPreview.innerHTML = Masks.render(selected, 180);
      }
      if (maskLabel) {
        maskLabel.innerText = `Masque ${selected}`;
      }
    });
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name-spa').value;
    const preferredLang = document.getElementById('profile-pref-lang-spa').value;

    Store.updateProfile({ name, preferredLang });
    showToast('Profil et préférences mis à jour avec succès !');
  });
}
