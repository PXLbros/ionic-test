# NYSFair (Ionic)

## Build APK for Android testing

### Build app

```sh
ionic capacitor build android --prod
```

### Open Android Studio

Go to `Build` > `Build Bundle(s)/APK(s)` > `Build APK(s)`. Then locate at `android/app/build/outputs/apk/debug/app-debug.apk`

### Install on device

```
Go to Settings > Apps & notifications.
Tap Advanced > Special app access.
Tap Install unknown apps.
Select the app (like Chrome or File Manager) you'll use to install the APK.
Enable Allow from this source.
```

## Generate map

### Find location on OpenStreetMap so it can easily be clicked at

Center: -76.22191,43.07350  
Center: -8484984.642,5323165.667

### Georeference and generate .tif file in QGIS
  - Transformation Type: Linear
  - Resampling method: Nearest neighbour
  - Target SRS: EPSG:3857 – Web Mercator:

Run and it will export a `map_modified.tif` file.
Copy `map_modified.tif` into directory [scripts/generate-map-tiles/input](scripts/generate-map-tiles/input/).

### Convert .tif to Raster Tiles (XYZ format)

From `scripts/generate-map-tiles` directory, run:

```sh
docker build -f Dockerfile.gdal2tiles -t gdal2tiles-gdal38 .
```

```sh
docker run --rm \
  -v $PWD:/data \
  gdal2tiles-gdal38 \
  gdal2tiles.py \
    --profile=mercator \
    --xyz \
    --tilesize=512 \
    --resampling=lanczos \
    --zoom=13-17 \
    --webviewer=none \
    input/map_modified.tif \
    output/map-tiles
```

Optional, use `--tiledriver=webp` to also export a webp version that can be used for modern browsers.
