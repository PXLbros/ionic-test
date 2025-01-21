<template>
  <DefaultLayout title="Event Favorites" backButtonHref="/fair/schedule">
    <div class="main main--event-favorites-page">
      <div class="main__header">
        <div class="main__header-img">
          <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
              <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
          </svg>
        </div>
        <div class="main__header-content">
          <h1 class="title">Event Favorites</h1>
          <p class="subtitle">Class ridiculus rhoncus ad suspendisse ridiculus malesuada; litora morbi</p>
        </div>
      </div>

      <!-- <pre>
        {{ favoriteEventItems }}
      </pre> -->

      <div class="main__content">
        <EventsList
          :events="favoriteEventItems"
          :categories="categories"
          noEventsText="No favorited events"
          showEventDate
        />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { Category } from '@/types';
import DefaultLayout from '../../layouts/default.vue';
import { formatEvent } from '@/utils/event';

const dataStore = useDataStore();

const categories = computed<Category[]>(() => {
  return dataStore.data.nysfairWebsite?.eventCategories || [];
});

const favoriteEventItems = computed(() => {
  const favoriteEventItems = [];

  for (const event of dataStore.data.nysfairWebsite.events) {
    for (const eventDate of event.dates) {
      if (eventDate.isFavorite) {
        const formattedEvent = formatEvent({ event, eventDate, categories: categories.value });

        favoriteEventItems.push(formattedEvent);
      }
    }
  }

  return favoriteEventItems;
});
</script>

<style lang="scss" scoped>
.main--event-favorites-page {
  padding: 20px;
}
</style>
