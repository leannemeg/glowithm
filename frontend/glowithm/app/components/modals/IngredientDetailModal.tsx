import { IngredientRead } from "@/interfaces/interfaces";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface IngredientDetailModalProps {
  ingredient: IngredientRead | null;
  visible: boolean;
  onClose: () => void;
}

export default function IngredientDetailModal({
  ingredient,
  visible,
  onClose,
}: IngredientDetailModalProps) {
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
        className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 justify-center items-center"
      >
        {ingredient && (
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-xl px-6 pt-6 pb-8 w-[85%] h-[70%] "
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                className="font-poppins-semibold text-xl text-primary"
              >
                {ingredient.name}
              </Text>

              {ingredient.also_called && (
                <Text className="text-primary font-poppins-regular text-sm my-2">
                  Also called: {ingredient.also_called}
                </Text>
              )}

              {ingredient.quickfacts?.length > 0 && (
                <View className="mb-3">
                  <Text
                    className="font-poppins-semibold text-lg text-primary"
                  >
                    Quick Facts
                  </Text>
                  {ingredient.quickfacts.map((q, i) => (
                    <Text
                      key={i}
                      className=" font-poppins-regular text-sm text-gray-800"
                    >
                      • {q}
                    </Text>
                  ))}
                </View>
              )}

              {ingredient.details && (
                <View className="mb-3">
                  <Text
                    className="font-poppins-semibold text-lg text-primary"
                  >
                    Details
                  </Text>
                  <Text className="font-poppins-regular text-sm text-gray-800 mb-3">
                    {ingredient.details}
                  </Text>
                </View>
              )}

              {ingredient.proof?.length > 0 && (
                <View className="mt-3">
                  <Text
                    className="font-poppins-semibold text-lg text-primary"
                  >
                    Sources
                  </Text>
                  {ingredient.proof.map((p, i) => (
                    <Text
                      key={i}
                      className="font-poppins-medium text-sm text-gray-800"
                    >
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
