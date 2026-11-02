"""把 `.tmp/renders` 里的原图转成 `public/img/` 里的成品。

`gen_scenes.py` 出的是 1792x1008 的 PNG（每张 1.5–2 MB）；成片只在压暗的
Scrim 后面露 1080p 一角，所以在这里统一重采样并压成 JPEG。原图留在
`.tmp/renders`（gitignored），需要重新裁切或换宽度时从那里再跑一遍。

job 名 → scenes 里 import 的文件名，两边必须对得上；改 scenes 的 `img/xxx`
就同步改这张表，`--check` 会列出对不上的。

用法:
  python3 src/tools/to_web.py                # 全部 job
  python3 src/tools/to_web.py --only pl_river pl_machine
  python3 src/tools/to_web.py --check        # 只体检：哪些 img/ 引用还没有来源
"""
import argparse
import glob
import os
import pathlib
import re
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
RAW = ROOT / ".tmp" / "renders"
WEB = ROOT / "public" / "img"
SCENES = ROOT / "src" / "scenes"

# job name -> file name the scenes import（20 个 job 全覆盖）
TARGETS = {
    "pl_hospital": "gen_hospital.jpg",
    "pl_last_request": "last_request.jpg",
    "pl_machine": "machine.jpg",
    "pl_memento": "gen_memento.jpg",
    "pl_rain": "gen_rain.jpg",
    "pl_tower_night": "tower_night.jpg",
    "pl_piano": "gen_piano.jpg",
    "pl_river": "river.png",  # S5Rabbit 里按 .png 引用
    "pl_river_reading": "river_reading.jpg",
    "pl_carnival": "gen_carnival.jpg",
    "pl_first_meet": "gen_first_meet.jpg",
    "pl_kids_plane": "kids_plane.jpg",
    "pl_starfield": "starfield_cliff.jpg",
    "pl_void": "gen_void.jpg",
    "pl_twins": "gen_twins.jpg",
    "pl_clash": "gen_clash.jpg",
    "pl_miss": "gen_miss.jpg",
    "pl_nasa_v2": "gen_nasa.jpg",
    "pl_cabin": "gen_cabin.jpg",
    "pl_deep_space": "deep_space.jpg",
}

# scenes 引用但不归 20 个 job 管的：官方截图/壁纸，从 public/online、
# public/generated 里挑好手工放进 public/img/，不走本脚本
OFFICIAL = {
    "title_lighthouse.png", "memory_tunnel.jpg", "timeline_cliff.jpg",
    "lighthouse_night.jpg", "pointing_moon.jpg", "stargazing.jpg",
    "silhouettes_moon.jpg", "launching.jpg", "rocket_pastel.jpg",
}

WIDTH = 1792
REF_RE = re.compile(r"img/([A-Za-z0-9_\-]+\.(?:jpg|png))")


def latest(job, raw):
    """`raw` 里这个 job 最新的一张。按名字尾部必须是纯数字，避免
    `pl_river` 捡到 `pl_river_reading_*`。"""
    hits = []
    for p in glob.glob(str(raw / (job + "_*.png"))):
        stem = os.path.splitext(os.path.basename(p))[0]
        if stem[len(job) + 1:].isdigit():
            hits.append(p)
    if not hits:
        raise SystemExit(f"{raw} 里没有 {job} 的渲染结果，先跑 gen_scenes.py")
    return max(hits, key=os.path.getmtime)


def scene_refs():
    out = {}
    for f in sorted(SCENES.glob("*.tsx")):
        for name in REF_RE.findall(f.read_text(encoding="utf8")):
            out.setdefault(name, set()).add(f.stem)
    return out


def check(raw):
    refs = scene_refs()
    produced = set(TARGETS.values())
    have = {p.name for p in WEB.glob("*")} if WEB.exists() else set()
    problems = 0
    print(f"scenes 引用 {len(refs)} 个文件名，{WEB.name}/ 里现有 {len(have)} 个\n")
    for name in sorted(refs):
        where = ", ".join(sorted(refs[name]))
        if name in have:
            print(f"  ok       {name}")
        elif name in produced:
            job = next(j for j, v in TARGETS.items() if v == name)
            try:
                src = latest(job, raw)
                print(f"  ready    {name}  <- {os.path.basename(src)}（还没转）")
            except SystemExit:
                print(f"  missing  {name}  <- {job} 没有渲染结果")
                problems += 1
        elif name in OFFICIAL:
            print(f"  official {name}  官方素材，需手工放进 public/img/  ({where})")
            problems += 1
        else:
            print(f"  unknown  {name}  没有 job 也没登记为官方素材  ({where})")
            problems += 1
    unused = sorted(produced - set(refs))
    if unused:
        print(f"\njob 产出但 scenes 没引用：{unused}")
    print(f"\n待处理 {problems} 项")
    return 1 if problems else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", default=None)
    ap.add_argument("--src", default=str(RAW), help="渲染结果目录")
    ap.add_argument("--width", type=int, default=WIDTH)
    ap.add_argument("--quality", type=int, default=88)
    ap.add_argument("--check", action="store_true", help="只体检不转换")
    args = ap.parse_args()

    raw = pathlib.Path(args.src)
    if args.check:
        return check(raw)

    WEB.mkdir(parents=True, exist_ok=True)

    for job, dest in TARGETS.items():
        if args.only and job not in args.only:
            continue
        src = latest(job, raw)
        img = Image.open(src).convert("RGB")
        if img.width != args.width:
            h = round(img.height * args.width / img.width)
            img = img.resize((args.width, h), Image.LANCZOS)

        out = WEB / dest
        if dest.endswith(".png"):
            # 像素画量化到 256 色看不出损失，也免得 river.png 几 MB
            img.quantize(colors=256, dither=Image.NONE).save(out, optimize=True)
        else:
            img.save(out, quality=args.quality, optimize=True, progressive=True)
        print(f"{os.path.basename(src)} -> public/img/{dest}  "
              f"{img.width}x{img.height}  {out.stat().st_size // 1024} KB")

    return 0


if __name__ == "__main__":
    sys.exit(main())
