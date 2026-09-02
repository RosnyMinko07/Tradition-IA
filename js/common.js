/**
 * TRADITION IA - COMMON SCRIPT FOR ALL HTML PAGES
 * Universal script compatible with file:// protocol and http:// servers
 */

// Immediate Theme Sync to prevent visual flash
(function syncThemeEarly() {
  const savedTheme = localStorage.getItem('tradition_ia_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', async () => {
  if (window.Store) {
    await window.Store.loadInitialData();
  }
  renderAllMasks();
  initCommonNavbar();
  initCommonFooter();
  highlightActiveLinks();
  initSupabaseModal();
  initSmoothPageTransitions();
});

function renderAllMasks() {
  if (!window.Masks) return;
  document.querySelectorAll('[data-mask]').forEach(el => {
    const variant = el.getAttribute('data-mask') || 'fang';
    const size = parseInt(el.getAttribute('data-mask-size') || '64');
    el.innerHTML = window.Masks.render(variant, size);
  });
}
window.renderAllMasks = renderAllMasks;

function getCurrentTheme() {
  return localStorage.getItem('tradition_ia_theme') || 'dark';
}

function getThemeButtonHtml() {
  const currentTheme = getCurrentTheme();
  const isDark = currentTheme === 'dark';
  const iconSvg = isDark
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const title = isDark ? 'Passer au Thème Blanc Transparent' : 'Passer au Thème Sombre Transparent';
  return `
    <button class="btn-theme-toggle" id="btn-theme-toggle" title="${title}" aria-label="${title}">${iconSvg}</button>
    <button class="btn-mobile-menu" id="btn-mobile-menu" aria-label="Menu Mobile" title="Menu Mobile">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  `;
}

function toggleTheme() {
  const current = getCurrentTheme();
  const nextTheme = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('tradition_ia_theme', nextTheme);
  document.documentElement.setAttribute('data-theme', nextTheme);
  
  const isDark = nextTheme === 'dark';
  const iconSvg = isDark
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const title = isDark ? 'Passer au Thème Blanc Transparent' : 'Passer au Thème Sombre Transparent';

  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    btn.innerHTML = iconSvg;
    btn.title = title;
    btn.setAttribute('aria-label', title);
  });
}

// Delegation globale d'événement pour le bouton de thème
document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('.btn-theme-toggle');
  if (toggleBtn) {
    toggleTheme();
  }
});

function initCommonNavbar() {
  const container = document.getElementById('nav-user-container');
  if (!container) return;

  const user = window.Store?.user;
  const themeBtnHtml = getThemeButtonHtml();

  if (user) {
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        ${themeBtnHtml}
        <div class="user-profile-menu">
          <div class="user-avatar">${user.name.charAt(0)}</div>
          <div style="font-size: 0.85rem;">
            <div style="font-weight: 700; color: var(--text-main);">${user.name}</div>
            <div style="font-size: 0.75rem; color: var(--primary);">${user.role === 'admin' ? 'Administrateur' : 'Visiteur'}</div>
          </div>
          ${user.role === 'admin' ? '<a href="admin.html" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem; border-color: var(--gold); color: var(--gold);">Console Admin</a>' : ''}
          <button id="btn-common-logout" class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem;">Déconnexion</button>
        </div>
      </div>
    `;
    document.getElementById('btn-common-logout')?.addEventListener('click', () => {
      window.Store.logout();
      window.location.href = 'index.html';
    });
  } else {
    container.innerHTML = `
      <div class="nav-auth-buttons">
        ${themeBtnHtml}
        <a href="login.html" class="btn btn-secondary" style="padding: 8px 16px;">Connexion</a>
        <a href="register.html" class="btn btn-primary" style="padding: 8px 16px;">S'inscrire</a>
      </div>
    `;
  }
}

function highlightActiveLinks() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .sidebar-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.classList.add('active');
    }
  });
}

function initSupabaseModal() {
  const modal = document.getElementById('modal-supabase-config');
  const formConfig = document.getElementById('form-supabase-config');

  document.querySelectorAll('#btn-open-supabase-config, .btn-trigger-supabase').forEach(btn => {
    btn.addEventListener('click', () => {
      modal?.classList.add('active');
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    });
  });

  if (formConfig) {
    formConfig.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = document.getElementById('cfg-supabase-url').value.trim();
      const key = document.getElementById('cfg-supabase-key').value.trim();
      window.DB.setSupabaseCredentials(url, key);
      modal?.classList.remove('active');
      showToast('Configuration Supabase mise à jour !');
    });
  }
}

function showToast(msg, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icon = type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✨';
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <div style="font-weight: 500;">${msg}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function initSmoothPageTransitions() {
  document.addEventListener('click', (e) => {
    // 1. Bouton Toggle Menu Mobile
    const mobileBtn = e.target.closest('.btn-mobile-menu');
    if (mobileBtn) {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        navLinks.classList.toggle('mobile-open');
      }
      return;
    }

    // 2. Fermer le menu mobile lors d'un clic sur un lien
    const link = e.target.closest('a[href]');
    if (link) {
      document.querySelector('.nav-links')?.classList.remove('mobile-open');
    }

    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') return;

    if (href.endsWith('.html') || href.includes('.html?')) {
      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      if (href === currentFile) return;

      e.preventDefault();
      const main = document.querySelector('.main-content') || document.getElementById('app');
      if (main) {
        main.style.transition = 'opacity 0.16s cubic-bezier(0.4, 0, 0.2, 1), transform 0.16s cubic-bezier(0.4, 0, 0.2, 1)';
        main.style.opacity = '0';
        main.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          window.location.href = href;
        }, 140);
      } else {
        window.location.href = href;
      }
    }
  });
}

function initCommonFooter() {
  if (document.querySelector('.site-footer')) return;

  const footerHtml = `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Col 1: Brand -->
          <div class="footer-col footer-col-brand">
            <a href="index.html" class="footer-brand">
              <img src="images/tradiia_icon.png" alt="Tradition IA Logo" class="footer-logo-img" />
              <span class="footer-brand-title">Tradition<span class="highlight">IA</span></span>
            </a>
            <p class="footer-tagline">
              Plateforme intelligente dédiée à la traduction, l'apprentissage et la préservation du patrimoine linguistique.
            </p>
          </div>

          <!-- Col 2: Produit -->
          <div class="footer-col">
            <h4 class="footer-heading">Produit</h4>
            <ul class="footer-links">
              <li><a href="index.html">Accueil</a></li>
              <li><a href="translate.html">Traduction</a></li>
              <li><a href="ai-assistant.html">Assistant IA</a></li>
              <li><a href="dictionary.html">Dictionnaire</a></li>
              <li><a href="history.html">Historique</a></li>
            </ul>
          </div>

          <!-- Col 3: Ressources -->
          <div class="footer-col">
            <h4 class="footer-heading">Ressources</h4>
            <ul class="footer-links">
              <li><a href="profile.html">Mon Compte</a></li>
              <li><a href="javascript:void(0)">Guide d'utilisation</a></li>
              <li><a href="javascript:void(0)">Foire Aux Questions (FAQ)</a></li>
              <li><a href="javascript:void(0)">Support & Contact</a></li>
            </ul>
          </div>

          <!-- Col 4: Légal & Sécurité -->
          <div class="footer-col">
            <h4 class="footer-heading">Légal & Sécurité</h4>
            <ul class="footer-links">
              <li><a href="javascript:void(0)">Conditions d'utilisation</a></li>
              <li><a href="javascript:void(0)">Politique de confidentialité</a></li>
              <li><a href="javascript:void(0)">Mentions légales</a></li>
              <li><a href="admin.html">Administration</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-divider"></div>

        <div class="footer-bottom">
          <div class="footer-copyright">
            © 2026 <strong>Tradition IA</strong>. Tous droits réservés.
          </div>
          <div class="footer-legal-links">
            <a href="javascript:void(0)">Confidentialité</a>
            <span class="legal-separator">•</span>
            <a href="javascript:void(0)">CGU</a>
            <span class="legal-separator">•</span>
            <a href="javascript:void(0)">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  const target = document.getElementById('app') || document.body;
  target.insertAdjacentHTML('beforeend', footerHtml);
}

// Exposer globalement sur Window
window.showToast = showToast;
window.renderAllMasks = renderAllMasks;
window.toggleTheme = toggleTheme;
window.getThemeButtonHtml = getThemeButtonHtml;
window.getCurrentTheme = getCurrentTheme;
window.initCommonFooter = initCommonFooter;
