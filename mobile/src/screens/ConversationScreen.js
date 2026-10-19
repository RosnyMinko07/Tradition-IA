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

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'user1',
    lang: 'Français',
    avatar: '👨🏽',
    text: 'Bonjour ! Comment allez-vous ?',
    translation: 'Mwa diyi ! Wo yéé a ?'
  },
  {
    id: 2,
    sender: 'user2',
    lang: 'Punu',
    avatar: '👩🏾',
    text: 'Mwa diyi ! Wo yéé a ?',
    translation: 'Bonjour ! Comment allez-vous ?'
  },
  {
    id: 3,
    sender: 'user1',
    lang: 'Français',
    avatar: '👨🏽',
    text: 'Je vais bien, merci. Et vous ?',
    translation: 'Me yéé. Medza bien.'
  },
  {
    id: 4,
    sender: 'user2',
    lang: 'Punu',
    avatar: '👩🏾',
    text: 'Me yéé. Medza bien.',
    translation: 'Je vais bien aussi.'
  }
];

export default function ConversationScreen() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeSpeaker, setActiveSpeaker] = useState('user1'); // 'user1' (FR) ou 'user2' (Punu)
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const isFr = activeSpeaker === 'user1';
    const newMsg = {
      id: Date.now(),
      sender: activeSpeaker,
      lang: isFr ? 'Français' : 'Punu',
      avatar: isFr ? '👨🏽' : '👩🏾',
      text: inputText.trim(),
      translation: isFr ? 'Traduction locale générée' : 'Traduction française'
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleSpeak = (text) => {
    alert(`Lecture audio : "${text}"`);
  };

  return (
    <View style={styles.container}>
      {/* Barre Supérieure Sélecteur Français ⇄ Punu */}
      <View style={styles.topBar}>
        <View style={styles.speakerTag}>
          <Text style={styles.flagIcon}>🇫🇷</Text>
          <Text style={styles.speakerName}>Français</Text>
        </View>
        <Text style={styles.dialogueIcon}>⇄</Text>
        <View style={styles.speakerTag}>
          <Text style={styles.flagIcon}>🇬🇦</Text>
          <Text style={[styles.speakerName, { color: Colors.primary }]}>Punu</Text>
        </View>
      </View>

      {/* Liste des Bulles de Conversation */}
      <ScrollView
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((item) => {
          const isUser1 = item.sender === 'user1';
          return (
            <View
              key={item.id}
              style={[
                styles.messageRow,
                isUser1 ? styles.rowLeft : styles.rowRight
              ]}
            >
              {isUser1 && <Text style={styles.avatarText}>{item.avatar}</Text>}

              <View
                style={[
                  styles.bubble,
                  isUser1 ? styles.bubbleUser1 : styles.bubbleUser2
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser1 ? styles.textUser1 : styles.textUser2
                  ]}
                >
                  {item.text}
                </Text>

                <View style={styles.bubbleFooter}>
                  <Text
                    style={[
                      styles.langBadge,
                      isUser1 ? styles.badgeUser1 : styles.badgeUser2
                    ]}
                  >
                    {item.lang}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleSpeak(item.text)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.bubbleAudioIcon}>🔊</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {!isUser1 && <Text style={styles.avatarText}>{item.avatar}</Text>}
            </View>
          );
        })}
      </ScrollView>

      {/* Barre de Saisie & Micros Alternés */}
      <View style={styles.bottomBar}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={[
              styles.micButton,
              activeSpeaker === 'user1' ? styles.micActiveFr : styles.micActiveGab
            ]}
            onPress={() => setActiveSpeaker(activeSpeaker === 'user1' ? 'user2' : 'user1')}
            activeOpacity={0.8}
          >
            <Text style={styles.micButtonIcon}>🎙️</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder={`Parler en ${activeSpeaker === 'user1' ? 'Français' : 'Punu'}...`}
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonIcon}>➔</Text>
          </TouchableOpacity>
        </View>

        {/* Sélecteur de locuteur actif */}
        <View style={styles.speakerSwitcher}>
          <TouchableOpacity
            style={[
              styles.switchTab,
              activeSpeaker === 'user1' && styles.switchTabActive
            ]}
            onPress={() => setActiveSpeaker('user1')}
          >
            <Text style={styles.switchTabText}>🇫🇷 Français</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchTab,
              activeSpeaker === 'user2' && styles.switchTabActive
            ]}
            onPress={() => setActiveSpeaker('user2')}
          >
            <Text style={styles.switchTabText}>🇬🇦 Punu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  speakerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  flagIcon: {
    fontSize: 18
  },
  speakerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMain
  },
  dialogueIcon: {
    fontSize: 16,
    color: Colors.textLight
  },
  chatScroll: {
    flex: 1
  },
  chatContent: {
    padding: Spacing.lg,
    paddingBottom: 20
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    gap: 8
  },
  rowLeft: {
    justifyContent: 'flex-start'
  },
  rowRight: {
    justifyContent: 'flex-end'
  },
  avatarText: {
    fontSize: 24,
    marginBottom: 4
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1
  },
  bubbleUser1: {
    backgroundColor: '#EFF6FF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE'
  },
  bubbleUser2: {
    backgroundColor: '#F0FDF4',
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: '#DCFCE7'
  },
  messageText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 6
  },
  textUser1: {
    color: '#1E3A8A'
  },
  textUser2: {
    color: '#14532D'
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  langBadge: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  badgeUser1: {
    color: '#3B82F6'
  },
  badgeUser2: {
    color: '#10B981'
  },
  bubbleAudioIcon: {
    fontSize: 12
  },
  bottomBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  micActiveFr: {
    backgroundColor: '#2563EB'
  },
  micActiveGab: {
    backgroundColor: Colors.primary
  },
  micButtonIcon: {
    fontSize: 18
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textMain,
    paddingHorizontal: 12
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  speakerSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  switchTab: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle
  },
  switchTabActive: {
    backgroundColor: Colors.primaryLight
  },
  switchTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMain
  }
});
