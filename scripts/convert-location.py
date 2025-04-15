from pyproj import Transformer

transformer = Transformer.from_crs("EPSG:4326", "EPSG:3857")
coords = [
    (-76.215325, 43.055330),  # top left
    (-76.237537, 43.071149),  # top right
    (-76.220370, 43.085023),  # bottom right
    (-76.197577, 43.069828),  # bottom left
]

projected = [transformer.transform(lat, lon) for lon, lat in coords]
xs, ys = zip(*projected)

print("Xmin:", min(xs))
print("Xmax:", max(xs))
print("Ymin:", min(ys))
print("Ymax:", max(ys))
