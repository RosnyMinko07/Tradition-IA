import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from 'react-native';
import { Colors } from './src/theme/colors';

// Import de tous les écrans officiels de la maquette
import HomeScreen from './src/screens/HomeScreen';
import TranslateScreen from './src/screens/TranslateScreen';
import VoiceScreen from './src/screens/VoiceScreen';
import ConversationScreen from './src/screens/ConversationScreen';
import LanguagesScreen from './src/screens/LanguagesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CameraScreen from './src/screens/CameraScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash', 'home', 'translate', etc.
  const [routeParams, setRouteParams] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ name: 'Utilisateur Tradition IA', email: 'utilisateur@gmail.com' });

  const navigateTo = (screenName, params = {}) => {
    setRouteParams(params);
    setCurrentScreen(screenName);
  };

  const handleLoginSuccess = (userData) => {
    setUser({ name: userData.email.split('@')[0], email: userData.email });
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleRegisterSuccess = (userData) => {
    setUser({ name: userData.fullName, email: userData.email });
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  // Rendu de l'écran actif
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onStart={() => setCurrentScreen('home')} />;
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />;
      case 'translate':
        return <TranslateScreen onNavigate={navigateTo} routeParams={routeParams} />;
      case 'voice':
        return <VoiceScreen onNavigate={navigateTo} />;
      case 'conversation':
        return <ConversationScreen onNavigate={navigateTo} />;
      case 'languages':
        return (
          <LanguagesScreen
            onSelectLang={(lang) => navigateTo('translate', { targetLang: lang })}
            onBack={() => navigateTo('translate')}
          />
        );
      case 'history':
        return <HistoryScreen onBack={() => navigateTo('home')} />;
      case 'profile':
        return <ProfileScreen onLogout={handleLogout} onNavigate={navigateTo} />;
      case 'camera':
        return <CameraScreen onBack={() => navigateTo('home')} />;
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentScreen('register')}
            onContinueGuest={() => setCurrentScreen('home')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  // Masquer la barre de navigation sur les écrans plein écran (Splash, Caméra, Login, Register)
  const hideBottomBar = ['splash', 'camera', 'login', 'register'].includes(currentScreen);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Vue de l'écran en cours */}
      <View style={styles.body}>
        {renderScreen()}
      </View>

      {/* Barre de navigation inférieure (Bottom Tab Bar de la maquette) */}
      {!hideBottomBar && (
        <View style={styles.bottomBar}>
          {/* 1. Onglet Accueil */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('home')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, currentScreen === 'home' && styles.tabActiveText]}>
              🏠
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'home' && styles.tabActiveText]}>
              Accueil
            </Text>
          </TouchableOpacity>

          {/* 2. Onglet Traduire */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('translate')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, currentScreen === 'translate' && styles.tabActiveText]}>
              🔄
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'translate' && styles.tabActiveText]}>
              Traduire
            </Text>
          </TouchableOpacity>

          {/* 3. Onglet Conversation */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('conversation')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, currentScreen === 'conversation' && styles.tabActiveText]}>
              💬
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'conversation' && styles.tabActiveText]}>
              Dialogue
            </Text>
          </TouchableOpacity>

          {/* 4. Onglet Historique / Favoris */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('history')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, currentScreen === 'history' && styles.tabActiveText]}>
              ⭐
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'history' && styles.tabActiveText]}>
              Favoris
            </Text>
          </TouchableOpacity>

          {/* 5. Onglet Profil */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => {
              if (isAuthenticated) {
                setCurrentScreen('profile');
              } else {
                setCurrentScreen('login');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, currentScreen === 'profile' && styles.tabActiveText]}>
              👤
            </Text>
            <Text style={[styles.tabLabel, currentScreen === 'profile' && styles.tabActiveText]}>
              Profil
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  body: {
    flex: 1,
    backgroundColor: Colors.bg
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 68,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted
  },
  tabActiveText: {
    color: Colors.primary
  }
});
