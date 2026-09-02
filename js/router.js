/**
 * TRADITION IA - SPA ROUTER
 * Single Page Application Router for seamless hash navigation (#landing, #translate, etc.)
 */

import { Store } from './store.js';

export const Router = {
  routes: {
    'landing': { title: 'Accueil - Tradition IA', public: true },
    'login': { title: 'Connexion - Tradition IA', public: true },
    'register': { title: 'Inscription - Tradition IA', public: true },
    'forgot-password': { title: 'Mot de passe oublié - Tradition IA', public: true },
    'dashboard': { title: 'Tableau de Bord', requiresAuth: true },
    'translate': { title: 'Traduction des Langues Gabonaises', requiresAuth: true },
    'ai-assistant': { title: 'Assistant IA Linguistique', requiresAuth: true },
    'dictionary': { title: 'Dictionnaire Collaboratif', requiresAuth: true },
    'history': { title: 'Historique des Traductions', requiresAuth: true },
    'profile': { title: 'Profil Utilisateur', requiresAuth: true },
    'admin': { title: 'Administration - Tradition IA', requiresAdmin: true },
    'admin-users': { title: 'Gestion des Utilisateurs', requiresAdmin: true },
    'admin-languages': { title: 'Gestion des Langues', requiresAdmin: true },
    'admin-dictionary': { title: 'Gestion du Dictionnaire', requiresAdmin: true },
    'admin-expressions': { title: 'Gestion des Expressions', requiresAdmin: true },
    'admin-ai-validation': { title: 'Validation des Suggestions IA', requiresAdmin: true },
    'admin-analytics': { title: 'Analyses & Rapports', requiresAdmin: true }
  },

  currentRoute: 'landing',
  listeners: [],

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // Premier chargement
    this.handleRoute();
  },

  navigate(routeName) {
    window.location.hash = routeName;
  },

  onRoute(fn) {
    this.listeners.push(fn);
  },

  handleRoute() {
    let fullHash = window.location.hash.replace('#', '').trim() || 'landing';
    let [baseRoute, queryString] = fullHash.split('?');
    let rawHash = baseRoute || 'landing';

    // Normalisation si la route n'existe pas
    if (!this.routes[rawHash]) {
      rawHash = 'landing';
    }

    const routeConfig = this.routes[rawHash];

    // Auth guard: Administrateur
    if (routeConfig?.requiresAdmin && Store.user?.role !== 'admin') {
      console.warn('[Router] Accès Administrateur requis pour #' + rawHash);
      this.navigate('login');
      return;
    }

    // Auth guard: Utilisateur connecté
    if (routeConfig?.requiresAuth && !Store.user) {
      console.warn('[Router] Authentification requise pour #' + rawHash);
      this.navigate('login');
      return;
    }

    this.currentRoute = rawHash;
    document.title = routeConfig.title || 'Tradition IA';

    // Rendre visible la vue cible et masquer les autres
    document.querySelectorAll('.page-view').forEach(el => {
      el.classList.remove('active');
    });

    const targetEl = document.getElementById(`view-${rawHash}`);
    if (targetEl) {
      targetEl.classList.add('active');
      window.scrollTo(0, 0);
    } else {
      document.getElementById('view-landing')?.classList.add('active');
    }

    // Informer les abonnés du changement de route
    this.listeners.forEach(fn => fn(rawHash));
  }
};
