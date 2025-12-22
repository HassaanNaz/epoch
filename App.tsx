// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { GameState, HistoricalEvent, LeaderboardEntry, GameMode } from './types';
import { fetchEventPair, fetchRandomEvent, loadLeaderboard, saveLeaderboardEntry } from './supabaseService.ts';
import StartScreen from './components/StartScreen';
import GameView from './components/GameView';
import Leaderboard from './components/Leaderboard';
import GameOver from './components/GameOver';
import useTrackPlay from "./Tracking";

const BackgroundCollage: React.FC<{ dimmed?: boolean }> = ({ dimmed }) => {
  const collageItems = useMemo(
    () => [
      { text: "Moon Landing", img: "https://images-ext-1.discordapp.net/external/4bnJbFu-hdNstmuOlvh0WbVEtO6AgwCuUe_Pl-FJURM/%3Fwidth%3D1200%26height%3D800/https/images.pdimagearchive.org/collections/hi-res-images-from-the-apollo-missions/21963933086_87f208be4a_o.jpg?format=webp", top: "2%", left: "-2%", rotate: "-15deg", size: "lg", aspect: "aspect-[4/5]" },
      { text: "Great Pyramid of Giza", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Giza-pyramids.JPG/1200px-Giza-pyramids.JPG?20110715063524", top: "25%", left: "-10%", rotate: "12deg", size: "lg", aspect: "aspect-[3/4]" },
      { text: "Viking Landing in North America", img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Carlb-ansemeadows-vinland-03.jpg", top: "82%", left: "1%", rotate: "9deg", size: "lg", aspect: "aspect-[4/5]" },
      { text: "Titanic Sinking", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/RMS_Titanic_3.jpg/1200px-RMS_Titanic_3.jpg?20181211220143", top: "70%", left: "95%", rotate: "-25deg", size: "lg", aspect: "aspect-[16/10]" },
      { text: "Black Death", img: "https://upload.wikimedia.org/wikipedia/commons/c/c2/The_Black_Death.jpg?20130127212131", top: "-8%", left: "60%", rotate: "6deg", size: "sm", aspect: "aspect-square" },
      { text: "Fall of the Berlin Wall", img: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Berlin_wall_1990.jpg?20050822135824", top: "95%", left: "55%", rotate: "-4deg", size: "md", aspect: "aspect-[3/2]" },
      { text: "Atomic Bomb Dropped on Hiroshima", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=500", top: "35%", left: "96%", rotate: "32deg", size: "sm", aspect: "aspect-[4/5]" },
      { text: "World War 1", img: "https://upload.wikimedia.org/wikipedia/commons/2/20/WWImontage.jpg", top: "60%", left: "84%", rotate: "-18deg", size: "md", aspect: "aspect-[3/4]" },
      { text: "First World Cup", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Uruguay_goal_v_argentina_1930.jpg/640px-Uruguay_goal_v_argentina_1930.jpg", top: "15%", left: "80%", rotate: "8deg", size: "md", aspect: "aspect-[4/5]" },
      { text: "Assassination of Julius Caesar", img: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Vincenzo_Camuccini%2C_The_Death_of_Julius_Caesar_(detail).jpg?20190315142413", top: "5%", left: "90%", rotate: "22deg", size: "lg", aspect: "aspect-square" },
      { text: "First Flight", img: "https://upload.wikimedia.org/wikipedia/commons/7/76/The_Wright_Brothers%3B_first_powered_flight_HU98267.jpg", top: "15%", left: "10%", rotate: "-20deg", size: "sm", aspect: "aspect-[16/9]" },
      { text: "Industrial Revolution", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Hartmann_Maschinenhalle_1868_%2801%29.jpg/1280px-Hartmann_Maschinenhalle_1868_%2801%29.jpg", top: "55%", left: "-6%", rotate: "14deg", size: "lg", aspect: "aspect-[3/4]" },
      { text: "World War 2", img: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Destroyed_buildings_in_Batina_after_the_battle%2C_30th_November_1944.jpg", top: "45%", left: "88%", rotate: "-12deg", size: "lg", aspect: "aspect-[3/4]" },
      { text: "French Revolution", img: "https://upload.wikimedia.org/wikipedia/commons/f/fb/French_Revolution-1792-8-10_w.jpg?20111015205633", top: "92%", left: "85%", rotate: "10deg", size: "sm", aspect: "aspect-square" },
      { text: "Discovery of Penicillin", img: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Penicillin_Past%2C_Present_and_Future-_the_Development_and_Production_of_Penicillin%2C_England%2C_1944_D17802.jpg?20130131164559", top: "-5%", left: "32%", rotate: "5deg", size: "md", aspect: "aspect-[3/2]" },
      { text: "Declaration of Independence", img: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Declaration_of_Independence_(1819),_by_John_Trumbull.jpg", top: "60%", left: "12%", rotate: "-7deg", size: "lg", aspect: "aspect-square" },
    ],
    []
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("bg-collage-animations")) return;

    const style = document.createElement("style");
    style.id = "bg-collage-animations";
    style.textContent = `
      /* Fly-in entrance */
      @keyframes fly-in {
        0% {
          opacity: 0;
          transform:
            translate3d(var(--from-x, 0vw), var(--from-y, -12vh), -120px)
            rotate(calc(var(--rot) * 1.4))
            scale(.94);
          filter: blur(8px) saturate(.9);
        }
        68% {
          opacity: 1;
          transform:
            translate3d(0, 0, -12px)
            rotate(calc(var(--rot) * 1.02))
            scale(1.02);
          filter: blur(1.5px) saturate(1.03);
        }
        100% {
          opacity: 1;
          transform:
            translate3d(0, 0, 0)
            rotate(var(--rot))
            scale(1);
          filter: blur(0) saturate(1);
        }
      }

      /* Idle sway that tilts left/right while subtly translating
         NOTE: 0% and 100% match the fly-in final rotation to avoid snapping. */
      @keyframes idle-sway {
        0% {
          transform: translate3d(var(--sway-x1, 0), var(--sway-y1, 0), 0)
                    rotate(var(--rot));
        }
        50% {
          transform: translate3d(var(--sway-x2, 0), var(--sway-y2, 0), 0)
                    rotate(calc(var(--rot) + var(--sway-rot, 0deg)));
        }
        100% {
          transform: translate3d(var(--sway-x1, 0), var(--sway-y1, 0), 0)
                    rotate(var(--rot));
        }
      }

      /* Base transform uses --rot so element shows its base rotation immediately.
         Idle sway will start after the fly-in by default (calc of fly-duration + 200ms). */
      .collage-animate {
        transform: rotate(var(--rot));
        transform-origin: center;
        will-change: transform, opacity, filter;
        animation:
          fly-in var(--fly-duration, 1400ms) cubic-bezier(.22,1,.36,1) both,
          idle-sway var(--sway-duration, 10s) ease-in-out var(--sway-delay, calc(var(--fly-duration, 1400ms) + 200ms)) infinite;
      }

      /* per-card variation via nth-child (pure CSS presets)
         NOTE: sway-delay values are set >= typical fly durations to avoid overlap. */
      .collage-animate:nth-child(6n+1) { --from-x: -70vw; --from-y: -18vh; --sway-delay: 1500ms; }
      .collage-animate:nth-child(6n+2) { --from-x: 70vw;  --from-y: -8vh;  --sway-delay: 1600ms; }
      .collage-animate:nth-child(6n+3) { --from-x: -60vw; --from-y: 12vh;  --sway-delay: 1700ms; }
      .collage-animate:nth-child(6n+4) { --from-x: 55vw;  --from-y: 10vh;  --sway-delay: 1800ms; }
      .collage-animate:nth-child(6n+5) { --from-x: -40vw; --from-y: -30vh; --sway-delay: 1900ms; }
      .collage-animate:nth-child(6n+6) { --from-x: 30vw;  --from-y: 30vh;  --sway-delay: 2000ms; }

      /* Visible sway rotation amplitude (you said you liked stronger tilt) */
      .collage-animate:nth-child(2n) { --sway-rot: 10deg; }
      .collage-animate:nth-child(3n) { --sway-rot: 8deg; }
      .collage-animate:nth-child(4n) { --sway-rot: 6deg; }
      .collage-animate:nth-child(5n) { --sway-rot: 4deg; }

      /* translation amplitude and durations (more visible than before) */
      .collage-animate:nth-child(2n) { --sway-x1: -8px; --sway-y1: -6px; --sway-x2: 10px;  --sway-y2: 8px;  --sway-duration: 9s; }
      .collage-animate:nth-child(3n) { --sway-x1: 6px;  --sway-y1: 4px;  --sway-x2: -9px;  --sway-y2: 10px; --sway-duration: 8s; }
      .collage-animate:nth-child(4n) { --sway-x1: -10px; --sway-y1: 6px;  --sway-x2: 7px;   --sway-y2: -8px; --sway-duration: 11s; }
      .collage-animate:nth-child(5n) { --sway-x1: 9px;  --sway-y1: -7px; --sway-x2: -8px;  --sway-y2: 6px;  --sway-duration: 10s; }

      /* small fly-duration variety so they don't perfectly sync */
      .collage-animate:nth-child(3n) { --fly-duration: 1600ms; }
      .collage-animate:nth-child(4n) { --fly-duration: 1300ms; }

      /* respect reduced-motion */
      @media (prefers-reduced-motion: reduce) {
        .collage-animate {
          animation: none !important;
          transform: rotate(var(--rot)) !important;
          opacity: 1 !important;
          filter: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none transition-all duration-1000 z-0 bg-slate-50 ${
        dimmed ? "opacity-20 blur-sm scale-110" : "opacity-40"
      }`}
    >
      {collageItems.map((item, idx) => (
        <div
          key={idx}
          aria-hidden
          className="absolute hidden md:flex flex-col items-center p-1.5 bg-white shadow-2xl border border-slate-200 overflow-hidden collage-animate"
          style={
            {
              top: item.top,
              left: item.left,
              width: item.size === "lg" ? "240px" : item.size === "md" ? "180px" : "140px",
              zIndex: 10 + (idx % 8),
              ["--rot" as any]: item.rotate,
            } as React.CSSProperties
          }
        >
          <div className={`w-full ${item.aspect} overflow-hidden rounded-sm bg-slate-100`}>
            <img src={item.img} alt={item.text} className="w-full h-full object-cover grayscale-[15%]" loading="lazy" />
          </div>

          <div className="py-2.5 px-1 bg-white w-full">
            <span className="font-serif italic text-slate-800 tracking-tight text-[11px] md:text-xs block truncate w-full text-center font-bold">
              {item.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};




const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    screen: 'start',
    mode: 'classic',
    score: 0,
    lives: 3,
    streak: 0,
    eventA: null,
    eventB: null,
    isRevealing: false,
    lastGuessResult: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // load leaderboard from supabase on mount
    (async () => {
      setIsLoading(true);
      try {
        const rows = await loadLeaderboard(500);
        setLeaderboard(rows);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveToLeaderboard = async (name: string, score: number) => {
    const newEntry: LeaderboardEntry = {
      name,
      score,
      mode: state.mode,
      date: new Date().toLocaleDateString(),
    };

    // Attempt to insert into supabase; if it fails, still keep a local copy.
    try {
      const saved = await saveLeaderboardEntry(newEntry);
      const updated = [...(saved ? [saved] : [newEntry]), ...leaderboard].sort((a, b) => b.score - a.score).slice(0, 20);
      setLeaderboard(updated);
    } catch (err) {
      console.error('Failed to save leaderboard entry to Supabase, saving locally', err);
      const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 20);
      setLeaderboard(updated);
    }
  };

  const startGame = async (mode: GameMode) => {
    useTrackPlay();
    setIsLoading(true);
    const startingLives = mode === 'modern' || mode === 'blitz' ? 1 : 3;

    try {
      const [eA, eB] = await fetchEventPair(mode);
      setState({
        screen: 'game',
        mode,
        score: 0,
        lives: startingLives,
        streak: 0,
        eventA: eA,
        eventB: eB,
        isRevealing: false,
        lastGuessResult: null,
      });
    } catch (error) {
      console.error('Failed to start game', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = (choice: 'earlier' | 'later') => {
  setState(prev => {
    if (prev.isRevealing || !prev.eventA || !prev.eventB) return prev;

    const isCorrect =
      choice === 'earlier'
        ? prev.eventB.year < prev.eventA.year
        : prev.eventB.year > prev.eventA.year;

    // Schedule next step after reveal animation
    setTimeout(async () => {
      if (isCorrect) {
        setIsLoading(true);
        try {
          const newEvent = await fetchRandomEvent(
            prev.mode,
            prev.score + 1,
            [prev.eventA!.year, prev.eventB!.year]
          );

          setState(s => ({
            ...s,
            score: s.score + 1,
            streak: s.streak + 1,
            eventA: s.eventB,
            eventB: newEvent,
            isRevealing: false,
            lastGuessResult: null,
          }));
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        if (prev.lives > 1) {
          setIsLoading(true);
          try {
            const [eA, eB] = await fetchEventPair(prev.mode);
            setState(s => ({
              ...s,
              lives: s.lives - 1,
              streak: 0,
              eventA: eA,
              eventB: eB,
              isRevealing: false,
              lastGuessResult: null,
            }));
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        } else {
          setState(s => ({ ...s, screen: 'gameOver' }));
        }
      }
    }, 1000);

    return {
      ...prev,
      isRevealing: true,
      lastGuessResult: isCorrect ? 'correct' : 'wrong',
    };
  });
};


  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
      <BackgroundCollage dimmed={state.screen !== 'start'} />

      <div className="relative z-10 w-full flex flex-col items-center h-full overflow-hidden">
        {state.screen === 'start' && (
          <StartScreen onStart={startGame} onShowLeaderboard={() => setState(s => ({ ...s, screen: 'leaderboard' }))} isLoading={isLoading} />
        )}

        {state.screen === 'game' && state.eventA && state.eventB && (
          <GameView state={state} onGuess={handleGuess} isLoading={isLoading} />
        )}

        {state.screen === 'leaderboard' && (
          <Leaderboard data={leaderboard} onBack={() => setState(s => ({ ...s, screen: 'start' }))} />
        )}

        {state.screen === 'gameOver' && (
          <GameOver
            score={state.score}
            mode={state.mode}
            onRestart={() => startGame(state.mode)}
            onSave={saveToLeaderboard}
            onExit={() => setState(s => ({ ...s, screen: 'start' }))}
          />
        )}
      </div>
    </div>
  );
};

export default App;
