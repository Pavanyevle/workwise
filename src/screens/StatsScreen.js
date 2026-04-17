import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = () => {
  const [completion, setCompletion] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskData();
  }, []);

  const fetchTaskData = async () => {
    try {
      const user = auth().currentUser; // current logged-in employee
      if (!user) return;

      // ✅ फक्त त्या employee च्या task fetch करायच्या
      const snapshot = await firestore()
        .collection('tasks')
        .where('assignedTo', '==', user.uid)
        .where('approved', '==', true) // ✅ फक्त Admin ने allow केलेल्या
        .get();

      const tasks = snapshot.docs.map(doc => doc.data());

      const total = tasks.length;
      const done = tasks.filter(t => t.completed).length;
      const percent = total > 0 ? (done / total) * 100 : 0;

      setCompletion(percent.toFixed(1));
      setIncomplete((100 - percent).toFixed(1));
      setLoading(false);
    } catch (error) {
      console.log('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const chartData = [
    {
      name: 'Completed',
      population: parseFloat(completion),
      color: '#00b894',
      legendFontColor: '#2d3436',
      legendFontSize: 15,
    },
    {
      name: 'Incomplete',
      population: parseFloat(incomplete),
      color: '#d63031',
      legendFontColor: '#2d3436',
      legendFontSize: 15,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0984e3" />
        <Text>Fetching your task stats...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📈 Task Completion Stats</Text>
      <Text style={styles.percent}>✅ {completion}% Tasks Completed</Text>

      <PieChart
        data={chartData}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#ffeaa7',
          backgroundGradientTo: '#ffeaa7',
          color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffeaa7',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d3436',
  },
  percent: {
    fontSize: 18,
    marginBottom: 20,
    color: '#2d3436',
  },
});
