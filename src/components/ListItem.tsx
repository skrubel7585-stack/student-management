import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { AppIcon } from './AppIcon';

export interface ListItemProps {
  // Main content
  title: string;
  subtitle?: string;
  
  // Left element
  leftIcon?: string;
  leftIconColor?: string;
  leftAvatar?: React.ReactNode;
  
  // Right element
  rightIcon?: string;
  rightText?: string;
  rightComponent?: React.ReactNode;
  
  // Status
  status?: 'success' | 'warning' | 'error' | 'info';
  statusText?: string;
  
  // Actions
  onPress?: () => void;
  onLongPress?: () => void;
  
  // Style
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  
  // States
  disabled?: boolean;
  selected?: boolean;
  
  // Additional
  badge?: number | string;
  badgeColor?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  leftIconColor = '#007AFF',
  leftAvatar,
  rightIcon = 'chevron-forward',
  rightText,
  rightComponent,
  status,
  statusText,
  onPress,
  onLongPress,
  style,
  titleStyle,
  subtitleStyle,
  disabled = false,
  selected = false,
  badge,
  badgeColor = '#FF3B30',
}) => {
  
  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#34C759';
      case 'warning': return '#FF9500';
      case 'error': return '#FF3B30';
      case 'info': return '#007AFF';
      default: return undefined;
    }
  };

  const Container = onPress || onLongPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        selected && styles.selected,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {/* Left Section */}
      <View style={styles.leftSection}>
        {leftAvatar ? (
          <View style={styles.avatarContainer}>{leftAvatar}</View>
        ) : leftIcon ? (
          <View style={[styles.iconContainer, { backgroundColor: `${leftIconColor}20` }]}>
            <AppIcon name={leftIcon} size={24} color={leftIconColor} />
          </View>
        ) : null}
        
        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title, 
              disabled && styles.disabledText,
              titleStyle
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              style={[
                styles.subtitle, 
                disabled && styles.disabledText,
                subtitleStyle
              ]}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        {/* Badge */}
        {badge !== undefined && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>
              {typeof badge === 'number' && badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}

        {/* Status Indicator */}
        {status && (
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        )}
        
        {statusText && (
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {statusText}
          </Text>
        )}

        {/* Right Text */}
        {rightText && (
          <Text style={styles.rightText}>{rightText}</Text>
        )}

        {/* Custom Right Component */}
        {rightComponent}

        {/* Default Right Icon */}
        {!rightComponent && !rightText && !status && badge === undefined && (
          <AppIcon name={rightIcon} size={20} color="#999" />
        )}
      </View>
    </Container>
  );
};

// Specialized List Item Types
export const StudentListItem: React.FC<{
  name: string;
  surname: string;
  age?: number;
  onPress?: () => void;
  badge?: number;
}> = ({ name, surname, age, onPress, badge }) => (
  <ListItem
    title={`${name} ${surname}`}
    subtitle={age ? `Age: ${age} years` : undefined}
    leftIcon="person"
    leftIconColor="#007AFF"
    onPress={onPress}
    badge={badge}
  />
);

export const LessonListItem: React.FC<{
  name: string;
  description?: string;
  progress?: number;
  onPress?: () => void;
}> = ({ name, description, progress, onPress }) => (
  <ListItem
    title={name}
    subtitle={description}
    leftIcon="book"
    leftIconColor="#34C759"
    onPress={onPress}
    rightComponent={
      progress !== undefined ? (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      ) : undefined
    }
  />
);

export const SessionListItem: React.FC<{
  topic: string;
  date: string;
  summary?: string;
  status?: 'upcoming' | 'completed' | 'cancelled';
  onPress?: () => void;
}> = ({ topic, date, summary, status = 'upcoming', onPress }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming': return '#007AFF';
      case 'completed': return '#34C759';
      case 'cancelled': return '#FF3B30';
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

  return (
    <ListItem
      title={topic}
      subtitle={`${formatDate(date)} • ${summary || 'No summary available'}`}
      leftIcon="calendar"
      leftIconColor={getStatusColor()}
      onPress={onPress}
      status={status === 'upcoming' ? 'info' : status === 'completed' ? 'success' : 'error'}
      rightIcon="chevron-forward"
    />
  );
};

export const NotificationListItem: React.FC<{
  title: string;
  message: string;
  time: string;
  read?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  onPress?: () => void;
}> = ({ title, message, time, read = false, type = 'info', onPress }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'alert-circle';
      default: return 'information-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#34C759';
      case 'warning': return '#FF9500';
      case 'error': return '#FF3B30';
      default: return '#007AFF';
    }
  };

  return (
    <ListItem
      title={title}
      subtitle={message}
      leftIcon={getIcon()}
      leftIconColor={getColor()}
      rightText={time}
      onPress={onPress}
      style={!read ? styles.unread : undefined}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 60,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightText: {
    fontSize: 14,
    color: '#999',
    marginRight: 4,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  selected: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  unread: {
    backgroundColor: '#f8f9fa',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
});