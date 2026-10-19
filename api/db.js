/**
 * TRADITION IA — CONNEXION MYSQL (LOCAL)
 * ========================================
 * Module de connexion à la base de données MySQL locale.
 * Utilise mysql2 avec pool de connexions pour les performances.
 *
 * Configuration via variables d'environnement (.env) :
 *   DB_HOST     = 127.0.0.1
 *   DB_USER     = root
 *   DB_PASSWORD = (vide par défaut sur XAMPP)
 *   DB_NAME     = traductionia
 *   DB_PORT     = 3306
 */

const mysql = require('mysql2/promise');

// Chargement du .env si disponible (local) — sur Vercel, les env vars sont injectées directement
try { require('dotenv').config(); } catch (e) {}

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'traductionia',
  port:     parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

/**
 * Test de connexion — appelé au démarrage
 */
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ [Tradition IA] Connexion MySQL OK → base "traductionia"');
    conn.release();
    return true;
  } catch (err) {
    console.error('❌ [Tradition IA] Connexion MySQL ÉCHOUÉE :', err.message);
    return false;
  }
}

module.exports = { pool, testConnection };
