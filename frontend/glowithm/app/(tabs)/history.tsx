import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import ClearModal from "../components/modals/ClearModal";
import useHistory, { HistoryEntry } from "@/hooks/useHistory";
import HistoryContainer from "../components/containers/HistoryContainer";
import DeleteEntryModal from "../components/modals/DeleteEntryModal";

export default function History() {
  const { history, clearHistory, removeEntry } = useHistory();
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  const handleDeleteEntry = () => {
    if (selectedEntry) removeEntry(selectedEntry.id);
    setDeleteModalVisible(false);
    setSelectedEntry(null);
  };

  const handleCancelDeleteEntry = () => {
    setDeleteModalVisible(false);
    setSelectedEntry(null);
  };

  const handleDelete = () => {
    clearHistory();
    setClearModalVisible(false);
  };

  const handleKeep = () => {
    setClearModalVisible(false);
  };

  return (
      <SafeAreaView className="flex-1 bg-green-100">
        <View className="flex-row w-full items-center justify-between px-5 py-3">
          <Text className="font-poppins-semibold text-lg flex-1 text-center text-primary pl-4">
            Analysis History
          </Text>
          <TouchableOpacity
            onPress={() => history.length > 0 && setClearModalVisible(true)}
            disabled={history.length === 0}
            accessibilityState={{ disabled: history.length === 0 }}
            activeOpacity={0.7}
            style={{ opacity: history.length === 0 ? 0.4 : 1 }}
          >
            <Image
              source={icons.clear}
              style={{ width: 20, height: 21, marginBottom: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View className="mt-4 px-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            {history.length === 0 ? (
              <Text className="text-center text-inactive mt-8">No history yet</Text>
            ) : (
              history.map((entry) => (
                <TouchableOpacity
                  key={entry.id}
                  activeOpacity={0.8}
                  onLongPress={() => {
                    setSelectedEntry(entry);
                    setDeleteModalVisible(true);
                  }}
                >
                  <HistoryContainer key={entry.id} entry={entry} />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
        <DeleteEntryModal
          deleteModalVisible={deleteModalVisible}
          entry={selectedEntry}
          onDelete={handleDeleteEntry}
          onClose={handleCancelDeleteEntry}
        />
        <ClearModal
          clearModalVisible={clearModalVisible}
          onDelete={handleDelete}
          onClose={handleKeep}
        />
      </SafeAreaView>
  );
}
