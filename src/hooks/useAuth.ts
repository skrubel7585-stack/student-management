import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { User, UserRole } from '../navigation/types';
import { mockApi } from '../services/mockData';

// Storage keys
const STORAGE_KEYS = {
  USER: '@mentora_user',
  REMEMBER_ME: '@mentora_remember_me',
};

// Login credentials type
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Hook return type
interface UseAuthReturn {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  
  // Utilities
  checkAuthStatus: () => Promise<boolean>;
  clearError: () => void;
  
  // Role checks
  isParent: boolean;
  isStudent: boolean;
  isMentor: boolean;
  
  // User info helpers
  getUserDisplayName: () => string;
  getUserInitials: () => string;
  getDashboardColor: () => string;
}

export const useAuth = (): UseAuthReturn => {
  const { user, isLoading, login: contextLogin, logout: contextLogout } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  // Computed properties
  const isAuthenticated = !!user;
  const isParent = user?.role === 'parent';
  const isStudent = user?.role === 'student';
  const isMentor = user?.role === 'mentor';

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get user display name
  const getUserDisplayName = useCallback((): string => {
    if (!user) return 'Guest';
    return user.name;
  }, [user]);

  // Get user initials for avatar
  const getUserInitials = useCallback((): string => {
    if (!user) return '?';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  // Get dashboard color based on role
  const getDashboardColor = useCallback((): string => {
    if (isParent) return '#007AFF';
    if (isStudent) return '#34C759';
    if (isMentor) return '#5856D6';
    return '#999';
  }, [isParent, isStudent, isMentor]);

  // Save user to storage if remember me is enabled
  const saveUserToStorage = useCallback(async (userData: User, rememberMe: boolean = false) => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
      } else {
        // If not remember me, clear any existing stored user
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
        await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }, []);

  // Load user from storage
  const loadUserFromStorage = useCallback(async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      
      if (userJson && rememberMe === 'true') {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  }, []);

  // Enhanced login with validation and remember me
  const login = useCallback(async ({ email, password, rememberMe = false }: LoginCredentials) => {
    try {
      setLocalLoading(true);
      setError(null);

      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Call the context login
      await contextLogin(email, password);
      
      // If login successful and remember me is checked, save to storage
      if (rememberMe) {
        // We need to get the user from context after login
        // Since we don't have it yet, we'll use a small delay
        setTimeout(async () => {
          const currentUser = user; // This might not be updated yet
          if (currentUser) {
            await saveUserToStorage(currentUser, true);
          }
        }, 100);
      }

    } catch (error: any) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      Alert.alert('Login Failed', errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [contextLogin, saveUserToStorage, user]);

  // Enhanced logout with storage cleanup
  const logout = useCallback(async () => {
    try {
      setLocalLoading(true);
      
      // Clear storage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.REMEMBER_ME,
      ]);
      
      // Call context logout
      contextLogout();
      
      console.log('User logged out successfully');
      
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout properly');
    } finally {
      setLocalLoading(false);
    }
  }, [contextLogout]);

  // Check auth status on mount
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      const savedUser = await loadUserFromStorage();
      
      if (savedUser) {
        // In a real app, you might want to validate the session with backend
        // For now, we'll just log them in automatically
        console.log('Restoring session for:', savedUser.email);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }, [loadUserFromStorage]);

  // Auto-login from storage on mount
  useEffect(() => {
    const autoLogin = async () => {
      const savedUser = await loadUserFromStorage();
      if (savedUser) {
        try {
          // Validate that the saved user still exists in our mock data
          const users = await mockApi.login(savedUser.email, 'password').catch(() => null);
          if (users) {
            // If successful, log them in
            await contextLogin(savedUser.email, 'password');
          } else {
            // If failed, clear storage
            await AsyncStorage.removeItem(STORAGE_KEYS.USER);
            await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      }
    };

    autoLogin();
  }, []);

  return {
    // State
    user,
    isLoading: isLoading || localLoading,
    isAuthenticated,
    error,
    
    // Actions
    login,
    logout,
    
    // Utilities
    checkAuthStatus,
    clearError,
    
    // Role checks
    isParent,
    isStudent,
    isMentor,
    
    // User info helpers
    getUserDisplayName,
    getUserInitials,
    getDashboardColor,
  };
};

// Specialized hook for Parent role
export const useParentAuth = () => {
  const auth = useAuth();
  
  if (!auth.isParent && auth.isAuthenticated) {
    throw new Error('This hook can only be used by parents');
  }
  
  const getChildren = useCallback(async () => {
    if (!auth.user) return [];
    return await mockApi.getStudents(auth.user.id);
  }, [auth.user]);

  return {
    ...auth,
    getChildren,
  };
};

// Specialized hook for Student role
export const useStudentAuth = () => {
  const auth = useAuth();
  
  if (!auth.isStudent && auth.isAuthenticated) {
    throw new Error('This hook can only be used by students');
  }

  const getUpcomingSessions = useCallback(async () => {
    // This would fetch student's upcoming sessions
    const lessons = await mockApi.getLessons();
    const sessions = await Promise.all(
      lessons.map(lesson => mockApi.getSessionsByLesson(lesson.id))
    );
    return sessions.flat().filter(session => new Date(session.date) > new Date());
  }, []);

  return {
    ...auth,
    getUpcomingSessions,
  };
};

// Specialized hook for Mentor role
export const useMentorAuth = () => {
  const auth = useAuth();
  
  if (!auth.isMentor && auth.isAuthenticated) {
    throw new Error('This hook can only be used by mentors');
  }

  const getAssignedStudents = useCallback(async () => {
    if (!auth.user) return [];
    return await mockApi.getMentorStudents(auth.user.id);
  }, [auth.user]);

  return {
    ...auth,
    getAssignedStudents,
  };
};