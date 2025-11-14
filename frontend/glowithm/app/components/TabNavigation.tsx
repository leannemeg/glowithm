import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface Tab {
  key: string;
  title: string;
  color?: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  containerStyle?: string;
  tabContainerStyle?: string;
  activeTextStyle?: string;
  inactiveTextStyle?: string;
  underlineHeight?: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  containerStyle = "flex-row",
  tabContainerStyle = "flex-1 p-1",
  activeTextStyle = "font-poppins-semibold text-center",
  inactiveTextStyle = "font-poppins-semibold text-center",
  underlineHeight = 3,
}) => {
  const getActiveTextColor = (tab: Tab) => {
    if (tab.color) return tab.color;
    return "#16a34a";
  };

  const getActiveUnderlineColor = (tab: Tab) => {
    if (tab.color) return tab.color;
    return "#22c55e";
  };

  return (
    <View className={containerStyle}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            className={tabContainerStyle}
          >
            <Text
              className={isActive ? activeTextStyle : inactiveTextStyle}
              style={{
                color: isActive ? getActiveTextColor(tab) : "#666666",
              }}
            >
              {tab.title}
            </Text>
            {/* Underline indicator */}
            <View
              className="mt-1 rounded-full"
              style={{
                height: underlineHeight,
                backgroundColor: isActive
                  ? getActiveUnderlineColor(tab)
                  : "#D9D9D9",
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabNavigation;
