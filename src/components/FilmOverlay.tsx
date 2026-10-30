import React from 'react';
import {C} from '../theme';

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.55'/></svg>\")";

/**
 * Film texture: grain, scanlines, vignette, colour grade.
 *
 * The grain is deliberately static now. Nudging the noise tile on every frame
 * made every pixel change on every frame: that reads as vibration during
 * playback and it eats all the bitrate, which is what made the earlier renders
 * look stuttery. Slow camera moves + a static grain compress cleanly.
 */
export const FilmOverlay: React.FC<{
  grain?: number;
  scanlines?: number;
  vignette?: number;
  tint?: string;
}> = ({grain = 0.075, scanlines = 0.026, vignette = 0.72, tint = 'rgba(8,16,38,0.28)'}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', inset: 0, background: tint, mixBlendMode: 'multiply'}} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(75% 65% at 50% 45%, rgba(0,0,0,0) 30%, rgba(2,4,10,${vignette}) 100%)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: NOISE,
        opacity: grain,
        mixBlendMode: 'overlay',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: scanlines,
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.7) 0px, rgba(0,0,0,0.7) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 4px)`,
      }}
    />
  </div>
);

/** Warm pool of light in a corner, used to lift hero scenes. */
export const Glow: React.FC<{
  x?: string;
  y?: string;
  size?: string;
  color?: string;
  opacity?: number;
}> = ({x = '50%', y = '30%', size = '60%', color = C.gold, opacity = 0.16}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(${size} ${size} at ${x} ${y}, ${color} 0%, rgba(0,0,0,0) 65%)`,
      opacity,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
    }}
  />
);
