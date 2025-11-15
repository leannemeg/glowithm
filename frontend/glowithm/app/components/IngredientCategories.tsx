import IngAccordion from "@/app/components/IngAccordion";
import { IngredientRead } from "@/interfaces/interfaces";
import React from "react";
import { View } from "react-native";

interface IngredientCategoriesProps {
  ingredients: Record<string, IngredientRead[]>;
  isRecommended: boolean;
  expandedSections: Record<string, boolean>;
  toggleSection: (category: string) => void;
  searchQuery: string;
  onIngredientPress?: (ingredient: IngredientRead) => void;
}

const IngredientCategories = ({
  ingredients,
  isRecommended,
  expandedSections,
  toggleSection,
  searchQuery,
  onIngredientPress,
}: IngredientCategoriesProps) => {
  const sortedEntries = Object.entries(ingredients).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  if (!sortedEntries.length) return null;

  return (
    <View>
      {sortedEntries.map(([category, items]) => (
        <IngAccordion
          key={category}
          title={category}
          ingredients={items}
          isRecommended={isRecommended}
          isExpanded={expandedSections[category] || false}
          onToggle={() => toggleSection(category)}
          searchQuery={searchQuery}
          onIngredientPress={onIngredientPress}
        />
      ))}
    </View>
  );
};

export default IngredientCategories;
