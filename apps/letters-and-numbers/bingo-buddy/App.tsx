import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BINGO_CALLS } from './constants';
import { GameState } from './types';
import Cage from './components/Cage';
import Ball from './components/Ball';
import HistoryBoard from './components/HistoryBoard';
import { speakNumber } from './utils/tts';
import Header from '../../shared/Header';


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>(
    Array.from({ length: 90 }, (_, i) => i + 1)
  );

  // Audio needs user interaction to unlock first time usually,
  // but we will trigger it on the 'Next Turn' action which is a user interaction.

  const resetGame = () => {
    window.speechSynthesis.cancel();
    setGameState(GameState.IDLE);
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setAvailableNumbers(Array.from({ length: 90 }, (_, i) => i + 1));
  };

  const nextTurn = useCallback(() => {
    if (gameState === GameState.SPINNING || gameState === GameState.REVEALING || gameState === GameState.FINISHED) {
      return;
    }

    if (availableNumbers.length === 0) {
      setGameState(GameState.FINISHED);
      return;
    }

    // 1. Start Spinning Cage
    setGameState(GameState.SPINNING);

    // 2. Determine number logic (do it now, reveal later)
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const nextNum = availableNumbers[randomIndex];
    
    // Remove from available immediately so logic is safe
    const newAvailable = [...availableNumbers];
    newAvailable.splice(randomIndex, 1);
    setAvailableNumbers(newAvailable);

    // 3. Timers for animation sequence
    setTimeout(() => {
      // Stop spinning, set number, start revealing
      setCurrentNumber(nextNum);
      setGameState(GameState.REVEALING);
      
      // Add to history now or after reveal? Let's add now but it shows at bottom
      setDrawnNumbers(prev => [...prev, nextNum]);

      // 4. Trigger Audio after a brief pause for the "Zoom" visual to start
      setTimeout(() => {
        const callText = BINGO_CALLS[nextNum.toString()] || "Bingo!";
        speakNumber(nextNum, callText);
        setGameState(GameState.WAITING);
      }, 600); 

    }, 2000); // Spin duration

  }, [availableNumbers, gameState]);

  // Global Input Handler (Mouse or Key)
  useEffect(() => {
    const handleInput = (e: Event) => {
      // If clicking button, don't trigger this listener if it bubbles?
      // Actually we want clicking anywhere to work, EXCEPT buttons which handle themselves.
      // But for simplicity, we attach to window keydown and a large overlay div for click.
      if (e.type === 'keydown') {
        const ke = e as KeyboardEvent;
        // Ignore F5 etc
        if (['F5', 'r', 'R'].includes(ke.key) && (ke.ctrlKey || ke.metaKey)) return;
      }
      
      nextTurn();
    };

    window.addEventListener('keydown', handleInput);
    
    return () => {
      window.removeEventListener('keydown', handleInput);
    };
  }, [nextTurn]);

  // Handle click on the "screen" for next turn
  const handleScreenClick = () => {
    if (gameState === GameState.IDLE) {
        nextTurn();
    } else if (gameState === GameState.WAITING) {
        nextTurn();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-yellow-100 overflow-hidden relative select-none">
      <Header title="Bingo Buddy" />
      
      {/* Controls */}
      <div className="absolute top-16 w-full p-4 flex justify-end items-center z-50">
        <button 
          onClick={(e) => { e.stopPropagation(); resetGame(); }}
          className="pointer-events-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
        >
          NEW GAME
        </button>
      </div>


      {/* Main Game Area */}
      <div 
        className="flex-grow relative flex flex-col items-center justify-center cursor-pointer"
        onClick={handleScreenClick}
      >
        
        {/* State: IDLE / GAME OVER */}
        {gameState === GameState.IDLE && (
           <div className="text-center animate-bounce">
             <p className="text-4xl font-bold text-indigo-600 mb-4">Tap or Press Key to Start!</p>
             <div className="text-6xl">👆</div>
           </div>
        )}

        {gameState === GameState.FINISHED && (
           <div className="text-center z-20">
             <p className="text-6xl font-black text-purple-600 mb-4">GAME OVER!</p>
             <p className="text-2xl text-purple-800">All numbers called.</p>
           </div>
        )}

        {/* The Stage */}
        <div className={`transition-opacity duration-500 ${gameState === GameState.IDLE ? 'opacity-20' : 'opacity-100'}`}>
            
            {/* The Cage (Always visible but animating differently) */}
            <div className={`transition-all duration-500 ${gameState === GameState.REVEALING || gameState === GameState.WAITING ? 'translate-y-[-150px] scale-75 blur-sm opacity-50' : 'translate-y-0 opacity-100'}`}>
               <Cage isSpinning={gameState === GameState.SPINNING} />
            </div>

            {/* The Ball (Overlaying) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              {currentNumber !== null && (
                 <Ball 
                   number={currentNumber} 
                   scale={gameState === GameState.REVEALING || gameState === GameState.WAITING ? 1 : 0} 
                 />
              )}
            </div>

            {/* The Call Text */}
            <div className={`absolute top-2/3 left-0 w-full text-center mt-16 transition-all duration-500 ${gameState === GameState.WAITING ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                {currentNumber && (
                    <div className="bg-white/90 backdrop-blur mx-auto inline-block px-8 py-4 rounded-3xl shadow-xl border-4 border-blue-300">
                        <p className="text-4xl md:text-5xl font-black text-blue-600 font-sans">
                            {BINGO_CALLS[currentNumber.toString()]}
                        </p>
                    </div>
                )}
                {gameState === GameState.WAITING && (
                    <p className="mt-8 text-gray-500 font-bold animate-pulse">Click for next number...</p>
                )}
            </div>
        </div>

      </div>

      {/* History Area */}
      <HistoryBoard drawnNumbers={drawnNumbers} />

    </div>
  );
};

export default App;