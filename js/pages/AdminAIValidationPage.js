/**
 * TRADITION IA - ADMIN AI SUGGESTION VALIDATION VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export function renderAdminAIValidationPage() {
  const suggestions = Store.aiSuggestions;
  const pending = suggestions.filter(s => s.status === 'pending');
  const processed = suggestions.filter(s => s.status !== 'pending');

  return `
    <div class="layout-container">
      ${renderSidebar('admin')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Validation des Suggestions IA</h1>
            <p class="page-subtitle">Examinez et validez les propositions de traduction du modèle pour enrichir la base</p>
          </div>
        </div>

        <h2 style="font-size: 1.2rem; margin-bottom: 16px; color: var(--gold);">⚡ Suggestions en attente de révision (${pending.length})</h2>

        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px;">
          ${pending.map(s => `
            <div class="glass-card" style="padding: 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                  <span class="badge badge-blue">Langue: ${s.targetLang}</span>
                  <span class="badge badge-gold">Confiance IA: ${Math.round(s.confidence * 100)}%</span>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${s.createdAt}</span>
                </div>
                <div style="font-size: 1.1rem; color: #FFF; font-weight: 600;">
                  "${s.sourceText}" ➔ <span style="color: var(--primary);">${s.suggestedTranslation}</span>
                </div>
              </div>

              <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary btn-accept-suggestion-spa" data-id="${s.id}" style="padding: 8px 16px;">
                  ✓ Valider & Intégrer
                </button>
                <button class="btn btn-danger btn-reject-suggestion-spa" data-id="${s.id}" style="padding: 8px 16px;">
                  ✕ Rejeter
                </button>
              </div>
            </div>
          `).join('')}
          ${pending.length === 0 ? '<div class="glass-card" style="padding: 30px; text-align: center; color: var(--text-muted);">Toutes les suggestions IA ont été traitées. ✨</div>' : ''}
        </div>

        ${processed.length > 0 ? `
          <h2 style="font-size: 1.2rem; margin-bottom: 16px; color: var(--text-muted);">Historique des Traitements</h2>
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Texte Source</th>
                  <th>Traduction Suggérée</th>
                  <th>Langue Cible</th>
                  <th>Confiance</th>
                  <th>Décision</th>
                </tr>
              </thead>
              <tbody>
                ${processed.map(s => `
                  <tr>
                    <td style="color: #FFF;">${s.sourceText}</td>
                    <td style="color: var(--primary); font-weight: 600;">${s.suggestedTranslation}</td>
                    <td><span class="badge badge-blue">${s.targetLang}</span></td>
                    <td>${Math.round(s.confidence * 100)}%</td>
                    <td>
                      <span class="badge ${s.status === 'accepted' ? 'badge-green' : 'badge-red'}">
                        ${s.status === 'accepted' ? 'Approuvé' : 'Rejeté'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
      </main>
    </div>
  `;
}

export function initAdminAIValidationPageEvents() {
  document.querySelectorAll('.btn-accept-suggestion-spa').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      await Store.updateAISuggestionStatus(id, 'accepted');
      showToast('Suggestion approuvée et intégrée !');
      Router.handleRoute();
    });
  });

  document.querySelectorAll('.btn-reject-suggestion-spa').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      await Store.updateAISuggestionStatus(id, 'rejected');
      showToast('Suggestion rejetée.', 'info');
      Router.handleRoute();
    });
  });
}
