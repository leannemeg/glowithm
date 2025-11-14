import React from "react";
import { View, Text } from "react-native";

interface ConfidenceBarProps {
  confidence: number; // Should be between 0 and 1
  height?: number;
  showPercentage?: boolean;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  height = 9,
  showPercentage = false,
}) => {
  const percentage = Math.round(confidence * 100);

  const getBarColor = (conf: number) => {
    if (conf >= 0.8) return "#00E576";
    if (conf >= 0.6) return "#99E500";
    return "#E5C600"; 
  };

  return (
    <View className="w-full">
      <View className="w-full bg-gray-200 rounded-full" style={{ height }}>
        <View
          className="rounded-full"
          style={{
            height,
            width: `${percentage}%`,
            backgroundColor: getBarColor(confidence),
          }}
        />
      </View>
      {showPercentage && (
        <Text className="font-poppins-regular text-xs text-gray-600 mt-1">
          {percentage}%
        </Text>
      )}
    </View>
  );
};

export default ConfidenceBar;
