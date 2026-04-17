import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, StatusBar, ActivityIndicator, Modal, FlatList,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebasePush, firebaseGet, objectToArray } from '../../firebase.config';

/* ---------- CONSTANTS ---------- */

const roles = ['Developer','Designer','Manager','Tester','HR','Intern','Team Lead','Project Manager','QA Engineer','Business Analyst','DevOps Engineer','UI/UX Designer','Full Stack Developer','Mobile App Developer','React Native Developer','Data Analyst','Data Scientist','Frontend Developer','Backend Developer','Software Engineer','Cloud Architect','System Administrator','Security Analyst'];

const departments = ['Engineering','Design','Marketing','Sales','HR','Support','IT','Finance','Operations','Research & Development','Customer Success','Administration','Product Management','Mobile Development','Web Development','Quality Assurance','Cloud Services','Cybersecurity','AI & ML','Data Science','DevOps','Legal','Training'];

/* ---------- FIELD COMPONENT (OPTIMIZED) ---------- */

const Field = React.memo(({ icon, label, value, onChange, inputRef, nextRef, keyboard, secure }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <Icon name={icon} size={18} color="#667eea" />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#bbb"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard || 'default'}
        secureTextEntry={secure}
        autoCapitalize="none"
        returnKeyType="next"
        blurOnSubmit={true}
        onSubmitEditing={() => nextRef?.current?.focus()}
      />
    </View>
  </View>
));

/* ---------- MAIN COMPONENT ---------- */

const Addemp = ({ navigation }) => {

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const dateRef = useRef();
  const addressRef = useRef();
  const salaryRef = useRef();

  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [deptModal, setDeptModal] = useState(false);

  const handleSave = async () => {
    if (!empId || !name || !role || !department || !email || !phone || !password) {
      Alert.alert('⚠️ Error', 'Please fill all required fields');
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid Gmail');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Invalid Phone', 'Phone must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      const data = await firebaseGet('employees');
      const existing = objectToArray(data);

      if (existing.find(e => e.empId === empId)) {
        Alert.alert('Duplicate', 'Employee ID already exists');
        setLoading(false);
        return;
      }

      const employee = {
        empId,
        name,
        role,
        department,
        joinDate: joinDate || new Date().toISOString().split('T')[0],
        phone,
        email,
        password,
        address: address || '',
        salary: salary || '0',
        createdAt: new Date().toISOString(),
      };

      await firebasePush('employees', employee);

      Alert.alert('✅ Success', `${name} added successfully!`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (err) {
      Alert.alert('Error', 'Failed to save. Check internet.');
    } finally {
      setLoading(false);
    }
  };

  const PickerModal = ({ visible, onClose, data, onSelect, title }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={data}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => { onSelect(item); onClose(); }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />

        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Employee</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={120}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🆔 Basic Info</Text>

            <Field icon="card-outline" label="Employee ID *" value={empId} onChange={setEmpId} nextRef={nameRef} />
            <Field icon="person-outline" label="Full Name *" value={name} onChange={setName} inputRef={nameRef} nextRef={emailRef} />
            <Field icon="mail-outline" label="Email *" value={email} onChange={setEmail} inputRef={emailRef} nextRef={passwordRef} keyboard="email-address" />
            <Field icon="lock-closed-outline" label="Password *" value={password} onChange={setPassword} inputRef={passwordRef} nextRef={phoneRef} secure />
            <Field icon="call-outline" label="Phone *" value={phone} onChange={setPhone} inputRef={phoneRef} nextRef={dateRef} keyboard="numeric" />
            <Field icon="calendar-outline" label="Join Date" value={joinDate} onChange={setJoinDate} inputRef={dateRef} nextRef={addressRef} />
            <Field icon="home-outline" label="Address" value={address} onChange={setAddress} inputRef={addressRef} nextRef={salaryRef} />
            <Field icon="wallet-outline" label="Salary (₹)" value={salary} onChange={setSalary} inputRef={salaryRef} keyboard="numeric" />

            <Text style={styles.sectionTitle}>🏢 Position</Text>

            <TouchableOpacity style={styles.pickerBtn} onPress={() => setRoleModal(true)}>
              <Icon name="briefcase-outline" size={18} color="#667eea" />
              <Text style={[styles.pickerText, !role && { color: '#bbb' }]}>
                {role || 'Select Role *'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pickerBtn} onPress={() => setDeptModal(true)}>
              <Icon name="business-outline" size={18} color="#667eea" />
              <Text style={[styles.pickerText, !department && { color: '#bbb' }]}>
                {department || 'Select Department *'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveBtnGrad}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Icon name="cloud-upload-outline" size={22} color="#fff" />
                  <Text style={styles.saveBtnText}>Save to Firebase</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </KeyboardAwareScrollView>

        <PickerModal visible={roleModal} onClose={() => setRoleModal(false)} data={roles} onSelect={setRole} title="Select Role" />
        <PickerModal visible={deptModal} onClose={() => setDeptModal(false)} data={departments} onSelect={setDepartment} title="Select Department" />

      </View>
    </KeyboardAvoidingView>
  );
};

export default Addemp; 

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  form: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 4, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#667eea', marginBottom: 12 },
  fieldWrap: { marginBottom: 14 },
  label: { fontSize: 13, color: '#666', marginBottom: 6, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9ff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1.5, borderColor: '#e8ecff' },
  input: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: 15, color: '#2d3436' },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9ff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 14, borderWidth: 1.5, borderColor: '#e8ecff', marginBottom: 14, gap: 10 },
  pickerText: { flex: 1, fontSize: 15, color: '#2d3436' },
  saveBtn: { borderRadius: 16, overflow: 'hidden', elevation: 6, marginBottom: 20 },
  saveBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  modalItem: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  modalItemText: { fontSize: 15, color: '#333' },
});