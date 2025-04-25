<template>
  <FairLayout title="Parking">
    <div class="notification" v-if="showNotification && latestParkingUpdate">
      <router-link class="link" :to="{ name: 'updates', params: { updateId: latestParkingUpdate.id } }">
        {{ truncateContent(latestParkingUpdate.message, 75) }}
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="isLoadingUpdates" class="loading-content notification">
      Loading Parking Updates...
    </div>

    <div class="main">
      <div class="main__image">
        <PlaceholderIcon />
      </div>

      <!-- Rest of your component remains the same -->
      <div class="main__content">
        <h2 class="main__content-title">{{ parkingPageData?.title }}</h2>
        <p class="main__content-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
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
            <p>{{ section.title }}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.41698 1.4988C8.41698 0.671037 7.74594 0 6.91817 0C6.09041 0 5.41937 0.671036 5.41937 1.4988V5.5809L5.34121 5.58087C5.34013 5.58087 5.33909 5.5813 5.33832 5.58207C5.33755 5.58284 5.33651 5.58327 5.33543 5.58327H1.4988C0.671037 5.58327 0 6.2543 0 7.08207C0 7.90984 0.671037 8.58087 1.4988 8.58087H5.41937V12.5012C5.41937 13.329 6.09041 14 6.91817 14C7.74594 14 8.41698 13.329 8.41698 12.5012L8.41829 8.58087H12.5012C13.329 8.58087 14 7.90984 14 7.08207C14 6.2543 13.329 5.58327 12.5012 5.58327L8.41929 5.5819L8.41937 5.34121C8.41937 5.34013 8.41894 5.33909 8.41817 5.33832C8.41741 5.33755 8.41698 5.33651 8.41698 5.33543V1.4988Z" fill="#FDD252" />
            </svg>
          </div>
          <div class="expandable-section__content" :class="{ 'expandable-section__content--expanded': section.isExpanded }" v-html="section.content"></div>
        </div>
      </div>
    </div>
  </FairLayout>
</template>

<script setup lang="ts">
import PlaceholderIcon from '@/components/Icons/PlaceholderIcon.vue';
import { useDataStore } from '@/stores/data';
import FairLayout from '@/layouts/fair.vue';
import axios from 'axios';
import appConfig from '@/config/app';

interface ParkingSection {
  title: string;
  content: string;
  isExpanded: boolean;
}

interface ParkingUpdate {
  id: string;
  title: string;
  message: string;
  created_at: string;
  category: {
    label: string;
    value: string;
  };
}

const dataStore = useDataStore();
const showNotification = ref(true);
const parkingPageData = ref<ParkingSection>({
  title: '',
  content: '',
  isExpanded: false
});

const parsedParkingSections = ref<ParkingSection[]>([]);
const latestParkingUpdate = ref<ParkingUpdate | null>(null);
const isLoadingUpdates = ref(false);

// Your existing code for page data and parsing sections
const pageData = dataStore.data.nysfairWebsite.pages['your-visit/plan-your-trip/parking'];

if (pageData) {
  parkingPageData.value.title = pageData.title;
  parkingPageData.value.content = pageData.content;
}

// Watch for changes in the content and parse it
watch(() => parkingPageData.value.content, (newContent: string) => {
  if (!newContent) return;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = newContent;

  const sections: ParkingSection[] = [];
  const headers = tempDiv.getElementsByTagName('h2');

  Array.from(headers).forEach((header) => {
    let content = '';
    let currentNode: ChildNode | null = header.nextSibling;

    while (
      currentNode &&
      !(currentNode.nodeType === Node.ELEMENT_NODE &&
        (currentNode as Element).tagName === 'H2')
    ) {
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const element = currentNode as HTMLElement;
        content += formatContent(element.outerHTML);
      } else if (currentNode.nodeType === Node.TEXT_NODE) {
        content += currentNode.textContent ?? '';
      }

      currentNode = currentNode.nextSibling;
    }

    let sectionTitle = header.textContent?.trim() || '';

    // Remove last : from sectionTitle if it exists
    if (sectionTitle.endsWith(':')) {
      sectionTitle = sectionTitle.slice(0, -1);
    }

    sections.push({
      title: sectionTitle,
      content: content.trim(),
      isExpanded: false,
    });
  });

  parsedParkingSections.value = sections;
}, { immediate: true });

// ✨ HTML formatter: removes inline styles like padding-left: 30px;
function formatContent(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;

  const paragraphs = div.querySelectorAll('p[style]');

  paragraphs.forEach((p) => {
    const style = p.getAttribute('style');
    if (style?.includes('padding-left: 30px')) {
      const cleanedStyle = style
        .split(';')
        .filter((rule) => !rule.includes('padding-left: 30px'))
        .join(';')
        .trim();

      if (cleanedStyle.length) {
        p.setAttribute('style', cleanedStyle);
      } else {
        p.removeAttribute('style');
      }
    }
  });

  return div.innerHTML;
}

// Function to fetch parking updates
const fetchParkingUpdates = async () => {
  try {
    isLoadingUpdates.value = true;

    // Get all updates
    const response = await axios.get(`${import.meta.env.VITE_STRAPI_API_URL}/data/real-time-updates`);

    if (!response || !Array.isArray(response.data?.realTimeUpdates)) {
      throw new Error('Invalid response data');
    }

    // Filter for parking updates only
    const parkingUpdates = response.data.realTimeUpdates.filter((update: ParkingUpdate) =>
      update.category?.value === 'parking'
    );

    // Sort by created_at date (most recent first)
    parkingUpdates.sort((a: ParkingUpdate, b: ParkingUpdate) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Get the latest parking update
    if (parkingUpdates.length > 0) {
      latestParkingUpdate.value = parkingUpdates[0];
      showNotification.value = true;
    } else {
      showNotification.value = false;
    }

  } catch (error) {
    console.error('Error fetching parking updates:', error);
  } finally {
    isLoadingUpdates.value = false;
  }
};

const toggleSection = (index: number) => {
  if (parsedParkingSections.value[index]) {
    parsedParkingSections.value[index].isExpanded = !parsedParkingSections.value[index].isExpanded;
  }
};

// Truncate the content to a certain length
const truncateContent = (content: string, length: number) => {
  if (content.length > length) {
    return content.substring(0, length) + '...'; // Truncate with ellipsis
  }
}

// Fetch parking updates when component mounts
onMounted(() => {
  fetchParkingUpdates();
});
</script>

<style lang="scss" scoped>
.notification {
  background-color: rgb(185 249 204 / 88%);
  padding: 16px 20px;
  font-size: 16px;
  color: #333333;
  text-align: center;
  position: sticky;
  top: 0;
  backdrop-filter: blur(5px);

  .link {
    color: #333333;
    text-decoration: none;
  }
}

.main {
  min-height: calc(100% - 56px); // Subtract notification height
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #FDD456;
  padding-bottom: v-bind('appConfig.bottomBar.height');

  &__image {
    margin: 20px;
    margin-bottom: 0px;
    background-color: #EFF2F6;
    border-radius: 10px;
    height: 25vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 5px solid #F4E8AB;
  }

  &__content {
    padding: 0px 20px 20px 20px;

    &-title {
      font-weight: 600;
      color: #343434;
      margin: 0 0 5px 0;
      line-height: 36px;
      letter-spacing: 0.5px;
    }

    &-text {
      font-size: 14px;
      line-height: 24px;
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
  background: #1F3667;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    cursor: pointer;

    p {
      font-size: 16px;
      font-weight: 700;
      color: #F1F1F1;
      margin: 0;
      padding-right: 16px;
    }
  }

  &__icon {
    transition: transform 0.3s ease-in-out;
    flex-shrink: 0;

    &.expanded {
      transform: rotate(180deg);
    }
  }

  &__content {
    padding: 0 30px;
    color: #FFF;
    line-height: 1.5;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    opacity: 0;

    &--expanded {
      max-height: 2000px;
      padding: 0 30px 20px 30px;
      opacity: 1;
    }
  }
}

:deep(ion-content) {
  --background: white;
}
</style>

<style lang="scss">
.expandable-section {
  ul {
    list-style-position: inside;
    padding-left: 0;
  }

  img {
    display: block;
    margin-bottom: 10px;
  }
}
</style>
