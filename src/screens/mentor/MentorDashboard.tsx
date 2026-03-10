import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MentorTabParamList, Student } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { mockApi } from '../../services/mockData';
import { useAuth } from '../../hooks/useAuth';
import { AppIcon, ICON_NAMES } from '../../components/AppIcon';

type MentorDashboardNavigationProp = StackNavigationProp<MentorTabParamList, 'MentorDashboard'>;

// Extended interfaces for mentor features
interface StudentProgress {
  studentId: string;
  overallProgress: number;
  completedSessions: number;
  totalSessions: number;
  lastActive: string;
  strengths: string[];
  weaknesses: string[];
}

interface UpcomingSession {
  id: string;
  studentName: string;
  studentId: string;
  topic: string;
  date: string;
  lessonName: string;
}

interface FeedbackRequest {
  id: string;
  studentId: string;
  studentName: string;
  sessionId: string;
  sessionTopic: string;
  requestedAt: string;
  status: 'pending' | 'submitted';
}

export const MentorDashboard = () => {
  const navigation = useNavigation<MentorDashboardNavigationProp>();
  const { user, getUserDisplayName } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'students' | 'sessions' | 'feedback' | 'analytics'>('students');
  
  // Extended mentor data
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([]);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    activeStudents: 0,
    sessionsThisWeek: 0,
    averageProgress: 0,
    pendingFeedback: 0,
    completionRate: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadStudents(),
        loadUpcomingSessions(),
        loadFeedbackRequests(),
        loadAnalytics(),
        loadStudentProgress(),
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const loadStudents = async () => {
    const data = await mockApi.getMentorStudents(user?.id || '3');
    setStudents(data);
  };

  const loadStudentProgress = async () => {
    // Mock student progress data
    const progress: StudentProgress[] = students.map(student => ({
      studentId: student.id,
      overallProgress: Math.floor(Math.random() * 40) + 60, // 60-100%
      completedSessions: Math.floor(Math.random() * 10) + 5,
      totalSessions: 15,
      lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      strengths: ['Algebra', 'Reading Comprehension', 'Problem Solving'].slice(0, Math.floor(Math.random() * 3) + 1),
      weaknesses: ['Geometry', 'Grammar', 'Physics'].slice(0, Math.floor(Math.random() * 3) + 1),
    }));
    setStudentProgress(progress);
  };

  const loadUpcomingSessions = async () => {
    // Mock upcoming sessions
    const sessions: UpcomingSession[] = [
      {
        id: '1',
        studentName: 'Emma Parent',
        studentId: '101',
        topic: 'Quadratic Equations',
        date: new Date(Date.now() + 86400000).toISOString(),
        lessonName: 'Mathematics',
      },
      {
        id: '2',
        studentName: 'James Parent',
        studentId: '102',
        topic: 'Newton\'s Laws',
        date: new Date(Date.now() + 172800000).toISOString(),
        lessonName: 'Physics',
      },
      {
        id: '3',
        studentName: 'Emma Parent',
        studentId: '101',
        topic: 'Essay Structure',
        date: new Date(Date.now() + 259200000).toISOString(),
        lessonName: 'English',
      },
    ];
    setUpcomingSessions(sessions);
  };

  const loadFeedbackRequests = async () => {
    // Mock feedback requests
    const requests: FeedbackRequest[] = [
      {
        id: 'f1',
        studentId: '101',
        studentName: 'Emma Parent',
        sessionId: '301',
        sessionTopic: 'Algebra Basics',
        requestedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending',
      },
      {
        id: 'f2',
        studentId: '102',
        studentName: 'James Parent',
        sessionId: '303',
        sessionTopic: 'Newton\'s Laws',
        requestedAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'pending',
      },
    ];
    setFeedbackRequests(requests);
  };

  const loadAnalytics = async () => {
    setAnalytics({
      totalStudents: students.length,
      activeStudents: students.filter((_, i) => i % 2 === 0).length,
      sessionsThisWeek: upcomingSessions.length,
      averageProgress: 78,
      pendingFeedback: feedbackRequests.length,
      completionRate: 85,
    });
  };

  const handleSubmitFeedback = (requestId: string) => {
    Alert.alert(
      'Submit Feedback',
      'Would you like to submit feedback now?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            setFeedbackRequests(prev =>
              prev.map(req =>
                req.id === requestId ? { ...req, status: 'submitted' } : req
              )
            );
            Alert.alert('Success', 'Feedback submitted successfully');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    return date.toLocaleDateString();
  };

  // Header component for all tabs
  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{getUserDisplayName()}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <AppIcon name="person-circle" size={40} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'students' && styles.activeTab]}
          onPress={() => setSelectedTab('students')}
        >
          <AppIcon 
            name="people" 
            size={20} 
            color={selectedTab === 'students' ? '#5856D6' : '#999'} 
          />
          <Text style={[styles.tabText, selectedTab === 'students' && styles.activeTabText]}>
            Students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'sessions' && styles.activeTab]}
          onPress={() => setSelectedTab('sessions')}
        >
          <AppIcon 
            name="calendar" 
            size={20} 
            color={selectedTab === 'sessions' ? '#5856D6' : '#999'} 
          />
          <Text style={[styles.tabText, selectedTab === 'sessions' && styles.activeTabText]}>
            Sessions
          </Text>
          {upcomingSessions.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{upcomingSessions.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'feedback' && styles.activeTab]}
          onPress={() => setSelectedTab('feedback')}
        >
          <AppIcon 
            name="chatbubbles" 
            size={20} 
            color={selectedTab === 'feedback' ? '#5856D6' : '#999'} 
          />
          <Text style={[styles.tabText, selectedTab === 'feedback' && styles.activeTabText]}>
            Feedback
          </Text>
          {feedbackRequests.filter(r => r.status === 'pending').length > 0 && (
            <View style={[styles.badge, styles.dangerBadge]}>
              <Text style={styles.badgeText}>
                {feedbackRequests.filter(r => r.status === 'pending').length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'analytics' && styles.activeTab]}
          onPress={() => setSelectedTab('analytics')}
        >
          <AppIcon 
            name="stats-chart" 
            size={20} 
            color={selectedTab === 'analytics' ? '#5856D6' : '#999'} 
          />
          <Text style={[styles.tabText, selectedTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Students Tab - Using FlatList
  const renderStudentsTab = () => {
    // Combine student data with progress
    const studentData = students.map(student => ({
      ...student,
      progress: studentProgress.find(p => p.studentId === student.id),
    }));

    return (
      <FlatList
        data={studentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
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
                  <Text style={styles.studentEmail}>{item.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  const parentNavigation = navigation.getParent();
                  if (parentNavigation) {
                    parentNavigation.navigate('MentorStudentLessons', {
                      studentId: item.id,
                      studentName: `${item.name} ${item.surname}`,
                    });
                  }
                }}
              >
                <AppIcon name={ICON_NAMES.forward} size={24} color="#5856D6" />
              </TouchableOpacity>
            </View>

            {item.progress && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Overall Progress</Text>
                  <Text style={styles.progressPercentage}>{item.progress.overallProgress}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${item.progress.overallProgress}%` }
                    ]} 
                  />
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <AppIcon name="checkmark-circle" size={16} color="#34C759" />
                    <Text style={styles.statItemText}>
                      {item.progress.completedSessions}/{item.progress.totalSessions} Sessions
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <AppIcon name="time" size={16} color="#FF9500" />
                    <Text style={styles.statItemText}>
                      Last active: {new Date(item.progress.lastActive).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.strengthWeaknessRow}>
                  {item.progress.strengths.length > 0 && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagLabel}>Strengths:</Text>
                      {item.progress.strengths.map((strength, i) => (
                        <View key={i} style={[styles.tag, styles.strengthTag]}>
                          <Text style={styles.tagText}>{strength}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {item.progress.weaknesses.length > 0 && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagLabel}>Needs Improvement:</Text>
                      {item.progress.weaknesses.map((weakness, i) => (
                        <View key={i} style={[styles.tag, styles.weaknessTag]}>
                          <Text style={styles.tagText}>{weakness}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.studentActions}>
              <Button
                title="View Progress"
                onPress={() => {
                  const parentNavigation = navigation.getParent();
                  if (parentNavigation) {
                    parentNavigation.navigate('MentorStudentLessons', {
                      studentId: item.id,
                      studentName: `${item.name} ${item.surname}`,
                    });
                  }
                }}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title="Message"
                onPress={() => Alert.alert('Message', 'Messaging feature coming soon!')}
                variant="outline"
                style={styles.actionButton}
              />
            </View>
          </Card>
        )}
        ListHeaderComponent={
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{students.length}</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{analytics.activeStudents}</Text>
              <Text style={styles.statLabel}>Active This Week</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{analytics.averageProgress}%</Text>
              <Text style={styles.statLabel}>Avg Progress</Text>
            </Card>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  // Sessions Tab - Using FlatList
  const renderSessionsTab = () => (
    <FlatList
      data={upcomingSessions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionIcon}>
              <AppIcon name="calendar" size={24} color="#5856D6" />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTopic}>{item.topic}</Text>
              <Text style={styles.sessionStudent}>{item.studentName}</Text>
              <Text style={styles.sessionLesson}>{item.lessonName}</Text>
            </View>
            <View style={styles.sessionDate}>
              <Text style={styles.sessionDateText}>{formatDate(item.date)}</Text>
              <Text style={styles.sessionTime}>
                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
          <View style={styles.sessionActions}>
            <Button
              title="Prepare Materials"
              onPress={() => Alert.alert('Prepare', 'Material preparation coming soon!')}
              variant="outline"
            />
            <Button
              title="Reschedule"
              onPress={() => Alert.alert('Reschedule', 'Rescheduling coming soon!')}
              variant="outline"
            />
          </View>
        </Card>
      )}
      ListHeaderComponent={
        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
      }
      ListEmptyComponent={
        <Card style={styles.emptyCard}>
          <AppIcon name={ICON_NAMES.emptySessions} size={50} color="#ccc" />
          <Text style={styles.emptyText}>No upcoming sessions</Text>
        </Card>
      }
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );

  // Feedback Tab - Using FlatList
  const renderFeedbackTab = () => {
    const pendingFeedback = feedbackRequests.filter(r => r.status === 'pending');
    const submittedFeedback = feedbackRequests.filter(r => r.status === 'submitted');
    
    // Combine all feedback items with a type indicator
    const allFeedback = [
      ...pendingFeedback.map(item => ({ ...item, type: 'pending' })),
      ...submittedFeedback.map(item => ({ ...item, type: 'submitted' }))
    ];

    return (
      <FlatList
        data={allFeedback}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          // Check if this is the first pending item or first submitted item
          const isFirstPending = item.type === 'pending' && 
            index === allFeedback.findIndex(i => i.type === 'pending');
          const isFirstSubmitted = item.type === 'submitted' && 
            index === allFeedback.findIndex(i => i.type === 'submitted');

          return (
            <>
              {isFirstPending && (
                <Text style={styles.sectionTitle}>Pending Feedback Requests</Text>
              )}
              {isFirstSubmitted && pendingFeedback.length > 0 && (
                <Text style={styles.sectionTitle}>Submitted Feedback</Text>
              )}
              
              <Card style={styles.feedbackCard}>
                {item.type === 'pending' ? (
                  // Pending feedback UI
                  <>
                    <View style={styles.feedbackHeader}>
                      <View style={styles.feedbackIcon}>
                        <AppIcon name="chatbubble" size={24} color="#FF9500" />
                      </View>
                      <View style={styles.feedbackInfo}>
                        <Text style={styles.feedbackStudent}>{item.studentName}</Text>
                        <Text style={styles.feedbackSession}>{item.sessionTopic}</Text>
                        <Text style={styles.feedbackDate}>
                          Requested: {new Date(item.requestedAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.feedbackActions}>
                      <Button
                        title="Submit Feedback"
                        onPress={() => handleSubmitFeedback(item.id)}
                        style={styles.feedbackButton}
                      />
                      <Button
                        title="View Session"
                        onPress={() => Alert.alert('View', 'Session details coming soon!')}
                        variant="outline"
                        style={styles.feedbackButton}
                      />
                    </View>
                  </>
                ) : (
                  // Submitted feedback UI
                  <View style={styles.feedbackHeader}>
                    <AppIcon name="checkmark-circle" size={24} color="#34C759" />
                    <View style={styles.feedbackInfo}>
                      <Text style={styles.feedbackStudent}>{item.studentName}</Text>
                      <Text style={styles.feedbackSession}>{item.sessionTopic}</Text>
                      <Text style={[styles.feedbackStatus, styles.submittedStatus]}>
                        ✓ Feedback Submitted
                      </Text>
                    </View>
                  </View>
                )}
              </Card>
            </>
          );
        }}
        ListEmptyComponent={
          <>
            <Text style={styles.sectionTitle}>Pending Feedback Requests</Text>
            <Card style={styles.emptyCard}>
              <AppIcon name="chatbubbles-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No pending feedback requests</Text>
            </Card>
            <Text style={styles.sectionTitle}>Submitted Feedback</Text>
            <Card style={styles.emptyCard}>
              <Text style={styles.emptySubtext}>No feedback submitted yet</Text>
            </Card>
          </>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  // Analytics Tab - Using FlatList with single item
  const renderAnalyticsTab = () => (
    <FlatList
      data={[1]} // Single item to render analytics content
      keyExtractor={() => 'analytics'}
      renderItem={() => (
        <>
          <View style={styles.analyticsGrid}>
            <Card style={styles.analyticsCard}>
              <AppIcon name="people" size={30} color="#5856D6" />
              <Text style={styles.analyticsNumber}>{analytics.totalStudents}</Text>
              <Text style={styles.analyticsLabel}>Total Students</Text>
            </Card>

            <Card style={styles.analyticsCard}>
              <AppIcon name="calendar" size={30} color="#FF9500" />
              <Text style={styles.analyticsNumber}>{analytics.sessionsThisWeek}</Text>
              <Text style={styles.analyticsLabel}>Sessions This Week</Text>
            </Card>

            <Card style={styles.analyticsCard}>
              <AppIcon name="trending-up" size={30} color="#34C759" />
              <Text style={styles.analyticsNumber}>{analytics.averageProgress}%</Text>
              <Text style={styles.analyticsLabel}>Avg Progress</Text>
            </Card>

            <Card style={styles.analyticsCard}>
              <AppIcon name="chatbubbles" size={30} color="#FF3B30" />
              <Text style={styles.analyticsNumber}>{analytics.pendingFeedback}</Text>
              <Text style={styles.analyticsLabel}>Pending Feedback</Text>
            </Card>
          </View>

          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Student Progress Distribution</Text>
            <View style={styles.progressDistribution}>
              <View style={styles.distributionItem}>
                <Text style={styles.distributionLabel}>0-50%</Text>
                <View style={styles.distributionBar}>
                  <View style={[styles.distributionFill, { width: '10%', backgroundColor: '#FF3B30' }]} />
                </View>
                <Text style={styles.distributionValue}>2</Text>
              </View>
              <View style={styles.distributionItem}>
                <Text style={styles.distributionLabel}>51-75%</Text>
                <View style={styles.distributionBar}>
                  <View style={[styles.distributionFill, { width: '40%', backgroundColor: '#FF9500' }]} />
                </View>
                <Text style={styles.distributionValue}>5</Text>
              </View>
              <View style={styles.distributionItem}>
                <Text style={styles.distributionLabel}>76-100%</Text>
                <View style={styles.distributionBar}>
                  <View style={[styles.distributionFill, { width: '50%', backgroundColor: '#34C759' }]} />
                </View>
                <Text style={styles.distributionValue}>6</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Session Completion Rate</Text>
            <View style={styles.completionContainer}>
              <View style={styles.completionCircle}>
                <Text style={styles.completionPercentage}>{analytics.completionRate}%</Text>
                <Text style={styles.completionLabel}>Completion Rate</Text>
              </View>
              <View style={styles.completionStats}>
                <View style={styles.completionStatItem}>
                  <Text style={styles.completionStatLabel}>Completed</Text>
                  <Text style={styles.completionStatValue}>42</Text>
                </View>
                <View style={styles.completionStatItem}>
                  <Text style={styles.completionStatLabel}>Missed</Text>
                  <Text style={styles.completionStatValue}>8</Text>
                </View>
                <View style={styles.completionStatItem}>
                  <Text style={styles.completionStatLabel}>Upcoming</Text>
                  <Text style={styles.completionStatValue}>15</Text>
                </View>
              </View>
            </View>
          </Card>

          <Card style={styles.recentActivityCard}>
            <Text style={styles.chartTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <AppIcon name="checkmark-circle" size={20} color="#34C759" />
              <Text style={styles.activityText}>Emma completed Algebra Basics</Text>
              <Text style={styles.activityTime}>2h ago</Text>
            </View>
            <View style={styles.activityItem}>
              <AppIcon name="chatbubble" size={20} color="#FF9500" />
              <Text style={styles.activityText}>James requested feedback</Text>
              <Text style={styles.activityTime}>5h ago</Text>
            </View>
            <View style={styles.activityItem}>
              <AppIcon name="calendar" size={20} color="#5856D6" />
              <Text style={styles.activityText}>New session scheduled with Emma</Text>
              <Text style={styles.activityTime}>1d ago</Text>
            </View>
          </Card>
        </>
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  // Main render - Use a single FlatList as the container
  return (
    <View style={styles.container}>
      <FlatList
        data={[1]} // Single item to render all content
        keyExtractor={() => 'main'}
        renderItem={() => (
          <>
            {renderHeader()}
            {selectedTab === 'students' && renderStudentsTab()}
            {selectedTab === 'sessions' && renderSessionsTab()}
            {selectedTab === 'feedback' && renderFeedbackTab()}
            {selectedTab === 'analytics' && renderAnalyticsTab()}
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Keep all your existing styles exactly as they were
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
  welcomeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#5856D6',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#5856D6',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: '#5856D6',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  dangerBadge: {
    backgroundColor: '#FF3B30',
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  statsGrid: {
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  studentCard: {
    marginBottom: 12,
  },
  studentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressTitle: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5856D6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5856D6',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItemText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  strengthWeaknessRow: {
    marginTop: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  tagLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  strengthTag: {
    backgroundColor: '#34C75920',
  },
  weaknessTag: {
    backgroundColor: '#FF3B3020',
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  studentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5856D620',
    justifyContent: 'center',
    alignItems: 'center',
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
  sessionStudent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  sessionLesson: {
    fontSize: 12,
    color: '#999',
  },
  sessionDate: {
    alignItems: 'flex-end',
  },
  sessionDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 12,
    color: '#666',
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackCard: {
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  feedbackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF950020',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  feedbackInfo: {
    flex: 1,
  },
  feedbackStudent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  feedbackSession: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#999',
  },
  feedbackStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  submittedStatus: {
    color: '#34C759',
  },
  feedbackActions: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 4,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  analyticsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  analyticsCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    alignItems: 'center',
  },
  analyticsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  progressDistribution: {
    gap: 12,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distributionLabel: {
    fontSize: 12,
    color: '#666',
    width: 50,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionValue: {
    fontSize: 12,
    color: '#666',
    width: 20,
    textAlign: 'right',
  },
  completionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  completionCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5856D620',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5856D6',
  },
  completionLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  completionStats: {
    flex: 1,
    gap: 8,
  },
  completionStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completionStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  completionStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recentActivityCard: {
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});
