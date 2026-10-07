// api/chat.js - Assistant Mbolo IA (Tradition IA - Propulsé par DeepSeek sur OpenRouter)
const { buildSystemPrompt } = require('./_knowledge');

module.exports = async (req, res) => {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Méthode non autorisée',
      message: 'Méthode non autorisée'
    });
  }

  try {
    const { 
      message, 
      history = [], 
      conversationHistory = [], 
      persona = 'tuteur' 
    } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Le message ne peut pas être vide',
        message: 'Le message ne peut pas être vide'
      });
    }

    const trimmedMessage = message.trim();

    // Clé API OpenRouter
    const apiKey = (process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY || '').trim();

    if (!apiKey) {
      console.error('❌ OPENROUTER_API_KEY non configurée');
      return res.status(200).json({
        success: false,
        error: "Clé OPENROUTER_API_KEY manquante sur Vercel.",
        message: "Clé OPENROUTER_API_KEY manquante sur Vercel.",
        reply: "⚠️ La variable **OPENROUTER_API_KEY** n'est pas configurée dans votre projet Vercel.\n\n👉 Allez sur **Vercel → Votre projet → Settings → Environment Variables** et ajoutez votre clé OpenRouter `OPENROUTER_API_KEY`."
      });
    }

    // Détecter si la question porte sur le créateur Rosny
    function isAboutRosny(text) {
      const lowerText = text.toLowerCase();
      const rosnyKeywords = [
        'rosny', 'otsina', 'créateur', 'createur', 'qui t\'a créé', 'qui t a cree',
        'développeur', 'developpeur', 'freelance', 'auteur', 'fondateur',
        'contact développeur', 'rodrigueotsina', 'github.com/rosnyminko07'
      ];
      return rosnyKeywords.some(keyword => lowerText.includes(keyword));
    }

    const aboutRosny = isAboutRosny(trimmedMessage);

    // Prompt Système avec connaissances gabonaises + créateur Rosny
    const baseKnowledgePrompt = typeof buildSystemPrompt === 'function' ? buildSystemPrompt('assistant', persona) : '';

    const devContext = `

CRÉATEUR & DÉVELOPPEUR DE TRADITION IA :
• La plateforme Tradition IA a été conçue et développée par **Rosny OTSINA**, développeur Full Stack freelance basé à Libreville, Gabon.
• Contact développeur : rodrigueotsina@gmail.com | Téléphone : +241 077 12 24 85 | GitHub : https://github.com/RosnyMinko07
• Si l'utilisateur te demande qui t'a créé ou qui a développé Tradition IA, présente Rosny OTSINA avec respect, fierté et bienveillance.
• Pour toute autre question, réponds en tant que **Mbolo IA**, expert des 9 langues et cultures du Gabon.`;

    const fullSystemPrompt = baseKnowledgePrompt + devContext;

    // Normalisation de l'historique
    const unifiedHistory = Array.isArray(conversationHistory) && conversationHistory.length > 0
      ? conversationHistory
      : (Array.isArray(history) ? history : []);

    const messages = [
      { role: "system", content: fullSystemPrompt }
    ];

    // Ajouter l'historique (max 12 messages)
    unifiedHistory.slice(-12).forEach(msg => {
      const role = (msg.role === 'user' || msg.role === 'client') ? 'user' : 'assistant';
      const content = (msg.content || msg.text || '').trim();
      if (content && !content.startsWith('Erreur :') && !content.startsWith('⚠️')) {
        messages.push({ role, content });
      }
    });

    // Ajouter le message actuel
    messages.push({
      role: 'user',
      content: trimmedMessage
    });

    // Modèles DeepSeek prioritaires sur OpenRouter
    const modelsToTry = [
      process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat',
      'deepseek/deepseek-chat',
      'deepseek/deepseek-coder',
      'deepseek/deepseek-r1-distill-qwen-32b'
    ];

    const models = [...new Set(modelsToTry)];

    let aiResponse = null;
    let usedModel = null;
    let lastError = null;

    // Appel direct à l'API DeepSeek sur OpenRouter
    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': req.headers.origin || 'https://tradition-ia.vercel.app',
            'X-Title': 'Tradition IA - Mbolo Chatbot'
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: 1500,
            temperature: 0.7,
            top_p: 0.9
          })
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            aiResponse = reply;
            usedModel = model;
            console.log(`✅ [Tradition IA] Succès DeepSeek OpenRouter (${model})`);
            break;
          }
        } else {
          const errorText = await response.text();
          console.warn(`⚠️ [OpenRouter] Échec avec ${model}:`, response.status, errorText.substring(0, 120));
          lastError = new Error(`OpenRouter (${response.status}): ${errorText.substring(0, 150)}`);
        }
      } catch (err) {
        console.warn(`⚠️ [OpenRouter] Exception ${model}:`, err.message);
        lastError = err;
      }
    }

    if (!aiResponse) {
      const errMsg = lastError?.message || "Erreur de communication avec l'API OpenRouter / DeepSeek.";
      console.error('❌ Échec DeepSeek OpenRouter:', errMsg);
      return res.status(200).json({
        success: false,
        error: errMsg,
        message: errMsg,
        reply: `⚠️ Erreur DeepSeek (OpenRouter) : ${errMsg}\n\nVérifiez que votre clé OPENROUTER_API_KEY est valide et dispose de crédits.`
      });
    }

    return res.status(200).json({
      success: true,
      reply: aiResponse,
      message: aiResponse,
      model: usedModel,
      aboutRosny: aboutRosny
    });

  } catch (error) {
    console.error('❌ [Tradition IA /api/chat] Erreur générale:', error);
    return res.status(200).json({
      success: false,
      error: error.message,
      message: error.message,
      reply: `⚠️ Erreur technique : ${error.message || 'Impossible de contacter DeepSeek.'}`
    });
  }
};