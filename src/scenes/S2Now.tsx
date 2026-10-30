import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim} from '../components/Shot';
import {Line, Quote, Beat} from '../components/Text';

/** LAYER 00 — the present: a commission, a coma, a wish. */
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
        <Line text="人生构建机构，接到了一份委托。" at={18} type />
        <Line
          text="他们不实现愿望，只把愿望写进记忆。"
          at={96}
          color="rgba(233,238,248,0.82)"
        />
      </Beat>

      <Beat from={248} until={470}>
        <Line text="所以，这份工作只能交给临终的人。" at={250} />
        <Line
          text="房间在海边。一台机器，一位昏睡的老人。"
          at={320}
          color="rgba(233,238,248,0.82)"
        />
      </Beat>

      <Beat from={470} until={700}>
        <Line text="他叫约翰。工匠，寡言。" at={472} />
        <Line text="妻子两年前去世了。" at={528} color="rgba(233,238,248,0.82)" />
        <Line
          text="墙上挂着四幅画：灯塔、兔子、鸭嘴兽。"
          at={588}
          color={C.mist}
        />
      </Beat>

      <Beat from={700}>
        <Line text="「他有什么愿望？」" at={702} color={C.mist} type />
        <Quote lines={['「去月球。他想去月球。」']} at={756} cps={11} />
        <Line text="可问他为什么，他自己也说不上来。" at={838} color="rgba(233,238,248,0.72)" />
      </Beat>
    </TextBlock>
  </SceneShell>
);
