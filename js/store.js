/**
 * TRADITION IA - APPLICATION STATE MANAGEMENT (Zustand-style Reactive Store)
 * Universal script compatible with file:// protocol and http:// servers
 */

class AppStore {
  constructor() {
    this.user = JSON.parse(localStorage.getItem(window.CONFIG.STORAGE_KEYS.USER) || 'null');
    this.languages = [];
    this.dictionary = [];
    this.expressions = [];
    this.translations = [];
    this.aiSuggestions = [];
    this.usersList = [];
    this.chatMessages = [
      { id: '1', role: 'assistant', text: 'Mbolo ! Je suis votre assistant Tradition IA. Posez-moi vos questions sur le Fang, le Punu, le Nzébi, le Myènè, le Téké, le Vili, le Guisir, le Kota et l\'Obamba !' }
    ];
    this.listeners = [];
  }

  async loadInitialData() {
    this.languages = await window.DB.getLanguages();
    this.dictionary = await window.DB.getDictionary();
    this.expressions = await window.DB.getExpressions();
    this.translations = await window.DB.getTranslations();
    this.aiSuggestions = await window.DB.getAISuggestions();
    this.usersList = await window.DB.getUsersList();
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  // --- AUTHENTICATION ---
  login(email, password, role = 'user') {
    const isAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    const userObj = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0].toUpperCase(),
      role: isAdmin ? 'admin' : 'user',
      preferredLang: 'Fang'
    };
    this.user = userObj;
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.USER, JSON.stringify(userObj));
    this.notify();
    return userObj;
  }

  logout() {
    this.user = null;
    localStorage.removeItem(window.CONFIG.STORAGE_KEYS.USER);
    this.notify();
  }

  updateProfile(updatedData) {
    if (!this.user) return;
    this.user = { ...this.user, ...updatedData };
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.USER, JSON.stringify(this.user));
    this.notify();
  }

  // --- CHATBOT ---
  addChatMessage(role, text) {
    const msg = { id: Date.now().toString(), role, text };
    this.chatMessages.push(msg);
    this.notify();
    return msg;
  }

  // --- TRANSLATIONS ---
  async translateText(sourceText, sourceLang, targetLang) {
    if (!sourceText.trim()) return '';

    let translatedResult = '';
    let isAI = false;

    // Détecter si on est sur Vercel (https) ou en local (file://)
    const isDeployed = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (isDeployed) {
      // ── Mode Vercel : appel API réelle ──────────────────────────────
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sourceText, sourceLang, targetLang })
        });

        const data = await response.json();

        if (response.ok && data.translation) {
          translatedResult = data.translation;
          isAI = data.source === 'ai';
        } else {
          throw new Error(data.error || 'Erreur API');
        }
      } catch (apiError) {
        console.warn('[Tradition IA] API Translate failed, using local fallback:', apiError.message);
        translatedResult = this._localTranslateFallback(sourceText, targetLang);
        isAI = false;
      }
    } else {
      // ── Mode local (file://) : fallback dictionnaire + PDF ──────────
      let pdfMatch = window.queryPdfKnowledge ? window.queryPdfKnowledge(sourceText, targetLang) : null;
      let dictMatch = this.dictionary.find(
        d => d.word.toLowerCase() === sourceText.trim().toLowerCase() && d.targetLang.toLowerCase() === targetLang.toLowerCase()
      );

      if (pdfMatch && pdfMatch.exactMatch) {
        translatedResult = pdfMatch.exactMatch.fr || pdfMatch.exactMatch.fang;
      } else if (dictMatch) {
        translatedResult = dictMatch.translation;
      } else {
        translatedResult = this._localTranslateFallback(sourceText, targetLang);
        isAI = false;
      }
    }

    const tObj = {
      sourceText,
      translatedText: translatedResult,
      sourceLang,
      targetLang,
      isAI
    };

    const saved = await window.DB.addTranslation(tObj);
    this.translations.unshift(saved);
    this.notify();
    return translatedResult;
  }

  // Fallback de traduction local (dictionnaire mock)
  _localTranslateFallback(sourceText, targetLang) {
    const sampleGaboWords = {
      'Fang': ['Mbolo', 'Akiba', 'Owusu', 'Ntang', 'Nkogo', 'Eyenga', 'Mi neng', 'Nlem'],
      'Punu': ['Mbolo', 'Biké', 'Mbote', 'Yine', 'Dipumu', 'Muringi', 'Mulobi'],
      'Nzébi': ['Mbolo', 'Inzébi', 'Koulamoutou', 'Nzabi', 'Bassi'],
      'Myènè': ['Mbolo', 'Ogula', 'Nkambé', 'Ivanga', 'Ombwiri', 'Ntang', 'Oruwa'],
      'Téké': ['Mbolo', 'Iteké', 'Franceville', 'Batéké', 'Mpassa'],
      'Vili': ['Mbolo', 'Icivili', 'Mayumba', 'Tchibanga'],
      'Obamba': ['Mbolo', 'Lembaama', 'Mpassa', 'Franceville'],
      'Guisir': ['Mbolo', 'Yigisir', 'Fougamou', 'Mouila', 'Ndendé'],
      'Kota': ['Mbolo', 'Ikota', 'Makokou', 'Ogooué-Ivindo'],
      'Anglais': ['Hello', 'Welcome', 'Thank you', 'Greetings', 'Peace']
    };
    const words = sampleGaboWords[targetLang] || sampleGaboWords['Fang'];
    const prefix = words[Math.floor(Math.random() * words.length)];
    return `${prefix} ${sourceText} (Traduction ${targetLang} — déployez sur Vercel pour la vraie IA)`;
  }

  // --- DICTIONARY CRUD ---
  async addDictionaryEntry(entry) {
    const saved = await window.DB.addDictionaryEntry(entry);
    this.dictionary.unshift(saved);
    this.notify();
    return saved;
  }

  async deleteDictionaryEntry(id) {
    await window.DB.deleteDictionaryEntry(id);
    this.dictionary = this.dictionary.filter(item => item.id !== id);
    this.notify();
  }

  // --- LANGUAGES CRUD ---
  async addLanguage(lang) {
    const saved = await window.DB.addLanguage(lang);
    this.languages.push(saved);
    this.notify();
    return saved;
  }

  async deleteLanguage(id) {
    await window.DB.deleteLanguage(id);
    this.languages = this.languages.filter(l => l.id !== id);
    this.notify();
  }

  // --- EXPRESSIONS CRUD ---
  async addExpression(expr) {
    const saved = await window.DB.addExpression(expr);
    this.expressions.push(saved);
    this.notify();
    return saved;
  }

  async deleteExpression(id) {
    await window.DB.deleteExpression(id);
    this.expressions = this.expressions.filter(e => e.id !== id);
    this.notify();
  }

  // --- USERS CRUD ---
  async addUser(userObj) {
    const saved = await window.DB.addUser(userObj);
    this.usersList.push(saved);
    this.notify();
    return saved;
  }

  async deleteUser(id) {
    await window.DB.deleteUser(id);
    this.usersList = this.usersList.filter(u => u.id !== id);
    this.notify();
  }

  // --- AI SUGGESTIONS ---
  async updateAISuggestionStatus(id, status) {
    await window.DB.updateAISuggestionStatus(id, status);
    this.aiSuggestions = this.aiSuggestions.map(s => s.id === id ? { ...s, status } : s);
    this.notify();
  }
}

window.Store = new AppStore();
