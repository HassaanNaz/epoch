import React, { useEffect, useRef } from 'react';
import { GameState } from '../types';

interface GameViewProps {
  state: GameState;
  onGuess: (choice: 'earlier' | 'later') => void;
  isLoading: boolean;
}

const Confetti: React.FC<{ result: 'correct' | 'wrong' }> = ({ result }) => {
  // create an array of confetti pieces with random positions/delays
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
  // apply guessed-glow classes only when revealed and result exists (so it's not showing during loading)
  const glowClass = revealed && result ? `guessed-glow ${result}` : '';

  // small visual state: pop on correct, shake on wrong
  const effectClass = revealed && result === 'correct'
    ? 'pop-scale' : revealed && result === 'wrong' ? 'shake-x' : '';

  // inject keyframes once
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
    <div className={`${glowClass} ${effectClass} h-6/7 relative collage-item w-full max-w-[340px] p-3 bg-white shadow-xl border border-slate-200 transition-all duration-700 animate-in fade-in zoom-in ${
      revealed && result === 'correct' ? 'ring-4 ring-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.12)]' :
      revealed && result === 'wrong' ? 'ring-4 ring-rose-400 shadow-[0_0_40px_rgba(251,113,133,0.12)]' : ''
    }`}>
      {/* Confetti (only when revealed and have a result) */}
      {revealed && result && <Confetti result={result} />}

      {/* Aspect Ratio Container */}
      <div className="relative w-full aspect-[4/5] bg-slate-50 overflow-hidden rounded-sm border-b border-slate-100 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
         <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none text-8xl">🏛️</div>
         
         {!isGuess || revealed ? (
            <div className="animate-in fade-in zoom-in duration-700">
               <div className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-2">Confirmed Date</div>
               <div className="text-5xl font-serif font-black italic text-slate-900 mb-3">
                  {event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year}
               </div>
               <div className="h-1 w-10 bg-slate-200 mx-auto rounded-full mb-4"></div>
               <p className="text-slate-600 text-xs leading-relaxed italic px-2 font-medium">"{event.description}"</p>
            </div>
         ) : (
            <div className="animate-pulse scale-105">
               <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-3">Uncharted Event</div>
               <div className="text-7xl font-serif text-slate-300 italic tracking-tighter">????</div>
            </div>
         )}
      </div>

      <div className="py-4 px-1 text-center animate-in fade-in duration-700">
         <h2 className="text-xl font-serif font-bold text-slate-900 leading-tight mb-1">{event.eventName}</h2>
         {/* <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Epoch: {event.era}</div> */}
         
         {isGuess && !revealed ? (
            <div className="mt-4 grid grid-cols-2 gap-2 animate-in fade-in duration-500">
               <button
                  disabled={isLoading}
                  onClick={onEarlier}
                  className="py-3 bg-white border-2 border-slate-100 rounded-xl font-black text-[10px] text-slate-900 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-50"
               >
                  EARLIER
               </button>
               <button
                  disabled={isLoading}
                  onClick={onLater}
                  className="py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] hover:bg-indigo-900 transition-all active:scale-95 disabled:opacity-50"
               >
                  LATER
               </button>
            </div>
         ) : (
            (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-slate-900/95 backdrop-blur-md text-white animate-in slide-in-from-bottom-full duration-500">
                <div className="text-[7px] font-black uppercase tracking-widest opacity-50 mb-1">Fun Fact</div>
                <p className="text-[10px] italic leading-snug">{event.funFact}</p>
              </div>
            )
         )}
      </div>
    </div>
  );
};

const GameView: React.FC<GameViewProps> = ({ state, onGuess, isLoading }) => {
  const { eventA, eventB, isRevealing, lastGuessResult, score, lives, mode } = state;

  const bodyTimerRef = useRef<{ show?: number; clear?: number } | null>(null);

  useEffect(() => {
    // remove any previous classes & timers
    if (bodyTimerRef.current) {
      if (bodyTimerRef.current.show) window.clearTimeout(bodyTimerRef.current.show);
      if (bodyTimerRef.current.clear) window.clearTimeout(bodyTimerRef.current.clear);
      bodyTimerRef.current = null;
    }
    document.body.classList.remove('green-pulse', 'red-pulse', 'fade-out');

    if (!lastGuessResult) return;

    const cls = lastGuessResult === 'correct' ? 'green-pulse' : 'red-pulse';
    document.body.classList.add(cls);

    // show duration before starting fade
    const SHOW_DURATION = 600; // shorter — adjust to taste
    const FADE_DURATION = 900;

    // after SHOW_DURATION -> add fade-out class to trigger the longer transition
    const showTimer = window.setTimeout(() => {
      document.body.classList.add('fade-out');
    }, SHOW_DURATION);

    // after SHOW + FADE -> remove classes entirely
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
    <div className="relative min-h-screen w-full h-full max-w-6xl mx-auto flex flex-col items-center px-4 py-6 animate-in fade-in duration-700 overflow-hidden justify-center">
      {/* HUD */}
      <div className="w-full flex justify-between items-center mb-6 max-w-4xl glass-card py-3 px-6 rounded-[2rem] border border-white/60 shadow-xl animate-in fade-in duration-700">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[8px] uppercase tracking-[0.4em] font-black">Score</span>
          <span className="text-3xl font-serif text-slate-900 leading-none">{score}</span>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-center">
              <div className="text-[8px] text-slate-400 uppercase tracking-[0.4em] font-black mb-1">Lives</div>
              <div className="flex gap-1.5">
                 {[...Array(mode === 'classic' || mode === 'ancient' ? 3 : 1)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-all duration-500 shadow-sm ${i < lives ? 'bg-rose-500 scale-100 animate-pulse-slow' : 'bg-slate-200 scale-75 opacity-30'}`} />
                 ))}
              </div>
           </div>
           <div className="w-px h-8 bg-slate-200 mx-1"></div>
           <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black tracking-widest">
              {mode.toUpperCase()}
           </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center justify-center w-full flex-1 overflow-visible animate-in fade-in duration-700">
         <ArtifactCard event={eventA} />  
         
         <div className="relative group shrink-0 animate-in fade-in duration-700">
            <div className="absolute inset-0 bg-indigo-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-all"></div>
            <div className="relative w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-serif text-xl font-black italic shadow-xl border-2 border-white z-10 animate-float-slow">vs</div>
         </div>

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

      {isLoading && !isRevealing && (
        <div className="fixed bottom-6 px-8 py-3 bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-8 duration-500 z-50 border-t border-indigo-500/50">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[9px] font-black tracking-[0.4em] uppercase">Temporal Sync...</span>
        </div>
      )}
    </div>
  );
};

export default GameView;
