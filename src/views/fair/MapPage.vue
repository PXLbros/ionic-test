<template>
  <DefaultLayout title="Interactive Map" :showMenuButton="true">
    <div class="main">
      <div class="main__header">
        <div class="wrapper">
          <div class="search-container">
            <input type="text" placeholder="Search for vendors & services" class="search-input">
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
          <button class="filter-tab">Vendors</button>
          <button class="filter-tab">
            Services
            <ion-icon :icon="chevronDownOutline"></ion-icon>
          </button>
          <button class="filter-tab">Categories</button>
        </div>
      </div>

      <ion-content class="map-container">
        <div class="map" ref="mapContainer"></div>

        <!-- Map Legend -->
        <div class="map-legend">
          <h4>Map Legend</h4>
          <div class="legend-item">
            <div class="legend-color vendor"></div>
            <div class="legend-label">Vendors</div>
          </div>
          <div class="legend-item">
            <div class="legend-color service"></div>
            <div class="legend-label">Services</div>
          </div>
        </div>
      </ion-content>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import {
  IonIcon,
  IonContent,
} from '@ionic/vue';
import { searchOutline, chevronDownOutline, optionsOutline, refreshOutline } from 'ionicons/icons';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, Point, FeatureCollection } from 'geojson';

// Access Token for Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicHhsZGV2b3BzIiwiYSI6ImNqZjA2bmpiYjBrNTkzM285dnJobjY5aGMifQ.jw168py37rli1OcHuyI9aw';

// Interfaces for our data
interface VendorProperties {
  name: string;
  description: string;
  id: number;
  type: 'vendor';
}

interface ServiceProperties {
  title: string;
  description: string;
  id: number;
  is_accessible: boolean;
  type: 'service';
  categories: number[];
}

// Your Pinia or Vuex store that contains CMS data
import { useDataStore } from '@/stores/data';

const mapContainer = ref<HTMLElement | null>(null);

// Grabbing data from your CMS
const dataStore = useDataStore();
const vendors = dataStore.data.nysfairWebsite.vendors;
const services = dataStore.data.nysfairWebsite.services;
const serviceCategories = dataStore.data.nysfairWebsite.service_categories;

// Debug logging
console.log('Service Categories:', serviceCategories);
console.log('Sample service data:', services[0]);

// Map reference
let map: Map;

// Convert vendors to GeoJSON features
function buildVendorGeoJSON(vendors: any[]): Array<Feature<Point, VendorProperties>> {
  return vendors
    .filter((v) => v.locations && v.locations.length > 0)
    .flatMap((v) => v.locations.map((location: any) => ({
      type: 'Feature' as const,
      properties: {
        name: v.name ?? 'Unknown Vendor',
        description: v.description ?? '',
        id: v.id,
        type: 'vendor' as const
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [
          parseFloat(location.longitude),
          parseFloat(location.latitude)
        ]
      }
    })));
}

// Convert services to GeoJSON features
function buildServiceGeoJSON(services: any[]): Array<Feature<Point, ServiceProperties>> {
  return services
    .filter((s) => s.latitude && s.longitude) // Make sure latitude and longitude exist
    .map((s) => {
      // Debug single service
      console.log('Processing service:', s.id, s.title);

      return {
        type: 'Feature' as const,
        properties: {
          title: s.title ?? 'Unknown Service',
          description: s.description ?? '',
          id: s.id,
          is_accessible: Boolean(s.is_accessible),
          type: 'service' as const,
          categories: s.categories || [] // Make sure categories is an array
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            parseFloat(s.longitude),
            parseFloat(s.latitude)
          ]
        }
      };
    });
}

// Combine all features into one GeoJSON object
function buildCombinedGeoJSON(): FeatureCollection<Point, VendorProperties | ServiceProperties> {
  const vendorFeatures = buildVendorGeoJSON(vendors);
  console.log('Vendor features:', vendorFeatures.length);

  const serviceFeatures = buildServiceGeoJSON(services);
  console.log('Service features:', serviceFeatures.length);

  return {
    type: 'FeatureCollection' as const,
    features: [...vendorFeatures, ...serviceFeatures]
  };
}

// Get service category name by ID
function getCategoryName(categoryId: number): string {
  const category = serviceCategories.find((cat: any) => cat.id === categoryId);
  return category ? category.name : 'Unknown Category';
}

onMounted(() => {
  if (mapContainer.value) {
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/pxldevops/cm4uef2wm005401sm7ebof1mh',
      center: [-76.2197, 43.073],
      zoom: 14,
      bearing: 222,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      touchZoomRotate: true,
      renderWorldCopies: false,
      preserveDrawingBuffer: true,
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
      // 1. Add image overlay first
      const testImage = new Image();
      testImage.onload = () => {
        if (!map) {
          return;
        }

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

        // 2. Build combined GeoJSON and add as a clustered source
        const combinedGeoJson = buildCombinedGeoJSON();
        console.log('Combined GeoJSON feature count:', combinedGeoJson.features.length);

        map.addSource('points-clustered', {
          type: 'geojson',
          data: combinedGeoJson,
          cluster: true,
          clusterRadius: 50,
          clusterMaxZoom: 14
        });

        // 3. Add cluster layers
        map.addLayer({
          id: 'point-clusters',
          type: 'circle',
          source: 'points-clustered',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#1E5EAE',
            'circle-radius': 16,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        map.addLayer({
          id: 'point-cluster-count',
          type: 'symbol',
          source: 'points-clustered',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12
          },
          paint: {
            'text-color': '#ffffff'
          }
        });

        // 4. Add individual point layers with different colors for vendors and services
        // Vendor points (red)
        map.addLayer({
          id: 'vendor-point',
          type: 'circle',
          source: 'points-clustered',
          filter: [
            'all',
            ['!', ['has', 'point_count']],
            ['==', ['get', 'type'], 'vendor']
          ],
          paint: {
            'circle-color': '#EE4722',
            'circle-radius': 7,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        // Service points (blue)
        map.addLayer({
          id: 'service-point',
          type: 'circle',
          source: 'points-clustered',
          filter: [
            'all',
            ['!', ['has', 'point_count']],
            ['==', ['get', 'type'], 'service']
          ],
          paint: {
            'circle-color': '#1E5EAE',
            'circle-radius': 7,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        // 5. Add click handlers for vendor points
        map.on('click', 'vendor-point', (e) => {
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const coordinates = (feature.geometry as Point).coordinates.slice();
          const { name, description } = feature.properties as VendorProperties;

          // Create popup content
          const popupContent = `
            <div class="vendor-popup">
              <h3>${name}</h3>
              ${description ? `<p>${description}</p>` : ''}
              <p class="popup-type">Vendor</p>
            </div>
          `;

          // Ensure proper positioning
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates as [number, number])
            .setHTML(popupContent)
            .addTo(map);
        });

        // 6. Add click handlers for service points
        map.on('click', 'service-point', (e) => {
          console.log('Service point clicked:', e.features);
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0];
          console.log('Service feature:', feature);

          const coordinates = (feature.geometry as Point).coordinates.slice();
          const props = feature.properties as ServiceProperties;

          console.log('Service properties:', props);

          // Get category names for this service if categories exist
          let categoryNames = '';
          if (props.categories && Array.isArray(props.categories) && props.categories.length > 0) {
            const names = props.categories.map(id => getCategoryName(id));
            categoryNames = `<p><strong>Categories:</strong> ${names.join(', ')}</p>`;
          }

          // Create popup content
          const popupContent = `
            <div class="service-popup">
              <h3>${props.title || 'Unknown Service'}</h3>
              ${props.description ? `<p>${props.description}</p>` : ''}
              ${categoryNames}
              ${props.is_accessible ? `<p><strong>Accessible</strong></p>` : ''}
              <p class="popup-type">Service</p>
            </div>
          `;

          // Ensure proper positioning
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates as [number, number])
            .setHTML(popupContent)
            .addTo(map);
        });

        // 7. Change cursor when hovering over points
        map.on('mouseenter', 'vendor-point', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'vendor-point', () => {
          map.getCanvas().style.cursor = '';
        });

        map.on('mouseenter', 'service-point', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'service-point', () => {
          map.getCanvas().style.cursor = '';
        });

        // Optional: handle clicks on clusters
        map.on('click', 'point-clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['point-clusters'] });
          if (!features || features.length === 0 || !features[0].properties) return;

          const clusterId = features[0].properties.cluster_id;
          if (clusterId === undefined || clusterId === null) {
            console.error('Cluster ID is null or undefined');
            return;
          }

          const source = map.getSource('points-clustered') as mapboxgl.GeoJSONSource;

          source.getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: (features[0].geometry as Point).coordinates as [number, number],
              zoom: zoom ?? map.getZoom()
            });
          });
        });

        // Resize map if needed
        setTimeout(() => {
          map.resize();
        }, 100);
      };

      // Make sure the image is valid
      testImage.src = '/icons/Map_Design-big-min.png';

      // Additionally, register a click handler directly on the map
      // to debug what's being clicked
      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point);
        console.log('All clicked features:', features);
        console.log(`Clicked coordinates: [${e.lngLat.lng}, ${e.lngLat.lat}]`);
      });
    });
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #FDD456 0%, #E09B1D 100%);
  padding-bottom: 90px;
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

/* Customize popups */
:deep .mapboxgl-popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-height: 30vh;
  overflow-y: auto;

  .vendor-popup, .service-popup {
    h3 {
      color: black;
      margin-top: 0;
      font-size: 18px;
      text-align: center;
      font-weight: 600;
    }

    p {
      color: black;
      margin: 8px 0;
    }

    .popup-type {
      margin-top: 12px;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
      padding-top: 8px;
    }
  }

  .service-popup {
    h3 {
      color: #1E5EAE;
    }
  }

  .vendor-popup {
    h3 {
      color: #EE4722;
    }
  }
}

/* Map legend styles */
.map-legend {
  position: absolute;
  bottom: 30px;
  right: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 1;
  max-width: 200px;

  h4 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;

      &.vendor {
        background-color: #EE4722;
      }

      &.service {
        background-color: #1E5EAE;
      }
    }

    .legend-label {
      font-size: 12px;
    }
  }
}
</style>
