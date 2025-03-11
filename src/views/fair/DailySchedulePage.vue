<template>
  <DefaultLayout title="Schedule" :showMenuButton="true">
    <div class="main">
      <div class="main__header">
        <div class="main__header-img">
          <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
              <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
          </svg>
        </div>
        <div class="main__header-content">
          <h2 class="title">Daily Schedule</h2>
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
          <select v-model="selectedCategory" class="category-select">
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>

       <div class="wrapper">
        <div class="favorites-link">
          <router-link :to="{ name: 'event-favorites' }">View All Favorites</router-link>
        </div>

        <div class="loader-container" v-if="isLoading || isDateChanging">
          <div class="spinner"></div>
          <p>Loading Schedule...</p>
        </div>

        <div v-else class="schedule-content">
          <EventsList
            :events="filteredEvents"
            :categories="categories"
            noEventsText="No events scheduled for this day"
            />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/default.vue';
import EventsList from '@/components/EventsList.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { Category, DateObject, Event } from '@/types';
import { convertToEasternTime } from '@/utils/time';
import { formatEvent, FormattedEvent } from '@/utils/event';
import { ref, computed, watch } from 'vue';

const dataStore = useDataStore();
const { data, isLoading } = storeToRefs(dataStore);
const eventsData = computed(() => data.value?.nysfairWebsite?.events ?? []);
const categoriesData = computed(() => data.value?.nysfairWebsite?.event_categories ?? []);

const findCurrentDayIndex = (dates: DateObject[]): number => {
  if (!dates.length) return 0;

  const now = Date.now();
  const today = convertToEasternTime(now).toDateString();

  // Find today's index
  const todayIndex = dates.findIndex(date => {
    const dateStr = convertToEasternTime(date.timestamp).toDateString();
    return dateStr === today;
  });

  if (todayIndex >= 0) return todayIndex;

  // If today not found, find next upcoming day
  const upcomingIndex = dates.findIndex(date => date.timestamp > now);
  if (upcomingIndex >= 0) return upcomingIndex;

  // If no upcoming days, default to first day
  return 0;
};

const selectedDateIndex = ref(0);
const isDateChanging = ref(false);
const selectedCategory = ref<string | number>('all');

const dates = computed<DateObject[]>(() => {
  if (!eventsData.value || !eventsData.value.length) return [];

  const allDates = eventsData.value.flatMap((event: Event) =>
    event.dates.map(date => ({
      timestamp: date.start_time_unix,
      originalDate: date.start_time_date,
    }))
  );

  const sortedDates = [...allDates].sort((a, b) => a.timestamp - b.timestamp);
  const uniqueDates = [...new Set(sortedDates.map(date =>
    convertToEasternTime(date.timestamp).toDateString()
  ))];

  return uniqueDates.map((dateStr, index) => {
    const matchingDate = sortedDates.find(date =>
      convertToEasternTime(date.timestamp).toDateString() === dateStr
    );

    return {
      dayName: new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      day: index + 1,
      timestamp: matchingDate ? matchingDate.timestamp : 0,
    };
  });
});

const categories = computed<Category[]>(() => {
  return categoriesData.value || [];
});

const filteredEvents = computed((): FormattedEvent[] => {
  if (!eventsData.value || !eventsData.value.length || !dates.value.length) return [];

  const selectedDate = dates.value[selectedDateIndex.value];
  if (!selectedDate) return [];

  const selectedDateUnix = selectedDate.timestamp;

  let filtered: FormattedEvent[] = eventsData.value.flatMap((event: Event) => {
    const matchingDates = event.dates.filter(date =>
      convertToEasternTime(date.start_time_unix).toDateString() === convertToEasternTime(selectedDateUnix).toDateString()
    );

    return matchingDates.map(matchingDate => {
      const formattedEvent = formatEvent({
        event,
        eventDate: matchingDate,
        categories: categoriesData.value
      });

      return formattedEvent;
    });
  });

  // Apply category filter
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((event: FormattedEvent) =>
      event.categories.includes(Number(selectedCategory.value))
    );
  }

  // Sort events by start time
  return filtered.sort((a: FormattedEvent, b: FormattedEvent) => {
    const aTime = a.dateDetails.start_time_unix;
    const bTime = b.dateDetails.start_time_unix;
    return aTime - bTime;
  });
});

// Watch for dates to be populated
watch(dates, (newDates) => {
  if (newDates.length && selectedDateIndex.value === 0) {
    // Set initial date index
    selectedDateIndex.value = findCurrentDayIndex(newDates);

    // Scroll to the selected date after a short delay
    setTimeout(() => {
      const container = document.querySelector('.date-selector__container');
      const activeButton = container?.children[selectedDateIndex.value] as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }, 100);
  }
}, { immediate: true });

const selectDate = (index: number): void => {
  isDateChanging.value = true;
  selectedDateIndex.value = index;

  // Add scroll behavior when selecting dates
  setTimeout(() => {
    const container = document.querySelector('.date-selector__container');
    const activeButton = container?.children[index] as HTMLElement;
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
    isDateChanging.value = false;
  }, 0);
};
</script>

<style lang="scss" scoped>
.main {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #FDD456 0%, #E09B1D 100%);
  padding-bottom: 90px;

  &__header {
    padding: 25px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &-img {
      width: 100%;
      height: 25vh;
      background-color: #EFF2F6;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      background: #EFF2F6;
      border: 5px solid #F4E8AB;
    }

    &-content {
      display: flex;
      flex-direction: column;

      .title {
        font-weight: 700;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: #343434;
      }

      .subtitle {
        font-size: 14px;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0.5px;
        font-family: 'Inter', sans-serif;
        color: #343434;
        margin: 0px;
        width: 90%;
      }
    }
  }

  &__content {
    padding: 0 25px;
  }
}
.date-selector {
    padding: 0 20px;
    margin-bottom: 6px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    &__container {
        display: flex;
        gap: 6px;
        padding: 0px 0px 0px 0px;
        min-width: min-content;
    }
}

.date-card {
    background-color: #1F3667;
    width: 32vw;
    height: 9vh;
    padding: 12px 25px;
    border-radius: 15px;
    text-align: center;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    flex: 1;
    min-width: 120px;
    color: #F1F1F1;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &--active {
        background-color: #EE4623;
        color: #F1F1F1;
    }

    &__day {
        font-size: 12px;
        margin-bottom: 1px;
        font-weight: 500;
    }

    &__date {
        font-weight: 400;
        font-size: 28px;
        font-family: 'lalezar', sans-serif;
    }
}


.filter-section {
    padding: 0px 20px 10px 20px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 50px;

    .category-filter {
        width: 100%;

        .category-select {
            width: 100%;
            padding: 13px 10px;
            border-radius: 15px;
            font-size: 16px;
            cursor: pointer;
            background-color: #1F3667;
            color: #F1F1F1;
            transition: border-color 0.3s ease;
            font-family: 'Inter', sans-serif;
            font-weight: 700;
        }
    }
}

.wrapper {
  background-color: #098944;
  padding-top: 20px;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  margin-top: -40px; // This creates the overlap
  position: relative; // Ensures it stays above the content below
  z-index: 1; // Ensures the wrapper stays on top
}

.favorites-link {
  display: flex;
  justify-content: center;
  padding: 0 25px;
  margin-bottom: 5px;
  position: sticky;
  top: 10px;

  a {
    color: #F4E8AB;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.3s ease;
    padding: 5px 10px;
    border-radius: 10px;
    backdrop-filter: blur(5px);
    background-color: #09894588;
    // box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);


    &:hover {
      color: #F4E8AB;
    }
  }
}

.schedule-content {
    padding: 5px 25px 0px 25px;

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
