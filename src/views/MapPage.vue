// src/views/MapPage.vue
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Fairground Map</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>

      <ion-card class="header-card">
        <ion-card-header >
          <ion-card-title>Map View of the Fairgrounds</ion-card-title>
          <ion-card-subtitle>Explore the property</ion-card-subtitle>
        </ion-card-header>
        
        <ion-card-content>
          Just a nice little place to put some information about the map and what you can do with it.
        </ion-card-content>
      </ion-card>
      <ion-content class="ion-padding">
        <div class="map" ref="mapContainer" style="width: 100%; height: 100%"></div>
      </ion-content>
    </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { IonBackButton, IonFooter, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default defineComponent({
  name: 'MapPage',
  components: { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle  },
  setup() {
    const mapContainer = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (mapContainer.value) {
        mapboxgl.accessToken = 'pk.eyJ1IjoibWtldHRlbGthbXAiLCJhIjoiY2xhaXljbjZ3MDQ0NDN2bndzZnJrc3FxMyJ9.LEl_hT5f2QSxqw2LTf03lQ';

        const map = new mapboxgl.Map({
          container: mapContainer.value,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-76.2157, 43.073], // Default coordinates (replace with your fairground's location)
          zoom: 14
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());

        // Add a marker for an attraction
        new mapboxgl.Marker()
          .setLngLat([-76.2157, 43.073])
          .setPopup(new mapboxgl.Popup().setHTML("<h3>Ferris Wheel</h3><p>Enjoy a great view of the fairground!</p>"))
          .addTo(map);

        // You can add more markers and customizations here

        setTimeout(() => {
          // resize the map to 50% of the screen height
          map.resize();
        }, 100);
      }
    });

    return { mapContainer };
  }
});
</script>

<style scoped lang="scss">

.header-card {
  padding-bottom: 0px;
  margin-bottom: 0px;
}
.ion-padding {
  height: 60%;
}

.map-section {
    padding: 15px;
}

.map {
    width: 100%;
    height: 50%;
    padding: 15px;
    border-radius: 10px;

}
.mapboxgl-canvas {
    width: 100%;
    height: 100%;
    border-radius: 30px;
}

/* Use v-deep to apply styles to elements outside the component scope */
:deep .mapboxgl-popup-content {
  background-color: black;
  padding: 10px;
  border-radius: 8px;

  h3 {
    color: white;
    margin-top: 0px;
    font-size: 18px;
  }

  p {
    color: white;
  }

  button {
    margin: 5px;
  }
}

</style>