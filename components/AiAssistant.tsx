
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UserData, Message, ChatSession } from '../types';
import * as gemini from '../services/gemini';

interface AiAssistantProps {
  user: UserData;
  hasApiKey: boolean;
  onSelectKey: () => void;
  history: ChatSession[];
  onSaveSession: (session: ChatSession) => void;
  onDeleteSession: (id: string) => void;
}

type AssistantStage = 'landing' | 'chat';

const RobotIllustration = () => (
  <div className="relative flex flex-col items-center scale-90 md:scale-100">
    <div className="relative w-64 h-48 md:w-72 md:h-56 bg-white border-[6px] border-black rounded-[3rem] shadow-[10px_10px_0px_#f4a7a7] flex items-center justify-center p-8 z-10 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <div className="flex space-x-12">
          <div className="w-5 h-5 bg-black rounded-full animate-pulse"></div>
          <div className="w-5 h-5 bg-black rounded-full animate-pulse"></div>
        </div>
        <div className="w-14 h-4 border-b-4 border-black rounded-full"></div>
      </div>
      <div className="absolute top-0 left-6 w-2 h-10 bg-black -translate-y-full"></div>
      <div className="absolute top-0 right-6 w-2 h-10 bg-black -translate-y-full"></div>
      <div className="absolute -top-10 left-5 w-4 h-4 bg-black rounded-full"></div>
      <div className="absolute -top-10 right-5 w-4 h-4 bg-black rounded-full"></div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#f4a7a7] rounded-full opacity-50"></div>
    </div>
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce">
      <div className="w-16 h-12 bg-amber-300 border-[4px] border-black rounded-2xl flex items-center justify-center relative shadow-md">
        <div className="absolute -bottom-2 left-4 w-4 h-4 bg-amber-300 border-r-[4px] border-b-[4px] border-black rotate-45"></div>
        <div className="w-6 h-1 bg-black/20 rounded-full"></div>
      </div>
    </div>
  </div>
);

const AiAssistant: React.FC<AiAssistantProps> = ({ user, hasApiKey, onSelectKey, history, onSaveSession, onDeleteSession }) => {
  const [stage, setStage] = useState<AssistantStage>('landing');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-save session when messages change
  useEffect(() => {
    if (currentSessionId && messages.length > 1) {
      const firstUserMsg = messages.find(m => m.role === 'user')?.text || 'New Chat';
      const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg;
      
      onSaveSession({
        id: currentSessionId,
        title,
        messages,
        timestamp: new Date()
      });
    }
  }, [messages, currentSessionId]);

  const handleChat = async () => {
    if (!input.trim()) return;
    if (!hasApiKey) {
      onSelectKey();
      return;
    }

    const userMsg: Message = { role: 'user', text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const ai = gemini.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: updatedMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: `You are an empathetic and conversational mental health companion called MonoSporsho AI. 
          Your goal is to listen deeply, provide emotional support, and act as a safe space for expression.
          Be supportive, intelligent, and reciprocate what the user says. 
          If the user shares feelings, validate them. If they ask for help, offer gentle suggestions or coping tools.
          Respond naturally like a supportive friend.`
        }
      });

      const botText = response.text || "I'm listening and I'm here for you. Tell me more.";
      setMessages(prev => [...prev, { role: 'model', text: botText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm still here for you, though I'm having a bit of trouble thinking clearly right now. What's on your mind?" }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    const newId = Math.random().toString(36).substring(2, 11);
    setCurrentSessionId(newId);
    setMessages([{ role: 'model', text: "Hi! I'm MonoSporsho AI. I'm here to listen and support you. How are you feeling today?" }]);
    setStage('chat');
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setStage('chat');
  };

  // Group history by "This Week" and "Older"
  const weeklyHistory = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return history.filter(s => new Date(s.timestamp) > oneWeekAgo);
  }, [history]);

  return (
    <div className="w-full max-w-4xl h-full flex flex-col items-center animate-fade-in">
      {stage === 'landing' ? (
        <div className="w-full flex-1 flex flex-col items-center space-y-8 py-10 overflow-y-auto custom-scrollbar">
          <RobotIllustration />
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">MonoSporsho AI</h2>
            <p className="text-gray-600 font-bold text-sm leading-relaxed px-4">
              Your safe space for expression and emotional support.
            </p>
          </div>
          
          <div className="w-full max-w-sm space-y-4 px-4">
            <button 
              onClick={startNewChat}
              className="w-full bg-[#a3afff] hover:bg-[#8e9ce5] text-white font-black py-5 rounded-3xl shadow-lg transition active:scale-95 text-lg flex items-center justify-center space-x-3"
            >
              <span>✨</span>
              <span>Start New Chat</span>
            </button>
          </div>

          {history.length > 0 && (
            <div className="w-full max-w-md space-y-6 px-4 pt-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weekly Chat History</h3>
                <span className="text-[10px] font-black text-indigo-400 uppercase">{weeklyHistory.length} Sessions</span>
              </div>
              
              <div className="space-y-3">
                {weeklyHistory.map((session) => (
                  <div 
                    key={session.id}
                    className="group relative bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition cursor-pointer flex items-center justify-between"
                    onClick={() => loadSession(session)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl">💬</div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm truncate max-w-[180px]">{session.title}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                          {new Date(session.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {session.messages.length} messages
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-400 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {weeklyHistory.length === 0 && (
                  <div className="text-center py-8 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-xs italic">No chats from this week yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden relative">
          <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-[#f4a7a7] rounded-xl flex items-center justify-center text-xl shadow-sm">🤖</div>
               <div>
                 <h3 className="font-black text-gray-800">MonoSporsho AI</h3>
                 <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Support Companion</p>
               </div>
            </div>
            <button onClick={() => setStage('landing')} className="text-gray-400 font-bold hover:text-gray-600 transition">Exit Chat</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar bg-gray-50/20">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] md:max-w-[70%] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] text-sm md:text-base leading-relaxed shadow-sm transition-all ${
                  msg.role === 'user' 
                  ? 'bg-[#f0f4ff] text-[#3b4b8c] rounded-tr-none' 
                  : 'bg-[#fdfdfd] text-gray-700 rounded-tl-none border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-[#fdfdfd] border border-gray-100 text-gray-400 p-5 rounded-3xl font-bold italic shadow-sm">MonoSporsho is listening...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-white border-t">
            <div className="flex items-center space-x-4">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Tell me what's on your mind..."
                className="flex-1 p-4 md:p-5 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#a3afff] shadow-inner transition bg-gray-50/50"
              />
              <button 
                onClick={handleChat}
                disabled={loading || !input.trim()}
                className="p-4 md:p-5 bg-[#a3afff] text-white rounded-2xl shadow-lg hover:bg-[#8e9ce5] transition active:scale-95 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;
