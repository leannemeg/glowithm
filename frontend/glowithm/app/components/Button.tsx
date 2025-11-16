import { icons } from "@/constants/icons";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: "default" | "primary" | "secondary";
  size?: "default" | "small" | "medium";
  containerStyle?: string;
  textStyle?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  icon = "default",
  size = "default",
  containerStyle,
  textStyle,
}) => {
  const getIconElement = () => {
    const iconStyle = {
      position: "absolute",
      right: 4,
    } as const;
    switch (icon) {
      case "primary":
        return <Image source={icons.analyze_again} style={{ ...iconStyle, width: 42, height: 42 }} />;
      case "secondary":
        return <Image source={icons.save} style={{ ...iconStyle, width: 42, height: 42 }} />;
      default:
        return <Image source={icons.analyze} style={{ ...iconStyle, width: 48, height: 48 }} />;
    }
  };

  const getStrokeColor = () => {
    switch (icon) {
      case "primary":
        return "#E5C600"; // analyze again
      case "secondary":
        return "#99E500"; // save
      default:
        return undefined;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return "px-8 py-2";
      case "medium":
        return "px-16 py-3";
      default:
        return "px-8 py-4";
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "medium":
        return "text-md";
      default:
        return "text-lg";
    }
  };

  const baseStyles = `rounded-full bg-white ${getSizeStyles()}`;

  // Merge user-supplied classes with the defaults so callers can augment instead of replace
  const finalContainerStyle = `${baseStyles} ${containerStyle ?? ""}`.trim();

  const finalTextStyle = `font-poppins-semibold ${getTextSizeStyles()} ${
    textStyle ?? ""
  }`.trim();

  const strokeColor = getStrokeColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center ${finalContainerStyle}`}
      style={[
        { position: "relative", paddingRight: 70 },
        strokeColor ? { borderWidth: 1, borderColor: strokeColor } : undefined,
      ]}
    >
      <Text className={finalTextStyle}>{title}</Text>
      {getIconElement()}
    </TouchableOpacity>
  );
};

export default Button;
