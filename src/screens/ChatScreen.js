import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { firebaseGet, firebasePush, objectToArray } from '../../firebase.config';
import { getUser } from '../utils/userStorage';

export default function ChatScreen({ route, navigation }) {
  const { role } = route.params || { role: 'Employee' };
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const flatListRef = useRef();
  // Poll interval ref
  const pollRef = useRef();

  useEffect(() => {
    loadUser();
    loadMessages();
    // 🔥 Poll Firebase every 5 seconds for real-time feel
    pollRef.current = setInterval(loadMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, []);

  const loadUser = async () => {
    const user = await getUser();
    setCurrentUser(user);
  };

  const loadMessages = async () => {
    try {
      // 🔥 Fetch messages from Firebase Realtime Database
      const data = await firebaseGet('chats');
      const list = objectToArray(data);
      list.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(list);
    } catch (err) {
      console.log('Chat load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      const senderName = currentUser?.name || role;
      const msg = {
        sender: senderName,
        role: role,
        text: input.trim(),
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      // 🔥 Push message to Firebase
      await firebasePush('chats', msg);
      setInput('');
      await loadMessages();
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch { }
    finally { setSending(false); }
  };

  const myName = currentUser?.name || role;
  const renderItem = ({ item }) => {
    const isMe = item.sender === myName;
    return (
      <View style={[styles.msgWrap, isMe ? styles.myWrap : styles.otherWrap]}>
        {!isMe && <View style={styles.otherAvatar}><Text style={styles.otherAvatarText}>{item.sender?.charAt(0).toUpperCase()}</Text></View>}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
          {!isMe && <Text style={styles.senderName}>{item.sender}</Text>}
          <Text style={[styles.msgText, isMe && { color: '#fff' }]}>{item.text}</Text>
          <Text style={[styles.timeText, isMe && { color: 'rgba(255,255,255,0.7)' }]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f4ff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>💬 Team Chat</Text>
          <Text style={styles.headerSub}>{role} • Live</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        {loading ? (
          <View style={styles.loadingBox}><ActivityIndicator size="large" color="#667eea" /></View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Icon name="chatbubbles-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No messages yet. Start chatting!</Text>
              </View>
            }
          />
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.chatInput}
            placeholder="Type a message..."
            placeholderTextColor="#bbb"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} disabled={sending || !input.trim()} style={[styles.sendBtn, (!input.trim() || sending) && { opacity: 0.5 }]}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.sendBtnGrad}>
              {sending ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="send" size={20} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, gap: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ecc71' },
  liveText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  msgWrap: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  myWrap: { justifyContent: 'flex-end' },
  otherWrap: { justifyContent: 'flex-start', gap: 8 },
  otherAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#764ba2', justifyContent: 'center', alignItems: 'center' },
  otherAvatarText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 12 },
  myBubble: { backgroundColor: '#667eea', borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 2 },
  senderName: { fontSize: 11, fontWeight: '700', color: '#667eea', marginBottom: 4 },
  msgText: { fontSize: 15, color: '#2d3436' },
  timeText: { fontSize: 10, color: '#b2bec3', marginTop: 4, alignSelf: 'flex-end' },
  inputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: 10 },
  chatInput: { flex: 1, maxHeight: 100, fontSize: 15, color: '#333', backgroundColor: '#f8f9ff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#e8ecff' },
  sendBtn: { width: 44, height: 44 },
  sendBtnGrad: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center' },
});
