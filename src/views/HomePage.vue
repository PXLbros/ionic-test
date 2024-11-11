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
          <VNode v-if="VNode" class="description" />
        </ion-card-content>
      </ion-card>

      <div class="home-content">
        <div class="home-content__container">
          <img class="featured-img" src="/src/imgs/featured-fair.png" alt="">
          <h2 class="img-header">THE FAIR</h2>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonFooter, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonGrid, IonRow, IonCol } from '@ionic/vue';
import Tabs from '@/Tabs.vue';
import { StrapiBlocks } from 'vue-strapi-blocks-renderer';
// import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();

const VNode = dataStore?.data?.mobileApp ? StrapiBlocks({ content: dataStore.data.mobileApp.homePage.introText }) : null;
</script>

<style scoped lang="scss">

.main-title {
  font-size: 26px;
  font-family: 'Pally', sans-serif;
}

.home-content {
  display: flex;
  width: 100%;
  justify-content: center;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;

    .featured-img {
      max-height: 250px;
    }

    .img-header {
      position: absolute;
      top: 0;
      left: -10px;
      font-size: 36px;
      backdrop-filter: blur(1px);
      color: white;
      background-color: #1E5EAE;
      padding: 2px 8px;
      border-radius: 10px;
      font-family: 'Pally', sans-serif;
    }

  }

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


<!-- <div style="position:relative; width:100%; height:0px; padding-bottom:168.142%">
  <iframe allow="fullscreen" allowfullscreen height="100%" src="https://player.vimeo.com/video/1011432909?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="100%" style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;">
  </iframe>
</div> -->