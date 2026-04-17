// CalendarScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(today);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    markWeekends();
  }, []);

  useEffect(() => {
    markWeekends(selected);
  }, [selected]);

  const markWeekends = (selectedDate = today) => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let marks = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dayOfWeek = d.getDay(); // 0=Sunday, 6=Saturday
      const formatted = d.toISOString().split('T')[0];

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        marks[formatted] = {
          marked: true,
          dotColor: '#e74c3c', // red dot for weekend
        };
      }
    }

    // Mark selected date specially
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: '#6c5ce7',
      selectedTextColor: '#fff',
    };

    setMarkedDates(marks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 My Calendar</Text>
      <Calendar
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffeaa7',
          calendarBackground: '#ffeaa7',
          textSectionTitleColor: '#2d3436',
          dayTextColor: '#2d3436',
          todayTextColor: '#d63031',
          selectedDayTextColor: '#fff',
          monthTextColor: '#2d3436',
          arrowColor: '#6c5ce7',
          dotColor: '#d63031',
        }}
      />
      <Text style={styles.info}>Selected Date: {selected}</Text>
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffeaa7',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2d3436',
  },
  info: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#2d3436',
  },
});
