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

// Configuration for icon loading
export interface CategoryIconLoadingConfig {
  /**
   * If true, will throw an error and stop the application when an icon fails to load
   * If false, will log errors and continue loading other icons
   * @default false
   */
  failOnIconError: boolean;

  /**
   * Optional max width to resize icons (in pixels)
   */
  maxWidth?: number;

  /**
   * Optional max height to resize icons (in pixels)
   */
  maxHeight?: number;
}

const defaultCategoryIconLoadingConfig: CategoryIconLoadingConfig = {
  failOnIconError: false,
  maxWidth: 45,
  maxHeight: 45,
};

/**
 * Loads category icons for the map
 * @param map Mapbox map instance
 * @param serviceCategories Array of service categories
 * @param vendorCategories Array of vendor categories
 * @param config Configuration for icon loading behavior
 * @returns Promise that resolves when all icons are loaded
 * @throws Error if failOnIconError is true and any icon fails to load
 */
export async function loadCategoryIcons({
  map,
  serviceCategories,
  vendorCategories,
  config = defaultCategoryIconLoadingConfig
}: {
  map: mapboxgl.Map,
  serviceCategories: Category[],
  vendorCategories: Category[],
  config?: CategoryIconLoadingConfig
}): Promise<void> {
  // Create a mapping of category IDs to their icon URLs
  const categoryIconMap: Record<string, string> = {};
  const loadErrors: string[] = [];

  // Process service categories
  serviceCategories.forEach((category: Category) => {
    if (category.icon) {
      const key = `service-category-icon-${category.id}`;
      categoryIconMap[key] = category.icon;
    }
  });

  // Process vendor categories
  vendorCategories.forEach((category: Category) => {
    if (category.icon) {
      const key = `vendor-category-icon-${category.id}`;
      categoryIconMap[key] = category.icon;
    }
  });

  // Helper function to load an image with modern Mapbox API
  const loadImage = (url: string, imageId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if image is already loaded
      if (map.hasImage(imageId)) {
        resolve();
        return;
      }

      // Modern approach using map.loadImage
      map.loadImage(url, (error, image) => {
        if (error) {
          const errorMessage = `Failed to load icon ${imageId} from URL ${url}: ${error.message}`;
          console.error(errorMessage);
          loadErrors.push(errorMessage);

          if (config.failOnIconError) {
            reject(new Error(errorMessage));
          } else {
            resolve();
          }
          return;
        }

        if (!image) {
          const errorMessage = `Image loaded but is null: ${imageId}`;
          console.error(errorMessage);
          loadErrors.push(errorMessage);

          if (config.failOnIconError) {
            reject(new Error(errorMessage));
          } else {
            resolve();
          }
          return;
        }

        try {
          // Add the image to the map
          if (!map.hasImage(imageId)) {
            // If resizing is requested, use canvas
            if ((config.maxWidth && image.width > config.maxWidth) ||
                (config.maxHeight && image.height > config.maxHeight)) {

              // Create a canvas to resize
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');

              if (!ctx) {
                throw new Error('Failed to get canvas context for resizing');
              }

              // Calculate new dimensions
              let width = image.width;
              let height = image.height;

              const widthScale = config.maxWidth ? config.maxWidth / image.width : 1;
              const heightScale = config.maxHeight ? config.maxHeight / image.height : 1;
              const scale = Math.min(widthScale, heightScale);

              width = Math.round(image.width * scale);
              height = Math.round(image.height * scale);

              // Set canvas dimensions and draw the resized image
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(image, 0, 0, width, height);

              // Get image data from canvas
              const imageData = ctx.getImageData(0, 0, width, height);

              map.addImage(imageId, imageData);
            } else {
              // Add original image without resizing
              map.addImage(imageId, image);
            }
          }

          resolve();
        } catch (err) {
          const errorMessage = `Error adding image ${imageId} to map: ${err instanceof Error ? err.message : String(err)}`;
          console.error(errorMessage);
          loadErrors.push(errorMessage);

          if (config.failOnIconError) {
            reject(new Error(errorMessage));
          } else {
            resolve();
          }
        }
      });
    });
  };

  // Load all the icons in parallel
  const loadPromises: Promise<void>[] = [];

  // Load category icons
  Object.entries(categoryIconMap).forEach(([iconId, iconUrl]) => {
    if (iconUrl) {
      loadPromises.push(loadImage(iconUrl, iconId));
    }
  });

  // Load default icons
  loadPromises.push(loadImage('/icons/default-category.png', 'default-vendor-icon'));
  loadPromises.push(loadImage('/icons/default-category.png', 'default-service-icon'));

  // Wait for all icons to load
  try {
    await Promise.all(loadPromises);

    // If there were errors but we didn't fail fast, still report them
    if (loadErrors.length > 0) {
      console.warn(`Completed icon loading with ${loadErrors.length} errors:`, loadErrors);
    }
  } catch (error) {
    // This will only be reached if failOnIconError is true
    console.error('Icon loading failed:', error);
    throw new Error(`Failed to load map icons: ${error instanceof Error ? error.message : String(error)}`);
  }
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
      // Simplified expression with better type handling
      'icon-image': [
        'match',
        ['typeof', ['get', 'categories']],
        'string',
        // If it's a string, use a default icon
        'default-vendor-icon',
        // Otherwise check if we have categories
        [
          'case',
          // Check if we have any categories
          ['>', ['length', ['get', 'categories']], 0],
          // If yes, use the first category ID for the icon
          ['concat', 'vendor-category-icon-', ['to-string', ['at', 0, ['get', 'categories']]]],
          // Otherwise use default
          'default-vendor-icon'
        ]
      ],
      'icon-size': 0.5,
      // 'icon-size': [
      //   'interpolate', ['linear'], ['zoom'],
      //   13, 0.3,  // At zoom level 13, icons are smaller
      //   17, 0.5   // At zoom level 17, icons are larger
      // ],
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom',
      // 'icon-offset': [0, 0],
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
      // Use a simpler match expression that Mapbox GL supports
      'icon-image': [
        'match',
        ['typeof', ['get', 'categories']],
        'string',
        // If it's a string, use a default icon
        'default-service-icon',
        // Otherwise check if we have categories
        [
          'case',
          // Check if we have any categories
          ['>', ['length', ['get', 'categories']], 0],
          // If yes, use the first category ID for the icon
          ['concat', 'service-category-icon-', ['to-string', ['at', 0, ['get', 'categories']]]],
          // Otherwise use default
          'default-service-icon'
        ]
      ],
      'icon-size': 1.1,
      // 'icon-size': [
      //   'interpolate', ['linear'], ['zoom'],
      //   13, 0.7,  // At zoom level 13, icons are smaller
      //   17, 1.1   // At zoom level 17, icons are larger
      // ],
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom',
      // 'icon-offset': [0, 0],
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
  let activePopup: mapboxgl.Popup | null = null;

  // Helper function to create a popup with dynamic positioning
  const createPopup = (coordinates: [number, number], content: string) => {
    // Close any existing popup
    if (activePopup) {
      activePopup.remove();
    }

    // Create a new popup
    activePopup = new mapboxgl.Popup({
      offset: 25, // Default offset for better positioning
      anchor: 'top', // Adjusted to a valid anchor value
    })
      .setLngLat(coordinates)
      .setHTML(content)
      .addTo(map);

    // Reset activePopup when the popup is closed
    activePopup.on('close', () => {
      activePopup = null;
    });
  };

  // Vendor icon click handler
  const handleVendorIconClick = (e: mapboxgl.MapLayerEventType['click'] & mapboxgl.EventData) => {
    if (!e.features || e.features.length === 0) return;

    const feature = e.features[0];
    const coordinates = (feature.geometry as any).coordinates.slice() as [number, number];
    const { name, description } = feature.properties as any;

    // Center the map on the clicked point
    map.flyTo({
      center: coordinates,
      zoom: 17,
      essential: true,
    });

    // Create popup content
    const popupContent = `
      <div class="vendor-popup">
        <h3>${name}</h3>
        ${description ? `<p>${description}</p>` : ''}
        <p class="popup-type">Vendor</p>
      </div>
    `;

    // Show the popup
    createPopup(coordinates, popupContent);
  };

  // Service icon click handler
  const handleServiceIconClick = (e: mapboxgl.MapLayerEventType['click'] & mapboxgl.EventData) => {
    if (!e.features || e.features.length === 0) return;

    const feature = e.features[0];
    const coordinates = (feature.geometry as any).coordinates.slice() as [number, number];
    const props = feature.properties as any;

    // Get category names for this service if categories exist
    let categoryNames = '';
    if (props.categories) {
      try {
        const categoriesArray = Array.isArray(props.categories)
          ? props.categories
          : JSON.parse(props.categories);
        if (categoriesArray.length > 0) {
          const names = categoriesArray.map((id: any) => getCategoryName(Number(id)));
          categoryNames = `<p class="popup-category">${names.join(', ')}</p>`;
        }
      } catch (error) {
        console.error('Error parsing categories:', error);
      }
    }

    // Center the map on the clicked point
    map.flyTo({
      center: coordinates,
      zoom: 17,
      essential: true,
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

    // Show the popup
    createPopup(coordinates, popupContent);
  };

  // Move event handler
  const handleMapMove = () => {
    if (activePopup) {
      const popupLngLat = activePopup.getLngLat();
      activePopup.setLngLat(popupLngLat); // Reposition the popup to stay anchored
    }
  };

  // Register click handlers
  map.on('click', 'vendor-icon', handleVendorIconClick);
  map.on('click', 'service-icon', handleServiceIconClick);

  // Register move handler
  map.on('move', handleMapMove);

  // Return a cleanup function that removes all the event handlers
  return () => {
    map.off('click', 'vendor-icon', handleVendorIconClick);
    map.off('click', 'service-icon', handleServiceIconClick);
    map.off('move', handleMapMove); // Remove the move event listener

    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
  };
}
