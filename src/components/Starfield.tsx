import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C} from '../theme';

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Star = {
  x: number;
  y: number;
  r: number;
  o: number;
  tw: number;
  drift: number;
  hue: string;
};

const makeStars = (count: number, seed: number, spread = 1): Star[] => {
  const rand = mulberry32(seed);
  return new Array(count).fill(0).map(() => {
    const p = rand();
    return {
      x: rand() * 100,
      y: rand() * 100 * spread,
      r: 0.6 + p * p * 2.6,
      o: 0.18 + rand() * 0.8,
      tw: rand() * Math.PI * 2,
      drift: 0.15 + rand() * 0.85,
      hue: rand() > 0.86 ? C.aqua : rand() > 0.94 ? C.gold : '#ffffff',
    };
  });
};

const STARS = makeStars(190, 7);
const DUST = makeStars(60, 21);

/** Slow parallax starfield shared by every scene, so cuts never feel empty. */
export const Starfield: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;

  return (
    <div style={{position: 'absolute', inset: 0, opacity, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 90% at 50% 8%, ${C.deep} 0%, ${C.night} 45%, ${C.ink} 100%)`,
        }}
      />
      {STARS.map((s, i) => {
        const twinkle =
          0.55 + 0.45 * Math.sin(t * (0.7 + s.drift) + s.tw);
        const y = ((s.y - t * 0.35 * s.drift) % 100 + 100) % 100;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${y}%`,
              width: s.r * 2,
              height: s.r * 2,
              borderRadius: '50%',
              background: s.hue,
              opacity: s.o * twinkle,
              boxShadow: s.r > 1.6 ? `0 0 ${s.r * 3}px rgba(255,255,255,0.55)` : undefined,
            }}
          />
        );
      })}
      {DUST.map((s, i) => {
        const y = ((s.y - t * 1.1 * s.drift) % 100 + 100) % 100;
        return (
          <div
            key={`d${i}`}
            style={{
              position: 'absolute',
              left: `${(s.x + Math.sin(t * 0.4 + s.tw) * 0.6) % 100}%`,
              top: `${y}%`,
              width: s.r,
              height: s.r,
              borderRadius: '50%',
              background: C.aqua,
              opacity: interpolate(s.o, [0, 1], [0.05, 0.5]) * 0.6,
              filter: 'blur(0.4px)',
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: interpolate(t, [0, durationInFrames / fps], [0.16, 0.05], {
            extrapolateRight: 'clamp',
          }),
          background:
            'radial-gradient(60% 40% at 50% 100%, rgba(120,170,255,0.30) 0%, rgba(0,0,0,0) 70%)',
        }}
      />
    </div>
  );
};
