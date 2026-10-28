import React from 'react';
import {C, PIXEL, snap} from '../theme';
import {useLayout} from '../layout';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Quote, Beat, Appear} from '../components/Text';

const STARS_LINES = [
  '「我一直以为，天上的星星是灯塔。」',
  '「成千上万座，镶嵌在遥远的天际。」',
  '「它们离得太远，听不见彼此的声音。」',
  '「它们只能做一件事：绽放自己的光。」',
];

/** LAYER 05 — the promise: meet me on the moon. */
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
          />
          <Shot src="img/stargazing.jpg" from={700} zoom={[1.03, 1.14]} focus={[0.5, 0.5]} />
          <Scrim height="58%" />
        </>
      }
    >
      <Flash from={398} peak={416} to={450} max={0.2} />

      <TextBlock>
        <Beat from={16} until={400}>
          <Quote lines={STARS_LINES} at={20} gap={58} cps={13} size={snap(layout.quoteSize * 0.78)} />
        </Beat>

        <Beat from={400} until={720}>
          <Quote
            lines={['「如果走丢了，或者忘记了，怎么办？」']}
            at={404}
            cps={15}
            size={snap(layout.quoteSize * 0.82)}
          />
        </Beat>

        <Beat from={720}>
          <Quote
            lines={['「那我们总会在月亮上相遇的，傻瓜。」', '「就在小兔子的肚子那里。」']}
            at={724}
            gap={54}
            cps={12}
            size={snap(layout.quoteSize * 0.82)}
          />
          <Appear at={900} dur={22} style={{marginTop: layout.bodySize * 0.9}}>
            <div
              style={{
                fontFamily: PIXEL,
                fontSize: snap(layout.bodySize * 0.72),
                color: 'rgba(233,238,248,0.45)',
                letterSpacing: 3,
              }}
            >
              那年，他们都没有意识到，这句话会被记一辈子。
            </div>
          </Appear>
        </Beat>
      </TextBlock>
    </SceneShell>
  );
};
