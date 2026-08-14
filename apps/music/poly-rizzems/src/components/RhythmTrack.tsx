/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Trash2 } from 'lucide-react';
import ExpressionFace from './ExpressionFace';
import { ANIM, bounceScale, type BounceMode, type SampledLane } from '../video/spec';

interface RhythmTrackProps {
  lane: SampledLane;
  /** Bar index */
  bar?: number;
  /** Seconds elapsed within the current bar. */
  timeInBar: number;
  barDuration: number;
  isPlaying: boolean;
  /** Live mode fires the synth from here; renders use the offline audio pass. */
  audible: boolean;
  interactive: boolean;
  /** Signature and note on one line — wide frames can't spare the height. */
  compactLabel: boolean;
  bounce: BounceMode;
  /** Slowest signature in the arrangement; bounce heights are relative to it. */
  referenceSignature: number;
  isSelected?: boolean;
  onEdit?: (rhythmId: string) => void;
  onRemove?: (rhythmId: string) => void;
  onToggleMute?: (rhythmId: string) => void;
  onPlayNoteTrigger?: (frequency: number, isFirst: boolean, volume: number) => void;
}

/** Expanding ring left behind by an impact, derived from time rather than a spring. */
function Ripple({ phase, color }: { phase: number; color: string }) {
  if (phase < 0 || phase >= 1) return null;
  const scale = 0.1 + phase * 2.1;
  const opacity = 0.8 * (1 - phase);
  return (
    <div
      style={{
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        borderColor: color,
        boxShadow: `0 0 12px ${color}`,
        width: 'calc(var(--pp-ball) * 0.9)',
        height: 'calc(var(--pp-ball) * 0.28)',
      }}
      className="absolute left-1/2 top-1/2 border-2 rounded-full pointer-events-none"
    />
  );
}

export default function RhythmTrack({
  lane,
  bar = 0,
  timeInBar,
  barDuration,
  isPlaying,
  audible,
  interactive,
  compactLabel,
  bounce,
  referenceSignature,
  isSelected = false,
  onEdit,
  onRemove,
  onToggleMute,
  onPlayNoteTrigger,
}: RhythmTrackProps) {
  const { id, timeSignature, noteName, frequency, color, volume, isMuted, expression } = lane.rhythm;

  const beatPeriod = barDuration / timeSignature;
  const continuousBeats = timeInBar / beatPeriod;
  const currentBeat = Math.floor(continuousBeats) % timeSignature;
  const beatProgress = continuousBeats % 1;

  // Parabola: 0 at the floor on each beat boundary, 1 at the apex mid-beat —
  // scaled so a fast lane doesn't have to cross the whole runway in a fraction of
  // the time a slow one gets, which is what makes its face unreadable.
  const bounceHeight =
    (1 - 4 * Math.pow(beatProgress - 0.5, 2)) *
    bounceScale(bounce, timeSignature, referenceSignature);

  // Ripples, derived. The previous ring is drawn too so that fast lanes — where the
  // beat period is shorter than the ripple — keep the overlapping wash they had
  // when this was an AnimatePresence stack.
  const sinceStrike = beatProgress * beatPeriod;
  const ripplePhase = isPlaying ? sinceStrike / ANIM.ripple : -1;
  const previousRipplePhase = isPlaying ? (sinceStrike + beatPeriod) / ANIM.ripple : -1;

  // Global beat index so signature 1 (and all signatures) advance monotonically across bars
  const absoluteBeat = bar * timeSignature + Math.floor(continuousBeats);

  // Live audio still fires on beat crossings; renders take the offline path instead.
  const prevBeatRef = useRef<number>(-1);
  useEffect(() => {
    if (!audible || !isPlaying) {
      prevBeatRef.current = -1;
      return;
    }
    if (absoluteBeat !== prevBeatRef.current) {
      if (!isMuted) {
        onPlayNoteTrigger?.(frequency, absoluteBeat % timeSignature === 0, volume);
      }
      prevBeatRef.current = absoluteBeat;
    }
  }, [audible, absoluteBeat, isPlaying, isMuted, frequency, timeSignature, volume, onPlayNoteTrigger]);

  return (
    <div
      id={`lane-${id}`}
      className={`relative flex flex-col justify-end items-center text-white group select-none shrink-0 transition-opacity duration-200 ${
        interactive ? 'cursor-pointer' : ''
      }`}
      style={{
        width: 'var(--pp-lane-pitch)',
        opacity: isMuted ? 0.5 : 1,
      }}
      onClick={interactive ? (e) => { e.stopPropagation(); onEdit?.(id); } : undefined}
    >
      {interactive && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleMute?.(id); }}
            style={{ color: isMuted ? '#ff4b4b' : '#a1a1aa' }}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors bg-black/50 backdrop-blur"
            title={isMuted ? 'Unmute Lane' : 'Mute Lane'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove?.(id); }}
            className="p-1.5 rounded-full text-zinc-500 hover:text-red-400 hover:bg-white/10 transition-colors bg-black/50 backdrop-blur"
            title="Delete track"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Time signature and pitch */}
      <div
        style={{ color, height: 'var(--pp-label-block)', fontSize: 'var(--pp-label-font)' }}
        className={`flex items-center justify-center pb-[0.3em] font-bold font-mono tracking-widest z-10 pointer-events-none leading-tight whitespace-nowrap ${
          compactLabel ? 'flex-row gap-[0.5em]' : 'flex-col justify-end'
        }`}
      >
        <span>{timeSignature}♩</span>
        <span>
          {noteName}
          {isMuted && <span className="text-[0.7em] text-red-500 uppercase ml-1 opacity-80">(muted)</span>}
        </span>
      </div>

      {/* Headroom for the ball at the top of its arc. */}
      <div style={{ height: 'var(--pp-ball-clearance)' }} className="shrink-0" />

      {/* Runway */}
      <div
        className="relative w-[2px] bg-white/5 z-10 pointer-events-none"
        style={{ height: 'var(--pp-runway)' }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white/20 rounded-full" />

        <div className="absolute bottom-0 left-0 w-full h-0">
          <Ripple phase={previousRipplePhase} color={color} />
          <Ripple phase={ripplePhase} color={color} />
        </div>

        <div
          style={{
            bottom: `${bounceHeight * 100}%`,
            left: '50%',
            width: 'var(--pp-ball)',
            height: 'var(--pp-ball)',
            transform: 'translate(-50%, 50%)',
            backgroundColor: color,
            boxShadow: isSelected ? `0 0 30px ${color}` : `0 0 20px ${color}`,
            border: isSelected ? '2px solid white' : 'none',
          }}
          className="absolute rounded-full pointer-events-auto flex items-center justify-center will-change-transform"
        >
          <div className="w-[15%] h-[15%] bg-white/40 rounded-full absolute top-[15%] left-[15%] pointer-events-none" />
          <ExpressionFace type={expression} className="w-full h-full opacity-60 text-black" />
        </div>
      </div>

      {/* Clearance so a ball resting on the floor doesn't sit over the counter. */}
      <div style={{ height: 'var(--pp-ball-clearance)' }} className="shrink-0" />

      {/* Beat counter */}
      <div style={{ height: 'var(--pp-beat-gap)' }} className="shrink-0" />
      <div
        className="rounded-md flex items-center justify-center shadow-lg border border-white/20"
        style={{
          width: 'var(--pp-beat-box)',
          height: 'var(--pp-beat-box)',
          backgroundColor: isPlaying ? color : 'rgba(255,255,255,0.05)',
          boxShadow: isPlaying ? `0 0 15px ${color}80` : 'none',
          color: isPlaying ? '#000' : 'rgba(255,255,255,0.3)',
        }}
      >
        <span className="font-black font-mono tracking-tighter" style={{ fontSize: 'calc(var(--pp-beat-box) * 0.55)' }}>
          {isPlaying ? currentBeat + 1 : '-'}
        </span>
      </div>
      <div style={{ height: 'var(--pp-bottom-pad)' }} className="shrink-0" />
    </div>
  );
}
