import { User, Student, Lesson, Session } from '../navigation/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Parent',
    email: 'parent@mentora.com',
    role: 'parent',
  },
  {
    id: '2',
    name: 'Alex Student',
    email: 'student@mentora.com',
    role: 'student',
  },
  {
    id: '3',
    name: 'Sarah Mentor',
    email: 'mentor@mentora.com',
    role: 'mentor',
  },
];

// Mock Students (for parent)
export const mockStudents: Student[] = [
  {
    id: '101',
    name: 'Emma',
    surname: 'Parent',
    email: 'emma@student.com',
    dateOfBirth: '2015-03-15',
    parentId: '1',
  },
  {
    id: '102',
    name: 'James',
    surname: 'Parent',
    email: 'james@student.com',
    dateOfBirth: '2017-08-22',
    parentId: '1',
  },
];

// Mock Lessons
export const mockLessons: Lesson[] = [
  {
    id: '201',
    name: 'Mathematics',
    description: 'Learn numbers, algebra, and geometry',
    icon: 'calculator',
  },
  {
    id: '202',
    name: 'Physics',
    description: 'Explore the laws of nature and energy',
    icon: 'flask',
  },
  {
    id: '203',
    name: 'English',
    description: 'Improve reading, writing, and communication',
    icon: 'book',
  },
];

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: '301',
    lessonId: '201',
    topic: 'Algebra Basics',
    date: '2024-03-15',
    summary: 'Introduction to variables, expressions, and equations',
  },
  {
    id: '302',
    lessonId: '201',
    topic: 'Linear Equations',
    date: '2024-03-22',
    summary: 'Solving linear equations with one variable',
  },
  {
    id: '303',
    lessonId: '202',
    topic: 'Newton\'s Laws',
    date: '2024-03-16',
    summary: 'Understanding force, mass, and acceleration',
  },
  {
    id: '304',
    lessonId: '202',
    topic: 'Energy Conservation',
    date: '2024-03-23',
    summary: 'Kinetic and potential energy principles',
  },
  {
    id: '305',
    lessonId: '203',
    topic: 'Grammar Fundamentals',
    date: '2024-03-17',
    summary: 'Parts of speech and sentence structure',
  },
  {
    id: '306',
    lessonId: '203',
    topic: 'Essay Writing',
    date: '2024-03-24',
    summary: 'Structuring paragraphs and arguments',
  },
];

// Mentor's assigned students
export const mentorStudents = [mockStudents[0]]; // Mentor has Emma assigned

// Mock API service
export const mockApi = {
  // Auth
  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user && password === 'password') {
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  // Parent endpoints
  getStudents: (parentId: string): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStudents.filter(s => s.parentId === parentId));
      }, 500);
    });
  },

  createStudent: (student: Omit<Student, 'id'>): Promise<Student> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStudent = {
          ...student,
          id: Math.random().toString(36).substr(2, 9),
        };
        mockStudents.push(newStudent);
        resolve(newStudent);
      }, 800);
    });
  },

  // Mentor endpoints
  getMentorStudents: (mentorId: string): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mentorStudents);
      }, 500);
    });
  },

  // Common endpoints
  getLessons: (): Promise<Lesson[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockLessons);
      }, 500);
    });
  },

  getSessionsByLesson: (lessonId: string): Promise<Session[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSessions.filter(s => s.lessonId === lessonId));
      }, 500);
    });
  },

  getSessionById: (sessionId: string): Promise<Session | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSessions.find(s => s.id === sessionId));
      }, 300);
    });
  },
};