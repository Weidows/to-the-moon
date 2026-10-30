import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Beat} from '../components/Text';

/**
 * LAYER 07 — the choice.
 * The wish is a childhood promise. To grant it they must take River out of his
 * life. The two doctors fight, and Eve finds the third way: not deletion, but
 * letting the two children walk past each other.
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
        <Scrim height="62%" />
      </>
    }
  >
    <Flash from={560} peak={580} to={620} max={0.26} />

    <TextBlock>
      <Beat from={16} until={300}>
        <Line text="去月球的愿望，来自一个约定。" at={18} type />
        <Line text="药抹掉了它，它却长成了执念。" at={112} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={300} until={560}>
        <Line text="要满足这个愿望，就得拿掉 River。" at={302} />
        <Line text="两个博士在记忆深处，吵了起来。" at={392} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={560}>
        <Line text="最后，是伊娃做了决定。" at={562} />
        <Line text="她没有删掉 River。" at={644} color={C.gold} />
        <Line text="她只是让小时候的他们，错过了彼此。" at={706} color="rgba(233,238,248,0.86)" />
      </Beat>
    </TextBlock>
  </SceneShell>
);
