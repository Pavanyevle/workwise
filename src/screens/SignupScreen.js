import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebasePush, firebaseGet, objectToArray } from '../../firebase.config';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passRef = useRef();
  const confirmRef = useRef();
  const phoneRef = useRef();
  const deptRef = useRef();

  const onSignup = async () => {
    if (!name || !email || !password || !confirm || !phone || !department) {
      Alert.alert('⚠️ Error', 'Please fill all fields'); return;
    }
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid Gmail address'); return;
    }
    if (!/^\d{10}$/.test(phone)) {
      Alert.alert('Invalid Phone', 'Phone must be 10 digits'); return;
    }
    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match'); return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Minimum 6 characters'); return;
    }

    setLoading(true);
    try {
      // 🔥 Check if email already exists in Firebase
      const data = await firebaseGet('employees');
      const existing = objectToArray(data);
      const duplicate = existing.find(e => e.email === email);
      if (duplicate) {
        Alert.alert('Already Registered', 'This email is already registered'); 
        setLoading(false); return;
      }

      // 🔥 Push new employee to Firebase Realtime Database
      const newEmployee = {
        name, email, password, phone, department,
        role: 'Employee', joinDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
      await firebasePush('employees', newEmployee);

      Alert.alert('✅ Success', 'Account created! Please login.', [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
      ]);
    } catch (err) {
      Alert.alert('Error', 'Signup failed. Check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#11998e']} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <View style={styles.logoBox}>
            <Icon name="person-add" size={40} color="#667eea" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join WorkWise today</Text>
        </View>

        {[
          { ref: null, icon: 'person-outline', placeholder: 'Full Name', value: name, onChange: setName, next: emailRef },
          { ref: emailRef, icon: 'mail-outline', placeholder: 'Gmail Address', value: email, onChange: setEmail, keyboard: 'email-address', next: phoneRef },
          { ref: phoneRef, icon: 'call-outline', placeholder: 'Phone Number (10 digits)', value: phone, onChange: setPhone, keyboard: 'numeric', next: deptRef },
          { ref: deptRef, icon: 'business-outline', placeholder: 'Department', value: department, onChange: setDepartment, next: passRef },
        ].map((field, i) => (
          <View key={i} style={styles.inputWrap}>
            <Icon name={field.icon} size={20} color="#fff" />
            <TextInput
              ref={field.ref}
              style={styles.input}
              placeholder={field.placeholder}
              placeholderTextColor="#ddd"
              value={field.value}
              onChangeText={field.onChange}
              keyboardType={field.keyboard || 'default'}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => field.next?.current?.focus()}
            />
          </View>
        ))}

        <View style={styles.inputWrap}>
          <Icon name="lock-closed-outline" size={20} color="#fff" />
          <TextInput ref={passRef} style={styles.input} placeholder="Password" placeholderTextColor="#ddd" value={password} onChangeText={setPassword} secureTextEntry={!showPass} returnKeyType="next" onSubmitEditing={() => confirmRef.current?.focus()} />
          <TouchableOpacity onPress={() => setShowPass(p => !p)}>
            <Icon name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrap}>
          <Icon name="shield-checkmark-outline" size={20} color="#fff" />
          <TextInput ref={confirmRef} style={styles.input} placeholder="Confirm Password" placeholderTextColor="#ddd" value={confirm} onChangeText={setConfirm} secureTextEntry={!showConfirm} returnKeyType="done" onSubmitEditing={onSignup} />
          <TouchableOpacity onPress={() => setShowConfirm(c => !c)}>
            <Icon name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={onSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>🚀 Sign Up</Text>}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
          <Text style={{ color: '#ddd', fontSize: 14 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Log In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, flexGrow: 1 },
  logoBox: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#eee', marginBottom: 28, textAlign: 'center' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingHorizontal: 14, marginBottom: 14, height: 52, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  input: { flex: 1, fontSize: 15, color: '#fff', paddingHorizontal: 10 },
  btn: { height: 54, backgroundColor: '#2563eb', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8, elevation: 6 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
