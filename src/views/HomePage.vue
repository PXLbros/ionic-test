<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- <div class="home"> -->
        <!-- <ion-card>
          <ion-card-header class="info-container">
            <ion-card-title class="info-container__title">Welcome, Person!</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <VNode v-if="VNode" class="description" />
          </ion-card-content>
        </ion-card> -->
        <!-- <div class="home-content">
          <ion-button router-link="/fairgrounds" class="home-content__container">
            <img class="featured-img" src="/src/imgs/farigrounds-temp.jpg" alt="">
            <h2 class="img-header">FAIRGROUNDS</h2>
          </ion-button>
        </div>
        <div class="home-content">
          <ion-button router-link="/fair" class="home-content__container">
            <img class="featured-img" src="/src/imgs/featured-fair.png" alt="">
            <h2 class="img-header">THE FAIR</h2>
          </ion-button>
        </div>
      </div> -->

      <div class="main">
        <div class="main__header">
          <div class="main__header--icon"></div>
          <div class="main__header--subtitle">
            <h2>New York State Fair</h2>
            <div class="line"></div>
            <h2>New York State Fairgrounds</h2>
          </div>
        </div>
      </div>
      <div class="navigation">
        <router-link to="/fair" class="navigation__button">
          <h2>New York State Fair</h2>
        </router-link>
        <router-link to="/fairgrounds" class="navigation__button">
          <h2>New York State Fairgrounds</h2>
        </router-link>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonFooter, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { StrapiBlocks } from 'vue-strapi-blocks-renderer';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();

const VNode = dataStore?.data?.mobileApp ? StrapiBlocks({ content: dataStore.data.mobileApp.homePage.introText }) : null;

console.log('data from the store', dataStore.data);
</script>

<style scoped lang="scss">

.main {
  padding: 40px 20px;
  width: 100%;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    &--icon {
      width: 50px;
      height: 50px;
      background-color: #002F6A;
      border-radius: 100%;
    }

    &--subtitle {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 5px;

      h2 {
        font-size: 20px;
        font-weight: 700;
        margin: 0px;
        text-align: center;
        padding: 0px 10px;
      }

      .line {
        width: 100%;
        height: 1px;
        background-color: #E2E2E2;
        margin: 0px auto;
      }
    }
  }
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0px 20px 20px 20px;

  &__button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #EFF2F6;
    color: #343434;
    font-size: 20px;
    font-weight: 700;
    padding: 20px;
    border-radius: 24px;
    min-height: 270px;
    text-decoration: none;

    h2 {
      text-align: center;
      margin: 0px;
      font-weight: 700;
    }
  }
}

</style>


<!-- <div style="position:relative; width:100%; height:0px; padding-bottom:168.142%">
  <iframe allow="fullscreen" allowfullscreen height="100%" src="https://player.vimeo.com/video/1011432909?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="100%" style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;">
  </iframe>
</div> -->