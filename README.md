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

## 剧情骨架

按 `ref/主线描述.md` 的五幕编排，`ref/万字诠释…md` 只作为细节扩充（记忆碎片物品、台词）。

1. **委托** — 记忆改写技术只能用于临终的人；两位博士接下约翰的委托，而他自己也说不上来为什么想去月球。
2. **尝试** — 他们先试着把他改成想去月球的人，三次都被记忆推回原地；线索全部指向 River。
3. **下沉** — 顺着记忆碎片一层层退回更早：灯塔、折纸兔、狂欢节、约定。
4. **童年与代价** — 童年的记忆像被雾堵住，进去后才知道乔伊死于意外、母亲用阻滞剂抹掉了那段记忆，连同月亮的约定。要满足愿望就得拿掉 River，两位博士为此争执。
5. **抉择与结局** — 伊娃没有删除 River，只让小时候的两人错过；改写后约翰成了宇航员，两人在航天中心重逢相爱，最后并排坐在飞船上，随火箭升空，心跳慢慢停下。

## 分镜

| 时间 | 层 | 内容 |
| --- | --- | --- |
| 0:00–0:20 | 序 | 月、灯塔、标题；落点是「去月球。他想去月球。」 |
| 0:20–0:50 | 00 现在 | 机构、临终委托、四幅画、「他自己也说不上来」 |
| 0:50–1:18 | 01 记忆回廊 | 记忆碎片；三次改写失败；线索指向 River |
| 1:18–1:48 | 02 灯塔 | 雨夜、安雅、谁来看我们 |
| 1:48–2:18 | 03 折纸兔 | 「这是一只兔子」、《For River》 |
| 2:18–2:48 | 04 狂欢节 | 星空下的相遇 |
| 2:48–3:16 | 05 约定 | 星星是灯塔；月亮上见 |
| 3:16–3:36 | 06 封存 | 迷雾、乔伊、阻滞剂、「他把月亮也一起忘了」 |
| 3:36–4:04 | 07 抉择 | 争执；不删 River，只让童年错过彼此 |
| 4:04–5:13 | 终章 | 成为宇航员、NASA 重逢、钢琴房、飞船、发射、字幕 |

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

## 本地 MOSS-Image 生成的插画

官方素材里画面不清楚、分辨率偏低或构图不适配的位置，用本地 ComfyUI 的
MOSS-Image 重新画了 8 张 1792×1008 的像素插画：

| 文件名 | 用在哪 | 替代了 |
| --- | --- | --- |
| `gen_hospital.jpg` | 00 现在 · 临终病房 | 暗且带 HUD 的游戏截图 |
| `gen_memento.jpg` | 01 记忆回廊 · 满屋折纸兔 | 带英文弹窗的截图 |
| `gen_rain.jpg` | 02 灯塔 · 雨夜 | 过暗的雨夜截图 |
| `gen_piano.jpg` | 03 / 07 · 钢琴房 | 空旷的暗色插画 |
| `gen_carnival.jpg` | 04 狂欢节 | 760px 小图放大 |
| `gen_void.jpg` | 06 封存 · 记忆虚空 | 昏暗难辨的截图 |
| `gen_twins.jpg` | 06 封存 · 双胞胎卧室 | 原本没有图 |
| `gen_nasa.jpg` | 07 改写 · NASA 大厅 | 原本没有图 |
| `gen_clash.jpg` | 07 抉择 · 两位博士争执 | 原本没有图 |
| `gen_miss.jpg` | 07 抉择 · 让童年错过彼此 | 原本没有图 |
| `gen_cabin.jpg` | 终章 · 飞船舱内 | 原本没有图 |

- 提示词：`tools/jobs/pl_*.json`（中文长句 + 统一风格尾巴 + 固定 seed，可直接改文案重跑）
- 出图：`python tools/moss.py --job tools/jobs/pl_rain.json --out .tmp/moss`
  管线是 `UNETLoader(moss_image_sft_int8_convrot) → KSampler(er_sde/simple, 30步, cfg 3)`
  ＋ `CLIPLoader(qwen3.5_9b_w4a8_gptq, type=moss_image)` ＋ `flux2-vae_small`。
  原工作流里的 `SpectrumMOSSImageAdaptive` 加速节点本机没装（`custom_nodes` 里没有），
  脚本走的是不开加速的直连版本；装上后可以加回节点、步数降到 25。
- 原图留在 `ref/generated/`，`public/img/` 里是压缩后的 JPEG。

素材版权归 Freebird Games 所有，本片为非商业同人致敬作品。
