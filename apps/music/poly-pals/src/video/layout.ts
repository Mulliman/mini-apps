/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * One proportional layout system for every frame shape.
 *
 * The app used to pin its sizes with fixed caps (`max-w-[120px]` lanes,
 * `max-h-[600px]` runways, a `clamp()` ball), which meant a 1080×1920 render put a
 * 600px runway in a 1920px-tall frame and a 1920×1080 render marooned 120px lanes
 * in acres of black. Everything here derives from the frame and the lane count
 * instead, so 9:16 and 16:9 both fill out without per-aspect authoring.
 */

import { useEffect, useState, type RefObject } from 'react';

/**
 * Ball diameter as a fraction of runway height. The classic look of this genre
 * needs the parabola to read as *travel*; much above ~1/7 and it stops looking
 * like a bounce and starts looking like a ball wobbling in place.
 */
const BALL_RUNWAY_RATIO = 1 / 9;
/** Ball diameter as a fraction of lane pitch, so lanes never visually collide. */
const BALL_PITCH_RATIO = 0.62;
/** Stops two lanes in a 16:9 frame from drifting to opposite edges. */
const PITCH_BALL_RATIO = 3.2;

const MIN_BALL = 14;

export interface BoardLayout {
  width: number;
  height: number;
  /** Horizontal distance between lane centres. */
  lanePitch: number;
  /** Vertical travel available to a ball, in px. */
  runwayHeight: number;
  ballSize: number;
  labelFont: number;
  labelBlock: number;
  beatBox: number;
  beatGap: number;
  /**
   * Space reserved above and below the runway. The ball is positioned by its
   * centre, so at the apex it overhangs the runway top by a radius and at the
   * floor it overhangs the bottom by the same — without this it covers the
   * labels at the top of its arc and the beat counter at the bottom.
   */
  ballClearance: number;
  bottomPad: number;
}

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

export function computeLayout(width: number, height: number, laneCount: number): BoardLayout {
  const lanes = Math.max(1, laneCount);

  // Upper bounds are generous on purpose: clamping too low breaks proportionality
  // between the 16:9 and 9:16 cuts, which is the whole point of one layout system.
  const labelFont = clamp(height * 0.016, 10, 34);
  const labelBlock = labelFont * 2.8;
  const beatBox = clamp(height * 0.034, 26, 76);
  const beatGap = beatBox * 0.4;
  // Keeps the labels off the top edge and the counters off the bottom one.
  const topPad = height * 0.02;
  const bottomPad = height * 0.015;

  // Vertical space left for the runway plus the ball's overhang at both ends.
  const avail = Math.max(40, height - topPad - labelBlock - beatGap - beatBox - bottomPad);

  // Solve the runway/ball circularity in closed form: the ball overhangs by half
  // its diameter at each end of the runway, so a full diameter in total.
  const runwayIfBallLimited = avail / (1 + BALL_RUNWAY_RATIO);
  const ballMax = runwayIfBallLimited * BALL_RUNWAY_RATIO;

  const lanePitch = Math.min(width / lanes, ballMax * PITCH_BALL_RATIO);
  const ballSize = Math.max(MIN_BALL, Math.min(lanePitch * BALL_PITCH_RATIO, ballMax));
  const runwayHeight = Math.max(40, avail - ballSize);

  return {
    width,
    height,
    lanePitch,
    runwayHeight,
    ballSize,
    labelFont,
    labelBlock,
    beatBox,
    beatGap,
    ballClearance: ballSize / 2,
    bottomPad,
  };
}

/** Expose the layout to CSS so per-frame React renders don't touch geometry. */
export function layoutVars(layout: BoardLayout): React.CSSProperties {
  return {
    '--pp-lane-pitch': `${layout.lanePitch}px`,
    '--pp-runway': `${layout.runwayHeight}px`,
    '--pp-ball': `${layout.ballSize}px`,
    '--pp-label-font': `${layout.labelFont}px`,
    '--pp-label-block': `${layout.labelBlock}px`,
    '--pp-beat-box': `${layout.beatBox}px`,
    '--pp-beat-gap': `${layout.beatGap}px`,
    '--pp-ball-clearance': `${layout.ballClearance}px`,
    '--pp-bottom-pad': `${layout.bottomPad}px`,
  } as React.CSSProperties;
}

/**
 * Track a container's size. Recomputes only on resize or lane-count change —
 * never per frame, which keeps the 60fps render loop free of layout work.
 */
export function useBoardLayout(ref: RefObject<HTMLElement | null>, laneCount: number): BoardLayout {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      setSize((prev) =>
        Math.abs(prev.width - rect.width) < 0.5 && Math.abs(prev.height - rect.height) < 0.5
          ? prev
          : { width: rect.width, height: rect.height }
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return computeLayout(size.width, size.height, laneCount);
}
