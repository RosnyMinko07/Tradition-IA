// api/chat.js - Assistant Mbolo IA (Tradition IA & Langues Gabonaises)
const { DICTIONARY_DATA, PHRASES_DATA, LANGUAGES_DATA, buildSystemPrompt } = require('./_knowledge');

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

    // Clé API OpenRouter (optionnelle : si absente, la base locale répond sans erreur)
    const apiKey = (process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY || '').trim();

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

    // ── Construction du Prompt Système (Mbolo IA + Contexte Culturel + Connaissance Rosny) ──
    const baseKnowledgePrompt = typeof buildSystemPrompt === 'function' ? buildSystemPrompt('assistant', persona) : '';

    const devContext = `

CRÉATEUR & DÉVELOPPEMENT DE TRADITION IA :
• La plateforme Tradition IA a été conçue et développée par **Rosny OTSINA**, développeur Full Stack freelance basé à Libreville, Gabon.
• Contact développeur : rodrigueotsina@gmail.com | Téléphone : +241 077 12 24 85 | GitHub : https://github.com/RosnyMinko07
• Si un utilisateur te demande qui t'a créé ou qui a développé Tradition IA, présente Rosny OTSINA avec respect, fierté et bienveillance.
• Pour toute autre question, reste pleinement dans ton rôle d'assistant linguistique et culturel **Mbolo IA**, dédié aux 9 langues du Gabon.`;

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
      if (content && !content.startsWith('Erreur :')) {
        messages.push({ role, content });
      }
    });

    // Ajouter le message actuel
    messages.push({
      role: 'user',
      content: trimmedMessage
    });

    let aiResponse = null;
    let usedModel = null;

    // ── 1. Tentative avec OpenRouter si la clé API est configurée ──
    if (apiKey) {
      const candidateModels = [
        process.env.OPENROUTER_MODEL,
        'deepseek/deepseek-chat',
        'qwen/qwen3-30b-a3b:free',
        'deepseek/deepseek-r1-distill-qwen-32b',
        'deepseek/deepseek-coder'
      ].filter(Boolean);

      const openRouterModels = [...new Set(candidateModels)];

      for (const model of openRouterModels) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 22000); // Timeout 22s

          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': req.headers.origin || 'https://tradition-iavercel.app',
              'X-Title': 'Tradition IA - Mbolo Chatbot'
            },
            body: JSON.stringify({
              model: model,
              messages: messages,
              max_tokens: 1200,
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
              console.log(`✅ [Tradition IA] Succès OpenRouter avec : ${model}`);
              break;
            }
          }
        } catch (modelError) {
          console.warn(`⚠️ [Tradition IA] Erreur OpenRouter (${model}):`, modelError.message);
        }
      }
    }

    // ── 2. Moteur de réponse autonome basé sur _knowledge.js (quand pas de clé API) ──
    if (!aiResponse) {
      usedModel = 'Moteur Tradition IA (Base _knowledge.js)';
      aiResponse = generateResponseFromKnowledge(trimmedMessage, aboutRosny);
    }

    // Réponse au format attendu par Tradition IA et le front-end
    return res.status(200).json({
      success: true,
      reply: aiResponse,
      message: aiResponse,
      model: usedModel,
      aboutRosny: aboutRosny
    });

  } catch (error) {
    console.error('❌ [Tradition IA /api/chat] Erreur générale:', error);

    const fallbackReply = "🇬🇦 **Mbolo !** Je suis l'assistant **Mbolo IA** de Tradition IA.\n\n" +
      "Je suis là pour vous faire découvrir les 9 langues du Gabon (Fang, Punu, Myènè, Nzébi, Téké, Vili, Obamba, Guisir, Kota).\n\n" +
      "Posez-moi une question sur une salutation, un mot ou la culture gabonaise !";

    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      message: fallbackReply,
      model: 'Mode Local'
    });
  }
};

// ─── Générateur de réponse intelligente tirée de _knowledge.js ────────────────
function generateResponseFromKnowledge(message, aboutRosny) {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Question sur le créateur Rosny
  if (aboutRosny) {
    return `👋 **À propos du concepteur de Tradition IA :**\n\n` +
      `La plateforme **Tradition IA** a été conçue et développée par **Rosny OTSINA**, développeur Full Stack freelance gabonais basé à Libreville.\n\n` +
      `• 📍 **Localisation :** Libreville, Gabon\n` +
      `• 📧 **Email :** rodrigueotsina@gmail.com\n` +
      `• 📞 **Téléphone :** +241 077 12 24 85\n` +
      `• 💻 **GitHub :** [github.com/RosnyMinko07](https://github.com/RosnyMinko07)\n\n` +
      `✨ Rosny a créé ce projet pour préserver, numériser et valoriser le patrimoine linguistique et traditionnel des 9 provinces du Gabon !`;
  }

  // 2. Recherche directe de mot ou expression dans le dictionnaire
  if (Array.isArray(DICTIONARY_DATA)) {
    const matchedWords = DICTIONARY_DATA.filter(entry => {
      const frNorm = (entry.fr || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return lower.includes(frNorm) && frNorm.length > 2;
    });

    if (matchedWords.length > 0) {
      const top = matchedWords[0];
      let reply = `💡 **Vocabulaire gabonais pour "${top.fr}" :**\n\n`;
      if (top.fang) reply += `• **Fang** : **${top.fang}**\n`;
      if (top.punu) reply += `• **Punu** : **${top.punu}**\n`;
      if (top.myene) reply += `• **Myènè** : **${top.myene}**\n`;
      if (top.nzebi) reply += `• **Nzébi** : **${top.nzebi}**\n`;
      if (top.teke) reply += `• **Téké** : **${top.teke}**\n`;
      if (top.vili) reply += `• **Vili** : **${top.vili}**\n`;
      if (top.kota) reply += `• **Kota** : **${top.kota}**\n`;
      if (top.guisir) reply += `• **Guisir** : **${top.guisir}**\n`;
      if (top.obamba) reply += `• **Obamba** : **${top.obamba}**\n`;
      reply += `\n*(Catégorie : ${top.category || 'Général'})* 🇬🇦`;
      return reply;
    }
  }

  // 3. Recherche dans les phrases et proverbes
  if (Array.isArray(PHRASES_DATA)) {
    const matchedPhrase = PHRASES_DATA.find(p => {
      const frNorm = (p.fr || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return lower.includes(frNorm) || (p.fang && lower.includes(p.fang.toLowerCase()));
    });

    if (matchedPhrase) {
      let reply = `📜 **Expression gabonaise : "${matchedPhrase.fr}"**\n\n`;
      if (matchedPhrase.fang) reply += `• **Fang** : **${matchedPhrase.fang}**\n`;
      if (matchedPhrase.punu) reply += `• **Punu** : **${matchedPhrase.punu}**\n`;
      if (matchedPhrase.myene) reply += `• **Myènè** : **${matchedPhrase.myene}**\n`;
      if (matchedPhrase.sens) reply += `\n*Sens traditionnel :* ${matchedPhrase.sens}\n`;
      if (matchedPhrase.context) reply += `\n*Usage :* ${matchedPhrase.context}`;
      return reply;
    }
  }

  // 4. Questions sur une langue spécifique
  if (Array.isArray(LANGUAGES_DATA)) {
    const matchedLang = LANGUAGES_DATA.find(l => lower.includes(l.name.toLowerCase()));
    if (matchedLang) {
      return `🇬🇦 **La langue ${matchedLang.name} (${matchedLang.nativeName}) :**\n\n` +
        `• **Famille linguistique :** ${matchedLang.family}\n` +
        `• **Régions principales :** ${matchedLang.region}\n` +
        `• **Locuteurs estimés :** ${matchedLang.speakers}\n` +
        `• **Particularités :** ${matchedLang.notes}\n\n` +
        `Vous pouvez me demander la traduction de mots du quotidien (bonjour, merci, eau, maison, famille) en ${matchedLang.name} !`;
    }
  }

  // 5. Salutations
  if (lower.includes('bonjour') || lower.includes('mbolo') || lower.includes('salut') || lower.includes('coucou')) {
    return `🇬🇦 **Mbolo !** (Bonjour !)\n\n` +
      `Au Gabon, **Mbolo** est le mot d'accueil et de fraternité universel, partagé par la majorité de nos peuples (Fang, Punu, Myènè, Guisir, Kota).\n\n` +
      `Je suis **Mbolo IA**, votre assistant culturel. Vous pouvez me poser des questions sur :\n` +
      `• La traduction de mots ou de phrases complètes\n` +
      `• Les expressions et proverbes ancestraux\n` +
      `• L'histoire des masques traditionnels (Mukudj, Ngil, Kota)\n` +
      `• Les 9 langues du Gabon`;
  }

  // 6. Proverbes
  if (lower.includes('proverbe') || lower.includes('conte') || lower.includes('sagesse')) {
    const proverbe = (PHRASES_DATA || []).find(p => p.type === 'proverbe') || {
      fr: "L'éléphant ne sent pas le poids de sa trompe.",
      fang: "Nzok é kiki abim e ñgôl.",
      sens: "Chacun est capable de supporter ses propres responsabilités."
    };
    return `📜 **Proverbe gabonais :**\n\n` +
      `> « ${proverbe.fr} »\n\n` +
      `• **En Fang :** *${proverbe.fang || 'Nzok é kiki abim e ñgôl'}*\n` +
      `• **Signification :** ${proverbe.sens || 'Chacun assume sa propre charge avec force.'}`;
  }

  // 7. Masques et culture
  if (lower.includes('masque') || lower.includes('culture') || lower.includes('tradition') || lower.includes('bwiti')) {
    return `🎭 **Le patrimoine culturel et les masques du Gabon :**\n\n` +
      `• **Le Masque Mukudj (Punu)** : Peint au kaolin blanc, il incarne la grâce féminine ancestrale et la sérénité lors des danses sur échasses.\n` +
      `• **Le Masque Ngil (Fang)** : Masque longiligne en bois clair, emblème de droiture et de justice communautaire.\n` +
      `• **Les Figures de reliquaire Kota** : Sculptures gardiennes ornées de laiton et de cuivre honorant les ancêtres.\n` +
      `• **Le Mvet** : Récit épique et instrument de musique sacré accompagnant les contes initiatiques Fang.\n\n` +
      `Quelle tradition ou ethnie vous intéresse le plus ?`;
  }

  // 8. Réponse générale chaleureuse
  return `🇬🇦 **Mbolo ! Je suis Mbolo IA, l'assistant des langues gabonaises.**\n\n` +
    `Je suis prêt à vous répondre sur les 9 langues du Gabon (Fang, Punu, Myènè, Nzébi, Téké, Vili, Guisir, Kota, Obamba).\n\n` +
    `Vous pouvez me demander par exemple :\n` +
    `• *"Comment dit-on merci en Punu ?"*\n` +
    `• *"Traduis maison en Fang"*\n` +
    `• *"Raconte-moi l'histoire du masque Mukudj"*\n` +
    `• *"Donne-moi un proverbe gabonais"*`;
}