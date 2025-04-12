// mapIconUtils.ts
import mapboxgl, { DataDrivenPropertyValueSpecification } from 'mapbox-gl';
import { useLogger } from '@/composables/useLogger';

const logger = useLogger();

export enum MapLayer {
  MapClusterIcon = 'map-cluster-icon',
  MapClusterCount = 'map-cluster-count',
  MapIcon = 'map-icon',
  ChevyCourtOverlay = 'chevy-court-overlay',
}

export enum MapSource {
  PointsClustered = 'points-clustered',
  ChevyCourtArea = 'chevy-court-area',
}

// Interface for category
interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  num_services?: number;
  num_vendors?: number;
  maps?: number[];
  map_slugs?: string[]; // Added for slug-based lookup
}

// Update the CategoryIconLoadingConfig interface to support separate settings for clusters and icons
export interface CategoryIconLoadingConfig {
  failOnIconError: boolean;

  /**
   * Configuration for cluster icons
   */
  cluster: {
    maxWidth: number;
    maxHeight: number;
  };

  /**
   * Configuration for regular icons
   */
  icon: {
    maxWidth: number;
    maxHeight: number;
  };

  upsizeToMax?: boolean;
}

// Update the default configuration
const defaultCategoryIconLoadingConfig: CategoryIconLoadingConfig = {
  failOnIconError: false,
  cluster: {
    maxWidth: 125,
    maxHeight: 125,
  },
  icon: {
    maxWidth: 75,
    maxHeight: 75,
  },
  upsizeToMax: true,
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
  maps,
  serviceCategories,
  vendorCategories,
  config = defaultCategoryIconLoadingConfig
}: {
  map: mapboxgl.Map,
  maps: any[],
  serviceCategories: Category[],
  vendorCategories: Category[],
  config?: CategoryIconLoadingConfig
}): Promise<void> {
  // Create a mapping of category IDs to their icon URLs
  const categoryIconMap: Record<string, string> = {};
  const loadErrors: string[] = [];

  // // Process service categories
  // serviceCategories.forEach((category: Category) => {
  //   if (category.icon) {
  //     const key = `service-category-icon-${category.id}`;
  //     categoryIconMap[key] = category.icon;
  //   }
  // });

  // // Process vendor categories
  // vendorCategories.forEach((category: Category) => {
  //   if (category.icon) {
  //     const key = `vendor-category-icon-${category.id}`;
  //     categoryIconMap[key] = category.icon;
  //   }
  // });

  maps.forEach((map: any) => {
    // if (map.map_cluster_icon) {
    //   const key = `map-cluster-icon-${map.slug}`;

    //   categoryIconMap[key] = map.map_cluster_icon;
    // }

    // if (map.map_icon) {
    //   const key = `map-icon-${map.slug}`;

    //   categoryIconMap[key] = map.map_icon;
    // }

    const slug = map.slug;

    const clusterKey = `map-cluster-icon-${slug}`;
    const iconKey = `map-icon-${slug}`;

    categoryIconMap[clusterKey] = map.map_cluster_icon || '/icons/default-map-cluster-icon.png';
    categoryIconMap[iconKey] = map.map_icon || '/icons/default-map-icon.png';
  });

  // vendorMaps.forEach((map: any) => {
  //   if (map.map_cluster_icon) {
  //     const key = `map-cluster-icon-${map.slug}`;

  //     if (!categoryIconMap[key]) {
  //       categoryIconMap[key] = map.map_cluster_icon;
  //     }
  //   }

  //   if (map.map_icon) {
  //     const key = `map-icon-${map.slug}`;

  //     if (!categoryIconMap[key]) {
  //       categoryIconMap[key] = map.map_icon;
  //     }
  //   }
  // });

  // Helper function to load an image with modern Mapbox API
  const loadImage = (url: string, imageId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if image is already loaded
      if (map.hasImage(imageId)) {
        resolve();
        return;
      }

      map.loadImage(url, (error, image) => {
        if (error) {
          const errorMessage = `Failed to load icon ${imageId} from URL ${url}: ${error.message}`;

          logger.error(errorMessage);

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

          logger.error(errorMessage);

          loadErrors.push(errorMessage);

          if (config.failOnIconError) {
            reject(new Error(errorMessage));
          } else {
            resolve();
          }

          return;
        }

        try {
          if (!map.hasImage(imageId)) {
            let newImageWidth;
            let newImageHeight;
            let resizedImage = false;

            // Determine if this is a cluster icon or a regular icon
            const isClusterIcon = imageId.includes('map-cluster-icon');
            const maxWidth = isClusterIcon ? config.cluster.maxWidth : config.icon.maxWidth;
            const maxHeight = isClusterIcon ? config.cluster.maxHeight : config.icon.maxHeight;

            if (
              (maxWidth && image.width > maxWidth) ||
              (maxHeight && image.height > maxHeight) ||
              config.upsizeToMax
            ) {
              // Create a canvas to resize
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');

              if (!ctx) {
                throw new Error('Failed to get canvas context for resizing');
              }

              // Calculate new dimensions
              let width = image.width;
              let height = image.height;

              const scale = config.upsizeToMax
                ? Math.min(
                    maxWidth ? maxWidth / image.width : 1,
                    maxHeight ? maxHeight / image.height : 1
                  )
                : Math.min(
                    maxWidth ? maxWidth / image.width : 1,
                    maxHeight ? maxHeight / image.height : 1
                  );

              width = Math.round(image.width * scale);
              height = Math.round(image.height * scale);

              // Set canvas dimensions and draw the resized image
              canvas.width = width;
              canvas.height = height;

              if (image instanceof HTMLImageElement || image instanceof ImageBitmap) {
                ctx.drawImage(image, 0, 0, width, height);
              } else {
                throw new Error('Unsupported image type for drawing on canvas');
              }

              const imageData = ctx.getImageData(0, 0, width, height);
              map.addImage(imageId, imageData);

              newImageWidth = width;
              newImageHeight = height;
              resizedImage = true;
            } else {
              // Add original image without resizing
              map.addImage(imageId, image);

              newImageWidth = image.width;
              newImageHeight = image.height;
            }

            logger.debug('Added image to map', {
              'Image ID': imageId,
              'Size': `${newImageWidth}x${newImageHeight}`,
              'Type': isClusterIcon ? 'Cluster Icon' : 'Regular Icon',
              'Resized': resizedImage ? `Yes (from ${image.width}x${image.height})` : 'No',
              'URL': url,
            });
          }

          resolve();
        } catch (err) {
          const errorMessage = `Error adding image ${imageId} to map: ${err instanceof Error ? err.message : String(err)}`;

          logger.error(errorMessage);

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
  // loadPromises.push(loadImage('/icons/default-category.png', 'default-vendor-icon'));
  // loadPromises.push(loadImage('/icons/default-category.png', 'default-service-icon'));

  loadPromises.push(loadImage('/icons/default-map-cluster-icon.png', 'default-map-cluster-icon'));
  loadPromises.push(loadImage('/icons/default-map-icon.png', 'default-map-icon'));

  const numCategoryIcons = Object.keys(categoryIconMap).length;

  // Wait for all icons to load
  try {
    await Promise.all(loadPromises);

    const numLoadErrors = loadErrors.length || 0;
    const allFailed = numLoadErrors === numCategoryIcons;

    if (allFailed) {
      throw new Error(`Failed to load all ${numCategoryIcons} category icons`);
    } else if (numLoadErrors > 0) {
      const numLoadedCategoryIcons = numCategoryIcons - numLoadErrors;

      logger.warn('Some category icons failed to load', {
        'Total Count': numCategoryIcons,
        'Loaded Count': numLoadedCategoryIcons,
        'Failed Count': numLoadErrors,
      });
    } else {
      logger.info('Category icons loaded successfully', {
        'Count': numCategoryIcons,
      });
    }
  } catch (error) {
    // This will only be reached if failOnIconError is true
    logger.error('Icon loading failed:', error);

    throw new Error(`Failed to load map icons: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// feature example:
// {
//   "type": "Feature",
//   "properties": {
//       "name": "Valley Post American Legion",
//       "description": "Vet Group",
//       "id": 52013,
//       "type": "vendor",
//       "categories": [
//           144
//       ],
//       "mapSlugs": [
//           "master",
//           "vendors-exhibitors"
//       ],
//       currentMapSlug: 'master',
//   },
//   "geometry": {
//       "type": "Point",
//       "coordinates": [
//           -76.217346,
//           43.070567
//       ]
//   }
// }

export function getMapClusterIconImageExpression({ maps, currentMapIndex }: { maps: any[], currentMapIndex: number }): DataDrivenPropertyValueSpecification<string> {
  return [
    'match',
    currentMapIndex, // <<-- Direct value
    ...maps.flatMap((map, index) => [index, `map-cluster-icon-${map.slug}`]),
    'default-map-cluster-icon'
  ];
}

export function addMapClusterIconLayer(mapboxMap: mapboxgl.Map, maps: any[], currentMapIndex: number) {
  mapboxMap.addLayer({
    id: MapLayer.MapClusterIcon,
    type: 'symbol',
    source: MapSource.PointsClustered,
    filter: ['has', 'point_count'],
    layout: {
      'icon-image': getMapClusterIconImageExpression({ maps, currentMapIndex }),
      'icon-size': 0.5,
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom',
    }
  });

  mapboxMap.addLayer({
    id: MapLayer.MapClusterCount,
    type: 'symbol',
    source: MapSource.PointsClustered,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-size': 15,
      'text-offset': [-0.1, -2.9],
      'text-anchor': 'center',
      'text-justify': 'center',
    },
    paint: {
      'text-color': '#ffffff'
    }
  });

  // Update the icon-image dynamically when the current map index changes
  watch(
    () => currentMapIndex,
    () => {
      if (mapboxMap.getLayer(MapLayer.MapClusterIcon)) {
        mapboxMap.setLayoutProperty(
          MapLayer.MapClusterIcon,
          'icon-image',
          iconImageExpression
        );
      }
    }
  );
}

export function addMapIconLayer(map: mapboxgl.Map) {
  map.addLayer({
    id: MapLayer.MapIcon,
    type: 'symbol',
    source: MapSource.PointsClustered,
    filter: [
      'all',
      ['!', ['has', 'point_count']],
    ],
    layout: {
      // Use currentMapSlug from feature properties instead of mapSlugs array
      'icon-image': [
        'case',
        ['has', 'currentMapSlug'],
        [
          'case',
          ['!=', ['get', 'currentMapSlug'], ''],
          [
            'case',
            ['has', ['concat', 'map-icon-', ['get', 'currentMapSlug']]],
            ['concat', 'map-icon-', ['get', 'currentMapSlug']],
            'default-map-icon'
          ],
          'default-map-icon'
        ],
        'default-map-icon'
      ],
      'icon-size': 0.5,
      'icon-allow-overlap': true,
      'icon-anchor': 'bottom',
    }
  });
}

// export function addVendorMapClusterIconLayer(map: mapboxgl.Map) {
//   map.addLayer({
//     id: 'vendor-map-cluster-icon',
//     type: 'symbol',
//     source: 'points-clustered',
//     filter: ['has', 'point_count'],
//     layout: {
//       'icon-image': 'default-map-cluster-icon',
//       'icon-size': 0.5,
//       'icon-allow-overlap': true,
//       'icon-anchor': 'bottom',
//     }
//   });
// }

// export function addVendorMapIconLayer(map: mapboxgl.Map) {
//   map.addLayer({
//     id: 'vendor-map-icon',
//     type: 'symbol',
//     source: 'points-clustered',
//     filter: [
//       'all',
//       ['!', ['has', 'point_count']],
//       ['==', ['get', 'type'], 'vendor']
//     ],
//     layout: {
//       'icon-image': 'default-map-icon',
//       'icon-size': 0.5,
//       'icon-allow-overlap': true,
//       'icon-anchor': 'bottom',
//     }
//   });
// }

// /**
//  * Creates the vendor icon layer
//  * @param map Mapbox map instance
//  */
// export function addVendorIconLayer(map: mapboxgl.Map) {
//   map.addLayer({
//     id: 'vendor-icon',
//     type: 'symbol',
//     source: 'points-clustered',
//     filter: [
//       'all',
//       ['!', ['has', 'point_count']],
//       ['==', ['get', 'type'], 'vendor']
//     ],
//     layout: {
//       // Simplified expression with better type handling
//       'icon-image': [
//         'match',
//         ['typeof', ['get', 'categories']],
//         'string',
//         // If it's a string, use a default icon
//         'default-vendor-icon',
//         // Otherwise check if we have categories
//         [
//           'case',
//           // Check if we have any categories
//           ['>', ['length', ['get', 'categories']], 0],
//           // If yes, use the first category ID for the icon
//           ['concat', 'vendor-category-icon-', ['to-string', ['at', 0, ['get', 'categories']]]],
//           // Otherwise use default
//           'default-vendor-icon'
//         ]
//       ],
//       'icon-size': 0.5,
//       // 'icon-size': [
//       //   'interpolate', ['linear'], ['zoom'],
//       //   13, 0.3,  // At zoom level 13, icons are smaller
//       //   17, 0.5   // At zoom level 17, icons are larger
//       // ],
//       'icon-allow-overlap': true,
//       'icon-anchor': 'bottom',
//       // 'icon-offset': [0, 0],
//     }
//   });
// }

// /**
//  * Creates the service icon layer
//  * @param map Mapbox map instance
//  */
// export function addServiceIconLayer(map: mapboxgl.Map) {
//   map.addLayer({
//     id: 'service-icon',
//     type: 'symbol',
//     source: 'points-clustered',
//     filter: [
//       'all',
//       ['!', ['has', 'point_count']],
//       ['==', ['get', 'type'], 'service']
//     ],
//     layout: {
//       // Use a simpler match expression that Mapbox GL supports
//       'icon-image': [
//         'match',
//         ['typeof', ['get', 'categories']],
//         'string',
//         // If it's a string, use a default icon
//         'default-service-icon',
//         // Otherwise check if we have categories
//         [
//           'case',
//           // Check if we have any categories
//           ['>', ['length', ['get', 'categories']], 0],
//           // If yes, use the first category ID for the icon
//           ['concat', 'service-category-icon-', ['to-string', ['at', 0, ['get', 'categories']]]],
//           // Otherwise use default
//           'default-service-icon'
//         ]
//       ],
//       'icon-size': 1.1,
//       // 'icon-size': [
//       //   'interpolate', ['linear'], ['zoom'],
//       //   13, 0.7,  // At zoom level 13, icons are smaller
//       //   17, 1.1   // At zoom level 17, icons are larger
//       // ],
//       'icon-allow-overlap': true,
//       'icon-anchor': 'bottom',
//       // 'icon-offset': [0, 0],
//     }
//   });
// }

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
      offset: [0, 0], // Adjusted offset to make the popup touch the icon's bottom
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

  // Helper function to center the map on coordinates
  const centerMapOnPoint = (coordinates: [number, number]) => {
    map.flyTo({
      center: coordinates,
      zoom: 17,
      essential: true,
    });
  };

  // Vendor icon click handler
  const handleVendorIconClick = (e: mapboxgl.MapLayerEventType['click'] & mapboxgl.EventData) => {
    if (!e.features || e.features.length === 0) return;

    const feature = e.features[0];
    const coordinates = (feature.geometry as any).coordinates.slice() as [number, number];
    const { name, description } = feature.properties as any;

    // Center the map on the clicked point
    centerMapOnPoint(coordinates);

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
        logger.error('Error parsing categories:', error);
      }
    }

    // Center the map on the clicked point
    centerMapOnPoint(coordinates);

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
  map.on('click', 'vendor-map-icon', handleVendorIconClick);
  map.on('click', 'service-map-icon', handleServiceIconClick);

  // Register move handler
  map.on('move', handleMapMove);

  // Return a cleanup function that removes all the event handlers
  return () => {
    map.off('click', 'vendor-map-icon', handleVendorIconClick);
    map.off('click', 'service-map-icon', handleServiceIconClick);
    map.off('move', handleMapMove); // Remove the move event listener

    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
  };
}
