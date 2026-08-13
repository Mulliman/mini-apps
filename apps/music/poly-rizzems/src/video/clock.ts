/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The master clock, as a driver rather than something the app owns.
 *
 * Live playback drives it from requestAnimationFrame; the renderer drives it by
 * calling `setTime` for each frame it wants. Same clock, same downstream code —
 * the only difference is who advances it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface Clock {
  /** Absolute seconds since the start of the piece — not wrapped to the bar. */
  time: number;
  setTime: (t: number) => void;
  advance: (delta: number) => void;
}

export function useClock(running: boolean): Clock {
  const [time, setTimeState] = useState(0);
  const timeRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const runningRef = useRef(running);

  useEffect(() => {
    runningRef.current = running;
    // Drop the stale timestamp so a pause doesn't get counted as elapsed time.
    if (!running) lastFrameRef.current = null;
  }, [running]);

  useEffect(() => {
    let frame = 0;
    const loop = (timestamp: number) => {
      if (runningRef.current) {
        if (lastFrameRef.current !== null) {
          timeRef.current += (timestamp - lastFrameRef.current) / 1000;
          setTimeState(timeRef.current);
        }
        lastFrameRef.current = timestamp;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const setTime = useCallback((t: number) => {
    timeRef.current = t;
    lastFrameRef.current = null;
    setTimeState(t);
  }, []);

  const advance = useCallback((delta: number) => {
    setTime(timeRef.current + delta);
  }, [setTime]);

  return { time, setTime, advance };
}

export interface BarGrid {
  /** Integer bar index since the clock started. */
  bar: number;
  barFloat: number;
  /** Seconds into the current bar. */
  timeInBar: number;
  /** Absolute clock time of the next downbeat. */
  nextDownbeatTime: number;
}

/**
 * Where we are on the bar grid.
 *
 * Anchored rather than computed as `time % barDuration` so that changing the
 * tempo preserves the phase instead of teleporting every ball: the anchor is
 * moved to keep the current fraction of the bar intact.
 */
export function useBarGrid(time: number, barDuration: number): BarGrid {
  const anchor = useRef({ time: 0, bar: 0, barDuration });

  if (anchor.current.barDuration !== barDuration && barDuration > 0) {
    const previous = anchor.current;
    const previousFloat = previous.bar + (time - previous.time) / previous.barDuration;
    const whole = Math.floor(previousFloat);
    const fraction = previousFloat - whole;
    anchor.current = { time: time - fraction * barDuration, bar: whole, barDuration };
  }

  const { time: anchorTime, bar: anchorBar, barDuration: activeDuration } = anchor.current;
  const barFloat = anchorBar + (time - anchorTime) / activeDuration;
  const bar = Math.floor(barFloat);

  return {
    bar,
    barFloat,
    timeInBar: (barFloat - bar) * activeDuration,
    nextDownbeatTime: anchorTime + (bar + 1 - anchorBar) * activeDuration,
  };
}
