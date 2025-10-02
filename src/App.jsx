import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zeucfsakakfgbadndzut.supabase.co"
const supabaseKey = "sb_publishable_SAfyoebXfb9VQt87pdXxLw_hFSroTU3"
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [screen, setScreen] = useState("start");
  const [reveal, setReveal] = useState(false);

  const [event1, setEvent1] = useState(null);
  const [event2, setEvent2] = useState(null);

  const [score, setScore] = useState(0)

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [savingScore, setSavingScore] = useState(false);

  const [scoreTable, setScoreTable] = useState([]);

  async function showLeaderBoard() {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(100);

      setScoreTable(data);
      setScreen("leaderboard");
  }

  async function startGame() {
    setScore(0);
    setReveal(false);
    setEvent1(await get_event());
    setEvent2(await get_event());
    setScreen("game");
  }

  async function get_event() {
    const { data: rows, count, error: cErr } = await supabase
      .from('events')
      .select('id', { count: 'exact' });

    const total = count;

    const offset = Math.floor(Math.random() * total);

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .range(offset, offset)
      .limit(1);

    return data[0];
  }

  async function save_score() {
    const currentBest = localStorage.getItem("best");
    if (score > currentBest) {
      localStorage.setItem("best", score);
      setSavingScore(true);
    } 
  }

  async function upload_score() {
    if (name.length > 10) {setError("name cannot exceed 9 chars"); return;}
    const { data, error } = await supabase.from("leaderboard").insert({name: name ?? "moron", score: score});
    setSavingScore(false);
  }

  async function answer(e) {
    const answer = event1.date > event2.date ? "Earlier" : "Later";

    setReveal(true);

      if (event1.date == event2.date) {
        setScore(score + 1);
        triggerGreenPulse();
      } else {
        if (e.target.innerHTML == answer) {
          setScore(score + 1);
          triggerGreenPulse();
        } else {
          triggerRedPulse();
          await save_score();
        }
      }

    setTimeout(() => {
      setReveal(false);

      if (event1.date == event2.date) {
        nextEvent();
      } else {
        if (e.target.innerHTML == answer) {
          nextEvent();
        } else {
          setScreen("start");
        }
      }
    }, 600);

  }

  async function nextEvent() {
    setEvent1({...event2});
    setEvent2(await get_event());
  }

  function triggerGreenPulse(containerSelector = '.page-bg', visibleMs = 600) {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    el.classList.remove('green-pulse', 'fade-out');
    void el.offsetWidth;
    el.classList.add('green-pulse');

    setTimeout(() => {
      el.classList.add('fade-out');        
      el.classList.remove('green-pulse'); 
      setTimeout(() => el.classList.remove('fade-out'), 1000);
    }, visibleMs);
  }

  function triggerRedPulse(containerSelector = '.page-bg', visibleMs = 600) {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    el.classList.remove('red-pulse', 'fade-out');

    void el.offsetWidth;

    el.classList.add('red-pulse');

    setTimeout(() => {
      el.classList.add('fade-out');       
      el.classList.remove('red-pulse');  

      setTimeout(() => el.classList.remove('fade-out'), 1000);
    }, visibleMs);
  }


  return (
    <>
      {screen == "leaderboard" && (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-300 to-indigo-400 p-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-2xl">
            <div className="flex justify-between">
              <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-6">
                Leaderboard
              </h2>
              <div>
                <button
                  onClick={() => setScreen("start")}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 active:scale-95 transform transition focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-offset-1"
                >
                  Back
                </button>
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-100/60">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700 rounded-tl-xl">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700 rounded-tr-xl">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scoreTable.map((row, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-slate-50" : "bg-white"
                      } hover:bg-indigo-50 transition`}
                    >
                      <td className="px-6 py-3 text-sm text-slate-600 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-800 font-semibold">
                        {row.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-900 font-bold text-right">
                        {row.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {screen == "game" &&       
      <div className="page-bg relative h-screen w-full flex bg-gradient-to-br from-cyan-100 via-blue-300 to-indigo-400 flex-col lg:flex-row">

          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white backdrop-blur-md border border-white/20 text-black text-lg font-semibold shadow-md">
            Score: {score}
          </div>

        <div className="h-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full h-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-lg text-center max-w-lg">
            <h3 className="text-slate-900 text-3xl sm:text-4xl font-extrabold tracking-tight">
              {event1.event_name}
            </h3>

            <div className="mt-3 text-sm sm:text-base text-slate-600">
              {event1.date}
            </div>

            {/* <div className="mt-4 text-xs text-slate-400">Place the events in order</div> */}
          </div>
        </div>

        <div className="h-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full h-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-lg text-center max-w-lg">
            <h3 className="text-slate-900 text-3xl sm:text-4xl font-extrabold tracking-tight">
              {event2.event_name}
            </h3>

            {reveal && (
              <div className="mt-3 text-sm sm:text-base text-slate-600">
                {event2.date}
              </div>
            )}

            <div className="mt-6 flex gap-4 justify-center">
              <button
                id="earlier"
                onClick={answer}
                type="button"
                className="px-5 py-3 rounded-lg border border-indigo-200 bg-white text-indigo-700 text-sm font-medium hover:shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-offset-2 transition transform active:scale-95"
                aria-label="Choose earlier"
              >
                Earlier
              </button>

              <button
                id="later"
                onClick={answer}
                type="button"
                className="px-5 py-3 rounded-lg bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-500 text-sm font-semibold text-white hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:ring-offset-2 transition transform active:scale-95"
                aria-label="Choose later"
              >
                Later
              </button>
            </div>

            {/* <div className="mt-4 text-xs text-slate-400">Tip: use ← / → to choose</div> */}
          </div>
        </div>
      </div>

      }

      {screen == "start" && 
      
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-300 to-indigo-400">
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <h1 className="text-slate-900 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Epoch
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Put events in order — quick, fun, and simple.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={startGame}
              aria-label="Start game"
              className="flex-1 inline-flex items-center justify-center px-8 py-3 rounded-2xl text-xl sm:text-2xl font-semibold
                        bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-95 transform 
                        transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-offset-2"
            >
              Play
            </button>

            <button
              onClick={showLeaderBoard}
              className="flex-1 inline-flex items-center justify-center px-8 py-3 rounded-2xl text-xl sm:text-2xl font-semibold
                        bg-sky-500 hover:bg-sky-600 focus:ring-sky-200 text-white shadow-md hover:shadow-lg active:scale-95 transform 
                        transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2"
            >
              Leaderboard
            </button>
          </div>

        </div>
      </div>
    
      }

      {savingScore && 

        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white/95 border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">New High Score</h2>
              <p className="text-lg font-light text-red-500 mb-4">{error}</p>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Score: {score}</h3>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition"/>
              <div className="mt-6 flex justify-center gap-4">
                <button onClick={() => setSavingScore(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 active:scale-95 transform transition">No Thanks</button>
                <button onClick={upload_score} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 active:scale-95 transform transition focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-offset-1">Publish</button>
              </div>
            </div>
          </div>


      }

    </>
  )
}

export default App
