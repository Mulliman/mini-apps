import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../../shared/Header';
import christmasBg from './assets/christmas-background.png';
import { AdventWindow } from './components/AdventWindow';
import { LoadingState } from './types';

// Helper to shuffle array for random window positions (optional, but requested implicitly by "find the window")
// Actually, standard advent calendars are often scrambled. Let's scramble them for fun.
const INITIAL_SEQUENCE = Array.from({ length: 24 }, (_, i) => i + 1);

const App: React.FC = () => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [currentNumber, setCurrentNumber] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [gridOrder, setGridOrder] = useState<number[]>(INITIAL_SEQUENCE);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  
  // Audio for success sound (simple oscillator)
  const playSound = (freq: number = 600, type: OscillatorType = 'sine') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const initGame = useCallback(async (refreshImage = true) => {
    setCurrentNumber(1);
    setInputValue("");
    setShowWinModal(false);
    
    // Scramble the grid positions
    const shuffled = [...INITIAL_SEQUENCE].sort(() => Math.random() - 0.5);
    setGridOrder(shuffled);

    if (refreshImage) {
      setBgImage(christmasBg);
      setLoadingState('success');
    }
  }, []);

  useEffect(() => {
    initGame(true);
    // Create snow effect
    const interval = setInterval(() => {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
        snowflake.style.opacity = Math.random().toString();
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
        document.body.appendChild(snowflake);
        
        setTimeout(() => {
          snowflake.remove();
        }, 5000);
      }, 200);
      return () => clearInterval(interval);
  }, [initGame]);

  const handleProgress = useCallback((num: number) => {
    if (num === 24) {
      playSound(800, 'triangle'); // Win sound
      setCurrentNumber(25); // Mark as complete
      setShowWinModal(true);
      
      // Auto reset after 5 seconds
      setTimeout(() => {
        initGame(false); // Reset game but keep image to be snappy
      }, 5000);
    } else {
      playSound(400 + (num * 10)); // Pitch up slightly
      setCurrentNumber(prev => prev + 1);
      setInputValue("");
    }
  }, [initGame]);

  const handleWindowClick = (num: number) => {
    if (num === currentNumber) {
      handleProgress(num);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Only allow numbers
    if (!/^\d*$/.test(val)) return;
    
    setInputValue(val);

    const parsed = parseInt(val, 10);
    if (parsed === currentNumber) {
        handleProgress(parsed);
    }
  };

  // Keep input focused
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!showWinModal && window.matchMedia("(pointer: fine)").matches) {
        inputRef.current?.focus();
    }
  }, [currentNumber, showWinModal]);


  return (
    <div className="h-[100dvh] bg-slate-900 flex flex-col items-center justify-start relative overflow-hidden">
      <Header title="Christmas Countdown" />
      
      {/* Background Image Layer */}
      {bgImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${bgImage})`, opacity: loadingState === 'success' ? 1 : 0 }}
        />
      )}
      
      {/* Loading Overlay (Simplified as it loads near instantly now) */}
      {loadingState === 'loading' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900 text-white">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-bounce">🎅</div>
            <p className="christmas-font text-2xl">Loading Christmas...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl p-4 flex flex-col items-center h-full">
        
        {/* Header content moved to shared header but kept for internal layout if needed, or removed. I'll remove the redundant h1 but keep the info. */}
        <header className="mb-4 sm:mb-8 text-center glass-panel p-4 rounded-xl px-12">
          <h1 className="text-4xl sm:text-6xl font-bold text-red-600 christmas-font drop-shadow-sm">
            Christmas Countdown
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Find number <span className="text-xl font-bold text-red-500">{currentNumber <= 24 ? currentNumber : '🎅'}</span>
          </p>
        </header>

        {/* The Grid */}
        <main className="w-full grid grid-cols-4 sm:grid-cols-6 grid-rows-6 sm:grid-rows-4 gap-2 sm:gap-4 md:gap-6 flex-grow min-h-0 pb-4 sm:pb-24">
          {gridOrder.map((num) => (
            <AdventWindow 
              key={num}
              number={num}
              isNext={num === currentNumber}
              isOpen={num < currentNumber}
              onClick={handleWindowClick}
            />
          ))}
        </main>

        {/* Bottom Controls */}
        <div className="hidden sm:flex fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur shadow-up z-40 justify-center items-center gap-4 border-t-4 border-red-500">
           <label className="text-xl sm:text-2xl font-bold text-slate-700 christmas-font whitespace-nowrap">
             Type next number:
           </label>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={handleInputChange}
              className="w-20 h-10 text-center text-xl border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500 text-slate-800 font-bold"
              placeholder={currentNumber.toString()}
              disabled={showWinModal || currentNumber > 24}
            />
        </div>
      </div>

      {/* Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-2xl text-center transform scale-110 border-4 border-red-500">
            <div className="text-6xl mb-4 animate-bounce">🎄</div>
            <h2 className="text-5xl sm:text-7xl christmas-font font-bold text-green-600 mb-4">
              Merry Christmas!
            </h2>
            <p className="text-xl text-slate-600 animate-pulse">Restarting soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;