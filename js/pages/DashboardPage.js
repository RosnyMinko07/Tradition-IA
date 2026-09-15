/**
 * TRADITION IA - USER DASHBOARD PAGE VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';

export function renderDashboardPage() {
  const user = Store.user;
  const translations = Store.translations;
  const languages = Store.languages;

  return `
    <div class="layout-container">
      ${renderSidebar('user')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Tableau de Bord</h1>
            <p class="page-subtitle">Bienvenue ${user?.name || 'Utilisateur'}, découvrez vos activités linguistiques</p>
          </div>
          <a href="#translate" class="btn btn-primary">+ Nouvelle Traduction</a>
        </div>

        <!-- Banner de bienvenue -->
        <div class="glass-card" style="padding: 28px; margin-bottom: 24px; background: linear-gradient(135deg, rgba(0,230,118,0.1) 0%, rgba(10,10,10,0.8) 100%); border-color: rgba(0,230,118,0.3);">
          <h2 style="font-size: 1.5rem; margin-bottom: 8px; color: #FFF;">Bonjour ${user?.name} ! 👋</h2>
          <p style="color: var(--text-muted); max-width: 600px; margin-bottom: 20px;">
            Explorez les langues gabonaises, traduisez instantanément des phrases et interagissez avec l'assistant IA spécialisé.
          </p>
          <div style="display: flex; gap: 12px;">
            <a href="#translate" class="btn btn-primary">🔤 Traduire un texte</a>
            <a href="#ai-assistant" class="btn btn-secondary">🤖 Assistant IA</a>
          </div>
        </div>

        <!-- Grille de Statistiques -->
        <div class="grid-4">
          <div class="glass-card stat-card">
            <div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Traductions Effectuées</div>
              <div class="stat-val" style="color: var(--primary);">${translations.length}</div>
            </div>
            <div class="stat-icon" style="background: rgba(0,230,118,0.15); color: var(--primary);">🔤</div>
          </div>

          <div class="glass-card stat-card">
            <div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Langues Disponibles</div>
              <div class="stat-val" style="color: var(--blue);">${languages.length}</div>
            </div>
            <div class="stat-icon" style="background: rgba(33,150,243,0.15); color: var(--blue);">🗣️</div>
          </div>

          <div class="glass-card stat-card">
            <div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Langue Préférée</div>
              <div class="stat-val" style="color: var(--gold); font-size: 1.4rem;">${user?.preferredLang || 'Fang'}</div>
            </div>
            <div class="stat-icon" style="background: rgba(255,214,0,0.15); color: var(--gold);">⭐</div>
          </div>

          <div class="glass-card stat-card">
            <div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Niveau d'Apprentissage</div>
              <div class="stat-val" style="color: #FFF; font-size: 1.3rem;">Intermédiaire</div>
            </div>
            <div class="stat-icon" style="background: rgba(255,255,255,0.1); color: #FFF;">🎓</div>
          </div>
        </div>

        <!-- Activités Récentes -->
        <div style="margin-top: 40px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="font-size: 1.3rem;">Traductions Récentes</h2>
            <a href="#history" style="color: var(--primary); font-size: 0.9rem; text-decoration: underline;">Voir l'historique complet</a>
          </div>

          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date & Heure</th>
                  <th>Texte Source</th>
                  <th>Traduction Gabon</th>
                  <th>Langue Cible</th>
                </tr>
              </thead>
              <tbody>
                ${translations.slice(0, 5).map(t => `
                  <tr>
                    <td style="color: var(--text-muted); font-size: 0.85rem;">${t.createdAt}</td>
                    <td style="font-weight: 600; color: #FFF;">${t.sourceText}</td>
                    <td style="font-weight: 700; color: var(--primary);">${t.translatedText}</td>
                    <td><span class="badge badge-green">${t.sourceLang} ➔ ${t.targetLang}</span></td>
                  </tr>
                `).join('')}
                ${translations.length === 0 ? '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">Aucune traduction effectuée pour le moment.</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `;
}
