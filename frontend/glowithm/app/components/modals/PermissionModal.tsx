import { Text, Modal, Pressable, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface PermissionModalProps {
  permissionModalVisible: boolean;
  onAllow: () => void;
  onDeny: () => void;
  onClose: () => void;
}

export default function PermissionModal({
  permissionModalVisible,
  onAllow,
  onDeny,
  onClose,
}: PermissionModalProps) {
  return (
    <Modal
      visible={permissionModalVisible}
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
          <Image source={icons.question_fill} style={{ alignSelf: "center" }} />

          {/* Main Text */}
          <Text
            className="text-inactive font-poppins-medium text-md text-center"
            style={{ width: 240 }}
          >
            Allow{" "}
            <Text className="font-poppins-bold text-primary text-md">
              Glowithm
            </Text>{" "}
            to take pictures and access photos?
          </Text>

          {/* OPTIONS */}
          <Pressable
            onPress={onAllow}
            style={{
              borderTopColor: "#E5E7EB",
              borderTopWidth: 1,
              paddingTop: 10,
              width: "100%",
            }}
          >
            <Text className="text-primary text-center text-sm font-poppins-medium">
              Always
            </Text>
          </Pressable>

          <Pressable
            style={{
              borderTopColor: "#E5E7EB",
              borderTopWidth: 1,
              paddingTop: 10,
              width: "100%",
            }}
            onPress={onDeny}
          >
            <Text className="text-inactive text-center text-sm font-poppins-medium">
              Deny
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
