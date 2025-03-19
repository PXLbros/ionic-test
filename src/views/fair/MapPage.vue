<!-- Changes to make in the template section -->
<template>
  <DefaultLayout title="Interactive Map" :showMenuButton="true">
    <div class="main">
      <div class="main__header">
        <div class="wrapper">
          <div class="search-container">
            <input type="text" placeholder="Search for vendors & services" class="search-input" v-model="searchQuery" @keyup.enter="handleSearch">
            <ion-icon :icon="searchOutline" class="search-icon"></ion-icon>
          </div>
          <div class="group">
            <button class="filter-button" @click="handleSearch">
              <ion-icon size="small" :icon="optionsOutline"></ion-icon>
              Filter
            </button>
            <button class="filter-button" @click="resetFilters">
              <ion-icon size="small" :icon="refreshOutline"></ion-icon>
              Reset
            </button>
          </div>
        </div>

        <div class="filter-tabs">
          <div class="map-dropdown">
            <button class="filter-tab" @click="toggleMapDropdown">
              {{ currentMapName }}
              <ion-icon :icon="chevronDownOutline"></ion-icon>
            </button>
            <div class="dropdown-content" v-if="showMapDropdown">
              <div
                v-for="map in allMaps"
                :key="map.id"
                class="dropdown-item"
                @click="selectMap(map)"
              >
                {{ map.name }}
              </div>
            </div>
          </div>
          <!-- <button class="filter-tab">Exhibitors</button> -->
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
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
  categories?: number[];
}

interface ServiceProperties {
  title: string;
  description: string;
  id: number;
  is_accessible: boolean;
  type: 'service';
  categories: number[];
}

interface ServiceMap {
  id: number;
  name: string;
  slug: string;
  num_services?: number;
  num_vendors?: number;
}

// Your Pinia or Vuex store that contains CMS data
import { useDataStore } from '@/stores/data';

const mapContainer = ref<HTMLElement | null>(null);
const showMapDropdown = ref(false);
const currentMapId = ref<number | null>(null);
const searchQuery = ref('');

// Grabbing data from your CMS
const dataStore = useDataStore();
const vendors = dataStore.data.nysfairWebsite.vendors;
const services = dataStore.data.nysfairWebsite.services;
const serviceCategories = dataStore.data.nysfairWebsite.service_categories;
const serviceMaps = dataStore.data.nysfairWebsite.service_maps;
const vendorMaps = dataStore.data.nysfairWebsite.vendor_maps;

// Combine service maps and vendor maps for the dropdown
const allMaps = computed(() => {
  // Start with service maps
  const combinedMaps = [...serviceMaps];

  // Add vendor maps if they don't already exist in the combined list
  vendorMaps.forEach(vendorMap => {
    if (!combinedMaps.some(map => map.id === vendorMap.id)) {
      combinedMaps.push(vendorMap);
    }
  });

  return combinedMaps;
});

// Find the master map ID
const masterMap = allMaps.value.find((map: any) => map.slug === 'master');
currentMapId.value = masterMap?.id ?? allMaps.value[0]?.id ?? null;

// Get the current map name for display
const currentMapName = computed(() => {
  const map = allMaps.value.find((m: any) => m.id === currentMapId.value);
  return map ? map.name : 'Maps';
});

// Map reference
let map: Map;

// Toggle dropdown visibility
function toggleMapDropdown() {
  showMapDropdown.value = !showMapDropdown.value;
}

// Close dropdown when clicking elsewhere
function closeDropdownOnOutsideClick(event: MouseEvent) {
  const dropdown = document.querySelector('.map-dropdown');
  if (dropdown && !dropdown.contains(event.target as Node) && showMapDropdown.value) {
    showMapDropdown.value = false;
  }
}

// Select a map type and update the display
function selectMap(mapData: ServiceMap) {
  currentMapId.value = mapData.id;
  showMapDropdown.value = false;

  // Update the map data based on selected map type
  updateMapForSelectedType();
}

// Update the map data based on the selected map type
function updateMapForSelectedType() {
  if (!map || !currentMapId.value) return;

  // Get the GeoJSON source
  const source = map.getSource('points-clustered') as mapboxgl.GeoJSONSource;
  if (!source) return;

  // Update the data with filtered GeoJSON
  const filteredGeoJson = buildFilteredGeoJSON();
  source.setData(filteredGeoJson);
}

// Handle search input
function handleSearch() {
  updateMapForSelectedType();
}

// Reset search and filters
function resetFilters() {
  searchQuery.value = '';
  // Reset to master map if it exists, otherwise use the first map
  if (masterMap) {
    currentMapId.value = masterMap.id;
  } else if (allMaps.value.length > 0) {
    currentMapId.value = allMaps.value[0].id;
  }
  updateMapForSelectedType();
}

// Convert vendors to GeoJSON features
function buildVendorGeoJSON(vendors: any[]): Array<Feature<Point, VendorProperties>> {
  // Apply filtering by map ID and search query
  let filteredVendors = vendors
    .filter((v) => v.locations && v.locations.length > 0);

  // Filter by map ID if it's not the master map
  if (currentMapId.value !== null && masterMap && currentMapId.value !== masterMap.id) {
    filteredVendors = filteredVendors.filter((v) => {
      // Check if the vendor has maps array and it includes the current map ID
      return Array.isArray(v.maps) && v.maps.includes(currentMapId.value);
    });
  }

  // Apply search filtering
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase();
    filteredVendors = filteredVendors.filter(v =>
      (v.name && v.name.toLowerCase().includes(query)) ||
      (v.description && v.description.toLowerCase().includes(query))
    );
  }

  return filteredVendors.flatMap((v) => v.locations.map((location: any) => ({
    type: 'Feature' as const,
    properties: {
      name: v.name ?? 'Unknown Vendor',
      description: v.description ?? '',
      id: v.id,
      type: 'vendor' as const,
      categories: v.categories || []
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

// Convert services to GeoJSON features, filtering by map ID if needed
function buildServiceGeoJSON(services: any[]): Array<Feature<Point, ServiceProperties>> {
  let filteredServices = services;

  // Filter services by map ID if it's not the master map
  if (currentMapId.value !== null && masterMap && currentMapId.value !== masterMap.id) {
    filteredServices = services.filter((s) => {
      // Check if the service is in the selected map
      return Array.isArray(s.maps) && s.maps.includes(currentMapId.value);
    });
  }

  // Apply search filtering
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase();
    filteredServices = filteredServices.filter(s =>
      (s.title && s.title.toLowerCase().includes(query)) ||
      (s.description && s.description.toLowerCase().includes(query))
    );
  }

  return filteredServices
    .filter((s) => s.latitude && s.longitude) // Make sure latitude and longitude exist
    .map((s) => ({
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
    }));
}

// Build GeoJSON for the currently selected map type
function buildFilteredGeoJSON(): FeatureCollection<Point, VendorProperties | ServiceProperties> {
  const vendorFeatures = buildVendorGeoJSON(vendors);
  const serviceFeatures = buildServiceGeoJSON(services);

  console.log(`Map ${currentMapId.value}: ${serviceFeatures.length} services, ${vendorFeatures.length} vendors`);

  return {
    type: 'FeatureCollection' as const,
    features: [...vendorFeatures, ...serviceFeatures]
  };
}

// Initial GeoJSON build for map initialization
function buildCombinedGeoJSON(): FeatureCollection<Point, VendorProperties | ServiceProperties> {
  return buildFilteredGeoJSON();
}

// Get service category name by ID
function getCategoryName(categoryId: number): string {
  const category = serviceCategories.find((cat: any) => cat.id === categoryId);
  return category ? category.name : 'Unknown Category';
}

onMounted(() => {
  // Setup listener for closing dropdown when clicking outside
  document.addEventListener('click', closeDropdownOnOutsideClick);

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
        console.log('Initial GeoJSON feature count:', combinedGeoJson.features.length);

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
          if (!e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const coordinates = (feature.geometry as Point).coordinates.slice();
          const props = feature.properties as ServiceProperties;

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
    });
  }
});

onUnmounted(() => {
  // Clean up event listener
  document.removeEventListener('click', closeDropdownOnOutsideClick);

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

  .map-dropdown {
    position: relative;
    flex-grow: 1;

    .dropdown-content {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-top: 6px;
      max-height: 300px;
      overflow-y: auto;

      .dropdown-item {
        padding: 12px 20px;
        color: #333;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;

        &:hover {
          background-color: #f5f5f5;
        }

        &:first-child {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }

        &:last-child {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
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
