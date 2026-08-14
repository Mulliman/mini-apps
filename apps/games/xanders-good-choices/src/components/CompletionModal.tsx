import React, { useEffect } from 'react';
import { Award, Sparkles, RotateCcw, CheckCircle2, Star, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChoiceHistoryItem } from '../types';
import { soundEngine } from '../utils/soundEffects';

interface CompletionModalProps {
  score: number;
  totalQuestions: number;
  history: ChoiceHistoryItem[];
  onRestart: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  score,
  totalQuestions,
  history,
  onRestart,
}) => {
  useEffect(() => {
    // Play celebratory sound and confetti
    soundEngine.playStarFanfare();
    soundEngine.speak("Hooray Xander! You made super good choices today! You get ten gold stars!");

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#42A5F5', '#FDD835', '#66BB6A', '#AB47BC']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#42A5F5', '#FDD835', '#66BB6A', '#AB47BC']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto py-2 sm:py-4 animate-fade-in flex flex-col gap-5">
      {/* Certificate / Hero Award Card */}
      <div className="bg-white border-2 border-[#E8E1D5] rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 text-center shadow-md relative overflow-hidden flex flex-col items-center gap-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E8E1D5]/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#D4CBB8]/30 rounded-full blur-xl pointer-events-none" />

        {/* Big Trophy / Award Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F59E0B] text-white rounded-full flex items-center justify-center shadow-md border-4 border-white">
          <Award className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#2D2926] tracking-tight">
          Super Star Xander! 🎉
        </h2>
        <p className="text-base sm:text-lg font-bold text-[#7A7067] max-w-md">
          You made super good choices and earned all your stars!
        </p>

        {/* Stars Banner */}
        <div className="flex items-center justify-center gap-2 bg-[#FEFAF2] border border-[#E8E1D5] px-6 py-3 rounded-full shadow-2xs">
          {Array.from({ length: Math.min(totalQuestions, 10) }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                idx < score ? 'text-[#F59E0B] fill-[#F59E0B] drop-shadow-xs' : 'text-[#E8E1D5] fill-[#E8E1D5]'
              }`}
            />
          ))}
        </div>

        {/* Certificate Badge Text */}
        <div className="bg-[#FEFAF2] border-2 border-dashed border-[#D4CBB8] rounded-2xl p-4 w-full max-w-lg shadow-2xs mt-2">
          <p className="text-xs uppercase font-extrabold text-[#8B7E6E] tracking-wider">Official Certificate</p>
          <p className="text-lg font-black text-[#2D2926] mt-1">Good Choice Champion Badge</p>
          <p className="text-xs font-semibold text-[#7A7067] mt-0.5">Awarded to Xander for kindness, safety & polite manners!</p>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          id="play-again-btn"
          className="mt-2 px-10 py-4 bg-[#433D3A] hover:bg-[#2D2926] active:scale-95 text-white font-black text-xl rounded-full shadow-md transition-all flex items-center gap-3 cursor-pointer"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Play Again!</span>
        </button>
      </div>

      {/* Choice Breakdown History */}
      <div className="bg-white rounded-[32px] p-6 border border-[#E8E1D5] shadow-2xs flex flex-col gap-4">
        <h3 className="text-xl font-black text-[#2D2926] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
          <span>Xander's Good Choices Today</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FEFAF2] border border-[#E8E1D5] rounded-2xl p-3.5 flex items-start gap-3"
            >
              <div className="bg-[#10B981] text-white p-1.5 rounded-full shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#8B7E6E] uppercase tracking-wide">Question {idx + 1}</p>
                <p className="text-sm font-bold text-[#2D2926] leading-snug">{item.scenario}</p>
                {item.firstTryCorrect ? (
                  <span className="inline-block mt-1 text-[11px] font-extrabold text-[#065F46] bg-[#ECFDF5] border border-[#10B981]/30 px-2 py-0.5 rounded-full">
                    ⭐ Perfect First Try!
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-[11px] font-bold text-[#7A7067] bg-[#E8E1D5] px-2 py-0.5 rounded-full">
                    👍 Learned & Retry!
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
