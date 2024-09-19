<template>
  <ion-page>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-title>NYSFairgrounds</ion-title>
    </ion-toolbar>
  </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title class="main-title" size="large">New York State Fairgrounds</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card>
        <ion-card-header class="info-container">
          <ion-card-title class="info-container__title">Welcome, Matt!</ion-card-title>
        </ion-card-header>
    
        <ion-card-content>
          <p class="description">
            The New York State Fairgrounds is a 375-acre exhibit and entertainment complex located in Syracuse, New York.
          </p>
        </ion-card-content>
      </ion-card>

      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonFooter, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonGrid, IonRow, IonCol } from '@ionic/vue';
import Tabs from '@/Tabs.vue';

</script>

<style scoped lang="scss">

.main-title {
  font-size: 26px;
  font-family: 'Pally', sans-serif;
}

p {
  font-family: 'General Sans', sans-serif; 
}

ion-icon {
  color: white;
}

.info-container {
  padding-bottom: 10px;

  &__title {
    font-size: 22px;
    font-family: 'General Sans', sans-serif; 
  }
}

.description {
  font-weight: 600;
}

ion-button {
  --border-radius: 5px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0px 10px;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>
