<template>
  <FairLayout title="Interactive Map" :showMenuButton="true" :isLoading="isLoadingMap" loadingText="Loading map...">
    <div class="main">
      <div class="main__header">
        <div class="wrapper">
          <div class="search-container">
            <input type="text" placeholder="Search" class="search-input" v-model="searchQuery" @input="handleLiveSearch" @keyup.enter="handleSearch" @focus="handleFocus" @blur="handleBlur">
            <ion-icon :icon="showSearchSuggestions ? closeOutline : searchOutline" class="search-icon" @click="clearSearch"></ion-icon>
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
          <div ref="btnGroup" class="group">
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
  </FairLayout>
</template>

<script setup lang="ts">
import FairLayout from '@/layouts/fair.vue';
// import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import {
  IonIcon,
  IonContent,
} from '@ionic/vue';
import { searchOutline, chevronDownOutline, optionsOutline, refreshOutline, closeOutline } from 'ionicons/icons';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, Point, FeatureCollection } from 'geojson';
import { loadCategoryIcons, addVendorIconLayer, addServiceIconLayer, setupIconClickHandlers } from '@/utils/MapIconUtils';
import { ServiceMap, VendorProperties, ServiceProperties, Category, SearchSuggestion } from '@/types';
import { useLogger } from '@/composables/useLogger';
import { cloneDeep } from '@/utils/clone';

// Access Token for Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicHhsZGV2b3BzIiwiYSI6ImNqZjA2bmpiYjBrNTkzM285dnJobjY5aGMifQ.jw168py37rli1OcHuyI9aw';

import { useDataStore } from '@/stores/data';

// Default map view state to reset to
const DEFAULT_MAP_CENTER: [number, number] = [-76.2197, 43.073];
const DEFAULT_MAP_ZOOM = 14;
const DEFAULT_MAP_BEARING = 222;

const isLoadingMap = ref(true);

const mapContainer = ref<HTMLElement | null>(null);
const showMapDropdown = ref(false);
const currentMapId = ref<number | null>(null);
const searchQuery = ref('');
const searchDebounceTimeout = ref<number | null>(null);
const btnGroup = ref<HTMLElement | null>(null);

// Add new refs for filters modal
const selectedCategories = ref<Record<number, boolean>>({});
const showFiltersPanel = ref(false);
const hasFilterChanges = ref(false);

// Refs for search suggestions
const showSearchSuggestions = ref(false);
const filteredSuggestions = ref<SearchSuggestion[]>([]);
const maxSuggestionsToShow = 5; // Reduced for mobile screens

const logger = useLogger();

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
  if (!currentMapId.value) {
    return [];
  }

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
let mapboxMap: Map;
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

// Select a map type and update the display with improved handling
function selectMap(mapData: ServiceMap) {
  // Store previous map ID for comparison
  const previousMapId = currentMapId.value;

  // Update current map ID and close dropdown
  currentMapId.value = mapData.id;
  showMapDropdown.value = false;

  // Reset search and filters
  searchQuery.value = '';
  clearCategoryFilters();

  // Check if this is a significant map change
  const isSignificantChange = previousMapId !== mapData.id;

  if (isSignificantChange) {
    // For significant map changes, track the request in progress
    logger.info(`Switching to map: ${mapData.name} (ID: ${mapData.id})`);
  }

  // Request map update
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
  if (!mapboxMap) {
    logger.warn('Cannot update map: Map not initialized');
    return;
  }

  if (!currentMapId.value) {
    logger.warn('Cannot update map: No map ID selected');
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
    if (!mapboxMap) return;

    // Check if source exists before updating
    const source = mapboxMap.getSource('points-clustered') as mapboxgl.GeoJSONSource;

    if (!source) {
      logger.warn('Map source "points-clustered" not found');
      return;
    }

    // Build new GeoJSON data
    const filteredGeoJson = buildFilteredGeoJSON();
    logger.info(`Updating map with ${filteredGeoJson.features.length} features`);

    // Update the data source
    source.setData(filteredGeoJson);
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
  showSearchSuggestions.value = true;

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

function handleFocus() {
  showSearchSuggestions.value = true;
  btnGroup.value?.classList.add('search-focused');

  // Generate initial suggestions without requiring any text input
  generateInitialSuggestions();
}

// When the input loses focus, hide the suggestions after a short delay
function handleBlur() {
  // Use setTimeout to allow clicks on suggestions to register before closing
  setTimeout(() => {
    showSearchSuggestions.value = false;
    btnGroup.value?.classList.remove('search-focused');
  }, 150);
}

function generateInitialSuggestions() {
  // If there's already a search query, use the standard search function
  if (searchQuery.value.trim()) {
    generateSearchSuggestions();

    return;
  }

  // Get map names for lookup
  const mapNamesById: Record<number, string> = {};
  allMaps.value.forEach((map: ServiceMap) => {
    mapNamesById[map.id] = map.name;
  });

  // Vendor suggestions - get from ALL maps
  const vendorSuggestions = vendors
    .filter((v: any) => {
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

      // Get map ID (first one if multiple)
      const mapId = Array.isArray(v.maps) && v.maps.length > 0 ? v.maps[0] : null;

      return {
        id: v.id,
        name: v.name || 'Unknown Vendor',
        description: v.description || '',
        type: 'vendor' as const,
        latitude: location ? parseFloat(location.latitude) : 0,
        longitude: location ? parseFloat(location.longitude) : 0,
        categories: [...normalizeCategories(v.categories || [])],
        mapId: mapId,
        mapName: mapId ? mapNamesById[mapId] : null
      };
    });

  // Service suggestions - get from ALL maps
  const serviceSuggestions = services
    .filter((s: any) => {
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
      // Get map ID (first one if multiple)
      const mapId = Array.isArray(s.maps) && s.maps.length > 0 ? s.maps[0] : null;

      return {
        id: s.id,
        name: s.title || 'Unknown Service',
        description: s.description || '',
        type: 'service' as const,
        latitude: parseFloat(s.latitude) || 0,
        longitude: parseFloat(s.longitude) || 0,
        categories: [...normalizeCategories(s.categories || [])],
        mapId: mapId,
        mapName: mapId ? mapNamesById[mapId] : null
      };
    });

  // Combine and limit the suggestions
  // First sort by name for better usability
  const sortedSuggestions = [...vendorSuggestions, ...serviceSuggestions]
    .sort((a, b) => a.name.localeCompare(b.name));

  // Then take only the first few items to show
  filteredSuggestions.value = sortedSuggestions.slice(0, maxSuggestionsToShow);
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

  // Close any open popups
  if (mapboxMap) {
    // Get all popup elements and remove them
    const popups = document.querySelectorAll('.mapboxgl-popup');
    popups.forEach(popup => popup.remove());

    // Reset map view to default state
    mapboxMap.flyTo({
      center: DEFAULT_MAP_CENTER,
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
  searchQuery.value = '';
  showSearchSuggestions.value = false;
  filteredSuggestions.value = [];

  // Reset to the currently selected map
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

  return filteredVendors.flatMap((v) => v.locations.map((location: any) => {
    // Ensure categories are properly normalized before adding to properties
    const normalizedCategories = normalizeCategories(v.categories || []);

    return {
      type: 'Feature' as const,
      properties: {
        name: v.name ?? 'Unknown Vendor',
        description: v.description ?? '',
        id: v.id,
        type: 'vendor' as const,
        // Use the normalized array directly
        categories: normalizedCategories,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [
          parseFloat(location.longitude),
          parseFloat(location.latitude)
        ]
      }
    };
  }));
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
    .map((s) => {
      // Ensure categories are properly normalized
      const normalizedCategories = normalizeCategories(s.categories);

      return {
        type: 'Feature' as const,
        properties: {
          title: s.title ?? 'Unknown Service',
          description: s.description ?? '',
          id: s.id,
          is_accessible: Boolean(s.is_accessible),
          type: 'service' as const,
          categories: normalizedCategories,
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

// Build GeoJSON for the currently selected map type
function buildFilteredGeoJSON(): FeatureCollection<Point, VendorProperties | ServiceProperties> {
  const vendorFeatures = buildVendorGeoJSON(cloneDeep(vendors));
  const serviceFeatures = buildServiceGeoJSON(cloneDeep(services));

  // console.log('vendorFeatures feature sample:', JSON.stringify(vendorFeatures, null, 2));
  // console.log('Service feature sample:', JSON.stringify(serviceFeatures, null, 2));

  // console.log(`Map ${currentMapId.value}: ${serviceFeatures.length} services, ${vendorFeatures.length} vendors`);
  logger.info('Re-built map JSON', {
    'Services': serviceFeatures.length,
    'Vendors': vendorFeatures.length,
  });

  return {
    type: 'FeatureCollection' as const,
    features: [...vendorFeatures, ...serviceFeatures]
  };
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

  // Get map names for lookup
  const mapNamesById: Record<number, string> = {};
  allMaps.value.forEach((map: ServiceMap) => {
    mapNamesById[map.id] = map.name;
  });

  // Generate suggestions from vendors - from ALL maps
  const vendorSuggestions = vendors
    .filter((v: any) => {
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

      // Get map ID (first one if multiple)
      const mapId = Array.isArray(v.maps) && v.maps.length > 0 ? v.maps[0] : null;

      return {
        id: v.id,
        name: v.name || 'Unknown Vendor',
        description: v.description || '',
        type: 'vendor' as const,
        latitude: location ? parseFloat(location.latitude) : 0,
        longitude: location ? parseFloat(location.longitude) : 0,
        categories: [...normalizeCategories(v.categories || [])],
        mapId: mapId,
        mapName: mapId ? mapNamesById[mapId] : null
      };
    });

  // Generate suggestions from services - from ALL maps
  const serviceSuggestions = services
    .filter((s: any) => {
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
    .map((s: any) => {
      // Get map ID (first one if multiple)
      const mapId = Array.isArray(s.maps) && s.maps.length > 0 ? s.maps[0] : null;

      return {
        id: s.id,
        name: s.title || 'Unknown Service',
        description: s.description || '',
        type: 'service' as const,
        latitude: parseFloat(s.latitude) || 0,
        longitude: parseFloat(s.longitude) || 0,
        categories: [...normalizeCategories(s.categories || [])],
        mapId: mapId,
        mapName: mapId ? mapNamesById[mapId] : null
      };
    });

  // Combine, sort by relevance, and limit the suggestions
  const combinedSuggestions = [...vendorSuggestions, ...serviceSuggestions];

  // Sort suggestions: first current map, then by relevance (exact match > starts with > contains)
  const sortedSuggestions = combinedSuggestions.sort((a, b) => {
    // First priority: current map items
    const aInCurrentMap = a.mapId === currentMapId.value;
    const bInCurrentMap = b.mapId === currentMapId.value;

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

// Select a suggestion
function selectSuggestion(suggestion: SearchSuggestion) {
  searchQuery.value = suggestion.name;
  showSearchSuggestions.value = false;

  const needsMapChange = suggestion.mapId !== currentMapId.value;

  logger.info(`Suggestion clicked (Current Map ID: ${currentMapId.value} | Suggestion Map ID: ${suggestion.mapId} | Needs Map Change: ${needsMapChange ? 'Yes' : 'No'})`);

  // First check if we need to switch maps
  if (suggestion.mapId && needsMapChange) {
    // Find the map data
    const mapData = allMaps.value.find((map: ServiceMap) => map.id === suggestion.mapId);

    if (mapData) {
      // Switch to the correct map first
      currentMapId.value = mapData.id;
      logger.info(`Switched map (Map ID: ${mapData.id} | Map Name: ${mapData.name})`);

      // Update the map data first
      updateMapForSelectedType();

      // Listen for the 'sourcedata' event which fires when new data is loaded
      // Using once ensures we only respond to the first event
      mapboxMap.once('sourcedata', (e) => {
        // Check if the source is completely loaded
        if (e.sourceId === 'points-clustered' && e.isSourceLoaded) {
          logger.info('Map source data loaded, focusing on suggestion');
          focusOnSuggestion(suggestion);
        } else {
          // If this event didn't indicate completion, wait for another one
          const checkSourceLoaded = (e: mapboxgl.MapSourceDataEvent) => {
            if (e.sourceId === 'points-clustered') {
              if (e.isSourceLoaded) {
                logger.info('Map source data fully loaded, focusing on suggestion');

                focusOnSuggestion(suggestion);

                // Cleanup the event listener
                mapboxMap.off('sourcedata', checkSourceLoaded);
              } else {
                // console.log('not loaded yet..');
              }
            }
          };

          // Set up listener for complete load
          mapboxMap.on('sourcedata', checkSourceLoaded);

          // // Safety timeout as a fallback (much longer than before)
          // setTimeout(() => {
          //   // If we're still waiting, focus anyway and clean up the listener
          //   logger.warn('Timeout reached waiting for source data, focusing anyway');
          //   mapboxMap.off('sourcedata', checkSourceLoaded);
          //   focusOnSuggestion(suggestion);
          // }, 2000);
        }
      });
    } else {
      logger.warn(`Could not find map to switch to (Map ID: ${suggestion.mapId})`);
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

  // Flag to track if we're currently focusing on a suggestion
  // This prevents race conditions with data updates
  const isFocusing = true;

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
        { layers: suggestion.type === 'vendor' ? ['vendor-icon'] : ['service-icon'] }
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
        }
      } else {
        logger.warn('No features found when focusing on suggestion');
      }
    }, 150);
  });

  // IMPORTANT: Don't update the map source here as it causes icons to disappear
  // Comment out this line to prevent the race condition:
  // updateMapForSelectedType(); // TODO: THIS IS CAUSING THE ICONS TO DISAPPEAR AFTER SELECTING SUGGESTION
}

// Get Number of currently selected filters for badge
const selectedFilterCount = computed(() => {
  return Object.values(selectedCategories.value).filter(Boolean).length;
});

// Initialize the map with all required configurations
function initMap() {
  if (!mapContainer.value) {
    return;
  }

  // Show loading indicator
  isLoadingMap.value = true;

  mapboxMap = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/pxldevops/cm4uef2wm005401sm7ebof1mh',
    center: DEFAULT_MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
    bearing: DEFAULT_MAP_BEARING,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    touchZoomRotate: true,
    renderWorldCopies: false,
    preserveDrawingBuffer: true,
    maxZoom: 17,
    minZoom: 13,
    failIfMajorPerformanceCaveat: true, // Don't load if performance would be poor
  });

  // Add navigation controls
  mapboxMap.addControl(new mapboxgl.NavigationControl());

  // Set up map error handling
  mapboxMap.on('error', (e) => {
    logger.error(e);
    isLoadingMap.value = false;
    dataStore.hideLoader();
  });

  // Wait for style to load before loading other resources
  mapboxMap.on('style.load', () => {
    logger.info('Map style loaded');
    loadMapResources();
  });
}

// Load map resources in the proper sequence
async function loadMapResources() {
  if (!mapboxMap) {
    logger.error('Map not initialized when loading resources');
    return;
  }

  try {
    // 1. First load category icons
    logger.info('Loading category icons...');
    await loadCategoryIcons({ map: mapboxMap, serviceCategories, vendorCategories });
    logger.info('Category icons loaded successfully');

    // 2. Then load the map overlay image
    await loadMapOverlayImage();
  } catch (error) {
    logger.error('Error loading map resources:', error);
    isLoadingMap.value = false;
    dataStore.hideLoader();
  }
}

// Load the map overlay image with proper promise handling
function loadMapOverlayImage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const imageOverlayElement = new Image();

    imageOverlayElement.onload = () => {
      logger.info('Map overlay image loaded');
      setupMapLayers();
      resolve();
    };

    imageOverlayElement.onerror = (error) => {
      logger.error('Failed to load map overlay image', error);
      reject(error);
    };

    // Set the source after setting up event handlers
    imageOverlayElement.src = '/icons/Map_Design-big-min.png';
  });
}

// Function to handle cluster clicks
function handleClusterClick(e: mapboxgl.MapLayerEventType['click'] & mapboxgl.EventData) {
  if (!mapboxMap || !e.features || e.features.length === 0 || !e.features[0].properties) return;

  const features = mapboxMap.queryRenderedFeatures(e.point, { layers: ['point-clusters'] });
  if (!features || features.length === 0 || !features[0].properties) return;

  const clusterId = features[0].properties.cluster_id;
  if (clusterId === undefined || clusterId === null) {
    console.error('Cluster ID is null or undefined');
    return;
  }

  const source = mapboxMap.getSource('points-clustered') as mapboxgl.GeoJSONSource;
  source.getClusterExpansionZoom(clusterId, (err, zoom) => {
    if (err) return;
    mapboxMap.easeTo({
      center: (features[0].geometry as Point).coordinates as [number, number],
      zoom: 16,
    });
  });
}

function setupMapLayers() {
  if (!mapboxMap) {
    logger.error('Map not initialized when setting up layers');
    return;
  }

  try {
    // 1. Add the map overlay image source
    mapboxMap.addSource('chevy-court-area', {
      type: 'image',
      url: '/icons/Map_Design-big-min.png',
      coordinates: [
        [-76.21532502658798, 43.055330160826315],   // Top left
        [-76.23753721914531, 43.07114978353832],    // Top right
        [-76.22037084830293, 43.08502388194864],    // Bottom right
        [-76.19757700157899, 43.06982854755563]     // Bottom left
      ]
    });

    mapboxMap.addLayer({
      id: 'chevy-court-overlay',
      type: 'raster',
      source: 'chevy-court-area',
      paint: {
        'raster-opacity': 1.0
      }
    });

    // 2. Build filtered GeoJSON (fresh data)
    const filteredGeoJson = buildFilteredGeoJSON();

    // 3. Add GeoJSON source with initial data
    mapboxMap.addSource('points-clustered', {
      type: 'geojson',
      data: filteredGeoJson,
      cluster: true,
      clusterRadius: 50,
      clusterMaxZoom: 14
    });

    // 4. Add cluster layers
    mapboxMap.addLayer({
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

    mapboxMap.addLayer({
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

    // 5. Add icon layers
    addVendorIconLayer(mapboxMap);
    addServiceIconLayer(mapboxMap);

    // 6. Setup icon click handlers and store the cleanup function
    iconClickHandlersCleanup = setupIconClickHandlers(mapboxMap, getCategoryName);

    // 7. Optional: Handle cluster clicks
    mapboxMap.on('click', 'point-clusters', handleClusterClick);

    // 8. Wait for the map to be fully rendered
    mapboxMap.once('idle', () => {
      // Mark sources as ready so queued updates can proceed
      mapSourcesReady.value = true;

      // Process any updates that were queued while layers were being set up
      processPendingMapUpdates();

      // Then finalize setup
      finalizeMapSetup();
    });
  } catch (error) {
    logger.error('Error setting up map layers:', error);
    isLoadingMap.value = false;
    dataStore.hideLoader();
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
    dataStore.hideLoader();

    // Log that map is ready
    logger.info('Map fully rendered and ready');
  } catch (error) {
    logger.error('Error finalizing map setup:', error);
    isLoadingMap.value = false;
    dataStore.hideLoader();
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
      mapboxMap.off('click', 'point-clusters', handleClusterClick);

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

onMounted(() => {
  // Setup listener for closing dropdown when clicking outside
  document.addEventListener('click', closeDropdownOnOutsideClick);

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

    &.search-focused {
      display: none;
    }

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

.suggestion-meta {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.suggestion-map-badge {
  font-size: 10px;
  background-color: #f0f0f0;
  color: #555;
  padding: 2px 5px;
  border-radius: 4px;
  margin-right: 5px;
  margin-bottom: 2px;
  display: inline-block;
  max-width: fit-content;
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
