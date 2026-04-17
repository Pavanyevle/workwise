import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const teamData = [
  { id: '1', name: 'Dipak Sonawane', role: 'Developer' },
  { id: '2', name: 'Harish Patil', role: 'UI Designer' },
  { id: '3', name: 'Bhavesh Khole', role: 'Tester' },
  { id: '4', name: 'Anuj tadavi', role: 'Project Manager' },
];

const MyTeamScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 My Team</Text>
      <FlatList
        data={teamData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default MyTeamScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#dff9fb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#130f40',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: '#636e72',
  },
});
