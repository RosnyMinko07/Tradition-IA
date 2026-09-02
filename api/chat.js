/**
 * TRADITION IA — API ENDPOINT : ASSISTANT IA (CHAT)
 * ==================================================
 * Vercel Serverless Function — /api/chat
 * Reçoit la question de l'utilisateur + historique de conversation,
 * injecte le contexte des langues gabonaises, appelle Gemini/OpenAI,
 * et retourne la réponse.
 *
 * Variables d'environnement Vercel à configurer :
 *   GEMINI_API_KEY  — Clé Google Gemini (Google AI Studio)
 *   OPENAI_API_KEY  — Clé OpenAI (optionnel, si tu utilises OpenAI)
 *   AI_PROVIDER     — "gemini" (défaut) ou "openai"
 */

const { buildSystemPrompt } = require('./_knowledge');

// ─── Constantes ───────────────────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-1.5-flash';
const OPENAI_MODEL = 'gpt-4o-mini';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

// ─── Handler principal ────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS — autoriser les requêtes du front-end
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilise POST.' });
  }

  try {
    const { message, history = [], persona = 'tuteur' } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Le champ "message" est requis.' });
    }

    const provider = process.env.AI_PROVIDER || 'gemini';
    const systemPrompt = buildSystemPrompt('assistant', persona);

    let aiReply;

    if (provider === 'openai') {
      aiReply = await callOpenAI(message, history, systemPrompt);
    } else {
      aiReply = await callGemini(message, history, systemPrompt);
    }

    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('[Tradition IA /api/chat ERROR]', error);

    // Message d'erreur convivial
    const friendlyError = error.message?.includes('API_KEY')
      ? 'Clé API manquante ou invalide. Vérifie tes variables d\'environnement Vercel.'
      : error.message?.includes('quota')
      ? 'Quota API dépassé. Réessaie dans quelques instants.'
      : 'Erreur lors de la connexion à l\'IA. Réessaie dans quelques instants.';

    return res.status(500).json({ error: friendlyError, details: error.message });
  }
};

// ─── Appel Google Gemini ──────────────────────────────────────────────────────
async function callGemini(message, history, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('API_KEY manquante : GEMINI_API_KEY non définie dans Vercel.');

  // Construire l'historique au format Gemini
  const contents = [];

  // Ajouter l'historique de conversation
  for (const msg of history.slice(-10)) { // Garder les 10 derniers messages
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  // Ajouter le message actuel
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const requestBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
    ]
  };

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error ${response.status}: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Réponse vide de Gemini. Vérifie les paramètres de sécurité ou le quota.');
  }

  return text;
}

// ─── Appel OpenAI ─────────────────────────────────────────────────────────────
async function callOpenAI(message, history, systemPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('API_KEY manquante : OPENAI_API_KEY non définie dans Vercel.');

  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  // Ajouter l'historique
  for (const msg of history.slice(-10)) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  }

  messages.push({ role: 'user', content: message });

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error ${response.status}: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Pas de réponse.';
}
