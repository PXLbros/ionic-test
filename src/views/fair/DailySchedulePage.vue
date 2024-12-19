<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-back-button default-href="/fair"></ion-back-button>
                    </ion-buttons>
                    <ion-title>Schedule</ion-title>
                </ion-toolbar>
            </ion-header>

            <div class="main">
                <!-- Previous header content remains the same -->
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

                <!-- Date selector remains the same -->
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

                <!-- Schedule content with modified favorite button -->
                <div class="schedule-content">
                    <div class="section-title" @click="toggleSection">
                        <h2>Grounds Entertainment</h2>
                        <ion-icon
                            :icon="isSectionOpen ? chevronUp : chevronDown"
                            class="section-icon"
                            :class="{ 'section-icon--open': isSectionOpen }"
                        ></ion-icon>
                    </div>

                    <div class="events-list" v-show="isSectionOpen">
                        <div v-for="event in filteredEvents" :key="event.id" class="event-item">
                            <div class="content">
                                <h3>{{ event.title || "Event Title" }}</h3>
                                <p>{{ event.start_time || "Event Start Time" }}</p>
                            </div>
                                
                            <div class="favorite">
                                <button 
                                    class="favorite-button"
                                    :class="{ 'is-favorite': event.isFavorite }"
                                    @click="event.isFavorite ? removeEventFromFavorites(event) : addEventToFavorites(event)"
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
import { ref, computed } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon } from '@ionic/vue';
import { chevronDown, chevronUp, heart, heartOutline } from 'ionicons/icons';
import { useDataStore } from '@/stores/data';
import { Preferences } from '@capacitor/preferences';

const dataStore = useDataStore();
const eventsData: Event[] = dataStore.data.nysfairWebsite.events ?? [];

console.log('events data', eventsData);

// Types for the event data
interface Venue {
    name: string;
    description: string;
}

interface Event {
    id: number;
    title: string;
    description: string;
    permalink: string;
    start_time: string;
    start_time_unix: number;
    duration: number;
    created_at: string;
    featured_image: string;
    venue: Venue;
    isFavorite?: boolean;
    isAddingToFavorites? : boolean;
    isRemovingFromFavorites? : boolean;
}

interface DateObject {
    dayName: string;
    day: number;
    // fullDate: Date;
    timestamp: number;
}

const selectedDateIndex = ref(0);
const isSectionOpen = ref(true);

const convertToEastern = (unixTimestamp: number): Date => {
    const date = new Date(unixTimestamp * 1000);
    return new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
};

const dates = computed<DateObject[]>(() => {
    if (!eventsData || !eventsData.length) return [];

    // Sort events by start_time_unix
    const sortedEvents = [...eventsData].sort((a, b) => a.start_time_unix - b.start_time_unix);

    // Extract unique dates
    const uniqueDates = [...new Set(sortedEvents.map(event => {
        const date = convertToEastern(event.start_time_unix);
        return date.toDateString(); // Unique date string
    }))];

    // Create date objects
    return uniqueDates.map((dateStr, index) => {
        const matchingEvent = sortedEvents.find(event => {
            const eventDate = convertToEastern(event.start_time_unix).toDateString();
            return eventDate === dateStr;
        });

        return {
            dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            day: index + 1,
            // fullDate: matchingEvent ? convertToEastern(matchingEvent.start_time_unix) : new Date(dateStr),
            timestamp: matchingEvent ? matchingEvent.start_time_unix : 0
        };
    });
});

// Update the filteredEvents computed property
const filteredEvents = computed(() => {
    if (!dates.value.length) return [];

    const selectedDate = dates.value[selectedDateIndex.value];

    return eventsData
        .filter(event => {
            const eventDate = convertToEastern(event.start_time_unix);
            const selectedDateTime = convertToEastern(selectedDate.timestamp);
            return eventDate.toDateString() === selectedDateTime.toDateString();
        })
        .sort((a, b) => a.start_time_unix - b.start_time_unix) // Sort by timestamp ascending
        .map(event => ({
            ...event,
            start_time: convertToEastern(event.start_time_unix).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            })
        }));
});

const selectDate = (index: number): void => {
    selectedDateIndex.value = index;
};

const toggleSection = (): void => {
    isSectionOpen.value = !isSectionOpen.value;
};

const addEventToFavorites = async (event: Event): Promise<void> => {
  if (event.isFavorite === true) {
    console.warn('Event is already a favorite');
    return;
  }

  // Update the reactive array
  const eventIndex = eventsData.findIndex(eventsDataEvent => eventsDataEvent.id === event.id);

  if (eventIndex === -1) {
    console.warn('Event not found in data');
    return;
  }

  // set isAddingToFavorites to true
  eventsData[eventIndex].isAddingToFavorites = true;

  try {
    // Sleep for a bit to simulate loading
    await new Promise(resolve => setTimeout(resolve, 250));

    // Get current favorites
    let { value: favoriteNYSFairEventIds } = await Preferences.get({ key: 'favoriteNYSFairEvents' });

    if (!favoriteNYSFairEventIds) {
      favoriteNYSFairEventIds = '[]';
    }

    // Parse the favorites as an array of strings
    const favoriteIdsArray: number[] = JSON.parse(favoriteNYSFairEventIds);

    // Add the event ID to the favorites if it's not already included
    if (!favoriteIdsArray.includes(event.id)) {
      favoriteIdsArray.push(event.id);
    }

    // Save the updated favorites back to preferences
    await Preferences.set({
      key: 'favoriteNYSFairEvents',
      value: JSON.stringify(favoriteIdsArray)
    });

    eventsData[eventIndex].isFavorite = true;
  } finally {
    // Reset loading state regardless of success or failure
    eventsData[eventIndex].isAddingToFavorites = false;
  }
};

const removeEventFromFavorites = async (event: Event): Promise<void> => {
  if (event.isFavorite !== true) {
    console.warn('Event is not a favorite');
    return;
  }

  const eventIndexInData = eventsData.findIndex(eventsDataEvent => eventsDataEvent.id === event.id);

  if (eventIndexInData === -1) {
    console.warn('Event not found in data');
    return;
  }

  eventsData[eventIndexInData].isRemovingFromFavorites = true;

  try {
    // Sleep for a bit to simulate loading
    await new Promise(resolve => setTimeout(resolve, 250));

    // Get current favorites
    let { value: favoriteNYSFairEventIds } = await Preferences.get({ key: 'favoriteNYSFairEvents' });

    if (!favoriteNYSFairEventIds) {
      favoriteNYSFairEventIds = '[]';
    }

    // Parse the favorites as an array of strings
    const favoriteIdsArray: number[] = JSON.parse(favoriteNYSFairEventIds);

    // Remove the event ID from the favorites if it's included
    const eventIndex = favoriteIdsArray.findIndex(favoriteId => favoriteId === event.id);

    if (eventIndex !== -1) {
      favoriteIdsArray.splice(eventIndex, 1);
    }

    // Save the updated favorites back to preferences
    await Preferences.set({
      key: 'favoriteNYSFairEvents',
      value: JSON.stringify(favoriteIdsArray)
    });

    // Update the reactive array
    eventsData[eventIndexInData].isFavorite = false;
  } finally {
    // Reset loading state regardless of success or failure
    eventsData[eventIndexInData].isRemovingFromFavorites = false;
  }
};
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
                font-weight: 300;
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
    margin-bottom: 20px;
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

.schedule-content {
    padding: 0 25px;

    .section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #EFF2F6;
        cursor: pointer;

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
