import React from 'react';
import {C, PIXEL, snap} from '../theme';
import {useLayout} from '../layout';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Quote, Beat, Appear} from '../components/Text';

/** LAYER 02 — the rain, the lighthouse, and Anya. */
export const LighthouseScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const layout = useLayout();
  return (
    <SceneShell
      durationInFrames={durationInFrames}
      layer={LAYERS[2]}
      art={
        <>
          <Shot
            src="img/rain_lighthouse.jpg"
            to={330}
            pixel
            zoom={[1.26, 1.14]}
            focus={[0.5, 0.585]}
            fadeIn={12}
            fadeOut={18}
            saturate={0.88}
            brightness={1.16}
          />
          <Shot src="img/tower_night.jpg" from={308} to={650} zoom={[1.02, 1.12]} focus={[0.5, 0.5]} />
          <Shot src="img/lighthouse_night.jpg" from={630} zoom={[1.03, 1.14]} focus={[0.52, 0.45]} />
          <Scrim height="62%" />
        </>
      }
    >
      <Flash from={308} peak={326} to={360} max={0.2} />
      <Flash from={630} peak={648} to={682} max={0.2} />

      <TextBlock>
        <Beat from={18} until={330}>
          <Line text="雨夜。他撑着伞，站在灯塔下面。" at={20} type />
          <Quote lines={['「我也能和你一样，', '每天看着它了。」']} at={110} cps={14} />
        </Beat>

        <Beat from={330} until={650}>
          <Line text="灯塔有一个名字，是她起的。" at={332} />
          <Appear at={400} dur={20}>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: snap(layout.chapterSize * 1.1),
                color: C.gold,
                letterSpacing: Math.round(layout.chapterSize * 0.2),
                marginTop: layout.bodySize * 0.4,
                marginBottom: layout.bodySize * 0.5,
                textShadow: `0 0 ${layout.chapterSize}px rgba(255,214,146,0.35)`,
              }}
            >
              安 雅
            </div>
          </Appear>
          <Line text="不是人。是这座灯塔。" at={470} color={C.mist} />
        </Beat>

        <Beat from={650}>
          <Line text="它替她活着，也替他守着这片海。" at={652} type />
          <Quote lines={['「有一天，我也会离开。', '到那时，谁来看我们呢？」']} at={740} cps={13} />
        </Beat>
      </TextBlock>
    </SceneShell>
  );
};
