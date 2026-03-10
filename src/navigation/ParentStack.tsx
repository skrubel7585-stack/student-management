import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ParentStackParamList } from './types';
import { ParentTabs } from './ParentTabs';
import { StudentLessonsScreen } from '../screens/parent/StudentLessonsScreen';
import { LessonsListScreen } from '../screens/shared/LessonsListScreen';
import { LessonDetailScreen } from '../screens/shared/LessonDetailScreen';
import { SessionDetailScreen } from '../screens/shared/SessionDetailScreen';
import { CreateStudentScreen } from '../screens/parent/CreateStudentScreen';

const Stack = createStackNavigator<ParentStackParamList>();

export const ParentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Main tab navigator - hide header */}
      <Stack.Screen 
        name="ParentTabs" 
        component={ParentTabs} 
        options={{ headerShown: false }}
      />
      
      {/* Other screens that will be pushed on top of tabs */}
      <Stack.Screen 
        name="StudentLessons" 
        component={StudentLessonsScreen} 
        options={({ route }) => ({ 
          title: route.params?.studentName || 'Student Lessons' 
        })}
      />
      
      <Stack.Screen 
        name="CreateStudent" 
        component={CreateStudentScreen} 
        options={{ title: 'Add Student' }}
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