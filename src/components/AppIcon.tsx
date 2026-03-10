import React from 'react';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

type IconType = 'Ionicons' | 'MaterialIcons' | 'Feather';

interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
  type?: IconType;
}

export const AppIcon: React.FC<AppIconProps> = ({ 
  name, 
  size = 24, 
  color = '#000',
  type = 'Ionicons' 
}) => {
  switch (type) {
    case 'MaterialIcons':
      return <MaterialIcons name={name as any} size={size} color={color} />;
    case 'Feather':
      return <Feather name={name as any} size={size} color={color} />;
    default:
      return <Ionicons name={name as any} size={size} color={color} />;
  }
};

// Icon name mappings for common icons
export const ICON_NAMES = {
  // Navigation
  back: 'chevron-back',
  forward: 'chevron-forward',
  menu: 'menu',
  
  // Actions
  add: 'add',
  edit: 'create',
  delete: 'trash',
  logout: 'log-out-outline',
  
  // Students/Lessons
  student: 'person',
  students: 'people',
  lesson: 'book',
  lessons: 'books',
  session: 'calendar',
  
  // Status
  success: 'checkmark-circle',
  error: 'alert-circle',
  warning: 'warning',
  info: 'information-circle',
  
  // Subjects
  math: 'calculator',
  physics: 'flask',
  english: 'book',
  
  // UI
  close: 'close',
  search: 'search',
  settings: 'settings',
  profile: 'person-circle',
  
  // Empty states
  empty: 'folder-open',
  emptyStudents: 'people-outline',
  emptyLessons: 'book-outline',
  emptySessions: 'calendar-outline',
};