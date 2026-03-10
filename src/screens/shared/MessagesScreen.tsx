import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Card } from '../../components/Card';
import { AppIcon } from '../../components/AppIcon';

export const MessagesScreen = () => {
  const [selectedTab, setSelectedTab] = useState('messages');

  const messages = [
    {
      id: '1',
      sender: 'Emma Parent',
      message: 'When is the next math session?',
      time: '5m ago',
      unread: true,
    },
    {
      id: '2',
      sender: 'James Parent',
      message: 'Great session today!',
      time: '2h ago',
      unread: false,
    },
    {
      id: '3',
      sender: 'Sarah Mentor',
      message: 'Please review the homework',
      time: '1d ago',
      unread: true,
    },
  ];

  const renderMessageItem = ({ item }: any) => (
    <TouchableOpacity>
      <Card style={[styles.messageCard, item.unread && styles.unreadCard]}>
        <View style={styles.messageHeader}>
          <View style={styles.senderInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.sender[0]}</Text>
            </View>
            <View>
              <Text style={styles.senderName}>{item.sender}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          </View>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.messagePreview} numberOfLines={2}>
          {item.message}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity>
          <AppIcon name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'messages' && styles.activeTab]}
          onPress={() => setSelectedTab('messages')}
        >
          <Text style={[styles.tabText, selectedTab === 'messages' && styles.activeTabText]}>
            Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'notifications' && styles.activeTab]}
          onPress={() => setSelectedTab('notifications')}
        >
          <Text style={[styles.tabText, selectedTab === 'notifications' && styles.activeTabText]}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  messageCard: {
    marginBottom: 12,
  },
  unreadCard: {
    backgroundColor: '#f0f8ff',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
    marginLeft: 52,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
});