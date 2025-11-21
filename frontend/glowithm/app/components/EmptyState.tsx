import React from "react";
import { ImageBackground, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";
import { router } from "expo-router";
import Button from "./ui/Button";

export const EmptyState = ({
  buttonText = "Go Home",
  buttonAction,
}: {
  title?: string;
  buttonText?: string;
  buttonAction?: () => void;
}) => (
  <ImageBackground source={images.bg2} className="flex-1" resizeMode="cover">
    <SafeAreaView className="flex-1 justify-center items-center">
      <Image source={images.logo} style={{ width: 90, height: 90 }} />
      <Text className="font-poppins-regular text-lg text-white">
        No results found.
      </Text>
      <Button
        title={buttonText}
        onPress={buttonAction || (() => router.replace("/(tabs)/home"))}
        size="small"
        icon="default"
      />
    </SafeAreaView>
  </ImageBackground>
);

export default EmptyState;
