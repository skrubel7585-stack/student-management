import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StudentStackParamList } from '../../navigation/types';
import { Card } from '../../components/Card';
import { AppIcon } from '../../components/AppIcon';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { mockApi } from '../../services/mockData';

type SessionsScreenNavigationProp = StackNavigationProp<StudentStackParamList, 'Sessions'>;

interface Session {
  id: string;
  topic: string;
  date: string;
  summary: string;
  lessonName: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  duration: number;
}

export const SessionsScreen = () => {
  const navigation = useNavigation<SessionsScreenNavigationProp>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('upcoming');

  const filters = ['upcoming', 'completed', 'all'];

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      // Mock sessions data
      const mockSessions: Session[] = [
        {
          id: '1',
          topic: 'Quadratic Equations',
          date: new Date(Date.now() + 86400000).toISOString(),
          summary: 'Solving quadratic equations using various methods',
          lessonName: 'Mathematics',
          status: 'upcoming',
          duration: 60,
        },
        {
          id: '2',
          topic: 'Newton\'s Laws',
          date: new Date(Date.now() + 172800000).toISOString(),
          summary: 'Applications of Newton\'s laws of motion',
          lessonName: 'Physics',
          status: 'upcoming',
          duration: 45,
        },
        {
          id: '3',
          topic: 'Essay Writing',
          date: new Date(Date.now() - 86400000).toISOString(),
          summary: 'Structuring and writing academic essays',
          lessonName: 'English',
          status: 'completed',
          duration: 60,
        },
        {
          id: '4',
          topic: 'Algebra Basics',
          date: new Date(Date.now() - 172800000).toISOString(),
          summary: 'Introduction to algebraic expressions',
          lessonName: 'Mathematics',
          status: 'completed',
          duration: 50,
        },
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (selectedFilter === 'all') return true;
    return session.status === selectedFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#007AFF';
      case 'completed': return '#34C759';
      case 'cancelled': return '#FF3B30';
      default: return '#666';
    }
  };

  const renderSessionCard = ({ item }: { item: Session }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('SessionDetail', {
        sessionId: item.id,
        sessionData: item,
      })}
    >
      <Card style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTopic}>{item.topic}</Text>
            <Text style={styles.lessonName}>{item.lessonName}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.datetimeContainer}>
          <View style={styles.datetimeItem}>
            <AppIcon name="calendar" size={16} color="#666" />
            <Text style={styles.datetimeText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.datetimeItem}>
            <AppIcon name="time" size={16} color="#666" />
            <Text style={styles.datetimeText}>
              {formatTime(item.date)} • {item.duration} min
            </Text>
          </View>
        </View>

        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>

        {item.status === 'upcoming' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <AppIcon name="notifications" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Remind me</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <AppIcon name="calendar" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Add to calendar</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'completed' && (
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>View Recording & Materials</Text>
            <AppIcon name="play" size={16} color="#007AFF" />
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Sessions</Text>
        <TouchableOpacity>
          <AppIcon name="options-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredSessions}
        renderItem={renderSessionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>
                {sessions.filter(s => s.status === 'upcoming').length}
              </Text>
              <Text style={styles.statLabel}>Upcoming</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>
                {sessions.filter(s => s.status === 'completed').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>
                {sessions.reduce((acc, s) => acc + s.duration, 0)}min
              </Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </Card>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppIcon name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No sessions found</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  listContainer: {
    padding: 16,
  },
  sessionCard: {
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  lessonName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  datetimeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  datetimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  datetimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reviewButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});