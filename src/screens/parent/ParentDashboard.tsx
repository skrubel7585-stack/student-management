import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParentStackParamList, Student } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppIcon } from '../../components/AppIcon';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { mockApi } from '../../services/mockData';
import { useAuth } from '../../hooks/useAuth';

// Use the correct type - we're in ParentStack, so use ParentStackParamList
type ParentDashboardNavigationProp = StackNavigationProp<ParentStackParamList, 'ParentTabs'>;

export const ParentDashboard = () => {
  const navigation = useNavigation<ParentDashboardNavigationProp>();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getStudents(user?.id || '1');
      setStudents(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // ✅ FIXED: Navigate directly to StudentLessons (it's in the same stack!)
  const handleStudentPress = (student: Student) => {
    navigation.navigate('StudentLessons', {
      studentId: student.id,
      studentName: `${student.name} ${student.surname}`,
    });
  };

  const renderStudentCard = ({ item }: { item: Student }) => (
    <TouchableOpacity onPress={() => handleStudentPress(item)}>
      <Card style={styles.studentCard}>
        <View style={styles.studentCardHeader}>
          <View style={styles.studentInfo}>
            <View style={styles.studentAvatar}>
              <Text style={styles.studentInitials}>
                {item.name[0]}{item.surname[0]}
              </Text>
            </View>
            <View>
              <Text style={styles.studentName}>{item.name} {item.surname}</Text>
              <Text style={styles.studentAge}>Age: {calculateAge(item.dateOfBirth)} years</Text>
            </View>
          </View>
          <AppIcon name="chevron-forward" size={24} color="#007AFF" />
        </View>
        <View style={styles.viewDetails}>
          <Text style={styles.viewDetailsText}>View Lessons & Progress</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
        <Text style={styles.sectionTitle}>My Children</Text>
      </View>

      <FlatList
        data={students}
        renderItem={renderStudentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppIcon name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No students yet</Text>
            <Text style={styles.emptySubtext}>
              Add your first student to get started
            </Text>
          </View>
        }
      />

      <Button
        title="Add New Student"
        onPress={() => navigation.navigate('CreateStudent')}
        style={styles.addButton}
      />
    </View>
  );
};

// ... (keep all your existing styles)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  studentCard: {
    marginBottom: 12,
  },
  studentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInitials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  viewDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  addButton: {
    margin: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});