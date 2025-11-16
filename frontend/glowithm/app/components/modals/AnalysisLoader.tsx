import React from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";

interface AnalysisLoaderProps {
  visible: boolean;
  progress: number;
  onCancel: () => void;
}

const AnalysisLoader = ({
  visible,
  progress,
  onCancel,
}: AnalysisLoaderProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        {/* Content container */}
        <View className="items-center w-72">
          {/* Progress bar */}
          <View className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
            <View
              className="bg-green-400 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>

          <Text className="text-white text-xs mt-2">
            {Math.round(progress)}%
          </Text>

          <TouchableOpacity onPress={onCancel} className="mt-5">
            <Image source={icons.cancel} className="w-8 h-8 tint-white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AnalysisLoader;
