"""给四位主角批量出形象图（候选池，供人肉筛选）。

角色卡严格照 `public/人物设定.md`（英文提示词原样带入），四个角色 × 若干视角
× N 个 seed，落 `public/characters/`。挑中的那张反过来写进 `src/tools/jobs/`
的场景提示词。

出图在 4090 上跑（引擎见 `comfy.py`：Qwen-Image-2.1；本机不再跑 ComfyUI，也
不再使用 MOSS-Image）。图留在跑脚本的那台机器上：在 4090 上跑就落在服务器的
`/root/to-the-moon/public/characters/`。

用法:
  python3 src/tools/gen_characters.py                    # 全部角色 × 视角 × 2 seed
  python3 src/tools/gen_characters.py --seeds 4          # 每视角 4 个 seed
  python3 src/tools/gen_characters.py --only river       # 只画一个角色
  python3 src/tools/gen_characters.py --view front side  # 只画这些视角
  python3 src/tools/gen_characters.py --dry-run          # 只打印提示词和 seed
"""
import argparse
import pathlib
import sys

import comfy

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "characters"

# ---- 角色卡（发色/瞳色/发型照 public/人物设定.md，英文提示词原样带入） ----
CHARACTERS = {
    "river": (
        "River，一位年轻的东亚女性，中长至长发、齐刘海、两侧有自然垂落的发束。"
        "发色是偏橘粉调的赤褐色：long warm copper rose auburn hair, rich reddish "
        "chestnut brown base, subtle orange-copper undertones, soft peachy rose-copper "
        "highlights, warm natural reddish-brown tones——暗部深栗棕、受光处铜红棕略带橘调、"
        "高光是柔和的橘粉玫瑰铜色；整体是自然的棕红，不能变成粉发、橙发或亮红发。"
        "眼睛是明亮的绿色（bright green eyes）。"
        "穿米白色的旧毛衣，神情安静、内向、善良，眼神略微避开镜头。"
    ),
    "john": (
        "John，一位年轻的男性。"
        "natural black hair, subtle dark charcoal gray highlights, natural black eyes"
        "——自然黑发，黑发里只有深灰和少量冷灰的反光，不带蓝色或棕色倾向；瞳孔自然黑色。"
        "神情温和、带一点疲惫感，穿简单的深色外套。"
    ),
    "john_old": (
        "John，一位年老的男性。"
        "一头自然的银白色短发（natural white / silver white hair），"
        "眼睛因年迈而微微浑浊，眼周、额头、手背有真实的皱纹和老人斑。"
        "神情安详、虚弱。穿浅色的旧睡衣。"
    ),
    "doctors": (
        "两位研究机构的医生并排站在一起。"
        "女医生：very dark midnight blue-gray hair, near-black navy blue base, subtle "
        "muted steel blue highlights, extremely dark cool-toned hair, low saturation, "
        "almost black but visibly blue under light——远看接近黑发，蓝色必须足够深，"
        "不能是普通蓝发、亮蓝发或浅灰蓝发；五官清秀漂亮，神情锐利，带一点毒舌的意味。"
        "男医生：warm dark chestnut brown hair, subtle caramel brown highlights, warm "
        "golden-brown reflections——暖调深栗棕发，发丝有棕金色反光；戴细框眼镜，"
        "神情随意，像随时准备吐槽。两人都穿白色医生大褂。"
    ),
}

# 两人一卡的角色不适合正侧面（会挡住一半），其余默认四个视角
CHAR_VIEWS = {"doctors": ["front", "three_quarter", "full_body"]}
VIEWS = ["front", "three_quarter", "side", "full_body"]

# ---- 视角模板（{} = 角色描述） ----
VIEW_TPL = {
    "front": (
        "正面半身肖像，平视视角，像素艺术风格：{}"
        "人物正面对着镜头，从胸口以上，浅灰纯色背景，均匀柔光，五官和发色清晰可辨。"
    ),
    "three_quarter": (
        "四分之三侧面半身肖像，像素艺术风格：{}"
        "人物微微侧身回望镜头，浅灰纯色背景，均匀柔光，能同时看清两颊轮廓与发色层次。"
    ),
    "side": (
        "正侧面半身肖像，像素艺术风格：{}"
        "人物面朝画面右侧，完全侧脸，浅灰纯色背景，均匀柔光，突出鼻梁、下颌与发型的轮廓。"
    ),
    "full_body": (
        "全身立绘，正面稍侧，像素艺术风格：{}"
        "人物全身从头到脚站在浅灰纯色背景前，双臂自然下垂，均匀柔光，服装与体型完整可见。"
    ),
}

STYLE = ("角色设定图质感，像素艺术，复古16位像素游戏画面，细腻的像素颗粒与抖动渐变，"
         "柔和均匀的棚拍光，浅灰纯色背景，无场景、无道具、无任何文字。")

# 单人卡禁「多个人」，两人卡要放行人数、改禁同一张脸和粘连
NEG = comfy.NEG + ", multiple people, extra limbs, deformed hands, cropped head"
NEG_TWO = comfy.NEG + ", identical faces, merged bodies, extra limbs, deformed hands, cropped head"

# seed 从固定基数排：同一 角色×视角 每次跑都是同一个 seed，方便复现和对比
BASE_SEED = 20261900
SIZE = 1024


def seeds_for(cname, vname, n):
    ci = sorted(CHARACTERS).index(cname)
    vi = VIEWS.index(vname)
    return [BASE_SEED + ci * 100 + vi * 10 + i for i in range(n)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seeds", type=int, default=2, help="每个 角色x视角 出几个候选")
    ap.add_argument("--only", nargs="*", default=None, help="只画这些角色")
    ap.add_argument("--view", nargs="*", default=None, help="只画这些视角")
    ap.add_argument("--out", default=str(OUT), help="落地目录")
    ap.add_argument("--steps", type=int, default=30)
    ap.add_argument("--cfg", type=float, default=2.5)
    ap.add_argument("--size", type=int, default=SIZE, help="正方形边长，默认 1024")
    ap.add_argument("--force", action="store_true", help="已存在的也重画")
    ap.add_argument("--dry-run", action="store_true", help="只打印提示词和 seed")
    args = ap.parse_args()

    chars = [c for c in CHARACTERS if not args.only or c in args.only]
    if not chars:
        raise SystemExit(f"--only 里没有已知角色：{sorted(CHARACTERS)}")

    out = pathlib.Path(args.out)

    # 先把要出的图排成一张表，这样进度条显示的是真总数
    plan = []
    for cname in chars:
        views = CHAR_VIEWS.get(cname, VIEWS)
        if args.view:
            views = [v for v in views if v in args.view]
        neg = NEG_TWO if cname == "doctors" else NEG
        for vname in views:
            prompt = VIEW_TPL[vname].format(CHARACTERS[cname]) + " " + STYLE
            for seed in seeds_for(cname, vname, args.seeds):
                plan.append((cname, vname, seed, prompt, neg))

    total = len(plan)
    print(f"引擎 Qwen-Image-2.1 @ {comfy.HOST}  落地 {out}  共 {total} 张", flush=True)

    done = 0
    for cname, vname, seed, prompt, neg in plan:
        done += 1
        stem = f"{cname}_{vname}_{seed}"
        if args.dry_run:
            print(f"\n[{stem}] negative={neg}\n{prompt}")
            continue
        if (out / f"{stem}.png").exists() and not args.force:
            print(f"[{done}/{total}] {stem} 已存在，跳过", flush=True)
            continue
        paths = comfy.render(prompt, out, stem, seed,
                             args.size, args.size, negative=neg,
                             steps=args.steps, cfg=args.cfg)
        print(f"[{done}/{total}] {stem} -> {', '.join(str(p) for p in paths)}",
              flush=True)

    if args.dry_run:
        print(f"\n共 {total} 张（dry-run，没有提交）")
        return 0
    print(f"\n完成 {done}/{total}，图在 {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
