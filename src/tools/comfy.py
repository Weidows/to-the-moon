"""4090 ComfyUI 客户端 + Qwen-Image-2.1 工作流（本仓库唯一的出图引擎）。

本机不再跑 ComfyUI，也不再使用 MOSS-Image：所有出图都发到 4090
（<gpu-host>），它的 ComfyUI 只监听 127.0.0.1:8188，
本机直连不上。两种跑法：

  在 4090 上直接跑（图留在服务器，本人直接在上面筛）：
    scp -r src/tools <gpu-host>:/root/to-the-moon/src/
    ssh <gpu-host>
    cd /root/to-the-moon && python3 src/tools/gen_characters.py

  本机跑，先开隧道（图仍落在服务器，再按需拉回）：
    ssh -N -L 8188:127.0.0.1:8188 <gpu-host> &

地址可以用 COMFY_HOST 覆盖。

工作流用 PreviewImage 而不是 SaveImage：候选图不写进 ComfyUI/output（那个目录和
F:\\Pictures\\aigc\\comfyui 双向同步），只落在 ComfyUI 的 temp 里，由脚本按自己的
命名取回到 --out 目录。筛选前后都不会污染同步盘。
"""
import json
import os
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

HOST = os.environ.get("COMFY_HOST", "http://127.0.0.1:8188").rstrip("/")

# Qwen-Image-2.1 栈（4090 上这三个文件都已就位，`/object_info` 可核对）
UNET = "qwen_image_2.1_int8_convrot.safetensors"
CLIP = "qwen3vl_8b_int8_convrot.safetensors"
CLIP_TYPE = "qwen_image"
VAE = "qwen_image_2.1_vae_bf16.safetensors"

NEG = ("worst quality, bad anatomy, watermark, jpeg artifact, text, letters, "
       "logo, signature")

PIXEL_STYLE = ("像素艺术，复古16位像素游戏画面，细腻的像素颗粒与抖动渐变，"
               "电影感宽银幕构图，柔和体积光，无任何文字。")


def workflow(prompt, negative, seed, width, height, steps=30, cfg=2.5):
    """一张图的最小图：UNETLoader → CLIPTextEncode×2 → KSampler → VAEDecode。"""
    return {
        "1": {"class_type": "UNETLoader",
              "inputs": {"unet_name": UNET, "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader",
              "inputs": {"clip_name": CLIP, "type": CLIP_TYPE, "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": VAE}},
        "4": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["2", 0]}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["2", 0]}},
        "7": {"class_type": "EmptyLatentImage",
              "inputs": {"width": width, "height": height, "batch_size": 1}},
        "8": {"class_type": "KSampler",
              "inputs": {"seed": seed, "steps": steps, "cfg": cfg,
                         "sampler_name": "er_sde", "scheduler": "simple", "denoise": 1,
                         "model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0],
                         "latent_image": ["7", 0]}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}},
        "10": {"class_type": "PreviewImage", "inputs": {"images": ["9", 0]}},
    }


def _post(path, payload, timeout=60):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(HOST + path, data=data,
                                 headers={"Content-Type": "application/json"})
    try:
        return json.load(urllib.request.urlopen(req, timeout=timeout))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf8", "replace")[:800]
        raise SystemExit(f"ComfyUI 拒绝了请求 {path}（{e.code}）：{body}\n"
                         f"常见原因：模型文件名不对。用 curl {HOST}/object_info "
                         f"核对 UNETLoader/CLIPLoader/VAELoader 的清单。")
    except urllib.error.URLError as e:
        raise SystemExit(f"连不上 ComfyUI（{HOST}）：{e.reason}\n"
                         f"4090 的 8188 只监听本机，请在服务器上跑，"
                         f"或先 ssh -N -L 8188:127.0.0.1:8188 开隧道。")


def submit(wf):
    return _post("/prompt", {"prompt": wf, "client_id": "to-the-moon"})["prompt_id"]


def wait(pid, timeout=900, poll=2.0):
    """等一个 prompt 跑完，失败时把 ComfyUI 的执行消息打出来。"""
    t0 = time.time()
    while time.time() - t0 < timeout:
        hist = json.load(urllib.request.urlopen(f"{HOST}/history/{pid}", timeout=15))
        if pid in hist:
            entry = hist[pid]
            if entry.get("status", {}).get("status_str") == "success":
                return entry
            msgs = entry.get("status", {}).get("messages", [])
            raise SystemExit(f"[{pid[:8]}] 执行失败：{msgs}")
        time.sleep(poll)
    raise SystemExit(f"[{pid[:8]}] 超时（{timeout}s）")


def fetch(entry, dest_dir, stem):
    """把 PreviewImage 的 temp 图取回来，按 stem 命名写到 dest_dir。"""
    dest_dir = pathlib.Path(dest_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)
    out = []
    for node in entry.get("outputs", {}).values():
        for img in node.get("images", []):
            q = urllib.parse.urlencode({"filename": img["filename"],
                                        "subfolder": img.get("subfolder", ""),
                                        "type": img.get("type", "output")})
            raw = urllib.request.urlopen(f"{HOST}/view?{q}", timeout=120).read()
            p = dest_dir / f"{stem}.png"
            p.write_bytes(raw)
            out.append(p)
    return out


def render(prompt, out_dir, stem, seed, width, height,
           negative=NEG, steps=30, cfg=2.5):
    """提交 → 等 → 取回，返回落地路径列表。"""
    wf = workflow(prompt, negative, seed, width, height, steps=steps, cfg=cfg)
    return fetch(wait(submit(wf)), out_dir, stem)
