//EmployeeProfile

{/*}
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

const EmployeeProfile = ({ route }) => {
  const employee = route?.params?.employee;

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Employee Profile</Text>
        <Text style={styles.error}>❌ Employee data not available.</Text>
      </View>
    );
  }

  const [note, setNote] = useState('');

  const handleSaveNote = () => {
    Alert.alert('Note Saved', `Note for ${employee.name}: ${note}`);
    setNote('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Profile</Text>

      <Text style={styles.label}>👤 Name:</Text>
      <Text style={styles.value}>{employee.name}</Text>

      <Text style={styles.label}>🆔 Employee ID:</Text>
      <Text style={styles.value}>{employee.id}</Text>

      <Text style={styles.label}>📅 Join Date:</Text>
      <Text style={styles.value}>{employee.joinDate}</Text>

      <Text style={styles.label}>📝 Remarks / Notes:</Text>
      <TextInput
        placeholder="Add a note..."
        style={styles.input}
        value={note}
        onChangeText={setNote}
        multiline
      />
      <Button title="Save Note" onPress={handleSaveNote} />
    </View>
  );
};

export default EmployeeProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  value: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    height: 80,
    marginBottom: 15,
    borderRadius: 6,
    textAlignVertical: 'top',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});
*/}



{/*
  import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const EmployeeProfile = ({ route }) => {
  const { employee } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Employee Profile</Text>

      <Text style={styles.label}>👤 Full Name:</Text>
      <Text style={styles.value}>{employee.name}</Text>

      <Text style={styles.label}>🆔 Employee ID:</Text>
      <Text style={styles.value}>{employee.id}</Text>

      <Text style={styles.label}>📅 Join Date:</Text>
      <Text style={styles.value}>{employee.joinDate}</Text>

      <Text style={styles.label}>🏢 Department:</Text>
      <Text style={styles.value}>{employee.department}</Text>

      <Text style={styles.label}>🧑‍💼 Role:</Text>
      <Text style={styles.value}>{employee.role}</Text>

      <Text style={styles.label}>📞 Phone:</Text>
      <Text style={styles.value}>{employee.phone}</Text>

      <Text style={styles.label}>📧 Email:</Text>
      <Text style={styles.value}>{employee.email}</Text>

      <Text style={styles.label}>🏠 Address:</Text>
      <Text style={styles.value}>{employee.address}</Text>

      <Text style={styles.label}>📝 Remarks:</Text>
      <Text style={styles.value}>{employee.remarks || 'N/A'}</Text>
    </ScrollView>
  );
};

export default EmployeeProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    color: '#333',
  },
});
*/}


// src/screens/EmployeeProfile.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getUserProfile } from '../utils/profileStorage';

const EmployeeProfile = ({ route }) => {
  const [employee, setEmployee] = useState(route?.params?.employee || null);
  const [loading, setLoading] = useState(!route?.params?.employee);

  useEffect(() => {
    if (!employee) {
      (async () => {
        try {
          const p = await getUserProfile();
          setEmployee(p);
        } catch (e) {
          Alert.alert('Error', 'Could not load profile');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [employee]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!employee) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center' }}>No profile found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Employee Profile</Text>

      <View style={styles.card}>
        <ProfileItem label="🧑 Full Name" value={employee.name} />
        <ProfileItem label="🆔 Employee ID" value={employee.id} />
        <ProfileItem label="📅 Join Date" value={employee.joinDate} />
        <ProfileItem label="🏢 Department" value={employee.department} />
        <ProfileItem label="💼 Role" value={employee.role} />
        <ProfileItem label="📞 Phone" value={employee.phone} />
        <ProfileItem label="📧 Email" value={employee.email} />
        <ProfileItem label="🏠 Address" value={employee.address} />
        <ProfileItem label="📝 Remarks" value={employee.remarks || 'N/A'} />
      </View>
    </ScrollView>
  );
};

const ProfileItem = ({ label, value }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
    <View style={styles.divider} />
  </View>
);

export default EmployeeProfile;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#eaf1f8', padding: 20 },
  title: {
    fontSize: 28, fontWeight: 'bold', color: '#1f3c88', marginBottom: 20,
    textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
  item: { marginBottom: 16 },
  label: { fontSize: 13, color: '#5a5a5a', fontWeight: '600', marginBottom: 4 },
  value: { fontSize: 16, color: '#1c1c1c', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#ddd', marginTop: 12 },
});
