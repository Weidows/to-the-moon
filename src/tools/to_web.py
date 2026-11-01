"""Downscale MOSS PNGs into the JPEGs that `public/img/` ships.

The raw renders in `.tmp/moss/` are 1792x1008 PNGs (~2 MB each). The film only
ever shows them behind a scrim at 1080p, so they get re-encoded once here and
the untouched PNG is kept in `ref/generated/` for future re-crops.

Usage:
  python tools/to_web.py                       # every job in tools/jobs/
  python tools/to_web.py --only pl_river pl_machine
"""
import argparse
import glob
import os
import shutil

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, ".tmp", "moss")
WEB = os.path.join(ROOT, "public", "img")
KEEP = os.path.join(ROOT, "ref", "generated")

# job name -> file name the scenes import
TARGETS = {
    "pl_last_request": "last_request.jpg",
    "pl_machine": "machine.jpg",
    "pl_tower_night": "tower_night.jpg",
    "pl_river": "river.png",  # referenced as .png by S5Rabbit
    "pl_river_reading": "river_reading.jpg",
    "pl_kids_plane": "kids_plane.jpg",
    "pl_nasa_v2": "gen_nasa.jpg",
    "pl_deep_space": "deep_space.jpg",
    "pl_starfield": "starfield_cliff.jpg",
}

WIDTH = 1792


def latest(job):
    """Newest render for `job`, ignoring longer job names that share a prefix
    (`pl_river` must not pick up `pl_river_reading_*.png`)."""
    hits = []
    for p in glob.glob(os.path.join(RAW, job + "_*.png")):
        stem = os.path.splitext(os.path.basename(p))[0]
        if stem[len(job) + 1:].isdigit():
            hits.append(p)
    if not hits:
        raise SystemExit(f"no render for {job} in .tmp/moss")
    return max(hits, key=os.path.getmtime)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", default=None)
    ap.add_argument("--width", type=int, default=WIDTH)
    ap.add_argument("--quality", type=int, default=88)
    args = ap.parse_args()

    os.makedirs(WEB, exist_ok=True)
    os.makedirs(KEEP, exist_ok=True)

    for job, dest in TARGETS.items():
        if args.only and job not in args.only:
            continue
        src = latest(job)
        shutil.copy2(src, os.path.join(KEEP, os.path.basename(src)))

        img = Image.open(src).convert("RGB")
        if img.width != args.width:
            h = round(img.height * args.width / img.width)
            img = img.resize((args.width, h), Image.LANCZOS)

        out = os.path.join(WEB, dest)
        if dest.endswith(".png"):
            # pixel art survives a 256-colour palette with no visible loss,
            # and it keeps river.png out of the multi-megabyte range
            img.quantize(colors=256, dither=Image.NONE).save(out, optimize=True)
        else:
            img.save(out, quality=args.quality, optimize=True, progressive=True)
        print(f"{os.path.basename(src)} -> public/img/{dest}  {img.width}x{img.height}  "
              f"{os.path.getsize(out) // 1024} KB")


if __name__ == "__main__":
    main()
