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
npm run check:script           # 文稿与 src/scenes 的旁白是否同步
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

八层就是八个问题，每一层都在回答上一层，并在结尾把下一个问题交出去（金色引线）。
章节之间是叠加交叉溶解 + 上浮位移，不再从黑场进出。

| 时间 | 层 | 这一层问什么 | 交接给下一层的句子 |
| --- | --- | --- | --- |
| 0:00–0:20 | 序 | 月、灯塔、标题 | 「去月球。John 想去月球。」 |
| 0:20–0:50 | 00 委托 | 谁想要什么 | 「想弄明白，只能进他的记忆里看。」 |
| 0:50–1:18 | 01 尝试 | 直接改写行不行 | 「John 的愿望，长在她身上。」 |
| 1:18–1:48 | 02 灯塔 | River 是谁 | 「答案，要从一只折纸兔子说起。」 |
| 1:48–2:18 | 03 兔子 | 名字对、含义不懂，指向什么 | 「两位博士决定再往下走一层。」 |
| 2:18–2:48 | 04 初见 | 他们怎么认识的 | 「女孩问了 John 一个问题。」 |
| 2:48–3:16 | 05 约定 | 愿望从哪来 | 「可他从来没有想起来过。」 |
| 3:16–3:36 | 06 迷雾 | 为什么想不起来 | 「于是 John 把月亮也忘了。」 |
| 3:36–4:04 | 07 抉择 | 要愿望，得付什么代价 | 「她只是让小时候的他们，错过了彼此。」 |
| 4:04–5:13 | 终章 | 改写之后 | 考进航天中心 → 重逢 → 飞船 → 升空 → 心跳停下 |

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
MOSS-Image 重新画了 18 张 1792×1008 的像素插画（下面这张表就是全部）：

| 文件名 | 用在哪 | 替代了 |
| --- | --- | --- |
| `gen_hospital.jpg` | 00 委托 · 临终病房 | 暗且带 HUD 的游戏截图 |
| `gen_memento.jpg` | 01 尝试 · 满屋折纸兔 | 带英文弹窗的截图 |
| `gen_rain.jpg` | 02 灯塔 · 雨夜 | 过暗的雨夜截图 |
| `gen_piano.jpg` | 03 兔子 · 钢琴房 | 空旷的暗色插画 |
| `gen_carnival.jpg` | 04 初见 · 狂欢节 | 760px 小图放大 |
| `gen_void.jpg` | 06 迷雾 · 记忆虚空 | 昏暗难辨的截图 |
| `gen_twins.jpg` | 06 迷雾 · 双胞胎卧室 | 原本没有图 |
| `gen_nasa.jpg` | 终章 · 航天中心 | 原本没有图 |
| `gen_clash.jpg` | 07 抉择 · 两位博士争执 | 原本没有图 |
| `gen_miss.jpg` | 07 抉择 · 让童年错过彼此 | 原本没有图 |
| `gen_cabin.jpg` | 终章 · 飞船舱内 | 原本没有图 |
| `last_request.jpg` | 00 委托 · 临终病房，老人指向月亮 | 暗且带 HUD 的游戏截图 |
| `machine.jpg` | 00 委托 · 记忆改写设备 | 官方截图 |
| `tower_night.jpg` | 02 灯塔 · 雨夜 | 过暗的截图 |
| `river.png` | 03 兔子 · 她坐在满屋折纸兔中间 | 官方立绘（分辨率低） |
| `river_reading.jpg` | 03 兔子 · 最后那天举起一只兔子 | 官方截图 |
| `kids_plane.jpg` | 04 初见 · 两个孩子躺在草地看银河 | 760px 小图 |
| `deep_space.jpg` | 终章 · 深空月球（压暗到 44%） | 低清壁纸 |

- 提示词：`tools/jobs/pl_*.json`（中文长句 + 统一风格尾巴 + 固定 seed，可直接改文案重跑）
- 出图：`python tools/moss.py --job tools/jobs/pl_rain.json --out .tmp/moss`
  管线是 `UNETLoader(moss_image_sft_int8_convrot) → KSampler(er_sde/simple, 30步, cfg 3)`
  ＋ `CLIPLoader(qwen3.5_9b_w4a8_gptq, type=moss_image)` ＋ `flux2-vae_small`。
  原工作流里的 `SpectrumMOSSImageAdaptive` 加速节点本机没装（`custom_nodes` 里没有），
  脚本走的是不开加速的直连版本；装上后可以加回节点、步数降到 25。
  单张 1792×1008 约 50 秒。
- 落地：`python tools/to_web.py`（PNG → `public/img/*.jpg`，原图另存 `ref/generated/`）
- 原图留在 `ref/generated/`，`public/img/` 里是压缩后的 JPEG。

## 排查记录：播放卡顿（2026-10-31）

反馈是「视频里有多次卡顿」。片源侧逐项测过，结论是**片源没问题**：

| 检查 | 方法 | 结果 |
| --- | --- | --- |
| 帧间差 | 每 0.03s 抽帧算灰阶平均绝对差（40/99/118/160/262s 五段） | 0.13–1.15，无突跳、无静止帧 |
| 完整解码 | `ffmpeg -v error -i out/*.mp4 -f null -` | 0 行错误 |
| 章节接缝 | 9 个交界各抽 ±0.2s 三帧量亮度 | 最低 11.6（钢琴房、灯塔夜景），均有内容不是空帧 |
| 音轨 | `volumedetect` | mean −18.8dB / max −1.0dB |

当时的背景是本地 ComfyUI 开着占 GPU，播放器抢不到资源。判断方法：用 `-c copy` 切一段
（码流与成片完全一致）和一个重压过的版本对比播放——copy 卡而重压不卡 = 码率/解码问题；
两个都卡 = 播放器或显卡；两个都不卡 = 当时就是 GPU 被占。

素材版权归 Freebird Games 所有，本片为非商业同人致敬作品。
