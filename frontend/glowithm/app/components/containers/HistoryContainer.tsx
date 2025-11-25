import { View, Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import type { HistoryEntry } from "@/hooks/useHistory";

type Props = {
  entry: HistoryEntry;
  onPress?: () => void;
  onRemove?: (id: string) => void;
};
const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const HistoryContainer: React.FC<Props> = ({ entry, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="mt-2">
      <View className="flex-row w-full h-22 rounded-xl bg-white justify-between items-center p-4">
        <View className="flex-row justify-start items-center">
          {/* Handle both str and imqge entry.icon */}
          <Image
            source={
              typeof entry.icon === "string"
                ? (icons as any)[entry.icon]
                : entry.icon ?? icons.unknown
            } style={{ width: 54, height: 54 }}
          />
          <View className="flex-column ml-3">
            <Text className="font-poppins-medium text-inactive text-md">
              {capitalize(entry.type)}
            </Text>
            <Text className="font-poppins-medium text-primary text-2xl mt-2">
              {entry.primaryScore}
            </Text>
          </View>
        </View>
        <View className="flex-column items-end">
          <Text className="font-poppins-medium text-primary text-sm pb-2">
            {entry.dateLabel}
          </Text>
          {entry.breakdown?.map((b, i) => (
            <Text
              key={i}
              className="font-poppins-medium text-inactive text-xs pb-1"
            >
              {b.value} {capitalize(b.label)}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HistoryContainer;
