import { Text, Modal, Pressable, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface ClearModalProps {
  clearModalVisible: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export default function ClearModal({
  clearModalVisible,
  onDelete,
  onClose,
}: ClearModalProps) {
  return (
    <Modal
      visible={clearModalVisible}
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
            paddingVertical: 16,
            gap: 16,
            width: 300,
            alignItems: "center",
          }}
        >
          <Image source={icons.clear} style={{ alignSelf: "center" }} />

          {/* Main Text */}
          <Text
            className="text-inactive font-poppins-medium text-md text-center"
            style={{ width: 240 }}
          >
            Are you sure you want to empty your history? This cannot be undone.
          </Text>

          {/* OPTIONS */}
          <Pressable
            onPress={onDelete}
            style={{
              borderTopColor: "#E5E7EB",
              borderTopWidth: 1,
              paddingTop: 10,
              width: "100%",
            }}
          >
            <Text className="text-accent-red text-center text-sm font-poppins-medium">
              Delete History
            </Text>
          </Pressable>

          <Pressable
            style={{
              borderTopColor: "#E5E7EB",
              borderTopWidth: 1,
              paddingTop: 10,
              width: "100%",
            }}
            onPress={onClose}
          >
            <Text className="text-inactive text-center text-sm font-poppins-medium">
              Keep History
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
