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
import { IonBackButton, IonButtons, IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { searchOutline, chevronDownOutline, optionsOutline } from 'ionicons/icons';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useDataStore } from '@/stores/data';


const mapContainer = ref<HTMLElement | null>(null);
const dataStore = useDataStore();
const vendors = dataStore.data.nysfairWebsite.vendors;
console.log('vendors', vendors);



const createVendorMarkerElement = () => {
  const element = document.createElement('div');
  const image = document.createElement('img');
  image.src = '/icons/fairgroundsl.png';
  image.style.width = '45px';
  image.style.height = '45px';
  element.appendChild(image);
  return element;
};

onMounted(() => {
  if (mapContainer.value) {
    mapboxgl.accessToken = 'pk.eyJ1IjoicHhsZGV2b3BzIiwiYSI6ImNqZjA2bmpiYjBrNTkzM285dnJobjY5aGMifQ.jw168py37rli1OcHuyI9aw';

    const map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/pxldevops/cm4uef2wm005401sm7ebof1mh',
      bearing: 222,
      center: [-76.2197, 43.073],
      zoom: 14,
      dragRotate: false,
      touchZoomRotate: true
    });

    map.addControl(new mapboxgl.NavigationControl());

    // Create gate marker element
    const createGateMarkerElement = () => {
      const element = document.createElement('div');
      const image = document.createElement('img');
      image.src = '/icons/gates.png';
      image.style.width = '45px';  // Smaller size for gate icon
      image.style.height = '45px';
      element.appendChild(image);
      return element;
    };

    // Create gate marker element
    const createStageMarkerElement = () => {
      const element = document.createElement('div');
      const image = document.createElement('img');
      image.src = '/icons/nysf-stage.png';
      image.style.width = '45px';  // Smaller size for gate icon
      image.style.height = '45px';
      element.appendChild(image);
      return element;
    };

    map.on('load', () => {
      // Get the features from the nysfair-data layer
      const features = map.querySourceFeatures('composite', {
        sourceLayer: 'NYSFair_Data'
      });

      // Find the gate feature (assuming it's the one with title "Front Gate")
      const gateFeature = features.find(feature =>
        feature.properties?.title === "Front Gate"
      );
      console.log('gateFeature', gateFeature);

      if (gateFeature?.geometry?.type === 'Point' && Array.isArray(gateFeature.geometry.coordinates)) {
        const gateMarker = new mapboxgl.Marker({
          element: createGateMarkerElement(),
          anchor: 'center'
        })
          .setLngLat(gateFeature.geometry.coordinates as [number, number])
          .addTo(map);
      }

      // Add stage feature just through normal coordinates
      const stageFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-76.2157, 43.073]
        },
        properties: {
          title: 'Chevy Court'
        }
      };

      const stageMarker = new mapboxgl.Marker({
        element: createStageMarkerElement(),
        anchor: 'center'
      })
        .setLngLat(stageFeature.geometry.coordinates as [number, number])
        .addTo(map);


      // Add debug markers for each corner
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

      // Add colored markers at each corner
      corners.forEach(corner => {
          const el = document.createElement('div');
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = corner.color;
          el.style.border = '2px solid white';
          el.innerHTML = `<span style="color: white; font-weight: bold;">${corner.label}</span>`;
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';

          new mapboxgl.Marker({
              element: el,
              anchor: 'center'
          })
          .setLngLat(corner.coords as [number, number])
          .addTo(map);
      });


      // Add the image overlay
      const testImage = new Image();
      testImage.onload = () => {
          map.addSource('chevy-court-area', {
              'type': 'image',
              'url': testImage.src,
              // Verify these coordinates by dropping pins on the map
              // and using map.getCenter() to get exact coordinates
              'coordinates': [
                  [-76.22101527351555, 43.06458007331625], // Top left
                  [-76.23286067186764, 43.073228022199714],  // Top right
                  [-76.22396000615883, 43.079945790627306], // Bottom right
                  [-76.21212430193944, 43.07221072728862]    // Bottom left
              ]
          });

          map.addLayer({
              'id': 'chevy-court-overlay',
              'type': 'raster',
              'source': 'chevy-court-area',
              'paint': {
                  'raster-opacity': 0.85
              }
          });


      };

      testImage.src = '/icons/Map_Design.png';


      // Add vendor markers
      // vendors.forEach((vendor: any) => {
      //   if (vendor.latitude && vendor.longitude) {
      //     const element = createVendorMarkerElement();

      //     new mapboxgl.Marker({
      //       element: element,
      //       anchor: 'center'
      //     })
      //       .setLngLat([parseFloat(vendor.longitude), parseFloat(vendor.latitude)])
      //       .setPopup(
      //         new mapboxgl.Popup().setHTML(`
      //           <h3>${vendor.name}</h3>
      //           ${vendor.description ? `<p>${vendor.description}</p>` : ''}
      //         `)
      //       )
      //       .addTo(map);
      //   }
      // });
    });
    map.on('click', (e) => {
        console.log(`Clicked coordinates: [${e.lngLat.lng}, ${e.lngLat.lat}]`);
    });

    setTimeout(() => {
      map.resize();
    }, 100);
  }
});

</script>

<style scoped lang="scss">
.main {
  height: calc(100vh - 66px);
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
    font-size: 14px;
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

:deep .mapboxgl-popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-height: 30vh;
  overflow-y: auto;

  h3 {
    color: black;
    margin-top: 0px;
    font-size: 18px;
    text-align: center;
    font-weight: 600;
  }

  p {
    color: black;
  }
}
:deep .gate-popup .mapboxgl-popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 300px;

  h3 {
    color: black;
    margin-top: 0;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 10px;
  }

  p {
    color: black;
    margin: 0;
    line-height: 1.4;
  }
}
</style>
