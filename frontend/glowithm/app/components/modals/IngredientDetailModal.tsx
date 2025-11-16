import { IngredientRead } from "@/interfaces/interfaces";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface Props {
  ingredient: IngredientRead | null;
  visible: boolean;
  onClose: () => void;
}

export default function IngredientDetailModal({
  ingredient,
  visible,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {ingredient && (
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              width: 370,
              maxHeight: "80%",
            }}
          >
            <ScrollView>
              <Text
                className="font-poppins-semibold text-xl"
                style={{ color: "#16a34a" }}
              >
                {ingredient.name}
              </Text>

              {ingredient.also_called && (
                <Text className="text-inactive font-poppins-regular text-sm mt-2">
                  Also called: {ingredient.also_called}
                </Text>
              )}

              {ingredient.quickfacts?.length > 0 && (
                <View className="mb-3">
                  <Text
                    className="font-poppins-semibold text-lg"
                    style={{ color: "#16a34a" }}
                  >
                    Quick Facts
                  </Text>
                  {ingredient.quickfacts.map((q, i) => (
                    <Text key={i} className=" font-poppins-regular text-sm text-gray-700">
                      • {q}
                    </Text>
                  ))}
                </View>
              )}

              {ingredient.details && (
                <View className="mb-3">
                  <Text
                    className="font-poppins-semibold text-lg"
                    style={{ color: "#16a34a" }}
                  >
                    Details
                  </Text>
                  <Text className="font-poppins-regular text-sm text-gray-700 mb-3">
                    {ingredient.details}
                  </Text>
                </View>
              )}

              {ingredient.proof?.length > 0 && (
                <View className="mt-3">
                  <Text
                    className="font-poppins-semibold text-lg"
                    style={{ color: "#16a34a" }}
                  >
                    Sources
                  </Text>
                  {ingredient.proof.map((p, i) => (
                    <Text key={i} className="font-poppins-medium text-sm text-gray-700">
                      • {p}
                    </Text>
                  ))}
                </View>
              )}
            </ScrollView>
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
}
