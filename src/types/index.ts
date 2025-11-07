export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  favoriteGenres: string[];
  workoutTypes: string[];
  interests: string[];
  goals: string[];
  productivity: string[];
  entertainment: string[];
  communication: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'movie' | 'show' | 'workout' | 'goal' | 'other';
  category: string;
  dueDate?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'multiple' | 'single' | 'text';
  options?: string[];
  category: keyof UserPreferences;
}