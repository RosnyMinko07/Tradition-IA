import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme/colors';

const SAMPLE_HISTORY = [
  {
    id: 1,
    source: 'Bonjour',
    sourceLang: 'Français',
    targetLang: 'Fang',
    translation: 'Mbolo',
    isFavorite: true,
    date: 'Aujourd’hui'
  },
  {
    id: 2,
    source: 'Merci',
    sourceLang: 'Français',
    targetLang: 'Punu',
    translation: 'Medza',
    isFavorite: true,
    date: 'Aujourd’hui'
  },
  {
    id: 3,
    source: 'Comment vas-tu ?',
    sourceLang: 'Français',
    targetLang: 'Myènè',
    translation: 'Nda meye a le ?',
    isFavorite: true,
    date: 'Hier'
  },
  {
    id: 4,
    source: 'Au revoir',
    sourceLang: 'Français',
    targetLang: 'Nzebi',
    translation: 'Kuele',
    isFavorite: true,
    date: 'Hier'
  },
  {
    id: 5,
    source: "Je t'aime",
    sourceLang: 'Français',
    targetLang: 'Téké',
    translation: 'Mono ndé',
    isFavorite: true,
    date: '14 Oct'
  },
  {
    id: 6,
    source: 'Bienvenue',
    sourceLang: 'Français',
    targetLang: 'Kota',
    translation: 'Wèli',
    isFavorite: true,
    date: '12 Oct'
  }
];

export default function HistoryScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('favoris'); // 'tout', 'favoris', 'recents'
  const [items, setItems] = useState(SAMPLE_HISTORY);

  const toggleFavorite = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleSpeak = (text, lang) => {
    alert(`Prononciation : "${text}" (${lang})`);
  };

  const displayedItems = items.filter(item => {
    if (activeTab === 'favoris') return item.isFavorite;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Text style={styles.iconBtnText}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Historique & Vocabulaire</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Text style={styles.iconBtnText}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Onglets : Tout | Favoris | Récents */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'tout' && styles.tabBtnActive]}
          onPress={() => setActiveTab('tout')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabBtnText, activeTab === 'tout' && styles.tabBtnTextActive]}>
            Tout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'favoris' && styles.tabBtnActive]}
          onPress={() => setActiveTab('favoris')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabBtnText, activeTab === 'favoris' && styles.tabBtnTextActive]}>
            Favoris
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'recents' && styles.tabBtnActive]}
          onPress={() => setActiveTab('recents')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabBtnText, activeTab === 'recents' && styles.tabBtnTextActive]}>
            Récents
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des Cartes d'Historique */}
      <ScrollView style={styles.listScroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {displayedItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📂</Text>
            <Text style={styles.emptyTitle}>Aucune entrée trouvée</Text>
            <Text style={styles.emptySub}>Les traductions enregistrées apparaîtront ici.</Text>
          </View>
        ) : (
          displayedItems.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.cardInfo}>
                <Text style={styles.sourceText}>{item.source}</Text>
                <Text style={styles.langPair}>
                  {item.sourceLang} ➔ {item.targetLang}
                </Text>
                <Text style={styles.targetText}>{item.translation}</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionCircle}
                  onPress={() => handleSpeak(item.translation, item.targetLang)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionEmoji}>🔊</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionCircle}
                  onPress={() => toggleFavorite(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.actionEmoji, item.isFavorite && { color: Colors.danger }]}>
                    {item.isFavorite ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconBtnText: {
    fontSize: 16,
    color: Colors.textMain,
    fontWeight: 'bold'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textMain
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBtnActive: {
    backgroundColor: Colors.primary
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted
  },
  tabBtnTextActive: {
    color: '#FFFFFF'
  },
  listScroll: {
    flex: 1
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1
  },
  cardInfo: {
    flex: 1
  },
  sourceText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: 2
  },
  langPair: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '600',
    marginBottom: 4
  },
  targetText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionEmoji: {
    fontSize: 16
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 4
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted
  }
});
