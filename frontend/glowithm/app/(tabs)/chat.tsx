import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "@/constants/images";
import { chatWithAI } from "@/utils/api";
import Markdown from 'react-native-markdown-display';

export default function Chat() {
  const { initialQuestion } = useLocalSearchParams();

  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Pre-fill input if redirected from NoIngredient
  useEffect(() => {
    if (
      initialQuestion &&
      typeof initialQuestion === "string" &&
      initialQuestion.trim()
    ) {
      setInput(initialQuestion.trim());
    }
  }, [initialQuestion]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = text ?? input.trim();
      if (!msg) return; // skip if empty

      // Add user message
      setMessages((prev) => [...prev, { sender: "user", text: msg }]);
      setInput("");

      setLoading(true);

      try {
        const res = await chatWithAI(msg);
        const reply: string = res.reply ?? "No response received";

        // Add AI reply
        setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      } catch {
        // Only add a friendly error message
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Sorry, I couldn't process that. Please try again!",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input]
  );

  return (
    <ImageBackground
      source={images.reco_bg}
      resizeMode="cover"
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row w-full items-center justify-center px-5 py-3">
          <Text className="font-poppins-semibold text-lg text-primary">
            AI Assistant
          </Text>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "flex-end" }}
          className="px-6"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 15 : 15}
        >
          {/* Messages */}
          <ScrollView
            className="flex-1 my-4"
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {messages.map((m, i) => (
              <View
                key={i}
                className={`my-2 max-w-[80%] rounded-2xl px-4 py-0.5 ${
                  m.sender === "user"
                    ? "bg-indigo-600 self-end"
                    : "bg-white border border-gray-200 self-start"
                }`}
              >
                <Markdown
                  style={{
                    body: {
                      fontFamily: 'Poppins-Regular',
                      color: m.sender === "user" ? 'white' : '#1F2937',
                    },
                    strong: { fontFamily: 'Poppins-Bold' },
                    em: { fontFamily: 'Poppins-Italic' }
                  }}
                >
                  {m.text}
                </Markdown>
              </View>
            ))}
            {loading && (
              <View className="self-start bg-white border border-gray-200 rounded-2xl px-4 py-3 my-2">
                <ActivityIndicator size="small" />
              </View>
            )}
          </ScrollView>
          <View className="flex-row self-end items-center bg-white p-1.5 rounded-full shadow-sm border border-gray-200">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about an ingredient..."
              className="flex-1 font-poppins-regular text-gray-800 px-4"
              placeholderTextColor="#b0b0b0"
            />
            <TouchableOpacity
              onPress={() => sendMessage()}
              className="bg-indigo-700 p-3 rounded-full"
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
