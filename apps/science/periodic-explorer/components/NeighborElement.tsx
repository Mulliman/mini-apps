
import React from 'react';
import { PeriodicElement } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface NeighborElementProps {
  element: PeriodicElement | null;
  position: 'top' | 'bottom' | 'left' | 'right';
  onClick: () => void;
}

const NeighborElement: React.FC<NeighborElementProps> = ({ element, position, onClick }) => {
  if (!element) return <div className="w-full h-full" />;

  const isVertical = position === 'left' || position === 'right';

  const baseClasses = `
    w-full h-full flex flex-col items-center justify-center 
    cursor-pointer transition-all duration-300 hover:brightness-110 
    group overflow-hidden border border-white/5
    ${isVertical ? 'opacity-60 md:opacity-100 bg-white/5' : ''}
    ${CATEGORY_COLORS[element.category]}
  `;

  return (
    <div className={baseClasses} onClick={onClick}>
      <div className={`flex ${isVertical ? 'flex-col space-y-0.5' : 'flex-row items-baseline space-x-1 md:space-x-3'} items-center justify-center p-1`}>
        <span className={`${isVertical ? 'text-[7px] md:text-xs' : 'text-[9px] md:text-sm'} mono font-bold opacity-60`}>#{element.number}</span>
        <span className={`${isVertical ? 'text-sm md:text-3xl' : 'text-xl md:text-4xl'} font-black text-white hover:scale-110 transition-transform`}>
          {element.symbol}
        </span>
        <span className={`${isVertical ? 'hidden lg:block text-[9px] md:text-[10px]' : 'hidden sm:block text-[9px] md:text-sm'} font-bold uppercase tracking-tighter opacity-70 truncate max-w-full px-1`}>
          {element.name}
        </span>
      </div>
      <div className={`${isVertical ? 'hidden md:block text-xs mt-1' : 'text-[8px] absolute bottom-0.5'} text-white/30`}>
        {position === 'top' && '↑'}
        {position === 'bottom' && '↓'}
        {position === 'left' && '←'}
        {position === 'right' && '→'}
      </div>
    </div>
  );
};

export default NeighborElement;
