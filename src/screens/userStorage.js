// src/utils/userStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'CURRENT_USER';

export const saveUser = async (user) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};

