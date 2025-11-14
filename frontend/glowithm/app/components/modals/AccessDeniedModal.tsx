import { Text, Pressable, Modal } from "react-native";
import React from "react";

interface AccessDeniedModalProps {
  deniedModalVisible: boolean;
  onClose: () => void;
}

export default function AccessDeniedModal({
  deniedModalVisible,
  onClose,
}: AccessDeniedModalProps) {
  return (
    <Modal
      visible={deniedModalVisible}
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
          <Text className="font-poppins-semibold text-lg text-primary">
            Permission Denied
          </Text>
          <Text className="text-inactive font-poppins-regular text-sm text-center">
            You can’t proceed with analysis unless you grant the app camera and/or gallery access.
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
              I understand
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
