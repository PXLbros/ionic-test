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
  maxWidth: 18,
  maxHeight: 18,
};


const resizeImage = (image: HTMLImageElement, width: number, height: number): ImageData => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
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

      // console.log('service category', key, category.icon);

      categoryIconMap[key] = category.icon;
    }
  });

  // Process vendor categories
  vendorCategories.forEach((category: Category) => {
    if (category.icon) {
      const key = `vendor-category-icon-${category.id}`;

      // console.log('vendor category', key, category.icon);

      categoryIconMap[key] = category.icon;
    }
  });

  // Create a Set to track unique icon URLs to avoid loading duplicates
  const loadPromises: Promise<void>[] = [];

  // Helper function to load an image and add it to the map
  const loadImage = (url: string, imageId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Check if resizing is needed
          const shouldResize = (config.maxWidth && img.width > config.maxWidth) ||
                               (config.maxHeight && img.height > config.maxHeight);

          if (shouldResize) {
            let scale = 1;

            // Calculate scale factor while preserving aspect ratio
            const widthScale = config.maxWidth ? config.maxWidth / img.width : 1;
            const heightScale = config.maxHeight ? config.maxHeight / img.height : 1;

            // Use the smaller of the two to ensure both constraints are respected
            scale = Math.min(widthScale, heightScale);

            width = Math.round(img.width * scale);
            height = Math.round(img.height * scale);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);

          map.addImage(imageId, {
            width: imageData.width,
            height: imageData.height,
            data: imageData.data
          } as ImageData);

          resolve();
        } catch (err) {
          const errorMessage = `Failed to process icon ${imageId}: ${err instanceof Error ? err.message : String(err)}`;
          console.error(errorMessage);
          loadErrors.push(errorMessage);
          config.failOnIconError ? reject(new Error(errorMessage)) : resolve();
        }
      };

      img.onerror = () => {
        const errorMessage = `Failed to load icon ${imageId} from URL ${url}`;
        console.error(errorMessage);
        loadErrors.push(errorMessage);
        config.failOnIconError ? reject(new Error(errorMessage)) : resolve();
      };

      img.src = url;
    });
  };


  // Load each unique category icon in parallel
  Object.entries(categoryIconMap).forEach(([iconId, iconUrl]) => {
    if (!iconUrl) {
      return;
    }

    loadPromises.push(loadImage(iconUrl, iconId));
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
      // 'icon-image': 'default-vendor-icon',
      'icon-image': [
        'case',
        ['has', 'categories'],
        ['concat', 'vendor-category-icon-', ['to-string', ['at', 0, ['get', 'categories']]]],
        'default-vendor-icon',
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
      // 'icon-image': 'default-service-icon',
      'icon-image': [
        'case',
        ['has', 'categories'],
        ['concat', 'service-category-icon-', ['to-string', ['at', 0, ['get', 'categories']]]],
        'default-service-icon',
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
  console.log('--------------- SETUP ICON CLICK HANDLERS!');

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
