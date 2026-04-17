// src/navigation/RootNavigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EmployeeProfile from '../screens/EmployeeProfile';
import HelpScreen from '../screens/HelpScreen'; // if you have it

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="EmployeeProfile" component={EmployeeProfile} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
