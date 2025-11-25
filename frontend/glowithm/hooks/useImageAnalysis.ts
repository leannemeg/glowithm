import { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { storePredictionResult } from "@/utils/analysisStorage";
import { PredictResponse } from "@/interfaces/interfaces";
import { router } from "expo-router";
import { Camera } from "expo-camera";

export const useImageAnalysis = (options?: { onStart?: () => void }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const abortController = useRef<AbortController | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);
  const errorOccurredRef = useRef(false);

  const requestPermissions = async (): Promise<boolean> => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Camera:", cameraStatus, "Media:", mediaStatus);
    return cameraStatus === "granted" && mediaStatus === "granted";
  };

  const handlePickImage = async (source: "camera" | "gallery") => {
    options?.onStart?.();
    cancelledRef.current = false;

    const granted = await requestPermissions();
    if (!granted) {
      setErrorMessage("Camera or media permissions are required.");
      setErrorModalVisible(true);
      return;
    }
    
    try {
      let pickerResult: ImagePicker.ImagePickerResult;

      if (source === "camera") {
        pickerResult = await ImagePicker.launchCameraAsync({ allowsEditing: false });
      } else {
        pickerResult = await ImagePicker.launchImageLibraryAsync({ allowsEditing: false, mediaTypes: 'images' });
      }

      if (!pickerResult.canceled && pickerResult.assets?.[0]) {
        const { uri } = pickerResult.assets[0];

        // Fetch file as a blob
        const uriResponse = await fetch(uri);
        const blob = await uriResponse.blob();

        // Check MIME type
        const allowedMimeTypes = ["image/jpeg", "image/png"];
        if (!allowedMimeTypes.includes(blob.type)) {
          setErrorMessage("Unsupported image format. Please use JPEG or PNG.");
          setErrorModalVisible(true);
          errorOccurredRef.current = true;
          return;
        }

        // --- Proceed with analysis ---
        setAnalyzing(true);
        setProgress(0);
        abortController.current = new AbortController();

        progressInterval.current = setInterval(() => {
          setProgress((prev) => (prev < 90 ? prev + 2 : prev));
        }, 200);

        const formData = new FormData();
        formData.append("file", {
          uri,
          type: blob.type,
          name: `skin_image${blob.type === "image/png" ? ".png" : ".jpg"}`,
        } as any);

        const response = await fetch(`http://192.168.1.138:8000/predict`, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
          signal: abortController.current.signal,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setErrorMessage(data.detail || "Unsupported image format");
          setErrorModalVisible(true);
          errorOccurredRef.current = true;
          return; // stop execution, do not proceed
        }

        const prediction: PredictResponse = await response.json();
        await storePredictionResult(prediction);

        setProgress(100);
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        errorOccurredRef.current = true;
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
        // Only navigate to results when the analysis wasn't cancelled and no error occurred
        if (!cancelledRef.current && !errorOccurredRef.current) {
          router.push("/results");
        }
        // reset error flag for next run
        errorOccurredRef.current = false;
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