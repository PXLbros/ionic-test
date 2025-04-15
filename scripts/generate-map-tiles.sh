#!/usr/bin/env bash

# ========= CONFIG =========

# Source image file path
IMAGE_PATH="public/icons/Map_Design-big-min.png"
GCP_TIF="public/icons/geo_overlay_gcps.tif"
WARPED_TIF="public/icons/geo_overlay_warped.tif"
OUTPUT_TILE_DIR="public/icons/tiles"

# Zoom range
MIN_ZOOM=15
MAX_ZOOM=20

echo "📍 Using GCPs for georeferencing..."

# ========= CLEAN OLD FILES =========

if [ -d "$OUTPUT_TILE_DIR" ]; then
  echo "🧹 Removing existing tile directory: $OUTPUT_TILE_DIR"
  rm -rf "$OUTPUT_TILE_DIR"
fi

if [ -f "$GCP_TIF" ]; then
  echo "🧹 Removing old GCP tif: $GCP_TIF"
  rm "$GCP_TIF"
fi

if [ -f "$WARPED_TIF" ]; then
  echo "🧹 Removing old warped tif: $WARPED_TIF"
  rm "$WARPED_TIF"
fi

# ========= RUN GDAL =========

echo "📌 Running gdal_translate with GCPs..."
gdal_translate \
  -of GTiff \
  -expand rgba \
  -gcp 0    0     -76.21532502658798 43.055330160826315 \
  -gcp 2410 0     -76.23753721914531 43.07114978353832 \
  -gcp 2410 2010  -76.22037084830293 43.08502388194864 \
  -gcp 0    2010  -76.19757700157899 43.06982854755563 \
  "$IMAGE_PATH" \
  "$GCP_TIF"

echo "🌀 Running gdalwarp to project to EPSG:3857..."
gdalwarp \
  -r bilinear \
  -t_srs EPSG:3857 \
  -dstalpha \
  -tps \
  "$GCP_TIF" \
  "$WARPED_TIF"

echo "🧩 Running gdal2tiles.py to generate raster tiles..."
gdal2tiles.py \
  -z $MIN_ZOOM-$MAX_ZOOM \
  --webviewer=none \
  "$WARPED_TIF" \
  "$OUTPUT_TILE_DIR"

echo "✅ Done! Tiles saved to $OUTPUT_TILE_DIR"
