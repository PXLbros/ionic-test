<template>
  <FairLayout title="Event Favorites" backButtonHref="/fair/schedule">
    <div class="main main--event-favorites-page">
      <div class="main__header">
        <div class="main__header-img">
          <PlaceholderIcon />
        </div>
      </div>

      <div class="main__content">
        <FairEventsList
          :events="favoriteEventItems"
          :categories="categories"
          noEventsText="No favorited events"
          showEventDate
        />
      </div>
    </div>
  </FairLayout>
</template>

<script setup lang="ts">
import { Category } from '@/types';
import FairLayout from '../../layouts/fair.vue';
import { formatEvent } from '@/utils/event';
import PlaceholderIcon from '@/components/Icons/PlaceholderIcon.vue';

const dataStore = useDataStore();

const categories = computed<Category[]>(() => {
  return dataStore.data.nysfairWebsite?.event_categories || [];
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
.main {
  font-family: 'Inter', sans-serif;
  background: #098944;
  min-height: calc(100vh - 7.5vh);

  &--event-favorites-page {
    padding: 0px;
  }

  &__header {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    background: #FDD456;

    &-img {
      width: 100%;
      height: 20vh;
      background-color: #EFF2F6;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
    }

    &-content {
      display: flex;
      flex-direction: column;


      .title {
        font-size: 24px;
        font-weight: 700;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: #343434;
      }

      .subtitle {
        font-size: 16px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: #343434;
        margin: 0px;
        width: 90%;
      }
    }
  }

  &__content {
    padding: 20px;
    padding-top: 10px;
    background-color: #098944;
  }
}
</style>

<style lang="scss">
.main__content .events-list__no-events {
  color: #FDD456;
}
</style>
