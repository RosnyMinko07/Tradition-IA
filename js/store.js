/**
 * TRADITION IA - APPLICATION STATE & AUTH MANAGER
 * Compatible avec file:// et http:// — Architecture Multi-Pages HTML
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
      { id: '1', role: 'assistant', text: "Mbolo ! Je suis votre assistant Tradition IA. Posez-moi vos questions sur le Fang, le Punu, le Nzébi, le Myènè, le Téké, le Vili, le Guisir, le Kota et l'Obamba !" }
    ];
  }

  async loadInitialData() {
    this.languages     = await window.DB.getLanguages();
    this.dictionary    = await window.DB.getDictionary();
    this.expressions   = await window.DB.getExpressions();
    this.translations  = await window.DB.getTranslations();
    this.aiSuggestions = await window.DB.getAISuggestions();
    this.usersList     = await window.DB.getUsersList();
  }

  // ── AUTHENTIFICATION ────────────────────────────────────────────────────────

  login(email, password, role = 'user') {
    const isAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    const userObj = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0].replace(/[._-]/g, ' ').toUpperCase(),
      role: isAdmin ? 'admin' : 'user',
      preferredLang: 'Fang'
    };
    this.user = userObj;
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.USER, JSON.stringify(userObj));
    return userObj;
  }

  logout() {
    this.user = null;
    localStorage.removeItem(window.CONFIG.STORAGE_KEYS.USER);
  }

  updateProfile(updatedData) {
    if (!this.user) return;
    this.user = { ...this.user, ...updatedData };
    localStorage.setItem(window.CONFIG.STORAGE_KEYS.USER, JSON.stringify(this.user));
  }

  // ── CHATBOT ─────────────────────────────────────────────────────────────────

  addChatMessage(role, text) {
    const msg = { id: Date.now().toString(), role, text };
    this.chatMessages.push(msg);
    return msg;
  }

  // ── TRADUCTION ───────────────────────────────────────────────────────────────

  async translateText(sourceText, sourceLang, targetLang) {
    if (!sourceText.trim()) return '';

    let translatedResult = '';
    let isAI = false;

    const isDeployed = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (isDeployed) {
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
        console.warn('[Tradition IA] API Translate failed, fallback local:', apiError.message);
        translatedResult = this._localTranslateFallback(sourceText, targetLang);
      }
    } else {
      // Mode fichier local : dictionnaire PDF + mock
      const pdfMatch = window.queryPdfKnowledge ? window.queryPdfKnowledge(sourceText, targetLang) : null;
      const dictMatch = this.dictionary.find(
        d => d.word.toLowerCase() === sourceText.trim().toLowerCase()
          && d.targetLang.toLowerCase() === targetLang.toLowerCase()
      );

      if (pdfMatch && pdfMatch.exactMatch) {
        translatedResult = pdfMatch.exactMatch.fr || pdfMatch.exactMatch.fang;
      } else if (dictMatch) {
        translatedResult = dictMatch.translation;
      } else {
        translatedResult = this._localTranslateFallback(sourceText, targetLang);
      }
    }

    const tObj = { sourceText, translatedText: translatedResult, sourceLang, targetLang, isAI };
    const saved = await window.DB.addTranslation(tObj);
    this.translations.unshift(saved);
    return translatedResult;
  }

  _localTranslateFallback(sourceText, targetLang) {
    const sampleGaboWords = {
      'Fang':   ['Mbolo', 'Akiba', 'Owusu', 'Ntang', 'Nkogo', 'Eyenga', 'Mi neng', 'Nlem'],
      'Punu':   ['Mbolo', 'Biké', 'Mbote', 'Yine', 'Dipumu', 'Muringi', 'Mulobi'],
      'Nzébi':  ['Mbolo', 'Inzébi', 'Koulamoutou', 'Nzabi', 'Bassi'],
      'Myènè':  ['Mbolo', 'Ogula', 'Nkambé', 'Ivanga', 'Ombwiri', 'Ntang', 'Oruwa'],
      'Téké':   ['Mbolo', 'Iteké', 'Franceville', 'Batéké', 'Mpassa'],
      'Vili':   ['Mbolo', 'Icivili', 'Mayumba', 'Tchibanga'],
      'Obamba': ['Mbolo', 'Lembaama', 'Mpassa', 'Franceville'],
      'Guisir': ['Mbolo', 'Yigisir', 'Fougamou', 'Mouila', 'Ndendé'],
      'Kota':   ['Mbolo', 'Ikota', 'Makokou', 'Ogooué-Ivindo'],
      'Anglais':['Hello', 'Welcome', 'Thank you', 'Greetings', 'Peace']
    };
    const words = sampleGaboWords[targetLang] || sampleGaboWords['Fang'];
    const prefix = words[Math.floor(Math.random() * words.length)];
    return `${prefix} ${sourceText} (Traduction ${targetLang} — déployez sur Vercel pour la vraie IA)`;
  }

  // ── DICTIONNAIRE CRUD ────────────────────────────────────────────────────────

  async addDictionaryEntry(entry) {
    const saved = await window.DB.addDictionaryEntry(entry);
    this.dictionary.unshift(saved);
    return saved;
  }

  async deleteDictionaryEntry(id) {
    await window.DB.deleteDictionaryEntry(id);
    this.dictionary = this.dictionary.filter(item => item.id !== id);
  }

  // ── LANGUES CRUD ─────────────────────────────────────────────────────────────

  async addLanguage(lang) {
    const saved = await window.DB.addLanguage(lang);
    this.languages.push(saved);
    return saved;
  }

  async deleteLanguage(id) {
    await window.DB.deleteLanguage(id);
    this.languages = this.languages.filter(l => l.id !== id);
  }

  // ── EXPRESSIONS CRUD ─────────────────────────────────────────────────────────

  async addExpression(expr) {
    const saved = await window.DB.addExpression(expr);
    this.expressions.push(saved);
    return saved;
  }

  async deleteExpression(id) {
    await window.DB.deleteExpression(id);
    this.expressions = this.expressions.filter(e => e.id !== id);
  }

  // ── UTILISATEURS CRUD ────────────────────────────────────────────────────────

  async addUser(userObj) {
    const saved = await window.DB.addUser(userObj);
    this.usersList.push(saved);
    return saved;
  }

  async deleteUser(id) {
    await window.DB.deleteUser(id);
    this.usersList = this.usersList.filter(u => u.id !== id);
  }

  // ── AI SUGGESTIONS ───────────────────────────────────────────────────────────

  async updateAISuggestionStatus(id, status) {
    await window.DB.updateAISuggestionStatus(id, status);
    this.aiSuggestions = this.aiSuggestions.map(s => s.id === id ? { ...s, status } : s);
  }
}

window.Store = new AppStore();
