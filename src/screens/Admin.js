import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebaseGet, objectToArray } from '../../firebase.config';

const { width } = Dimensions.get('window');

const menuItems = [
  { icon: 'people-outline', label: 'Add Employee', screen: 'Addemp', color: ['#4facfe', '#00f2fe'] },
  { icon: 'list-outline', label: 'Show Employees', screen: 'Showemp', color: ['#667eea', '#764ba2'] },
  { icon: 'calendar-outline', label: 'Attendance', screen: 'AttendanceScreen', color: ['#43e97b', '#38f9d7'] },
  { icon: 'clipboard-outline', label: 'Leave Status', screen: 'LeaveStatus', color: ['#f953c6', '#b91d73'] },
  { icon: 'checkmark-done-outline', label: 'Manage Tasks', screen: 'TaskScreen', color: ['#30cfd0', '#330867'] },
  { icon: 'chatbubbles-outline', label: 'Team Chat', screen: 'ChatScreen', color: ['#667eea', '#764ba2'], params: { role: 'Admin' } },
  { icon: 'wallet-outline', label: 'Salary', screen: 'SalaryScreen', color: ['#c0392b', '#e74c3c'] },
  { icon: 'calendar', label: 'Holidays', screen: 'HolidayScreen', color: ['#ff6a00', '#ee0979'] },
  { icon: 'settings-outline', label: 'Settings', screen: 'SettingsScreen', color: ['#3c3b3f', '#605c3c'] },
  { icon: 'stats-chart-outline', label: 'Stats', screen: 'StatsScreen', color: ['#11998e', '#38ef7d'] },
  { icon: 'document-attach-outline', label: 'Documents', screen: 'DocumentsScreen', color: ['#8e44ad', '#c0392b'] },
  { icon: 'help-circle-outline', label: 'Help', screen: 'HelpScreen', color: ['#d35400', '#f39c12'] },
];

export default function Admin({ navigation }) {
  const [stats, setStats] = useState({ employees: 0, pending: 0, todayPresent: 0, tasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // 🔥 Fetch real stats from Firebase
      const [empData, leaveData, attData, taskData] = await Promise.all([
        firebaseGet('employees'),
        firebaseGet('leaves'),
        firebaseGet(`attendance/${new Date().toISOString().split('T')[0]}`),
        firebaseGet('tasks'),
      ]);
      const employees = objectToArray(empData).length;
      const pending = objectToArray(leaveData).filter(l => l.status === 'Pending').length;
      const todayPresent = objectToArray(attData).length;
      const tasks = objectToArray(taskData).filter(t => t.status === 'Pending').length;
      setStats({ employees, pending, todayPresent, tasks });
    } catch (e) { console.log('Stats error:', e); }
    finally { setLoading(false); }
  };

  const statCards = [
    { icon: 'people', val: stats.employees, label: 'Employees', color: '#667eea', bg: '#ede9ff' },
    { icon: 'time', val: stats.pending, label: 'Pending Leaves', color: '#f953c6', bg: '#ffe6f8' },
    { icon: 'checkmark-circle', val: stats.todayPresent, label: 'Present Today', color: '#11998e', bg: '#e0faf1' },
    { icon: 'list-circle', val: stats.tasks, label: 'Open Tasks', color: '#ff6a00', bg: '#fff2e6' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Welcome, Admin 👋</Text>
          <Text style={styles.subGreeting}>WorkWise Dashboard</Text>
        </View>
        <TouchableOpacity onPress={loadStats} style={styles.refreshBtn}>
          <Icon name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.logoutBtn}>
          <Icon name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          {loading ? <ActivityIndicator size="large" color="#667eea" style={{ padding: 20 }} /> :
            statCards.map((s, i) => (
              <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
                <View style={[styles.statIcon, { backgroundColor: s.color }]}>
                  <Icon name={s.icon} size={22} color="#fff" />
                </View>
                <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))
          }
        </View>

        {/* Firebase Live Badge */}
        <View style={styles.firebaseBadge}>
          <Icon name="cloud-done-outline" size={16} color="#27ae60" />
          <Text style={styles.firebaseText}>🔥 Connected to Firebase Realtime Database</Text>
        </View>

        {/* Menu */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuCard} onPress={() => navigation.navigate(item.screen, item.params)} activeOpacity={0.85}>
              <LinearGradient colors={item.color} style={styles.menuIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Icon name={item.icon} size={26} color="#fff" />
              </LinearGradient>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  refreshBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  logoutBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: { width: (width - 44) / 2, borderRadius: 18, padding: 16, alignItems: 'flex-start' },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statVal: { fontSize: 28, fontWeight: '900' },
  statLabel: { fontSize: 12, color: '#636e72', marginTop: 4 },
  firebaseBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f8f0', marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8, marginBottom: 4 },
  firebaseText: { fontSize: 13, color: '#27ae60', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2d3436', paddingHorizontal: 16, marginTop: 8, marginBottom: 12 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, paddingBottom: 30 },
  menuCard: { width: (width - 44) / 2, backgroundColor: '#fff', borderRadius: 18, padding: 18, alignItems: 'center', elevation: 3 },
  menuIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  menuLabel: { fontSize: 13, fontWeight: '600', color: '#2d3436', textAlign: 'center' },
});
