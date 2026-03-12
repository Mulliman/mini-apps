
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

  const baseClasses = `
    w-full h-full flex flex-col items-center justify-center 
    cursor-pointer transition-all duration-300 hover:brightness-110 
    group overflow-hidden border border-white/5
    ${CATEGORY_COLORS[element.category]}
  `;

  const isVertical = position === 'left' || position === 'right';

  return (
    <div className={baseClasses} onClick={onClick}>
      <div className={`flex ${isVertical ? 'flex-col space-y-1' : 'flex-row items-baseline space-x-3'} items-center justify-center`}>
        <span className={`${isVertical ? 'text-xs' : 'text-sm'} mono font-bold opacity-70`}>#{element.number}</span>
        <span className={`${isVertical ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl'} font-black text-white drop-shadow-md group-hover:scale-110 transition-transform`}>
          {element.symbol}
        </span>
        <span className={`${isVertical ? 'text-[10px]' : 'text-xs md:text-sm'} font-bold uppercase tracking-tighter opacity-80 truncate max-w-full px-1`}>
          {element.name}
        </span>
      </div>
      <div className={`${isVertical ? 'text-xs mt-2' : 'text-[8px] absolute bottom-1'} text-white/30`}>
        {position === 'top' && '↑'}
        {position === 'bottom' && '↓'}
        {position === 'left' && '←'}
        {position === 'right' && '→'}
      </div>
    </div>
  );
};

export default NeighborElement;
