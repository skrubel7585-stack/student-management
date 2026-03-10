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

interface ScheduleEvent {
  id: string;
  studentName: string;
  studentId: string;
  topic: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  type: 'lesson' | 'meeting' | 'assessment';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const ScheduleScreen = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  // Mock schedule data
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      studentName: 'Emma Parent',
      studentId: '101',
      topic: 'Quadratic Equations',
      subject: 'Mathematics',
      date: '2024-03-15',
      time: '10:00 AM',
      duration: 60,
      type: 'lesson',
      status: 'scheduled',
    },
    {
      id: '2',
      studentName: 'James Parent',
      studentId: '102',
      topic: 'Parent-Teacher Meeting',
      subject: 'General',
      date: '2024-03-15',
      time: '2:00 PM',
      duration: 30,
      type: 'meeting',
      status: 'scheduled',
    },
    {
      id: '3',
      studentName: 'Emma Parent',
      studentId: '101',
      topic: 'Progress Assessment',
      subject: 'Mathematics',
      date: '2024-03-16',
      time: '11:30 AM',
      duration: 45,
      type: 'assessment',
      status: 'scheduled',
    },
    {
      id: '4',
      studentName: 'James Parent',
      studentId: '102',
      topic: 'Newton\'s Laws',
      subject: 'Physics',
      date: '2024-03-17',
      time: '9:00 AM',
      duration: 60,
      type: 'lesson',
      status: 'scheduled',
    },
    {
      id: '5',
      studentName: 'Emma Parent',
      studentId: '101',
      topic: 'Essay Structure',
      subject: 'English',
      date: '2024-03-14',
      time: '1:00 PM',
      duration: 60,
      type: 'lesson',
      status: 'completed',
    },
  ]);

  useEffect(() => {
    loadSchedule();
    generateCurrentWeek();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load schedule');
      setLoading(false);
    }
  };

  const generateCurrentWeek = () => {
    const week: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      week.push(day);
    }
    setCurrentWeek(week);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short',
    });
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'lesson': return 'book';
      case 'meeting': return 'people';
      case 'assessment': return 'clipboard';
      default: return 'calendar';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'lesson': return '#007AFF';
      case 'meeting': return '#FF9500';
      case 'assessment': return '#5856D6';
      default: return '#34C759';
    }
  };

  const renderEventCard = ({ item }: { item: ScheduleEvent }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedEvent(item);
        setShowEventModal(true);
      }}
    >
      <Card style={styles.eventCard}>
        <View style={styles.eventTime}>
          <Text style={styles.eventTimeText}>{item.time}</Text>
          <Text style={styles.eventDuration}>{item.duration} min</Text>
        </View>
        <View style={[styles.eventTypeIndicator, { backgroundColor: getEventColor(item.type) }]} />
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <View style={[styles.eventTypeBadge, { backgroundColor: getEventColor(item.type) + '20' }]}>
              <AppIcon name={getEventIcon(item.type)} size={14} color={getEventColor(item.type)} />
              <Text style={[styles.eventTypeText, { color: getEventColor(item.type) }]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
            </View>
            <View style={[styles.statusBadge, { 
              backgroundColor: item.status === 'scheduled' ? '#007AFF20' : '#34C75920' 
            }]}>
              <Text style={[styles.statusText, { 
                color: item.status === 'scheduled' ? '#007AFF' : '#34C759' 
              }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.eventTopic}>{item.topic}</Text>
          
          <View style={styles.eventDetails}>
            <View style={styles.eventDetailItem}>
              <AppIcon name="person" size={16} color="#666" />
              <Text style={styles.eventDetailText}>{item.studentName}</Text>
            </View>
            <View style={styles.eventDetailItem}>
              <AppIcon name="book" size={16} color="#666" />
              <Text style={styles.eventDetailText}>{item.subject}</Text>
            </View>
          </View>
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
        <View>
          <Text style={styles.title}>Schedule</Text>
          <Text style={styles.subtitle}>Manage your sessions</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <AppIcon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Week Calendar */}
      <View style={styles.weekContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {currentWeek.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCard,
                  isToday && styles.todayCard,
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text style={[styles.dayName, isToday && styles.todayText]}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                  {day.getDate()}
                </Text>
                {dayEvents.length > 0 && (
                  <View style={styles.eventDotContainer}>
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <View key={i} style={styles.eventDot} />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Schedule Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {events.filter(e => e.status === 'scheduled').length}
          </Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {events.filter(e => e.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {events.reduce((acc, e) => acc + e.duration, 0)}min
          </Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </Card>
      </View>

      {/* Events List */}
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>
          Events for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getEventsForDate(selectedDate)}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppIcon name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No events scheduled for this day</Text>
            <Button
              title="Schedule New Event"
              onPress={() => {}}
              style={styles.emptyButton}
            />
          </View>
        }
      />

      {/* Event Details Modal */}
      <Modal
        visible={showEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEventModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedEvent && (
              <>
                <View style={styles.modalHeader}>
                  <View style={[styles.modalIcon, { backgroundColor: getEventColor(selectedEvent.type) }]}>
                    <AppIcon name={getEventIcon(selectedEvent.type)} size={30} color="#fff" />
                  </View>
                  <TouchableOpacity onPress={() => setShowEventModal(false)}>
                    <AppIcon name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTitle}>{selectedEvent.topic}</Text>
                
                <View style={styles.modalDetails}>
                  <View style={styles.modalDetailRow}>
                    <AppIcon name="person" size={20} color="#666" />
                    <Text style={styles.modalDetailText}>{selectedEvent.studentName}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <AppIcon name="book" size={20} color="#666" />
                    <Text style={styles.modalDetailText}>{selectedEvent.subject}</Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <AppIcon name="calendar" size={20} color="#666" />
                    <Text style={styles.modalDetailText}>
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Text>
                  </View>
                  <View style={styles.modalDetailRow}>
                    <AppIcon name="time" size={20} color="#666" />
                    <Text style={styles.modalDetailText}>
                      {selectedEvent.time} ({selectedEvent.duration} minutes)
                    </Text>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title="Reschedule"
                    onPress={() => {}}
                    variant="outline"
                    style={styles.modalActionButton}
                  />
                  <Button
                    title="Join Session"
                    onPress={() => {}}
                    style={styles.modalActionButton}
                  />
                </View>

                {selectedEvent.status === 'completed' && (
                  <TouchableOpacity style={styles.viewRecording}>
                    <AppIcon name="play" size={20} color="#007AFF" />
                    <Text style={styles.viewRecordingText}>View Recording</Text>
                  </TouchableOpacity>
                )}
              </>
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
    backgroundColor: '#007AFF',
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
  weekContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayCard: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 70,
  },
  todayCard: {
    backgroundColor: '#007AFF',
  },
  dayName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  todayText: {
    color: '#fff',
  },
  eventDotContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#007AFF',
    marginHorizontal: 1,
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
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  eventCard: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  eventTime: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  eventTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  eventDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  eventTypeIndicator: {
    width: 4,
    height: '100%',
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  eventTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  eventDetails: {
    flexDirection: 'row',
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyButton: {
    minWidth: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  modalActionButton: {
    flex: 1,
  },
  viewRecording: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewRecordingText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
});