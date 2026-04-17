//EditProfileScreen

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUser, saveUser } from '../utils/userStorage';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    username: '',
    phone: '',
    role: '',
    joinDate: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const data = await getUser();
    if (data) setUser(data);
  };

  const handleSave = async () => {
    await saveUser(user);
    Alert.alert('Success', 'Profile updated successfully!');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={user.name}
          onChangeText={(val) => setUser({ ...user, name: val })}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={user.phone}
          onChangeText={(val) => setUser({ ...user, phone: val })}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Role / Designation"
          value={user.role}
          onChangeText={(val) => setUser({ ...user, role: val })}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>💾 Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#343a40',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 18,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});


