import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, Alert,
  TouchableOpacity, StatusBar, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebaseGet, firebasePush, objectToArray } from '../../firebase.config';
import { getUser } from '../utils/userStorage';

export default function SalaryScreen({ navigation }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [basic, setBasic] = useState('');
  const [hra, setHra] = useState('');
  const [bonus, setBonus] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');
  const [salaryList, setSalaryList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const user = await getUser();
    setIsAdmin(user?.email === 'admin@gmail.com');
    try {
      // 🔥 Load salaries from Firebase
      const salData = await firebaseGet('salaries');
      const salList = objectToArray(salData);
      // If employee, show only their salary
      if (user && user.email !== 'admin@gmail.com') {
        setSalaryList(salList.filter(s => s.employeeName === user.name || s.employeeId === (user.empId || user.id)));
      } else {
        setSalaryList(salList);
      }
      // 🔥 Load employees for picker
      const empData = await firebaseGet('employees');
      setEmployeeList(objectToArray(empData));
    } catch { Alert.alert('Error', 'Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!employeeName || !basic) {
      Alert.alert('⚠️ Error', 'Select employee and enter basic salary'); return;
    }
    setSaving(true);
    try {
      const b = parseFloat(basic) || 0;
      const h = parseFloat(hra) || 0;
      const bon = parseFloat(bonus) || 0;
      const gross = b + h + bon;
      const tds = gross * 0.1;
      const pf = b * 0.12;
      const net = gross - tds - pf;

      const record = {
        employeeName, department, year,
        basic: b, hra: h, bonus: bon,
        gross, tds, pf, net,
        createdAt: new Date().toISOString(),
      };
      // 🔥 Push to Firebase
      await firebasePush('salaries', record);
      Alert.alert('✅ Saved', `Salary saved for ${employeeName}`);
      setBasic(''); setHra(''); setBonus(''); setEmployeeName(''); setDepartment('');
      await loadData();
    } catch { Alert.alert('Error', 'Save failed'); }
    finally { setSaving(false); }
  };

  const gross = (parseFloat(basic) || 0) + (parseFloat(hra) || 0) + (parseFloat(bonus) || 0);
  const tds = gross * 0.1;
  const pf = (parseFloat(basic) || 0) * 0.12;
  const net = gross - tds - pf;

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#c0392b" />
      <LinearGradient colors={['#c0392b', '#e74c3c']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Salary Manager</Text>
        <TouchableOpacity onPress={loadData} style={styles.backBtn}>
          <Icon name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {isAdmin && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>➕ Add Salary Record</Text>

            <TouchableOpacity style={styles.empPicker} onPress={() => setShowPicker(true)}>
              <Icon name="person-outline" size={18} color="#c0392b" />
              <Text style={[styles.pickerText, !employeeName && { color: '#bbb' }]}>{employeeName || 'Select Employee'}</Text>
              <Icon name="chevron-down" size={18} color="#c0392b" />
            </TouchableOpacity>

            {[
              { label: 'Year', value: year, onChange: setYear, keyboard: 'numeric', icon: 'calendar-outline' },
              { label: 'Basic Salary (₹)', value: basic, onChange: setBasic, keyboard: 'numeric', icon: 'wallet-outline' },
              { label: 'HRA (₹)', value: hra, onChange: setHra, keyboard: 'numeric', icon: 'home-outline' },
              { label: 'Bonus (₹)', value: bonus, onChange: setBonus, keyboard: 'numeric', icon: 'gift-outline' },
            ].map((f, i) => (
              <View key={i} style={styles.inputRow}>
                <Icon name={f.icon} size={18} color="#c0392b" />
                <TextInput style={styles.input} placeholder={f.label} placeholderTextColor="#bbb" value={f.value} onChangeText={f.onChange} keyboardType={f.keyboard || 'default'} />
              </View>
            ))}

            {basic ? (
              <View style={styles.calcBox}>
                <Text style={styles.calcTitle}>💰 Calculation Preview</Text>
                {[
                  { label: 'Gross Salary', val: gross, color: '#27ae60' },
                  { label: 'TDS (10%)', val: -tds, color: '#e74c3c' },
                  { label: 'PF (12%)', val: -pf, color: '#e74c3c' },
                  { label: 'Net Salary', val: net, color: '#2980b9', bold: true },
                ].map((row, i) => (
                  <View key={i} style={styles.calcRow}>
                    <Text style={[styles.calcLabel, row.bold && { fontWeight: '800' }]}>{row.label}</Text>
                    <Text style={[styles.calcVal, { color: row.color }, row.bold && { fontWeight: '800', fontSize: 16 }]}>
                      {row.val >= 0 ? '₹' : '-₹'}{Math.abs(row.val).toFixed(0)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
              <LinearGradient colors={['#c0392b', '#e74c3c']} style={styles.saveBtnGrad}>
                {saving ? <ActivityIndicator color="#fff" /> : <>
                  <Icon name="save-outline" size={20} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Salary</Text>
                </>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Salary Records */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📋 Salary Records ({salaryList.length})</Text>
          {loading ? <ActivityIndicator size="small" color="#c0392b" /> :
            salaryList.length === 0 ? <Text style={styles.emptyText}>No records yet</Text> :
              salaryList.map((s, i) => (
                <View key={i} style={styles.salCard}>
                  <View style={styles.salHeader}>
                    <View style={styles.salAvatar}><Text style={styles.salInitial}>{s.employeeName?.charAt(0).toUpperCase()}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.salName}>{s.employeeName}</Text>
                      <Text style={styles.salDept}>{s.department} • {s.year}</Text>
                    </View>
                    <View style={styles.netBadge}><Text style={styles.netText}>₹{Math.round(s.net)}</Text></View>
                  </View>
                  <View style={styles.salDetails}>
                    <Text style={styles.salDetail}>Basic: ₹{s.basic}</Text>
                    <Text style={styles.salDetail}>HRA: ₹{s.hra}</Text>
                    <Text style={styles.salDetail}>Bonus: ₹{s.bonus}</Text>
                    <Text style={[styles.salDetail, { color: '#e74c3c' }]}>TDS: ₹{Math.round(s.tds)}</Text>
                  </View>
                </View>
              ))
          }
        </View>
      </ScrollView>

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Employee</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}><Icon name="close" size={24} color="#333" /></TouchableOpacity>
            </View>
            <FlatList
              data={employeeList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => { setEmployeeName(item.name); setDepartment(item.department || ''); setShowPicker(false); }}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: '#999' }}>{item.department}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  form: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 4, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#c0392b', marginBottom: 16 },
  empPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9ff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 14, borderWidth: 1.5, borderColor: '#e8ecff', marginBottom: 14, gap: 10 },
  pickerText: { flex: 1, fontSize: 15, color: '#2d3436' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9ff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1.5, borderColor: '#e8ecff', marginBottom: 12, gap: 10 },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: '#2d3436' },
  calcBox: { backgroundColor: '#f8f9ff', borderRadius: 14, padding: 16, marginBottom: 16 },
  calcTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 10 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  calcLabel: { fontSize: 14, color: '#636e72' },
  calcVal: { fontSize: 14, fontWeight: '600' },
  saveBtn: { borderRadius: 14, overflow: 'hidden' },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#bbb', fontSize: 14, paddingVertical: 20 },
  salCard: { backgroundColor: '#f8f9ff', borderRadius: 14, padding: 14, marginBottom: 10 },
  salHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
  salAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#c0392b', justifyContent: 'center', alignItems: 'center' },
  salInitial: { fontSize: 17, fontWeight: '800', color: '#fff' },
  salName: { fontSize: 15, fontWeight: '700', color: '#2d3436' },
  salDept: { fontSize: 12, color: '#636e72' },
  netBadge: { backgroundColor: '#d5f5e3', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  netText: { fontSize: 14, fontWeight: '800', color: '#27ae60' },
  salDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  salDetail: { fontSize: 12, color: '#636e72', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  modalItem: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  modalItemText: { fontSize: 15, color: '#333', fontWeight: '600' },
});
