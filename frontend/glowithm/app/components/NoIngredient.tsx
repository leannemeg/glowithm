import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const NoIngredient = ({ searchQuery }: { searchQuery: string }) => {
  return (
    <View className="w-full items-center px-6 py-40">
      {/* Icon */}
      <View className="p-6 rounded-full shadow-sm mb-4">
        <Ionicons name="search-outline" size={36} color="#6b7280" />
      </View>

      {/* Title */}
      <Text className="text-xl font-poppins-semibold text-gray-800 mt-2 text-center">
        No Matches Found
      </Text>

      {/* Description */}
      <Text className="font-poppins-regular text-center text-gray-500 mt-2 leading-relaxed text-base">
        We couldn&apos;t find{" "}
        <Text className="font-poppins-medium text-gray-700 text-base">
          &quot;{searchQuery}&quot;
        </Text>{" "}
        in our database.
        {"\n"}Want to ask for more info?
      </Text>

      {/* CTA Button */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(tabs)/chat",
            params: {
              initialQuestion: `Can you tell me about ${searchQuery}?`,
            },
          })
        }
        className="mt-6 bg-indigo-700 px-6 py-3 rounded-full shadow-md active:opacity-80"
      >
        <Text className="text-white font-poppins-semibold text-base">
          Ask the AI
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoIngredient;
