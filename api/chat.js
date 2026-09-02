/**
 * TRADITION IA — API ENDPOINT : ASSISTANT IA (CHAT)
 * ==================================================
 * Vercel Serverless Function — /api/chat
 * Reçoit la question de l'utilisateur + historique de conversation,
 * injecte le contexte des langues gabonaises, appelle OpenRouter (NVIDIA / Llama),
 * et retourne la réponse.
 *
 * Variable d'environnement requise sur Vercel :
 *   OPENROUTER_API_KEY — Votre clé API OpenRouter (sk-or-...)
 *   OPENROUTER_MODEL   — (Optionnel) Modèle ex: "nvidia/llama-3.1-nemotron-70b-instruct"
 */

const { buildSystemPrompt } = require('./_knowledge');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'nvidia/llama-3.1-nemotron-70b-instruct';

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
    const { message, history = [], persona = 'tuteur' } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Le champ "message" est requis.' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Clé API OpenRouter manquante : ajoutez la variable OPENROUTER_API_KEY dans les paramètres Vercel.');
    }

    const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
    const systemPrompt = buildSystemPrompt('assistant', persona);

    // Préparer les messages pour OpenRouter
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

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': 'https://tradition-ia.vercel.app',
        'X-Title': 'Tradition IA Gabon'
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
    const reply = data.choices?.[0]?.message?.content || 'Pas de réponse reçue d\'OpenRouter.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('[Tradition IA /api/chat ERROR]', error);

    const friendlyError = error.message?.includes('API_KEY') || error.message?.includes('manquante')
      ? error.message
      : error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('credits')
      ? 'Crédits OpenRouter insuffisants ou quota dépassé. Vérifiez votre compte sur openrouter.ai.'
      : `Erreur IA OpenRouter : ${error.message || 'Impossible de joindre le serveur IA.'}`;

    return res.status(500).json({ error: friendlyError, details: error.message });
  }
};



