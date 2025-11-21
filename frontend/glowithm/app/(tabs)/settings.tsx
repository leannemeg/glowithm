import { ImageBackground, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

export default function Settings() {
  return (
    <ImageBackground source={images.bg2} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1">
        <View className="flex-row w-full items-center justify-between px-5 py-2"
        >
          <Text className="font-poppins-semibold text-lg flex-1 text-center text-primary">
            Settings
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
