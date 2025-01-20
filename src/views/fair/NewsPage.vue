<template>
    <ion-page>
        <ion-header>
            <ion-toolbar :translucent="true">
                <ion-buttons slot="start">
                    <ion-back-button default-href="/fair"></ion-back-button>
                </ion-buttons>
                <ion-title>News</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">

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
                        v-for="article in displayedNews"
                        :key="article.permalink"
                        :to="`/fair/news/${encodeURIComponent(article.permalink)}`"
                        class="article-item"
                    >
                        <div class="article-item__content">
                            <div class="article-item__date">{{ formatDate(article.created_at) }}</div>
                            <h2 class="article-item__title">{{ article.title }}</h2>
                        </div>
                        <div class="article-item__image">
                            <img v-if="article.image" :src="article.image" alt="News Image">
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 62 62" fill="none">
                                <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                            </svg>
                        </div>
                    </router-link>

                    <!-- Load More Button -->
                    <div v-if="hasMoreNews" class="load-more">
                      <ion-button
                          fill="clear"
                          @click="loadMore"
                          :disabled="isLoading"
                      >
                          {{ isLoading ? 'Loading...' : 'Load More' }}
                      </ion-button>
                  </div>
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
const itemsPerPage = 5;
const currentPage = ref(1);
const isLoading = ref(false);

// Get the latest article for the featured section
const featuredNews = computed(() => {
    const news = dataStore.data.nysfairWebsite.news;
    return news[0];
});


// Get the paginated articles
const displayedNews = computed(() => {
    const news = dataStore.data.nysfairWebsite.news;
    const startIndex = 1; // Skip the featured article
    const endIndex = startIndex + (currentPage.value * itemsPerPage);
    return news.slice(startIndex, endIndex);
});

// Check if there are more news items to load
const hasMoreNews = computed(() => {
    const totalNews = dataStore.data.nysfairWebsite.news.length;
    const currentlyDisplayed = 1 + (currentPage.value * itemsPerPage); // +1 for featured article
    return currentlyDisplayed < totalNews;
});

// Load more function
const loadMore = async () => {
    isLoading.value = true;
    // Simulate loading delay (remove this in production if not needed)
    await new Promise(resolve => setTimeout(resolve, 500));
    currentPage.value++;
    isLoading.value = false;
};

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
    gap: 0px;
    margin-top: 32px;
}

.article-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    padding: 15px 0px;
    border-bottom: 1px solid #EFF2F6;

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
      flex-shrink: 0; // Prevents the image from shrinking
      width: 80px; // Fixed width
      height: 80px; // Fixed height (1:1 aspect ratio)
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #EFF2F6;
      border-radius: 12px;
      overflow: hidden; // Ensures content stays within borders

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      svg {
        width: 40px;
        height: 40px;
      }
    }
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;

  ion-button {
      --color: #1E5EAE;
      font-weight: 600;
      text-transform: none;
  }
}

:deep(ion-content) {
    --background: white;
}
</style>
