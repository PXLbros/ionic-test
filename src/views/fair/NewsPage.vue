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

                <!-- Featured News Article (Latest News) -->
                <router-link 
                    v-if="featuredNews" 
                    :to="`/fair/news/${encodeURIComponent(featuredNews.permalink)}`" 
                    class="featured-article"
                >
                    <div class="featured-article__image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                            <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                        </svg>
                    </div>
                    <p class="featured-article__description" v-html="stripHTML(featuredNews.content.slice(0, 300) + '...')">
                    </p>
                </router-link>

                <!-- Article List -->
                <div class="articles-list">
                    <router-link 
                        v-for="article in otherNews" 
                        :key="article.permalink"
                        :to="`/fair/news/${encodeURIComponent(article.permalink)}`"
                        class="article-item"
                    >
                        <div class="article-item__content">
                            <div class="article-item__date">{{ formatDate(article.created_at) }}</div>
                            <h2 class="article-item__title">{{ article.title }}</h2>
                        </div>
                        <div class="article-item__image">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 62 62" fill="none">
                                <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                            </svg>
                        </div>
                    </router-link>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useDataStore } from '@/stores/data';
import { computed } from 'vue';

interface NewsArticle {
    title: string;
    content: string;
    permalink: string;
    created_at: string;
}

const dataStore = useDataStore();
console.log('news page data', dataStore.data.nysfairWebsite.news);

// Get the latest article for the featured section
const featuredNews = computed(() => {
    const news = dataStore.data.nysfairWebsite.news;
    return news[0];
});

// Get the rest of the articles for the list
const otherNews = computed(() => {
    const news = dataStore.data.nysfairWebsite.news;
    return news.slice(1);
});

// Format date function
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    }).format(date);
};

// Strip HTML tags from content
const stripHTML = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};
</script>

<style lang="scss" scoped>
a {
    text-decoration: none;
    color: inherit;
}
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
    margin-top: 32px;
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