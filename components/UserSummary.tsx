
import React, { useEffect, useState, useMemo } from 'react';
import { MoodEntry, JournalEntry, Reminder, UserData, CompletedTask } from '../types';
import * as gemini from '../services/gemini';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface UserSummaryProps {
  user: UserData;
  moodHistory: MoodEntry[];
  journalEntries: JournalEntry[];
  reminders: Reminder[];
  completedTasks: CompletedTask[];
}

const COLORS = ['#f4a7a7', '#a7c7f4', '#a7f4c7', '#f4e7a7', '#d7a7f4', '#f4a7d7'];

const UserSummary: React.FC<UserSummaryProps> = ({ user, moodHistory, journalEntries, reminders, completedTasks }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const stats = useMemo(() => {
    const totalMoods = moodHistory.length;
    const totalJournals = journalEntries.length;
    const totalTasks = completedTasks.length;
    const avgIntensity = totalMoods > 0 
      ? Math.round(moodHistory.reduce((acc, m) => acc + (m.intensity || 0), 0) / totalMoods) 
      : 0;

    const moodCounts: Record<string, number> = {};
    moodHistory.forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    // Prepare data for Mood Trend (last 7 logs)
    const moodTrendData = [...moodHistory]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-7)
      .map(m => ({
        time: new Date(m.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        intensity: m.intensity || 0,
        label: m.label
      }));

    // Prepare data for Mood Distribution
    const moodDistData = Object.entries(moodCounts).map(([name, value]) => ({
      name,
      value
    }));

    // Prepare data for Activity Consistency (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString([], { weekday: 'short' });
    }).reverse();

    const activityData = last7Days.map(day => {
      const moodsOnDay = moodHistory.filter(m => 
        new Date(m.timestamp).toLocaleDateString([], { weekday: 'short' }) === day
      ).length;
      const journalsOnDay = journalEntries.filter(j => 
        new Date(j.timestamp).toLocaleDateString([], { weekday: 'short' }) === day
      ).length;
      return { day, moods: moodsOnDay, journals: journalsOnDay };
    });

    return { 
      totalMoods, 
      totalJournals, 
      totalTasks,
      avgIntensity, 
      topMood, 
      moodTrendData, 
      moodDistData,
      activityData 
    };
  }, [moodHistory, journalEntries, completedTasks]);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      try {
        const ai = gemini.getAI();
        const prompt = `Based on these stats for a wellness user:
        - Total Mood Logs: ${stats.totalMoods}
        - Total Journal Entries: ${stats.totalJournals}
        - Average Mood Intensity: ${stats.avgIntensity}/100
        - Most common mood: ${stats.topMood}
        
        Provide a 2-sentence encouraging wellness insight for ${user.name}. Be friendly and supportive.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt
        });
        setInsight(response.text || "You're doing a great job staying consistent with your self-care!");
      } catch (e) {
        setInsight("Every step you take towards self-awareness is a victory. Keep up the great work!");
      } finally {
        setLoadingInsight(false);
      }
    };

    if (stats.totalMoods > 0 || stats.totalJournals > 0) {
      fetchInsight();
    } else {
      setInsight("Start logging your moods and journals to see personalized AI insights here!");
    }
  }, [stats, user.name]);

  return (
    <div className="w-full max-w-4xl animate-fade-in space-y-10 pb-20">
      <div className="flex flex-col space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Wellness Analytics</h2>
        <p className="text-gray-500 font-bold">Visualizing your emotional patterns and consistency.</p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Journals</p>
          <p className="text-5xl font-black text-gray-800">{stats.totalJournals}</p>
          <div className="pt-2">
             <span className="bg-indigo-50 text-indigo-500 text-[10px] font-black px-2 py-1 rounded-full uppercase">Reflections</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tasks Done</p>
          <p className="text-5xl font-black text-gray-800">{stats.totalTasks}</p>
          <div className="pt-2">
             <span className="bg-purple-50 text-purple-500 text-[10px] font-black px-2 py-1 rounded-full uppercase">Daily Goals</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Intensity</p>
          <p className="text-5xl font-black text-gray-800">{stats.avgIntensity}%</p>
          <div className="pt-2">
             <span className="bg-orange-50 text-orange-500 text-[10px] font-black px-2 py-1 rounded-full uppercase">Emotional Depth</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Common Mood</p>
          <p className="text-5xl font-black text-gray-800">{stats.topMood}</p>
          <div className="pt-2">
             <span className="bg-green-50 text-green-500 text-[10px] font-black px-2 py-1 rounded-full uppercase">Base State</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Trend Chart */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Mood Intensity Trend</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Last 7 Logs</span>
          </div>
          <div className="h-64 w-full">
            {stats.moodTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.moodTrendData}>
                  <defs>
                    <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f4a7a7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f4a7a7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} 
                  />
                  <YAxis 
                    hide 
                    domain={[0, 100]} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="#f4a7a7" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorIntensity)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 font-bold italic">
                Not enough data for trend
              </div>
            )}
          </div>
        </div>

        {/* Mood Distribution Chart */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Mood Distribution</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">All Time</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {stats.moodDistData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.moodDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.moodDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-[10px] font-black text-gray-500 uppercase">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 font-bold italic">
                No mood data yet
              </div>
            )}
          </div>
        </div>

        {/* Activity Consistency Chart */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Activity Consistency</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  formatter={(value) => <span className="text-[10px] font-black text-gray-500 uppercase">{value}</span>}
                />
                <Bar dataKey="moods" fill="#f4a7a7" radius={[10, 10, 0, 0]} barSize={20} />
                <Bar dataKey="journals" fill="#a7c7f4" radius={[10, 10, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-gradient-to-br from-[#f4a7a7]/20 to-[#fbdcdc]/10 p-10 rounded-[3rem] border border-[#f4a7a7]/30 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">✨</span>
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">AI Wellness Insight</h3>
        </div>
        {loadingInsight ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200/50 rounded w-full"></div>
            <div className="h-4 bg-gray-200/50 rounded w-5/6"></div>
          </div>
        ) : (
          <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed italic">
            "{insight}"
          </p>
        )}
      </div>

      {/* Quick Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Recent Milestones</h3>
          <div className="space-y-4">
            {moodHistory.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-2xl transition">
                <div className="text-3xl">{m.mood}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">Logged {m.label} mood</p>
                  <p className="text-xs text-gray-400 font-bold uppercase">{new Date(m.timestamp).toLocaleDateString()} at {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-xs font-black text-gray-300">#{moodHistory.length - i}</div>
              </div>
            ))}
            {moodHistory.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 font-bold">No milestones yet. Complete an activity to start your timeline!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Completed Tasks</h3>
          <div className="space-y-4">
            {completedTasks.slice(0, 3).map((t, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-2xl transition">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-2xl">✅</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{t.taskText}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase">{new Date(t.timestamp).toLocaleDateString()} at {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 font-bold">No tasks completed yet. Check your Home Page for daily tasks!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <div className="flex-1 bg-gray-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
           <h4 className="text-xl font-bold">Weekly Check-in Goal</h4>
           <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                <span>Progress</span>
                <span>{Math.min(stats.totalMoods, 7)}/7 days</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#f4a7a7] transition-all" style={{ width: `${(Math.min(stats.totalMoods, 7) / 7) * 100}%` }}></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserSummary;
