/**
 * TRADITION IA — BASE DE CONNAISSANCES DES LANGUES GABONAISES
 * =============================================================
 * Ce fichier est le "cerveau linguistique" de l'IA.
 * Il ne s'agit PAS d'un entraînement de machine learning classique,
 * mais d'un PROMPT SYSTÈME riche qui est envoyé à l'IA à chaque requête.
 * L'IA lit ce contexte et répond en connaissant les langues gabonaises.
 *
 * Pour ENRICHIR les connaissances de l'IA :
 * → Ajoutez des MOTS dans DICTIONARY_DATA       (ex: { fr: 'Forêt', fang: 'Afan', ... })
 * → Ajoutez des PHRASES dans PHRASES_DATA        (ex: { fr: 'Je vais au marché', fang: 'Ma ke mabè', ... })
 * → Ajoutez des PROVERBES dans PHRASES_DATA      (ex: { type: 'proverbe', fr: '...', fang: '...', sens: '...' })
 * → Ajoutez des DIALOGUES dans PHRASES_DATA      (ex: { type: 'dialogue', context: 'Marché', ... })
 * → Ajoutez des règles grammaticales dans GRAMMAR_NOTES (texte libre)
 * → L'IA utilisera automatiquement tout ce contexte dans ses réponses.
 *
 * Utilisé par : api/chat.js et api/translate.js
 */

// ============================================================
// 1. LANGUES GABONAISES — DESCRIPTIONS
// ============================================================
const LANGUAGES_DATA = [
  {
    name: 'Fang',
    code: 'fan',
    nativeName: 'Fang-Beti',
    family: 'Bantoue du Nord-Ouest',
    region: 'Estuaire (Libreville), Woleu-Ntem (Oyem), Ogooué-Ivindo (Makokou)',
    speakers: '~800 000 locuteurs',
    notes: 'Langue la plus parlée au Gabon. Tonale (tons Haut/Bas). Sujet-Verbe-Objet. Les noms de classe sont préfixés (a-, bi-, m-).'
  },
  {
    name: 'Punu',
    code: 'puu',
    nativeName: 'Yipunu',
    family: 'Bantoue',
    region: 'Nyanga (Tchibanga), Ngounié (Mouila), Sud du Gabon',
    speakers: '~300 000 locuteurs',
    notes: 'Langue tonale. Connu pour les masques Mukudj (blanc). Préfixe de classe "mu-" pour les personnes, "mi-" pour le pluriel.'
  },
  {
    name: 'Myènè',
    code: 'mye',
    nativeName: 'Omyènè',
    family: 'Bantoue',
    region: 'Estuaire (Libreville), Port-Gentil (Ogooué-Maritime), Lambaréné',
    speakers: '~50 000 locuteurs',
    notes: 'Langue littorale historique du Gabon. Langue de commerce autrefois. Préfixe "o-" pour la 1re personne.'
  },
  {
    name: 'Nzébi',
    code: 'nzb',
    nativeName: 'Inzébi',
    family: 'Bantoue',
    region: 'Ngounié (Mbigou), Ogooué-Lolo (Koulamoutou)',
    speakers: '~150 000 locuteurs',
    notes: 'Aussi appelé Nzabi. Langue tonale à deux tons (Haut et Bas).'
  },
  {
    name: 'Téké',
    code: 'tek',
    nativeName: 'Iteké',
    family: 'Bantoue',
    region: 'Haut-Ogooué (Franceville, Moanda)',
    speakers: '~140 000 locuteurs',
    notes: 'Famille de langues Téké. Connue pour les sculptures royales Téké.'
  },
  {
    name: 'Vili',
    code: 'vif',
    nativeName: 'Icivili',
    family: 'Bantoue',
    region: 'Nyanga (Mayumba), côte sud du Gabon, frontière Congo',
    speakers: '~35 000 locuteurs',
    notes: 'Proche du Loango et du Yoombe. Langue littorale de pêcheurs.'
  },
  {
    name: 'Obamba',
    code: 'obb',
    nativeName: 'Lembaama',
    family: 'Bantoue',
    region: 'Haut-Ogooué (Franceville, Moanda, Okondja)',
    speakers: '~90 000 locuteurs',
    notes: 'Aussi appelé Mbama. Langue du peuple Obamba / Ambamba.'
  },
  {
    name: 'Guisir',
    code: 'gsi',
    nativeName: 'Yigisir',
    family: 'Bantoue',
    region: 'Ngounié (Fougamou, Mouila, Ndendé)',
    speakers: '~60 000 locuteurs',
    notes: 'Proche du Punu et du Varama. Langue de la région de la Ngounié.'
  },
  {
    name: 'Kota',
    code: 'kto',
    nativeName: 'Ikota',
    family: 'Bantoue',
    region: 'Ogooué-Ivindo (Makokou, Booué), Haut-Ogooué',
    speakers: '~45 000 locuteurs',
    notes: 'Connu pour les reliquaires Kota (sculptures en métal). Langue tonale.'
  }
];

// ============================================================
// 2. DICTIONNAIRE — MOTS ET TRADUCTIONS
// ============================================================
const DICTIONARY_DATA = [
  // === SALUTATIONS ===
  { fr: 'Bonjour', fang: 'Mbolo', punu: 'Mbolo', myene: 'Mbolo', nzebi: 'Mbolo', teke: 'Mbolo', vili: 'Mbolo', kota: 'Mbolo', guisir: 'Mbolo', obamba: 'Mbolo', category: 'Salutations' },
  { fr: 'Bonsoir', fang: 'Mbolo ening', punu: 'Mbolo ening', myene: 'Mbolo ewunga', category: 'Salutations' },
  { fr: 'Au revoir', fang: 'Oké bia', punu: 'Mbote moke', myene: 'Ogenda wé', category: 'Salutations' },
  { fr: 'Bienvenue', fang: 'Mbolo ma neng', punu: 'Buenimoke', myene: 'Mbolo ma', category: 'Salutations' },
  { fr: 'Bonne nuit', fang: 'Mbolo abuiri', punu: 'Mbote abuiri', myene: 'Ologo mobe', category: 'Salutations' },

  // === POLITESSE ===
  { fr: 'Merci', fang: 'Akiba', punu: 'Yine', myene: 'Ogula', nzebi: 'Ayé', teke: 'Nzala', vili: 'Nsungi', kota: 'Mbenge', guisir: 'Yine moke', obamba: 'Ndeke', category: 'Politesse' },
  { fr: 'Merci beaucoup', fang: 'Akiba mi neng', punu: 'Yine moke', myene: 'Ogula va imwè', category: 'Politesse' },
  { fr: 'S\'il vous plaît', fang: 'Wa bo', punu: 'Wabò', myene: 'Wa bo', category: 'Politesse' },
  { fr: 'Pardon / Excusez-moi', fang: 'Bolé', punu: 'Bolé', myene: 'Bolé', category: 'Politesse' },
  { fr: 'Oui', fang: 'Aye / Ee', punu: 'Éy', myene: 'Eyó', nzebi: 'Eye', teke: 'Ee', category: 'Réponses' },
  { fr: 'Non', fang: 'Yago / Kae', punu: 'Kaa', myene: 'Kawo', nzebi: 'Kaa', teke: 'Kaa', category: 'Réponses' },

  // === PERSONNES & FAMILLE ===
  { fr: 'Homme', fang: 'Nnom', punu: 'Mumu', myene: 'Nkombe', category: 'Personnes' },
  { fr: 'Femme', fang: 'Mevane / Nna', punu: 'Biké / Mwasi', myene: 'Mwasi', category: 'Personnes' },
  { fr: 'Enfant', fang: 'Mone', punu: 'Mwana', myene: 'Mwana', nzebi: 'Mwana', category: 'Personnes' },
  { fr: 'Père', fang: 'Tara', punu: 'Tata', myene: 'Tata', nzebi: 'Tata', category: 'Famille' },
  { fr: 'Mère', fang: 'Nya / Nna', punu: 'Ngudi', myene: 'Ngudi', nzebi: 'Mama', category: 'Famille' },
  { fr: 'Frère', fang: 'Nkima', punu: 'Ndeko', myene: 'Ndeko', category: 'Famille' },
  { fr: 'Sœur', fang: 'Nkima (mevane)', punu: 'Ndeko (mwasi)', myene: 'Ndeko (mwasi)', category: 'Famille' },
  { fr: 'Grand-père', fang: 'Sima', punu: 'Kuku', myene: 'Nkambu', category: 'Famille' },
  { fr: 'Grand-mère', fang: 'Sima (nna)', punu: 'Kuku (ngudi)', myene: 'Nkambu (mwasi)', category: 'Famille' },
  { fr: 'Chef / Roi', fang: 'Nkukuma', punu: 'Mfumu', myene: 'Mfumu', category: 'Personnes' },
  { fr: 'Ami', fang: 'Nlem / Nkama', punu: 'Ndeko', myene: 'Ndeko', category: 'Personnes' },

  // === NATURE ===
  { fr: 'Eau', fang: 'Owusu', punu: 'Medzi', myene: 'Ino', nzebi: 'Metsi', teke: 'Nzila', category: 'Nature' },
  { fr: 'Feu', fang: 'Ozo', punu: 'Moto', myene: 'Orazo', category: 'Nature' },
  { fr: 'Terre / Sol', fang: 'Afan / Ngon', punu: 'Mbu', myene: 'Mboka', category: 'Nature' },
  { fr: 'Ciel', fang: 'Ening', punu: 'Liulu', myene: 'Liulu', category: 'Nature' },
  { fr: 'Soleil', fang: 'Ngu', punu: 'Ngonde', myene: 'Nyange', category: 'Nature' },
  { fr: 'Lune', fang: 'Ngonde', punu: 'Nyange', myene: 'Ngonde', category: 'Nature' },
  { fr: 'Forêt', fang: 'Afan', punu: 'Ngira', myene: 'Afan', category: 'Nature' },
  { fr: 'Fleuve / Rivière', fang: 'Ntem / Nzé', punu: 'Ngove', myene: 'Ogo / Ogooué', category: 'Nature' },
  { fr: 'Mer / Océan', fang: 'Enguon', punu: 'Batanga', myene: 'Ogowe', category: 'Nature' },
  { fr: 'Arbre', fang: 'Nkogo / Okok', punu: 'Nkosi', myene: 'Nkogo', category: 'Nature' },
  { fr: 'Animal', fang: 'Nyama', punu: 'Nyama', myene: 'Nyama', category: 'Nature' },
  { fr: 'Éléphant', fang: 'Nzok', punu: 'Nzou', myene: 'Nzoku', category: 'Animaux' },
  { fr: 'Gorille', fang: 'Ngi', punu: 'Ongo', myene: 'Ongo', category: 'Animaux' },
  { fr: 'Léopard / Panthère', fang: 'Nzé / Owong', punu: 'Ngubo', myene: 'Ngubu', category: 'Animaux' },
  { fr: 'Poisson', fang: 'Ngang', punu: 'Mbizi', myene: 'Mbizi', category: 'Animaux' },
  { fr: 'Oiseau', fang: 'Manon / Nkukuma', punu: 'Nuni', myene: 'Nuni', category: 'Animaux' },

  // === LIEUX ===
  { fr: 'Maison', fang: 'Ntang', punu: 'Nzu', myene: 'Ntang', nzebi: 'Nzo', category: 'Lieux' },
  { fr: 'Village', fang: 'Mbel / Afan', punu: 'Vili / Mboka', myene: 'Mboka', nzebi: 'Mboka', category: 'Lieux' },
  { fr: 'Marché', fang: 'Mabè', punu: 'Nsanda', myene: 'Nsanda', category: 'Lieux' },
  { fr: 'Chemin / Route', fang: 'Zem', punu: 'Njila', myene: 'Nzila', category: 'Lieux' },

  // === NOURRITURE ===
  { fr: 'Manger', fang: 'Di / Kia', punu: 'Dia', myene: 'Olia', category: 'Nourriture' },
  { fr: 'Boire', fang: 'Nom', punu: 'Noma', myene: 'Ono', category: 'Nourriture' },
  { fr: 'Riz', fang: 'Riz (emprunt)', punu: 'Malafu', myene: 'Riso', category: 'Nourriture' },
  { fr: 'Viande', fang: 'Nam', punu: 'Nyama', myene: 'Nyama', category: 'Nourriture' },
  { fr: 'Pain de manioc / Bâton de manioc', fang: 'Okon / Miondo', punu: 'Bobolo', myene: 'Bobolo', category: 'Nourriture' },
  { fr: 'Plantain', fang: 'Okan', punu: 'Lituma', myene: 'Lituma', category: 'Nourriture' },

  // === VERBES COURANTS ===
  { fr: 'Aller', fang: 'Ke', punu: 'Enda', myene: 'Enda', category: 'Verbes' },
  { fr: 'Venir', fang: 'Ba / Be', punu: 'Jia', myene: 'Ja', category: 'Verbes' },
  { fr: 'Voir', fang: 'Ne', punu: 'Bona', myene: 'Bona', category: 'Verbes' },
  { fr: 'Entendre / Écouter', fang: 'Wom', punu: 'Wona', myene: 'Wona', category: 'Verbes' },
  { fr: 'Parler', fang: 'Bo', punu: 'Luma', myene: 'Luma', category: 'Verbes' },
  { fr: 'Dormir', fang: 'Kiri', punu: 'Lala', myene: 'Lala', category: 'Verbes' },
  { fr: 'Travailler', fang: 'Dzo / Bia', punu: 'Sebola', myene: 'Sabo', category: 'Verbes' },
  { fr: 'Aimer', fang: 'Yem / Yom', punu: 'Yanda', myene: 'Yanda', category: 'Verbes' },
  { fr: 'Acheter', fang: 'Fam', punu: 'Sumba', myene: 'Sumba', category: 'Verbes' },
  { fr: 'Donner', fang: 'Nga', punu: 'Peya', myene: 'Pea', category: 'Verbes' },

  // === CHIFFRES ===
  { fr: 'Un (1)', fang: 'Fok / Biok', punu: 'Mosi', myene: 'Imwé', category: 'Chiffres' },
  { fr: 'Deux (2)', fang: 'Beba', punu: 'Bale', myene: 'Bale', category: 'Chiffres' },
  { fr: 'Trois (3)', fang: 'Belan', punu: 'Tatu', myene: 'Tatu', category: 'Chiffres' },
  { fr: 'Quatre (4)', fang: 'Bene', punu: 'Nine', myene: 'Inei', category: 'Chiffres' },
  { fr: 'Cinq (5)', fang: 'Betān', punu: 'Ntanu', myene: 'Itanu', category: 'Chiffres' },
  { fr: 'Dix (10)', fang: 'Besome', punu: 'Dikumi', myene: 'Ikumi', category: 'Chiffres' },
  { fr: 'Cent (100)', fang: 'Nkama', punu: 'Nkama', myene: 'Nkama', category: 'Chiffres' },

  // === COULEURS ===
  { fr: 'Noir', fang: 'Ñgomb / Obiang', punu: 'Ntima', myene: 'Ntima', category: 'Couleurs' },
  { fr: 'Blanc', fang: 'Awit / Mfan', punu: 'Mpemba', myene: 'Mpemba', category: 'Couleurs' },
  { fr: 'Rouge', fang: 'Nzim', punu: 'Ngula', myene: 'Ngula', category: 'Couleurs' },

  // === CULTURE & TRADITION ===
  { fr: 'Masque traditionnel', fang: 'Ngil (masque judiciaire)', punu: 'Mukudj (masque blanc)', myene: 'Ombwiri (esprit)', category: 'Culture' },
  { fr: 'Ancêtres', fang: 'Bekón', punu: 'Bakulu', myene: 'Bakulu', category: 'Culture' },
  { fr: 'Esprit / Génie', fang: 'Evu / Beyem', punu: 'Mwamba', myene: 'Ombwiri', category: 'Culture' },
  { fr: 'Cérémonie', fang: 'Eyenga / Bekón', punu: 'Yenga', myene: 'Yenga', category: 'Culture' },
  { fr: 'Tam-tam / Tambour', fang: 'Nku', punu: 'Ngoma', myene: 'Ngoma', category: 'Culture' },
  { fr: 'Griot / Conteur', fang: 'Nvet (joueur de Nvet)', punu: 'Nganga', myene: 'Nganga', category: 'Culture' },
  { fr: 'Guérisseur / Tradipraticien', fang: 'Nganga', punu: 'Nganga', myene: 'Nganga', category: 'Culture' },
  { fr: 'Dot / Mariage', fang: 'Afane', punu: 'Lobola', myene: 'Lobola', category: 'Culture' },

  // === EXPRESSIONS GABONAISES ===
  { fr: 'Comment vas-tu ?', fang: 'Mbolo mi neng ?', punu: 'O di bueni ?', myene: 'O di bueni ?', category: 'Expressions' },
  { fr: 'Je vais bien', fang: 'Ma neng ayé', punu: 'Ndi bueni', myene: 'Ndi bueni', category: 'Expressions' },
  { fr: 'Où vas-tu ?', fang: 'O ke va ?', punu: 'O enda kua ?', myene: 'Nka ve ?', category: 'Expressions' },
  { fr: 'Bienvenue au Gabon', fang: 'Mbolo ma Gabon', punu: 'Bueni ma Gabon', myene: 'Mbolo ma Gabon', category: 'Expressions' },
  { fr: 'Je t\'aime', fang: 'Ma yem we', punu: 'Nyanda hue', myene: 'Ma yanda hue', category: 'Expressions' },
  { fr: 'Dieu', fang: 'Zamba', punu: 'Nzambi', myene: 'Nzambi', nzebi: 'Nzambi', category: 'Spiritualité' },
  { fr: 'La paix', fang: 'Nyol / Mbane', punu: 'Kimia', myene: 'Kimia', category: 'Valeurs' },
  { fr: 'Solidarité / Entraide', fang: 'Engagha', punu: 'Buyumu', myene: 'Bwè', category: 'Valeurs' }
];

// ============================================================
// 3. PHRASES COMPLÈTES, PROVERBES ET DIALOGUES
// ============================================================
// Comment ajouter une phrase ?
// → type: 'phrase'    = traduction d'une phrase complète
// → type: 'proverbe'  = proverbe traditionnel + son sens
// → type: 'dialogue'  = mini-dialogue de la vie quotidienne
// → type: 'chanson'   = paroles ou formules chantées traditionnelles
//
// Les champs de langue sont les mêmes que dans DICTIONARY_DATA :
// fang, punu, myene, nzebi, teke, vili, kota, guisir, obamba

const PHRASES_DATA = [

  // ── PHRASES DU QUOTIDIEN ──────────────────────────────────────
  {
    type: 'phrase',
    fr: 'Je vais au marché.',
    fang: 'Ma ke mabè.',
    punu: 'Nda enda nsanda.',
    myene: 'Nda enda nsanda.',
    context: 'Vie quotidienne'
  },
  {
    type: 'phrase',
    fr: 'L\'eau est froide.',
    fang: 'Owusu a wum.',
    punu: 'Medzi i tama.',
    myene: 'Ino o tama.',
    context: 'Vie quotidienne'
  },
  {
    type: 'phrase',
    fr: 'J\'ai faim.',
    fang: 'Ma zim nkuan.',
    punu: 'Nzala mi bula.',
    myene: 'Nzala e njika me.',
    context: 'Besoins'
  },
  {
    type: 'phrase',
    fr: 'J\'ai soif.',
    fang: 'Ma nom owusu.',
    punu: 'Ludzi lu njika me.',
    myene: 'Ino e njika me.',
    context: 'Besoins'
  },
  {
    type: 'phrase',
    fr: 'Combien coûte ceci ?',
    fang: 'Mbot ke ngé ?',
    punu: 'Mutengo ke bueni ?',
    myene: 'Ntemo ke bwè ?',
    context: 'Commerce / Marché'
  },
  {
    type: 'phrase',
    fr: 'Je ne comprends pas.',
    fang: 'Ma wom yago.',
    punu: 'Ka ndi wona ko.',
    myene: 'Ka nda wona ko.',
    context: 'Communication'
  },
  {
    type: 'phrase',
    fr: 'Répète s\'il te plaît.',
    fang: 'Bo fok mam.',
    punu: 'Luma diaka, wabò.',
    myene: 'Luma diaka, wa bo.',
    context: 'Communication'
  },
  {
    type: 'phrase',
    fr: 'Comment tu t\'appelles ?',
    fang: 'O tô dzé ?',
    punu: 'Iná yago o la ni ?',
    myene: 'Izina liago ?',
    context: 'Présentation'
  },
  {
    type: 'phrase',
    fr: 'Je m\'appelle [nom].',
    fang: 'Ma tô [nom].',
    punu: 'Iná yame [nom].',
    myene: 'Izina liame [nom].',
    context: 'Présentation'
  },
  {
    type: 'phrase',
    fr: 'D\'où viens-tu ?',
    fang: 'O ba va ?',
    punu: 'O jia kua ?',
    myene: 'O ja rove ?',
    context: 'Présentation'
  },
  {
    type: 'phrase',
    fr: 'Je viens du Gabon.',
    fang: 'Ma ba Gabon.',
    punu: 'Njia va Gabon.',
    myene: 'Nja va Gabon.',
    context: 'Présentation'
  },
  {
    type: 'phrase',
    fr: 'Je suis gabonais(e).',
    fang: 'Ma be Gabon.',
    punu: 'Mutu wa Gabon.',
    myene: 'Nkombe wa Gabon.',
    context: 'Identité'
  },
  {
    type: 'phrase',
    fr: 'Le Gabon est beau.',
    fang: 'Gabon a be mfan.',
    punu: 'Gabon mobe.',
    myene: 'Gabon mobe.',
    context: 'Identité'
  },
  {
    type: 'phrase',
    fr: 'La forêt est grande.',
    fang: 'Afan a be nkumo.',
    punu: 'Ngira i kolo.',
    myene: 'Afan o kolo.',
    context: 'Nature'
  },
  {
    type: 'phrase',
    fr: 'Le fleuve Ogooué est majestueux.',
    fang: 'Nzé Ogooué a be nkumo.',
    punu: 'Ngove Ogooué i kolo.',
    myene: 'Ogooué o kolo.',
    context: 'Géographie'
  },
  {
    type: 'phrase',
    fr: 'Bonne chance !',
    fang: 'Molo moke !',
    punu: 'Bueni boke !',
    myene: 'Bueni boke !',
    context: 'Encouragements'
  },
  {
    type: 'phrase',
    fr: 'Bon courage !',
    fang: 'Wom nyol !',
    punu: 'Sebola bueni !',
    myene: 'Sabo bueni !',
    context: 'Encouragements'
  },

  // ── PROVERBES TRADITIONNELS GABONAIS ──────────────────────────
  {
    type: 'proverbe',
    fr: 'Seul on va plus vite, ensemble on va plus loin.',
    fang: 'Mone fok a ke bian, bone bele ba ke nkumo.',
    punu: 'Mwana mosi o enda mbebo, bana bale ba enda mosika.',
    sens: 'La solidarité et l\'unité sont plus puissantes que l\'individualisme. Valeur centrale de la culture gabonaise.',
    langue_origine: 'Fang et Punu'
  },
  {
    type: 'proverbe',
    fr: 'La forêt cache ses secrets mais les parle à ceux qui savent écouter.',
    fang: 'Afan a we mam ma ye, kono a bo ye wa ba wom.',
    sens: 'La nature est source de sagesse pour ceux qui sont attentifs. Lié à la relation spirituelle des peuples gabonais avec la forêt.',
    langue_origine: 'Fang'
  },
  {
    type: 'proverbe',
    fr: 'Un seul arbre ne fait pas la forêt.',
    fang: 'Nkogo fok a ke afan.',
    punu: 'Nkosi yimosi i kaka ngira.',
    sens: 'L\'union fait la force. La communauté est plus grande que l\'individu.',
    langue_origine: 'Fang et Punu'
  },
  {
    type: 'proverbe',
    fr: 'Ce que la bouche ne dit pas, le cœur le ressent.',
    fang: 'Ñgàn a bo yago, nlem a ne ye.',
    sens: 'Les sentiments profonds ne s\'expriment pas toujours par les mots. Importance de l\'intuition et de l\'empathie.',
    langue_origine: 'Fang'
  },
  {
    type: 'proverbe',
    fr: 'L\'enfant qui n\'a pas voyagé croit que sa mère est la meilleure cuisinière.',
    fang: 'Mone wa ke yago ndzang a ne nya ye a be ngonde.',
    punu: 'Mwana wa enda yago ndzang o bona ngudi ye o diba mbebo.',
    sens: 'L\'expérience et le voyage ouvrent l\'esprit. Ne pas se limiter à ce qu\'on connaît.',
    langue_origine: 'Fang et Punu'
  },
  {
    type: 'proverbe',
    fr: 'Quand les ancêtres parlent, les vivants doivent écouter.',
    fang: 'Bekón ba bo, benyingone ba wom.',
    sens: 'Respect de la tradition et de la sagesse des ancêtres. Lié au culte des ancêtres (Bwiti, Mwiri).',
    langue_origine: 'Fang'
  },
  {
    type: 'proverbe',
    fr: 'La pluie ne sait pas qu\'elle mouille.',
    fang: 'Nkam a ne ye yago e nyo.',
    punu: 'Mvula i zeba te o nyo.',
    sens: 'Certaines personnes font du mal sans s\'en rendre compte. Appel à la conscience de soi.',
    langue_origine: 'Fang et Punu'
  },

  // ── DIALOGUES DE LA VIE QUOTIDIENNE ──────────────────────────
  {
    type: 'dialogue',
    context: 'Rencontre dans la rue',
    langue: 'Fang',
    echanges: [
      { locuteur: 'A', fr: 'Bonjour, comment vas-tu ?', local: 'Mbolo, mi neng ?' },
      { locuteur: 'B', fr: 'Je vais bien, et toi ?',    local: 'Ma neng ayé, ne we ?' },
      { locuteur: 'A', fr: 'Je vais bien aussi, merci.', local: 'Ma neng ayé, akiba.' },
      { locuteur: 'B', fr: 'Où vas-tu ?',               local: 'O ke va ?' },
      { locuteur: 'A', fr: 'Je vais au village.',       local: 'Ma ke mbel.' }
    ]
  },
  {
    type: 'dialogue',
    context: 'Au marché',
    langue: 'Punu',
    echanges: [
      { locuteur: 'Vendeur', fr: 'Bonjour, que veux-tu ?', local: 'Mbolo, o londa bueni ?' },
      { locuteur: 'Client',  fr: 'Combien coûte le poisson ?', local: 'Mutengo wa mbizi ke bueni ?' },
      { locuteur: 'Vendeur', fr: 'Cinq cents francs.', local: 'Ntanu nkama.' },
      { locuteur: 'Client',  fr: 'C\'est cher. Peux-tu baisser ?', local: 'Mutengo muke. Ka o kona ?' },
      { locuteur: 'Vendeur', fr: 'D\'accord, quatre cents.', local: 'Bueni, nine nkama.' }
    ]
  },
  {
    type: 'dialogue',
    context: 'Présentation entre amis',
    langue: 'Myènè',
    echanges: [
      { locuteur: 'A', fr: 'Comment tu t\'appelles ?', local: 'Izina liago ?' },
      { locuteur: 'B', fr: 'Je m\'appelle Sylvie. Et toi ?', local: 'Izina liame Sylvie. Ne hue ?' },
      { locuteur: 'A', fr: 'Moi c\'est Jean. D\'où viens-tu ?', local: 'Me Jean. O ja rove ?' },
      { locuteur: 'B', fr: 'Je viens de Port-Gentil.',          local: 'Nja va Port-Gentil.' }
    ]
  },

  // ── FORMULES CULTURELLES ET SPIRITUELLES ─────────────────────
  {
    type: 'formule',
    context: 'Cérémonie / Prière traditionnelle',
    fr: 'Que les ancêtres nous protègent.',
    fang: 'Bekón ba me biso.',
    punu: 'Bakulu ba keba bisu.',
    myene: 'Bakulu ba keba bisu.',
    usage: 'Dit lors des cérémonies traditionnelles, funérailles, initiations (Bwiti, Mwiri, Ndjèmbè)'
  },
  {
    type: 'formule',
    context: 'Blessing / Bénédiction',
    fr: 'Que Dieu te bénisse.',
    fang: 'Zamba a ku we.',
    punu: 'Nzambi a ku hue.',
    myene: 'Nzambi a ku hue.',
    usage: 'Formule de bénédiction courante, mélange de tradition et de spiritualité gabonaise'
  },
  {
    type: 'formule',
    context: 'Deuil / Condoléances',
    fr: 'Mes condoléances. Que son âme repose en paix.',
    fang: 'Ntol na we. Nyol ye a be na bekón.',
    punu: 'Ntima na hue. Moyo ye o kina na bakulu.',
    usage: 'Formule de condoléances respectueuse lors d\'un deuil'
  }
];

// ============================================================
// 4. NOTES GRAMMATICALES ESSENTIELLES
// ============================================================
const GRAMMAR_NOTES = `
GRAMMAIRE DES LANGUES GABONAISES — POINTS ESSENTIELS :

FANG (Fang-Beti) :
- Structure : Sujet + Verbe + Objet (SVO)
- Langue tonale : ton Haut (H) et ton Bas (B) changent le sens
- Classes nominales : préfixes a- (singulier), bi- (pluriel), m- (masse)
- Exemples de classe : mone (enfant) / bone (enfants), nkogo (arbre) / bekogo (arbres)
- Négation : ajout de "yago" ou "kae" devant/après le verbe
- Temps : passé (-wo-), futur (-te-), présent sans marqueur
- Exemple : "Ma ke" = Je vais | "Ma ke wa" = J'irai | "Ma kewowo" = Je suis allé

PUNU (Yipunu) :
- Structure : SVO, langue tonale
- Classes nominales bantoues avec préfixes mu-/ba- (personnes), di-/ma- (choses), n-
- Exemple : mumu (homme) / bamu (hommes), mwana (enfant) / bana (enfants)

MYÈNÈ (Omyènè) :
- Structure : SVO
- Préfixe o- pour le sujet 1re personne : "Onda" (je suis allé)
- Langue plus isolante que les autres, moins de préfixes de classe

RÈGLE GÉNÉRALE BANTOUE :
- L'accord se fait entre le préfixe du nom et le préfixe du verbe/adjectif
- Les tons changent le sens : même mot, tons différents = significations différentes
- La nasale initiale (m-, n-, ng-) est très fréquente
`;

// ============================================================
// 4. CONSTRUIRE LE PROMPT SYSTÈME COMPLET
// ============================================================
function buildSystemPrompt(task = 'assistant', persona = 'tuteur') {
  // Formater le dictionnaire (mots)
  const dictSample = DICTIONARY_DATA.slice(0, 80).map(entry => {
    const langs = [];
    if (entry.fang) langs.push(`Fang: ${entry.fang}`);
    if (entry.punu) langs.push(`Punu: ${entry.punu}`);
    if (entry.myene) langs.push(`Myènè: ${entry.myene}`);
    if (entry.nzebi) langs.push(`Nzébi: ${entry.nzebi}`);
    if (entry.teke) langs.push(`Téké: ${entry.teke}`);
    if (entry.vili) langs.push(`Vili: ${entry.vili}`);
    if (entry.kota) langs.push(`Kota: ${entry.kota}`);
    if (entry.guisir) langs.push(`Guisir: ${entry.guisir}`);
    if (entry.obamba) langs.push(`Obamba: ${entry.obamba}`);
    return `• "${entry.fr}" → [${entry.category}] ${langs.join(' | ')}`;
  }).join('\n');

  // Formater les phrases (traductions de phrases)
  const phrasesSample = PHRASES_DATA
    .filter(p => p.type === 'phrase')
    .map(p => {
      const langs = [];
      if (p.fang) langs.push(`Fang: "${p.fang}"`);
      if (p.punu) langs.push(`Punu: "${p.punu}"`);
      if (p.myene) langs.push(`Myènè: "${p.myene}"`);
      return `• "${p.fr}" [${p.context}] → ${langs.join(' | ')}`;
    }).join('\n');

  // Formater les proverbes
  const proverbsSample = PHRASES_DATA
    .filter(p => p.type === 'proverbe')
    .map(p => {
      const langs = [];
      if (p.fang) langs.push(`Fang: "${p.fang}"`);
      if (p.punu) langs.push(`Punu: "${p.punu}"`);
      return `• Proverbe [${p.langue_origine}] : "${p.fr}"\n  ${langs.join(' | ')}\n  Sens : ${p.sens}`;
    }).join('\n\n');

  // Formater les dialogues
  const dialoguesSample = PHRASES_DATA
    .filter(p => p.type === 'dialogue')
    .map(p => {
      const lines = p.echanges.map(e =>
        `  ${e.locuteur}: "${e.fr}" → [${p.langue}] "${e.local}"`
      ).join('\n');
      return `• Dialogue — ${p.context} (${p.langue}) :\n${lines}`;
    }).join('\n\n');

  // Formater les formules culturelles
  const formulesSample = PHRASES_DATA
    .filter(p => p.type === 'formule')
    .map(p => {
      const langs = [];
      if (p.fang) langs.push(`Fang: "${p.fang}"`);
      if (p.punu) langs.push(`Punu: "${p.punu}"`);
      if (p.myene) langs.push(`Myènè: "${p.myene}"`);
      return `• [${p.context}] "${p.fr}" → ${langs.join(' | ')}\n  Usage : ${p.usage || ''}`;
    }).join('\n\n');

  // Formater les langues
  const langsList = LANGUAGES_DATA.map(l =>
    `• ${l.name} (${l.nativeName}) — ${l.region} — ${l.speakers} — Famille: ${l.family}. ${l.notes}`
  ).join('\n');

  let personaInstruction = "";
  if (persona === 'culture') {
    personaInstruction = `\nFOCUS ACTUEL : Mode Guide Culturel & Traditions. Mets l'accent sur les masques traditionnels (Mukudj, Ngil, Emboli, etc.), les instruments de musique (Mvet, Ngombi), les cérémonies, contes, légendes et la spiritualité ancestrale gabonaise.\n`;
  } else if (persona === 'traducteur') {
    personaInstruction = `\nFOCUS ACTUEL : Mode Traduction & Vocabulaire. Fournis des traductions directes, détaillées, avec variantes dialectales et transcriptions phonétiques précises.\n`;
  } else {
    personaInstruction = `\nFOCUS ACTUEL : Mode Tuteur Linguistique. Sois très didactique, donne des exemples pas-à-pas, des exercices pratiques simples et explique la structure grammaticale des phrases.\n`;
  }

  if (task === 'translate') {
    return `Tu es un moteur de traduction expert en langues gabonaises, intégré à la plateforme Tradition IA.

LANGUES QUE TU CONNAIS :
${langsList}

DICTIONNAIRE DE MOTS (utilise ces traductions en priorité) :
${dictSample}

PHRASES ET EXPRESSIONS COMPLÈTES :
${phrasesSample}

${GRAMMAR_NOTES}

INSTRUCTIONS DE TRADUCTION :
1. Traduis le texte de l'utilisateur vers la langue cible demandée.
2. Si un mot est dans ton dictionnaire intégré, utilise EXACTEMENT cette traduction.
3. Pour les phrases longues, traduis mot par mot ou expression par expression.
4. Si tu n'as pas la traduction exacte, propose une approximation linguistique et signale-le avec "(approximation)".
5. Ajoute toujours une note phonétique ou d'usage si c'est utile.
6. Ne réponds QU'avec la traduction, sans explication sauf si c'est nécessaire.
7. Pour les langues peu documentées (Vili, Obamba, Guisir, Kota), sois honnête sur les limites.
8. Format de réponse : la traduction en premier, puis éventuellement une note entre parenthèses.

RAPPEL : Tu représentes la culture gabonaise. Tes traductions doivent respecter les peuples et leurs langues.`;
  }

  return `Tu es Mbolo IA, l'assistant virtuel de la plateforme Tradition IA, spécialisé dans les langues et cultures gabonaises.
${personaInstruction}
TON IDENTITÉ :
- Tu t'appelles "Mbolo IA" (Mbolo = Bonjour en Fang, Punu, Myènè et dans toutes les langues du Gabon)
- Tu es un expert des 9 langues gabonaises principales et de la culture gabonaise
- Tu parles toujours en français mais tu connais et cites les mots dans les langues locales
- Tu es chaleureux, culturellement respectueux et pédagogue

LES 9 LANGUES GABONAISES QUE TU MAÎTRISES :
${langsList}

DICTIONNAIRE DE MOTS :
${dictSample}

PHRASES DU QUOTIDIEN (exemples de phrases complètes) :
${phrasesSample}

PROVERBES TRADITIONNELS GABONAIS :
${proverbsSample}

DIALOGUES (exemples de conversations réelles) :
${dialoguesSample}

FORMULES CULTURELLES ET SPIRITUELLES :
${formulesSample}

${GRAMMAR_NOTES}

TES CAPACITÉS :
1. Expliquer la grammaire des langues gabonaises
2. Traduire des mots ou expressions du français vers les langues gabonaises
3. Expliquer la culture, les traditions, les masques, les cérémonies
4. Donner des exemples d'utilisation de mots en contexte
5. Expliquer les similitudes et différences entre les langues gabonaises
6. Raconter des éléments culturels (masques Ngil, Mukudj, instrument Nvet, Bwiti, etc.)
7. Enseigner des phrases de base pour voyager ou communiquer au Gabon

RÈGLES DE RÉPONSE :
- Réponds TOUJOURS en français
- Cite les mots dans la langue locale en gras ou entre guillemets
- Quand tu donnes un mot, précise dans quelle langue : ex: "En Fang, on dit **Mbolo**"
- Si la question concerne plusieurs langues, réponds pour chacune
- Sois pédagogue : explique la prononciation quand c'est utile
- Si tu ne sais pas, dis-le honnêtement plutôt que d'inventer
- Commence souvent par un mot de salutation gabonais pour être chaleureux

EXEMPLE DE BONNE RÉPONSE :
Question: "Comment dit-on 'merci' en Fang et en Punu ?"
Réponse: "En **Fang**, on dit **Akiba** (prononcé a-ki-ba) ! En **Punu**, on dit **Yine** (prononcé yi-né). Ces deux langues font partie de la grande famille bantoue du Gabon. 🇬🇦"

Tu représentes la richesse culturelle et linguistique du Gabon. Chaque réponse doit valoriser ces langues.`;
}

module.exports = {
  buildSystemPrompt,
  LANGUAGES_DATA,
  DICTIONARY_DATA,
  PHRASES_DATA,
  GRAMMAR_NOTES
};
