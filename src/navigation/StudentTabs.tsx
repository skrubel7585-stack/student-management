import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StudentTabParamList } from './types';
import { StudentDashboard } from '../screens/student/StudentDashboard';
import { LessonsScreen } from '../screens/student/LessonsScreen';
import { SessionsScreen } from '../screens/student/SessionsScreen';
import { MessagesScreen } from '../screens/shared/MessagesScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { BottomNavBar } from '../components/BottomNavBar';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<StudentTabParamList>();

export const StudentTabs = () => {
  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <Tab.Navigator
        tabBar={(props) => <BottomNavBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="StudentDashboard" component={StudentDashboard} />
        <Tab.Screen name="Lessons" component={LessonsScreen} />
        <Tab.Screen name="Sessions" component={SessionsScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
};