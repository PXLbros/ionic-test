# src/components/EventModal.vue

<template>
  <transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div
        class="modal-container"
        @click.stop
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
        :style="containerStyle"
      >
        <div class="modal-handle"></div>

        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ event?.title || 'Event Details' }}</h2>
            <button class="close-button" @click="closeModal">
              <ion-icon :icon="close"></ion-icon>
            </button>
          </div>

          <div class="event-image">
            <img :src="event?.featured_image" alt="">
          </div>

          <div class="event-details">
            <div class="detail-item">
              <ion-icon :icon="timeOutline"></ion-icon>
              <p>{{ event?.start_time || 'Time not available' }}</p>
            </div>

            <div class="detail-item">
              <ion-icon :icon="locationOutline"></ion-icon>
              <p>{{ event?.venue?.name || 'Location not available' }}</p>
            </div>

            <div class="detail-item" v-if="event?.categories?.length">
              <ion-icon :icon="pricetagOutline"></ion-icon>
              <p>{{ getCategoryNames(event.categories) }}</p>
            </div>

            <div class="detail-item">
              <ion-icon :icon="cashOutline"></ion-icon>
              <p>{{ event?.price ? `$${event.price}` : 'Price Not Available' }}</p>
            </div>

            <div class="description" v-if="event?.description">
              <h3>About</h3>
              <p v-html="event.description"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { close, timeOutline, locationOutline, pricetagOutline, cashOutline } from 'ionicons/icons';

interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  featured_image: string;
  price: string;
  venue: {
    name: string;
  };
  categories: number[];
}

interface Category {
  id: number;
  name: string;
}

const props = defineProps<{
  isOpen: boolean;
  event: Event | null;
  categories: Category[];
}>();

const emit = defineEmits(['close']);

// Drag state management
const dragStartY = ref(0);
const dragOffset = ref(0);
const isDragging = ref(false);

// Computed styles for smooth dragging
const containerStyle = computed(() => {
  if (!isDragging.value && dragOffset.value === 0) return {};

  return {
    transform: `translateY(${dragOffset.value}px)`,
    transition: isDragging.value ? 'none' : 'transform 0.3s ease'
  };
});

// Touch event handlers
const startDrag = (event: TouchEvent) => {
  isDragging.value = true;
  dragStartY.value = event.touches[0].clientY;
};

const onDrag = (event: TouchEvent) => {
  if (!isDragging.value) return;

  const currentY = event.touches[0].clientY;
  const difference = currentY - dragStartY.value;

  // Only allow dragging downwards
  if (difference < 0) {
    dragOffset.value = 0;
  } else {
    dragOffset.value = difference;
  }
};

const endDrag = () => {
  isDragging.value = false;

  // Close modal if dragged down more than 150px
  if (dragOffset.value > 150) {
    closeModal();
  } else {
    // Reset position if not dragged far enough
    dragOffset.value = 0;
  }
};

const closeModal = () => {
  dragOffset.value = 0;
  emit('close');
};

const getCategoryNames = (categoryIds: number[]) => {
  return categoryIds
    .map(id => props.categories.find(cat => cat.id === id)?.name)
    .filter(Boolean)
    .join(', ');
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.modal-container {
  background-color: white;
  width: 100%;
  border-radius: 24px 24px 0 0;
  padding: 16px;
  max-height: 90vh;
  overflow-y: auto;
  touch-action: pan-y;
  will-change: transform;
}

.modal-handle {
  width: 40px;
  height: 4px;
  background-color: #E0E0E0;
  border-radius: 2px;
  margin: 0 auto 16px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: black;
    padding-right: 24px;
  }

  .close-button {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;

    ion-icon {
      font-size: 24px;
      color: #666;
    }
  }
}

.event-image {
  margin-bottom: 10px;
  img {
    border-radius: 10px;
  }
}

.event-details {
  .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;

    ion-icon {
      font-size: 20px;
      color: #1E5EAE;
    }

    p {
      margin: 0;
      font-size: 16px;
      color: #333;
    }
  }

  .description {
    margin-top: 24px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
      color: black;
    }

    p {
      font-size: 16px;
      line-height: 1.5;
      margin-top: 0px;
      color: #666;
    }
  }
}

// Modal transition animations
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from {
  opacity: 0;

  .modal-container {
    transform: translateY(100%);
  }
}

.modal-enter-to {
  opacity: 1;

  .modal-container {
    transform: translateY(0);
  }
}

.modal-leave-from {
  opacity: 1;

  .modal-container {
    transform: translateY(0);
  }
}

.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: translateY(100%);
  }
}
</style>
