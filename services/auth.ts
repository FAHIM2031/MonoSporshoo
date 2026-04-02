
import { UserData } from '../types';
import { supabase } from './supabase';

export interface UserAccount extends UserData {
  password?: string;
}

export const AuthService = {
  // Register a new user
  register: async (data: UserAccount): Promise<{ success: boolean; message: string; user?: UserData }> => {
    try {
      if (!data.password) {
        return { success: false, message: 'Password is required' };
      }

      // Sign up with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: 'Failed to create user' };
      }

      // Wait a moment for auth to be fully established
      await new Promise(resolve => setTimeout(resolve, 500));

      const now = new Date().toISOString();

      // Insert user profile with explicit user ID
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          age: data.age,
          gender: data.gender,
          registration_date: now,
          last_login: now,
        }, { count: 'exact' });

      if (profileError) {
        // If profile creation fails, attempt to delete the auth user
        await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {});
        return { success: false, message: 'Failed to create profile. Please try again.' };
      }

      // Create empty user state
      const { error: stateError } = await supabase
        .from('user_state')
        .insert({
          user_id: authData.user.id,
          moods: [],
          journals: [],
          reminders: [],
          chats: [],
          completed_tasks: [],
          current_daily_task: null,
        });

      if (stateError) {
        return { success: false, message: 'Failed to initialize state. Please try again.' };
      }

      const sessionUser: UserData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        age: data.age,
        gender: data.gender,
        registrationDate: now,
        lastLogin: now,
      };

      return { success: true, message: 'Registration successful', user: sessionUser };
    } catch (err) {
      return { success: false, message: 'An unexpected error occurred during registration' };
    }
  },

  // Login existing user
  login: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: UserData }> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { success: false, message: authError.message };
      }

      if (!authData.user) {
        return { success: false, message: 'Login failed' };
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        return { success: false, message: 'Failed to fetch user profile' };
      }

      // Update last login
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', authData.user.id);

      const sessionUser: UserData = {
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        age: profile.age,
        gender: profile.gender,
        profilePic: profile.profile_pic,
        registrationDate: profile.registration_date,
        lastLogin: profile.last_login,
      };

      return { success: true, message: 'Login successful', user: sessionUser };
    } catch (err) {
      return { success: false, message: 'An unexpected error occurred during login' };
    }
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
  },

  // Get current logged in user
  getCurrentUser: async (): Promise<UserData | null> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session || !sessionData.session.user) {
        return null;
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();

      if (error || !profile) {
        return null;
      }

      return {
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        age: profile.age,
        gender: profile.gender,
        profilePic: profile.profile_pic,
        registrationDate: profile.registration_date,
        lastLogin: profile.last_login,
      };
    } catch (err) {
      return null;
    }
  },

  // Update profile picture
  updateProfilePicture: async (email: string, base64: string): Promise<UserData | null> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session?.user) {
        return null;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ profile_pic: base64 })
        .eq('id', sessionData.session.user.id);

      if (error) {
        return null;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();

      if (!profile) {
        return null;
      }

      return {
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        age: profile.age,
        gender: profile.gender,
        profilePic: profile.profile_pic,
        registrationDate: profile.registration_date,
        lastLogin: profile.last_login,
      };
    } catch (err) {
      return null;
    }
  },

  // Verify password for current session (for locked journal access)
  verifyPassword: async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return !error;
    } catch (err) {
      return false;
    }
  },
};
