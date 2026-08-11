/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Board from './Board';
import { useClock } from '../video/clock';
import { compileSpec, loadSpec, sampleAt, type CompiledSpec } from '../video/spec';
import { renderSpecAudio, toBase64 } from '../video/renderAudio';
import { initAudio } from '../utils/audio';

interface RenderAppProps {
  specName: string | null;
  /** Wait for `__polypals.seek()` instead of free-running on rAF. */
  stepped: boolean;
}

declare global {
  interface Window {
    __polypals?: {
      ready: boolean;
      error?: string;
      info?: { name: string; bars: number; totalDuration: number; isLoopable: boolean };
      seek: (t: number) => Promise<void>;
      renderAudio: (sampleRate?: number) => Promise<{
        base64: string;
        duration: number;
        peak: number;
        tailFolded: boolean;
        normalised: number;
      }>;
    };
  }
}

/**
 * The chrome-free surface the renderer drives — and, with `&play=1`, the preview a
 * human can watch in a normal browser. Same component either way, so what you see
 * in the preview is exactly what gets encoded.
 */
export default function RenderApp({ specName, stepped }: RenderAppProps) {
  const [compiled, setCompiled] = useState<CompiledSpec | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seekTick, setSeekTick] = useState(0);

  const clock = useClock(!stepped && compiled !== null && error === null);
  const { setTime } = clock;

  const pendingSeeks = useRef<Array<() => void>>([]);

  useEffect(() => {
    let cancelled = false;
    if (!specName) {
      setError('No spec requested. Add &spec=<name> to the URL.');
      return;
    }
    loadSpec(specName)
      .then((spec) => {
        if (cancelled) return;
        setCompiled(compileSpec(spec));
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [specName]);

  const seek = useCallback(
    (t: number) =>
      new Promise<void>((resolve) => {
        pendingSeeks.current.push(resolve);
        setTime(t);
        // Bumped unconditionally so seeking to the current time still settles.
        setSeekTick((n) => n + 1);
      }),
    [setTime]
  );

  // Resolve seeks once React has committed, so a screenshot taken straight after
  // `await seek(t)` sees frame `t` and not the one before it.
  //
  // Deliberately *not* gated on requestAnimationFrame: rAF stops firing whenever the
  // page isn't compositing — a backgrounded tab, an occluded window, a headless
  // browser under throttling — and the renderer would deadlock waiting for a frame
  // that never comes. CDP's screenshot rasterises from committed DOM state, so
  // commit is the guarantee that actually matters here.
  useEffect(() => {
    if (pendingSeeks.current.length === 0) return;
    const resolvers = pendingSeeks.current;
    pendingSeeks.current = [];
    for (const resolve of resolvers) resolve();
  }, [seekTick]);

  const renderAudio = useCallback(
    async (sampleRate?: number) => {
      if (!compiled) throw new Error('Spec is not loaded yet');
      const result = await renderSpecAudio(compiled, { sampleRate });
      return {
        base64: toBase64(result.wav),
        duration: result.duration,
        peak: result.peak,
        tailFolded: result.tailFolded,
        normalised: result.normalised,
      };
    },
    [compiled]
  );

  // Publish the control surface only once everything a frame depends on is settled —
  // fonts included, or the first frames would render in a fallback face.
  useEffect(() => {
    if (error) {
      window.__polypals = {
        ready: false,
        error,
        seek: async () => {},
        renderAudio: async () => {
          throw new Error(error);
        },
      };
      return;
    }
    if (!compiled) return;

    let cancelled = false;
    const publish = () => {
      if (cancelled) return;
      window.__polypals = {
        ready: true,
        info: {
          name: compiled.spec.name,
          bars: compiled.totalBars,
          totalDuration: compiled.totalDuration,
          isLoopable: compiled.isLoopable,
        },
        seek,
        renderAudio,
      };
    };

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(publish);
    } else {
      publish();
    }

    return () => {
      cancelled = true;
    };
  }, [compiled, error, seek, renderAudio]);

  if (error) {
    return (
      <div className="h-screen w-screen bg-black text-red-400 font-mono text-sm flex items-center justify-center p-8 text-center">
        {error}
      </div>
    );
  }

  if (!compiled) {
    return <div className="h-screen w-screen bg-black" />;
  }

  const t = stepped
    ? clock.time
    : compiled.totalDuration > 0
      ? clock.time % compiled.totalDuration
      : 0;
  const sample = sampleAt(compiled, t);

  return (
    <div
      className="w-screen bg-black text-white font-sans overflow-hidden antialiased flex flex-col"
      style={{ height: '100vh' }}
      onClick={stepped ? undefined : () => initAudio()}
    >
      <Board
        lanes={sample.lanes}
        timeInBar={sample.timeInBar}
        barDuration={sample.barDuration}
        isPlaying
        audible={!stepped}
        framed={false}
        interactive={false}
      />
      <div className="absolute bottom-3 right-4 text-white/15 font-black italic tracking-tighter select-none pointer-events-none text-[1.4vmin]">
        PolyPals<span className="text-[#FF007A]/40">.</span>
      </div>
    </div>
  );
}
