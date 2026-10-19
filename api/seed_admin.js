const { pool } = require('./db');
const bcrypt = require('bcryptjs');

async function fixAdmin() {
  const hash = await bcrypt.hash('admin123', 10);
  await pool.query(
    "UPDATE utilisateurs SET role = 'administrateur', mot_de_passe_hache = ? WHERE courriel = 'admin@traditionia.ga'",
    [hash]
  );
  const [rows] = await pool.query('SELECT id, nom_complet, courriel, role FROM utilisateurs');
  console.log('UTILISATEUR ADMIN CONFIRMÉ :', rows);
  process.exit(0);
}

fixAdmin();
