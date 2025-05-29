<template>
  <FairgroundsLayout
    title="Upcoming Events"
    :showMenuButton="true"
  >
    <div v-if="event" class="main">
      <div class="event-details">
        <div class="event-image">
          <img :src="getEventImage(event)" alt="">

          <FavoriteButton
            v-if="dateDetails"
            site="nysfairgrounds"
            :event-id="event.id"
            :date-details="dateDetails"
            class="event-details__favorite-button"
          />
        </div>
        <div class="event-datetime">
          {{ getEventTime(event) }}
        </div>
        <h1 class="event-title">{{ event.title }}</h1>
      </div>

      <div class="event-description" v-html="sanitizedEventBody"></div>

      <div v-if="hasContactInfo(event)" class="event-contact">
        <h2 class="contact-title">Contact Information</h2>
        <div class="contact-list">
          <a
            v-if="event.eventWebSite"
            :href="event.eventWebSite"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-item"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" fill="currentColor"/>
            </svg>
            <span>Visit Website</span>
          </a>
          <a
            v-if="event.eventContactPhone"
            :href="'tel:' + event.eventContactPhone"
            class="contact-item"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
            </svg>
            <span>{{ event.eventContactPhone }}</span>
          </a>
          <a
            v-if="event.eventContactEmail"
            :href="'mailto:' + event.eventContactEmail"
            class="contact-item"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
            </svg>
            <span>{{ event.eventContactEmail }}</span>
          </a>
        </div>
      </div>

      <div class="event-pricing">
        <a :href="event.eventWebSite" class="buy-tickets" target="_blank" rel="noopener noreferrer">
          Buy Tickets
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M14.4445 20H3.33334C2.44291 20 1.60585 19.6532 0.976285 19.0236C0.346722 18.3941 0 17.557 0 16.6666V5.55555C0 4.66516 0.346765 3.82811 0.976324 3.19855C1.60589 2.56899 2.44295 2.22223 3.33338 2.22223H7.77785C8.39153 2.22223 8.88897 2.71967 8.88897 3.33335C8.88897 3.94704 8.39153 4.44447 7.77785 4.44447H3.33334C3.03653 4.44447 2.75753 4.56006 2.54771 4.76988C2.33788 4.97971 2.22225 5.25874 2.22225 5.55555V16.6666C2.22225 16.9635 2.33784 17.2424 2.54771 17.4524C2.75754 17.6621 3.03653 17.7778 3.33334 17.7778H14.4445C14.7413 17.7778 15.0203 17.6622 15.2302 17.4523C15.44 17.2424 15.5556 16.9634 15.5556 16.6666V12.2222C15.5556 11.6085 16.0531 11.1111 16.6667 11.1111C17.2804 11.1111 17.7779 11.6086 17.7779 12.2222V16.6666C17.7779 17.557 17.4311 18.394 16.8015 19.0237C16.1719 19.6532 15.3348 20 14.4445 20ZM7.77785 13.3333C7.49346 13.3333 7.20911 13.2249 6.99217 13.0079C6.55827 12.574 6.55827 11.8704 6.99217 11.4365L16.2065 2.22223H12.2223C11.6086 2.22223 11.1112 1.7248 11.1112 1.11112C11.1112 0.497434 11.6086 0 12.2223 0H18.889C19.0427 0 19.1891 0.031207 19.3222 0.0876016C19.4464 0.140156 19.5631 0.216309 19.6652 0.316098C19.6652 0.316124 19.6652 0.31615 19.6653 0.316176C19.666 0.316914 19.6668 0.317613 19.6674 0.318348C19.6676 0.318543 19.6679 0.318773 19.6681 0.318969C19.6686 0.319512 19.6693 0.320094 19.6698 0.320676C19.6702 0.321063 19.6706 0.321414 19.6709 0.321801C19.6714 0.322227 19.6718 0.322695 19.6722 0.323043C19.673 0.32382 19.6738 0.324633 19.6746 0.325449C19.6754 0.326227 19.6762 0.327078 19.677 0.327856C19.6774 0.328242 19.6779 0.32875 19.6782 0.329098C19.6786 0.329484 19.6789 0.329836 19.6793 0.330223C19.6799 0.330805 19.6805 0.331348 19.681 0.331969C19.6812 0.332125 19.6815 0.332395 19.6817 0.33259C19.6824 0.333328 19.6831 0.334066 19.6838 0.334801C19.6838 0.33484 19.6839 0.33484 19.6839 0.334879C19.7836 0.437035 19.8598 0.553711 19.9124 0.677914C19.9688 0.811043 20 0.957371 20 1.11107V7.77774C20 8.39143 19.5025 8.88886 18.8888 8.88886C18.2751 8.88886 17.7777 8.39143 17.7777 7.77774V3.7936L8.56332 13.0079C8.34654 13.2249 8.0622 13.3333 7.77785 13.3333Z" fill="#F1F1F1"/>
          </svg>
        </a>
        <div v-if="event.eventAdmission" class="price">{{ event.eventAdmission || '$0.00' }}</div>
      </div>

      <div v-if="additionalDates.length > 0" class="additional-dates">
        <h2>Additional Dates and Times</h2>
        <div v-for="(date, index) in additionalDates" :key="index">
          {{ formatAdditionalDate(date) }}
        </div>
      </div>

      <FairgroundsKeepInTouchForm />

    </div>
    <div v-else class="alt">
      <h2>No Upcoming Events. Check back soon</h2>
    </div>

  </FairgroundsLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import { parseISO } from 'date-fns';
import FairgroundsLayout from '@/layouts/fairgrounds.vue';
import type { EventDate, FairgroundsEvent, FairgroundsEventDate } from '@/types';
import FairgroundsKeepInTouchForm from '@/components/FairgroundsKeepInTouchForm.vue';
import appConfig from '@/config/app';
import { sanitizeHtml } from '@/utils/text';

const route = useRoute();
const dataStore = useDataStore();
const eventId = decodeURIComponent(route.params.id as string);
const selectedDate = route.query.date ? decodeURIComponent(route.query.date as string) : null;

const event = computed<FairgroundsEvent | undefined>(() => {
  return dataStore.data.nysfairgroundsWebsite.events.find(
    (event: FairgroundsEvent) => event.id === eventId
  );
});

const currentEventDate = computed(() => {
  if (!event.value || !event.value.dates) return null;

  if (selectedDate) {
    const matchingDate = event.value.dates.find(
      (date: FairgroundsEventDate) => parseISO(date.date).getTime() === parseISO(selectedDate).getTime()
    );
    return matchingDate || event.value.dates[0];
  }

  return event.value.dates[0];
});

const dateDetails = computed((): EventDate | null => {
  if (!event.value) {
    return null;
  } else if (!currentEventDate.value) {
    return null;
  }

  return {
    start_time_date: currentEventDate.value.start_time_date,
    start_time_unix: currentEventDate.value.start_time_unix,
    isFavorite: currentEventDate.value?.isFavorite || false,
    isAddingToFavorites: false,
    isRemovingFromFavorites: false,
  };
});

const getEventTime = (event: FairgroundsEvent): string => {
  if (!currentEventDate.value) {
    return '';
  }

  return currentEventDate.value.date_time_formatted;
};

const additionalDates = computed(() => {
  if (!event.value || !event.value.dates) {
    return [];
  }

  const additionalDates = event.value.dates.filter(date =>
    parseISO(date.date).getTime() !== parseISO(currentEventDate.value?.date || '').getTime()
  );

  return additionalDates;
});

const hasContactInfo = (event: FairgroundsEvent): boolean => {
  return !!(event.eventWebSite || event.eventContactPhone || event.eventContactEmail);
};

const getEventImage = (event: FairgroundsEvent): string => {
  if (event.eventImage && event.eventImage.length > 0 && event.eventImage[0].url) {
    // Return the full URL directly
    return event.eventImage[0].url;
  }

  return '/api/placeholder/400/200';
};

const formatAdditionalDate = (date: FairgroundsEventDate): string => {
  return `${date.start_time_date} at ${date.start_time_time} - ${date.end_time_time}`;
};

const sanitizedEventBody = computed(() => {
  return sanitizeHtml({ html: event.value?.eventBody || '' });
});
</script>

<style lang="scss" scoped>
.main {
  padding-bottom: v-bind('appConfig.bottomBar.height');
  background-color: #F0F0F0;

  &__header {
    margin-bottom: 30px;
  }
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333333;
  font-size: 18px;
  font-weight: 500;
}

.event-details {
  position: relative;
  margin-bottom: 24px;
  padding: 20px 20px 0px 20px;

  &__favorite-button {
    position: absolute;
    top: 32px;
    right: 27px;
    z-index: 10;
  }
}

.event-time {
  font-size: 14px;
  font-weight: 600;
  color: #0077C8;
  margin-bottom: 0px;
}

.event-title {
  font-size: 24px;
  font-weight: 700;
  color: #343434;
  margin: 0 0 8px 0;
  line-height: 1.2;
  font-family: 'inter', 'sans-serif';
}

.event-location {
  font-size: 12px;
  color: #343434;
  font-weight: 600;
}

.event-image {
  width: 100%;
  height: 250px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 24px;
  background-color: #F5F7FA;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.event-description {
  font-size: 16px;
  line-height: 28px;
    letter-spacing: 0.5px;
  color: #343434;
  font-weight: 400;
  margin-bottom: 32px;
  padding: 0px 20px;
}

.event-datetime {
  font-size: 12px;
  font-weight: 600;
  color: #0077C8;
  margin-bottom: 0px;
  display: flex;
  line-height: 28px;
  align-items: center;
  gap: 0px;
}

.event-contact {
  margin-bottom: 32px;
  padding: 24px;
  background-color: #F5F7FA;
  border-radius: 16px;
  margin: 0px 20px;

  .contact-title {
    font-size: 18px;
    font-weight: 600;
    color: #343434;
    margin: 0 0 16px 0;
  }

  .contact-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .contact-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: #42639F;
    font-size: 14px;
    font-weight: 500;
    transition: opacity 0.2s ease;

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

.event-pricing {
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  margin-top: 20px;
}

.buy-tickets {
  background-color: #42639F;
  color: white;
  padding: 20px 32px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  height: 60px;
  display: flex;
  gap: 10px;
  display: none;
}

.price {
  display: none;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.additional-dates {
  padding: 0px 20px 20px 20px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 16px;
  }

  div {
    font-size: 16px;
    color: #333333;
    margin-bottom: 8px;
  }
}

.alt {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 24px;
  color: #333333;
  padding: 30px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #333333;
    margin: 0;
    text-align: center;
  }
}

:deep(a) {
  color: #42639F;
  text-decoration: none;
}

:deep(ul) {
  padding-left: 20px;
  margin: 16px 0;
}

:deep(p) {
  margin: 16px 0;
}
</style>
