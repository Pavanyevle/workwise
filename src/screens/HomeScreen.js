import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUser } from '../utils/userStorage';

const { width } = Dimensions.get('window');

const menuItems = [
  { icon: 'calendar-outline', label: 'Attendance', screen: 'AttendanceScreen', color: ['#43e97b', '#38f9d7'] },
  { icon: 'clipboard-outline', label: 'Apply Leave', screen: 'LeaveApplication', color: ['#f953c6', '#b91d73'] },
  { icon: 'document-text-outline', label: 'Leave Status', screen: 'LeaveStatus', color: ['#667eea', '#764ba2'] },
  { icon: 'checkmark-done-outline', label: 'My Tasks', screen: 'TaskScreen', color: ['#30cfd0', '#330867'] },
  { icon: 'chatbubbles-outline', label: 'Team Chat', screen: 'ChatScreen', color: ['#11998e', '#38ef7d'], params: { role: 'Employee' } },
  { icon: 'wallet-outline', label: 'My Salary', screen: 'SalaryScreen', color: ['#c0392b', '#e74c3c'] },
  { icon: 'calendar', label: 'Holidays', screen: 'HolidayScreen', color: ['#ff6a00', '#ee0979'] },
  { icon: 'stats-chart-outline', label: 'My Stats', screen: 'StatsScreen', color: ['#4facfe', '#00f2fe'] },
  { icon: 'people-circle-outline', label: 'My Team', screen: 'MyTeamScreen', color: ['#1abc9c', '#2ecc71'] },
  { icon: 'document-attach-outline', label: 'Documents', screen: 'DocumentsScreen', color: ['#8e44ad', '#c0392b'] },
  { icon: 'settings-outline', label: 'Settings', screen: 'SettingsScreen', color: ['#3c3b3f', '#605c3c'] },
  { icon: 'help-circle-outline', label: 'Help / FAQ', screen: 'HelpScreen', color: ['#d35400', '#f39c12'] },
];

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(u => setUser(u));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Hello, {user?.name || 'Employee'} 👋</Text>
          <Text style={styles.subGreeting}>{user?.department || 'WorkWise'} • {user?.role || 'Employee'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.logoutBtn}>
          <Icon name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Firebase badge */}
      <View style={styles.badge}>
        <Icon name="cloud-done-outline" size={14} color="#27ae60" />
        <Text style={styles.badgeText}>🔥 Firebase Realtime Database Active</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate(item.screen, item.params)} activeOpacity={0.85}>
            <LinearGradient colors={item.color} style={styles.iconBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Icon name={item.icon} size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.cardLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '800', color: '#fff' },
  subGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  logoutBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f8f0', marginHorizontal: 16, marginTop: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  badgeText: { fontSize: 12, color: '#27ae60', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12, paddingBottom: 30 },
  card: { width: (width - 44) / 2, backgroundColor: '#fff', borderRadius: 20, padding: 18, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  iconBox: { width: 58, height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardLabel: { fontSize: 13, fontWeight: '600', color: '#2d3436', textAlign: 'center' },
});
