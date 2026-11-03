import React from 'react';
import {AbsoluteFill, interpolate, Easing, useCurrentFrame} from 'remotion';
import {C, HALO, PIXEL, snap} from '../theme';
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

/**
 * Chapter body.
 * The old version opened every layer out of a black circle, which cut the film
 * into ten islands. Now the incoming art rises into place while the outgoing
 * art lifts away, and the shared starfield shows between them, so changing a
 * layer reads as one continuous descent instead of a cut to black.
 */
export const SceneShell: React.FC<{
  durationInFrames: number;
  layer: LayerTag | null;
  art: React.ReactNode;
  children?: React.ReactNode;
  enter?: number;
  exit?: number;
  header?: boolean;
  headerAt?: number;
}> = ({durationInFrames, layer, art, children, enter = 16, exit = 14, header = true, headerAt = 10}) => {
  const frame = useCurrentFrame();

  const p = interpolate(frame, [0, enter], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const exitP = interpolate(frame, [durationInFrames - exit, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  // Narration clears out a beat before the art does, so the incoming chapter
  // never has to share the screen with the outgoing chapter's last line.
  const textOut = interpolate(frame, [durationInFrames - exit - 10, durationInFrames - 5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(p, [0, 1], [2.6, 0]) + interpolate(exitP, [0, 1], [0, -3.4]);
  const blur = interpolate(p, [0, 1], [5, 0]) + interpolate(exitP, [0, 1], [0, 4]);
  const scale = 1 + (1 - p) * 0.045 + exitP * 0.05;

  return (
    <AbsoluteFill style={{opacity: interpolate(p, [0, 1], [0.55, 1]) * (1 - exitP)}}>
      <AbsoluteFill style={{translate: `0px ${y}%`, filter: `blur(${blur}px)`, scale: String(scale)}}>
        {art}
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: textOut}}>
        {header && layer ? <ChapterHeader layer={layer} at={headerAt} /> : null}
        {children}
      </AbsoluteFill>
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
        // 描边光晕：黑边不铺满下半屏也能在亮画面上读清
        textShadow: HALO,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * The hand-off line that closes a layer by naming the next question.
 * Every chapter ends on one, so the film advances by cause instead of by cut.
 */
export const Bridge: React.FC<{text: string; at: number}> = ({text, at}) => {
  const layout = useLayout();
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  return (
    <div
      style={{
        opacity: p,
        translate: `0px ${interpolate(p, [0, 1], [10, 0])}px`,
        marginTop: layout.bodySize * 0.85,
        borderLeft: '2px solid rgba(255,214,146,0.42)',
        paddingLeft: Math.round(layout.bodySize * 0.52),
      }}
    >
      <div
        style={{
          fontFamily: PIXEL,
          fontSize: snap(layout.bodySize * 0.68),
          color: 'rgba(255,214,146,0.74)',
          letterSpacing: 2,
          lineHeight: 1.7,
        }}
      >
        {text}
      </div>
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
