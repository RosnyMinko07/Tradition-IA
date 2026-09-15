/**
 * TRADITION IA - ADMIN LANGUAGES MANAGEMENT VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';
const Masks = window.Masks || { render: (v, s) => `<div class="mask-img-wrapper" style="width:${s||64}px;height:${s||64}px"><img src="images/${(v||'fang').toLowerCase()}.png" class="mask-real-img"/></div>` };

export function renderAdminLanguagesPage() {
  const languages = Store.languages;

  return `
    <div class="layout-container">
      ${renderSidebar('admin')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Gestion des Langues Gabonaises</h1>
            <p class="page-subtitle">Ajoutez et configurez les langues et leurs attributs régionaux</p>
          </div>
          <button id="btn-open-add-lang-spa" class="btn btn-primary">+ Ajouter une Langue</button>
        </div>

        <div class="grid-3">
          ${languages.map(l => `
            <div class="glass-card" style="padding: 24px; position: relative;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                <div>${Masks.render(l.name.toLowerCase(), 56)}</div>
                <button class="btn btn-danger btn-delete-lang" data-id="${l.id}" style="padding: 4px 8px; font-size: 0.75rem;">✕ Supprimer</button>
              </div>
              <h3 style="font-size: 1.3rem; color: #FFF; margin-bottom: 4px;">${l.name}</h3>
              <p style="color: var(--primary); font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">Nom natif : ${l.nativeName}</p>
              <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px;">${l.description}</p>
              <div style="display: flex; gap: 8px; font-size: 0.8rem;">
                <span class="badge badge-green">${l.wordCount || 500} mots</span>
                <span class="badge badge-gold">${l.speakers || '100K'} locuteurs</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Modale Ajouter Langue -->
        <div id="modal-add-lang-spa" class="modal-backdrop">
          <div class="modal-card">
            <div class="modal-header">
              <h3 style="font-size: 1.2rem;">🗣️ Ajouter une Langue Gabonaise</h3>
              <button class="btn btn-secondary btn-icon btn-close-lang-modal">✕</button>
            </div>
            <form id="form-add-lang-spa">
              <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Nom de la Langue</label>
                  <input type="text" id="new-lang-name" class="form-input" placeholder="ex: Nzébi" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Nom Natif</label>
                  <input type="text" id="new-lang-native" class="form-input" placeholder="ex: Inzébi" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Description / Province</label>
                  <input type="text" id="new-lang-desc" class="form-input" placeholder="ex: Langue de la province de la Ogooué-Lolo" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Nombre Estimé de Locuteurs</label>
                  <input type="text" id="new-lang-speakers" class="form-input" placeholder="ex: 60 000" required>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-close-lang-modal">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer la Langue</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function initAdminLanguagesPageEvents() {
  const modal = document.getElementById('modal-add-lang-spa');
  document.getElementById('btn-open-add-lang-spa')?.addEventListener('click', () => modal?.classList.add('active'));
  document.querySelectorAll('.btn-close-lang-modal').forEach(b => b.addEventListener('click', () => modal?.classList.remove('active')));

  document.getElementById('form-add-lang-spa')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newLang = {
      name: document.getElementById('new-lang-name').value,
      nativeName: document.getElementById('new-lang-native').value,
      description: document.getElementById('new-lang-desc').value,
      speakers: document.getElementById('new-lang-speakers').value,
      wordCount: 100
    };

    await Store.addLanguage(newLang);
    modal?.classList.remove('active');
    showToast('Langue ajoutée avec succès !');
    Router.handleRoute();
  });

  document.querySelectorAll('.btn-delete-lang').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Supprimer cette langue de la base de données ?')) {
        await Store.deleteLanguage(id);
        showToast('Langue supprimée !');
        Router.handleRoute();
      }
    });
  });
}
