import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme/colors';

const LANGUAGES = ['Fang', 'Punu', 'Myènè', 'Nzebi', 'Téké', 'Kota'];

export default function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLang, setSelectedLang] = useState('Fang');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Compte créé avec succès ! Bienvenue sur Tradition IA.');
      if (onRegisterSuccess) onRegisterSuccess({ fullName, email, selectedLang });
    }, 700);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* En-tête avec Carte du Gabon et drapeau officiel (identique au web) */}
      <View style={styles.header}>
        <View style={styles.mapHaloWrapper}>
          <Image
            source={require('../../assets/images/gabon_masque_nobg.png')}
            style={styles.gabonMapImg}
            resizeMode="contain"
          />
        </View>

        <Image
          source={require('../../assets/images/drapeau_gabon_nobg.png')}
          style={styles.flagImg}
          resizeMode="contain"
        />

        <Text style={styles.title}>Créer un Compte</Text>
        <Text style={styles.subtitle}>
          Rejoignez la communauté Tradition IA pour apprendre et préserver nos langues.
        </Text>
      </View>

      {/* Formulaire */}
      <View style={styles.formCard}>
        {/* Nom complet */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nom complet</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Jean-Marc Nguema"
              placeholderTextColor={Colors.textLight}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Adresse Email</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="votre.email@exemple.ga"
              placeholderTextColor={Colors.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Langue favorite */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Langue favorite à apprendre</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.langPillsRow}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[styles.langPill, isSelected && styles.langPillActive]}
                  onPress={() => setSelectedLang(lang)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.langPillText, isSelected && styles.langPillTextActive]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Mot de passe */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mot de passe</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 caractères"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Confirmation Mot de passe */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirmez votre mot de passe"
              placeholderTextColor={Colors.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Bouton Inscription */}
        <TouchableOpacity
          style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.registerBtnText}>
            {loading ? 'Création du compte...' : "S'inscrire"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lien vers Connexion */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Vous avez déjà un compte ?</Text>
        <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
          <Text style={styles.loginLink}>Se connecter</Text>
        </TouchableOpacity>
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
    padding: Spacing.xl,
    paddingTop: 40,
    paddingBottom: 40
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl
  },
  mapHaloWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(0, 158, 73, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3
  },
  gabonMapImg: {
    width: 68,
    height: 68
  },
  flagImg: {
    width: 44,
    height: 28,
    marginBottom: 6
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textMain,
    letterSpacing: -0.5,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: Spacing.lg
  },
  inputGroup: {
    marginBottom: Spacing.md
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 6
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: Colors.textMain
  },
  langPillsRow: {
    flexDirection: 'row',
    marginTop: 4
  },
  langPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8
  },
  langPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted
  },
  langPillTextActive: {
    color: '#FFFFFF'
  },
  registerBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginTop: Spacing.sm
  },
  registerBtnDisabled: {
    opacity: 0.7
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary
  }
});
