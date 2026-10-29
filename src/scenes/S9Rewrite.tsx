import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Quote, Beat} from '../components/Text';

/** LAYER 07 — the rewrite: two lives start apart, then meet again. */
export const RewriteScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <SceneShell
    durationInFrames={durationInFrames}
    layer={LAYERS[7]}
    art={
      <>
        <Shot
          src="img/rocket_pastel.jpg"
          to={300}
          zoom={[1.06, 1.18]}
          focus={[0.5, 0.55]}
          fadeIn={14}
          fadeOut={18}
          brightness={1.05}
        />
        <Shot src="img/gen_nasa.jpg" from={280} to={450} zoom={[1.03, 1.12]} focus={[0.5, 0.5]} />
        <Shot src="img/launching.jpg" from={430} to={610} zoom={[1.02, 1.12]} focus={[0.5, 0.5]} />
        <Shot src="img/gen_piano.jpg" from={570} zoom={[1.02, 1.14]} focus={[0.5, 0.5]} brightness={0.95} />
        <Scrim height="60%" />
      </>
    }
  >
    <Flash from={280} peak={298} to={330} max={0.3} />
    <Flash from={560} peak={578} to={610} max={0.2} />

    <TextBlock>
      <Beat from={16} until={290}>
        <Line text="于是，伊娃决定改写。" at={18} type />
        <Line
          text="River 从记忆里消失了。"
          at={100}
          color="rgba(233,238,248,0.82)"
        />
      </Beat>

      <Beat from={290} until={570}>
        <Line text="在 NASA 的大厅里，他们第一次见面。" at={292} type />
        <Line text="她只是被换到了另一条路上。" at={350} color="rgba(233,238,248,0.82)" />
        <Line text="训练、倒计时、发射。" at={420} color="rgba(233,238,248,0.8)" />
        <Line text="这一次，他们一起。" at={440} color={C.gold} />
      </Beat>

      <Beat from={570}>
        <Line text="钢琴房里传来一首曲子。" at={572} color={C.mist} />
        <Quote lines={['「这首叫什么？」', '「《For River》。」']} at={630} gap={52} cps={10} />
        <Line text="于是他们又一次相爱了。" at={740} color="rgba(233,238,248,0.7)" />
      </Beat>
    </TextBlock>
  </SceneShell>
);
