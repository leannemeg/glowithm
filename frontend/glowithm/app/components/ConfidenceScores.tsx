import { View, Text } from "react-native";
import React from "react";
import ConfidenceBar from "./ConfidenceBar";

interface PredictionData {
  label: string;
  confidence: number;
  confidence_display: string;
}

interface ConfidenceScoresProps {
  predictions: PredictionData[];
  title?: string;
  containerStyle?: string;
}

export default function ConfidenceScores({
  predictions,
  title = "Confidence Scores",
  containerStyle = "bg-white rounded-2xl p-6 mb-8 w-full max-w-sm",
}: ConfidenceScoresProps) {
  return (
    <View className={containerStyle}>
      <Text className="font-poppins-semibold text-xl text-gray-800 mb-6">
        {title}
      </Text>
      {predictions.map((pred, index) => (
        <View key={index} className="mb-3">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-poppins-medium text-base text-gray-700 capitalize">
              {pred.label}
            </Text>
            <Text className="font-poppins-regular text-sm text-gray-600">
              {pred.confidence_display}
            </Text>
          </View>
          <ConfidenceBar confidence={pred.confidence} />
        </View>
      ))}
    </View>
  );
}
