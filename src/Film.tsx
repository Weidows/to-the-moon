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
import {ChoiceScene} from './scenes/S9Rewrite';
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
  choice: ChoiceScene,
  moon: MoonScene,
};

const LABEL: Record<string, string> = {
  prologue: '序 · 月与灯塔',
  now: '00 委托',
  corridor: '01 尝试',
  lighthouse: '02 灯塔',
  rabbit: '03 兔子',
  carnival: '04 初见',
  promise: '05 约定',
  sealed: '06 迷雾',
  choice: '07 抉择',
  moon: '终章 · 我们的月球',
};

const OVERLAP = 8;

/** Shared film body — rendered at 16:9 and 9:16 by the two compositions. */
export const Film: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: C.ink, fontFamily: 'Zpix, monospace'}}>
      <Starfield opacity={0.95} />

      {SEGMENTS.map((seg, i) => {
        const Scene = SCENE_MAP[seg.id];
        // Neighbouring layers overlap so one dissolves into the next instead of
        // every cut passing through a black frame.
        const nominalFrom = Math.round(seg.from * fps);
        const nominalTo = Math.round(seg.to * fps);
        const from = Math.max(0, nominalFrom - (i === 0 ? 0 : OVERLAP));
        const dur = nominalTo - nominalFrom + (i === 0 || i === SEGMENTS.length - 1 ? OVERLAP : OVERLAP * 2);
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
