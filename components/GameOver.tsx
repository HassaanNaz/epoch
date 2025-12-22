
import React, { useState } from 'react';
import { GameMode } from '../types';

interface GameOverProps {
  score: number;
  mode: GameMode;
  onRestart: () => void;
  onSave: (name: string, score: number) => void;
  onExit: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, mode, onRestart, onSave, onExit }) => {
  const [name, setName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), score);
      setHasSaved(true);
    }
  };

  const getGameOverMessage = () => {
    switch (mode) {
      case 'modern': return 'The Modern Era has concluded.';
      case 'ancient': return 'The Ancient World remains a mystery.';
      case 'blitz': return 'Time Flies';
      default: return 'The Timeline has fractured.';
    }
  };

  return (
    <div className="w-full max-w-lg text-center p-6 animate-in fade-in zoom-in duration-700 h-full flex flex-col justify-center overflow-hidden">
      <div className="mb-6">
        <div className="inline-block px-4 py-1.5 bg-rose-500 text-white text-[8px] font-black rounded-full uppercase tracking-[0.3em] mb-3 shadow-lg shadow-rose-200">Game Over</div>
        <h2 className="text-6xl font-serif text-slate-900 mb-1 italic leading-none">Lost in Time</h2>
        <p className="text-slate-500 font-medium tracking-widest uppercase text-[10px] mt-2 opacity-60">{getGameOverMessage()}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none text-9xl">💀</div>
        <div className="relative">
          <div className="text-[9px] uppercase tracking-[0.4em] text-slate-400 font-black mb-2">Final Score</div>
          <div className="text-8xl font-serif font-black italic text-slate-900 leading-none mb-8 drop-shadow-xl">{score}</div>

          {!hasSaved ? (
            <div className="space-y-4 max-w-xs mx-auto">
               <input
                type="text"
                placeholder="Chronicler Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center font-bold text-slate-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300 text-sm"
                maxLength={15}
               />
               <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
               >
                 Inscribe Score
               </button>
            </div>
          ) : (
            <div className="py-4 px-8 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 animate-bounce">
              <span>Logged Successfully</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-xs mx-auto w-full">
        <button
          onClick={onRestart}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all active:scale-95 border-b-4 border-slate-700 uppercase tracking-[0.2em] text-[10px]"
        >
          Play Again
        </button>
        <button
          onClick={onExit}
          className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black hover:border-slate-300 hover:text-slate-600 transition-all uppercase tracking-[0.2em] text-[10px]"
        >
          Abandon
        </button>
      </div>
    </div>
  );
};

export default GameOver;
