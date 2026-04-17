import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@uploaded_documents';

export default function DocumentsScreen() {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null); // Full-screen document

  // Load documents
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setDocs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load docs', e);
      }
    })();
  }, []);

  // Save documents
  const saveDocs = async (list) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save docs', e);
    }
  };

  // Pick image handler
  const handlePick = useCallback((type) => {
    const options = { mediaType: 'photo', quality: 1 };
    const picker = type === 'camera' ? launchCamera : launchImageLibrary;

    picker(options, (res) => {
      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Error', res.errorMessage || 'Something went wrong.');
        return;
      }

      const uri = res.assets?.[0]?.uri;
      if (uri) {
        const updated = [...docs, { id: Date.now().toString(), uri }];
        setDocs(updated);
        saveDocs(updated);
      }
    });
  }, [docs]);

  // Delete document
  const deleteDoc = (id) => {
    Alert.alert('Delete Document', 'Are you sure you want to delete this document?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = docs.filter((doc) => doc.id !== id);
          setDocs(updated);
          saveDocs(updated);
          setSelectedDoc(null); // Close modal if open
        },
      },
    ]);
  };

  // Render each document in grid
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => setSelectedDoc(item)} // Show full screen with object
    >
      <Image source={{ uri: item.uri }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📄 My Documents</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#27ae60' }]}
          onPress={() => handlePick('camera')}
        >
          <Text style={styles.btnText}>📷 Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: '#2980b9' }]}
          onPress={() => handlePick('gallery')}
        >
          <Text style={styles.btnText}>🖼 Gallery</Text>
        </TouchableOpacity>
      </View>

      {docs.length === 0 ? (
        <Text style={styles.empty}>No documents uploaded yet.</Text>
      ) : (
        <FlatList
          data={docs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Full Screen Image Modal */}
      <Modal visible={!!selectedDoc} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <Pressable style={styles.modalClose} onPress={() => setSelectedDoc(null)}>
            <Text style={styles.closeText}>✖</Text>
          </Pressable>

          {/* Delete Button */}
          {selectedDoc && (
            <Pressable
              style={styles.deleteBtn}
              onPress={() => deleteDoc(selectedDoc.id)}
            >
              <Text style={styles.deleteText}>🗑 Delete</Text>
            </Pressable>
          )}

          {selectedDoc && (
            <Image
              source={{ uri: selectedDoc.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecf0f1', padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  btn: { padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 20, color: '#7f8c8d' },
  list: { paddingBottom: 20 },
  item: { flex: 1, margin: 5, borderRadius: 8, overflow: 'hidden', backgroundColor: '#bdc3c7' },
  image: { width: '100%', height: 150 },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  closeText: { color: '#fff', fontSize: 18 },
  fullImage: { width: '100%', height: '80%' },

  // Delete button
  deleteBtn: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 2,
  },
  deleteText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
