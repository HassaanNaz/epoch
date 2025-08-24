import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zeucfsakakfgbadndzut.supabase.co"
const supabaseKey = "sb_publishable_SAfyoebXfb9VQt87pdXxLw_hFSroTU3"
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [start, setStart] = useState(false);
  const [reveal, setReveal] = useState(false);

  const [event1, setEvent1] = useState(null);
  const [event2, setEvent2] = useState(null);

  const [score, setScore] = useState(0)


  async function startGame() {
    setReveal(false);
    setEvent1(await get_event());
    setEvent2(await get_event());
    setStart(true);
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

  function answer(e) {
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
          setStart(false);
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
      {start &&       
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

      {!start && 
      
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-cyan-100 via-blue-300 to-indigo-400">
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <h1 className="text-slate-900 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Epoch
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Put events in order — quick, fun, and simple.
          </p>

          <button
            onClick={startGame}
            aria-label="Start game"
            className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-3 rounded-2xl text-xl sm:text-2xl font-semibold
                      bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-95 transform transition-all duration-200
                      focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-offset-2"
          >
            Play
          </button>
        </div>
      </div>
    
      }
    </>
  )
}

export default App
