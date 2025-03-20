<template>
  <DefaultLayout
    title="Concert"
    :showMenuButton="true"
  >
      <div class="main">
        <div class="main__header">
          <div class="main__header-content">
            <h1 class="main__header-title">Chevrolet Music Series</h1>
            <p class="main__header-subtitle">Aug 21 - Sept 2</p>
          </div>
          <div class="main__header-img">
            <!-- just using the first image for now -->
            <img v-if="filteredEvents[0].featured_image" :src="filteredEvents[0].featured_image" alt="Music Image" />
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
              <path
                d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z"
                fill="#1E5EAE"
              />
            </svg>
          </div>
          <div class="main__header-sponsor">
            <p class="title">Sponsored By</p>
            <img src="/src/imgs/Sponsor_Chevrolet_Black.png" alt="Chevy Logo" />
          </div>
        </div>

        <!-- Filter Section -->
        <div class="wrapper">
          <div class="sticky-wrapper">
            <div class="action-buttons">
              <router-link :to="{ name: 'event-favorites' }" class="favorites-btn">
                <ion-icon class="heart-icon" :icon="heart"></ion-icon>
                My Favorites
              </router-link>
              <button class="reset-btn" @click="clearFilters">
                <ion-icon class="reset-icon" :icon="refreshOutline"></ion-icon>
                Reset Filters
              </button>
            </div>
            <div class="filters">
              <div class="filter-dropdown">
                <button class="filter-btn" :class="{ 'filter-btn--active': showDateDropdown === true }" @click="toggleDateDropdown">
                  {{ selectedDate || 'Date' }}
                  <span>▼</span>
                </button>
                <div v-if="showDateDropdown" class="dropdown-content">
                  <div @click="selectDate('')">All Dates</div>
                  <div v-for="date in uniqueDates" :key="date" @click="selectDate(date || '')">
                    {{ formatDate(date || '') }}
                  </div>
                </div>
              </div>
              <div class="filter-dropdown">
                <button class="filter-btn" :class="{ 'filter-btn--active': showGenreDropdown === true }" @click="toggleGenreDropdown">
                  {{ selectedGenre || 'Genre' }}
                  <span>▼</span>
                </button>
                <div v-if="showGenreDropdown" class="dropdown-content">
                  <div @click="selectGenre('')">All Genres</div>
                  <div :class="{ 'active': selectedGenre !== '' }" v-for="genre in uniqueGenres" :key="genre" @click="selectGenre(genre)">
                    {{ genre }}
                  </div>
                </div>
              </div>
              <div class="filter-dropdown">
                <button class="filter-btn" :class="{ 'filter-btn--active': showVenueDropdown === true }" @click="toggleVenueDropdown">
                  {{ selectedVenue || 'Venue' }}
                  <span>▼</span>
                </button>
                <div v-if="showVenueDropdown" class="dropdown-content">
                  <div @click="selectVenue('')">All Venues</div>
                  <div v-for="venue in uniqueVenues" :key="venue" @click="selectVenue(venue || '')">
                    {{ venue }}
                  </div>
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
          <div class="event-image">
            <img v-if="event.featured_image" :src="event.featured_image" alt="Music Image" />
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 62 62" fill="none">
              <path
                d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z"
                fill="#1E5EAE"
              />
            </svg>
          </div>
            <div class="event-info">
              <div class="venue-name">{{ event?.venue?.name || 'Chevy Court' }}</div>
              <h2 class="event-title">{{ event.title }}</h2>
              <div class="event-date">{{ formatEventDate(event) }}</div>
            </div>
            <FavoriteButton
              :event-id="event.id"
              :date-details="event.currentDate || { start_time_date: '', start_time_time: '', start_time_unix: 0 }"
            />

          </router-link>
        </div>
      </div>
    </div>
  </DefaultLayout>
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
  currentDate?: { // Add this new property
    start_time_date: string;
    start_time_time: string;
    start_time_unix: number;
  };
  venue: {
    name: string;
    slug: string;
  } | undefined;
  featured_image?: string;
  duration?: number;
  genres: number[];
}

interface Venue {
  name: string;
  slug: string;
  description?: string;
  latitude?: string;
  longitude?: string;
}

interface Genre {
  id: number;
  name: string;
  slug: string;
  num_events: number;
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
      event_genres: Genre[];
    };
  };
}

import DefaultLayout from '@/layouts/default.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import { useDataStore } from '@/stores/data';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { refreshOutline, heart, triangle } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';

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
    // Expand events with multiple dates into separate events
    .flatMap((event: Event) => {
      return event.dates.map(date => ({
        ...event,
        currentDate: date, // Add the current date to each expanded event
        featured_image: event.featured_image?.replace(
          'http://nys-fair.test:8001/wp-content/uploads/',
          'https://nysfair.ny.gov/wp-content/uploads/'
        )
      }));
    })
    .sort((a: Event, b: Event) => {
      const dateA = parseDateString(a.currentDate?.start_time_date)?.getTime() ?? 0;
      const dateB = parseDateString(b.currentDate?.start_time_date)?.getTime() ?? 0;
      return dateA - dateB;
    });
});


const uniqueDates = computed(() => {
  return [...new Set(musicEvents.value.map(event =>
    parseDateString(event.currentDate?.start_time_date)?.toDateString()
  ).filter(date => date !== undefined))];
});


const uniqueVenues = computed(() => {
  return [...new Set(musicEvents.value.map(event =>
    event.venue?.name
  ).filter(venue => venue !== undefined))];
});

const genreMap = computed<Record<number, string>>(() => {
  const genreData = data.value?.nysfairWebsite?.event_genres ?? [];
  const map: Record<number, string> = {};
  genreData.forEach((genre: Genre) => {
    map[genre.id] = genre.name;
  });
  return map;
});

const uniqueGenres = computed<string[]>(() => {
  const genres = musicEvents.value.reduce((acc: string[], event) => {
    if (event.genres && Array.isArray(event.genres)) {
      event.genres.forEach(genreId => {
        const genreName = genreMap.value[genreId];
        if (genreName && !acc.includes(genreName)) {
          acc.push(genreName);
        }
      });
    }
    return acc;
  }, []);
  return genres.sort();
});


const filteredEvents = computed(() => {
  return musicEvents.value.filter(event => {
    const dateMatch = !selectedDate.value ||
      parseDateString(event.currentDate?.start_time_date)?.toDateString() === selectedDate.value;
    const venueMatch = !selectedVenue.value ||
      event.venue?.name === selectedVenue.value;
    const genreMatch = !selectedGenre.value ||
      (event.genres && event.genres.some(genreId => genreMap.value[genreId] === selectedGenre.value));
    return dateMatch && venueMatch && genreMatch;
  });
});

const hasActiveFilters = computed(() => {
  return selectedDate.value !== '' ||
         selectedVenue.value !== '' ||
         selectedGenre.value !== '';
});

const clearFilters = () => {
  selectedDate.value = '';
  selectedVenue.value = '';
  selectedGenre.value = '';
  showDateDropdown.value = false;
  showVenueDropdown.value = false;
  showGenreDropdown.value = false;
};

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
    const dateString = event.currentDate?.start_time_date;
    const timeString = event.currentDate?.start_time_time;

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
        return combinedDateString;
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
  padding-bottom: 90px;

  &__header {
    display: flex;
    gap: 10px;
    padding: 10px 20px 40px 20px;
    flex-direction: column;
    background: #FDD456;
    position: relative;

    &-title {
      font-size: 32px;
      font-family: 'lalezar', sans-serif;
      font-weight: 400;
      text-transform: uppercase;
      color: #2A2A2A;
      line-height: 24px;
      letter-spacing: 0.5px;
      text-align: center;
      max-width: 70%;
      margin: 0 auto;
      padding: 10px 0px 0px 0px;
    }

    &-subtitle {
      color: #2A2A2A;
      text-align: center;
      font-family: 'lalezar', sans-serif;
      font-size: 22px;
      margin: 0 auto;
      font-style: normal;
      font-weight: 400;
      line-height: 30px; /* 136.364% */
      letter-spacing: 0.5px;
    }

    &-img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 22vh;
      border-radius: 10px;
      border: 5px solid #F4E8AB;
      background-color: #EFF2F6;
      overflow: hidden;
      margin: 0 auto;
      max-width: 302px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-sponsor {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;

      .title {
        color: #2A2A2A;
        text-align: center;
        font-family: 'inter', sans-serif;
        font-size: 12px;
        font-style: normal;
        font-weight: 900;
        line-height: 24px; /* 200% */
        letter-spacing: 0.5px;
        margin: 0 auto;
        position: absolute;
        text-transform: uppercase;
        top: 4px;
      }


      img {
        margin-top: 8px;
        width: 100%;
        max-width: 100px;
        height: auto;
      }
    }
  }
}

// START OF THE FILTERS SECTION AND EVENT LIST
.wrapper {
  background-color: rgba(9, 137, 69, 1.0);
  backdrop-filter: blur(30px);
  padding-top: 10px;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  margin-top: -40px; // This creates the overlap
  position: relative; // Ensures it stays above the content below
  z-index: 1; // Ensures the wrapper stays on top

  .sticky-wrapper {
    position: sticky;
    top: 0px;
    backdrop-filter: blur(30px);
    background-color: rgb(9, 137, 68, 1.0);
    margin: 5px;
    border-radius: 10px;
    z-index: 100;
    box-shadow: 1px 22px 15px 1px rgb(9, 137, 68, 1.0);
  }
}

// Clear Filters and Go to Favorites buttons
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0px;
  padding: 10px 20px 0px 20px;

  .favorites-btn, .reset-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #F4E8AB;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    padding: 8px 10px;
    border: none;
    background: none;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }

  .heart-icon {
    font-size: 20px;
  }

  .reset-icon {
    font-size: 18px;
  }
}

.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding: 10px 20px 20px 20px;
    justify-content: space-between;
    position: relative;
}


.filter-dropdown {
    width: 100%;
    position: relative;
    display: flex;
    flex-basis: 49%;

    // last child make full width
    &:last-child {
        flex-basis: 100%;
    }

    .filter-btn {
        background-color: #1F3667;
        border: none;
        padding: 15px 20px;
        border-radius: 12px;
        font-size: 16px;
        cursor: pointer;
        font-weight: 700;
        width: 100%;
        color: #F1F1F1;
        text-align: left; // Keep text aligned left for dropdown buttons
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: transform 0.3s ease;


        // active then make the span svg element rotate 180 degrees
        &.filter-btn--active {
            span {
                transform: rotate(180deg);
                transition: transform 0.3s ease;
            }
        }

        span {
          transform: rotate(0deg);
          transition: transform 0.3s ease;
          color: #F4E8AB;
        }
    }


  .dropdown-content {
    position: absolute;
    top: 110%;
    left: 0;
    width: 100%;
    background-color: #F4E8AB;
    border-radius: 12px;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
    z-index: 10;
    max-height: 30vh;
    overflow-y: auto;
    padding: 10px;

        div {
            padding: 10px;
            cursor: pointer;

            &:hover {
              background-color: #f3e59c;
            }
        }
    }
}


.events-list {
  padding: 20px;
  padding-top: 0px;
  // max-height: 45vh;
  // overflow: scroll;
  background-color: #098944;
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
  // align-items: center;
  padding: 20px 0px;
  // border-bottom: 1px solid #EFF2F6;
  gap: 15px; // Increased gap for better spacing
  text-decoration: none;
  color: #FFF;
}

.event-info {
  flex: 1; // This will allow the info to take up remaining space
  min-width: 0; // This prevents flex child from overflowing

  .venue-name {
    font-size: 12px;
    color: #FFF;
    margin-bottom: 4px;
    font-weight: 600;
    font-family: 'inter', sans-serif;
  }

  .event-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0px 0;
    // Add text truncation for long titles
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: 'lalezar', sans-serif;
  }

  .event-date {
    font-size: 16px;
    color: #FFF;
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
