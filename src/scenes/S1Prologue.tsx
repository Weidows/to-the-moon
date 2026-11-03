import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, PIXEL, snap} from '../theme';
import {useLayout} from '../layout';
import {LAYERS} from '../timeline';
import {SceneShell} from '../components/SceneShell';
import {Shot, Scrim} from '../components/Shot';
import {Appear, Eyebrow, TypeText} from '../components/Text';
import {Glow} from '../components/FilmOverlay';

/** Title. Pulls back from the moon until the lighthouse is revealed. */
export const PrologueScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const layout = useLayout();
  const frame = useCurrentFrame();
  const titleOut = interpolate(frame, [300, 340], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneShell
      durationInFrames={durationInFrames}
      layer={LAYERS[0]}
      header={false}
      enter={30}
      art={
        <>
          <Shot
            mode="full"
            src="img/title_lighthouse.png"
            zoom={[1.5, 1.02]}
            focus={[0.5, 0.28]}
            pan={[
              [0, -7],
              [0, 0],
            ]}
            fadeIn={26}
            fadeOut={18}
          />
          <Scrim height="60%" />
        </>
      }
    >
      <Glow x="52%" y="26%" size="44%" color="#cfe0ff" opacity={0.2} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: layout.portrait ? layout.H * 0.06 : 0,
          opacity: titleOut,
        }}
      >
        <Appear at={54} dur={20}>
          <Eyebrow style={{textAlign: 'center', letterSpacing: Math.round(layout.eyebrowSize * 0.5)}}>
            FREEBIRD GAMES · 2011
          </Eyebrow>
        </Appear>

        <Appear at={78} dur={26} dy={22} style={{marginTop: layout.heroSize * 0.16}}>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: layout.heroSize,
              color: C.moon,
              letterSpacing: Math.round(layout.heroSize * 0.14),
              textShadow: `0 0 ${layout.heroSize * 0.5}px rgba(210,230,255,0.35), 0 0 ${
                layout.heroSize * 0.12
              }px rgba(255,255,255,0.55)`,
              paddingLeft: Math.round(layout.heroSize * 0.14),
            }}
          >
            去月球
          </div>
        </Appear>

        <Appear at={116} dur={24} style={{marginTop: layout.heroSize * 0.18}}>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: snap(layout.heroSize * 0.2),
              color: '#b9e6ff',
              letterSpacing: Math.round(layout.heroSize * 0.11),
              opacity: 0.9,
            }}
          >
            TO THE MOON
          </div>
        </Appear>

        <div
          style={{
            width: layout.portrait ? '46%' : '22%',
            height: 1,
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))',
            marginTop: layout.heroSize * 0.2,
          }}
        />

        <Appear at={150} dur={26} style={{marginTop: layout.heroSize * 0.16}}>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: snap(layout.bodySize * 0.82),
              color: 'rgba(233,238,248,0.72)',
              letterSpacing: 3,
              textAlign: 'center',
              lineHeight: 1.9,
            }}
          >
            一个关于记忆、遗忘与约定的故事
          </div>
        </Appear>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1 - titleOut,
        }}
      >
        <div style={{textAlign: 'center', maxWidth: layout.textWidth * 0.92}}>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: snap(layout.quoteSize * 1.18),
              color: C.moon,
              lineHeight: 1.9,
              letterSpacing: 2,
              textShadow: '0 4px 30px rgba(0,0,0,0.9)',
            }}
          >
            <TypeText text="「去月球
John 想去月球」" at={330} cps={9} />
          </div>
          <Appear at={408} dur={22} style={{marginTop: layout.bodySize * 0.9}}>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: snap(layout.bodySize * 0.72),
                color: 'rgba(233,238,248,0.5)',
                letterSpacing: 4,
              }}
            >
              —— 一个临终者最后的愿望
            </div>
          </Appear>
        </div>
      </AbsoluteFill>

    </SceneShell>
  );
};
