<template>
    <DefaultLayout title="Interactive Map" :showMenuButton="true">
      <div class="main">
        <div class="main__header">

          <div class="wrapper">
            <div class="search-container">
              <input type="text" placeholder="Enter first name here" class="search-input">
              <ion-icon :icon="searchOutline" class="search-icon"></ion-icon>
            </div>
            <div class="group">
              <button class="filter-button">
                <ion-icon size="small" :icon="optionsOutline"></ion-icon>
                Filters
              </button>
              <button class="filter-button">
                <ion-icon size="small" :icon="refreshOutline"></ion-icon>
                Reset
              </button>
            </div>
          </div>

          <div class="filter-tabs">
            <button class="filter-tab">Categories</button>
            <button class="filter-tab">
              Exhibitors
              <ion-icon :icon="chevronDownOutline"></ion-icon>
            </button>
          </div>
        </div>

        <ion-content class="map-container">
          <div class="map" ref="mapContainer"></div>
        </ion-content>
      </div>
    </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue';
import { ref, onMounted } from 'vue';
import {
  IonIcon,
  IonContent,
} from '@ionic/vue';
import { searchOutline, chevronDownOutline, optionsOutline, refreshOutline } from 'ionicons/icons';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, Point, GeoJSON } from 'geojson';

// Access Token for Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicHhsZGV2b3BzIiwiYSI6ImNqZjA2bmpiYjBrNTkzM285dnJobjY5aGMifQ.jw168py37rli1OcHuyI9aw';


interface VendorProperties {
  name: string;
  description: string;
}

// Your Pinia or Vuex store that contains CMS data
import { useDataStore } from '@/stores/data';

const mapContainer = ref<HTMLElement | null>(null);

// Grabbing vendor data from your CMS
const dataStore = useDataStore();
const vendors = dataStore.data.nysfairWebsite.vendors;
console.log('vendors:', vendors); // Ensure these have latitude/longitude

// Convert vendors to GeoJSON
function buildVendorGeoJSON(vendors: any[]): GeoJSON {
  const features: Array<Feature<Point, VendorProperties>> = vendors
    .filter((v) => v.locations && v.locations.length > 0)
    .flatMap((v) => v.locations.map((location: any) => ({
      type: 'Feature' as const,
      properties: {
        name: v.name ?? 'Unknown Vendor',
        description: v.description ?? '',
        id: v.id
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [
          parseFloat(location.longitude),
          parseFloat(location.latitude)
        ]
      }
    })));

  return {
    type: 'FeatureCollection' as const,
    features
  };
}

onMounted(() => {
  if (mapContainer.value) {

    const map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/pxldevops/cm4uef2wm005401sm7ebof1mh',
      center: [-76.2197, 43.073],
      zoom: 14,
      bearing: 222,           // Just matching your original
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      touchZoomRotate: true,
      renderWorldCopies: false,
      preserveDrawingBuffer: true, // Needed for image export

    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      // 1. Image overlay FIRST (so we can put clusters on top)
      const testImage = new Image();
      testImage.onload = () => {
        map.addSource('chevy-court-area', {
          type: 'image',
          url: testImage.src,
          coordinates: [
            [-76.21532502658798, 43.055330160826315],   // Top left
            [-76.23753721914531, 43.07114978353832],  // Top right
            [-76.22037084830293, 43.08502388194864],  // Bottom right
            [-76.19757700157899, 43.06982854755563]    // Bottom left
          ]
        });

        map.addLayer({
          id: 'chevy-court-overlay',
          type: 'raster',
          source: 'chevy-court-area',
          paint: {
            'raster-opacity': 0.85
          }
        });


        // 2. Build real vendor GeoJSON and add as a clustered source
        const vendorGeoJson = buildVendorGeoJSON(vendors);
        console.log('vendorGeoJson:', vendorGeoJson);

        map.addSource('vendors-clustered', {
          type: 'geojson',
          data: vendorGeoJson,
          cluster: true,
          clusterRadius: 50,   // Adjust to taste
          clusterMaxZoom: 14   // Stop clustering beyond zoom 14
        });

        // 3. Add cluster layers (ensuring they're on top of the overlay)
        map.addLayer({
          id: 'vendor-clusters',
          type: 'circle',
          source: 'vendors-clustered',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#1E5EAE',
            'circle-radius': 16,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        map.addLayer({
          id: 'vendor-cluster-count',
          type: 'symbol',
          source: 'vendors-clustered',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12
          },
          paint: {
            'text-color': '#ffffff'
          }
        });

        map.addLayer({
          id: 'vendor-unclustered-point',
          type: 'circle',
          source: 'vendors-clustered',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#EE4722',
            'circle-radius': 7,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        // 4. Add click handlers for vendor points
        map.on('click', 'vendor-unclustered-point', (e) => {
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const coordinates = (feature.geometry as Point).coordinates.slice();
          const { name, description } = feature.properties as VendorProperties;

          // Create popup content
          const popupContent = `
            <div class="vendor-popup">
              <h3>${name}</h3>
              ${description ? `<p>${description}</p>` : ''}
            </div>
          `;

          // Ensure proper positioning at all zoom levels
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates as [number, number])
            .setHTML(popupContent)
            .addTo(map);
        });
      };

      // Make sure the image is valid
      testImage.src = '/icons/Map_Design-big-min.png';

      // 4. Example corners (just debugging)
      const corners = [
        {
          coords: [-76.21532502658798, 43.055330160826315],
          color: '#FF0000',
          label: 'TL'
        },
        {
          coords: [-76.23753721914531, 43.07114978353832],
          color: '#00FF00',
          label: 'TR'
        },
        {
          coords: [-76.22037084830293, 43.08502388194864],
          color: '#0000FF',
          label: 'BR'
        },
        {
          coords: [-76.19757700157899, 43.06982854755563],
          color: '#FFFF00',
          label: 'BL'
        }
      ];

      corners.forEach(corner => {
        const el = document.createElement('div');
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = corner.color;
        el.style.border = '2px solid white';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.textContent = corner.label;

        new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(corner.coords as [number, number])
          .addTo(map);
      });

      // 5. Optional: Click event to see coords
      map.on('click', (e) => {
        console.log(`Clicked coordinates: [${e.lngLat.lng}, ${e.lngLat.lat}]`);
      });

      // Resize map if needed
      setTimeout(() => {
        map.resize();
      }, 100);
    });
  }
});
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #FDD456 0%, #E09B1D 100%);
  padding-bottom: 70px;
}

.wrapper {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
  padding: 20px 20px 0 20px;

  .group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .filter-button {
      background-color: transparent;
      color: #202020;
      font-family: 'inter', sans-serif;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 5px;

      svg {
        font-size: 34px;
      }
    }
  }

  .search-container {
    position: relative;

    .search-input {
      width: 100%;
      padding: 15px 20px;
      border-radius: 15px;
      border: 1px solid #eee;
      background-color: #F4E8AB;
      font-size: 16px;
    }

    .search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
  }



}

.filter-tabs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 14px 20px;
  gap: 6px;

  .filter-tab {
    padding: 10px 20px;
    border: none;
    background: #1F3667;
    color: #F1F1F1;
    font-weight: 700;
    border-radius: 15px;
    height: 50px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'inter', sans-serif;
    flex-grow: 1;
  }
}

.ion-padding {
  height: 60%;
}

.map {
  width: 100%;
  height: 100%;
}

.mapboxgl-canvas {
  width: 100%;
  height: 100%;
}

/* Customize popups, etc. */
:deep .mapboxgl-popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-height: 30vh;
  overflow-y: auto;

  .vendor-popup {

  }

  h3 {
    color: black;
    margin-top: 0;
    font-size: 18px;
    text-align: center;
    font-weight: 600;
  }
  p {
    color: black;
  }
}
</style>
