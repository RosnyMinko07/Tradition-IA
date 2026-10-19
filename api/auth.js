/**
 * TRADITION IA — API AUTH (Inscription / Connexion / Vérification)
 * ================================================================
 * Vercel Serverless Function — /api/auth
 * POST { action: 'register' | 'login' | 'me' }
 */

const { pool } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tradition_ia_local_secret_2026';
const JWT_EXPIRES = '7d';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Méthode non autorisée.' });

  const { action } = req.body || {};

  try {
    // ── INSCRIPTION ────────────────────────────────────────────────
    if (action === 'register') {
      const { nom_complet, courriel, mot_de_passe } = req.body;

      if (!nom_complet || !courriel || !mot_de_passe) {
        return res.status(400).json({ success: false, error: 'Tous les champs sont requis.' });
      }
      if (mot_de_passe.length < 6) {
        return res.status(400).json({ success: false, error: 'Le mot de passe doit faire au moins 6 caractères.' });
      }

      // Vérifier si l'email existe déjà
      const [existing] = await pool.query(
        'SELECT id FROM utilisateurs WHERE courriel = ?', [courriel.toLowerCase().trim()]
      );
      if (existing.length > 0) {
        return res.status(409).json({ success: false, error: 'Un compte avec cet email existe déjà.' });
      }

      const hash = await bcrypt.hash(mot_de_passe, 12);
      const [result] = await pool.query(
        'INSERT INTO utilisateurs (nom_complet, courriel, mot_de_passe_hache, role) VALUES (?, ?, ?, ?)',
        [nom_complet.trim(), courriel.toLowerCase().trim(), hash, 'utilisateur']
      );

      const user = {
        id: result.insertId,
        nom_complet: nom_complet.trim(),
        courriel: courriel.toLowerCase().trim(),
        role: 'utilisateur'
      };

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

      return res.status(201).json({ success: true, token, user });
    }

    // ── CONNEXION ──────────────────────────────────────────────────
    if (action === 'login') {
      const { courriel, mot_de_passe } = req.body;

      if (!courriel || !mot_de_passe) {
        return res.status(400).json({ success: false, error: 'Email et mot de passe requis.' });
      }

      const cleanEmail = courriel.toLowerCase().trim();

      // Vérifier et auto-générer l'admin par défaut si nécessaire
      const [allUsers] = await pool.query('SELECT COUNT(*) as cnt FROM utilisateurs');
      if (allUsers[0].cnt === 0 || (cleanEmail === 'admin@traditionia.ga' && mot_de_passe === 'admin123')) {
        const [existingAdmin] = await pool.query('SELECT id FROM utilisateurs WHERE courriel = ?', ['admin@traditionia.ga']);
        if (existingAdmin.length === 0) {
          const defaultAdminHash = await bcrypt.hash('admin123', 10);
          await pool.query(
            'INSERT INTO utilisateurs (nom_complet, courriel, mot_de_passe_hache, role) VALUES (?, ?, ?, ?)',
            ['Administrateur Tradition IA', 'admin@traditionia.ga', defaultAdminHash, 'admin']
          );
        }
      }

      const [rows] = await pool.query(
        'SELECT * FROM utilisateurs WHERE courriel = ?', [cleanEmail]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect.' });
      }

      const dbUser = rows[0];
      const match = await bcrypt.compare(mot_de_passe, dbUser.mot_de_passe_hache);

      if (!match) {
        return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect.' });
      }

        const isAdm = dbUser.role === 'administrateur' || dbUser.role === 'admin';
        const user = {
          id: dbUser.id,
          nom_complet: dbUser.nom_complet,
          courriel: dbUser.courriel,
          role: isAdm ? 'admin' : 'utilisateur'
        };

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        return res.status(200).json({ success: true, token, user });
      }

    // ── CONNEXION / INSCRIPTION VIA COMPTE GOOGLE ──────────────────
    if (action === 'google') {
      const { courriel, nom_complet, google_id } = req.body || {};

      if (!courriel) {
        return res.status(400).json({ success: false, error: 'Email Google requis.' });
      }

      const cleanEmail = courriel.toLowerCase().trim();
      const displayName = (nom_complet && nom_complet.trim()) || cleanEmail.split('@')[0];

      // Vérifier si l'utilisateur existe déjà
      const [existing] = await pool.query(
        'SELECT * FROM utilisateurs WHERE courriel = ?', [cleanEmail]
      );

      let user = null;
      if (existing.length > 0) {
        const dbUser = existing[0];
        const isAdm = dbUser.role === 'administrateur' || dbUser.role === 'admin';
        user = {
          id: dbUser.id,
          nom_complet: dbUser.nom_complet,
          courriel: dbUser.courriel,
          role: isAdm ? 'admin' : 'utilisateur'
        };
      } else {
        // Création automatique dans MySQL
        const placeholderHash = await bcrypt.hash('GOOGLE_OAUTH_' + Date.now(), 10);
        const [result] = await pool.query(
          'INSERT INTO utilisateurs (nom_complet, courriel, mot_de_passe_hache, role) VALUES (?, ?, ?, ?)',
          [displayName, cleanEmail, placeholderHash, 'utilisateur']
        );
        user = {
          id: result.insertId,
          nom_complet: displayName,
          courriel: cleanEmail,
          role: 'utilisateur'
        };
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return res.status(200).json({ success: true, token, user });
    }

    // ── VÉRIFICATION TOKEN ─────────────────────────────────────────
    if (action === 'me') {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '').trim();

      if (!token) return res.status(401).json({ success: false, error: 'Token manquant.' });

      const decoded = jwt.verify(token, JWT_SECRET);
      const [rows] = await pool.query(
        'SELECT id, nom_complet, courriel, role FROM utilisateurs WHERE id = ?',
        [decoded.id]
      );

      if (rows.length === 0) return res.status(404).json({ success: false, error: 'Utilisateur introuvable.' });

      return res.status(200).json({ success: true, user: rows[0] });
    }

    return res.status(400).json({ success: false, error: 'Action inconnue.' });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Session expirée. Reconnectez-vous.' });
    }
    console.error('[Tradition IA /api/auth ERROR]', error);
    return res.status(500).json({ success: false, error: 'Erreur serveur. Réessayez.' });
  }
};
