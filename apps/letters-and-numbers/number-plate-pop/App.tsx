import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateUKPlate } from './utils/gameUtils';
import { Confetti } from './components/Confetti';
import { KeyDisplay } from './components/KeyDisplay';
import Header from '../../shared/Header';

// The yellow used on UK rear plates
const UK_YELLOW = "bg-[#FFD200]";

const App: React.FC = () => {
  const [plate, setPlate] = useState<string>("");
  // Display state for the win screen (updates only on win to prevent flicker)
  const [displayEmoji, setDisplayEmoji] = useState<string>("");
  const [displayWord, setDisplayWord] = useState<string>(""); 
  
  // Ref to hold the current round's answer logic so we don't expose it to the UI early
  const targetRef = useRef<{ word: string, emoji: string }>({ word: '', emoji: '' });
  
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [lastPressed, setLastPressed] = useState<string | null>(null);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const result = generateUKPlate();
    setPlate(result.plate);
    
    // Store solution for logic checks, but don't show it yet
    targetRef.current = {
      word: result.word,
      emoji: result.emoji
    };

    setGameState('playing');
    setMatchedIndices(new Set());
    setLastPressed(null);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState === 'won') return;

    const key = e.key.toUpperCase();
    
    // Ignore non-alphanumeric keys (shift, ctrl, etc.)
    if (key.length !== 1 || !/[A-Z0-9]/.test(key)) return;

    setLastPressed(key);

    // Find first available matching index for this character
    const targetIndex = plate.split('').findIndex((char, index) => {
      return char === key && !matchedIndices.has(index);
    });

    if (targetIndex !== -1) {
      // Correct match!
      const newMatched = new Set(matchedIndices);
      newMatched.add(targetIndex);
      setMatchedIndices(newMatched);
      
      // Check win condition
      const requiredMatches = plate.replace(/\s/g, '').length;
      
      if (newMatched.size === requiredMatches) {
        // Reveal the answer on the overlay now
        setDisplayWord(targetRef.current.word);
        setDisplayEmoji(targetRef.current.emoji);
        
        setGameState('won');
        // Auto restart after delay
        setTimeout(() => {
          startNewGame();
        }, 5000);
      }
    }
  }, [plate, matchedIndices, gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200 flex flex-col selection:bg-transparent">
      <Header title="Number Plate Pop" />
      <div className="flex-grow flex flex-col items-center justify-center p-4 overflow-hidden">
        <Confetti isActive={gameState === 'won'} emoji={displayEmoji} />
        
        {/* Main Game Container */}
        <div className="max-w-3xl w-full flex flex-col items-center gap-12 relative">
          
          {/* Header / Instruction */}
          <div className={`transition-all duration-500 ${gameState === 'won' ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
            <h1 className="text-3xl md:text-4xl text-blue-800 font-bold text-center mb-2 animate-float">
              Type the letters!
            </h1>
            <p className="text-blue-600 text-center text-lg">
              Find the letters on your keyboard
            </p>
          </div>

          {/* Number Plate Component */}
          <div className={`
            relative
            ${UK_YELLOW}
            p-4 sm:p-8
            rounded-2xl
            border-[6px] sm:border-[8px] border-black
            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
            transform transition-all duration-500
            ${gameState === 'won' ? 'scale-110 rotate-3' : 'scale-100'}
          `}>
            <div className="flex gap-2 sm:gap-4">
              {plate.split('').map((char, index) => {
                if (char === ' ') {
                  return <div key={index} className="w-4 sm:w-8" />; // Spacer
                }

                const isMatched = matchedIndices.has(index);
                // Word indices in "AA99 AAA" are 5, 6, 7
                const isWordPart = index >= 5; 
                const isHighlightedWord = gameState === 'won' && isWordPart;

                return (
                  <div
                    key={index}
                    className={`
                      font-plate
                      text-5xl sm:text-7xl md:text-9xl
                      font-bold
                      w-12 sm:w-20 md:w-24
                      h-20 sm:h-32 md:h-40
                      flex items-center justify-center
                      rounded-lg
                      transition-all duration-500
                      select-none
                      relative
                      ${isHighlightedWord 
                        ? 'text-orange-600 scale-125 -translate-y-6 z-10 drop-shadow-2xl' 
                        : isMatched 
                          ? 'text-blue-600' 
                          : 'text-black'
                      }
                    `}
                    style={{
                      textShadow: isHighlightedWord 
                        ? '0 0 30px rgba(249, 115, 22, 0.8)' 
                        : isMatched 
                          ? '0 0 20px rgba(37, 99, 235, 0.6)' 
                          : 'none'
                    }}
                  >
                    {char}
                    {isMatched && !isHighlightedWord && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-full animate-pop opacity-0">
                          ✨
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Manufacturer / Standard text */}
            <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 text-center opacity-30 text-[10px] sm:text-xs font-mono pointer-events-none">
              BS AU 145e • GREAT JOB MOTORS
            </div>
          </div>

          {/* Success Message Overlay */}
          <div className={`
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              transition-all duration-500 pointer-events-none z-20
              ${gameState === 'won' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
            `}>
            <div className="flex flex-col items-center justify-center">
              <div className="text-8xl sm:text-9xl animate-bounce mb-4 drop-shadow-xl z-100">
                  {displayEmoji}
              </div>
              <div className="text-5xl sm:text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] whitespace-nowrap text-stroke">
                {displayWord}
              </div>
            </div>
          </div>

          {/* Instructions for parents (subtle) */}
          <div className="absolute bottom-[-100px] text-blue-400 text-sm opacity-50">
            Press the matching key on your keyboard
          </div>
        </div>
      </div>

      {/* Floating Key Indicator */}
      <KeyDisplay lastPressed={lastPressed} />
    </div>
  );
};

export default App;