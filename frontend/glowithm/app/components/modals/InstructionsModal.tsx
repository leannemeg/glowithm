import { Text, Modal, Pressable, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface InstructionsModalProps {
  instructionsModalVisible: boolean;
  onClose: () => void;
}

export default function InstructionsModal({
  instructionsModalVisible,
  onClose,
}: InstructionsModalProps) {
  return (
    <Modal
      visible={instructionsModalVisible}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      {/* BACKDROP */}
      <Pressable
        className="flex-1 bg-black/50 justify-center"
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* MODAL CONTENT */}
        <Pressable
          className="bg-white self-center"
          style={{ borderRadius: 12, padding: 16, gap: 16, width: 320 }}
          onPress={(e) => e.stopPropagation()}
        >
          <Image source={icons.question_fill} className="self-center w-8 h-8" />
          <Text className="text-inactive font-poppins-regular text-sm">
            Take a <Text className="font-poppins-bold">clear</Text> photo of
            your face - good lighting, no obstructions, and a focused camera
            helps the model to analyze better.
          </Text>
          <Text className="text-inactive font-poppins-regular text-sm">
            For more accurate results, remove{" "}
            <Text className="font-poppins-bold">makeup</Text>,{" "}
            <Text className="font-poppins-bold">camera filters</Text>, and{" "}
            <Text className="font-poppins-bold">
              avoid analyzing after a skincare routine, a shower, or a workout
            </Text>
            .
          </Text>
          <Text className="text-inactive font-poppins-regular text-sm">
            Wait a few seconds while the model analyzes your skin type.
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
