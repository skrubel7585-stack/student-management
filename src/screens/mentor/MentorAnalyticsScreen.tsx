import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card } from '../../components/Card';
import { AppIcon } from '../../components/AppIcon';

interface AnalyticsData {
  totalStudents: number;
  activeStudents: number;
  totalSessions: number;
  completedSessions: number;
  averageProgress: number;
  averageScore: number;
  attendanceRate: number;
  feedbackResponseRate: number;
  popularSubjects: { subject: string; count: number }[];
  studentProgress: { range: string; count: number }[];
  weeklySessions: number[];
}

export const MentorAnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const analyticsData: AnalyticsData = {
    totalStudents: 12,
    activeStudents: 8,
    totalSessions: 48,
    completedSessions: 42,
    averageProgress: 72,
    averageScore: 78,
    attendanceRate: 88,
    feedbackResponseRate: 75,
    popularSubjects: [
      { subject: 'Mathematics', count: 15 },
      { subject: 'Physics', count: 12 },
      { subject: 'English', count: 10 },
      { subject: 'Chemistry', count: 6 },
      { subject: 'Biology', count: 5 },
    ],
    studentProgress: [
      { range: '0-25%', count: 1 },
      { range: '26-50%', count: 2 },
      { range: '51-75%', count: 5 },
      { range: '76-100%', count: 4 },
    ],
    weeklySessions: [8, 12, 10, 15, 9, 13, 11],
  };

  const periods = ['week', 'month', 'year'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your teaching performance</Text>
      </View>

      <View style={styles.periodContainer}>
        {periods.map(period => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.activePeriodButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText,
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <Card style={styles.metricCard}>
          <AppIcon name="people" size={24} color="#5856D6" />
          <Text style={styles.metricValue}>{analyticsData.totalStudents}</Text>
          <Text style={styles.metricLabel}>Total Students</Text>
        </Card>
        <Card style={styles.metricCard}>
          <AppIcon name="school" size={24} color="#34C759" />
          <Text style={styles.metricValue}>{analyticsData.activeStudents}</Text>
          <Text style={styles.metricLabel}>Active</Text>
        </Card>
        <Card style={styles.metricCard}>
          <AppIcon name="calendar" size={24} color="#FF9500" />
          <Text style={styles.metricValue}>{analyticsData.totalSessions}</Text>
          <Text style={styles.metricLabel}>Sessions</Text>
        </Card>
        <Card style={styles.metricCard}>
          <AppIcon name="trending-up" size={24} color="#007AFF" />
          <Text style={styles.metricValue}>{analyticsData.averageProgress}%</Text>
          <Text style={styles.metricLabel}>Avg Progress</Text>
        </Card>
      </View>

      {/* Performance Indicators */}
      <View style={styles.performanceContainer}>
        <Card style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>Performance Indicators</Text>
          
          <View style={styles.indicatorRow}>
            <View style={styles.indicatorLabel}>
              <Text style={styles.indicatorName}>Average Score</Text>
            </View>
            <View style={styles.indicatorBar}>
              <View 
                style={[
                  styles.indicatorFill, 
                  { width: `${analyticsData.averageScore}%`, backgroundColor: '#5856D6' }
                ]} 
              />
            </View>
            <Text style={styles.indicatorValue}>{analyticsData.averageScore}%</Text>
          </View>

          <View style={styles.indicatorRow}>
            <View style={styles.indicatorLabel}>
              <Text style={styles.indicatorName}>Attendance Rate</Text>
            </View>
            <View style={styles.indicatorBar}>
              <View 
                style={[
                  styles.indicatorFill, 
                  { width: `${analyticsData.attendanceRate}%`, backgroundColor: '#34C759' }
                ]} 
              />
            </View>
            <Text style={styles.indicatorValue}>{analyticsData.attendanceRate}%</Text>
          </View>

          <View style={styles.indicatorRow}>
            <View style={styles.indicatorLabel}>
              <Text style={styles.indicatorName}>Feedback Response</Text>
            </View>
            <View style={styles.indicatorBar}>
              <View 
                style={[
                  styles.indicatorFill, 
                  { width: `${analyticsData.feedbackResponseRate}%`, backgroundColor: '#FF9500' }
                ]} 
              />
            </View>
            <Text style={styles.indicatorValue}>{analyticsData.feedbackResponseRate}%</Text>
          </View>
        </Card>
      </View>

      {/* Student Progress Distribution */}
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Student Progress Distribution</Text>
        {analyticsData.studentProgress.map((item, index) => (
          <View key={index} style={styles.distributionItem}>
            <Text style={styles.distributionLabel}>{item.range}</Text>
            <View style={styles.distributionBar}>
              <View 
                style={[
                  styles.distributionFill, 
                  { 
                    width: `${(item.count / analyticsData.totalStudents) * 100}%`,
                    backgroundColor: index === 0 ? '#FF3B30' : 
                                   index === 1 ? '#FF9500' : 
                                   index === 2 ? '#5856D6' : '#34C759'
                  }
                ]} 
              />
            </View>
            <Text style={styles.distributionCount}>{item.count}</Text>
          </View>
        ))}
      </Card>

      {/* Popular Subjects */}
      <Card style={styles.subjectsCard}>
        <Text style={styles.chartTitle}>Popular Subjects</Text>
        {analyticsData.popularSubjects.map((item, index) => (
          <View key={index} style={styles.subjectRow}>
            <Text style={styles.subjectName}>{item.subject}</Text>
            <View style={styles.subjectBar}>
              <View 
                style={[
                  styles.subjectFill, 
                  { 
                    width: `${(item.count / Math.max(...analyticsData.popularSubjects.map(s => s.count))) * 100}%`,
                    backgroundColor: index === 0 ? '#5856D6' : 
                                   index === 1 ? '#FF9500' : 
                                   index === 2 ? '#34C759' : '#007AFF'
                  }
                ]} 
              />
            </View>
            <Text style={styles.subjectCount}>{item.count} sessions</Text>
          </View>
        ))}
      </Card>

      {/* Weekly Activity */}
      <Card style={styles.weeklyCard}>
        <Text style={styles.chartTitle}>Weekly Sessions</Text>
        <View style={styles.weeklyChart}>
          {analyticsData.weeklySessions.map((count, index) => (
            <View key={index} style={styles.weeklyBarContainer}>
              <View 
                style={[
                  styles.weeklyBar,
                  { height: count * 8, backgroundColor: '#5856D6' }
                ]} 
              />
              <Text style={styles.weeklyDay}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <Card style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>
            {Math.round((analyticsData.completedSessions / analyticsData.totalSessions) * 100)}%
          </Text>
          <Text style={styles.quickStatLabel}>Completion Rate</Text>
        </Card>
        <Card style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>
            {analyticsData.feedbackResponseRate}%
          </Text>
          <Text style={styles.quickStatLabel}>Feedback Rate</Text>
        </Card>
        <Card style={styles.quickStatCard}>
          <Text style={styles.quickStatValue}>
            {Math.round(analyticsData.totalSessions / analyticsData.totalStudents)}
          </Text>
          <Text style={styles.quickStatLabel}>Sessions/Student</Text>
        </Card>
      </View>

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton}>
        <AppIcon name="download" size={20} color="#fff" />
        <Text style={styles.exportButtonText}>Export Full Report</Text>
      </TouchableOpacity>
    </ScrollView>
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
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activePeriodButton: {
    backgroundColor: '#5856D6',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#fff',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  metricCard: {
    width: '47%',
    margin: '1.5%',
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  performanceContainer: {
    padding: 16,
    paddingTop: 0,
  },
  performanceCard: {
    padding: 16,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  indicatorLabel: {
    width: 120,
  },
  indicatorName: {
    fontSize: 14,
    color: '#666',
  },
  indicatorBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  indicatorFill: {
    height: '100%',
    borderRadius: 4,
  },
  indicatorValue: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  chartCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  distributionLabel: {
    width: 60,
    fontSize: 13,
    color: '#666',
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionCount: {
    width: 30,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
  },
  subjectsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  subjectBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  subjectFill: {
    height: '100%',
    borderRadius: 4,
  },
  subjectCount: {
    width: 80,
    fontSize: 13,
    color: '#666',
    textAlign: 'right',
  },
  weeklyCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  weeklyBarContainer: {
    alignItems: 'center',
  },
  weeklyBar: {
    width: 20,
    backgroundColor: '#5856D6',
    borderRadius: 4,
    marginBottom: 8,
  },
  weeklyDay: {
    fontSize: 12,
    color: '#666',
  },
  quickStats: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  quickStatCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5856D6',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});