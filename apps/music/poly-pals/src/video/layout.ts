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
const BALL_RUNWAY_RATIO = 1 / 8;
/**
 * A wide frame has far less height to spend, so holding it to the portrait ratio
 * leaves the balls tiny. Trading a little travel for a bigger ball reads better
 * there; much past 1/7 and the bounce stops looking like travel at all.
 */
const BALL_RUNWAY_RATIO_WIDE = 1 / 7;
/** Ball diameter as a fraction of lane pitch, so lanes never visually collide. */
const BALL_PITCH_RATIO = 0.62;
/**
 * Stops a couple of lanes in a 16:9 frame from drifting to opposite edges. Only
 * binds when the frame is wide relative to its lane count — 9:16 is always
 * width-limited instead, so this has no effect there.
 */
const PITCH_BALL_RATIO = 4.4;

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
  /** Wide frames put the lane's signature and note on one line to save height. */
  compactLabel: boolean;
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

  // Labels and counters belong to a *lane*, so their natural size comes from the
  // lane's width, bounded by the height available. Driving them from height alone
  // made them near-illegible in 16:9, where the body band is short but wide.
  // Upper bounds are generous on purpose: clamping too low breaks proportionality
  // between the two cuts, which is the whole point of one layout system.
  // Height is the scarce resource in a wide frame, so the two label lines get
  // folded onto one — worth roughly 40% of the label block back.
  const compactLabel = height > 0 && width / height > 1.5;
  const basePitch = Math.min(width / lanes, width * 0.26);
  const labelFont = clamp(
    Math.min(basePitch * (compactLabel ? 0.11 : 0.15), height * 0.045),
    11,
    44
  );
  const labelBlock = labelFont * (compactLabel ? 1.7 : 2.8);
  const beatBox = clamp(Math.min(basePitch * 0.36, height * 0.095), 24, 100);
  const beatGap = beatBox * 0.4;
  // Keeps the labels off the top edge and the counters off the bottom one.
  const topPad = height * 0.02;
  const bottomPad = height * 0.015;

  // Vertical space left for the runway plus the ball's overhang at both ends.
  const avail = Math.max(40, height - topPad - labelBlock - beatGap - beatBox - bottomPad);

  // Solve the runway/ball circularity in closed form: the ball overhangs by half
  // its diameter at each end of the runway, so a full diameter in total.
  const ballRunwayRatio = compactLabel ? BALL_RUNWAY_RATIO_WIDE : BALL_RUNWAY_RATIO;
  const runwayIfBallLimited = avail / (1 + ballRunwayRatio);
  const ballMax = runwayIfBallLimited * ballRunwayRatio;

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
    compactLabel,
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
