/**
 * TRADITION IA — API ENDPOINT : TRADUCTION
 * =========================================
 * Vercel Serverless Function — /api/translate
 * Traduit un texte du français vers une langue gabonaise (ou inversement).
 * Les réponses sont tirées en priorité absolue de api/_knowledge.js
 * (mots du dictionnaire DICTIONARY_DATA et expressions PHRASES_DATA).
 * Si une clé OpenRouter est présente, elle enrichit la traduction pour les phrases inédites.
 * Si aucune clé n'est configurée, l'API fonctionne en autonomie sans jamais renvoyer d'erreur.
 */

const { DICTIONARY_DATA, PHRASES_DATA, buildSystemPrompt } = require('./_knowledge');
let pool = null;
try {
  pool = require('./db').pool;
} catch (e) {}

async function logHistory(sourceLang, targetLang, sourceText, translatedText, sourceMoteur, isExact) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO historique_traductions (langue_source, langue_cible, texte_source, texte_traduit, source_moteur, est_exact)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sourceLang || 'Français', targetLang, sourceText, translatedText, sourceMoteur || 'knowledge', isExact ? 1 : 0]
    );
  } catch (err) {
    // Ne pas bloquer la réponse en cas d'erreur de journalisation
  }
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'deepseek/deepseek-chat';

async function fetchAiTranslation(cleanText, sourceLang, targetLang, apiKey) {
  const isEnglish = (targetLang || '').toLowerCase().includes('anglais') || (targetLang || '').toLowerCase().includes('english');
  const userMessage = isEnglish
    ? `Traduis ce texte du ${sourceLang} vers l'Anglais : "${cleanText}".\nRéponds UNIQUEMENT avec la traduction en anglais, sans phrase d'introduction, sans guillemets superflus.`
    : `Traduis ce texte du ${sourceLang} vers la langue gabonaise ${targetLang} : "${cleanText}".\nRéponds UNIQUEMENT avec la traduction dans la langue locale, sans phrase d'introduction ni explication.`;

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://tradition-ia.vercel.app',
      'X-Title': 'Tradition IA Traducteur'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt('translate') },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3,
      max_tokens: 512
    })
  });

  clearTimeout(timeoutId);
  if (response.ok) {
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  }
  return null;
}

module.exports = async function handler(req, res) {
  // En-têtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Méthode non autorisée.' });

  try {
    const { text, sourceLang = 'Français', targetLang } = req.body || {};

    if (!text || typeof text !== 'string' || !text.trim() || !targetLang) {
      return res.status(400).json({ 
        success: false, 
        error: 'Les champs "text" et "targetLang" sont requis.' 
      });
    }

    const cleanText = text.trim();
    const isEnglish = (targetLang || '').toLowerCase().includes('anglais') || (targetLang || '').toLowerCase().includes('english')
                   || (sourceLang || '').toLowerCase().includes('anglais') || (sourceLang || '').toLowerCase().includes('english');

    // ── 1. Traduction vers ou depuis l'Anglais ──────────────────────────────────
    if (isEnglish) {
      // Priorité A : Modèle IA via OpenRouter (si clé configurée)
      const apiKey = (process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY || '').trim();
      if (apiKey) {
        try {
          const aiTrans = await fetchAiTranslation(cleanText, sourceLang, targetLang, apiKey);
          if (aiTrans) {
            logHistory(sourceLang, targetLang, cleanText, aiTrans, 'traduction', true);
            return res.status(200).json({ success: true, translation: aiTrans });
          }
        } catch (e) {}
      }

      // Priorité B : Service direct de traduction haute fidélité
      try {
        const pair = (sourceLang.toLowerCase().includes('anglais') || sourceLang.toLowerCase().includes('english'))
          ? 'en|fr'
          : 'fr|en';
        const freeRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=${pair}`);
        if (freeRes.ok) {
          const data = await freeRes.json();
          if (data && data.responseData && data.responseData.translatedText) {
            const cleanEn = data.responseData.translatedText.trim();
            logHistory(sourceLang, targetLang, cleanText, cleanEn, 'traduction', true);
            return res.status(200).json({ success: true, translation: cleanEn });
          }
        }
      } catch (e) {}

      // Priorité C : Dictionnaire local anglais
      const fallbackEn = generateKnowledgeFallback(cleanText, targetLang);
      logHistory(sourceLang, targetLang, cleanText, fallbackEn, 'traduction', true);
      return res.status(200).json({ success: true, translation: fallbackEn });
    }

    // ── 2. Langues gabonaises : Recherche exacte dans le corpus ───────────────
    const knowledgeResult = findInKnowledge(cleanText, sourceLang, targetLang);
    if (knowledgeResult) {
      logHistory(sourceLang, targetLang, cleanText, knowledgeResult.translation, 'traduction', true);
      return res.status(200).json({
        success: true,
        translation: knowledgeResult.translation
      });
    }

    // ── 3. Langues gabonaises : Découpage mot-à-mot ───────────────────────────
    const wordByWordResult = translateWordByWord(cleanText, targetLang);
    if (wordByWordResult && wordByWordResult.matchesCount > 0) {
      logHistory(sourceLang, targetLang, cleanText, wordByWordResult.translation, 'traduction', true);
      return res.status(200).json({
        success: true,
        translation: wordByWordResult.translation
      });
    }

    // ── 4. Langues gabonaises : Modèle IA (si clé disponible) ─────────────────
    const apiKey = (process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY || '').trim();
    if (apiKey) {
      try {
        const aiTranslation = await fetchAiTranslation(cleanText, sourceLang, targetLang, apiKey);
        if (aiTranslation) {
          logHistory(sourceLang, targetLang, cleanText, aiTranslation, 'traduction', false);
          return res.status(200).json({
            success: true,
            translation: aiTranslation
          });
        }
      } catch (apiError) {
        console.warn('⚠️ [Tradition IA] OpenRouter échec, basculement fallback:', apiError.message);
      }
    }

    // ── 5. Fallback par défaut ───────────────────────────────────────────────
    const fallbackTranslation = generateKnowledgeFallback(cleanText, targetLang);
    logHistory(sourceLang, targetLang, cleanText, fallbackTranslation, 'traduction', false);
    return res.status(200).json({
      success: true,
      translation: fallbackTranslation
    });

  } catch (error) {
    console.error('[Tradition IA /api/translate ERROR]', error);
    return res.status(200).json({ 
      success: true,
      translation: "Traduction en cours d'intégration dans cette langue."
    });
  }
};

// ─── Recherche dans la base _knowledge.js (Dictionnaire & Expressions) ────────
function findInKnowledge(text, sourceLang, targetLang) {
  const langKey = getLangKey(targetLang);
  if (!langKey) return null;

  const normalized = normalizeText(text);
  const compact = stripAll(text);

  // A. Recherche dans les phrases, expressions, proverbes (PHRASES_DATA)
  if (Array.isArray(PHRASES_DATA)) {
    // 1. Correspondance exacte français
    const exactPhrase = PHRASES_DATA.find(p => {
      if (!p.fr || !p[langKey]) return false;
      return normalizeText(p.fr) === normalized || stripAll(p.fr) === compact;
    });
    if (exactPhrase) {
      return { translation: exactPhrase[langKey], isExact: true, context: exactPhrase.context };
    }

    // 2. Correspondance inverse (texte gabonais tapé par l'utilisateur -> français)
    const reversePhrase = PHRASES_DATA.find(p => {
      if (!p[langKey]) return false;
      return normalizeText(p[langKey]) === normalized || stripAll(p[langKey]) === compact;
    });
    if (reversePhrase) {
      return { translation: reversePhrase.fr, isExact: true, context: reversePhrase.context };
    }

    // 3. Inclusion de phrase (ex: si le texte utilisateur inclut l'expression ou inversement)
    const partialPhrase = PHRASES_DATA.find(p => {
      if (!p.fr || !p[langKey]) return false;
      const pNorm = normalizeText(p.fr);
      return pNorm && pNorm.length >= 4 && (normalized.includes(pNorm) || (normalized.length >= 6 && pNorm.includes(normalized)));
    });
    if (partialPhrase) {
      return { translation: partialPhrase[langKey], isExact: true, context: partialPhrase.context };
    }
  }

  // B. Recherche dans le dictionnaire de mots (DICTIONARY_DATA)
  if (Array.isArray(DICTIONARY_DATA)) {
    // 1. Recherche exacte français -> langue locale
    const exactWord = DICTIONARY_DATA.find(d => {
      if (!d.fr || !d[langKey]) return false;
      return normalizeText(d.fr) === normalized || stripAll(d.fr) === compact;
    });
    if (exactWord) {
      return { translation: exactWord[langKey], isExact: true, context: exactWord.category };
    }

    // 2. Recherche inverse (mot gabonais -> français)
    const reverseWord = DICTIONARY_DATA.find(d => {
      if (!d[langKey]) return false;
      return normalizeText(d[langKey]) === normalized || stripAll(d[langKey]) === compact;
    });
    if (reverseWord) {
      return { translation: reverseWord.fr, isExact: true, context: reverseWord.category };
    }
  }

  return null;
}

// ─── Traduction mot-à-mot depuis le dictionnaire ─────────────────────────────
function translateWordByWord(text, targetLang) {
  const langKey = getLangKey(targetLang);
  if (!langKey || !Array.isArray(DICTIONARY_DATA)) return null;

  // Découper la phrase en tokens
  const words = text.split(/[\s,.'?!;:()]+/).filter(w => w.trim().length > 0);
  if (words.length <= 1) return null;

  let matchesCount = 0;
  const translatedWords = words.map(word => {
    const norm = normalizeText(word);
    const compactWord = stripAll(word);
    const match = DICTIONARY_DATA.find(d => d.fr && (normalizeText(d.fr) === norm || stripAll(d.fr) === compactWord) && d[langKey]);
    if (match) {
      matchesCount++;
      return match[langKey];
    }
    return word; // Conserver le mot tel quel si non trouvé
  });

  // Ne renvoyer une traduction mot-à-mot que si TOUS les mots ont été trouvés dans le dictionnaire
  // afin d'éviter les mélanges incompréhensibles entre français et langue locale
  if (matchesCount === words.length && matchesCount > 0) {
    return {
      translation: translatedWords.join(' '),
      matchesCount,
      note: `${matchesCount} mot(s) traduit(s) depuis le dictionnaire ${targetLang}.`
    };
  }

  return null;
}

// ─── Fallback sobre et clair quand la traduction n'est pas encore disponible ──
function generateKnowledgeFallback(text, targetLang) {
  const isEnglish = (targetLang || '').toLowerCase().includes('anglais') || (targetLang || '').toLowerCase().includes('english');
  if (isEnglish) {
    const basicFrToEn = {
      'bonjour': 'Hello',
      'bonsoir': 'Good evening',
      'salut': 'Hi',
      'merci': 'Thank you',
      'merci beaucoup': 'Thank you very much',
      's\'il vous plait': 'Please',
      's il vous plait': 'Please',
      'oui': 'Yes',
      'non': 'No',
      'bienvenue': 'Welcome',
      'comment allez-vous': 'How are you?',
      'comment tu vas': 'How are you doing?',
      'au revoir': 'Goodbye',
      'a bientot': 'See you soon',
      'bonne nuit': 'Good night',
      'bonne journee': 'Have a good day',
      'bonne chance': 'Good luck',
      'je t\'aime': 'I love you',
      'je taime': 'I love you',
      'mon ami': 'My friend'
    };
    const norm = normalizeText(text);
    if (basicFrToEn[norm]) return basicFrToEn[norm];
  }
  return "Traduction en cours d'intégration dans cette langue.";
}

// ─── Correspondance des noms de langues ───────────────────────────────────────
function getLangKey(langName) {
  if (!langName) return null;
  const map = {
    'Fang': 'fang',
    'Punu': 'punu',
    'Myènè': 'myene',
    'Myene': 'myene',
    'Nzébi': 'nzebi',
    'Nzebi': 'nzebi',
    'Téké': 'teke',
    'Teke': 'teke',
    'Vili': 'vili',
    'Kota': 'kota',
    'Guisir': 'guisir',
    'Obamba': 'obamba',
    'Anglais': 'anglais',
    'English': 'anglais'
  };
  return map[langName] || map[Object.keys(map).find(k => k.toLowerCase() === langName.toLowerCase())] || null;
}

function normalizeText(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer accents pour comparaison robuste
    .replace(/[-_']/g, ' ') // Remplacer tirets, underscores et apostrophes par un espace
    .replace(/[.,\/#!$%\^&\*;:{}=`~()?"«»?]/g, '') // Retirer ponctuation restante
    .replace(/\s+/g, ' ') // Compacter les espaces multiples
    .trim();
}

function stripAll(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

