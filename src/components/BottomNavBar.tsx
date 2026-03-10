import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { AppIcon } from './AppIcon';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  name: string;
  icon: string;
  activeIcon: string;
  label: string;
  badge?: number;
}

interface BottomNavBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ state, descriptors, navigation }) => {
  const { user, isParent, isStudent, isMentor, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => logout(),
          style: 'destructive'
        },
      ]
    );
  };

  // Get navigation items based on user role
  const getNavItems = (): NavItem[] => {
    if (isParent) {
      return [
        { name: 'ParentDashboard', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
        { name: 'Students', icon: 'people-outline', activeIcon: 'people', label: 'Students', badge: 3 },
        { name: 'Schedule', icon: 'calendar-outline', activeIcon: 'calendar', label: 'Schedule', badge: 2 },
        { name: 'Messages', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', label: 'Messages', badge: 5 },
        { name: 'Profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
      ];
    } else if (isStudent) {
      return [
        { name: 'StudentDashboard', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
        { name: 'Lessons', icon: 'book-outline', activeIcon: 'book', label: 'Lessons' },
        { name: 'Sessions', icon: 'calendar-outline', activeIcon: 'calendar', label: 'Sessions', badge: 2 },
        { name: 'Messages', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', label: 'Messages', badge: 3 },
        { name: 'Profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
      ];
    } else if (isMentor) {
      return [
        { name: 'MentorDashboard', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
        { name: 'MentorStudents', icon: 'people-outline', activeIcon: 'people', label: 'Students', badge: 4 },
        { name: 'MentorSessions', icon: 'calendar-outline', activeIcon: 'calendar', label: 'Sessions', badge: 3 },
        { name: 'MentorFeedback', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'Feedback', badge: 2 },
        { name: 'MentorAnalytics', icon: 'stats-chart-outline', activeIcon: 'stats-chart', label: 'Analytics' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  if (navItems.length === 0) return null;

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.navBar}>
          {/* Navigation Items */}
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const navItem = navItems.find(item => item.name === route.name) || navItems[index];

            // Animation values
            const scaleValue = new Animated.Value(1);

            const handlePressIn = () => {
              Animated.spring(scaleValue, {
                toValue: 0.9,
                useNativeDriver: true,
                friction: 3,
              }).start();
            };

            const handlePressOut = () => {
              Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                friction: 3,
              }).start();
            };

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.7}
                style={styles.tabButton}
              >
                <Animated.View style={[styles.tabContent, { transform: [{ scale: scaleValue }] }]}>
                  <View style={styles.iconContainer}>
                    <AppIcon
                      name={isFocused ? navItem?.activeIcon || navItem?.icon : navItem?.icon || 'home'}
                      size={22}
                      color={isFocused ? '#5856D6' : '#8E8E93'}
                    />
                    {navItem?.badge ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {navItem.badge > 99 ? '99+' : navItem.badge}
                        </Text>
                      </View>
                    ) : null}
                    {isFocused && <View style={styles.activeDot} />}
                  </View>
                  <Text style={[styles.tabLabel, isFocused && styles.activeLabel]}>
                    {navItem?.label || ''}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            onPressIn={() => {
              const scale = new Animated.Value(1);
              Animated.spring(scale, {
                toValue: 0.9,
                useNativeDriver: true,
                friction: 3,
              }).start();
            }}
            onPressOut={() => {
              const scale = new Animated.Value(0.9);
              Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                friction: 3,
              }).start();
            }}
            activeOpacity={0.7}
            style={styles.logoutButton}
          >
            <View style={styles.iconContainer}>
              <AppIcon name="log-out-outline" size={22} color="#FF3B30" />
            </View>
            <Text style={[styles.tabLabel, styles.logoutLabel]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navBar: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    padding: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#5856D6',
    fontWeight: '600',
  },
  logoutLabel: {
    color: '#FF3B30',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#FF3B30',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5856D6',
  },
});