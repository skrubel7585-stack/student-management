import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParentStackParamList } from '../../navigation/types';
import { Card } from '../../components/Card';
import { AppIcon } from '../../components/AppIcon';

type StudentLessonsScreenNavigationProp = StackNavigationProp<ParentStackParamList, 'StudentLessons'>;
type StudentLessonsScreenRouteProp = {
  key: string;
  name: string;
  params: {
    studentId: string;
    studentName: string;
  };
};

export const StudentLessonsScreen = () => {
  const navigation = useNavigation<StudentLessonsScreenNavigationProp>();
  const route = useRoute<StudentLessonsScreenRouteProp>();
  const { studentName } = route.params;

  const subjects = [
    { name: 'Mathematics', icon: 'calculator', color: '#FF9500', progress: 75 },
    { name: 'Physics', icon: 'flask', color: '#5856D6', progress: 60 },
    { name: 'English', icon: 'book', color: '#34C759', progress: 90 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.studentName}>{studentName}</Text>
        <Text style={styles.subtitle}>Learning Progress</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>75%</Text>
          <Text style={styles.statLabel}>Avg Progress</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Subjects</Text>
      {subjects.map((subject, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate('LessonsList')}
        >
          <Card style={styles.subjectCard}>
            <View style={styles.subjectHeader}>
              <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                <AppIcon name={subject.icon} size={24} color="#fff" />
              </View>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectProgress}>Progress: {subject.progress}%</Text>
              </View>
              <AppIcon name="chevron-forward" size={24} color="#666" />
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${subject.progress}%`, backgroundColor: subject.color }
                ]} 
              />
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 16,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  subjectCard: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subjectProgress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});