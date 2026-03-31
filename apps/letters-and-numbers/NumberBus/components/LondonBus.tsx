import React from 'react';
import { BusData } from '../types';

interface LondonBusProps {
  bus: BusData;
  isWrongInput: boolean;
}

export const LondonBus: React.FC<LondonBusProps> = ({ bus, isWrongInput }) => {
  const isMovingRight = bus.direction === 'left-to-right';
  
  // Bus graphics are drawn facing LEFT (Driver at Left, Entry at Right).
  // If moving Left-to-Right, we flip the container horizontally to face Right.
  const flipStyle = { transform: isMovingRight ? 'scaleX(-1)' : 'none' };
  
  // Text must be counter-flipped if the bus body is flipped so it remains readable.
  // We also ensure it displays inline-block so transform applies.
  const textFlipStyle = { transform: isMovingRight ? 'scaleX(-1)' : 'none', display: 'inline-block' };

  // Animation classes
  const bounceClass = bus.state === 'moving' ? 'animate-bounce-slight' : '';
  
  // Added a gold glow shadow for celebration
  const celebrateClass = bus.state === 'celebrating' 
    ? 'scale-110 transition-all duration-300 drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] z-50' 
    : '';
    
  const shakeClass = isWrongInput ? 'animate-shake' : '';

  return (
    <div
      className={`absolute transition-transform will-change-transform responsive-bus ${celebrateClass} ${shakeClass}`}
      style={{
        left: `${bus.x}px`,
        transform: 'translateX(-50%)', // Center the component on its X coordinate
        width: '300px',
        height: '180px',
        bottom: 'max(calc(clamp(60px, 15vh, 8rem) - 2rem), 1.5rem)',
      }}
    >
      {/* The Bouncing Container */}
      <div className={`relative w-full h-full ${bounceClass}`}>
        
        {/* --- VISUALS LAYER (Flippable) --- */}
        {/* This layer contains the bus body and wheels. It flips if the bus moves right. */}
        <div style={{ ...flipStyle, width: '100%', height: '100%' }}>
            
            {/* Main Body Red */}
            <div className="absolute bottom-4 left-0 w-full h-40 bg-red-600 rounded-3xl shadow-xl border-b-8 border-red-800 overflow-hidden z-10">
                
                {/* Second Deck Windows */}
                <div className="absolute top-2 left-2 right-2 h-12 flex space-x-2">
                    <div className="w-16 h-full bg-blue-200 rounded-lg border-2 border-red-700 opacity-80"></div>
                    <div className="w-16 h-full bg-blue-200 rounded-lg border-2 border-red-700 opacity-80"></div>
                    <div className="w-16 h-full bg-blue-200 rounded-lg border-2 border-red-700 opacity-80"></div>
                    <div className="flex-1 h-full bg-blue-200 rounded-lg border-2 border-red-700 opacity-80"></div>
                </div>

                {/* Separation Line */}
                <div className="absolute top-16 left-0 w-full h-2 bg-red-700"></div>
                
                {/* "London Transport" Sign */}
                <div className="absolute top-16 left-4 bg-yellow-400 px-2 py-0.5 rounded text-[8px] font-bold text-red-900 tracking-widest uppercase shadow-sm z-20">
                    <span style={textFlipStyle}>London Transport</span>
                </div>

                {/* First Deck Windows */}
                <div className="absolute top-20 left-16 right-2 h-14 flex space-x-2">
                    <div className="w-16 h-full bg-blue-200 rounded-lg border-2 border-red-700 opacity-80"></div>
                    <div className="w-16 h-full bg-blue-200 rounded-lg border-2 border-red-700 opacity-80"></div>
                    <div className="flex-1 h-full bg-blue-200 rounded-lg border-2 border-red-700 opacity-80"></div>
                </div>

                {/* Driver Cab (Left side of drawing) */}
                <div className="absolute top-20 left-2 w-12 h-14 bg-blue-300 rounded-tl-xl rounded-bl-lg border-2 border-red-700 opacity-90 overflow-hidden">
                    <div className="absolute bottom-0 right-1 w-6 h-8 bg-gray-800 rounded-t-full"></div>
                </div>
                
                {/* Headlights */}
                <div className="absolute bottom-3 left-1 w-3 h-3 bg-yellow-200 rounded-full shadow-[0_0_5px_rgba(255,255,0,0.8)]"></div>
                <div className="absolute bottom-3 right-2 w-2 h-2 bg-red-900 rounded-full"></div>

                {/* Grill */}
                <div className="absolute bottom-2 left-5 w-8 h-4 bg-gray-800 rounded-md flex flex-col justify-evenly px-1">
                    <div className="w-full h-0.5 bg-gray-600"></div>
                    <div className="w-full h-0.5 bg-gray-600"></div>
                </div>

                {/* Open Platform Entry (Rear/Right side of drawing) */}
                <div className="absolute bottom-0 right-4 w-10 h-16 bg-red-800 opacity-20 rounded-tl-xl"></div>
            </div>

            {/* Wheels 
                We use 'animate-spin-reverse' (Counter-Clockwise) because:
                1. If facing Left (Normal) and moving Left, wheels roll CCW.
                2. If facing Right (Flipped) and moving Right, wheels roll Clockwise. 
                   But inside a ScaleX(-1) container, CCW animation looks Clockwise.
            */}
            <div className="absolute bottom-0 left-8 w-14 h-14 bg-gray-900 rounded-full border-4 border-gray-600 z-20 flex items-center justify-center animate-spin-reverse">
                <div className="w-6 h-6 border-2 border-gray-500 rounded-full border-dashed opacity-50"></div>
            </div>
            <div className="absolute bottom-0 right-10 w-14 h-14 bg-gray-900 rounded-full border-4 border-gray-600 z-20 flex items-center justify-center animate-spin-reverse">
                <div className="w-6 h-6 border-2 border-gray-500 rounded-full border-dashed opacity-50"></div>
            </div>
        </div>

        {/* --- NUMBER PLATE (Never Flipped) --- */}
        {/* This div is outside the flipped container, so the number is always correct. */}
        <div 
            className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-white border-4 border-gray-800 rounded-lg w-24 h-14 flex items-center justify-center shadow-lg"
        >
            <span className="text-4xl font-black text-gray-900 tracking-tighter">
                {bus.number}
            </span>
        </div>

      </div>
      
      {/* Shadow on road */}
      <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black opacity-20 rounded-[100%] blur-md"></div>
    </div>
  );
};

// Add custom styles
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  .animate-spin-reverse {
    animation: spin-reverse 1s linear infinite;
  }
  @keyframes bounce-slight {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  .animate-bounce-slight {
    animation: bounce-slight 0.8s infinite ease-in-out;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }
  @media (max-height: 500px) {
    .responsive-bus {
      transform: scale(0.6) translateX(-50%) !important;
      transform-origin: bottom left;
    }
  }
`;
document.head.appendChild(style);
