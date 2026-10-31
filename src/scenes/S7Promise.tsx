import React from 'react';
import {C, PIXEL, snap} from '../theme';
import {useLayout} from '../layout';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock, Bridge} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Quote, Line, Beat, Appear} from '../components/Text';

/** LAYER 05 — the promise. This is the origin of the wish. */
export const PromiseScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const layout = useLayout();
  return (
    <SceneShell
      durationInFrames={durationInFrames}
      layer={LAYERS[5]}
      art={
        <>
          <Shot
            src="img/pointing_moon.jpg"
            to={420}
            zoom={[1.02, 1.12]}
            focus={[0.44, 0.5]}
            fadeIn={14}
            fadeOut={18}
          />
          <Shot
            src="img/starfield_cliff.jpg"
            from={398}
            to={730}
            pixel
            zoom={[1.06, 1.18]}
            focus={[0.5, 0.42]}
            brightness={1.2}
          />
          <Shot src="img/stargazing.jpg" from={700} zoom={[1.03, 1.14]} focus={[0.5, 0.5]} />
          <Scrim height="58%" />
        </>
      }
    >
      <Flash from={398} peak={416} to={450} max={0.16} />

      <TextBlock>
        <Beat from={16} until={360}>
          <Quote
            lines={['「如果走丢了，或者忘记了，怎么办？」']}
            at={20}
            cps={14}
            size={snap(layout.quoteSize * 0.86)}
          />
        </Beat>

        <Beat from={360} until={700}>
          <Quote
            lines={['「那我们总会在月亮上相遇的，傻瓜。」']}
            at={364}
            cps={13}
            size={snap(layout.quoteSize * 0.86)}
          />
          <Quote
            lines={['「就在小兔子的肚子那里。」']}
            at={504}
            cps={13}
            size={snap(layout.quoteSize * 0.78)}
          />
          <Appear at={604} dur={20} style={{marginTop: layout.bodySize * 0.5}}>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: snap(layout.bodySize * 0.72),
                color: 'rgba(233,238,248,0.45)',
                letterSpacing: 3,
              }}
            >
              那天晚上，他们把这个约定说了很多遍。
            </div>
          </Appear>
        </Beat>

        <Beat from={700}>
          <Line text="所以 John 才想去月球。" at={704} color={C.gold} />
          <Bridge text="可那段记忆，他进不去。" at={790} />
        </Beat>
      </TextBlock>
    </SceneShell>
  );
};
