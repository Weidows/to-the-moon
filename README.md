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
npm run dev                    # Remotion Studio, http://localhost:3000
npm run typecheck
npm run check:script           # 文稿与 src/scenes 的旁白是否同步
npm run render                 # 横版 → out/to-the-moon.mp4
npm run render:vertical        # 竖版 → out/to-the-moon-vertical.mp4

# 出图在 4090 上跑（见下面「出图」一节）
#   形象图/镜头图：aigc/comfyui 的 pipelines/character-sheet、pipelines/scene
#   拉回 .tmp/renders/ 后转换：
python src/tools/to_web.py --check                      # 哪些 img/ 还没有来源
python src/tools/to_web.py                              # .tmp/renders → public/img
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
| 0:20–0:50 | 00 委托 | 谁想要什么 | 「想弄明白，只能进他的记忆里，一层一层往回找。」 |
| 0:50–1:18 | 01 尝试 | 直接改写行不行 | 「他的愿望，长在她身上。」 |
| 1:18–1:48 | 02 灯塔 | River 是谁 | 「答案，在一只折纸兔子身上。」 |
| 1:48–2:18 | 03 兔子 | 名字对、含义不懂，指向什么 | 「要答对，得回到他们刚认识那年。」 |
| 2:18–2:48 | 04 初见 | 他们怎么认识的 | 「那个女孩，就是 River。」 |
| 2:48–3:16 | 05 约定 | 愿望从哪来 | 「可他忘了为什么。」 |
| 3:16–3:36 | 06 迷雾 | 为什么想不起来 | 「连月亮，也一起忘了。」 |
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
  tools/             出图与校对脚本：comfy.py（唯一引擎）、gen_characters/gen_scenes/to_web、jobs/ 提示词
```

想改文案：进对应 `src/scenes/Sx*.tsx`，找 `<Line text="..." at={帧}>`。
想改节奏：`src/timeline.ts` 的 `SEGMENTS`（单位秒），场景内部节拍按本地帧数写。

## 素材来源

- 游戏内截图：**Steam 商店页** To the Moon（appid 206440，
  `https://store.steampowered.com/app/206440/`）的官方截图。版权归 Freebird Games，
  **原图不随仓库分发**（`.gitignore` 里的 `public/online/steam/`），需要时按下面的脚本自行抓取。
- 官方壁纸 / 同人美术：Fandom 的 To the Moon Wiki（`https://tothemoon.fandom.com`），
  抓取脚本 `src/tools/fetch_fandom.py`（清单 `src/tools/fandom_images.json`，含每张图的
  `descriptionurl` 可回查原始页面），成品在 `public/online/`
- 剧情长文、人物设定、旁白文稿：`public/`（`万字诠释…md`、`主线描述.md`、`人物设定.md`、`script.md`）
- 字体：Zpix 最像素（OFL），`public/fonts/zpix.woff2`
- 逐帧检查：`src/tools/shots.mjs` 可以一次打包渲染任意帧，用于逐帧检查排版

## 出图：4090 + MOSS-Image（带角色参考图）

本机不跑 ComfyUI。所有图都在 4090（`<gpu-host>`）上出，
跑图脚本住在 `aigc/comfyui` 的 `pipelines/` 下
（`ops/deploy.sh` 平铺部署到服务器 `/root/pose_pipeline/`），产物落 `/root/ComfyUI/output/`。

| 阶段 | 输入 | 在哪跑 | 落地 |
| --- | --- | --- | --- |
| ① 形象图 | `public/人物设定.md` | `comfyui: pipelines/character-sheet/charbatch.py` | `/root/ComfyUI/output/character-sheet/<model>/` |
| ② 镜头图 | `人物设定.md` + `src/tools/jobs/pl_*.json` | `comfyui: pipelines/scene/scene_batch.py` | `/root/ComfyUI/output/scene/moss/` |
| ③ 成品 | ②拉回来的 `<job>_<seed>.png` 放 `.tmp/renders/` | `src/tools/to_web.py` | `public/img/`（scenes 直接 import） |

- 引擎（MOSS）：`moss_image_sft_int8_convrot` ＋ `moss_text_encoder`（type=`moss_image`）
  ＋ `flux2-vae_small`，`KSampler(er_sde/simple, 30 步, cfg 2.5)`。
  1792×1008 实测 **18.0s/张**，20 个镜头约 6 分钟。
- 角色一致性靠参考图：有角色的镜头走 `TextEncodeMOSSImageEdit`（图进**文本编码器**，不接 VAE、不加 edit LoRA），
  参考图放 `input/work/scene-refs/`，强度 0.9（成人特写）→ 0.75（双人同框）→ **不给**（孩子镜头、背影、空镜）。
  给成人形象图哪怕是孩子镜头，也会在画面里塞进一张成人脸。
- 提示词源头是 `src/tools/jobs/pl_*.json`。改人物设定时必须回来改这 20 个 job，
  再重新生成 `comfyui` 里的 `pipelines/scene/tothemoon_scenes.json`——参考图对了、文字错了，模型照样按文字画。
- 拉图按 `<job>_<seed>.png` 命名放进 `.tmp/renders/`（`to_web.py` 用 `latest()` 挑最新一张）。
- `jobs/` 的 20 个 job 覆盖 29 个镜头引用中的 20 个，job→文件名的映射就是 `to_web.py` 的 `TARGETS`；
  剩下 9 个是官方截图/壁纸，放在 `public/img/`（`to_web.py --check` 会逐个标出来）。
- 具体踩坑（autogrow 键名、参考图漏脸、暗提示词反向、人数写不死）记在 `comfyui/docs/pipelines.md`。

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

## 排查记录：近黑镜头（2026-10-31）

按 `Shot` 的中点逐镜抽帧量亮度（`top60%` 均值），29 个镜头里只有 `starfield_cliff.jpg`
掉到 **4.8**，其余最低 15.2。它在 04 初见 308–700、05 约定 398–730 各用一次，合计约 24 秒
几乎全黑，观众只能看见字幕。

原因：原图 mean 只有 18.5，再叠 `FilmOverlay` 的 tint（multiply）＋ vignette（0.72）
＋ `Scrim`，暗部被压到 1/4。**不要用 gamma 硬提**——试过，会把 JPEG 块噪和 8 位量化台阶
一起放大：抽帧可见星空块噪、蓝色星云出色带，成片从 163MB 涨到 206MB。

正解是重画一张本来就亮的图（MOSS，mean 47.5），再配 `brightness={1.2}`，落地后
30.1 / 31.0，和同场邻居（`kids_plane` 34.8、`gen_carnival` 34.6）同一量级。

以后加新镜头就跑一遍这个体检：按中点抽帧、算 `top60%` 均值，低于 12 就是要处理的对象。

## 素材与版权

- 《去月球 / To the Moon》的角色、剧情、音乐版权归 **Freebird Games / Kan Gao** 所有。
  本片是非商业同人致敬作品，不用于任何营收。
- `public/img/` 里少数镜头用的是游戏截图/官方壁纸（`title_lighthouse`、`memory_tunnel`、
  `timeline_cliff` 等），版权归 Freebird Games，仅作同人创作参考。
- Steam 官方截图（`public/online/steam/`，来源 appid 206440）与音轨一样**不进仓库**。
- 音轨是 PianiCast 的钢琴翻奏（312s），**不进仓库**。要重新渲染请自备音轨放到
  `public/for-river.mp3`，否则 `src/tools/` 之外的渲染会因缺资源失败。
- 画面素材除上述截图外，其余由本项目的 ComfyUI 流水线生成（MOSS-Image / Qwen-Image-2.1）。
- 字体 `Zpix`（最像素）版权归原作者 SolidZORO 所有，使用前请自行确认其授权条款。
- 仓库本身未附 LICENSE；如需复用代码请先开 issue 联系。
