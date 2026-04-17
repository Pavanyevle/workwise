//EmployeeList
{/*}
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'EMPLOYEE_LIST';

const EmployeeList = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [searchText, setSearchText] = useState('');
  const [sortAZ, setSortAZ] = useState(true);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, [isFocused]);

  const loadEmployees = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setEmployees(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filtered = employees
    .filter(emp => emp.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) =>
      sortAZ ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍💼 Employee Directory</Text>

      <TextInput
        style={styles.input}
        placeholder="🔍 Search employee by name"
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.sortButton} onPress={() => setSortAZ(!sortAZ)}>
        <Text style={styles.sortText}>{sortAZ ? '🔽 Sort Z-A' : '🔼 Sort A-Z'}</Text>
      </TouchableOpacity>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EmployeeProfile', { employee: item })}
            style={styles.card}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.info}>📅 Joined: {item.joinDate}</Text>
            <Text style={styles.info}>💼 Role: {item.role}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#343a40',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  sortText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  info: {
    fontSize: 14,
    color: '#495057',
    marginTop: 4,
  },
});

*/}

// EmployeeList
{/*}
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const STORAGE_KEY = 'EMPLOYEE_LIST';
const { width, height } = Dimensions.get('window');

const EmployeeList = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [searchText, setSearchText] = useState('');
  const [sortAZ, setSortAZ] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [isFocused]);

  const loadEmployees = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setEmployees(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filtered = employees
    .filter(emp => emp.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const searchLower = searchText.toLowerCase();
      
      // First priority: names starting with search text
      const aStartsWith = aName.startsWith(searchLower);
      const bStartsWith = bName.startsWith(searchLower);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Second priority: alphabetical order
      if (sortAZ) {
        return aName.localeCompare(bName);
      } else {
        return bName.localeCompare(aName);
      }
    });

  const renderItem = ({ item, index }) => {
    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('EmployeeProfile', { employee: item })}
          style={styles.card}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>
                {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </LinearGradient>
            <View style={styles.cardInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          </View>
          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#64748b" />
              <Text style={styles.detailText}>Joined: {item.joinDate}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.backgroundGradient}
      />
      
      <View style={styles.floatingCircle1} />
      <View style={styles.floatingCircle2} />
      <View style={styles.floatingCircle3} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#fff', '#f8f9fa']}
                style={styles.logo}
              >
                <Ionicons name="people" size={40} color="#667eea" />
              </LinearGradient>
            </View>
            <Text style={styles.heading}>Employee Directory</Text>
            <Text style={styles.subheading}>Find and manage your team</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="search-outline" size={20} color="#667eea" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Search employee by name"
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <TouchableOpacity 
              style={styles.buttonContainer}
              onPress={() => setSortAZ(!sortAZ)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="swap-vertical" size={20} color="#fff" />
                <Text style={styles.buttonText}>
                  {sortAZ ? 'Sort: A → Z' : 'Sort: Z → A'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.countContainer}>
              <Text style={styles.countText}>
                {filtered.length} employee{filtered.length !== 1 ? 's' : ''} found
              </Text>
            </View>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  floatingCircle1: {
    position: 'absolute',
    top: 80,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingCircle2: {
    position: 'absolute',
    top: 150,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingCircle3: {
    position: 'absolute',
    top: 200,
    right: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subheading: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  countContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  countText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});
*/}

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Dimensions, Animated, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const EmployeeList = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [searchText, setSearchText] = useState('');
  const [sortAZ, setSortAZ] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isFocused) return;

    const subscriber = firestore()
      .collection('employees')
      .onSnapshot(querySnapshot => {
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(list);
      }, error => {
        console.error('Firestore fetch error:', error);
      });

    return () => subscriber();
  }, [isFocused]);

  const filtered = employees
    .filter(emp => emp.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const searchLower = searchText.toLowerCase();
      const aStarts = aName.startsWith(searchLower);
      const bStarts = bName.startsWith(searchLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return sortAZ ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

  const renderItem = ({ item }) => (
    <Animated.View style={[styles.cardContainer, {
      opacity: fadeAnim,
      transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
    }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('EmployeeProfile', { employee: item })}
        style={styles.card}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={styles.cardInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <Text style={styles.detailText}>Joined: {item.joinDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.backgroundGradient} />
      <View style={styles.floatingCircle1} />
      <View style={styles.floatingCircle2} />
      <View style={styles.floatingCircle3} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          {/* header, search form, sort button etc remain same */}
          {/* ... */}
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default EmployeeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  floatingCircle1: {
    position: 'absolute',
    top: 80,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingCircle2: {
    position: 'absolute',
    top: 150,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingCircle3: {
    position: 'absolute',
    top: 200,
    right: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subheading: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 30,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  countContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  countText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});