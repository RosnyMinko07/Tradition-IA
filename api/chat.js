/**
 * TRADITION IA — API ENDPOINT : ASSISTANT IA (CHAT)
 * ==================================================
 * Vercel Serverless Function — /api/chat
 * Reçoit la question de l'utilisateur + historique de conversation,
 * injecte le contexte des langues gabonaises, appelle Google Gemini API,
 * et retourne la réponse.
 *
 * Variable d'environnement requise sur Vercel :
 *   GEMINI_API_KEY — Votre clé API Google Gemini (AIzaSy...)
 *   GEMINI_MODEL   — (Optionnel) Modèle ex: "gemini-1.5-flash" (par défaut)
 */

const { buildSystemPrompt } = require('./_knowledge');

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.0-flash';

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

    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY || '').trim();
    if (!apiKey) {
      throw new Error('Clé API Gemini manquante : ajoutez la variable GEMINI_API_KEY dans les paramètres Vercel.');
    }

    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const systemPrompt = buildSystemPrompt('assistant', persona);

    // Préparer l'historique pour Gemini (rôles "user" et "model")
    const contents = [];

    if (Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        if (!msg || !msg.text || typeof msg.text !== 'string' || !msg.text.trim()) continue;
        const role = msg.role === 'user' ? 'user' : 'model';

        // Gemini n'accepte pas de commencer par un message "model"
        if (contents.length === 0 && role === 'model') {
          continue;
        }

        // Si deux messages consécutifs ont le même rôle, fusionner pour respecter l'alternance Gemini
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += '\n\n' + msg.text.trim();
        } else {
          contents.push({
            role,
            parts: [{ text: msg.text.trim() }]
          });
        }
      }
    }

    // Ajouter le nouveau message utilisateur
    const userText = message.trim();
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += '\n\n' + userText;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: userText }]
      });
    }

    const endpoint = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error?.message || errorData.message || response.statusText;
      throw new Error(`Google Gemini API (${response.status}): ${errMsg}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const reply = candidate?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || '';

    if (!reply) {
      if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
        return res.status(200).json({
          reply: `La réponse n'a pas pu être finalisée (${candidate.finishReason}). Veuillez reformuler votre question.`
        });
      }
      throw new Error("Aucune réponse générée par Gemini.");
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('[Tradition IA /api/chat ERROR]', error);

    const friendlyError = error.message?.includes('GEMINI_API_KEY') || error.message?.includes('manquante')
      ? error.message
      : error.message?.includes('API_KEY_INVALID') || error.message?.includes('403')
      ? 'Clé GEMINI_API_KEY invalide. Vérifiez votre clé sur Google AI Studio.'
      : error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')
      ? 'Quota Gemini atteint ou trop de requêtes temporaires. Réessayez dans un instant.'
      : `Erreur Assistant IA Gemini : ${error.message || 'Impossible de joindre Gemini.'}`;

    return res.status(500).json({ error: friendlyError, details: error.message });
  }
};



