/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExpressionType = 'none' | 'happy' | 'sad' | 'sick' | 'angry' | 'excited' | 'dizzy' | 'surprised' | 'sleepy' | 'cool' | 'silly';

export interface RhythmPreset {
  name: string;
  description: string;
  rhythms: Omit<Rhythm, 'currentBeat' | 'progress'>[];
}

export interface Rhythm {
  id: string;
  timeSignature: number; // 0 to 19 (0 = Rest/Void lane)
  noteName: string;      // e.g. "C4"
  frequency: number;     // in Hz
  color: string;         // hex value (e.g. "#00f0ff")
  name: string;          // label
  volume: number;        // 0 to 1
  isMuted: boolean;
  expression?: ExpressionType;
}

export const COLOR_PALETTE = [
  { hex: "#ff007f", name: "Rave Pink", glowClass: "shadow-[0_0_15px_rgba(255,0,127,0.7)]" },
  { hex: "#00f0ff", name: "Cyber Cyan", glowClass: "shadow-[0_0_15px_rgba(0,240,255,0.7)]" },
  { hex: "#39ff14", name: "Neon Green", glowClass: "shadow-[0_0_15px_rgba(57,255,20,0.7)]" },
  { hex: "#fffb00", name: "Cosmic Yellow", glowClass: "shadow-[0_0_15px_rgba(255,251,0,0.7)]" },
  { hex: "#ff5f00", name: "Solar Orange", glowClass: "shadow-[0_0_15px_rgba(255,95,0,0.7)]" },
  { hex: "#b026ff", name: "Vapor Purple", glowClass: "shadow-[0_0_15px_rgba(176,38,255,0.7)]" },
  { hex: "#ff073a", name: "Laser Red", glowClass: "shadow-[0_0_15px_rgba(255,7,58,0.7)]" },
  { hex: "#ccff00", name: "Acid Lime", glowClass: "shadow-[0_0_15px_rgba(204,255,0,0.7)]" },
  { hex: "#00ffd0", name: "Ocean Mint", glowClass: "shadow-[0_0_15px_rgba(0,255,208,0.7)]" },
  { hex: "#ff00ea", name: "Sunset Magenta", glowClass: "shadow-[0_0_15px_rgba(255,0,234,0.7)]" },
];

export const NOTE_PRESETS: { name: string; frequency: number }[] = [
  { name: "C3", frequency: 130.81 },
  { name: "D3", frequency: 146.83 },
  { name: "E3", frequency: 164.81 },
  { name: "F3", frequency: 174.61 },
  { name: "G3", frequency: 196.00 },
  { name: "A3", frequency: 220.00 },
  { name: "B3", frequency: 246.94 },
  { name: "C4", frequency: 261.63 },
  { name: "D4", frequency: 293.66 },
  { name: "E4", frequency: 329.63 },
  { name: "F4", frequency: 349.23 },
  { name: "G4", frequency: 392.00 },
  { name: "A4", frequency: 440.00 },
  { name: "B4", frequency: 493.88 },
  { name: "C5", frequency: 523.25 },
  { name: "D5", frequency: 587.33 },
  { name: "E5", frequency: 659.25 },
  { name: "F5", frequency: 698.46 },
  { name: "G5", frequency: 783.99 },
  { name: "A5", frequency: 880.00 },
  { name: "B5", frequency: 987.77 },
  { name: "C6", frequency: 1046.50 },
];

export const BUILTIN_PRESETS: RhythmPreset[] = [
  {
    name: "Golden Triad Harmony",
    description: "Classic 3, 4, 5, and 6 polyrhythm creating a majestic major triad chord progression.",
    rhythms: [
      { id: "1", timeSignature: 3, noteName: "C4", frequency: 261.63, color: "#00f0ff", name: "Rhythm A", volume: 0.8, isMuted: false },
      { id: "2", timeSignature: 4, noteName: "E4", frequency: 329.63, color: "#fffb00", name: "Rhythm B", volume: 0.8, isMuted: false },
      { id: "3", timeSignature: 5, noteName: "G4", frequency: 392.00, color: "#ff007f", name: "Rhythm C", volume: 0.8, isMuted: false },
      { id: "4", timeSignature: 6, noteName: "C5", frequency: 523.25, color: "#b026ff", name: "Rhythm D", volume: 0.8, isMuted: false },
    ]
  },
  {
    name: "Celestial Quartz",
    description: "Intricate 5 vs 7 against 9 polyrhythm forming a rich, ambient pentatonic tapestry.",
    rhythms: [
      { id: "c1", timeSignature: 5, noteName: "A3", frequency: 220.00, color: "#39ff14", name: "Rhythm A", volume: 0.85, isMuted: false },
      { id: "c2", timeSignature: 7, noteName: "C4", frequency: 261.63, color: "#ff5f00", name: "Rhythm B", volume: 0.8, isMuted: false },
      { id: "c3", timeSignature: 9, noteName: "E4", frequency: 329.63, color: "#00ffd0", name: "Rhythm C", volume: 0.75, isMuted: false },
    ]
  },
  {
    name: "Subway Clatter",
    description: "A rapid, complex 11 vs 13 rhythm combination using low and high pitch tones for metallic percussion textures.",
    rhythms: [
      { id: "s1", timeSignature: 11, noteName: "E3", frequency: 164.81, color: "#ff073a", name: "Track Low", volume: 0.85, isMuted: false },
      { id: "s2", timeSignature: 13, noteName: "E5", frequency: 659.25, color: "#ccff00", name: "Track High", volume: 0.7, isMuted: false },
    ]
  },
  {
    name: "Mathematical Ascent",
    description: "Stepped rhythmic signatures climb from 2 to 5, generating a rolling cascade of tones.",
    rhythms: [
      { id: "m2", timeSignature: 2, noteName: "C3", frequency: 130.81, color: "#ff00ea", name: "Base Duo", volume: 0.9, isMuted: false },
      { id: "m3", timeSignature: 3, noteName: "G3", frequency: 196.00, color: "#00f0ff", name: "Trio Fill", volume: 0.8, isMuted: false },
      { id: "m4", timeSignature: 4, noteName: "D4", frequency: 293.66, color: "#39ff14", name: "Quad Pulse", volume: 0.8, isMuted: false },
      { id: "m5", timeSignature: 5, noteName: "A4", frequency: 440.00, color: "#fffb00", name: "Quint Acc", volume: 0.75, isMuted: false },
    ]
  }
];
