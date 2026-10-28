import {useVideoConfig} from 'remotion';
import {snap} from './theme';

export type Layout = {
  portrait: boolean;
  W: number;
  H: number;
  pad: number;
  art: {x: number; y: number; w: number; h: number};
  heroSize: number;
  chapterSize: number;
  eyebrowSize: number;
  bodySize: number;
  quoteSize: number;
  smallSize: number;
  textTop: number;
  textWidth: number;
  headerTop: number;
};

/**
 * One design, two canvases. Every scene reads its numbers from here so the
 * 16:9 film and the 9:16 mobile cut stay in sync. Sizes are snapped to the
 * 12px grid the pixel font expects.
 */
export const useLayout = (): Layout => {
  const {width: W, height: H} = useVideoConfig();
  const portrait = H > W;

  if (portrait) {
    const pad = Math.round(W * 0.062);
    const artW = W;
    const artH = Math.round((artW * 9) / 16);
    const artY = Math.round(H * 0.212);
    return {
      portrait,
      W,
      H,
      pad,
      art: {x: pad, y: artY, w: artW, h: artH},
      heroSize: snap(W * 0.112),
      chapterSize: snap(W * 0.047),
      eyebrowSize: snap(W * 0.0235),
      bodySize: snap(W * 0.0405),
      quoteSize: snap(W * 0.0435),
      smallSize: snap(W * 0.0215),
      textTop: artY + artH + Math.round(H * 0.038),
      textWidth: artW,
      headerTop: Math.round(H * 0.1),
    };
  }

  const pad = Math.round(H * 0.089);
  return {
    portrait,
    W,
    H,
    pad,
    art: {x: 0, y: 0, w: W, h: H},
    heroSize: snap(H * 0.152),
    chapterSize: snap(H * 0.053),
    eyebrowSize: snap(H * 0.025),
    bodySize: snap(H * 0.0445),
    quoteSize: snap(H * 0.0555),
    smallSize: snap(H * 0.0225),
    textTop: Math.round(H * 0.585),
    textWidth: Math.round(W * 0.575),
    headerTop: Math.round(H * 0.105),
  };
};
