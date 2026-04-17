{/*import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Linking,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const deviceTheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(deviceTheme === 'dark');

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    Alert.alert('Theme Changed', newTheme ? 'Dark Mode Enabled' : 'Light Mode Enabled');
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => navigation.navigate('LoginScreen'),
      },
    ]);
  };

  const reportIssue = () => {
    Alert.alert('Report Issue', 'Thanks! We will look into it.');
  };

  const openHelp = () => {
    navigation.navigate('HelpScreen');
  };

  const openSupportEmail = () => {
    Linking.openURL('mailto:sonawanedipak2006@gmail.com?subject=Support Needed');
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://yourapp.com/privacy-policy');
  };

  const bgColor = darkMode ? '#1e272e' : '#f1f2f6';
  const cardColor = darkMode ? '#2f3640' : '#ffffff';
  const textColor = darkMode ? '#dcdde1' : '#2f3640';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>⚙️ Settings</Text>

     
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardColor }]}
        onPress={() => navigation.navigate('EmployeeProfile')}
      >
        <View style={styles.optionRow}>
          <Ionicons name="person" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Profile Settings</Text>
        </View>
      </TouchableOpacity>

      
      <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.optionRow}>
          <Ionicons name="key" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Change Password</Text>
        </View>
      </TouchableOpacity>

      
      <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]} onPress={openHelp}>
        <View style={styles.optionRow}>
          <Ionicons name="help-circle" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Help & FAQ</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]} onPress={openSupportEmail}>
        <View style={styles.optionRow}>
          <Ionicons name="mail" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Contact Support</Text>
        </View>
      </TouchableOpacity>

    
      <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]} onPress={openPrivacyPolicy}>
        <View style={styles.optionRow}>
          <Ionicons name="document-text" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Privacy Policy</Text>
        </View>
      </TouchableOpacity>

  
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardColor }]}
        onPress={reportIssue}
      >
        <View style={styles.optionRow}>
          <Ionicons name="bug" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Report a Problem</Text>
        </View>
      </TouchableOpacity>

     
      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#ff6b6b' }]}
        onPress={confirmLogout}
      >
        <View style={styles.optionRow}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={[styles.optionText, { color: '#fff' }]}>Logout</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
});
*/}

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Linking,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const deviceTheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(deviceTheme === 'dark');

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    Alert.alert('Theme Changed', newTheme ? 'Dark Mode Enabled' : 'Light Mode Enabled');
  };

const confirmLogout = () => {
  Alert.alert('Logout', 'Are you sure you want to logout?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Logout',
      style: 'destructive',
      onPress: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
        //setTimeout(() => BackHandler.exitApp(), 200); // ✅ back दाबल्यावर app बंद
      },
    },
  ]);
};



  const reportIssue = () => {
    Alert.alert('Report Issue', 'Thanks! We will look into it.');
  };

  const openHelp = () => {
    navigation.navigate('HelpScreen');
  };

  const openSupportEmail = () => {
    Linking.openURL('mailto:sonawanedipak2006@gmail.com?subject=Support Needed');
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://yourapp.com/privacy-policy');
  };

  const bgColor = darkMode ? '#1e272e' : '#f1f2f6';
  const cardColor = darkMode ? '#2f3640' : '#ffffff';
  const textColor = darkMode ? '#dcdde1' : '#2f3640';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>⚙️ Settings</Text>

     
  
    
      <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]} onPress={openHelp}>
        <View style={styles.optionRow}>
          <Ionicons name="help-circle" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Help & FAQ</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]} onPress={openSupportEmail}>
        <View style={styles.optionRow}>
          <Ionicons name="mail" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Contact Support</Text>
        </View>
      </TouchableOpacity>

      
      <TouchableOpacity style={[styles.card, { backgroundColor: cardColor }]} onPress={openPrivacyPolicy}>
        <View style={styles.optionRow}>
          <Ionicons name="document-text" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Privacy Policy</Text>
        </View>
      </TouchableOpacity>

      
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardColor }]}
        onPress={reportIssue}
      >
        <View style={styles.optionRow}>
          <Ionicons name="bug" size={24} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Report a Problem</Text>
        </View>
      </TouchableOpacity>

      
      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#ff6b6b' }]}
        onPress={confirmLogout}
      >
        <View style={styles.optionRow}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={[styles.optionText, { color: '#fff' }]}>Logout</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
  },
});


