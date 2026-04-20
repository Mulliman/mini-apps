import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Circle, Square, Star, Triangle, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../../../shared/Header';

const SHAPES = ['circle', 'square', 'star', 'triangle'] as const;
const COLORS = [
  { name: 'red', class: 'text-red-500', bg: 'bg-red-50' },
  { name: 'yellow', class: 'text-yellow-400', bg: 'bg-yellow-50' },
  { name: 'green', class: 'text-green-500', bg: 'bg-green-50' },
  { name: 'blue', class: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'purple', class: 'text-purple-500', bg: 'bg-purple-50' },
];

type ShapeType = typeof SHAPES[number];
type Mode = 'add' | 'subtract' | 'both';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function App() {
  const [mode, setMode] = useState<Mode>('add');
  const [op, setOp] = useState<'+' | '-'>('+');
  const [num1, setNum1] = useState(1);
  const [num2, setNum2] = useState(1);
  const [shape, setShape] = useState<ShapeType>('circle');
  const [color, setColor] = useState(COLORS[0]);

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [inputTotal, setInputTotal] = useState('');

  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [errorTotal, setErrorTotal] = useState(false);

  const [step, setStep] = useState(0); // 0: num1, 1: num2, 2: total, 3: done

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const inputTotalRef = useRef<HTMLInputElement>(null);

  const startNewRound = (targetMode: Mode = mode) => {
    let newOp: '+' | '-' = '+';
    if (targetMode === 'add') {
      newOp = '+';
    } else if (targetMode === 'subtract') {
      newOp = '-';
    } else {
      newOp = Math.random() < 0.5 ? '+' : '-';
    }
    setOp(newOp);

    let n1, n2;
    if (newOp === '+') {
      n1 = getRandomInt(1, 9);
      n2 = getRandomInt(1, 9);
    } else {
      n1 = getRandomInt(2, 10);
      n2 = getRandomInt(1, n1 - 1); // Ensure n2 is strictly smaller than n1
    }

    setNum1(n1);
    setNum2(n2);
    setShape(getRandomElement(SHAPES));
    setColor(getRandomElement(COLORS));
    setInput1('');
    setInput2('');
    setInputTotal('');
    setError1(false);
    setError2(false);
    setErrorTotal(false);
    setStep(0);
  };

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (step === 0) {
      input1Ref.current?.focus();
    } else if (step === 1) {
      input2Ref.current?.focus();
    } else if (step === 2) {
      inputTotalRef.current?.focus();
    } else if (step === 3) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#facc15', '#22c55e', '#3b82f6', '#a855f7'],
      });
      const timer = setTimeout(() => {
        startNewRound();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setInput1('');
      return;
    }
    const targetStr = num1.toString();
    if (targetStr === val) {
      setInput1(val);
      setStep(1);
      setError1(false);
    } else if (targetStr.startsWith(val)) {
      setInput1(val);
      setError1(false);
    } else {
      setInput1(val);
      setError1(true);
      setTimeout(() => {
        setInput1('');
        setError1(false);
      }, 500);
    }
  };

  const handleInput2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setInput2('');
      return;
    }
    const targetStr = num2.toString();
    if (targetStr === val) {
      setInput2(val);
      setStep(2);
      setError2(false);
    } else if (targetStr.startsWith(val)) {
      setInput2(val);
      setError2(false);
    } else {
      setInput2(val);
      setError2(true);
      setTimeout(() => {
        setInput2('');
        setError2(false);
      }, 500);
    }
  };

  const handleInputTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setInputTotal('');
      return;
    }
    const targetValue = op === '+' ? num1 + num2 : num1 - num2;
    const targetStr = targetValue.toString();
    if (targetStr === val) {
      setInputTotal(val);
      setStep(3);
      setErrorTotal(false);
    } else if (targetStr.startsWith(val)) {
      setInputTotal(val);
      setErrorTotal(false);
    } else {
      setInputTotal(val);
      setErrorTotal(true);
      setTimeout(() => {
        setInputTotal('');
        setErrorTotal(false);
      }, 500);
    }
  };

  const renderShape = (index: number, opacity: number = 1) => {
    const props = {
      className: `w-4 h-4 sm:w-12 sm:h-12 ${color.class}`,
      fill: 'currentColor',
      style: { opacity }
    };
    switch (shape) {
      case 'circle':
        return <Circle key={index} {...props} />;
      case 'square':
        return <Square key={index} {...props} />;
      case 'star':
        return <Star key={index} {...props} />;
      case 'triangle':
        return <Triangle key={index} {...props} />;
    }
  };

  const getTitle = () => {
    if (mode === 'add') return "Let's Add!";
    if (mode === 'subtract') return "Let's Subtract!";
    return "Let's Add or Subtract!";
  };

  const totalShapes = op === '+' ? num1 + num2 : num1 - num2;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-1000 ${color.bg} font-sans overflow-x-hidden`}
    >
      <Header title="Simple Sums" />
      <div className="flex-1 flex flex-col items-center p-4 pt-12">
        {/* Mode Selector */}
        <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm gap-1 mb-8">
          {(['add', 'subtract', 'both'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                startNewRound(m);
                input1Ref.current?.focus();
              }}
              className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base capitalize ${mode === m
                  ? 'bg-white text-gray-800 shadow-md scale-105'
                  : 'text-gray-500 hover:bg-white/30'
                }`}
            >
              {m}
            </button>
          ))}
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-gray-800 mb-8 sm:mb-16 text-center drop-shadow-sm">
          {getTitle()}
        </h1>

        <div className="grid grid-cols-[3fr_auto_3fr_auto_4fr] items-center justify-items-center gap-x-2 sm:gap-x-8 gap-y-4 sm:gap-y-10 w-full max-w-4xl pb-8 px-2 sm:px-8">
          {/* Row 1: Shapes */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 w-full min-h-[60px] sm:min-h-[120px] content-center">
            {Array.from({ length: num1 }).map((_, i) => renderShape(i))}
          </div>

          <div className="text-2xl sm:text-7xl font-black text-gray-400 drop-shadow-sm">
            {op === '+' ? <Plus size={48} strokeWidth={4} /> : <Minus size={48} strokeWidth={4} />}
          </div>

          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 w-full min-h-[60px] sm:min-h-[120px] content-center">
            {Array.from({ length: num2 }).map((_, i) => renderShape(i))}
          </div>

          <div className="text-2xl sm:text-7xl font-black text-gray-400 drop-shadow-sm">=</div>

          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 w-full min-h-[60px] sm:min-h-[120px] content-center">
            {Array.from({ length: totalShapes }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: step >= 2 ? 1 : 0.3, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                {renderShape(i)}
              </motion.div>
            ))}
          </div>

          {/* Row 2: Inputs */}
          <motion.input
            ref={input1Ref}
            type="text"
            inputMode="numeric"
            value={input1}
            onChange={handleInput1Change}
            disabled={step > 0}
            readOnly={error1}
            animate={error1 ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className={`no-spinners w-full aspect-square max-w-[144px] text-center text-3xl sm:text-8xl font-black rounded-xl sm:rounded-3xl border-4 sm:border-8 outline-none transition-all duration-300 shadow-lg ${error1
                ? 'border-red-500 bg-red-100 text-red-600'
                : step > 0
                  ? 'border-green-500 bg-green-100 text-green-600 scale-105'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-4 sm:focus:ring-8 focus:ring-blue-200 bg-white text-gray-800'
              }`}
          />

          <div className="text-2xl sm:text-7xl font-black text-gray-400 drop-shadow-sm">
            {op === '+' ? '+' : '-'}
          </div>

          <motion.input
            ref={input2Ref}
            type="text"
            inputMode="numeric"
            value={input2}
            onChange={handleInput2Change}
            disabled={step > 1 || step < 1}
            readOnly={error2}
            animate={error2 ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className={`no-spinners w-full aspect-square max-w-[144px] text-center text-3xl sm:text-8xl font-black rounded-xl sm:rounded-3xl border-4 sm:border-8 outline-none transition-all duration-300 shadow-lg ${error2
                ? 'border-red-500 bg-red-100 text-red-600'
                : step > 1
                  ? 'border-green-500 bg-green-100 text-green-600 scale-105'
                  : step === 1
                    ? 'border-gray-300 focus:border-blue-500 focus:ring-4 sm:focus:ring-8 focus:ring-blue-200 bg-white text-gray-800 scale-105'
                    : 'border-gray-200 bg-gray-50 text-gray-300 opacity-70'
              }`}
          />

          <div className="text-2xl sm:text-7xl font-black text-gray-400 drop-shadow-sm">=</div>

          <motion.input
            ref={inputTotalRef}
            type="text"
            inputMode="numeric"
            value={inputTotal}
            onChange={handleInputTotalChange}
            disabled={step > 2 || step < 2}
            readOnly={errorTotal}
            animate={errorTotal ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className={`no-spinners w-full aspect-[4/3] max-w-[192px] text-center text-3xl sm:text-8xl font-black rounded-xl sm:rounded-3xl border-4 sm:border-8 outline-none transition-all duration-300 shadow-lg ${errorTotal
                ? 'border-red-500 bg-red-100 text-red-600'
                : step > 2
                  ? 'border-green-500 bg-green-100 text-green-600 scale-110'
                  : step === 2
                    ? 'border-gray-300 focus:border-purple-500 focus:ring-4 sm:focus:ring-8 focus:ring-purple-200 bg-white text-gray-800 scale-110'
                    : 'border-gray-200 bg-gray-50 text-gray-300 opacity-70'
              }`}
          />
        </div>

        <div className="h-24 mt-8">
          <AnimatePresence>
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -50 }}
                className="text-5xl sm:text-7xl font-black text-green-500 drop-shadow-lg"
              >
                Great Job!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
