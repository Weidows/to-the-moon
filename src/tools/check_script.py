"""Check that `docs/script.md` and the scene components say the same thing.

The doc duplicates every on-screen string as a `Line` / `Quote` / `Bridge` /
`TypeText` prop, so editing one side silently makes the film tell a different
story than the doc. This walks both sides in scene order and prints the drift.

  python tools/check_script.py            # exit 1 on drift
  python tools/check_script.py -v         # also print every matched line

Known false positives, handled explicitly below: the prologue quote and the
end-card prose are plain JSX text nodes, not props, so they are read separately.
"""
import argparse
import difflib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SCENES = ["S1Prologue", "S2Now", "S3Corridor", "S4Lighthouse", "S5Rabbit",
          "S6Carnival", "S7Promise", "S8Sealed", "S9Rewrite", "S10Moon"]

# 片尾卡 + 版权：不在 Line/Quote 里，单独从 S10Moon 的 EndCard 取
CREDITS_PREFIX = ("去月球 · TO THE MOON", "原作", "音乐", "剧情", "声明")

PROP_RE = re.compile(r"<(Line|Bridge|Quote|TypeText)\b([^>]*)>", re.S)
TEXT_RE = re.compile(r'text="([^"]*)"')
LINES_RE = re.compile(r"lines=\{\[(.*?)\]\}", re.S)
AT_RE = re.compile(r"at=\{(\d+)\}")
STR_RE = re.compile(r"'([^']*)'")
# S7Promise 的说明句是裸 div 文本，没有 at
BARE_RE = re.compile(r">\s*(那天晚上[^<]*)<")


def norm(s):
    """Compare on meaning, not punctuation."""
    return re.sub(r"[\s，。、！？：；「」·—…␤]", "", s)  # ␤ = doc-side manual break


def scene_strings():
    out = []
    for name in SCENES:
        src = (ROOT / "src" / "scenes" / f"{name}.tsx").read_text(encoding="utf8")
        items = []
        for m in PROP_RE.finditer(src):
            attrs = m.group(2)
            at = AT_RE.search(attrs)
            at = int(at.group(1)) if at else -1
            t = TEXT_RE.search(attrs)
            ls = LINES_RE.search(attrs)
            if t:
                items.append((at, t.group(1)))
            elif ls:
                items += [(at, s) for s in STR_RE.findall(ls.group(1))]
        bare = BARE_RE.search(src)
        if bare:
            items.append((604, bare.group(1).strip()))
        # 片尾卡的题记是裸 JSX 文本（中间夹 <br />），不是 prop；标题「去月球」跳过
        if name == "S10Moon":
            for ln in src.splitlines():
                t = ln.strip()
                if t == "去月球":
                    continue
                if re.fullmatch(r"[\u4e00-\u9fa5][\u4e00-\u9fa5，。、！？：；·—…]*", t):
                    items.append((2000, t))
        out += [(name, at, s) for at, s in sorted(items, key=lambda x: x[0])]
    return out


def doc_strings():
    md = (ROOT / "docs" / "script.md").read_text(encoding="utf8")
    md = md.split("## 同步状态")[0].split("## 待同步到")[0]
    out = []
    for ln in md.splitlines():
        s = ln.strip()
        if not s or s.startswith(("#", "---", "按 ", "八层", "暗线", "旁白一律")):
            continue
        s = re.sub(r"^\*\*▸\s*", "", s).replace("**", "").replace("> ", "").strip().strip("「」")
        if s and not s.startswith(CREDITS_PREFIX):
            out.append(s)
    return out


def readme_quotes():
    """README's 分镜表 quotes the hand-off lines; they must exist verbatim.
    Scoped to that section so song/film titles elsewhere are not checked."""
    md = (ROOT / "README.md").read_text(encoding="utf8")
    m = re.search(r"^## 分镜$(.*?)^## ", md, re.S | re.M)
    return re.findall(r"「([^」]+)」", m.group(1) if m else "")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()

    scene = scene_strings()
    doc = doc_strings()
    a = [norm(s) for _, _, s in scene]
    b = [norm(s) for s in doc]

    sm = difflib.SequenceMatcher(None, a, b)
    drift = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            if args.verbose:
                for k in range(i1, i2):
                    print(f"  = {scene[k][0]:12s} {scene[k][2]}")
            continue
        drift += 1
        print(f"\n[{tag}]")
        for k in range(i1, i2):
            print(f"  tsx {scene[k][0]}:{scene[k][1]}  {scene[k][2]}")
        for k in range(j1, j2):
            print(f"  doc                {doc[k]}")

    print(f"\n场景 {len(a)} 行 / 文稿 {len(b)} 行，差异块 {drift}，相似度 {sm.ratio():.3f}")

    # README 分镜表里引用的句子也必须能在片子里找到
    joined = "".join(a)
    stale = [q for q in readme_quotes() if norm(q) not in joined]
    if stale:
        print(f"\nREADME 引用了片子里没有的句子（{len(stale)} 条）：")
        for q in stale:
            print(f"  「{q}」")

    if drift or stale:
        print("\n文案不同步：改一边就必须改另一边。")
        return 1
    print("两边一致，README 引用也都在片子里。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
