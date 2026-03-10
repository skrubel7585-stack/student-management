import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthStack } from './src/navigation/AuthStack';
import { ParentStack } from './src/navigation/ParentStack';
import { StudentStack } from './src/navigation/StudentStack';
import { MentorStack } from './src/navigation/MentorStack';
import { RootStackParamList } from './src/navigation/types';
import { LoadingSpinner } from './src/components/LoadingSpinner';
import { View, StatusBar, SafeAreaView } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getStatusBarColor = () => {
    switch (user?.role) {
      case 'parent':
        return '#007AFF';
      case 'student':
        return '#34C759';
      case 'mentor':
        return '#5856D6';
      default:
        return '#007AFF';
    }
  };

  return (
    
    <View style={{ flex: 1, backgroundColor: getStatusBarColor() }}>
      
      <StatusBar hidden={true} />
      
      
      <View style={{ 
        flex: 1, 
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        marginTop: 0,
        paddingTop: 0,
      }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
              <Stack.Screen name="Auth" component={AuthStack} />
            ) : (
              <>
                {user.role === 'parent' && (
                  <Stack.Screen name="Parent" component={ParentStack} />
                )}
                {user.role === 'student' && (
                  <Stack.Screen name="Student" component={StudentStack} />
                )}
                {user.role === 'mentor' && (
                  <Stack.Screen name="Mentor" component={MentorStack} />
                )}
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}