/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Recording captures *config*, not pixels.
 *
 * While armed, an action doesn't apply when you click it — it queues and lands on
 * the next downbeat, in the live app as well as in the spec. That costs a little
 * immediacy and buys two things: what you performed is exactly what renders, and
 * arranging stops being clicking and starts being conducting.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Rhythm } from '../types';
import type { BarGrid } from './clock';
import type { SpecRhythm, VideoEvent, VideoSpec } from './spec';

export type RecorderStatus = 'idle' | 'armed' | 'recording';

export interface PendingAction {
  key: string;
  label: string;
  landsAt: number;
}

export interface Recorder {
  status: RecorderStatus;
  /** Bars elapsed since recording began. */
  bar: number;
  pending: PendingAction[];
  /** Seconds until the next downbeat, for the countdown indicator. */
  untilDownbeat: number;
  arm: (rhythms: Rhythm[], barDuration: number) => void;
  stop: () => VideoSpec | null;
  cancel: () => void;
  /**
   * Run an action now, or — while recording — on the next downbeat.
   * Re-scheduling the same `key` replaces the earlier intent, so dragging the
   * tempo slider queues one change rather than a hundred.
   */
  run: (key: string, label: string, apply: () => void, event: (bar: number) => VideoEvent | null) => void;
}

interface QueuedAction extends PendingAction {
  apply: () => void;
  event: (bar: number) => VideoEvent | null;
}

interface Session {
  startBar: number;
  barDuration: number;
  rhythms: SpecRhythm[];
  events: VideoEvent[];
}

function toSpecRhythm(rhythm: Rhythm): SpecRhythm {
  return {
    ...rhythm,
    expression: rhythm.expression && rhythm.expression !== 'none' ? rhythm.expression : 'happy',
  };
}

export function useRecorder(grid: BarGrid, time: number): Recorder {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [pending, setPending] = useState<PendingAction[]>([]);
  const [bar, setBar] = useState(0);

  const queueRef = useRef<QueuedAction[]>([]);
  const sessionRef = useRef<Session | null>(null);
  const armedForRef = useRef<number | null>(null);

  const gridRef = useRef(grid);
  gridRef.current = grid;

  const publishPending = () => {
    setPending(queueRef.current.map(({ key, label, landsAt }) => ({ key, label, landsAt })));
  };

  const arm = useCallback((rhythms: Rhythm[], barDuration: number) => {
    // Recording begins on the next downbeat so that bar 0 is a real downbeat and
    // the spec's opening frame has every ball on the floor.
    sessionRef.current = {
      startBar: gridRef.current.bar + 1,
      barDuration,
      rhythms: rhythms.map(toSpecRhythm),
      events: [],
    };
    armedForRef.current = gridRef.current.nextDownbeatTime;
    queueRef.current = [];
    publishPending();
    setBar(0);
    setStatus('armed');
  }, []);

  const cancel = useCallback(() => {
    sessionRef.current = null;
    armedForRef.current = null;
    queueRef.current = [];
    publishPending();
    setStatus('idle');
    setBar(0);
  }, []);

  const stop = useCallback((): VideoSpec | null => {
    const session = sessionRef.current;
    // Stopped while still armed: the first downbeat never arrived, so there is no
    // take to hand back.
    const neverStarted = armedForRef.current !== null;
    // Drop anything still queued: it never landed, so it never happened.
    queueRef.current = [];
    publishPending();
    setStatus('idle');
    setBar(0);
    sessionRef.current = null;
    armedForRef.current = null;
    if (!session || neverStarted) return null;

    // End on a downbeat: only whole bars make it into the spec.
    const bars = Math.max(1, gridRef.current.bar - session.startBar);
    return {
      name: 'Recording',
      description: `Recorded ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
      bars,
      barDuration: session.barDuration,
      rhythms: session.rhythms,
      events: session.events.filter((event) => event.at < bars),
    };
  }, []);

  const run = useCallback<Recorder['run']>((key, label, apply, event) => {
    if (sessionRef.current === null || armedForRef.current !== null) {
      // Not recording yet — behave like the app always has.
      apply();
      return;
    }
    const landsAt = gridRef.current.nextDownbeatTime;
    queueRef.current = [
      ...queueRef.current.filter((action) => action.key !== key),
      { key, label, landsAt, apply, event },
    ];
    publishPending();
  }, []);

  // Flush the queue as the clock crosses each downbeat.
  useEffect(() => {
    if (status === 'idle') return;

    if (status === 'armed') {
      if (armedForRef.current !== null && time >= armedForRef.current) {
        armedForRef.current = null;
        setStatus('recording');
      }
      return;
    }

    const session = sessionRef.current;
    if (!session) return;

    const currentBar = grid.bar - session.startBar;
    if (currentBar !== bar) setBar(Math.max(0, currentBar));

    const due = queueRef.current.filter((action) => time >= action.landsAt);
    if (due.length === 0) return;

    queueRef.current = queueRef.current.filter((action) => time < action.landsAt);
    for (const action of due) {
      const landingBar = Math.max(0, grid.bar - session.startBar);
      const recorded = action.event(landingBar);
      if (recorded) session.events.push(recorded);
      action.apply();
    }
    publishPending();
  }, [time, status, grid.bar, bar]);

  return {
    status,
    bar,
    pending,
    untilDownbeat: Math.max(0, grid.nextDownbeatTime - time),
    arm,
    stop,
    cancel,
    run,
  };
}

/** Hand the finished spec to the user as a file they can drop into public/specs. */
export function downloadSpec(spec: VideoSpec) {
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
  const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `polypals-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
