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
                <div class="main__header">
                    <h1 class="main__header-text">Interactive <br/> Games</h1>
                </div>
                <div v-if="games" class="main__content">
                    <div class="main__content-item" v-for="game in games" :key="game.id">
                        <h2>{{ game.name }}</h2>
                    </div>
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
    padding: 30px;
    height: calc(100vh - 56px); // Subtract header height
    display: flex;
    flex-direction: column;

    &__header {
        display: flex;
        margin-bottom: 25px;

        &-text {
            font-size: 24px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            color: #343434;
            letter-spacing: 0.5px;
            line-height: 28px;
            margin: 0px;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 15px;
        flex: 1;
        height: 100%;

        &-item {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 24px;
            background-color: #EFF2F6;
            min-height: 0; // Prevents overflow
            height: calc((100% - 20px) / 2); // Subtracts gap and divides by 2

            h2 {
                color: #343434;
                font-style: normal;
                font-weight: 700;
                line-height: 40px; /* 125% */
                letter-spacing: 0.5px;
                font-size: 32px;
                max-width: 80%;
                text-align: center;
            }
        }

    }
}

</style>