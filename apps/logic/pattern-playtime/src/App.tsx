/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Header from '../../../shared/Header';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ALL_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const ALL_SHAPES = ['circle', 'triangle', 'square', 'pentagon', 'star'];

type Level = {
  id: number;
  name: string;
  numColors: number;
  numShapes: number;
  sameShape: boolean;
  sameColor: boolean;
};

const LEVELS: Level[] = [
  { id: 0, name: "2 Colours, Same Shape", numColors: 2, numShapes: 1, sameShape: true, sameColor: false },
  { id: 1, name: "3 Colours, Same Shape", numColors: 3, numShapes: 1, sameShape: true, sameColor: false },
  { id: 2, name: "2 Shapes, Same Colour", numColors: 1, numShapes: 2, sameShape: false, sameColor: true },
  { id: 3, name: "3 Shapes, Same Colour", numColors: 1, numShapes: 3, sameShape: false, sameColor: true },
  { id: 4, name: "2 Shapes, 2 Colours", numColors: 2, numShapes: 2, sameShape: false, sameColor: false },
  { id: 5, name: "3 Shapes, 3 Colours", numColors: 3, numShapes: 3, sameShape: false, sameColor: false },
  { id: 6, name: "4 Shapes, 4 Colours", numColors: 4, numShapes: 4, sameShape: false, sameColor: false },
];

type PatternItem = {
  color: string;
  shape: string;
  id?: string;
};

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const ShapeIcon = ({ shape, color, className }: { shape: string, color: string, className?: string }) => {
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    gray: '#9ca3af'
  };
  const fill = colorMap[color] || '#000';

  switch (shape) {
    case 'circle':
      return <svg viewBox="0 0 100 100" className={className}><circle cx="50" cy="50" r="50" fill={fill} /></svg>;
    case 'triangle':
      return <svg viewBox="0 0 100 100" className={className}><polygon points="50,0 100,100 0,100" fill={fill} /></svg>;
    case 'square':
      return <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="10" fill={fill} /></svg>;
    case 'pentagon':
      return <svg viewBox="0 0 100 100" className={className}><polygon points="50,0 100,38 81,100 19,100 0,38" fill={fill} /></svg>;
    case 'star':
      return <svg viewBox="0 0 100 100" className={className}><polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill={fill} /></svg>;
    default:
      return null;
  }
}

export default function App() {
  const [level, setLevel] = useState<Level>(LEVELS[0]);
  const [sequence, setSequence] = useState<PatternItem[]>([]);
  const [missingItem, setMissingItem] = useState<PatternItem | null>(null);
  const [options, setOptions] = useState<PatternItem[]>([]);
  const [wrongOptions, setWrongOptions] = useState<Set<string>>(new Set());
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [gameMode, setGameMode] = useState<'simple' | 'split'>('simple');
  const [splitPhase, setSplitPhase] = useState<'shape' | 'color' | 'done'>('shape');
  const [partialShape, setPartialShape] = useState<string | null>(null);

  const generatePattern = useCallback((currentLevel: Level) => {
    const isSplit = !currentLevel.sameShape && !currentLevel.sameColor;
    setGameMode(isSplit ? 'split' : 'simple');
    setSplitPhase('shape');
    setPartialShape(null);

    const patternId = Math.random().toString(36).substring(7);
    const colors = shuffle([...ALL_COLORS]).slice(0, currentLevel.numColors);
    const shapes = shuffle([...ALL_SHAPES]).slice(0, currentLevel.numShapes);
    
    const blockSize = Math.max(currentLevel.numColors, currentLevel.numShapes);
    const block: PatternItem[] = [];
    
    for (let i = 0; i < blockSize; i++) {
      block.push({
        color: colors[i % colors.length],
        shape: shapes[i % shapes.length]
      });
    }
    
    let templates: number[][] = [];
    if (blockSize === 2) {
      templates = [
        [0, 1],          // ABAB
        [0, 0, 1],       // AABAAB
        [0, 1, 1],       // ABBABB
        [0, 0, 1, 1]     // AABBAABB
      ];
    } else if (blockSize === 3) {
      templates = [
        [0, 1, 2],       // ABCABC
        [0, 0, 1, 2],    // AABCAABC
        [0, 1, 1, 2],    // ABBCAABC
        [0, 1, 2, 2]     // ABCCABCC
      ];
    } else {
      templates = [
        [0, 1, 2, 3]     // ABCDABCD
      ];
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // To ensure the pattern is logically provable, we must show at least one full repetition,
    // plus enough of the second repetition to remove ambiguity.
    let repetitions = 2;
    if (template.length <= 2) repetitions = 3;
    
    // targetLength is either exactly the end of a repetition, or the first item of the next.
    const targetLength = (template.length * repetitions) + Math.floor(Math.random() * 2);
    
    const newSequence: PatternItem[] = [];
    for (let i = 0; i < targetLength; i++) {
      const templateIndex = i % template.length;
      const blockIndex = template[templateIndex];
      newSequence.push({ ...block[blockIndex], id: `seq-${patternId}-${i}` });
    }
    
    const missing = newSequence[newSequence.length - 1];
    const visibleSequence = newSequence.slice(0, -1);
    
    const newOptions: PatternItem[] = [{ ...missing, id: `opt-${patternId}-correct` }];
    
    const allCombos: PatternItem[] = [];
    for (const c of colors) {
      for (const s of shapes) {
        allCombos.push({ color: c, shape: s });
      }
    }
    
    if (allCombos.length < 3) {
      if (currentLevel.numColors < 3 && currentLevel.sameShape) {
         const extraColor = shuffle(ALL_COLORS.filter(c => !colors.includes(c)))[0];
         allCombos.push({ color: extraColor, shape: shapes[0] });
      } else if (currentLevel.numShapes < 3 && currentLevel.sameColor) {
         const extraShape = shuffle(ALL_SHAPES.filter(s => !shapes.includes(s)))[0];
         allCombos.push({ color: colors[0], shape: extraShape });
      }
    }
    
    const distractors = shuffle(allCombos.filter(c => c.color !== missing.color || c.shape !== missing.shape));
    
    let optIndex = 0;
    while (newOptions.length < 4 && distractors.length > 0) {
      const dist = distractors.pop()!;
      newOptions.push({ ...dist, id: `opt-${patternId}-wrong-${optIndex++}` });
    }
    
    setSequence(visibleSequence);
    setMissingItem(missing);
    setOptions(shuffle(newOptions));
    setWrongOptions(new Set());
    setIsSuccess(false);
  }, []);

  useEffect(() => {
    generatePattern(level);
  }, [level, generatePattern]);

  const triggerSuccess = (event: React.MouseEvent) => {
    setIsSuccess(true);
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'],
      zIndex: 100
    });

    setTimeout(() => {
      generatePattern(level);
    }, 2000);
  };

  const handleOptionClick = (option: PatternItem, event: React.MouseEvent) => {
    if (isSuccess || wrongOptions.has(option.id!)) return;

    if (option.color === missingItem?.color && option.shape === missingItem?.shape) {
      triggerSuccess(event);
    } else {
      setWrongOptions(prev => new Set(prev).add(option.id!));
    }
  };

  const handleShapeClick = (shape: string, event: React.MouseEvent) => {
    if (wrongOptions.has(shape)) return;
    if (shape === missingItem?.shape) {
      setPartialShape(shape);
      setSplitPhase('color');
      setWrongOptions(new Set());
    } else {
      setWrongOptions(prev => new Set(prev).add(shape));
    }
  };

  const handleColorClick = (color: string, event: React.MouseEvent) => {
    if (wrongOptions.has(color)) return;
    if (color === missingItem?.color) {
      setSplitPhase('done');
      triggerSuccess(event);
    } else {
      setWrongOptions(prev => new Set(prev).add(color));
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center font-sans">
      <Header title="Pattern Playtime" />
      <div className="w-full max-w-4xl flex flex-col items-center gap-4 sm:gap-8 py-4 px-2 sm:py-8 sm:px-4">
        
        {/* Header & Level Selector */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-4 border-sky-300">
          <h1 className="text-2xl sm:text-3xl font-black text-sky-600 tracking-tight text-center">
            Pattern Playtime! 🎨
          </h1>
          <select 
            className="w-full sm:w-auto bg-sky-50 border-2 border-sky-200 text-sky-800 text-base sm:text-lg font-bold rounded-xl px-3 py-2 sm:px-4 sm:py-3 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200 transition-all cursor-pointer"
            value={level.id}
            onChange={(e) => setLevel(LEVELS.find(l => l.id === parseInt(e.target.value)) || LEVELS[0])}
          >
            {LEVELS.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Game Area */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border-4 border-sky-300 min-h-[300px] sm:min-h-[400px] flex flex-col justify-center gap-8 sm:gap-12">
          
          {/* Pattern Sequence */}
          <div className="w-full flex items-center justify-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 py-4">
            <AnimatePresence mode="popLayout">
              {sequence.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.1 }}
                  className="flex-1 max-w-[2.5rem] sm:max-w-[3.5rem] md:max-w-[4.5rem] lg:max-w-[5.5rem] aspect-square drop-shadow-md"
                >
                  <ShapeIcon shape={item.shape} color={item.color} className="w-full h-full" />
                </motion.div>
              ))}
              
              {/* Missing Slot */}
              <motion.div
                key="missing-slot"
                className="flex-1 max-w-[2.5rem] sm:max-w-[3.5rem] md:max-w-[4.5rem] lg:max-w-[5.5rem] aspect-square rounded-lg sm:rounded-xl border-2 sm:border-4 border-dashed border-sky-200 flex items-center justify-center bg-sky-50 relative"
              >
                <AnimatePresence>
                  {isSuccess && missingItem && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 w-full h-full drop-shadow-md p-1"
                    >
                      <ShapeIcon shape={missingItem.shape} color={missingItem.color} className="w-full h-full" />
                    </motion.div>
                  )}
                  {gameMode === 'split' && splitPhase === 'color' && partialShape && !isSuccess && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 w-full h-full drop-shadow-md p-1"
                    >
                      <ShapeIcon shape={partialShape} color="gray" className="w-full h-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isSuccess && !(gameMode === 'split' && splitPhase === 'color') && (
                  <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-sky-300 font-bold">?</span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Options */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {gameMode === 'simple' && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-sky-600 text-center">What comes next?</h2>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8">
                  {options.map((option) => {
                    const isWrong = wrongOptions.has(option.id!);
                    return (
                      <motion.button
                        key={option.id}
                        onClick={(e) => handleOptionClick(option, e)}
                        disabled={isSuccess || isWrong}
                        animate={isWrong ? {
                          x: [0, -10, 10, -10, 10, 0],
                          opacity: 0,
                          scale: 0.5
                        } : {
                          scale: 1,
                          opacity: 1
                        }}
                        transition={isWrong ? { duration: 0.5 } : { type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={!isSuccess && !isWrong ? { scale: 1.1, rotate: 5 } : {}}
                        whileTap={!isSuccess && !isWrong ? { scale: 0.9 } : {}}
                        className={cn(
                          "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 sm:border-4 border-sky-100 p-2 sm:p-3 cursor-pointer transition-colors",
                          !isSuccess && !isWrong && "hover:border-sky-300 hover:shadow-xl",
                          isWrong && "pointer-events-none"
                        )}
                      >
                        <ShapeIcon shape={option.shape} color={option.color} className="w-full h-full drop-shadow-sm" />
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {gameMode === 'split' && splitPhase === 'shape' && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-sky-600 text-center">What shape comes next?</h2>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8">
                  {ALL_SHAPES.map(shape => {
                    const isWrong = wrongOptions.has(shape);
                    return (
                      <motion.button
                        key={shape}
                        onClick={(e) => handleShapeClick(shape, e)}
                        disabled={isSuccess || isWrong}
                        animate={isWrong ? {
                          x: [0, -10, 10, -10, 10, 0],
                          opacity: 0,
                          scale: 0.5
                        } : {
                          scale: 1,
                          opacity: 1
                        }}
                        transition={isWrong ? { duration: 0.5 } : { type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={!isSuccess && !isWrong ? { scale: 1.1, rotate: 5 } : {}}
                        whileTap={!isSuccess && !isWrong ? { scale: 0.9 } : {}}
                        className={cn(
                          "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 sm:border-4 border-sky-100 p-2 sm:p-3 cursor-pointer transition-colors",
                          !isSuccess && !isWrong && "hover:border-sky-300 hover:shadow-xl",
                          isWrong && "pointer-events-none"
                        )}
                      >
                        <ShapeIcon shape={shape} color="gray" className="w-full h-full drop-shadow-sm" />
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {gameMode === 'split' && splitPhase === 'color' && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-sky-600 text-center">What colour comes next?</h2>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8">
                  {ALL_COLORS.map(color => {
                    const isWrong = wrongOptions.has(color);
                    return (
                      <motion.button
                        key={color}
                        onClick={(e) => handleColorClick(color, e)}
                        disabled={isSuccess || isWrong}
                        animate={isWrong ? {
                          x: [0, -10, 10, -10, 10, 0],
                          opacity: 0,
                          scale: 0.5
                        } : {
                          scale: 1,
                          opacity: 1
                        }}
                        transition={isWrong ? { duration: 0.5 } : { type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={!isSuccess && !isWrong ? { scale: 1.1, rotate: 5 } : {}}
                        whileTap={!isSuccess && !isWrong ? { scale: 0.9 } : {}}
                        className={cn(
                          "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 sm:border-4 border-sky-100 p-2 sm:p-3 cursor-pointer transition-colors",
                          !isSuccess && !isWrong && "hover:border-sky-300 hover:shadow-xl",
                          isWrong && "pointer-events-none"
                        )}
                      >
                        <ShapeIcon shape={partialShape!} color={color} className="w-full h-full drop-shadow-sm" />
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

