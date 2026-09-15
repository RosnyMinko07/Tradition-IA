/**
 * TRADITION IA - DICTIONARY PAGE VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';
import { showToast } from '../components/Toast.js';

export function renderDictionaryPage() {
  const dictionary = Store.dictionary;
  const languages = Store.languages;

  return `
    <div class="layout-container">
      ${renderSidebar('user')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Dictionnaire Collaboratif</h1>
            <p class="page-subtitle">Recherchez et explorez le vocabulaire répertorié des langues du Gabon</p>
          </div>
          <button id="btn-open-add-word-spa" class="btn btn-primary">+ Proposer un mot</button>
        </div>

        <!-- Filtres et recherche -->
        <div class="glass-card" style="padding: 20px; margin-bottom: 24px; display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
          <div style="flex: 1; min-width: 240px;">
            <input type="text" id="dict-search-spa" class="form-input" placeholder="🔍 Rechercher un mot en Français ou langue locale...">
          </div>
          <div style="width: 200px;">
            <select id="dict-filter-lang-spa" class="form-select">
              <option value="">Toutes les langues</option>
              ${languages.map(l => `<option value="${l.name}">${l.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Table des Mots -->
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mot (Français)</th>
                <th>Traduction Locale</th>
                <th>Langue</th>
                <th>Catégorie</th>
                <th>Exemple d'utilisation</th>
              </tr>
            </thead>
            <tbody id="dict-table-body-spa">
              ${dictionary.map(item => `
                <tr>
                  <td style="font-weight: 700; color: #FFF;">${item.word}</td>
                  <td style="font-weight: 700; color: var(--primary);">${item.translation}</td>
                  <td><span class="badge badge-blue">${item.targetLang}</span></td>
                  <td><span class="badge badge-gold">${item.category || 'Général'}</span></td>
                  <td style="color: var(--text-muted); font-style: italic;">${item.example || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Modale Proposer un Mot -->
        <div id="modal-add-word-spa" class="modal-backdrop">
          <div class="modal-card">
            <div class="modal-header">
              <h3 style="font-size: 1.2rem;">📖 Proposer un Nouveau Mot</h3>
              <button class="btn btn-secondary btn-icon btn-close-word-modal">✕</button>
            </div>
            <form id="form-add-word-spa">
              <div class="modal-body" style="display: flex; flex-direction: column; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Mot en Français</label>
                  <input type="text" id="new-word-fr" class="form-input" placeholder="ex: Maison" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Traduction Locale</label>
                  <input type="text" id="new-word-gabo" class="form-input" placeholder="ex: Ntang" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Langue Cible</label>
                  <select id="new-word-lang" class="form-select">
                    ${languages.map(l => `<option value="${l.name}">${l.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Catégorie</label>
                  <select id="new-word-cat" class="form-select">
                    <option value="Salutations">Salutations</option>
                    <option value="Expressions">Expressions</option>
                    <option value="Nourriture">Nourriture</option>
                    <option value="Personnes">Personnes</option>
                    <option value="Lieux">Lieux</option>
                    <option value="Nature">Nature</option>
                    <option value="Général">Général</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Exemple de Phrase (Optionnel)</label>
                  <input type="text" id="new-word-example" class="form-input" placeholder="ex: Mon ntang est au village">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-close-word-modal">Annuler</button>
                <button type="submit" class="btn btn-primary">Enregistrer le Mot</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `;
}

export function initDictionaryPageEvents() {
  const searchInput = document.getElementById('dict-search-spa');
  const filterLang = document.getElementById('dict-filter-lang-spa');
  const tableBody = document.getElementById('dict-table-body-spa');

  const filterData = () => {
    if (!tableBody) return;
    const query = (searchInput?.value || '').toLowerCase();
    const selectedLang = filterLang?.value;

    const filtered = Store.dictionary.filter(item => {
      const matchesSearch = item.word.toLowerCase().includes(query) || item.translation.toLowerCase().includes(query);
      const matchesLang = !selectedLang || item.targetLang === selectedLang;
      return matchesSearch && matchesLang;
    });

    tableBody.innerHTML = filtered.map(item => `
      <tr>
        <td style="font-weight: 700; color: #FFF;">${item.word}</td>
        <td style="font-weight: 700; color: var(--primary);">${item.translation}</td>
        <td><span class="badge badge-blue">${item.targetLang}</span></td>
        <td><span class="badge badge-gold">${item.category || 'Général'}</span></td>
        <td style="color: var(--text-muted); font-style: italic;">${item.example || '-'}</td>
      </tr>
    `).join('');
  };

  searchInput?.addEventListener('input', filterData);
  filterLang?.addEventListener('change', filterData);

  // Modale
  const modal = document.getElementById('modal-add-word-spa');
  document.getElementById('btn-open-add-word-spa')?.addEventListener('click', () => {
    modal?.classList.add('active');
  });

  document.querySelectorAll('.btn-close-word-modal').forEach(btn => {
    btn.addEventListener('click', () => modal?.classList.remove('active'));
  });

  const form = document.getElementById('form-add-word-spa');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEntry = {
      word: document.getElementById('new-word-fr').value,
      translation: document.getElementById('new-word-gabo').value,
      targetLang: document.getElementById('new-word-lang').value,
      sourceLang: 'Français',
      category: document.getElementById('new-word-cat').value || 'Général',
      example: document.getElementById('new-word-example').value
    };

    await Store.addDictionaryEntry(newEntry);
    modal?.classList.remove('active');
    showToast('Mot ajouté au dictionnaire avec succès !');
    filterData();
  });
}
