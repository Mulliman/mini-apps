import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEffects';

export const MascotBanner: React.FC = () => {
  const introText = "Hi Xander! Let's choose the best decision for Xander and Jasper!";

  const handleSpeakIntro = () => {
    soundEngine.speak(introText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-4">
      <div className="bg-white border border-[#E8E1D5] rounded-[28px] p-4 sm:p-5 shadow-xs flex items-center gap-4 relative overflow-hidden">
        {/* Blonde Xander & Brown-haired Jasper Dual Mascot Art */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#E8E1D5]/60 rounded-2xl border border-[#D4CBB8] flex items-center justify-center overflow-hidden shadow-2xs">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Xander (Left Blonde) */}
            <g transform="translate(60, 60)">
              <circle cx="0" cy="0" r="35" fill="#FFE0B2" />
              <path d="M -35 0 A 35 35 0 0 1 35 0 L 35 -10 Q 0 -25 -35 -10 Z" fill="#FDD835" />
              <circle cx="-10" cy="0" r="4.5" fill="#1976D2" />
              <circle cx="15" cy="0" r="4.5" fill="#1976D2" />
              <circle cx="22" cy="10" r="6" fill="#FF8A80" opacity="0.8" />
              <path d="M -5 12 Q 5 22 15 12" stroke="#D84315" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>

            {/* Jasper (Right Brown Curly) */}
            <g transform="translate(140, 60)">
              <circle cx="0" cy="0" r="35" fill="#FFE0B2" />
              <circle cx="-25" cy="-20" r="14" fill="#6D4C41" />
              <circle cx="0" cy="-30" r="16" fill="#6D4C41" />
              <circle cx="25" cy="-20" r="14" fill="#6D4C41" />
              <path d="M -35 0 A 35 35 0 0 1 35 0 L 35 -10 Q 0 -25 -35 -10 Z" fill="#6D4C41" />
              <circle cx="-15" cy="0" r="4.5" fill="#4E342E" />
              <circle cx="10" cy="0" r="4.5" fill="#4E342E" />
              <path d="M -15 12 Q -5 22 5 12" stroke="#D84315" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Text Speech Bubble */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#8B7E6E] uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
            <span>Good Choice Trainer</span>
          </div>
          <p className="text-sm sm:text-base font-extrabold text-[#2D2926] leading-snug">
            {introText}
          </p>
        </div>

        {/* Read Out Loud Button */}
        <button
          onClick={handleSpeakIntro}
          title="Listen"
          className="p-2.5 bg-[#FEFAF2] hover:bg-[#E8E1D5] border border-[#E8E1D5] text-[#433D3A] rounded-2xl shrink-0 transition-transform active:scale-95 shadow-2xs cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
