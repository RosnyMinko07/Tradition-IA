/**
 * TRADITION IA — TEST DE CONNEXION MYSQL
 * ========================================
 * Vérifie la connexion et affiche un résumé des données en base.
 *
 * USAGE :
 *   node api/test_db.js
 */

const { pool, testConnection } = require('./db');

async function test() {
  const ok = await testConnection();
  if (!ok) { process.exit(1); }

  const [[{ langues }]]     = await pool.query('SELECT COUNT(*) AS langues FROM langues');
  const [[{ dict }]]        = await pool.query('SELECT COUNT(*) AS dict FROM entrees_dictionnaire');
  const [[{ phrases }]]     = await pool.query('SELECT COUNT(*) AS phrases FROM expressions_culturelles');
  const [[{ traductions }]] = await pool.query('SELECT COUNT(*) AS traductions FROM historique_traductions');

  console.log('\n══════════════════════════════════════════════');
  console.log('  📊 ÉTAT DE LA BASE DE DONNÉES TRADUCTIONIA');
  console.log('══════════════════════════════════════════════');
  console.log(`  🌍 Langues          : ${langues}`);
  console.log(`  📖 Mots             : ${dict}`);
  console.log(`  💬 Phrases          : ${phrases}`);
  console.log(`  📜 Traductions      : ${traductions}`);
  console.log('══════════════════════════════════════════════\n');

  // Exemple : 5 premiers mots en Fang
  const [exemples] = await pool.query(
    `SELECT mot_francais, traduction_locale, categorie
     FROM entrees_dictionnaire
     JOIN langues ON langues.id = entrees_dictionnaire.langue_id
     WHERE langues.code = 'fan'
     LIMIT 5`
  );
  console.log('  📝 Exemple — 5 mots en Fang :');
  exemples.forEach(r => {
    console.log(`     ${r.mot_francais.padEnd(20)} → ${r.traduction_locale.padEnd(20)} [${r.categorie}]`);
  });
  console.log('');

  await pool.end();
}

test().catch(console.error);
