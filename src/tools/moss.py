"""Submit MOSS-Image (Flux2-class) txt2img jobs to the local ComfyUI and save PNGs.

Mirrors the user's workflow "▶▷MOSS-Image-25&50步-Spectrum加速版", minus the
Spectrum-MOSS acceleration node (that custom node is not installed here, so the
UNET feeds KSampler directly and we simply use more steps):
  UNETLoader(moss_image_sft_int8_convrot) -> KSampler(er_sde/simple)
  CLIPLoader(qwen3.5_9b_w4a8_gptq, type=moss_image) -> CLIPTextEncode
  VAELoader(flux2-vae_small)

Usage:
  python tools/moss.py --job job.json            # one prompt
  python tools/moss.py --job job.json --sweep 2  # N seeds
"""
import argparse
import json
import os
import time
import urllib.parse
import urllib.request
import uuid

HOST = os.environ.get("COMFY_HOST", "http://127.0.0.1:8188")
UNET = "moss_image_sft_int8_convrot.safetensors"
CLIP = "qwen3.5_9b_w4a8_gptq.safetensors"
VAE = "flux2-vae_small.safetensors"
NEG = "worst quality, bad anatomy, watermark, jpeg artifact, text, letters, logo, signature"

CLIENT_ID = str(uuid.uuid4())


def build(prompt, negative, width, height, steps, cfg, seed, prefix):
    return {
        "1": {"class_type": "UNETLoader",
              "inputs": {"unet_name": UNET, "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader",
              "inputs": {"clip_name": CLIP, "type": "moss_image", "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": VAE}},
        "4": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["2", 0]}},
        "5": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["2", 0]}},
        "7": {"class_type": "EmptyLatentImage",
              "inputs": {"width": width, "height": height, "batch_size": 1}},
        "8": {"class_type": "KSampler",
              "inputs": {"seed": seed, "steps": steps, "cfg": cfg, "sampler_name": "er_sde",
                         "scheduler": "simple", "denoise": 1,
                         "model": ["1", 0], "positive": ["4", 0], "negative": ["5", 0],
                         "latent_image": ["7", 0]}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["3", 0]}},
        "10": {"class_type": "SaveImage", "inputs": {"filename_prefix": prefix, "images": ["9", 0]}},
    }


def post(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(HOST + path, data=data,
                                 headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def get(path):
    return json.load(urllib.request.urlopen(HOST + path, timeout=60))


def wait(pid, timeout=1800):
    t0 = time.time()
    last = 0
    while time.time() - t0 < timeout:
        h = get(f"/history/{pid}")
        if pid in h:
            return h[pid]
        q = get("/queue")
        running = sum(1 for item in q.get("queue_running", []) if item and item[1] == pid)
        pending = sum(1 for item in q.get("queue_pending", []) if item and item[1] == pid)
        el = int(time.time() - t0)
        if el - last >= 10:
            print(f"  …{el}s  running={running} pending={pending}", flush=True)
            last = el
        time.sleep(2)
    raise TimeoutError(pid)


def save(node_output, out_dir, stem):
    paths = []
    for img in node_output.get("images", []):
        q = urllib.parse.urlencode({"filename": img["filename"],
                                    "subfolder": img.get("subfolder", ""),
                                    "type": img.get("type", "output")})
        raw = urllib.request.urlopen(HOST + "/view?" + q, timeout=120).read()
        ext = os.path.splitext(img["filename"])[1] or ".png"
        p = os.path.join(out_dir, stem + ext)
        with open(p, "wb") as f:
            f.write(raw)
        paths.append(p)
    return paths


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--job", required=True, help="JSON with {name, prompt, negative?, width, height, steps?, cfg?, seed?}")
    ap.add_argument("--sweep", type=int, default=1)
    ap.add_argument("--out", default=".tmp/moss")
    ap.add_argument("--steps", type=int, default=30)
    ap.add_argument("--cfg", type=float, default=3.0)
    args = ap.parse_args()

    job = json.load(open(args.job, encoding="utf8"))
    os.makedirs(args.out, exist_ok=True)
    results = []

    for i in range(args.sweep):
        seed = job.get("seed", 20261029) + i * 101
        wf = build(job["prompt"], job.get("negative", NEG),
                   job.get("width", 1536), job.get("height", 864),
                   job.get("steps", args.steps), job.get("cfg", args.cfg),
                   seed, f"moss/{job['name']}_{seed}")
        pid = post("/prompt", {"prompt": wf, "client_id": CLIENT_ID})["prompt_id"]
        print(f"[{job['name']}] seed={seed} -> {pid}", flush=True)
        hist = wait(pid)
        status = hist.get("status", {})
        if status.get("status_str") == "error":
            print("ERROR", json.dumps(status, ensure_ascii=False)[:800])
            continue
        outs = [n for n in hist.get("outputs", {}).values() if n.get("images")]
        for n in outs:
            results += save(n, args.out, f"{job['name']}_{seed}")
    print("FILES", results)


if __name__ == "__main__":
    main()
