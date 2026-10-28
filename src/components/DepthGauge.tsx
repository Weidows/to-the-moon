import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, PIXEL, snap} from '../theme';
import {useLayout} from '../layout';
import {LAYERS, SEGMENTS} from '../timeline';

const NODES = [...LAYERS.map((l) => l.short), '月球'];
const N = NODES.length;

const ease = Easing.bezier(0.4, 0, 0.2, 1);

/** Which node the camera is diving toward, and how far it has travelled. */
const useDiveState = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const i = Math.max(
    0,
    SEGMENTS.findIndex((s) => sec >= s.from && sec < s.to),
  );
  const seg = SEGMENTS[Math.min(i, SEGMENTS.length - 1)];
  const target =
    i === 0 ? -0.75 : i === SEGMENTS.length - 1 ? N - 1 : i - 1;
  const prev =
    i <= 1 ? -0.75 : i === SEGMENTS.length - 1 ? N - 2 : i - 2;
  const travel = interpolate(sec - seg.from, [0.1, 0.9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return {dot: prev + (target - prev) * travel, active: Math.round(target), i};
};

export const DepthGauge: React.FC = () => {
  const layout = useLayout();
  const frame = useCurrentFrame();
  const {dot, active} = useDiveState();
  const blink = Math.floor(frame / 15) % 2 === 0;

  if (layout.portrait) {
    const y = layout.H - Math.round(layout.pad * 1.35);
    const x0 = layout.pad;
    const x1 = layout.W - layout.pad;
    const step = (x1 - x0) / (N - 1);
    const fontSize = snap(layout.W * 0.0215);
    return (
      <div style={{position: 'absolute', left: 0, right: 0, top: y, height: 120}}>
        <div
          style={{
            position: 'absolute',
            left: x0,
            top: 0,
            width: x1 - x0,
            height: 1,
            background: 'rgba(255,255,255,0.16)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: x0,
            top: 0,
            width: Math.max(0, (x0 + step * dot + step * 0.75 - x0) as number),
            height: 1,
            background: `linear-gradient(90deg, rgba(255,214,146,0) 0%, ${C.gold} 100%)`,
            boxShadow: `0 0 12px ${C.gold}`,
          }}
        />
        {NODES.map((n, k) => {
          const lit = k <= dot + 0.15;
          const isActive = k === active;
          return (
            <React.Fragment key={n}>
              <div
                style={{
                  position: 'absolute',
                  left: x0 + step * k - (isActive ? 4 : 2),
                  top: isActive ? -4 : -2,
                  width: isActive ? 9 : 5,
                  height: isActive ? 9 : 5,
                  borderRadius: '50%',
                  background: lit ? (isActive ? C.gold : C.aqua) : 'rgba(255,255,255,0.25)',
                  boxShadow: isActive ? `0 0 ${blink ? 16 : 8}px ${C.gold}` : undefined,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: x0 + step * k,
                  top: 18,
                  translate: '-50% 0',
                  fontFamily: PIXEL,
                  fontSize,
                  color: isActive ? C.gold : lit ? 'rgba(233,238,248,0.8)' : 'rgba(200,214,238,0.4)',
                  whiteSpace: 'nowrap',
                  letterSpacing: 1,
                }}
              >
                {n}
              </div>
            </React.Fragment>
          );
        })}
        <div
          style={{
            position: 'absolute',
            left: x0,
            top: 56,
            fontFamily: PIXEL,
            fontSize: snap(fontSize * 0.82),
            color: 'rgba(200,214,238,0.45)',
            letterSpacing: 2,
          }}
        >
          记忆层深 · MEMORY DEPTH
        </div>
      </div>
    );
  }

  const x = layout.W - Math.round(layout.pad * 0.62);
  const y0 = Math.round(layout.H * 0.24);
  const y1 = Math.round(layout.H * 0.76);
  const step = (y1 - y0) / (N - 1);
  const fontSize = snap(layout.W * 0.0125);

  return (
    <div style={{position: 'absolute', left: x - 320, top: y0 - 60, width: 340, height: y1 - y0 + 120}}>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 60,
          width: 1,
          height: y1 - y0,
          background: 'rgba(255,255,255,0.14)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 60,
          width: 1,
          height: Math.max(0, step * dot),
          background: `linear-gradient(180deg, ${C.gold} 0%, rgba(255,214,146,0.15) 100%)`,
          boxShadow: `0 0 10px rgba(255,214,146,0.55)`,
        }}
      />
      {NODES.map((n, k) => {
        const lit = k <= dot + 0.15;
        const isActive = k === active;
        const ny = 60 + step * k;
        return (
          <React.Fragment key={n}>
            <div
              style={{
                position: 'absolute',
                right: isActive ? -4 : -2,
                top: ny - (isActive ? 4 : 2),
                width: isActive ? 9 : 5,
                height: isActive ? 9 : 5,
                borderRadius: '50%',
                background: lit ? (isActive ? C.gold : C.aqua) : 'rgba(255,255,255,0.22)',
                boxShadow: isActive ? `0 0 ${blink ? 16 : 8}px ${C.gold}` : undefined,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 26,
                top: ny - fontSize * 0.78,
                fontFamily: PIXEL,
                fontSize,
                color: isActive ? C.gold : lit ? 'rgba(233,238,248,0.86)' : 'rgba(200,214,238,0.42)',
                letterSpacing: 3,
                textAlign: 'right',
                whiteSpace: 'nowrap',
              }}
            >
              {n}
            </div>
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: 'absolute',
          right: 26,
          top: 18,
          fontFamily: PIXEL,
          fontSize: snap(fontSize * 0.86),
          color: 'rgba(200,214,238,0.45)',
          letterSpacing: 3,
        }}
      >
        MEMORY DEPTH
      </div>
    </div>
  );
};
