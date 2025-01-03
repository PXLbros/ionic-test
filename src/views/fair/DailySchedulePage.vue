<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/fair"></ion-back-button>
                </ion-buttons>
                <ion-title>Schedule</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">

            <div class="main">
                <div class="main__header">
                    <div class="main__header-img">
                        <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                            <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                        </svg>
                    </div>
                    <div class="main__header-content">
                        <h1 class="title">Daily Schedule</h1>
                        <p class="subtitle">Class ridiculus rhoncus ad suspendisse ridiculus malesuada; litora morbi</p>
                    </div>
                </div>



                <div v-if="dates" class="date-selector">
                    <div class="date-selector__container">
                        <button
                        v-for="(date, index) in dates"
                        :key="index"
                        class="date-card"
                        :class="{ 'date-card--active': selectedDateIndex === index }"
                        @click="selectDate(index)"
                        >
                        <div class="date-card__day">{{ date.dayName || "Date Name" }}</div>
                        <div class="date-card__date">Day {{ date.day || "Date Day" }}</div>
                    </button>
                </div>
            </div>
            <div class="filter-section">
                   <div class="category-filter">
                        <select class="category-select"  v-model="selectedCategory" @change="onCategoryChange">
                            <option value="all">All Categories</option>
                           <option v-for="category in categories" :key="category.id" :value="category.id">
                             {{ category.name }}
                           </option>
                        </select>
                   </div>
            </div>

                <div class="loader-container" v-if="isLoading || isDateChanging">
                      <div class="spinner"></div>
                      <p>Loading Schedule...</p>
                </div>

                <div v-else class="schedule-content">
                     <div v-if="filteredEvents.length === 0" class="no-events">
                        <p>No events scheduled for this day</p>
                     </div>
                    <div v-else class="events-list">
                        <div v-for="event in filteredEvents" :key="event.id" class="event-item">
                            <div class="content">
                                <h3>{{ event.title || "Event Title" }}</h3>
                                <p>{{ event.start_time || "Event Start Time" }} </p>
                                <p>{{ event.venue.name || "Event Venue N/A" }}</p>
                                <p v-if="event.categories.length > 0">
                                    Categories: {{ event.categories.map(catId => getCategoryName(catId)).join(', ') }}
                                </p>
                            </div>

                            <div class="favorite">
                              <button
                                class="favorite-button"
                                :class="{ 'is-favorite': event.isFavorite }"
                                @click="toggleFavorite(event)"
                                :disabled="event.isAddingToFavorites || event.isRemovingFromFavorites"
                              >
                                <ion-icon
                                  :icon="event.isFavorite ? heart : heartOutline"
                                  :class="{ 'loading': event.isAddingToFavorites || event.isRemovingFromFavorites }"
                                ></ion-icon>
                              </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon } from '@ionic/vue';
import { heart, heartOutline } from 'ionicons/icons';
import { useDataStore } from '@/stores/data';
import { Preferences } from '@capacitor/preferences';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { data, isLoading } = storeToRefs(dataStore);
const eventsData = computed(() => data.value?.nysfairWebsite?.events ?? []);
const categoriesData = computed(() => data.value?.nysfairWebsite?.eventCategories ?? []);

// Types for the event data
interface Venue {
    name: string;
    description: string;
}

interface EventDate {
  start_time_date: string;
  start_time_unix: number;
  isFavorite?: boolean;
  isAddingToFavorites?: boolean;
  isRemovingFromFavorites?: boolean;
}

interface Event {
    id: number;
    title: string;
    description: string;
    permalink: string;
    categories: number[];
     start_time: string;
    dates: EventDate[];
    duration: number;
    created_at: string;
    featured_image: string;
    venue: Venue;
    isFavorite?: boolean;
    isAddingToFavorites?: boolean;
    isRemovingFromFavorites?: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface DateObject {
    dayName: string;
    day: number;
    timestamp: number;
}

const selectedDateIndex = ref(0);
const isDateChanging = ref(false);
const selectedCategory = ref<string | number>('all');

const convertToEastern = (unixTimestamp: number): Date => {
    const date = new Date(unixTimestamp * 1000);
    return new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
};

const dates = computed<DateObject[]>(() => {
    if (!eventsData.value || !eventsData.value.length) return [];

    const allDates = eventsData.value.flatMap((event: Event) =>
        event.dates.map(date => ({
            timestamp: date.start_time_unix,
            originalDate: date.start_time_date
        }))
    );

    const sortedDates = [...allDates].sort((a, b) => a.timestamp - b.timestamp);
    const uniqueDates = [...new Set(sortedDates.map(date =>
        convertToEastern(date.timestamp).toDateString()
    ))];

    return uniqueDates.map((dateStr, index) => {
        const matchingDate = sortedDates.find(date =>
            convertToEastern(date.timestamp).toDateString() === dateStr
        );

        return {
            dayName: new Date(dateStr).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }),
            day: index + 1,
            timestamp: matchingDate ? matchingDate.timestamp : 0
        };
    });
});

const categories = computed<Category[]>(() => {
    return categoriesData.value || [];
});


const filteredEvents = computed((): Event[] => {
  if (!eventsData.value || !eventsData.value.length || !dates.value.length) return [];

  const selectedDate = dates.value[selectedDateIndex.value];
  if (!selectedDate) return [];

  const selectedDateUnix = selectedDate.timestamp;

  let filtered = [...eventsData.value] // Make a shallow copy to ensure reactivity
    .filter((event: Event) =>
      event.dates.some(date =>
        convertToEastern(date.start_time_unix).toDateString() === convertToEastern(selectedDateUnix).toDateString()
      )
    )
    .map((event: Event) => {
      const matchingDate = event.dates.find(date =>
        convertToEastern(date.start_time_unix).toDateString() === convertToEastern(selectedDateUnix).toDateString()
      );

      return {
        ...event,
        start_time: matchingDate
          ? convertToEastern(matchingDate.start_time_unix).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })
          : 'Time TBD',
        isFavorite: matchingDate ? matchingDate.isFavorite : false,
        isAddingToFavorites: matchingDate ? matchingDate.isAddingToFavorites : false,
        isRemovingFromFavorites: matchingDate ? matchingDate.isRemovingFromFavorites : false,
      };
    });

  // Apply category filter
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(event => event.categories.includes(Number(selectedCategory.value)));
  }

  // Sort events
  return filtered.sort((a: any, b: any) => {
    const aDate = a.dates[0].start_time_unix;
    const bDate = b.dates[0].start_time_unix;
    return aDate - bDate;
  });
});



const onCategoryChange = () => {

}


const getCategoryName = (categoryId: number) => {
   const category = categories.value.find(cat => cat.id === categoryId)
   return category ? category.name : 'Unknown Category'
}

const selectDate = (index: number): void => {
    isDateChanging.value = true;

     setTimeout(() => {
            selectedDateIndex.value = index;
            isDateChanging.value = false;
     }, 0)

};


const toggleFavorite = async (event: Event): Promise<void> => {
  const selectedDate = dates.value[selectedDateIndex.value];

  if (!selectedDate) {
    console.warn('No selected date available');

    return;
  }

  const selectedDateUnix = selectedDate.timestamp;
  const matchingDate = event.dates.find(date => date.start_time_unix === selectedDateUnix);

  if (!matchingDate) {
    console.warn('No matching date found for the selected date');
    return;
  }

  if (matchingDate.isFavorite) {
    await removeEventFromFavorites(event, selectedDateUnix);
  } else {
    await addEventToFavorites(event, selectedDateUnix);
  }
};

const saveUserEventFavorite = async ({ eventId, startTimeUnix, deviceId, isFavorite }: { eventId: number; startTimeUnix: number; deviceId: string; isFavorite: boolean }): Promise<void> => {
  console.log('saveUserEventFavorite', { eventId, startTimeUnix, deviceId, isFavorite });
};

const addEventToFavorites = async (event: Event, selectedStartTimeUnix: number): Promise<void> => {
  const matchingDate = event.dates.find(date => date.start_time_unix === selectedStartTimeUnix);

  if (!matchingDate) {
    console.warn('No matching date found for the selected start time.');
    return;
  }

  const isNativePlatform = Capacitor.isNativePlatform();

  if (isNativePlatform) {
    const permissions = await PushNotifications.requestPermissions();

    if (permissions.receive !== 'granted') {
      console.error('Push notification permissions not granted');
      return;
    }
  }

  matchingDate.isAddingToFavorites = true; // Set loading state

  try {
    const { value: favoriteNYSFairEventIds } = await Preferences.get({ key: 'favoriteNYSFairEvents' });

    const favoriteIdsArray: { id: number; start_time_unix: number }[] = JSON.parse(favoriteNYSFairEventIds || '[]');

    if (!favoriteIdsArray.some(favoritedEvent => favoritedEvent.id === event.id && favoritedEvent.start_time_unix === selectedStartTimeUnix)) {
      favoriteIdsArray.push({ id: event.id, start_time_unix: selectedStartTimeUnix });
    }

    await Preferences.set({
      key: 'favoriteNYSFairEvents',
      value: JSON.stringify(favoriteIdsArray),
    });

    const saveUserEventFavoriteData = {
      eventId: event.id,
      startTimeUnix: selectedStartTimeUnix,
      isFavorite: true,
    };

    // Send to API
    if (isNativePlatform) {
      // Fetch the token
      PushNotifications.addListener('registration', async (token) => {
        console.log('Device token:', token.value);

        saveUserEventFavoriteData.deviceId = token.value;

        // Send the event ID and token to the backend
        await saveUserEventFavorite(saveUserEventFavoriteData);
      });

      // Trigger registration if not already done
      PushNotifications.register();
    } else {
      saveUserEventFavoriteData.deviceId = 'web';

      await saveUserEventFavorite(saveUserEventFavoriteData);
    }

    matchingDate.isFavorite = true;
  } finally {
    matchingDate.isAddingToFavorites = false;
  }
};

const removeEventFromFavorites = async (event: Event, selectedStartTimeUnix: number): Promise<void> => {
  const matchingDate = event.dates.find(date => date.start_time_unix === selectedStartTimeUnix);
  if (!matchingDate) {
    console.warn('No matching date found for the selected start time.');
    return;
  }

  matchingDate.isRemovingFromFavorites = true;

  try {
    const { value: favoriteNYSFairEventIds } = await Preferences.get({ key: 'favoriteNYSFairEvents' });

    const favoriteIdsArray: { id: number; start_time_unix: number }[] = JSON.parse(favoriteNYSFairEventIds || '[]');

    const index = favoriteIdsArray.findIndex(favoritedEvent => favoritedEvent.id === event.id && favoritedEvent.start_time_unix === selectedStartTimeUnix);
    if (index !== -1) {
      favoriteIdsArray.splice(index, 1);
    }

    await Preferences.set({
      key: 'favoriteNYSFairEvents',
      value: JSON.stringify(favoriteIdsArray),
    });

    matchingDate.isFavorite = false;
  } finally {
    matchingDate.isRemovingFromFavorites = false;
  }
};

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.main {
    font-family: "Inter", sans-serif;

    &__header {
        padding: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;

        &-img {
            width: 100%;
            height: 20vh;
            background-color: #EFF2F6;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 24px;
        }

        &-content {
            display: flex;
            flex-direction: column;

            .title {
                font-size: 24px;
                font-weight: 700;
                line-height: 28px;
                letter-spacing: 0.5px;
                color: #343434;
            }

            .subtitle {
                font-size: 16px;
                font-weight: 500;
                line-height: 28px;
                letter-spacing: 0.5px;
                color: #343434;
                margin: 0px;
                width: 90%;
            }
        }
    }
}

.date-selector {
    padding: 0 25px;
    margin-bottom: 5px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    &__container {
        display: flex;
        gap: 10px;
        padding: 0px 0px 10px 0px;
        min-width: min-content;
    }
}

.date-card {
    background-color: #F5F7FA;
    padding: 15px 20px;
    border-radius: 12px;
    text-align: center;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    min-width: 120px;
    color: #1E5EAE;
    white-space: nowrap;

    &--active {
        background-color: #1E5EAE;
        color: white;
    }

    &__day {
        font-size: 14px;
        margin-bottom: 5px;
        font-weight: 500;
    }

    &__date {
        font-weight: 600;
        font-size: 24px;
        font-weight: 700;
    }
}


.filter-section {
    padding: 0px 25px 10px 25px;
    display: flex;
    justify-content: flex-end;
    width: 100%;

    .category-filter {
        width: 100%;

        .category-select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            background-color: white;
            color: #333;
            transition: border-color 0.3s ease;
        }
    }
}

.schedule-content {
    padding: 0 25px;

    .category-section {
        margin-bottom: 20px;
    }

    .section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 10px;
        border-radius: 5px;
        border-bottom: 1px solid #EFF2F6;
        cursor: pointer;
        background-color: #F5F7FA;


        h2 {
            font-size: 18px;
            margin: 0;
        }
    }

    .section-icon {
        transition: transform 0.3s ease;

        &--open {
            transform: rotate(180deg);
        }
    }

    .events-list {
        .event-item {
            padding: 15px 0;
            border-bottom: 1px solid #EFF2F6;
            display: flex;
            justify-content: space-between;
            gap: 20px;

            h3 {
                font-size: 16px;
                margin: 0 0 5px 0;
            }

            p {
                font-size: 14px;
                color: #666;
                margin: 0;
                font-weight: 500;
            }
             p:last-child {
                margin-top: 2px;
            }

            .favorite {
                margin-top: 10px;
            }
        }
    }
}

.favorite {

    .favorite-button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;

        &:active {
            transform: scale(0.95);
        }

        &.is-favorite {
            ion-icon {
                color: #e31b23;
                fill: #e31b23;
            }
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        ion-icon {
            font-size: 24px;
            color: #666;
            transition: all 0.3s ease;
        }

        .loading {
            animation: pulse 1s infinite;
        }
    }
}

.loader-container {
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     padding: 20px;
     min-height: 200px;

     p {
         margin-top: 10px;
     }
}

.no-events {
    display: flex;
    justify-content: center;
    align-items: center;
     min-height: 200px;
     font-size: 18px;
    color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #1E5EAE;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

// hide the scrollbar
.date-selector::-webkit-scrollbar {
    display: none;
}
</style>
