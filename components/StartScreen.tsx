
import React from 'react';
import { GameMode } from '../types';

interface StartScreenProps {
  onStart: (mode: GameMode) => void;
  onShowLeaderboard: () => void;
  isLoading: boolean;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowLeaderboard, isLoading }) => {
  const modes: { id: GameMode; title: string; desc: string; icon: string; color: string }[] = [
    { id: 'classic', title: 'Classic', desc: 'Global history, 3 lives.', icon: '🌍', color: 'border-slate-200 hover:border-indigo-400' },
    { id: 'modern', title: 'Modern Age', desc: '1900-Present. 1 life.', icon: '🚀', color: 'border-slate-200 hover:border-sky-400' },
    { id: 'ancient', title: 'Ancient World', desc: 'Pre-500 AD. 3 lives.', icon: '🏛️', color: 'border-slate-200 hover:border-amber-400' },
    { id: 'blitz', title: 'Blitz', desc: 'Iconic moments. 1 life.', icon: '⚡', color: 'border-slate-200 hover:border-rose-400' },
  ];

  return (
    <div className="flex flex-col items-center text-center p-4 w-full max-w-4xl h-full justify-center overflow-hidden">
      <div className="mb-6 animate-in fade-in zoom-in duration-1000">
        <h1 className="text-6xl md:text-8xl font-serif italic text-slate-900 mb-1 drop-shadow-2xl select-none">Epoch</h1>
        <div className="h-1.5 w-32 bg-indigo-600 mx-auto rounded-full mb-4 shadow-xl shadow-indigo-200"></div>
        {/* <p className="text-slate-700 text-lg md:text-xl font-light tracking-[0.2em] max-w-md mx-auto leading-relaxed glass-card py-3 px-8 rounded-full border border-white/60 shadow-2xl">
          CHRONICLE OF MANKIND
        </p> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8 max-w-3xl">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onStart(mode.id)}
            disabled={isLoading}
            className={`group relative flex items-center text-left p-4 bg-white/95 backdrop-blur-md border-2 rounded-[2.5rem] transition-all hover:shadow-lg hover:-translate-y-1 active:scale-95 disabled:opacity-50 ${mode.color}`}
          >
            <div className="text-4xl mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-md">{mode.icon}</div>
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{mode.title}</h3>
                {mode.id === 'blitz' && <span className="text-[8px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold shadow-lg animate-pulse">FLASH</span>}
              </div>
              <p className="text-slate-500 text-xs leading-tight font-medium italic opacity-85">{mode.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full sm:w-80">
        <button
          onClick={onShowLeaderboard}
          className="group px-6 py-4 bg-slate-900 text-white rounded-[2rem] font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 active:scale-95 border-b-4 border-slate-700"
        >
          <span className="text-2xl group-hover:rotate-[360deg] transition-transform duration-1000">🏛️</span>
          <span className="tracking-[0.2em] uppercase text-[10px] font-black">Hall of Records</span>
        </button>
      </div>

      {/* <footer className="mt-8 text-slate-500 text-[8px] font-black uppercase tracking-[0.4em] italic opacity-50 pointer-events-none">
      </footer> */}
    </div>
  );
};

export default StartScreen;
