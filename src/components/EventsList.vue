<!-- src/components/EventsList.vue -->
<template>
  <div class="events-list">
    <template v-if="props.events && props.events.length > 0">
      <div v-for="event in props.events" :key="`${event.id}-${event.dateDetails.start_time_unix}`" class="events-list__event-item">
        <div class="content">
          <h3>{{ event.title }}</h3>
          <p>{{ props.showEventDate ? event.eventDate.start_time_formatted : event.start_time }}</p>
          <p>{{ event.venue.name }}</p>
        </div>
        <div class="events-list__favorite-container">
          <FavoriteButton
            site="nysfair"
            :event-id="event.id"
            :date-details="event.dateDetails"
          />
        </div>
      </div>
    </template>

    <div v-else class="events-list__no-events">
      <p>{{ noEventsText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import FavoriteButton from './FavoriteButton.vue';
import type { Category } from '@/types';
import type { FormattedEvent } from '@/utils/event';

const props = withDefaults(defineProps<{
  events: FormattedEvent[];
  categories: Category[];
  noEventsText?: string;
  showEventDate?: boolean;
}>(), {
  events: () => [],
  categories: () => [],
  noEventsText: 'No events',
  showEventDate: false,
});
</script>

<style lang="scss" scoped>
.events-list {
  &__event-item {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    gap: 20px;

    .content {
      max-width: 75%;
    }

    h3 {
      margin: 0 0 5px 0;
      line-height: 28px;
      color: #FFF
    }

    p {
      font-size: 14px;
      color: #FFF;
      margin: 0;
      font-weight: 500;

      &:last-child {
        margin-top: 3px;
      }
    }
  }

  &__favorite-container {
    margin-top: 10px;
  }

  &__no-events {
    display: flex;
    justify-content: center;
    min-height: 150px;
    font-size: 18px;
    color: #666;
  }
}
</style>
