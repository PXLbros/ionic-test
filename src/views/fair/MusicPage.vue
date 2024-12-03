<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                  <ion-buttons slot="start">
                    <ion-back-button default-href="/fair"></ion-back-button>
                  </ion-buttons>
                  <ion-title>Chevy Music Series</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="main">
                <div class="main__header">
                    <h1 class="main__header-title">Chevrolet Music Series</h1>
                    <div class="main__header-img">
                        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                            <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                        </svg>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="filters">
                    <button class="filter-btn">Date ▼</button>
                    <button class="filter-btn">Venue ▼</button>
                    <button class="filter-btn">Genre ▼</button>
                </div>

                <!-- Events List -->
                <div class="events-list">
                    <router-link 
                        v-for="event in chevyCourtEvents" 
                        :key="event.id" 
                        :to="`/fair/music/${event.id}`"
                        class="event-card"
                    >
                        <div class="event-info">
                            <div class="venue-name">{{ venueInfo?.name || 'Chevy Court' }}</div>
                            <h2 class="event-title">{{ event.title }}</h2>
                            <div class="event-date">{{ formatEventDate(event.start_time) }}</div>
                        </div>
                        <div  class="event-image">
                            <img v-if="event.featured_image" :src="event.featured_image" alt="">
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 62 62" fill="none">
                                <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                            </svg>
                        </div>
                    </router-link>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
interface Event {
  id: number;
  title: string;
  description: string;
  permalink: string;
  start_time: string;
  venue: Venue;
  featured_image?: string;
  duration?: number;
}

interface Venue {
  name: string;
  slug: string;
  description?: string;
  latitude?: string;
  longitude?: string;
}

// Enum for accepted venue slugs - easy to add more venues
enum AcceptedVenueSlugs {
  CHEVY_COURT = 'chevy-court',
  CHEVY_PARK = 'chevy-park',
  // Add more venues as needed
}

interface DataStore {
  data: {
    nysfairWebsite: {
      events: Event[];
      venues: Venue[];
    };
  };
}

import { computed } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
console.log('data for music page', dataStore.data);

// Get events for accepted venues sorted by date
const chevyCourtEvents = computed<Event[]>(() => {
    const events = dataStore.data.nysfairWebsite.events;
    return events
        .filter((event: Event) => {
            const venue = event.venue;
            return venue && venue.slug === AcceptedVenueSlugs.CHEVY_COURT;
        })
        .sort((a: Event, b: Event) => {
            const dateA = new Date(a.start_time).getTime();
            const dateB = new Date(b.start_time).getTime();
            return dateA - dateB; // Ascending order (earliest first)
        });
});

// Get venue information
const venueInfo = computed<Venue | undefined>(() => {
    const venues = dataStore.data.nysfairWebsite.venues;
    return venues.find((venue: Venue) => venue.slug === AcceptedVenueSlugs.CHEVY_COURT);
});

// Format date function with type safety
const formatEventDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(date);
};

</script>

<style lang="scss" scoped>
.main {
    &__header {
        display: flex;
        gap: 10px;
        padding: 20px;
        flex-direction: column;

        &-title {
            font-size: 24px;
            font-weight: 600;
            line-height: 28px;
            letter-spacing: 0.5px;
        }

        &-img {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 25vh;
            border-radius: 24px;
            background-color: #EFF2F6;
        }
    }
}

.filters {
    display: flex;
    gap: 10px;
    padding: 10px 20px 20px 20px;
    justify-content: space-between
}

.filter-btn {
    background-color: #EFF2F6;
    border: none;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 700;
    width: 100%;
    color: #333;
}

.events-list {
    padding: 20px;
    padding-top: 0px;
    max-height: 50vh;
    overflow: scroll;
}

.event-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #EFF2F6;
    gap: 20px; // Increased gap for better spacing
    text-decoration: none;
    color: #343434;
  }
  
  .event-info {
    flex: 1; // This will allow the info to take up remaining space
    min-width: 0; // This prevents flex child from overflowing
  
    .venue-name {
      font-size: 12px;
      color: #333;
      margin-bottom: 4px;
      font-weight: 600;
    }
  
    .event-title {
      font-size: 24px;
      font-weight: 700;
      margin: 4px 0;
      // Add text truncation for long titles
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    .event-date {
      font-size: 16px;
      color: #333;
      font-weight: 700;
    }
  }
  
  .event-image {
    flex-shrink: 0; // Prevents the image from shrinking
    width: 80px; // Fixed width
    height: 80px; // Fixed height (1:1 aspect ratio)
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #EFF2F6;
    border-radius: 12px;
    overflow: hidden; // Ensures content stays within borders
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    svg {
      width: 40px;
      height: 40px;
    }
  }
</style>