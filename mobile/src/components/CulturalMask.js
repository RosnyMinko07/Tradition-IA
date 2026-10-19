import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

export default function CulturalMask({ dialect = 'Fang', size = 50, showTitle = false }) {
  const getMaskInfo = (d) => {
    switch (d?.toLowerCase()) {
      case 'punu':
        return {
          emoji: '⚪',
          name: 'Okuyi Punu',
          meaning: 'Beauté & Sagesse blanche',
          borderColor: '#CBD5E1',
          glow: 'rgba(203, 213, 225, 0.25)'
        };
      case 'nzebe':
      case 'nzébi':
        return {
          emoji: '🔴',
          name: 'Bwiti Nzébi',
          meaning: 'Force & Énergie ancestrale',
          borderColor: Colors.gold,
          glow: 'rgba(245, 158, 11, 0.25)'
        };
      case 'myene':
      case 'myènè':
        return {
          emoji: '🟡',
          name: 'Ivili Myènè',
          meaning: 'Esprit aquatique & Paix',
          borderColor: Colors.blue,
          glow: 'rgba(56, 189, 248, 0.25)'
        };
      case 'kota':
        return {
          emoji: '🪙',
          name: 'Mbulu Kota',
          meaning: 'Protection du reliquaire',
          borderColor: '#E2E8F0',
          glow: 'rgba(226, 232, 240, 0.25)'
        };
      case 'fang':
      default:
        return {
          emoji: '🗿',
          name: 'Ngil Fang',
          meaning: 'Justice & Vérité sacrée',
          borderColor: Colors.gold,
          glow: 'rgba(245, 158, 11, 0.25)'
        };
    }
  };

  const info = getMaskInfo(dialect);

  return (
    <View style={styles.wrapper}>
      <View style={[
        styles.badgeContainer,
        {
          width: size * 1.25,
          height: size * 1.25,
          borderColor: info.borderColor,
          shadowColor: info.borderColor
        }
      ]}>
        <Text style={{ fontSize: size * 0.55 }}>{info.emoji}</Text>
      </View>

      {showTitle && (
        <View style={styles.textGroup}>
          <Text style={[styles.title, { color: info.borderColor }]}>{info.name}</Text>
          <Text style={styles.meaning}>{info.meaning}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeContainer: {
    backgroundColor: Colors.bgCardLight,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4
  },
  textGroup: {
    marginTop: 8,
    alignItems: 'center'
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  meaning: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2
  }
});
