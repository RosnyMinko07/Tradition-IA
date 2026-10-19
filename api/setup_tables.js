// Script de création de la table utilisateurs
const { pool } = require('./db');

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom_complet VARCHAR(120) NOT NULL,
      courriel VARCHAR(255) NOT NULL UNIQUE,
      mot_de_passe_hache VARCHAR(255) NOT NULL,
      role ENUM('utilisateur','administrateur') DEFAULT 'utilisateur',
      date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  const [tables] = await pool.query('SHOW TABLES');
  console.log('✅ Table utilisateurs créée. Tables en base:');
  tables.forEach(t => console.log('  -', Object.values(t)[0]));
  await pool.end();
}

createTables().catch(e => { console.error(e); process.exit(1); });
