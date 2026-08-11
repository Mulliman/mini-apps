/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import RhythmTrack from './RhythmTrack';
import { layoutVars, useBoardLayout } from '../video/layout';
import type { SampledLane } from '../video/spec';

interface BoardProps {
  lanes: SampledLane[];
  timeInBar: number;
  barDuration: number;
  isPlaying: boolean;
  audible: boolean;
  /** The bordered container. Off for renders, which go edge-to-edge black. */
  framed: boolean;
  interactive: boolean;
  selectedId?: string | null;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  onPlayNoteTrigger?: (frequency: number, isFirst: boolean, volume: number) => void;
}

const smoothstep = (p: number) => p * p * (3 - 2 * p);

export default function Board({
  lanes,
  timeInBar,
  barDuration,
  isPlaying,
  audible,
  framed,
  interactive,
  selectedId = null,
  onEdit,
  onRemove,
  onToggleMute,
  onPlayNoteTrigger,
}: BoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layout = useBoardLayout(containerRef, lanes.length);

  return (
    <div
      style={layoutVars(layout)}
      className={`flex-1 flex flex-col w-full min-h-0 overflow-hidden ${
        framed
          ? 'bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-2 sm:p-4 md:p-6'
          : ''
      }`}
    >
      <div
        ref={containerRef}
        id="tracks-container"
        className="flex-1 flex justify-center items-end relative w-full min-h-0"
      >
      {lanes.map((lane) => {
        // The lane's share of horizontal space *is* the reflow animation: neighbours
        // are pushed apart as it grows in and close back up as it shrinks out. Pure,
        // so it stays locked to the bounce no matter how fast frames are produced.
        const entering = smoothstep(lane.enterProgress);
        const leaving = smoothstep(lane.exitProgress);
        const weight = entering * (1 - leaving);
        const opacity = entering * (1 - leaving);
        const scale = 0.8 + 0.2 * weight;

        return (
          <div
            key={lane.key}
            className="flex items-end justify-center shrink-0"
            style={{ width: `calc(var(--pp-lane-pitch) * ${weight})` }}
          >
            <div className="shrink-0 origin-bottom" style={{ opacity, transform: `scale(${scale})` }}>
              <RhythmTrack
                lane={lane}
                timeInBar={timeInBar}
                barDuration={barDuration}
                isPlaying={isPlaying}
                audible={audible}
                interactive={interactive}
                isSelected={selectedId === lane.rhythm.id}
                onEdit={onEdit}
                onRemove={onRemove}
                onToggleMute={onToggleMute}
                onPlayNoteTrigger={onPlayNoteTrigger}
              />
            </div>
          </div>
        );
      })}

      {/* Common floor, aligned to where the balls actually land. */}
      <div
        className="absolute left-[6%] right-[6%] h-[2px] bg-white/5 rounded-full pointer-events-none"
        style={{
          bottom: 'calc(var(--pp-bottom-pad) + var(--pp-beat-box) + var(--pp-beat-gap) + var(--pp-ball-clearance))',
        }}
      />
      </div>
    </div>
  );
}
