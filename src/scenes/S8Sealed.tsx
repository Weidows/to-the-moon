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
          src="img/memory_flood.jpg"
          pixel
          zoom={[1.26, 1.52]}
          focus={[0.5, 0.585]}
          fadeIn={14}
          fadeOut={18}
          saturate={0.6}
          brightness={0.85}
        />
        <Scrim height="64%" />
      </>
    }
  >
    <Flash from={320} peak={338} to={360} max={0.14} />
    <TextBlock>
      <Beat from={16} until={330}>
        <Line text="有一段记忆，被封住了。" at={18} type />
        <Line text="他小时候吃过大量 β 受体阻滞剂——" at={90} color="rgba(233,238,248,0.82)" />
        <Line text="可他从来没有过心脏病。" at={170} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={330}>
        <Line text="那段空白的记忆里，出现了两个约翰。" at={332} />
        <Quote lines={['「他有一个双胞胎兄弟。」', '「乔伊。」']} at={410} gap={40} cps={11} />
      </Beat>
    </TextBlock>
  </SceneShell>
);
