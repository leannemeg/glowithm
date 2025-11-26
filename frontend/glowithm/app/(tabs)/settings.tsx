import { ImageBackground, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

export default function Settings() {
  return (
    <ImageBackground source={images.bg2} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1">
        <View className="w-full items-center justify-between px-5 py-2"
        >
          <Text className="font-poppins-semibold text-lg flex-1 text-center text-primary">
            Settings
          </Text>
        </View>
        <View className="flex-col bg-white mt-4 py-2 h-[95%] self-center w-[90%] rounded-xl shadow-black/20 shadow-md">
          <Text className="font-poppins-semibold text-base text-primary py-2 px-4">
            Privacy and Information
          </Text>
          <View className="bg-black h-[0.5] my-2"></View>
          <Text className="font-poppins-regular text-sm text-gray-600 py-2 px-4">
            Your privacy is our priority. We do not store or share your images or personal data. All image analyses are performed securely on our servers, none are stored in our database.
          and we adhere to strict data protection regulations to ensure your information remains confidential.
          </Text>
          <Text className="text-accent-green text-lg px-4 pt-2 font-poppins-semibold">About Glowithm</Text>
          <Text className="font-poppins-regular text-sm text-gray-600 py-2 px-4">
            Glowithm is dedicated to providing accurate skin analysis using AI technology. Our mission is to help you understand your skin better and make informed decisions about your skincare routine.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
