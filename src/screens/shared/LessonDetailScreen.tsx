import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { mockApi } from '../../services/mockData';
import { Session } from '../../navigation/types';
import { SessionListItem } from '../../components/ListItem';
import Icon from 'react-native-vector-icons/Ionicons';

type LessonDetailScreenNavigationProp = StackNavigationProp<any>;
type LessonDetailScreenRouteProp = {
  key: string;
  name: string;
  params: {
    lessonId: string;
    lessonName: string;
  };
};

export const LessonDetailScreen = () => {
  const navigation = useNavigation<LessonDetailScreenNavigationProp>();
  const route = useRoute<LessonDetailScreenRouteProp>();
  const { lessonId, lessonName } = route.params;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: lessonName });
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getSessionsByLesson(lessonId);
      setSessions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

const renderSessionCard = ({ item }: { item: Session }) => (
  <SessionListItem
    topic={item.topic}
    date={item.date}
    summary={item.summary}
    status={new Date(item.date) > new Date() ? 'upcoming' : 'completed'}
    onPress={() => navigation.navigate('SessionDetail', {
      sessionId: item.id,
      sessionData: item,
    })}
  />
);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSessionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Sessions</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No sessions available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  sessionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewDetails: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
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
});