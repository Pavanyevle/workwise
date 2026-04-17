import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const AddEditEmployee = ({ route, navigation }) => {
  const { employee } = route.params || {};   // ❌ onSave REMOVE

  const [form, setForm] = useState({
    id: "",
    name: "",
    role: "",
    department: "",
    joinDate: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  // ✅ set all data ONCE only
  useEffect(() => {
    if (employee) {
      setForm(employee);
    }
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const { name, role, department, joinDate, phone, email, address } = form;

    if (!name || !role || !department || !joinDate || !phone || !email || !address) {
      Alert.alert("❗ Missing Info", "Please fill all fields");
      return;
    }

    const updatedEmployee = {
      ...form,
      id: form.id || Date.now().toString(),
    };

    console.log("Saved Data:", updatedEmployee); // ✅ debug

    Alert.alert("✅ Success", "Employee saved successfully");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"   // ✅ important
      >
        <Text style={styles.title}>
          {employee ? "✏️ Edit Employee" : "➕ Add Employee"}
        </Text>

        {renderInput("👤 Name", form.name, (v) => handleChange("name", v))}
        {renderInput("💼 Role", form.role, (v) => handleChange("role", v))}
        {renderInput("🏢 Department", form.department, (v) => handleChange("department", v))}
        {renderInput("📅 Join Date", form.joinDate, (v) => handleChange("joinDate", v))}
        {renderInput("📞 Phone", form.phone, (v) => handleChange("phone", v), "phone-pad")}
        {renderInput("📧 Email", form.email, (v) => handleChange("email", v), "email-address")}
        {renderInput("🏠 Address", form.address, (v) => handleChange("address", v), "default", true)}
        {renderInput("📝 Notes", form.notes, (v) => handleChange("notes", v), "default", true)}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>💾 Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


// ✅ SIMPLE INPUT (NO RE-RENDER ISSUE)
const renderInput = (label, value, onChange, keyboard = "default", multiline = false) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && { height: 80 }]}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboard}
      multiline={multiline}
      blurOnSubmit={false}
    />
  </View>
);

export default AddEditEmployee;


// ✅ STYLES
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  label: {
    marginBottom: 5,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});