"""按 `src/tools/jobs/*.json` 批量重画全片镜头图（Qwen-Image-2.1，4090）。

每个 job 一个提示词，出图落到 `.tmp/renders/{job}_{seed}.png`，再由
`to_web.py` 转成 `public/img/` 里的成品。本机不再跑 ComfyUI，也不再使用
MOSS-Image，引擎见 `comfy.py`。

用法:
  python3 src/tools/gen_scenes.py                    # 全部 job
  python3 src/tools/gen_scenes.py pl_river pl_rain    # 只跑指定 job
  python3 src/tools/gen_scenes.py --offset 100        # seed 整体后移，出一轮新候选
  python3 src/tools/gen_scenes.py --out .tmp/r2       # 换落地目录
"""
import argparse
import json
import pathlib
import sys

import comfy

ROOT = pathlib.Path(__file__).resolve().parents[2]
JOBS = ROOT / "src" / "tools" / "jobs"
OUT = ROOT / ".tmp" / "renders"
FALLBACK_SEED = 20261800


def load_jobs():
    jobs = {}
    for f in sorted(JOBS.glob("pl_*.json")):
        jobs[f.stem] = json.loads(f.read_text(encoding="utf8"))
    return jobs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("only", nargs="*", default=None, help="只跑这些 job 名")
    ap.add_argument("--offset", type=int, default=0, help="seed 整体偏移，用来重出一轮")
    ap.add_argument("--out", default=str(OUT))
    ap.add_argument("--steps", type=int, default=30)
    ap.add_argument("--cfg", type=float, default=2.5)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    jobs = load_jobs()
    names = args.only or sorted(jobs)
    unknown = [n for n in names if n not in jobs]
    if unknown:
        raise SystemExit(f"没有这些 job：{unknown}\n现有的：{sorted(jobs)}")

    out = pathlib.Path(args.out)
    print(f"引擎 Qwen-Image-2.1 @ {comfy.HOST}  落地 {out}  共 {len(names)} 个 job",
          flush=True)

    for i, name in enumerate(names, 1):
        job = jobs[name]
        seed = int(job.get("seed") or FALLBACK_SEED) + args.offset
        stem = f"{name}_{seed}"
        if (out / f"{stem}.png").exists() and not args.force:
            print(f"[{i}/{len(names)}] {stem} 已存在，跳过", flush=True)
            continue
        paths = comfy.render(
            job["prompt"], out, stem, seed,
            int(job.get("width", 1792)), int(job.get("height", 1008)),
            negative=job.get("negative") or comfy.NEG,
            steps=int(job.get("steps", args.steps)),
            cfg=float(job.get("cfg", args.cfg)),
        )
        print(f"[{i}/{len(names)}] {stem} -> {', '.join(str(p) for p in paths)}", flush=True)

    print(f"\n跑完 {len(names)} 个 job，图在 {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
