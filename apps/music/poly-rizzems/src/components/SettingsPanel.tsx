/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Rhythm, COLOR_PALETTE } from '../types';
import { X, Play, Volume2, Plus, Minus, Check, Music, Paintbrush, Sliders, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import ExpressionFace, { EXPRESSIONS } from './ExpressionFace';

interface SettingsPanelProps {
  rhythm: Rhythm | null;
  onUpdate: (rhythmId: string, updates: Partial<Rhythm>) => void;
  onRemove: (rhythmId: string) => void;
  onClose: () => void;
  onPreviewNote: (frequency: number) => void;
}

export default function SettingsPanel({
  rhythm,
  onUpdate,
  onRemove,
  onClose,
  onPreviewNote,
}: SettingsPanelProps) {
  if (!rhythm) return null;

  const { id, timeSignature, noteName, frequency, color, name, volume } = rhythm;

  const handleTimeSigChange = (value: number) => {
    const clamped = Math.max(0, Math.min(19, value));
    onUpdate(id, { timeSignature: clamped });
  };

  const parsedNote = useMemo(() => {
    if (!noteName) return { letter: 'C', accidental: 0, octave: 4 };
    const match = noteName.match(/([A-G])([♯♭]?)([2-6])/);
    if (match) {
      return { 
        letter: match[1], 
        accidental: match[2] === '♯' ? 1 : match[2] === '♭' ? -1 : 0, 
        octave: parseInt(match[3], 10) 
      };
    }
    return { letter: 'C', accidental: 0, octave: 4 };
  }, [noteName]);

  const handlePitchChange = (letter: string, acc: number, oct: number) => {
    const accSymbol = acc === 1 ? '♯' : acc === -1 ? '♭' : '';
    const newName = `${letter}${accSymbol}${oct}`;
    const noteOffsets: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const midi = (oct + 1) * 12 + noteOffsets[letter] + acc;
    const newFreq = 440 * Math.pow(2, (midi - 69) / 12);
    
    onUpdate(id, { noteName: newName, frequency: newFreq });
    onPreviewNote(newFreq);
  };

  const currentVolumePercentage = Math.round(volume * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ borderColor: color, boxShadow: `0 25px 50px -12px ${color}20` }}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-1rem)] max-w-xl bg-black border shadow-2xl z-50 flex flex-col overflow-hidden rounded-2xl md:rounded-3xl max-h-[95dvh] sm:max-h-[90dvh]"
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between p-2 md:p-5 border-b border-white/10 bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl overflow-hidden p-0.5">
            <button 
              onClick={() => handleTimeSigChange(timeSignature - 1)}
              disabled={timeSignature <= 0}
              className="w-8 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/[0.02] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all disabled:opacity-30"
            >
              <Minus className="w-3 h-3 md:w-4 md:h-4" />
            </button>
            <div 
              style={{ color: color, textShadow: `0 0 10px ${color}50` }}
              className="w-10 md:w-12 h-9 md:h-10 flex justify-center items-center font-mono font-black text-lg md:text-2xl bg-zinc-950 text-white"
            >
              {timeSignature}
            </div>
            <button 
              onClick={() => handleTimeSigChange(timeSignature + 1)}
              disabled={timeSignature >= 19}
              className="w-8 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/[0.02] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all disabled:opacity-30"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
          <span className="text-xl md:text-2xl font-black text-white tracking-tight ml-1 md:ml-0">Beats</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 md:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Modal Contents */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-6 space-y-3 md:space-y-6">
        
        {/* Note Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-1 md:mt-0">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest opacity-80 sm:min-w-[70px]">
            Note
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 flex-1 w-full">
            {/* Letter Selector */}
            <div className="flex flex-col items-center justify-center bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
              <button 
                onClick={() => {
                  const letters = ['C','D','E','F','G','A','B'];
                  let idx = letters.indexOf(parsedNote.letter) + 1;
                  if (idx >= letters.length) idx = 0;
                  handlePitchChange(letters[idx], parsedNote.accidental, parsedNote.octave);
                }}
                className="w-10 md:w-12 h-6 md:h-7 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <ChevronUp className="w-3 h-3 md:w-5 md:h-5" />
              </button>
              <div 
                style={{ color: color, textShadow: `0 0 10px ${color}40`, borderTopColor: color, borderBottomColor: color }}
                className="w-10 h-8 md:w-12 md:h-10 flex justify-center items-center font-mono font-bold text-base md:text-xl bg-zinc-950 border-y border-white/5"
              >
                {parsedNote.letter}
              </div>
              <button 
                onClick={() => {
                  const letters = ['C','D','E','F','G','A','B'];
                  let idx = letters.indexOf(parsedNote.letter) - 1;
                  if (idx < 0) idx = letters.length - 1;
                  handlePitchChange(letters[idx], parsedNote.accidental, parsedNote.octave);
                }}
                className="w-10 md:w-12 h-6 md:h-7 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <ChevronDown className="w-3 h-3 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Accidental Selector */}
            <div className="flex flex-col items-center justify-center bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
              <button 
                onClick={() => {
                  let val = parsedNote.accidental + 1;
                  if (val > 1) val = -1;
                  handlePitchChange(parsedNote.letter, val, parsedNote.octave);
                }}
                className="w-10 md:w-12 h-6 md:h-7 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <ChevronUp className="w-3 h-3 md:w-5 md:h-5" />
              </button>
              <div 
                style={{ color: color, textShadow: `0 0 10px ${color}40`, borderTopColor: color, borderBottomColor: color }}
                className="w-10 h-8 md:w-12 md:h-10 flex justify-center items-center font-mono font-medium text-base md:text-xl bg-zinc-950 border-y border-white/5"
              >
                {parsedNote.accidental === 1 ? '♯' : parsedNote.accidental === -1 ? '♭' : '♮'}
              </div>
              <button 
                onClick={() => {
                  let val = parsedNote.accidental - 1;
                  if (val < -1) val = 1;
                  handlePitchChange(parsedNote.letter, val, parsedNote.octave);
                }}
                className="w-10 md:w-12 h-6 md:h-7 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <ChevronDown className="w-3 h-3 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Octave Selector */}
            <div className="flex flex-col items-center justify-center bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
              <button 
                onClick={() => {
                  let val = parsedNote.octave + 1;
                  if (val > 6) val = 2;
                  handlePitchChange(parsedNote.letter, parsedNote.accidental, val);
                }}
                className="w-10 md:w-12 h-6 md:h-7 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <ChevronUp className="w-3 h-3 md:w-5 md:h-5" />
              </button>
              <div 
                style={{ color: color, textShadow: `0 0 10px ${color}40`, borderTopColor: color, borderBottomColor: color }}
                className="w-10 h-8 md:w-12 md:h-10 flex justify-center items-center font-mono font-bold text-base md:text-xl bg-zinc-950 border-y border-white/5"
              >
                {parsedNote.octave}
              </div>
              <button 
                onClick={() => {
                  let val = parsedNote.octave - 1;
                  if (val < 2) val = 6;
                  handlePitchChange(parsedNote.letter, parsedNote.accidental, val);
                }}
                className="w-10 md:w-12 h-6 md:h-7 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <ChevronDown className="w-3 h-3 md:w-5 md:h-5" />
              </button>
            </div>
            
            {/* Play Note Button */}
            <button
              onClick={() => onPreviewNote(frequency)}
              className="ml-auto w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors active:scale-95 shrink-0"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-white ml-0.5" />
            </button>
          </div>
        </div>

        {/* Volume Mixer */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest opacity-80 sm:min-w-[70px]">
            Vol
          </div>
          <div className="flex-1 flex items-center gap-3 bg-white/[0.03] border border-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl">
            <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-zinc-500 shrink-0" />
            <input
              id="volume-slider-input"
              type="range"
              min={0}
              max={100}
              value={currentVolumePercentage}
              onChange={(e) => onUpdate(id, { volume: parseFloat(e.target.value) / 100 })}
              className="flex-grow accent-zinc-200 h-1.5 md:h-2 bg-zinc-800 rounded-full cursor-pointer"
              style={{ accentColor: color }}
            />
          </div>
        </div>

        {/* Theme colors */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest opacity-80 sm:min-w-[70px] sm:mt-2.5">
            RIZZEM
          </div>
          <div className="flex-1 flex flex-wrap gap-2">
            {COLOR_PALETTE.map((item) => {
              const isSelectedColor = item.hex.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={item.hex}
                  type="button"
                  title={item.name}
                  onClick={() => onUpdate(id, { color: item.hex })}
                  style={{
                    backgroundColor: item.hex,
                    boxShadow: isSelectedColor ? `0 0 16px 2px ${item.hex}` : `0 0 4px ${item.hex}44`,
                  }}
                  className={`w-7 h-7 md:w-9 md:h-9 rounded-full relative flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95`}
                >
                  {isSelectedColor && (
                    <span className="bg-black/40 rounded-full p-0.5 border-2 border-white/20">
                      <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-white stroke-[3px]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expression Face */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-widest opacity-80 sm:min-w-[70px] sm:mt-2">
            Face
          </div>
          <div className="flex-1 flex flex-wrap gap-1.5 md:gap-2">
            {EXPRESSIONS.map((expr) => {
              const isSelectedExpr = rhythm.expression === expr || (!rhythm.expression && expr === 'none');
              return (
                <button
                  key={expr}
                  type="button"
                  title={expr}
                  onClick={() => onUpdate(id, { expression: expr === 'none' ? undefined : expr })}
                  style={{
                    borderColor: isSelectedExpr ? color : 'transparent',
                    backgroundColor: isSelectedExpr ? `${color}20` : 'rgba(255, 255, 255, 0.05)',
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl border flex items-center justify-center transition-all duration-200 text-zinc-300 hover:text-white shrink-0 active:scale-95"
                >
                  <ExpressionFace type={expr} className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal Action row */}
      <div className="p-2 md:p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0 gap-3 md:gap-4">
        <button
          id="settings-remove-track-btn"
          type="button"
          onClick={() => {
            onRemove(id);
            onClose();
          }}
          className="flex items-center justify-center hover:bg-white/5 text-zinc-400 hover:text-red-400 rounded-lg md:rounded-xl px-2 sm:px-4 py-2 md:py-3 text-[10px] md:text-sm font-semibold transition-all duration-200 whitespace-nowrap"
        >
          Remove Track
        </button>

        <button
          id="settings-done-btn"
          type="button"
          onClick={onClose}
          style={{ backgroundColor: color }}
          className="px-4 sm:px-8 py-2 md:py-3 text-black font-bold rounded-lg md:rounded-xl text-[10px] md:text-sm font-sans uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-md whitespace-nowrap"
        >
          Done Editing
        </button>
      </div>
    </motion.div>
  );
}
