import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import { Colors, Spacing, Radius } from '../theme/colors';

const SUGGESTIONS = [
  "Comment saluer les anciens en Fang ?",
  "Que signifie le masque Okuyi Punu ?",
  "Raconte un proverbe gabonais sur la forêt",
  "Comment dit-on 'merci' en Myènè et en Nzébi ?"
];

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'ai',
    text: "Mbolo ! Je suis votre guide culturel et linguistique Tradition IA. Posez-moi vos questions sur les langues gabonaises (Fang, Punu, Nzébi, Myènè...), les proverbes sacrés et les coutumes des ancêtres !",
    timestamp: "À l'instant"
  }
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      let reply = "";
      const q = text.toLowerCase();

      if (q.includes("okuyi") || q.includes("punu") || q.includes("blanc")) {
        reply = "Dans la tradition Punu, le masque blanc **Okuyi** (ou Mukudji) représente l'esprit d'une jeune femme défunte revenant bénir les vivants. Sa blancheur obtenue au kaolin symbolise le royaume des ancêtres, la pureté et la clairvoyance.";
      } else if (q.includes("proverbe") || q.includes("sagesse") || q.includes("foret")) {
        reply = "Voici une parole de sagesse gabonaise : *« L'arbre seul ne fait pas la forêt, c'est l'union des branches qui résiste à la tempête. »* En langue Fang, on rappelle souvent que l'humilité et la communauté surpassent l'orgueil solitaire.";
      } else if (q.includes("merci")) {
        reply = "Pour dire merci au Gabon :\n• En **Fang** : *Akiba*\n• En **Punu** : *Diboty*\n• En **Myènè** : *Marodi*\n• En **Nzébi** : *Ngonde*\nCes termes expriment tous une profonde gratitude du cœur.";
      } else {
        reply = `Dans la tradition gabonaise, votre question touchant à "${text}" porte une signification forte. Les aînés rappellent que chaque mot prononcé dans nos langues résonne comme un pont entre le visible et l'invisible.`;
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 450);
  };

  const handleSpeakAi = (text) => {
    try {
      Speech.speak(text.replace(/[*#]/g, ''), { language: 'fr-FR', rate: 0.9 });
    } catch (e) {
      Alert.alert('Audio', text);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={{ fontSize: 20 }}>🤖</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Mbolo IA — Guide Culturel 🇬🇦</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>En ligne • Traditions Gabonaises</Text>
          </View>
        </View>
      </View>

      {/* Liste des Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
                  {item.text}
                </Text>
              </View>

              <View style={styles.bubbleFooter}>
                <Text style={styles.timestampText}>{item.timestamp}</Text>
                {!isUser && (
                  <TouchableOpacity onPress={() => handleSpeakAi(item.text)} style={{ marginLeft: 6 }}>
                    <Text style={{ fontSize: 13 }}>🔊</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Suggestions rapides */}
      <View style={styles.suggestionsBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={SUGGESTIONS}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionChip}
              onPress={() => handleSend(item)}
            >
              <Text style={styles.suggestionText}>💬 {item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Barre de saisie */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Posez votre question sur les langues ou rites..."
          placeholderTextColor={Colors.textDim}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSend()}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#0B0E14', fontWeight: '800', fontSize: 16 }}>➔</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: 'rgba(22, 28, 38, 0.7)'
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.bgCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: Colors.gold
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textMain
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.green,
    marginRight: 5
  },
  statusText: {
    fontSize: 11,
    color: Colors.textMuted
  },
  messagesList: {
    padding: Spacing.lg,
    paddingBottom: 20
  },
  bubbleWrapper: {
    marginBottom: 14,
    maxWidth: '85%'
  },
  userWrapper: {
    alignSelf: 'flex-end'
  },
  aiWrapper: {
    alignSelf: 'flex-start'
  },
  bubble: {
    padding: 14,
    borderRadius: Radius.lg
  },
  userBubble: {
    backgroundColor: Colors.blue,
    borderBottomRightRadius: 4
  },
  aiBubble: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20
  },
  userText: {
    color: '#0B0E14',
    fontWeight: '600'
  },
  aiText: {
    color: Colors.textMain
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4
  },
  timestampText: {
    fontSize: 10,
    color: Colors.textDim
  },
  suggestionsBar: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: Colors.bgDark
  },
  suggestionChip: {
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  suggestionText: {
    fontSize: 11,
    color: Colors.textMuted
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border
  },
  input: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.textMain,
    fontSize: 13,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 10
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
