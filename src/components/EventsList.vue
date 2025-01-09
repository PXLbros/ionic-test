<template>
  <div class="events-list">
    <div v-for="event in props.events" :key="event.id" class="event-item">
      <div class="content">
        <h3>{{ event.title || "Event Title" }}</h3>
        <p>{{ event.start_time || "Event Start Time" }} </p>
        <p>{{ event.venue.name || "Event Venue N/A" }}</p>
        <!-- <p v-if="event.categories.length > 0">
          Categories: {{ event.categories.map((eventCategoryId: number) => getCategoryName(eventCategoryId)).join(', ') }}
        </p> -->
      </div>
      <!-- <div class="favorite">
        <button
          class="favorite-button"
          :class="{ 'is-favorite': event.dateDetails.isFavorite }"
          @click="toggleFavorite(event.id, event.dateDetails)"
          :disabled="event.dateDetails.isAddingToFavorites || event.dateDetails.isRemovingFromFavorites"
        >
          <ion-icon
            :icon="event.dateDetails.isFavorite ? heart : heartOutline"
            :class="{ 'loading': event.dateDetails.isAddingToFavorites || event.dateDetails.isRemovingFromFavorites }"
          ></ion-icon>
        </button>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { Event } from '@/types';

const props = withDefaults(defineProps<{
  events: Event[];
}>(), {
  events: () => [],
});
</script>

<style lang="scss" scoped>
.events-list {
  .event-item {
    padding: 15px 0;
    border-bottom: 1px solid #EFF2F6;
    display: flex;
    justify-content: space-between;
    gap: 20px;

    h3 {
      font-size: 16px;
      margin: 0 0 5px 0;
    }

    p {
      font-size: 14px;
      color: #666;
      margin: 0;
      font-weight: 500;

      &:last-child {
        margin-top: 2px;
      }
    }

    .favorite {
        margin-top: 10px;
    }
  }
}
</style>
