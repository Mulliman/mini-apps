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
 * Trigger a synthesized note using oscillator nodes.
 * Combines a base triangle wave + a sine wave a perfect fifth/octave higher
 * to give an elegant, warm retro bell sound.
 * 
 * @param frequency The pitch in hertz
 * @param isFirstBeatOfBar Whether this beat is the downbeat of the bar
 * @param individualVolume Lane volume scale (0 to 1)
 */
export function playSynthNote(frequency: number, isFirstBeatOfBar: boolean, individualVolume: number = 0.8) {
  const ctx = initAudio();
  if (!ctx) return;

  // If context is suspended by browser autoplay policy, attempt to resume it
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  // Create audio nodes
  const oscBase = ctx.createOscillator();
  const oscHarmonic = ctx.createOscillator();
  const nodeGain = ctx.createGain();
  
  // Target master gain node or direct destination
  nodeGain.connect(masterGain || ctx.destination);

  // Setup waveforms: base is warm triangle, harmonic is sweet sine
  oscBase.type = 'triangle';
  oscHarmonic.type = 'sine';

  // Base pitch and harmonic pitch
  oscBase.frequency.setValueAtTime(frequency, now);
  
  // Enhance accent with slightly different pitches
  if (isFirstBeatOfBar) {
    // Octave higher accent
    oscHarmonic.frequency.setValueAtTime(frequency * 2, now);
    
    // Add subtle pluck pitch sweep downwards for that woodblock accent strike
    oscBase.frequency.exponentialRampToValueAtTime(frequency * 0.99, now + 0.05);
  } else {
    // Perfect fifth above for harmonic richness
    oscHarmonic.frequency.setValueAtTime(frequency * 1.5, now);
    // Subtle decay on pitch sweep
    oscBase.frequency.setValueAtTime(frequency, now);
  }

  // Calculate volume: first note of the bar is louder
  const baseVolume = isFirstBeatOfBar ? individualVolume * 0.95 : individualVolume * 0.42;

  // Apply envelope to prevent clicking and shape the tone
  nodeGain.gain.setValueAtTime(0, now);
  // Extremely rapid attack
  nodeGain.gain.linearRampToValueAtTime(baseVolume, now + 0.003);
  
  // Decay and infinite sustain to 0
  const decayTime = isFirstBeatOfBar ? 0.45 : 0.24;
  nodeGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

  // Blend base and harmonic nodes
  // Create a separate gain structure inside nodeGain
  oscBase.connect(nodeGain);
  
  // Harmonic node is slightly quieter
  const harmonicGainNode = ctx.createGain();
  harmonicGainNode.gain.setValueAtTime(isFirstBeatOfBar ? 0.35 : 0.18, now);
  oscHarmonic.connect(harmonicGainNode);
  harmonicGainNode.connect(nodeGain);

  // Play
  oscBase.start(now);
  oscHarmonic.start(now);
  
  oscBase.stop(now + decayTime + 0.05);
  oscHarmonic.stop(now + decayTime + 0.05);
}
