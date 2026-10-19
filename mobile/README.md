# 📱 Tradition IA — Application Mobile (React Native & Expo)

Application mobile native de traduction et préservation des langues gabonaises (Fang, Punu, Nzébi, Myènè, Téké, Kota), conçue pour **iOS** et **Android**.

---

## 🚀 Démarrage Ultra Rapide en 3 étapes :

### 1. Rendez-vous dans le dossier mobile :
```bash
cd mobile
```

### 2. Installez les dépendances :
```bash
npm install
```

### 3. Lancez le serveur Expo :
```bash
npm start
```

---

## 📲 Comment tester sur votre vrai Smartphone :

1. Téléchargez l'application gratuite **Expo Go** sur votre téléphone :
   - [Télécharger sur Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [Télécharger sur App Store (iPhone)](https://apps.apple.com/fr/app/expo-go/id982107779)
2. Scannez le **QR Code** qui s'affiche dans votre terminal :
   - **Sur iPhone** : Ouvrez directement l'appareil photo et touchez le lien jaune Expo.
   - **Sur Android** : Ouvrez l'application Expo Go et appuyez sur *« Scan QR code »*.
3. L'application Tradition IA s'ouvre directement sur votre téléphone en plein écran avec toutes les fonctionnalités interactives !

---

## 🎨 Fonctionnalités de l'Application Mobile :

1. **🌐 Écran Traduction (`src/screens/TranslateScreen.js`)** :
   - Traduction instantanée Français ➔ Langues gabonaises.
   - Puces de suggestions rapides de phrases courantes.
   - Prononciation vocale locale via `expo-speech`.
   - Bouton de copie rapide.

2. **📚 Écran Dictionnaire (`src/screens/DictionaryScreen.js`)** :
   - Glossaire avec recherche instantanée.
   - Filtre par dialectes (Fang, Punu, Nzébi, Myènè).
   - Définitions culturelles et contexte traditionnel.

3. **🤖 Écran Mbolo IA (`src/screens/ChatScreen.js`)** :
   - Assistant conversationnel sur les traditions, proverbes et rites gabonais.
   - Suggestions de questions culturelles en bulles cliquables.

4. **👤 Écran Mon Profil (`src/screens/ProfileScreen.js`)** :
   - Masque culturel traditionnel attribué (Ngil Fang, Okuyi Punu, Kota, etc.).
   - Choix du dialecte favori.
   - Statistiques d'apprentissage et synchronisation cloud Supabase.
