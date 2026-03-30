
import { MoodEntry, JournalEntry, Reminder, ChatSession, DailyTask, CompletedTask } from '../types';

const DATA_PREFIX = 'monosporsho_data_';

export const DatabaseService = {
  // Save user specific data
  saveUserData: (phone: string, data: { 
    moods: MoodEntry[], 
    journals: JournalEntry[], 
    reminders: Reminder[], 
    chats?: ChatSession[],
    completedTasks?: CompletedTask[],
    currentDailyTask?: DailyTask | null
  }) => {
    localStorage.setItem(`${DATA_PREFIX}${phone}`, JSON.stringify(data));
  },

  // Load user specific data
  getUserData: (phone: string): { 
    moods: MoodEntry[], 
    journals: JournalEntry[], 
    reminders: Reminder[], 
    chats: ChatSession[],
    completedTasks: CompletedTask[],
    currentDailyTask: DailyTask | null
  } => {
    const data = localStorage.getItem(`${DATA_PREFIX}${phone}`);
    if (!data) return { moods: [], journals: [], reminders: [], chats: [], completedTasks: [], currentDailyTask: null };
    
    // Parse and convert string dates back to Date objects
    const parsed = JSON.parse(data);
    return {
      moods: (parsed.moods || []).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
      journals: (parsed.journals || []).map((j: any) => ({ ...j, timestamp: new Date(j.timestamp) })),
      reminders: parsed.reminders || [],
      chats: (parsed.chats || []).map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })),
      completedTasks: (parsed.completedTasks || []).map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) })),
      currentDailyTask: parsed.currentDailyTask || null
    };
  }
};
