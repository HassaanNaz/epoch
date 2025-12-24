
import React, { useEffect, useRef } from 'react';
import { GameState } from '../types';

interface GameViewProps {
  state: GameState;
  onGuess: (choice: 'earlier' | 'later') => void;
  isLoading: boolean;
}

const Confetti: React.FC<{ result: 'correct' | 'wrong' }> = ({ result }) => {
  const pieces = Array.from({ length: 18 }).map((_, i) => {
    const left = Math.round(Math.random() * 100);
    const delay = Math.round(Math.random() * 300);
    const size = 6 + Math.round(Math.random() * 10);
    const colors = result === 'correct'
      ? ['#34D399', '#10B981', '#60A5FA', '#A78BFA']
      : ['#FB7185', '#F97316', '#F59E0B', '#F472B6'];
    const background = colors[Math.floor(Math.random() * colors.length)];
    return { key: i, left, delay, size, background };
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-40">
      {pieces.map(p => (
        <div
          key={p.key}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.background,
            borderRadius: 2,
            transform: `rotate(${Math.round(Math.random() * 360)}deg)`,
            animation: `confetti-fall 1100ms cubic-bezier(.2,.9,.3,1) ${p.delay}ms forwards`,
            opacity: 0,
            position: 'absolute',
            top: '-10vh'
          }}
        />
      ))}
    </div>
  );
};

const ArtifactCard: React.FC<{ 
  event: any, 
  isGuess?: boolean, 
  revealed?: boolean, 
  result?: 'correct' | 'wrong' | null, 
  onEarlier?: () => void, 
  onLater?: () => void,
  isLoading?: boolean
}> = ({ event, isGuess, revealed, result, onEarlier, onLater, isLoading }) => {
  const glowClass = revealed && result ? `guessed-glow ${result}` : '';
  const effectClass = revealed && result === 'correct'
    ? 'pop-scale' : revealed && result === 'wrong' ? 'shake-x' : '';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('gameview-extra-animations')) return;

    const style = document.createElement('style');
    style.id = 'gameview-extra-animations';
    style.textContent = `
      @keyframes confetti-fall{0%{transform:translateY(-10vh) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
      @keyframes pop-scale{0%{transform:scale(0.86)}50%{transform:scale(1.06)}100%{transform:scale(1)}}
      @keyframes shake-x{0%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}100%{transform:translateX(0)}}
      .pop-scale{animation:pop-scale 700ms cubic-bezier(.2,.9,.3,1) both}
      .shake-x{animation:shake-x 700ms cubic-bezier(.2,.9,.3,1) both}
      .guessed-glow.correct{box-shadow:0 8px 40px rgba(52,211,153,0.18), 0 0 0 6px rgba(16,185,129,0.06);}
      .guessed-glow.wrong{box-shadow:0 8px 40px rgba(251,113,133,0.18), 0 0 0 6px rgba(245,101,101,0.06);}
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className={`${glowClass} ${effectClass} relative w-full h-full flex flex-col bg-white shadow-xl border border-slate-200 transition-all duration-700 animate-in fade-in zoom-in overflow-hidden ${
      revealed && result === 'correct' ? 'ring-2 lg:ring-4 ring-emerald-400' :
      revealed && result === 'wrong' ? 'ring-2 lg:ring-4 ring-rose-400' : ''
    }`}>
      {revealed && result && <Confetti result={result} />}

      <div className="relative flex-1 bg-slate-50 flex flex-col items-center justify-center p-3 lg:p-6 text-center border-b border-slate-100 overflow-hidden">
         <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none text-6xl lg:text-8xl">🏛️</div>
         
         {!isGuess || revealed ? (
            <div className="animate-in fade-in zoom-in duration-700 flex flex-col items-center">
               <div className="text-[7px] lg:text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-1 lg:mb-2">Confirmed Date</div>
               <div className="text-2xl lg:text-5xl font-serif font-black italic text-slate-900 mb-1 lg:mb-3">
                  {event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year}
               </div>
               <div className="h-0.5 lg:h-1 w-6 lg:w-10 bg-slate-200 mx-auto rounded-full mb-2 lg:mb-4"></div>
               <p className="text-slate-600 text-[9px] lg:text-xs leading-tight lg:leading-relaxed italic px-2 font-medium max-w-[200px] lg:max-w-none">"{event.description}"</p>
            </div>
         ) : (
            <div className="animate-pulse scale-105">
               <div className="text-[7px] lg:text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-1 lg:mb-3">Uncharted Event</div>
               <div className="text-4xl lg:text-7xl font-serif text-slate-300 italic tracking-tighter">????</div>
            </div>
         )}
      </div>

      <div className="py-2 lg:py-4 px-2 lg:px-4 text-center bg-white shrink-0 min-h-[80px] lg:min-h-0 flex flex-col justify-center">
         <h2 className="text-xs lg:text-xl font-serif font-bold text-slate-900 leading-tight mb-0.5 lg:mb-1">{event.eventName}</h2>
         
         {isGuess && !revealed ? (
            <div className="mt-1 lg:mt-4 grid grid-cols-2 gap-2 animate-in fade-in duration-500">
               <button
                  disabled={isLoading}
                  onClick={onEarlier}
                  className="py-1.5 lg:py-3 bg-white border border-slate-200 lg:border-2 rounded-lg lg:rounded-xl font-black text-[8px] lg:text-[10px] text-slate-900 hover:border-indigo-600 transition-all active:scale-95 disabled:opacity-50"
               >
                  EARLIER
               </button>
               <button
                  disabled={isLoading}
                  onClick={onLater}
                  className="py-1.5 lg:py-3 bg-slate-900 text-white rounded-lg lg:rounded-xl font-black text-[8px] lg:text-[10px] hover:bg-indigo-900 transition-all active:scale-95 disabled:opacity-50"
               >
                  LATER
               </button>
            </div>
         ) : (
            <div className="relative mt-1 lg:mt-2 min-h-[40px] lg:h-16 flex items-center justify-center">
              <div className="p-2 lg:p-4 bg-slate-900/95 backdrop-blur-md text-white rounded-lg animate-in slide-in-from-bottom-2 duration-500 w-full">
                <p className="text-[8px] lg:text-[10px] italic leading-tight lg:leading-snug">{event.funFact}</p>
              </div>
            </div>
         )}
      </div>
    </div>
  );
};

const GameView: React.FC<GameViewProps> = ({ state, onGuess, isLoading }) => {
  const { eventA, eventB, isRevealing, lastGuessResult, score, lives, mode } = state;
  const bodyTimerRef = useRef<{ show?: number; clear?: number } | null>(null);

  useEffect(() => {
    if (bodyTimerRef.current) {
      if (bodyTimerRef.current.show) window.clearTimeout(bodyTimerRef.current.show);
      if (bodyTimerRef.current.clear) window.clearTimeout(bodyTimerRef.current.clear);
      bodyTimerRef.current = null;
    }
    document.body.classList.remove('green-pulse', 'red-pulse', 'fade-out');

    if (!lastGuessResult) return;

    const cls = lastGuessResult === 'correct' ? 'green-pulse' : 'red-pulse';
    document.body.classList.add(cls);

    const SHOW_DURATION = 600;
    const FADE_DURATION = 900;

    const showTimer = window.setTimeout(() => {
      document.body.classList.add('fade-out');
    }, SHOW_DURATION);

    const clearTimer = window.setTimeout(() => {
      document.body.classList.remove(cls, 'fade-out');
    }, SHOW_DURATION + FADE_DURATION);

    bodyTimerRef.current = { show: showTimer, clear: clearTimer };

    return () => {
      if (bodyTimerRef.current) {
        if (bodyTimerRef.current.show) window.clearTimeout(bodyTimerRef.current.show);
        if (bodyTimerRef.current.clear) window.clearTimeout(bodyTimerRef.current.clear);
        bodyTimerRef.current = null;
      }
      document.body.classList.remove('green-pulse', 'red-pulse', 'fade-out');
    };
  }, [lastGuessResult]);

  if (!eventA || !eventB) return null;

  return (
    <div className="relative h-screen w-full flex flex-col items-center px-4 py-4 lg:py-6 animate-in fade-in duration-700 overflow-hidden">
      {/* HUD - Transparent backdrop to show pulse */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 lg:mb-8 glass-card py-2 lg:py-4 px-5 lg:px-8 rounded-2xl lg:rounded-[2.5rem] border border-white/40 shadow-xl shrink-0 z-20">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[7px] lg:text-[9px] uppercase tracking-[0.4em] font-black">Score</span>
          <span className="text-xl lg:text-4xl font-serif text-slate-900 leading-none">{score}</span>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-6">
           <div className="flex flex-col items-center">
              <div className="text-[7px] lg:text-[9px] text-slate-400 uppercase tracking-[0.4em] font-black mb-0.5 lg:mb-1.5">Lives</div>
              <div className="flex gap-1 lg:gap-2">
                 {[...Array(mode === 'classic' || mode === 'ancient' ? 3 : 1)].map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full transition-all duration-500 shadow-sm ${i < lives ? 'bg-rose-500 scale-100 animate-pulse-slow' : 'bg-slate-200 scale-75 opacity-30'}`} />
                 ))}
              </div>
           </div>
           <div className="w-px h-6 lg:h-10 bg-slate-200 mx-1"></div>
           <div className="px-3 lg:px-5 py-1 lg:py-2 bg-slate-900 text-white rounded-full text-[7px] lg:text-[10px] font-black tracking-widest uppercase">
              {mode}
           </div>
        </div>
      </div>

      {/* Cards Area - Centered and visible against pulse background */}
      <div className="flex flex-col lg:flex-row w-full max-w-sm lg:max-w-6xl flex-1 gap-4 lg:gap-12 items-center justify-center min-h-0 pb-6">
         <div className="w-full h-[32vh] lg:h-full lg:flex-1 min-h-0">
            <ArtifactCard event={eventA} />  
         </div>
         
         <div className="relative shrink-0 z-20 -my-6 lg:my-0">
            <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 lg:group-hover:opacity-100 transition-all"></div>
            <div className="relative w-10 h-10 lg:w-14 lg:h-14 bg-slate-900 text-white rounded-full flex items-center justify-center font-serif text-base lg:text-2xl font-black italic shadow-2xl border-2 border-white animate-float-slow">vs</div>
         </div>

         <div className="w-full h-[32vh] lg:h-full lg:flex-1 min-h-0">
           <ArtifactCard 
              event={eventB} 
              isGuess 
              revealed={isRevealing} 
              result={lastGuessResult}
              onEarlier={() => onGuess('earlier')}
              onLater={() => onGuess('later')}
              isLoading={isLoading}
           />
         </div>
      </div>

      {/* Global loading state overlay - subtle */}
      {isLoading && !isRevealing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 lg:px-10 py-2.5 lg:py-4 bg-slate-900/90 text-white rounded-full shadow-2xl flex items-center gap-3 lg:gap-5 z-50 border border-white/20 backdrop-blur-sm">
          <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[8px] lg:text-[11px] font-black tracking-[0.4em] uppercase">Syncing Timeline</span>
        </div>
      )}
    </div>
  );
};

export default GameView;
