/**
 * TRADITION IA - SIDEBAR COMPONENT
 */

import { Router } from '../router.js';
import { Store } from '../store.js';

export function renderSidebar(mode = 'user') {
  const currentRoute = Router.currentRoute;
  const user = Store.user;

  if (mode !== 'admin') {
    return '';
  }

  return `
    <aside class="sidebar">
      <div class="sidebar-title">Administration</div>
      <a href="#admin" class="sidebar-item ${currentRoute === 'admin' ? 'active' : ''}">📊 Dashboard Admin</a>
      <a href="#admin-users" class="sidebar-item ${currentRoute === 'admin-users' ? 'active' : ''}">👥 Utilisateurs</a>
      <a href="#admin-languages" class="sidebar-item ${currentRoute === 'admin-languages' ? 'active' : ''}">🗣️ Langues Gabonaises</a>
      <a href="#admin-dictionary" class="sidebar-item ${currentRoute === 'admin-dictionary' ? 'active' : ''}">📚 Dictionnaire</a>
      <a href="#admin-expressions" class="sidebar-item ${currentRoute === 'admin-expressions' ? 'active' : ''}">💬 Expressions</a>
      <a href="#admin-ai-validation" class="sidebar-item ${currentRoute === 'admin-ai-validation' ? 'active' : ''}">🤖 Validation IA</a>
      <a href="#admin-analytics" class="sidebar-item ${currentRoute === 'admin-analytics' ? 'active' : ''}">📈 Analyses & Rapports</a>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);">
        <a href="#dashboard" class="sidebar-item" style="color: var(--primary);">⬅️ Espace Membre</a>
      </div>
    </aside>
  `;
}
