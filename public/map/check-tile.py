import math

def tile_coords_to_latlon(x, y, z):
    n = 2 ** z
    lon_deg = x / n * 360.0 - 180.0
    lat_rad = math.atan(math.sinh(math.pi * (1 - 2 * y / n)))
    lat_deg = math.degrees(lat_rad)
    return (lat_deg, lon_deg)

print(tile_coords_to_latlon(18889, 24059, 16))  # what your app expects
print(tile_coords_to_latlon(18889, 41470, 16))  # what was generated
