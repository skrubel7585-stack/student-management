import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { MentorStackParamList, MentorTabParamList } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppIcon } from '../../components/AppIcon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type MentorStudentsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MentorTabParamList, 'MentorStudents'>,
  StackNavigationProp<MentorStackParamList>
>;

interface Student {
  id: string;
  name: string;
  surname: string;
  email: string;
  age: number;
  progress: number;
  lastActive: string;
  sessionsCompleted: number;
  totalSessions: number;
  averageScore: number;
  status: 'active' | 'inactive' | 'at-risk';
}

export const MentorStudentsScreen = () => {
  const navigation = useNavigation<MentorStudentsScreenNavigationProp>();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['all', 'active', 'at-risk', 'inactive'];

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, selectedFilter, students]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, this would come from API
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Emma',
          surname: 'Parent',
          email: 'emma@student.com',
          age: 8,
          progress: 75,
          lastActive: '2 hours ago',
          sessionsCompleted: 12,
          totalSessions: 16,
          averageScore: 82,
          status: 'active',
        },
        {
          id: '2',
          name: 'James',
          surname: 'Parent',
          email: 'james@student.com',
          age: 6,
          progress: 45,
          lastActive: '1 day ago',
          sessionsCompleted: 7,
          totalSessions: 16,
          averageScore: 68,
          status: 'at-risk',
        },
        {
          id: '3',
          name: 'Olivia',
          surname: 'Parent',
          email: 'olivia@student.com',
          age: 10,
          progress: 90,
          lastActive: '5 hours ago',
          sessionsCompleted: 15,
          totalSessions: 16,
          averageScore: 94,
          status: 'active',
        },
        {
          id: '4',
          name: 'William',
          surname: 'Parent',
          email: 'william@student.com',
          age: 7,
          progress: 20,
          lastActive: '5 days ago',
          sessionsCompleted: 3,
          totalSessions: 16,
          averageScore: 55,
          status: 'inactive',
        },
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(student => 
        `${student.name} ${student.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(student => student.status === selectedFilter);
    }

    setFilteredStudents(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34C759';
      case 'at-risk': return '#FF9500';
      case 'inactive': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'checkmark-circle';
      case 'at-risk': return 'warning';
      case 'inactive': return 'remove-circle';
      default: return 'information-circle';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active': return styles.activeBadge;
      case 'at-risk': return styles.atRiskBadge;
      case 'inactive': return styles.inactiveBadge;
      default: return styles.defaultBadge;
    }
  };

  const calculateAge = (age: number) => {
    return `${age} years old`;
  };

  const renderStudentCard = ({ item }: { item: Student }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MentorStudentLessons', {
        studentId: item.id,
        studentName: `${item.name} ${item.surname}`,
      })}
      activeOpacity={0.7}
    >
      <Card style={styles.studentCard}>
        {/* Header with Avatar and Status */}
        <View style={styles.cardHeader}>
          <View style={styles.studentInfoRow}>
            <View style={[styles.avatar, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.avatarText}>
                {item.name[0]}{item.surname[0]}
              </Text>
            </View>
            <View style={styles.studentDetails}>
              <Text style={styles.studentName}>{item.name} {item.surname}</Text>
              <Text style={styles.studentEmail}>{item.email}</Text>
              <Text style={styles.studentAge}>{calculateAge(item.age)}</Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
            <AppIcon name={getStatusIcon(item.status)} size={12} color={getStatusColor(item.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={[styles.progressValue, { color: getStatusColor(item.status) }]}>
              {item.progress}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${item.progress}%`, backgroundColor: getStatusColor(item.status) }
              ]} 
            />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <AppIcon name="calendar" size={16} color="#666" />
            <Text style={styles.statLabel}>Sessions</Text>
            <Text style={styles.statValue}>{item.sessionsCompleted}/{item.totalSessions}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <AppIcon name="school" size={16} color="#666" />
            <Text style={styles.statLabel}>Avg Score</Text>
            <Text style={styles.statValue}>{item.averageScore}%</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <AppIcon name="time" size={16} color="#666" />
            <Text style={styles.statLabel}>Last Active</Text>
            <Text style={styles.statValue}>{item.lastActive}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="View Progress"
            onPress={() => navigation.navigate('MentorStudentLessons', {
              studentId: item.id,
              studentName: `${item.name} ${item.surname}`,
            })}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title="Message"
            onPress={() => Alert.alert('Message', 'Messaging feature coming soon!')}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <AppIcon name="people-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Students Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery 
          ? 'No students match your search criteria' 
          : selectedFilter !== 'all'
          ? `No ${selectedFilter} students at the moment`
          : 'You don\'t have any assigned students yet'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Students</Text>
          <Text style={styles.subtitle}>Track and manage student progress</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNumber}>{students.length}</Text>
            <Text style={styles.headerStatLabel}>Total</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNumber}>
              {students.filter(s => s.status === 'active').length}
            </Text>
            <Text style={styles.headerStatLabel}>Active</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <AppIcon name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <AppIcon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === item && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === item && styles.activeFilterChipText,
                ]}
              >
                {item === 'all' ? 'All Students' : 
                 item === 'at-risk' ? 'At Risk' : 
                 item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          Showing {filteredStudents.length} of {students.length} students
        </Text>
      </View>
    </>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredStudents}
        renderItem={renderStudentCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#5856D6',
    padding: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerStat: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStatLabel: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
    padding: 0,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  filterList: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilterChip: {
    backgroundColor: '#5856D6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 20,
  },
  studentCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  studentInfoRow: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  studentAge: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: '#34C75920',
  },
  atRiskBadge: {
    backgroundColor: '#FF950020',
  },
  inactiveBadge: {
    backgroundColor: '#FF3B3020',
  },
  defaultBadge: {
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: '#666',
  },
  progressValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});