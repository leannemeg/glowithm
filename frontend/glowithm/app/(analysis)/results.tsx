import ConfidenceScores from "@/app/components/ConfidenceScores";
import { usePredictionResult } from "@/hooks/usePredictionResult";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/ui/Button";
import { EmptyState } from "../components/EmptyState";
import { LoadingScreen } from "../components/LoadingScreen";
import { ScrollView } from "react-native-gesture-handler";

export default function Results() {
  const { result, loading, handleRetry } = usePredictionResult();

  const getSkinTypeExplanation = (skinType: string) => {
    switch (skinType.toLowerCase()) {
      case "dry":
        return "Based on our analysis, your skin type is classified as dry. This means your skin tends to produce less sebum, leading to a feeling of tightness, flakiness, and potential sensitivity.";
      case "oily":
        return "Based on our analysis, your skin type is classified as oily. This means your skin produces excess sebum, leading to a shiny appearance and potential breakouts.";
      case "normal":
        return "Based on our analysis, your skin type is classified as normal. This means your skin has a good balance of oil and moisture.";
      case "combination":
        return "Based on our analysis, your skin type is classified as combination. This means your skin has both oily and dry areas. Use targeted treatments for different zones of your face.";
      default:
        return "Your skin type has been analyzed. Follow the recommendations for optimal skincare.";
    }
  };

  if (loading) return <LoadingScreen />;

  if (!result) return <EmptyState title="No Results Found" />;

  return (
    <ImageBackground source={images.bg2} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1">
        <View
          className="flex-row w-full items-center justify-between"
          style={{ paddingHorizontal: 20, paddingTop: 10 }}
        >
          <TouchableOpacity onPress={handleRetry}>
            <Image source={icons.back} style={{ width: 12, height: 20 }} />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-lg flex-1 text-center text-primary">
            Analysis Results
          </Text>
          <View className="w-6 h-6" />
        </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center px-8" style={{ marginTop: 30 }}>
          <Image source={images.logo} style={{ width: 90, height: 90 }} />

          <Text className="font-poppins-semibold text-2xl text-primary text-center mb-4 mt-4">
            Your skin is <Text className="text-active">{result.skin_type}</Text>
            .
          </Text>

          <Text className="font-poppins-medium text-sm text-inactive text-center mb-6 px-4">
            {getSkinTypeExplanation(result.skin_type)}
          </Text>

          {result.was_enhanced && result.enhanced_image && (
            <View className="items-center mb-6">
              <Image
                source={{
                  uri: `data:image/jpeg;base64,${result.enhanced_image}`,
                }}
                style={{ width: 200, height: 200, borderRadius: 12 }}
                resizeMode="cover"
              />
              <Text className="font-poppins-medium text-xs text-inactive text-center mt-2">
                We enhanced your image for better results!
              </Text>
            </View>
          )}

          <ConfidenceScores predictions={result.all_predictions} />

          <Button
            title="View Recommendations"
            onPress={() => router.push("/recommendations")}
            size="default"
          />
          <Text className="font-poppins-regular text-sm text-white text-center mb-6 mt-2 px-4">
            Not satisfied with the results? Go back and scan your face again or
            try a different photo.
          </Text>
        </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
