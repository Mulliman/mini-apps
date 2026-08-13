/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Offline audio render.
 *
 * Every strike is scheduled analytically from the compiled spec and rendered
 * through the app's own synth in an `OfflineAudioContext`. Faster than realtime,
 * sample-accurate, and — because the strike times come from the same
 * `k × barDuration / timeSignature` arithmetic the bouncing uses — locked to the
 * picture by construction rather than by luck.
 */

import { MAX_STRIKE_TAIL, scheduleSynthNote } from '../utils/audio';
import { scheduleStrikes, type CompiledSpec } from './spec';

export interface AudioRenderOptions {
  sampleRate?: number;
  masterVolume?: number;
}

export interface AudioRenderResult {
  wav: ArrayBuffer;
  duration: number;
  peak: number;
  /** True when the decay tails were wrapped around to the start of the loop. */
  tailFolded: boolean;
  /** Gain applied to avoid clipping, 1 when none was needed. */
  normalised: number;
}

/** Room for the final bar's decay to ring out past the end of the video. */
const TAIL = MAX_STRIKE_TAIL + 0.5;
/** Fade applied to the very end of a non-looping piece so it doesn't click. */
const END_FADE = 0.03;

export async function renderSpecAudio(
  compiled: CompiledSpec,
  options: AudioRenderOptions = {}
): Promise<AudioRenderResult> {
  const sampleRate = options.sampleRate ?? 48000;
  const masterVolume = options.masterVolume ?? 0.8;

  const duration = compiled.totalDuration;
  const renderDuration = duration + TAIL;
  const frameCount = Math.ceil(renderDuration * sampleRate);

  const OfflineCtx: typeof OfflineAudioContext =
    window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!OfflineCtx) throw new Error('OfflineAudioContext is not available in this browser');

  const ctx = new OfflineCtx(1, frameCount, sampleRate);
  const master = ctx.createGain();
  master.gain.setValueAtTime(masterVolume, 0);
  master.connect(ctx.destination);

  for (const strike of scheduleStrikes(compiled)) {
    scheduleSynthNote(ctx, master, strike.time, strike.frequency, strike.isAccent, strike.volume);
  }

  const rendered = await ctx.startRendering();
  const source = rendered.getChannelData(0);

  const outLength = Math.round(duration * sampleRate);
  const out = new Float32Array(outLength);
  out.set(source.subarray(0, outLength));

  // Fold the overhang back over the start so a looping video's final decays ring
  // into its own beginning instead of being chopped off at the seam.
  const tailFolded = compiled.isLoopable;
  if (tailFolded) {
    const tailSamples = Math.min(source.length - outLength, outLength);
    for (let i = 0; i < tailSamples; i++) {
      out[i] += source[outLength + i];
    }
  } else {
    const fadeSamples = Math.min(Math.round(END_FADE * sampleRate), outLength);
    for (let i = 0; i < fadeSamples; i++) {
      out[outLength - fadeSamples + i] *= 1 - i / fadeSamples;
    }
  }

  let peak = 0;
  for (let i = 0; i < out.length; i++) {
    const abs = Math.abs(out[i]);
    if (abs > peak) peak = abs;
  }

  // Dense arrangements can stack enough oscillators to clip. Scale rather than
  // clamp, so the result stays a faithful (if quieter) version of the mix.
  let normalised = 1;
  if (peak > 0.99) {
    normalised = 0.99 / peak;
    for (let i = 0; i < out.length; i++) out[i] *= normalised;
  }

  return { wav: encodeWav(out, sampleRate), duration, peak, tailFolded, normalised };
}

/** Minimal 16-bit PCM WAV writer — enough for ffmpeg to ingest. */
function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}

/** Base64 so the buffer can cross the puppeteer bridge as a plain string. */
export function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
