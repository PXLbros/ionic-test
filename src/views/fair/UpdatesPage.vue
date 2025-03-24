<template>
      <DefaultLayout title="Real-Time Updates" :showMenuButton="true">
        <div class="main">
            <div class="main__content">
                <div class="loading-content" v-if="isLoading">
                  <Loader />
                </div>
                <div v-else-if="loadError">{{ loadError }}</div>
                <div class="main__content-grid" v-else>
                    <div
                      v-for="update in updates"
                      :key="update.id"
                      class="main__content-item"
                      >
                        <p class="date">{{ formatDate(update.created_at) }}</p>
                        <h4 class="headline">{{ update.title }}</h4>
                        <p class="content">{{ update.message }}</p>
                    </div>
                </div>
            </div>
        </div>
      </DefaultLayout>

</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import Loader from '@/components/Loader.vue';

interface Update {
    id: number;
    created_at: string;
    title: string;
    message: string;
    category?: {
        label: string;
        value: string;
    };
}

const updates = ref<Update[]>([]);
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
        console.log('Updates:', updates.value);
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
  background: #FDD456;
  padding: 30px;
  padding-bottom: 110px;

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

    // Loading content screen
    .loading-content {
      height: 100vh;
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 15px;

        &-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
        }

        &-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 20px;
            background-color: #F4E8AB;
            border-radius: 10px;

            .date {
                font-size: 16px;
                font-weight: 700;
                color: #343434;
                margin: 0px;
                line-height: 24px;
            }
            .headline {
                font-weight: 700;
                color: #343434;
                margin: 0px;
                line-height: 36px;
            }
            .content {
                font-size: 16px;
                font-weight: 400;
                color: #202020;
                margin: 0px;
                line-height: 22px;
            }
        }
    }
}

</style>

