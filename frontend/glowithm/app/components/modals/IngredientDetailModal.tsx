import { IngredientRead } from "@/interfaces/interfaces";
import React from "react";
import { Modal, Pressable, Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useIngredientExplain } from "@/hooks/useIngredientExplain";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
  const { aiExplanation, loadingExplain } = useIngredientExplain(
    ingredient?.name
  );

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
              <Text className="font-poppins-semibold text-xl text-primary">
                {ingredient.name}
              </Text>

              {ingredient.also_called && (
                <Text className="text-primary font-poppins-regular text-sm my-2">
                  Also called: {ingredient.also_called}
                </Text>
              )}

              <View className="my-4 p-2 bg-indigo-200 rounded-xl">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="star-four-points"
                    size={18}
                    color="#4663D8"
                  />
                  <Text className="text-indigo-600 font-poppins-semibold text-md mt-1 ml-2">
                    Explained by AI
                  </Text>
                </View>

                <View className="p-1">
                  {loadingExplain ? (
                    <Text className="text-indigo-700 font-poppins-regular text-sm">
                      Generating explanation...
                    </Text>
                  ) : (
                    <Text className="text-indigo-700 font-poppins-regular text-sm">
                      {aiExplanation}
                    </Text>
                  )}
                </View>
              </View>

              {ingredient.quickfacts?.length > 0 && (
                <View className="mb-3">
                  <Text className="font-poppins-semibold text-lg text-primary mb-2">
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
                  <Text className="font-poppins-semibold text-lg text-primary mb-2">
                    Details
                  </Text>
                  <Text className="font-poppins-regular text-sm text-gray-800 mb-3">
                    {ingredient.details}
                  </Text>
                </View>
              )}

              {ingredient.proof?.length > 0 && (
                <View className="mt-3">
                  <Text className="font-poppins-semibold text-lg text-primary mb-2">
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
              <View className="flex-row items-center">
                <Image
                  source={require("@/assets/images/inci-logo.png")}
                  className="w-8 h-8 mt-4 opacity-50 mr-2"
                />
                <Image
                  source={require("@/assets/images/google-gemini-logo.png")}
                  className="w-20 h-4 mt-4 opacity-50"
                />
              </View>
            </ScrollView>
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
}
