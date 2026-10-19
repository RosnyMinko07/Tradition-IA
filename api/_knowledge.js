/**
 * TRADITION IA — BASE DE CONNAISSANCES OFFICIELLE
 * =============================================================
 * Répertoire linguistique des langues et traditions du Gabon.
 *
 * Utilisé par :
 *  - api/chat.js (Prompt système et connaissances pour l'IA)
 *  - api/translate.js (Moteur de traduction exact et contextuel)
 *  - api/migrate.js (Initialisation MySQL)
 */

// ============================================================
// 1. LANGUES GABONAISES — RÉFÉRENCE NATIONALE
// ============================================================
const LANGUAGES_DATA = [
  {
    name: 'Fang',
    code: 'fan',
    nativeName: 'Fang-Beti',
    family: 'Bantoue du Nord-Ouest',
    region: 'Estuaire (Libreville), Woleu-Ntem (Oyem, Bitam), Ogooué-Ivindo (Makokou)',
    speakers: '~800 000 locuteurs',
    notes: 'Langue principale documentée. Tonale. Formes verbales, négations et comptage complet de 0 à 100.'
  },
  {
    name: 'Punu',
    code: 'puu',
    nativeName: 'Yipunu',
    family: 'Bantoue',
    region: 'Nyanga (Tchibanga), Ngounié (Mouila)',
    speakers: '~300 000 locuteurs',
    notes: "Vocabulaire en cours d'intégration progressive."
  },
  {
    name: 'Myènè',
    code: 'mye',
    nativeName: 'Omyènè',
    family: 'Bantoue',
    region: 'Port-Gentil, Lambaréné, Libreville',
    speakers: '~50 000 locuteurs',
    notes: "Vocabulaire en cours d'intégration progressive."
  },
  {
    name: 'Nzébi',
    code: 'nzb',
    nativeName: 'Inzébi',
    family: 'Bantoue',
    region: 'Ngounié, Ogooué-Lolo (Koulamoutou)',
    speakers: '~150 000 locuteurs',
    notes: "Vocabulaire en cours d'intégration progressive."
  },
  {
    name: 'Téké',
    code: 'tek',
    nativeName: 'Iteké',
    family: 'Bantoue',
    region: 'Haut-Ogooué (Franceville, Bongoville)',
    speakers: '~60 000 locuteurs',
    notes: "Vocabulaire en cours d'intégration progressive."
  },
  {
    name: 'Vili',
    code: 'vif',
    nativeName: 'Icivili',
    family: 'Bantoue',
    region: 'Nyanga (Mayumba)',
    speakers: '~30 000 locuteurs',
    notes: "Vocabulaire en cours d'intégration progressive."
  },
  {
    name: 'Obamba',
    code: 'obb',
    nativeName: 'Lembaama',
    family: 'Bantoue',
    region: 'Haut-Ogooué (Okondja)',
    speakers: '~40 000 locuteurs',
    notes: "Vocabulaire en cours d'intégration progressive."
  },
  {
    name: 'Guisir',
    code: 'gsi',
    nativeName: 'Yigisir',
    family: 'Bantoue',
    region: 'Ngounié (Fougamou, Mandji)',
    speakers: '~40 000 locuteurs',
    notes: "Vocabulaire en cours d'intégration progressive."
  },
  {
    name: 'Kota',
    code: 'kto',
    nativeName: 'Ikota',
    family: 'Bantoue',
    region: 'Ogooué-Ivindo (Makokou, Booué)',
    speakers: '~50 000 locuteurs',
    notes: "Vocabulaire en cours d'intégration progressive."
  }
];

// ============================================================
// 2. DICTIONNAIRE — MOTS ET NOMBRES ISSUS DE txt.txt
// ============================================================
const DICTIONARY_DATA = [
  // --- COMPTER EN FANG DE 0 À 100 (txt.txt) ---
  { fr: '0', fang: 'zeze', category: 'Chiffres' },
  { fr: 'Zéro', fang: 'zeze', category: 'Chiffres' },
  { fr: '1', fang: 'fog', category: 'Chiffres' },
  { fr: 'Un', fang: 'fog', category: 'Chiffres' },
  { fr: '2', fang: 'bê', category: 'Chiffres' },
  { fr: 'Deux', fang: 'bê', category: 'Chiffres' },
  { fr: '3', fang: 'lal', category: 'Chiffres' },
  { fr: 'Trois', fang: 'lal', category: 'Chiffres' },
  { fr: '4', fang: 'nî', category: 'Chiffres' },
  { fr: 'Quatre', fang: 'nî', category: 'Chiffres' },
  { fr: '5', fang: 'tan', category: 'Chiffres' },
  { fr: 'Cinq', fang: 'tan', category: 'Chiffres' },
  { fr: '6', fang: 'saman', category: 'Chiffres' },
  { fr: 'Six', fang: 'saman', category: 'Chiffres' },
  { fr: '7', fang: 'zanbgwal', category: 'Chiffres' },
  { fr: 'Sept', fang: 'zanbgwal', category: 'Chiffres' },
  { fr: '8', fang: 'môôm', category: 'Chiffres' },
  { fr: 'Huit', fang: 'môôm', category: 'Chiffres' },
  { fr: '9', fang: 'ébul', category: 'Chiffres' },
  { fr: 'Neuf', fang: 'ébul', category: 'Chiffres' },
  { fr: '10', fang: 'awôm', category: 'Chiffres' },
  { fr: 'Dix', fang: 'awôm', category: 'Chiffres' },
  { fr: '11', fang: 'awôm ye fog', category: 'Chiffres' },
  { fr: 'Onze', fang: 'awôm ye fog', category: 'Chiffres' },
  { fr: '12', fang: 'awôm ye bê', category: 'Chiffres' },
  { fr: 'Douze', fang: 'awôm ye bê', category: 'Chiffres' },
  { fr: '13', fang: 'awôm ye lal', category: 'Chiffres' },
  { fr: 'Treize', fang: 'awôm ye lal', category: 'Chiffres' },
  { fr: '14', fang: 'awôm ye nî', category: 'Chiffres' },
  { fr: 'Quatorze', fang: 'awôm ye nî', category: 'Chiffres' },
  { fr: '15', fang: 'awôm ye tan', category: 'Chiffres' },
  { fr: 'Quinze', fang: 'awôm ye tan', category: 'Chiffres' },
  { fr: '16', fang: 'awôm ye saman', category: 'Chiffres' },
  { fr: 'Seize', fang: 'awôm ye saman', category: 'Chiffres' },
  { fr: '17', fang: 'awôm ye zanbgwal', category: 'Chiffres' },
  { fr: 'Dix-sept', fang: 'awôm ye zanbgwal', category: 'Chiffres' },
  { fr: '18', fang: 'awôm ye môôm', category: 'Chiffres' },
  { fr: 'Dix-huit', fang: 'awôm ye môôm', category: 'Chiffres' },
  { fr: '19', fang: "awôm y'ébul", category: 'Chiffres' },
  { fr: 'Dix-neuf', fang: "awôm y'ébul", category: 'Chiffres' },
  { fr: '20', fang: 'mewôm mebê', category: 'Chiffres' },
  { fr: 'Vingt', fang: 'mewôm mebê', category: 'Chiffres' },
  { fr: '21', fang: 'mewôm mebê ye fog', category: 'Chiffres' },
  { fr: 'Vingt-et-un', fang: 'mewôm mebê ye fog', category: 'Chiffres' },
  { fr: '30', fang: 'mewôm melal', category: 'Chiffres' },
  { fr: 'Trente', fang: 'mewôm melal', category: 'Chiffres' },
  { fr: '31', fang: 'mewôm melal ya fog', category: 'Chiffres' },
  { fr: 'Trente-et-un', fang: 'mewôm melal ya fog', category: 'Chiffres' },
  { fr: '40', fang: 'mewôm menî', category: 'Chiffres' },
  { fr: 'Quarante', fang: 'mewôm menî', category: 'Chiffres' },
  { fr: '50', fang: 'mewôm metan', category: 'Chiffres' },
  { fr: 'Cinquante', fang: 'mewôm metan', category: 'Chiffres' },
  { fr: '60', fang: 'mewôm mesaman', category: 'Chiffres' },
  { fr: 'Soixante', fang: 'mewôm mesaman', category: 'Chiffres' },
  { fr: '70', fang: 'mewôm zanbgwal', category: 'Chiffres' },
  { fr: 'Soixante-dix', fang: 'mewôm zanbgwal', category: 'Chiffres' },
  { fr: '80', fang: 'mewôm môôm', category: 'Chiffres' },
  { fr: 'Quatre-vingts', fang: 'mewôm môôm', category: 'Chiffres' },
  { fr: '90', fang: 'mewôm ébul', category: 'Chiffres' },
  { fr: 'Quatre-vingt-dix', fang: 'mewôm ébul', category: 'Chiffres' },
  { fr: '100', fang: 'ntet', category: 'Chiffres' },
  { fr: 'Cent', fang: 'ntet', category: 'Chiffres' },

  // --- VOCABULAIRE & MOTS CLÉS (txt.txt) ---
  { fr: 'Bonjour', fang: 'Mbôlô', category: 'Salutations' },
  { fr: 'Merci', fang: 'Akiba', category: 'Politesse' },
  { fr: 'Parler', fang: 'kobe', category: 'Verbes' },
  { fr: 'Nourriture', fang: 'bidzi', category: 'Alimentation' },
  { fr: 'Arachides', fang: 'Owone', category: 'Alimentation' },
  { fr: 'Problèmes', fang: 'Bitome', category: 'Général' },
  { fr: 'Argent', fang: 'miang', category: 'Économie' },
  { fr: 'Temps', fang: 'Eyong', category: 'Temps' },
  { fr: 'Travail', fang: 'ésè', category: 'Travail' },
  { fr: 'Enfant', fang: 'émo', category: 'Famille' },
  { fr: 'Frère', fang: 'monenyang', category: 'Famille' },
  { fr: 'Frères', fang: 'bobenyang', category: 'Famille' },
  { fr: 'Fille', fang: "ngo'", category: 'Famille' },
  { fr: 'Âge (années)', fang: 'mimbu', category: 'Général' },
  { fr: 'Chance', fang: 'mvôm', category: 'Général' },
  { fr: 'Faim', fang: 'zon', category: 'Besoins' },
  { fr: 'Exactement', fang: 'Dza feh', category: 'Expressions' }
];

// ============================================================
// 3. PHRASES ET EXPRESSIONS ISSUES EXCLUSIVEMENT DE txt.txt
// ============================================================
const PHRASES_DATA = [
  // --- NÉGATIONS EN FANG (txt.txt) ---
  { fr: "Je n'ai pas de temps", fang: 'Me bele ki Eyong', context: 'Négation / Temps' },
  { fr: "Je n'ai pas temps", fang: 'Me bele ki Eyong', context: 'Négation / Temps' },
  { fr: "Je n'ai pas d'argent", fang: 'Me bele ki miang', context: 'Négation / Argent' },
  { fr: "Je n'ai pas fini", fang: 'Me bele mane', context: 'Négation / Action' },
  { fr: "Je n'ai pas vu", fang: 'Me dzi yene', context: 'Négation / Perception' },
  { fr: "Je n'ai pas de chance", fang: 'Me belé mvôm', context: 'Négation / Chance' },
  { fr: "Je n'ai pas entendu", fang: 'Me dzi wok', context: 'Négation / Ouïe' },
  { fr: "Je n'ai pas réussi", fang: 'Me dzi dengh', context: 'Négation / Réussite' },
  { fr: "Je n'ai pas voulu", fang: 'Ma dzi kume', context: 'Négation / Volonté' },
  { fr: "Je n'ai pas fait", fang: 'Me dzi boh', context: 'Négation / Action' },
  { fr: "Je n'ai pas compris", fang: 'Me dzi bee', context: 'Négation / Compréhension' },
  { fr: "Je n'ai pas reçu", fang: 'Me dzi dengh', context: 'Négation / Réception' },
  { fr: "Je n'ai pas mangé", fang: 'Me dzi dzi', context: 'Négation / Nourriture' },
  { fr: "Je n'ai pas besoin", fang: 'Maa yi ki', context: 'Négation / Besoin' },
  { fr: "Je n'ai pas faim", fang: 'Ma wok ki zon', context: 'Négation / Faim' },
  { fr: "Je ne peux pas", fang: 'Ma se ki bo', context: 'Négation / Capacité' },

  // --- PRÉSENTATION ET CONVERSATION (txt.txt) ---
  { fr: 'Voici mon enfant', fang: 'Émo wom ényenyi', context: 'Présentation' },
  { fr: "Comment s'appelle-t-il ?", fang: "A n'éwula ya ?", context: 'Présentation' },
  { fr: "Il s'appelle Obiang", fang: "A n'éwula nâ Obiang", context: 'Présentation' },
  { fr: 'Il a quel âge ?', fang: 'A bele mimbu tang ?', context: 'Présentation' },
  { fr: 'Il a cinq ans', fang: 'A bele mimbu mitan', context: 'Présentation' },
  { fr: "Elle, c'est ta fille ?", fang: "Ye ngo' dzüè édzalé ?", context: 'Présentation' },
  { fr: "Oui. Elle s'appelle Ada", fang: "Huh-huh. A n'éwula na Ada", context: 'Présentation' },
  { fr: 'Elle a quatre ans', fang: 'A bele mimbu minign', context: 'Présentation' },
  { fr: 'Tu as combien de frères ?', fang: 'Ô bele monenyang tang ya ?', context: 'Famille' },
  { fr: "J'ai deux frères", fang: 'Me bele bobenyang bebegn', context: 'Famille' },
  { fr: 'Je fais mon travail', fang: "Ma bo ésè' dzam", context: 'Travail' },
  { fr: 'Je veux te demander quelque chose', fang: "Ma kumu wa'a sili dzôm", context: 'Demande' },
  { fr: "Je veux t'emprunter de l'argent", fang: 'Ma yi nâ ô kôlô miang', context: 'Argent' },

  // --- SALUTATIONS & QUOTIDIEN (txt.txt) ---
  { fr: 'Bonjour', fang: 'Mbôlô', context: 'Salutation' },
  { fr: 'Oui, bonjour', fang: 'Ae mbôlô', context: 'Salutation' },
  { fr: 'Comment tu vas ?', fang: "Y'ô ne mvë ?", context: 'Salutation' },
  { fr: 'Où vas-tu ?', fang: 'Wa ke vé ?', context: 'Question quotidienne' },
  { fr: 'Tu vas où ?', fang: 'wa ke veh ?', context: 'Question quotidienne' },
  { fr: 'Je vais au travail. Au revoir.', fang: 'Ma ke ésèn. Me kang', context: 'Départ' },
  { fr: 'Oui. À la prochaine !', fang: 'Huh-huh, nto ve éyong fe', context: 'Au revoir' },
  { fr: 'Merci', fang: 'Akiba', context: 'Politesse' },

  // --- ACTIONS ET SENTIMENTS / PARLONS FANG (txt.txt) ---
  { fr: 'Il me provoque', fang: 'A song ma', context: 'Action' },
  { fr: 'Il me suit', fang: 'A tông ma', context: 'Action' },
  { fr: 'Il me respecte', fang: 'A kang ma', context: 'Sentiment' },
  { fr: 'Il me cherche', fang: 'A dzeng ma', context: 'Action' },
  { fr: 'Il me comprend', fang: 'A wôkh ma', context: 'Compréhension' },
  { fr: "Il m'accuse", fang: 'Atsini ma', context: 'Action' },
  { fr: "Il m'insulte", fang: 'Ata ma', context: 'Action' },
  { fr: "Il m'appelle", fang: 'A lëè ma', context: 'Communication' },

  // --- CE QUE JE VEUX / VOLONTÉ (txt.txt) ---
  { fr: 'Je veux manger', fang: "Ma kum'a dzi", context: 'Volonté' },
  { fr: 'Je veux boire', fang: "Ma kum'a nyu", context: 'Volonté' },
  { fr: 'Je veux venir', fang: "Ma kum'a nzu", context: 'Volonté' },
  { fr: 'Je veux danser', fang: "Ma kum'a dzem", context: 'Volonté' },
  { fr: 'Je veux voir', fang: "Ma kum'ayén", context: 'Volonté' },
  { fr: 'Et toi ?', fang: 'Et wa ?', context: 'Question' },
  { fr: 'Je veux partir', fang: 'Ma kume ke', context: 'Volonté' },
  { fr: 'Je veux dormir', fang: 'Ma kume koyoh', context: 'Volonté' },

  // --- L'IMPÉRATIF NÉGATIF (txt.txt) ---
  { fr: 'Ne mange pas', fang: 'Ô tagha a dzi', context: 'Impératif négatif' },
  { fr: 'Ne bois pas', fang: 'Ô tagha a nyu', context: 'Impératif négatif' },
  { fr: 'Ne parle pas', fang: 'Ô tagha a kobe', context: 'Impératif négatif' },
  { fr: 'Ne viens pas', fang: 'Ô tagha a zu', context: 'Impératif négatif' },
  { fr: 'Ne touche pas', fang: 'Ô tagha a name', context: 'Impératif négatif' },
  { fr: 'Ne pars pas', fang: 'Ô tagha a ke', context: 'Impératif négatif' },
  { fr: 'Ne crie pas', fang: 'Ô tagha a wënan', context: 'Impératif négatif' },
  { fr: 'Ne bouge pas', fang: 'Ô tagha a funghane', context: 'Impératif négatif' },
  { fr: 'Ne fais pas', fang: 'Ô tagha a bo', context: 'Impératif négatif' },
  { fr: "Ne t'assois pas", fang: 'Ô tagha a tobe ô si', context: 'Impératif négatif' },
  { fr: "Ne m'embête pas", fang: "Ô tagha m'a ndeghele", context: 'Impératif négatif' },
  { fr: "Ne me regarde pas", fang: "Ô tagha m'a dorh", context: 'Impératif négatif' },
  { fr: 'Ne me provoque pas', fang: "Ô tagha m'a song", context: 'Impératif négatif' },
  { fr: 'Ne me pousse pas', fang: "Ô tagha m'a sôghô", context: 'Impératif négatif' },
  { fr: "Ne m'insulte pas", fang: "Ô tagha m'a tà", context: 'Impératif négatif' },

  // --- EXPRESSIONS FAMILIÈRES ET VIE QUOTIDIENNE (txt.txt) ---
  { fr: 'Fiche-moi la paix', fang: 'Korgh me mïs', context: 'Expression familière' },
  { fr: 'Fiche moi la paix', fang: 'Korgh me mïs', context: 'Expression familière' },
  { fr: "Ça m'est égal", fang: 'Maa bïs', context: 'Expression familière' },
  { fr: "Ca m'est égale", fang: 'Maa bïs', context: 'Expression familière' },
  { fr: 'Exactement', fang: 'Dza feh', context: 'Affirmation' },
  { fr: 'Laisse-moi', fang: 'zame mah', context: 'Demande' },
  { fr: 'Laisse moi', fang: 'zame mah', context: 'Demande' },
  { fr: 'Je suis là', fang: 'Me ne va', context: 'Localisation' },
  { fr: 'Je suis la', fang: 'Me ne va', context: 'Localisation' },
  { fr: 'Je suis ici', fang: 'Ma gni', context: 'Localisation' },
  { fr: "J'attends", fang: 'Ma yan', context: 'Action' },
  { fr: "J'attend", fang: 'Ma yan', context: 'Action' },
  { fr: 'Je parle le fang', fang: 'Ma kobe fang', context: 'Langue' },
  { fr: "J'aime manger", fang: 'Ma gnore dzi', context: 'Goût' },
  { fr: 'Je fais', fang: 'Ma boh', context: 'Action' },
  { fr: "Je t'aime", fang: 'Ma dzime wah', nzebi: 'Ni gu tondi', punu: 'Ni ku tondi', myene: 'Mi tondi we', teke: 'Ni kwo zoli', context: 'Sentiment' },
  { fr: "Je taime", fang: 'Ma dzime wah', nzebi: 'Ni gu tondi', punu: 'Ni ku tondi', myene: 'Mi tondi we', teke: 'Ni kwo zoli', context: 'Sentiment' },
  { fr: 'Ne peux pas', fang: 'Ma se ki bo', context: 'Négation / Capacité' },
  { fr: 'Ne me provoque', fang: "Ô tagha m'a song", context: 'Impératif négatif' },
  { fr: "Ne t'assieds pas", fang: 'Ô tagha a tobe ô si', context: 'Impératif négatif' },
  { fr: "Ne tassois pas", fang: 'Ô tagha a tobe ô si', context: 'Impératif négatif' }
];

// ============================================================
// 4. NOTES GRAMMATICALES ET RÈGLES FANG
// ============================================================
const GRAMMAR_NOTES = `
RÈGLES LINGUISTIQUES FANG FONDAMENTALES :
1. COMPTER EN FANG (0 À 100) :
   - 0: zeze, 1: fog, 2: bê, 3: lal, 4: nî, 5: tan, 6: saman, 7: zanbgwal, 8: môôm, 9: ébul, 10: awôm
   - 11 à 19 : awôm ye + unité (ex: 11: awôm ye fog, 12: awôm ye bê, 19: awôm y'ébul)
   - Dizaines : 20: mewôm mebê, 30: mewôm melal, 40: mewôm menî, 50: mewôm metan, 60: mewôm mesaman, 70: mewôm zanbgwal, 80: mewôm môôm, 90: mewôm ébul
   - 100 : ntet

2. STRUCTURE DE LA NÉGATION :
   - Négation d'état / possession : "Me bele ki..." (ex: "Me bele ki miang" = Je n'ai pas d'argent, "Me bele ki Eyong" = Je n'ai pas de temps)
   - Négation d'action passée : "Me dzi..." (ex: "Me dzi yene" = Je n'ai pas vu, "Me dzi wok" = Je n'ai pas entendu, "Me dzi dzi" = Je n'ai pas mangé)
   - Négation de volonté : "Ma dzi kume" = Je n'ai pas voulu
   - Négation de sensation : "Ma wok ki zon" = Je n'ai pas faim
   - Négation de capacité : "Ma se ki bo" = Je ne peux pas

3. L'IMPÉRATIF NÉGATIF :
   - Forme générale : "Ô tagha a + verbe" (ex: "Ô tagha a dzi" = Ne mange pas, "Ô tagha a nyu" = Ne bois pas, "Ô tagha a kobe" = Ne parle pas)
   - Forme pronominale "Ne me... pas" : "Ô tagha m'a + verbe" (ex: "Ô tagha m'a ndeghele" = Ne m'embête pas, "Ô tagha m'a song" = Ne me provoque pas, "Ô tagha m'a sôghô" = Ne me pousse pas, "Ô tagha m'a tà" = Ne m'insulte pas)

4. L'EXPRESSION DE LA VOLONTÉ ("JE VEUX...") :
   - "Ma kum'a..." : "Ma kum'a dzi" (Je veux manger), "Ma kum'a nyu" (Je veux boire), "Ma kum'a nzu" (Je veux venir), "Ma kum'a dzem" (Je veux danser), "Ma kum'ayén" (Je veux voir)
`;

// ============================================================
// 5. PROMPT SYSTÈME ENRICHI POUR L'ASSISTANT IA
// ============================================================
function buildSystemPrompt(mode = 'chat') {
  const dictList = DICTIONARY_DATA.map(d => `- "${d.fr}" → Fang: "${d.fang}" [${d.category}]`).join('\n');
  const phrasesList = PHRASES_DATA.map(p => `- "${p.fr}" → Fang: "${p.fang}" (${p.context})`).join('\n');

  return `Tu es TRADITION IA, l'intelligence artificielle gardienne des traditions et langues du Gabon 🇬🇦.

RÈGLES ABSOLUES :
1. Réponds toujours avec précision, clarté et bienveillance en tant qu'expert linguistique et culturel gabonais.
2. RÈGLE STRICTE : Ne mentionne JAMAIS de nom de fichier technique (interdiction totale de citer "txt.txt", "fichier source", "_knowledge.js", etc.). Ne divulgue jamais tes sources de données internes.
3. Pour les chiffres en Fang, utilise fidèlement la numération authentique de 0 à 100 (zeze, fog, bê, lal, nî, tan, saman, zanbgwal, môôm, ébul, awôm, mewôm, ntet).
4. Pour les négations et impératifs en Fang, respecte rigoureusement les formes traditionnelles ("Me bele ki...", "Me dzi...", "Ô tagha a...", "Ô tagha m'a...").
5. Si on te demande une traduction vers l'Anglais, le Français ou une langue locale, fournis directement le résultat traduit de manière naturelle, sans préciser de détails techniques sur la méthode ou le modèle.

DICTIONNAIRE DE RÉFÉRENCE :
${dictList}

PHRASES & DIALOGUES DU QUOTIDIEN :
${phrasesList}

${GRAMMAR_NOTES}
`;
}

module.exports = {
  buildSystemPrompt,
  LANGUAGES_DATA,
  DICTIONARY_DATA,
  PHRASES_DATA,
  GRAMMAR_NOTES
};
