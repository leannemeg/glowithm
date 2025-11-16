import { Text, View, TouchableOpacity, Image, ScrollView, ImageBackground } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import HistoryContainer from "../components/HistoryContainer";
import useHistory from "@/hooks/useHistory";
import ClearModal from "../components/modals/ClearModal";
import { images } from "@/constants/images";

const History = () => {
  const { history, clearHistory } = useHistory();
  const [clearModalVisible, setClearModalVisible] = useState(false);

  const handleDelete = () => {
    clearHistory();
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
          <TouchableOpacity
            onPress={() => history.length > 0 && setClearModalVisible(true)}
            disabled={history.length === 0}
            accessibilityState={{ disabled: history.length === 0 }}
            activeOpacity={0.7}
            style={{ opacity: history.length === 0 ? 0.4 : 1 }}
          >
            <Image source={icons.clear} style={{ width: 20, height: 21, marginBottom: 5 }} />
          </TouchableOpacity>
          <View className="w-6 h-6" />
        </View>
        <View className="mt-4 px-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            {history.length === 0 ? (
              <Text className="text-center text-inactive">No history yet</Text>
            ) : (
              history.map((entry) => (
                <HistoryContainer key={entry.id} entry={entry} />
              ))
            )}
          </ScrollView>
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
