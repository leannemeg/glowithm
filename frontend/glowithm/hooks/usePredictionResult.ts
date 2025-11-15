import { useState, useEffect } from "react";
import { router } from "expo-router";
import { getPredictionResult, clearStorage } from "@/utils/analysisStorage";
import { PredictResponse } from "@/interfaces/interfaces";

export const usePredictionResult = () => {
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await getPredictionResult();
      if (data) setResult(data);
      else router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Error loading results:", error);
      router.replace("/(tabs)/home");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    await clearStorage();
    router.replace("/(tabs)/home");
  };

  return { result, loading, handleRetry };
};