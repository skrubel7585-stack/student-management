import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StudentStackParamList } from './types';
import { StudentTabs } from './StudentTabs';
import { StudentLessonsScreen } from '../screens/student/StudentLessonsScreen'; // Check this path
import { LessonsListScreen } from '../screens/shared/LessonsListScreen';
import { LessonDetailScreen } from '../screens/shared/LessonDetailScreen';
import { SessionDetailScreen } from '../screens/shared/SessionDetailScreen';

const Stack = createStackNavigator<StudentStackParamList>();

export const StudentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#34C759',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="StudentTabs" 
        component={StudentTabs} 
        options={{ headerShown: false }}
      />
      
      <Stack.Screen 
        name="StudentLessons" 
        component={StudentLessonsScreen} 
        options={({ route }) => ({ 
          title: route.params?.studentName || 'Student Lessons' 
        })}
      />
      
      <Stack.Screen 
        name="LessonsList" 
        component={LessonsListScreen} 
        options={{ title: 'Lessons' }}
      />
      
      <Stack.Screen 
        name="LessonDetail" 
        component={LessonDetailScreen} 
        options={({ route }) => ({ 
          title: route.params?.lessonName || 'Lesson Details' 
        })}
      />
      
      <Stack.Screen 
        name="SessionDetail" 
        component={SessionDetailScreen} 
        options={{ title: 'Session Details' }}
      />
    </Stack.Navigator>
  );
};