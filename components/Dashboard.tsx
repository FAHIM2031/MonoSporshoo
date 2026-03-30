
import React, { useState, useEffect, useMemo } from 'react';
import { UserData, MoodEntry, JournalEntry, Reminder, ChatSession, DailyTask, CompletedTask } from '../types';
import { 
  Home, 
  BarChart2, 
  Smile, 
  BookOpen, 
  Bot, 
  ClipboardCheck, 
  Wind, 
  Library, 
  Bell, 
  User,
  LogOut
} from 'lucide-react';
import { DatabaseService } from '../services/database';
import HomeView from './HomeView';
import MoodTracker from './MoodTracker';
import Journaling from './Journaling';
import AiAssistant from './AiAssistant';
import ProfileView from './ProfileView';
import HealthResources from './HealthResources';
import HealthAssessment from './HealthAssessment';
import Reminders from './Reminders';
import UserSummary from './UserSummary';
import GuidedExercises from './GuidedExercises';

interface DashboardProps {
  user: UserData;
  onLogout: () => void;
  onUpdateUser: (user: UserData) => void;
}

type DashboardSegment = 
  | 'home' 
  | 'mood' 
  | 'journal' 
  | 'assistant' 
  | 'resources'
  | 'assessment'
  | 'exercises'
  | 'reminders'
  | 'summary'
  | 'profile';

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateUser }) => {
  const [activeSegment, setActiveSegment] = useState<DashboardSegment>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Global Data Persistence
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [currentDailyTask, setCurrentDailyTask] = useState<DailyTask | null>(null);
  
  // Notification State
  const [activeNotification, setActiveNotification] = useState<Reminder | null>(null);
  const [lastTriggeredTime, setLastTriggeredTime] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = DatabaseService.getUserData(user.phone);
    setMoodHistory(data.moods);
    setJournalEntries(data.journals);
    setChatHistory(data.chats || []);
    setCompletedTasks(data.completedTasks || []);
    setCurrentDailyTask(data.currentDailyTask);
    const savedReminders = data.reminders;
    if (savedReminders && Array.isArray(savedReminders)) {
      setReminders(savedReminders);
    } else {
      setReminders([
        { id: '1', title: "Daily Mood Check-in", desc: "How are you feeling right now?", time: "09:00", icon: "😊", active: true },
        { id: '2', title: "Evening Reflection", desc: "A great time to journal.", time: "21:30", icon: "🌙", active: true }
      ]);
    }
    setIsLoaded(true);

    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) setHasApiKey(true);
      else if (process.env.API_KEY) setHasApiKey(true);
    };
    checkKey();
  }, [user.phone]);

  // Persist data on change
  useEffect(() => {
    if (isLoaded) {
      DatabaseService.saveUserData(user.phone, { 
        moods: moodHistory, 
        journals: journalEntries, 
        reminders, 
        chats: chatHistory,
        completedTasks,
        currentDailyTask
      });
    }
  }, [moodHistory, journalEntries, reminders, chatHistory, completedTasks, currentDailyTask, user.phone, isLoaded]);

  // Real-time notification engine
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentHHmm = `${hours}:${minutes}`;
      
      if (currentHHmm !== lastTriggeredTime) {
        const triggered = reminders.find(r => r.active && r.time === currentHHmm);
        if (triggered) {
          setActiveNotification(triggered);
          setLastTriggeredTime(currentHHmm);
          
          // Try to play a subtle notification sound
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
          } catch (e) {}

          setTimeout(() => setActiveNotification(null), 15000);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [reminders, lastTriggeredTime]);

  const userAvatarUrl = useMemo(() => {
    if (user.profilePic) return user.profilePic;
    return `https://ui-avatars.com/api/?name=${user.name}&background=f4a7a7&color=fff&size=128`;
  }, [user]);

  const navItems = [
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'summary', label: 'My Summary', icon: BarChart2 },
    { id: 'mood', label: 'Mood Tracking', icon: Smile },
    { id: 'journal', label: 'Journaling', icon: BookOpen },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'assessment', label: 'Health Assessment', icon: ClipboardCheck },
    { id: 'exercises', label: 'Guided Exercises', icon: Wind },
    { id: 'resources', label: 'Health Resources', icon: Library },
    { id: 'reminders', label: 'My Reminders', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const renderContent = () => {
    switch (activeSegment) {
      case 'home':
        return (
          <HomeView 
            user={user} 
            onNavigate={setActiveSegment} 
            currentTask={currentDailyTask}
            onUpdateTask={setCurrentDailyTask}
            onCompleteTask={(task) => {
              setCompletedTasks(prev => [{ taskId: task.id, taskText: task.text, timestamp: new Date() }, ...prev]);
              setCurrentDailyTask(null);
            }}
          />
        );
      case 'summary':
        return (
          <UserSummary 
            user={user} 
            moodHistory={moodHistory} 
            journalEntries={journalEntries} 
            reminders={reminders} 
            completedTasks={completedTasks}
          />
        );
      case 'mood':
        return <MoodTracker history={moodHistory} onSave={(e) => setMoodHistory([e, ...moodHistory])} />;
      case 'journal':
        return (
          <Journaling 
            user={user}
            entries={journalEntries} 
            onSave={(text) => setJournalEntries(prev => [{ id: Math.random().toString(36).substr(2, 9), text, timestamp: new Date(), type: 'general' }, ...prev])} 
            onUpdate={(id, text) => setJournalEntries(prev => prev.map(e => e.id === id ? { ...e, text } : e))}
            onDelete={(id) => setJournalEntries(prev => prev.filter(e => e.id !== id))}
            onGoHome={() => setActiveSegment('home')}
          />
        );
      case 'assistant':
        return (
          <AiAssistant 
            user={user} 
            hasApiKey={hasApiKey} 
            onSelectKey={handleSelectKey} 
            history={chatHistory}
            onSaveSession={(session) => {
              setChatHistory(prev => {
                const index = prev.findIndex(s => s.id === session.id);
                if (index !== -1) {
                  const updated = [...prev];
                  updated[index] = session;
                  return updated;
                }
                return [session, ...prev];
              });
            }}
            onDeleteSession={(id) => setChatHistory(prev => prev.filter(s => s.id !== id))}
          />
        );
      case 'assessment':
        return <HealthAssessment onGoHome={() => setActiveSegment('home')} />;
      case 'exercises':
        return <GuidedExercises />;
      case 'resources':
        return <HealthResources />;
      case 'reminders':
        return (
          <Reminders 
            reminders={reminders}
            onToggle={(id) => setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r))}
            onDelete={(id) => setReminders(reminders.filter(r => r.id !== id))}
            onAdd={(r) => setReminders([...reminders, r])}
            onTest={(r) => {
              setActiveNotification(r);
              setTimeout(() => setActiveNotification(null), 5000);
            }}
          />
        );
      case 'profile':
        return <ProfileView user={user} avatarUrl={userAvatarUrl} onUpdateUser={onUpdateUser} />;
      default:
        return <HomeView user={user} onNavigate={setActiveSegment} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f7f9f2] overflow-hidden relative">
      {/* Global Notification Banner */}
      {activeNotification && (
        <div className="fixed top-6 right-6 z-[100] animate-bounce w-full max-w-sm px-4">
          <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-2 border-[#f4a7a7] flex items-center space-x-6">
            <div className="text-5xl">{activeNotification.icon}</div>
            <div className="flex-1">
               <h4 className="font-black text-gray-900 text-xl">{activeNotification.title}</h4>
               <p className="text-gray-500 font-bold text-sm">{activeNotification.desc}</p>
            </div>
            <button onClick={() => setActiveNotification(null)} className="text-gray-400 font-black text-2xl hover:text-gray-800 transition">✕</button>
          </div>
        </div>
      )}

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#9ba29a] flex flex-col shadow-xl z-40 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col items-center border-b border-white/10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white p-1 mb-4 shadow-lg overflow-hidden flex items-center justify-center">
            <img src={userAvatarUrl} className="w-full h-full rounded-full object-cover" alt="User Profile" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight text-center truncate w-full px-2">Hi, {user.name}</h2>
          <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1">Mental Health Ally</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 py-6 custom-scrollbar">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveSegment(item.id as DashboardSegment); setIsSidebarOpen(false); }} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 font-bold text-sm ${activeSegment === item.id ? 'bg-white text-gray-800 shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
            >
              <item.icon size={20} strokeWidth={2.5} className={activeSegment === item.id ? 'text-gray-800' : 'text-white/60'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-red-400/20 text-red-100 hover:bg-red-400/30 transition font-bold text-sm">
            <LogOut size={20} strokeWidth={2.5} className="text-red-200/80" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-colors duration-500 ${activeSegment === 'assistant' || activeSegment === 'resources' || activeSegment === 'assessment' || activeSegment === 'summary' ? 'bg-[#fdfbe6]' : 'bg-[#f7f9f2]'}`}>
        <header className="bg-white/80 border-b px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition" onClick={() => setIsSidebarOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10">
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="50" cy="50" r="45" fill="#f4a7a7" fillOpacity="0.2"/><path d="M50 30C40 30 32 38 32 48C32 58 50 75 50 75C50 75 68 58 68 48C68 38 60 30 50 30Z" fill="#f4a7a7"/><circle cx="50" cy="48" r="8" fill="white"/>
               </svg>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">MonoSporsho <span className="hidden sm:inline text-[#f4a7a7] uppercase tracking-tighter ml-2 font-black">{activeSegment}</span></h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-10 flex flex-col items-center">
          {renderContent()}
        </main>
        
        <footer className="bg-white border-t px-4 md:px-8 py-3 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
          © 2025 MonoSporsho Wellness • Secure Local Database
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
