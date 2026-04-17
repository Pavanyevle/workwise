import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  Alert, StatusBar, ActivityIndicator, Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebaseGet, firebasePush, firebaseUpdate, firebaseDelete, objectToArray } from '../../firebase.config';
import { getUser } from '../utils/userStorage';

const priorities = ['Low', 'Medium', 'High', 'Urgent'];
const priorityColors = { Low: '#27ae60', Medium: '#f39c12', High: '#e67e22', Urgent: '#e74c3c' };

export default function TaskScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadData();
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const user = await getUser();
    setCurrentUser(user);
    try {
      // 🔥 Fetch tasks from Firebase
      const data = await firebaseGet('tasks');
      const list = objectToArray(data);
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(list);
    } catch { Alert.alert('Error', 'Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const addTask = async () => {
    if (!task.trim()) { Alert.alert('⚠️ Error', 'Enter a task'); return; }
    setSaving(true);
    try {
      const newTask = {
        title: task.trim(),
        priority,
        status: 'Pending',
        createdBy: currentUser?.name || 'Admin',
        createdAt: new Date().toISOString(),
      };
      // 🔥 Push to Firebase
      await firebasePush('tasks', newTask);
      setTask('');
      await loadData();
    } catch { Alert.alert('Error', 'Failed to add task'); }
    finally { setSaving(false); }
  };

  const toggleStatus = async (item) => {
    const newStatus = item.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      // 🔥 Update task status in Firebase
      await firebaseUpdate(`tasks/${item.id}`, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === item.id ? { ...t, status: newStatus } : t));
    } catch { Alert.alert('Error', 'Update failed'); }
  };

  const deleteTask = (item) => {
    Alert.alert('Delete Task', `Delete "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            // 🔥 Delete from Firebase
            await firebaseDelete(`tasks/${item.id}`);
            setTasks(prev => prev.filter(t => t.id !== item.id));
          } catch { Alert.alert('Error', 'Delete failed'); }
        }
      }
    ]);
  };

  const renderTask = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.taskCard, item.status === 'Completed' && styles.completedCard]}>
        <TouchableOpacity onPress={() => toggleStatus(item)} style={styles.checkbox}>
          <Icon name={item.status === 'Completed' ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={item.status === 'Completed' ? '#27ae60' : '#b2bec3'} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, item.status === 'Completed' && styles.completedText]}>{item.title}</Text>
          <View style={styles.taskMeta}>
            <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] + '22' }]}>
              <Text style={[styles.priorityText, { color: priorityColors[item.priority] }]}>{item.priority}</Text>
            </View>
            <Text style={styles.taskBy}>by {item.createdBy}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => deleteTask(item)} style={styles.delBtn}>
          <Icon name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const pending = tasks.filter(t => t.status === 'Pending').length;
  const done = tasks.filter(t => t.status === 'Completed').length;

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#30cfd0" />
      <LinearGradient colors={['#30cfd0', '#330867']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Manager</Text>
        <TouchableOpacity onPress={loadData} style={styles.backBtn}>
          <Icon name="refresh" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statChip, { backgroundColor: '#fff3e0' }]}>
          <Text style={styles.statNum}>{pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: '#e8f8e8' }]}>
          <Text style={[styles.statNum, { color: '#27ae60' }]}>{done}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: '#e8ecff' }]}>
          <Text style={[styles.statNum, { color: '#667eea' }]}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Add Task */}
      <View style={styles.addCard}>
        <TextInput style={styles.taskInput} placeholder="Enter new task..." placeholderTextColor="#bbb" value={task} onChangeText={setTask} />
        <View style={styles.priorityRow}>
          {priorities.map(p => (
            <TouchableOpacity key={p} style={[styles.priBtn, priority === p && { backgroundColor: priorityColors[p] }]} onPress={() => setPriority(p)}>
              <Text style={[styles.priText, priority === p && { color: '#fff' }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.addBtn, saving && { opacity: 0.6 }]} onPress={addTask} disabled={saving}>
          <LinearGradient colors={['#30cfd0', '#330867']} style={styles.addBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {saving ? <ActivityIndicator color="#fff" size="small" /> : <>
              <Icon name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.addBtnText}>Add Task</Text>
            </>}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}><ActivityIndicator size="large" color="#30cfd0" /></View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.emptyBox}><Icon name="checkmark-done-circle-outline" size={60} color="#ccc" /><Text style={styles.emptyText}>No tasks yet</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 16, gap: 10 },
  statChip: { flex: 1, alignItems: 'center', borderRadius: 14, padding: 14, elevation: 2 },
  statNum: { fontSize: 24, fontWeight: '800', color: '#e67e22' },
  statLabel: { fontSize: 12, color: '#636e72', marginTop: 2 },
  addCard: { margin: 16, backgroundColor: '#fff', borderRadius: 18, padding: 16, elevation: 4 },
  taskInput: { backgroundColor: '#f8f9ff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#333', borderWidth: 1.5, borderColor: '#e8ecff', marginBottom: 12 },
  priorityRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  priBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, backgroundColor: '#f0f4ff', borderWidth: 1, borderColor: '#e8ecff' },
  priText: { fontSize: 12, fontWeight: '600', color: '#666' },
  addBtn: { borderRadius: 12, overflow: 'hidden' },
  addBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2, gap: 12 },
  completedCard: { opacity: 0.7, backgroundColor: '#f9f9f9' },
  checkbox: { width: 30, alignItems: 'center' },
  taskTitle: { fontSize: 15, fontWeight: '600', color: '#2d3436', marginBottom: 6 },
  completedText: { textDecorationLine: 'line-through', color: '#b2bec3' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  priorityBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  priorityText: { fontSize: 11, fontWeight: '700' },
  taskBy: { fontSize: 11, color: '#b2bec3' },
  delBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fde8e8', borderRadius: 10 },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyBox: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyText: { fontSize: 16, color: '#999' },
});
