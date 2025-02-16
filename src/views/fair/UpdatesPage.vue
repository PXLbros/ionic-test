<template>
    <ion-page>
        <ion-header>
            <ion-toolbar :translucent="true">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/fair"></ion-back-button>
                </ion-buttons>
                <ion-title>Recent Updates</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="main">
                <div class="main__header">
                    <h1 class="main__header-text">Real-time <br/> Updates</h1>
                </div>
                <div class="main__content">
                    <div v-if="isLoading">Loading updates...</div>
                    <div v-else-if="loadError">{{ loadError }}</div>
                    <div v-else>
                        <div v-for="update in updates" :key="update.id" class="main__content-item">
                            <p class="date">{{ formatDate(update.created_at) }}</p>
                            <p class="headline">{{ update.title }}</p>
                            <p class="content">{{ update.message }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';

const updates = ref([]);
const isLoading = ref(true);
const loadError = ref<string | null>(null);

const fetchUpdates = async () => {
    try {
        isLoading.value = true;
        loadError.value = null;

        const response = await axios.get(`${import.meta.env.VITE_STRAPI_API_URL}/data/real-time-updates`);

        if (!response || !Array.isArray(response.data?.realTimeUpdates)) {
            throw new Error('Invalid response data');
        }

        updates.value = response.data.realTimeUpdates;
    } catch (error) {
        console.error('Error fetching updates:', error);
        loadError.value = (error instanceof Error) ? error.message : 'An error occurred while fetching updates.';
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(date);
};

fetchUpdates();
</script>

<style lang="scss" scoped>

.main {

    padding: 30px;

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

        &-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 20px;
            background-color: #EEF2F6;
            border-radius: 10px;

            .date {
                font-size: 16px;
                font-weight: 700;
                color: #343434;
                margin: 0px;
                line-height: 24px;
            }
            .headline {
                font-size: 21px;
                font-weight: 700;
                color: #343434;
                margin: 0px;
                line-height: 36px;
            }
            .content {
                font-size: 16px;
                font-weight: 400;
                color: #343434;
                margin: 0px;
                line-height: 26px;
            }
        }
    }
}

</style>
