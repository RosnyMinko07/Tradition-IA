// api/chatbot.js - Chatbot polyvalent (Rosny + questions générales)
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
      message: 'Méthode non autorisée'
    });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le message ne peut pas être vide'
      });
    }

    // Vérifier la clé API OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error('❌ OPENROUTER_API_KEY n\'est pas configurée');
      return res.status(500).json({
        success: false,
        message: 'Configuration API manquante.'
      });
    }

    // Fonction pour détecter si c'est une question sur Rosny
    function isAboutRosny(text) {
      const lowerText = text.toLowerCase();
      const rosnyKeywords = [
        'rosny', 'otsina', 'développeur', 'freelance', 'portfolio',
        'compétence', 'projet', 'contact', 'email', 'téléphone',
        'github', 'linkedin', 'cv', 'expérience', 'formation',
        'service', 'tarif', 'prix', 'mission', 'client',
        'html', 'css', 'javascript', 'php', 'laravel', 'node',
        'python', 'flutter', 'react', 'vue', 'java',
        'mysql', 'mongodb', 'base de données', 'web', 'mobile'
      ];

      return rosnyKeywords.some(keyword => lowerText.includes(keyword));
    }

    // Construire le système de messages adaptatif
    const messages = [];

    // Déterminer si c'est une question sur Rosny
    const aboutRosny = isAboutRosny(message);

    if (aboutRosny) {
      // Mode "Assistant de Rosny"
      messages.push({
        role: "system",
        content: `Tu es l'assistant personnel de Rosny OTSINA, développeur web et mobile freelance.

INFORMATIONS SUR ROSNY:
• Nom: Rosny OTSINA
• Profession: Développeur Full Stack Freelance
• Localisation: Libreville, Gabon
• Email: rodrigueotsina@gmail.com
• Téléphone: +241 077 12 24 85
• GitHub: https://github.com/RosnyMinko07

COMPÉTENCES TECHNIQUES:
• Frontend: HTML/CSS/JavaScript, Vue.js/React.js, Bootstrap
• Backend: PHP/Laravel, Node.js/Express.js, Python/Django, Java
• Mobile: Flutter, Android (Java/Kotlin)
• Bases de données: MySQL, PostgreSQL, MongoDB
• DevOps: Docker, CI/CD, Sécurité, Déploiement

PROJETS RÉALISÉS:
1. Application de traduction des langues gabonaises
2. Système de facturation TECH INFO PLUS
3. Application de gestion des notes
4. Shopping App & Food App (e-commerce)
5. Site immobilier complet
6. Application Permis Virtuel

SERVICES:
- Développement d'applications web et mobiles
- Création d'API REST
- Conception de bases de données
- Audit de sécurité informatique
- Maintenance et support technique
- Formation et consultation

TON RÔLE:
- Réponds en français de manière professionnelle et amicale
- Pour les questions sur Rosny, utilise les informations ci-dessus
- Pour les autres questions, réponds normalement comme un assistant IA
- Encourage le contact pour les projets professionnels
- Utilise des emojis modérément
- Sois concis mais informatif

NE DIS PAS que tu es une IA, présente-toi comme l'assistant de Rosny.`
      });
    } else {
      // Mode "Assistant général"
      messages.push({
        role: "system",
        content: `Tu es un assistant IA français polyvalent et utile.

TON STYLE:
- Tu parles français de manière claire et professionnelle
- Tu es amical mais professionnel
- Tu fournis des réponses concises mais complètes
- Tu utilises des emojis avec modération quand c'est approprié
- Tu es précis dans tes réponses
- Si tu ne sais pas quelque chose, tu l'admets honnêtement

DOMAINES DE COMPÉTENCE:
1. Informatique et programmation
2. Développement web et mobile
3. Conseils techniques
4. Aide générale et questions diverses
5. Discussions sur la technologie

RÈGLES IMPORTANTES:
- Ne donne pas de conseils médicaux, financiers ou légaux
- Sois toujours bienveillant et respectueux
- Corrige poliment les erreurs factuelles
- Encourage l'apprentissage continu

Tu peux répondre à presque toutes les questions dans ces limites.`
      });
    }

    // Ajouter l'historique de conversation
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        if (msg.role && msg.content) {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          });
        }
      });
    }

    // Ajouter le message actuel
    messages.push({
      role: 'user',
      content: message
    });

    let aiResponse = null;
    let usedModel = null;

    try {
      // Liste des modèles DeepSeek fonctionnels sur OpenRouter
      const deepseekModels = [
        'deepseek/deepseek-chat',           // Modèle standard DeepSeek
        'deepseek/deepseek-coder',          // Spécialisé en code
        'deepseek/deepseek-r1-distill-qwen-32b'  // Version distillée de R1
      ];

      let lastError = null;

      // Essayer chaque modèle DeepSeek jusqu'à ce qu'un fonctionne
      for (const model of deepseekModels) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 25000); // Timeout 25 secondes

          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': req.headers.origin || 'https://tradition-iavercel.app',
              'X-Title': 'Rosny Portfolio Chatbot'
            },
            body: JSON.stringify({
              model: model,
              messages: messages,
              max_tokens: 1500,
              temperature: 0.7,
              top_p: 0.9,
              frequency_penalty: 0.5,
              presence_penalty: 0.5
            })
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
              aiResponse = data.choices[0].message.content.trim();
              usedModel = model === 'deepseek/deepseek-chat' ? 'DeepSeek V3' :
                (model === 'deepseek/deepseek-coder' ? 'DeepSeek Coder' : 'DeepSeek R1');
              console.log(`✅ Succès avec le modèle: ${model}`);
              break; // Sortir de la boucle si réussi
            }
          } else {
            const errorText = await response.text();
            console.warn(`⚠️ Échec avec ${model}: ${response.status} - ${errorText.substring(0, 100)}`);
            lastError = new Error(`Modèle ${model} échoué: ${response.status}`);
          }
        } catch (modelError) {
          console.warn(`⚠️ Erreur avec ${model}:`, modelError.message);
          lastError = modelError;
        }
      }

      // Si aucun modèle n'a fonctionné
      if (!aiResponse) {
        throw lastError || new Error('Tous les modèles DeepSeek ont échoué');
      }

    } catch (error) {
      console.error('❌ Erreur avec DeepSeek:', error.message);

      // Fallback intelligent basé sur le type de question
      const lowerMessage = message.toLowerCase();

      if (aboutRosny) {
        // Fallback pour questions sur Rosny
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('téléphone') || lowerMessage.includes('tel')) {
          aiResponse = "📧 **Contact de Rosny OTSINA :**\n\n" +
            "• Email : rodrigueotsina@gmail.com\n" +
            "• Téléphone : +241 077 12 24 85\n" +
            "• Localisation : Libreville, Gabon\n" +
            "• GitHub : github.com/RosnyMinko07\n\n" +
            "💼 Disponible pour vos projets web et mobile ! N'hésitez pas à le contacter.";
        } else if (lowerMessage.includes('compétence') || lowerMessage.includes('technique') || lowerMessage.includes('sait faire')) {
          aiResponse = "💼 **Compétences techniques de Rosny :**\n\n" +
            "**Frontend :** HTML5, CSS3, JavaScript, React.js, Vue.js, Bootstrap\n" +
            "**Backend :** PHP/Laravel, Node.js/Express.js, Python/Django, Java\n" +
            "**Mobile :** Flutter, Android (Java/Kotlin)\n" +
            "**Base de données :** MySQL, PostgreSQL, MongoDB\n" +
            "**DevOps & Outils :** Docker, Git, CI/CD, Sécurité\n\n" +
            "🌟 Rosny est un développeur Full Stack expérimenté !";
        } else if (lowerMessage.includes('projet') || lowerMessage.includes('réalisation')) {
          aiResponse = "📁 **Projets réalisés par Rosny :**\n\n" +
            "1. Application de traduction des langues gabonaises\n" +
            "2. Système de facturation TECH INFO PLUS\n" +
            "3. Application de gestion des notes\n" +
            "4. Shopping App & Food App (e-commerce)\n" +
            "5. Site immobilier complet\n" +
            "6. Application Permis Virtuel\n\n" +
            "💪 Un portfolio varié qui démontre son expertise !";
        } else if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût')) {
          aiResponse = "💰 **Tarifs & Services :**\n\n" +
            "Les tarifs de Rosny varient selon la complexité du projet. Pour un devis personnalisé :\n\n" +
            "📧 rodrigueotsina@gmail.com\n" +
            "📞 +241 077 12 24 85\n\n" +
            "Il répond sous 24h avec une proposition adaptée à votre budget !";
        } else {
          aiResponse = "👋 Je suis l'assistant de **Rosny OTSINA**, développeur freelance Full Stack.\n\n" +
            "📧 **Contact :** rodrigueotsina@gmail.com\n" +
            "📞 **Téléphone :** +241 077 12 24 85\n" +
            "💻 **GitHub :** github.com/RosnyMinko07\n\n" +
            "✨ Il est spécialisé en développement web, mobile et création d'API.\n\n" +
            "❓ Pour toute question spécifique sur ses compétences ou projets, n'hésitez pas à le contacter directement !";
        }
      } else {
        // Fallback pour questions générales avec réponse plus utile
        aiResponse = "🤖 **DeepSeek API temporairement indisponible**\n\n" +
          "En attendant, voici quelques informations :\n\n" +
          "💼 **À propos de Rosny OTSINA :**\n" +
          "Développeur Full Stack freelance basé à Libreville, Gabon.\n" +
          "Spécialisé dans les applications web, mobiles et API.\n\n" +
          "📧 **Contact :** rodrigueotsina@gmail.com\n" +
          "📞 **Tél :** +241 077 12 24 85\n\n" +
          "🔄 **Conseil :** Rafraîchissez la page ou réessayez dans quelques minutes.\n\n" +
          "📝 **Votre question était :** \"" + message.substring(0, 100) + (message.length > 100 ? "..." : "") + "\"\n\n" +
          "Pour une réponse plus précise, veuillez contacter Rosny directement ou réessayer plus tard.";
      }
      usedModel = 'Mode Hors-ligne (API temporairement indisponible)';
    }

    return res.status(200).json({
      success: true,
      message: aiResponse,
      model: usedModel,
      aboutRosny: aboutRosny
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error);

    // Réponse d'erreur finale
    const errorMessage = "⚠️ **Problème technique rencontré**\n\n" +
      "L'assistant rencontre des difficultés momentanées.\n\n" +
      "📧 **Contacter Rosny OTSINA (développeur freelance) :**\n" +
      "• Email : rodrigueotsina@gmail.com\n" +
      "• Téléphone : +241 077 12 24 85\n" +
      "• GitHub : github.com/RosnyMinko07\n\n" +
      "🔧 **Solution :** Rafraîchissez la page ou réessayez dans quelques instants.\n\n" +
      "Merci pour votre compréhension !";

    return res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
}; 