// mapIconUtils.ts
import mapboxgl from 'mapbox-gl';

// Interface for category
interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  num_services?: number;
  num_vendors?: number;
  maps?: number[];
}

/**
 * Loads category icons for the map
 * @param map Mapbox map instance
 * @param serviceCategories Array of service categories
 * @param vendorCategories Array of vendor categories
 * @returns Promise that resolves when all icons are loaded
 */
export async function loadCategoryIcons({
  map,
  serviceCategories,
  vendorCategories,
}: {
  map: mapboxgl.Map,
  serviceCategories: Category[],
  vendorCategories: Category[]
}): Promise<void> {
  // Create a mapping of category IDs to their icon URLs
  const categoryIconMap: Record<number, string> = {};

  // Process service categories
  serviceCategories.forEach((category: Category) => {
    if (category.icon) {
      categoryIconMap[category.id] = category.icon;
    }
  });

  // Process vendor categories
  vendorCategories.forEach((category: Category) => {
    if (category.icon) {
      categoryIconMap[category.id] = category.icon;
    }
  });

  // Create a Set to track unique icon URLs to avoid loading duplicates
  const loadedImages = new Set<string>();
  const loadPromises: Promise<void>[] = [];

  // Helper function to load an image and add it to the map
  const loadImage = (url: string, imageId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      map.loadImage(url, (error, image) => {
        if (error) {
          console.warn(`Failed to load icon ${imageId}:`, error);
          // Resolve anyway to continue with other icons
          resolve();
          return;
        }

        try {
          // Add the image to the map style
          if (image) {
            map.addImage(imageId, image);
          }
          resolve();
        } catch (err) {
          console.error(`Failed to add icon ${imageId}:`, err);
          // Resolve anyway to continue with other icons
          resolve();
        }
      });
    });
  };

  // Load each unique category icon in parallel
  Object.entries(categoryIconMap).forEach(([categoryId, iconUrl]) => {
    if (loadedImages.has(iconUrl) || !iconUrl) return;

    const iconId = `category-icon-${categoryId}`;
    loadPromises.push(loadImage(iconUrl, iconId));
    loadedImages.add(iconUrl);
  });

  // Load default icons
  loadPromises.push(loadImage('/icons/pig.png', 'default-vendor-icon'));
  loadPromises.push(loadImage('/icons/pig.png', 'default-service-icon'));

  // Wait for all icons to load
  await Promise.all(loadPromises);
}

/**
 * Creates the vendor icon layer
 * @param map Mapbox map instance
 */
export function addVendorIconLayer(map: mapboxgl.Map) {
  map.addLayer({
    id: 'vendor-icon',
    type: 'symbol',
    source: 'points-clustered',
    filter: [
      'all',
      ['!', ['has', 'point_count']],
      ['==', ['get', 'type'], 'vendor']
    ],
    layout: {
      'icon-image': [
        'case',
        ['has', 'categories'],
        // Extract just the ID from the category object
        ['concat', 'category-icon-',
          ['to-string',
            ['coalesce',
              // Try to get the id property if it exists
              ['get', 'id', ['at', 0, ['get', 'categories']]],
              // Otherwise use the raw value (for simple number IDs)
              ['at', 0, ['get', 'categories']]
            ]
          ]
        ],
        // Fallback
        'default-vendor-icon'
      ],
      'icon-size': 0.5,
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom'
    }
  });
}

/**
 * Creates the service icon layer
 * @param map Mapbox map instance
 */
export function addServiceIconLayer(map: mapboxgl.Map) {
  map.addLayer({
    id: 'service-icon',
    type: 'symbol',
    source: 'points-clustered',
    filter: [
      'all',
      ['!', ['has', 'point_count']],
      ['==', ['get', 'type'], 'service']
    ],
    layout: {
      'icon-image': [
        'case',
        ['has', 'categories'],
        // Check if there's at least one category
        ['concat', 'category-icon-', ['to-string', ['at', 0, ['get', 'categories']]]],
        // Fallback
        'default-service-icon'
      ],
      'icon-size': 1.1,
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom'
    }
  });
}

/**
 * Creates handlers for icon click events
 * @param map Mapbox map instance
 * @param getCategoryName Function to get category name by ID
 */
export function setupIconClickHandlers(
  map: mapboxgl.Map,
  getCategoryName: (categoryId: number) => string
) {
  // Vendor icon click handler
  map.on('click', 'vendor-icon', (e) => {
    if (!e.features || e.features.length === 0) return;

    const feature = e.features[0];
    const coordinates = (feature.geometry as any).coordinates.slice();
    const { name, description } = feature.properties as any;

    // Center the map on the clicked point
    map.flyTo({
      center: coordinates as [number, number],
      zoom: 17,
      essential: true
    });

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

  // Service icon click handler
  map.on('click', 'service-icon', (e) => {
    if (!e.features || e.features.length === 0) {
      return;
    }


    const feature = e.features[0];
    const coordinates = (feature.geometry as any).coordinates.slice();
    const props = feature.properties as any;

    // Get category names for this service if categories exist
    let categoryNames = '';
    let categoryNamesRaw = '';

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
          categoryNamesRaw = names.join(', ');
        }
      } catch (error) {
        console.error('Error parsing categories:', error);
      }
    }

    console.log(`Service icon clicked (Categories: ${categoryNamesRaw})`);

    // Center the map on the clicked point
    map.flyTo({
      center: coordinates as [number, number],
      zoom: 17,
      essential: true
    });

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
}
