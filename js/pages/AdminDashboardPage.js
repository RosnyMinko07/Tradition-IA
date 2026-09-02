/**
 * TRADITION IA - ADMIN DASHBOARD PAGE VIEW
 */

import { Store } from '../store.js';
import { renderSidebar } from '../components/Sidebar.js';

export function renderAdminDashboardPage() {
  const users = Store.usersList;
  const languages = Store.languages;
  const dictionary = Store.dictionary;
  const suggestions = Store.aiSuggestions;
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  return `
    <div class="layout-container">
      ${renderSidebar('admin')}

      <main class="main-content">
        <div class="page-header">
          <div class="page-title-group">
            <h1>Console d'Administration</h1>
            <p class="page-subtitle">Vue d'ensemble de la plateforme et gestion des ressources linguistiques</p>
          </div>
          <a href="#admin-ai-validation" class="btn btn-primary">⚡ Validation IA (${pendingSuggestions.length})</a>
        </div>

        <!-- Grille de Statistiques Admin -->
        <div class="grid-4">
          <div class="glass-card stat-card">
            <div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Utilisateurs Inscrits</div>
              <div class="stat-val" style="color: var(--primary);">${users.length}</div>
            </div>
            <div class="stat-icon" style="background: rgba(0,230,118,0.15); color: var(--primary);">👥</div>
          </div>

          <div class="glass-card stat-card">
            <div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Langues Actives</div>
              <div class="stat-val" style="color: var(--blue);">${languages.length}</div>
            </div>
            <div class="stat-icon" style="background: rgba(33,150,243,0.15); color: var(--blue);">🗣️</div>
          </div>

          <div class="glass-card stat-card">
            <div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Entrées Dictionnaire</div>
              <div class="stat-val" style="color: var(--gold);">${dictionary.length}</div>
            </div>
            <div class="stat-icon" style="background: rgba(255,214,0,0.15); color: var(--gold);">📚</div>
          </div>

          <div class="glass-card stat-card">
            <div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Validation IA en Attente</div>
              <div class="stat-val" style="color: var(--red);">${pendingSuggestions.length}</div>
            </div>
            <div class="stat-icon" style="background: rgba(255,23,68,0.15); color: var(--red);">🤖</div>
          </div>
        </div>

        <!-- Menu d'accès rapide Admin -->
        <div style="margin-top: 36px;">
          <h2 style="font-size: 1.3rem; margin-bottom: 20px;">Gestion des Modules</h2>
          <div class="grid-3">
            <a href="#admin-users" class="glass-card glass-card-interactive" style="padding: 24px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">👥</div>
              <h3 style="font-size: 1.1rem; color: #FFF;">Gestion Utilisateurs</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Gérer les rôles, permissions et statuts d'accès.</p>
            </a>
            <a href="#admin-languages" class="glass-card glass-card-interactive" style="padding: 24px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">🗣️</div>
              <h3 style="font-size: 1.1rem; color: #FFF;">Langues Gabonaises</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Ajouter et paramétrer les langues régionales et dialectes.</p>
            </a>
            <a href="#admin-dictionary" class="glass-card glass-card-interactive" style="padding: 24px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">📚</div>
              <h3 style="font-size: 1.1rem; color: #FFF;">Dictionnaire & Mots</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Valider, éditer ou supprimer des entrées de vocabulaire.</p>
            </a>
            <a href="#admin-expressions" class="glass-card glass-card-interactive" style="padding: 24px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">💬</div>
              <h3 style="font-size: 1.1rem; color: #FFF;">Expressions Idiomatiques</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Gérer les proverbes et phrases usuelles par province.</p>
            </a>
            <a href="#admin-ai-validation" class="glass-card glass-card-interactive" style="padding: 24px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">🤖</div>
              <h3 style="font-size: 1.1rem; color: #FFF;">Validation Suggestions IA</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Approuver ou rejeter les traductions générées par l'IA.</p>
            </a>
            <a href="#admin-analytics" class="glass-card glass-card-interactive" style="padding: 24px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">📈</div>
              <h3 style="font-size: 1.1rem; color: #FFF;">Analyses & Rapports</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Métriques d'utilisation, précision IA et répartition par langue.</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  `;
}
