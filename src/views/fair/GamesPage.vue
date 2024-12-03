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
                    <div 
                        class="main__content-item" 
                        v-for="game in games" 
                        :key="game.id"
                        @click="openGame(game.externalUrl)"
                    >
                        <h2>{{ game.name }}</h2>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { 
    IonContent, 
    IonPage, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonBackButton,
    IonModal,
    IonButton
} from '@ionic/vue';
import { useDataStore } from '@/stores/data';
import { Browser } from '@capacitor/browser';

// Game Interface Type
interface Game {
    id: number;
    name: string;
    externalUrl: string;
    createdAt: string;
    updatedAt: string;
    image: null | string;
}

const dataStore = useDataStore();
const games = ref<Game[]>(dataStore?.data?.nysfairWebsite.games);

// Modal state
const isGameOpen = ref(false);
const currentGameUrl = ref('');
const currentGame = ref<Game | null>(null);

const openGame = async (url: string) => {
    try {
        const game = games.value.find((game: Game) => game.externalUrl === url) || null;
        currentGame.value = game;
        await Browser.open({ 
            url,
            presentationStyle: 'fullscreen',
            toolbarColor: '#333333'
        });
    } catch (error) {
        console.error('Failed to open game:', error);
    }
};

const closeGame = () => {
    isGameOpen.value = false;
    currentGameUrl.value = '';
    currentGame.value = null;
};
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
            cursor: pointer;
            transition: transform 0.2s ease;

            &:hover {
                transform: scale(1.02);
            }

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

.game-modal {
    --height: 100%;
    --width: 100%;
}

.game-frame {
    width: 100%;
    height: 100%;
    border: none;
}

// Make modal full screen on mobile
@media (max-width: 768px) {
    .game-modal {
        --height: 100%;
        --width: 100%;
    }
}

</style>