<template>
      <DefaultLayout title="Directions">
            <div class="main">
                <div class="main__image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                        <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                    </svg>
                </div>

                <div class="main__content">
                    <div class="main__content-text" v-if="directionsPageData.content" v-html="directionsPageData.content"></div>
                </div>
            </div>
      </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue';
import { useDataStore } from '@/stores/data';
import { ref } from 'vue';

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
console.log('directions page data', pageData);


</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
  display: flex;
  flex-direction: column;
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

          :deep {
            // Fix the h1 tag
            h1 {
                font-size: 32px;
                font-weight: 600;
                color: #343434;
                margin: 0 0 5px 0;
                line-height: 36px;
                letter-spacing: 0.5px;

                &:not(:first-child) {
                  margin-top: 40px;
              }
            }

            h2 {
                font-size: 16px;
                font-weight: 600;
                color: #333333;
                margin: 24px 0 5px 0;
                line-height: 1.2;
            }

            hr {
              margin-bottom: 32px;
              border: none;
              border-top: 1px solid #eff2f600;
            }

            strong {
              display: block;
              margin-top: 10px;
            }

            a {
              color: #343434;
              text-decoration: underline;
              font-weight: 400;
            }

            ul {
               padding: 24px;
               border-radius: 16px;
               list-style: none;
               background-color: #1F3667;
               color: #FFF;
               // color: #42639F;

               a {
                  color: #FFF;
                  text-decoration: underline;
                  font-weight: 400;
               }
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
