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
 * The wrong name is the clue: what he calls it belongs to a memory that was
 * taken away, so the only way forward is further down.
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
          <Scrim height="60%" />
        </>
      }
    >
      <Flash from={320} peak={338} to={372} max={0.16} />

      <div style={{position: 'absolute', inset: 0, opacity: rabbitOpacity}}>
        <FloatingRabbit />
      </div>

      <TextBlock>
        <Beat from={18} until={320}>
          <Line text="她折过成百上千只兔子。" at={20} type />
          <Line text="桌上、窗台、灯塔顶上，全是兔子。" at={110} color="rgba(233,238,248,0.8)" />
        </Beat>

        <Beat from={320} until={660}>
          <Line text="最后那天，她举着一只，问他：" at={322} color={C.mist} />
          <Quote lines={['「这是什么？」']} at={392} cps={12} />
          <Line text="「这是一只兔子。」" at={470} color={C.moon} />
          <Line text="可那不是兔子。" at={556} color={C.mist} />
        </Beat>

        <Beat from={660}>
          <Line text="说错的名字，指向一段被盖住的记忆。" at={662} />
          <Bridge text="他们决定再往下走一层。" at={790} />
        </Beat>
      </TextBlock>
    </SceneShell>
  );
};
