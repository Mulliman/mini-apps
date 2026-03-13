import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameBackground } from './components/GameBackground';
import { LondonBus } from './components/LondonBus';
import { Sparkles } from './components/Sparkles';
import { BusData } from './types';
import Header from '../../shared/Header';


const BUS_SPEED_BASE = 2; // Pixels per frame
const SPAWN_DELAY = 1000; // ms

const generateBus = (width: number): BusData => {
  const direction = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left';
  // 3-year old friendly numbers (mostly 1-20, occasionally higher up to 100)
  // We weight it towards smaller numbers for easier play
  let num;
  const r = Math.random();
  if (r < 0.6) num = Math.floor(Math.random() * 20) + 1; // 60% chance 1-20
  else if (r < 0.9) num = Math.floor(Math.random() * 50) + 1; // 30% chance 1-50
  else num = Math.floor(Math.random() * 100) + 1; // 10% chance 1-100

  return {
    id: Math.random().toString(36).substr(2, 9),
    number: num,
    x: direction === 'left-to-right' ? -350 : width + 350,
    direction,
    state: 'moving',
    speed: BUS_SPEED_BASE + Math.random(),
  };
};

const App: React.FC = () => {
  const [bus, setBus] = useState<BusData | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [isWrongInput, setIsWrongInput] = useState<boolean>(false);
  
  // Refs for game loop state to avoid closure staleness
  const busRef = useRef<BusData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const userInputRef = useRef<string>('');

  // Sync ref with state for keydown handler
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  useEffect(() => {
    busRef.current = bus;
  }, [bus]);

  const spawnBus = useCallback(() => {
    const width = window.innerWidth;
    const newBus = generateBus(width);
    setBus(newBus);
    busRef.current = newBus;
    setUserInput('');
    setIsWrongInput(false);
  }, []);

  // Game Loop
  const animate = useCallback(() => {
    // Request next frame immediately to ensure loop keeps running
    requestRef.current = requestAnimationFrame(animate);

    if (busRef.current) {
      const currentBus = { ...busRef.current };
      const width = window.innerWidth;

      if (currentBus.state === 'moving') {
        let shouldRemove = false;

        // Movement
        if (currentBus.direction === 'left-to-right') {
          currentBus.x += currentBus.speed;
          // Check bounds - if missed, just respawn, keep score
          if (currentBus.x > width + 400) {
            shouldRemove = true;
          }
        } else {
          currentBus.x -= currentBus.speed;
          if (currentBus.x < -400) {
            shouldRemove = true;
          }
        }

        if (shouldRemove) {
          setBus(null);
          busRef.current = null;
          setTimeout(spawnBus, SPAWN_DELAY);
        } else {
          setBus(currentBus);
          busRef.current = currentBus;
        }

      } else if (currentBus.state === 'celebrating') {
        // Keeps bus in place while animating
      }
    }
  }, [spawnBus]);

  useEffect(() => {
    // Start game loop
    requestRef.current = requestAnimationFrame(animate);
    
    // Initial spawn if empty
    if (!busRef.current) {
        spawnBus();
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate, spawnBus]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!busRef.current || busRef.current.state !== 'moving') return;

      // Only allow numbers
      if (!/^[0-9]$/.test(e.key)) return;

      const targetNumStr = busRef.current.number.toString();
      const nextInput = userInputRef.current + e.key;

      // Check if the new input is a valid prefix of the target
      if (targetNumStr.startsWith(nextInput)) {
        setUserInput(nextInput);
        
        // Check for exact match complete
        if (nextInput === targetNumStr) {
          // SUCCESS!
          setScore(s => s + 1);
          
          // Update bus state to celebrating
          const celebratingBus: BusData = {
            ...busRef.current,
            state: 'celebrating',
          };
          setBus(celebratingBus);
          busRef.current = celebratingBus;
          
          // After celebration, remove and respawn
          setTimeout(() => {
            setBus(null);
            busRef.current = null;
            setTimeout(spawnBus, 500);
          }, 1500); // 1.5s celebration
        }
      } else {
        // WRONG INPUT
        setIsWrongInput(true);
        setTimeout(() => setIsWrongInput(false), 400);
        // Reset input for them to try again immediately
        setUserInput('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spawnBus]);


  return (
    <div ref={containerRef} className="relative w-screen h-screen bg-sky-300 overflow-hidden select-none font-fredoka flex flex-col">
      <Header title="Number Bus London" />
      <div ref={gameAreaRef} className="relative flex-1 w-full overflow-hidden">
        <GameBackground />

        {/* Score Board */}
      <div className="absolute top-20 left-6 z-30 bg-white/90 rounded-2xl p-4 shadow-lg border-4 border-yellow-400 transform -rotate-2">
        <div className="text-2xl font-bold text-gray-600 uppercase tracking-wider">Score</div>
        <div className="text-5xl font-black text-yellow-500 text-center">{score}</div>
      </div>

      {/* Instruction Hint */}
      <div className="absolute top-20 right-6 z-30 bg-white/90 rounded-2xl p-4 shadow-lg border-4 border-blue-400 transform rotate-2 max-w-xs hidden md:block">

        <p className="text-xl text-center font-bold text-gray-700">
           Type the number on the bus!
        </p>
      </div>

      {/* User Input Display (What they have typed so far) */}
      {userInput && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
           <div className="text-9xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] animate-pulse">
              {userInput}
           </div>
        </div>
      )}

        {/* The Bus */}
        {bus && (
          <>
            <LondonBus bus={bus} isWrongInput={isWrongInput} />
            {bus.state === 'celebrating' && (
              <Sparkles x={bus.x} y={(gameAreaRef.current?.clientHeight || window.innerHeight) - 150} />
            )}
          </>
        )}
      </div>

      {/* Mobile Virtual Keypad */}
      <div className="w-full h-32 bg-gray-100 flex items-center justify-center space-x-2 p-2 border-t-4 border-gray-300 z-50 relative">
         {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              className="flex-1 h-full max-w-[60px] bg-white rounded-lg shadow-md border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 text-2xl font-bold text-blue-600 flex items-center justify-center"
              onClick={() => {
                 // Dispatch keyboard event for compatibility with existing logic
                 const event = new KeyboardEvent('keydown', { key: num.toString() });
                 window.dispatchEvent(event);
              }}
            >
              {num}
            </button>
         ))}
      </div>

    </div>
  );
};

export default App;