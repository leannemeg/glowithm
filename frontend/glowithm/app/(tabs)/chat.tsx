import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "@/constants/images";
import { chatWithAI } from "@/utils/api";

export default function Chat() {
  const scrollRef = useRef<ScrollView>(null);
  const { initialQuestion } = useLocalSearchParams();

  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

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

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = text ?? input.trim();
      if (!msg) return; // skip if empty

      // Add user message
      setMessages((prev) => [...prev, { sender: "user", text: msg }]);
      setInput("");
      scrollToBottom();

      setLoading(true);

      try {
        const res = await chatWithAI(msg);
        const reply: string = res.reply ?? "No response received";

        // Add AI reply
        setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
        scrollToBottom();
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
    [input, scrollToBottom]
  );

  return (
    <ImageBackground
      source={images.reco_bg}
      resizeMode="cover"
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-row w-full items-center justify-center px-5 py-2">
          <Text className="font-poppins-semibold text-lg text-primary">
            AI Assistant
          </Text>
        </View>

        {/* Chat area */}
        <ScrollView ref={scrollRef} className="flex-1 px-4">
          {messages.map((m, i) => (
            <View
              key={i}
              className={`my-2 max-w-[80%] rounded-2xl px-4 py-3 ${
                m.sender === "user"
                  ? "bg-indigo-600 self-end"
                  : "bg-white border border-gray-200 self-start"
              }`}
            >
              <Text
                className={`font-poppins-regular ${
                  m.sender === "user" ? "text-white" : "text-gray-800"
                }`}
              >
                {m.text}
              </Text>
            </View>
          ))}

          {loading && (
            <View className="self-start bg-white border border-gray-200 rounded-2xl px-4 py-3 my-2">
              <ActivityIndicator size="small" />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="px-4 pb-4 flex-row items-center"
        >
          <View className="flex-row bg-white p-3 rounded-full flex-1 shadow-sm border border-gray-200">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask something..."
              className="flex-1 font-poppins-regular text-gray-800 py-1"
              placeholderTextColor="#b0b0b0"
            />
          </View>

          <TouchableOpacity
            onPress={() => sendMessage()}
            className="ml-3 bg-indigo-700 p-3 rounded-full active:opacity-80"
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
