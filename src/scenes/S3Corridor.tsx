import React from 'react';
import {C, PIXEL, snap} from '../theme';
import {useLayout} from '../layout';
import {LAYERS} from '../timeline';
import {SceneShell, TextBlock} from '../components/SceneShell';
import {Shot, Scrim, Flash} from '../components/Shot';
import {Line, Beat, Appear, TypeText, Quote} from '../components/Text';

const MEMENTOS = ['鸭嘴兽', '双色纸兔', '腌橄榄', '旧雨伞'];

const MementoRow: React.FC<{at: number}> = ({at}) => {
  const layout = useLayout();
  return (
    <div style={{display: 'flex', gap: Math.round(layout.bodySize * 0.55), marginTop: layout.bodySize * 0.6}}>
      {MEMENTOS.map((m, i) => (
        <Appear key={m} at={at + i * 12} dur={14}>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: snap(layout.bodySize * 0.72),
              color: C.aqua,
              border: `1px solid rgba(142,215,255,0.35)`,
              padding: `${Math.round(layout.bodySize * 0.2)}px ${Math.round(
                layout.bodySize * 0.34,
              )}px`,
              letterSpacing: 2,
              background: 'rgba(8,20,42,0.55)',
            }}
          >
            {m}
          </div>
        </Appear>
      ))}
    </div>
  );
};

/** LAYER 01 — the corridor of memory fragments. */
export const CorridorScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const layout = useLayout();
  return (
    <SceneShell
      durationInFrames={durationInFrames}
      layer={LAYERS[1]}
      art={
        <>
          <Shot
            src="img/memento_platypus.jpg"
            to={300}
            pixel
            zoom={[1.18, 1.02]}
            focus={[0.52, 0.5]}
            fadeIn={10}
            fadeOut={18}
          />
          <Shot src="img/memory_tunnel.jpg" from={280} to={640} zoom={[1.06, 1.16]} focus={[0.5, 0.5]} />
          <Shot src="img/timeline_cliff.jpg" from={610} pixel zoom={[1.24, 1.1]} focus={[0.5, 0.575]} />
          <Scrim height="64%" />
        </>
      }
    >
      <Flash from={280} peak={300} to={336} max={0.28} />
      <Flash from={610} peak={628} to={664} max={0.22} />

      <TextBlock>
        <Beat from={20} until={300}>
          <Line text="记忆不会消失，它只是被折叠起来。" at={22} type />
          <Line text="他们靠「记忆碎片」往下沉——" at={120} color="rgba(233,238,248,0.82)" />
          <MementoRow at={170} />
        </Beat>

        <Beat from={300} until={620}>
          <Line text="每摸到一件东西，就退回更早的一层。" at={302} />
          <Line
            text="时钟倒转，雨声倒退，灯光从暖变冷。"
            at={372}
            color="rgba(233,238,248,0.82)"
          />
        </Beat>

        <Beat from={620}>
          <div
            style={{
              fontFamily: PIXEL,
              fontSize: snap(layout.bodySize * 0.86),
              color: C.mist,
              letterSpacing: 2,
              marginBottom: layout.bodySize * 0.7,
            }}
          >
            <TypeText text="每深一层，约翰就年轻一点。" at={622} cps={16} />
          </div>
          <Quote lines={['「我们走吧。下面是雨夜。」']} at={700} cps={12} />
        </Beat>
      </TextBlock>
    </SceneShell>
  );
};
