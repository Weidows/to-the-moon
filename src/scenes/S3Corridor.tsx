import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock, Bridge} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Beat} from '../components/Text';

/**
 * LAYER 01 — the attempt.
 * They try the obvious fix, it fails three times, and every failure points at
 * the same person. That failure is what makes the descent necessary.
 */
export const CorridorScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <SceneShell
    durationInFrames={durationInFrames}
    layer={LAYERS[1]}
    art={
      <>
        <Shot
          src="img/gen_memento.jpg"
          to={300}
          zoom={[1.16, 1.02]}
          focus={[0.5, 0.5]}
          fadeIn={10}
          fadeOut={18}
        />
        <Shot src="img/memory_tunnel.jpg" from={280} to={640} zoom={[1.06, 1.16]} focus={[0.5, 0.5]} />
        <Shot src="img/timeline_cliff.jpg" from={610} pixel zoom={[1.24, 1.1]} focus={[0.5, 0.575]} />
        <Scrim height="64%" />
      </>
    }
  >
    <Flash from={280} peak={300} to={336} max={0.2} />
    <Flash from={610} peak={628} to={664} max={0.16} />

    <TextBlock>
      <Beat from={20} until={300}>
        <Line text="两位博士先试了最直接的办法：把愿望写进去，" at={22} type />
        <Line text="让年轻的 John 想要去月球。" at={122} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={300} until={620}>
        <Line text="试了三次，三次都被推回原地。" at={302} />
        <Line text="每次画面里，都有同一个女人。" at={480} color={C.aqua} />
      </Beat>

      <Beat from={620}>
        <Line text="她叫 River。" at={622} color={C.gold} />
        <Line text="John 的妻子，已经去世。" at={694} color="rgba(233,238,248,0.82)" />
        <Bridge text="John 的愿望，长在她身上。" at={770} />
      </Beat>
    </TextBlock>
  </SceneShell>
);
