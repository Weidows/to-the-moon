/**
 * Single source of truth for the film's structure.
 * Times are in seconds and follow the phrasing of "For River" (312.4s).
 *
 * The eight layers are the eight questions of the investigation, in order:
 * each one is answered by the layer below it, and every chapter hands the next
 * one its question.
 */

export type LayerTag = {
  /** 0..7 */
  index: number;
  code: string; // e.g. "LAYER 03"
  name: string; // e.g. "兔子"
  short: string; // for the depth gauge
  world: string; // which world this layer belongs to
};

export const LAYERS: LayerTag[] = [
  {index: 0, code: 'LAYER 00', name: '委托', short: '委托', world: '现实'},
  {index: 1, code: 'LAYER 01', name: '尝试', short: '尝试', world: '记忆'},
  {index: 2, code: 'LAYER 02', name: '灯塔', short: '灯塔', world: '记忆'},
  {index: 3, code: 'LAYER 03', name: '兔子', short: '兔子', world: '记忆'},
  {index: 4, code: 'LAYER 04', name: '初见', short: '初见', world: '记忆'},
  {index: 5, code: 'LAYER 05', name: '约定', short: '约定', world: '记忆'},
  {index: 6, code: 'LAYER 06', name: '迷雾', short: '迷雾', world: '记忆'},
  {index: 7, code: 'LAYER 07', name: '抉择', short: '抉择', world: '记忆'},
];

export type Segment = {
  id: string;
  from: number; // seconds
  to: number; // seconds
  layer: LayerTag | null;
};

export const SEGMENTS: Segment[] = [
  {id: 'prologue', from: 0, to: 20, layer: null},
  {id: 'now', from: 20, to: 50, layer: LAYERS[0]},
  {id: 'corridor', from: 50, to: 78, layer: LAYERS[1]},
  {id: 'lighthouse', from: 78, to: 108, layer: LAYERS[2]},
  {id: 'rabbit', from: 108, to: 138, layer: LAYERS[3]},
  {id: 'carnival', from: 138, to: 168, layer: LAYERS[4]},
  {id: 'promise', from: 168, to: 196, layer: LAYERS[5]},
  {id: 'sealed', from: 196, to: 216, layer: LAYERS[6]},
  {id: 'choice', from: 216, to: 244, layer: LAYERS[7]},
  {id: 'moon', from: 244, to: 313, layer: null},
];

export const TOTAL_SECONDS = 313;
export const FPS = 30;
