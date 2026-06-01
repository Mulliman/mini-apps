/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Rhythm } from '../types';
import { Volume2, VolumeX, Trash2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ExpressionFace from './ExpressionFace';

interface RhythmTrackProps {
  rhythm: Rhythm;
  currentTime: number;      // master time in seconds
  barDuration: number;      // master loop duration in seconds
  isPlaying: boolean;
  isSelected: boolean;
  onEdit: (rhythmId: string) => void;
  onRemove: (rhythmId: string) => void;
  onToggleMute: (rhythmId: string) => void;
  onPlayNoteTrigger: (frequency: number, isFirst: boolean, volume: number) => void;
}

export default function RhythmTrack({
  rhythm,
  currentTime,
  barDuration,
  isPlaying,
  isSelected,
  onEdit,
  onRemove,
  onToggleMute,
  onPlayNoteTrigger,
}: RhythmTrackProps) {
  const { id, timeSignature, noteName, frequency, color, name, volume, isMuted, expression } = rhythm;

  const prevBeatRef = useRef<number>(-1);
  const [ripplePulse, setRipplePulse] = useState(0);

  // Math for the bounce:
  const beatPeriod = barDuration / timeSignature;
  const continuousBeats = currentTime / beatPeriod;
  const currentBeat = Math.floor(continuousBeats) % timeSignature;
  const beatProgress = continuousBeats % 1;

  // Parabolic bounce formula:
  // Height ranges from 0 (at start and end of beat) to 1 (at midpoint/apex)
  const bounceHeight = 1 - 4 * Math.pow(beatProgress - 0.5, 2);

  // Monitor beat triggers for audio and ripple effects
  useEffect(() => {
    if (!isPlaying) {
      prevBeatRef.current = -1;
      return;
    }

    const integerBeatFloat = Math.floor(continuousBeats);
    if (integerBeatFloat !== prevBeatRef.current) {
      const triggeredBeat = integerBeatFloat % timeSignature;
      const isFirstBeatOfBar = triggeredBeat === 0;

      // Play the physical synth note if not muted
      if (!isMuted) {
        onPlayNoteTrigger(frequency, isFirstBeatOfBar, volume);
      }

      // Trigger the bottom hit ripple flash
      setRipplePulse((prev) => prev + 1);
      
      prevBeatRef.current = integerBeatFloat;
    }
  }, [continuousBeats, isPlaying, isMuted, frequency, timeSignature, volume, onPlayNoteTrigger]);

  return (
    <div
      id={`lane-${id}`}
      className={`relative flex flex-col justify-end items-center text-white transition-all duration-300 flex-1 min-w-0 max-w-[120px] group select-none ${
        isSelected ? 'scale-105' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(id);
      }}
    >
      {/* Floating control buttons on high opacity hover */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute(id);
          }}
          style={{ color: isMuted ? '#ff4b4b' : '#a1a1aa' }}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors bg-black/50 backdrop-blur"
          title={isMuted ? "Unmute Lane" : "Mute Lane"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="p-1.5 rounded-full text-zinc-500 hover:text-red-400 hover:bg-white/10 transition-colors bg-black/50 backdrop-blur"
          title="Delete track"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Note frequency header info */}
      <div 
        style={{ color: color }} 
        className="absolute -top-10 flex flex-col items-center text-xs font-bold font-mono tracking-widest z-10 transition-all duration-300 pointer-events-none"
      >
        <span>{timeSignature}♩</span>
        <span>{noteName} {isMuted && <span className="text-[9px] text-red-500 uppercase ml-1 opacity-80">(Muted)</span>}</span>
      </div>

      {/* Bouncing runway track-line */}
      <div className="relative w-[2px] h-[25vh] min-h-[110px] max-h-[360px] md:h-[40vh] bg-white/5 my-0.5 z-10 pointer-events-none mb-8 md:mb-16">
        
        {/* Glowing impact floor ripple */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[10px] flex items-center justify-center">
          <div className="w-4 h-[1px] bg-white/20 rounded-full" />
          <AnimatePresence>
            {ripplePulse > 0 && (
              <motion.div
                key={ripplePulse}
                initial={{ scale: 0.1, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{ 
                  borderColor: color,
                  boxShadow: `0 0 12px ${color}`
                }}
                className="absolute w-8 h-2 border-2 rounded-full"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Parabolic bouncing ball */}
        <div 
          style={{
            bottom: `${bounceHeight * 100}%`,
            left: '50%',
            transform: 'translate(-50%, 50%)',
            backgroundColor: color,
            boxShadow: isSelected ? `0 0 30px ${color}` : `0 0 20px ${color}`,
            border: isSelected ? '2px solid white' : 'none'
          }}
          className="absolute w-[clamp(1.4rem,6vw,5.5rem)] h-[clamp(1.4rem,6vw,5.5rem)] rounded-full pointer-events-auto flex items-center justify-center will-change-transform transition-[border,box-shadow]"
        >
          {/* Subtle reflection core shine */}
          <div className="w-[15%] h-[15%] bg-white/40 rounded-full absolute top-[15%] left-[15%] pointer-events-none" />
          <ExpressionFace type={expression} className="w-full h-full opacity-60 text-black" />
        </div>
      </div>

      {/* Dynamic current beat index (The Number) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pb-2">
        <div 
          className="w-10 h-10 rounded-md flex items-center justify-center shadow-lg transition-colors border border-white/20"
          style={{ 
            backgroundColor: isPlaying ? color : 'rgba(255,255,255,0.05)',
            boxShadow: isPlaying ? `0 0 15px ${color}80` : 'none',
            color: isPlaying ? '#000' : 'rgba(255,255,255,0.3)'
          }}
        >
          <span className="text-xl font-black font-mono tracking-tighter">
            {isPlaying ? (currentBeat + 1) : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
