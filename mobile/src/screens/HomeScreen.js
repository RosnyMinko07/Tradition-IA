import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  Image
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme/colors';

export default function HomeScreen({ onNavigate }) {
  const [quickText, setQuickText] = useState('');

  const handleQuickTranslate = () => {
    if (quickText.trim() && onNavigate) {
      onNavigate('translate', { initialText: quickText.trim() });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* En-tête avec Logo et Cloche de Notification */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../assets/images/tradiia_icon.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.brandTitle}>Tradition IA</Text>
            <Text style={styles.brandSubtitle}>Langues & Culture du Gabon</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Bannière avec Image du Web (Carte du Gabon & Masques de index.html) */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerContentRow}>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTag}>PATRIMOINE DU GABON 🇬🇦</Text>
            <Text style={styles.bannerHeading}>
              Traduisez entre le français et les langues gabonaises
            </Text>
            <Text style={styles.bannerSubheading}>
              Faites vivre nos langues ancestrales grâce à l'IA
            </Text>
          </View>
          <Image
            source={require('../../assets/images/gabon_masque_nobg.png')}
            style={styles.heroMaskImg}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Barre de saisie rapide avec bouton envoyer */}
      <View style={styles.quickInputCard}>
        <TextInput
          style={styles.quickInput}
          placeholder="Entrez votre texte à traduire..."
          placeholderTextColor={Colors.textLight}
          value={quickText}
          onChangeText={setQuickText}
          onSubmitEditing={handleQuickTranslate}
        />
        <TouchableOpacity
          style={styles.quickSendBtn}
          onPress={handleQuickTranslate}
          activeOpacity={0.8}
        >
          <Text style={styles.quickSendIcon}>➔</Text>
        </TouchableOpacity>
      </View>

      {/* Section des 4 Modes d'Accès Rapide (Grille de la maquette) */}
      <Text style={styles.sectionTitle}>Modes de traduction</Text>

      <View style={styles.gridContainer}>
        {/* 1. Mode Texte */}
        <TouchableOpacity
          style={[styles.modeCard, { borderColor: '#E0F2FE' }]}
          onPress={() => onNavigate && onNavigate('translate')}
          activeOpacity={0.8}
        >
          <View style={[styles.modeIconBg, { backgroundColor: '#E0F2FE' }]}>
            <Text style={styles.modeEmoji}>📝</Text>
          </View>
          <Text style={styles.modeCardTitle}>Texte</Text>
          <Text style={styles.modeCardDesc}>Traduire un texte écrit</Text>
        </TouchableOpacity>

        {/* 2. Mode Voix */}
        <TouchableOpacity
          style={[styles.modeCard, { borderColor: '#FEF3C7' }]}
          onPress={() => onNavigate && onNavigate('voice')}
          activeOpacity={0.8}
        >
          <View style={[styles.modeIconBg, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.modeEmoji}>🎙️</Text>
          </View>
          <Text style={styles.modeCardTitle}>Voix</Text>
          <Text style={styles.modeCardDesc}>Traduire par la voix</Text>
        </TouchableOpacity>

        {/* 3. Mode Caméra */}
        <TouchableOpacity
          style={[styles.modeCard, { borderColor: '#DCFCE7' }]}
          onPress={() => onNavigate && onNavigate('camera')}
          activeOpacity={0.8}
        >
          <View style={[styles.modeIconBg, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.modeEmoji}>📷</Text>
          </View>
          <Text style={styles.modeCardTitle}>Caméra</Text>
          <Text style={styles.modeCardDesc}>Traduire une image (OCR)</Text>
        </TouchableOpacity>

        {/* 4. Mode Conversation */}
        <TouchableOpacity
          style={[styles.modeCard, { borderColor: '#FFEDD5' }]}
          onPress={() => onNavigate && onNavigate('conversation')}
          activeOpacity={0.8}
        >
          <View style={[styles.modeIconBg, { backgroundColor: '#FFEDD5' }]}>
            <Text style={styles.modeEmoji}>💬</Text>
          </View>
          <Text style={styles.modeCardTitle}>Conversation</Text>
          <Text style={styles.modeCardDesc}>Dialogue bilingue direct</Text>
        </TouchableOpacity>
      </View>

      {/* Carte Citation & Sagesse du Gabon */}
      <View style={styles.quoteCard}>
        <View style={styles.quoteTop}>
          <Text style={styles.quoteBadge}>PROVERBE DU GABON</Text>
          <Text style={styles.quoteLang}>Fang</Text>
        </View>
        <Text style={styles.quoteText}>« Za feh • L'arbre seul ne fait pas la forêt »</Text>
        <Text style={styles.quoteTranslation}>L'union et la solidarité font la force d'un peuple.</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  logoImg: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border
  },
  bannerContainer: {
    minHeight: 145,
    borderRadius: Radius.xl,
    backgroundColor: '#0F291E',
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 158, 73, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  bannerContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 10
  },
  heroMaskImg: {
    width: 82,
    height: 82
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 0.8,
    marginBottom: 4
  },
  bannerHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 4
  },
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 4
  },
  bannerSubheading: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)'
  },
  quickInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: Spacing.xl
  },
  quickInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain,
    paddingHorizontal: Spacing.sm
  },
  quickSendBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quickSendIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: Spacing.md
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: Spacing.xl
  },
  modeCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  modeIconBg: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  modeEmoji: {
    fontSize: 22
  },
  modeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: 2
  },
  modeCardDesc: {
    fontSize: 11,
    color: Colors.textMuted
  },
  quoteCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.gold
  },
  quoteTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  quoteBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 0.5
  },
  quoteLang: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 4
  },
  quoteTranslation: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic'
  }
});
