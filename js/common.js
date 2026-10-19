/**
 * TRADITION IA - COMMON SCRIPT FOR ALL HTML PAGES
 * Universal script compatible with file:// protocol and http:// servers
 */

// Synchronisation immédiate du thème (Mémorisation du choix Clair ou Sombre)
(function initThemeImmediate() {
  try {
    const savedTheme = localStorage.getItem('tradition_ia_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  } catch(e) {}
})();

// Synchronisation immédiate de l'état connecté pour éviter tout saut visuel
(function syncAuthState() {
  try {
    const user = JSON.parse(localStorage.getItem('tradition_ia_user') || 'null');
    if (user && (user.name || user.nom_complet || user.email)) {
      document.documentElement.classList.add('user-logged-in');
    } else {
      document.documentElement.classList.remove('user-logged-in');
    }
  } catch(e) {}
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
  initLogoutModal();
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
  return document.documentElement.getAttribute('data-theme') || localStorage.getItem('tradition_ia_theme') || 'dark';
}

function getThemeButtonHtml() {
  const current = getCurrentTheme();
  const isDark = current === 'dark';
  const title = isDark ? 'Basculer en Mode Clair' : 'Basculer en Mode Sombre';
  const icon = isDark
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  return `
    <button class="btn-theme-toggle" id="btn-theme-toggle" aria-label="${title}" title="${title}">
      ${icon}
    </button>
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
  const title = isDark ? 'Basculer en Mode Clair' : 'Basculer en Mode Sombre';
  const icon = isDark
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
    btn.innerHTML = icon;
    btn.setAttribute('aria-label', title);
    btn.setAttribute('title', title);
  });
}

// Clic global pour le bouton de bascule de thème
document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('.btn-theme-toggle');
  if (toggleBtn) {
    e.preventDefault();
    toggleTheme();
  }
});


function initCommonNavbar() {
  const user = (window.TradAuth && window.TradAuth.getUser()) || window.Store?.user;
  const isLoggedIn = !!(user && (user.name || user.nom_complet || user.email));

  if (isLoggedIn) {
    document.documentElement.classList.add('user-logged-in');
    document.body?.classList.add('user-logged-in');
  } else {
    document.documentElement.classList.remove('user-logged-in');
    document.body?.classList.remove('user-logged-in');
  }

  // Masquer ou afficher les liens réservés aux membres connectés (Mon Profil, Historique, etc.)
  document.querySelectorAll('.nav-links a[href="profile.html"], .nav-links a[href="history.html"], .footer-links a[href="profile.html"], .footer-links a[href="history.html"], [data-auth-required="true"]').forEach(link => {
    link.setAttribute('data-auth-required', 'true');
    link.style.display = isLoggedIn ? '' : 'none';
  });

  const container = document.getElementById('nav-user-container');
  if (!container) return;

  const themeBtnHtml = getThemeButtonHtml();

  if (isLoggedIn) {
    const displayName = user.nom_complet || user.name || 'Utilisateur';
    const initial = displayName.trim().charAt(0).toUpperCase() || 'U';
    const isAdmin = user.role === 'admin';
    const roleLabel = isAdmin ? 'Administrateur' : 'Membre Connecté';

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        ${themeBtnHtml}
        <div class="user-profile-menu" style="display: flex; align-items: center; gap: 10px; background: rgba(255, 255, 255, 0.05); padding: 5px 12px; border-radius: 40px; border: 1px solid var(--border-color);">
          <div class="user-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 0.9rem;">${initial}</div>
          <div style="font-size: 0.82rem; text-align: left; line-height: 1.2;">
            <div style="font-weight: 700; color: var(--text-main); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${displayName}</div>
            <div style="font-size: 0.72rem; color: ${isAdmin ? 'var(--gold)' : 'var(--primary)'}; font-weight: 600;">${roleLabel}</div>
          </div>
          ${isAdmin ? '<a href="admin.html" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem; border-color: var(--gold); color: var(--gold); border-radius: 20px;">Console Admin</a>' : ''}
          <button id="btn-common-logout" class="btn btn-danger" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 20px; cursor: pointer;">Déconnexion</button>
        </div>
      </div>
    `;

    document.getElementById('btn-common-logout')?.addEventListener('click', (e) => {
      e.preventDefault();
      triggerLogoutConfirm();
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
  let currentFile = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentFile || currentFile === '') currentFile = 'index.html';
  currentFile = currentFile.split('?')[0].split('#')[0];

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkFile = href.split('?')[0].split('#')[0];
      if (linkFile === currentFile) {
        link.classList.add('active');
      } else if (!href.startsWith('#') && !href.startsWith('javascript:')) {
        link.classList.remove('active');
      }
    }
  });

  document.querySelectorAll('.sidebar-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkFile = href.split('?')[0].split('#')[0];
      if (linkFile === currentFile) {
        link.classList.add('active');
      } else if (!href.startsWith('#') && !href.startsWith('javascript:')) {
        link.classList.remove('active');
      }
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

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
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

function initLogoutModal() {
  if (document.getElementById('modal-logout-confirm')) return;

  const modalHtml = `
    <div id="modal-logout-confirm" class="modal-backdrop">
      <div class="modal-card" style="max-width: 440px; text-align: center; padding: 34px 28px; background: #131924; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.7);">
        <div style="width: 62px; height: 62px; border-radius: 50%; background: rgba(239, 68, 68, 0.12); border: 1.5px solid rgba(239, 68, 68, 0.35); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 18px auto;">
          🚪
        </div>
        <h3 style="font-size: 1.35rem; font-weight: 700; color: #fff; margin-bottom: 10px; font-family: 'Space Grotesk', sans-serif;">
          Confirmer la déconnexion
        </h3>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.55; margin-bottom: 26px;">
          Êtes-vous sûr de vouloir vous déconnecter de <strong>Tradition IA</strong> ? Vous devrez vous reconnecter pour retrouver vos préférences.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button type="button" id="btn-cancel-logout" class="btn btn-secondary" style="flex: 1; padding: 11px 18px; justify-content: center; font-weight: 600;">
            Annuler
          </button>
          <button type="button" id="btn-confirm-logout" class="btn btn-danger" style="flex: 1; padding: 11px 18px; justify-content: center; font-weight: 600;">
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('modal-logout-confirm');
  const cancelBtn = document.getElementById('btn-cancel-logout');
  const confirmBtn = document.getElementById('btn-confirm-logout');

  cancelBtn?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  confirmBtn?.addEventListener('click', () => {
    modal.classList.remove('active');
    executeLogout();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });

  // Interception universelle des boutons de déconnexion
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#btn-common-logout, #btn-profile-logout, [data-action="logout"]');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      triggerLogoutConfirm();
    }
  });
}

function triggerLogoutConfirm() {
  const modal = document.getElementById('modal-logout-confirm');
  if (modal) {
    modal.classList.add('active');
  } else if (confirm('Êtes-vous sûr de vouloir vous déconnecter de Tradition IA ?')) {
    executeLogout();
  }
}
window.triggerLogoutConfirm = triggerLogoutConfirm;

function executeLogout() {
  if (window.TradAuth) window.TradAuth.logout();
  if (window.Store) window.Store.logout();
  if (window.showToast) window.showToast('Vous avez été déconnecté avec succès.');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 350);
}
window.executeLogout = executeLogout;

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
  // Pas de footer sur les pages d'authentification (login, register, forgot-password)
  if (document.body.classList.contains('auth-body')) return;
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
              <li><a href="history.html" data-auth-required="true">Historique</a></li>
            </ul>
          </div>

          <!-- Col 3: Ressources -->
          <div class="footer-col">
            <h4 class="footer-heading">Ressources</h4>
            <ul class="footer-links">
              <li><a href="profile.html" data-auth-required="true">Mon Compte</a></li>
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
              <li><a href="javascript:void(0)">Sécurité du Patrimoine</a></li>
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
