import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AppIcon } from '../../components/AppIcon';

interface FeedbackItem {
  id: string;
  studentName: string;
  studentId: string;
  sessionTopic: string;
  sessionDate: string;
  requestedAt: string;
  status: 'pending' | 'submitted';
  feedback?: string;
  rating?: number;
}

export const MentorFeedbackScreen = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);

  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    {
      id: '1',
      studentName: 'Emma Parent',
      studentId: '101',
      sessionTopic: 'Quadratic Equations',
      sessionDate: '2024-03-15',
      requestedAt: '2024-03-14T10:00:00',
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'James Parent',
      studentId: '102',
      sessionTopic: 'Newton\'s Laws',
      sessionDate: '2024-03-14',
      requestedAt: '2024-03-13T15:30:00',
      status: 'pending',
    },
    {
      id: '3',
      studentName: 'Emma Parent',
      studentId: '101',
      sessionTopic: 'Essay Structure',
      sessionDate: '2024-03-13',
      requestedAt: '2024-03-12T09:00:00',
      status: 'submitted',
      feedback: 'Great progress in essay writing. Thesis statements are much stronger now.',
      rating: 4,
    },
    {
      id: '4',
      studentName: 'Olivia Parent',
      studentId: '103',
      sessionTopic: 'Algebra Basics',
      sessionDate: '2024-03-12',
      requestedAt: '2024-03-11T14:00:00',
      status: 'submitted',
      feedback: 'Good understanding of basic concepts. Need more practice with word problems.',
      rating: 3,
    },
  ]);

  const filteredFeedback = feedbackItems.filter(item => item.status === selectedTab);

  const handleSubmitFeedback = () => {
    if (selectedFeedback && feedbackText.trim()) {
      setFeedbackItems(prev =>
        prev.map(item =>
          item.id === selectedFeedback.id
            ? { ...item, status: 'submitted', feedback: feedbackText, rating }
            : item
        )
      );
      setShowFeedbackModal(false);
      setFeedbackText('');
      setRating(0);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (selectedRating: number) => {
    return [1, 2, 3, 4, 5].map(star => (
      <TouchableOpacity key={star} onPress={() => setRating(star)}>
        <AppIcon 
          name={star <= (rating || selectedRating) ? 'star' : 'star-outline'} 
          size={30} 
          color="#FF9500" 
        />
      </TouchableOpacity>
    ));
  };

  const renderFeedbackCard = ({ item }: { item: FeedbackItem }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.status === 'pending') {
          setSelectedFeedback(item);
          setShowFeedbackModal(true);
        }
      }}
    >
      <Card style={styles.feedbackCard}>
        <View style={styles.feedbackHeader}>
          <View style={styles.studentInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.studentName[0]}</Text>
            </View>
            <View>
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.sessionTopic}>{item.sessionTopic}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { 
            backgroundColor: item.status === 'pending' ? '#FF950020' : '#34C75920' 
          }]}>
            <Text style={[styles.statusText, { 
              color: item.status === 'pending' ? '#FF9500' : '#34C759' 
            }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.sessionInfo}>
          <View style={styles.infoRow}>
            <AppIcon name="calendar" size={14} color="#666" />
            <Text style={styles.infoText}>
              Session: {new Date(item.sessionDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <AppIcon name="time" size={14} color="#666" />
            <Text style={styles.infoText}>
              Requested: {formatDate(item.requestedAt)}
            </Text>
          </View>
        </View>

        {item.status === 'submitted' && item.feedback && (
          <View style={styles.feedbackPreview}>
            <Text style={styles.feedbackLabel}>Feedback:</Text>
            <Text style={styles.feedbackText} numberOfLines={2}>
              "{item.feedback}"
            </Text>
            {item.rating && (
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <AppIcon 
                    key={star}
                    name={star <= item.rating! ? 'star' : 'star-outline'} 
                    size={16} 
                    color="#FF9500" 
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {item.status === 'pending' && (
          <View style={styles.pendingActions}>
            <Button
              title="Submit Feedback"
              onPress={() => {
                setSelectedFeedback(item);
                setShowFeedbackModal(true);
              }}
              size="small"
              style={styles.feedbackButton}
            />
            <Button
              title="Remind Later"
              onPress={() => {}}
              variant="outline"
              size="small"
              style={styles.feedbackButton}
            />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feedback</Text>
        <Text style={styles.subtitle}>Manage student feedback requests</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pending' && styles.activeTab]}
          onPress={() => setSelectedTab('pending')}
        >
          <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>
            Pending ({feedbackItems.filter(f => f.status === 'pending').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'submitted' && styles.activeTab]}
          onPress={() => setSelectedTab('submitted')}
        >
          <Text style={[styles.tabText, selectedTab === 'submitted' && styles.activeTabText]}>
            Submitted ({feedbackItems.filter(f => f.status === 'submitted').length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredFeedback}
        renderItem={renderFeedbackCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppIcon name="chatbubbles-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No {selectedTab} feedback requests</Text>
          </View>
        }
      />

      {/* Submit Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Feedback</Text>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <AppIcon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedFeedback && (
              <>
                <View style={styles.modalSessionInfo}>
                  <Text style={styles.modalStudentName}>{selectedFeedback.studentName}</Text>
                  <Text style={styles.modalSessionTopic}>{selectedFeedback.sessionTopic}</Text>
                  <Text style={styles.modalSessionDate}>
                    Session: {new Date(selectedFeedback.sessionDate).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.ratingSection}>
                  <Text style={styles.ratingLabel}>Rating</Text>
                  <View style={styles.starsContainer}>
                    {renderStars(0)}
                  </View>
                </View>

                <View style={styles.feedbackSection}>
                  <Text style={styles.feedbackLabel}>Feedback</Text>
                  <TextInput
                    style={styles.feedbackInput}
                    placeholder="Write your feedback here..."
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title="Submit Feedback"
                    onPress={handleSubmitFeedback}
                    style={styles.modalButton}
                  />
                  <Button
                    title="Cancel"
                    onPress={() => setShowFeedbackModal(false)}
                    variant="outline"
                    style={styles.modalButton}
                  />
                </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#5856D6',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#5856D6',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  feedbackCard: {
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sessionTopic: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
  sessionInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  feedbackPreview: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackButton: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSessionInfo: {
    marginBottom: 20,
  },
  modalStudentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalSessionTopic: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  modalSessionDate: {
    fontSize: 14,
    color: '#999',
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
  },
  modalActions: {
    gap: 10,
  },
  modalButton: {
    marginBottom: 8,
  },
});