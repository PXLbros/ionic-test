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
          <div v-if="isFetchingArticle" class="loading-article">
              Loading article...
          </div>

          <div v-else-if="fetchArticleError">
              {{ fetchArticleError }}
          </div>

          <div v-else-if="article" class="main">
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
                      Previous Article
                  </a>

                  <a
                      v-if="nextArticleId"
                      href="#"
                      @click.prevent="navigateToArticle(nextArticleId)"
                      class="navigation__button"
                  >
                      Next Article
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="m9 18 6-6-6-6"/>
                      </svg>
                  </a>
              </div>
          </div>
      </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface NewsArticle {
  title: string;
  content: string;
  permalink: string;
  created_at: string;
  image: string;
}

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
  }
};

fetchArticle();
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  background: linear-gradient(180deg, #FDD456 0%, #E09B1D 100%);


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
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #EFF2F6;

  &__button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: 1px solid #486284;
      border-radius: 50px;
      color: #486284;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s ease;

      &:hover {
          background-color: #486284;
          color: white;
      }

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
  margin-top: 1.5rem;
  text-align: center;
}
</style>
