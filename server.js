/**
 * TRADITION IA — SERVEUR LOCAL NODE.JS
 * =====================================
 * Serveur de développement local complet et autonome (sans dépendance externe supplémentaire).
 * - Sert les fichiers statiques (HTML, CSS, JS, Images)
 * - Exécute les Serverless Functions /api/ (auth, translate, data, chat)
 * - Connecté à la base MySQL locale (XAMPP)
 *
 * Lancement : node server.js
 * Accès : http://localhost:3000 -> Page d'Accueil (index.html)
 */

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2'
};

// Import des handlers API
const apiHandlers = {
  '/api/auth':      require('./api/auth'),
  '/api/translate': require('./api/translate'),
  '/api/data':      require('./api/data'),
  '/api/chat':      require('./api/chat')
};

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({ raw: body });
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Redirection racine vers la page d'accueil
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // ── 1. Routes API ──────────────────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    let handler = apiHandlers[pathname];
    // Rechargement à chaud des fichiers API pour éviter de devoir redémarrer le serveur
    try {
      const targetModule = path.join(__dirname, pathname + '.js');
      if (fs.existsSync(targetModule)) {
        delete require.cache[require.resolve(targetModule)];
        handler = require(targetModule);
      }
    } catch(e) {}

    if (handler) {
      // Mock Express-like req/res pour les serverless functions Vercel
      req.query = parsedUrl.query || {};
      req.body = await parseBody(req);

      res.status = function(statusCode) {
        res.statusCode = statusCode;
        return res;
      };

      res.json = function(data) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(data));
        return res;
      };

      try {
        await handler(req, res);
      } catch (err) {
        console.error('[API Handler Error]', pathname, err);
        if (!res.writableEnded) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Erreur interne du serveur' }));
        }
      }
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Endpoint API introuvable' }));
      return;
    }
  }

  // ── 2. Fichiers Statiques ───────────────────────────────────────────────────
  let filePath = path.join(PUBLIC_DIR, pathname);

  // Vérification de sécurité contre directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Accès interdit');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Tenter d'ajouter .html si manquant
      if (!path.extname(filePath)) {
        const htmlPath = filePath + '.html';
        if (fs.existsSync(htmlPath)) {
          filePath = htmlPath;
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 - Page ou ressource introuvable');
          return;
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Fichier introuvable');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  TRADITION IA — SERVEUR LOCAL DÉMARRÉ AVEC SUCCÈS 🚀`);
  console.log(`======================================================`);
  console.log(`  - URL Application : http://localhost:${PORT}/ (Accueil)`);
  console.log(`  - Page d'Accueil  : http://localhost:${PORT}/index.html`);
  console.log(`  - Base de Données : MySQL (traductionia)`);
  console.log(`  - Traductions     : Illimitées et libres d'accès`);
  console.log(`======================================================\n`);
});
