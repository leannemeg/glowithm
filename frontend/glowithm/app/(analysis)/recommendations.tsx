import Button from "@/app/components/ui/Button";
import IngredientDetailModal from "@/app/components/modals/IngredientDetailModal";
import SearchBar from "@/app/components/SearchBar";
import TabNavigation from "@/app/components/TabNavigation";
import { usePredictionResult } from "@/hooks/usePredictionResult";
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
import NoIngredient from "../components/NoIngredient";
import useHistory from "@/hooks/useHistory";

export default function Recommendations() {
  const { result, loading } = usePredictionResult();
  const { savePrediction } = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"recommended" | "avoided">(
    "recommended"
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientRead | null>(null);
  const [noMatch, setNoMatch] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) return <LoadingScreen />;
  if (!result) return <EmptyState title="No Recommendations Found" />;

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    const trimmed = text.trim().toLowerCase();

    if (trimmed === "") {
      setNoMatch(false);
      return;
    }

    const allIngredients = [
      ...Object.values(result.recommended).flat(),
      ...Object.values(result.avoided).flat(),
    ];

    const match = allIngredients.find((ing) =>
      ing.name.toLowerCase().includes(trimmed)
    );

    setNoMatch(!match);
  };

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
            <Image source={icons.back} style={{ width: 12, height: 20 }} />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-lg flex-1 text-center text-primary">
            Ingredient Recommendations
          </Text>
          <View className="w-6 h-6" />
        </View>

        <View className="px-6" style={{ marginTop: 20 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            containerStyle="bg-white rounded-full px-4 flex-row items-center"
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

          {noMatch && <NoIngredient searchQuery={searchQuery} />}

          {/* Action Buttons */}
          <View className="flex-row justify-between mb-8 space-x-4">
            <View className="flex-1 mr-2">
              <Button
                title="Analyze Again"
                onPress={() => router.replace("/(tabs)/home")}
                size="small"
                icon="analyze-again"
              />
            </View>

            <View className="flex-1 ml-2">
              <Button
                title="Save to History"
                onPress={async () => {
                  if (!result) return;

                  try {
                    await savePrediction(result);
                  } catch (error) {
                    console.error("Failed to save history entry:", error);
                  }

                  router.push("/(tabs)/history");
                }}
                size="small"
                icon="save"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
