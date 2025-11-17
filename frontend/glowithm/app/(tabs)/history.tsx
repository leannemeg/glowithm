import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import ClearModal from "../components/modals/ClearModal";
import { images } from "@/constants/images";

const History = () => {
  const [clearModalVisible, setClearModalVisible] = useState(false);

  const handleDelete = () => {
    setClearModalVisible(false);
  };

  const handleKeep = () => {
    setClearModalVisible(false);
  };

  return (
    <ImageBackground source={images.bg2} className="flex-1" resizeMode="cover">
      <SafeAreaView className="flex-1">
        <View
          className="flex-row w-full items-center justify-between"
          style={{ paddingHorizontal: 20, paddingTop: 10 }}
        >
          <Text className="font-poppins-semibold text-lg flex-1 text-center text-primary">
            Analysis History
          </Text>
          <TouchableOpacity onPress={() => setClearModalVisible(true)}>
            <Image
              source={icons.clear}
              style={{ width: 20, height: 21, marginBottom: 5 }}
            />
          </TouchableOpacity>
          <View className="w-6 h-6" />
        </View>
        <ClearModal
          clearModalVisible={clearModalVisible}
          onDelete={handleDelete}
          onClose={handleKeep}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default History;
