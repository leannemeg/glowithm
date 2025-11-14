import AsyncStorage from '@react-native-async-storage/async-storage';
import { PredictResponse } from '@/interfaces/interfaces';

const PREDICTION_RESULT = 'prediction_result';

// Store
export const storePredictionResult = async (result: PredictResponse) => {
  try {
    await AsyncStorage.setItem(PREDICTION_RESULT, JSON.stringify(result));
  } catch (error) {
    console.error('Error storing prediction result:', error);
  }
};

// Get
export const getPredictionResult = async (): Promise<PredictResponse | null> => {
  try {
    const data = await AsyncStorage.getItem(PREDICTION_RESULT);
    return data ? (JSON.parse(data) as PredictResponse) : null;
  } catch (error) {
    console.error('Error getting prediction result:', error);
    return null;
  }
};

// Clear
export const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem(PREDICTION_RESULT);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
