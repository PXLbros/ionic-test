<template>
  <DefaultLayout title="News" :showMenuButton="true">
    <div class="main">

        <div class="wrapper">
          <!-- Featured News Article (Latest News) -->
          <router-link
              v-if="featuredNewsItem"
              :to="`/fair/news/${encodeURIComponent(featuredNewsItem.id)}`"
              class="featured-article"
          >
              <div class="featured-article__image">
                  <img v-if="featuredNewsItem.image" :src="featuredNewsItem.image" alt="">
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                      <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                  </svg>
              </div>
              <h4 class="featured-article__title">{{ featuredNewsItem.title }}</h4>
              <!-- <p class="featured-article__description" v-html="stripHTML(featuredNews.content.slice(0, 200) + '...')"></p> -->
          </router-link>
        </div>

        <!-- Article List -->
        <div class="loader" v-if="isLoading && newsItems === null">
          Loading news...
        </div>

        <div v-else-if="loadError">
          Could not load news.
        </div>


        <div v-else class="articles-list">
            <router-link
                v-for="article in displayedNews"
                :key="article.permalink"
                :to="`/fair/news/${encodeURIComponent(article.id)}`"
                class="article-item"
            >
                <div class="article-item__content">
                    <div class="article-item__date">{{ formatDate(article.created_at) }}</div>
                    <h4 class="article-item__title">{{ article.title }}</h4>
                </div>
                <div class="article-item__image">
                    <img v-if="article.image" :src="article.image" alt="News Image">
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 62 62" fill="none">
                        <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                    </svg>
                </div>
            </router-link>

            <!-- Load More Button -->
            <div v-if="hasMorePages" class="load-more">
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
  </DefaultLayout>
</template>
<script setup lang="ts">
import axios from 'axios';
import { IonButton } from '@ionic/vue';
import { computed } from 'vue';
import { NewsArticle } from '@/types'
import DefaultLayout from '@/layouts/default.vue';


// const dataStore = useDataStore();

// const itemsPerPage = 5;
const currentPage = ref(1);
const isLoading = ref(true);
const loadError = ref<string | null>(null);
const newsItems = ref<NewsArticle[] | null>(null);
// const featuredNewsItem = ref<NewsArticle[] | null>(null);
const hasMorePages = ref(false);

// Get the latest article for the featured section
const featuredNewsItem = computed(() => {
  if (!newsItems.value) {
    return null;
  }

  return newsItems.value[0];
});

const displayedNews = computed(() => {
  if (!newsItems.value) {
    return [];
  }

  return newsItems.value.slice(1);
});

// // Get the paginated articles
// const displayedNews = computed(() => {
//   if (!newsData.value) {
//     return [];
//   }

//   // const news = dataStore.data.nysfairWebsite.news;
//   const startIndex = 1; // Skip the featured article
//   const endIndex = startIndex + (currentPage.value * itemsPerPage);
//   return newsData.value.slice(startIndex, endIndex);
// });

// Check if there are more news items to load
// const hasMoreNews = computed(() => {
//   return false;

//   // const totalNews = dataStore.data.nysfairWebsite.news.length;
//   // const currentlyDisplayed = 1 + (currentPage.value * itemsPerPage); // +1 for featured article
//   // return currentlyDisplayed < totalNews;
// });

// Load more function
const loadMore = async () => {
  currentPage.value++;

  // isLoading.value = true;
  // // Simulate loading delay (remove this in production if not needed)
  // await new Promise(resolve => setTimeout(resolve, 500));
  // currentPage.value++;
  // isLoading.value = false;

  fetchNews({ page: currentPage.value });
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

const fetchNews = async ({ page }: { page: number } = { page: 1 }) => {
  try {
    isLoading.value = true;
    loadError.value = null;

    const response = await axios.get(`${import.meta.env.VITE_STRAPI_API_URL}/data/news?page=${page}`);

    if (!response || !Array.isArray(response.data?.data)) {
      throw new Error('Invalid response data');
    }

    newsItems.value = [...newsItems.value || [], ...response.data.data];

    // featuredNewsItem.value = response.data.featured_news || [];

    hasMorePages.value = response.data.has_more_pages === true;
  } catch (error) {
    console.error('Error fetching news:', error);

    loadError.value = (error instanceof Error) ? error.message : 'An error occurred while fetching news.';
  } finally {
    isLoading.value = false;
  }
}

fetchNews();
</script>

<style lang="scss" scoped>
a {
    text-decoration: none;
    color: inherit;
}
.main {
    background: linear-gradient(180deg, #FDD456 0%, #E09B1D 100%);
    padding-bottom: 90px;

    .wrapper {
      padding: 20px;
      margin-bottom: 35px;
    }


    &__title {
        font-size: 24px;
        font-weight: 600;
        color: #343434;
        margin: 0 0 24px 0;
        line-height: 28px;
        letter-spacing: 0.5px;
    }

    .loader {
      width: 100%;
      height: 100vh;
    }
}

.featured-article {
    margin-bottom: 32px;

    &__image {
        background-color: #EFF2F6;
        border-radius: 10px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        border: 5px solid #F4E8AB;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
    }

    &__title {
        font-weight: 400;
        color: #343434;
        margin: 0;
        line-height: 22px;
        letter-spacing: 0.5px;
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
    margin-top: -32px;
    padding: 25px 20px 0px 20px;
    background-color: #098944;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;

    .article-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 15px 0px;

      &__content {
        flex: 1;
      }

      &__date {
        font-size: 14px;
        color: #FFF;
        margin-bottom: 4px;
        font-weight: 700;
        font-family: 'inter', sans-serif;
        line-height: 24px;
      }

      &__title {
        font-weight: 400;
        color: #FFF;
        margin: 0;
        line-height: 22px;
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
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;

  ion-button {
      --color: #1E5EAE;
      font-weight: 600;
      text-transform: none;
      width: 100%; // Full width for clickabile area
  }
}

:deep(ion-content) {
    --background: white;
}
</style>
