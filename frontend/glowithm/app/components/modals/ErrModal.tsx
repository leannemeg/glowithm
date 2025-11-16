import { Text, Pressable, Modal, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface ErrModalProps {
  visible: boolean;
  onClose: () => void;
  error: any;
}

export default function ErrModal({ visible, onClose, error }: ErrModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* BACKDROP */}
      <Pressable
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
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            paddingVertical: 24,
            paddingHorizontal: 20,
            width: 320,
            gap: 16,
            alignItems: "center",
          }}
        >
          <Image
            source={icons.question_fill}
            className="self-center w-8 h-8"
            style={{ tintColor: "#E50004" }}
          />
          <Text className="font-poppins-semibold text-lg text-primary">
            Something went wrong.
          </Text>
          <Text className="text-inactive font-poppins-regular text-sm text-center">
            {error}
          </Text>

          <Pressable
            onPress={onClose}
            style={{
              backgroundColor: "#22C55E",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginTop: 8,
              width: "60%",
            }}
          >
            <Text className="text-white font-poppins-medium text-center text-sm">
              Try again
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
