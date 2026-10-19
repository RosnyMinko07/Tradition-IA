/**
 * TRADITION IA — MODULE AUTH CLIENT
 * ====================================
 * Gère la session utilisateur (JWT) côté navigateur.
 * Communique avec /api/auth (MySQL via Vercel dev / localhost).
 */

const AUTH_TOKEN_KEY = 'tradition_ia_token';
const AUTH_USER_KEY  = 'tradition_ia_user';
const FREE_COUNT_KEY = 'tradition_ia_free_count';
const FREE_LIMIT     = 5;

const TradAuth = {

  // ── SESSION ────────────────────────────────────────────────────────

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_USER_KEY)) || null;
    } catch { return null; }
  },

  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  saveSession(token, user) {
    if (user) {
      user.name = user.nom_complet || user.name || 'Utilisateur';
      user.email = user.courriel || user.email || '';
    }
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    if (window.CONFIG && window.CONFIG.STORAGE_KEYS) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    }
    if (window.Store) {
      window.Store.user = user;
    }
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    if (window.CONFIG && window.CONFIG.STORAGE_KEYS) {
      localStorage.removeItem(window.CONFIG.STORAGE_KEYS.USER);
    }
    if (window.Store) {
      window.Store.user = null;
    }
  },

  // ── ACCÈS ILLIMITÉ ────────────────────────────────────────────────
  getFreeCount() {
    return 0;
  },

  incrementFreeCount() {
    return 0;
  },

  hasReachedLimit() {
    return false;
  },

  getRemainingFree() {
    return Infinity;
  },

  // ── API CALLS ──────────────────────────────────────────────────────

  async register(nom_complet, courriel, mot_de_passe) {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', nom_complet, courriel, mot_de_passe })
    });
    const data = await res.json();
    if (data.success) this.saveSession(data.token, data.user);
    return data;
  },

  async login(courriel, mot_de_passe) {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', courriel, mot_de_passe })
    });
    const data = await res.json();
    if (data.success) this.saveSession(data.token, data.user);
    return data;
  },

  async loginWithGoogle(courriel, nom_complet = '', google_id = '') {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'google', courriel, nom_complet, google_id })
      });
      const data = await res.json();
      if (data.success) {
        this.saveSession(data.token, data.user);
      }
      return data;
    } catch (err) {
      console.warn('[TradAuth Google Login]', err);
      const user = {
        id: Date.now(),
        name: nom_complet || courriel.split('@')[0],
        email: courriel,
        role: 'utilisateur'
      };
      this.saveSession('google_local_token_' + Date.now(), user);
      return { success: true, token: 'local_token', user };
    }
  },

  async verifySession() {
    const token = this.getToken();
    if (!token) { this.logout(); return null; }
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ action: 'me' })
      });
      const data = await res.json();
      if (data.success) {
        this.saveSession(token, data.user);
        return data.user;
      } else {
        this.logout();
        return null;
      }
    } catch {
      // En mode fichier local, on retourne juste le user stocké
      return this.getUser();
    }
  }
};

window.TradAuth = TradAuth;

// Rétro-compatibilité : synchroniser avec window.Store si présent
if (window.Store && TradAuth.getUser()) {
  window.Store.user = TradAuth.getUser();
}
