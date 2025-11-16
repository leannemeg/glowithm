import { icons } from "@/constants/icons";
import { IngredientRead } from "@/interfaces/interfaces";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Category mappings - handles multiple backend category name formats
const CATEGORY_MAPPINGS: Record<string, string> = {
  // Hydrators
  "hydrators & humectants": "hydrator",
  "hydrators_&_humectants": "hydrator",

  // Soothers
  "soothers & calmatives": "soother",
  "soothers_&_calmatives": "soother",

  // Antioxidants
  "antioxidants & brighteners": "antioxidant",
  "antioxidants_&_brighteners": "antioxidant",

  // Anti-aging
  "anti-aging": "anti_aging",

  // Exfoliants
  "active exfoliants": "exfoliant",
  active_exfoliants: "exfoliant",

  // Emollients
  "emollients & occlusives": "emollient",
  "emollients_&_occlusives": "emollient",

  // Fragrance
  "fragrance & essential oils": "fragrance",
  "fragrance_&_essential_oils": "fragrance",

  // Surfactants
  "gentle surfactants": "gsurfactant",
  gentle_surfactants: "gsurfactant",
  "harsh surfactants": "hsurfactant",
  harsh_surfactants: "hsurfactant",

  // UV Protection
  "uv filters": "uv",
  uv_filters: "uv",

  // Problematic ingredients
  "drying alcohols": "alcohol",
  drying_alcohols: "alcohol",
  "high comedogenics": "comedogenic",
  high_comedogenics: "comedogenic",
  "acne-fighting": "acne",
  acne_fighting: "acne",
};

interface IngAccordionProps {
  title: string;
  ingredients: IngredientRead[];
  isRecommended: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery: string;
  onIngredientPress?: (ingredient: IngredientRead) => void;
}

const IngAccordion: React.FC<IngAccordionProps> = ({
  title,
  ingredients,
  isRecommended,
  isExpanded,
  onToggle,
  searchQuery,
  onIngredientPress,
}) => {
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = () => {
    const normalizedTitle = title.toLowerCase().replace(/ /g, "_");
    const iconKey =
      CATEGORY_MAPPINGS[title.toLowerCase()] ||
      CATEGORY_MAPPINGS[normalizedTitle];
    return iconKey ? icons[iconKey as keyof typeof icons] : null;
  };

  if (filteredIngredients.length === 0 && searchQuery) return null;

  return (
    <View className="mb-4">
      <View
        className={`bg-white rounded-3xl border ${
          isRecommended ? "border-accent-green" : "border-accent-red"
        }`}
        style={{
          borderBottomRightRadius: 16,
          borderBottomLeftRadius: 16,
        }}
      >
        <TouchableOpacity onPress={onToggle} className="p-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              {getCategoryIcon() && (
                <Image
                  source={getCategoryIcon()}
                  style={{
                    marginRight: 12,
                    width: 24,
                    height: 24,
                    tintColor: isExpanded
                      ? isRecommended
                        ? "#15803d"
                        : "#dc2626"
                      : "#666666",
                  }}
                />
              )}
              <Text
                className={`font-poppins-semibold text-lg capitalize ${
                  isExpanded
                    ? isRecommended
                      ? "text-green-700"
                      : "text-red-700"
                    : "text-gray-600"
                }`}
              >
                {title.replace("_", " ")}
              </Text>
            </View>
            <Image
              source={icons.dropdown}
              style={{
                width: 17,
                tintColor: isExpanded
                  ? isRecommended
                    ? "#15803d"
                    : "#dc2626"
                  : "#666666",
                transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
              }}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View
            className={`bg-white p-4 pt-0 rounded-b-2xl ${
              isRecommended ? "border-accent-green" : "border-accent-red"
            }`}
            style={{
              marginTop: 12,
              borderBottomRightRadius: 16,
              borderBottomLeftRadius: 16,
            }}
          >
            <View className="flex-row flex-wrap">
              {filteredIngredients.map((ingredient) => (
                <TouchableOpacity
                  key={ingredient.id}
                  onPress={() => onIngredientPress?.(ingredient)}
                  className={`bg-gray-50 rounded-full px-3 py-2 mr-2 mb-2 border ${
                    isRecommended ? "border-green-200" : "border-red-200"
                  }`}
                >
                  <Text className="font-poppins-regular text-sm text-gray-800">
                    {ingredient.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {filteredIngredients.length === 0 && (
              <Text className="font-poppins-regular text-gray-500 text-center py-4">
                No ingredients found matching &quot;{searchQuery}&quot;
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default IngAccordion;
