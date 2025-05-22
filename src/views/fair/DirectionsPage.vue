<template>
  <FairLayout title="Directions">
    <div class="main">
      <div class="main__image">
        <PlaceholderIcon />
      </div>

      <div class="main__content">
        <div
          v-if="directionsPageData.content"
          v-html="sanitizedContent"
          class="main__content-text"
        ></div>
      </div>
    </div>
  </FairLayout>
</template>

<script setup lang="ts">
import FairLayout from '@/layouts/fair.vue';
import { useDataStore } from '@/stores/data';
import PlaceholderIcon from '@/components/Icons/PlaceholderIcon.vue';
import appConfig from '@/config/app';
import DOMPurify from 'dompurify';
import { sanitizeHtml } from '@/utils/text';

interface DirectionsPageData {
  title: string;
  content: string;
}

const dataStore = useDataStore();
const directionsPageData = ref<DirectionsPageData>({
  title: '',
  content: '',
});

// Fix the data path to match the actual structure
const pageData = dataStore.data.nysfairWebsite.pages['your-visit/plan-your-trip/directions-hours'];

// If you need to set the data
if (pageData) {
  directionsPageData.value = {
    title: pageData.title || '',
    content: pageData.content || ''
  };
}

const sanitizedContent = computed(() => {
  return sanitizeHtml({ html: directionsPageData.value.content });
});
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: #FDD456;
  padding-bottom: calc(v-bind('appConfig.bottomBar.height') + 2rem);

  &__image {
      background-color: #EFF2F6;
      border-radius: 10px;
      height: 25vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      border: 5px solid #F4E8AB;
  }

  &__content {
      &-text {
          font-size: 14px;
          line-height: 24px;
          letter-spacing: 0.5px;
          color: #343434;
          margin: 0 0 16px 0;
          font-family: 'inter', sans-serif;
          font-weight: 400;

          &:last-child {
              margin-bottom: 0;
          }

          :deep(h1) {
            font-size: 32px;
            font-weight: 400;
            color: #343434;
            margin: 0 0 5px 0;
            line-height: 36px;
            letter-spacing: 0.5px;

            &:not(:first-child) {
              margin-top: 40px;
            }
          }

          :deep(h2) {
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            margin: 24px 0 5px 0;
            line-height: 1.2;
          }

          :deep(hr) {
            margin-bottom: 32px;
            border-top: 1px solid rgba(239, 242, 246, 1);
          }

          :deep(strong) {
            display: block;

            &:not(:first-child) {
              margin-top: 10px;
            }
          }

          :deep(a) {
            color: #343434;
            text-decoration: underline;
            font-weight: 400;
          }

          :deep(ul) {
            padding: 24px;
            border-radius: 16px;
            list-style: none;
            background-color: #F4E8AB;
            color: #000;

            a {
              color: #000;
              text-decoration: underline;
              font-weight: 400;
            }
          }

      }

      &-link {
          color: #343434;
          text-decoration: underline;
          font-weight: 400;
      }
  }
}

:deep(ion-content) {
  --background: white;
}
</style>
