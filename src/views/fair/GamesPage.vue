<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-back-button default-href="/fair"></ion-back-button>
                  </ion-buttons>
                  <ion-title>Games</ion-title>
                </ion-toolbar>
              </ion-header>

            <div class="main">
                <h1 class="main__header">Games</h1>
                <div v-if="games" v-for="game in games" :key="game.id">
                    <h2>{{ game.name }}</h2>
                </div>
            </div>

        </ion-content>
    </ion-page>

</template>

<script setup lang="ts">
    import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
    import { useDataStore } from '@/stores/data';

    const dataStore = useDataStore();

    // const VNode = dataStore?.data?.mobileApp ? StrapiBlocks({ content: dataStore.data.mobileApp.homePage.introText }) : null;

    console.log('data from the store', dataStore.data);

    const games = dataStore?.data?.nysfairWebsite.games;
    console.log('games', games);

</script>

<style lang="scss" scoped>

.main {
    padding: 40px;

    &__header {
        font-size: 28px;
        font-weight: bold;
    }
}

</style>