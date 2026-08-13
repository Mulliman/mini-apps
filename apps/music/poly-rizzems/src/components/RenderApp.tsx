/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Board from './Board';
import { useClock } from '../video/clock';
import { compileSpec, loadSpec, sampleAt, type CompiledSpec } from '../video/spec';
import { renderSpecAudio, toBase64 } from '../video/renderAudio';
import { initAudio, playSynthNote } from '../utils/audio';
import { computeLiveBpm, computeLiveChord, computeLivePolyrhythm } from '../video/harmony';
import { Volume2 } from 'lucide-react';

/**
 * Vertical split of the frame: title band, the arrangement, the wordmark.
 *
 * Portrait reserves more because that's where the bands earn their keep — Shorts
 * and TikTok draw captions and a scrubber straight over the bottom of the frame,
 * exactly where the balls sit at rest. Landscape players auto-hide their controls,
 * so the same inset would cost height for protection it doesn't need.
 */
const BANDS = {
  portrait: { header: 1.5, body: 8, footer: 1.5 },
  landscape: { header: 1.1, body: 9, footer: 1.1 },
};

function useBands() {
  const [landscape, setLandscape] = useState(
    () => typeof window !== 'undefined' && window.innerWidth / window.innerHeight > 1.5
  );
  useEffect(() => {
    const onResize = () => setLandscape(window.innerWidth / window.innerHeight > 1.5);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return landscape ? BANDS.landscape : BANDS.portrait;
}

interface RenderAppProps {
  specName: string | null;
  /** Wait for `__polyrizzems.seek()` instead of free-running on rAF. */
  stepped: boolean;
}

declare global {
  interface Window {
    __polyrizzems?: {
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
  const [hasAudioStarted, setHasAudioStarted] = useState(false);
  const bands = useBands();

  const startAudio = useCallback(() => {
    initAudio();
    setHasAudioStarted(true);
  }, []);

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
      window.__polyrizzems = {
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
      window.__polyrizzems = {
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
      className="w-screen bg-black text-white font-sans overflow-hidden antialiased flex flex-col relative select-none"
      style={{ height: '100vh' }}
      onClick={stepped ? undefined : startAudio}
    >
      {!stepped && !hasAudioStarted && (
        <div className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer animate-pulse transition-all">
          <Volume2 className="w-3.5 h-3.5 text-[#FF007A]" />
          <span>Click anywhere to enable audio</span>
        </div>
      )}

      {/*
        Band ratios come from BANDS above and depend on the aspect. They are
        reserved whether or not they hold anything — keeping the bouncing clear of
        the platform's own overlays is the point, not the title. Type is sized in
        vh so both cuts stay proportional to their frame.
      */}
      <header
        className="flex flex-col items-center justify-center text-center overflow-hidden px-[5%] min-h-0"
        style={{ flex: `${bands.header} 1 0` }}
      >
        {compiled.spec.title && (
          <h1
            className="font-black italic tracking-tighter text-white uppercase"
            style={{ fontSize: '4.2vh', lineHeight: 1.1 }}
          >
            {compiled.spec.title}
          </h1>
        )}

        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 font-mono select-none">
          <div
            className="bg-white/10 rounded-full border border-white/15 inline-flex items-center justify-center gap-1.5 backdrop-blur-sm"
            style={{ height: '2.8vh', padding: '0 1.3vh' }}
          >
            <span
              className="text-[#FF007A] font-black uppercase tracking-wider leading-none flex items-center"
              style={{ fontSize: '1.15vh' }}
            >
              Chord
            </span>
            <span
              className="font-bold text-white tracking-tight leading-none flex items-center"
              style={{ fontSize: '1.4vh' }}
            >
              {computeLiveChord(sample.lanes)}
            </span>
          </div>

          <div
            className="bg-white/10 rounded-full border border-white/15 inline-flex items-center justify-center gap-1.5 backdrop-blur-sm"
            style={{ height: '2.8vh', padding: '0 1.3vh' }}
          >
            <span
              className="text-[#00f0ff] font-black uppercase tracking-wider leading-none flex items-center"
              style={{ fontSize: '1.15vh' }}
            >
              Ratio
            </span>
            <span
              className="font-bold text-white tracking-tight leading-none flex items-center"
              style={{ fontSize: '1.4vh' }}
            >
              {computeLivePolyrhythm(sample.lanes)}
            </span>
          </div>

          <div
            className="bg-white/10 rounded-full border border-white/15 inline-flex items-center justify-center gap-1.5 backdrop-blur-sm"
            style={{ height: '2.8vh', padding: '0 1.3vh' }}
          >
            <span
              className="text-[#39ff14] font-black uppercase tracking-wider leading-none flex items-center"
              style={{ fontSize: '1.15vh' }}
            >
              Tempo
            </span>
            <span
              className="font-bold text-white tracking-tight leading-none flex items-center"
              style={{ fontSize: '1.4vh' }}
            >
              {computeLiveBpm(sample.barDuration)} BPM
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-col min-h-0" style={{ flex: `${bands.body} 1 0` }}>
        <Board
          lanes={sample.lanes}
          bar={sample.bar}
          timeInBar={sample.timeInBar}
          barDuration={sample.barDuration}
          isPlaying
          audible={!stepped}
          framed={false}
          interactive={false}
          bounce={compiled.bounce}
          referenceSignature={compiled.referenceSignature}
          onPlayNoteTrigger={playSynthNote}
        />
      </div>

      <footer
        className="flex items-center justify-center overflow-hidden min-h-0 select-none"
        style={{ flex: `${bands.footer} 1 0` }}
      >
        <span
          className="font-black italic tracking-tighter text-white"
          style={{ fontSize: '4.2vh' }}
        >
          <span className="text-[#FF007A]">POLY</span>RIZZEMS<span className="text-[#FF007A]">.</span>
        </span>
      </footer>
    </div>
  );
}
