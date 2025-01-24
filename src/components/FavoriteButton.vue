<!-- src/components/EventFavoriteButton.vue -->
<template>
  <button
    class="favorite-button"
    :class="{ 'favorite-button--is-favorite': dateDetails.isFavorite }"
    @click.prevent="handleFavoriteClick"
    :disabled="dateDetails.isAddingToFavorites || dateDetails.isRemovingFromFavorites"
  >
    <ion-icon
      :icon="dateDetails.isFavorite ? heart : heartOutline"
      :class="{ 'loading': dateDetails.isAddingToFavorites || dateDetails.isRemovingFromFavorites }"
    ></ion-icon>
  </button>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { heart, heartOutline } from 'ionicons/icons';
import { useEventFavorites } from '@/composables/useEventsFavorites';
import type { EventDate } from '@/types';

const props = defineProps<{
  eventId: number;
  dateDetails: EventDate;
}>();

const { toggleFavorite } = useEventFavorites();

const handleFavoriteClick = async (event: Event) => {
  event.stopPropagation();
  await toggleFavorite(props.eventId, props.dateDetails);
};
</script>

<style lang="scss" scoped>
.favorite-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  padding: 8px;

  &:active {
    transform: scale(0.95);
  }

  &--is-favorite {
    ion-icon {
      color: #e31b23;
      fill: #e31b23;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ion-icon {
    font-size: 24px;
    color: #666;
    transition: all 0.3s ease;
  }

  .loading {
    animation: pulse 1s infinite;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
