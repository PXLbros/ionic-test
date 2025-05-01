<template>
  <div class="event-carousel" ref="carouselEl">
    <!-- Carousel display area -->
    <div
      class="carousel-container"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        v-for="(event, index) in events"
        :key="event.id"
        class="carousel-slide"
        :class="{ 'active': currentIndex === index }"
        @click="navigateToEvent(event.id)"
      >
        <div class="image-container">
          <img
            v-if="event.eventImage && event.eventImage.length"
            :src="event.eventImage[0].url"
            :alt="event.eventImage[0].title || event.title"
            class="event-image"
          />
          <div v-else class="placeholder-image">
            <PlaceholderIcon />
          </div>
        </div>
      </div>

      <!-- Navigation arrows -->
      <div v-if="events.length > 1" class="carousel-nav">
        <button class="nav-btn prev" @click="prevSlide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-btn next" @click="nextSlide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Pagination dots -->
      <div class="carousel-pagination">
        <button
          v-for="(_, index) in events"
          :key="index"
          class="pagination-dot"
          :class="{ 'active': currentIndex === index }"
          @click="setSlide(index)"
        ></button>
      </div>
    </div>

    <!-- Event information banner -->
    <div v-if="currentEvent" class="image-banner" @click="navigateToEvent(currentEvent.id)">
      <p class="date" v-if="currentEvent.eventDates?.[0]?.start_time_date">
        {{ currentEvent.eventDates?.[0]?.start_time_date }}
      </p>

      <h3 class="title">
        {{ currentEvent.title }}
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlaceholderIcon from './Icons/PlaceholderIcon.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Define event type interface
interface EventImage {
  url: string;
  title?: string;
  filename?: string;
}

interface EventDate {
  startDate: string;
  endDate?: string;
  start_time_date?: string;
}

interface EventItem {
  id: string;
  title: string;
  eventImage?: EventImage[];
  eventDates?: EventDate[];
  eventAdmission?: string;
  eventWebSite?: string;
  [key: string]: any; // For other potential properties
}

const props = defineProps({
  eventData: {
    type: Array as () => EventItem[],
    default: () => []
  }
});

const events = computed<EventItem[]>(() => {
  // Take the first 5 events from the provided data
  return props.eventData.slice(0, 5);
});

const currentIndex = ref<number>(0);
const currentEvent = computed<EventItem | null>(() =>
  events.value.length > 0 ? events.value[currentIndex.value] : null
);

let autoplayInterval: ReturnType<typeof setInterval> | null = null;
const carouselEl = ref<HTMLElement | null>(null);

// Touch handling
let touchStartX = 0;
let touchEndX = 0;
const MIN_SWIPE_DISTANCE = 50;

function onTouchStart(e: TouchEvent): void {
  touchStartX = e.changedTouches[0].screenX;
}

function onTouchMove(e: TouchEvent): void {
  // Prevent default to stop page scrolling while swiping
  // Only prevent if the swipe is significant
  const currentX = e.changedTouches[0].screenX;
  const distance = Math.abs(currentX - touchStartX);

  if (distance > 10) {
    e.preventDefault();
  }
}

function onTouchEnd(e: TouchEvent): void {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe(): void {
  const distance = touchEndX - touchStartX;

  if (distance < -MIN_SWIPE_DISTANCE) {
    // Swipe left, show next slide
    nextSlide();
  } else if (distance > MIN_SWIPE_DISTANCE) {
    // Swipe right, show previous slide
    prevSlide();
  }
}

function nextSlide(): void {
  if (events.value.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % events.value.length;
  resetAutoplayTimer();
}

function prevSlide(): void {
  if (events.value.length <= 1) return;
  currentIndex.value = (currentIndex.value - 1 + events.value.length) % events.value.length;
  resetAutoplayTimer();
}

function setSlide(index: number): void {
  currentIndex.value = index;
  resetAutoplayTimer();
}

function startAutoplay(): void {
  if (events.value.length > 1) {
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  }
}

function resetAutoplayTimer(): void {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    startAutoplay();
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  // Format: Feb 27th, 2025
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];

  let day = date.getDate();
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) suffix = 'st';
  if (day === 2 || day === 22) suffix = 'nd';
  if (day === 3 || day === 23) suffix = 'rd';

  const year = date.getFullYear();

  return `${month} ${day}${suffix}, ${year}`;
}

function navigateToEvent(eventId: string): void {
  router.push(`/fairgrounds/upcoming-events/${encodeURIComponent(eventId)}`);
}

onMounted(() => {
  startAutoplay();

  // Add passive: false to the carousel container to allow preventDefault on mobile
  if (carouselEl.value) {
    const container = carouselEl.value.querySelector('.carousel-container');
    if (container) {
      container.addEventListener('touchmove', (e) => {
        e.preventDefault();
      }, { passive: false });
    }
  }
});

onBeforeUnmount(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
});
</script>

<style lang="scss" scoped>
.event-carousel {
  position: relative;
  width: 100%;
}

.carousel-container {
  position: relative;
  height: 36vh;
  overflow: hidden;
  touch-action: pan-y; /* Allow vertical scrolling but handle horizontal ourselves */
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;

  &.active {
    opacity: 1;
    z-index: 1;
  }
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  padding: 0;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EFF2F6;
}

.carousel-nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  z-index: 2;
  pointer-events: none;
}

.nav-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.carousel-pagination {
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 2;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  border: none;
  cursor: pointer;
  padding: 0;

  &.active {
    background-color: #0077C8;
    width: 25px;
    border-radius: 5px;
    transition: width 0.3s ease;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    &.active {
      background-color: #0077C8;
    }
  }
}

.image-banner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  background-color: #ecedef;
  padding: 30px 0px;
  width: 100%;
  height: 105px;
}

.date {
  color: #0077C8;
  font-size: 16px;
  font-weight: 700;
  margin: 0px;
}

.title {
  color: #343434;
  margin: 0px;
  font-size: 18px;
  font-weight: 700;
  font-family: 'inter', sans-serif;
  text-align: center;
  padding: 0 10px;
}
</style>
