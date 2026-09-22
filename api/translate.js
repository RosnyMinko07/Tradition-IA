/**
 * TRADITION IA — API ENDPOINT : TRADUCTION
 * =========================================
 * Vercel Serverless Function — /api/translate
 * Traduit un texte du français vers une langue gabonaise
 * en utilisant le dictionnaire local puis OpenRouter (NVIDIA).
 *
 * Variable d'environnement requise sur Vercel :
 *   OPENROUTER_API_KEY — Votre clé API OpenRouter (sk-or-...)
 *   OPENROUTER_MODEL   — (Optionnel) Modèle ex: "nvidia/llama-3.1-nemotron-70b-instruct"
 */

const { buildSystemPrompt, DICTIONARY_DATA } = require('./_knowledge');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'nvidia/llama-3.1-nemotron-70b-instruct';

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });

  try {
    const { text, sourceLang = 'Français', targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Les champs "text" et "targetLang" sont requis.' });
    }

    // 1. Chercher d'abord dans le dictionnaire local (traduction instantanée, sans API)
    const localTranslation = findInDictionary(text.trim(), targetLang);
    if (localTranslation) {
      return res.status(200).json({
        translation: localTranslation,
        source: 'dictionary',
        isExact: true
      });
    }

    // 2. Traduction via IA (Google Gemini en priorité si GEMINI_API_KEY, sinon OpenRouter)
    const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
    const openRouterKey = (process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.API_KEY || '').trim();

    if (!geminiKey && !openRouterKey) {
      throw new Error('Clé API manquante : configurez GEMINI_API_KEY (ou OPENROUTER_API_KEY) dans les paramètres Vercel.');
    }

    const systemPrompt = buildSystemPrompt('translate');
    const userMessage = `Traduis ce texte du ${sourceLang} vers la langue ${targetLang} : "${text}"

Réponds UNIQUEMENT avec la traduction. Si tu proposes une approximation, ajoute "(approximation)" après.`;

    let translation = '';

    if (geminiKey) {
      // Appel API Google Gemini
      const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 512
          }
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err.error?.message || err.message || response.statusText;
        throw new Error(`Google Gemini API (${response.status}): ${msg}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      translation = candidate?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || '';

    } else {
      // Fallback OpenRouter
      const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://tradition-ia.vercel.app',
          'X-Title': 'Tradition IA Gabon'
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

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err.error?.message || err.message || response.statusText;
        throw new Error(`OpenRouter (${response.status}): ${msg}`);
      }

      const data = await response.json();
      translation = data.choices?.[0]?.message?.content || '';
    }

    if (!translation) {
      translation = 'Traduction indisponible.';
    }

    return res.status(200).json({
      translation: translation.trim(),
      source: 'ai',
      isExact: false
    });

  } catch (error) {
    console.error('[Tradition IA /api/translate ERROR]', error);

    const friendlyError = error.message?.includes('API_KEY') || error.message?.includes('manquante')
      ? error.message
      : 'Erreur de traduction. Réessaie dans quelques instants.';

    return res.status(500).json({ error: friendlyError });
  }
};

// ─── Recherche dans le dictionnaire local ─────────────────────────────────────
function findInDictionary(text, targetLang) {
  const langKey = getLangKey(targetLang);
  if (!langKey) return null;

  // Recherche exacte
  const exact = DICTIONARY_DATA.find(entry =>
    entry.fr.toLowerCase() === text.toLowerCase() && entry[langKey]
  );
  if (exact) return exact[langKey];

  // Recherche dans la traduction elle-même (mots gabonais connus)
  const reverse = DICTIONARY_DATA.find(entry =>
    entry[langKey] && entry[langKey].toLowerCase() === text.toLowerCase()
  );
  if (reverse) return `${reverse.fr} (${targetLang}: ${reverse[langKey]})`;

  return null;
}

function getLangKey(langName) {
  const map = {
    'Fang': 'fang',
    'Punu': 'punu',
    'Myènè': 'myene',
    'Nzébi': 'nzebi',
    'Téké': 'teke',
    'Vili': 'vili',
    'Kota': 'kota',
    'Guisir': 'guisir',
    'Obamba': 'obamba'
  };
  return map[langName] || null;
}



