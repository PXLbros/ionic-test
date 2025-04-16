from rio_tiler.io import Reader
from rio_tiler.utils import render
from morecantile import tms
from morecantile.utils import tiles
from pathlib import Path

tiff_path = "input/georeferenced-overlay.tif"
output_dir = Path("output")
tile_size = 512
min_zoom = 13
max_zoom = 17

tms = tms.get("WebMercatorQuad")
reader = Reader(tiff_path)
bounds = reader.bounds  # (minx, miny, maxx, maxy)

print(f"🌀 Processing image bounds: {bounds}")

for z in range(min_zoom, max_zoom + 1):
    print(f"🔍 Zoom level: {z}")

    for tile in tiles(*bounds, z, tile_matrix_set=tms):
        x, y = tile.x, tile.y

        try:
            print(f"📦 Generating tile {z}/{x}/{y}...")
            tile_data, _ = reader.tile(x, y, z, tilesize=tile_size)
            img = render(tile_data, img_format="PNG")

            out_path = output_dir / str(z) / str(x)
            out_path.mkdir(parents=True, exist_ok=True)

            with open(out_path / f"{y}.png", "wb") as f:
                f.write(img)

            print(f"✅ Saved {z}/{x}/{y}.png")
        except Exception as e:
            print(f"⚠️ Skipped {z}/{x}/{y} — {e}")

reader.close()
