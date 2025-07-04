import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const GEMINI_API_KEY = "AIzaSyBRW_GiNyN8n14uvfYfFjZrieRGQ3TiO5o";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const ChatboxScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    const prompt = inputText;
    setInputText("");

    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      const data = await response.json();
      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      setMessages((prev) => [...prev, { sender: "bot", text: aiReply }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error calling Gemini API." },
      ]);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🤖</Text>
        <Text style={styles.headerText}>AI ChatBox</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.chatContainer}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={90}
          style={styles.inputArea}
        >
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#777"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#1e1e1e",
  },
  headerIcon: {
    fontSize: 22,
    color: "#00e5ff",
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00e5ff",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  chatContainer: {
    padding: 10,
  },
  messageContainer: {
    padding: 12,
    marginVertical: 6,
    maxWidth: "80%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#1f1f1f",
    borderTopRightRadius: 0,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#262626",
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: "#00e5ff",
    fontSize: 16,
    lineHeight: 22,
  },
  inputArea: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#222",
    backgroundColor: "#121212",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "#00e5ff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#00e5ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  sendButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ChatboxScreen;
