import React from 'react';
import {C} from '../theme';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock, Bridge} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Beat} from '../components/Text';

/** LAYER 04 — the summer they met. */
export const CarnivalScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <SceneShell
    durationInFrames={durationInFrames}
    layer={LAYERS[4]}
    art={
      <>
        <Shot
          src="img/gen_carnival.jpg"
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
    <Flash from={308} peak={326} to={360} max={0.18} />
    <Flash from={680} peak={698} to={732} max={0.14} />

    <TextBlock>
      <Beat from={18} until={320}>
        <Line text="再往下，是八岁那年的夏天。" at={20} type />
        <Line text="镇上的狂欢节，灯火通明。" at={112} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={320} until={690}>
        <Line text="John 躲开人群，一个人去看星星。" at={322} />
        <Line text="草地上，已经坐着一个人。" at={424} color="rgba(233,238,248,0.82)" />
        <Line text="「你占了属于我的位置。」" at={520} color={C.moon} />
      </Beat>

      <Beat from={690}>
        <Line text="那一晚，他们一直看到天亮。" at={692} />
        <Bridge text="女孩问了他一个问题。" at={800} />
      </Beat>
    </TextBlock>
  </SceneShell>
);
