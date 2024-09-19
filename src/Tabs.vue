<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">
              <ion-tab-button tab="home" href="/tabs/home">
                <ion-icon :icon="homeOutline" ></ion-icon>
                <ion-label>Home</ion-label>
              </ion-tab-button>
      
              <ion-tab-button tab="map" href="/tabs/map">
                <ion-icon :icon="mapOutline" ></ion-icon>
                <ion-label>Map</ion-label>
              </ion-tab-button>
      
              <ion-tab-button tab="fair" href="/tabs/fair">
                <ion-icon :icon="informationCircleOutline"></ion-icon>
                <ion-label>FAQ/Venue</ion-label>
              </ion-tab-button>
      
              <ion-tab-button tab="events" href="/tabs/events">
                <ion-icon :icon="personOutline"></ion-icon>
                <ion-label>Profile</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-tabs>
    </ion-page>
  </template>
  
  <script lang="ts">
    import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
    import { ellipse, square, triangle, homeOutline, mapOutline, informationCircleOutline, personOutline } from 'ionicons/icons';
  
    export default {
      name: 'Tabs',
      components: {
        IonLabel,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonPage,
        IonRouterOutlet,
      },
      setup() {
        return {
          ellipse,
          square,
          triangle,
            homeOutline,
            mapOutline,
            informationCircleOutline,
            personOutline
        };
      },
    };
  </script>