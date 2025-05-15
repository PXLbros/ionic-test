<template>
  <FairLayout title="Interactive Map" :showMenuButton="true">
    <div :class="{ 'main--full-height': showSearchSuggestions }" class="main">
      <div class="main__header">
        <div ref="searchWrapperElement" class="wrapper wrapper--search">
          <div class="search-container" ref="wrapperSearchElement">
            <input
              type="text"
              placeholder="Search"
              class="search-input"
              v-model="searchQuery"
              @input="handleLiveSearch"
              @keyup.enter="handleSearch"
              @focus="handleFocus"
              @blur="handleBlur"
            />
            <ion-icon
              :icon="showSearchSuggestions ? closeOutline : searchOutline"
              class="search-icon"
              @click="clearSearch"
            ></ion-icon>
            <div
              class="search-suggestions"
              ref="searchSuggestionsElement"
              v-show="showSearchSuggestions && filteredSuggestions.length > 0"
            >
              <div
                v-for="(suggestion, index) in filteredSuggestions"
                :key="index"
                class="suggestion-item"
                @click="selectSuggestion(suggestion)"
              >
                <!-- <div class="suggestion-type-badge" :class="suggestion.type">
                  {{ suggestion.type === 'vendor' ? 'Vendor' : 'Service' }}
                </div> -->
                <div class="suggestion-content">
                  <div class="suggestion-name">{{ suggestion.name }}</div>

                  <span class="suggestion-map-badge">
                    {{ suggestion.mapName }}
                  </span>

                  <div class="suggestion-description" v-if="suggestion.description">
                    {{ truncateText(suggestion.description, 60) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="group">
            <button class="filter-button" @click="toggleFiltersPanel">
              <ion-icon :icon="optionsOutline" class="filter-icon"></ion-icon>

              <span class="badge" v-if="selectedFilterCount > 0">
                {{ selectedFilterCount }}
              </span>
            </button>
          </div>
          <div class="sponsored-column">
            <img :src="sponsorshipMicronSvg" />
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
                :class="{ 'active': map.slug === currentMapSlug }"
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

        <div v-if="isDebugMode" class="opacity-control">
          <div class="opacity-label">Overlay Opacity</div>
          <div class="opacity-row">
            <input
              type="range"
              min="0"
              max="100"
              :value="mapOpacity * 100"
              @input="updateMapOpacity($event)"
              class="opacity-slider"
            />
            <div class="opacity-value">{{ Math.round(mapOpacity * 100) }}%</div>
          </div>
          <div class="opacity-label">Cluster Radius</div>
          <div class="opacity-row">
            <input
              type="range"
              min="10"
              max="100"
              :value="mapClusterRadius"
              @input="(e: any) => { mapClusterRadius = parseInt(e.target.value); debouncedUpdateClusterSettings(); }"
              class="opacity-slider"
            />
            <div class="opacity-value">{{ mapClusterRadius }}</div>
          </div>
          <div class="opacity-label">Min Points in Cluster</div>
          <div class="opacity-row">
            <input
              type="range"
              min="1"
              max="20"
              :value="mapClusterMinPoints"
              @input="(e: any) => { mapClusterMinPoints = parseInt(e.target.value); debouncedUpdateClusterSettings(); }"
              class="opacity-slider"
            />
            <div class="opacity-value">{{ mapClusterMinPoints }}</div>
          </div>
          <div class="opacity-label">Cluster Zoom-In Amount</div>
          <div class="opacity-row">
            <input
              type="range"
              min="0.1"
              max="4"
              step="0.1"
              v-model.number="clusterClickZoomInAmount"
              class="opacity-slider"
            />
            <div class="opacity-value">{{ clusterClickZoomInAmount.toFixed(2) }}</div>
          </div>
          <div class="zoom-level"><strong>Zoom Level</strong> {{ currentZoomLevel.toFixed(2) }}</div>
        </div>
      </ion-content>
    </div>

    <!-- Filters Modal -->
    <div class="filter-panel" :class="{ 'filter-panel--open': showFiltersPanel }">
      <div class="filter-panel__header">
        <div class="filter-panel__header-column filter-panel__header-column--left">
          <button class="close-button" @click="toggleFiltersPanel">
            <ion-icon :icon="closeOutline"></ion-icon>
          </button>
          <span>Filters</span>
        </div>

        <div class="filter-panel__header-column filter-panel__header-column--right">
          <span>
            Reset
          </span>
        </div>
      </div>
      <div class="filter-panel__content">
        <!-- Group categories by map -->
        <div v-for="map in allMaps" :key="map.id" class="map-category-group">
          <h4>{{ map.name }}</h4>
          <div class="categories-list">
            <div
              v-if="filteredCategories.filter(category => category.map_slugs.includes(map.slug)).length === 0"
              class="no-categories"
            >
              No categories available for this map
            </div>
            <div
              v-for="category in filteredCategories.filter(category => category.map_slugs.includes(map.slug))"
              :key="category.id"
              class="category-item"
              :class="{ 'category-item--selected': selectedCategories[category.id] }"
              @click="toggleCategory(category.id)"
            >
              <div class="category-name">{{ category.name }}</div>
              <!-- <div class="category-count" v-if="category.num_services || category.num_vendors">
                ({{ (category.num_services || 0) + (category.num_vendors || 0) }})
              </div> -->
              <div class="category-checkbox">
                <div class="checkbox-inner" v-if="selectedCategories[category.id]"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-actions">
          <button class="action-button apply" @click="applyFilters">Apply</button>
          <button class="action-button clear" @click="clearCategoryFilters">Clear</button>
        </div>
      </div>
    </div>

    <!-- Backdrop for filter panel -->
    <div
      class="filter-backdrop"
      :class="{ 'filter-backdrop--visible': showFiltersPanel }"
      @click="toggleFiltersPanel"
    ></div>
  </FairLayout>
</template>

<script setup lang="ts">
import FairLayout from '@/layouts/fair.vue';
import {
  IonIcon,
  IonContent,
} from '@ionic/vue';
import { searchOutline, chevronDownOutline, optionsOutline, closeOutline } from 'ionicons/icons';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, Point, FeatureCollection } from 'geojson';
import { loadCategoryIcons, setupIconClickHandlers, addMapClusterIconLayer, addMapIconLayer, getMapClusterIconImageExpression, getMapIconImageExpression, MapLayer, MapSource } from '@/utils/MapIconUtils';
import { ServiceMap, VendorProperties, ServiceProperties, Category, SearchSuggestion } from '@/types';
import { useLogger } from '@/composables/useLogger';
import { cloneDeep } from '@/utils/clone';
import { useDataStore } from '@/stores/data';
import appConfig from '@/config/app';
import { debounce } from '@/utils/time';
import sponsorshipMicronSvg from '@/imgs/svg/sponsorship-micron.svg';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_ACCESS_TOKEN as string;

// const DEFAULT_MAP_CENTER: [number, number] = [-76.2197, 43.073];
const DEFAULT_MAP_POSITION: [number, number] = [-76.21574762336711, 43.07169622575907];
const DEFAULT_MAP_ZOOM = 16;
const DEFAULT_MAP_BEARING = 222; // In degrees
const DEFAULT_MAP_NAME = 'food-beverage';

const MAP_MIN_ZOOM = 13;
const MAP_MAX_ZOOM = 19;

const DEFAULT_MAP_CLUSTER_RADIUS = 23;
const DEFAULT_MAP_CLUSTER_MIN_POINTS = 3;
const DEFAULT_MAP_CLUSTER_CLICK_ZOOM_IN_AMOUNT = 2;

const mapClusterRadius = ref(DEFAULT_MAP_CLUSTER_RADIUS);
const mapClusterMinPoints = ref(DEFAULT_MAP_CLUSTER_MIN_POINTS);

const MAP_MAX_BOUNDS: [[number, number], [number, number]] = [
  [-76.23600195804164, 43.05946664729794], // Top-left (SW)
  [-76.20036371823731, 43.0845174767999],  // Bottom-right (NE)
];

const isLoadingMap = ref(true);

const mapContainer = ref<HTMLElement | null>(null);

const showMapDropdown = ref(false);
const currentMapSlug = ref<string | null>(null);
const searchQuery = ref('');
const searchDebounceTimeout = ref<number | null>(null);

const searchWrapperElement = ref<HTMLElement | null>(null);

// Add new refs for filters modal
const selectedCategories = ref<Record<number, boolean>>({});
const showFiltersPanel = ref(false);
const hasFilterChanges = ref(false);

// Add map opacity state variable
const mapOpacity = ref(1); // Default to fully visible (100%)

// Refs for search suggestions
const showSearchSuggestions = ref(false);
const filteredSuggestions = ref<SearchSuggestion[]>([]);
const maxSuggestionsToShow = 5;

// New ref for zoom-in amount past cluster expansion
const clusterClickZoomInAmount = ref(DEFAULT_MAP_CLUSTER_CLICK_ZOOM_IN_AMOUNT); // Default value for zoom-in past expansion

const logger = useLogger();

// Grabbing data from CMS
const appStore = useAppStore();
const dataStore = useDataStore();

// isdebug mode if ?debug=1
const isDebugMode = ref(true); // ref(new URLSearchParams(window.location.search).get('debug') === '1');

const isWebPSupported = ref(false);

const clusterConfigByZoomRange = [
  {
    minZoom: MAP_MIN_ZOOM,
    maxZoom: 16,
    clusterRadius: DEFAULT_MAP_CLUSTER_RADIUS,
    clusterMinPoints: DEFAULT_MAP_CLUSTER_MIN_POINTS,
    clusterClickZoomInAmount: DEFAULT_MAP_CLUSTER_CLICK_ZOOM_IN_AMOUNT,
  },
  {
    minZoom: 16,
    maxZoom: MAP_MAX_ZOOM + 1,
    clusterRadius: 66,
    clusterMinPoints: 6,
    clusterClickZoomInAmount: 1.5,
  }
];

function getClusterConfig(zoom: number) {
  for (const config of clusterConfigByZoomRange) {
    if (zoom >= config.minZoom && zoom < config.maxZoom) {
      return config;
    }
  }

  console.warn(`No cluster config found for zoom ${zoom}, using default.`);

  return {
    clusterRadius: DEFAULT_MAP_CLUSTER_RADIUS,
    clusterMinPoints: DEFAULT_MAP_CLUSTER_MIN_POINTS,
    clusterClickZoomInAmount: DEFAULT_MAP_CLUSTER_CLICK_ZOOM_IN_AMOUNT,
  };
}

const vendors = dataStore.data.nysfairWebsite.vendors;
const services = dataStore.data.nysfairWebsite.services;
const serviceCategories = dataStore.data.nysfairWebsite.service_categories;
const vendorCategories = dataStore.data.nysfairWebsite.vendor_categories;
// const serviceMaps = dataStore.data.nysfairWebsite.service_maps;
// const vendorMaps = dataStore.data.nysfairWebsite.vendor_maps;
const maps = dataStore.data.nysfairWebsite.maps;

const allMaps = computed(() => maps);

const searchSuggestionsElement = ref<HTMLElement | null>(null);
const wrapperSearchElement = ref<HTMLElement | null>(null);

// Find the master map by its slug
const defaultMap = allMaps.value.find((map: any) => map.slug === DEFAULT_MAP_NAME);
currentMapSlug.value = defaultMap?.slug ?? allMaps.value[0]?.slug ?? null;

// Get the current map name for display using the slug
const currentMapName = computed(() => {
  const map = allMaps.value.find((m: any) => m.slug === currentMapSlug.value);
  return map ? map.name : 'Maps';
});

// Filter categories based on the current map slug
const filteredCategories = computed(() => {
  if (!currentMapSlug.value) {
    return [];
  }

  // Combine service and vendor categories
  const combinedCategories = [
    ...serviceCategories,
    ...vendorCategories
  ];

  // Filter to only show categories related to the current map by slug
  return combinedCategories.filter((category: Category) => {
    // Check if the category has a map_slugs array and includes the current map slug
    return (
      (Array.isArray(category.map_slugs) && category.map_slugs.includes(currentMapSlug.value as string))
    );
  });
});

const currentMapIndex = computed(() => {
  const currentMapIndex = allMaps.value.findIndex((map: any) => map.slug === currentMapSlug.value);

  return currentMapIndex;
});

watch(currentMapIndex, (newMapIndex) => {
  if (mapboxMap.getLayer(MapLayer.MapClusterIcon)) {
    mapboxMap.setLayoutProperty(
      MapLayer.MapClusterIcon,
      'icon-image',
      getMapClusterIconImageExpression({ maps: allMaps.value, currentMapIndex: newMapIndex }),
    );

    mapboxMap.setLayoutProperty(
      MapLayer.MapIcon,
      'icon-image',
      getMapIconImageExpression({ maps: allMaps.value, currentMapIndex: newMapIndex }),
    );
  }
});

// Hide bottom bar when search suggestions are shown
watch(showSearchSuggestions, (newShowSearchSuggestionsValue) => {
  appStore.bottomBar.isVisible = !newShowSearchSuggestionsValue;

  // nextTick(() => {
  //   if (mapboxMap) {
  //     mapboxMap.resize();
  //   }
  // });
});

// Map reference - update the type to use the renamed import
let mapboxMap: MapboxMap;
// Store icon click handler cleanup function
let iconClickHandlersCleanup: (() => void) | null = null;

// Track map readiness state
const mapSourcesReady = ref(false);
const pendingMapUpdates = ref<(() => void)[]>([]);

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

// Select a map type using slug instead of ID
function selectMap(mapData: ServiceMap) {
  // Store previous map slug for comparison
  const previousMapSlug = currentMapSlug.value;

  // Update current map slug and close dropdown
  currentMapSlug.value = mapData.slug;
  showMapDropdown.value = false;

  // Reset search and filters
  searchQuery.value = '';
  clearCategoryFilters();

  // Check if this is a significant map change
  const isDifferentMap = previousMapSlug !== mapData.slug;

  if (isDifferentMap) {
    logger.info('Switching map', {
      'Slug': mapData.slug,
      'Name': mapData.name,
      'Type': mapData.type,
    });
  }

  // Request map update
  updateMapForSelectedType();
}

// Toggle filters panel
function toggleFiltersPanel() {
  showFiltersPanel.value = !showFiltersPanel.value;

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

// Update the map data based on the selected map slug and filters
function updateMapForSelectedType() {
  if (!mapboxMap) {
    logger.warn('Cannot update map: Map not initialized');
    return;
  }

  if (!currentMapSlug.value) {
    logger.warn('Cannot update map: No map slug selected');
    return;
  }

  // If map sources are not ready yet, queue the update for later
  if (!mapSourcesReady.value) {
    logger.info('Queueing map update - sources not ready yet');

    // Add this update request to the queue
    pendingMapUpdates.value.push(() => {
      safeUpdateMapSource();
    });

    return;
  }

  // If we get here, sources are ready so we can update directly
  safeUpdateMapSource();
}

// Safely update the map source with error handling
function safeUpdateMapSource() {
  try {
    if (!mapboxMap) {
      return;
    }

    // Check if source exists before updating
    const source = mapboxMap.getSource(MapSource.PointsClustered) as mapboxgl.GeoJSONSource;

    if (!source) {
      logger.warn('Map source "points-clustered" not found');
      return;
    }

    // Build new GeoJSON data
    const filteredGeoJson = buildCombinedGeoJSONCollection();

    // Update the data source
    source.setData(filteredGeoJson);

    logger.info('Updated map source with new data', {
      'Map Slug': currentMapSlug.value,
      'Features': filteredGeoJson.features.length,
    });
  } catch (error) {
    logger.error('Error updating map source:', error);
  }
}

// Process any pending map updates
function processPendingMapUpdates() {
  if (pendingMapUpdates.value.length > 0) {
    logger.info(`Processing ${pendingMapUpdates.value.length} pending map updates`);

    // Execute each queued update function
    pendingMapUpdates.value.forEach(updateFn => {
      try {
        updateFn();
      } catch (error) {
        logger.error('Error processing queued map update:', error);
      }
    });

    // Clear the queue after processing
    pendingMapUpdates.value = [];
  }
}

// Handle search input
function handleSearch() {
  // Hide suggestions immediately on Enter
  showSearchSuggestions.value = false;

  // If there's a selected suggestion in the search query, try to focus on it
  const matchingSuggestion = filteredSuggestions.value.find(s =>
    s.name.toLowerCase() === searchQuery.value.toLowerCase()
  );

  if (matchingSuggestion) {
    selectSuggestion(matchingSuggestion);
    return;
  }

  // Otherwise, update the map to show filtered results on current map
  updateMapForSelectedType();
}

// Handle live search as user types
function handleLiveSearch() {
  // Clear any existing timeout
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value);
  }

  // Show suggestions panel
  if (showSearchSuggestions.value !== true) {
    openSearchSuggestions();
  }

  // If input is empty, show initial suggestions instead
  if (!searchQuery.value.trim()) {
    generateInitialSuggestions();
  } else {
    // Otherwise generate filtered suggestions based on input
    generateSearchSuggestions();
  }

  // Set a new timeout to avoid too many updates while typing
  searchDebounceTimeout.value = setTimeout(() => {
    updateMapForSelectedType();
  }, 300) as unknown as number;
}

function openSearchSuggestions() {
  if (searchSuggestionsElement.value && wrapperSearchElement.value) {
    const wrapperBottom = wrapperSearchElement.value.getBoundingClientRect().bottom;
    const searchSuggestionsTopPosition = wrapperBottom + 13;

    searchSuggestionsElement.value.style.top = `${searchSuggestionsTopPosition}px`;
  }

  showSearchSuggestions.value = true;
}

function handleFocus() {
  openSearchSuggestions();

  searchWrapperElement?.value?.classList.add('wrapper--search-focused');

  // Generate initial suggestions without requiring any text input
  generateInitialSuggestions();
}

// When the input loses focus, hide the suggestions after a short delay
function handleBlur() {
}

function generateInitialSuggestions() {
  // If there's already a search query, use the standard search function
  if (searchQuery.value.trim()) {
    generateSearchSuggestions();

    return;
  }

  // Get map names for lookup
  const mapNamesBySlug: Record<string, string> = {};

  allMaps.value.forEach((map: ServiceMap) => {
    mapNamesBySlug[map.slug] = map.name;
  });

  // Vendor suggestions - get from ALL maps
  const vendorSuggestions = vendors
    .filter((v: any) => {
      // Only include vendors that belong to at least one map
      const hasMapSlug = Array.isArray(v.map_slugs) && v.map_slugs.length > 0;
      const hasMapId = Array.isArray(v.maps) && v.maps.length > 0;

      if (!hasMapSlug && !hasMapId) {
        return false;
      }

      // Only filter by category if selected
      if (Object.values(selectedCategories.value).some(selected => selected)) {
        if (!v.categories || !v.categories.some((catId: number) => selectedCategories.value[catId])) {
          return false;
        }
      }

      // Make sure it has locations
      return v.locations && v.locations.length > 0;
    })
    .map((v: any) => {
      // Only take the first location for the suggestion
      const location = v.locations && v.locations.length > 0 ? v.locations[0] : null;

      if (!location) {
        return null; // Skip vendors without valid location
      }

      // Get map slug (first one if multiple)
      const mapSlug = Array.isArray(v.map_slugs) && v.map_slugs.length > 0 ? v.map_slugs[0] :
                     (Array.isArray(v.maps) && v.maps.length > 0 ?
                      (allMaps.value.find((m: any) => m.id === v.maps[0])?.slug || null) : null);

      // If no map is associated, use the current map as fallback
      const effectiveMapSlug = mapSlug || currentMapSlug.value;
      const effectiveMapName = effectiveMapSlug ? mapNamesBySlug[effectiveMapSlug] : 'General Map';

      return {
        id: v.id,
        name: v.name || 'Unknown Vendor',
        description: v.description || '',
        type: 'vendor' as const,
        latitude: parseFloat(location.latitude) || 0,
        longitude: parseFloat(location.longitude) || 0,
        categories: [...normalizeCategories(v.categories || [])],
        mapSlug: effectiveMapSlug,
        mapName: effectiveMapName
      };
    })
    .filter((v: any) => v && v.latitude && v.longitude); // Only include vendors with valid coordinates

  const query = searchQuery.value.toLowerCase().trim();

  const serviceSuggestions = services
    .filter((s: any) => {
      // Only include services that match the search query
      const nameMatch = s.name && s.name.toLowerCase().includes(query);
      const descriptionMatch = s.description && s.description.toLowerCase().includes(query);

      if (!nameMatch && !descriptionMatch) {
        return false;
      }

      // Only include services that belong to at least one map
      const hasMapSlug = Array.isArray(s.map_slugs) && s.map_slugs.length > 0;
      const hasMapId = Array.isArray(s.maps) && s.maps.length > 0;

      if (!hasMapSlug && !hasMapId) {
        return false;
      }

      // Only filter by category if selected
      if (Object.values(selectedCategories.value).some(selected => selected)) {
        if (!s.categories || !s.categories.some((catId: number) => selectedCategories.value[catId])) {
          return false;
        }
      }

      // Make sure it has coordinates
      return s.latitude && s.longitude;
    })
    .map((s: any) => {
      // Get map slug (first one if multiple)
      const mapSlug = Array.isArray(s.map_slugs) && s.map_slugs.length > 0 ? s.map_slugs[0] :
                     (Array.isArray(s.maps) && s.maps.length > 0 ?
                      (allMaps.value.find((m: any) => m.id === s.maps[0])?.slug || null) : null);

      return {
        id: s.id,
        name: s.name || 'Unknown Service',
        description: s.description || '',
        type: 'service' as const,
        latitude: parseFloat(s.latitude) || 0,
        longitude: parseFloat(s.longitude) || 0,
        categories: [...normalizeCategories(s.categories || [])],
        mapSlug: mapSlug,
        mapName: mapSlug ? mapNamesBySlug[mapSlug] : null
      };
    })
    .filter((s: any) => s.mapSlug && s.mapName); // Ensure only services with valid map info are included

  // Combine and limit the suggestions
  // First sort by name for better usability
  const sortedSuggestions = [...vendorSuggestions, ...serviceSuggestions]
    .sort((a, b) => a.name.localeCompare(b.name));

  // Then take only the first few items to show
  filteredSuggestions.value = sortedSuggestions.slice(0, maxSuggestionsToShow);
}

// Reset search and filters - fix the slug-based reset
function resetFilters() {
  searchQuery.value = '';
  showSearchSuggestions.value = false;
  filteredSuggestions.value = [];

  clearCategoryFilters();

  // Reset to master map if it exists, otherwise use the first map
  if (defaultMap) {
    currentMapSlug.value = defaultMap.slug;
  } else if (allMaps.value.length > 0) {
    currentMapSlug.value = allMaps.value[0].slug;
  }

  // Close any open popups
  if (mapboxMap) {
    // Get all popup elements and remove them
    const popups = document.querySelectorAll('.mapboxgl-popup');
    popups.forEach(popup => popup.remove());

    // Reset map view to default state
    mapboxMap.flyTo({
      center: DEFAULT_MAP_POSITION,
      zoom: DEFAULT_MAP_ZOOM,
      bearing: DEFAULT_MAP_BEARING,
      essential: true,
      animate: true,
      duration: 1000 // 1 second animation
    });

    logger.info('Map reset to default view');
  }

  // Update map features with new filters
  updateMapForSelectedType();
}

// Function to reset the search input
function clearSearch() {
  // Clear search-specific state
  searchQuery.value = '';
  showSearchSuggestions.value = false;
  filteredSuggestions.value = [];
  searchWrapperElement.value?.classList.remove('wrapper--search-focused');

  // Simply call the resetFilters function to handle the rest
  // This ensures consistent behavior between search clear and reset button
  resetFilters();
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

function normalizeCategories(categories: any) {
  try {
    // Handle empty or nullish cases
    if (!categories) {
      return [];
    }

    // If it's already an array, ensure all elements are clean numbers
    if (Array.isArray(categories)) {
      return categories.map((categoryId: any) => {
        // If the category is an object with an id property (case seen in the error), extract just the id
        if (categoryId && typeof categoryId === 'object' && 'id' in categoryId) {
          return Number(categoryId.id);
        }
        // Otherwise ensure it's a number
        return Number(categoryId);
      });
    }

    // If it's a JSON string, try to parse it
    if (typeof categories === 'string') {
      try {
        const parsed = JSON.parse(categories);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => {
            if (typeof item === 'object' && item !== null && 'id' in item) {
              return Number(item.id);
            }
            return Number(item);
          });
        }
      } catch (e) {
        // Parsing failed, log and return empty array
        console.warn('Failed to parse category JSON string:', categories);
        return [];
      }
    }

    // If we reach here, the format is unsupported
    throw new Error('Unsupported category format');
  } catch (e) {
    console.warn('Failed to normalize categories:', categories, e);
    return [];
  }
}

// Replace the separate vendor and service GeoJSON building functions with a unified function
function buildItemGeoJSON<T extends 'vendor' | 'service'>(
  items: any[],
  type: T
): Array<Feature<Point, T extends 'vendor' ? VendorProperties : ServiceProperties>> {
  // Apply common filtering by map slug and search query
  let filteredItems = items.filter((item) => {
    // Check if the item has valid coordinates
    if (type === 'vendor') {
      // Vendors need valid locations array
      if (!item.locations || item.locations.length === 0) {
        return false;
      }
    } else {
      // Services need latitude and longitude
      if (!item.latitude || !item.longitude) {
        return false;
      }
    }

    // Filter by map slug for all maps
    if (currentMapSlug.value !== null) {
      // Check if the item has map_slugs array and it includes the current map slug
      return Array.isArray(item.map_slugs) && item.map_slugs.includes(currentMapSlug.value);
    }

    return true;
  });

  // Apply search filtering
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase();
    filteredItems = filteredItems.filter(item =>
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  }

  // Apply category filtering
  filteredItems = filteredItems.filter(item => matchesCategoryFilters(item.categories));

  // Convert to GeoJSON features
  if (type === 'vendor') {
    return filteredItems.flatMap((v) => v.locations.map((location: any) => {
      // Ensure categories are properly normalized before adding to properties
      const normalizedCategories = normalizeCategories(v.categories || []);

      return {
        type: 'Feature' as const,
        properties: {
          name: v.name ?? 'Unknown Vendor',
          description: v.description ?? '',
          id: v.id,
          type: 'vendor' as const,
          categories: normalizedCategories,
          mapSlugs: v.map_slugs || [],
          currentMapSlug: currentMapSlug.value,
          currentMapIndex: currentMapIndex.value,
          primaryMapSlug: v.primary_map_slug || null,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            parseFloat(location.longitude),
            parseFloat(location.latitude)
          ]
        }
      };
    })) as any;
  } else {
    return filteredItems
      .map((s) => {
        // Ensure categories are properly normalized
        const normalizedCategories = normalizeCategories(s.categories);

        return {
          type: 'Feature' as const,
          properties: {
            title: s.name ?? 'Unknown Service',
            description: s.description ?? '',
            id: s.id,
            is_accessible: Boolean(s.is_accessible),
            type: 'service' as const,
            categories: normalizedCategories,
            mapSlugs: s.map_slugs || [],
            currentMapSlug: currentMapSlug.value,
            currentMapIndex: currentMapIndex.value,
            primaryMapSlug: s.primary_map_slug || null,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [
              parseFloat(s.longitude),
              parseFloat(s.latitude)
            ]
          }
        };
      }) as any;
  }
}

// Update the collection building functions to use the new unified function
function buildVendorGeoJSONCollection(): FeatureCollection<Point, VendorProperties> {
  const rawVendors = cloneDeep(vendors);
  const vendorFeatures = buildItemGeoJSON(rawVendors, 'vendor');

  // logger.info('Re-built vendor map JSON', {
  //   'Vendors': vendorFeatures.length,
  // });

  return {
    type: 'FeatureCollection' as const,
    features: vendorFeatures,
  };
}

function buildServiceGeoJSONCollection(): FeatureCollection<Point, ServiceProperties> {
  const rawServices = cloneDeep(services);
  const serviceFeatures = buildItemGeoJSON(rawServices, 'service');

  // logger.info('Re-built service map JSON', {
  //   'Services': serviceFeatures.length,
  // });

  return {
    type: 'FeatureCollection' as const,
    features: serviceFeatures,
  };
}

// Build GeoJSON for both vendors and services
function buildCombinedGeoJSONCollection(): FeatureCollection<Point, VendorProperties | ServiceProperties> {
  const vendorGeoJSON = buildVendorGeoJSONCollection();
  const serviceGeoJSON = buildServiceGeoJSONCollection();

  logger.info('Re-built combined map JSON', {
    'Vendors': vendorGeoJSON.features.length,
    'Services': serviceGeoJSON.features.length,
  });

  const combinedFeatures = [...vendorGeoJSON.features, ...serviceGeoJSON.features];

  return {
    type: 'FeatureCollection' as const,
    features: combinedFeatures,
  };
}

// Get service category name by ID
function getCategoryName(categoryId: number): string {
  // Check service categories first
  const serviceCategory = serviceCategories.find((cat: any) => cat.id === categoryId);

  if (serviceCategory) {
     return serviceCategory.name;
  }

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

  // Get map names for lookup
  const mapNamesBySlug: Record<string, string> = {};
  allMaps.value.forEach((map: ServiceMap) => {
    mapNamesBySlug[map.slug] = map.name;
  });

  // Generic filtering function that works for both vendors and services
  const filterItems = (items: any[], isVendor: boolean) => {
    return items.filter(item => {
      // Check if name/title or description matches the query
      const nameMatch = item.name && item.name.toLowerCase().includes(query);
      const descriptionMatch = item.description && item.description.toLowerCase().includes(query);

      if (!nameMatch && !descriptionMatch) {
        return false;
      }

      // Check if item belongs to at least one map
      const hasMapSlug = Array.isArray(item.map_slugs) && item.map_slugs.length > 0;
      const hasMapId = Array.isArray(item.maps) && item.maps.length > 0;

      if (!hasMapSlug && !hasMapId) {
        return false;
      }

      // Check coordinates validity
      if (isVendor) {
        // Vendors need valid locations array
        if (!item.locations || item.locations.length === 0) {
          return false;
        }
      } else {
        // Services need latitude and longitude
        if (!item.latitude || !item.longitude) {
          return false;
        }
      }

      // Filter by category if selected
      if (Object.values(selectedCategories.value).some(selected => selected)) {
        if (!item.categories || !item.categories.some((catId: number) => selectedCategories.value[catId])) {
          return false;
        }
      }

      return true;
    });
  };

  // Generic mapping function that works for both vendors and services
  const mapToSuggestion = (item: any, isVendor: boolean): SearchSuggestion | null => {
    // Get location data
    let lat = 0, lng = 0;
    if (isVendor) {
      const location = item.locations && item.locations.length > 0 ? item.locations[0] : null;
      if (!location) return null;
      lat = parseFloat(location.latitude) || 0;
      lng = parseFloat(location.longitude) || 0;
    } else {
      lat = parseFloat(item.latitude) || 0;
      lng = parseFloat(item.longitude) || 0;
    }

    // Get map slug
    const mapSlug = Array.isArray(item.map_slugs) && item.map_slugs.length > 0 ? item.map_slugs[0] :
                   (Array.isArray(item.maps) && item.maps.length > 0 ?
                    (allMaps.value.find((m: any) => m.id === item.maps[0])?.slug || null) : null);

    // Get map name
    const effectiveMapSlug = mapSlug || currentMapSlug.value;
    const effectiveMapName = effectiveMapSlug ? mapNamesBySlug[effectiveMapSlug] : 'General Map';

    return {
      id: item.id,
      name: (item.name || (isVendor ? 'Unknown Vendor' : 'Unknown Service')),
      description: item.description || '',
      type: isVendor ? 'vendor' : 'service',
      latitude: lat,
      longitude: lng,
      categories: [...normalizeCategories(item.categories || [])],
      mapSlug: effectiveMapSlug,
      mapName: effectiveMapName
    };
  };

  // Process vendors
  const filteredVendors = filterItems(vendors, true);
  const vendorSuggestions = filteredVendors
    .map(v => mapToSuggestion(v, true))
    .filter(Boolean) as SearchSuggestion[];

  // Process services
  const filteredServices = filterItems(services, false);
  const serviceSuggestions = filteredServices
    .map(s => mapToSuggestion(s, false))
    .filter(s => s && s.mapSlug && s.mapName) as SearchSuggestion[];

  // Combine, sort by relevance, and limit the suggestions
  const combinedSuggestions = [...vendorSuggestions, ...serviceSuggestions];

  // Sort suggestions: first current map, then by relevance (exact match > starts with > contains)
  const sortedSuggestions = combinedSuggestions.sort((a, b) => {
    // First priority: current map items
    const aInCurrentMap = a.mapSlug === currentMapSlug.value;
    const bInCurrentMap = b.mapSlug === currentMapSlug.value;

    if (aInCurrentMap && !bInCurrentMap) return -1;
    if (!aInCurrentMap && bInCurrentMap) return 1;

    // Second priority: exact match
    const aExactMatch = a.name.toLowerCase() === query;
    const bExactMatch = b.name.toLowerCase() === query;

    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;

    // Third priority: starts with query
    const aStartsWith = a.name.toLowerCase().startsWith(query);
    const bStartsWith = b.name.toLowerCase().startsWith(query);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    // Default: alphabetical
    return a.name.localeCompare(b.name);
  });

  // Limit to max suggestions to show
  filteredSuggestions.value = sortedSuggestions.slice(0, maxSuggestionsToShow);
}

// Select a suggestion - with slug-based logic
function selectSuggestion(suggestion: SearchSuggestion) {
  searchQuery.value = suggestion.name;
  showSearchSuggestions.value = false;

  const needsMapChange = suggestion.mapSlug !== currentMapSlug.value;

  logger.info(`Suggestion clicked (Current Map Slug: ${currentMapSlug.value} | Suggestion Map Slug: ${suggestion.mapSlug} | Needs Map Change: ${needsMapChange ? 'Yes' : 'No'})`);

  // First check if we need to switch maps
  if (suggestion.mapSlug && needsMapChange) {
    // Find the map data
    const mapData = allMaps.value.find((map: ServiceMap) => map.slug === suggestion.mapSlug);

    if (mapData) {
      // Switch to the correct map first
      currentMapSlug.value = mapData.slug;
      logger.info(`Switched map (Map ID: ${mapData.id} | Map Slug: ${mapData.slug} | Map Name: ${mapData.name})`);

      // Update the map data first
      updateMapForSelectedType();

      // Listen for the 'sourcedata' event which fires when new data is loaded
      // Using once ensures we only respond to the first event
      mapboxMap.once('sourcedata', (e) => {
        // Check if the source is completely loaded
        if (e.sourceId === MapSource.PointsClustered && e.isSourceLoaded) {
          logger.info('Map source data loaded, focusing on suggestion');
          focusOnSuggestion(suggestion);
        } else {
          // If this event didn't indicate completion, wait for another one
          const checkSourceLoaded = (e: mapboxgl.MapSourceDataEvent) => {
            if (e.sourceId === MapSource.PointsClustered) {
              if (e.isSourceLoaded) {
                logger.info('Map source data fully loaded, focusing on suggestion');

                focusOnSuggestion(suggestion);

                // Cleanup the event listener
                mapboxMap.off('sourcedata', checkSourceLoaded);
              }
            }
          };

          // Set up listener for complete load
          mapboxMap.on('sourcedata', checkSourceLoaded);
        }
      });
    } else {
      logger.warn(`Could not find map to switch to (Map Slug: ${suggestion.mapSlug})`);
      // If map not found, just focus on point in current map
      focusOnSuggestion(suggestion);
    }
  } else {
    // Same map, just focus on the point
    focusOnSuggestion(suggestion);
  }
}

// Focus on map point without causing icon disappearance
function focusOnSuggestion(suggestion: SearchSuggestion) {
  // Update the map to focus on the selected point
  if (!mapboxMap) {
    console.warn('No Mapbox map when focusing on suggestion');
    return;
  }

  // Fly to the suggestion location
  mapboxMap.flyTo({
    center: [suggestion.longitude, suggestion.latitude],
    zoom: 17,
    essential: true,
  });

  // Wait for the map to be completely idle (all tiles and layers loaded)
  mapboxMap.once('idle', () => {
    logger.info(`Map idle after flying to suggestion (ID: ${suggestion.id} | Type: ${suggestion.type} | Lat: ${suggestion.latitude} | Lng: ${suggestion.longitude})`);

    // Log the actual suggestion categories to help debug
    if (suggestion.categories && suggestion.categories.length > 0) {
      logger.info(`Suggestion categories: ${JSON.stringify(suggestion.categories)}`);
    }

    // Add a small delay to ensure all features have had time to render
    setTimeout(() => {
      // Query for features at the suggestion location
      const features = mapboxMap.queryRenderedFeatures(
        mapboxMap.project([suggestion.longitude, suggestion.latitude]),
        {
          layers: [MapLayer.MapIcon], // suggestion.type === 'vendor' ? ['vendor-map-icon'] : ['service-map-icon']
        },
      );

      const numFeatures = features?.length || 0;

      logger.info(`Found ${numFeatures} features at suggestion location`);

      // If features are found, try to log their categories to help debug
      if (numFeatures > 0) {
        logger.info(`Feature categories: ${JSON.stringify(features[0].properties?.categories)}`);
      }

      if (numFeatures > 0) {
        // Find the specific feature by ID
        const feature = features.find(f =>
          f.properties &&
          f.properties.id === suggestion.id &&
          f.properties.type === suggestion.type
        );

        if (feature) {
          // Trigger a click event on the specific feature
          mapboxMap.fire('click', {
            lngLat: new mapboxgl.LngLat(suggestion.longitude, suggestion.latitude),
            point: mapboxMap.project([suggestion.longitude, suggestion.latitude]),
            features: [feature]
          } as unknown as mapboxgl.MapMouseEvent);
        } else {
          logger.warn('No matching feature found when focusing on suggestion');
        }
      } else {
        logger.warn('No features found when focusing on suggestion');
      }
    }, 150);
  });
}

// Get Number of currently selected filters for badge
const selectedFilterCount = computed(() => {
  return Object.values(selectedCategories.value).filter(Boolean).length;
});

const currentZoomLevel = ref(DEFAULT_MAP_ZOOM);

function initMap() {
  if (!mapContainer.value) {
    return;
  }

  // Show loading indicator
  isLoadingMap.value = true;

  mapboxMap = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/pxldevops/cm4uef2wm005401sm7ebof1mh',
    center: DEFAULT_MAP_POSITION,
    zoom: DEFAULT_MAP_ZOOM,
    bearing: DEFAULT_MAP_BEARING,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    touchZoomRotate: true,
    renderWorldCopies: false,
    preserveDrawingBuffer: true,
    minZoom: MAP_MIN_ZOOM,
    maxZoom: MAP_MAX_ZOOM,
    maxBounds: MAP_MAX_BOUNDS,
  });

  mapboxMap.touchZoomRotate.disableRotation();

  // Enable debug features if debug mode is active
  if (isDebugMode.value) {
    // mapboxMap.showCollisionBoxes = true;
    // mapboxMap.showTileBoundaries = true;
    // mapboxMap.showTerrainWireframe = true;

    logger.debug('Debug mode enabled');
  }

  // // Add navigation controls
  // mapboxMap.addControl(new mapboxgl.NavigationControl());

  // Set up map error handling
  mapboxMap.on('error', (e) => {
    logger.error(e);

    isLoadingMap.value = false;

    appStore.hideSubLoader();
  });

  mapboxMap.on('resize', () => {
    logger.debug('Map resized', {
      width: mapContainer.value?.offsetWidth,
      height: mapContainer.value?.offsetHeight,
    });
  });

  // Wait for style to load before loading other resources
  mapboxMap.on('style.load', () => {
    logger.info('Map style loaded');

    loadMapResources();
  });

  // Initialize current zoom level
  currentZoomLevel.value = mapboxMap.getZoom();

  // Update zoom level on zoom events
  mapboxMap.on('zoom', () => {
    currentZoomLevel.value = mapboxMap.getZoom();
  });

  mapboxMap.on('zoomend', () => {
    const zoom = mapboxMap.getZoom();
    const { clusterRadius, clusterMinPoints, clusterClickZoomInAmount: newZoomInAmount } = getClusterConfig(zoom);

    logger.info('Zoom level changed', {
      'Zoom Level': mapboxMap.getZoom(),
      'Cluster Radius': clusterRadius,
      'Cluster Min Points': clusterMinPoints,
      'Cluster Click Zoom-In Amount': newZoomInAmount,
    });

    // Track previous values
    const prevClusterRadius = mapClusterRadius.value;
    const prevClusterMinPoints = mapClusterMinPoints.value;
    const prevZoomInAmount = clusterClickZoomInAmount.value;

    // Only update and call updateClusterSettings if values changed
    let clusterSettingsChanged = prevClusterRadius !== clusterRadius ||
      prevClusterMinPoints !== clusterMinPoints ||
      prevZoomInAmount !== newZoomInAmount;

    if (clusterSettingsChanged) {
      mapClusterRadius.value = clusterRadius;
      mapClusterMinPoints.value = clusterMinPoints;
      clusterClickZoomInAmount.value = newZoomInAmount;

      updateClusterSettings();

      logger.info('Updated cluster settings', {
        'Cluster Radius': mapClusterRadius.value,
        'Cluster Min Points': mapClusterMinPoints.value,
        'Cluster Click Zoom-In Amount': clusterClickZoomInAmount.value,
      });
    }
  });

  mapboxMap.on('click', (e) => {
    if (isDebugMode.value) {
      logger.debug('Map clicked at coordinates:', {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      });
    }
  });
}

// Load map resources in the proper sequence
async function loadMapResources() {
  if (!mapboxMap) {
    logger.error('Map not initialized when loading resources');
    return;
  }

  try {
    // const numMaps = maps?.length || 0;
    const numServiceMaps = maps?.filter((m: any) => m.type === 'service')?.length || 0;
    const numVendorMaps = maps?.filter((m: any) => m.type === 'vendor')
    await loadCategoryIcons({ map: mapboxMap, maps });

    // // Load map overlay image
    // await loadMapOverlayImage();

    setupMapLayers();
  } catch (error) {
    logger.error(error);

    isLoadingMap.value = false;
  }
}

// // Load the map overlay image with proper promise handling
// function loadMapOverlayImage(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const imageOverlayElement = new Image();

//     imageOverlayElement.onload = () => {
//       logger.info('Map overlay image loaded');
//       // setupMapLayers();
//       resolve();
//     };

//     imageOverlayElement.onerror = (error) => {
//       logger.error('Failed to load map overlay image', error);
//       reject(error);
//     };

//     // Set the source after setting up event handlers
//     imageOverlayElement.src = '/icons/Map_Design-big-min.png';
//   });
// }

function checkWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = function() {
      // If the image loads successfully, WebP is supported
      resolve(true);
    };

    img.onerror = function() {
      // If the image fails to load, WebP is not supported
      resolve(false);
    };

    // Try to load a 1x1 pixel WebP image
    img.src = '/icons/1x1.webp';
  });
}

// Function to handle cluster clicks
function handleClusterClick(e: mapboxgl.MapMouseEvent) {
  if (!mapboxMap || !e.point) return;

  const features = mapboxMap.queryRenderedFeatures(e.point, {
    layers: [MapLayer.MapClusterIcon],
  });

  if (!features.length) {
    return;
  }

  const cluster = features[0];
  const clusterId = cluster.properties?.cluster_id;

  if (typeof clusterId === 'undefined' || clusterId === null) {
    console.warn('No cluster_id found on cluster feature');
    return;
  }

  const source = mapboxMap.getSource(MapSource.PointsClustered) as mapboxgl.GeoJSONSource;

  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (typeof zoom !== 'number') {
      console.warn('Expansion zoom level is invalid:', zoom);
      return;
    } else if (err) {
      console.error('Error expanding cluster:', err);
      return;
    }

    logger.info('Cluster clicked', {
      'Cluster ID': clusterId,
      'Zoom Level': zoom,
    });

    const [lng, lat] = (cluster.geometry as Point).coordinates;

    mapboxMap.easeTo({
      center: [lng, lat],
      zoom: Math.min(zoom + clusterClickZoomInAmount.value, MAP_MAX_ZOOM), // Use slider value
      duration: 500,
    });
  });
}

function setupMapLayers() {
  if (!mapboxMap) {
    logger.error('Map not initialized when setting up layers');
    return;
  }

  // const mapOverlayImageUrl = `/icons/map-overlay-3x.${isWebPSupported.value ? 'webp' : 'png'}`;
  // const mapOverlayImageUrl = '/icons/Map_Design-big-min.png';

  try {
    // 1. Add the map overlay image source
    // mapboxMap.addSource(MapSource.ChevyCourtArea, {
    //   type: 'image',
    //   url: mapOverlayImageUrl,
    //   coordinates: [
    //     [-76.21532502658798, 43.055330160826315],   // Top left
    //     [-76.23753721914531, 43.07114978353832],    // Top right
    //     [-76.22037084830293, 43.08502388194864],    // Bottom right
    //     [-76.19757700157899, 43.06982854755563]     // Bottom left
    //   ]
    // });

    const nysfairWebsiteBaseUrl = import.meta.env.VITE_NYSFAIR_BASE_URL;

    const currentZoomLevel = mapboxMap.getZoom();

    console.log('Current zoom level:', currentZoomLevel);

    const { clusterRadius, clusterMinPoints, clusterClickZoomInAmount: newZoomInAmount } = getClusterConfig(currentZoomLevel);

    mapClusterRadius.value = clusterRadius;
    mapClusterMinPoints.value = clusterMinPoints;
    clusterClickZoomInAmount.value = newZoomInAmount;

    mapboxMap.addSource(MapSource.ChevyCourtArea, {
      type: 'raster',
      tiles: [
        // '/map/tiles/{z}/{x}/{y}.png',
        `${nysfairWebsiteBaseUrl}/serve-asset.php?asset=map-tiles/{z}/{x}/{y}.png`,
      ],
      tileSize: 512,
      // scheme: 'tms',
      // minzoom: mapboxMap.getMinZoom(),
      // maxzoom: mapboxMap.getMaxZoom(),
      // bounds: [-76.237, 43.055, -76.197, 43.085],
    });

    // TOOD: Add a slider form control on top of the map that controls the raster-opacity of the MapLayer.ChevyCourtOverlay
    mapboxMap.addLayer({
      id: MapLayer.ChevyCourtOverlay,
      type: 'raster',
      source: MapSource.ChevyCourtArea,
      paint: {
        'raster-opacity': mapOpacity.value
      }
    });

    // 2. Build filtered GeoJSON (fresh data)
    const filteredGeoJson = buildCombinedGeoJSONCollection();

    // 3. Add GeoJSON source with initial data
    mapboxMap.addSource(MapSource.PointsClustered, {
      type: 'geojson',
      data: filteredGeoJson,
      cluster: true,
      clusterRadius,
      clusterMaxZoom: MAP_MAX_ZOOM - 1,
      clusterMinPoints
    });

    // 4. Add icon layers
    addMapIconLayer(mapboxMap, allMaps.value, currentMapIndex.value);

    // 5. Add cluster layers
    addMapClusterIconLayer(mapboxMap, allMaps.value, currentMapIndex.value);

    // 6. Setup icon click handlers and store the cleanup function
    iconClickHandlersCleanup = setupIconClickHandlers(mapboxMap, getCategoryName);

    // 7. Optional: Handle cluster clicks
    mapboxMap.on('click', MapLayer.MapClusterIcon, handleClusterClick);

    // 8. Wait for the map to be fully rendered
    mapboxMap.once('idle', () => {
      mapSourcesReady.value = true;

      processPendingMapUpdates();
      finalizeMapSetup();
    });
  } catch (error) {
    logger.error(error);
    isLoadingMap.value = false;
  }
}

// New function to finalize map setup after it's fully rendered
function finalizeMapSetup() {
  try {
    // Ensure the map container is visible and has proper dimensions
    if (mapContainer.value) {
      mapContainer.value.style.display = 'block';
    }

    // Resize the map to ensure proper container dimensions
    mapboxMap.resize();

    // Hide loading indicators
    isLoadingMap.value = false;

    // Log that map is ready
    logger.info('Map fully rendered and ready');
  } catch (error) {
    logger.error('Error finalizing map setup:', error);
    isLoadingMap.value = false;
  } finally {
    appStore.hideSubLoader();
  }
}

function destroyMap() {
  try {
    if (mapboxMap) {
      // Clear any pending updates first
      pendingMapUpdates.value = [];
      mapSourcesReady.value = false;

      // Remove event listeners
      if (iconClickHandlersCleanup) {
        iconClickHandlersCleanup();
        iconClickHandlersCleanup = null;
      }

      // Remove cluster click handler
      mapboxMap.off('click', MapLayer.MapClusterIcon, handleClusterClick);

      // Remove basic map event handlers
      // mapboxMap.off('load');
      // mapboxMap.off('style.load');
      // mapboxMap.off('idle');
      // mapboxMap.off('error');

      // Then remove the map
      mapboxMap.remove();

      logger.info('Map destroyed successfully');
    }
  } catch (error) {
    logger.error('Error destroying map:', error);
  }
}

function updateMapOpacity(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value);
  mapOpacity.value = value / 100;

  // Update map layer opacity if map is initialized
  if (mapboxMap && mapboxMap.getLayer(MapLayer.ChevyCourtOverlay)) {
    mapboxMap.setPaintProperty(
      MapLayer.ChevyCourtOverlay,
      'raster-opacity',
      mapOpacity.value
    );
  }
}

function updateClusterSettings() {
  if (!mapboxMap) return;

  const sourceId = MapSource.PointsClustered;

  // Remove layers that depend on the source (in correct order)
  const layersToRemove = [
    MapLayer.MapClusterIcon,
    MapLayer.MapClusterCount, // If you have a count label layer
    MapLayer.MapIcon
  ];

  layersToRemove.forEach((layerId) => {
    if (mapboxMap.getLayer(layerId)) {
      mapboxMap.removeLayer(layerId);
    }
  });

  // Now it's safe to remove the source
  if (mapboxMap.getSource(sourceId)) {
    mapboxMap.removeSource(sourceId);
  }

  // Rebuild data
  const newData = buildCombinedGeoJSONCollection();

  // Add source again with new clustering options
  mapboxMap.addSource(sourceId, {
    type: 'geojson',
    data: newData,
    cluster: true,
    clusterRadius: mapClusterRadius.value,
    clusterMinPoints: mapClusterMinPoints.value,
    clusterMaxZoom: MAP_MAX_ZOOM - 1,
  });

  // Re-add your layers
  addMapIconLayer(mapboxMap, allMaps.value, currentMapIndex.value);
  addMapClusterIconLayer(mapboxMap, allMaps.value, currentMapIndex.value);

  // Rebind cluster click handler
  mapboxMap.on('click', MapLayer.MapClusterIcon, handleClusterClick);

  logger.debug('Map cluster settings updated', {
    clusterRadius: mapClusterRadius.value,
    clusterMinPoints: mapClusterMinPoints.value,
  });
}

const debouncedUpdateClusterSettings = debounce(() => {
  updateClusterSettings();
}, 400);

onMounted(async () => {
  appStore.bottomBar.isVisible = true;

  appStore.$patch({
    subLoader: {
      message: 'Loading map'
    },
  });

  // Setup listener for closing dropdown when clicking outside
  document.addEventListener('click', closeDropdownOnOutsideClick);

  // Check if WebP is supported
  isWebPSupported.value = await checkWebPSupport();

  // Initialize the map
  initMap();
});

onUnmounted(() => {
  // Clean up debounce timeout
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value);
  }

  // Clean up event listener
  document.removeEventListener('click', closeDropdownOnOutsideClick);

  // Destroy map
  destroyMap();
});
</script>

<style src="@/theme/sites/fair/pages/map.scss" scoped lang="scss"></style>

<style scoped lang="scss">
.main {
  padding-bottom: v-bind('appConfig.bottomBar.height');
}

.filter-panel {
  height: calc(100% - v-bind('appConfig.bottomBar.height'));
}
</style>
