// Render a batch of stills from one bundle — much faster than one CLI call per frame.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const BROWSER = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const frames = process.argv[2]
  ? process.argv[2].split(',').map(Number)
  : [];
const comps = (process.argv[3] ?? 'ToTheMoon').split(',');
const outDir = process.argv[4] ?? '.tmp/shots';

fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({
  entryPoint: path.resolve('./src/index.ts'),
  publicDir: path.resolve('./public'),
});

for (const id of comps) {
  const composition = await selectComposition({
    serveUrl,
    id,
    browserExecutable: BROWSER,
    chromiumOptions: {gl: 'swiftshader'},
  });
  for (const frame of frames) {
    if (frame >= composition.durationInFrames) continue;
    const output = path.join(outDir, `${id}_${frame}.png`);
    await renderStill({
      composition,
      serveUrl,
      output,
      frame,
      imageFormat: 'jpeg',
      jpegQuality: 88,
      browserExecutable: BROWSER,
      chromiumOptions: {gl: 'swiftshader'},
    });
    console.log('rendered', output);
  }
}
