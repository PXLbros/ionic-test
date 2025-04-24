<template>
  <FairLayout title="News" :showMenuButton="true">
    <div v-if="fetchArticleError">
      {{ fetchArticleError }}
    </div>

    <div v-else-if="article" class="main">
      <div class="main__image">
        <img v-if="article.image" :src="article.image" alt="News Image">
        <PlaceholderIcon v-else />
      </div>

      <div class="main__content">
          <div class="wrapper">
            <div class="main__category">
              Press Releases
            </div>

            <h1 class="main__title">
              {{ article.title }}
            </h1>
          </div>
          <div class="main__text" v-html="article.content"></div>
      </div>

      <div class="navigation">
          <a
            v-if="previousArticleId"
            href="#"
            @click.prevent="navigateToArticle(previousArticleId)"
            class="navigation__button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m15 18-6-6 6-6"/>
            </svg>
            Previous
          </a>

          <a
            v-if="nextArticleId"
            href="#"
            @click.prevent="navigateToArticle(nextArticleId)"
            class="navigation__button"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
      </div>
    </div>
  </FairLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import PlaceholderIcon from '@/components/icons/PlaceholderIcon.vue';
import axios from 'axios';
import FairLayout from '@/layouts/fair.vue';
import appConfig from '@/config/app';

interface NewsArticle {
  title: string;
  content: string;
  permalink: string;
  created_at: string;
  image: string;
}

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();
const article = ref<NewsArticle | null>(null);
const previousArticleId = ref<number | null>(null);
const nextArticleId = ref<number | null>(null);
const id = decodeURIComponent(route.params.id as string);
const isFetchingArticle = ref(false);
const fetchArticleError = ref<string | null>(null);

const navigateToArticle = (id: number) => {
  router.replace(`/fair/news/${encodeURIComponent(id)}`);
};

const fetchArticle = async () => {
  try {
    isFetchingArticle.value = true;
    fetchArticleError.value = null;

    appStore.$patch({
      subLoader: {
        isActive: true,
        message: 'Loading article...',
      },
    });

    const response = await axios.get(`${import.meta.env.VITE_STRAPI_API_URL}/data/news/${id}`);

    if (!response.data?.data) {
      throw new Error('Article not found');
    }

    article.value = response.data.data;

    if (response.data.previous_id) {
      previousArticleId.value = response.data.previous_id;
    }

    if (response.data.next_id) {
      nextArticleId.value = response.data.next_id;
    }
  } catch (error) {
    console.error('Error fetching article:', error);

    fetchArticleError.value = 'An error occurred while fetching the article. Please try again later.';
  } finally {
    isFetchingArticle.value = false;

    setTimeout(() => {
      appStore.$patch({
        subLoader: {
          isActive: false,
          message: '',
        },
      });
    }, appConfig.subLoader.hideDelayDuration);
  }
};

fetchArticle();
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  background: #FDD456;
  padding-bottom: 110px;


  &__image {
      background-color: #EFF2F6;
      border-radius: 10px;
      height: 25vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      border: 5px solid #F4E8AB;


      img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
      }
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

      :deep(h4) {
        font-size: 14px;
        font-weight: 400;
        font-family: 'inter', sans-serif;
        color: #343434;
        margin: 0;
        line-height: 24px;
      }

      // last chile of h4 margin bottom
      :deep(h4:last-child) {
          margin-bottom: 20px;
      }

      :deep(p) {
          margin: 0 0 16px 0;
          font-size: 14px;
          line-height: 24px;
      }

      :deep(strong) {
          font-weight: 600;
      }


  }
}

.navigation {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  gap: 10px;

  &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px 25px;
      border-radius: 10px;
      background: #1F3667;
      color: #f1f1f1;
      text-decoration: none;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      transition: all 0.2s ease;
      width: 50%;


      svg {
          width: 18px;
          height: 18px;
      }
  }
}

:deep(ion-content) {
  --background: white;
}

.loading-article {
  padding-top: 1.5rem;
  text-align: center;
  height: 100vh;
  background: #FDD456;
}
</style>
