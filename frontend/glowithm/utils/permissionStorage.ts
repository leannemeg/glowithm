import AsyncStorage from "@react-native-async-storage/async-storage";

const PERMISSION_KEY = "permissions_granted";

export const setPermissionGranted = async () => {
  await AsyncStorage.setItem(PERMISSION_KEY, "true");
};

export const hasPermissionGranted = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(PERMISSION_KEY);
  return value === "true";
};