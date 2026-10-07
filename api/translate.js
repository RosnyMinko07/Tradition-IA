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
      // Si la majorité des mots importants sont traduits
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
        const systemPrompt = typeof buildSystemPrompt === 'function' ? buildSystemPrompt('translate') : '';
        const userMessage = `Traduis ce texte du ${sourceLang} vers la langue gabonaise ${targetLang} : "${cleanText}".
Réponds UNIQUEMENT avec la traduction dans la langue locale, sans phrase d'introduction.`;

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
      translation: `${text} (Traduction ${targetLang} en cours d'intégration)`,
      source: 'fallback'
    });
  }
};

// ─── Recherche dans la base _knowledge.js (Dictionnaire & Expressions) ────────
function findInKnowledge(text, sourceLang, targetLang) {
  const langKey = getLangKey(targetLang);
  if (!langKey) return null;

  const normalized = normalizeText(text);

  // A. Recherche dans les phrases, expressions, proverbes (PHRASES_DATA)
  if (Array.isArray(PHRASES_DATA)) {
    // 1. Correspondance exacte français
    const exactPhrase = PHRASES_DATA.find(p => p.fr && normalizeText(p.fr) === normalized && p[langKey]);
    if (exactPhrase) {
      return { translation: exactPhrase[langKey], isExact: true, context: exactPhrase.context };
    }

    // 2. Correspondance inverse (texte gabonais tapé par l'utilisateur -> français)
    const reversePhrase = PHRASES_DATA.find(p => p[langKey] && normalizeText(p[langKey]) === normalized);
    if (reversePhrase) {
      return { translation: reversePhrase.fr, isExact: true, context: reversePhrase.context };
    }

    // 3. Inclusion de phrase (ex: ponctuation ou formule proche)
    const partialPhrase = PHRASES_DATA.find(p => p.fr && p[langKey] && (normalized.includes(normalizeText(p.fr)) || normalizeText(p.fr).includes(normalized)));
    if (partialPhrase) {
      return { translation: partialPhrase[langKey], isExact: true, context: partialPhrase.context };
    }
  }

  // B. Recherche dans le dictionnaire de mots (DICTIONARY_DATA)
  if (Array.isArray(DICTIONARY_DATA)) {
    // 1. Recherche exacte français -> langue locale
    const exactWord = DICTIONARY_DATA.find(d => d.fr && normalizeText(d.fr) === normalized && d[langKey]);
    if (exactWord) {
      return { translation: exactWord[langKey], isExact: true, context: exactWord.category };
    }

    // 2. Recherche inverse (mot gabonais -> français)
    const reverseWord = DICTIONARY_DATA.find(d => d[langKey] && normalizeText(d[langKey]) === normalized);
    if (reverseWord) {
      return { translation: `${reverseWord.fr} (${targetLang}: ${reverseWord[langKey]})`, isExact: true, context: reverseWord.category };
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
    const match = DICTIONARY_DATA.find(d => d.fr && normalizeText(d.fr) === norm && d[langKey]);
    if (match) {
      matchesCount++;
      return match[langKey];
    }
    return word; // Conserver le mot tel quel si non trouvé
  });

  if (matchesCount > 0) {
    return {
      translation: translatedWords.join(' '),
      matchesCount,
      note: `${matchesCount} mot(s) traduit(s) depuis le dictionnaire ${targetLang}.`
    };
  }

  return null;
}

// ─── Fallback d'expression approchante ou salutation ──────────────────────────
function generateKnowledgeFallback(text, targetLang) {
  const langKey = getLangKey(targetLang);

  // Mots de salutations et courtoisie de base par langue
  const baseGreetings = {
    'fang': 'Mbolo (Bonjour) / Akiba (Merci)',
    'punu': 'Mbolo (Bonjour) / Yine (Merci)',
    'myene': 'Mbolo (Bonjour) / Ogula (Merci)',
    'nzebi': 'Mbolo (Bonjour) / Bassi (Merci)',
    'teke': 'Mbolo (Bonjour) / Nzala (Merci)',
    'vili': 'Mbolo (Bonjour) / Nsungi (Merci)',
    'kota': 'Mbolo (Bonjour) / Mbenge (Merci)',
    'guisir': 'Mbolo (Bonjour) / Yine moke (Merci)',
    'obamba': 'Mbolo (Bonjour) / Ndeke (Merci)'
  };

  const base = baseGreetings[langKey] || 'Mbolo';
  return `[${targetLang}] ${text} — (Note : Vocabulaire de base : ${base})`;
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
    'Obamba': 'obamba'
  };
  return map[langName] || map[Object.keys(map).find(k => k.toLowerCase() === langName.toLowerCase())] || null;
}

function normalizeText(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer accents pour comparaison robuste
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"«»]/g, '') // Retirer ponctuation
    .trim();
}
