/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

/**
 * Lazy initialize the AudioContext upon user interaction.
 */
export function initAudio(): AudioContext | null {
  if (audioCtx) return audioCtx;

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    console.error("Web Audio API not supported in this browser");
    return null;
  }

  audioCtx = new AudioContextClass();

  // Set up master volume node
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  return audioCtx;
}

/**
 * Adjust the global master volume.
 * @param v Value between 0 (muted) and 1 (full volume)
 */
export function setMasterVolume(v: number) {
  const ctx = initAudio();
  if (masterGain && ctx) {
    masterGain.gain.setValueAtTime(v, ctx.currentTime);
  }
}

/**
 * Schedule one synthesized strike at an explicit time on an explicit context.
 *
 * Both the context and the time are parameters rather than "the live context, now",
 * which is what lets the offline renderer reuse this exact code — the video's audio
 * is the app's audio, not a reimplementation of it.
 *
 * Combines a base triangle wave + a sine wave a perfect fifth/octave higher
 * to give an elegant, warm retro bell sound.
 *
 * @param ctx Realtime or offline audio context
 * @param destination Node to connect into
 * @param when Context time at which the strike lands
 * @param frequency The pitch in hertz
 * @param isFirstBeatOfBar Whether this beat is the downbeat of the bar
 * @param individualVolume Lane volume scale (0 to 1)
 */
export function scheduleSynthNote(
  ctx: BaseAudioContext,
  destination: AudioNode,
  when: number,
  frequency: number,
  isFirstBeatOfBar: boolean,
  individualVolume: number = 0.8
) {
  const oscBase = ctx.createOscillator();
  const oscHarmonic = ctx.createOscillator();
  const nodeGain = ctx.createGain();

  nodeGain.connect(destination);

  // Setup waveforms: base is warm triangle, harmonic is sweet sine
  oscBase.type = 'triangle';
  oscHarmonic.type = 'sine';

  oscBase.frequency.setValueAtTime(frequency, when);

  // Enhance accent with slightly different pitches
  if (isFirstBeatOfBar) {
    // Octave higher accent
    oscHarmonic.frequency.setValueAtTime(frequency * 2, when);
    // Add subtle pluck pitch sweep downwards for that woodblock accent strike
    oscBase.frequency.exponentialRampToValueAtTime(frequency * 0.99, when + 0.05);
  } else {
    // Perfect fifth above for harmonic richness
    oscHarmonic.frequency.setValueAtTime(frequency * 1.5, when);
    oscBase.frequency.setValueAtTime(frequency, when);
  }

  // Calculate volume: first note of the bar is louder
  const baseVolume = isFirstBeatOfBar ? individualVolume * 0.95 : individualVolume * 0.42;

  // Apply envelope to prevent clicking and shape the tone
  nodeGain.gain.setValueAtTime(0, when);
  nodeGain.gain.linearRampToValueAtTime(baseVolume, when + 0.003);

  const decayTime = isFirstBeatOfBar ? 0.45 : 0.24;
  nodeGain.gain.exponentialRampToValueAtTime(0.0001, when + decayTime);

  oscBase.connect(nodeGain);

  const harmonicGainNode = ctx.createGain();
  harmonicGainNode.gain.setValueAtTime(isFirstBeatOfBar ? 0.35 : 0.18, when);
  oscHarmonic.connect(harmonicGainNode);
  harmonicGainNode.connect(nodeGain);

  oscBase.start(when);
  oscHarmonic.start(when);

  oscBase.stop(when + decayTime + 0.05);
  oscHarmonic.stop(when + decayTime + 0.05);
}

/** How long after `when` a strike is still ringing. Used to size the render tail. */
export const MAX_STRIKE_TAIL = 0.5;

/**
 * Trigger a strike immediately on the live context.
 *
 * `lookahead` schedules slightly into the future so a note fired from an animation
 * frame isn't quantised to whenever that frame happened to run.
 */
export function playSynthNote(frequency: number, isFirstBeatOfBar: boolean, individualVolume: number = 0.8) {
  const ctx = initAudio();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const lookahead = 0.012;
  scheduleSynthNote(ctx, masterGain || ctx.destination, ctx.currentTime + lookahead, frequency, isFirstBeatOfBar, individualVolume);
}
