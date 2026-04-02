
import { MoodEntry, JournalEntry, Reminder, ChatSession, DailyTask, CompletedTask } from '../types';
import { supabase } from './supabase';

export const DatabaseService = {
  // Save user specific data
  saveUserData: async (data: { 
    moods: MoodEntry[], 
    journals: JournalEntry[], 
    reminders: Reminder[], 
    chats?: ChatSession[],
    completedTasks?: CompletedTask[],
    currentDailyTask?: DailyTask | null
  }): Promise<boolean> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        return false;
      }

      const { error } = await supabase
        .from('user_state')
        .update({
          moods: data.moods,
          journals: data.journals,
          reminders: data.reminders,
          chats: data.chats || [],
          completed_tasks: data.completedTasks || [],
          current_daily_task: data.currentDailyTask || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', sessionData.session.user.id);

      return !error;
    } catch (err) {
      return false;
    }
  },

  // Load user specific data
  getUserData: async (): Promise<{ 
    moods: MoodEntry[], 
    journals: JournalEntry[], 
    reminders: Reminder[], 
    chats: ChatSession[],
    completedTasks: CompletedTask[],
    currentDailyTask: DailyTask | null
  }> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        return { 
          moods: [], 
          journals: [], 
          reminders: [], 
          chats: [], 
          completedTasks: [], 
          currentDailyTask: null 
        };
      }

      const { data: userState, error } = await supabase
        .from('user_state')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .single();

      if (error || !userState) {
        return { 
          moods: [], 
          journals: [], 
          reminders: [], 
          chats: [], 
          completedTasks: [], 
          currentDailyTask: null 
        };
      }

      // Convert timestamps from strings to Date objects
      return {
        moods: (userState.moods || []).map((m: any) => ({ 
          ...m, 
          timestamp: new Date(m.timestamp) 
        })),
        journals: (userState.journals || []).map((j: any) => ({ 
          ...j, 
          timestamp: new Date(j.timestamp) 
        })),
        reminders: userState.reminders || [],
        chats: (userState.chats || []).map((c: any) => ({ 
          ...c, 
          timestamp: new Date(c.timestamp) 
        })),
        completedTasks: (userState.completed_tasks || []).map((t: any) => ({ 
          ...t, 
          timestamp: new Date(t.timestamp) 
        })),
        currentDailyTask: userState.current_daily_task || null,
      };
    } catch (err) {
      return { 
        moods: [], 
        journals: [], 
        reminders: [], 
        chats: [], 
        completedTasks: [], 
        currentDailyTask: null 
      };
    }
  }
};
