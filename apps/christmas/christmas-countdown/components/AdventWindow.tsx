import React from 'react';

interface AdventWindowProps {
  number: number;
  isNext: boolean;
  isOpen: boolean;
  onClick: (num: number) => void;
}

export const AdventWindow: React.FC<AdventWindowProps> = ({ number, isNext, isOpen, onClick }) => {
  return (
    <button
      onClick={() => onClick(number)}
      disabled={isOpen || !isNext}
      className={`
        relative flex items-center justify-center w-full h-full rounded-xl
        text-2xl sm:text-4xl font-bold transition-all duration-300 transform will-change-transform
        ${isOpen 
          ? 'window-open cursor-default' 
          : 'window-closed hover:scale-105 cursor-pointer shadow-md'
        }
      `}
      aria-label={`Window number ${number}`}
    >
      <span className="drop-shadow-sm christmas-font font-bold">
        {number}
      </span>
      {isOpen && (
        <span className="absolute inset-0 flex items-center justify-center text-white/20 text-5xl">
          ❄
        </span>
      )}
    </button>
  );
};