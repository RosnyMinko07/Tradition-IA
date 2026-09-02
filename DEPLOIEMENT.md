# 🇬🇦 Tradition IA — Guide de Déploiement Vercel + Configuration IA

## Ce qui a été mis en place

### Architecture
```
ton-site.vercel.app
│
├── HTML/CSS/JS (statique)          ← tes pages normales
│
└── /api/                           ← fonctions Vercel (Node.js)
    ├── chat.js                     ← /api/chat  (assistant IA)
    ├── translate.js                ← /api/translate (traduction)
    └── _knowledge.js               ← base de connaissances langues gabonaises
```

---

## Comment l'IA connaît les langues locales ?

> **C'est du prompt engineering, pas du machine learning classique.**

À chaque fois que tu poses une question ou demandes une traduction,
le système envoie automatiquement à l'IA **tout le contexte** des langues gabonaises :

```
[Ta question] + [Dictionnaire Fang/Punu/Myènè/...] + [Grammaire] + [Expressions culturelles]
                                    ↓
                              Gemini/OpenAI
                                    ↓
                     Réponse intelligente en français
                     avec mots dans les langues locales
```

### Pour enrichir les connaissances de l'IA

Ouvre le fichier **`api/_knowledge.js`** et :

- **Ajouter un mot** → dans `DICTIONARY_DATA` :
```javascript
{ fr: 'Forêt sacrée', fang: 'Afan beyem', punu: 'Ngira mwamba', category: 'Culture' },
```

- **Ajouter une expression** → dans `EXPRESSIONS_DATA` ou directement dans `DICTIONARY_DATA`

- **Ajouter une note grammaticale** → dans `GRAMMAR_NOTES` (texte libre)

- **Ajouter une langue** → dans `LANGUAGES_DATA` + une nouvelle colonne dans `DICTIONARY_DATA`

L'IA utilisera automatiquement ces nouvelles données sans aucun redéploiement de modèle.

---

## Déploiement sur Vercel — Étape par étape

### 1. Préparer le code (GitHub)

```bash
# Initialiser Git si pas déjà fait
git init
git add .
git commit -m "Tradition IA - Intégration IA réelle"

# Pousser sur GitHub
git remote add origin https://github.com/ton-compte/tradition-ia.git
git push -u origin main
```

### 2. Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com) → **New Project**
2. Importe ton dépôt GitHub
3. Framework Preset → **Other** (pas de framework, site statique)
4. **Ne touche pas** aux autres paramètres par défaut
5. Clique **Deploy**

### 3. Ajouter ta clé API (ÉTAPE CRITIQUE)

1. Dans ton projet Vercel → **Settings** → **Environment Variables**
2. Ajoute ces variables :

| Variable | Valeur | Environment |
|---|---|---|
| `AI_PROVIDER` | `gemini` | Production, Preview, Development |
| `GEMINI_API_KEY` | `ta_vraie_clé` | Production, Preview, Development |

3. Clique **Save**
4. Va dans **Deployments** → **Redeploy** (pour appliquer les variables)

### 4. Obtenir une clé Gemini gratuite

1. Va sur [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Connecte-toi avec un compte Google
3. **Create API Key** → copie la clé
4. Colle-la dans la variable `GEMINI_API_KEY` sur Vercel

> ✅ **Gemini 1.5 Flash est GRATUIT** avec des limites généreuses (60 requêtes/minute, 1500/jour)

---

## Tester en local (optionnel)

```bash
# Installer Vercel CLI
npm install -g vercel

# Créer .env.local avec ta clé
cp .env.example .env.local
# → Édite .env.local et mets ta vraie clé GEMINI_API_KEY

# Lancer en local
vercel dev
# → Ouvre http://localhost:3000
```

---

## Structure des fichiers créés

```
Tradition IA/
├── api/
│   ├── _knowledge.js    ← 🧠 BASE DE CONNAISSANCES (enrichis ici)
│   ├── chat.js          ← /api/chat (assistant IA)
│   └── translate.js     ← /api/translate (traduction)
├── vercel.json          ← config Vercel
├── package.json         ← Node.js info
├── .env.example         ← guide variables d'env
└── ... (tes fichiers existants)
```

---

## FAQ

**Q: Dois-je payer pour Gemini ?**
R: Non. Gemini 1.5 Flash a un tier gratuit très généreux. Pour un projet éducatif comme Tradition IA, le tier gratuit est suffisant.

**Q: La clé API est-elle sécurisée ?**
R: Oui. La clé est dans les variables d'environnement Vercel et n'est accessible que par les fonctions `/api/`. Elle n'apparaît jamais dans le code front-end HTML/JS.

**Q: L'IA peut-elle apprendre de nouvelles langues gabonaises ?**
R: Oui ! Ajoute tes données dans `api/_knowledge.js`. Plus tu ajoutes de mots/expressions/grammaire, plus les réponses de l'IA seront précises. Tu peux aussi collecter des traductions validées par des locuteurs natifs et les ajouter au dictionnaire.

**Q: Comment améliorer la qualité des traductions ?**
R: 
1. Ajouter plus de mots dans `DICTIONARY_DATA` (traductions exactes)
2. Ajouter des exemples de phrases dans `GRAMMAR_NOTES`
3. Les mots du dictionnaire sont utilisés en priorité (avant l'IA), donc ils sont toujours exacts.
