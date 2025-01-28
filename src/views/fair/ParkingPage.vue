<template>
  <ion-page>
      <ion-header>
          <ion-toolbar :translucent="true">
              <ion-buttons slot="start">
                  <ion-back-button default-href="/fair/plan-your-visit"></ion-back-button>
              </ion-buttons>
              <ion-title>Parking</ion-title>
          </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
          <!-- Notification Banner -->
          <div class="notification">
              Parking Section Brown at Full Capacity...
          </div>

          <div class="main">
              <div class="main__image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                      <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                  </svg>
              </div>

              <div class="main__content">
                  <h1 class="main__content-title">{{ parkingPageData?.title }}</h1>
                  <p class="main__content-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
              </div>

              <div class="expandable-sections">
                  <div
                      v-for="(section, index) in parsedParkingSections"
                      :key="index"
                      class="expandable-section"
                      @click="toggleSection(index)"
                  >
                      <div class="expandable-section__header">
                          <h2>{{ section.title }}</h2>
                          <svg
                              class="expandable-section__icon"
                              :class="{ 'expanded': section.isExpanded }"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                              <path d="M6 9L12 15L18 9" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                      </div>
                      <div
                          v-if="section.isExpanded"
                          class="expandable-section__content"
                          v-html="section.content"
                      >
                      </div>
                  </div>
              </div>
          </div>
      </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { ref, watch } from 'vue';
import { useDataStore } from '@/stores/data';

interface ParkingSection {
  title: string;
  content: string;
  isExpanded: boolean;
}

const dataStore = useDataStore();
const showNotification = ref(true);
const parkingPageData = ref<ParkingSection>({
  title: '',
  content: '',
  isExpanded: false
});

const parsedParkingSections = ref<ParkingSection[]>([]);

const pageData = dataStore.data.nysfairWebsite.pages['your-visit/plan-your-trip/parking'];

if (pageData) {
  parkingPageData.value.title = pageData.title;
  parkingPageData.value.content = pageData.content;
}

// Watch for changes in the content and parse it
watch(() => parkingPageData.value.content, (newContent) => {
  if (!newContent) return;

  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = newContent;

  // Find all section headers (assuming they're h2 elements)
  const sections: ParkingSection[] = [];
  const headers = tempDiv.getElementsByTagName('h2');

  Array.from(headers).forEach((header, index) => {
      let content = '';
      let currentNode = header.nextElementSibling;

      // Collect all content until the next h2 or the end
      while (currentNode && currentNode.tagName !== 'H2') {
          content += currentNode.outerHTML;
          currentNode = currentNode.nextElementSibling;
      }

      sections.push({
          title: header.textContent || '',
          content: content,
          isExpanded: false
      });
  });

  parsedParkingSections.value = sections;
}, { immediate: true });

const toggleSection = (index: number) => {
  if (parsedParkingSections.value[index]) {
      parsedParkingSections.value[index].isExpanded = !parsedParkingSections.value[index].isExpanded;
  }
};
</script>

<style lang="scss" scoped>
.notification {
  background-color: #EFF2F6;
  padding: 16px 20px;
  font-size: 16px;
  color: #333333;
  text-align: center;
}

.main {
  min-height: calc(100% - 56px); // Subtract notification height
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__image {
      margin: 30px;
      margin-bottom: 0px;
      background-color: #EFF2F6;
      border-radius: 24px;
      height: 25vh;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  &__content {
      padding: 30px;

      &-title {
          font-size: 24px;
          font-weight: 600;
          color: #343434;
          margin: 0 0 5px 0;
          line-height: 28px;
          letter-spacing: 0.5px;
      }

      &-text {
          font-size: 16px;
          line-height: 28px;
          letter-spacing: 0.5px;
          color: #343434;
          font-weight: 400;
          margin: 0;
      }
  }
}

.expandable-sections {
  display: flex;
  flex-direction: column;
}

.expandable-section {
  border-top: 1px solid #D9E3ED;
  background: #EEF2F6;

  &:last-child {
      border-bottom: 1px solid #D9E3ED;
  }

  &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      cursor: pointer;

      h2 {
          font-size: 18px;
          font-weight: 700;
          color: #333333;
          margin: 0;
          padding-right: 16px;
      }
  }

  &__icon {
      transition: transform 0.3s ease;
      flex-shrink: 0;

      &.expanded {
          transform: rotate(180deg);
      }
  }

  &__content {
      padding: 0 30px 20px 30px;
      color: #666666;
      line-height: 1.5;
  }
}

:deep(ion-content) {
  --background: white;
}
</style>
