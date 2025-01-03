<template>
  <ion-page>
    <ion-header>
      <ion-toolbar :translucent="true" >
        <ion-buttons slot="start">
          <ion-back-button default-href="/fair"></ion-back-button>
        </ion-buttons>
        <ion-title>Chevy Music Series</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <div class="main">
        <div class="main__header">
          <h1 class="main__header-title">Chevrolet Music Series</h1>
          <div class="main__header-img">
            <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
              <path
                d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z"
                fill="#1E5EAE"
              />
            </svg>
          </div>
        </div>

        <!-- Filter Section -->
        <div class="filters">
            <div class="filter-dropdown">
                <button class="filter-btn" @click="toggleDateDropdown">
                  {{ selectedDate || 'Date' }} ▼
                </button>
                <div v-if="showDateDropdown" class="dropdown-content">
                  <div v-for="date in uniqueDates" :key="date" @click="selectDate(date || '')">
                    {{ formatDate(date || '') }}
                  </div>
                </div>
            </div>
             <div class="filter-dropdown">
                <button class="filter-btn" @click="toggleVenueDropdown">
                  {{ selectedVenue || 'Venue' }} ▼
                </button>
                <div v-if="showVenueDropdown" class="dropdown-content">
                  <div v-for="venue in uniqueVenues" :key="venue" @click="selectVenue(venue || '')">
                    {{ venue }}
                  </div>
                </div>
            </div>
            <div class="filter-dropdown">
                <button class="filter-btn" @click="toggleGenreDropdown">
                    {{ selectedGenre || 'Genre' }} ▼
                </button>
                <div v-if="showGenreDropdown" class="dropdown-content">
                  <div v-for="genre in uniqueGenres" :key="genre" @click="selectGenre(genre)">
                    {{ genre }}
                  </div>
                </div>
            </div>
          </div>


        <!-- Events List -->
        <div class="events-list">
          <router-link
            v-for="event in filteredEvents"
            :key="event.id"
            :to="`/fair/music/${event.id}`"
            class="event-card"
          >
            <div class="event-info">
              <div class="venue-name">{{ event?.venue?.name || 'Chevy Court' }}</div>
              <h2 class="event-title">{{ event.title }}</h2>
              <div class="event-date">{{ formatEventDate(event) }}</div>
            </div>
            <div class="event-image">
              <img v-if="event.featured_image" :src="event.featured_image" alt="Music Image" />
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 62 62" fill="none">
                <path
                  d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z"
                  fill="#1E5EAE"
                />
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
  dates: {
    start_time_date: string;
    start_time_time: string;
    start_time_unix: number;
  }[];
  venue: {
    name: string;
    slug: string;
  } | undefined;
  featured_image?: string;
  duration?: number;
  genres: string[];
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
  SUBURBAN_PARK = 'suburban-park',
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

import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useDataStore } from '@/stores/data';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { data, isLoading } = storeToRefs(dataStore);

const showDateDropdown = ref(false);
const showVenueDropdown = ref(false);
const showGenreDropdown = ref(false);
const selectedDate = ref('');
const selectedVenue = ref('');
const selectedGenre = ref('');


const musicEvents = computed<Event[]>(() => {
  const events = data.value?.nysfairWebsite?.events ?? [];
  return events
    .filter((event: Event) => {
      const venue = event.venue;
      return venue && Object.values(AcceptedVenueSlugs).includes(venue.slug as AcceptedVenueSlugs);
    })
    .map((event: Event) => ({
      ...event,
      featured_image: event.featured_image?.replace(
        'http://nys-fair.test:8001/wp-content/uploads/',
        'https://nysfair.ny.gov/wp-content/uploads/'
      )
    }))
    .sort((a: Event, b: Event) => {
      const dateA = parseDateString(a.dates[0]?.start_time_date)?.getTime() ?? 0;
      const dateB = parseDateString(b.dates[0]?.start_time_date)?.getTime() ?? 0;
      return dateA - dateB;
    });
});


const uniqueDates = computed(() => {
  return [...new Set(musicEvents.value.map(event =>
    parseDateString(event.dates[0]?.start_time_date)?.toDateString()
  ).filter(date => date !== undefined))];
});


const uniqueVenues = computed(() => {
  return [...new Set(musicEvents.value.map(event =>
    event.venue?.name
  ).filter(venue => venue !== undefined))];
});

const uniqueGenres = computed(() => {
    const genres = musicEvents.value.reduce((acc: string[], event: Event) => {
        if (event.genres) {
            event.genres.forEach(genre => {
              if (!acc.includes(genre)) {
                acc.push(genre)
            }
           })
        }
        return acc
    }, []);
    return genres.sort();
});


const filteredEvents = computed(() => {
  return musicEvents.value.filter(event => {
    const dateMatch = !selectedDate.value ||
      parseDateString(event.dates[0]?.start_time_date)?.toDateString() === selectedDate.value;
    const venueMatch = !selectedVenue.value ||
      event.venue?.name === selectedVenue.value;
    const genreMatch = !selectedGenre.value || event.genres?.includes(selectedGenre.value);
    return dateMatch && venueMatch && genreMatch;
  });
});

const selectDate = (date: string) => {
  selectedDate.value = date;
  showDateDropdown.value = false;
};

const selectVenue = (venue: string) => {
  selectedVenue.value = venue;
  showVenueDropdown.value = false;
};

const selectGenre = (genre: string) => {
    selectedGenre.value = genre;
    showGenreDropdown.value = false;
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

const toggleDateDropdown = () => {
    showDateDropdown.value = !showDateDropdown.value;
    showVenueDropdown.value = false;
    showGenreDropdown.value = false;
}

const toggleVenueDropdown = () => {
    showVenueDropdown.value = !showVenueDropdown.value;
    showDateDropdown.value = false;
    showGenreDropdown.value = false;
}

const toggleGenreDropdown = () => {
    showGenreDropdown.value = !showGenreDropdown.value;
    showDateDropdown.value = false;
    showVenueDropdown.value = false;
}


// Parse date string function with more robust checks
const parseDateString = (dateString: string | undefined): Date | undefined => {
    if (!dateString) {
        return undefined
    }
    // Handle unix timestamp if available
    if (dateString.match(/^\d+$/)) {
        return new Date(parseInt(dateString) * 1000);
    }

    // Remove any HTML entities and trim
    const cleanDateString = dateString.replace(/ /g, ' ').trim();

    // Try parsing with built-in Date
    const parsedDate = new Date(cleanDateString);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }

    // Fallback: Manual parsing for "Month DD, YYYY HH:MMam/pm" format
    const regex = /^(\w+)\s+(\d+),\s+(\d{4})\s+(\d+):(\d+)(?:\s*)([AaPp][Mm])?/;
    const match = cleanDateString.match(regex);

    if (match) {
        const [_, month, day, year, hours, minutes, ampm] = match;
        let hour = parseInt(hours);

        // Adjust hours for PM
        if (ampm && ampm.toLowerCase() === 'pm' && hour < 12) {
            hour += 12;
        }
        // Adjust for AM 12
        if (ampm && ampm.toLowerCase() === 'am' && hour === 12) {
            hour = 0;
        }

        return new Date(
            parseInt(year),
            new Date(Date.parse(month + " 1, 2024")).getMonth(),
            parseInt(day),
            hour,
            parseInt(minutes)
        );
    }

    // If all parsing fails, return current date
    console.warn(`Unable to parse date string: ${dateString}`);
    return undefined;
};

// Format date function with improved error handling
const formatEventDate = (event: Event): string => {
    const dateString = event.dates?.[0]?.start_time_date;
    const timeString = event.dates?.[0]?.start_time_time;

    if (!dateString || !timeString) {
        console.error(`Unable to parse date for formatting: ${dateString}`);
        return "";
    }
    const combinedDateString = `${dateString} ${timeString}`
    const parsedDate = parseDateString(combinedDateString);

    if (!parsedDate) {
        console.error(`Unable to parse date for formatting: ${dateString}`);
        return "";
    }

    try {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(parsedDate);
    } catch (error) {
        console.error(`Error formatting date: ${combinedDateString}`, error);
        return combinedDateString; // Return original string if formatting fails
    }
};

// Get venue information
const venueInfo = computed(() => {
  const venues = data.value?.nysfairWebsite?.venues;
  return (event: Event) => {
    return venues?.find((venue: Venue) => venue.slug === event.venue?.slug);
  };
});
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
    justify-content: space-between;
}

.filter-dropdown {
    width: 100%;
    position: relative;
    display: inline-block;

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
        text-align: left; // Keep text aligned left for dropdown buttons
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


  .dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
    max-height: 200px;
    overflow-y: auto;

        div {
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #EFF2F6;

            &:hover {
              background-color: #f0f0f0;
            }
        }
    }
}


.events-list {
  padding: 20px;
  padding-top: 0px;
  max-height: 50vh;
  overflow: scroll;
}

.backup {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;

  p {
    color: rgba(0, 0, 0, 0.82);
  }
}

.event-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0px;
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