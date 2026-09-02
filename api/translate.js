/**
 * TRADITION IA — API ENDPOINT : TRADUCTION
 * =========================================
 * Vercel Serverless Function — /api/translate
 * Traduit un texte du français vers une langue gabonaise
 * en utilisant le contexte de la base de connaissances locale.
 *
 * Variables d'environnement Vercel à configurer :
 *   GEMINI_API_KEY  — Clé Google Gemini
 *   OPENAI_API_KEY  — Clé OpenAI (optionnel)
 *   AI_PROVIDER     — "gemini" (défaut) ou "openai"
 */

const { buildSystemPrompt, DICTIONARY_DATA } = require('./_knowledge');

const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

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

    // 2. Si pas trouvé localement, utiliser l'IA avec le contexte des langues gabonaises
    const provider = process.env.AI_PROVIDER || 'gemini';
    const systemPrompt = buildSystemPrompt('translate');

    // Construire le message de traduction
    const userMessage = `Traduis ce texte du ${sourceLang} vers la langue ${targetLang} : "${text}"

Réponds UNIQUEMENT avec la traduction. Si tu proposes une approximation, ajoute "(approximation)" après.`;

    let translation;
    if (provider === 'openai') {
      translation = await callOpenAI(userMessage, systemPrompt);
    } else {
      translation = await callGemini(userMessage, systemPrompt);
    }

    return res.status(200).json({
      translation: translation.trim(),
      source: 'ai',
      isExact: false
    });

  } catch (error) {
    console.error('[Tradition IA /api/translate ERROR]', error);

    const friendlyError = error.message?.includes('API_KEY')
      ? 'Clé API manquante. Configure GEMINI_API_KEY dans Vercel.'
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

// ─── Appel Google Gemini ──────────────────────────────────────────────────────
async function callGemini(userMessage, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('API_KEY manquante : GEMINI_API_KEY');

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.3, // Plus bas pour les traductions (plus précis)
        maxOutputTokens: 512
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini ${response.status}: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Traduction indisponible.';
}

// ─── Appel OpenAI ─────────────────────────────────────────────────────────────
async function callOpenAI(userMessage, systemPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('API_KEY manquante : OPENAI_API_KEY');

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
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
    throw new Error(`OpenAI ${response.status}: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Traduction indisponible.';
}
