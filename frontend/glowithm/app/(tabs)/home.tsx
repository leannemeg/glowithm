import { useImageAnalysis } from "@/app/hooks/useImageAnalysis";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  hasPermissionGranted,
  setPermissionGranted,
} from "@/utils/permissionStorage";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccessDeniedModal from "../components/modals/AccessDeniedModal";
import AnalysisLoader from "../components/modals/AnalysisLoader";
import ErrModal from "../components/modals/ErrModal";
import ImagePickerModal from "../components/modals/ImagePickerModal";
import InstructionsModal from "../components/modals/InstructionsModal";
import PermissionModal from "../components/modals/PermissionModal";
import Button from "../components/Button";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [deniedModalVisible, setDeniedModalVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  const {
    analyzing,
    progress,
    errorModalVisible,
    errorMessage,
    setErrorModalVisible,
    handlePickImage,
    handleCancelAnalysis,
  } = useImageAnalysis({
    onStart: () => setImagePickerVisible(false),
  });

  const handleProceed = async () => {
    const grantedBefore = await hasPermissionGranted();
    if (grantedBefore) {
      setImagePickerVisible(true);
    } else {
      setPermissionModalVisible(true);
    }
  };

  const handleAllow = async () => {
    setPermissionModalVisible(false);
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.granted && mediaPermission.granted) {
      await setPermissionGranted();
      setImagePickerVisible(true);
    } else {
      setDeniedModalVisible(true);
    }
  };

  const handleDeny = () => {
    setPermissionModalVisible(false);
    setDeniedModalVisible(true);
  };

  return (
    <ImageBackground source={images.bg1} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-end items-center px-6 mb-12">
          <Image source={images.logoName} className="w-80 h-20" />
          <Text className="text-md text-inactive font-poppins-medium mb-4 text-center px-8">
            Discover your skin type and get personalized ingredient
            recommendations with our AI-powered analysis.
          </Text>
          <Button title="Analyze Your Skin" 
            onPress={handleProceed}
            icon="default"
            size="default"
          />
        </View>

        <TouchableOpacity onPress={() => setVisible(true)}>
          <Image
            source={icons.question_line}
            style={{ marginLeft: 10, marginBottom: -10 }}
          />
        </TouchableOpacity>

        <InstructionsModal
          isVisible={visible}
          onClose={() => setVisible(false)}
        />
        <PermissionModal
          permissionModalVisible={permissionModalVisible}
          onClose={() => setPermissionModalVisible(false)}
          onAllow={handleAllow}
          onDeny={handleDeny}
        />
        <AccessDeniedModal
          deniedModalVisible={deniedModalVisible}
          onClose={() => setDeniedModalVisible(false)}
        />
        <ImagePickerModal
          imagePickerVisible={imagePickerVisible}
          handlePickImage={handlePickImage}
          onClose={() => setImagePickerVisible(false)}
        />
        <AnalysisLoader
          visible={analyzing}
          progress={progress}
          onCancel={handleCancelAnalysis}
        />

        <ErrModal
          visible={errorModalVisible}
          onClose={() => setErrorModalVisible(false)}
          error={errorMessage}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;
