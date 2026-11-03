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
          src="img/gen_first_meet.jpg"
          from={308}
          to={700}
          pixel
          zoom={[1.18, 1.02]}
          focus={[0.5, 0.45]}
        />
        <Shot src="img/kids_plane.jpg" from={680} zoom={[1.03, 1.14]} focus={[0.5, 0.5]} />
        <Scrim height="56%" />
      </>
    }
  >
    <Flash from={308} peak={326} to={360} max={0.18} />
    <Flash from={680} peak={698} to={732} max={0.14} />

    <TextBlock>
      <Beat from={18} until={320}>
        <Line text="再往前，是八岁那年的夏天" at={20} type />
        <Line text="镇上的狂欢节，灯火通明" at={112} color="rgba(233,238,248,0.82)" />
        <Line text="人群里，只有他一个人往山上走" at={210} color="rgba(233,238,248,0.82)" />
      </Beat>

      <Beat from={320} until={690}>
        <Line text="草地上，他一个人坐在山坡上" at={322} />
        <Line text="身后传来一句" at={400} color="rgba(233,238,248,0.82)" />
        <Line text="「你坐了我的位置」" at={470} color="rgba(233,238,248,0.82)" />
        <Line text="那一晚，他们并排躺着，看星星看到天亮" at={560} color={C.moon} />
      </Beat>

      <Beat from={690}>
        <Line text="那个女孩，就是 River" at={692} />
        <Bridge text="那个问题，他忘不掉，也想不起来" at={800} />
      </Beat>
    </TextBlock>
  </SceneShell>
);
