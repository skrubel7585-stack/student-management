import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MentorTabParamList } from './types';
import { MentorDashboard } from '../screens/mentor/MentorDashboard';
import { MentorStudentsScreen } from '../screens/mentor/MentorStudentsScreen';
import { MentorSessionsScreen } from '../screens/mentor/MentorSessionsScreen';
import { MentorFeedbackScreen } from '../screens/mentor/MentorFeedbackScreen';
import { MentorAnalyticsScreen } from '../screens/mentor/MentorAnalyticsScreen';
import { BottomNavBar } from '../components/BottomNavBar';

const Tab = createBottomTabNavigator<MentorTabParamList>();

export const MentorTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="MentorDashboard" 
        component={MentorDashboard} 
      />
      <Tab.Screen 
        name="MentorStudents" 
        component={MentorStudentsScreen} 
      />
      <Tab.Screen 
        name="MentorSessions" 
        component={MentorSessionsScreen} 
      />
      <Tab.Screen 
        name="MentorFeedback" 
        component={MentorFeedbackScreen} 
      />
      <Tab.Screen 
        name="MentorAnalytics" 
        component={MentorAnalyticsScreen} 
      />
    </Tab.Navigator>
  );
};