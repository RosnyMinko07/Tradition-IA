/**
 * TRADITION IA — API ENDPOINT : ASSISTANT IA (CHAT)
 * ==================================================
 * Vercel Serverless Function — /api/chat
 * Reçoit la question de l'utilisateur + historique de conversation,
 * injecte le contexte des langues gabonaises, appelle DeepSeek API,
 * et retourne la réponse.
 *
 * Variable d'environnement requise sur Vercel :
 *   DEEPSEEK_API_KEY — Votre clé API DeepSeek (sk-...)
 */

const { buildSystemPrompt } = require('./_knowledge');

const DEEPSEEK_MODEL = 'deepseek-chat';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

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

    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Clé API DeepSeek manquante : ajoutez la variable DEEPSEEK_API_KEY dans les paramètres Vercel.');
    }

    const systemPrompt = buildSystemPrompt('assistant', persona);

    // Préparer les messages pour DeepSeek
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
    const reply = data.choices?.[0]?.message?.content || 'Pas de réponse reçue de DeepSeek.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('[Tradition IA /api/chat ERROR]', error);

    const friendlyError = error.message?.includes('API_KEY') || error.message?.includes('manquante')
      ? error.message
      : error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('Insufficient Balance')
      ? 'Solde ou quota DeepSeek insuffisant. Vérifiez votre compte sur platform.deepseek.com.'
      : `Erreur DeepSeek : ${error.message || 'Impossible de joindre le serveur IA.'}`;

    return res.status(500).json({ error: friendlyError, details: error.message });
  }
};


