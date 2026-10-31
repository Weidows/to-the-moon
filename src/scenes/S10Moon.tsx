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
  ['剧情', '据《去月球》主线剧情整理'],
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
              他忘了约定。
              <br />
              约定没有忘了他。
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

/**
 * Finale — the rewritten life, the reunion, the ship.
 * This is the payoff of every earlier question: the wish came from a promise,
 * the promise came from the summer, and the summer was taken away.
 */
export const MoonScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
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
      enter={24}
      exit={10}
      art={
        <>
          <Shot
            src="img/rocket_pastel.jpg"
            to={280}
            zoom={[1.05, 1.16]}
            focus={[0.5, 0.55]}
            fadeIn={14}
            fadeOut={16}
            brightness={1.05}
          />
          <Shot src="img/gen_nasa.jpg" from={260} to={500} zoom={[1.03, 1.12]} focus={[0.5, 0.5]} />
          <Shot src="img/gen_cabin.jpg" from={480} to={830} zoom={[1.03, 1.13]} focus={[0.5, 0.5]} />
          <Shot src="img/launching.jpg" from={806} to={1000} zoom={[1.02, 1.14]} focus={[0.5, 0.5]} />
          <Shot
            mode="full"
            src="img/silhouettes_moon.jpg"
            from={986}
            to={1160}
            zoom={[1.02, 1.1]}
            focus={[0.44, 0.44]}
          />
          <Shot
            mode="full"
            src="img/deep_space.jpg"
            from={1120}
            zoom={[1.0, 1.08]}
            focus={[0.5, 0.5]}
            brightness={0.44}
            saturate={0.9}
          />
          <Scrim height="66%" />
          <Glow x="50%" y="34%" size="52%" color="#bcd6ff" opacity={0.14} />
        </>
      }
    >
      <Flash from={258} peak={276} to={316} max={0.26} />
      <Flash from={804} peak={822} to={860} max={0.22} />
      <Flash from={1118} peak={1136} to={1180} max={0.2} />

      <TextBlock>
        <Beat from={16} until={250}>
          <Line text="记忆重新长了一遍。" at={18} type />
          <Line text="John 考进了航天中心。" at={106} color="rgba(233,238,248,0.82)" />
        </Beat>

        <Beat from={250} until={700}>
          <Line text="在那里，John 遇见了一个女人。" at={252} />
          <Quote lines={['「我们是不是见过？」']} at={356} cps={12} />
          <Line text="这一次，他们没有走散。" at={500} color={C.gold} />
        </Beat>

        <Beat from={700} until={890}>
          <Line text="他们并排坐在飞船上。" at={702} />
          <Line text="火箭升空。" at={800} color="rgba(233,238,248,0.82)" />
        </Beat>

        <Beat from={890} until={1090}>
          <Line text="月球越来越近。" at={892} type />
          <Line text="John 的心跳，一点一点停下来。" at={982} color={C.moon} />
        </Beat>
      </TextBlock>

      <EndCard />

      <AbsoluteFill style={{background: C.ink, opacity: fadeOut, pointerEvents: 'none'}} />
    </SceneShell>
  );
};
