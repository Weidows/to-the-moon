import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, PIXEL, snap} from '../theme';
import {useLayout} from '../layout';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Quote, Beat, Appear, TypeText} from '../components/Text';
import {MoonDisc, Rabbit} from '../components/Motifs';
import {Glow} from '../components/FilmOverlay';

const CREDITS = [
  ['原作', 'To the Moon — Freebird Games (2011)'],
  ['音乐', 'For River — Kan Gao'],
  ['剧情参考', '万字诠释神作《去月球》讲了什么'],
  ['声明', '同人致敬作品 · 素材版权归原作者所有'],
];

const EndCard: React.FC = () => {
  const layout = useLayout();
  const frame = useCurrentFrame();
  const moonSize = Math.round(
    Math.min(layout.W, layout.H) * (layout.portrait ? 0.62 : 0.46),
  );
  const moonOpacity = interpolate(frame, [1060, 1180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: layout.portrait ? '40%' : '42%',
          translate: '-50% -50%',
          opacity: moonOpacity * 0.16,
        }}
      >
        <MoonDisc size={moonSize} style={{filter: 'blur(1px)'}} />
      </div>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', translate: '0px -1.5%'}}>
          <Appear at={1100} dur={34} dy={14}>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: layout.heroSize,
                color: C.moon,
                letterSpacing: Math.round(layout.heroSize * 0.14),
                paddingLeft: Math.round(layout.heroSize * 0.14),
                textShadow: `0 0 ${layout.heroSize * 0.45}px rgba(210,230,255,0.28), 0 4px 30px rgba(0,0,0,0.9)`,
              }}
            >
              去月球
            </div>
          </Appear>

          <Appear at={1140} dur={30} style={{marginTop: Math.round(layout.heroSize * 0.12)}}>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: snap(layout.heroSize * 0.19),
                color: '#b9e6ff',
                letterSpacing: Math.round(layout.heroSize * 0.1),
                opacity: 0.9,
              }}
            >
              TO THE MOON
            </div>
          </Appear>

          <Appear at={1270} dur={34} style={{marginTop: Math.round(layout.heroSize * 0.3)}}>
            <div
              style={{
                width: layout.portrait ? layout.W * 0.4 : layout.W * 0.18,
                height: 1,
                margin: '0 auto',
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.42), rgba(255,255,255,0))',
              }}
            />
          </Appear>

          <Appear at={1300} dur={40} style={{marginTop: Math.round(layout.heroSize * 0.26)}}>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: layout.bodySize,
                color: C.text,
                letterSpacing: 2,
                lineHeight: 1.9,
              }}
            >
              爱，其实很简单。
              <br />
              有时候，一句「我喜欢你」，就已经足够。
            </div>
          </Appear>

          <Appear at={1440} dur={30} style={{marginTop: Math.round(layout.bodySize * 0.7)}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Rabbit size={Math.round(layout.bodySize * 1.35)} />
            </div>
          </Appear>

          <div
            style={{
              marginTop: Math.round(layout.bodySize * 0.7),
              opacity: interpolate(frame, [1560, 1620], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {CREDITS.map(([k, v], i) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: Math.round(layout.bodySize * 0.38),
                  fontFamily: PIXEL,
                  fontSize: snap(layout.bodySize * 0.5),
                  color: 'rgba(233,238,248,0.46)',
                  letterSpacing: 1.5,
                  lineHeight: 2,
                  marginBottom: i === 2 ? Math.round(layout.bodySize * 0.25) : 0,
                }}
              >
                <span
                  style={{
                    color: 'rgba(255,214,146,0.55)',
                    minWidth: Math.round(layout.bodySize * 2.6),
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {k}
                </span>
                <span style={{textAlign: 'left'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Finale — the rocket, the moon, and the last line. */
export const MoonScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const layout = useLayout();
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [durationInFrames - 46, durationInFrames - 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneShell
      durationInFrames={durationInFrames}
      layer={null}
      header={false}
      enter={30}
      exit={10}
      art={
        <>
          <Shot
            mode="full"
            src="img/bridge_sunset.jpg"
            to={300}
            zoom={[1.04, 1.16]}
            focus={[0.5, 0.5]}
            fadeIn={16}
            fadeOut={18}
          />
          <Shot
            mode="full"
            src="img/silhouettes_moon.jpg"
            from={280}
            to={900}
            zoom={[1.02, 1.14]}
            focus={[0.42, 0.44]}
          />
          <Shot
            mode="full"
            src="img/deep_space.jpg"
            from={860}
            zoom={[1.0, 1.1]}
            focus={[0.5, 0.5]}
            brightness={0.5}
            saturate={0.9}
          />
          <Scrim height="66%" />
          <Glow x="50%" y="34%" size="52%" color="#bcd6ff" opacity={0.14} />
        </>
      }
    >
      <Flash from={280} peak={300} to={340} max={0.34} />
      <Flash from={860} peak={884} to={930} max={0.3} />

      <TextBlock>
        <Beat from={16} until={300}>
          <Line text="火箭升空。" at={18} type />
          <Line text="心跳，一点一点慢下来。" at={110} color="rgba(233,238,248,0.8)" />
        </Beat>

        <Beat from={300} until={880}>
          <Quote
            lines={['「我会在生命的最后一刻，', '牵起你的手。」']}
            at={330}
            gap={56}
            cps={12}
          />
          <Quote lines={['「一起去往，属于我们的月球。」']} at={520} cps={12} />
        </Beat>

        <Beat from={880} until={1068}>
          <Line text="他记得自己应该去爱，却说不出原因。" at={884} type />
          <Line text="她明白自己的爱，却难以说出口。" at={980} color="rgba(233,238,248,0.82)" />
          <Line text="爱，会自己找到出路。就像生命一样。" at={1060} color={C.gold} />
        </Beat>
      </TextBlock>

      <EndCard />

      <AbsoluteFill style={{background: C.ink, opacity: fadeOut, pointerEvents: 'none'}} />
    </SceneShell>
  );
};
