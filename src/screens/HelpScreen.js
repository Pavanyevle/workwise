import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const faqs = [
  {
    question: 'How to change password?',
    answer: 'Go to Settings → Change Password.',
  },
  {
    question: 'How to contact support?',
    answer: 'Use the "Contact Support" button in the settings.',
  },
  {
    question: 'How to check my attendance or salary?',
    answer: 'Go to Dashboard → Attendance / Salary screens.',
  },
  {
    question: 'How to upload documents?',
    answer: 'Go to Documents screen and click on Upload.',
  },
];

const HelpScreen = () => {
  const [search, setSearch] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const contactSupport = () => {
    Linking.openURL('mailto:sonawanedipak2006@gmail.com?subject=Need Help&body=Hi, I need assistance with...');
  };

  const showEmergencyAlert = () => {
    Linking.openURL(
      'mailto:sonawanedipak2006@gmail.com?subject=Emergency Help Needed&body=This is an emergency request. Please respond ASAP.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🆘 Help & FAQ</Text>

      <TextInput
        style={styles.searchBox}
        placeholder="Search help topics..."
        value={search}
        onChangeText={setSearch}
      />

      {filteredFaqs.map((faq, index) => (
        <TouchableOpacity key={index} onPress={() => toggleExpand(index)} style={styles.faqCard}>
          <View style={styles.faqHeader}>
            <Ionicons name="help-circle-outline" size={22} color="#273c75" />
            <Text style={styles.question}>{faq.question}</Text>
            <Ionicons
              name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#718093"
            />
          </View>
          {expandedIndex === index && <Text style={styles.answer}>{faq.answer}</Text>}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.supportBtn} onPress={contactSupport}>
        <Ionicons name="mail-outline" size={20} color="#fff" />
        <Text style={styles.supportText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emergencyCard} onPress={showEmergencyAlert}>
        <Ionicons name="alert-circle" size={22} color="#fff" />
        <Text style={styles.emergencyText}>Emergency Help</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#130f40',
    marginBottom: 12,
  },
  searchBox: {
    backgroundColor: '#dcdde1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  question: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2f3640',
    fontWeight: '600',
  },
  answer: {
    marginTop: 8,
    fontSize: 14,
    color: '#718093',
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#487eb0',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  supportText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e84118',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    justifyContent: 'center',
  },
  emergencyText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
