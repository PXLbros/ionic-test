<template>
    <ion-page>
        <ion-header>
            <ion-toolbar :translucent="true">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/fair/news"></ion-back-button>
                </ion-buttons>
                <ion-title>News Detail</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">

            <div v-if="article" class="main">
                <div class="main__image">
                    <img v-if="article.image" :src="article.image" alt="News Image">
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                        <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                    </svg>
                </div>

                <div class="main__content">
                    <div class="wrapper">
                        <div class="main__category">Press Releases</div>
                        <h1 class="main__title">{{ article.title }}</h1>
                    </div>
                    <div class="main__text" v-html="article.content"></div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import { computed } from 'vue';

interface NewsArticle {
    title: string;
    content: string;
    permalink: string;
    created_at: string;
    image: string;
}

const route = useRoute();
const dataStore = useDataStore();
const permalink = decodeURIComponent(route.params.id as string);

// Get the specific article
const article = computed<NewsArticle | undefined>(() => {
    return dataStore.data.nysfairWebsite.news.find(
        (article: NewsArticle) => article.permalink === permalink
    );
});
</script>

<style lang="scss" scoped>
.main {
    padding: 30px;

    &__image {
        background-color: #EFF2F6;
        border-radius: 24px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__category {
        font-size: 12px;
        color: #343434;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: 0.5px;
    }

    &__title {
        font-size: 24px;
        font-weight: 700;
        color: #343434;
        margin: 0;
        line-height: 28px;
        letter-spacing: 0.5px;
    }

    &__text {
        font-size: 16px;
        line-height: 28px;
        letter-spacing: 0.5px;
        font-weight: 400;
        color: #343434;

        :deep(p) {
            margin: 0 0 16px 0;
        }

        :deep(strong) {
            font-weight: 600;
        }
    }
}

:deep(ion-content) {
    --background: white;
}
</style>