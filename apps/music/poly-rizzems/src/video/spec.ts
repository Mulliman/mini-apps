/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A POLYRIZZEMS video is *computed*, never captured.
 *
 * A spec is an initial arrangement plus a list of delta events timed in **bars**.
 * Compiling it produces a structure that can be sampled at any absolute time `t`
 * without replaying history, which is what makes `seek(t)` a pure function and
 * therefore what makes deterministic rendering possible at all.
 */

import { ExpressionType, Rhythm } from '../types';

/**
 * Durations, in seconds, of the transitions that used to be motion/react springs.
 * They are now derived from `t`, so the renderer and the live app agree exactly.
 */
export const ANIM = {
  ripple: 0.35,
  enter: 0.3,
  exit: 0.3,
} as const;

/** A rhythm as it appears in a spec: `expression` is required, never random. */
export interface SpecRhythm extends Omit<Rhythm, 'expression'> {
  expression: ExpressionType;
}

export type VideoEvent =
  | { at: number; type: 'add'; rhythm: SpecRhythm }
  | { at: number; type: 'remove'; id: string }
  | { at: number; type: 'mute'; id: string }
  | { at: number; type: 'unmute'; id: string }
  | { at: number; type: 'tempo'; barDuration: number }
  | { at: number; type: 'update'; id: string; patch: Partial<Omit<SpecRhythm, 'id'>> };

/**
 * How high each lane bounces relative to the others.
 *
 * Peak speed is `4h/T`, so with one shared height a lane's ball gets faster in
 * direct proportion to its time signature. At 60fps a 16-beat lane travels over
 * four ball-widths per frame — consecutive frames don't overlap, so it reads as
 * teleporting rather than bouncing and its face is unreadable.
 *
 * - `uniform`    — one height for every lane. The classic look, but only safe
 *                  when the fastest and slowest signatures are close.
 * - `equalSpeed` — `h ∝ T`, which makes peak speed identical across lanes. Fast
 *                  lanes bounce low and stay legible.
 * - `gravity`    — `h ∝ T²`, what real gravity does. Correct, and usually too
 *                  aggressive: an 8× signature range leaves the fast lane
 *                  vibrating on the floor.
 */
export type BounceMode = 'uniform' | 'equalSpeed' | 'gravity';

/** Never let a lane's arc collapse to nothing, however fast it is. */
const MIN_BOUNCE_SCALE = 0.08;

export function bounceScale(
  mode: BounceMode,
  timeSignature: number,
  referenceSignature: number
): number {
  if (mode === 'uniform') return 1;
  const ratio = referenceSignature / timeSignature;
  const scaled = mode === 'gravity' ? ratio * ratio : ratio;
  return Math.max(MIN_BOUNCE_SCALE, Math.min(1, scaled));
}

export interface VideoSpec {
  name: string;
  description?: string;
  /** Defaults to `equalSpeed`. */
  bounce?: BounceMode;
  /**
   * Shown across the top of the video for its whole duration. Optional — the
   * header band is reserved either way, since its real job is keeping the
   * arrangement clear of the platform's own overlays.
   */
  title?: string;
  /** Total length in bars. Wall-clock length depends on tempo events. */
  bars: number;
  /** Bar duration in seconds at bar 0. */
  barDuration: number;
  /** The arrangement at bar 0. */
  rhythms: SpecRhythm[];
  /** Delta events, each landing on a bar boundary. */
  events?: VideoEvent[];
}

/** A stretch of bars sharing one tempo. */
export interface TempoSegment {
  startBar: number;
  endBar: number;
  barDuration: number;
  startTime: number;
  endTime: number;
}

/** A lane's full property set becomes a step function of time via keyframes. */
export interface LaneKeyframe {
  time: number;
  rhythm: SpecRhythm;
}

export interface CompiledLane {
  id: string;
  /** Stable layout ordering — insertion sequence, so lanes never reshuffle. */
  order: number;
  enterTime: number;
  /** Absolute time the lane was removed, or null if it survives to the end. */
  exitTime: number | null;
  keyframes: LaneKeyframe[];
}

export interface CompiledSpec {
  spec: VideoSpec;
  segments: TempoSegment[];
  totalBars: number;
  totalDuration: number;
  lanes: CompiledLane[];
  bounce: BounceMode;
  /**
   * The slowest signature anywhere in the spec, so bounce heights stay fixed for
   * the whole video. Deriving it from whatever is on screen would make every
   * lane jump whenever one was added or removed.
   */
  referenceSignature: number;
  /** True when the spec is a pure loop — no events, so end state == start state. */
  isLoopable: boolean;
}

/** A lane sampled at one instant, ready to hand to the board. */
export interface SampledLane {
  key: string;
  order: number;
  rhythm: Rhythm;
  /** 0→1 while entering, 1 once settled. */
  enterProgress: number;
  /** 0 while alive, 0→1 while leaving. */
  exitProgress: number;
}

export interface Sample {
  /** Integer bar index at this instant. */
  bar: number;
  /** Seconds elapsed within the current bar, in `[0, barDuration)`. */
  timeInBar: number;
  barDuration: number;
  lanes: SampledLane[];
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function specError(message: string): never {
  throw new Error(`Invalid POLYRIZZEMS spec: ${message}`);
}

/**
 * Build the tempo segments. Events land on bar boundaries, so tempo is piecewise
 * constant and bar↔seconds conversion is exact rather than an integration.
 */
function buildSegments(spec: VideoSpec): TempoSegment[] {
  const tempoChanges = (spec.events ?? [])
    .filter((e): e is Extract<VideoEvent, { type: 'tempo' }> => e.type === 'tempo')
    .slice()
    .sort((a, b) => a.at - b.at);

  const segments: TempoSegment[] = [];
  let barDuration = spec.barDuration;
  let startBar = 0;
  let startTime = 0;

  const pushSegment = (endBar: number, nextDuration: number) => {
    if (endBar <= startBar) {
      // A tempo change at bar 0, or two at the same bar: the later one wins.
      barDuration = nextDuration;
      return;
    }
    const endTime = startTime + (endBar - startBar) * barDuration;
    segments.push({ startBar, endBar, barDuration, startTime, endTime });
    startBar = endBar;
    startTime = endTime;
    barDuration = nextDuration;
  };

  for (const change of tempoChanges) {
    if (change.at >= spec.bars) break;
    if (!(change.barDuration > 0)) specError(`tempo at bar ${change.at} must be positive`);
    pushSegment(change.at, change.barDuration);
  }
  pushSegment(spec.bars, barDuration);

  return segments;
}

/** Absolute start time, in seconds, of a bar index. */
export function barToTime(compiled: CompiledSpec, bar: number): number {
  const { segments } = compiled;
  for (const seg of segments) {
    if (bar < seg.endBar) {
      return seg.startTime + (bar - seg.startBar) * seg.barDuration;
    }
  }
  return compiled.totalDuration;
}

/** The bar duration in effect at a bar index. */
export function barDurationAt(compiled: CompiledSpec, bar: number): number {
  const { segments } = compiled;
  for (const seg of segments) {
    if (bar < seg.endBar) return seg.barDuration;
  }
  return segments[segments.length - 1]?.barDuration ?? compiled.spec.barDuration;
}

/**
 * Compile a spec into a samplable timeline.
 *
 * Lane properties become keyframes rather than being replayed per frame, so
 * sampling stays O(lanes) no matter how many events the spec has.
 */
export function compileSpec(spec: VideoSpec): CompiledSpec {
  if (!Number.isFinite(spec.bars) || spec.bars <= 0) specError('`bars` must be a positive number');
  if (!(spec.barDuration > 0)) specError('`barDuration` must be positive');
  if (!Array.isArray(spec.rhythms)) specError('`rhythms` must be an array');

  const segments = buildSegments(spec);
  const totalDuration = segments.length ? segments[segments.length - 1].endTime : 0;

  const compiled: CompiledSpec = {
    spec,
    segments,
    totalBars: spec.bars,
    totalDuration,
    lanes: [],
    bounce: spec.bounce ?? 'equalSpeed',
    referenceSignature: Math.min(
      ...spec.rhythms.map((r) => r.timeSignature),
      ...(spec.events ?? [])
        .filter((e): e is Extract<VideoEvent, { type: 'add' }> => e.type === 'add')
        .map((e) => e.rhythm.timeSignature)
    ),
    isLoopable: (spec.events ?? []).length === 0,
  };

  const lanes: CompiledLane[] = [];
  /** id → index into `lanes`, for the currently-alive instance of that id. */
  const alive = new Map<string, number>();
  let order = 0;

  const openLane = (rhythm: SpecRhythm, time: number) => {
    if (alive.has(rhythm.id)) {
      specError(`two live lanes share id "${rhythm.id}"`);
    }
    alive.set(rhythm.id, lanes.length);
    lanes.push({
      id: rhythm.id,
      order: order++,
      enterTime: time,
      exitTime: null,
      keyframes: [{ time, rhythm: { ...rhythm } }],
    });
  };

  const laneFor = (id: string, at: number): CompiledLane => {
    const index = alive.get(id);
    if (index === undefined) specError(`event at bar ${at} targets unknown or removed lane "${id}"`);
    return lanes[index];
  };

  const currentRhythm = (lane: CompiledLane) => lane.keyframes[lane.keyframes.length - 1].rhythm;

  // The opening arrangement is already *there* — backdate its entry so the first
  // frame shows every ball on the floor at full size. Fading it in would soften the
  // opening downbeat and, on a looping spec, leave a fade at the seam.
  for (const rhythm of spec.rhythms) openLane(normaliseRhythm(rhythm), -ANIM.enter);

  const events = (spec.events ?? []).slice().sort((a, b) => a.at - b.at);
  for (const event of events) {
    if (event.at < 0) specError(`event at bar ${event.at} is before the start`);
    if (event.at >= spec.bars) continue; // past the end; harmless, just never fires
    const time = barToTime(compiled, event.at);

    switch (event.type) {
      case 'tempo':
        break; // already folded into the segments
      case 'add':
        openLane(normaliseRhythm(event.rhythm), time);
        break;
      case 'remove': {
        const lane = laneFor(event.id, event.at);
        lane.exitTime = time;
        alive.delete(event.id);
        break;
      }
      case 'mute':
      case 'unmute': {
        const lane = laneFor(event.id, event.at);
        lane.keyframes.push({
          time,
          rhythm: { ...currentRhythm(lane), isMuted: event.type === 'mute' },
        });
        break;
      }
      case 'update': {
        const lane = laneFor(event.id, event.at);
        lane.keyframes.push({
          time,
          rhythm: { ...currentRhythm(lane), ...event.patch, id: lane.id },
        });
        break;
      }
      default:
        specError(`unknown event type "${(event as { type: string }).type}"`);
    }
  }

  compiled.lanes = lanes;
  return compiled;
}

function normaliseRhythm(rhythm: SpecRhythm): SpecRhythm {
  if (!rhythm || typeof rhythm.id !== 'string' || !rhythm.id) specError('every rhythm needs a string `id`');
  const sig = rhythm.timeSignature;
  if (!Number.isInteger(sig) || sig < 2 || sig > 19) {
    specError(`rhythm "${rhythm.id}" has timeSignature ${sig}; must be an integer 2–19`);
  }
  return {
    volume: 0.8,
    isMuted: false,
    expression: 'happy',
    ...rhythm,
  };
}

/** Locate the tempo segment covering an absolute time. */
function segmentAt(compiled: CompiledSpec, t: number): TempoSegment {
  const { segments } = compiled;
  for (const seg of segments) {
    if (t < seg.endTime) return seg;
  }
  return segments[segments.length - 1];
}

function rhythmAt(lane: CompiledLane, t: number): SpecRhythm {
  let found = lane.keyframes[0].rhythm;
  for (const kf of lane.keyframes) {
    if (kf.time > t) break;
    found = kf.rhythm;
  }
  return found;
}

/**
 * Sample the timeline at absolute time `t`. Pure — the same `t` always yields the
 * same result, which is what lets the renderer seek randomly and lets a crashed
 * render resume mid-way.
 */
export function sampleAt(compiled: CompiledSpec, t: number): Sample {
  const clampedT = Math.max(0, Math.min(t, compiled.totalDuration));
  const seg = segmentAt(compiled, clampedT);
  const intoSegment = clampedT - seg.startTime;
  const barsIntoSegment = Math.floor(intoSegment / seg.barDuration);

  const lanes: SampledLane[] = [];
  for (const lane of compiled.lanes) {
    const enterProgress = clamp01((clampedT - lane.enterTime) / ANIM.enter);
    if (clampedT < lane.enterTime) continue;

    let exitProgress = 0;
    if (lane.exitTime !== null) {
      exitProgress = clamp01((clampedT - lane.exitTime) / ANIM.exit);
      if (exitProgress >= 1) continue; // fully gone
    }

    lanes.push({
      // `order` disambiguates a lane id that was removed and later re-added.
      key: `${lane.id}#${lane.order}`,
      order: lane.order,
      rhythm: rhythmAt(lane, clampedT),
      enterProgress,
      exitProgress,
    });
  }
  lanes.sort((a, b) => a.order - b.order);

  return {
    bar: seg.startBar + barsIntoSegment,
    timeInBar: intoSegment - barsIntoSegment * seg.barDuration,
    barDuration: seg.barDuration,
    lanes,
  };
}

/** One synthesised strike, resolved to an absolute time. */
export interface ScheduledStrike {
  time: number;
  frequency: number;
  isAccent: boolean;
  volume: number;
}

/**
 * Every strike in the whole video, computed analytically.
 *
 * This is the other half of the determinism guarantee: the picture and the sound
 * are both derived from `k × barDuration / timeSignature`, so they cannot drift
 * apart no matter how fast or slow the frames are rendered.
 */
export function scheduleStrikes(compiled: CompiledSpec): ScheduledStrike[] {
  const strikes: ScheduledStrike[] = [];

  for (let bar = 0; bar < compiled.totalBars; bar++) {
    const barStart = barToTime(compiled, bar);
    const barDuration = barDurationAt(compiled, bar);
    // Just inside the bar, so an event landing on this downbeat counts.
    const epsilon = barDuration * 1e-6;

    for (const lane of compiled.lanes) {
      // Deliberately not `sampleAt`: that keeps a removed lane around while its exit
      // animation plays, which is right for the picture and wrong for the sound — it
      // would give a lane a whole extra bar of strikes after it was removed.
      if (lane.enterTime > barStart + epsilon) continue;
      if (lane.exitTime !== null && lane.exitTime <= barStart + epsilon) continue;

      const rhythm = rhythmAt(lane, barStart + epsilon);
      if (rhythm.isMuted) continue;
      const beatPeriod = barDuration / rhythm.timeSignature;
      for (let beat = 0; beat < rhythm.timeSignature; beat++) {
        strikes.push({
          time: barStart + beat * beatPeriod,
          frequency: rhythm.frequency,
          isAccent: beat === 0,
          volume: rhythm.volume,
        });
      }
    }
  }

  return strikes.sort((a, b) => a.time - b.time);
}

/**
 * Load a spec by name.
 *
 * Fetched **document-relative** on purpose: the app sets `base: './'` and is served
 * from a subpath in the combined deploy, so an absolute `/specs/...` would 404 there.
 */
export async function loadSpec(name: string): Promise<VideoSpec> {
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, '');
  const url = new URL(`specs/${safe}.json`, document.baseURI).toString();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load spec "${safe}" from ${url} (HTTP ${response.status})`);
  }
  return (await response.json()) as VideoSpec;
}
