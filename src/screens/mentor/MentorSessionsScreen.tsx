import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppIcon } from '../../components/AppIcon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface MentorSession {
  id: string;
  studentName: string;
  studentId: string;
  topic: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  materials?: string[];
  notes?: string;
  recording?: string;
}

export const MentorSessionsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [selectedSession, setSelectedSession] = useState<MentorSession | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const filters = ['upcoming', 'completed', 'cancelled', 'all'];

  const [sessions, setSessions] = useState<MentorSession[]>([
    {
      id: '1',
      studentName: 'Emma Parent',
      studentId: '101',
      topic: 'Quadratic Equations',
      subject: 'Mathematics',
      date: '2024-03-15',
      time: '10:00 AM',
      duration: 60,
      status: 'scheduled',
      materials: ['Worksheet.pdf', 'Practice Problems.docx'],
    },
    {
      id: '2',
      studentName: 'James Parent',
      studentId: '102',
      topic: 'Newton\'s Laws',
      subject: 'Physics',
      date: '2024-03-15',
      time: '2:00 PM',
      duration: 45,
      status: 'scheduled',
      materials: ['Lab_Notes.pdf'],
    },
    {
      id: '3',
      studentName: 'Emma Parent',
      studentId: '101',
      topic: 'Essay Structure',
      subject: 'English',
      date: '2024-03-14',
      time: '11:00 AM',
      duration: 60,
      status: 'completed',
      notes: 'Student showed good progress in thesis development',
      recording: 'recording_123.mp4',
    },
    {
      id: '4',
      studentName: 'Olivia Parent',
      studentId: '103',
      topic: 'Algebra Basics',
      subject: 'Mathematics',
      date: '2024-03-13',
      time: '3:30 PM',
      duration: 60,
      status: 'completed',
      notes: 'Need to review multiplication tables',
    },
    {
      id: '5',
      studentName: 'James Parent',
      studentId: '102',
      topic: 'Work and Energy',
      subject: 'Physics',
      date: '2024-03-16',
      time: '9:00 AM',
      duration: 60,
      status: 'scheduled',
    },
  ]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load sessions');
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (selectedFilter === 'all') return true;
    return session.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#007AFF';
      case 'completed': return '#34C759';
      case 'cancelled': return '#FF3B30';
      default: return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderSessionCard = ({ item }: { item: MentorSession }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedSession(item);
        setShowSessionModal(true);
      }}
    >
      <Card style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />
          <View style={styles.sessionInfo}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.sessionTopic}>{item.topic}</Text>
            <Text style={styles.sessionSubject}>{item.subject}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
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
            <Text style={styles.datetimeText}>{item.time} • {item.duration} min</Text>
          </View>
        </View>

        {item.materials && item.materials.length > 0 && (
          <View style={styles.materialsContainer}>
            <AppIcon name="document" size={16} color="#666" />
            <Text style={styles.materialsText}>
              {item.materials.length} material(s) prepared
            </Text>
          </View>
        )}

        {item.status === 'scheduled' && (
          <View style={styles.actionButtons}>
            <Button
              title="Start Session"
              onPress={() => {}}
              size="small"
              style={styles.actionButton}
            />
            <Button
              title="Reschedule"
              onPress={() => {}}
              variant="outline"
              size="small"
              style={styles.actionButton}
            />
          </View>
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
        <View>
          <Text style={styles.title}>Sessions</Text>
          <Text style={styles.subtitle}>Manage your teaching sessions</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <AppIcon name="add" size={24} color="#fff" />
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

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{sessions.filter(s => s.status === 'scheduled').length}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{sessions.filter(s => s.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {sessions.reduce((acc, s) => acc + s.duration, 0)}min
          </Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </Card>
      </View>

      <FlatList
        data={filteredSessions}
        renderItem={renderSessionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppIcon name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No sessions found</Text>
          </View>
        }
      />

      {/* Session Details Modal */}
      <Modal
        visible={showSessionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSessionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedSession && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalStatusIcon, { backgroundColor: getStatusColor(selectedSession.status) }]}>
                    <AppIcon 
                      name={selectedSession.status === 'completed' ? 'checkmark' : 'calendar'} 
                      size={30} 
                      color="#fff" 
                    />
                  </View>
                  <TouchableOpacity onPress={() => setShowSessionModal(false)}>
                    <AppIcon name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTopic}>{selectedSession.topic}</Text>
                <Text style={styles.modalSubject}>{selectedSession.subject}</Text>

                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailRow}>
                    <AppIcon name="person" size={20} color="#666" />
                    <Text style={styles.modalDetailText}>{selectedSession.studentName}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <AppIcon name="calendar" size={20} color="#666" />
                    <Text style={styles.modalDetailText}>
                      {new Date(selectedSession.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <AppIcon name="time" size={20} color="#666" />
                    <Text style={styles.modalDetailText}>
                      {selectedSession.time} ({selectedSession.duration} minutes)
                    </Text>
                  </View>
                </View>

                {selectedSession.materials && selectedSession.materials.length > 0 && (
                  <Card style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Materials</Text>
                    {selectedSession.materials.map((material, index) => (
                      <TouchableOpacity key={index} style={styles.materialItem}>
                        <AppIcon name="document" size={20} color="#007AFF" />
                        <Text style={styles.materialText}>{material}</Text>
                        <AppIcon name="download" size={20} color="#666" />
                      </TouchableOpacity>
                    ))}
                  </Card>
                )}

                {selectedSession.notes && (
                  <Card style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Session Notes</Text>
                    <Text style={styles.modalNotes}>{selectedSession.notes}</Text>
                  </Card>
                )}

                {selectedSession.recording && (
                  <TouchableOpacity style={styles.recordingButton}>
                    <AppIcon name="play-circle" size={24} color="#007AFF" />
                    <Text style={styles.recordingText}>Watch Recording</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.modalActions}>
                  {selectedSession.status === 'scheduled' && (
                    <>
                      <Button
                        title="Start Session"
                        onPress={() => {}}
                        style={styles.modalActionButton}
                      />
                      <Button
                        title="Reschedule"
                        onPress={() => {}}
                        variant="outline"
                        style={styles.modalActionButton}
                      />
                    </>
                  )}
                  {selectedSession.status === 'completed' && (
                    <Button
                      title="Add Feedback"
                      onPress={() => {}}
                      style={styles.modalActionButton}
                    />
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: '#5856D6',
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
    padding: 16,
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
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  sessionTopic: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  sessionSubject: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
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
  materialsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  materialsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalStatusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTopic: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalSubject: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  modalDetails: {
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalDetailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  modalSection: {
    marginBottom: 16,
    padding: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  materialText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  modalNotes: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  recordingText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  modalActions: {
    marginTop: 10,
    marginBottom: 20,
  },
  modalActionButton: {
    marginBottom: 10,
  },
});