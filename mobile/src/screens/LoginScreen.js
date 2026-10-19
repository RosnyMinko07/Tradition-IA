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

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister, onContinueGuest }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess({ email });
    }, 600);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Images du Web : Carte du Gabon avec halo et drapeau officiel */}
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

        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>
          Connectez-vous à la plateforme Tradition IA pour retrouver vos langues et votre historique.
        </Text>
      </View>

      {/* Formulaire */}
      <View style={styles.formCard}>
        {/* Champ Email */}
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

        {/* Champ Mot de passe */}
        <View style={styles.inputGroup}>
          <View style={styles.passHeader}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TouchableOpacity onPress={() => alert('Veuillez contacter le support pour réinitialiser.')}>
              <Text style={styles.forgotText}>Oublié ?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton Connexion */}
        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.loginBtnText}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lien vers Inscription */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
        <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
          <Text style={styles.registerLink}>S'inscrire</Text>
        </TouchableOpacity>
      </View>

      {/* Continuer en tant qu'invité */}
      <TouchableOpacity
        style={styles.guestBtn}
        onPress={onContinueGuest}
        activeOpacity={0.7}
      >
        <Text style={styles.guestText}>Continuer en mode invité ➔</Text>
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
    padding: Spacing.xl,
    paddingTop: 50,
    paddingBottom: 40
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl
  },
  mapHaloWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 158, 73, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3
  },
  gabonMapImg: {
    width: 72,
    height: 72
  },
  flagImg: {
    width: 48,
    height: 30,
    marginBottom: 8
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textMain,
    letterSpacing: -0.5,
    marginBottom: 6
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20
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
    marginBottom: Spacing.xl
  },
  inputGroup: {
    marginBottom: Spacing.lg
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMain,
    marginBottom: 6
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary
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
    height: 48,
    fontSize: 14,
    color: Colors.textMain
  },
  eyeBtn: {
    padding: 6
  },
  eyeIcon: {
    fontSize: 16
  },
  loginBtn: {
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
  loginBtnDisabled: {
    opacity: 0.7
  },
  loginBtnText: {
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
  registerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 8
  },
  guestText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textLight
  }
});
