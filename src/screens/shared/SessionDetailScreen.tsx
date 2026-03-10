import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card } from '../../components/Card';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { mockApi } from '../../services/mockData';
import { Session } from '../../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';

type SessionDetailScreenNavigationProp = StackNavigationProp<any>;
type SessionDetailScreenRouteProp = {
  key: string;
  name: string;
  params: {
    sessionId: string;
    sessionData?: Session;
  };
};

export const SessionDetailScreen = () => {
  const navigation = useNavigation<SessionDetailScreenNavigationProp>();
  const route = useRoute<SessionDetailScreenRouteProp>();
  const { sessionId, sessionData } = route.params;
  const [session, setSession] = useState<Session | null>(sessionData || null);
  const [loading, setLoading] = useState(!sessionData);

  useEffect(() => {
    if (session) {
      navigation.setOptions({ title: session.topic });
    }
    if (!sessionData) {
      loadSession();
    }
  }, []);

  const loadSession = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getSessionById(sessionId);
      if (data) {
        setSession(data);
        navigation.setOptions({ title: data.topic });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load session details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={60} color="#ff3b30" />
        <Text style={styles.errorText}>Session not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.detailCard}>
        <View style={styles.header}>
          <Icon name="book-outline" size={40} color="#007AFF" />
          <Text style={styles.topic}>{session.topic}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="calendar-outline" size={24} color="#666" />
            <Text style={styles.infoText}>{formatDate(session.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="document-text-outline" size={24} color="#666" />
            <Text style={styles.infoText}>Session Summary</Text>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>{session.summary}</Text>
        </View>

        <View style={styles.additionalInfo}>
          <Text style={styles.additionalTitle}>Learning Objectives:</Text>
          <Text style={styles.additionalText}>
            • Understand key concepts
            {'\n'}• Practice with examples
            {'\n'}• Complete exercises
          </Text>

          <Text style={styles.additionalTitle}>Materials:</Text>
          <Text style={styles.additionalText}>
            • Presentation slides
            {'\n'}• Practice worksheets
            {'\n'}• Additional resources
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailCard: {
    margin: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  topic: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  summaryContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  additionalInfo: {
    marginTop: 10,
  },
  additionalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  additionalText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
});