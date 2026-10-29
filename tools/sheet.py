"""Build a labelled contact sheet from generated plates so they can be reviewed fast."""
import glob
import os
import sys
from PIL import Image, ImageDraw

src = sys.argv[1] if len(sys.argv) > 1 else ".tmp/moss"
out = sys.argv[2] if len(sys.argv) > 2 else ".tmp/moss_sheet.jpg"
files = sorted(f for f in glob.glob(os.path.join(src, "*.png")) if "test_" not in f)

cols = 2
tw, th = 860, 484
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * th), "black")
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((tw - 4, th - 4))
    x, y = (i % cols) * tw + 2, (i // cols) * th + 2
    sheet.paste(im, (x, y))
    d.rectangle([x - 2, y - 2, x + 300, y + 22], fill="black")
    d.text((x + 4, y + 4), os.path.basename(f).replace(".png", ""), fill="yellow")
sheet.save(out, quality=90)
print(out, sheet.size, len(files), "plates")
