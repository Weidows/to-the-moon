export const C = {
  ink: '#04060d',
  night: '#070d1c',
  deep: '#0b1730',
  navy: '#11203f',
  text: '#eef2fa',
  mist: '#8fa4c4',
  dim: '#5d6f8d',
  moon: '#f7f0d9',
  gold: '#ffd692',
  aqua: '#8ed7ff',
  rose: '#f0a6b7',
  paper: '#f2eee2',
};

export const PIXEL = 'Zpix, "Microsoft YaHei", monospace';

export const FONT_FAMILY = 'Zpix';

/**
 * 字幕用的字形光晕。底部 Scrim 现在只压到画面 56-58%，亮画面上靠这圈描边保证可读，
 * 不用把下半屏铺成一条黑边。
 */
export const HALO =
  '0 0 2px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.72)';

/**
 * Zpix is a 12px bitmap face. Anything other than a multiple of 12 resamples
 * the glyph grid and turns text into mush, so every size goes through here.
 */
export const snap = (px: number) => Math.max(12, Math.round(px / 12) * 12);
