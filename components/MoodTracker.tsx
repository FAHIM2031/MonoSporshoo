
import React, { useState, useMemo } from 'react';
import { MoodEntry } from '../types';

interface MoodTrackerProps {
  history: MoodEntry[];
  onSave: (entry: MoodEntry) => void;
}

const moodEmojis = [
  { mood: '😊', label: 'Happy' },
  { mood: '😔', label: 'Sad' },
  { mood: '😠', label: 'Angry' },
  { mood: '😨', label: 'Anxious' },
  { mood: '😴', label: 'Tired' },
  { mood: '😐', label: 'Neutral' },
  { mood: '😌', label: 'Calm' },
  { mood: '🥳', label: 'Energetic' }
];

type MoodStage = 'emoji' | 'details' | 'intensity' | 'saved' | 'history' | 'records';
type RecordView = 'weekly' | 'monthly';

const MoodTracker: React.FC<MoodTrackerProps> = ({ history, onSave }) => {
  const [stage, setStage] = useState<MoodStage>('emoji');
  const [recordView, setRecordView] = useState<RecordView>('monthly');
  const [selectedMood, setSelectedMood] = useState<{emoji: string, label: string} | null>(null);
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(50);

  const handleSave = () => {
    if (!selectedMood) return;
    onSave({
      mood: selectedMood.emoji,
      label: selectedMood.label,
      timestamp: new Date(),
      note: note || undefined,
      intensity
    });
    setStage('saved');
  };

  const handleSkipIntensity = () => {
    handleSave();
  };

  const reset = () => {
    setSelectedMood(null);
    setNote('');
    setIntensity(50);
    setStage('emoji');
  };

  const getAggregatedMoods = (days: number) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const filtered = history.filter(m => m.timestamp >= cutoff);
    const counts: Record<string, number> = {};
    filtered.forEach(m => { counts[m.mood] = (counts[m.mood] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  // Generate grid for Monthly View
  const monthlyGrid = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const grid = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const entry = history.find(h => {
        const d = h.timestamp;
        return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
      });
      grid.push({ day, mood: entry ? entry.mood : null });
    }
    return grid;
  }, [history]);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in space-y-8 md:space-y-12">
      <div className="w-full flex items-center justify-between px-2">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Mood Tracker</h2>
        <button 
          onClick={() => setStage('records')}
          className="text-3xl md:text-5xl hover:scale-110 transition active:scale-95 bg-white p-2 md:p-4 rounded-3xl shadow-sm border border-gray-50"
        >
          📅
        </button>
      </div>

      {stage === 'records' ? (
        <div className="w-full flex flex-col items-center space-y-8 animate-fade-in min-h-[600px] bg-[#e2f0fd] p-6 md:p-10 rounded-[3rem]">
          {/* Toggle Header */}
          <div className="w-full flex justify-between px-8 text-xl font-bold mb-4">
             <button 
               onClick={() => setRecordView('weekly')} 
               className={`transition-colors ${recordView === 'weekly' ? 'text-gray-900' : 'text-gray-400'}`}
             >
               Weekly
             </button>
             <button 
               onClick={() => setRecordView('monthly')} 
               className={`transition-colors ${recordView === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}
             >
               Monthly
             </button>
          </div>

          {recordView === 'monthly' ? (
            /* Monthly Grid View */
            <div className="w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-lg border border-white/50 space-y-8">
              <div className="grid grid-cols-8 md:grid-cols-10 gap-3 md:gap-4 justify-items-center">
                {monthlyGrid.map((item, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${item.mood ? 'scale-110' : 'bg-gray-200'}`}
                  >
                    {item.mood ? <span className="text-2xl md:text-3xl">{item.mood}</span> : null}
                  </div>
                ))}
                {/* Pad out the grid to keep it consistent if month is short */}
                {Array.from({ length: 40 - monthlyGrid.length }).map((_, i) => (
                   <div key={`pad-${i}`} className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-200 opacity-20"></div>
                ))}
              </div>
            </div>
          ) : (
            /* Weekly Trends View ( Aggregated ) */
            <div className="w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-lg border border-white/50 space-y-6">
              <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Last 7 Days Aggregation</h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {getAggregatedMoods(7).length === 0 ? (
                  <p className="text-center py-10 text-gray-500 font-bold italic">No entries this week.</p>
                ) : getAggregatedMoods(7).map(([emoji, count], i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                     <div className="flex items-center space-x-4">
                       <span className="text-4xl">{emoji}</span>
                       <span className="font-bold text-gray-700">{moodEmojis.find(m => m.mood === emoji)?.label || 'Mood'}</span>
                     </div>
                     <span className="text-xl font-black text-gray-900">{count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col space-y-4 pt-4">
            <button 
              onClick={() => alert("Insights: You've been most consistent with 'Happy' vibes this month! Keep up the self-care.")}
              className="w-full bg-[#7c69f0] py-4 md:py-6 rounded-3xl font-bold text-xl md:text-2xl text-white shadow-xl active:scale-[0.98] transition"
            >
              View insights
            </button>
            <button 
              onClick={() => setStage('emoji')}
              className="w-full bg-[#d1d5db] py-4 md:py-6 rounded-3xl font-bold text-xl md:text-2xl text-gray-700 shadow-sm active:scale-[0.98] transition"
            >
              Back
            </button>
          </div>
        </div>
      ) : stage === 'emoji' ? (
        <div className="w-full flex flex-col items-center space-y-10">
          <div className="w-full max-w-3xl bg-[#d7e9f7] rounded-[3rem] p-8 md:p-20 shadow-lg flex flex-col items-center space-y-12">
            <h3 className="text-2xl md:text-4xl font-semibold text-gray-800 text-center">How are you feeling today?</h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-10">
              {moodEmojis.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedMood({ emoji: item.mood, label: item.label })} 
                  className={`text-5xl md:text-7xl hover:scale-125 transition duration-200 p-2 rounded-2xl ${selectedMood?.emoji === item.mood ? 'bg-white/40 shadow-inner' : ''}`}
                >
                  {item.mood}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setStage('details')} 
            disabled={!selectedMood} 
            className="w-full max-w-3xl bg-[#7c69f0] py-4 md:py-6 rounded-3xl font-bold text-xl md:text-2xl text-white shadow-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      ) : stage === 'details' ? (
        <div className="w-full max-w-2xl flex flex-col items-center space-y-8">
          <div className="w-full bg-[#fde9e9] rounded-[2.5rem] p-12 shadow-md border border-[#fbdcdc] space-y-8 flex flex-col items-center">
            <textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="Context (Optional)" 
              className="w-full bg-[#ecd4d4] rounded-3xl p-6 text-xl font-medium text-gray-600 placeholder-gray-400 resize-none h-40 border-none focus:ring-0 shadow-inner" 
            />
          </div>
          <button onClick={() => setStage('intensity')} className="w-full bg-[#7c69f0] py-4 md:py-6 rounded-3xl font-bold text-xl md:text-2xl text-white shadow-lg">Next</button>
        </div>
      ) : stage === 'intensity' ? (
        <div className="w-full max-w-3xl flex flex-col items-center space-y-8 md:space-y-12 animate-fade-in">
          <div className="w-full bg-[#fff1f1] rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-[#fbdcdc] space-y-10 flex flex-col relative overflow-hidden">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-800">How strong is this feeling?</h3>
            
            <div className="relative pt-6 pb-12 w-full">
              <div className="absolute top-[34px] left-0 w-full h-[10px] bg-gray-200 rounded-full"></div>
              <div 
                className="absolute top-[34px] left-0 h-[10px] bg-[#7c69f0] rounded-full transition-all duration-75" 
                style={{ width: `${intensity}%` }}
              ></div>
              
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={intensity} 
                onChange={(e) => setIntensity(parseInt(e.target.value))} 
                className="absolute top-[24px] left-0 w-full h-[30px] opacity-0 cursor-pointer z-10" 
              />
              
              <div 
                className="absolute top-[24px] w-[30px] h-[30px] bg-[#7c69f0] rounded-full shadow-md border-[3px] border-white pointer-events-none transition-all duration-75"
                style={{ left: `calc(${intensity}% - 15px)` }}
              ></div>

              <div className="flex justify-between mt-12 text-gray-400 font-medium text-lg md:text-xl px-2">
                <span>Low</span>
                <span className="ml-4">Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col space-y-4">
            <button 
              onClick={handleSave} 
              className="w-full bg-[#7c69f0] py-4 md:py-6 rounded-3xl font-bold text-xl md:text-2xl text-white shadow-lg active:scale-[0.98] transition"
            >
              Next
            </button>
            <button 
              onClick={handleSkipIntensity}
              className="w-full bg-[#d1d5db] py-4 md:py-6 rounded-3xl font-bold text-xl md:text-2xl text-gray-700 shadow-sm active:scale-[0.98] transition"
            >
              Skip
            </button>
          </div>
        </div>
      ) : stage === 'saved' ? (
        <div className="w-full max-w-2xl flex flex-col items-center space-y-12 animate-fade-in py-20 text-center">
          <div className="text-8xl animate-bounce">🌱</div>
          <h3 className="text-4xl font-black text-gray-800 tracking-tight">Saved Securely</h3>
          <p className="text-gray-500 font-bold">Your feelings have been recorded in your wellness journey.</p>
          <button onClick={() => setStage('records')} className="w-full bg-[#7c69f0] py-4 md:py-6 rounded-3xl font-bold text-xl md:text-2xl text-white shadow-lg transition active:scale-95">View History</button>
        </div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col items-center space-y-10 animate-fade-in">
          <div className="w-full space-y-4">
            {history.map((entry, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <span className="text-5xl">{entry.mood}</span>
                  <div>
                    <p className="font-extrabold text-xl text-gray-800">{entry.label}</p>
                    <p className="text-xs text-gray-400 uppercase font-bold">{entry.timestamp.toLocaleDateString()}</p>
                    {entry.intensity !== undefined && (
                      <div className="mt-1 flex items-center space-x-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#7c69f0]" style={{ width: `${entry.intensity}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-[#7c69f0]">{entry.intensity}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={reset} className="w-full bg-[#d9d9d9] py-6 rounded-3xl font-bold text-xl text-gray-700 shadow-sm transition active:scale-95">Log New Entry</button>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
