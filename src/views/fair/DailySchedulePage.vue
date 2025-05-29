<template>
  <FairLayout title="Schedule" :showMenuButton="true">
    <div class="main main--daily-schedule">
      <div class="main__header">
        <div class="main__header-img">
          <img v-if="pageData?.featured_image" :src="pageData.featured_image" alt="" />

          <!-- <PlaceholderIcon v-else /> -->
        </div>

        <div class="main__header-content">
          <h2 class="title">Daily Schedule</h2>

          <div v-if="descriptionHtml" v-html="descriptionHtml" class="main__content-description"></div>
        </div>
      </div>

      <div v-if="dates" class="date-selector">
        <div class="date-selector__container" ref="dateSelectorContainer">
          <button
            v-for="(date, index) in dates"
            :key="index"
            class="date-card"
            :class="{ 'date-card--active': selectedDateIndex === index }"
            @click="selectDate(index)"
          >
            <div class="date-card__day">
              Day {{ date.day }}, {{ date.dayName }}
            </div>

            <div class="date-card__date">
              {{ date.dateOnly }}
            </div>
          </button>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-dropdown">
          <button class="filter-btn" :class="{ 'filter-btn--active': showCategoryDropdown }" @click="toggleCategoryDropdown">
            {{ selectedCategoryName }}
            <span>▼</span>
          </button>
          <div v-if="showCategoryDropdown" class="dropdown-content">
            <div @click="selectCategory('all')">
              All Categories
            </div>

            <div v-for="category in availableCategoriesForSelectedDay" :key="category.id" @click="selectCategory(category.id)">
              {{ category.name }}
            </div>
          </div>
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
          <FairEventsList
            :events="filteredEvents"
            :categories="categories"
            noEventsText="No events scheduled for this day"
          />
        </div>
      </div>
    </div>
  </FairLayout>
</template>

<script setup lang="ts">
import FairLayout from '@/layouts/fair.vue';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { Category, Event, FormattedDateObject } from '@/types';
import { formatEvent, FormattedEvent } from '@/utils/event';
import PlaceholderIcon from '@/components/Icons/PlaceholderIcon.vue';
import appConfig from '@/config/app';
import { isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { sanitizeHtml } from '@/utils/text';

const dataStore = useDataStore();
const { data, isLoading } = storeToRefs(dataStore);
const eventsData = computed(() => data.value?.nysfairWebsite?.events ?? []);
const categoriesData = computed(() => data.value?.nysfairWebsite?.event_categories ?? []);

const selectedDateIndex = ref(-1);
const isDateChanging = ref(false);
const selectedCategory = ref<string | number>('all');
const showCategoryDropdown = ref(false);

// Add ref for date selector container
const dateSelectorContainer = ref<HTMLElement>();

const pageData = dataStore.data.nysfairWebsite.pages['your-visit/daily-schedules'];

const descriptionHtml = computed(() => {
  return pageData?.mobile_app_description ? sanitizeHtml({ html: pageData.mobile_app_description }) : '';
});

const dates = computed<FormattedDateObject[]>(() => {
  if (!eventsData.value?.length) {
    return [];
  }

  const allDates = eventsData.value.flatMap((event: Event) =>
    event.dates.map(date => ({
      timestamp: date.start_time_unix,
      originalDate: date.start_time_date, // e.g. February 11, 2025
    }))
  );

  const sortedDates = [...allDates].sort((a, b) => a.timestamp - b.timestamp);

  // Get unique dates
  const uniqueDates = [
    ...new Set(
      sortedDates.map(date => date.originalDate)
    ),
  ];

  const formattedUniqueDates = uniqueDates.map((dateStr, index) => {
    const matchingDate = sortedDates.find(date => date.originalDate === dateStr);

    const dateObj = new Date(dateStr);

    const formattedDate = {
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }), // e.g. Mon
      dateOnly: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // e.g. Apr 14
      day: index + 1, // Day number starting from 1
      timestamp: matchingDate ? matchingDate.timestamp : 0,
      originalDate: dateStr,
    };

    return formattedDate;
  });

  return formattedUniqueDates;
});

const categories = computed<Category[]>(() => {
  return categoriesData.value || [];
});

const availableCategoriesForSelectedDay = computed<Category[]>(() => {
  // Return all categories instead of filtering by the selected day
  return categories.value || [];
});

const filteredEvents = computed((): FormattedEvent[] => {
  if (!eventsData.value || !eventsData.value.length || !dates.value.length) {
    return [];
  }

  const selectedDate = dates.value[selectedDateIndex.value];

  if (!selectedDate) {
    return [];
  }

  // Get the original date string from the selected date
  const selectedDateStr = selectedDate.originalDate;

  let filtered: FormattedEvent[] = eventsData.value.flatMap((event: Event) => {
    const matchingDates = event.dates.filter(date => {
      // Compare the original date strings directly
      const isMatching = date.start_time_date === selectedDateStr;

      return isMatching;
    });

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
  filtered = filtered.sort((a: FormattedEvent, b: FormattedEvent) => {
    const aTime = a.dateDetails.start_time_unix;
    const bTime = b.dateDetails.start_time_unix;
    return aTime - bTime;
  });

  // If no events match the selected category, return an empty array
  if (filtered.length === 0) {
    return [];
  }

  return filtered;
});

const selectDate = (index: number): void => {
  isDateChanging.value = true;
  selectedDateIndex.value = index;

  showCategoryDropdown.value = false;

  setTimeout(() => {
    if (selectedCategory.value !== 'all') {
      const stillExists = availableCategoriesForSelectedDay.value.some(
        category => category.id === selectedCategory.value
      );

      if (!stillExists) {
        selectedCategory.value = 'all';
      }
    }

    // Add scroll behavior when selecting dates
    const activeButton = dateSelectorContainer.value?.children[index] as HTMLElement;

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

const selectCategory = (categoryId: string | number): void => {
  selectedCategory.value = categoryId;
  showCategoryDropdown.value = false;
};

const toggleCategoryDropdown = (): void => {
  showCategoryDropdown.value = !showCategoryDropdown.value;
};

const selectedCategoryName = computed(() => {
  if (selectedCategory.value === 'all') {
    return 'All Categories';
  }

  const category = categories.value.find(c => c.id === selectedCategory.value);

  if (!category) {
    selectedCategory.value = 'all';

    return 'All Categories';
  }

  return category.name;
});

function scrollToDateSelector(index: number) {
  nextTick(() => {
    requestAnimationFrame(() => {
      const btn = dateSelectorContainer.value?.children[index] as HTMLElement | undefined;

      btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
    });
  });
}

onMounted(async () => {
  const now = new Date();
  const localizedEasternTime = toZonedTime(now, appConfig.timezone);
  const todayStart = startOfDay(localizedEasternTime);

  const firstEventDate = new Date(dates.value[0].originalDate);
  const lastEventDate = new Date(dates.value[dates.value.length - 1].originalDate);

  const firstEventStart = startOfDay(firstEventDate);
  const lastEventStart = startOfDay(lastEventDate);

  let initialIndex = 0;

  if (isBefore(todayStart, firstEventStart) || isSameDay(todayStart, firstEventStart)) {
    // Current date is on or before first event date - show first event
    initialIndex = 0;
  } else if (isAfter(todayStart, lastEventStart) || isSameDay(todayStart, lastEventStart)) {
    // Current date is on or after last event date - show last event
    initialIndex = dates.value.length - 1;
  } else {
    // Current date is between first and last event dates - find matching date
    const todayIndex = dates.value.findIndex(date => {
      const eventDate = startOfDay(new Date(date.originalDate));
      return isSameDay(todayStart, eventDate);
    });

    if (todayIndex >= 0) {
      initialIndex = todayIndex;
    } else {
      // If exact match not found, find the next upcoming date
      const nextIndex = dates.value.findIndex(date => {
        const eventDate = startOfDay(new Date(date.originalDate));
        return isAfter(eventDate, todayStart);
      });

      initialIndex = nextIndex >= 0 ? nextIndex : 0;
    }
  }

  selectedDateIndex.value = initialIndex;

  await nextTick();

  scrollToDateSelector(initialIndex);
});
</script>

<style src="@/theme/sites/fair/pages/daily-schedule.scss" lang="scss" scoped></style>

<style lang="scss" scoped>
.main {
  padding-bottom: v-bind('appConfig.bottomBar.height');
}
</style>

<style lang="scss">
.schedule-content .events-list__no-events p {
  color: #fdd456;
  margin-top: 0;
  font-size: 0.85em;
}
</style>
