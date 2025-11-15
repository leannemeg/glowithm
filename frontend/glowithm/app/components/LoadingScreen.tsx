import React from "react";
import { ImageBackground, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

export const LoadingScreen = () => (
  <ImageBackground source={images.reco_bg} className="flex-1" resizeMode="cover">
    <SafeAreaView className="flex-1 justify-center items-center">
      <Image source={images.logo} style={{ width: 90, height: 90 }}/>
      <ActivityIndicator size="large" color="#FFFFFF" className="mt-4" />
    </SafeAreaView>
  </ImageBackground>
);

export default LoadingScreen;