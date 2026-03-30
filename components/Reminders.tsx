
import React, { useState } from 'react';
import { Reminder } from '../types';

interface RemindersProps {
  reminders: Reminder[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (reminder: Reminder) => void;
  onTest?: (reminder: Reminder) => void;
}

const QUICK_TEMPLATES = [
  { title: "Water Break", desc: "Time to hydrate!", icon: "💧" },
  { title: "Posture Check", desc: "Sit up straight and stretch.", icon: "🧘" },
  { title: "Deep Breath", desc: "Take a 1-minute breathing break.", icon: "🌬️" },
  { title: "Sunlight", desc: "Step outside for some fresh air.", icon: "☀️" },
];

const Reminders: React.FC<RemindersProps> = ({ reminders, onToggle, onDelete, onAdd, onTest }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [newReminder, setNewReminder] = useState({
    title: '',
    desc: '',
    time: '09:00',
    icon: '🔔'
  });

  const handleAdd = () => {
    if (!newReminder.title.trim()) {
      setError('Please enter a title for your reminder');
      return;
    }
    setError('');
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      ...newReminder,
      active: true
    });
    setNewReminder({ title: '', desc: '', time: '09:00', icon: '🔔' });
    setIsAdding(false);
  };

  const useTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setNewReminder({ ...newReminder, title: template.title, desc: template.desc, icon: template.icon });
    setIsAdding(true);
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Reminders</h2>
          <p className="text-gray-500 font-bold">Stay on track with your wellness goals.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#f4a7a7] text-gray-900 px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-[#ef9393] transition active:scale-95"
        >
          + Add New
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-[#f4a7a7] space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-gray-800">New Reminder</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 font-black">✕</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Title</label>
                <input 
                  type="text" 
                  value={newReminder.title}
                  onChange={(e) => { setNewReminder({...newReminder, title: e.target.value}); if(error) setError(''); }}
                  placeholder="e.g., Evening Meditation"
                  className={`w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 transition ${error ? 'ring-2 ring-red-400' : 'focus:ring-[#f4a7a7]'}`}
                />
                {error && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{error}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Description</label>
                <input 
                  type="text" 
                  value={newReminder.desc}
                  onChange={(e) => setNewReminder({...newReminder, desc: e.target.value})}
                  placeholder="What should we remind you of?"
                  className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#f4a7a7] transition"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Time</label>
                <input 
                  type="time" 
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  className="w-full p-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#f4a7a7] transition font-black text-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Icon</label>
                <div className="flex space-x-2">
                  {['🔔', '💧', '🧘', '☀️', '🌙', '💊'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setNewReminder({...newReminder, icon: emoji})}
                      className={`text-2xl p-3 rounded-xl transition ${newReminder.icon === emoji ? 'bg-[#f4a7a7] shadow-inner' : 'bg-gray-50 hover:bg-gray-100'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleAdd}
              className="w-full bg-[#7c69f0] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-[#6b58e0] transition"
            >
              Set Reminder
            </button>
          </div>
        </div>
      )}

      {/* Quick Templates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_TEMPLATES.map((t, i) => (
          <button 
            key={i}
            onClick={() => useTemplate(t)}
            className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition text-left group"
          >
            <span className="text-2xl block mb-2 group-hover:scale-110 transition">{t.icon}</span>
            <span className="font-bold text-gray-800 text-sm block">{t.title}</span>
          </button>
        ))}
      </div>

      {/* Reminder List */}
      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
            <p className="text-gray-400 font-bold">No reminders set yet. Start by adding one!</p>
          </div>
        ) : reminders.map((rem) => (
          <div 
            key={rem.id}
            className={`bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between transition ${!rem.active ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-[#f7f9f2] rounded-3xl flex items-center justify-center text-3xl shadow-inner">
                {rem.icon}
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-800">{rem.title}</h4>
                <p className="text-sm text-gray-500 font-bold">{rem.desc}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-[#f4a7a7]/10 text-[#f4a7a7] rounded-full text-xs font-black uppercase tracking-widest">
                  Daily at {rem.time}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {onTest && (
                <button 
                  onClick={() => onTest(rem)}
                  className="p-3 text-gray-300 hover:text-indigo-400 transition"
                  title="Test Notification"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              )}
              <button 
                onClick={() => onToggle(rem.id)}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out ${rem.active ? 'bg-[#7c69f0]' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ${rem.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
              <button 
                onClick={() => onDelete(rem.id)}
                className="p-3 text-gray-300 hover:text-red-400 transition"
                title="Delete Reminder"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;
