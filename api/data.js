/**
 * TRADITION IA — API DONNÉES MYSQL
 * =================================
 * Endpoint /api/data
 * Renvoie les langues, entrées de dictionnaire, expressions et historique
 * directement depuis la base de données MySQL "traductionia".
 */

const { pool } = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const type = req.query.type || (req.body && req.body.type) || 'all';

  try {
    if (req.method === 'POST') {
      if (type === 'save_translation') {
        const { sourceLang, targetLang, sourceText, translatedText, isAI, userId, userEmail } = req.body || {};
        if (sourceText && translatedText) {
          const [result] = await pool.query(
            `INSERT INTO historique_traductions 
             (langue_source, langue_cible, texte_source, texte_traduit, source_moteur, est_exact, utilisateur_id, user_email) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [sourceLang || 'Français', targetLang, sourceText, translatedText, isAI ? 'ai' : 'knowledge', isAI ? 0 : 1, userId || null, userEmail || null]
          );
          return res.status(200).json({ success: true, id: result.insertId });
        }
        return res.status(400).json({ success: false, error: 'Champs manquants' });
      }

      if (type === 'clear_history') {
        const { userEmail, userId } = req.body || {};
        if (userEmail) {
          await pool.query('DELETE FROM historique_traductions WHERE user_email = ?', [userEmail]);
          return res.status(200).json({ success: true });
        } else if (userId) {
          await pool.query('DELETE FROM historique_traductions WHERE utilisateur_id = ?', [userId]);
          return res.status(200).json({ success: true });
        }
        return res.status(400).json({ success: false, error: 'Identifiant utilisateur requis' });
      }

      if (type === 'add_word') {
        const { word, translation, targetLang, category, example } = req.body || {};
        if (word && translation && targetLang) {
          const [langs] = await pool.query('SELECT id FROM langues WHERE nom = ? OR code = ? LIMIT 1', [targetLang, targetLang]);
          const langId = langs && langs[0] ? langs[0].id : 1;
          const [result] = await pool.query(
            `INSERT INTO entrees_dictionnaire 
             (langue_id, mot_francais, traduction_locale, categorie, exemple_francais, est_valide)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [langId, word, translation, category || 'Général', example || null]
          );
          return res.status(200).json({ success: true, id: result.insertId });
        }
        return res.status(400).json({ success: false, error: 'Champs requis manquants' });
      }

      if (type === 'propose_expression') {
        const { phrase, translation, targetLang, context, isValidated = 0 } = req.body || {};
        if (phrase && translation) {
          const [langs] = await pool.query('SELECT id FROM langues WHERE nom = ? OR code = ? LIMIT 1', [targetLang || 'Fang', targetLang || 'fan']);
          const langId = langs && langs[0] ? langs[0].id : 1;
          const [result] = await pool.query(
            `INSERT INTO expressions_culturelles (langue_id, type_expression, contenu_francais, contenu_local, contexte_utilisation, est_valide)
             VALUES (?, 'phrase', ?, ?, ?, ?)`,
            [langId, phrase, translation, context || 'Proposition utilisateur', isValidated ? 1 : 0]
          );
          return res.status(200).json({ success: true, id: result.insertId });
        }
        return res.status(400).json({ success: false, error: 'Champs manquants' });
      }

      if (type === 'validate_expression') {
        const { id } = req.body || {};
        if (id) {
          await pool.query('UPDATE expressions_culturelles SET est_valide = 1 WHERE id = ?', [id]);
          return res.status(200).json({ success: true });
        }
        return res.status(400).json({ success: false, error: 'ID requis' });
      }

      if (type === 'reject_expression') {
        const { id } = req.body || {};
        if (id) {
          await pool.query('DELETE FROM expressions_culturelles WHERE id = ?', [id]);
          return res.status(200).json({ success: true });
        }
        return res.status(400).json({ success: false, error: 'ID requis' });
      }
    }

    // 1. Récupérer les langues réelles de la base MySQL
    let rawLangs = [];
    try {
      const [rows] = await pool.query(
        'SELECT id, code, nom as name, nom_natif as nativeName, CONCAT(nom, " (", IFNULL(region, "Gabon"), ")") as description, region, estimation_locuteurs as speakers, url_image_masque as maskImage FROM langues ORDER BY ordre_affichage ASC, nom ASC'
      );
      rawLangs = rows;
    } catch (eLangs) {
      try {
        const [rows] = await pool.query('SELECT id, code, nom as name FROM langues');
        rawLangs = rows;
      } catch (e2) {
        console.warn('[api/data] Erreur lecture langues:', e2.message);
      }
    }

    // 2. Récupérer le dictionnaire complet depuis MySQL (276 mots réels)
    let rawDict = [];
    try {
      const [rows] = await pool.query(
        `SELECT d.id, d.mot_francais as word, d.traduction_locale as translation, 
                l.nom as targetLang, d.categorie as category, d.phonetique as phonetic,
                COALESCE(NULLIF(d.exemple_francais, ''), d.exemple_local, '') as example
         FROM entrees_dictionnaire d
         JOIN langues l ON d.langue_id = l.id
         ORDER BY d.mot_francais ASC, l.nom ASC LIMIT 2000`
      );
      rawDict = rows;
    } catch (eDict) {
      try {
        // Fallback sans colonnes optionnelles
        const [rows] = await pool.query(
          `SELECT d.id, d.mot_francais as word, d.traduction_locale as translation, 
                  l.nom as targetLang, d.categorie as category, '' as example
           FROM entrees_dictionnaire d
           JOIN langues l ON d.langue_id = l.id
           ORDER BY d.mot_francais ASC, l.nom ASC LIMIT 2000`
        );
        rawDict = rows;
      } catch (e2) {
        console.warn('[api/data] Erreur lecture dictionnaire:', e2.message);
      }
    }

    // 3. Récupérer les expressions validées depuis MySQL
    let rawExpr = [];
    try {
      const [rows] = await pool.query(
        `SELECT e.id, e.contenu_francais as phrase, e.contenu_local as translation,
                l.nom as targetLang, e.type_expression as type, e.sens_philosophique as explanation,
                e.contexte_utilisation as context, IF(e.est_valide = 1, true, false) as isValidated
         FROM expressions_culturelles e
         JOIN langues l ON e.langue_id = l.id
         ORDER BY e.id DESC LIMIT 500`
      );
      rawExpr = rows;
    } catch (eExpr) {
      try {
        const [rows] = await pool.query(
          `SELECT e.id, e.contenu_francais as phrase, e.contenu_local as translation,
                  l.nom as targetLang, '' as context, true as isValidated
           FROM expressions_culturelles e
           JOIN langues l ON e.langue_id = l.id
           ORDER BY e.id DESC LIMIT 500`
        );
        rawExpr = rows;
      } catch (e2) {
        console.warn('[api/data] Erreur lecture expressions:', e2.message);
      }
    }

    // 4. Récupérer l'historique spécifique à l'utilisateur connecté
    const userEmail = req.query.user_email || (req.body && req.body.user_email) || null;
    const userId = req.query.user_id || (req.body && req.body.user_id) || null;

    let rawHistory = [];
    try {
      let historyQuery = `
        SELECT id, langue_source as sourceLang, langue_cible as targetLang,
               texte_source as sourceText, texte_traduit as translatedText,
               source_moteur as sourceEngine, est_exact as isExact,
               DATE_FORMAT(date_creation, '%d/%m/%Y %H:%i') as createdAt,
               date_creation as date, utilisateur_id as userId, user_email as userEmail
        FROM historique_traductions
      `;
      const historyParams = [];
      if (userEmail) {
        historyQuery += ' WHERE user_email = ? ';
        historyParams.push(userEmail);
      } else if (userId) {
        historyQuery += ' WHERE utilisateur_id = ? ';
        historyParams.push(userId);
      } else {
        historyQuery += ' WHERE user_email IS NULL AND utilisateur_id IS NULL ';
      }
      historyQuery += ' ORDER BY id DESC LIMIT 100 ';
      const [rows] = await pool.query(historyQuery, historyParams);
      rawHistory = rows;
    } catch (eHist) {
      try {
        const [rows] = await pool.query(
          `SELECT id, langue_source as sourceLang, langue_cible as targetLang,
                  texte_source as sourceText, texte_traduit as translatedText,
                  source_moteur as sourceEngine, est_exact as isExact,
                  date_creation as createdAt, date_creation as date
           FROM historique_traductions
           ORDER BY id DESC LIMIT 50`
        );
        rawHistory = rows;
      } catch (e2) {
        console.warn('[api/data] Erreur lecture historique:', e2.message);
      }
    }

    return res.status(200).json({
      success: true,
      languages: rawLangs,
      dictionary: rawDict,
      expressions: rawExpr,
      translations: rawHistory
    });

  } catch (err) {
    console.error('[Tradition IA /api/data ERROR]', err);
    return res.status(500).json({
      success: false,
      error: 'Erreur récupération données MySQL',
      message: err.message
    });
  }
};
