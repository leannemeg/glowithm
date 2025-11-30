import { Text, View, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="w-full items-center justify-center px-5 py-3">
          <Text className="font-poppins-semibold text-lg text-primary text-center">
            Settings
          </Text>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 mt-4 mx-auto w-[90%] p-4">
          {/* About Glowithm */}
          <Text className="font-poppins-semibold text-base text-accent-green py-2">
            About Glowithm
          </Text>
          <View className="bg-gray-300 h-[0.5] my-2" />
          <Text className="font-poppins-regular text-sm text-gray-600 py-1">
            Glowithm is an AI-powered skin analysis app designed to help you
            understand your skin type and make informed decisions about your
            skincare routine. Our mission is to provide accurate insights while
            prioritizing your privacy and security.
          </Text>
          {/* Privacy Policy */}
          <Text className="font-poppins-semibold text-base text-accent-green py-2 pt-4">
            Privacy Policy
          </Text>
          <View className="bg-gray-300 h-[0.5] my-2" />
          <Text className="font-poppins-regular text-sm text-gray-600 py-1">
            Your privacy is our priority. Glowithm collects only the information
            necessary to provide skin analysis and recommendations. Facial
            images are analyzed securely on our servers; none are stored
            permanently. We do not sell or share your personal data with third
            parties. Aggregate or anonymized data may be used to improve our
            services.
          </Text>

          {/* Terms and Conditions */}
          <Text className="font-poppins-semibold text-base text-accent-green py-2 pt-4">
            Terms and Conditions
          </Text>
          <View className="bg-gray-300 h-[0.5] my-2" />
          <Text className="font-poppins-regular text-sm text-gray-600 py-1">
            By using Glowithm, you agree to our terms. The app is for
            informational purposes only and is not a substitute for professional
            medical advice. Misuse of the app or attempts to reverse-engineer it
            are prohibited. Glowithm reserves the right to suspend accounts
            violating these terms. All content, AI models, and branding belong
            to Glowithm.
          </Text>

          {/* Contact Info */}
          <Text className="font-poppins-semibold text-base text-accent-green py-2 pt-4">
            Contact
          </Text>
          <View className="bg-gray-300 h-[0.5] my-2" />
          <Text className="font-poppins-regular text-sm text-gray-600 py-1">
            Email: support@glowithm.com{"\n"}
            Website: www.glowithm.com
          </Text>
        </ScrollView>
      </SafeAreaView>
  );
}
