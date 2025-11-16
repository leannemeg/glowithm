import React from "react";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const TabIcon = ({ focused, title }: any) => {
  const color = focused ? "#00E576" : "#434343";
  const renderIcon = () => {
    if (title === "History")
      return <FontAwesome5 name="history" size={32} color={color} />;

    if (title === "Settings")
      return <Ionicons name="settings-sharp" size={32} color={color} />;

    return <Entypo name="home" size={36} color={color} />;
  };

  return (
    <View className="flex-col items-center w-16">
      <View className="mt-4">{renderIcon()}</View>
      <Text
        className={`mt-1 text-sm font-poppins-semibold ${
          focused ? "text-active" : "text-inactive"
        }`}
      >
        {title}
      </Text>
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="History" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Settings" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
