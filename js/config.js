/**
 * TRADITION IA - CONFIGURATION & CONSTANTS
 * Universal script compatible with file:// protocol and http:// servers
 */

window.CONFIG = {
  APP_NAME: 'Tradition IA',
  VERSION: '1.0.0',
  DEFAULT_SUPABASE_URL: '',
  DEFAULT_SUPABASE_ANON_KEY: '',
  STORAGE_KEYS: {
    SUPABASE_URL: 'tradition_ia_supabase_url',
    SUPABASE_KEY: 'tradition_ia_supabase_key',
    USER: 'tradition_ia_user',
    LANGUAGES: 'tradition_ia_languages',
    DICTIONARY: 'tradition_ia_dictionary',
    TRANSLATIONS: 'tradition_ia_translations',
    EXPRESSIONS: 'tradition_ia_expressions',
    AI_SUGGESTIONS: 'tradition_ia_suggestions',
    CHAT_HISTORY: 'tradition_ia_chat',
    USERS_LIST: 'tradition_ia_users_list'
  }
};

window.MOCK_LANGUAGES = [
  { id: '1', name: 'Fang', code: 'fan', nativeName: 'Fang', description: 'Langue parlée par le peuple Fang (Estuaire, Woleu-Ntem, Ogooué-Ivindo)', wordCount: 1250, speakers: '800 000' },
  { id: '2', name: 'Punu', code: 'puu', nativeName: 'Punu', description: 'Langue parlée au Sud du Gabon (Nyanga, Ngounié, Tchibanga)', wordCount: 760, speakers: '300 000' },
  { id: '3', name: 'Nzébi', code: 'nzb', nativeName: 'Nzébi', description: 'Langue parlée au Sud et au Centre du Gabon (Ngounié, Ogooué-Lolo, Koulamoutou)', wordCount: 620, speakers: '150 000' },
  { id: '4', name: 'Myènè', code: 'mye', nativeName: 'Myènè', description: 'Langue littorale du Gabon (Port-Gentil, Lambaréné, Libreville)', wordCount: 890, speakers: '50 000' },
  { id: '5', name: 'Téké', code: 'tek', nativeName: 'Téké', description: 'Langue parlée dans le Sud-Est du Gabon (Haut-Ogooué, Franceville)', wordCount: 580, speakers: '140 000' },
  { id: '6', name: 'Vili', code: 'vif', nativeName: 'Vili', description: 'Langue parlée sur la côte sud (Mayumba et zone frontalière)', wordCount: 320, speakers: '35 000' },
  { id: '7', name: 'Obamba', code: 'obb', nativeName: 'Obamba', description: 'Langue parlée à Franceville, Moanda et le Haut-Ogooué', wordCount: 380, speakers: '90 000' },
  { id: '8', name: 'Guisir', code: 'gsi', nativeName: 'Guisir', description: 'Langue parlée dans la Ngounié (Fougamou, Mouila, Ndendé)', wordCount: 450, speakers: '60 000' },
  { id: '9', name: 'Kota', code: 'kto', nativeName: 'Kota', description: 'Langue parlée dans l\'Ogooué-Ivindo (Makokou) et le Haut-Ogooué', wordCount: 410, speakers: '45 000' },
  { id: '10', name: 'Anglais', code: 'eng', nativeName: 'Anglais', description: 'Langue internationale et commerciale', wordCount: 950, speakers: '1 500 000 000' }
];

// Le dictionnaire et les traductions proviennent désormais exclusivement de la base de données MySQL (276 mots réels)
window.MOCK_DICTIONARY = [];

// Expressions officielles issues de txt.txt
window.MOCK_EXPRESSIONS = [
  { id: '1', phrase: "Je n'ai pas de temps", translation: 'Me bele ki Eyong', sourceLang: 'Français', targetLang: 'Fang', context: 'Négation / Temps', isValidated: true },
  { id: '2', phrase: "Je n'ai pas d'argent", translation: 'Me bele ki miang', sourceLang: 'Français', targetLang: 'Fang', context: 'Négation / Argent', isValidated: true },
  { id: '3', phrase: "Je n'ai pas fini", translation: 'Me bele mane', sourceLang: 'Français', targetLang: 'Fang', context: 'Négation / Action', isValidated: true },
  { id: '4', phrase: "Je n'ai pas vu", translation: 'Me dzi yene', sourceLang: 'Français', targetLang: 'Fang', context: 'Négation / Perception', isValidated: true },
  { id: '5', phrase: "Je n'ai pas de chance", translation: 'Me belé mvôm', sourceLang: 'Français', targetLang: 'Fang', context: 'Négation / Chance', isValidated: true },
  { id: '6', phrase: "Je n'ai pas entendu", translation: 'Me dzi wok', sourceLang: 'Français', targetLang: 'Fang', context: 'Négation / Ouïe', isValidated: true },
  { id: '7', phrase: "Je n'ai pas réussi", translation: 'Me dzi dengh', sourceLang: 'Français', targetLang: 'Fang', context: 'Négation / Réussite', isValidated: true },
  { id: '8', phrase: "Voici mon enfant", translation: 'Émo wom ényenyi', sourceLang: 'Français', targetLang: 'Fang', context: 'Présentation', isValidated: true },
  { id: '9', phrase: "Comment s'appelle-t-il ?", translation: "A n'éwula ya ?", sourceLang: 'Français', targetLang: 'Fang', context: 'Présentation', isValidated: true },
  { id: '10', phrase: "Il s'appelle Obiang", translation: "A n'éwula nâ Obiang", sourceLang: 'Français', targetLang: 'Fang', context: 'Présentation', isValidated: true },
  { id: '11', phrase: "Il a quel âge ?", translation: 'A bele mimbu tang ?', sourceLang: 'Français', targetLang: 'Fang', context: 'Présentation', isValidated: true },
  { id: '12', phrase: "Il a cinq ans", translation: 'A bele mimbu mitan', sourceLang: 'Français', targetLang: 'Fang', context: 'Présentation', isValidated: true },
  { id: '13', phrase: "Tu as combien de frères ?", translation: 'Ô bele monenyang tang ya ?', sourceLang: 'Français', targetLang: 'Fang', context: 'Famille', isValidated: true },
  { id: '14', phrase: "J'ai deux frères", translation: 'Me bele bobenyang bebegn', sourceLang: 'Français', targetLang: 'Fang', context: 'Famille', isValidated: true },
  { id: '15', phrase: "Je veux manger", translation: "Ma kum'a dzi", sourceLang: 'Français', targetLang: 'Fang', context: 'Volonté', isValidated: true },
  { id: '16', phrase: "Je veux boire", translation: "Ma kum'a nyu", sourceLang: 'Français', targetLang: 'Fang', context: 'Volonté', isValidated: true },
  { id: '17', phrase: "Ne m'embête pas", translation: "Ô tagha m'a ndeghele", sourceLang: 'Français', targetLang: 'Fang', context: 'Impératif négatif', isValidated: true },
  { id: '18', phrase: "Fiche-moi la paix", translation: 'Korgh me mïs', sourceLang: 'Français', targetLang: 'Fang', context: 'Expression familière', isValidated: true },
  { id: '19', phrase: "Ça m'est égal", translation: 'Maa bïs', sourceLang: 'Français', targetLang: 'Fang', context: 'Expression familière', isValidated: true },
  { id: '20', phrase: "Je parle le fang", translation: 'Ma kobe fang', sourceLang: 'Français', targetLang: 'Fang', context: 'Langue', isValidated: true }
];

window.MOCK_AI_SUGGESTIONS = [
  { id: '1', sourceText: 'Le fleuve Ogooué est majestueux', suggestedTranslation: 'Ogooué mi ntang', sourceLang: 'Français', targetLang: 'Fang', confidence: 0.92, status: 'pending', createdAt: '2026-08-01' },
  { id: '2', sourceText: 'Les masques traditionnels gabonais', suggestedTranslation: 'Ekongo eyenga', sourceLang: 'Français', targetLang: 'Fang', confidence: 0.87, status: 'pending', createdAt: '2026-08-02' },
  { id: '3', sourceText: 'La forêt équatoriale du Gabon', suggestedTranslation: 'Nkogo mi Gabon', sourceLang: 'Français', targetLang: 'Fang', confidence: 0.78, status: 'pending', createdAt: '2026-08-03' },
  { id: '4', sourceText: 'Bienvenue dans notre village', suggestedTranslation: 'Mbolo na ivanga', sourceLang: 'Français', targetLang: 'Myènè', confidence: 0.95, status: 'accepted', createdAt: '2026-08-04' }
];

window.MOCK_TRANSLATIONS = [];

window.MOCK_USERS = [
  { id: '1', name: 'Administrateur Gabon', email: 'admin@tradition.ga', role: 'admin', joinedAt: '2026-01-10', status: 'Actif' },
  { id: '2', name: 'Jean-Marc Nzeng', email: 'user@tradition.ga', role: 'user', joinedAt: '2026-03-15', status: 'Actif' },
  { id: '3', name: 'Sylvie Mba', email: 'sylvie.mba@mail.ga', role: 'user', joinedAt: '2026-05-20', status: 'Actif' },
  { id: '4', name: 'Paul Ogandaga', email: 'paul.ogandaga@mail.ga', role: 'user', joinedAt: '2026-06-02', status: 'Inactif' }
];
