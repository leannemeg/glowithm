import React from "react";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const TabIcon = ({ focused, title }: any) => {
  const color = focused ? "#00E576" : "#434343";
  const renderIcon = () => {
    if (title === "History") return <MaterialIcons name="history" size={40} color={color} className="mt-[-1]"/>;

    if (title === "Settings") return <MaterialIcons name="settings" size={38} color={color} />;

    if (title === "Chat") return <MaterialCommunityIcons name="star-four-points-circle-outline" size={38} color={color} className=""/>

    return <MaterialCommunityIcons name="home-variant-outline" size={38} color={color} />;
  };

  return (
    <View className="flex-col items-center w-16">
      <View className="mt-4">{renderIcon()}</View>
      <Text
        className={`mt-1 text-sm font-poppins-semibold ${
          focused ? "text-active" : "text-inactive"
        }`}
      >
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
        name="chat"
        options={{
          headerShown: false,
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title="Chat" />
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
