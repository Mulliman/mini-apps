/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rhythm, COLOR_PALETTE, NOTE_PRESETS, BUILTIN_PRESETS } from './types';
import { initAudio, playSynthNote, setMasterVolume } from './utils/audio';
import Board from './components/Board';
import RenderApp from './components/RenderApp';
import SettingsPanel from './components/SettingsPanel';
import { getRandomExpression } from './components/ExpressionFace';
import { useBarGrid, useClock } from './video/clock';
import { getRenderMode } from './video/renderMode';
import { downloadSpec, useRecorder } from './video/recorder';
import { ANIM, type SampledLane, type SpecRhythm } from './video/spec';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  SlidersHorizontal,
  Volume2,
  Sparkles,
  HelpCircle,
  X,
  Keyboard,
  CheckCircle2,
  Settings,
  MoreVertical,
  Circle,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../../../shared/Header';

export default function App() {
  // Read once: switching modes mid-session isn't a thing, and re-reading would let
  // a render pick up live state.
  const [mode] = useState(() => getRenderMode());
  if (mode.active) {
    return <RenderApp specName={mode.specName} stepped={mode.stepped} />;
  }
  return <LiveApp />;
}

/** Layout bookkeeping a lane needs beyond its own properties. */
interface LaneMeta {
  order: number;
  enterTime: number;
}

interface LeavingLane {
  rhythm: Rhythm;
  order: number;
  exitTime: number;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const toSpecRhythm = (rhythm: Rhythm): SpecRhythm => ({
  ...rhythm,
  expression: rhythm.expression && rhythm.expression !== 'none' ? rhythm.expression : 'happy',
});

function LiveApp() {
  // Load initial rhythms from first preset or localStorage
  const [rhythms, setRhythms] = useState<Rhythm[]>(() => {
    try {
      const saved = localStorage.getItem('polyrhythm_tracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((r: Rhythm) => ({
          ...r,
          expression: r.expression && r.expression !== 'none' ? r.expression : getRandomExpression()
        }));
      }
    } catch (e) {
      console.error("Local storage read error, defaulting to preset", e);
    }
    return BUILTIN_PRESETS[0].rhythms.map((r) => ({
      ...r,
      expression: getRandomExpression()
    })) as Rhythm[];
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [barDuration, setBarDuration] = useState<number>(() => {
    const saved = localStorage.getItem('polyrhythm_bar_duration');
    return saved ? parseFloat(saved) : 4.0; // default 4 seconds per master loop cycle
  });
  const [masterVolume, setMasterVolumeState] = useState(0.8);
  const [selectedRhythmId, setSelectedRhythmId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [leaving, setLeaving] = useState<LeavingLane[]>([]);

  // The same clock the renderer uses — here it's just driven by rAF instead of by
  // a stepping loop.
  const clock = useClock(isPlaying);
  const clockRef = useRef(0);
  clockRef.current = clock.time;

  const grid = useBarGrid(clock.time, barDuration);
  const recorder = useRecorder(grid, clock.time);

  // Deferred actions run after their closure was created, so they read state
  // through refs and write it functionally rather than capturing stale values.
  const rhythmsRef = useRef(rhythms);
  rhythmsRef.current = rhythms;
  const pendingPatches = useRef(new Map<string, Partial<Rhythm>>());

  const metaRef = useRef(new Map<string, LaneMeta>());
  const orderRef = useRef(0);

  const ensureMeta = useCallback((list: Rhythm[], enterTime: number) => {
    for (const rhythm of list) {
      if (!metaRef.current.has(rhythm.id)) {
        metaRef.current.set(rhythm.id, { order: orderRef.current++, enterTime });
      }
    }
  }, []);

  // Seed metadata for whatever was restored from storage, entering at t=0.
  const seededRef = useRef(false);
  if (!seededRef.current) {
    ensureMeta(rhythms, 0);
    seededRef.current = true;
  }

  // Save to LocalStorage whenever rhythms change
  useEffect(() => {
    localStorage.setItem('polyrhythm_tracks', JSON.stringify(rhythms));
  }, [rhythms]);

  useEffect(() => {
    localStorage.setItem('polyrhythm_bar_duration', barDuration.toString());
  }, [barDuration]);

  // Keyboard shortcut listener for spacebar playback toggling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when user is editing labels
      if (e.target instanceof HTMLInputElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, audioInitialized]);

  const togglePlay = () => {
    // Lazy ignite standard browser AudioContext
    if (!audioInitialized) {
      initAudio();
      setAudioInitialized(true);
    }

    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    clock.setTime(0);

    // Brief visual flash / pop
    const tracksContainer = document.getElementById('tracks-container');
    if (tracksContainer) {
      tracksContainer.classList.add('brightness-125');
      setTimeout(() => tracksContainer.classList.remove('brightness-125'), 140);
    }
  };

  const loadPreset = (presetIndex: number) => {
    const targetPreset = BUILTIN_PRESETS[presetIndex];
    if (!targetPreset) return;

    setSelectedRhythmId(null);

    const presetRhythms = targetPreset.rhythms.map((r) => ({
      ...r,
      expression: getRandomExpression()
    })) as Rhythm[];

    metaRef.current.clear();
    ensureMeta(presetRhythms, clockRef.current);
    setLeaving([]);
    setRhythms(presetRhythms);
    clock.setTime(0);
  };

  const handleSetBarDuration = (value: number) => {
    recorder.run(
      'tempo',
      `Tempo → ${value.toFixed(1)}s`,
      () => setBarDuration(value),
      (bar) => ({ at: bar, type: 'tempo', barDuration: value })
    );
  };

  const handleAddRhythm = () => {
    if (rhythms.length >= 10) return;

    // Pick a default time signature that isn't already heavily used, e.g. 5, 7, etc.
    const usedSigs = rhythms.map((r) => r.timeSignature);
    let nextSig = 5;
    for (let candidate = 2; candidate <= 19; candidate++) {
      if (!usedSigs.includes(candidate)) {
        nextSig = candidate;
        break;
      }
    }

    // Pick a color that isn't fully saturated
    const usedColors = rhythms.map((r) => r.color.toLowerCase());
    const nextPaletteItem = COLOR_PALETTE.find((c) => !usedColors.includes(c.hex.toLowerCase())) || COLOR_PALETTE[rhythms.length];

    // Pick a pitch note
    const defaultNotes = ["G3", "C4", "E4", "G4", "A4", "C5", "E5", "G5"];
    const noteNameCandidate = defaultNotes[rhythms.length % defaultNotes.length];
    const pitchSpec = NOTE_PRESETS.find((n) => n.name === noteNameCandidate) || NOTE_PRESETS[7]; // default C4

    const newRhythm: Rhythm = {
      id: `rhythm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timeSignature: nextSig,
      noteName: pitchSpec.name,
      frequency: pitchSpec.frequency,
      color: nextPaletteItem.hex,
      name: `Rhythm ${nextSig}-Beats`,
      volume: 0.8,
      isMuted: false,
      expression: getRandomExpression(),
    };

    recorder.run(
      `add:${newRhythm.id}`,
      `Add ${newRhythm.timeSignature}♩`,
      () => {
        ensureMeta([newRhythm], clockRef.current);
        setRhythms((prev) => (prev.length >= 10 ? prev : [...prev, newRhythm]));
        setSelectedRhythmId(newRhythm.id); // auto highlight newly created track parameters
      },
      (bar) => ({ at: bar, type: 'add', rhythm: toSpecRhythm(newRhythm) })
    );
  };

  const applyRemoveRhythm = (rhythmId: string) => {
    const departing = rhythmsRef.current.find((r) => r.id === rhythmId);
    const meta = metaRef.current.get(rhythmId);
    if (departing && meta) {
      const exitTime = clockRef.current;
      setLeaving((prev) => [
        // Drop anything whose exit animation has already finished.
        ...prev.filter((l) => exitTime - l.exitTime < ANIM.exit),
        { rhythm: departing, order: meta.order, exitTime },
      ]);
    }
    metaRef.current.delete(rhythmId);
    setRhythms((prev) => prev.filter((r) => r.id !== rhythmId));
    setSelectedRhythmId((prev) => (prev === rhythmId ? null : prev));
  };

  const handleRemoveRhythm = (rhythmId: string) => {
    recorder.run(
      `remove:${rhythmId}`,
      'Remove lane',
      () => applyRemoveRhythm(rhythmId),
      (bar) => ({ at: bar, type: 'remove', id: rhythmId })
    );
  };

  const applyUpdateRhythm = (rhythmId: string, updates: Partial<Rhythm>) => {
    setRhythms((prev) =>
      prev.map((r) => {
        if (r.id !== rhythmId) return r;
        const merged = { ...r, ...updates };
        // If update changed time signatures, let's update default label if not custom modified
        if (updates.timeSignature && r.name === `Rhythm ${r.timeSignature}-Beats`) {
          merged.name = `Rhythm ${updates.timeSignature}-Beats`;
        }
        return merged;
      })
    );
  };

  const handleUpdateRhythm = (rhythmId: string, updates: Partial<Rhythm>) => {
    if (recorder.status !== 'recording') {
      applyUpdateRhythm(rhythmId, updates);
      return;
    }
    // Dragging a slider fires many times before the downbeat; merge them into one
    // patch so the spec records the value you settled on, not every step.
    const merged = { ...(pendingPatches.current.get(rhythmId) ?? {}), ...updates };
    pendingPatches.current.set(rhythmId, merged);
    recorder.run(
      `update:${rhythmId}`,
      'Update lane',
      () => {
        pendingPatches.current.delete(rhythmId);
        applyUpdateRhythm(rhythmId, merged);
      },
      (bar) => ({ at: bar, type: 'update', id: rhythmId, patch: merged as Partial<Omit<SpecRhythm, 'id'>> })
    );
  };

  const handleToggleMute = (rhythmId: string) => {
    const willMute = !rhythmsRef.current.find((r) => r.id === rhythmId)?.isMuted;
    recorder.run(
      `mute:${rhythmId}`,
      willMute ? 'Mute lane' : 'Unmute lane',
      () => setRhythms((prev) => prev.map((r) => (r.id === rhythmId ? { ...r, isMuted: willMute } : r))),
      (bar) => ({ at: bar, type: willMute ? 'mute' : 'unmute', id: rhythmId })
    );
  };

  const handleToggleRecord = () => {
    if (recorder.status === 'idle') {
      if (!isPlaying) togglePlay();
      recorder.arm(rhythmsRef.current, barDuration);
      return;
    }
    const spec = recorder.stop();
    if (spec) downloadSpec(spec);
  };

  // A take needs a running clock: without one nothing ever reaches a downbeat and
  // queued actions would pile up unrecorded. Pausing simply ends the take.
  useEffect(() => {
    if (!isPlaying && recorder.status !== 'idle') {
      const spec = recorder.stop();
      if (spec) downloadSpec(spec);
    }
  }, [isPlaying, recorder.status]);

  const handlePreviewNote = (frequency: number) => {
    if (!audioInitialized) {
      initAudio();
      setAudioInitialized(true);
    }
    // Play full volume accent note preview instantly for auditory feedback
    playSynthNote(frequency, true, 0.7);
  };

  const selectedRhythm = rhythms.find((r) => r.id === selectedRhythmId) || null;

  // Derive nice BPM readout
  // 1 cycle / bar. If barDuration is 4.0 seconds, that's equivalent to 15 bars per minute.
  // Assuming a standard quarter-note bar has 4 quarter beats:
  const impliedBpm = Math.round((60 / barDuration) * 4);

  const timeInBar = grid.timeInBar;

  // Present the live arrangement in the same shape a compiled spec produces, so the
  // board can't tell the two apart.
  const lanes: SampledLane[] = [];
  for (const rhythm of rhythms) {
    const meta = metaRef.current.get(rhythm.id);
    if (!meta) continue;
    lanes.push({
      key: `${rhythm.id}#${meta.order}`,
      order: meta.order,
      rhythm,
      enterProgress: clamp01((clock.time - meta.enterTime) / ANIM.enter),
      exitProgress: 0,
    });
  }
  for (const lane of leaving) {
    const exitProgress = clamp01((clock.time - lane.exitTime) / ANIM.exit);
    if (exitProgress >= 1) continue;
    lanes.push({
      key: `${lane.rhythm.id}#${lane.order}`,
      order: lane.order,
      rhythm: lane.rhythm,
      enterProgress: 1,
      exitProgress,
    });
  }
  lanes.sort((a, b) => a.order - b.order);

  return (
    <div className="relative h-[100dvh] bg-black text-white font-sans flex flex-col overflow-hidden antialiased selection:bg-zinc-800">
      <Header title="PolyPals" />

      {/* Decorator background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[340px] bg-gradient-to-b from-zinc-800/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Main Dashboard Board */}
      <main className="main-dashboard flex-grow relative z-10 flex flex-col p-2 sm:p-4 md:p-6 max-w-7xl mx-auto w-full gap-2 sm:gap-4 min-h-0 overflow-hidden pb-0">

        {/* Active Bouncing Track Lanes Grid Workspace */}
        <div id="tracks-outer" className="w-full flex-1 min-h-0 flex flex-col relative z-10">
          {lanes.length === 0 ? (
            <div className="w-full h-full bg-white/[0.01] rounded-3xl border border-white/10 border-dashed flex flex-col items-center justify-center text-center p-8">
              <Sparkles className="w-10 h-10 text-zinc-600 mb-4 animate-pulse" />
              <p className="font-semibold text-zinc-300">No Rhythms Active</p>
              <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-5">
                Click the settings cog to add glowing bounce lanes, or select a pre-designed sound scale preset!
              </p>
              <button
                onClick={() => setShowGlobalSettings(true)}
                className="px-5 py-2.5 bg-white text-black rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
              >
                Open Settings
              </button>
            </div>
          ) : (
            <Board
              lanes={lanes}
              timeInBar={timeInBar}
              barDuration={barDuration}
              isPlaying={isPlaying}
              audible
              framed
              interactive
              bounce="equalSpeed"
              referenceSignature={Math.min(...lanes.map((l) => l.rhythm.timeSignature))}
              selectedId={selectedRhythmId}
              onEdit={setSelectedRhythmId}
              onRemove={handleRemoveRhythm}
              onToggleMute={handleToggleMute}
              onPlayNoteTrigger={playSynthNote}
            />
          )}
        </div>
      </main>

      {/* Recording status: armed countdown, bar counter, and queued actions. */}
      {recorder.status !== 'idle' && (
        <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
          {recorder.pending.map((action) => (
            <div
              key={action.key}
              className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur text-[11px] font-mono text-zinc-200 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF007A] animate-pulse" />
              {action.label}
              <span className="text-zinc-500">lands in {recorder.untilDownbeat.toFixed(1)}s</span>
            </div>
          ))}
          <div className="px-3 py-1.5 rounded-full bg-black/70 border border-red-500/40 backdrop-blur text-[11px] font-mono text-red-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {recorder.status === 'armed'
              ? `Recording starts in ${recorder.untilDownbeat.toFixed(1)}s`
              : `Recording · bar ${recorder.bar + 1}`}
          </div>
        </div>
      )}

      {/* Bottom Action UI */}
      <div className="bottom-action-bar w-full relative z-20 px-3 py-2.5 sm:py-3 md:px-6 md:py-4 flex flex-row items-center justify-between gap-2 md:gap-0 bg-black border-t border-white/5 shrink-0 select-none">

        {/* Left: Logo */}
        <div className="flex items-center justify-start flex-1 hidden sm:flex">
          <h1 className="text-xl md:text-3xl font-black italic tracking-tighter whitespace-nowrap">
            PolyPals<span className="text-[#FF007A]">.</span>
          </h1>
        </div>

        {/* Mobile short logo */}
        <div className="flex items-center justify-start sm:hidden shrink-0 pr-2 flex-1">
          <h1 className="text-2xl font-black italic tracking-tighter select-none">
            P<span className="text-[#FF007A]">P.</span>
          </h1>
        </div>

        {/* Center: Play/Pause and Add Pal */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 shrink-0">
          <button
            id="action-play-pause-btn"
            onClick={togglePlay}
            className={`w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
              isPlaying
                ? 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.2)]'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" /> : <Play className="w-5 h-5 md:w-6 md:h-6 fill-current translate-x-0.5" />}
          </button>

          <button
            id="action-add-pal-btn"
            onClick={handleAddRhythm}
            disabled={rhythms.length >= 10}
            className="h-10 md:h-14 px-3 md:px-6 bg-white text-black rounded-full font-bold text-[10px] md:text-sm tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-transform flex items-center gap-1 md:gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Plus className="w-3 h-3 md:w-5 md:h-5 stroke-[3px]" />
            ADD PAL
          </button>
        </div>

        {/* Right: Controls (Help, Tempo, Settings) */}
        <div className="flex items-center justify-end flex-1 relative">

          {/* Mobile Extra Options Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden w-10 h-10 bg-white/10 border border-white/10 text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="More Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Desktop inline menu / Mobile popup menu */}
          <div className={`
            flex items-center gap-3
            md:flex-row md:static md:opacity-100 md:visible md:bg-transparent md:translate-y-0 md:pointer-events-auto
            ${showMobileMenu ? 'flex flex-col absolute bottom-full right-0 mb-3 bg-zinc-900/95 backdrop-blur-xl p-3 auto rounded-2xl border border-white/10 opacity-100 translate-y-0 shadow-2xl z-30' : 'opacity-0 invisible md:visible pointer-events-none translate-y-4 absolute bottom-full md:static md:translate-y-0'}
            transition-all duration-200
          `}>
            <button
              id="action-record-btn"
              onClick={() => { handleToggleRecord(); setShowMobileMenu(false); }}
              className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                recorder.status === 'idle'
                  ? 'bg-white/10 border-white/10 text-zinc-300 hover:bg-white/20'
                  : 'bg-red-500/20 border-red-500/60 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
              }`}
              title={recorder.status === 'idle' ? 'Record a video spec' : 'Stop and download the spec'}
            >
              {recorder.status === 'idle'
                ? <Circle className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                : <Square className="w-4 h-4 md:w-5 md:h-5 fill-current" />}
            </button>

            <button
              id="action-help-btn"
              onClick={() => { setShowInfo(true); setShowMobileMenu(false); }}
              className="w-10 h-10 md:w-14 md:h-14 bg-white/10 border border-white/10 text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={() => { setShowGlobalSettings(true); setShowMobileMenu(false); }}
              className="w-10 h-10 md:w-14 md:h-14 bg-white/10 border border-white/10 text-white hover:bg-white/20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shrink-0"
              title="Global Tempo settings"
            >
              <span className="text-xs md:text-sm font-bold leading-none">{impliedBpm}</span>
              <span className="text-[7px] md:text-[9px] font-mono opacity-50 uppercase tracking-widest mt-0.5">BPM</span>
            </button>

            <button
              id="action-global-settings-btn"
              onClick={() => { setShowGlobalSettings((prev) => !prev); setShowMobileMenu(false); }}
              className="w-10 h-10 md:w-14 md:h-14 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0"
            >
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Settings Pull-up Drawer */}
      <AnimatePresence>
        {showGlobalSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGlobalSettings(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 p-3 md:p-6 pt-6 md:pt-10 rounded-t-2xl md:rounded-t-3xl shadow-2xl max-w-6xl mx-auto max-h-[95vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar"
            >
              <button
                onClick={() => setShowGlobalSettings(false)}
                className="absolute top-2 right-2 md:top-4 md:right-4 p-2 text-zinc-500 hover:text-white transition-colors"
                title="Close settings"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-5 items-stretch mb-4 md:mb-6 mt-4 md:mt-0">

                {/* Main big play trigger block */}
                <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-transparent pointer-events-none" />

                  <div className="flex items-center justify-between z-10">
                    <span className="text-[9px] md:text-[10px] font-mono opacity-50 uppercase tracking-widest">
                      Playback State
                    </span>
                    <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-mono text-zinc-400 bg-white/5 px-1.5 md:px-2 py-0.5 rounded-md border border-white/5">
                      <Keyboard className="w-3 h-3 text-zinc-500" /> Space
                    </div>
                  </div>

                  <div className="my-3 md:my-5 flex items-center gap-3 md:gap-4 z-10">
                    <button
                      id="master-play-btn"
                      onClick={togglePlay}
                      style={{
                        boxShadow: isPlaying ? '0 0 25px rgba(255, 255, 255, 0.1)' : 'none',
                        borderColor: isPlaying ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                      }}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0 ${
                        isPlaying
                          ? 'bg-white text-black'
                          : 'bg-white/5 hover:bg-white/10 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : <Play className="w-4 h-4 md:w-5 md:h-5 fill-current translate-x-0.5" />}
                    </button>

                    <button
                      id="master-restart-btn"
                      onClick={handleRestart}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
                      title="Restart Downbeats Sync"
                    >
                      <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>

                    <div className="min-w-0 flex flex-col justify-center">
                      <span className="text-xs md:text-sm font-semibold text-zinc-200 truncate">
                        {isPlaying ? 'Synthesizers Active' : 'Engine Standing By'}
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-500 truncate">
                        {isPlaying ? 'Loop pulses synchronized' : 'Tap play to activate sound'}
                      </span>
                    </div>
                  </div>

                  {/* Micro display clock */}
                  <div className="bg-black border border-white/5 rounded-lg md:rounded-xl p-2.5 md:p-3 flex justify-between items-center z-10 mt-2 md:mt-0">
                    <div className="flex flex-col">
                      <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase leading-none tracking-wider">
                        Loop Time
                      </span>
                      <span className="text-xs md:text-sm font-mono font-bold text-white tracking-tight mt-1 md:mt-1.5">
                        {timeInBar.toFixed(3)}s
                      </span>
                    </div>

                    <div className="h-4 md:h-6 w-[1px] bg-white/10" />

                    <div className="text-right">
                      <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        Cycle Loop
                      </span>
                      <p className="text-xs md:text-sm font-semibold text-zinc-300 mt-0.5 md:mt-1 border-t-0 p-0 m-0">
                        {barDuration.toFixed(1)}s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Master Speed Control Gauge */}
                <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3 md:mb-2">
                    <label htmlFor="master-duration-slider" className="text-[9px] md:text-[10px] font-mono text-zinc-450 uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                      <SlidersHorizontal className="w-3 h-3 md:w-4 md:h-4" /> Global Cycle Speed
                    </label>

                    <div className="text-right flex items-baseline gap-1.5 flex-wrap justify-end">
                      <span className="text-xs md:text-sm font-mono font-bold text-white leading-none">
                        {barDuration.toFixed(2)}s
                      </span>
                      <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 leading-none">
                        (~{impliedBpm} BPM)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3 my-auto">
                    <input
                      id="master-duration-slider"
                      type="range"
                      min={1.5}
                      max={12.0}
                      step={0.1}
                      value={barDuration}
                      onChange={(e) => handleSetBarDuration(parseFloat(e.target.value))}
                      className="w-full accent-white bg-white/10 h-1 rounded-lg cursor-pointer my-2 md:my-3"
                    />
                    <div className="flex items-center justify-between text-[8px] md:text-[10px] font-mono text-zinc-500">
                      <span>FASTER (1.5s)</span>
                      <span>MODERATE (4.0s)</span>
                      <span>SLOWER (12.0s)</span>
                    </div>
                  </div>
                </div>

                {/* Master volume & add button slot */}
                <div className="lg:col-span-3 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col justify-between gap-4 md:gap-0">
                  <div>
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest opacity-60">
                        Master Gain
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-300 font-mono">
                        {Math.round(masterVolume * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.01] p-2 md:p-2.5 rounded-lg md:rounded-xl border border-white/5">
                      <Volume2 className="w-3 h-3 md:w-4 md:h-4 text-zinc-400 shrink-0" />
                      <input
                        id="master-gain-slider"
                        type="range"
                        min={0}
                        max={100}
                        value={Math.round(masterVolume * 100)}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) / 100;
                          setMasterVolumeState(val);
                          setMasterVolume(val);
                        }}
                        className="w-full accent-white bg-white/10 h-1 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      id="add-track-btn"
                      onClick={handleAddRhythm}
                      disabled={rhythms.length >= 10}
                      className="w-full py-3.5 bg-white hover:opacity-90 disabled:opacity-40 text-black font-semibold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:cursor-not-allowed cursor-pointer shadow-lg"
                    >
                      <Plus className="w-4 h-4" /> Add Rhythm ({rhythms.length}/10)
                    </button>
                  </div>
                </div>

              </div>

              {/* Preset shortcuts */}
              <div className="w-full flex flex-wrap gap-2 mb-3">
                {BUILTIN_PRESETS.map((preset, index) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(index)}
                    title={preset.description}
                    className="px-3 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-lg text-[10px] font-mono uppercase tracking-wider text-zinc-300 transition-colors cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Sync alignment visual grid bar (The downbeat unified bar) */}
              <div className="w-full bg-black border border-white/10 p-3 rounded-xl flex items-center gap-4 relative overflow-hidden">
                <div className="text-[10px] font-mono text-zinc-400 font-bold shrink-0 tracking-widest">
                  BAR TIMELINE
                </div>

                {/* Master progress line */}
                <div className="flex-1 bg-white/5 h-1 rounded-full overflow-hidden relative">
                  <div
                    style={{ width: `${(timeInBar / barDuration) * 100}%` }}
                    className="h-full bg-gradient-to-r from-[#FF007A]/80 to-[#7928CA]/80 shadow-[0_0_8px_#FF007A] transition-transform duration-75 ease-linear"
                  />

                  {/* Beat alignments dots overlays based on active signatures */}
                  <div className="absolute inset-0 flex justify-between px-0.5 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 z-10 -translate-y-[1px] shadow-[0_0_6px_#facc15]" title="Downbeat Master Peak" />
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 z-10 -translate-y-[1px]" />
                  </div>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 shrink-0">
                  RAPID DOWNBEATS SYNC ONCE BAR LOOPS
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Panel Sidebar Customization Drawer */}
      <AnimatePresence>
        {selectedRhythmId && (
          <>
            {/* Backdrop cover overlay blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRhythmId(null)}
              className="fixed inset-0 bg-black z-40 cursor-default"
            />

            <SettingsPanel
              rhythm={selectedRhythm}
              onUpdate={handleUpdateRhythm}
              onRemove={handleRemoveRhythm}
              onClose={() => setSelectedRhythmId(null)}
              onPreviewNote={handlePreviewNote}
            />
          </>
        )}
      </AnimatePresence>

      {/* Help Instructions Overlay Modal Box */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Inner box dialogue */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-base text-zinc-100">Polyrhythm Guide</h3>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-zinc-400 mt-4 leading-relaxed">
                <p>
                  A <strong>polyrhythm</strong> represents the simultaneous use of two or more conflicting rhythms that are not readily perceived as deriving from one another or as simple manifestations of the same meter.
                </p>

                <div className="bg-zinc-900/40 border border-zinc-805 p-3 rounded-xl space-y-2">
                  <h4 className="font-mono font-bold text-zinc-100 uppercase tracking-wider text-[10px]">
                    How to play with this visualizer:
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      <strong>The Physics Cycle:</strong> Each vibrant bouncing ball runs on its own independent division of the common bar duration. When the bar starts, all balls strike the floor together on <strong>Beat 1 (Accent Downbeat)</strong>, drift out of phase, then align mathematically on the exact next cycle loop!
                    </li>
                    <li>
                      <strong>Adding & Editing:</strong> Create up to 10 tracks using the ADD parameter. Click directly on any bouncing ball, its track container, or its large beat numbers to configure its signature (2 to 19 divisions), choose its instrument pitch note, or delete/mute it!
                    </li>
                    <li>
                      <strong>Accents:</strong> The first beat of each track bar (Beat 1) is Synthesized at a higher volume and alternate resonant harmonics (an <em>Accent Strike</em>) making polyrhythmic alignments easily recognizable.
                    </li>
                    <li>
                      <strong>Shortcuts:</strong> Tap the <strong>Spacebar</strong> to play or pause the audio synthesizers on the fly!
                    </li>
                  </ul>
                </div>

                <div className="border border-zinc-900 p-3 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-zinc-200">Pre-arranged Sound Scales</h5>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Use the <strong>Presets list</strong> in the global settings drawer to instantly load beautiful mathematical combinations like <em>Golden Triad</em>, <em>Celestial Pentatonic</em>, or chaotic metallic clatters!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-900 text-right">
                <button
                  type="button"
                  onClick={() => setShowInfo(false)}
                  className="px-5 py-2.5 bg-zinc-90 bg-zinc-900 text-zinc-200 hover:bg-zinc-850 border border-zinc-800 font-sans font-semibold rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Got It!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
