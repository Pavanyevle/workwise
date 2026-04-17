import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, StatusBar, ActivityIndicator, ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebasePush } from '../../firebase.config';
import { getUser } from '../utils/userStorage';

const leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Emergency Leave', 'Maternity Leave', 'Work From Home'];

export default function LeaveApplication({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadUser(); }, []);
  const loadUser = async () => { const u = await getUser(); setCurrentUser(u); };

  const handleSubmit = async () => {
    if (!fromDate || !toDate || !reason.trim() || !leaveType) {
      Alert.alert('⚠️ Error', 'Please fill all fields and select leave type'); return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate) || !/^\d{4}-\d{2}-\d{2}$/.test(toDate)) {
      Alert.alert('Invalid Date', 'Use format YYYY-MM-DD'); return;
    }
    if (fromDate > toDate) {
      Alert.alert('Invalid Dates', 'From date must be before To date'); return;
    }
    setLoading(true);
    try {
      const leave = {
        employeeId: currentUser?.empId || currentUser?.id || 'unknown',
        employeeName: currentUser?.name || 'Employee',
        department: currentUser?.department || '',
        leaveType,
        fromDate,
        toDate,
        reason,
        status: 'Pending',
        appliedAt: new Date().toISOString(),
      };
      // 🔥 Push leave to Firebase
      await firebasePush('leaves', leave);
      Alert.alert('✅ Leave Applied', `Your ${leaveType} request has been submitted!`, [
        { text: 'OK', onPress: () => { setFromDate(''); setToDate(''); setReason(''); setLeaveType(''); } }
      ]);
    } catch { Alert.alert('Error', 'Failed to submit leave. Check internet.'); }
    finally { setLoading(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#f953c6" />
      <LinearGradient colors={['#f953c6', '#b91d73']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Application</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {currentUser && (
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitials}>{currentUser.name?.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userDept}>{currentUser.department}</Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📅 Leave Details</Text>

          <Text style={styles.label}>Leave Type *</Text>
          <View style={styles.typeGrid}>
            {leaveTypes.map(t => (
              <TouchableOpacity key={t} style={[styles.typeChip, leaveType === t && styles.typeChipActive]} onPress={() => setLeaveType(t)}>
                <Text style={[styles.typeText, leaveType === t && styles.typeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>From Date *</Text>
          <View style={styles.inputRow}>
            <Icon name="calendar-outline" size={18} color="#f953c6" />
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#bbb" value={fromDate} onChangeText={setFromDate} />
          </View>

          <Text style={styles.label}>To Date *</Text>
          <View style={styles.inputRow}>
            <Icon name="calendar-outline" size={18} color="#f953c6" />
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#bbb" value={toDate} onChangeText={setToDate} />
          </View>

          <Text style={styles.label}>Reason *</Text>
          <View style={[styles.inputRow, { alignItems: 'flex-start', paddingVertical: 12 }]}>
            <Icon name="document-text-outline" size={18} color="#f953c6" style={{ marginTop: 2 }} />
            <TextInput style={[styles.input, { height: 100, textAlignVertical: 'top' }]} placeholder="Describe your reason..." placeholderTextColor="#bbb" value={reason} onChangeText={setReason} multiline />
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
          <LinearGradient colors={['#f953c6', '#b91d73']} style={styles.submitGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {loading ? <ActivityIndicator color="#fff" /> : <>
              <Icon name="send-outline" size={20} color="#fff" />
              <Text style={styles.submitText}>Submit Leave Request</Text>
            </>}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  form: { padding: 16, paddingBottom: 40 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 16, elevation: 3, gap: 14 },
  userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f953c6', justifyContent: 'center', alignItems: 'center' },
  userInitials: { fontSize: 20, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 16, fontWeight: '700', color: '#2d3436' },
  userDept: { fontSize: 13, color: '#636e72' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 4, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#f953c6', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f4ff', borderWidth: 1.5, borderColor: '#e8ecff' },
  typeChipActive: { backgroundColor: '#f953c6', borderColor: '#f953c6' },
  typeText: { fontSize: 13, color: '#666', fontWeight: '500' },
  typeTextActive: { color: '#fff', fontWeight: '700' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9ff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1.5, borderColor: '#e8ecff', marginBottom: 14, gap: 10 },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: '#2d3436' },
  submitBtn: { borderRadius: 16, overflow: 'hidden', elevation: 6 },
  submitGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
