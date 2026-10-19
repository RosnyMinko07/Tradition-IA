import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onStart }) {
  return (
    <View style={styles.container}>
      {/* Grande image en arrière-plan : Carte du Gabon avec Masques Traditionnels */}
      <Image
        source={require('../../assets/images/gabon_masque_nobg.png')}
        style={styles.bgMaskMap}
        resizeMode="contain"
      />
      <View style={styles.overlay} />

      {/* Contenu au premier plan : Logo officiel Tradition IA */}
      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoHalo} />
          <Image
            source={require('../../assets/images/tradiia_icon.png')}
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Tradition IA</Text>
        <Text style={styles.subtitle}>
          Traduction intelligente des langues du Gabon
        </Text>

        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Text style={styles.quote}>
          « Nos langues, une richesse pour demain »
        </Text>

        <TouchableOpacity
          style={styles.startBtn}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startBtnText}>Entrer dans l'application ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F17',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgMaskMap: {
    position: 'absolute',
    width: width * 0.9,
    height: height * 0.6,
    opacity: 0.35,
    top: '12%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 15, 23, 0.70)',
  },
  logoWrapper: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(0, 158, 73, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#009E49',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  logoHalo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 158, 73, 0.22)',
  },
  logoImg: {
    width: 68,
    height: 68,
    borderRadius: 18,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 28,
    width: '100%',
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  quote: {
    fontSize: 13,
    color: Colors.gold,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 32,
  },
  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    shadowColor: '#009E49',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
