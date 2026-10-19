/**
 * TRADITION IA — SCRIPT DE MIGRATION
 * =====================================
 * Importe le dictionnaire et les phrases de api/_knowledge.js
 * directement dans la base MySQL locale "traductionia".
 *
 * USAGE :
 *   node api/migrate.js
 *
 * Pré-requis :
 *   - MySQL XAMPP démarré sur port 3306
 *   - Base de données "traductionia" créée
 *   - Tables créées via database_mysql.sql
 *   - mysql2 installé : npm install mysql2 dotenv
 */

const { pool, testConnection } = require('./db');
const { DICTIONARY_DATA, PHRASES_DATA } = require('./_knowledge');

// Correspondance clé JS → code langue MySQL
const LANG_KEY_TO_CODE = {
  fang:   'fan',
  punu:   'puu',
  myene:  'mye',
  nzebi:  'nzb',
  teke:   'tek',
  vili:   'vif',
  obamba: 'obb',
  guisir: 'gsi',
  kota:   'kto'
};

async function migrate() {
  console.log('\n🚀 [Tradition IA] Démarrage de la migration...\n');

  const ok = await testConnection();
  if (!ok) {
    console.error('❌ Impossible de se connecter à MySQL. Vérifiez que XAMPP est bien démarré.');
    process.exit(1);
  }

  // Récupérer les IDs de langues
  const [langRows] = await pool.query('SELECT id, code FROM langues');
  const langMap = {}; // code → id
  langRows.forEach(r => { langMap[r.code] = r.id; });
  console.log('📋 Langues chargées :', Object.keys(langMap).join(', '));

  // Nettoyer les anciennes tables pour ne conserver rigoureusement que les données officielles de txt.txt
  console.log('🧹 Nettoyage des anciennes données pour synchronisation exclusive avec txt.txt...');
  await pool.query('DELETE FROM entrees_dictionnaire');
  await pool.query('DELETE FROM expressions_culturelles');

  // === MIGRATION DU DICTIONNAIRE ===
  console.log(`\n📖 Migration du dictionnaire (${DICTIONARY_DATA.length} entrées issues de txt.txt) ...`);
  let dictOk = 0, dictSkip = 0;

  for (const entry of DICTIONARY_DATA) {
    const category = entry.category || 'Divers';

    for (const [langKey, langCode] of Object.entries(LANG_KEY_TO_CODE)) {
      if (!entry[langKey]) continue;
      const langId = langMap[langCode];
      if (!langId) continue;

      try {
        await pool.query(
          `INSERT IGNORE INTO entrees_dictionnaire
            (langue_id, mot_francais, traduction_locale, categorie)
           VALUES (?, ?, ?, ?)`,
          [langId, entry.fr, entry[langKey], category]
        );
        dictOk++;
      } catch (e) {
        dictSkip++;
        console.warn(`  ⚠️  Skipped [${entry.fr}/${langKey}]: ${e.message}`);
      }
    }
  }
  console.log(`  ✅ Dictionnaire : ${dictOk} entrées insérées, ${dictSkip} ignorées.`);

  // === MIGRATION DES PHRASES / PROVERBES ===
  console.log(`\n💬 Migration des phrases & proverbes (${PHRASES_DATA.length} entrées) ...`);
  let phraseOk = 0, phraseSkip = 0;

  for (const phrase of PHRASES_DATA) {
    const type = phrase.type || 'phrase';
    const frText = phrase.fr || '';
    const sens = phrase.sens || phrase.context || '';
    const langOrigine = phrase.langue_origine || '';
    const context = phrase.context || null;

    for (const [langKey, langCode] of Object.entries(LANG_KEY_TO_CODE)) {
      if (!phrase[langKey]) continue;
      const langId = langMap[langCode];
      if (!langId) continue;

      try {
        await pool.query(
          `INSERT IGNORE INTO expressions_culturelles
            (langue_id, type_expression, contenu_francais, contenu_local, sens_philosophique, contexte_utilisation, langue_origine)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [langId, type, frText, phrase[langKey], sens, context, langOrigine]
        );
        phraseOk++;
      } catch (e) {
        phraseSkip++;
        console.warn(`  ⚠️  Skipped phrase [${frText.substring(0,40)}/${langKey}]: ${e.message}`);
      }
    }
  }
  console.log(`  ✅ Phrases/Proverbes : ${phraseOk} entrées insérées, ${phraseSkip} ignorées.`);

  // === RÉSUMÉ FINAL ===
  const [[{ total_dict }]]  = await pool.query('SELECT COUNT(*) AS total_dict FROM entrees_dictionnaire');
  const [[{ total_expr }]]  = await pool.query('SELECT COUNT(*) AS total_expr FROM expressions_culturelles');
  const [[{ total_lang }]]  = await pool.query('SELECT COUNT(*) AS total_lang FROM langues');

  console.log('\n══════════════════════════════════════════════');
  console.log('✅ MIGRATION TERMINÉE !');
  console.log('══════════════════════════════════════════════');
  console.log(`   🌍 Langues en base       : ${total_lang}`);
  console.log(`   📖 Mots dictionnaire    : ${total_dict}`);
  console.log(`   💬 Phrases & Proverbes  : ${total_expr}`);
  console.log('══════════════════════════════════════════════\n');

  await pool.end();
}

migrate().catch(err => {
  console.error('❌ Erreur critique lors de la migration :', err);
  process.exit(1);
});
