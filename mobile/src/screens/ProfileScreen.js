import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme/colors';

export default function ProfileScreen({ onLogout, onNavigate }) {
  const [offlineMode, setOfflineMode] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon profil</Text>
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Carte Utilisateur */}
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Utilisateur Tradition IA</Text>
          <Text style={styles.userEmail}>utilisateur@gmail.com</Text>
          <View style={styles.badgeMember}>
            <Text style={styles.badgeMemberText}>Membre Actif • Gabon 🇬🇦</Text>
          </View>
        </View>
      </View>

      {/* Jauge de Découverte des Langues (3/6) */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Découvrir les langues du Gabon</Text>
          <Text style={styles.progressScore}>3/6</Text>
        </View>
        <Text style={styles.progressSub}>6 langues régionales disponibles</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>
      </View>

      {/* Liste des Réglages & Paramètres */}
      <View style={styles.settingsGroup}>
        {/* Mode Hors Ligne */}
        <View style={styles.settingItem}>
          <View style={[styles.settingIconBg, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.settingEmoji}>📶</Text>
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Mode hors ligne</Text>
            <Text style={styles.settingSub}>Utiliser l'app sans connexion</Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={offlineMode ? Colors.primary : '#FFFFFF'}
          />
        </View>

        {/* Télécharger des langues */}
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={() => alert('Packs de langues hors-ligne : Fang (12 Mo), Punu (8 Mo) installés.')}>
          <View style={[styles.settingIconBg, { backgroundColor: '#E0F2FE' }]}>
            <Text style={styles.settingEmoji}>⬇️</Text>
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Télécharger des langues</Text>
            <Text style={styles.settingSub}>Disponibles hors ligne</Text>
          </View>
          <Text style={styles.chevronIcon}>›</Text>
        </TouchableOpacity>

        {/* Thème Sombre */}
        <View style={styles.settingItem}>
          <View style={[styles.settingIconBg, { backgroundColor: '#F1F5F9' }]}>
            <Text style={styles.settingEmoji}>🌙</Text>
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Thème sombre</Text>
            <Text style={styles.settingSub}>Changer l'apparence</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={darkMode ? Colors.primary : '#FFFFFF'}
          />
        </View>

        {/* Notifications */}
        <View style={styles.settingItem}>
          <View style={[styles.settingIconBg, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.settingEmoji}>🔔</Text>
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingSub}>Actualités et mots du jour</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.border, true: Colors.primaryLight }}
            thumbColor={notifications ? Colors.primary : '#FFFFFF'}
          />
        </View>

        {/* Aide et support */}
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={() => alert('Support Tradition IA : contact@tradition-ia.ga')}>
          <View style={[styles.settingIconBg, { backgroundColor: '#F3E8FF' }]}>
            <Text style={styles.settingEmoji}>❓</Text>
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Aide et support</Text>
            <Text style={styles.settingSub}>Centre d'aide et documentation</Text>
          </View>
          <Text style={styles.chevronIcon}>›</Text>
        </TouchableOpacity>

        {/* À propos */}
        <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} activeOpacity={0.7} onPress={() => alert('Tradition IA v1.0.0 — Gabon')}>
          <View style={[styles.settingIconBg, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.settingEmoji}>ℹ️</Text>
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>À propos</Text>
            <Text style={styles.settingSub}>Version 1.0.0 (Officielle)</Text>
          </View>
          <Text style={styles.chevronIcon}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton de Déconnexion */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => onLogout && onLogout()}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textMain
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border
  },
  settingsIcon: {
    fontSize: 18
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarEmoji: {
    fontSize: 28
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain,
    marginBottom: 2
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6
  },
  badgeMember: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#DCFCE7'
  },
  badgeMemberText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark
  },
  progressCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain
  },
  progressScore: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary
  },
  progressSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 10
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4
  },
  settingsGroup: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.xl
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12
  },
  settingIconBg: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingEmoji: {
    fontSize: 18
  },
  settingTextCol: {
    flex: 1
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 2
  },
  settingSub: {
    fontSize: 11,
    color: Colors.textMuted
  },
  chevronIcon: {
    fontSize: 20,
    color: Colors.textLight,
    fontWeight: '600'
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: Radius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.danger
  }
});
