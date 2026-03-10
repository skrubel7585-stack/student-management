import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ParentTabParamList } from './types';
import { ParentDashboard } from '../screens/parent/ParentDashboard';
import { StudentsScreen } from '../screens/parent/StudentsScreen';
import { ScheduleScreen } from '../screens/parent/ScheduleScreen';
import { MessagesScreen } from '../screens/shared/MessagesScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { BottomNavBar } from '../components/BottomNavBar';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<ParentTabParamList>();

export const ParentTabs = () => {
  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <Tab.Navigator
        tabBar={(props) => <BottomNavBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="ParentDashboard" component={ParentDashboard} />
        <Tab.Screen name="Students" component={StudentsScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
};