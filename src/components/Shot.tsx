import React from 'react';
import {Img, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {useLayout} from '../layout';
import {C} from '../theme';

export type ShotProps = {
  src: string;
  /** local frames, start inclusive / end exclusive */
  from?: number;
  to?: number;
  fadeIn?: number;
  fadeOut?: number;
  focus?: [number, number];
  /** scale from -> to across the shot (Ken Burns) */
  zoom?: [number, number];
  /** translate from -> to, in % of the element's own size */
  pan?: [[number, number], [number, number]];
  /** pixel-art sources stay crisp when scaled */
  pixel?: boolean;
  /** 'auto' = full-bleed on 16:9, framed still on 9:16 */
  mode?: 'auto' | 'full' | 'frame' | 'contain';
  brightness?: number;
  saturate?: number;
  blur?: number;
  border?: boolean;
};

export const Shot: React.FC<ShotProps> = ({
  src,
  from = 0,
  to,
  fadeIn = 14,
  fadeOut = 14,
  focus = [0.5, 0.5],
  zoom = [1.02, 1.1],
  pan,
  pixel = false,
  mode = 'auto',
  brightness = 1,
  saturate = 1,
  blur = 0,
  border = false,
}) => {
  const frame = useCurrentFrame();
  const layout = useLayout();

  const hasEnd = typeof to === 'number' && Number.isFinite(to);
  if (frame < from || (hasEnd && frame >= (to as number))) return null;

  const end = hasEnd ? (to as number) : null;
  const span = Math.max(1, (end ?? from + 150) - from);
  const fadeOutF = end === null ? 0 : Math.min(fadeOut, Math.floor(span / 3));
  const fadeInF = Math.min(fadeIn, Math.floor(span / 3));

  const opacity =
    end === null
      ? interpolate(frame, [from, from + fadeInF], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : interpolate(frame, [from, from + fadeInF, end - fadeOutF, end], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.ease),
        });

  const progress = interpolate(frame - from, [0, span], [0, 1], {extrapolateRight: 'clamp'});
  const scale = String(zoom[0] + (zoom[1] - zoom[0]) * progress);
  const translate = pan
    ? `${(pan[0][0] + (pan[1][0] - pan[0][0]) * progress).toFixed(2)}% ${(
        pan[0][1] +
        (pan[1][1] - pan[0][1]) * progress
      ).toFixed(2)}%`
    : '0% 0%';

  const resolved = mode === 'auto' ? (layout.portrait ? 'frame' : 'full') : mode;

  const box =
    resolved === 'full'
      ? {left: 0, top: 0, width: '100%', height: '100%'}
      : {left: layout.art.x, top: layout.art.y, width: layout.art.w, height: layout.art.h};

  return (
    <div
      style={{
        position: 'absolute',
        ...box,
        overflow: 'hidden',
        opacity,
        border: border ? `1px solid rgba(142,215,255,0.20)` : undefined,
        boxShadow: border
          ? `0 0 70px rgba(6,12,26,0.9), inset 0 0 70px rgba(4,8,18,0.6)`
          : undefined,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: resolved === 'contain' ? 'contain' : 'cover',
          objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          imageRendering: pixel ? 'pixelated' : undefined,
          scale,
          translate,
          filter: `brightness(${brightness}) saturate(${saturate})${blur ? ` blur(${blur}px)` : ''}`,
        }}
      />
      {resolved !== 'full' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(4,6,13,0.28) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 68%, rgba(4,6,13,0.6) 100%)',
          }}
        />
      ) : null}
    </div>
  );
};

/** Light flash used when diving between memory layers. */
export const Flash: React.FC<{
  color?: string;
  from?: number;
  peak?: number;
  to?: number;
  max?: number;
}> = ({color = '#dceaff', from = 0, peak, to, max = 0.6}) => {
  const frame = useCurrentFrame();
  const mid = peak ?? from;
  const end = to ?? from + 12;
  const opacity = interpolate(frame, [from, mid, end], [0, max, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color,
        opacity,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

/** Bottom scrim so text always sits on a readable base. */
export const Scrim: React.FC<{height?: string; color?: string}> = ({
  height = '62%',
  color = C.ink,
}) => {
  const layout = useLayout();
  const h = layout.portrait ? '44%' : height;
  return (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: h,
      background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${color}b0 38%, ${color}e8 60%, ${color} 88%)`,
      pointerEvents: 'none',
    }}
  />
  );
};
