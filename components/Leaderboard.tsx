
import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  data: LeaderboardEntry[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data, onBack }) => {
  return (
    <div className="w-full max-w-4xl px-4 py-6 flex flex-col items-center h-full overflow-hidden">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <div>
          <h2 className="text-5xl font-serif italic text-slate-900 leading-none">Hall of Fame</h2>
          {/* <p className="text-slate-500 text-[10px] mt-2 font-medium tracking-widest uppercase opacity-70">Scholars of the Greatest Timelines</p> */}
        </div>
        <button 
          onClick={onBack} 
          className="group px-6 py-3 bg-white border-2 border-slate-100 rounded-[2rem] font-black text-slate-900 hover:border-indigo-600 transition-all flex items-center gap-3 active:scale-95 shadow-lg"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-[10px] uppercase tracking-widest">Library</span>
        </button>
      </div>

      <div className="w-full bg-white shadow-2xl border border-slate-200 rounded-[2rem] flex flex-col flex-1 overflow-hidden mb-6">
        {data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <span className="text-6xl mb-4 opacity-20">📜</span>
            <span className="text-slate-400 italic font-serif text-lg">The annals are yet to be written.</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-20 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Rank</th>
                  <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Chronicler</th>
                  <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Mode</th>
                  <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((entry, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-black ${
                        i === 0 ? 'bg-slate-900 text-white shadow-lg ring-4 ring-slate-100' : 
                        i === 1 ? 'bg-slate-200 text-slate-700' :
                        i === 2 ? 'bg-slate-100 text-slate-500' : 'text-slate-300'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors tracking-tight">{entry.name}</div>
                      {/* <div className="text-[8px] text-slate-400 font-black tracking-widest uppercase">{entry.date}</div> */}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                        {entry.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-serif text-2xl text-slate-900 font-black italic">{entry.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* <footer className="mb-4 text-slate-400 text-[8px] font-black uppercase tracking-[0.4em]">
        Verified by Temporal Authority
      </footer> */}
    </div>
  );
};

export default Leaderboard;
