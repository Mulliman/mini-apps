import React from 'react';
import { Card } from '../types';
import { ITEM_COLORS } from '../constants';

interface TileProps {
  card: Card;
  onClick: (card: Card) => void;
  disabled: boolean;
}

export const Tile: React.FC<TileProps> = ({ card, onClick, disabled }) => {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card);
    }
  };

  // Determine specific color styles based on item name, fallback to generic if missing
  const colorStyle = ITEM_COLORS[card.item.name] || "bg-white border-gray-300 text-gray-800";

  return (
    <div className={`relative w-full h-32 sm:h-40 cursor-pointer perspective-1000 group ${card.isMatched ? 'opacity-0 sm:opacity-100 sm:visible visible' : ''}`} onClick={handleClick}>
      <div
        className={`w-full h-full transition-all duration-500 transform-style-3d relative ${
          card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Face (Hidden/Back pattern) */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg bg-sky-400 border-4 border-sky-500 flex items-center justify-center transform group-hover:scale-[1.02] transition-transform">
          <span className="text-4xl opacity-50">?</span>
          <div className="absolute inset-0 bg-white opacity-10 rounded-xl" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, white 20%, white 40%, transparent 40%, transparent)', backgroundSize: '10px 10px' }}></div>
        </div>

        {/* Back Face (Revealed Content) */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-2xl shadow-lg border-4 flex flex-col items-center justify-center rotate-y-180 ${colorStyle}`}
        >
          <div className="text-5xl sm:text-6xl mb-2 animate-bounce-small">{card.item.emoji}</div>
          <div className="text-lg sm:text-xl font-bold uppercase tracking-wide">{card.item.name}</div>
        </div>
      </div>
    </div>
  );
};