# Tradition IA - Plateforme de Traduction des Langues Gabonaises

## Description
Tradition IA est une plateforme web professionnelle dédiée à la traduction, l'apprentissage et la préservation des langues locales du Gabon (Fang, Punu, Nzébi, Myènè, Téké, Vili, Obamba, Guisir, Kota), combinant une base de données linguistique et un assistant virtuel IA.

## Stack Technique (Pure Vanilla Web — Multi-Pages HTML)
- **Architecture**: Multi-Pages HTML indépendantes (MPA classique)
- **Frontend**: HTML5, CSS3 (Vanilla avec variables & glassmorphism), JavaScript (scripts globaux `window.*`)
- **Gestion d'État**: Store global partagé via `window.Store` (`js/store.js`)
- **Stockage & Backend**: Supabase Client SDK (`@supabase/supabase-js`) + Fallback LocalStorage (`js/supabase.js`)
- **Iconographie & Culture**: Masques gabonais vectoriels SVG dynamiques (`js/masks.js`)
- **Fonts**: Space Grotesk (titres), DM Sans (corps de texte)

## Structure du Projet

```
Tradition IA/
├── index.html                 # Page d'accueil (Landing)
├── login.html                 # Connexion
├── register.html              # Inscription
├── forgot-password.html       # Mot de passe oublié
├── dashboard.html             # Tableau de bord utilisateur
├── translate.html             # Traduction des langues
├── ai-assistant.html          # Assistant IA linguistique
├── dictionary.html            # Dictionnaire collaboratif
├── history.html               # Historique des traductions
├── profile.html               # Profil utilisateur
├── admin.html                 # Console Admin (Dashboard)
├── admin-users.html           # Gestion des utilisateurs
├── admin-languages.html       # Gestion des langues
├── admin-dictionary.html      # Gestion du dictionnaire
├── admin-expressions.html     # Gestion des expressions
├── admin-ai-validation.html   # Validation des suggestions IA
├── admin-analytics.html       # Analyses & Rapports
│
├── css/
│   └── styles.css             # Design system complet (Variables, Glassmorphism, Responsive)
│
├── js/
│   ├── config.js              # Constants, données mock (langues, dictionnaire, expressions)
│   ├── masks.js               # Générateur SVG des masques gabonais
│   ├── supabase.js            # Service de stockage Supabase / LocalStorage (window.DB)
│   ├── store.js               # Store d'état & auth partagé (window.Store)
│   ├── pdf_knowledge.js       # Base de connaissances linguistiques étendue
│   └── common.js              # Navbar, Footer, Thème, Toast — chargé sur toutes les pages
│
├── api/
│   ├── _knowledge.js          # Base de connaissances langues gabonaises pour l'IA
│   ├── chat.js                # /api/chat  — Endpoint Assistant IA (Vercel Serverless)
│   └── translate.js           # /api/translate — Endpoint Traduction IA (Vercel Serverless)
│
├── images/                    # Masques PNG, carte Gabon, icônes
├── vercel.json                # Configuration Vercel
├── package.json               # Node.js metadata
└── .env.example               # Variables d'environnement (clé API IA)
```

## Scripts chargés sur chaque page HTML
Tous les fichiers HTML chargent ces scripts dans cet ordre :
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/config.js"></script>
<script src="js/masks.js"></script>
<script src="js/supabase.js"></script>
<script src="js/store.js"></script>
<script src="js/pdf_knowledge.js"></script>
<script src="js/common.js"></script>
```

## Fonctionnalités Clés
- **Traduction instantanée** texte (Français ➔ Langues Gabonaises) avec enregistrement d'historique.
- **Assistant IA virtuel** interactif spécialisé dans la grammaire, la culture et les expressions gabonaises.
- **Dictionnaire collaboratif** avec moteur de recherche en temps réel et filtrage par langue.
- **Gestion de profil** utilisateur et sélection du masque culturel représentatif.
- **Console Administration complète** :
  - Gestion CRUD des Utilisateurs (rôles Membre / Admin).
  - Gestion CRUD des Langues Gabonaises.
  - Gestion CRUD du Dictionnaire et des Expressions idiomatiques.
  - Validation / Rejet des suggestions générées par l'IA.
  - Graphiques & Analyses de fréquentation.

## Comptes de Démonstration (Prêts à l'emploi)
- **Utilisateur Membre** : `user@tradition.ga` (Mot de passe : n'importe lequel)
- **Administrateur** : `admin@tradition.ga` (Mot de passe : n'importe lequel)
