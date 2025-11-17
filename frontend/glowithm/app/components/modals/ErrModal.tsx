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
          className="bg-white py-5 w-[70%] gap-4 items-center"
          style={{
            borderRadius: 12,
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
          <Text className="text-inactive font-poppins-regular text-sm text-center px-8">
            {error}
          </Text>

          <Pressable
            onPress={onClose}
            style={{
              borderTopColor: "#E5E7EB",
              borderTopWidth: 1,
              paddingTop: 10,
              width: "100%",
            }}
          >
            <Text className="text-accent-red text-center text-sm font-poppins-medium">
              Try Again
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
