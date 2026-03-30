
import React, { useState } from 'react';
import { JournalEntry, UserData } from '../types';
import { AuthService } from '../services/auth';

interface JournalingProps {
  user: UserData;
  entries: JournalEntry[];
  onSave: (text: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onGoHome: () => void;
}

type JournalStage = 'editor' | 'lock_screen' | 'history' | 'detail';

const Journaling: React.FC<JournalingProps> = ({ user, entries, onSave, onUpdate, onDelete, onGoHome }) => {
  const [stage, setStage] = useState<JournalStage>('editor');
  const [journalText, setJournalText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  
  // Local state for inline delete confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = () => {
    if (!journalText.trim()) return;
    
    if (editingId) {
      onUpdate(editingId, journalText);
      setEditingId(null);
    } else {
      onSave(journalText);
    }
    
    setJournalText('');
    
    if (isUnlocked) {
      setStage('history');
    } else {
      alert("Entry saved safely in your vault.");
      onGoHome();
    }
  };

  const startEdit = (entry: JournalEntry, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setJournalText(entry.text);
    setEditingId(entry.id);
    setStage('editor');
  };

  // Improved robust deletion logic
  const executeDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Trigger the actual deletion in the parent state
    onDelete(id);
    
    // Clear local tracking states
    setConfirmDeleteId(null);
    
    // If we were looking at this entry's details, go back to history
    if (selectedId === id || stage === 'detail') {
      setSelectedId(null);
      setStage('history');
    }
  };

  const handleUnlock = () => {
    setError(false);
    const success = AuthService.verifyPassword(user.phone, passwordInput);
    if (success) {
      setIsUnlocked(true);
      setStage('history');
      setPasswordInput('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const requestHistory = () => {
    if (isUnlocked) {
      setStage('history');
    } else {
      setStage('lock_screen');
    }
  };

  const cancelAction = () => {
    if (editingId) {
      setEditingId(null);
      setJournalText('');
      setStage('history');
    } else {
      onGoHome();
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in">
      {stage === 'lock_screen' ? (
        <div className="w-full bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl text-center space-y-8 max-w-lg border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#f4a7a7]/20"></div>
          <div className="text-6xl mb-4">🛡️</div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Security Check</h2>
            <p className="text-gray-500 font-bold">Please enter your account password to access your private journal history.</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Account Password" 
                className={`w-full text-center text-xl font-bold tracking-tight rounded-2xl bg-gray-50 py-5 px-6 focus:outline-none focus:ring-2 focus:ring-[#f4a7a7] transition-all ${error ? 'ring-2 ring-red-400 border-red-400 animate-pulse' : 'border-none'}`} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs font-black uppercase tracking-widest">Incorrect password. Please try again.</p>}
          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <button 
              onClick={handleUnlock} 
              className="w-full bg-[#7c69f0] text-white py-5 rounded-[1.5rem] font-black shadow-lg hover:bg-[#6b58e0] transition active:scale-95"
            >
              Unlock Vault
            </button>
            <button 
              onClick={() => setStage('editor')} 
              className="w-full text-gray-400 font-bold hover:text-gray-600 transition text-sm"
            >
              Back to Writing
            </button>
          </div>
        </div>
      ) : stage === 'history' ? (
        <div className="w-full space-y-10 animate-fade-in max-w-3xl">
          <div className="flex justify-between items-center px-2">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Private Vault</h2>
              <p className="text-gray-500 font-bold text-sm">Your past reflections are safe here.</p>
            </div>
            <button 
              onClick={() => { setEditingId(null); setJournalText(''); setStage('editor'); }} 
              className="px-6 py-3 bg-[#f4a7a7] text-gray-900 rounded-2xl text-sm font-black shadow-md transition hover:bg-[#ef9393] active:scale-95"
            >
              Write New
            </button>
          </div>
          <div className="space-y-6">
            {entries.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100">
                <p className="text-gray-400 font-bold text-lg">No entries found in your vault.</p>
                <p className="text-gray-300 text-sm">Start your journey by writing your first entry.</p>
              </div>
            ) : entries.map((entry) => (
              <div 
                key={entry.id} 
                className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all duration-300 group hover:shadow-xl relative overflow-hidden ${confirmDeleteId === entry.id ? 'ring-2 ring-red-200 bg-red-50/10' : ''}`}
              >
                <div onClick={() => { setSelectedId(entry.id); setStage('detail'); }} className="cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-500">✍️ {entry.type === 'gratitude' ? 'Gratitude' : 'Reflection'}</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{entry.timestamp.toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700 text-xl font-medium leading-relaxed whitespace-pre-wrap line-clamp-3 group-hover:text-gray-900 transition mb-6">
                    {entry.text}
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t pt-4">
                   <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => startEdit(entry, e)}
                        className="flex items-center space-x-2 text-indigo-500 hover:text-indigo-700 font-black text-[10px] uppercase tracking-widest transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>

                      {confirmDeleteId !== entry.id ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(entry.id); }}
                          className="flex items-center space-x-2 text-red-300 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2 animate-fade-in">
                          <button 
                            onClick={(e) => executeDelete(entry.id, e)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-red-600 active:scale-95 transition"
                          >
                            Confirm Delete?
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                            className="text-gray-400 hover:text-gray-600 font-black text-[10px] uppercase tracking-widest transition"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : stage === 'detail' && selectedId ? (
        <div className="w-full flex flex-col items-center space-y-8 animate-fade-in max-w-4xl px-2">
          <div className="w-full flex justify-between items-center px-4">
            <button 
              onClick={() => setStage('history')} 
              className="text-gray-400 font-black flex items-center hover:text-gray-600 transition-colors text-xs uppercase tracking-widest"
            >
              <span className="mr-2 text-xl">←</span> Back to Vault
            </button>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => {
                  const entry = entries.find(e => e.id === selectedId);
                  if (entry) startEdit(entry);
                }} 
                className="text-indigo-400 hover:text-indigo-600 transition-colors font-black text-xs uppercase tracking-widest"
              >
                Edit Entry
              </button>
              
              {confirmDeleteId !== selectedId ? (
                <button 
                  onClick={() => setConfirmDeleteId(selectedId)} 
                  className="text-red-300 hover:text-red-500 transition-colors font-black text-xs uppercase tracking-widest"
                >
                  Delete Entry
                </button>
              ) : (
                <div className="flex items-center space-x-4 animate-fade-in">
                  <button 
                    onClick={() => executeDelete(selectedId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-red-600 active:scale-95 transition"
                  >
                    Yes, Delete
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-gray-400 hover:text-gray-600 font-black text-[10px] uppercase tracking-widest transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-white rounded-[3rem] p-12 md:p-20 shadow-xl border border-gray-50 min-h-[500px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-50"></div>
            <div className="absolute top-8 right-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
               Authenticated Session • {entries.find(e => e.id === selectedId)?.timestamp.toLocaleDateString()}
            </div>
            <div className="text-2xl md:text-3xl text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
              {entries.find(e => e.id === selectedId)?.text}
            </div>
          </div>
          <button 
            onClick={onGoHome} 
            className="bg-gray-900 text-white px-10 py-5 rounded-[1.5rem] font-black shadow-2xl transition active:scale-95 flex items-center space-x-3"
          >
            <span>🏠</span>
            <span>Return to Dashboard</span>
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center space-y-10 max-w-3xl">
          <div className="w-full flex items-center justify-between px-2">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              {editingId ? 'Edit Reflection' : 'New Reflection'}
            </h2>
            <button 
              onClick={requestHistory} 
              className="text-[#7c69f0] font-black hover:underline flex items-center space-x-2"
            >
              <span>📂</span>
              <span className="text-sm uppercase tracking-widest">Access Vault</span>
            </button>
          </div>
          <div className="w-full bg-[#f0f7ff] rounded-[3rem] p-12 md:p-16 shadow-inner border border-blue-50/50 min-h-[450px] relative flex flex-col group">
            <textarea 
              value={journalText} 
              onChange={(e) => setJournalText(e.target.value)} 
              placeholder="What's on your mind? This space is private and secure..." 
              className="w-full flex-1 bg-transparent border-none focus:ring-0 text-2xl md:text-3xl text-blue-900 font-medium placeholder-blue-300/60 resize-none leading-relaxed" 
            />
            <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none text-4xl group-focus-within:opacity-40 transition-opacity">
               {editingId ? '📝' : '🕊️'}
            </div>
          </div>
          <div className="w-full flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleSave} 
              className="flex-[2] bg-[#7c69f0] py-6 rounded-3xl font-black text-2xl text-white shadow-xl hover:bg-[#6b58e0] transition active:scale-[0.98] flex items-center justify-center space-x-3"
            >
              <span className="text-3xl">{editingId ? '💾' : '✍️'}</span>
              <span>{editingId ? 'Update Reflection' : 'Save Securely'}</span>
            </button>
            <button 
              onClick={cancelAction} 
              className="flex-1 bg-white border-2 border-gray-100 py-6 rounded-3xl font-black text-xl text-gray-400 hover:bg-gray-50 transition active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journaling;
