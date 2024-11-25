<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-back-button default-href="/fair"></ion-back-button>
                    </ion-buttons>
                    <ion-title>News</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="main">
                <h1 class="main__title">Recent News</h1>

                <!-- Featured News Article -->
                <div class="featured-article">
                    <div class="featured-article__image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                            <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                        </svg>
                    </div>
                    <p class="featured-article__description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>

                <!-- Article List -->
                <div class="articles-list">
                    <div v-for="(article, index) in articles" :key="index" class="article-item">
                        <div class="article-item__content">
                            <div class="article-item__date">Wed, Sept 21</div>
                            <h2 class="article-item__title">Article Name</h2>
                        </div>
                        <div class="article-item__image">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 62 62" fill="none">
                                <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';

// Dummy data for articles list
const articles = Array(4).fill(null);
</script>

<style lang="scss" scoped>
.main {
    padding: 30px;

    &__title {
        font-size: 24px;
        font-weight: 600;
        color: #343434;
        margin: 0 0 24px 0;
        line-height: 28px;
        letter-spacing: 0.5px;
    }
}

.featured-article {
    margin-bottom: 32px;

    &__image {
        background-color: #EFF2F6;
        border-radius: 24px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
    }

    &__description {
        font-size: 16px;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: #343434;
        margin: 0;
    }
}

.articles-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.article-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    &__content {
        flex: 1;
    }

    &__date {
        font-size: 14px;
        color: #343434;
        margin-bottom: 4px;
        font-weight: 600;
    }

    &__title {
        font-size: 20px;
        font-weight: 500;
        color: #343434;
        margin: 0;
        font-weight: 700;
    }

    &__image {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
}

:deep(ion-content) {
    --background: white;
}
</style>