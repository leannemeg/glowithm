import React from "react";
import { ImageBackground, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

export const LoadingScreen = () => (
  <ImageBackground source={images.bg2} className="flex-1" resizeMode="cover">
    <SafeAreaView className="flex-1 justify-center items-center">
      <Image source={images.logo} style={{ width: 90, height: 90 }}/>
    </SafeAreaView>
  </ImageBackground>
);

export default LoadingScreen;