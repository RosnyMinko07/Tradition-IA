/**
 * TRADITION IA - SUPABASE INTEGRATION & DATA STORAGE SERVICE
 * Universal script compatible with file:// protocol and http:// servers
 */

class StorageService {
  constructor() {
    this.client = null;
    this.isSupabaseConfigured = false;
    this.initSupabase();
  }

  initSupabase() {
    const url = localStorage.getItem(window.CONFIG.STORAGE_KEYS.SUPABASE_URL) || window.CONFIG.DEFAULT_SUPABASE_URL;
    const key = localStorage.getItem(window.CONFIG.STORAGE_KEYS.SUPABASE_KEY) || window.CONFIG.DEFAULT_SUPABASE_ANON_KEY;

    if (url && key && window.supabase) {
      try {
        this.client = window.supabase.createClient(url, key);
        this.isSupabaseConfigured = true;
        console.log('[Supabase] Client connecté avec succès !');
      } catch (err) {
        console.warn('[Supabase] Erreur d\'initialisation, basculement en mode LocalStorage:', err);
        this.isSupabaseConfigured = false;
        this.seedLocalData();
      }
    } else {
      this.isSupabaseConfigured = false;
      this.seedLocalData();
    }
  }

  getCurrentUser() {
    try {
      if (window.TradAuth && typeof window.TradAuth.getUser === 'function') {
        const u = window.TradAuth.getUser();
        if (u && (u.email || u.courriel || u.name || u.nom_complet)) return u;
      }
      if (window.Store && window.Store.user) return window.Store.user;
      const raw = localStorage.getItem(window.CONFIG.STORAGE_KEYS.USER);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  getUserTranslationsStorageKey(user) {
    const email = user && (user.email || user.courriel);
    if (email) {
      return `${window.CONFIG.STORAGE_KEYS.TRANSLATIONS}_${encodeURIComponent(email.toLowerCase().trim())}`;
    }
    return `${window.CONFIG.STORAGE_KEYS.TRANSLATIONS}_guest`;
  }

  seedLocalData() {
    // Si l'ancien cache local contient des mocks ou est pollué, le nettoyer
    const storedDict = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.DICTIONARY) || 'null');
    if (storedDict && storedDict.length > 0 && storedDict.length < 50 && storedDict.some(d => d.id === '1' && d.word === 'Bonjour')) {
      // Ancien mock détecté -> nettoyer le dictionnaire local pour charger les 276 mots réels de MySQL
      localStorage.removeItem(window.CONFIG.STORAGE_KEYS.DICTIONARY);
    }

    // Supprimer l'ancien historique global partagé polluant
    localStorage.removeItem(window.CONFIG.STORAGE_KEYS.TRANSLATIONS);

    const storedLangs = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.LANGUAGES) || 'null');
    if (!storedLangs || !Array.isArray(storedLangs) || storedLangs.length !== window.MOCK_LANGUAGES.length) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.LANGUAGES, JSON.stringify(window.MOCK_LANGUAGES));
    }

    const storedExpr = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS) || 'null');
    if (!storedExpr || !storedExpr.some(e => e.targetLang === 'Guisir') || !storedExpr.some(e => e.isValidated !== undefined)) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS, JSON.stringify(window.MOCK_EXPRESSIONS));
    }
    if (!localStorage.getItem(window.CONFIG.STORAGE_KEYS.AI_SUGGESTIONS)) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.AI_SUGGESTIONS, JSON.stringify(window.MOCK_AI_SUGGESTIONS));
    }
    if (!localStorage.getItem(window.CONFIG.STORAGE_KEYS.USERS_LIST)) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.USERS_LIST, JSON.stringify(window.MOCK_USERS));
    }
  }

  setSupabaseCredentials(url, key) {
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.SUPABASE_URL, url);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.SUPABASE_KEY, key);
    this.initSupabase();
  }

  async fetchMySQLData(userEmail = null, force = false) {
    if (!force && this.mysqlData && (!userEmail || this.lastFetchedEmail === userEmail)) {
      return this.mysqlData;
    }
    try {
      const url = userEmail ? `/api/data?user_email=${encodeURIComponent(userEmail)}` : '/api/data';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.mysqlData = json;
          this.lastFetchedEmail = userEmail;

          // Mettre en cache les 276 mots officiels de la base MySQL
          if (json.dictionary && json.dictionary.length > 0) {
            localStorage.setItem(window.CONFIG.STORAGE_KEYS.DICTIONARY, JSON.stringify(json.dictionary));
          }

          // Mettre en cache l'historique cloisonné de l'utilisateur
          if (userEmail && Array.isArray(json.translations)) {
            const key = this.getUserTranslationsStorageKey({ email: userEmail });
            localStorage.setItem(key, JSON.stringify(json.translations));
          }

          return json;
        }
      }
    } catch (e) {
      // Mode fichier local ou sans serveur Node
    }
    return null;
  }

  // --- GETTERS ---
  async getLanguages() {
    const mysql = await this.fetchMySQLData();
    if (mysql && mysql.languages && mysql.languages.length > 0) {
      return mysql.languages;
    }
    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('languages').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.LANGUAGES) || '[]');
  }

  async getDictionary() {
    const mysql = await this.fetchMySQLData();
    if (mysql && mysql.dictionary && mysql.dictionary.length > 0) {
      return mysql.dictionary;
    }
    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('dictionary').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.DICTIONARY) || '[]');
  }

  async getExpressions() {
    const mysql = await this.fetchMySQLData();
    if (mysql && mysql.expressions && mysql.expressions.length > 0) {
      return mysql.expressions;
    }
    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('expressions').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS) || '[]');
  }

  async getAISuggestions() {
    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('ai_suggestions').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.AI_SUGGESTIONS) || '[]');
  }

  /**
   * Historique de traduction STRICTEMENT cloisonné par utilisateur
   */
  async getTranslations(specificEmail = null) {
    const user = this.getCurrentUser();
    const userEmail = specificEmail || (user && (user.email || user.courriel) ? (user.email || user.courriel).toLowerCase().trim() : null);

    // Si aucun utilisateur n'est connecté, ne jamais afficher l'historique d'autres personnes !
    if (!userEmail) {
      const guestKey = this.getUserTranslationsStorageKey(null);
      return JSON.parse(localStorage.getItem(guestKey) || '[]');
    }

    // Récupérer depuis MySQL pour ce compte précis
    const mysql = await this.fetchMySQLData(userEmail, true);
    if (mysql && Array.isArray(mysql.translations)) {
      return mysql.translations;
    }

    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('translations').select('*').eq('user_email', userEmail);
      if (!error && data) return data;
    }

    // Fallback local cloisonné à cet utilisateur
    const userKey = this.getUserTranslationsStorageKey(user);
    return JSON.parse(localStorage.getItem(userKey) || '[]');
  }

  async getUsersList() {
    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('users').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.USERS_LIST) || '[]');
  }

  // --- ADDERS & MUTATIONS ---
  async addTranslation(translation) {
    const user = this.getCurrentUser();
    const userEmail = user && (user.email || user.courriel) ? (user.email || user.courriel).toLowerCase().trim() : null;
    const userId = user && user.id ? user.id : null;

    translation.id = Date.now().toString();
    translation.createdAt = translation.createdAt || new Date().toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    translation.userEmail = userEmail;
    translation.userId = userId;

    // Sauvegarde vers MySQL avec userEmail et userId
    try {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'save_translation',
          sourceLang: translation.sourceLang,
          targetLang: translation.targetLang,
          sourceText: translation.sourceText,
          translatedText: translation.translatedText,
          isAI: translation.isAI,
          userEmail: userEmail,
          userId: userId
        })
      }).catch(err => console.warn('[StorageService] Sauvegarde MySQL async:', err));
    } catch (e) {}

    if (this.isSupabaseConfigured) {
      await this.client.from('translations').insert([translation]);
    }

    // Stockage local partitionné par compte utilisateur
    const storageKey = this.getUserTranslationsStorageKey(user);
    const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
    current.unshift(translation);
    localStorage.setItem(storageKey, JSON.stringify(current));
    return translation;
  }

  async clearUserHistory() {
    const user = this.getCurrentUser();
    const userEmail = user && (user.email || user.courriel) ? (user.email || user.courriel).toLowerCase().trim() : null;
    const userId = user && user.id ? user.id : null;

    if (userEmail || userId) {
      try {
        await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'clear_history',
            userEmail,
            userId
          })
        });
      } catch (e) {}
    }

    const storageKey = this.getUserTranslationsStorageKey(user);
    localStorage.removeItem(storageKey);
    return true;
  }

  async addDictionaryEntry(entry) {
    entry.id = Date.now().toString();

    // Enregistrement direct dans MySQL (table entrees_dictionnaire)
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'add_word',
          word: entry.word,
          translation: entry.translation,
          targetLang: entry.targetLang,
          category: entry.category,
          example: entry.example
        })
      });
      const data = await res.json();
      if (data && data.id) entry.id = data.id;
    } catch (e) {
      console.warn('[StorageService] Erreur ajout mot MySQL:', e);
    }

    if (this.isSupabaseConfigured) {
      await this.client.from('dictionary').insert([entry]);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.DICTIONARY) || '[]');
    current.unshift(entry);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.DICTIONARY, JSON.stringify(current));
    return entry;
  }

  async deleteDictionaryEntry(id) {
    if (this.isSupabaseConfigured) {
      await this.client.from('dictionary').delete().eq('id', id);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.DICTIONARY) || '[]');
    const filtered = current.filter(item => item.id !== id);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.DICTIONARY, JSON.stringify(filtered));
  }

  async addLanguage(lang) {
    lang.id = Date.now().toString();
    if (this.isSupabaseConfigured) {
      await this.client.from('languages').insert([lang]);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.LANGUAGES) || '[]');
    current.push(lang);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.LANGUAGES, JSON.stringify(current));
    return lang;
  }

  async deleteLanguage(id) {
    if (this.isSupabaseConfigured) {
      await this.client.from('languages').delete().eq('id', id);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.LANGUAGES) || '[]');
    const filtered = current.filter(l => l.id !== id);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.LANGUAGES, JSON.stringify(filtered));
  }

  async addExpression(expr) {
    expr.id = Date.now().toString();
    if (expr.isValidated === undefined) {
      expr.isValidated = false;
    }
    expr.submittedAt = expr.submittedAt || new Date().toLocaleDateString('fr-FR');

    // Sauvegarde MySQL si disponible
    try {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'propose_expression',
          phrase: expr.phrase,
          translation: expr.translation,
          targetLang: expr.targetLang,
          context: expr.context,
          isValidated: expr.isValidated ? 1 : 0
        })
      }).catch(() => {});
    } catch (e) {}

    if (this.isSupabaseConfigured) {
      await this.client.from('expressions').insert([expr]);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS) || '[]');
    current.unshift(expr);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS, JSON.stringify(current));
    return expr;
  }

  async approveExpression(id) {
    // Mise à jour MySQL si disponible
    try {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'validate_expression', id })
      }).catch(() => {});
    } catch (e) {}

    if (this.isSupabaseConfigured) {
      await this.client.from('expressions').update({ est_valide: true }).eq('id', id);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS) || '[]');
    const updated = current.map(e => e.id === id ? { ...e, isValidated: true } : e);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS, JSON.stringify(updated));
    return updated.find(e => e.id === id);
  }

  async deleteExpression(id) {
    // Suppression MySQL si disponible
    try {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'reject_expression', id })
      }).catch(() => {});
    } catch (e) {}

    if (this.isSupabaseConfigured) {
      await this.client.from('expressions').delete().eq('id', id);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS) || '[]');
    const filtered = current.filter(e => e.id !== id);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS, JSON.stringify(filtered));
  }

  async addUser(userObj) {
    userObj.id = Date.now().toString();
    userObj.joinedAt = new Date().toISOString().split('T')[0];
    if (this.isSupabaseConfigured) {
      await this.client.from('users').insert([userObj]);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.USERS_LIST) || '[]');
    current.push(userObj);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.USERS_LIST, JSON.stringify(current));
    return userObj;
  }

  async deleteUser(id) {
    if (this.isSupabaseConfigured) {
      await this.client.from('users').delete().eq('id', id);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.USERS_LIST) || '[]');
    const filtered = current.filter(u => u.id !== id);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.USERS_LIST, JSON.stringify(filtered));
  }

  async updateAISuggestionStatus(id, status) {
    if (this.isSupabaseConfigured) {
      await this.client.from('ai_suggestions').update({ status }).eq('id', id);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.AI_SUGGESTIONS) || '[]');
    const updated = current.map(s => s.id === id ? { ...s, status } : s);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.AI_SUGGESTIONS, JSON.stringify(updated));
  }
}

window.DB = new StorageService();
