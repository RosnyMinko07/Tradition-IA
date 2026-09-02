/**
 * TRADITION IA - TRANSLATION HISTORY PAGE VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export function renderHistoryPage() {
  const translations = Store.translations;

  return `
    <div class="layout-container">
      ${renderSidebar('user')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Historique des Traductions</h1>
            <p class="page-subtitle">Consultez et réutilisez l'ensemble de vos traductions passées</p>
          </div>
          <button id="btn-export-history-spa" class="btn btn-secondary">📥 Exporter en CSV</button>
        </div>

        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date & Heure</th>
                <th>Texte Original</th>
                <th>Traduction Générée</th>
                <th>Sens de Traduction</th>
                <th>Origine Moteur</th>
              </tr>
            </thead>
            <tbody>
              ${translations.map(t => `
                <tr>
                  <td style="color: var(--text-muted); font-size: 0.85rem;">${t.createdAt || 'Récent'}</td>
                  <td style="font-weight: 600; color: #FFF;">${t.sourceText}</td>
                  <td style="font-weight: 700; color: var(--primary);">${t.translatedText}</td>
                  <td><span class="badge badge-green">${t.sourceLang || 'Français'} ➔ ${t.targetLang}</span></td>
                  <td><span class="badge ${t.isAI ? 'badge-gold' : 'badge-blue'}">${t.isAI ? 'Modèle IA' : 'Dictionnaire'}</span></td>
                </tr>
              `).join('')}
              ${translations.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">Aucune traduction enregistrée dans votre historique.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `;
}

export function initHistoryPageEvents() {
  document.getElementById('btn-export-history-spa')?.addEventListener('click', () => {
    const translations = Store.translations;
    if (!translations.length) {
      showToast('Aucune donnée à exporter.', 'info');
      return;
    }

    const csvRows = ['Date;Texte Source;Traduction;Langue Cible'];
    translations.forEach(t => {
      csvRows.push(`"${t.createdAt}";"${t.sourceText}";"${t.translatedText}";"${t.targetLang}"`);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradition_ia_historique_${Date.now()}.csv`;
    a.click();
    showToast('Exportation du fichier CSV terminée !');
  });
}
