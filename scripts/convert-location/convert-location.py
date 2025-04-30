import sys
from pyproj import Transformer

transformer = Transformer.from_crs("EPSG:4326", "EPSG:3857")

def main():
    if len(sys.argv) != 3:
        print("Usage: python convert-location.py <longitude> <latitude>")
        sys.exit(1)

    try:
        lon = float(sys.argv[1])
        lat = float(sys.argv[2])
    except ValueError:
        print("Invalid input. Please provide numeric values for longitude and latitude.")
        sys.exit(1)

    x, y = transformer.transform(lat, lon)
    print(f"Projected coordinates: X = {x}, Y = {y}")

if __name__ == "__main__":
    main()
