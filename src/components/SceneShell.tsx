import React from 'react';
import {AbsoluteFill, interpolate, Easing, useCurrentFrame} from 'remotion';
import {C, snap} from '../theme';
import {useLayout} from '../layout';
import {Eyebrow} from './Text';
import type {LayerTag} from '../timeline';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const ChapterHeader: React.FC<{layer: LayerTag; at?: number}> = ({layer, at = 10}) => {
  const layout = useLayout();
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: layout.pad,
        top: layout.headerTop,
        opacity: p,
        translate: `0px ${interpolate(p, [0, 1], [14, 0])}px`,
        textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.7)',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: Math.round(layout.eyebrowSize * 0.55)}}>
        <div
          style={{
            width: Math.round(layout.eyebrowSize * 0.44),
            height: Math.round(layout.eyebrowSize * 0.44),
            background: C.gold,
            rotate: '45deg',
            boxShadow: `0 0 16px rgba(255,214,146,0.6)`,
          }}
        />
        <Eyebrow color={C.gold}>{layer.code}</Eyebrow>
        <div style={{width: Math.round(layout.eyebrowSize * 2.2), height: 1, background: 'rgba(255,255,255,0.22)'}} />
        <Eyebrow color="rgba(233,238,248,0.55)">{layer.world}</Eyebrow>
      </div>
      <div
        style={{
          fontFamily: 'Zpix, monospace',
          fontSize: layout.chapterSize,
          color: '#fdf7e6',
          letterSpacing: 4,
          marginTop: Math.round(layout.chapterSize * 0.28),
          textShadow: '0 4px 26px rgba(0,0,0,0.8)',
        }}
      >
        {layer.name}
      </div>
    </div>
  );
};

export const SceneShell: React.FC<{
  durationInFrames: number;
  layer: LayerTag | null;
  art: React.ReactNode;
  children?: React.ReactNode;
  enter?: number;
  exit?: number;
  header?: boolean;
  headerAt?: number;
}> = ({durationInFrames, layer, art, children, enter = 18, exit = 16, header = true, headerAt = 10}) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, enter], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const exitP = interpolate(frame, [durationInFrames - exit, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  // The camera keeps falling: incoming art settles from a zoom, outgoing art
  // rushes past the lens while the next iris opens.
  const artScale = (1 + (1 - p) * 0.16) * (1 + exitP * 0.3);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exitP,
        clipPath: `circle(${p * 152}% at 50% 50%)`,
      }}
    >
      <AbsoluteFill style={{scale: String(artScale)}}>{art}</AbsoluteFill>
      {header && layer ? <ChapterHeader layer={layer} at={headerAt} /> : null}
      {children}
    </AbsoluteFill>
  );
};

/** The narration column. Landscape: bottom-left. Portrait: under the art card. */
export const TextBlock: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
  children,
  style,
}) => {
  const layout = useLayout();
  return (
    <div
      style={{
        position: 'absolute',
        left: layout.pad,
        top: layout.textTop,
        width: layout.textWidth,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Small persistent credit line. */
export const Footer: React.FC<{right?: string}> = ({right = 'FOR RIVER ♪'}) => {
  const layout = useLayout();
  return (
    <div
      style={{
        position: 'absolute',
        left: layout.pad,
        bottom: layout.portrait ? layout.pad * 4.1 : layout.pad * 0.62,
        right: layout.pad,
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'Zpix, monospace',
        fontSize: layout.smallSize,
        color: 'rgba(233,238,248,0.42)',
        letterSpacing: 3,
      }}
    >
      <span>TO THE MOON · 去月球</span>
      <span style={{color: 'rgba(255,214,146,0.45)'}}>{right}</span>
    </div>
  );
};
