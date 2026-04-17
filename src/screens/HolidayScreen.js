{/*import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const HolidaysScreen = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const data = await AsyncStorage.getItem('holidays');
        const parsed = data ? JSON.parse(data) : [];
        setHolidays(parsed);
      } catch (error) {
        console.log('Error loading holidays:', error);
      }
    };

    loadHolidays();
  }, []);

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    const start = moment(fromDate, 'YYYY-MM-DD');
    const end = moment(toDate, 'YYYY-MM-DD');
    return end.diff(start, 'days') + 1;
  };

  const renderItem = ({ item }) => {
    const from = item.fromDate;
    const to = item.toDate;
    const name = item.name || 'Leave Approved';
    const totalDays = calculateDays(from, to);

    return (
      <View style={styles.card}>
        <Text style={styles.holidayName}>🎉 {name}</Text>
        <Text style={styles.holidayDate}>📅 {from} to {to}</Text>
        <Text style={styles.totalDays}>🗓 Total Leave Days: {totalDays} day(s)</Text>

       

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📆 Approved Holiday List</Text>
      {holidays.length === 0 ? (
        <Text style={styles.noData}>No holidays found.</Text>
      ) : (
        <FlatList
          data={holidays}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default HolidaysScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fc',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  holidayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 4,
  },
  holidayDate: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  totalDays: {
    fontSize: 16,
    color: '#00796b',
    fontWeight: '500',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 50,
  },
});
*/}
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const HolidaysScreen = () => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const data = await AsyncStorage.getItem('holidays');
        const parsed = data ? JSON.parse(data) : [];
        setHolidays(parsed);
      } catch (error) {
        console.log('Error loading holidays:', error);
      }
    };
    loadHolidays();
  }, []);

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    const start = moment(fromDate, 'YYYY-MM-DD');
    const end = moment(toDate, 'YYYY-MM-DD');
    return end.diff(start, 'days') + 1;
  };

  const renderItem = ({ item }) => {
    const totalDays = calculateDays(item.fromDate, item.toDate);

    return (
      <View style={styles.card}>
        <Text style={styles.holidayName}>🎉 {item.name}</Text>
        <Text style={styles.holidayDate}>📅 {item.fromDate} to {item.toDate}</Text>
        <Text style={styles.totalDays}>🗓 Total Leave Days: {totalDays} day(s)</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📆 Approved Holiday List</Text>
      {holidays.length === 0 ? (
        <Text style={styles.noData}>No holidays found.</Text>
      ) : (
        <FlatList
          data={holidays}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default HolidaysScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f8fc', padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  holidayName: { fontSize: 18, fontWeight: '600', color: '#2e7d32', marginBottom: 4 },
  holidayDate: { fontSize: 16, color: '#555', marginBottom: 6 },
  totalDays: { fontSize: 16, color: '#00796b', fontWeight: '500' },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 50,
  },
});
