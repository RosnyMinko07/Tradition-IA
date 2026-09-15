/**
 * TRADITION IA - ADMIN EXPRESSIONS MANAGEMENT VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export function renderAdminExpressionsPage() {
  const expressions = Store.expressions;
  const languages = Store.languages;

  return `
    <div class="layout-container">
      ${renderSidebar('admin')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Gestion des Expressions Idiomatiques</h1>
            <p class="page-subtitle">Ajoutez et modérez les proverbes et expressions fréquentes</p>
          </div>
          <button id="btn-open-add-expr-spa" class="btn btn-primary">+ Nouvelle Expression</button>
        </div>

        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Expression (Français)</th>
                <th>Traduction Gabon</th>
                <th>Langue</th>
                <th>Contexte</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${expressions.map(e => `
                <tr>
                  <td style="font-weight: 700; color: #FFF;">${e.phrase}</td>
                  <td style="font-weight: 700; color: var(--primary);">${e.translation}</td>
                  <td><span class="badge badge-green">${e.targetLang}</span></td>
                  <td style="color: var(--text-muted); font-size: 0.85rem;">${e.context || 'Usage général'}</td>
                  <td>
                    <button class="btn btn-danger btn-delete-expr" data-id="${e.id}" style="padding: 4px 8px; font-size: 0.75rem;">Supprimer</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Modale Ajouter Expression -->
        <div id="modal-add-expr-spa" class="modal-backdrop">
          <div class="modal-card">
            <div class="modal-header">
              <h3 style="font-size: 1.2rem;">💬 Ajouter une Expression Idiomatique</h3>
              <button class="btn btn-secondary btn-icon btn-close-expr-modal">✕</button>
            </div>
            <form id="form-add-expr-spa">
              <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Expression en Français</label>
                  <input type="text" id="new-expr-phrase" class="form-input" placeholder="ex: Comment allez-vous ?" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Traduction Gabon</label>
                  <input type="text" id="new-expr-trans" class="form-input" placeholder="ex: Mbolo mi neng ?" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Langue Cible</label>
                  <select id="new-expr-lang" class="form-select">
                    ${languages.map(l => `<option value="${l.name}">${l.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Contexte d'utilisation</label>
                  <input type="text" id="new-expr-context" class="form-input" placeholder="ex: Salutation du matin">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-close-expr-modal">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer l'Expression</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function initAdminExpressionsPageEvents() {
  const modal = document.getElementById('modal-add-expr-spa');
  document.getElementById('btn-open-add-expr-spa')?.addEventListener('click', () => modal?.classList.add('active'));
  document.querySelectorAll('.btn-close-expr-modal').forEach(b => b.addEventListener('click', () => modal?.classList.remove('active')));

  document.getElementById('form-add-expr-spa')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newExpr = {
      phrase: document.getElementById('new-expr-phrase').value,
      translation: document.getElementById('new-expr-trans').value,
      targetLang: document.getElementById('new-expr-lang').value,
      sourceLang: 'Français',
      context: document.getElementById('new-expr-context').value || 'Général'
    };

    await Store.addExpression(newExpr);
    modal?.classList.remove('active');
    showToast('Expression ajoutée avec succès !');
    Router.handleRoute();
  });

  document.querySelectorAll('.btn-delete-expr').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Supprimer cette expression ?')) {
        await Store.deleteExpression(id);
        showToast('Expression supprimée !');
        Router.handleRoute();
      }
    });
  });
}
