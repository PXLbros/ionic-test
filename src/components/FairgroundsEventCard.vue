<template>
  <div class="event-card">
    <router-link
      class="cta"
      :to="`/fairgrounds/upcoming-events/${encodeURIComponent(event.id)}?date=${encodeURIComponent(event.currentDate.date)}`"
    >
      <div class="event-card__image">
        <img :src="getImageUrl(event)" alt="Event image" />

        <FavoriteButton
          v-if="dateDetails"
          site="nysfairgrounds"
          :event-id="event.id"
          :date-details="dateDetails"
        />
      </div>
      <div class="event-card__content">
        <div class="event-card__meta">
          <div class="event-card__date">
            {{ event.currentDate.date_time_formatted }}
          </div>
        </div>
        <h2 class="event-card__title">{{ event.title }}</h2>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { FairgroundsEventDate } from '@/types';

const props = defineProps<{
  event: {
    id: string;
    title: string;
    currentDate: FairgroundsEventDate;
    eventImage?: { url: string }[];
  };
}>();

const getImageUrl = (event: any) => {
  return event.eventImage?.[0]?.url || '/api/placeholder/400/200';
};

// Compute dateDetails for FavoriteButton
const dateDetails = computed(() => {
  const currentDate = props.event.currentDate;

  if (!currentDate) {
    return null;
  }

  return {
    start_time_date: currentDate.start_time_date,
    start_time_unix: currentDate.start_time_unix,
    isFavorite: currentDate.isFavorite || false,
    isAddingToFavorites: currentDate.isAddingToFavorites || false,
    isRemovingFromFavorites: currentDate.isRemovingFromFavorites || false,
  };
});
</script>

<style lang="scss" scoped>
.event-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;

  &__image {
    background-color: #EFF2F6;
    border-radius: 5px;
    height: 25vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    overflow: hidden;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .favorite-button {
      position: absolute;
      top: 15px;
      right: 15px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
  }

  &__meta {
    display: flex;
    gap: 8px;
    align-items: center;

  }

  &__date {
    font-size: 12px;
    color: #343434;
    font-weight: 600;
    font-family: 'inter', sans-serif;
    line-height: 24px;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__time {
    font-family: 'inter', sans-serif;
    font-size: 12px;
    color: #343434;
    font-weight: 600;
    line-height: 24px;
  }

  &__title {
    font-size: 22px;
    font-weight: 700;
    font-family: 'inter', sans-serif;
    color: #343434;
    margin: 0px;
    line-height: 28px;
  }

  &__location {
    font-size: 16px;
    color: #343434;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.5px;
    margin: 0px;
  }
}

.cta {
  text-decoration: none;
}
</style>
