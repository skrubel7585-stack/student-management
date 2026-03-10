import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MentorStackParamList, Lesson, Session } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AppIcon, ICON_NAMES } from '../../components/AppIcon';
import { mockApi } from '../../services/mockData';

type MentorStudentLessonsScreenNavigationProp = StackNavigationProp<MentorStackParamList, 'MentorStudentLessons'>;
type MentorStudentLessonsScreenRouteProp = {
  key: string;
  name: string;
  params: {
    studentId: string;
    studentName: string;
  };
};

// Extended interfaces for advanced features
interface SubjectDetail {
  id: string;
  name: string;
  icon: string;
  color: string;
  progress: number;
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  lastSessionDate: string;
  nextSessionDate: string;
  strengths: string[];
  weaknesses: string[];
  upcomingTopics: string[];
}

interface SessionDetail extends Session {
  status: 'completed' | 'upcoming' | 'cancelled';
  score?: number;
  feedback?: string;
  materials?: string[];
  duration: number;
}

interface PerformanceMetrics {
  weeklyProgress: number[];
  monthlyProgress: number[];
  attendanceRate: number;
  completionRate: number;
  averageScore: number;
  totalTimeSpent: number;
  sessionsAttended: number;
  sessionsMissed: number;
}

export const MentorStudentLessonsScreen = () => {
  const navigation = useNavigation<MentorStudentLessonsScreenNavigationProp>();
  const route = useRoute<MentorStudentLessonsScreenRouteProp>();
  const { studentName, studentId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'subjects' | 'sessions' | 'analytics'>('overview');
  
  // State for advanced features
  const [subjects, setSubjects] = useState<SubjectDetail[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionDetail[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<SessionDetail[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    weeklyProgress: [65, 70, 68, 75, 80, 78, 82],
    monthlyProgress: [60, 65, 70, 75, 78, 80, 82, 85],
    attendanceRate: 92,
    completionRate: 88,
    averageScore: 78.5,
    totalTimeSpent: 1260, // in minutes
    sessionsAttended: 24,
    sessionsMissed: 2,
  });
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadSubjects(),
        loadSessions(),
        loadPerformanceMetrics(),
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudentData();
    setRefreshing(false);
  };

  const loadSubjects = async () => {
    // Mock detailed subject data
    const mockSubjects: SubjectDetail[] = [
      {
        id: '1',
        name: 'Mathematics',
        icon: 'calculator',
        color: '#FF9500',
        progress: 75,
        totalSessions: 20,
        completedSessions: 15,
        averageScore: 82,
        lastSessionDate: new Date(Date.now() - 86400000).toISOString(),
        nextSessionDate: new Date(Date.now() + 86400000).toISOString(),
        strengths: ['Algebra', 'Linear Equations', 'Problem Solving'],
        weaknesses: ['Geometry', 'Trigonometry'],
        upcomingTopics: ['Quadratic Equations', 'Polynomials', 'Calculus Basics'],
      },
      {
        id: '2',
        name: 'Physics',
        icon: 'flask',
        color: '#5856D6',
        progress: 60,
        totalSessions: 15,
        completedSessions: 9,
        averageScore: 75,
        lastSessionDate: new Date(Date.now() - 172800000).toISOString(),
        nextSessionDate: new Date(Date.now() + 172800000).toISOString(),
        strengths: ['Newton\'s Laws', 'Energy Conservation'],
        weaknesses: ['Quantum Mechanics', 'Thermodynamics'],
        upcomingTopics: ['Electromagnetism', 'Wave Optics', 'Modern Physics'],
      },
      {
        id: '3',
        name: 'English',
        icon: 'book',
        color: '#34C759',
        progress: 90,
        totalSessions: 18,
        completedSessions: 16,
        averageScore: 88,
        lastSessionDate: new Date(Date.now() - 43200000).toISOString(),
        nextSessionDate: new Date(Date.now() + 259200000).toISOString(),
        strengths: ['Grammar', 'Essay Writing', 'Reading Comprehension'],
        weaknesses: ['Poetry Analysis', 'Shakespeare'],
        upcomingTopics: ['Creative Writing', 'Literary Analysis', 'Presentation Skills'],
      },
    ];
    setSubjects(mockSubjects);
  };

  const loadSessions = async () => {
    // Mock session data
    const mockRecentSessions: SessionDetail[] = [
      {
        id: 's1',
        lessonId: '1',
        topic: 'Quadratic Equations',
        date: new Date(Date.now() - 86400000).toISOString(),
        summary: 'Introduction to quadratic equations and their solutions',
        status: 'completed',
        score: 85,
        feedback: 'Good understanding of the quadratic formula. Practice more word problems.',
        duration: 60,
      },
      {
        id: 's2',
        lessonId: '2',
        topic: 'Newton\'s Laws',
        date: new Date(Date.now() - 172800000).toISOString(),
        summary: 'Applications of Newton\'s three laws of motion',
        status: 'completed',
        score: 78,
        feedback: 'Solid grasp of laws, needs more practice with force diagrams.',
        duration: 55,
      },
      {
        id: 's3',
        lessonId: '3',
        topic: 'Essay Writing',
        date: new Date(Date.now() - 43200000).toISOString(),
        summary: 'Structuring academic essays and arguments',
        status: 'completed',
        score: 92,
        feedback: 'Excellent essay structure. Continue practicing thesis statements.',
        duration: 50,
      },
    ];

    const mockUpcomingSessions: SessionDetail[] = [
      {
        id: 'u1',
        lessonId: '1',
        topic: 'Polynomials',
        date: new Date(Date.now() + 86400000).toISOString(),
        summary: 'Advanced polynomial operations and factoring',
        status: 'upcoming',
        duration: 60,
      },
      {
        id: 'u2',
        lessonId: '2',
        topic: 'Work and Energy',
        date: new Date(Date.now() + 172800000).toISOString(),
        summary: 'Understanding work, kinetic and potential energy',
        status: 'upcoming',
        duration: 60,
      },
      {
        id: 'u3',
        lessonId: '1',
        topic: 'Calculus Basics',
        date: new Date(Date.now() + 259200000).toISOString(),
        summary: 'Introduction to limits and derivatives',
        status: 'upcoming',
        duration: 90,
      },
    ];

    setRecentSessions(mockRecentSessions);
    setUpcomingSessions(mockUpcomingSessions);
  };

  const loadPerformanceMetrics = async () => {
    // Already set in initial state
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderOverviewTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Performance Summary Cards */}
      <View style={styles.performanceGrid}>
        <Card style={styles.performanceCard}>
          <AppIcon name="trending-up" size={24} color="#34C759" />
          <Text style={styles.performanceValue}>{performanceMetrics.averageScore}%</Text>
          <Text style={styles.performanceLabel}>Avg Score</Text>
        </Card>
        <Card style={styles.performanceCard}>
          <AppIcon name="time" size={24} color="#5856D6" />
          <Text style={styles.performanceValue}>{formatTime(performanceMetrics.totalTimeSpent)}</Text>
          <Text style={styles.performanceLabel}>Total Time</Text>
        </Card>
        <Card style={styles.performanceCard}>
          <AppIcon name="checkmark-circle" size={24} color="#34C759" />
          <Text style={styles.performanceValue}>{performanceMetrics.attendanceRate}%</Text>
          <Text style={styles.performanceLabel}>Attendance</Text>
        </Card>
        <Card style={styles.performanceCard}>
          <AppIcon name="flag" size={24} color="#FF9500" />
          <Text style={styles.performanceValue}>{performanceMetrics.completionRate}%</Text>
          <Text style={styles.performanceLabel}>Completion</Text>
        </Card>
      </View>

      {/* Subject Overview */}
      <Text style={styles.sectionTitle}>Subject Overview</Text>
      {subjects.map(subject => (
        <TouchableOpacity
          key={subject.id}
          onPress={() => {
            setSelectedSubject(subject.id);
            setSelectedView('subjects');
          }}
        >
          <Card style={styles.subjectOverviewCard}>
            <View style={styles.subjectOverviewHeader}>
              <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                <AppIcon name={subject.icon} size={24} color="#fff" />
              </View>
              <View style={styles.subjectOverviewInfo}>
                <Text style={styles.subjectOverviewName}>{subject.name}</Text>
                <Text style={styles.subjectOverviewProgress}>
                  {subject.completedSessions}/{subject.totalSessions} sessions
                </Text>
              </View>
              <View style={styles.subjectOverviewScore}>
                <Text style={styles.subjectOverviewScoreText}>{subject.averageScore}%</Text>
                <AppIcon name="chevron-forward" size={20} color="#666" />
              </View>
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

      {/* Recent Sessions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        <TouchableOpacity onPress={() => setSelectedView('sessions')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {recentSessions.slice(0, 2).map(session => {
        const subject = subjects.find(s => s.id === session.lessonId);
        return (
          <Card key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={[styles.sessionIcon, { backgroundColor: subject?.color + '20' }]}>
                <AppIcon name="play" size={20} color={subject?.color} />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTopic}>{session.topic}</Text>
                <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
              </View>
              <View style={styles.sessionScore}>
                <Text style={[styles.sessionScoreText, { color: (session.score || 0) >= 80 ? '#34C759' : '#FF9500' }]}>
                  {session.score}%
                </Text>
              </View>
            </View>
            {session.feedback && (
              <Text style={styles.sessionFeedback} numberOfLines={2}>
                "{session.feedback}"
              </Text>
            )}
          </Card>
        );
      })}

      {/* Upcoming Sessions Preview */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        <TouchableOpacity onPress={() => setSelectedView('sessions')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {upcomingSessions.slice(0, 2).map(session => {
        const subject = subjects.find(s => s.id === session.lessonId);
        return (
          <Card key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={[styles.sessionIcon, { backgroundColor: subject?.color + '20' }]}>
                <AppIcon name="calendar" size={20} color={subject?.color} />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTopic}>{session.topic}</Text>
                <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
              </View>
              <Button
                title="Prepare"
                onPress={() => Alert.alert('Prepare', 'Material preparation coming soon!')}
                variant="outline"
                size="small"
              />
            </View>
          </Card>
        );
      })}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="Generate Progress Report"
          onPress={() => Alert.alert('Report', 'Generating progress report...')}
          style={styles.quickActionButton}
        />
        <Button
          title="Schedule Parent Meeting"
          onPress={() => Alert.alert('Schedule', 'Parent meeting scheduler coming soon!')}
          variant="outline"
          style={styles.quickActionButton}
        />
      </View>
    </ScrollView>
  );

  const renderSubjectsTab = () => (
    <FlatList
      data={subjects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={styles.subjectDetailCard}>
          <View style={styles.subjectDetailHeader}>
            <View style={[styles.subjectLargeIcon, { backgroundColor: item.color }]}>
              <AppIcon name={item.icon} size={32} color="#fff" />
            </View>
            <View style={styles.subjectDetailInfo}>
              <Text style={styles.subjectDetailName}>{item.name}</Text>
              <Text style={styles.subjectDetailProgress}>
                Overall Progress: {item.progress}%
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.subjectStatsGrid}>
            <View style={styles.subjectStatItem}>
              <Text style={styles.subjectStatValue}>{item.completedSessions}</Text>
              <Text style={styles.subjectStatLabel}>Completed</Text>
            </View>
            <View style={styles.subjectStatItem}>
              <Text style={styles.subjectStatValue}>{item.totalSessions}</Text>
              <Text style={styles.subjectStatLabel}>Total</Text>
            </View>
            <View style={styles.subjectStatItem}>
              <Text style={styles.subjectStatValue}>{item.averageScore}%</Text>
              <Text style={styles.subjectStatLabel}>Avg Score</Text>
            </View>
          </View>

          {/* Strengths */}
          <View style={styles.strengthSection}>
            <Text style={styles.sectionLabel}>Strengths</Text>
            <View style={styles.tagContainer}>
              {item.strengths.map((strength, i) => (
                <View key={i} style={[styles.tag, styles.strengthTag]}>
                  <AppIcon name="checkmark-circle" size={12} color="#34C759" />
                  <Text style={styles.tagText}>{strength}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Areas for Improvement */}
          <View style={styles.weaknessSection}>
            <Text style={styles.sectionLabel}>Needs Improvement</Text>
            <View style={styles.tagContainer}>
              {item.weaknesses.map((weakness, i) => (
                <View key={i} style={[styles.tag, styles.weaknessTag]}>
                  <AppIcon name="alert-circle" size={12} color="#FF3B30" />
                  <Text style={styles.tagText}>{weakness}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Upcoming Topics */}
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionLabel}>Upcoming Topics</Text>
            {item.upcomingTopics.map((topic, i) => (
              <View key={i} style={styles.topicItem}>
                <AppIcon name="arrow-forward" size={12} color="#666" />
                <Text style={styles.topicText}>{topic}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.subjectActions}>
            <Button
              title="View All Sessions"
              onPress={() => {
                setSelectedSubject(item.id);
                setSelectedView('sessions');
              }}
              variant="outline"
              style={styles.subjectActionButton}
            />
            <Button
              title="Add Notes"
              onPress={() => Alert.alert('Notes', 'Add notes feature coming soon!')}
              variant="outline"
              style={styles.subjectActionButton}
            />
          </View>
        </Card>
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderSessionsTab = () => {
    const allSessions = [...recentSessions, ...upcomingSessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
      <FlatList
        data={allSessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const subject = subjects.find(s => s.id === item.lessonId);
          const isUpcoming = item.status === 'upcoming';
          
          return (
            <Card style={styles.detailedSessionCard}>
              <View style={styles.detailedSessionHeader}>
                <View style={[styles.detailedSessionIcon, { backgroundColor: subject?.color + '20' }]}>
                  <AppIcon 
                    name={isUpcoming ? 'calendar' : 'play'} 
                    size={24} 
                    color={subject?.color} 
                  />
                </View>
                <View style={styles.detailedSessionInfo}>
                  <Text style={styles.detailedSessionTopic}>{item.topic}</Text>
                  <Text style={styles.detailedSessionSubject}>{subject?.name}</Text>
                </View>
                <View style={[
                  styles.sessionStatusBadge,
                  { backgroundColor: isUpcoming ? '#FF950020' : '#34C75920' }
                ]}>
                  <Text style={[
                    styles.sessionStatusText,
                    { color: isUpcoming ? '#FF9500' : '#34C759' }
                  ]}>
                    {isUpcoming ? 'Upcoming' : 'Completed'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailedSessionDetails}>
                <View style={styles.detailedSessionRow}>
                  <AppIcon name="calendar" size={16} color="#666" />
                  <Text style={styles.detailedSessionText}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.detailedSessionRow}>
                  <AppIcon name="time" size={16} color="#666" />
                  <Text style={styles.detailedSessionText}>
                    {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.duration} min
                  </Text>
                </View>
                {!isUpcoming && item.score && (
                  <View style={styles.detailedSessionRow}>
                    <AppIcon name="school" size={16} color="#666" />
                    <Text style={styles.detailedSessionText}>
                      Score: <Text style={[styles.scoreText, { color: item.score >= 80 ? '#34C759' : '#FF9500' }]}>
                        {item.score}%
                      </Text>
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.sessionSummary}>{item.summary}</Text>

              {!isUpcoming && item.feedback && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackLabel}>Mentor Feedback:</Text>
                  <Text style={styles.feedbackText}>"{item.feedback}"</Text>
                </View>
              )}

              <View style={styles.sessionActionButtons}>
                <Button
                  title={isUpcoming ? "Prepare Materials" : "Review Session"}
                  onPress={() => Alert.alert(isUpcoming ? 'Prepare' : 'Review', 'Coming soon!')}
                  variant="outline"
                  size="small"
                  style={styles.sessionActionButton}
                />
                <Button
                  title={isUpcoming ? "Reschedule" : "Add Notes"}
                  onPress={() => Alert.alert(isUpcoming ? 'Reschedule' : 'Notes', 'Coming soon!')}
                  variant="outline"
                  size="small"
                  style={styles.sessionActionButton}
                />
              </View>
            </Card>
          );
        }}
        ListHeaderComponent={
          <View style={styles.sessionsHeader}>
            <View style={styles.sessionStats}>
              <Card style={styles.sessionStatCard}>
                <Text style={styles.sessionStatNumber}>{recentSessions.length}</Text>
                <Text style={styles.sessionStatLabel}>Completed</Text>
              </Card>
              <Card style={styles.sessionStatCard}>
                <Text style={styles.sessionStatNumber}>{upcomingSessions.length}</Text>
                <Text style={styles.sessionStatLabel}>Upcoming</Text>
              </Card>
              <Card style={styles.sessionStatCard}>
                <Text style={styles.sessionStatNumber}>
                  {Math.round((recentSessions.length / (recentSessions.length + upcomingSessions.length)) * 100)}%
                </Text>
                <Text style={styles.sessionStatLabel}>Completion</Text>
              </Card>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderAnalyticsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Weekly Progress Chart */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Progress</Text>
        <View style={styles.chartContainer}>
          {performanceMetrics.weeklyProgress.map((value, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={[styles.bar, { height: value * 1.5 }]}>
                <View style={[styles.barFill, { height: `${value}%`, backgroundColor: '#5856D6' }]} />
              </View>
              <Text style={styles.barLabel}>Day {index + 1}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Monthly Progress */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Monthly Progress Trend</Text>
        <View style={styles.lineChart}>
          {performanceMetrics.monthlyProgress.map((value, index) => (
            <View key={index} style={styles.lineChartPoint}>
              <View style={[styles.chartDot, { backgroundColor: '#5856D6' }]} />
              {index < performanceMetrics.monthlyProgress.length - 1 && (
                <View style={[styles.chartLine, { width: 30 }]} />
              )}
            </View>
          ))}
        </View>
        <View style={styles.chartValues}>
          {performanceMetrics.monthlyProgress.map((value, index) => (
            <Text key={index} style={styles.chartValue}>{value}%</Text>
          ))}
        </View>
        <View style={styles.chartMonths}>
          <Text style={styles.chartMonth}>Week 1</Text>
          <Text style={styles.chartMonth}>Week 2</Text>
          <Text style={styles.chartMonth}>Week 3</Text>
          <Text style={styles.chartMonth}>Week 4</Text>
          <Text style={styles.chartMonth}>Week 5</Text>
          <Text style={styles.chartMonth}>Week 6</Text>
          <Text style={styles.chartMonth}>Week 7</Text>
        </View>
      </Card>

      {/* Detailed Metrics */}
      <Card style={styles.metricsCard}>
        <Text style={styles.metricsTitle}>Detailed Performance Metrics</Text>
        
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Sessions Attended</Text>
          <Text style={styles.metricValue}>{performanceMetrics.sessionsAttended}</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Sessions Missed</Text>
          <Text style={styles.metricValue}>{performanceMetrics.sessionsMissed}</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Attendance Rate</Text>
          <Text style={styles.metricValue}>{performanceMetrics.attendanceRate}%</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Completion Rate</Text>
          <Text style={styles.metricValue}>{performanceMetrics.completionRate}%</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Average Score</Text>
          <Text style={styles.metricValue}>{performanceMetrics.averageScore}%</Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Total Time Spent</Text>
          <Text style={styles.metricValue}>{formatTime(performanceMetrics.totalTimeSpent)}</Text>
        </View>
      </Card>

      {/* Subject Performance Breakdown */}
      <Card style={styles.subjectBreakdownCard}>
        <Text style={styles.metricsTitle}>Subject Performance</Text>
        {subjects.map(subject => (
          <View key={subject.id} style={styles.subjectBreakdownRow}>
            <View style={styles.subjectBreakdownHeader}>
              <View style={[styles.subjectBreakdownDot, { backgroundColor: subject.color }]} />
              <Text style={styles.subjectBreakdownName}>{subject.name}</Text>
            </View>
            <View style={styles.subjectBreakdownBar}>
              <View 
                style={[
                  styles.subjectBreakdownFill, 
                  { width: `${subject.averageScore}%`, backgroundColor: subject.color }
                ]} 
              />
            </View>
            <Text style={styles.subjectBreakdownScore}>{subject.averageScore}%</Text>
          </View>
        ))}
      </Card>

      {/* Export Options */}
      <View style={styles.exportOptions}>
        <Button
          title="Export Full Report"
          onPress={() => Alert.alert('Export', 'Exporting report...')}
          style={styles.exportButton}
        />
        <Button
          title="Share Progress"
          onPress={() => Alert.alert('Share', 'Share progress with parents')}
          variant="outline"
          style={styles.exportButton}
        />
      </View>
    </ScrollView>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.subtitle}>Student Progress Overview</Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <AppIcon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedView === 'overview' && styles.activeTab]}
          onPress={() => setSelectedView('overview')}
        >
          <AppIcon 
            name="home" 
            size={20} 
            color={selectedView === 'overview' ? '#5856D6' : '#999'} 
          />
          <Text style={[styles.tabText, selectedView === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedView === 'subjects' && styles.activeTab]}
          onPress={() => setSelectedView('subjects')}
        >
          <AppIcon 
            name="book" 
            size={20} 
            color={selectedView === 'subjects' ? '#5856D6' : '#999'} 
          />
          <Text style={[styles.tabText, selectedView === 'subjects' && styles.activeTabText]}>
            Subjects
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedView === 'sessions' && styles.activeTab]}
          onPress={() => setSelectedView('sessions')}
        >
          <AppIcon 
            name="calendar" 
            size={20} 
            color={selectedView === 'sessions' ? '#5856D6' : '#999'} 
          />
          <Text style={[styles.tabText, selectedView === 'sessions' && styles.activeTabText]}>
            Sessions
          </Text>
          {upcomingSessions.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{upcomingSessions.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedView === 'analytics' && styles.activeTab]}
          onPress={() => setSelectedView('analytics')}
        >
          <AppIcon 
            name="stats-chart" 
            size={20} 
            color={selectedView === 'analytics' ? '#5856D6' : '#999'} 
          />
          <Text style={[styles.tabText, selectedView === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {selectedView === 'overview' && renderOverviewTab()}
        {selectedView === 'subjects' && renderSubjectsTab()}
        {selectedView === 'sessions' && renderSessionsTab()}
        {selectedView === 'analytics' && renderAnalyticsTab()}
      </View>
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
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  refreshButton: {
    padding: 8,
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
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  performanceCard: {
    width: '47%',
    margin: 6,
    padding: 16,
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#5856D6',
  },
  subjectOverviewCard: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  subjectOverviewHeader: {
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
  subjectOverviewInfo: {
    flex: 1,
  },
  subjectOverviewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subjectOverviewProgress: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  subjectOverviewScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectOverviewScoreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5856D6',
    marginRight: 4,
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
  sessionCard: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTopic: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sessionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sessionScore: {
    marginLeft: 8,
  },
  sessionScoreText: {
    fontSize: 18,
    fontWeight: '600',
  },
  sessionFeedback: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickActions: {
    padding: 16,
    gap: 8,
  },
  quickActionButton: {
    marginVertical: 4,
  },
  subjectDetailCard: {
    marginBottom: 12,
  },
  subjectDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectLargeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectDetailInfo: {
    flex: 1,
  },
  subjectDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subjectDetailProgress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  subjectStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  subjectStatItem: {
    alignItems: 'center',
  },
  subjectStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subjectStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  strengthTag: {
    backgroundColor: '#34C75920',
  },
  weaknessTag: {
    backgroundColor: '#FF3B3020',
  },
  tagText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 4,
  },
  strengthSection: {
    marginBottom: 12,
  },
  weaknessSection: {
    marginBottom: 12,
  },
  upcomingSection: {
    marginBottom: 16,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  topicText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  subjectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  subjectActionButton: {
    flex: 1,
  },
  detailedSessionCard: {
    marginBottom: 12,
  },
  detailedSessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailedSessionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailedSessionInfo: {
    flex: 1,
  },
  detailedSessionTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailedSessionSubject: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sessionStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailedSessionDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailedSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailedSessionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  scoreText: {
    fontWeight: '600',
  },
  sessionSummary: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  feedbackContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5856D6',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  sessionActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  sessionActionButton: {
    minWidth: 120,
  },
  sessionsHeader: {
    marginBottom: 12,
  },
  sessionStats: {
    flexDirection: 'row',
    gap: 8,
  },
  sessionStatCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  sessionStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sessionStatLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  chartCard: {
    margin: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    backgroundColor: '#5856D6',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
  },
  lineChart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lineChartPoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartLine: {
    height: 2,
    backgroundColor: '#5856D6',
    marginHorizontal: 4,
  },
  chartValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    width: 40,
  },
  chartMonths: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartMonth: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    width: 40,
  },
  metricsCard: {
    margin: 16,
    padding: 16,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subjectBreakdownCard: {
    margin: 16,
    padding: 16,
  },
  subjectBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBreakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  subjectBreakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  subjectBreakdownName: {
    fontSize: 12,
    color: '#666',
  },
  subjectBreakdownBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  subjectBreakdownFill: {
    height: '100%',
    borderRadius: 3,
  },
  subjectBreakdownScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 40,
    textAlign: 'right',
  },
  exportOptions: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  exportButton: {
    flex: 1,
  },
});