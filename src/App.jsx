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
    }, 1000);

  }

  async function nextEvent() {
    setEvent1({...event2});
    setEvent2(await get_event());
  }

  return (
    <>
      {start && 
      
        <div className="h-screen w-full flex">
          <div className="h-full w-1/2 flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {event1.event_name}
                <br></br>
                {event1.date}
              </div>

            </div>
          </div>

          <div className="h-full w-1/2 flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {event2.event_name}
              </div>

              {reveal && 
                <div className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {event2.date}
                </div>
              }

              <div className="flex gap-3 justify-center">
                <button id="earlier" onClick={answer} type="button" className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition">
                  Earlier
                </button>

                <button id="later" onClick={answer} type="button" className="px-4 py-2 rounded-md bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition">
                  Later
                </button>
              </div>
            </div>
          </div>
         
        </div>

      }

      {!start && 
      
        <div className="h-screen w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-white text-6xl">Epoch</div>
            <button onClick={startGame} className="border-solid border-white p-1 pr-4 pl-4 text-2xl outline-2 rounded-2xl mt-20">Play</button>
          </div>
        </div>
    
      }
    </>
  )
}

export default App
