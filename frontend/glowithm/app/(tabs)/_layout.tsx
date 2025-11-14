import React from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";
import { Image, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <View className="flex-1 flex-col items-center w-16">
        <Image source={icon} tintColor="#00E576"  className="m-2" />
        <Text className="text-active text-sm font-poppins-semibold">{title}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 flex-col items-center w-16">
      <Image source={icon} tintColor="#434343" className="m-2" />
      <Text className="text-inactive text-sm font-poppins-semibold">{title}</Text>
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
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.history} title="History" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.settings} title="Settings" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
