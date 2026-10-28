import React from 'react';
import {useCurrentFrame, interpolate, Easing} from 'remotion';
import {C} from '../theme';

/** The two-tone origami rabbit — the film's signature motif. */
export const Rabbit: React.FC<{
  size?: number;
  color2?: string;
  style?: React.CSSProperties;
  fold?: boolean;
}> = ({size = 160, color2 = '#bda6ea', style, fold = false}) => {
  const frame = useCurrentFrame();
  const f = fold
    ? interpolate(frame, [0, 26], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      })
    : 1;

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 120 150"
      style={{overflow: 'visible', ...style}}
    >
      <g
        stroke="#241f33"
        strokeWidth={1.8}
        strokeLinejoin="round"
        style={{opacity: f}}
      >
        <polygon points="44,64 30,8 56,44" fill={C.paper} />
        <polygon points="72,62 92,12 80,46" fill={C.paper} />
        <polygon points="73,57 88,24 79,47" fill={color2} opacity={0.55} />
        <polygon points="34,60 86,60 60,104" fill={C.paper} />
        <polygon points="60,60 86,60 60,104" fill={color2} />
        <polygon points="46,98 74,98 60,134" fill={C.paper} />
        <polygon points="60,98 74,98 60,134" fill={color2} />
        <line x1="60" y1="60" x2="60" y2="104" stroke="#241f33" strokeOpacity={0.5} />
        <line x1="34" y1="60" x2="60" y2="86" stroke="#241f33" strokeOpacity={0.35} />
        <line x1="86" y1="60" x2="60" y2="86" stroke="#241f33" strokeOpacity={0.35} />
        <line x1="46" y1="98" x2="60" y2="116" stroke="#241f33" strokeOpacity={0.3} />
        <line x1="74" y1="98" x2="60" y2="116" stroke="#241f33" strokeOpacity={0.3} />
      </g>
    </svg>
  );
};

/** A soft moon disc used for the quiet beats and the end card. */
export const MoonDisc: React.FC<{size: number; style?: React.CSSProperties; glow?: boolean}> = ({
  size,
  style,
  glow = true,
}) => {
  const craters = [
    {x: 26, y: 30, r: 7, o: 0.16},
    {x: 62, y: 22, r: 4.5, o: 0.13},
    {x: 70, y: 58, r: 9, o: 0.14},
    {x: 34, y: 66, r: 5, o: 0.12},
    {x: 54, y: 44, r: 3, o: 0.1},
    {x: 20, y: 52, r: 3.6, o: 0.1},
  ];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(38% 34% at 38% 32%, #fffdf2 0%, ${C.moon} 42%, #e6dcc0 72%, #cdc3a4 100%)`,
        boxShadow: glow
          ? `0 0 ${size * 0.5}px rgba(247,240,217,0.35), 0 0 ${size * 1.6}px rgba(160,190,255,0.18)`
          : undefined,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {craters.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.r}%`,
            height: `${c.r}%`,
            borderRadius: '50%',
            background: `rgba(120,116,104,${c.o})`,
            boxShadow: `inset 0 0 ${size * 0.02}px rgba(255,255,255,0.6)`,
          }}
        />
      ))}
    </div>
  );
};

/** Tiny star that pulses — used as a bullet before captions. */
export const Dot: React.FC<{size?: number; color?: string}> = ({size = 10, color = C.gold}) => {
  const frame = useCurrentFrame();
  const o = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame / 9));
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        opacity: o,
        rotate: '45deg',
        boxShadow: `0 0 ${size}px ${color}`,
      }}
    />
  );
};
