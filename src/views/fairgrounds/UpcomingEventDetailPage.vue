<template>
  <Fairgrounds
    title="Upcoming Events"
    :showMenuButton="true"
  >
    <div v-if="event" class="main">
      <div class="event-details">
        <div class="event-image">
          <img :src="getEventImage(event)" :alt="event.title">
        </div>
        <div class="event-datetime">
          {{ getEventTime(event) }}
        </div>
        <h1 class="event-title">{{ event.title }}</h1>
        <!-- <div class="event-location">Location Name</div> -->
      </div>

      <div class="event-description" v-html="event.eventBody"></div>

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
        </a>
        <div class="price">{{ event.eventAdmission || '$0.00' }}</div>
      </div>

      <div v-if="additionalDates.length > 0" class="additional-dates">
        <h2>Additional Dates and Times</h2>
        <div v-for="(date, index) in additionalDates" :key="index">
          {{ formatAdditionalDate(date) }}
        </div>
      </div>

      <FGKeepInTouch />

    </div>
    <div v-else class="alt">
      <h2>No Upcoming Events. Check back soon</h2>
    </div>

  </Fairgrounds>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import { format, parseISO } from 'date-fns';
import Fairgrounds from '@/layouts/fairgrounds.vue';

interface EventDate {
  date: string;
  endTime: string;
  startTime: string;
}

interface EventImage {
  filename: string;
  title: string;
  url: string;
}

interface Event {
  id: string;
  title: string;
  eventBody: string;
  eventDates: EventDate[];
  eventImage: EventImage[];
  eventAdmission: string;
  eventWebSite: string;
  enabled: boolean;
  eventContactEmail: string;
  eventContactPhone: string;
}

const route = useRoute();
const dataStore = useDataStore();
const eventId = decodeURIComponent(route.params.id as string);
const selectedDate = route.query.date ? decodeURIComponent(route.query.date as string) : null;

const event = computed<Event | undefined>(() => {
  return dataStore.data.nysfairgroundsWebsite.events.find(
    (event: Event) => event.id === eventId
  );
});

const currentEventDate = computed(() => {
  if (!event.value || !event.value.eventDates) return null;

  if (selectedDate) {
    // Find the matching date in eventDates
    const matchingDate = event.value.eventDates.find(
      date => parseISO(date.date).getTime() === parseISO(selectedDate).getTime()
    );
    return matchingDate || event.value.eventDates[0];
  }

  return event.value.eventDates[0];
});

const getEventTime = (event: Event): string => {
  if (!currentEventDate.value) return '';

  const date = format(parseISO(currentEventDate.value.date), 'EEE, MMM d, yyyy');
  const startTime = currentEventDate.value.startTime;
  const endTime = currentEventDate.value.endTime;

  let timeStr = '';
  if (startTime && endTime) {
    timeStr = `${format(parseISO(startTime), 'h:mm aaa')} - ${format(parseISO(endTime), 'h:mm aaa')}`;
  } else if (startTime) {
    timeStr = format(parseISO(startTime), 'h:mm aaa');
  }

  return `${date} • ${timeStr}`;
};

const additionalDates = computed(() => {
  if (!event.value || !event.value.eventDates) return [];

  return event.value.eventDates.filter(date =>
    parseISO(date.date).getTime() !== parseISO(currentEventDate.value?.date || '').getTime()
  );
});

const hasContactInfo = (event: Event): boolean => {
  return !!(event.eventWebSite || event.eventContactPhone || event.eventContactEmail);
};

const getEventImage = (event: Event): string => {
  if (event.eventImage && event.eventImage.length > 0 && event.eventImage[0].url) {
    // Return the full URL directly
    return event.eventImage[0].url;
  }
  return '/api/placeholder/400/200';
};

const formatAdditionalDate = (date: EventDate): string => {
  const eventDate = format(parseISO(date.date), 'E, MMM d, yyyy');
  if (!date.startTime || !date.endTime) return eventDate;

  const startTime = format(parseISO(date.startTime), 'h:mm aaa');
  const endTime = format(parseISO(date.endTime), 'h:mm aaa');
  return `${eventDate} at ${startTime} - ${endTime}`;
};
</script>

<style lang="scss" scoped>
.main {
  padding-bottom: 90px;
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
  margin-bottom: 24px;
  padding: 20px 20px 0px 20px;
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
}

.buy-tickets {
  background-color: #42639F;
  color: white;
  padding: 12px 32px;
  border-radius: 24px;
  text-decoration: none;
  font-weight: 600;
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
