import { ImageBackground, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

const Settings = () => {
  return (
    <ImageBackground source={images.bg2} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1">
        <View
          className="flex-row w-full items-center justify-between"
          style={{ paddingHorizontal: 20, paddingTop: 10 }}
        >
          <Text className="font-poppins-semibold text-lg flex-1 text-center text-primary">
            Settings
          </Text>
          <View className="w-6 h-6" />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Settings;
