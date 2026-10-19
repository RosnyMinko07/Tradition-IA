import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Share,
  Clipboard
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme/colors';

// Dictionnaire officiel embarqué (issu de txt.txt et _knowledge.js)
const LOCAL_KNOWLEDGE = {
  // Phrases & expressions exactes
  'laisse moi': { fang: 'zame mah', punu: 'Ni lamba', myene: 'Nyele' },
  'laisse-moi': { fang: 'zame mah', punu: 'Ni lamba', myene: 'Nyele' },
  'bonjour': { fang: 'Mbôlô', punu: 'Mbolo', myene: 'Mbolo', nzebi: 'Mbolo', teke: 'Mpolo' },
  'bonjour tout le monde': { fang: 'Mbolo betii', punu: 'Mbolo bosi', myene: 'Mbolo weva' },
  'merci': { fang: 'Akiba', punu: 'Yine', myene: 'Ogula', nzebi: 'Bassi', teke: 'Nzala' },
  "je n'ai pas d'argent": { fang: 'Me bele ki miang', punu: 'Ni sa dji falanka', nzebi: 'Ni sa di mikuta' },
  "je n'ai pas d argent": { fang: 'Me bele ki miang', punu: 'Ni sa dji falanka', nzebi: 'Ni sa di mikuta' },
  "je n'ai pas de temps": { fang: 'Me bele ki Eyong', punu: 'Ni sa dji nangu', nzebi: 'Ni sa di eyong' },
  "je n'ai pas fini": { fang: 'Me bele mane', punu: 'Ni sa mane', nzebi: 'Ni sa mane' },
  "je n'ai pas vu": { fang: 'Me dzi yene', punu: 'Ni sa mone', nzebi: 'Ni sa mone' },
  "je n'ai pas faim": { fang: 'Ma wok ki zon', punu: 'Ni sa dji nza', nzebi: 'Ni sa di nza' },
  "comment vas-tu ?": { fang: "Y'ô ne mvë ?", punu: 'Wa dji duma ?', myene: 'Nda meye a le ?' },
  "comment vas-tu": { fang: "Y'ô ne mvë ?", punu: 'Wa dji duma ?', myene: 'Nda meye a le ?' },
  "fiche moi la paix": { fang: 'Korgh me mïs', punu: 'Mbika bwe', myene: 'Nkambé' },
  "fiche-moi la paix": { fang: 'Korgh me mïs', punu: 'Mbika bwe', myene: 'Nkambé' },
  "exactement": { fang: 'Dza feh', punu: 'Ghete', myene: 'Kwelé' },
  "je t'aime": { fang: 'Ma dzime wah', punu: 'Ni ku tondi', myene: 'Mi tondi we' },
  "nourriture": { fang: 'bidzi', punu: 'bidya', myene: 'inoma' },
  "arachides": { fang: 'Owone', punu: 'Bikuki', myene: 'Orono' },
  "parler": { fang: 'kobe', punu: 'lamba', myene: 'renga' }
};

export default function TranslateScreen({ onNavigate, routeParams }) {
  const [sourceText, setSourceText] = useState(routeParams?.initialText || 'Bonjour tout le monde');
  const [targetLang, setTargetLang] = useState('Fang');
  const [translatedText, setTranslatedText] = useState('Mbolo betii');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const normalize = (str) => {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[-_']/g, ' ')
      .replace(/[.,\/#!$%\^&\*;:{}=`~()?"«»?]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleTranslate = () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    setTimeout(() => {
      const norm = normalize(sourceText);
      const match = LOCAL_KNOWLEDGE[norm] || LOCAL_KNOWLEDGE[sourceText.trim().toLowerCase()];

      const langKey = targetLang.toLowerCase();
      if (match && match[langKey]) {
        setTranslatedText(match[langKey]);
      } else {
        setTranslatedText("Traduction en cours d'intégration dans cette langue.");
      }
      setIsTranslating(false);
    }, 250);
  };

  const handleCopy = () => {
    if (translatedText) {
      Clipboard.setString(translatedText);
      alert('Traduction copiée dans le presse-papier !');
    }
  };

  const handleShare = async () => {
    if (translatedText) {
      try {
        await Share.share({
          message: `Tradition IA (${targetLang}) : "${sourceText}" ➔ "${translatedText}"`
        });
      } catch (e) {}
    }
  };

  const handleSpeak = () => {
    alert(`Prononciation audio de : "${translatedText}" (${targetLang})`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Barre Sélecteur de Langues */}
      <View style={styles.langSelectorBar}>
        <TouchableOpacity style={styles.langItem} activeOpacity={0.7}>
          <Text style={styles.langFlag}>🇫🇷</Text>
          <Text style={styles.langName}>Français</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.swapBtn}
          onPress={() => alert('Basculement de langue')}
          activeOpacity={0.7}
        >
          <Text style={styles.swapIcon}>⇄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.langItem}
          onPress={() => onNavigate && onNavigate('languages')}
          activeOpacity={0.7}
        >
          <Text style={styles.langFlag}>🇬🇦</Text>
          <Text style={[styles.langName, styles.langNameActive]}>{targetLang}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Carte Saisie Source */}
      <View style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>Texte à traduire</Text>
          {sourceText.length > 0 && (
            <TouchableOpacity onPress={() => setSourceText('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Écrivez ou collez votre texte ici..."
          placeholderTextColor={Colors.textLight}
          value={sourceText}
          onChangeText={setSourceText}
          maxLength={500}
        />

        <View style={styles.inputFooter}>
          <Text style={styles.charCount}>{sourceText.length}/500</Text>
        </View>
      </View>

      {/* Bouton Traduire */}
      <TouchableOpacity
        style={[styles.translateBtn, isTranslating && styles.translateBtnDisabled]}
        onPress={handleTranslate}
        disabled={isTranslating}
        activeOpacity={0.85}
      >
        <Text style={styles.translateBtnText}>
          {isTranslating ? 'Traduction en cours...' : 'Traduire'}
        </Text>
      </TouchableOpacity>

      {/* Carte Résultat Traduction */}
      {translatedText ? (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultTag}>
              <Text style={styles.resultTagText}>Traduction ({targetLang})</Text>
            </View>
            <TouchableOpacity onPress={handleSpeak} style={styles.speakerBtn} activeOpacity={0.7}>
              <Text style={styles.speakerIcon}>🔊</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.resultText}>{translatedText}</Text>

          {/* Boutons d'Action (Copier, Écouter, Partager) */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCopy} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionLabel}>Copier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleSpeak} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>🔈</Text>
              <Text style={styles.actionLabel}>Écouter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>↗️</Text>
              <Text style={styles.actionLabel}>Partager</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {/* Section Autres Suggestions */}
      <View style={styles.suggestionsSection}>
        <Text style={styles.suggestionsTitle}>Autres suggestions</Text>
        <View style={styles.suggestionItem}>
          <View>
            <Text style={styles.suggestionWord}>Mbolo</Text>
            <Text style={styles.suggestionSub}>Bonjour (Salutation universelle)</Text>
          </View>
          <View style={styles.suggestionActions}>
            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              style={styles.iconCircle}
              activeOpacity={0.7}
            >
              <Text style={[styles.heartIcon, isFavorite && { color: Colors.danger }]}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 100
  },
  langSelectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.lg
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  langFlag: {
    fontSize: 20
  },
  langName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain
  },
  langNameActive: {
    color: Colors.primary
  },
  dropdownIcon: {
    fontSize: 10,
    color: Colors.primary,
    marginLeft: 2
  },
  swapBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  swapIcon: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: 'bold'
  },
  inputCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  clearIcon: {
    fontSize: 16,
    color: Colors.textLight,
    padding: 4
  },
  textInput: {
    fontSize: 16,
    color: Colors.textMain,
    minHeight: 90,
    textAlignVertical: 'top',
    lineHeight: 22
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm
  },
  charCount: {
    fontSize: 11,
    color: Colors.textLight
  },
  translateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Spacing.xl
  },
  translateBtnDisabled: {
    opacity: 0.7
  },
  translateBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  resultCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: Spacing.xl
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  resultTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm
  },
  resultTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark
  },
  speakerBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  speakerIcon: {
    fontSize: 16
  },
  resultText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#14532D',
    lineHeight: 28,
    marginBottom: Spacing.lg
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
    paddingTop: Spacing.md
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionIcon: {
    fontSize: 14
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534'
  },
  suggestionsSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  suggestionWord: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textMain
  },
  suggestionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2
  },
  suggestionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heartIcon: {
    fontSize: 16
  }
});
