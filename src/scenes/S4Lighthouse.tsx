import React from 'react';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock, Bridge} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Quote, Beat} from '../components/Text';

/** LAYER 02 — River's layer: the sea, the lighthouse, the quiet. */
export const LighthouseScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <SceneShell
    durationInFrames={durationInFrames}
    layer={LAYERS[2]}
    art={
      <>
        <Shot
          src="img/gen_rain.jpg"
          to={330}
          zoom={[1.14, 1.02]}
          focus={[0.5, 0.52]}
          fadeIn={12}
          fadeOut={18}
          saturate={0.92}
          brightness={1.04}
        />
        <Shot src="img/tower_night.jpg" from={308} to={650} zoom={[1.02, 1.12]} focus={[0.5, 0.5]} />
        <Shot src="img/lighthouse_night.jpg" from={630} zoom={[1.03, 1.14]} focus={[0.52, 0.45]} />
        <Scrim height="62%" />
      </>
    }
  >
    <Flash from={308} peak={326} to={360} max={0.16} />
    <Flash from={630} peak={648} to={682} max={0.16} />

    <TextBlock>
      <Beat from={18} until={330}>
        <Line text="所以他们先下到 River 这一层。" at={20} type />
        <Line text="她住在海边，白色灯塔的脚下。" at={124} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={330} until={660}>
        <Line text="她话很少，只是不停地折纸。" at={332} />
        <Line text="她走后，John 一直住在那里。" at={500} color="rgba(233,238,248,0.8)" />
      </Beat>

      <Beat from={660}>
        <Quote
          lines={['「有一天我也会走。', '到那时，谁来看我们呢？」']}
          at={662}
          gap={54}
          cps={12}
        />
        <Bridge text="答案，要从一只折纸兔子说起。" at={812} />
      </Beat>
    </TextBlock>
  </SceneShell>
);
