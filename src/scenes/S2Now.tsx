import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock, Bridge} from '../components/SceneShell';
import {Shot, Scrim} from '../components/Shot';
import {Line, Quote, Beat} from '../components/Text';

/**
 * LAYER 00 — the commission.
 * Establishes the rule of the technology and the one thing nobody can answer:
 * why the moon.
 */
export const NowScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <SceneShell
    durationInFrames={durationInFrames}
    layer={LAYERS[0]}
    art={
      <>
        <Shot
          src="img/gen_hospital.jpg"
          to={330}
          zoom={[1.16, 1.02]}
          focus={[0.5, 0.52]}
          fadeIn={10}
          fadeOut={20}
        />
        <Shot src="img/last_request.jpg" from={300} to={650} zoom={[1.02, 1.12]} focus={[0.5, 0.45]} />
        <Shot src="img/machine.jpg" from={620} zoom={[1.02, 1.12]} focus={[0.52, 0.45]} />
        <Scrim height="64%" />
      </>
    }
  >
    <TextBlock>
      <Beat from={16} until={250}>
        <Line text="有一家机构，专门帮人改写记忆。" at={18} type />
        <Line text="但这项技术，只能用在临终的人身上。" at={112} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={250} until={560}>
        <Line text="他们接到的委托是——" at={252} />
        <Line text="让 John 去一次月球。" at={312} color={C.gold} />
        <Line text="可问他为什么，他说不上来。" at={430} color="rgba(233,238,248,0.8)" />
      </Beat>

      <Beat from={560} until={760}>
        <Quote lines={['「去月球。」']} at={562} cps={11} />
        <Line text="那是他唯一说得出的愿望。" at={650} color={C.mist} />
      </Beat>

      <Beat from={760}>
        <Bridge text="要弄明白，只能进他的记忆里看。" at={764} />
      </Beat>
    </TextBlock>
  </SceneShell>
);
