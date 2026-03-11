import React from 'react';
import { BallColor } from '../types';

interface BallProps {
  number: number;
  scale: number;
}

// Colors based on Bingo number ranges roughly
const getBallColor = (num: number): BallColor => {
  if (num <= 19) return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-700', shadow: 'shadow-red-900/50' };
  if (num <= 39) return { bg: 'bg-yellow-400', text: 'text-black', border: 'border-yellow-600', shadow: 'shadow-yellow-900/50' };
  if (num <= 59) return { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-700', shadow: 'shadow-blue-900/50' };
  if (num <= 79) return { bg: 'bg-green-500', text: 'text-white', border: 'border-green-700', shadow: 'shadow-green-900/50' };
  return { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-700', shadow: 'shadow-purple-900/50' };
};

const Ball: React.FC<BallProps> = ({ number, scale }) => {
  const colors = getBallColor(number);

  return (
    <div 
      className={`
        relative rounded-full flex items-center justify-center 
        transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${colors.bg} ${colors.border} border-8 ${colors.shadow} shadow-2xl
      `}
      style={{
        width: '300px',
        height: '300px',
        transform: `scale(${scale})`,
        opacity: scale === 0 ? 0 : 1
      }}
    >
      {/* Shine effect */}
      <div className="absolute top-4 left-8 w-16 h-12 bg-white rounded-full opacity-30 rotate-45 blur-sm" />
      
      <span className={`text-9xl font-bold ${colors.text} drop-shadow-md`}>
        {number}
      </span>
    </div>
  );
};

export default Ball;