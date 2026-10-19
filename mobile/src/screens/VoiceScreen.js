import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme/colors';

export default function VoiceScreen({ onNavigate }) {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("Comment ça va aujourd'hui ?");
  const [voiceTranslation, setVoiceTranslation] = useState("Nda meye a le ?");
  const [targetLang, setTargetLang] = useState('Myènè');

  const toggleRecording = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setTranscription("Comment vas-tu ?");
        setVoiceTranslation("Y'ô ne mvë ?");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleSpeak = () => {
    alert(`Prononciation vocale de : "${voiceTranslation}" en ${targetLang}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Sélecteur de langue supérieur */}
      <View style={styles.langBar}>
        <View style={styles.langPill}>
          <Text style={styles.flagEmoji}>🇫🇷</Text>
          <Text style={styles.langTitle}>Français</Text>
        </View>
        <Text style={styles.arrowIcon}>➔</Text>
        <TouchableOpacity
          style={[styles.langPill, styles.langPillActive]}
          onPress={() => onNavigate && onNavigate('languages')}
          activeOpacity={0.7}
        >
          <Text style={styles.flagEmoji}>🇬🇦</Text>
          <Text style={[styles.langTitle, { color: Colors.primary }]}>{targetLang}</Text>
          <Text style={styles.dropArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Visualiseur d'onde sonore et Grand Cercle Micro */}
      <View style={styles.micSection}>
        {/* Barres d'onde sonore simulées */}
        <View style={styles.soundWaveRow}>
          {[18, 32, 48, 70, 40, 65, 80, 50, 60, 35, 20].map((h, i) => (
            <View
              key={i}
              style={[
                styles.soundBar,
                { height: isListening ? Math.min(80, h * 1.3) : h, opacity: isListening ? 1 : 0.4 }
              ]}
            />
          ))}
        </View>

        {/* Bouton Micro Central */}
        <TouchableOpacity
          style={[styles.bigMicBtn, isListening && styles.bigMicBtnActive]}
          onPress={toggleRecording}
          activeOpacity={0.8}
        >
          <Text style={styles.micIcon}>🎙️</Text>
        </TouchableOpacity>

        {/* État de l'écoute */}
        <Text style={styles.listeningStatus}>
          {isListening ? 'Écoute en cours...' : 'Appuyez pour parler'}
        </Text>
        <Text style={styles.listeningHint}>
          {isListening ? 'Parlez distinctement dans votre micro' : 'Dictez votre phrase en français'}
        </Text>
      </View>

      {/* Carte Transcription */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Transcription</Text>
        <Text style={styles.transcriptionText}>{transcription}</Text>
      </View>

      {/* Carte Traduction Reçue */}
      <View style={[styles.card, styles.translationCard]}>
        <View style={styles.cardTop}>
          <Text style={styles.transLangLabel}>Traduction ({targetLang})</Text>
          <TouchableOpacity onPress={handleSpeak} style={styles.audioBtn} activeOpacity={0.7}>
            <Text style={styles.audioIcon}>🔊</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.translationText}>{voiceTranslation}</Text>
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
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full
  },
  langPillActive: {
    backgroundColor: Colors.surfaceSubtle
  },
  flagEmoji: {
    fontSize: 18
  },
  langTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain
  },
  arrowIcon: {
    fontSize: 16,
    color: Colors.textLight
  },
  dropArrow: {
    fontSize: 10,
    color: Colors.primary,
    marginLeft: 2
  },
  micSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xl
  },
  soundWaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 90,
    marginBottom: Spacing.lg
  },
  soundBar: {
    width: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2
  },
  bigMicBtn: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: Spacing.md
  },
  bigMicBtnActive: {
    backgroundColor: '#059669',
    transform: [{ scale: 1.08 }]
  },
  micIcon: {
    fontSize: 34
  },
  listeningStatus: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: 4
  },
  listeningHint: {
    fontSize: 12,
    color: Colors.textMuted
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  transcriptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textMain,
    lineHeight: 22
  },
  translationCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  transLangLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    textTransform: 'uppercase'
  },
  audioBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  audioIcon: {
    fontSize: 14
  },
  translationText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#14532D',
    lineHeight: 28
  }
});
