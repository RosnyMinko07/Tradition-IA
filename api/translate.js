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

    // ── 1. Recherche prioritaire dans _knowledge.js (Dictionnaire & Phrases/Expressions) ──
    const knowledgeResult = findInKnowledge(cleanText, sourceLang, targetLang);
    if (knowledgeResult) {
      logHistory(sourceLang, targetLang, cleanText, knowledgeResult.translation, 'knowledge', knowledgeResult.isExact);
      return res.status(200).json({
        success: true,
        translation: knowledgeResult.translation,
        source: 'knowledge',
        isExact: knowledgeResult.isExact,
        context: knowledgeResult.context || null
      });
    }

    // ── 2. Recherche par découpage mot-à-mot dans le dictionnaire ──
    const wordByWordResult = translateWordByWord(cleanText, targetLang);
    if (wordByWordResult && wordByWordResult.matchesCount > 0) {
      logHistory(sourceLang, targetLang, cleanText, wordByWordResult.translation, 'knowledge_words', false);
      return res.status(200).json({
        success: true,
        translation: wordByWordResult.translation,
        source: 'knowledge_words',
        isExact: false,
        note: wordByWordResult.note
      });
    }

    // ── 3. Appel OpenRouter optionnel (si OPENROUTER_API_KEY est configurée) ──
    const apiKey = (process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY || '').trim();

    if (apiKey) {
      try {
        const isEnglish = (targetLang || '').toLowerCase().includes('anglais') || (targetLang || '').toLowerCase().includes('english');
        const userMessage = isEnglish
          ? `Traduis ce texte du ${sourceLang} vers l'Anglais : "${cleanText}".\nRéponds UNIQUEMENT avec la traduction en anglais, sans phrase d'introduction ni ponctuation superflue.`
          : `Traduis ce texte du ${sourceLang} vers la langue gabonaise ${targetLang} : "${cleanText}".\nRéponds UNIQUEMENT avec la traduction dans la langue locale, sans phrase d'introduction.`;

        const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(OPENROUTER_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': req.headers.origin || 'https://tradition-iavercel.app',
            'X-Title': 'Tradition IA Traducteur'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            temperature: 0.3,
            max_tokens: 512
          })
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const aiTranslation = data.choices?.[0]?.message?.content?.trim();
          if (aiTranslation) {
            logHistory(sourceLang, targetLang, cleanText, aiTranslation, 'ai_openrouter', false);
            return res.status(200).json({
              success: true,
              translation: aiTranslation,
              source: 'ai_openrouter',
              isExact: false
            });
          }
        }
      } catch (apiError) {
        console.warn('⚠️ [Tradition IA] OpenRouter échec, basculement fallback:', apiError.message);
      }
    }

    // ── 4. Fallback intelligent garanti (sans clé API et sans planter) ──
    const fallbackTranslation = generateKnowledgeFallback(cleanText, targetLang);
    logHistory(sourceLang, targetLang, cleanText, fallbackTranslation, 'knowledge_fallback', false);
    return res.status(200).json({
      success: true,
      translation: fallbackTranslation,
      source: 'knowledge_fallback',
      isExact: false
    });

  } catch (error) {
    console.error('[Tradition IA /api/translate ERROR]', error);
    return res.status(200).json({ 
      success: true,
      translation: "Traduction en cours d'intégration dans cette langue.",
      source: 'fallback'
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

