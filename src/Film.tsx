import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig} from 'remotion';
import {C} from './theme';
import {SEGMENTS} from './timeline';
import {Starfield} from './components/Starfield';
import {FilmOverlay} from './components/FilmOverlay';
import {DepthGauge} from './components/DepthGauge';
import {Footer} from './components/SceneShell';
import {PrologueScene} from './scenes/S1Prologue';
import {NowScene} from './scenes/S2Now';
import {CorridorScene} from './scenes/S3Corridor';
import {LighthouseScene} from './scenes/S4Lighthouse';
import {RabbitScene} from './scenes/S5Rabbit';
import {CarnivalScene} from './scenes/S6Carnival';
import {PromiseScene} from './scenes/S7Promise';
import {SealedScene} from './scenes/S8Sealed';
import {RewriteScene} from './scenes/S9Rewrite';
import {MoonScene} from './scenes/S10Moon';

const SCENE_MAP: Record<string, React.FC<{durationInFrames: number}>> = {
  prologue: PrologueScene,
  now: NowScene,
  corridor: CorridorScene,
  lighthouse: LighthouseScene,
  rabbit: RabbitScene,
  carnival: CarnivalScene,
  promise: PromiseScene,
  sealed: SealedScene,
  rewrite: RewriteScene,
  moon: MoonScene,
};

const LABEL: Record<string, string> = {
  prologue: '序 · 月与灯塔',
  now: '00 现在',
  corridor: '01 记忆回廊',
  lighthouse: '02 灯塔',
  rabbit: '03 折纸兔',
  carnival: '04 狂欢节',
  promise: '05 约定',
  sealed: '06 封存',
  rewrite: '07 改写',
  moon: '终章 · 我们的月球',
};

/** Shared film body — rendered at 16:9 and 9:16 by the two compositions. */
export const Film: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: C.ink, fontFamily: 'Zpix, monospace'}}>
      <Starfield opacity={0.95} />

      {SEGMENTS.map((seg) => {
        const Scene = SCENE_MAP[seg.id];
        const from = Math.round(seg.from * fps);
        const dur = Math.round((seg.to - seg.from) * fps);
        return (
          <Sequence key={seg.id} from={from} durationInFrames={dur} name={LABEL[seg.id]}>
            <Scene durationInFrames={dur} />
          </Sequence>
        );
      })}

      <DepthGauge />
      <FilmOverlay />
      <Footer />

      <Audio
        src={staticFile('for-river.mp3')}
        volume={(f) =>
          interpolate(
            f,
            [0, Math.round(fps * 2.5), durationInFrames - Math.round(fps * 6), durationInFrames],
            [0, 0.92, 0.92, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          )
        }
      />
    </AbsoluteFill>
  );
};
