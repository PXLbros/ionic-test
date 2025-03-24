<template>
  <DefaultLayout title="Parking">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
            </svg>
        </div>

        <!-- Rest of your component remains the same -->
        <div class="main__content">
            <h2 class="main__content-title">{{ parkingPageData?.title }}</h2>
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
                  <p>{{ section.title }}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.41698 1.4988C8.41698 0.671037 7.74594 0 6.91817 0C6.09041 0 5.41937 0.671036 5.41937 1.4988V5.5809L5.34121 5.58087C5.34013 5.58087 5.33909 5.5813 5.33832 5.58207C5.33755 5.58284 5.33651 5.58327 5.33543 5.58327H1.4988C0.671037 5.58327 0 6.2543 0 7.08207C0 7.90984 0.671037 8.58087 1.4988 8.58087H5.41937V12.5012C5.41937 13.329 6.09041 14 6.91817 14C7.74594 14 8.41698 13.329 8.41698 12.5012L8.41829 8.58087H12.5012C13.329 8.58087 14 7.90984 14 7.08207C14 6.2543 13.329 5.58327 12.5012 5.58327L8.41929 5.5819L8.41937 5.34121C8.41937 5.34013 8.41894 5.33909 8.41817 5.33832C8.41741 5.33755 8.41698 5.33651 8.41698 5.33543V1.4988Z" fill="#FDD252"/>
                  </svg>
              </div>
              <div
                  class="expandable-section__content"
                  :class="{ 'expandable-section__content--expanded': section.isExpanded }"
                  v-html="section.content"
              >
              </div>
            </div>
        </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useDataStore } from '@/stores/data';
import DefaultLayout from '@/layouts/default.vue';
import axios from 'axios';

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
    padding-bottom: 90px;

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
    // border-top: 1px solid #D9E3ED;
    background: #1F3667;

    &:last-child {
        // border-bottom: 1px solid #D9E3ED;
    }

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
            max-height: 2000px; // Adjust this value based on your maximum content height
            padding: 0 30px 20px 30px;
            opacity: 1;
        }
    }
}

:deep(ion-content) {
    --background: white;
}
</style>
