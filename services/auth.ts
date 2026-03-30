
import { UserData } from '../types';

const USERS_KEY = 'monosporsho_users';
const SESSION_KEY = 'monosporsho_session';

export interface UserAccount extends UserData {
  password?: string;
}

export const AuthService = {
  // Register a new user
  register: async (data: UserAccount): Promise<{ success: boolean; message: string; user?: UserData }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users: UserAccount[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find(u => u.phone === data.phone)) {
      return { success: false, message: 'Phone number already registered' };
    }

    const now = new Date().toISOString();
    data.registrationDate = now;
    data.lastLogin = now;
    users.push(data);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto-login after registration
    const sessionUser = { ...data };
    delete sessionUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    return { success: true, message: 'Registration successful', user: sessionUser };
  },

  // Login existing user
  login: async (phone: string, password: string): Promise<{ success: boolean; message: string; user?: UserData }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users: UserAccount[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.phone === phone && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid phone number or password' };
    }

    const now = new Date().toISOString();
    user.lastLogin = now;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    return { success: true, message: 'Login successful', user: sessionUser };
  },

  // Verify password for a user (without changing session)
  verifyPassword: (phone: string, password: string): boolean => {
    const users: UserAccount[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.some(u => u.phone === phone && u.password === password);
  },

  // Update profile picture
  updateProfilePicture: (phone: string, base64: string): UserData | null => {
    const users: UserAccount[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.phone === phone);
    
    if (userIndex === -1) return null;

    users[userIndex].profilePic = base64;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const sessionUser: UserData = JSON.parse(session);
      if (sessionUser.phone === phone) {
        sessionUser.profilePic = base64;
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        return sessionUser;
      }
    }
    return null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Get current logged in user
  getCurrentUser: (): UserData | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};
