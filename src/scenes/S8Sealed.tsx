import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Beat} from '../components/Text';

/**
 * LAYER 06 — the fog.
 * Why the promise never surfaced: a brother died, a mother medicated him, and
 * the whole summer went with it.
 */
export const SealedScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <SceneShell
    durationInFrames={durationInFrames}
    layer={LAYERS[6]}
    art={
      <>
        <Shot
          src="img/gen_void.jpg"
          to={352}
          zoom={[1.06, 1.2]}
          focus={[0.5, 0.5]}
          fadeIn={14}
          fadeOut={16}
          saturate={0.8}
          brightness={0.95}
        />
        <Shot src="img/gen_twins.jpg" from={332} zoom={[1.02, 1.14]} focus={[0.5, 0.5]} />
        <Scrim height="58%" />
      </>
    }
  >
    <Flash from={320} peak={338} to={360} max={0.14} />
    <TextBlock>
      <Beat from={16} until={330}>
        <Line text="John 童年的记忆像被雾堵住" at={18} type />
        <Line text="两位博士花了很久才挤进去" at={112} color="rgba(233,238,248,0.82)" />
        <Line text="雾里，是两个一模一样的孩子" at={228} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={330}>
        <Line text="John 有一个双胞胎兄弟" at={332} />
        <Line text="那个夏天，兄弟死了" at={402} color="rgba(233,238,248,0.86)" />
        <Line text="母亲受不了他再痛一次，给他服了阻滞剂" at={470} color="rgba(233,238,248,0.82)" />
        <Line text="连月亮，也一起忘了" at={540} color={C.moon} />
      </Beat>
    </TextBlock>
  </SceneShell>
);
