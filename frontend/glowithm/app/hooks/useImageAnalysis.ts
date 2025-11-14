import { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { storePredictionResult } from "@/utils/analysisStorage";
import { PredictResponse } from "@/interfaces/interfaces";
import { router } from "expo-router";

export const useImageAnalysis = (options?: { onStart?: () => void }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const abortController = useRef<AbortController | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  const handlePickImage = async (fromCamera: boolean) => {
    options?.onStart?.();
    cancelledRef.current = false;

    try {
      let pickerResult: ImagePicker.ImagePickerResult;
      if (fromCamera) {
        pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!pickerResult.canceled && pickerResult.assets?.[0]) {
        const imageUri = pickerResult.assets[0].uri;
        setAnalyzing(true);
        setProgress(0);
        abortController.current = new AbortController();

        progressInterval.current = setInterval(() => {
          setProgress((prev) => (prev < 90 ? prev + 2 : prev));
        }, 200);

        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg",
          name: "skin_image.jpg",
        } as any);

        const startTime = Date.now();
        const response = await fetch("http://192.168.1.28:8000/predict", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
          signal: abortController.current.signal,
        });

        if (!response.ok)
          throw new Error(`Prediction failed with status ${response.status}`);

        const prediction: PredictResponse = await response.json();
        await storePredictionResult(prediction);

        const MIN_ANALYSIS_TIME = 2000;
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_ANALYSIS_TIME)
          await new Promise((res) => setTimeout(res, MIN_ANALYSIS_TIME - elapsed));

        setProgress(100);
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
         setErrorMessage(error.message);
        setErrorModalVisible(true);
      }
    } finally {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }

      setTimeout(() => {
        setAnalyzing(false);
        if (!cancelledRef.current) {
          router.push("/results");
        }
      }, 1500);
    }
  };

  const handleCancelAnalysis = () => {
    cancelledRef.current = true;
    abortController.current?.abort();
    clearInterval(progressInterval.current!);
    setAnalyzing(false);
    setProgress(0);
  };

  return {
    analyzing,
    progress,
    errorModalVisible,
    errorMessage,
    setErrorModalVisible,
    handlePickImage,
    handleCancelAnalysis,
  };
};

export default useImageAnalysis;