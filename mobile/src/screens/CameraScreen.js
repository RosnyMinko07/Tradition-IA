import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme/colors';

export default function CameraScreen({ onBack }) {
  const [targetLang, setTargetLang] = useState('Fang');
  const [detectedText, setDetectedText] = useState('Bienvenue');
  const [translatedText, setTranslatedText] = useState('Mbolo');
  const [isScanning, setIsScanning] = useState(false);

  const handleCapture = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setDetectedText('PARC NATIONAL DE LOANGO');
      setTranslatedText('Afan éba ya Loango');
    }, 1200);
  };

  const handleSpeak = () => {
    alert(`Prononciation : "${translatedText}" en ${targetLang}`);
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.headerBtn} activeOpacity={0.7}>
            <Text style={styles.headerBtnIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Traduction par caméra</Text>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Text style={styles.headerBtnIcon}>⛶</Text>
        </TouchableOpacity>
      </View>

      {/* Viseur Caméra en Direct */}
      <View style={styles.viewfinderContainer}>
        {/* Simulation du décor (Panneau du Parc de Loango) */}
        <View style={styles.simulatedScene}>
          <Text style={styles.sceneTitle}>PARC NATIONAL</Text>
          <Text style={styles.sceneSubtitle}>DE LOANGO</Text>
          <View style={styles.signDivider} />
          
          {/* Cadre de Détection OCR Vert */}
          <View style={[styles.ocrBoundingBox, isScanning && styles.ocrScanning]}>
            <Text style={styles.signTextDetected}>BIENVENUE</Text>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>

          <Text style={styles.signTextSub}>WELCOME</Text>
        </View>

        {/* Badge Viseur Actif */}
        <View style={styles.viewfinderBadge}>
          <Text style={styles.badgeDot}>🟢</Text>
          <Text style={styles.badgeText}>
            {isScanning ? 'Analyse OCR en cours...' : 'Alignez le texte dans le cadre'}
          </Text>
        </View>
      </View>

      {/* Cartes Résultats en Bas */}
      <View style={styles.resultsContainer}>
        {/* Texte Détecté */}
        <View style={styles.detectedRow}>
          <View>
            <Text style={styles.detectedLabel}>Texte détecté</Text>
            <Text style={styles.detectedValue}>{detectedText}</Text>
          </View>
          <View style={styles.miniThumbnail}>
            <Text style={styles.miniThumbnailIcon}>🏞️</Text>
          </View>
        </View>

        {/* Traduction Générée */}
        <View style={styles.translationRow}>
          <View>
            <Text style={styles.transLabel}>Traduction ({targetLang})</Text>
            <Text style={styles.transValue}>{translatedText}</Text>
          </View>
          <TouchableOpacity style={styles.audioCircle} onPress={handleSpeak} activeOpacity={0.7}>
            <Text style={styles.audioEmoji}>🔊</Text>
          </TouchableOpacity>
        </View>

        {/* Barre de Contrôle Caméra */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.galleryBtn} activeOpacity={0.7} onPress={() => alert('Sélectionner une photo de votre galerie')}>
            <Text style={styles.galleryIcon}>🖼️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureBtn, isScanning && styles.captureBtnActive]}
            onPress={handleCapture}
            activeOpacity={0.8}
          >
            <Text style={styles.captureIcon}>📷</Text>
            <Text style={styles.captureText}>Prendre une photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.flipBtn} activeOpacity={0.7} onPress={() => alert('Changement de caméra')}>
            <Text style={styles.flipIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerBtnIcon: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  viewfinderContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  simulatedScene: {
    width: '85%',
    backgroundColor: '#452A18',
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#2E1A0E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20
  },
  sceneTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 2
  },
  sceneSubtitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FCD116',
    letterSpacing: 2,
    marginBottom: 8
  },
  signDivider: {
    width: '80%',
    height: 2,
    backgroundColor: '#6B4423',
    marginBottom: 12
  },
  ocrBoundingBox: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: Radius.sm,
    marginBottom: 8
  },
  ocrScanning: {
    backgroundColor: 'rgba(16, 185, 129, 0.45)',
    borderColor: '#FFFFFF'
  },
  signTextDetected: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1
  },
  signTextSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    letterSpacing: 1
  },
  cornerTL: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 12,
    height: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF'
  },
  cornerTR: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF'
  },
  cornerBL: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: 12,
    height: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF'
  },
  cornerBR: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 12,
    height: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF'
  },
  viewfinderBadge: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full
  },
  badgeDot: {
    fontSize: 10
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  resultsContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: 28
  },
  detectedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  detectedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase'
  },
  detectedValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain
  },
  miniThumbnail: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  miniThumbnailIcon: {
    fontSize: 20
  },
  translationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md
  },
  transLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    textTransform: 'uppercase'
  },
  transValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary
  },
  audioCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  audioEmoji: {
    fontSize: 18
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md
  },
  galleryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  galleryIcon: {
    fontSize: 20
  },
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.full,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  captureBtnActive: {
    backgroundColor: '#059669',
    transform: [{ scale: 0.98 }]
  },
  captureIcon: {
    fontSize: 18
  },
  captureText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  flipBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flipIcon: {
    fontSize: 20
  }
});
