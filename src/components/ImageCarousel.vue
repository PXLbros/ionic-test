<template>
  <div class="image-carousel" ref="carouselEl">
    <!-- Carousel display area -->
    <div
      class="carousel-container"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="carousel-slide"
        :class="{ 'active': currentIndex === index }"
      >
        <div class="image-container">
          <img
            v-if="image.url"
            :src="image.url"
            :alt="image.alt || 'Image'"
            class="carousel-image"
          />
          <div v-else class="placeholder-image">
            <PlaceholderIcon />
          </div>
        </div>
      </div>

      <!-- Pagination dots -->
      <div class="carousel-pagination">
        <button
          v-for="(_, index) in images"
          :key="index"
          class="pagination-dot"
          :class="{ 'active': currentIndex === index }"
          @click="setSlide(index)"
        ></button>
      </div>

      <!-- Navigation arrows -->
      <div class="carousel-nav">
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
    </div>

    <!-- Image information banner -->
    <div v-if="currentImage?.title || currentImage?.description" class="image-banner">
      <h3 v-if="currentImage?.title" class="title">{{ currentImage.title }}</h3>
      <p v-if="currentImage?.description" class="description">{{ currentImage.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlaceholderIcon from './Icons/PlaceholderIcon.vue';

interface ImageItem {
  url: string;
  alt?: string;
  title?: string;
  description?: string;
}

const props = defineProps({
  imageData: {
    type: Array as () => ImageItem[],
    default: () => []
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  autoplayInterval: {
    type: Number,
    default: 5000
  }
});

const images = computed<ImageItem[]>(() => props.imageData);
const currentIndex = ref<number>(0);

let autoplayTimer: ReturnType<typeof setInterval> | null = null;
const carouselEl = ref<HTMLElement | null>(null);

// Touch handling
let touchStartX = 0;
let touchEndX = 0;
const MIN_SWIPE_DISTANCE = 50;

function onTouchStart(e: TouchEvent): void {
  touchStartX = e.changedTouches[0].screenX;
}

function onTouchMove(e: TouchEvent): void {
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
    nextSlide();
  } else if (distance > MIN_SWIPE_DISTANCE) {
    prevSlide();
  }
}

function nextSlide(): void {
  if (images.value.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
  resetAutoplay();
}

function prevSlide(): void {
  if (images.value.length <= 1) return;
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
  resetAutoplay();
}

function setSlide(index: number): void {
  currentIndex.value = index;
  resetAutoplay();
}

function startAutoplay(): void {
  if (props.autoplay && images.value.length > 1) {
    autoplayTimer = setInterval(() => {
      nextSlide();
    }, props.autoplayInterval);
  }
}

function resetAutoplay(): void {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    startAutoplay();
  }
}

const currentImage = computed<ImageItem | null>(() =>
  images.value.length > 0 ? images.value[currentIndex.value] : null
);

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
  }
});
</script>

<style lang="scss" scoped>
.image-carousel {
  position: relative;
  width: 100%;
}

.carousel-container {
  position: relative;
  height: 36vh;
  overflow: hidden;

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
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EFF2F6;
}

.image-banner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  background-color: #ecedef;
  padding: 20px 0;
  width: 100%;
  margin-top: 10px; /* Add spacing between carousel and banner */
}

.title {
  color: #343434;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  font-family: 'inter', sans-serif;
  text-align: center;
  padding: 0 10px;
}

.description {
  color: #0077C8;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  text-align: center;
  padding: 0 10px;
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
</style>
