import Button from "@/app/components/Button";
import IngredientDetailModal from "@/app/components/IngredientDetailModal";
import SearchBar from "@/app/components/SearchBar";
import TabNavigation from "@/app/components/TabNavigation";
import { usePredictionResult } from "@/app/hooks/usePredictionResult";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { IngredientRead } from "@/interfaces/interfaces";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import IngredientCategories from "../components/IngredientCategories";
import { LoadingScreen } from "../components/LoadingScreen";

export default function Recommendations() {
  const { result, loading } = usePredictionResult();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"recommended" | "avoided">(
    "recommended"
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientRead | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) return <LoadingScreen />;

  if (!result) return <EmptyState title="No Recommendations Found" />;

  return (
    <ImageBackground
      source={images.reco_bg}
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <View
          className="flex-row w-full items-center justify-between"
          style={{ paddingHorizontal: 20, paddingTop: 10 }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.back} />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-lg flex-1 text-center text-primary">
            Ingredient Recommendations
          </Text>
          <View className="w-6 h-6" />
        </View>

        <View className="px-6" style={{ marginTop: 20 }}>
          <SearchBar
            placeholder="Search ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle="bg-white rounded-full px-4 py-1 flex-row items-center"
          />
        </View>

        <View className="px-2">
          <TabNavigation
            tabs={[
              { key: "recommended", title: "Recommended", color: "#16a34a" },
              { key: "avoided", title: "Avoided", color: "#dc2626" },
            ]}
            activeTab={activeTab}
            onTabChange={(tabKey) =>
              setActiveTab(tabKey as "recommended" | "avoided")
            }
            containerStyle=" rounded-2xl p-4 flex-row"
          />
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Tab Content */}
          {activeTab === "recommended" && (
            <IngredientCategories
              ingredients={result.recommended}
              isRecommended={true}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              searchQuery={searchQuery}
              onIngredientPress={(ing) => setSelectedIngredient(ing)}
            />
          )}

          {activeTab === "avoided" && (
            <IngredientCategories
              ingredients={result.avoided}
              isRecommended={false}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              searchQuery={searchQuery}
              onIngredientPress={(ing) => setSelectedIngredient(ing)}
            />
          )}

          <IngredientDetailModal
            ingredient={selectedIngredient}
            visible={!!selectedIngredient}
            onClose={() => setSelectedIngredient(null)}
          />

          {/* Action Buttons */}
          <View className="flex-row justify-between mb-8 space-x-4">
            <View className="flex-1 mr-2">
              <Button
                title="Analyze Again"
                onPress={() => router.replace("/(tabs)/home")}
                size="small"
                icon="primary"
              />
            </View>

            <View className="flex-1 ml-2">
              <Button
                title="Save to History"
                onPress={() => router.push("/(tabs)/history")}
                size="small"
                icon="secondary"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
