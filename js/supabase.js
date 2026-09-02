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

  seedLocalData() {
    const storedLangs = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.LANGUAGES) || 'null');
    if (!storedLangs || !Array.isArray(storedLangs) || storedLangs.length !== window.MOCK_LANGUAGES.length || !storedLangs.some(l => l.name === 'Anglais')) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.LANGUAGES, JSON.stringify(window.MOCK_LANGUAGES));
    }

    const storedDict = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.DICTIONARY) || 'null');
    if (!storedDict || !storedDict.some(d => d.targetLang === 'Guisir')) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.DICTIONARY, JSON.stringify(window.MOCK_DICTIONARY));
    }

    const storedExpr = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS) || 'null');
    if (!storedExpr || !storedExpr.some(e => e.targetLang === 'Guisir')) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS, JSON.stringify(window.MOCK_EXPRESSIONS));
    }
    if (!localStorage.getItem(window.CONFIG.STORAGE_KEYS.AI_SUGGESTIONS)) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.AI_SUGGESTIONS, JSON.stringify(window.MOCK_AI_SUGGESTIONS));
    }
    if (!localStorage.getItem(window.CONFIG.STORAGE_KEYS.TRANSLATIONS)) {
      localStorage.setItem(window.CONFIG.STORAGE_KEYS.TRANSLATIONS, JSON.stringify(window.MOCK_TRANSLATIONS));
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

  // --- GETTERS ---
  async getLanguages() {
    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('languages').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.LANGUAGES) || '[]');
  }

  async getDictionary() {
    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('dictionary').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.DICTIONARY) || '[]');
  }

  async getExpressions() {
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

  async getTranslations() {
    if (this.isSupabaseConfigured) {
      const { data, error } = await this.client.from('translations').select('*');
      if (!error && data && data.length > 0) return data;
    }
    return JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.TRANSLATIONS) || '[]');
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
    translation.id = Date.now().toString();
    translation.createdAt = new Date().toLocaleString('fr-FR');

    if (this.isSupabaseConfigured) {
      await this.client.from('translations').insert([translation]);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.TRANSLATIONS) || '[]');
    current.unshift(translation);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.TRANSLATIONS, JSON.stringify(current));
    return translation;
  }

  async addDictionaryEntry(entry) {
    entry.id = Date.now().toString();
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
    if (this.isSupabaseConfigured) {
      await this.client.from('expressions').insert([expr]);
    }
    const current = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS) || '[]');
    current.push(expr);
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.EXPRESSIONS, JSON.stringify(current));
    return expr;
  }

  async deleteExpression(id) {
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
