<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/fair"></ion-back-button>
        </ion-buttons>
        <ion-title>NY State Fair Map</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="main">
        <div class="main__header">
          <div class="main__header-top">
            <h1 class="main__header-text">Interactive <br/>Map</h1>
            <h1 class="main__header-sponsor">Sponsorship</h1>
          </div>

          <div class="filter-tabs">
            <button class="filter-tab">
              <ion-icon :icon="optionsOutline"></ion-icon>
              Filters
            </button>
            <button class="filter-tab">Categories</button>
            <button class="filter-tab">
              Exhibitors
              <ion-icon :icon="chevronDownOutline"></ion-icon>
            </button>
          </div>

          <div class="search-container">
            <input type="text" placeholder="Enter first name here" class="search-input">
            <ion-icon :icon="searchOutline" class="search-icon"></ion-icon>
          </div>
        </div>

        <ion-content class="ion-padding">
          <div class="map" ref="mapContainer"></div>
        </ion-content>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonBackButton,
  IonButtons,
  IonIcon,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { searchOutline, chevronDownOutline, optionsOutline } from 'ionicons/icons';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, FeatureCollection, Point, GeoJSON } from 'geojson';

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
            [-76.22101527351555, 43.06458007331625],   // Top left
            [-76.23286067186764, 43.073228022199714],  // Top right
            [-76.22396000615883, 43.079945790627306],  // Bottom right
            [-76.21212430193944, 43.07221072728862]    // Bottom left
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
      testImage.src = '/icons/Map_Design.png';

      // 4. Example corners (just debugging)
      const corners = [
        {
          coords: [-76.22070391964486, 43.06337289828724],
          color: '#FF0000',
          label: 'TL'
        },
        {
          coords: [-76.23286067186764, 43.073228022199714],
          color: '#00FF00',
          label: 'TR'
        },
        {
          coords: [-76.22434604633837, 43.07969309593861],
          color: '#0000FF',
          label: 'BR'
        },
        {
          coords: [-76.21212430193944, 43.07221072728862],
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
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
}
.main__header {
  &-top {
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
  }

  &-text {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  &-sponsor {
    background-color: #f1f1f1;
    padding: 10px 20px;
    line-height: 40px;
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    border-radius: 5px;
  }
}

.search-container {
  margin: 0 30px;
  position: relative;

  .search-input {
    width: 100%;
    padding: 15px 20px;
    border-radius: 25px;
    border: 1px solid #eee;
    background-color: transparent;
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

.filter-tabs {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 30px;

  .filter-tab {
    padding: 10px 20px;
    border: none;
    background: transparent;
    color: #333;
    font-weight: 700;
    border-radius: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.ion-padding {
  height: 60%;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.mapboxgl-canvas {
  width: 100%;
  height: 100%;
  border-radius: 30px;
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
