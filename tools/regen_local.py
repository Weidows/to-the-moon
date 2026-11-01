"""用本机 Qwen-Image-2.1 按 tools/jobs/*.json 批量重画（MOSS 模型本机没有）。

用法: python tools/regen_local.py            # 跑完 JOB_SEEDS 里全部
      python tools/regen_local.py pl_river   # 只跑指定 name
"""
import json
import pathlib
import sys
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
HOST = "http://127.0.0.1:8188"
OUT = ROOT / ".tmp" / "moss"
NEG = "worst quality, bad anatomy, watermark, jpeg artifact, text, letters, logo, signature"

# name -> seed（避开服务器时代的旧 seed 段 20261xxx，从 20261701 起）
JOB_SEEDS = {
    "pl_river": 20261701,
    "pl_nasa_v2": 20261702,
    "pl_river_reading": 20261703,
    "pl_rain": 20261704,
    "pl_kids_plane": 20261705,
    "pl_first_meet": 20261706,
    "pl_starfield": 20261707,
    "pl_carnival": 20261708,
    "pl_miss": 20261709,
    "pl_hospital": 20261710,
    "pl_last_request": 20261711,
    "pl_cabin": 20261712,
}


def build(prompt, neg, seed, w=1792, hgt=1008, steps=30, cfg=2.5):
    return {
        "1": {"class_type": "UNETLoader",
              "inputs": {"unet_name": "qwen_image_2.1_int8_convrot.safetensors",
                         "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader",
              "inputs": {"clip_name": "qwen3vl_8b_int8_convrot.safetensors",
                         "type": "qwen_image", "device": "default"}},
        "3": {"class_type": "VAELoader",
              "inputs": {"vae_name": "qwen_image_2.1_vae_bf16.safetensors"}},
        "4": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["2", 0]}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"text": neg, "clip": ["2", 0]}},
        "7": {"class_type": "EmptyLatentImage",
              "inputs": {"width": w, "height": hgt, "batch_size": 1}},
        "8": {"class_type": "KSampler",
              "inputs": {"seed": seed, "steps": steps, "cfg": cfg,
                         "sampler_name": "er_sde", "scheduler": "simple", "denoise": 1,
                         "model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0],
                         "latent_image": ["7", 0]}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}},
        "10": {"class_type": "SaveImage",
               "inputs": {"filename_prefix": "moss/regen", "images": ["9", 0]}},
    }


def post(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(HOST + path, data=data,
                                 headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def wait(pid, timeout=600):
    t0 = time.time()
    while time.time() - t0 < timeout:
        hist = json.load(urllib.request.urlopen(f"{HOST}/history/{pid}", timeout=15))
        if pid in hist:
            return hist[pid]
        time.sleep(2)
    raise TimeoutError(pid)


def save(node_output, stem):
    for img in node_output.get("images", []):
        q = urllib.parse.urlencode({"filename": img["filename"],
                                    "subfolder": img.get("subfolder", ""),
                                    "type": img.get("type", "output")})
        raw = urllib.request.urlopen(HOST + "/view?" + q, timeout=60).read()
        OUT.mkdir(parents=True, exist_ok=True)
        (OUT / f"{stem}.png").write_bytes(raw)


def main():
    only = set(sys.argv[1:])
    jobs = {f.stem: json.loads(f.read_text(encoding="utf8"))
            for f in (ROOT / "tools" / "jobs").glob("*.json")}
    for name, seed in JOB_SEEDS.items():
        if only and name not in only:
            continue
        job = jobs[name]
        wf = build(job["prompt"], job.get("negative", NEG), seed,
                   job.get("width", 1792), job.get("height", 1008))
        pid = post("/prompt", {"prompt": wf, "client_id": "hermes"})["prompt_id"]
        print(f"[{name}] seed={seed} -> {pid}", flush=True)
        hist = wait(pid)
        if hist.get("status", {}).get("status_str") != "success":
            print(f"[{name}] ERROR", flush=True)
            continue
        for n in hist.get("outputs", {}).values():
            save(n, f"{name}_{seed}")
        print(f"[{name}] saved .tmp/moss/{name}_{seed}.png", flush=True)


if __name__ == "__main__":
    main()
