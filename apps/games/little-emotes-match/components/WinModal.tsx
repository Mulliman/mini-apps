import React from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

interface WinModalProps {
  isOpen: boolean;
  onRestart: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ isOpen, onRestart }) => {
  React.useEffect(() => {
    if (isOpen) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100 border-4 border-yellow-400">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">You Did It!</h2>
        <p className="text-gray-600 mb-8 text-lg">All emotions matched!</p>
        
        <button
          onClick={onRestart}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_4px_0_rgb(202,138,4)] hover:shadow-[0_2px_0_rgb(202,138,4)] hover:translate-y-[2px]"
        >
          <RotateCcw className="w-6 h-6" />
          <span className="text-xl">Play Again</span>
        </button>
      </div>
    </div>
  );
};