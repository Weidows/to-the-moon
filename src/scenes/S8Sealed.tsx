import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Quote, Beat} from '../components/Text';

/** LAYER 06 — the sealed memory, and the twin. */
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
        <Scrim height="64%" />
      </>
    }
  >
    <Flash from={320} peak={338} to={360} max={0.14} />
    <TextBlock>
      <Beat from={16} until={330}>
        <Line text="童年的记忆，像被雾堵住了。" at={18} type />
        <Line text="他们挤了很久，才看清里面——" at={110} color="rgba(233,238,248,0.82)" />
        <Line text="两个一模一样的孩子。" at={232} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={330}>
        <Quote lines={['「他有一个双胞胎兄弟。」', '「乔伊。」']} at={332} gap={40} cps={11} />
        <Line text="乔伊在童年时意外死了。" at={430} />
        <Line text="母亲受不了，给约翰喂了记忆阻滞剂。" at={498} color="rgba(233,238,248,0.82)" />
        <Line text="于是他把月亮，也一起忘了。" at={566} color={C.moon} />
      </Beat>
    </TextBlock>
  </SceneShell>
);
