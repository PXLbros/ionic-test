<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>New York State Fairgrounds Map</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div id="map" style="height: 100%; width: 100%;"></div>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
  import { onMounted, onUnmounted } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  export default {
    name: 'MapView',
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent },
    setup() {
      let map;
      const fairgroundsLocation = [43.0731, -76.2230]; // New York State Fairgrounds coordinates
  
      const initMap = () => {
        map = L.map('map').setView(fairgroundsLocation, 15.4);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
  
        // Add custom marker for fairgrounds
        const customMarker = L.marker(fairgroundsLocation).addTo(map);
        customMarker.bindPopup('New York State Fairgrounds').openPopup();
  
        // Add image overlay with adjusted bounds and opacity
        const imageUrl = '/src/imgs/map-image.webp';
        const imageBounds = [
          [43.0781, -76.2360], // Southwest corner of the image (moved right)
          [43.0671, -76.2130]  // Northeast corner of the image (moved right)
        ];
        L.imageOverlay(imageUrl, imageBounds, {
          opacity: 0.7, // Add opacity (70% opaque)
          interactive: false // Prevents the overlay from capturing mouse events
        }).addTo(map);
  
        // Set map bounds to restrict view
        const southWest = L.latLng(43.0631, -76.2310);
        const northEast = L.latLng(43.0831, -76.2110);
        const bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);
        map.setMinZoom(14);
        map.setMaxZoom(18);
  
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      };
  
      onMounted(() => {
        initMap();
      });
  
      onUnmounted(() => {
        if (map) {
          map.remove();
        }
      });
  
      return {};
    }
  };
  </script>
  
  <style scoped>
  @import 'leaflet/dist/leaflet.css';
  
  ion-content {
    --padding-top: 10px;
    --padding-bottom: 10px;
    --padding-start: 10px;
    --padding-end: 10px;
  }
  
  #map {
    border-radius: 10px;
    height: 100%;
    width: 100%;
  }
  </style>