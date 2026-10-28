import React from 'react';
import {Composition, Folder} from 'remotion';
import {Film} from './Film';
import {FPS, TOTAL_SECONDS} from './timeline';

const DURATION = Math.round(TOTAL_SECONDS * FPS);

export const RemotionRoot: React.FC = () => (
  <Folder name="ToTheMoon">
    <Composition
      id="ToTheMoon"
      component={Film}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="ToTheMoonVertical"
      component={Film}
      durationInFrames={DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </Folder>
);
