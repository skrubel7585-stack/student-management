import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MentorStackParamList } from './types';
import { MentorTabs } from './MentorTabs';
import { MentorStudentLessonsScreen } from '../screens/mentor/MentorStudentLessonsScreen';
import { LessonsListScreen } from '../screens/shared/LessonsListScreen';
import { LessonDetailScreen } from '../screens/shared/LessonDetailScreen';
import { SessionDetailScreen } from '../screens/shared/SessionDetailScreen';

const Stack = createStackNavigator<MentorStackParamList>();

export const MentorStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5856D6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="MentorTabs" 
        component={MentorTabs} 
        options={{ 
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="MentorStudentLessons" 
        component={MentorStudentLessonsScreen} 
        options={({ route }) => ({ 
          title: route.params?.studentName || 'Student Progress',
        })}
      />
      <Stack.Screen 
        name="LessonsList" 
        component={LessonsListScreen} 
        options={{ 
          title: 'Lessons',
        }}
      />
      <Stack.Screen 
        name="LessonDetail" 
        component={LessonDetailScreen} 
        options={({ route }) => ({ 
          title: route.params?.lessonName || 'Lesson Details',
        })}
      />
      <Stack.Screen 
        name="SessionDetail" 
        component={SessionDetailScreen} 
        options={{ 
          title: 'Session Details',
        }}
      />
    </Stack.Navigator>
  );
};