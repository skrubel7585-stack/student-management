export type RootStackParamList = {
  Auth: undefined;
  Parent: undefined;
  Student: undefined;
  Mentor: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

// Parent Navigation Types
export type ParentStackParamList = {
  ParentTabs: undefined;  // This contains the tab navigator
  StudentLessons: { 
    studentId: string; 
    studentName: string 
  };
  LessonsList: undefined;
  LessonDetail: { 
    lessonId: string; 
    lessonName: string 
  };
  SessionDetail: { 
    sessionId: string; 
    sessionData?: any 
  };
};

export type ParentTabParamList = {
  ParentDashboard: undefined;
  Students: undefined;
  Schedule: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Student Navigation Types
export type StudentStackParamList = {
  StudentTabs: undefined;
  StudentLessons: { 
    studentId: string; 
    studentName: string 
  };
  LessonsList: undefined;
  LessonDetail: { 
    lessonId: string; 
    lessonName: string 
  };
  SessionDetail: { 
    sessionId: string; 
    sessionData?: any 
  };
};

export type StudentTabParamList = {
  StudentDashboard: undefined;
  Lessons: undefined;
  Sessions: undefined;
  Messages: undefined;
  Profile: undefined;
};

// Mentor Navigation Types
export type MentorStackParamList = {
  MentorTabs: undefined;
  MentorStudentLessons: { 
    studentId: string; 
    studentName: string 
  };
  LessonsList: undefined;
  LessonDetail: { 
    lessonId: string; 
    lessonName: string 
  };
  SessionDetail: { 
    sessionId: string; 
    sessionData?: any 
  };
};

export type MentorTabParamList = {
  MentorDashboard: undefined;
  MentorStudents: undefined;
  MentorSessions: undefined;
  MentorFeedback: undefined;
  MentorAnalytics: undefined;
};

// User Types
export type UserRole = 'parent' | 'student' | 'mentor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student {
  id: string;
  name: string;
  surname: string;
  email: string;
  dateOfBirth: string;
  parentId: string;
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Session {
  id: string;
  lessonId: string;
  topic: string;
  date: string;
  summary: string;
}