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
        className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 justify-center items-center"
      >
        {/* MODAL CONTENT */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white py-6 gap-4 w-[70%] items-center"
          style={{
            borderRadius: 12,
          }}
        >
          <Text className="font-poppins-semibold text-lg text-primary">
            Permission Denied
          </Text>
          <Text className="text-inactive font-poppins-regular text-sm text-center px-6">
            You can’t proceed with analysis unless you grant the app camera
            and/or gallery access.
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
            <Text className="text-accent-green text-center text-sm font-poppins-medium">
              I understand
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
