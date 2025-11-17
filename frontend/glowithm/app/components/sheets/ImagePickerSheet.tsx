import { Text, Modal, Pressable, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface ImagePickerSheetProps {
  imagePickerVisible: boolean;
  handlePickImage: (source: "camera" | "gallery") => void;
  onClose: () => void;
}

const ImagePickerSheet = ({
  imagePickerVisible,
  handlePickImage,
  onClose,
}: ImagePickerSheetProps) => {
  return (
    <Modal
      visible={imagePickerVisible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          justifyContent: "flex-end",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "white",
            width: "100%",
            padding: 5,
            minHeight: 80,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <Pressable
            onPress={() => handlePickImage("camera")}
            className="py-4 w-full flex-row items-center"
          >
            <Image source={icons.camera} style={{ marginHorizontal: 8, width: 25, height: 22}} />
            <Text className="text-inactive font-poppins-medium text-base">
              Use Camera
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handlePickImage("gallery")}
            className="py-4 w-full flex-row items-center"
          >
            <Image source={icons.gallery} style={{ marginHorizontal: 8, width: 25, height: 26 }} />
            <Text className="text-inactive font-poppins-medium text-base">
              Upload from Gallery
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ImagePickerSheet;
