FROM python:3.11-slim-bookworm

RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    build-essential \
    python3-dev \
    libjpeg-dev \
    libpng-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Install modern, safe versions
RUN pip install --no-cache-dir \
    rio-tiler==6.1.0 \
    morecantile==4.1.0 \
    Pillow

COPY generate-map-tiles.py /app/generate-map-tiles.py
WORKDIR /app
