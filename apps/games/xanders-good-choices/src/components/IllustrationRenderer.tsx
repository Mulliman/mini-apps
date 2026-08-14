import React from 'react';
import { ActionType } from '../types';

interface IllustrationProps {
  actionType: ActionType;
  isCorrect?: boolean;
  className?: string;
}

export const IllustrationRenderer: React.FC<IllustrationProps> = ({ actionType, isCorrect, className = '' }) => {
  // Base color constants matching the art style:
  const XANDER_HAIR = '#FDD835'; // Bright blonde bowl cut
  const XANDER_SKIN = '#FFE0B2'; // Soft warm peach skin
  const XANDER_EYE = '#1976D2';  // Bright blue eyes
  const XANDER_CHEEK = '#FF8A80';// Rosy pink cheek
  const XANDER_SHIRT = '#42A5F5';// Bright blue shirt

  const JASPER_HAIR = '#6D4C41'; // Brown curly hair
  const JASPER_SKIN = '#FFE0B2'; // Soft warm peach skin
  const JASPER_EYE = '#4E342E';  // Warm brown eyes
  const JASPER_SHIRT = '#FF7043';// Orange shirt

  return (
    <div className={`relative w-full aspect-16/10 rounded-xl overflow-hidden shadow-2xs border transition-all duration-300 ${
      isCorrect === true 
        ? 'border-[#10B981] bg-[#ECFDF5]' 
        : isCorrect === false 
        ? 'border-[#F43F5E] bg-[#FFF1F2]' 
        : 'border-[#E8E1D5] bg-[#FEFAF2]'
    } ${className}`}>
      <svg
        viewBox="0 0 400 250"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgTealGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F7FA" />
            <stop offset="100%" stopColor="#B2EBF2" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="100%" stopColor="#FFF59D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Backdrop */}
        <rect width="400" height="250" fill="url(#bgTealGrad)" />
        <circle cx="200" cy="125" r="160" fill="url(#sunGlow)" />
        <rect y="190" width="400" height="60" fill="#B2DFDB" rx="6" />

        {/* 1. GIVE TOY (Sharing) */}
        {actionType === 'give_toy' && (
          <g>
            {/* Xander (Left) giving train to Jasper (Right) */}
            <g transform="translate(100, 80)">
              <rect x="-22" y="45" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="32" fill={XANDER_SKIN} />
              <path d="M -32 5 A 32 32 0 0 1 32 5 L 32 -5 Q 0 -18 -32 -5 Z" fill={XANDER_HAIR} />
              <circle cx="10" cy="5" r="4.5" fill={XANDER_EYE} />
              <circle cx="16" cy="15" r="5" fill={XANDER_CHEEK} opacity="0.8" />
              <path d="M 0 18 Q 10 26 16 18" stroke="#D84315" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 12 50 Q 40 45 55 45" stroke={XANDER_SKIN} strokeWidth="12" strokeLinecap="round" />
            </g>
            {/* Toy Train */}
            <g transform="translate(185, 125)">
              <rect x="-16" y="-12" width="32" height="20" rx="4" fill="#E53935" />
              <rect x="-8" y="-22" width="14" height="12" fill="#1E88E5" rx="2" />
              <circle cx="-10" cy="10" r="5" fill="#424242" />
              <circle cx="10" cy="10" r="5" fill="#424242" />
            </g>
            {/* Jasper (Right) */}
            <g transform="translate(290, 80)">
              <rect x="-22" y="45" width="44" height="50" rx="12" fill={JASPER_SHIRT} />
              <circle cx="0" cy="5" r="32" fill={JASPER_SKIN} />
              <circle cx="-22" cy="-12" r="14" fill={JASPER_HAIR} />
              <circle cx="0" cy="-24" r="16" fill={JASPER_HAIR} />
              <circle cx="22" cy="-12" r="14" fill={JASPER_HAIR} />
              <path d="M -32 5 A 32 32 0 0 1 32 5 L 32 -5 Q 0 -18 -32 -5 Z" fill={JASPER_HAIR} />
              <circle cx="-10" cy="5" r="4.5" fill={JASPER_EYE} />
              <path d="M -16 18 Q -8 26 0 18" stroke="#D84315" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M -12 50 Q -40 45 -55 45" stroke={JASPER_SKIN} strokeWidth="12" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 2. PUSH (Negative Choice) */}
        {actionType === 'push' && (
          <g>
            <g transform="translate(110, 80)">
              <rect x="-22" y="45" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="32" fill={XANDER_SKIN} />
              <path d="M -32 5 A 32 32 0 0 1 32 5 L 32 -5 Q 0 -18 -32 -5 Z" fill={XANDER_HAIR} />
              <circle cx="10" cy="5" r="4.5" fill={XANDER_EYE} />
              <path d="M 2 0 L 16 5" stroke="#424242" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 12 45 L 65 40" stroke={XANDER_SKIN} strokeWidth="14" strokeLinecap="round" />
            </g>
            {/* Impact Lines */}
            <path d="M 190 110 L 175 95 M 195 125 L 175 125 M 190 140 L 175 155" stroke="#E53935" strokeWidth="3" strokeLinecap="round" />
            {/* Jasper falling back */}
            <g transform="translate(290, 90) rotate(18)">
              <rect x="-22" y="45" width="44" height="50" rx="12" fill={JASPER_SHIRT} />
              <circle cx="0" cy="5" r="32" fill={JASPER_SKIN} />
              <circle cx="-22" cy="-12" r="14" fill={JASPER_HAIR} />
              <circle cx="0" cy="-24" r="16" fill={JASPER_HAIR} />
              <circle cx="22" cy="-12" r="14" fill={JASPER_HAIR} />
              <path d="M -32 5 A 32 32 0 0 1 32 5 L 32 -5 Q 0 -18 -32 -5 Z" fill={JASPER_HAIR} />
              <circle cx="-10" cy="5" r="5" fill={JASPER_EYE} />
              <circle cx="-8" cy="22" r="6" fill="#D84315" />
            </g>
          </g>
        )}

        {/* 3. SLEEP (Bedtime Routine) */}
        {actionType === 'sleep' && (
          <g>
            <rect x="40" y="110" width="320" height="90" rx="12" fill="#7E57C2" />
            <rect x="50" y="100" width="80" height="50" rx="8" fill="#FFF" />
            <g transform="translate(90, 115)">
              <circle cx="0" cy="0" r="26" fill={XANDER_SKIN} />
              <path d="M -26 0 A 26 26 0 0 1 26 0 L 26 -8 Q 0 -16 -26 -8 Z" fill={XANDER_HAIR} />
              <path d="M -6 -2 Q -2 3 2 -2" stroke="#424242" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
            <path d="M 110 130 L 350 130 Q 355 130 355 140 L 355 195 L 110 195 Z" fill="#26C6DA" />
            <path d="M 310 25 A 20 20 0 1 0 335 50 A 16 16 0 1 1 310 25 Z" fill="#FFD54F" />
            <text x="190" y="60" fill="#7E57C2" fontSize="20" fontWeight="bold" fontFamily="sans-serif">Z</text>
            <text x="215" y="45" fill="#7E57C2" fontSize="26" fontWeight="bold" fontFamily="sans-serif">z</text>
          </g>
        )}

        {/* 4. CLIMB BED (Negative Choice) */}
        {actionType === 'climb_bed' && (
          <g>
            <rect x="60" y="140" width="280" height="70" rx="8" fill="#7E57C2" />
            <g transform="translate(200, 70)">
              <rect x="-18" y="20" width="36" height="40" rx="8" fill={XANDER_SHIRT} />
              <circle cx="0" cy="-8" r="28" fill={XANDER_SKIN} />
              <path d="M -28 -8 A 28 28 0 0 1 28 -8 L 28 -16 Q 0 -28 -28 -16 Z" fill={XANDER_HAIR} />
              <circle cx="-8" cy="-8" r="4" fill={XANDER_EYE} />
              <circle cx="8" cy="-8" r="4" fill={XANDER_EYE} />
              <circle cx="0" cy="8" r="7" fill="#D84315" />
              <path d="M -18 25 L -45 0 M 18 25 L 45 0" stroke={XANDER_SKIN} strokeWidth="10" strokeLinecap="round" />
            </g>
            <path d="M 160 140 Q 200 155 240 140" stroke="#FF5252" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* 5. SHARE APPLE */}
        {actionType === 'share_apple' && (
          <g>
            <g transform="translate(130, 85)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={XANDER_SKIN} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={XANDER_HAIR} />
              <circle cx="8" cy="5" r="4" fill={XANDER_EYE} />
              <path d="M -4 16 Q 6 24 12 16" stroke="#D84315" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
            <ellipse cx="240" cy="155" rx="35" ry="14" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="2" />
            <circle cx="240" cy="142" r="18" fill="#E53935" />
            <path d="M 242 124 Q 252 115 250 127 Z" fill="#43A047" />
            <rect x="210" y="40" width="105" height="38" rx="12" fill="#FFF" stroke="#42A5F5" strokeWidth="2" />
            <text x="262" y="64" fill="#1976D2" fontSize="14" fontWeight="bold" textAnchor="middle">Thank You!</text>
          </g>
        )}

        {/* 6. THROW FOOD */}
        {actionType === 'throw_food' && (
          <g>
            <g transform="translate(130, 80)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={XANDER_SKIN} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={XANDER_HAIR} />
              <circle cx="8" cy="5" r="4" fill={XANDER_EYE} />
              <path d="M -4 18 Q 6 10 12 18" stroke="#D84315" strokeWidth="2.5" fill="none" />
              <path d="M 15 45 L 60 25" stroke={XANDER_SKIN} strokeWidth="12" strokeLinecap="round" />
            </g>
            <circle cx="220" cy="95" r="10" fill="#E53935" />
            <ellipse cx="280" cy="205" rx="30" ry="8" fill="#E53935" opacity="0.7" />
          </g>
        )}

        {/* 7. TIDY TOYS */}
        {actionType === 'tidy_toys' && (
          <g>
            <g transform="translate(120, 80)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={XANDER_SKIN} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={XANDER_HAIR} />
              <circle cx="8" cy="5" r="4" fill={XANDER_EYE} />
              <path d="M -4 16 Q 6 24 12 16" stroke="#D84315" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 12 45 Q 40 55 55 70" stroke={XANDER_SKIN} strokeWidth="10" strokeLinecap="round" />
              <rect x="50" y="60" width="18" height="18" fill="#43A047" rx="3" />
            </g>
            <rect x="210" y="115" width="100" height="75" rx="10" fill="#E53935" />
            <text x="260" y="158" fill="#FFF" fontSize="16" fontWeight="bold" textAnchor="middle">TOYS</text>
          </g>
        )}

        {/* 8. LEAVE MESS */}
        {actionType === 'leave_mess' && (
          <g>
            <rect x="70" y="190" width="22" height="22" fill="#E53935" rx="3" />
            <rect x="120" y="200" width="26" height="18" fill="#1E88E5" rx="3" />
            <circle cx="165" cy="195" r="12" fill="#FFB300" />
            <g transform="translate(290, 85)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={XANDER_SKIN} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={XANDER_HAIR} />
              <circle cx="-8" cy="5" r="4" fill={XANDER_EYE} />
            </g>
          </g>
        )}

        {/* 9. ASK NICELY */}
        {actionType === 'ask_nicely' && (
          <g>
            <g transform="translate(110, 80)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={XANDER_SKIN} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={XANDER_HAIR} />
              <circle cx="8" cy="5" r="4" fill={XANDER_EYE} />
              <path d="M -4 16 Q 6 24 12 16" stroke="#D84315" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
            <rect x="145" y="30" width="130" height="42" rx="14" fill="#FFF" stroke="#43A047" strokeWidth="2" />
            <text x="210" y="56" fill="#2E7D32" fontSize="13" fontWeight="bold" textAnchor="middle">May I have a turn?</text>
            <g transform="translate(280, 85)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={JASPER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={JASPER_SKIN} />
              <circle cx="-22" cy="-12" r="14" fill={JASPER_HAIR} />
              <circle cx="0" cy="-24" r="16" fill={JASPER_HAIR} />
              <circle cx="22" cy="-12" r="14" fill={JASPER_HAIR} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={JASPER_HAIR} />
              <circle cx="-8" cy="5" r="4" fill={JASPER_EYE} />
            </g>
          </g>
        )}

        {/* 10. PULL HAIR */}
        {actionType === 'pull_hair' && (
          <g>
            <g transform="translate(130, 80)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={XANDER_SKIN} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={XANDER_HAIR} />
              <circle cx="8" cy="5" r="4" fill={XANDER_EYE} />
              <path d="M 15 40 L 65 20" stroke={XANDER_SKIN} strokeWidth="12" strokeLinecap="round" />
            </g>
            <g transform="translate(240, 80)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={JASPER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={JASPER_SKIN} />
              <circle cx="-22" cy="-12" r="14" fill={JASPER_HAIR} />
              <circle cx="0" cy="-24" r="16" fill={JASPER_HAIR} />
              <circle cx="22" cy="-12" r="14" fill={JASPER_HAIR} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={JASPER_HAIR} />
              <path d="M -12 20 Q -4 8 4 20" stroke="#D84315" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 11. HOLD HAND */}
        {actionType === 'hold_hand' && (
          <g>
            <rect y="170" width="400" height="80" fill="#B0BEC5" />
            <g transform="translate(220, 60)">
              <rect x="-18" y="30" width="36" height="80" rx="8" fill="#E91E63" />
              <circle cx="0" cy="0" r="26" fill="#FFCC80" />
            </g>
            <g transform="translate(130, 95)">
              <rect x="-18" y="35" width="36" height="50" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="26" fill={XANDER_SKIN} />
              <path d="M -26 5 A 26 26 0 0 1 26 5 L 26 -5 Q 0 -16 -26 -5 Z" fill={XANDER_HAIR} />
              <circle cx="6" cy="5" r="3.5" fill={XANDER_EYE} />
              <path d="M 12 40 Q 40 50 60 45" stroke={XANDER_SKIN} strokeWidth="10" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 12. RUN STREET */}
        {actionType === 'run_street' && (
          <g>
            <rect y="150" width="400" height="100" fill="#424242" />
            <line x1="0" y1="200" x2="400" y2="200" stroke="#FFEB3B" strokeWidth="5" strokeDasharray="16 12" />
            <g transform="translate(160, 90)">
              <rect x="-18" y="35" width="36" height="50" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="26" fill={XANDER_SKIN} />
              <path d="M -26 5 A 26 26 0 0 1 26 5 L 26 -5 Q 0 -16 -26 -5 Z" fill={XANDER_HAIR} />
            </g>
            <polygon points="310,25 335,25 350,40 350,65 335,80 310,80 295,65 295,40" fill="#D32F2F" />
            <text x="322" y="58" fill="#FFF" fontSize="13" fontWeight="bold" textAnchor="middle">STOP</text>
          </g>
        )}

        {/* 13. WASH HANDS */}
        {actionType === 'wash_hands' && (
          <g>
            <rect x="110" y="140" width="140" height="70" rx="16" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="3" />
            <path d="M 180 85 L 180 140" stroke="#29B6F6" strokeWidth="10" opacity="0.8" strokeLinecap="round" />
            <g transform="translate(180, 50)">
              <rect x="-18" y="30" width="36" height="40" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="0" r="24" fill={XANDER_SKIN} />
              <path d="M -24 0 A 24 24 0 0 1 24 0 L 24 -8 Q 0 -18 -24 -8 Z" fill={XANDER_HAIR} />
            </g>
            <circle cx="165" cy="135" r="9" fill="#FFF" opacity="0.9" />
            <circle cx="195" cy="130" r="12" fill="#FFF" opacity="0.9" />
          </g>
        )}

        {/* 14. EAT DIRTY HANDS */}
        {actionType === 'eat_dirty_hands' && (
          <g>
            <g transform="translate(180, 75)">
              <rect x="-18" y="30" width="36" height="40" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="0" r="24" fill={XANDER_SKIN} />
              <path d="M -24 0 A 24 24 0 0 1 24 0 L 24 -8 Q 0 -18 -24 -8 Z" fill={XANDER_HAIR} />
              <circle cx="-20" cy="32" r="10" fill="#795548" />
              <circle cx="20" cy="32" r="10" fill="#795548" />
            </g>
            <circle cx="130" cy="105" r="8" fill="#7CB342" />
            <circle cx="230" cy="95" r="7" fill="#7CB342" />
          </g>
        )}

        {/* 15. LISTEN ADULT */}
        {actionType === 'listen_adult' && (
          <g>
            <g transform="translate(130, 80)">
              <rect x="-18" y="35" width="36" height="50" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="26" fill={XANDER_SKIN} />
              <path d="M -26 5 A 26 26 0 0 1 26 5 L 26 -5 Q 0 -16 -26 -5 Z" fill={XANDER_HAIR} />
              <path d="M -3 16 Q 5 22 10 16" stroke="#D84315" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
            <rect x="210" y="95" width="80" height="60" rx="6" fill="#37474F" stroke="#263238" strokeWidth="3" />
            <rect x="217" y="102" width="66" height="46" rx="3" fill="#546E7A" />
            <circle cx="250" cy="125" r="10" fill="#EF5350" />
          </g>
        )}

        {/* 16. SCREAM KICK */}
        {actionType === 'scream_kick' && (
          <g>
            <g transform="translate(180, 80)">
              <rect x="-18" y="35" width="36" height="50" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="26" fill={XANDER_SKIN} />
              <path d="M -26 5 A 26 26 0 0 1 26 5 L 26 -5 Q 0 -16 -26 -5 Z" fill={XANDER_HAIR} />
              <ellipse cx="0" cy="16" rx="11" ry="9" fill="#D32F2F" />
              <path d="M -48 0 L -36 8 L -48 16 M 48 0 L 36 8 L 48 16" stroke="#E53935" strokeWidth="3" fill="none" />
            </g>
          </g>
        )}

        {/* 17. WAIT SLIDE */}
        {actionType === 'wait_slide' && (
          <g>
            <path d="M 240 70 L 330 190" stroke="#FF9800" strokeWidth="15" strokeLinecap="round" fill="none" />
            <g transform="translate(280, 115)">
              <circle cx="0" cy="0" r="16" fill={JASPER_SKIN} />
              <circle cx="-8" cy="-8" r="8" fill={JASPER_HAIR} />
            </g>
            <g transform="translate(120, 85)">
              <rect x="-18" y="35" width="36" height="50" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="26" fill={XANDER_SKIN} />
              <path d="M -26 5 A 26 26 0 0 1 26 5 L 26 -5 Q 0 -16 -26 -5 Z" fill={XANDER_HAIR} />
            </g>
          </g>
        )}

        {/* 18. PUSH SLIDE */}
        {actionType === 'push_slide' && (
          <g>
            <path d="M 240 70 L 330 190" stroke="#FF9800" strokeWidth="15" strokeLinecap="round" fill="none" />
            <g transform="translate(160, 80)">
              <rect x="-18" y="35" width="36" height="50" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="26" fill={XANDER_SKIN} />
              <path d="M -26 5 A 26 26 0 0 1 26 5 L 26 -5 Q 0 -16 -26 -5 Z" fill={XANDER_HAIR} />
              <path d="M 12 38 L 52 30" stroke={XANDER_SKIN} strokeWidth="10" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* 19. SAY SORRY */}
        {actionType === 'say_sorry' && (
          <g>
            <rect x="210" y="160" width="26" height="26" fill="#E53935" rx="3" />
            <rect x="210" y="132" width="26" height="26" fill="#1E88E5" rx="3" />
            <g transform="translate(120, 80)">
              <rect x="-18" y="35" width="36" height="50" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="26" fill={XANDER_SKIN} />
              <path d="M -26 5 A 26 26 0 0 1 26 5 L 26 -5 Q 0 -16 -26 -5 Z" fill={XANDER_HAIR} />
              <path d="M 12 38 Q 45 45 70 50" stroke={XANDER_SKIN} strokeWidth="10" strokeLinecap="round" />
            </g>
            <path d="M 180 50 C 172 38, 160 50, 180 68 C 200 50, 188 38, 180 50" fill="#E91E63" />
          </g>
        )}

        {/* 20. LAUGH RUN */}
        {actionType === 'laugh_run' && (
          <g>
            <rect x="90" y="195" width="24" height="16" fill="#E53935" rx="3" transform="rotate(25 90 195)" />
            <rect x="130" y="200" width="20" height="16" fill="#1E88E5" rx="3" transform="rotate(-30 130 200)" />
            <g transform="translate(250, 80)">
              <rect x="-18" y="35" width="36" height="50" rx="10" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="26" fill={XANDER_SKIN} />
              <path d="M -26 5 A 26 26 0 0 1 26 5 L 26 -5 Q 0 -16 -26 -5 Z" fill={XANDER_HAIR} />
            </g>
          </g>
        )}

        {/* Fallback */}
        {(actionType === 'custom' || !['give_toy','push','sleep','climb_bed','share_apple','throw_food','tidy_toys','leave_mess','ask_nicely','pull_hair','hold_hand','run_street','wash_hands','eat_dirty_hands','listen_adult','scream_kick','wait_slide','push_slide','say_sorry','laugh_run'].includes(actionType)) && (
          <g>
            <g transform="translate(200, 90)">
              <rect x="-22" y="40" width="44" height="50" rx="12" fill={XANDER_SHIRT} />
              <circle cx="0" cy="5" r="30" fill={XANDER_SKIN} />
              <path d="M -30 5 A 30 30 0 0 1 30 5 L 30 -5 Q 0 -18 -30 -5 Z" fill={XANDER_HAIR} />
              <circle cx="8" cy="5" r="4" fill={XANDER_EYE} />
              <path d="M -4 16 Q 6 24 12 16" stroke="#D84315" strokeWidth="2.5" fill="none" />
            </g>
          </g>
        )}
      </svg>

      {/* Visual Badge overlay for correct/wrong */}
      {isCorrect === true && (
        <div className="absolute top-2 right-2 bg-[#10B981] text-white rounded-full p-1.5 shadow-md animate-bounce">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {isCorrect === false && (
        <div className="absolute top-2 right-2 bg-[#F43F5E] text-white rounded-full p-1.5 shadow-md">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
    </div>
  );
};
