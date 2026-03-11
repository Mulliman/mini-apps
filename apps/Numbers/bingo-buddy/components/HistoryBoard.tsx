import React from 'react';

interface HistoryBoardProps {
  drawnNumbers: number[];
}

const HistoryBoard: React.FC<HistoryBoardProps> = ({ drawnNumbers }) => {
  // Create array 1-90
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm border-t-4 border-indigo-200 p-4 h-[30vh] overflow-y-auto">
      <h3 className="text-xl font-bold text-indigo-800 mb-2 text-center uppercase tracking-wider">Called Numbers</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {allNumbers.map((num) => {
          const isCalled = drawnNumbers.includes(num);
          // Highlight the most recent number differently
          const isLatest = drawnNumbers.length > 0 && drawnNumbers[drawnNumbers.length - 1] === num;
          
          return (
            <div
              key={num}
              className={`
                w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold border-2 transition-all
                ${isLatest 
                    ? 'bg-pink-500 border-pink-700 text-white scale-125 shadow-lg z-10 animate-bounce' 
                    : isCalled 
                        ? 'bg-indigo-500 border-indigo-700 text-white shadow-sm' 
                        : 'bg-white border-gray-200 text-gray-300'}
              `}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryBoard;