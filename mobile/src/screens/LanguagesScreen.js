import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme/colors';
import { GABON_LANGUAGES } from '../services/dictionaryService';

const ALL_LANGUAGES = [
  ...GABON_LANGUAGES.map(l => ({
    id: l.id,
    name: `${l.name} (${l.nativeName})`,
    desc: `${l.region} • ${l.speakers}`,
    flag: '🇬🇦',
    mask: l.mask,
    color: l.color
  })),
  {
    id: 'Français',
    name: 'Français',
    desc: 'Langue officielle et véhiculaire du Gabon',
    flag: '🇫🇷',
    mask: null,
    color: '#64748B'
  }
];

export default function LanguagesScreen({ onSelectLang, selectedLang = 'Fang', onBack }) {
  const [search, setSearch] = useState('');
  const [activeLang, setActiveLang] = useState(selectedLang);

  const filtered = ALL_LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (langId) => {
    setActiveLang(langId);
    if (onSelectLang) onSelectLang(langId);
    if (onBack) onBack();
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Choisir une langue</Text>
      </View>

      {/* Barre de Recherche */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une langue ou une région..."
          placeholderTextColor={Colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Titre Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Langues du Gabon</Text>
        <Text style={styles.sectionCount}>{filtered.length} disponibles</Text>
      </View>

      {/* Liste des Langues */}
      <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => {
          const isSelected = activeLang === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.langCard, isSelected && styles.langCardSelected]}
              onPress={() => handleSelect(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.flagCircle, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.flagText}>{item.flag}</Text>
              </View>

              <View style={styles.langInfo}>
                <Text style={[styles.langItemName, isSelected && { color: Colors.primary }]}>
                  {item.name}
                </Text>
                <Text style={styles.langItemDesc}>{item.desc}</Text>
              </View>

              {/* Radio Indicator */}
              <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: 18,
    color: Colors.textMain
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain
  },
  clearSearch: {
    fontSize: 14,
    color: Colors.textLight,
    padding: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted
  },
  scrollList: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  langCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FDF4'
  },
  flagCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flagText: {
    fontSize: 22
  },
  langInfo: {
    flex: 1
  },
  langItemName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: 2
  },
  langItemDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  radioCircleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary
  }
});
