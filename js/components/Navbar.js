/**
 * TRADITION IA - NAVBAR COMPONENT
 */

import { Store } from '../store.js';
import { Router } from '../router.js';

export function renderNavbar() {
  const container = document.getElementById('app-navbar');
  if (!container) return;

  const currentRoute = Router.currentRoute;
  const user = Store.user;
  const themeBtnHtml = window.getThemeButtonHtml ? window.getThemeButtonHtml() : `<button class="btn-theme-toggle" id="btn-theme-toggle" title="Thème">☀️</button>`;

  container.innerHTML = `
    <header class="navbar">
      <a href="#landing" class="navbar-brand">
        <img src="images/tradiia_icon.png" alt="Tradition IA Logo" class="brand-logo-img" />
        <span>Tradition<span style="color: var(--primary);">IA</span></span>
      </a>

      <nav class="nav-links">
        <a href="#landing" class="nav-link ${currentRoute === 'landing' ? 'active' : ''}">Accueil</a>
        <a href="#translate" class="nav-link ${currentRoute === 'translate' ? 'active' : ''}">Traduction</a>
        <a href="#ai-assistant" class="nav-link ${currentRoute === 'ai-assistant' ? 'active' : ''}">Assistant IA</a>
        <a href="#dictionary" class="nav-link ${currentRoute === 'dictionary' ? 'active' : ''}">Dictionnaire</a>
        <a href="#history" class="nav-link ${currentRoute === 'history' ? 'active' : ''}">Historique</a>
        ${user ? '<a href="#dashboard" class="nav-link ' + (currentRoute === 'dashboard' ? 'active' : '') + '">Dashboard</a>' : ''}
        ${user && user.role === 'admin' ? '<a href="#admin" class="nav-link ' + (currentRoute.startsWith('admin') ? 'active' : '') + '" style="color: var(--gold);">Admin</a>' : ''}
      </nav>

      <div id="nav-user-container">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${themeBtnHtml}
          ${user ? `
            <div class="user-profile-menu">
              <div class="user-avatar">${user.name.charAt(0)}</div>
              <div style="font-size: 0.85rem;">
                <div style="font-weight: 700; color: var(--text-main);">${user.name}</div>
                <div style="font-size: 0.75rem; color: var(--primary);">${user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</div>
              </div>
              ${user.role === 'admin' ? '<a href="#admin" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem;">Admin</a>' : ''}
              <button id="btn-navbar-logout" class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem;">Déconnexion</button>
            </div>
          ` : `
            <a href="#login" class="btn btn-secondary" style="padding: 8px 16px;">Connexion</a>
            <a href="#register" class="btn btn-primary" style="padding: 8px 16px;">S'inscrire</a>
          `}
        </div>
      </div>
    </header>
  `;

  document.getElementById('btn-navbar-logout')?.addEventListener('click', () => {
    Store.logout();
    Router.navigate('landing');
  });
}
