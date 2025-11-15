import AsyncStorage from '@react-native-async-storage/async-storage';
import { PredictResponse } from '@/interfaces/interfaces';

const PREDICTION_RESULT = 'prediction_result';
const PREDICTION_HISTORY = 'prediction_history';

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

// History helpers
export const getHistory = async (): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem(PREDICTION_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const storeHistory = async (entries: any[]) => {
  try {
    await AsyncStorage.setItem(PREDICTION_HISTORY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error storing history:', error);
  }
};

export const addHistoryEntry = async (entry: any) => {
  try {
    const current = await getHistory();
    const updated = [entry, ...current];
    await storeHistory(updated);
    return updated;
  } catch (error) {
    console.error('Error adding history entry:', error);
    return null;
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(PREDICTION_HISTORY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
};
