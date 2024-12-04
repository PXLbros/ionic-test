<template>
    <ion-page>
      <ion-content>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/fairgrounds/upcoming-events"></ion-back-button>
            </ion-buttons>
            <ion-title>FAIRGROUNDS | EVENT DETAIL</ion-title>
          </ion-toolbar>
        </ion-header>
  
        <div v-if="event" class="main">

          <div class="event-details">
            <div class="event-time">{{ getEventTime(event) }}</div>
            <h1 class="event-title">{{ event.title }}</h1>
            <div class="event-location">Location Name</div>
          </div>

          <div class="event-image">
            <img :src="getEventImage(event)" :alt="event.title">
          </div>

          <div class="event-description" v-html="event.eventBody"></div>

          <div class="event-pricing">
            <a :href="event.eventWebSite" class="buy-tickets" target="_blank" rel="noopener noreferrer">
              Buy Tickets
            </a>
            <div class="price">{{ event.eventAdmission || '$0.00' }}</div>
          </div>

          <div v-if="event.eventDates && event.eventDates.length > 1" class="additional-dates">
            <h2>Additional Dates and Times</h2>
            <div v-for="(date, index) in event.eventDates.slice(1)" :key="index">
              {{ formatAdditionalDate(date) }}
            </div>
          </div>
        </div>
        <div v-else class="alt">
          <h2>No Upcoming Events. Check back soon</h2>
        </div>
      </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import { format, parseISO } from 'date-fns';

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
}

const route = useRoute();
const dataStore = useDataStore();
const eventId = decodeURIComponent(route.params.id as string);

const event = computed<Event | undefined>(() => {
  return dataStore.data.nysfairgroundsWebsite.events.find(
    (event: Event) => event.id === eventId
  );
});

const getEventTime = (event: Event): string => {
  if (!event.eventDates?.[0]) return '';
  const startTime = event.eventDates[0].startTime;
  const endTime = event.eventDates[0].endTime;
  if (startTime && endTime) {
    return `${format(parseISO(startTime), 'h:mm aaa')} - ${format(parseISO(endTime), 'h:mm aaa')}`;
  }
  return startTime ? format(parseISO(startTime), 'h:mm aaa') : '';
};

const getEventImage = (event: Event): string => {
  return event.eventImage?.[0]?.url || '/api/placeholder/400/200';
};

const formatAdditionalDate = (date: EventDate): string => {
  const eventDate = format(parseISO(date.date), 'E, MMM d, yyyy');
  const startTime = format(parseISO(date.startTime), 'h:mm aaa');
  const endTime = format(parseISO(date.endTime), 'h:mm aaa');
  return `${eventDate} at ${startTime} - ${endTime}`;
};
</script>

<style lang="scss" scoped>
.main {
  padding: 20px 30px;

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
}

.event-time {
  font-size: 12px;
  font-weight: 600;
  color: #343434;
  margin-bottom: 8px;

}

.event-title {
  font-size: 24px;
  font-weight: 700;
  color: #343434;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.event-location {
  font-size: 12px;
  color: #343434;
  font-weight: 600;
}

.event-image {
  width: 100%;
  height: 250px;
  border-radius: 16px;
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
}

.event-pricing {
    gap: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  font-size: 32px;
  font-weight: 600;
  color: #333333;
}

.additional-dates {
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