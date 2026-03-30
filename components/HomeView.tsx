
import React, { useEffect } from 'react';
import { UserData, DailyTask } from '../types';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface HomeViewProps {
  user: UserData;
  onNavigate: (segment: any) => void;
  currentTask: DailyTask | null;
  onUpdateTask: (task: DailyTask) => void;
  onCompleteTask: (task: DailyTask) => void;
}

const TASKS: DailyTask[] = [
  { id: '1', text: "Drink 8 glasses of water", category: "Hydration", icon: "💧" },
  { id: '2', text: "Take a 15-minute walk", category: "Exercise", icon: "🚶" },
  { id: '3', text: "Meditate for 5 minutes", category: "Mindfulness", icon: "🧘" },
  { id: '4', text: "Write down 3 things you're grateful for", category: "Journaling", icon: "📝" },
  { id: '5', text: "Read 10 pages of a book", category: "Learning", icon: "📚" },
  { id: '6', text: "Stretch for 10 minutes", category: "Exercise", icon: "🤸" },
  { id: '7', text: "Call or text a loved one", category: "Social", icon: "📞" },
  { id: '8', text: "Eat a serving of fruit or vegetables", category: "Nutrition", icon: "🍎" },
  { id: '9', text: "No social media for 1 hour", category: "Digital Detox", icon: "📵" },
  { id: '10', text: "Practice deep breathing for 2 minutes", category: "Mindfulness", icon: "🌬️" },
];

const HomeView: React.FC<HomeViewProps> = ({ user, onNavigate, currentTask, onUpdateTask, onCompleteTask }) => {
  
  useEffect(() => {
    if (!currentTask) {
      generateNewTask();
    }
  }, [currentTask]);

  const generateNewTask = () => {
    const randomIndex = Math.floor(Math.random() * TASKS.length);
    onUpdateTask(TASKS[randomIndex]);
  };

  return (
    <div className="w-full max-w-4xl space-y-6 md:space-y-8 animate-fade-in">
      <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border border-[#fbdcdc]">
        <h2 className="text-2xl md:text-4xl font-black text-gray-900">Welcome, {user.name}</h2>
        <p className="mt-3 text-gray-500 font-bold text-base md:text-xl">Your wellness dashboard is ready for you.</p>
        
        {/* Daily Task Section */}
        <div className="mt-10 p-6 md:p-8 bg-gradient-to-br from-[#f4a7a7]/10 to-[#fbdcdc]/5 rounded-[2rem] border border-[#f4a7a7]/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-4xl">
                {currentTask?.icon || '✨'}
              </div>
              <div>
                <p className="text-[10px] font-black text-[#f4a7a7] uppercase tracking-widest mb-1">Daily Wellness Task</p>
                <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">
                  {currentTask?.text || 'Generating your task...'}
                </h3>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tighter">{currentTask?.category}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button 
                onClick={generateNewTask}
                className="p-4 bg-white text-gray-400 hover:text-[#f4a7a7] rounded-2xl shadow-sm hover:shadow-md transition active:scale-95 border border-gray-50"
                title="Refresh Task"
              >
                <RefreshCw size={24} strokeWidth={3} />
              </button>
              <button 
                onClick={() => currentTask && onCompleteTask(currentTask)}
                className="flex-1 md:flex-none px-8 py-4 bg-[#f4a7a7] text-white rounded-2xl shadow-lg hover:bg-[#ef9393] transition active:scale-95 font-black flex items-center justify-center space-x-3"
              >
                <CheckCircle2 size={20} strokeWidth={3} />
                <span>Mark as Done</span>
              </button>
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute -right-10 -bottom-10 text-9xl opacity-5 pointer-events-none">
            {currentTask?.icon}
          </div>
        </div>

        <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          <div 
            className="p-6 md:p-8 bg-[#f7f9f2] rounded-3xl border border-gray-100 cursor-pointer hover:shadow-xl transition group" 
            onClick={() => onNavigate('summary')}
          >
            <div className="text-4xl mb-4 group-hover:scale-125 transition">📊</div>
            <h3 className="font-black text-gray-800 text-lg">My Stats</h3>
            <p className="text-sm text-gray-400 font-bold">Summary</p>
          </div>
          <div 
            className="p-6 md:p-8 bg-[#f7f9f2] rounded-3xl border border-gray-100 cursor-pointer hover:shadow-xl transition group" 
            onClick={() => onNavigate('mood')}
          >
            <div className="text-4xl mb-4 group-hover:scale-125 transition">😊</div>
            <h3 className="font-black text-gray-800 text-lg">Check-in</h3>
            <p className="text-sm text-gray-400 font-bold">Log mood</p>
          </div>
          <div 
            className="p-6 md:p-8 bg-[#f7f9f2] rounded-3xl border border-gray-100 cursor-pointer hover:shadow-xl transition group" 
            onClick={() => onNavigate('journal')}
          >
            <div className="text-4xl mb-4 group-hover:scale-125 transition">📒</div>
            <h3 className="font-black text-gray-800 text-lg">Journal</h3>
            <p className="text-sm text-gray-400 font-bold">Write ideas</p>
          </div>
          <div 
            className="p-6 md:p-8 bg-[#f7f9f2] rounded-3xl border border-gray-100 cursor-pointer hover:shadow-xl transition group" 
            onClick={() => onNavigate('assessment')}
          >
            <div className="text-4xl mb-4 group-hover:scale-125 transition">📝</div>
            <h3 className="font-black text-gray-800 text-lg">Screening</h3>
            <p className="text-sm text-gray-400 font-bold">Health check</p>
          </div>
          <div 
            className="p-6 md:p-8 bg-[#f7f9f2] rounded-3xl border border-gray-100 cursor-pointer hover:shadow-xl transition group" 
            onClick={() => onNavigate('exercises')}
          >
            <div className="text-4xl mb-4 group-hover:scale-125 transition">🧘</div>
            <h3 className="font-black text-gray-800 text-lg">Exercises</h3>
            <p className="text-sm text-gray-400 font-bold">Guided</p>
          </div>
          <div 
            className="p-6 md:p-8 bg-[#f7f9f2] rounded-3xl border border-gray-100 cursor-pointer hover:shadow-xl transition group" 
            onClick={() => onNavigate('reminders')}
          >
            <div className="text-4xl mb-4 group-hover:scale-125 transition">🔔</div>
            <h3 className="font-black text-gray-800 text-lg">Alerts</h3>
            <p className="text-sm text-gray-400 font-bold">Reminders</p>
          </div>
          <div 
            className="p-6 md:p-8 bg-[#f7f9f2] rounded-3xl border border-gray-100 cursor-pointer hover:shadow-xl transition group" 
            onClick={() => onNavigate('assistant')}
          >
            <div className="text-4xl mb-4 group-hover:scale-125 transition">🤖</div>
            <h3 className="font-black text-gray-800 text-lg">Assistant</h3>
            <p className="text-sm text-gray-400 font-bold">Talk to AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
