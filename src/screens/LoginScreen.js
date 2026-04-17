import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { firebaseGet, objectToArray } from '../../firebase.config';
import { saveUser } from '../utils/userStorage';

const { height } = Dimensions.get('window');


// ✅ Input Field (Optimized)
const InputField = memo(({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  showPassword,
  togglePassword
}) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputIconContainer}>
      <Icon name={icon} size={20} color="#667eea" />
    </View>

    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize || 'none'}
    />

    {secureTextEntry !== undefined && (
      <TouchableOpacity onPress={togglePassword} style={styles.eyeIconContainer}>
        <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#667eea" />
      </TouchableOpacity>
    )}
  </View>
));


// ✅ MAIN COMPONENT
const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleAdminLogin = () => {
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      navigation.navigate('Admin', { user: 'Admin' });
    } else {
      Alert.alert('❌ Error', 'Invalid admin credentials');
    }
  };

  const handleEmployeeLogin = async () => {
    if (!email || !password) {
      Alert.alert('⚠️ Error', 'Enter email & password');
      return;
    }

    setLoading(true);
    try {
      const data = await firebaseGet('employees');
      const employees = objectToArray(data);

      const match = employees.find(
        emp => emp.email === email && emp.password === password
      );

      if (match) {
        await saveUser(match);
        navigation.navigate('HomeScreen', { user: match });
      } else {
        Alert.alert('❌ Error', 'Invalid employee credentials');
      }

    } catch (err) {
      Alert.alert('Error', 'Check internet connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      {/* 🔥 Gradient Background */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.backgroundGradient} />

      {/* 🔥 Floating Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >

          <Animated.View style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
          }}>

            {/* HEADER */}
            <View style={styles.headerSection}>
              <LinearGradient colors={['#fff', '#f8f9fa']} style={styles.logo}>
                <Icon name="shield-checkmark" size={40} color="#667eea" />
              </LinearGradient>
              <Text style={styles.heading}>WorkWise</Text>
              <Text style={styles.subheading}>Sign in to continue</Text>
            </View>

            {/* FORM */}
            <View style={styles.formContainer}>

              <InputField
                icon="mail-outline"
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <InputField
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />

              <View style={styles.buttonContainer}>

                <TouchableOpacity onPress={handleAdminLogin}>
                  <LinearGradient colors={['#667eea', '#764ba2']} style={styles.button}>
                    <Icon name="shield" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Login as Admin</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleEmployeeLogin} disabled={loading}>
                  <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.button}>
                    {loading
                      ? <ActivityIndicator color="#fff" />
                      : <>
                          <Icon name="person" size={18} color="#fff" />
                          <Text style={styles.buttonText}>Login as Employee</Text>
                        </>
                    }
                  </LinearGradient>
                </TouchableOpacity>

              </View>

            </View>

          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;


// ✅ STYLES (MATCHED DESIGN)
const styles = StyleSheet.create({
  container: { flex: 1 },

  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -50,
  },

  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 100,
    left: -40,
  },

  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: height * 0.3,
    right: 20,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },

  subheading: {
    color: 'rgba(255,255,255,0.8)',
  },

  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#e8ecff',
  },

  inputIconContainer: {
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
  },

  eyeIconContainer: {
    paddingHorizontal: 14,
  },

  buttonContainer: {
    marginTop: 10,
    gap: 12,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});