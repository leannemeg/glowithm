import { View, TextInput, Image, TouchableOpacity, Text } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  showClear?: boolean;
  containerStyle?: string;
  inputStyle?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  showClear = true,
  containerStyle = "bg-white rounded-full px-4 py-1 flex-row items-center",
  inputStyle = "flex-1 font-poppins-regular text-base",
}) => {
  return (
    <View className={containerStyle}>
      <Image
        source={icons.search}
        className="w-5 h-5"
        style={{ marginRight: 8 }}
      />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className={inputStyle}
        placeholderTextColor="#9CA3AF"
      />
      {showClear && value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Text className="font-poppins-regular text-gray-400 ml-2">Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
