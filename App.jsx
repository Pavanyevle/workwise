import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';

// Home / Dashboard
import HomeScreen from './src/screens/HomeScreen';

// Employee Screens
import EmployeeList from './src/screens/EmployeeList';
import EmployeeProfile from './src/screens/EmployeeProfile';
import AddEditEmployee from './src/screens/AddEditEmployee';
import AttendanceScreen from './src/screens/AttendanceScreen';
import LeaveApplication from './src/screens/LeaveApplication';
import LeaveStatus from './src/screens/LeaveStatus';
import SalaryScreen from './src/screens/SalaryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TaskScreen from './src/screens/TaskScreen';
import ChatScreen from './src/screens/ChatScreen';
import HolidayScreen from './src/screens/HolidayScreen';

// Admin Specific
import Admin from './src/screens/Admin';
import Addemp from './src/screens/Addemp';
import Showemp from './src/screens/Showemp';

// Profile
import EditProfileScreen from './src/screens/EditProfileScreen';

// Extra Screens
import CalendarScreen from './src/screens/CalendarScreen';
import StatsScreen from './src/screens/StatsScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import HelpScreen from './src/screens/HelpScreen';
import MyTeamScreen from './src/screens/MyTeamScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
          {/* Auth */}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} />

          {/* Home */}
          <Stack.Screen name="HomeScreen" component={HomeScreen} />

          {/* Employee */}
          <Stack.Screen name="EmployeeList" component={EmployeeList} />
          <Stack.Screen name="EmployeeProfile" component={EmployeeProfile} />
          <Stack.Screen name="AddEditEmployee" component={AddEditEmployee} />
          <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
          <Stack.Screen name="LeaveApplication" component={LeaveApplication} />
          <Stack.Screen name="LeaveStatus" component={LeaveStatus} />
          <Stack.Screen name="SalaryScreen" component={SalaryScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="TaskScreen" component={TaskScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="HolidayScreen" component={HolidayScreen} />

          {/* Admin */}
          <Stack.Screen name="Admin" component={Admin} />
          <Stack.Screen name="Addemp" component={Addemp} />
          <Stack.Screen name="Showemp" component={Showemp} />

          {/* Profile */}
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

          {/* Extra */}
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
          <Stack.Screen name="StatsScreen" component={StatsScreen} />
          <Stack.Screen name="DocumentsScreen" component={DocumentsScreen} />
          <Stack.Screen name="HelpScreen" component={HelpScreen} />
          <Stack.Screen name="MyTeamScreen" component={MyTeamScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}