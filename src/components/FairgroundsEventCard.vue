<template>
  <div class="event-card">
    <router-link
      class="cta"
      :to="`/fairgrounds/upcoming-events/${encodeURIComponent(event.id)}?date=${encodeURIComponent(event.currentDate.date)}`"
    >
      <div class="event-card__image">
        <img :src="getImageUrl(event)" alt="Event image" />

        <svg v-if="event.currentDate.isFavorite" class="favorite" width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2961_1313)">
            <path d="M11.5506 3.66404L11.9978 4.58109L12.4486 3.66583C13.3563 1.82286 15.2948 0.524902 17.56 0.524902C19.0798 0.524902 20.4861 1.29683 21.525 2.48415C22.5652 3.67294 23.2 5.23859 23.2 6.7449C23.2 8.21373 22.5298 9.80996 21.4566 11.411C20.3886 13.0044 18.9554 14.5526 17.5075 15.9144C16.0617 17.2743 14.6139 18.4368 13.5264 19.2598C12.9831 19.671 12.5307 19.9967 12.2149 20.2192C12.1325 20.2772 12.0594 20.3282 11.9965 20.3719C11.9341 20.3297 11.8619 20.2805 11.7806 20.2246C11.465 20.0076 11.0129 19.6893 10.4698 19.2865C9.38291 18.4801 7.93584 17.3377 6.49087 15.9916C5.04384 14.6435 3.61157 13.1027 2.54427 11.5008C1.47277 9.89262 0.800049 8.26906 0.800049 6.7449C0.800049 5.23911 1.43701 3.67356 2.47972 2.48457C3.52118 1.297 4.93016 0.524902 6.45005 0.524902C8.71571 0.524902 10.6529 1.82303 11.5506 3.66404Z" fill="#19262D" stroke="#FFD100"/>
          </g>
          <defs>
            <clipPath id="clip0_2961_1313">
              <rect width="23.4" height="20.95" fill="white" transform="translate(0.300049 0.0249023)"/>
            </clipPath>
          </defs>
        </svg>
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
import { FairgroundsEventDate } from '@/types';

defineProps<{
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

    .favorite {
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
