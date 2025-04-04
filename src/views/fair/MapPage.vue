<template>
  <DefaultLayout title="Interactive Map" :showMenuButton="true">
    <div class="main">
      <div class="main__header">
        <div class="wrapper">
          <div class="search-container">
            <input type="text" placeholder="Search" class="search-input" v-model="searchQuery" @input="handleLiveSearch" @keyup.enter="handleSearch" @focus="showSearchSuggestions = true">
            <ion-icon :icon="searchOutline" class="search-icon" @click="handleSearch"></ion-icon>
            <div
              class="search-suggestions"
              v-if="showSearchSuggestions && filteredSuggestions.length > 0"
            >
              <div
                v-for="(suggestion, index) in filteredSuggestions"
                :key="index"
                class="suggestion-item"
                @click="selectSuggestion(suggestion)"
              >
                <div class="suggestion-type-badge" :class="suggestion.type">
                  {{ suggestion.type === 'vendor' ? 'Vendor' : 'Service' }}
                </div>
                <div class="suggestion-content">
                  <div class="suggestion-name">{{ suggestion.name }}</div>
                  <div class="suggestion-description" v-if="suggestion.description">
                    {{ truncateText(suggestion.description, 60) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="group">
            <button class="filter-button" @click="toggleFiltersPanel">
              <ion-icon size="small" :icon="optionsOutline"></ion-icon>
              Filter
              <span class="badge" v-if="selectedFilterCount > 0">
                {{ selectedFilterCount }}
              </span>
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
                :class="{ 'active': map.id === currentMapId }"
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

    <!-- Filters Modal -->
    <div class="filter-panel" :class="{ 'filter-panel--open': showFiltersPanel }">
      <div class="filter-panel__header">
        <h3>Filter Options</h3>
        <button class="close-button" @click="toggleFiltersPanel">
          <ion-icon :icon="closeOutline"></ion-icon>
        </button>
      </div>
      <div class="filter-panel__content">
        <h4>Categories</h4>
        <div class="categories-list">
          <div v-if="filteredCategories.length === 0" class="no-categories">
            No categories available for this map
          </div>
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="category-item"
            :class="{ 'category-item--selected': selectedCategories[category.id] }"
            @click="toggleCategory(category.id)"
          >
            <div class="category-checkbox">
              <div class="checkbox-inner" v-if="selectedCategories[category.id]"></div>
            </div>
            <div class="category-name">{{ category.name }}</div>
            <div class="category-count" v-if="category.num_services || category.num_vendors">
              ({{ (category.num_services || 0) + (category.num_vendors || 0) }})
            </div>
          </div>
        </div>
        <div class="filter-actions">
          <button class="action-button apply" @click="applyFilters">Apply Filters</button>
          <button class="action-button clear" @click="clearCategoryFilters">Clear All</button>
        </div>
      </div>
    </div>

    <!-- Backdrop for filter panel -->
    <div
      class="filter-backdrop"
      :class="{ 'filter-backdrop--visible': showFiltersPanel }"
      @click="toggleFiltersPanel"
    ></div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue';
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import {
  IonIcon,
  IonContent,
} from '@ionic/vue';
import { searchOutline, chevronDownOutline, optionsOutline, refreshOutline, closeOutline } from 'ionicons/icons';
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

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  num_services?: number;
  num_vendors?: number;
  maps?: number[];
}

interface SearchSuggestion {
  id: number;
  name: string;
  description?: string;
  type: 'vendor' | 'service';
  longitude: number;
  latitude: number;
  categories?: number[];
}

import { useDataStore } from '@/stores/data';

const mapContainer = ref<HTMLElement | null>(null);
const showMapDropdown = ref(false);
const currentMapId = ref<number | null>(null);
const searchQuery = ref('');
const searchDebounceTimeout = ref<number | null>(null);

// Add new refs for filters modal
const selectedCategories = ref<Record<number, boolean>>({});
const showFiltersPanel = ref(false);
const hasFilterChanges = ref(false);

// Refs for search suggestions
const showSearchSuggestions = ref(false);
const filteredSuggestions = ref<SearchSuggestion[]>([]);
const maxSuggestionsToShow = 5; // Reduced for mobile screens

// Grabbing data from CMS
const dataStore = useDataStore();
const vendors = dataStore.data.nysfairWebsite.vendors;
const services = dataStore.data.nysfairWebsite.services;
const serviceCategories = dataStore.data.nysfairWebsite.service_categories;
const vendorCategories = dataStore.data.nysfairWebsite.vendor_categories;
const serviceMaps = dataStore.data.nysfairWebsite.service_maps;
const vendorMaps = dataStore.data.nysfairWebsite.vendor_maps;

// Combine service maps and vendor maps for the dropdown
const allMaps = computed(() => {
  // Start with service maps
  const combinedMaps = [...serviceMaps];

  // Add vendor maps if they don't already exist in the combined list
  vendorMaps.forEach((vendorMap: ServiceMap) => {
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

// Filter categories based on the current map
const filteredCategories = computed(() => {
  if (!currentMapId.value) return [];

  // Combine service and vendor categories
  const combinedCategories = [
    ...serviceCategories,
    ...vendorCategories
  ];

  // Filter to only show categories related to the current map
  return combinedCategories.filter((category: Category) => {
    // Check if the category has a maps array and includes the current map ID
    return Array.isArray(category.maps) && category.maps.includes(currentMapId.value as number);
  });
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

  // Reset category filters when changing maps
  clearCategoryFilters();

  // Update the map data based on selected map type
  updateMapForSelectedType();
}

// Functions for filters modal

// Toggle filters panel
function toggleFiltersPanel() {
  showFiltersPanel.value = !showFiltersPanel.value;
  console.log('Show filters panel:', showFiltersPanel.value);

  // If closing the panel after changes were made, apply the filters
  if (!showFiltersPanel.value && hasFilterChanges.value) {
    applyFilters();
  }
}

// Toggle a category selection
function toggleCategory(categoryId: number) {
  selectedCategories.value[categoryId] = !selectedCategories.value[categoryId];
  hasFilterChanges.value = true;
}

// Clear all category filters
function clearCategoryFilters() {
  selectedCategories.value = {};
  hasFilterChanges.value = false;
}

// Apply the filters
function applyFilters() {
  updateMapForSelectedType();
  hasFilterChanges.value = false;
  showFiltersPanel.value = false;
}

// Update the map data based on the selected map type and filters
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

// Handle live search as user types
function handleLiveSearch() {
  // Clear any existing timeout
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value);
  }

  // Generate search suggestions as user types
  generateSearchSuggestions();

  // Set a new timeout to avoid too many updates while typing
  searchDebounceTimeout.value = setTimeout(() => {
    updateMapForSelectedType();
  }, 300) as unknown as number;
}

// Reset search and filters
function resetFilters() {
  searchQuery.value = '';
  showSearchSuggestions.value = false;
  filteredSuggestions.value = [];
  clearCategoryFilters();

  // Reset to master map if it exists, otherwise use the first map
  if (masterMap) {
    currentMapId.value = masterMap.id;
  } else if (allMaps.value.length > 0) {
    currentMapId.value = allMaps.value[0].id;
  }
  updateMapForSelectedType();
}

// Check if an item matches the category filters
function matchesCategoryFilters(categories: number[] = []): boolean {
  // If no categories are selected, everything matches
  const hasSelectedCategories = Object.values(selectedCategories.value).some(selected => selected);

  if (!hasSelectedCategories) {
    return true;
  }

  // Check if any of the item's categories are selected
  return categories.some(categoryId => selectedCategories.value[categoryId]);
}

// Convert vendors to GeoJSON features
function buildVendorGeoJSON(vendors: any[]): Array<Feature<Point, VendorProperties>> {
  // Apply filtering by map ID and search query
  let filteredVendors = vendors
    .filter((v) => v.locations && v.locations.length > 0);

  // Filter by map ID for all maps, including master
  if (currentMapId.value !== null) {
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

  // Apply category filtering
  filteredVendors = filteredVendors.filter(v => matchesCategoryFilters(v.categories));

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

  // Filter services by map ID for all maps, including master
  if (currentMapId.value !== null) {
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

  // Apply category filtering
  filteredServices = filteredServices.filter(s => matchesCategoryFilters(s.categories));

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
  // Check service categories first
  const serviceCategory = serviceCategories.find((cat: any) => cat.id === categoryId);
  if (serviceCategory) return serviceCategory.name;
  // Then check vendor categories
  const vendorCategory = vendorCategories.find((cat: any) => cat.id === categoryId);
  return vendorCategory ? vendorCategory.name : 'Unknown Category';
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Generate search suggestions based on current search query
function generateSearchSuggestions() {
  if (!searchQuery.value.trim()) {
    filteredSuggestions.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase().trim();

  // Generate suggestions from vendors
  const vendorSuggestions = vendors
    .filter((v: any) => {
      // Filter by current map
      if (currentMapId.value !== null && (!Array.isArray(v.maps) || !v.maps.includes(currentMapId.value))) {
        return false;
      }

      // Filter by category if selected
      if (Object.values(selectedCategories.value).some(selected => selected)) {
        if (!v.categories || !v.categories.some((catId: number) => selectedCategories.value[catId])) {
          return false;
        }
      }

      // Check if vendor name or description matches the query
      return (v.name && v.name.toLowerCase().includes(query)) ||
             (v.description && v.description.toLowerCase().includes(query));
    })
    .map((v: any) => {
      // Only take the first location for the suggestion
      const location = v.locations && v.locations.length > 0 ? v.locations[0] : null;
      return {
        id: v.id,
        name: v.name || 'Unknown Vendor',
        description: v.description || '',
        type: 'vendor' as const,
        latitude: location ? parseFloat(location.latitude) : 0,
        longitude: location ? parseFloat(location.longitude) : 0,
        categories: v.categories || []
      };
    });

  // Generate suggestions from services
  const serviceSuggestions = services
    .filter((s: any) => {
      // Filter by current map
      if (currentMapId.value !== null && (!Array.isArray(s.maps) || !s.maps.includes(currentMapId.value))) {
        return false;
      }

      // Filter by category if selected
      if (Object.values(selectedCategories.value).some(selected => selected)) {
        if (!s.categories || !s.categories.some((catId: number) => selectedCategories.value[catId])) {
          return false;
        }
      }

      // Check if service title or description matches the query
      return (s.title && s.title.toLowerCase().includes(query)) ||
             (s.description && s.description.toLowerCase().includes(query));
    })
    .map((s: any) => ({
      id: s.id,
      name: s.title || 'Unknown Service',
      description: s.description || '',
      type: 'service' as const,
      latitude: parseFloat(s.latitude) || 0,
      longitude: parseFloat(s.longitude) || 0,
      categories: s.categories || []
    }));

  // Combine and limit the suggestions
  filteredSuggestions.value = [...vendorSuggestions, ...serviceSuggestions]
    .slice(0, maxSuggestionsToShow);
}

// Select a suggestion
function selectSuggestion(suggestion: SearchSuggestion) {
  searchQuery.value = suggestion.name;
  showSearchSuggestions.value = false;

  // Update the map to focus on the selected point
  if (map) {
    map.flyTo({
      center: [suggestion.longitude, suggestion.latitude],
      zoom: 17,
      essential: true
    });

    // Find the feature on the map and show its popup after a short delay
    setTimeout(() => {
      const features = map.queryRenderedFeatures(
        map.project([suggestion.longitude, suggestion.latitude]),
        { layers: suggestion.type === 'vendor' ? ['vendor-point'] : ['service-point'] }
      );

      if (features.length > 0) {
        // Create a synthetic click event
        const clickEvent = {
          lngLat: { lng: suggestion.longitude, lat: suggestion.latitude },
          point: map.project([suggestion.longitude, suggestion.latitude]),
          features: [features.find(f =>
            (suggestion.type === 'vendor' &&
             f.properties &&
             f.properties.id === suggestion.id &&
             f.properties.type === 'vendor') ||
            (suggestion.type === 'service' &&
             f.properties &&
             f.properties.id === suggestion.id &&
             f.properties.type === 'service')
          )]
        };


      }
    }, 500); // Small delay to allow the map to finish flying
  }

  // Also update the map with filtered results
  handleSearch();
}

// Get Number of currently selected filters for badge
const selectedFilterCount = computed(() => {
  return Object.values(selectedCategories.value).filter(Boolean).length;
});

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
          console.log('Service properties:', props);

          // Get category names for this service if categories exist
          let categoryNames = '';

          // Parse categories properly - they might be stringified in the GeoJSON
          let categoriesArray = [];
          if (props.categories) {
            try {
              // If it's a string, try to parse it as JSON
              if (typeof props.categories === 'string') {
                categoriesArray = JSON.parse(props.categories);
              }
              // If it's already an array, use it as is
              else if (Array.isArray(props.categories)) {
                categoriesArray = props.categories;
              }

              if (categoriesArray.length > 0) {
                const names = categoriesArray.map((id: any) => getCategoryName(Number(id)));
                categoryNames = `<p class="popup-category">${names.join(', ')}</p>`;
              }
            } catch (error) {
              console.error('Error parsing categories:', error);
            }
          }

          // Create popup content
          const popupContent = `
            <div class="service-popup">
              <h3>${props.title || 'Unknown Service'}</h3>
              ${props.description ? `<p>${props.description}</p>` : ''}
              ${props.is_accessible ? `<p><strong>Accessible</strong></p>` : ''}
              ${categoryNames}
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
  // Clean up debounce timeout
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value);
  }

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
  background: #FDD456;
  padding-bottom: 90px;
  position: relative;
}

.wrapper {
  display: flex;
  gap: 15px;
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
      position: relative;

      svg {
        font-size: 34px;
      }

      .badge {
        position: absolute;
        top: -10px;
        left: -7px;
        background-color: #1F3667;
        color: #fff;
        border-radius: 50%;
        padding: 4px 6px;
        font-size: 10px;
      }
    }
  }

  .search-container {
    position: relative;
    width: 100%;

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
      cursor: pointer;
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
    justify-content: space-between;
    width: 100%;
  }

  .map-dropdown {
    position: relative;
    flex-grow: 1;
    width: 100%;

    .dropdown-content {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      background-color: #F4E8AB;
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

        &.active {
          background-color: #f0f8ff; /* Light blue background */
          color: #1F3667;
          font-weight: 600; /* Make it slightly bolder */
          position: relative;

          /* Optional: Add a left border or indicator */
          border-left: 3px solid #1F3667;
          padding-left: 17px; /* Adjust padding to account for border */
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);

  .vendor-popup, .service-popup {
    h3 {
      color: black;
      margin-top: 0;
      font-size: 18px;
      text-align: start;
      font-weight: 600;
      line-height: 24px;
      font-family: 'inter', sans-serif;
    }

    p {
      color: black;
      margin: 8px 0;
      font-family: 'inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }

    .popup-category {
      font-size: 12px;
      margin-top: 8px;
      margin-bottom: 0px;
      font-weight: 500;
      background-color: #F4E8AB;
      padding: 4px 8px;
      border-radius: 8px;
      text-align: center;
      width: fit-content;
      line-height: normal;
    }

    .popup-type {
      margin-top: 12px;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eee;
      padding-top: 2px;
      margin-bottom: 0px;
    }
  }


  .service-popup {
    h3 {
      color: #000;
    }
  }

  .vendor-popup {
    h3 {
      color: #000;
    }
  }

  .mapboxgl-popup-close-button {
    top: 8px;
    right: 12px;
    color: black;

    span {
      font-size: 18px;
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

/* Filter Panel Styles */
.filter-panel {
  position: absolute;
  top: 55px;
  left: 0;
  right: 0;
  background-color: #F4E8AB;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 100;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 75vh;
  display: flex;
  flex-direction: column;
  padding-top: 45px;

  &--open {
    transform: translateY(0);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #F4E8AB;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .close-button {
      background: none;
      border: none;
      color: #666;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;

      &:hover {
        background-color: #f5f5f5;
      }
    }
  }

  &__content {
    padding: 16px 20px;
    overflow-y: auto;

    h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #555;
    }
  }
}

/* Categories list styles */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 54px;

  .no-categories {
    color: #666;
    font-style: italic;
    padding: 12px 0;
  }
}

.category-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #F4E8AB;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &--selected {
    // background-color: #E9EFFD;
    background-color: #F4E8AB;

  }

  .category-checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #1F3667;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    .checkbox-inner {
      width: 12px;
      height: 12px;
      background-color: #1F3667;
      border-radius: 2px;
    }
  }

  .category-name {
    flex-grow: 1;
    font-size: 15px;
    color: #333;
  }

  .category-count {
    color: #777;
    font-size: 13px;
    margin-left: 8px;
  }
}

/* Filter actions styles */
.filter-actions {
  display: flex;
  gap: 12px;
  position: absolute;
  bottom: 0px;
  width: 100%;
  left: 0px;
  padding: 10px;
  background: #F4E8AB49;
  backdrop-filter: blur(6px);

  .action-button {
    flex: 1;
    padding: 12px 16px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-size: 15px;
    transition: all 0.2s ease;

    &.apply {
      background-color: #1F3667;
      color: white;

      &:hover {
        background-color: #15264d;
      }
    }

    &.clear {
      background-color: #f0f0f0;
      color: #555;

      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
}

/* Backdrop styles */
.filter-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;

  &--visible {
    opacity: 1;
    visibility: visible;
  }
}

/* Search suggestions styles */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 6px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  width: 90vw;
}

.suggestion-item {
  display: flex;
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-items: center;
  gap: 12px;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:active {
  background-color: #f0f0f0;
}

.suggestion-type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  flex-shrink: 0;
  color: white;
  min-width: 60px;
}

.suggestion-type-badge.vendor {
  background-color: #EE4722;
}

.suggestion-type-badge.service {
  background-color: #1E5EAE;
}

.suggestion-content {
  flex-grow: 1;
  overflow: hidden;
}

.suggestion-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-description {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
