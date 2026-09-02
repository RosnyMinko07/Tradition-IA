/**
 * TRADITION IA - MASTER APPLICATION CONTROLLER (Vanilla JS SPA)
 */

import { Store } from './store.js';
import { Router } from './router.js';
import { DB } from './supabase.js';
import { renderNavbar } from './components/Navbar.js';
import { showToast } from './components/Toast.js';

// Page Renderers
import { renderLandingPage } from './pages/LandingPage.js';
import { renderLoginPage, initLoginPageEvents } from './pages/LoginPage.js';
import { renderRegisterPage, initRegisterPageEvents } from './pages/RegisterPage.js';
import { renderForgotPasswordPage, initForgotPasswordPageEvents } from './pages/ForgotPasswordPage.js';
import { renderDashboardPage } from './pages/DashboardPage.js';
import { renderTranslatePage, initTranslatePageEvents } from './pages/TranslatePage.js';
import { renderAIAssistantPage, initAIAssistantPageEvents } from './pages/AIAssistantPage.js';
import { renderDictionaryPage, initDictionaryPageEvents } from './pages/DictionaryPage.js';
import { renderHistoryPage, initHistoryPageEvents } from './pages/HistoryPage.js';
import { renderProfilePage, initProfilePageEvents } from './pages/ProfilePage.js';
import { renderAdminDashboardPage } from './pages/AdminDashboardPage.js';
import { renderAdminUsersPage, initAdminUsersPageEvents } from './pages/AdminUsersPage.js';
import { renderAdminLanguagesPage, initAdminLanguagesPageEvents } from './pages/AdminLanguagesPage.js';
import { renderAdminDictionaryPage, initAdminDictionaryPageEvents } from './pages/AdminDictionaryPage.js';
import { renderAdminExpressionsPage, initAdminExpressionsPageEvents } from './pages/AdminExpressionsPage.js';
import { renderAdminAIValidationPage, initAdminAIValidationPageEvents } from './pages/AdminAIValidationPage.js';
import { renderAdminAnalyticsPage } from './pages/AdminAnalyticsPage.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialiser le store et les données Supabase / LocalStorage
  await Store.loadInitialData();

  // 2. S'abonner aux changements du store pour rafraîchir l'UI
  Store.subscribe(() => {
    renderNavbar();
    renderCurrentPage(Router.currentRoute);
  });

  // 3. Écouter les changements de route du SPA Router
  Router.onRoute((routeName) => {
    renderNavbar();
    renderCurrentPage(routeName);
  });

  // 4. Démarrer le routeur
  Router.init();

  // 5. Initialiser la modale de configuration Supabase
  initSupabaseModal();
});

function renderCurrentPage(route) {
  const contentContainer = document.getElementById('app-content');
  if (!contentContainer) return;

  switch (route) {
    case 'landing':
      contentContainer.innerHTML = renderLandingPage();
      break;

    case 'login':
      contentContainer.innerHTML = renderLoginPage();
      initLoginPageEvents();
      break;

    case 'register':
      contentContainer.innerHTML = renderRegisterPage();
      initRegisterPageEvents();
      break;

    case 'forgot-password':
      contentContainer.innerHTML = renderForgotPasswordPage();
      initForgotPasswordPageEvents();
      break;

    case 'dashboard':
      contentContainer.innerHTML = renderDashboardPage();
      break;

    case 'translate':
      contentContainer.innerHTML = renderTranslatePage();
      initTranslatePageEvents();
      break;

    case 'ai-assistant':
      contentContainer.innerHTML = renderAIAssistantPage();
      initAIAssistantPageEvents();
      break;

    case 'dictionary':
      contentContainer.innerHTML = renderDictionaryPage();
      initDictionaryPageEvents();
      break;

    case 'history':
      contentContainer.innerHTML = renderHistoryPage();
      initHistoryPageEvents();
      break;

    case 'profile':
      contentContainer.innerHTML = renderProfilePage();
      initProfilePageEvents();
      break;

    case 'admin':
      contentContainer.innerHTML = renderAdminDashboardPage();
      break;

    case 'admin-users':
      contentContainer.innerHTML = renderAdminUsersPage();
      initAdminUsersPageEvents();
      break;

    case 'admin-languages':
      contentContainer.innerHTML = renderAdminLanguagesPage();
      initAdminLanguagesPageEvents();
      break;

    case 'admin-dictionary':
      contentContainer.innerHTML = renderAdminDictionaryPage();
      initAdminDictionaryPageEvents();
      break;

    case 'admin-expressions':
      contentContainer.innerHTML = renderAdminExpressionsPage();
      initAdminExpressionsPageEvents();
      break;

    case 'admin-ai-validation':
      contentContainer.innerHTML = renderAdminAIValidationPage();
      initAdminAIValidationPageEvents();
      break;

    case 'admin-analytics':
      contentContainer.innerHTML = renderAdminAnalyticsPage();
      break;

    default:
      contentContainer.innerHTML = renderLandingPage();
      break;
  }
}

function initSupabaseModal() {
  const modal = document.getElementById('modal-supabase-config');
  const form = document.getElementById('form-supabase-config');

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => modal?.classList.remove('active'));
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('cfg-supabase-url').value.trim();
    const key = document.getElementById('cfg-supabase-key').value.trim();

    DB.setSupabaseCredentials(url, key);
    modal?.classList.remove('active');
    showToast('Configuration Supabase mise à jour !');
  });
}
