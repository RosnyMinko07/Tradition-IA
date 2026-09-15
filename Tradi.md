# Tradition IA - Plateforme de Traduction des Langues Gabonaises

## Description
Tradition IA est une plateforme web professionnelle **Single Page Application (SPA)** dédiée à la traduction, l'apprentissage et la préservation des langues locales du Gabon (Fang, Punu, Nzébi, Myènè, Téké, Vili, Obamba, Guisir, Kota), combinant une base de données linguistique et un assistant virtuel IA.


## Stack Technique (Pure Vanilla Web)
- **Architecture**: Single Page Application (SPA) native sans framework ni bundler
- **Frontend**: HTML5, CSS3 (Vanilla avec variables & glassmorphism), JavaScript (ES Modules)
- **Gestion d'État**: State Store réactif avec modèle Pub/Sub (`js/store.js`)
- **Routage**: SPA Hash Router natif avec guards d'authentification (`js/router.js`)
- **Stockage & Backend**: Supabase Client SDK (`@supabase/supabase-js`) + Fallback LocalStorage (`js/supabase.js`)
- **Iconographie & Culture**: Masques gabonais vectoriels SVG dynamiques (`js/masks.js`)
- **Fonts**: Space Grotesk (titres), DM Sans (corps de texte)

## Structure du Projet

```
Tradition IA/
├── index.html              # Point d'entrée SPA unique
├── css/
│   └── styles.css          # Design system complet (Variables, Glassmorphism, Responsive)
└── js/
    ├── app.js              # Contrôleur principal et orchestration
    ├── router.js           # Routeur SPA par ancres #hash et guards auth
    ├── store.js            # Store de gestion d'état centralisée
    ├── supabase.js         # Service de stockage Supabase / LocalStorage
    ├── config.js           # Constants et lexique gabonais initial
    ├── masks.js            # Générateur SVG des masques gabonais (Fang, Punu, Myène, Kota)
    ├── components/         # Composants réutilisables Vanilla JS
    │   ├── Navbar.js
    │   ├── Sidebar.js
    │   ├── Toast.js
    │   └── Header.js
    └── pages/              # Vues dynamiques SPA (17 pages)
        ├── LandingPage.js
        ├── LoginPage.js
        ├── RegisterPage.js
        ├── ForgotPasswordPage.js
        ├── DashboardPage.js
        ├── TranslatePage.js
        ├── AIAssistantPage.js
        ├── DictionaryPage.js
        ├── HistoryPage.js
        ├── ProfilePage.js
        ├── AdminDashboardPage.js
        ├── AdminUsersPage.js
        ├── AdminLanguagesPage.js
        ├── AdminDictionaryPage.js
        ├── AdminExpressionsPage.js
        ├── AdminAIValidationPage.js
        └── AdminAnalyticsPage.js
```

## Fonctionnalités Clés
- **Traduction instantanée** texte (Français ➔ Langues Gabonaises) avec enregistrement d'historique et écoute audio.
- **Assistant IA virtuel** interactif spécialisé dans la grammaire, la culture et les expressions gabonaises.
- **Dictionnaire collaboratif** avec moteur de recherche en temps réel et filtrage par langue.
- **Gestion de profil** utilisateur et sélection du masque culturel représentatif.
- **Console Administration complète** :
  - Gestion CRUD des Utilisateurs (attributs de rôles Membre / Admin).
  - Gestion CRUD des Langues Gabonaises (locuteurs, nating, descriptions).
  - Gestion CRUD du Dictionnaire et des Expressions idiomatiques.
  - Validation / Rejet des suggestions générées par l'IA avec indice de confiance.
  - Graphiques & Analyses de fréquentation par province.

## Comptes de Démonstration (Prêts à l'emploi)
- **Utilisateur Membre** : `user@tradition.ga` (Mot de passe : n'importe lequel)
- **Administrateur** : `admin@tradition.ga` (Mot de passe : n'importe lequel)
