/**
 * TRADITION IA — API ENDPOINT : ASSISTANT IA (CHAT)
 * ==================================================
 * Vercel Serverless Function — /api/chat
 * Reçoit la question de l'utilisateur + historique de conversation,
 * injecte le contexte des langues gabonaises, appelle DeepSeek / Gemini / OpenAI,
 * et retourne la réponse.
 *
 * Variables d'environnement Vercel supportées :
 *   DEEPSEEK_API_KEY — Clé DeepSeek (recommandé si vous utilisez DeepSeek)
 *   GEMINI_API_KEY   — Clé Google Gemini (Google AI Studio)
 *   OPENAI_API_KEY   — Clé OpenAI
 *   AI_PROVIDER      — "deepseek", "gemini", ou "openai" (auto-détecté si omis)
 */

const { buildSystemPrompt } = require('./_knowledge');

// ─── Constantes & Modèles ───────────────────────────────────────────────────
const DEEPSEEK_MODEL = 'deepseek-chat';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const OPENAI_MODEL = 'gpt-4o-mini';
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

    // Détection intelligente du fournisseur selon les clés disponibles
    let provider = (process.env.AI_PROVIDER || '').toLowerCase().trim();
    if (!provider) {
      if (process.env.DEEPSEEK_API_KEY) {
        provider = 'deepseek';
      } else if (process.env.GEMINI_API_KEY) {
        provider = 'gemini';
      } else if (process.env.OPENAI_API_KEY) {
        provider = 'openai';
      } else {
        provider = 'deepseek'; // Fournisseur par défaut
      }
    }

    const systemPrompt = buildSystemPrompt('assistant', persona);
    let aiReply;

    if (provider === 'deepseek') {
      aiReply = await callDeepSeek(message, history, systemPrompt);
    } else if (provider === 'openai') {
      aiReply = await callOpenAI(message, history, systemPrompt);
    } else {
      aiReply = await callGemini(message, history, systemPrompt);
    }

    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('[Tradition IA /api/chat ERROR]', error);

    // Message d'erreur convivial
    const friendlyError = error.message?.includes('API_KEY')
      ? error.message
      : error.message?.includes('quota') || error.message?.includes('429')
      ? 'Quota API dépassé ou solde insuffisant. Réessaie dans quelques instants.'
      : `Erreur IA : ${error.message || 'Impossible de joindre le serveur IA.'}`;

    return res.status(500).json({ error: friendlyError, details: error.message });
  }
};

// ─── Appel DeepSeek ──────────────────────────────────────────────────────────
async function callDeepSeek(message, history, systemPrompt) {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Clé API DeepSeek manquante : ajoutez la variable DEEPSEEK_API_KEY dans les paramètres Vercel.');
  }

  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  for (const msg of history.slice(-10)) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  }

  messages.push({ role: 'user', content: message });

  const response = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData.error?.message || errorData.message || response.statusText;
    throw new Error(`DeepSeek API (${response.status}): ${errMsg}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Pas de réponse reçue de DeepSeek.';
}

// ─── Appel Google Gemini ──────────────────────────────────────────────────────
async function callGemini(message, history, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Clé API Gemini manquante : ajoutez GEMINI_API_KEY dans Vercel.');
  }

  const contents = [];

  for (const msg of history.slice(-10)) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

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
    }
  };

  const response = await fetch(`${GEMINI_URL}?key=${apiKey.trim()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API (${response.status}): ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Réponse vide de Gemini. Vérifiez les paramètres de sécurité ou le quota.');
  }

  return text;
}

// ─── Appel OpenAI ─────────────────────────────────────────────────────────────
async function callOpenAI(message, history, systemPrompt) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Clé API OpenAI manquante : ajoutez OPENAI_API_KEY dans Vercel.');
  }

  const messages = [
    { role: 'system', content: systemPrompt }
  ];

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
      'Authorization': `Bearer ${apiKey.trim()}`
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
    throw new Error(`OpenAI API (${response.status}): ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Pas de réponse reçue d\'OpenAI.';
}

