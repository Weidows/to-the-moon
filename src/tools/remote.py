"""把 src/tools 同步到 4090 并在那边跑出图脚本（图留在服务器，不自动拉回）。

4090 的 ComfyUI 只监听 127.0.0.1:8188，本机连不上，所以出图一律在服务器上跑。
这个壳子负责「scp 上去 + ssh 跑 + 回显日志」，省掉每次手敲两条命令。

用法:
  python3 src/tools/remote.py gen_characters.py --seeds 4 --only river
  python3 src/tools/remote.py gen_characters.py --dry-run      # 只看提示词
  python3 src/tools/remote.py gen_scenes.py pl_rain --offset 100
  python3 src/tools/remote.py to_web.py --check               # 服务器上的体检

`--pull <相对路径>` 会在跑完后把服务器上那个目录拉回同名位置（脚本自己不会拉，
免得候选图堆到本机）：
  python3 src/tools/remote.py gen_scenes.py --pull .tmp/renders
  python3 src/tools/remote.py gen_characters.py --seeds 2 --pull public/characters

主机和目录可以用环境变量改：
  TO_THE_MOON_HOST（默认 <gpu-host>）
  TO_THE_MOON_DIR （默认 /root/to-the-moon）
"""
import os
import subprocess
import sys
import pathlib

HOST = os.environ.get("TO_THE_MOON_HOST", "<gpu-host>")
RDIR = os.environ.get("TO_THE_MOON_DIR", "/root/to-the-moon")
LOCAL = pathlib.Path(__file__).resolve().parent          # src/tools
ROOT = LOCAL.parents[1]

SSH = ["ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=15", HOST]
SCP = ["scp", "-o", "BatchMode=yes", "-o", "ConnectTimeout=15", "-r", "-q"]


def sh(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    argv = sys.argv[1:]
    pull_rel = None
    if "--pull" in argv:
        i = argv.index("--pull")
        pull_rel = argv[i + 1]
        del argv[i:i + 2]
    script, args = argv[0], argv[1:]
    if not (LOCAL / script).exists():
        raise SystemExit(f"没有 src/tools/{script}；可选："
                         f"{sorted(p.name for p in LOCAL.glob('*.py'))}")

    print(f"[sync] src/tools -> {HOST}:{RDIR}/src/tools", flush=True)
    sh(SSH + [f"mkdir -p {RDIR}/src {RDIR}/.tmp {RDIR}/public/characters"],
       stdout=subprocess.DEVNULL)
    sh(SCP + ["src/tools", f"{HOST}:{RDIR}/src/"], cwd=str(ROOT))

    cmd = f"cd {RDIR} && python3 src/tools/{script} " + " ".join(args)
    print(f"[run]  {cmd}", flush=True)
    rc = sh(SSH + [cmd]).returncode

    if rc == 0 and pull_rel:
        (ROOT / pull_rel).mkdir(parents=True, exist_ok=True)
        print(f"[pull] {HOST}:{RDIR}/{pull_rel} -> {pull_rel}", flush=True)
        sh(SCP + ["-r", f"{HOST}:{RDIR}/{pull_rel}/.", f"{pull_rel}/"], cwd=str(ROOT))
    return rc


if __name__ == "__main__":
    sys.exit(main())
