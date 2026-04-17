import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  Alert, StatusBar, ActivityIndicator, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { firebaseGet, firebaseDelete, objectToArray } from '../../firebase.config';

export default function Showemp({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useFocusEffect(useCallback(() => { loadEmployees(); }, []));

  const loadEmployees = async () => {
    setLoading(true);
    try {
      // 🔥 Fetch from Firebase Realtime Database
      const data = await firebaseGet('employees');
      const list = objectToArray(data);
      setEmployees(list);
      setFiltered(list);
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    } catch (err) {
      Alert.alert('Error', 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(employees.filter(e =>
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.department?.toLowerCase().includes(q) ||
      e.empId?.toLowerCase().includes(q)
    ));
  }, [search, employees]);

  const handleDelete = (emp) => {
    Alert.alert('🗑️ Delete', `Delete ${emp.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            // 🔥 Delete from Firebase
            await firebaseDelete(`employees/${emp.id}`);
            const updated = employees.filter(e => e.id !== emp.id);
            setEmployees(updated);
            setFiltered(updated.filter(e => {
              const q = search.toLowerCase();
              return e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q);
            }));
          } catch { Alert.alert('Error', 'Delete failed'); }
        }
      }
    ]);
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  const colors = ['#667eea', '#11998e', '#f953c6', '#ff6a00', '#30cfd0', '#4facfe'];

  const renderItem = ({ item, index }) => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => navigation.navigate('EmployeeProfile', { employee: item })}>
        <View style={[styles.avatar, { backgroundColor: colors[index % colors.length] }]}>
          <Text style={styles.initials}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.empName}>{item.name}</Text>
          <Text style={styles.empRole}>{item.role || 'Employee'}</Text>
          <Text style={styles.empDept}>{item.department}</Text>
          <Text style={styles.empId}>ID: {item.empId}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e8f4fd' }]} onPress={() => navigation.navigate('Addemp', { employee: item })}>
            <Icon name="create-outline" size={18} color="#2980b9" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fde8e8' }]} onPress={() => handleDelete(item)}>
            <Icon name="trash-outline" size={18} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Employees</Text>
          <Text style={styles.headerSub}>{employees.length} total</Text>
        </View>
        <TouchableOpacity onPress={loadEmployees} style={styles.refreshBtn}>
          <Icon name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.searchWrap}>
        <Icon name="search-outline" size={20} color="#667eea" />
        <TextInput style={styles.searchInput} placeholder="Search by name, email, dept..." placeholderTextColor="#999" value={search} onChangeText={setSearch} />
        {search ? <TouchableOpacity onPress={() => setSearch('')}><Icon name="close-circle" size={20} color="#999" /></TouchableOpacity> : null}
      </View>

      {loading ? (
        <View style={styles.loadingBox}><ActivityIndicator size="large" color="#667eea" /><Text style={styles.loadingText}>Loading from Firebase...</Text></View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Icon name="people-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>{search ? 'No results found' : 'No employees yet'}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  refreshBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 14, paddingHorizontal: 14, elevation: 4, gap: 10 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#333' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, elevation: 3, alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  initials: { fontSize: 18, fontWeight: '800', color: '#fff' },
  info: { flex: 1 },
  empName: { fontSize: 16, fontWeight: '700', color: '#2d3436', marginBottom: 2 },
  empRole: { fontSize: 13, color: '#667eea', fontWeight: '600' },
  empDept: { fontSize: 12, color: '#636e72' },
  empId: { fontSize: 11, color: '#b2bec3', marginTop: 2 },
  actions: { gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#667eea', fontSize: 14 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 16, color: '#999' },
});
