import React from 'react';

interface CageProps {
  isSpinning: boolean;
}

const Cage: React.FC<CageProps> = ({ isSpinning }) => {
  return (
    <div className={`relative w-64 h-64 transition-transform duration-300 ${isSpinning ? 'scale-105' : 'scale-100'}`}>
      {/* Base/Stand */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-gray-800 rounded-full shadow-lg z-0" />
      <div className="absolute bottom-4 left-10 w-4 h-32 bg-gray-700 -rotate-12 rounded-full z-0" />
      <div className="absolute bottom-4 right-10 w-4 h-32 bg-gray-700 rotate-12 rounded-full z-0" />
      
      {/* The Spinning Cage Group */}
      <div className={`w-full h-full ${isSpinning ? 'animate-spin' : ''}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
           <defs>
            <radialGradient id="cageGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: 'rgba(255,215,0,0.1)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(218,165,32,0.4)', stopOpacity: 1 }} />
            </radialGradient>
          </defs>
          
          {/* Main Sphere Wires */}
          <circle cx="100" cy="100" r="80" fill="url(#cageGradient)" stroke="#d97706" strokeWidth="3" />
          
          {/* Vertical Wires */}
          <ellipse cx="100" cy="100" rx="30" ry="80" fill="none" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="100" cy="100" rx="60" ry="80" fill="none" stroke="#d97706" strokeWidth="2" />
          
          {/* Horizontal Wires */}
          <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="100" cy="100" rx="80" ry="60" fill="none" stroke="#d97706" strokeWidth="2" />

          {/* Handle connection (visual only) */}
          <circle cx="100" cy="100" r="10" fill="#b45309" />
        </svg>
      </div>

      {/* Handle (Static or Animated separately could be better, but keeping simple for React) */}
      <div className={`absolute top-1/2 -right-8 w-16 h-4 bg-red-600 rounded-r-lg origin-left ${isSpinning ? 'animate-pulse' : ''}`} style={{ marginTop: '-8px' }}>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-12 bg-red-800 rounded-full" />
      </div>
    </div>
  );
};

export default Cage;