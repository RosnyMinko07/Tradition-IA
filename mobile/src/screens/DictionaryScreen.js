import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import { Colors, Spacing, Radius } from '../theme/colors';
import { searchDictionary, GABON_LANGUAGES } from '../services/dictionaryService';

const FILTER_OPTIONS = ['Tous', 'Fang', 'Punu', 'Nzébi', 'Myènè'];

export default function DictionaryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');

  const words = searchDictionary(searchQuery, activeFilter);

  const handleSpeakWord = (text) => {
    try {
      Speech.speak(text, { language: 'fr-FR', rate: 0.85 });
    } catch (e) {
      Alert.alert('Écoute', `Prononciation de : ${text}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dictionnaire Gabonais 📚</Text>
        <Text style={styles.subtitle}>
          Explorez le vocabulaire et les sagesses des langues traditionnelles
        </Text>
      </View>

      {/* Barre de Recherche */}
      <View style={styles.searchBarContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un mot (ex: Forêt, Eau, Bonjour)..."
          placeholderTextColor={Colors.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={{ color: Colors.textDim, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtres par langue */}
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_OPTIONS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isActive = activeFilter === item;
            return (
              <TouchableOpacity
                onPress={() => setActiveFilter(item)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Liste des Mots */}
      <FlatList
        data={words}
        keyExtractor={(item, index) => `${item.fr}_${index}`}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
            <Text style={styles.emptyTitle}>Aucun mot trouvé</Text>
            <Text style={styles.emptySubtitle}>Essayez une autre recherche ou un autre dialecte.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.wordFr}>{item.fr}</Text>
                {item.category && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.audioBtn}
                onPress={() => handleSpeakWord(item.Fang || item.Punu || item.fr)}
              >
                <Text style={{ fontSize: 16 }}>🔊</Text>
              </TouchableOpacity>
            </View>

            {/* Traductions */}
            <View style={styles.translationsGrid}>
              {item.Fang && (
                <View style={styles.translationRow}>
                  <Text style={styles.langTag}>🗿 Fang :</Text>
                  <Text style={styles.transValue}>{item.Fang}</Text>
                </View>
              )}
              {item.Punu && (
                <View style={styles.translationRow}>
                  <Text style={styles.langTag}>⚪ Punu :</Text>
                  <Text style={styles.transValue}>{item.Punu}</Text>
                </View>
              )}
              {item.Nzébi && (
                <View style={styles.translationRow}>
                  <Text style={styles.langTag}>🔴 Nzébi :</Text>
                  <Text style={styles.transValue}>{item.Nzébi}</Text>
                </View>
              )}
              {item.Myènè && (
                <View style={styles.translationRow}>
                  <Text style={styles.langTag}>🟡 Myènè :</Text>
                  <Text style={styles.transValue}>{item.Myènè}</Text>
                </View>
              )}
            </View>

            {item.desc && (
              <View style={styles.descContainer}>
                <Text style={styles.descText}>{item.desc}</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    padding: Spacing.lg,
    paddingTop: 54
  },
  header: {
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textMain
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14
  },
  searchInput: {
    flex: 1,
    color: Colors.textMain,
    fontSize: 14,
    padding: 0
  },
  filterRow: {
    marginBottom: 14
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgCard,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  filterChipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600'
  },
  filterChipTextActive: {
    color: '#0B0E14',
    fontWeight: '800'
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  wordFr: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain
  },
  categoryBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  categoryBadgeText: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '700'
  },
  audioBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bgCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border
  },
  translationsGrid: {
    gap: 4,
    marginVertical: 4
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  langTag: {
    fontSize: 12,
    color: Colors.blue,
    fontWeight: '700',
    width: 75
  },
  transValue: {
    fontSize: 14,
    color: Colors.textMain,
    fontWeight: '600'
  },
  descContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
    marginTop: 8
  },
  descText: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textMain
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 4
  }
});
