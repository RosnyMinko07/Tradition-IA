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
  { id: '1', name: 'Fang', code: 'fan', nativeName: 'Fang-Beti', description: 'Langue parlée par le peuple Fang (Estuaire, Woleu-Ntem, Ogooué-Ivindo)', wordCount: 1250, speakers: '800 000' },
  { id: '2', name: 'Punu', code: 'puu', nativeName: 'Yipunu', description: 'Langue parlée au Sud du Gabon (Nyanga, Ngounié, Tchibanga)', wordCount: 760, speakers: '300 000' },
  { id: '3', name: 'Nzébi', code: 'nzb', nativeName: 'Inzébi', description: 'Langue parlée au Sud et au Centre du Gabon (Ngounié, Ogooué-Lolo, Koulamoutou)', wordCount: 620, speakers: '150 000' },
  { id: '4', name: 'Myènè', code: 'mye', nativeName: 'Omyènè', description: 'Langue littorale du Gabon (Port-Gentil, Lambaréné, Libreville)', wordCount: 890, speakers: '50 000' },
  { id: '5', name: 'Téké', code: 'tek', nativeName: 'Iteké', description: 'Langue parlée dans le Sud-Est du Gabon (Haut-Ogooué, Franceville)', wordCount: 580, speakers: '140 000' },
  { id: '6', name: 'Vili', code: 'vif', nativeName: 'Icivili', description: 'Langue parlée sur la côte sud (Mayumba et zone frontalière)', wordCount: 320, speakers: '35 000' },
  { id: '7', name: 'Obamba', code: 'obb', nativeName: 'Lembaama', description: 'Langue parlée à Franceville, Moanda et le Haut-Ogooué', wordCount: 380, speakers: '90 000' },
  { id: '8', name: 'Guisir', code: 'gsi', nativeName: 'Yigisir', description: 'Langue parlée dans la Ngounié (Fougamou, Mouila, Ndendé)', wordCount: 450, speakers: '60 000' },
  { id: '9', name: 'Kota', code: 'kto', nativeName: 'Ikota', description: 'Langue parlée dans l\'Ogooué-Ivindo (Makokou) et le Haut-Ogooué', wordCount: 410, speakers: '45 000' },
  { id: '10', name: 'Anglais', code: 'eng', nativeName: 'English', description: 'Langue internationale (English)', wordCount: 2500, speakers: '1.5 milliard' }
];

window.MOCK_DICTIONARY = [
  { id: '1', word: 'Bonjour', translation: 'Mbolo', sourceLang: 'Français', targetLang: 'Fang', category: 'Salutations', example: 'Mbolo mi neng (Bonjour comment vas-tu)' },
  { id: '2', word: 'Merci', translation: 'Akiba', sourceLang: 'Français', targetLang: 'Fang', category: 'Expressions', example: 'Akiba mon ami pour ton aide' },
  { id: '3', word: 'Eau', translation: 'Owusu', sourceLang: 'Français', targetLang: 'Fang', category: 'Nourriture', example: 'Je veux boire de l\'owusu' },
  { id: '4', word: 'Bonjour', translation: 'Mbolo', sourceLang: 'Français', targetLang: 'Myènè', category: 'Salutations', example: 'Mbolo ami d\'enfance' },
  { id: '5', word: 'Femme', translation: 'Biké', sourceLang: 'Français', targetLang: 'Punu', category: 'Personnes', example: 'La biké prépare le repas traditionnel' },
  { id: '6', word: 'Maison', translation: 'Ntang', sourceLang: 'Français', targetLang: 'Myènè', category: 'Lieux', example: 'Mon ntang est situé au bord du fleuve' },
  { id: '7', word: 'Arbre', translation: 'Nkogo', sourceLang: 'Français', targetLang: 'Fang', category: 'Nature', example: 'Le grand nkogo dans la forêt équatoriale' },
  { id: '8', word: 'Merci', translation: 'Yine', sourceLang: 'Français', targetLang: 'Punu', category: 'Expressions', example: 'Yine moke pour ce présent' },
  { id: '9', word: 'Merci', translation: 'Ogula', sourceLang: 'Français', targetLang: 'Myènè', category: 'Expressions', example: 'Ogula va imwè' },
  { id: '10', word: 'Bonjour', translation: 'Mbolo', sourceLang: 'Français', targetLang: 'Guisir', category: 'Salutations', example: 'Mbolo na biani (Bonjour tout le monde)' },
  { id: '11', word: 'Bonjour', translation: 'Mbolo', sourceLang: 'Français', targetLang: 'Kota', category: 'Salutations', example: 'Mbolo ma mba (Bonjour mon ami)' },
  { id: '12', word: 'Bonjour', translation: 'Hello', sourceLang: 'Français', targetLang: 'Anglais', category: 'Salutations', example: 'Hello my friend' },
  { id: '13', word: 'Merci', translation: 'Thank you', sourceLang: 'Français', targetLang: 'Anglais', category: 'Expressions', example: 'Thank you very much' }
];

window.MOCK_EXPRESSIONS = [
  { id: '1', phrase: 'Comment allez-vous ?', translation: 'Mbolo mi neng ?', sourceLang: 'Français', targetLang: 'Fang', context: 'Salutation formelle' },
  { id: '2', phrase: 'Bienvenue au Gabon', translation: 'Mbolo ma Gabon', sourceLang: 'Français', targetLang: 'Fang', context: 'Accueil de visiteurs' },
  { id: '3', phrase: 'Je vous remercie sincèrement', translation: 'Akiba mi neng', sourceLang: 'Français', targetLang: 'Fang', context: 'Politesse' },
  { id: '4', phrase: 'Bonne journée', translation: 'Mbote moke', sourceLang: 'Français', targetLang: 'Punu', context: 'Au revoir' },
  { id: '5', phrase: 'Où allez-vous ?', translation: 'Nka ve ?', sourceLang: 'Français', targetLang: 'Myènè', context: 'Question quotidienne' },
  { id: '6', phrase: 'Comment vas-tu ?', translation: 'Mbolo, o di bueni ?', sourceLang: 'Français', targetLang: 'Guisir', context: 'Salutation quotidienne' },
  { id: '7', phrase: 'Bienvenue mon ami', translation: 'Mbolo nzo ma', sourceLang: 'Français', targetLang: 'Kota', context: 'Accueil' },
  { id: '8', phrase: 'Comment allez-vous ?', translation: 'How are you ?', sourceLang: 'Français', targetLang: 'Anglais', context: 'Salutation' }
];

window.MOCK_AI_SUGGESTIONS = [
  { id: '1', sourceText: 'Le fleuve Ogooué est majestueux', suggestedTranslation: 'Ogooué mi ntang', sourceLang: 'Français', targetLang: 'Fang', confidence: 0.92, status: 'pending', createdAt: '2026-08-01' },
  { id: '2', sourceText: 'Les masques traditionnels gabonais', suggestedTranslation: 'Ekongo eyenga', sourceLang: 'Français', targetLang: 'Fang', confidence: 0.87, status: 'pending', createdAt: '2026-08-02' },
  { id: '3', sourceText: 'La forêt équatoriale du Gabon', suggestedTranslation: 'Nkogo mi Gabon', sourceLang: 'Français', targetLang: 'Fang', confidence: 0.78, status: 'pending', createdAt: '2026-08-03' },
  { id: '4', sourceText: 'Bienvenue dans notre village', suggestedTranslation: 'Mbolo na ivanga', sourceLang: 'Français', targetLang: 'Myènè', confidence: 0.95, status: 'accepted', createdAt: '2026-08-04' }
];

window.MOCK_TRANSLATIONS = [
  { id: '1', sourceText: 'Bonjour, comment allez-vous ?', translatedText: 'Mbolo, mi neng ?', sourceLang: 'Français', targetLang: 'Fang', createdAt: '2026-08-05 10:30', isAI: false },
  { id: '2', sourceText: 'Merci beaucoup mon cher ami', translatedText: 'Akiba mi neng mon ami', sourceLang: 'Français', targetLang: 'Fang', createdAt: '2026-08-06 14:15', isAI: false },
  { id: '3', sourceText: 'Bienvenue à Libreville', translatedText: 'Mbolo ma Libreville (Traduction Punu)', sourceLang: 'Français', targetLang: 'Punu', createdAt: '2026-08-07 09:12', isAI: true }
];

window.MOCK_USERS = [
  { id: '1', name: 'Administrateur Gabon', email: 'admin@tradition.ga', role: 'admin', joinedAt: '2026-01-10', status: 'Actif' },
  { id: '2', name: 'Jean-Marc Nzeng', email: 'user@tradition.ga', role: 'user', joinedAt: '2026-03-15', status: 'Actif' },
  { id: '3', name: 'Sylvie Mba', email: 'sylvie.mba@mail.ga', role: 'user', joinedAt: '2026-05-20', status: 'Actif' },
  { id: '4', name: 'Paul Ogandaga', email: 'paul.ogandaga@mail.ga', role: 'user', joinedAt: '2026-06-02', status: 'Inactif' }
];
