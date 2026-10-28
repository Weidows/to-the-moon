import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Quote, Beat} from '../components/Text';

/** LAYER 04 — the carnival night, where the two of them meet. */
export const CarnivalScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <SceneShell
    durationInFrames={durationInFrames}
    layer={LAYERS[4]}
    art={
      <>
        <Shot
          src="img/ferris.jpg"
          to={330}
          zoom={[1.02, 1.12]}
          focus={[0.5, 0.5]}
          fadeIn={14}
          fadeOut={18}
          saturate={1.05}
        />
        <Shot
          src="img/starfield_cliff.jpg"
          from={308}
          to={700}
          pixel
          zoom={[1.18, 1.02]}
          focus={[0.5, 0.45]}
        />
        <Shot src="img/kids_plane.jpg" from={680} zoom={[1.03, 1.14]} focus={[0.5, 0.5]} />
        <Scrim height="60%" />
      </>
    }
  >
    <Flash from={308} peak={326} to={360} max={0.22} />
    <Flash from={680} peak={698} to={732} max={0.18} />

    <TextBlock>
      <Beat from={18} until={320}>
        <Line text="那年的狂欢节，灯火通明。" at={20} type />
        <Line text="他躲开人群，一个人去看星星。" at={110} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={320} until={690}>
        <Line text="脚步声。一个小女孩站在他身后。" at={322} />
        <Line text="「你占了属于我的位置。」" at={400} color={C.moon} />
      </Beat>

      <Beat from={690}>
        <Line text="于是他们并排坐下。" at={692} type />
        <Quote
          lines={['从名字聊到星星，', '从星星，聊到兔子。']}
          at={760}
          cps={13}
        />
      </Beat>
    </TextBlock>
  </SceneShell>
);
