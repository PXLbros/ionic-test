from pathlib import Path
from rio_tiler.io import Reader
from rio_tiler.utils import render
from morecantile import TileMatrixSet

tiff_path = "input/georeferenced-overlay.tif"
output_dir = Path("output")
tile_size = 512
min_zoom = 13
max_zoom = 17

tms = TileMatrixSet.web_mercator()
reader = Reader(tiff_path)

for z in range(min_zoom, max_zoom + 1):
    matrix = tms.matrix(z)

    for x in range(matrix.matrixWidth):
        for y in range(matrix.matrixHeight):
            try:
                tile_data, _ = reader.tile(x, y, z, tilesize=tile_size)
                img = render(tile_data, img_format="PNG")

                out_path = output_dir / str(z) / str(x)
                out_path.mkdir(parents=True, exist_ok=True)

                with open(out_path / f"{y}.png", "wb") as f:
                    f.write(img)

                print(f"✅ {z}/{x}/{y}.png")
            except Exception:
                pass  # Outside bounds or error — skip

reader.close()
