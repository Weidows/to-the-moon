# 去月球 · To The Moon（Remotion 同人短片）

用 Remotion 做的《去月球》剧情短片，一镜到底的"记忆下沉"结构：
从月球与灯塔开始，按 `LAYER 00 → 07` 一层层往下，最后回到月球。
配乐用「For River」，片长与曲长对齐（5:13）。

同时输出两个版本，共用同一份场景代码：

| Composition | 尺寸 | 用途 |
| --- | --- | --- |
| `ToTheMoon` | 1920×1080 | 横版 |
| `ToTheMoonVertical` | 1080×1920 | 手机竖版 |

## 预览 / 渲染

```bash
npm run dev                # Remotion Studio, http://localhost:3000
npm run typecheck
npm run render             # 横版 → out/to-the-moon.mp4
npm run render:vertical    # 竖版 → out/to-the-moon-vertical.mp4
```

Studio 里可以直接拖动时间轴看每一层，改动会热更新。

## 分镜

| 时间 | 层 | 内容 |
| --- | --- | --- |
| 0:00–0:20 | 序 | 月、灯塔、标题；落点是「去月球。他想去月球。」 |
| 0:20–0:50 | 00 现在 | 人生构建机构、临终委托、四幅画 |
| 0:50–1:18 | 01 记忆回廊 | 记忆碎片：鸭嘴兽、双色纸兔、腌橄榄、旧雨伞 |
| 1:18–1:48 | 02 灯塔 | 雨夜、安雅、谁来看我们 |
| 1:48–2:18 | 03 折纸兔 | 「这是一只兔子」、《For River》 |
| 2:18–2:48 | 04 狂欢节 | 星空下的相遇 |
| 2:48–3:16 | 05 约定 | 星星是灯塔；月亮上见 |
| 3:16–3:36 | 06 封存 | β 受体阻滞剂、两个约翰、乔伊 |
| 3:36–4:04 | 07 改写 | 生而陌路，又在 NASA 重逢 |
| 4:04–5:13 | 终章 | 发射、牵手、月球、字幕 |

## 代码结构

```
src/
  timeline.ts        时间轴与层定义（唯一真源，改节奏只动这里）
  layout.ts          横版/竖版两套排版数值，字号对齐 12px 像素网格
  theme.ts           配色 + snap()（Zpix 是 12px 点阵字体，字号必须取 12 的倍数）
  Film.tsx           拼装场景、全局星空/刻度/文字纹理、音轨
  components/        Shot（镜头运动）、Text（逐字打出）、DepthGauge（层深刻度）、Motifs（折纸兔/月球）
  scenes/S1..S10     一场一个文件
```

想改文案：进对应 `src/scenes/Sx*.tsx`，找 `<Line text="..." at={帧}>`。
想改节奏：`src/timeline.ts` 的 `SEGMENTS`（单位秒），场景内部节拍按本地帧数写。

## 素材来源

- 游戏内截图、官方壁纸：Steam 商店页 To the Moon (appid 206440) 与 Fandom 的 To the Moon Wiki（`https://tothemoon.fandom.com`），下载脚本在 `tools/fetch_fandom.py`
- 原始素材（用户提供）：`ref/`，含剧情长文、截图、For River 音频
- 字体：Zpix 最像素（OFL），`public/fonts/zpix.woff2`
- 玩法提示：`tools/shots.mjs` 可以一次打包渲染任意帧，用于逐帧检查排版

素材版权归 Freebird Games 所有，本片为非商业同人致敬作品。
