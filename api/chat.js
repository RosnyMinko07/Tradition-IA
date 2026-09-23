/**
 * TRADITION IA — API ENDPOINT : ASSISTANT IA (CHAT)
 * ==================================================
 * Vercel Serverless Function — /api/chat
 * Reçoit la question de l'utilisateur + historique de conversation,
 * injecte le contexte des langues gabonaises, appelle OpenRouter (Qwen),
 * et retourne la réponse.
 *
 * Variable d'environnement requise sur Vercel :
 *   OPENROUTER_API_KEY — Votre clé API OpenRouter (sk-or-...)
 *   OPENROUTER_MODEL   — (Optionnel) Modèle OpenRouter (par défaut : qwen/qwen3-30b-a3b:free)
 */

const { buildSystemPrompt } = require('./_knowledge');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'qwen/qwen3-30b-a3b:free';

module.exports = async function handler(req, res) {
  // CORS
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
    const { message, history = [], persona = 'tuteur' } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Le champ "message" est requis.' });
    }

    const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();
    if (!apiKey) {
      throw new Error('Clé API OpenRouter manquante : ajoutez la variable OPENROUTER_API_KEY dans les paramètres Vercel.');
    }

    const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
    const systemPrompt = buildSystemPrompt('assistant', persona);

    // Construire les messages au format OpenAI (compatible OpenRouter)
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Ajouter l'historique (max 10 derniers messages)
    if (Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        if (!msg || !msg.text || typeof msg.text !== 'string' || !msg.text.trim()) continue;
        const role = msg.role === 'user' ? 'user' : 'assistant';
        messages.push({ role, content: msg.text.trim() });
      }
    }

    // Ajouter le nouveau message utilisateur
    messages.push({ role: 'user', content: message.trim() });

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://tradition-ia.vercel.app',
        'X-Title': 'Tradition IA'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error?.message || errorData.message || response.statusText;
      throw new Error(`OpenRouter API (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';

    if (!reply) {
      throw new Error('Aucune réponse générée par le modèle.');
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('[Tradition IA /api/chat ERROR]', error);

    const friendlyError = error.message?.includes('OPENROUTER_API_KEY') || error.message?.includes('manquante')
      ? error.message
      : error.message?.includes('401') || error.message?.includes('Unauthorized')
      ? 'Clé OPENROUTER_API_KEY invalide. Vérifiez votre clé sur openrouter.ai.'
      : error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')
      ? 'Trop de requêtes. Réessayez dans un instant.'
      : `Erreur Assistant IA : ${error.message || 'Impossible de joindre le serveur.'}`;

    return res.status(500).json({ error: friendlyError, details: error.message });
  }
};
