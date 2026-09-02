/**
 * TRADITION IA - ADMIN DICTIONARY MANAGEMENT VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export function renderAdminDictionaryPage() {
  const dictionary = Store.dictionary;

  return `
    <div class="layout-container">
      ${renderSidebar('admin')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Gestion du Dictionnaire Admin</h1>
            <p class="page-subtitle">Éditez, modérez et nettoyez les entrées lexicales</p>
          </div>
        </div>

        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mot (Français)</th>
                <th>Traduction Locale</th>
                <th>Langue Cible</th>
                <th>Catégorie</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${dictionary.map(item => `
                <tr>
                  <td style="color: var(--text-muted); font-size: 0.8rem;">#${item.id}</td>
                  <td style="font-weight: 700; color: #FFF;">${item.word}</td>
                  <td style="font-weight: 700; color: var(--primary);">${item.translation}</td>
                  <td><span class="badge badge-blue">${item.targetLang}</span></td>
                  <td><span class="badge badge-gold">${item.category || 'Général'}</span></td>
                  <td>
                    <button class="btn btn-danger btn-delete-dict-entry" data-id="${item.id}" style="padding: 4px 8px; font-size: 0.75rem;">Supprimer</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `;
}

export function initAdminDictionaryPageEvents() {
  document.querySelectorAll('.btn-delete-dict-entry').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Supprimer cette entrée du dictionnaire ?')) {
        await Store.deleteDictionaryEntry(id);
        showToast('Entrée supprimée du dictionnaire !');
        Router.handleRoute();
      }
    });
  });
}
