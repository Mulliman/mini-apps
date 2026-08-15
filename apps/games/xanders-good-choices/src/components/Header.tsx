import React from 'react';
import { Volume2, VolumeX, Sparkles, Flame, Settings, Copy, Layers } from 'lucide-react';

interface HeaderProps {
  score: number;
  totalQuestions: number;
  streak: number;
  isMuted: boolean;
  autoRead: boolean;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onToggleMute: () => void;
  onToggleAutoRead: () => void;
  onOpenParentModal: () => void;
  onOpenPromptModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  totalQuestions,
  streak,
  isMuted,
  autoRead,
  selectedCategory,
  onSelectCategory,
  onToggleMute,
  onToggleAutoRead,
  onOpenParentModal,
  onOpenPromptModal,
}) => {
  const categories = [
    { label: '🌟 All Questions', value: 'All' },
    { label: '🧸 Playtime & Sharing', value: 'Playtime & Sharing' },
    { label: '🍎 Food & Mealtimes', value: 'Food & Mealtimes' },
    { label: '🌙 Bedtime & Evening', value: 'Bedtime & Evening' },
    { label: '✨ Manners & Kindness', value: 'Manners & Kindness' },
    { label: '❤️ Emotions & Self-Control', value: 'Emotions & Self-Control' },
    { label: '🛑 Safety & Out and About', value: 'Safety & Out and About' },
    { label: '🚽 Potty Training', value: 'Potty Training' },
  ];

  return (
    <header className="bg-[#FEFAF2]/95 backdrop-blur-md sticky top-0 z-20 border-b border-[#E8E1D5] px-3 py-2 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#E8E1D5] border border-[#D4CBB8] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                <circle cx="50" cy="50" r="40" fill="#FFE0B2" />
                <path d="M 10 50 A 40 40 0 0 1 90 50 L 90 30 Q 50 10 10 30 Z" fill="#FDD835" />
                <circle cx="35" cy="50" r="5" fill="#1976D2" />
                <circle cx="65" cy="50" r="5" fill="#1976D2" />
                <circle cx="28" cy="62" r="7" fill="#FF8A80" opacity="0.8" />
                <circle cx="72" cy="62" r="7" fill="#FF8A80" opacity="0.8" />
                <path d="M 38 68 Q 50 80 62 68" stroke="#D84315" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-[#2D2926] leading-none">
                Xander's Good Choices
              </h1>
              <p className="text-[11px] font-medium text-[#7A7067] hidden sm:block mt-0.5">
                Learn & Play with Xander and Jasper
              </p>
            </div>
          </div>

          {/* Controls & Scores */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Category Dropdown Selector */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                id="category-selector-dropdown"
                className="text-xs font-bold bg-[#433D3A] text-white border border-[#2D2926] rounded-full px-3 py-1.5 pr-7 cursor-pointer appearance-none shadow-xs hover:bg-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value} className="bg-white text-[#2D2926]">
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-white/80">▼</span>
            </div>

            {/* Star Counter */}
            <div className="flex items-center gap-1 bg-white text-[#2D2926] border border-[#E8E1D5] px-2.5 py-1 rounded-full text-xs font-extrabold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              <span>{score}</span>
              <span className="text-[#8B7E6E] font-medium text-[11px]">/ {totalQuestions}</span>
            </div>

            {/* Streak Counter */}
            {streak > 0 && (
              <div className="flex items-center gap-0.5 bg-[#FFF7ED] text-[#9A3412] border border-[#FFEDD5] px-2 py-1 rounded-full text-xs font-black shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-[#F97316] fill-[#F97316]" />
                <span>{streak}</span>
              </div>
            )}

            {/* Export Prompts Button */}
            <button
              onClick={onOpenPromptModal}
              title="View & Export Image Prompts for Flow"
              className="p-1.5 rounded-full bg-white hover:bg-[#F5EFE6] border border-[#E8E1D5] text-[#433D3A] transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold px-2.5"
            >
              <Copy className="w-3.5 h-3.5 text-[#2D2926]" />
              <span className="hidden md:inline">Prompts</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              id="audio-toggle-btn"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              className={`p-1.5 rounded-full border text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
                isMuted
                  ? 'bg-[#E8E1D5] text-[#8B7E6E] border-[#D4CBB8]'
                  : 'bg-white text-[#433D3A] border-[#E8E1D5] hover:bg-[#F5EFE6]'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Parent Settings Button */}
            <button
              onClick={onOpenParentModal}
              id="parents-settings-btn"
              title="Parent Settings"
              className="p-1.5 rounded-full bg-white hover:bg-[#F5EFE6] border border-[#E8E1D5] text-[#433D3A] transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
