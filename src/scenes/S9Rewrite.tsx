import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Beat} from '../components/Text';

/**
 * LAYER 07 — the choice.
 * Now that the cause is known, so is the price: to grant the wish, River has to
 * go. The two doctors fight, and the answer is not deletion but absence.
 */
export const ChoiceScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <SceneShell
    durationInFrames={durationInFrames}
    layer={LAYERS[7]}
    art={
      <>
        <Shot
          src="img/gen_clash.jpg"
          to={600}
          zoom={[1.14, 1.02]}
          focus={[0.5, 0.5]}
          fadeIn={14}
          fadeOut={18}
          brightness={0.98}
        />
        <Shot src="img/gen_miss.jpg" from={570} zoom={[1.02, 1.16]} focus={[0.5, 0.52]} />
        <Scrim height="56%" />
      </>
    }
  >
    <Flash from={560} peak={580} to={620} max={0.22} />

    <TextBlock>
      <Beat from={16} until={260}>
        <Line text="现在两位博士知道了原因，" at={18} type />
        <Line text="也知道了这件事有多残忍" at={122} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={260} until={560}>
        <Line text="要让 John 去月球，
就得把 River 从他的人生里删掉" at={262} />
        <Line text="一个说，委托就是委托" at={420} color="rgba(233,238,248,0.84)" />
        <Line text="一个说，那是他最爱的人" at={480} color="rgba(233,238,248,0.84)" />
      </Beat>

      <Beat from={560} until={640}>
        <Line text="删掉她，就等于他从未爱过" at={562} color="rgba(233,238,248,0.72)" />
      </Beat>

      <Beat from={640}>
        <Line text="最后，女博士做了另一个选择" at={642} />
        <Line text="她没有删掉 River" at={700} color={C.gold} />
        <Line text="她只是让小时候的他们，错过了彼此" at={756} color="rgba(233,238,248,0.86)" />
      </Beat>
    </TextBlock>
  </SceneShell>
);
