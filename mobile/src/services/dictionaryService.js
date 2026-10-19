/**
 * TRADITION IA - SERVICE DU DICTIONNAIRE & TRADUCTION MOBILE
 * Données officielles synchronisées avec api/_knowledge.js et txt.txt
 */

export const GABON_LANGUAGES = [
  {
    id: 'Fang',
    name: 'Fang',
    nativeName: 'Fang-Beti',
    region: 'Estuaire (Libreville), Woleu-Ntem (Oyem, Bitam), Ogooué-Ivindo (Makokou)',
    mask: 'Ngil Fang',
    imageKey: 'fang',
    color: '#009E49',
    speakers: '~800 000'
  },
  {
    id: 'Punu',
    name: 'Punu',
    nativeName: 'Yipunu',
    region: 'Ngounié (Mouila, Ndendé), Nyanga (Tchibanga)',
    mask: 'Okuyi Punu',
    imageKey: 'punu',
    color: '#3B82F6',
    speakers: '~250 000'
  },
  {
    id: 'Myènè',
    name: 'Myènè',
    nativeName: 'Omyènè',
    region: 'Ogooué-Maritime (Port-Gentil), Moyen-Ogooué (Lambaréné), Estuaire',
    mask: 'Ivili Myènè',
    imageKey: 'myene',
    color: '#F59E0B',
    speakers: '~100 000'
  },
  {
    id: 'Nzébi',
    name: 'Nzébi',
    nativeName: 'Inzébi',
    region: 'Ogooué-Lolo (Koulamoutou, Pana), Haut-Ogooué',
    mask: 'Bwiti Nzébi',
    imageKey: 'nzebi',
    color: '#EC4899',
    speakers: '~200 000'
  },
  {
    id: 'Téké',
    name: 'Téké',
    nativeName: 'Iteké',
    region: 'Haut-Ogooué (Franceville, Bongoville, Ngouoni)',
    mask: 'Masque Rond Téké',
    imageKey: 'teke',
    color: '#8B5CF6',
    speakers: '~80 000'
  },
  {
    id: 'Kota',
    name: 'Kota',
    nativeName: 'Ikota',
    region: 'Ogooué-Ivindo (Makokou, Booué, Mékambo)',
    mask: 'Mbulu-Ngulu Kota',
    imageKey: 'kota',
    color: '#10B981',
    speakers: '~75 000'
  },
  {
    id: 'Obamba',
    name: 'Obamba',
    nativeName: 'Lembaama',
    region: 'Haut-Ogooué (Franceville, Okondja)',
    mask: 'Masque Obamba',
    imageKey: 'obamba',
    color: '#6366F1',
    speakers: '~60 000'
  },
  {
    id: 'Guisir',
    name: 'Guisir',
    nativeName: 'Yigisir',
    region: 'Ngounié (Fougamou, Mandji, Ndendé)',
    mask: 'Masque Guisir',
    imageKey: 'guisir',
    color: '#14B8A6',
    speakers: '~50 000'
  },
  {
    id: 'Vili',
    name: 'Vili',
    nativeName: 'Icivili',
    region: 'Nyanga (Mayumba, littoral Sud)',
    mask: 'Nkisi Vili',
    imageKey: 'vili',
    color: '#0284C7',
    speakers: '~35 000'
  }
];

// Expressions officielles tirées fidèlement de txt.txt
export const EXPRESSIONS_DATABASE = [
  // NÉGATIONS EN FANG (txt.txt)
  { fr: "Je n'ai pas de temps", Fang: "Me bele ki Eyong", Punu: "Ni sa dji nangu", category: "Négation / Temps" },
  { fr: "Je n'ai pas d'argent", Fang: "Me bele ki miang", Punu: "Ni sa dji falanka", category: "Négation / Argent" },
  { fr: "Je n'ai pas fini", Fang: "Me bele mane", Punu: "Ni sa mane", category: "Négation / Action" },
  { fr: "Je n'ai pas vu", Fang: "Me dzi yene", Punu: "Ni sa mone", category: "Négation / Perception" },
  { fr: "Je n'ai pas de chance", Fang: "Me belé mvôm", category: "Négation / Chance" },
  { fr: "Je n'ai pas entendu", Fang: "Me dzi wok", category: "Négation / Ouïe" },
  { fr: "Je n'ai pas réussi", Fang: "Me dzi dengh", category: "Négation / Réussite" },
  { fr: "Je n'ai pas voulu", Fang: "Ma dzi kume", category: "Négation / Volonté" },
  { fr: "Je n'ai pas fait", Fang: "Me dzi boh", category: "Négation / Action" },
  { fr: "Je n'ai pas compris", Fang: "Me dzi bee", Punu: "Ni sa uwe", category: "Négation / Compréhension" },
  { fr: "Je n'ai pas reçu", Fang: "Me dzi dengh", category: "Négation / Réception" },
  { fr: "Je n'ai pas mangé", Fang: "Me dzi dzi", Punu: "Ni sa dya", category: "Négation / Nourriture" },
  { fr: "Je n'ai pas besoin", Fang: "Maa yi ki", category: "Négation / Besoin" },
  { fr: "Je n'ai pas faim", Fang: "Ma wok ki zon", category: "Négation / Faim" },
  { fr: "Je ne peux pas", Fang: "Ma se ki bo", category: "Négation / Capacité" },

  // PRÉSENTATION & FAMILLE (txt.txt)
  { fr: "Voici mon enfant", Fang: "Émo wom ényenyi", category: "Présentation" },
  { fr: "Comment s'appelle-t-il ?", Fang: "A n'éwula ya ?", category: "Présentation" },
  { fr: "Il s'appelle Obiang", Fang: "A n'éwula nâ Obiang", category: "Présentation" },
  { fr: "Il a quel âge ?", Fang: "A bele mimbu tang ?", category: "Présentation" },
  { fr: "Il a cinq ans", Fang: "A bele mimbu mitan", category: "Présentation" },
  { fr: "Elle, c'est ta fille ?", Fang: "Ye ngo' dzüè édzalé ?", category: "Présentation" },
  { fr: "Oui. Elle s'appelle Ada", Fang: "Huh-huh. A n'éwula na Ada", category: "Présentation" },
  { fr: "Elle a quatre ans", Fang: "A bele mimbu minign", category: "Présentation" },
  { fr: "Tu as combien de frères ?", Fang: "Ô bele monenyang tang ya ?", category: "Famille" },
  { fr: "J'ai deux frères", Fang: "Me bele bobenyang bebegn", category: "Famille" },
  { fr: "Je fais mon travail", Fang: "Ma bo ésè' dzam", category: "Travail" },

  // SALUTATIONS & QUOTIDIEN (txt.txt)
  { fr: "Bonjour", Fang: "Mbôlô", Punu: "Mbolo", Myènè: "Mbolo", Nzébi: "Mbolo", Téké: "Mpolo", category: "Salutations" },
  { fr: "Oui, bonjour", Fang: "Ae mbôlô", category: "Salutations" },
  { fr: "Comment tu vas ?", Fang: "Y'ô ne mvë ?", Punu: "Wa dji duma ?", Myènè: "Nda meye a le ?", category: "Salutations" },
  { fr: "Où vas-tu ?", Fang: "Wa ke vé ?", category: "Quotidien" },
  { fr: "Je vais au travail. Au revoir.", Fang: "Ma ke ésèn. Me kang", category: "Quotidien" },
  { fr: "Oui. À la prochaine !", Fang: "Huh-huh, nto ve éyong fe", category: "Au revoir" },
  { fr: "Merci", Fang: "Akiba", Punu: "Yine", Myènè: "Ogula", Nzébi: "Bassi", Téké: "Nzala", category: "Politesse" },

  // CE QUE JE VEUX / VOLONTÉ (txt.txt)
  { fr: "Je veux manger", Fang: "Ma kum'a dzi", category: "Volonté" },
  { fr: "Je veux boire", Fang: "Ma kum'a nyu", category: "Volonté" },
  { fr: "Je veux venir", Fang: "Ma kum'a nzu", category: "Volonté" },
  { fr: "Je veux danser", Fang: "Ma kum'a dzem", category: "Volonté" },
  { fr: "Je veux voir", Fang: "Ma kum'ayén", category: "Volonté" },
  { fr: "Je veux partir", Fang: "Ma kume ke", category: "Volonté" },
  { fr: "Je veux dormir", Fang: "Ma kume koyoh", category: "Volonté" },

  // L'IMPÉRATIF NÉGATIF (txt.txt)
  { fr: "Ne mange pas", Fang: "Ô tagha a dzi", category: "Impératif négatif" },
  { fr: "Ne bois pas", Fang: "Ô tagha a nyu", category: "Impératif négatif" },
  { fr: "Ne parle pas", Fang: "Ô tagha a kobe", category: "Impératif négatif" },
  { fr: "Ne viens pas", Fang: "Ô tagha a zu", category: "Impératif négatif" },
  { fr: "Ne touche pas", Fang: "Ô tagha a name", category: "Impératif négatif" },
  { fr: "Ne pars pas", Fang: "Ô tagha a ke", category: "Impératif négatif" },
  { fr: "Ne crie pas", Fang: "Ô tagha a wënan", category: "Impératif négatif" },
  { fr: "Ne bouge pas", Fang: "Ô tagha a funghane", category: "Impératif négatif" },
  { fr: "Ne fais pas", Fang: "Ô tagha a bo", category: "Impératif négatif" },
  { fr: "Ne m'embête pas", Fang: "Ô tagha m'a ndeghele", category: "Impératif négatif" },
  { fr: "Ne me regarde pas", Fang: "Ô tagha m'a dorh", category: "Impératif négatif" },
  { fr: "Ne me provoque pas", Fang: "Ô tagha m'a song", category: "Impératif négatif" },
  { fr: "Ne me pousse pas", Fang: "Ô tagha m'a sôghô", category: "Impératif négatif" },
  { fr: "Ne m'insulte pas", Fang: "Ô tagha m'a tà", category: "Impératif négatif" },

  // EXPRESSIONS DU QUOTIDIEN (txt.txt)
  { fr: "Fiche-moi la paix", Fang: "Korgh me mïs", category: "Expression familière" },
  { fr: "Ça m'est égal", Fang: "Maa bïs", category: "Expression familière" },
  { fr: "Exactement", Fang: "Dza feh", category: "Affirmation" },
  { fr: "Laisse-moi", Fang: "zame mah", category: "Demande" },
  { fr: "Je suis là", Fang: "Me ne va", category: "Localisation" },
  { fr: "Je suis ici", Fang: "Ma gni", category: "Localisation" },
  { fr: "J'attends", Fang: "Ma yan", category: "Action" },
  { fr: "Je parle le fang", Fang: "Ma kobe fang", category: "Langue" },
  { fr: "J'aime manger", Fang: "Ma gnore dzi", category: "Goût" },
  { fr: "Je fais", Fang: "Ma boh", category: "Action" },
  { fr: "Tu fais", Fang: "wa boh", category: "Action" },
  { fr: "Je t'aime", Fang: "Ma dzime wah", category: "Sentiment" },
  { fr: "Parler", Fang: "kobe", category: "Verbes" },
  { fr: "Nourriture", Fang: "bidzi", category: "Alimentation" },
  { fr: "Arachides", Fang: "Owone", category: "Alimentation" },
  { fr: "Problèmes", Fang: "Bitome", category: "Général" }
];
