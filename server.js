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
const PUBLIC_DIR = path.join(__dirname, 'public');

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

// Limiteur de requêtes en mémoire pour éviter les attaques par force brute (Anti-Brute Force / Anti-Bot)
const rateLimitMap = new Map();
function checkRateLimit(ip, maxRequests = 20, windowMs = 5 * 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= maxRequests;
}

// Nettoyage régulier de la mémoire du rate limiter
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 10 * 60 * 1000);

// Fichiers et extensions sensibles strictement interdits d'accès par le serveur statique
const FORBIDDEN_EXTENSIONS = new Set(['.env', '.sql', '.jsonl', '.py', '.bat', '.sh', '.log', '.md', '.txt']);
const FORBIDDEN_EXACT_FILES = new Set(['/server.js', '/package.json', '/package-lock.json', '/ENTRAINER_MON_IA.txt']);

function isSensitiveFile(pathname) {
  const lower = pathname.toLowerCase();
  const baseName = path.basename(lower);
  // Fichiers cachés (ex: .env, .git, .gitignore)
  if (baseName.startsWith('.')) return true;
  // Dossiers sensibles
  if (lower.startsWith('/node_modules') || lower.startsWith('/.git') || lower.startsWith('/api/')) return true;
  // Fichiers exacts interdits
  if (FORBIDDEN_EXACT_FILES.has(lower)) return true;
  // Extensions interdites (hors robots.txt si besoin)
  const ext = path.extname(lower);
  if (FORBIDDEN_EXTENSIONS.has(ext)) return true;
  return false;
}

const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024; // 1 Mo max pour éviter le déni de service mémoire (DoS)

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytesReceived = 0;
    req.on('data', chunk => {
      bytesReceived += chunk.length;
      if (bytesReceived > MAX_PAYLOAD_SIZE) {
        req.destroy();
        return reject(new Error('PayloadTooLarge'));
      }
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({ raw: body });
      }
    });
    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  // ── En-têtes de Sécurité Globale (OWASP Recommended Headers) ─────────────
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown_ip';

  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Redirection racine vers la page d'accueil
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // ── 1. Routes API ──────────────────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    // Protection Rate Limiting sur les routes d'authentification (/api/auth)
    if (pathname === '/api/auth' && req.method === 'POST') {
      if (!checkRateLimit(clientIp, 15, 5 * 60 * 1000)) {
        res.writeHead(429, { 
          'Content-Type': 'application/json; charset=utf-8',
          'Retry-After': '300'
        });
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Trop de tentatives de connexion. Veuillez patienter 5 minutes.' 
        }));
        return;
      }
    }

    let handler = apiHandlers[pathname];
    // Rechargement à chaud des fichiers API pour le dev
    try {
      const targetModule = path.join(__dirname, pathname + '.js');
      if (fs.existsSync(targetModule)) {
        delete require.cache[require.resolve(targetModule)];
        handler = require(targetModule);
      }
    } catch(e) {}

    if (handler) {
      req.query = parsedUrl.query || {};
      try {
        req.body = await parseBody(req);
      } catch (err) {
        if (err.message === 'PayloadTooLarge') {
          res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: false, error: 'Taille de requête trop volumineuse (Max 1 Mo)' }));
          return;
        }
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Corps de requête invalide' }));
        return;
      }

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

  // ── 2. Fichiers Statiques & Protection contre la Fuite d'Informations ──────
  // Blocage direct des fichiers sensibles (.env, .git, scripts serveur, etc.)
  if (isSensitiveFile(pathname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 - Accès strictement interdit à cette ressource.');
    return;
  }

  let filePath = path.join(PUBLIC_DIR, pathname);

  // Vérification de sécurité contre directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 - Accès interdit');
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
