
export enum ViewState {
  FRONT = 'FRONT',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD'
}

export interface UserData {
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  profilePic?: string;
  registrationDate?: string;
  lastLogin?: string;
}

export interface MoodEntry {
  mood: string;
  timestamp: Date;
  label: string;
  note?: string;
  categories?: string[];
  intensity?: number;
}

export interface JournalEntry {
  id: string;
  text: string;
  timestamp: Date;
  type: 'general' | 'gratitude';
  extraGratitude?: {
    smile: string;
    person: string;
    goodThing: string;
  };
}

export interface Reminder {
  id: string;
  title: string;
  desc: string;
  time: string; // HH:mm format
  icon: string;
  active: boolean;
}

export interface Article {
  title: string;
  readTime: string;
  content: string;
}

export type AssessmentType = 'anxiety' | 'depression' | 'stress';

export interface AssessmentQuestion {
  id: number;
  text: string;
  options: { label: string; value: number }[];
}

// Only supported values for nano banana and Imagen models
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface Message {
  role: 'user' | 'model';
  text: string;
  grounding?: any[];
  thinking?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

export interface DailyTask {
  id: string;
  text: string;
  category: string;
  icon: string;
}

export interface CompletedTask {
  taskId: string;
  taskText: string;
  timestamp: Date;
}
