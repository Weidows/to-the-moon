import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {useLayout} from '../layout';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock, Bridge} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Quote, Beat} from '../components/Text';
import {Rabbit} from '../components/Motifs';

const FloatingRabbit: React.FC = () => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const drift = Math.sin(frame / 40) * 14;
  const size = Math.round(layout.H * 0.19);
  return (
    <div
      style={{
        position: 'absolute',
        right: layout.portrait ? '9%' : '16%',
        top: layout.portrait ? layout.art.y + size * 0.18 : layout.H * 0.16,
        opacity: 0.9,
        rotate: `${-6 + drift * 0.12}deg`,
        translate: `0px ${drift}px`,
        filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.55))',
      }}
    >
      <Rabbit size={size} />
    </div>
  );
};

/**
 * LAYER 03 — the rabbit.
 * He gets the name right and misses what it stands for. That gap is the clue,
 * so the only way forward is further down.
 */
export const RabbitScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const rabbitOpacity = interpolate(frame, [40, 90, 300, 340], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneShell
      durationInFrames={durationInFrames}
      layer={LAYERS[3]}
      art={
        <>
          <Shot
            src="img/river.png"
            to={340}
            zoom={[1.02, 1.1]}
            focus={[0.5, 0.42]}
            fadeIn={14}
            fadeOut={18}
            brightness={0.96}
          />
          <Shot src="img/river_reading.jpg" from={320} to={660} zoom={[1.02, 1.12]} focus={[0.5, 0.45]} />
          <Shot src="img/gen_piano.jpg" from={640} zoom={[1.04, 1.14]} focus={[0.5, 0.52]} brightness={1.0} />
          <Scrim height="56%" />
        </>
      }
    >
      <Flash from={320} peak={338} to={372} max={0.16} />

      <div style={{position: 'absolute', inset: 0, opacity: rabbitOpacity}}>
        <FloatingRabbit />
      </div>

      <TextBlock>
        <Beat from={18} until={320}>
          <Line text="成百上千只纸兔子，堆满了整个灯塔" at={20} type />
          <Line text="每一只，都是她在等他想起来" at={250} color="rgba(233,238,248,0.86)" />
        </Beat>

        <Beat from={320} until={660}>
          <Line text="她有孤独症，心意说不出口，只能折进纸里" at={322} color={C.mist} />
          <Quote lines={['「这是什么？」']} at={392} cps={12} />
          <Line text="「这是一只兔子」" at={470} color={C.moon} />
        </Beat>

        <Beat from={660}>
          <Line text="名字他答对了，含义，他答不上来" at={662} />
          <Line text="她问了一遍又一遍，他一次也没答对" at={730} color="rgba(233,238,248,0.8)" />
          <Bridge text="要答对，得回到他们刚认识那年" at={810} />
        </Beat>
      </TextBlock>
    </SceneShell>
  );
};
