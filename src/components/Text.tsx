import React from 'react';
import {interpolate, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, PIXEL} from '../theme';
import {useLayout} from '../layout';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Fade + rise. `at` is local frames. */
export const Appear: React.FC<{
  at: number;
  dur?: number;
  dy?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, dur = 16, dy = 16, children, style}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const translate = interpolate(frame, [at, at + dur], [`0px ${dy}px`, '0px 0px'], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return <div style={{opacity, translate, ...style}}>{children}</div>;
};

/** Character-by-character reveal — reads as handwriting on a memory card. */
export const TypeText: React.FC<{
  text: string;
  at: number;
  cps?: number;
  cursor?: boolean;
  style?: React.CSSProperties;
}> = ({text, at, cps = 13, cursor = false, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chars = Math.max(0, Math.floor(((frame - at) / fps) * cps));
  const shown = text.slice(0, chars);
  const typing = cursor && chars < text.length && frame >= at;
  const blink = Math.floor(frame / 8) % 2 === 0;

  return (
    <div style={{whiteSpace: 'pre-wrap', ...style}}>
      {shown}
      {typing ? <span style={{opacity: blink ? 0.9 : 0}}>▍</span> : null}
    </div>
  );
};

export const Body: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => (
  <div style={{fontFamily: PIXEL, color: C.text, lineHeight: 1.62, ...style}}>{children}</div>
);

/** A narration beat: one line, optional typewriter, optional emphasis. */
export const Line: React.FC<{
  text: string;
  at: number;
  size?: number;
  color?: string;
  type?: boolean;
  cps?: number;
  weight?: string;
  style?: React.CSSProperties;
}> = ({text, at, size, color = C.text, type = false, cps = 14, weight, style}) => {
  const layout = useLayout();
  const s = size ?? layout.bodySize;
  return (
    <Appear at={at} style={{marginBottom: Math.round(s * 0.5), ...style}}>
      <div
        style={{
          fontFamily: PIXEL,
          fontSize: s,
          color,
          lineHeight: 1.6,
          letterSpacing: 0.5,
          fontWeight: weight ?? 400,
          whiteSpace: 'pre-wrap',
        }}
      >
        {type ? <TypeText text={text} at={at} cps={cps} cursor /> : text}
      </div>
    </Appear>
  );
};

/** Quoted monologue: vertical rule, staggered lines, typewriter. */
export const Quote: React.FC<{
  lines: string[];
  at: number;
  gap?: number;
  cps?: number;
  size?: number;
  color?: string;
}> = ({lines, at, gap = 14, cps = 15, size, color = C.moon}) => {
  const layout = useLayout();
  const s = size ?? layout.quoteSize;
  const frame = useCurrentFrame();
  const ruleHeight = interpolate(frame, [at, at + 26], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  return (
    <div style={{display: 'flex', gap: Math.round(s * 0.55)}}>
      <div
        style={{
          width: 3,
          background: `linear-gradient(180deg, ${C.aqua} 0%, rgba(142,215,255,0.05) 100%)`,
          height: `${ruleHeight}%`,
          alignSelf: 'stretch',
          boxShadow: `0 0 14px rgba(142,215,255,0.45)`,
        }}
      />
      <div>
        {lines.map((l, i) => (
          <Appear key={i} at={at + i * gap} dur={12} dy={10}>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: s,
                color,
                lineHeight: 1.7,
                letterSpacing: 0.5,
                textShadow: '0 2px 18px rgba(0,0,0,0.85)',
              }}
            >
              <TypeText text={l} at={at + i * gap + 4} cps={cps} />
            </div>
          </Appear>
        ))}
      </div>
    </div>
  );
};

/** A beat of narration that occupies the block, then hands it to the next. */
export const Beat: React.FC<{
  from: number;
  until?: number;
  fade?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({from, until = 100000, fade = 12, children, style}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [from, from + fade, until - fade, until], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const translate = interpolate(frame, [from, from + fade], ['0px 18px', '0px 0px'], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: '100%', opacity, translate, ...style}}>
      {children}
    </div>
  );
};

export const Eyebrow: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, color = 'rgba(233,238,248,0.62)', style}) => {
  const layout = useLayout();
  return (
    <div
      style={{
        fontFamily: PIXEL,
        fontSize: layout.eyebrowSize,
        color,
        letterSpacing: Math.round(layout.eyebrowSize * 0.22),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
