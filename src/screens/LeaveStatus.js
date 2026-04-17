import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { firebaseGet, firebaseUpdate, objectToArray } from '../../firebase.config';
import { getUser } from '../utils/userStorage';

export default function LeaveStatus({ navigation }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const loadData = async () => {
    setLoading(true);
    const user = await getUser();
    setCurrentUser(user);
    const admin = user?.email === 'admin@gmail.com';
    setIsAdmin(admin);
    try {
      // 🔥 Fetch all leaves from Firebase
      const data = await firebaseGet('leaves');
      let list = objectToArray(data);
      // Employees see only their own leaves
      if (!admin && user) {
        list = list.filter(l => l.employeeId === (user.empId || user.id) || l.employeeName === user.name);
      }
      list.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      setLeaves(list);
    } catch { Alert.alert('Error', 'Failed to load leaves'); }
    finally { setLoading(false); }
  };

  const handleAction = async (leave, status) => {
    Alert.alert(`${status} Leave`, `${status} leave for ${leave.employeeName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm', onPress: async () => {
          try {
            // 🔥 Update leave status in Firebase
            await firebaseUpdate(`leaves/${leave.id}`, { status, reviewedAt: new Date().toISOString() });
            await loadData();
            Alert.alert('✅ Done', `Leave ${status.toLowerCase()}!`);
          } catch { Alert.alert('Error', 'Action failed'); }
        }
      }
    ]);
  };

  const statusColor = (s) => s === 'Approved' ? '#27ae60' : s === 'Rejected' ? '#e74c3c' : '#f39c12';
  const statusBg = (s) => s === 'Approved' ? '#d5f5e3' : s === 'Rejected' ? '#fde8e8' : '#fef9e7';
  const statusIcon = (s) => s === 'Approved' ? 'checkmark-circle' : s === 'Rejected' ? 'close-circle' : 'time-outline';

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.employeeName?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.empName}>{item.employeeName}</Text>
          <Text style={styles.empDept}>{item.department}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusBg(item.status) }]}>
          <Icon name={statusIcon(item.status)} size={14} color={statusColor(item.status)} />
          <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.detailChip}>
          <Icon name="bookmark-outline" size={14} color="#667eea" />
          <Text style={styles.detailText}>{item.leaveType}</Text>
        </View>
        <View style={styles.detailChip}>
          <Icon name="calendar-outline" size={14} color="#667eea" />
          <Text style={styles.detailText}>{item.fromDate} → {item.toDate}</Text>
        </View>
      </View>

      <Text style={styles.reason} numberOfLines={2}>💬 {item.reason}</Text>

      {isAdmin && item.status === 'Pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#d5f5e3' }]} onPress={() => handleAction(item, 'Approved')}>
            <Icon name="checkmark" size={18} color="#27ae60" />
            <Text style={[styles.actionText, { color: '#27ae60' }]}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#fde8e8' }]} onPress={() => handleAction(item, 'Rejected')}>
            <Icon name="close" size={18} color="#e74c3c" />
            <Text style={[styles.actionText, { color: '#e74c3c' }]}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#f953c6" />
      <LinearGradient colors={['#f953c6', '#b91d73']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Leave Status</Text>
          <Text style={styles.headerSub}>{leaves.length} records</Text>
        </View>
        <TouchableOpacity onPress={loadData} style={styles.backBtn}>
          <Icon name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingBox}><ActivityIndicator size="large" color="#f953c6" /><Text style={styles.loadingText}>Loading...</Text></View>
      ) : leaves.length === 0 ? (
        <View style={styles.emptyBox}>
          <Icon name="document-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No leave applications found</Text>
        </View>
      ) : (
        <FlatList
          data={leaves}
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f953c6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  empName: { fontSize: 15, fontWeight: '700', color: '#2d3436' },
  empDept: { fontSize: 12, color: '#636e72' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  detailRow: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  detailChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f4ff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, gap: 5 },
  detailText: { fontSize: 12, color: '#333' },
  reason: { fontSize: 13, color: '#636e72', marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, gap: 6 },
  actionText: { fontSize: 14, fontWeight: '700' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#f953c6', fontSize: 14 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 16, color: '#999' },
});
