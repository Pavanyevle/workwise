import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, FlatList,
  Dimensions, StatusBar, Animated, TextInput, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { firebaseGet, firebasePush, firebaseUpdate, objectToArray } from '../../firebase.config';
import { getUser } from '../utils/userStorage';

const { width } = Dimensions.get('window');

export default function AttendanceScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [allAttendance, setAllAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isAdmin, setIsAdmin] = useState(false);
  const todayDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    loadUser();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentUser) loadAttendance();
  }, [currentUser]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(allAttendance.filter(r =>
      r.name?.toLowerCase().includes(q) || r.employeeId?.toLowerCase().includes(q)
    ));
  }, [search, allAttendance]);

  const loadUser = async () => {
    const user = await getUser();
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin' || user.email === 'admin@gmail.com');
    }
  };

  const loadAttendance = async () => {
    setLoading(true);
    try {
      // 🔥 Fetch today's attendance from Firebase
      const data = await firebaseGet(`attendance/${todayDate}`);
      const list = objectToArray(data);
      setAllAttendance(list);
      setFiltered(list);

      // Check my own status
      if (currentUser) {
        const mine = list.find(r => r.employeeId === currentUser.empId || r.employeeId === currentUser.id);
        if (mine) {
          setCheckedIn(true);
          setCheckInTime(mine.checkIn);
          if (mine.checkOut) { setCheckedOut(true); setCheckOutTime(mine.checkOut); }
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (checkedIn) { Alert.alert('Already Checked In', 'You already checked in today'); return; }
    setActionLoading(true);
    try {
      const time = moment().format('HH:mm:ss');
      const record = {
        employeeId: currentUser.empId || currentUser.id,
        name: currentUser.name,
        department: currentUser.department || '',
        checkIn: time,
        checkOut: null,
        date: todayDate,
        status: 'Present',
      };
      // 🔥 Push to Firebase: attendance/YYYY-MM-DD/
      await firebasePush(`attendance/${todayDate}`, record);
      setCheckedIn(true);
      setCheckInTime(time);
      await loadAttendance();
      Alert.alert('✅ Checked In', `Welcome! Time: ${time}`);
    } catch { Alert.alert('Error', 'Check-in failed'); }
    finally { setActionLoading(false); }
  };

  const handleCheckOut = async () => {
    if (!checkedIn) { Alert.alert('Not Checked In', 'Please check in first'); return; }
    if (checkedOut) { Alert.alert('Already Checked Out', 'You already checked out today'); return; }
    setActionLoading(true);
    try {
      const time = moment().format('HH:mm:ss');
      // Find my record
      const data = await firebaseGet(`attendance/${todayDate}`);
      const list = objectToArray(data);
      const mine = list.find(r => r.employeeId === (currentUser.empId || currentUser.id));
      if (mine) {
        // 🔥 Update record in Firebase
        await firebaseUpdate(`attendance/${todayDate}/${mine.id}`, { checkOut: time, status: 'Present' });
        setCheckedOut(true);
        setCheckOutTime(time);
        await loadAttendance();
        Alert.alert('✅ Checked Out', `See you tomorrow! Time: ${time}`);
      }
    } catch { Alert.alert('Error', 'Check-out failed'); }
    finally { setActionLoading(false); }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.rowAvatar}>
        <Text style={styles.rowInitials}>{item.name?.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowName}>{item.name}</Text>
        <Text style={styles.rowDept}>{item.department}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.rowTime}>🟢 {item.checkIn}</Text>
        {item.checkOut ? <Text style={styles.rowTime}>🔴 {item.checkOut}</Text> : <Text style={[styles.rowTime, { color: '#f39c12' }]}>⏳ Active</Text>}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
        <TouchableOpacity onPress={loadAttendance} style={styles.backBtn}>
          <Icon name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <Animated.ScrollView style={{ opacity: fadeAnim }} showsVerticalScrollIndicator={false}>
        {/* Clock */}
        <View style={styles.clockCard}>
          <Text style={styles.dateText}>{moment().format('dddd, MMMM Do YYYY')}</Text>
          <Text style={styles.clockText}>{moment(currentTime).format('HH:mm:ss')}</Text>
          {currentUser && <Text style={styles.userText}>👤 {currentUser.name}</Text>}
        </View>

        {/* Status */}
        <View style={styles.statusRow}>
          <View style={[styles.statusChip, { backgroundColor: checkedIn ? '#d5f5e3' : '#fde8e8' }]}>
            <Icon name={checkedIn ? 'checkmark-circle' : 'time-outline'} size={16} color={checkedIn ? '#27ae60' : '#e74c3c'} />
            <Text style={[styles.statusText, { color: checkedIn ? '#27ae60' : '#e74c3c' }]}>{checkedIn ? `In: ${checkInTime}` : 'Not Checked In'}</Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: checkedOut ? '#d5f5e3' : '#fef9e7' }]}>
            <Icon name={checkedOut ? 'checkmark-circle' : 'log-out-outline'} size={16} color={checkedOut ? '#27ae60' : '#f39c12'} />
            <Text style={[styles.statusText, { color: checkedOut ? '#27ae60' : '#f39c12' }]}>{checkedOut ? `Out: ${checkOutTime}` : 'Not Checked Out'}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.checkBtn, checkedIn && styles.disabledBtn]} onPress={handleCheckIn} disabled={checkedIn || actionLoading}>
            <LinearGradient colors={checkedIn ? ['#b2bec3', '#b2bec3'] : ['#11998e', '#38ef7d']} style={styles.checkBtnGrad}>
              {actionLoading && !checkedIn ? <ActivityIndicator color="#fff" /> : <>
                <Icon name="log-in-outline" size={22} color="#fff" />
                <Text style={styles.checkBtnText}>Check In</Text>
              </>}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.checkBtn, (checkedOut || !checkedIn) && styles.disabledBtn]} onPress={handleCheckOut} disabled={checkedOut || !checkedIn || actionLoading}>
            <LinearGradient colors={(checkedOut || !checkedIn) ? ['#b2bec3', '#b2bec3'] : ['#ee0979', '#ff6a00']} style={styles.checkBtnGrad}>
              {actionLoading && checkedIn && !checkedOut ? <ActivityIndicator color="#fff" /> : <>
                <Icon name="log-out-outline" size={22} color="#fff" />
                <Text style={styles.checkBtnText}>Check Out</Text>
              </>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Today's List */}
        <View style={styles.listCard}>
          <Text style={styles.listTitle}>📋 Today's Attendance ({allAttendance.length})</Text>
          <View style={styles.searchWrap}>
            <Icon name="search-outline" size={18} color="#667eea" />
            <TextInput style={styles.searchInput} placeholder="Search employee..." placeholderTextColor="#bbb" value={search} onChangeText={setSearch} />
          </View>
          {loading ? <ActivityIndicator size="small" color="#667eea" style={{ marginTop: 20 }} /> :
            filtered.length === 0 ? <Text style={styles.emptyText}>No attendance records yet</Text> :
              filtered.map((item, i) => <View key={i}>{renderItem({ item })}</View>)
          }
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  clockCard: { margin: 16, backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', elevation: 4 },
  dateText: { fontSize: 14, color: '#636e72', marginBottom: 6 },
  clockText: { fontSize: 40, fontWeight: '800', color: '#2d3436', letterSpacing: 2 },
  userText: { fontSize: 14, color: '#667eea', marginTop: 8, fontWeight: '600' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 16, marginBottom: 12, gap: 12 },
  statusChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 12, gap: 6 },
  statusText: { fontSize: 13, fontWeight: '600' },
  btnRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12, marginBottom: 16 },
  checkBtn: { flex: 1, borderRadius: 14, overflow: 'hidden', elevation: 4 },
  checkBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  checkBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disabledBtn: { opacity: 0.6 },
  listCard: { margin: 16, backgroundColor: '#fff', borderRadius: 20, padding: 16, elevation: 4 },
  listTitle: { fontSize: 16, fontWeight: '700', color: '#2d3436', marginBottom: 12 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9ff', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e8ecff', gap: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#333' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowInitials: { fontSize: 16, fontWeight: '700', color: '#fff' },
  rowName: { fontSize: 14, fontWeight: '600', color: '#2d3436' },
  rowDept: { fontSize: 12, color: '#636e72' },
  rowTime: { fontSize: 12, color: '#636e72' },
  emptyText: { textAlign: 'center', color: '#bbb', marginTop: 20, fontSize: 14 },
});
