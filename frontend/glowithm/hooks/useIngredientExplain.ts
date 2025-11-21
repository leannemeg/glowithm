import { useState, useEffect } from "react";
import { explainIngredient } from "@/utils/api"; // make sure your API util exists

export const useIngredientExplain = (ingredientName?: string) => {
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [loadingExplain, setLoadingExplain] = useState(false);

  useEffect(() => {
    if (!ingredientName) return;

    const fetchExplanation = async () => {
      setLoadingExplain(true);
      try {
        const response = await explainIngredient(ingredientName);
        setAiExplanation(response.explanation);
      } catch (error) {
        console.log("Explain error:", error);
        setAiExplanation("No AI explanation available.");
      } finally {
        setLoadingExplain(false);
      }
    };

    fetchExplanation();
  }, [ingredientName]);

  return { aiExplanation, loadingExplain };
};
