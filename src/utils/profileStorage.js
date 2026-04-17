// src/utils/profileStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@user_profile';

export const setUserProfile = async (profile) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile));
};

export const getUserProfile = async () => {
  const v = await AsyncStorage.getItem(KEY);
  return v ? JSON.parse(v) : null;
};

export const clearUserProfile = async () => {
  await AsyncStorage.removeItem(KEY);
};
