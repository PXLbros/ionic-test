<template>
  <FairgroundsLayout
    title="Upcoming Events"
    :showMenuButton="true"
  >
    <div class="main">
      <div v-if="showFiltersOverlay" class="filters-overlay">
        <div class="wrapper">
          <div class="main__header">
            <div class="main__header-toggles" style="justify-content: space-between;">
              <div class="filter" @click="closeFiltersOverlay()">
                Close
              </div>
              <div class="filter" @click="resetFilters" style="margin-left:auto;">
                Reset
              </div>
            </div>
          </div>

          <div class="filters-overlay__filters">
            <div class="filters-overlay__filter-set">
              <h2>Venue</h2>

              <div class="filters-overlay__filter-set-options">
                <div
                  v-for="venue in formattedVenues"
                  :key="venue.id"
                  class="filters-overlay__filter-set-option"
                >
                  <label :for="`venue-${venue.id}`">
                    {{ venue.title }}
                  </label>

                  <input
                    type="radio"
                    :id="`venue-${venue.id}`"
                    :name="`venue`"
                    :value="venue.id"
                    v-model="selectedFilterVenueId"
                  />
                </div>
              </div>
            </div>

            <div class="filters-overlay__filter-set">
              <h2>Event Types</h2>

              <div class="filters-overlay__filter-set-options">
                <div
                  v-for="eventType in formattedEventTypes"
                  :key="eventType.id"
                  class="filters-overlay__filter-set-option"
                >
                  <label :for="`eventType-${eventType.id}`">
                    {{ eventType.title }}
                  </label>

                  <!-- input checkbox -->
                  <input
                    type="checkbox"
                    :id="`eventType-${eventType.id}`"
                    :name="`eventType`"
                    :value="eventType.id"
                    v-model="selectedFilterEventTypeIds"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="filters-overlay__actions">
            <button
              class="filters-overlay__apply-button"
              @click="applyFilters"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <template v-if="monthsWithUpcomingEvents?.length > 0">
        <div class="wrapper">
          <div class="main__header">
            <div class="main__header-toggles">
              <div class="filter" @click="openFiltersOverlay()">
                <span>
                  <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.1441 10.7915H18.1461C17.9558 10.0783 17.5363 9.44756 16.9523 8.99658C16.3683 8.5456 15.6523 8.29945 14.9146 8.29611C14.1774 8.30005 13.462 8.54648 12.8786 8.99741C12.2951 9.44834 11.8761 10.0788 11.6859 10.7915H0.861355C0.748601 10.7912 0.636879 10.813 0.532569 10.8559C0.428259 10.8987 0.333402 10.9617 0.253418 11.0413C0.173433 11.1208 0.109889 11.2153 0.0664069 11.3194C0.0229249 11.4235 0.000359663 11.5352 0 11.6481C0.000726013 11.8747 0.0912149 12.0919 0.251643 12.2519C0.412071 12.412 0.629352 12.5018 0.855868 12.5018H11.6887C11.8778 13.2149 12.2961 13.8458 12.8791 14.2973C13.4621 14.7488 14.1774 14.9957 14.9146 15C15.6522 14.9959 16.3678 14.7491 16.9513 14.2976C17.5348 13.8461 17.9537 13.2151 18.1433 12.5018H23.1441C23.2569 12.5022 23.3685 12.4802 23.4727 12.4371C23.5769 12.394 23.6715 12.3307 23.7511 12.2508C23.8307 12.1709 23.8937 12.076 23.9364 11.9716C23.9791 11.8672 24.0007 11.7554 24 11.6426C24.0003 11.5301 23.9781 11.4188 23.9348 11.3151C23.8915 11.2113 23.8278 11.1173 23.7476 11.0386C23.5871 10.8795 23.3701 10.7907 23.1441 10.7915Z" fill="#333333"/>
                    <path d="M0.861355 4.18098H2.57035C2.75701 4.88585 3.17026 5.50966 3.74633 5.95618C4.3224 6.4027 5.02928 6.64711 5.75791 6.6517C6.47728 6.64684 7.17564 6.40841 7.74799 5.97227C8.32034 5.53612 8.73575 4.92583 8.93176 4.23314L23.1441 4.18922C23.2569 4.18958 23.3685 4.16759 23.4727 4.1245C23.5769 4.08141 23.6715 4.01809 23.7511 3.93819C23.8307 3.85829 23.8937 3.7634 23.9364 3.65901C23.9791 3.55461 24.0007 3.44277 24 3.32996C24.0003 3.21753 23.9781 3.10618 23.9348 3.00246C23.8915 2.89874 23.8278 2.80474 23.7476 2.72601C23.6686 2.64624 23.5746 2.58288 23.471 2.53954C23.3675 2.4962 23.2564 2.47374 23.1441 2.47344L8.95645 2.51737C8.7735 1.80633 8.36049 1.17591 7.78187 0.724489C7.20325 0.273064 6.49158 0.026031 5.75791 0.0219421C5.03274 0.026587 4.32903 0.268777 3.7544 0.711483C3.17976 1.15419 2.76581 1.77305 2.57584 2.47344H0.861355C0.748601 2.47308 0.636879 2.49495 0.532569 2.5378C0.428259 2.58065 0.333402 2.64364 0.253418 2.72317C0.173433 2.80271 0.109889 2.89723 0.0664069 3.00134C0.0229249 3.10545 0.000359663 3.21712 0 3.32996C0.000356495 3.44254 0.0229583 3.55394 0.0665073 3.65775C0.110056 3.76156 0.173691 3.85572 0.253748 3.93482C0.333806 4.01391 0.428705 4.07638 0.532984 4.11863C0.637262 4.16088 0.748861 4.18207 0.861355 4.18098Z" fill="#333333"/>
                  </svg>
                </span>
                Filters
              </div>
              <div class="calendar" @click="toggleView">
                <svg v-if="viewMode !== 'calendar'" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28.6449 28.4545H24.1159V23.9091H28.6449V28.4545ZM21.8514 17.0909H17.3225V21.6364H21.8514V17.0909ZM28.6449 17.0909H24.1159V21.6364H28.6449V17.0909ZM15.058 23.9091H10.529V28.4545H15.058V23.9091ZM33.1739 8V33H6V8H33.1739ZM30.9094 14.8182H8.26449V30.7273H30.9094V14.8182ZM21.8514 23.9091H17.3225V28.4545H21.8514V23.9091ZM15.058 17.0909H10.529V21.6364H15.058V17.0909Z" fill="#343434"/>
                </svg>
                <ion-icon v-else :icon="listOutline" size="large" class="search-icon"></ion-icon>
              </div>
            </div>

            <div class="main__header-search">
              <div class="search-container">
                <input
                  class="input"
                  type="text"
                  placeholder="Search Events"
                  v-model="searchQuery"
                >
                <div class="search-icon">
                  <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.8324 10.7477C20.2106 7.0841 14.3382 7.0841 10.7164 10.7477C7.09454 14.4113 7.09454 20.3503 10.7164 24.015C13.9412 27.2769 18.9515 27.6338 22.5669 25.0866L27.8772 30.4582C28.5914 31.1806 29.7501 31.1806 30.4643 30.4582C31.1786 29.7357 31.1786 28.5636 30.4643 27.8412L25.1001 22.4151C27.3852 18.7864 26.9623 13.9169 23.8303 10.7488L23.8324 10.7477ZM21.7124 21.8694C19.2612 24.3489 15.2876 24.3478 12.8375 21.8694C10.3862 19.3899 10.3862 15.3706 12.8375 12.8921C15.2887 10.4127 19.2622 10.4137 21.7124 12.8921C24.1625 15.3706 24.1636 19.3899 21.7124 21.8694Z" fill="#343434"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Scrollable Dates only for List View -->
          <div v-if="!isSearching && viewMode !== 'calendar'" ref="dateScrollRef" class="date-scroll">
            <div
              v-for="date in monthsWithUpcomingEvents"
              :key="date.toISOString()"
              :ref="(el: HTMLElement) => { if (isSameMonth(date, selectedDate)) currentMonthRef = el }"
              class="date-item"
              :class="{ 'date-item--active': isSameMonth(date, selectedDate) }"
              @click="handleDateSelect(date)"
            >
              <div class="date-item__year">{{ format(date, 'yyyy') }}</div>
              <div class="date-item__month">{{ format(date, 'MMM') }}</div>
            </div>
          </div>
        </div>

        <!-- Search results heading when searching -->
        <div v-if="isSearching" class="search-results-header">
          <h2 class="search-results-title">
            Search Results {{ filteredEvents.length ? `(${filteredEvents.length})` : '' }}
          </h2>
          <button
            class="clear-search-btn"
            @click="clearSearch"
          >
            Clear Search
          </button>
        </div>

        <div v-show="showMyFavoritesContainer" class="my-favorites">
          <router-link
            :to="{ name: 'fairgrounds-event-favorites' }"
            class="my-favorites__link"
          >
            <HeartIcon color="#000" />
            My Favorites
          </router-link>
        </div>

        <!-- Calendar View -->
        <div v-if="viewMode === 'calendar'" class="calendar-view">
          <div class="calendar-header">
            <h2>{{ format(selectedDate, 'MMMM yyyy') }}</h2>
            <div class="calendar-nav">
              <button
                @click="navigateMonth(-1)"
                :class="{ 'hidden': !canNavigateToPrevMonth }"
              >
                ‹
              </button>
              <button
                @click="navigateMonth(1)"
                :class="{ 'hidden': !canNavigateToNextMonth }"
              >
                ›
              </button>
            </div>
          </div>

          <div class="calendar-grid">
            <div class="calendar-weekdays">
              <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']" :key="day" class="weekday">
                {{ day }}
              </div>
            </div>

            <div v-if="formattedCalendarDays" class="calendar-days">
              <div
                v-for="(day, dayIndex) in formattedCalendarDays"
                :key="`day-${dayIndex}`"
                class="day"
                :class="{
                  'has-events': day.hasEvents,
                  'active': day.isActive
                }"
                @click="day.date && handleDateSelect(day.date)"
              >
                <span class="date">{{ day.date ? format(day.date, 'd') : '' }}</span>

                <div v-if="day.hasEvents" class="event-indicator"></div>
              </div>
            </div>
          </div>

          <!-- Events for selected day -->
          <div v-if="eventsForSelectedDate.length > 0" class="day-events">
            <FairgroundsEventCard
              v-for="event in eventsForSelectedDate"
              :key="`${event.id}-${event.currentDate.date}`"
              :event="event"
            />
          </div>

          <p v-else class="calendar-grid__no-events">
            No events on {{ format(selectedDate, 'MMMM d') }}.
          </p>
        </div>

        <!-- List View -->
        <div v-else class="events-list">
          <FairgroundsEventCard
            v-if="filteredEvents.length > 0"
            v-for="event in filteredEvents"
            :key="`${event.id}-${event.currentDate.date}`"
            :event="event"
          />

          <p v-else class="events-list__no-events">
            No upcoming events in {{ format(selectedDate, 'MMMM') }}.
          </p>
        </div>
      </template>

      <div v-else class="no-events">
        No upcoming events.
      </div>

      <FairgroundsKeepInTouchForm />

      <SocialIcons
        type="fairgrounds"
        :social-data="dataStore.data.nysfairWebsite.social"
      />
    </div>
  </FairgroundsLayout>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { useDataStore } from '@/stores/data';
import { listOutline } from 'ionicons/icons';
import { format, isSameMonth, parseISO, addMonths, subMonths, isSameDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import FairgroundsLayout from '@/layouts/fairgrounds.vue';
import appConfig from '@/config/app';
import FairgroundsKeepInTouchForm from '@/components/FairgroundsKeepInTouchForm.vue';
import HeartIcon from '@/components/Icons/HeartIcon.vue';
import { FairgroundsEvent as FairgroundsEvent, FairgroundsEventDate } from '@/types';

interface EventWithCurrentDate extends FairgroundsEvent {
  currentDate: FairgroundsEventDate;
}

// Store and Data
const dataStore = useDataStore();

// State
const searchQuery = ref('');
const viewMode = ref<'list' | 'calendar'>('list');
const dateScrollRef = ref<HTMLElement | null>(null);
const currentMonthRef = ref<HTMLElement | null>(null);
const showMyFavoritesContainer = ref(true);

const showFiltersOverlay = ref(false);
const selectedFilterVenueId = ref<string | null>(null);
const selectedFilterEventTypeIds = ref<string[]>([]);

// State for applied filters
const appliedFilterVenueId = ref<string | null>(null);
const appliedFilterEventTypeIds = ref<string[]>([]);

const scrollToSelectedMonth = async () => {
  await nextTick();

  const scrollContainer = dateScrollRef.value;
  const currentElement = currentMonthRef.value;

  if (scrollContainer && currentElement) {
    const containerWidth = scrollContainer.offsetWidth;
    const elementLeft = currentElement.offsetLeft;
    const elementWidth = currentElement.offsetWidth;

    const scrollPosition = Math.max(0, elementLeft - (containerWidth / 2) + (elementWidth / 2));

    scrollContainer.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }
};

// Generate next 12 months for the date scroll
const monthsWithUpcomingEvents = computed(() => {
  const monthsSet = new Set<string>();

  events.value.forEach((event: FairgroundsEvent) => {
    event.dates?.forEach((dateObj: any) => {
      if (dateObj.is_upcoming) {
        const date = new Date(dateObj.date);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        monthsSet.add(monthStart.toISOString()); // Use ISO to ensure uniqueness
      }
    });
  });

  console.log('monthsSet', monthsSet);

  // Convert back to Date[] and sort
  return Array.from(monthsSet)
    .map(iso => new Date(iso))
    .sort((a, b) => a.getTime() - b.getTime());
});

// Update existing events computed reference to use combinedEvents
const events = computed(() => dataStore.data.nysfairgroundsWebsite.events || []);

const today = toZonedTime(new Date(), appConfig.timezone);

const findNextAvailableDate = (): Date => {
  const sortedDates = events.value
    .flatMap((event: FairgroundsEvent) => event.dates || [])
    .filter((date: FairgroundsEventDate) => date.is_upcoming)
    .map((date: FairgroundsEventDate) => toZonedTime(parseISO(date.date), appConfig.timezone))
    .sort((a, b) => a.getTime() - b.getTime());

  return sortedDates.find(date => date >= today) || today;
};

const selectedDate = ref<Date>(findNextAvailableDate());

// Switching from Calendar to List will center the selected date value
watch(viewMode, async (newMode) => {
  if (newMode === 'list') {
    await scrollToSelectedMonth();
  }
});

watch(selectedDate, async () => {
  if (viewMode.value === 'list') {
    await scrollToSelectedMonth();
  }
});

// Update calendar computations to handle the full date properly
const calendarDays = computed(() => {
  const start = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1);
  const end = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() + 1, 0);

  const firstDayOfMonth = start.getDay();
  const days = [];

  // Add padding for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= end.getDate(); day++) {
    days.push(new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), day));
  }

  return days;
});

const formattedCalendarDays = computed(() => {
  return calendarDays.value.map((day) => {
    if (!day) {
      return { date: null, hasEvents: false, isActive: false };
    }

    const hasEventsForDay = hasEvents(day);
    const isActiveDay = format(day, 'yyyy-MM-dd') === format(selectedDate.value, 'yyyy-MM-dd');

    return {
      date: day,
      hasEvents: hasEventsForDay,
      isActive: isActiveDay,
    };
  });
});

const applyFilters = () => {
  appliedFilterVenueId.value = selectedFilterVenueId.value;
  appliedFilterEventTypeIds.value = [...selectedFilterEventTypeIds.value];

  closeFiltersOverlay();
};

const filteredEvents = computed(() => {
  return events.value.flatMap((event: FairgroundsEvent): EventWithCurrentDate[] => {
    if (!event.enabled || !event.dates || event.dates.length === 0) return [];

    // Filter by search query
    if (searchQuery.value) {
      if (event.title.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        const upcomingDates = event.dates.filter((date: FairgroundsEventDate) => date.is_upcoming);
        return upcomingDates.length > 0 ? [{ ...event, currentDate: upcomingDates[0] }] : [];
      }
      return [];
    }

    // Filter by applied venue
    if (appliedFilterVenueId.value) {
      const venueIds = event.eventVenues?.map(venue => venue.id) || [];
      if (!venueIds.includes(appliedFilterVenueId.value)) return [];
    }

    // Filter by applied event types
    if (appliedFilterEventTypeIds.value.length > 0) {
      const eventTypeIds = event.eventTypes?.map(type => type.id) || [];
      if (!appliedFilterEventTypeIds.value.some(id => eventTypeIds.includes(id))) return [];
    }

    // Filter by upcoming dates in the selected month
    return event.dates
      .filter(date => date.is_upcoming)
      .map(date => {
        const eventDate = toZonedTime(parseISO(date.date), appConfig.timezone);
        const selectedZoned = toZonedTime(selectedDate.value, appConfig.timezone);

        if (isSameMonth(eventDate, selectedZoned) && eventDate.getFullYear() === selectedZoned.getFullYear()) {
          return { ...event, currentDate: date };
        }
        return null;
      })
      .filter((event): event is EventWithCurrentDate => event !== null);
  });
});

const isSearching = computed(() => {
  return searchQuery.value.length > 0;
});

const clearSearch = () => {
  searchQuery.value = '';
};

watch(isSearching, async (newValue, oldValue) => {
  // Only trigger scroll when switching from searching to not searching
  if (!newValue && oldValue) {
    // Wait for the next tick to ensure the date scroll is rendered
    await nextTick();
    // Add a small delay to ensure smooth transition
    setTimeout(scrollToSelectedMonth, 100);
  }
});

// Handlers
const handleDateSelect = (date: Date) => {
  selectedDate.value = date;
  // The watch on selectedDate will handle the scrolling
};

const hasEvents = (date: Date): boolean => {
  if (!date) {
    return false;
  }

  // Convert the input date to New York time
  const zonedDate = toZonedTime(date, appConfig.timezone);

  return events.value.some((event: FairgroundsEvent) => {
    if (!event.enabled || !event.dates) {
      return false;
    }

    return event.dates.some((eventDate: FairgroundsEventDate) => {
      const parsedDate = parseISO(eventDate.date);
      const zonedEventDate = toZonedTime(parsedDate, appConfig.timezone);

      return isSameDay(zonedEventDate, zonedDate) &&
        (isSameDay(zonedEventDate, new Date()) || eventDate.is_upcoming);
    });
  });
};

const eventsForSelectedDate = computed(() => {
  if (!selectedDate.value) return [];

  const zonedDate = toZonedTime(selectedDate.value, appConfig.timezone);

  return events.value.flatMap((event: FairgroundsEvent): EventWithCurrentDate[] => {
    if (!event.enabled || !event.dates) {
      return [];
    }

    const matchingDates = event.dates.filter((eventDate: FairgroundsEventDate) => {
      const parsedDate = parseISO(eventDate.date);
      const zonedEventDate = toZonedTime(parsedDate, appConfig.timezone);

      return isSameDay(zonedEventDate, zonedDate);
    });

    return matchingDates.map((matchedDate: FairgroundsEventDate): EventWithCurrentDate => ({
      ...event,
      currentDate: matchedDate
    }));
  });
});

const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'calendar' : 'list';

  if (viewMode.value === 'calendar') {
    showMyFavoritesContainer.value = false;
  } else {
    showMyFavoritesContainer.value = true;
  }
};

const firstMonthWithEvents = computed(() => {
  if (!monthsWithUpcomingEvents.value.length) return null;
  return monthsWithUpcomingEvents.value[0];
});

const lastMonthWithEvents = computed(() => {
  if (!monthsWithUpcomingEvents.value.length) return null;
  return monthsWithUpcomingEvents.value[monthsWithUpcomingEvents.value.length - 1];
});

const canNavigateToPrevMonth = computed(() => {
  if (!firstMonthWithEvents.value) return false;

  const currentMonthStart = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1);
  const firstEventMonthStart = new Date(firstMonthWithEvents.value.getFullYear(), firstMonthWithEvents.value.getMonth(), 1);

  return currentMonthStart > firstEventMonthStart;
});

const canNavigateToNextMonth = computed(() => {
  if (!lastMonthWithEvents.value) return false;

  const currentMonthStart = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1);
  const lastEventMonthStart = new Date(lastMonthWithEvents.value.getFullYear(), lastMonthWithEvents.value.getMonth(), 1);

  return currentMonthStart < lastEventMonthStart;
});

const navigateMonth = (direction: number) => {
  const newDate = direction > 0
    ? addMonths(selectedDate.value, 1)
    : subMonths(selectedDate.value, 1);

  // Check if the new date is within the range of months with events
  if (direction < 0 && canNavigateToPrevMonth.value) {
    selectedDate.value = newDate;
  } else if (direction > 0 && canNavigateToNextMonth.value) {
    selectedDate.value = newDate;
  }
};

const openFiltersOverlay = () => {
  showFiltersOverlay.value = true;
};

const closeFiltersOverlay = () => {
  showFiltersOverlay.value = false;
};

const resetFilters = () => {
  selectedFilterVenueId.value = null;
  selectedFilterEventTypeIds.value = [];

  // appliedFilterVenueId.value = null;
  // appliedFilterEventTypeIds.value = [];
  // closeFiltersOverlay();
};

const formattedVenues = computed(() => {
  if (!dataStore.data.nysfairgroundsWebsite.venues) {
    return [];
  }

  return dataStore.data.nysfairgroundsWebsite.venues;
});

const formattedEventTypes = computed(() => {
  if (!dataStore.data.nysfairgroundsWebsite.eventTypes) {
    return [];
  }

  return dataStore.data.nysfairgroundsWebsite.eventTypes;
});

onMounted(async () => {
  // Use a slight delay to ensure everything is rendered and measured
  setTimeout(scrollToSelectedMonth, 100);
});
</script>

<style lang="scss" scoped>
$horizontal-padding: 30px;

.main {
  padding-bottom: v-bind('appConfig.bottomBar.height');
  background-color: #19262D;

  .wrapper {
    background-color: #EBEDEF;
    // padding-top: 20px;
    padding-top: calc(var(--ion-safe-area-top, 0px) + 15px);
  }

    &__header {
      display: flex;
      flex-direction: column;

      &-title {
        padding: 30px $horizontal-padding;
        color: #343434;
        font-size: 24px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        line-height: 28px;
        letter-spacing: 0.5px;
      }

      &-toggles {
        padding: 0 $horizontal-padding;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        height: v-bind('appConfig.toolbar.height');

        .filter {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          display: flex;
          gap: 5px;
        }

        .filter,
        .calendar {
          cursor: pointer;
        }
      }

      &-search {
        padding: 0 $horizontal-padding 20px;
        margin-top: 10px;

        .search-container {
          position: relative;
          width: 100%;

          input {
            width: 100%;
            padding: 20px 55px 20px 27px;
            border: 1px solid #E3EBF0;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            background-color: #FAFDFF;
          }

          .search-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
          }
        }
      }
    }
  }

  .date-scroll {
    display: flex;
    overflow-x: auto;
    padding: 0 $horizontal-padding 20px;
    gap: 10px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .date-item {
    min-width: 100px;
    padding: 12px 25px;
    background-color: #F5F7FA;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &--active {
      background-color: #3B71CA;
      color: #F1F1F1;
    }

    &__year {
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 0.5px;
      font-weight: 600;
      opacity: 0.8;
    }

    &__month {
      font-size: 24px;
      line-height: 24px;
      letter-spacing: 0.5px;
      font-weight: 700;

    }
  }

  .my-favorites {
    background-color: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    font-weight: bold;

    &__link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #000;

      svg {
        margin-right: 8px;
      }
    }
  }

  .events-list {
    padding: 20px;
    padding-bottom: 5px;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    background-color: #FFF;

    &__no-events {
      text-align: center;
      margin: 10px 0 20px;
      color: #343434;
    }
  }

  .search-results-header {
    padding: 20px $horizontal-padding;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EFF2F6;

    .search-results-title {
      font-size: 18px;
      font-weight: 600;
      color: #343434;
      margin: 0;
    }

    .clear-search-btn {
      padding: 8px 16px;
      background-color: #F5F7FA;
      border: none;
      border-radius: 20px;
      color: #3B71CA;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #E3EBF0;
      }
    }
  }

  .calendar-view {
    padding: 20px;
    padding-bottom: 30px;
    background-color: #EBEDEF;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      background-color: #F5F7FA;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      padding: 20px;

      h2 {
        font-size: 21px;
        font-weight: 700;
        margin: 0;
        color: #343434;
        font-family: 'inter', sans-serif;
      }

      .calendar-nav {
        display: flex;
        gap: 10px;

        button {
          background: none;
          border: none;
          font-size: 24px;
          color: #3B71CA;
          cursor: pointer;
          padding: 8px;
          transition: opacity 0.3s ease;

          &.hidden {
            opacity: 0.3;
            pointer-events: none;
          }
        }
      }
    }

    .calendar-grid {
      .calendar-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        background-color: #F5F7FA;

        .weekday {
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          padding: 8px 0;
        }
      }

      .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
        background-color: #F5F7FA;
        border-bottom-right-radius: 12px;
        border-bottom-left-radius: 12px;
        padding-bottom: 8px;

        .day {
          // aspect-ratio: 1;
          padding: 6px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 10px;
          cursor: pointer;
          background-color: #F5F7FA;
          margin: 7px;

          // &.active {
          //   background-color: #3B71CA;
          //   color: white;
          //   margin: 0px !important;
          // }

          &.has-events {
            color: white;
            background-color: #19262D;
            // margin: 7px;

            .event-indicator {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #3B71CA;
              position: absolute;
              bottom: 4px;
              display: none;

            }
          }

          // has both active and events
          &.active.has-events {
            background-color: #3B71CA;
            color: white;
            // margin: 0px !important;
            transition: all 0.2s ease-in-out;

            .event-indicator {
              display: block;
            }
          }

          .date {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }

      &__no-events {
        text-align: center;
        margin: 25px 0 0;
        color: #343434;
      }
    }

    .day-events {
      margin-top: 20px;

      .day-event {
        border-bottom: 1px solid #EFF2F6;

        &-link {
          padding: 15px;
          display: block;
          text-decoration: none;
          color: #343434;

          .event-time {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
            font-weight: 600;
          }

          .event-title {
            font-size: 16px;
            font-weight: 500;
          }
        }

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

.no-events {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #343434;
  background-color: #fff;
  height: 80px
}

.filters-overlay {
  position: fixed;
  top: v-bind('appConfig.toolbar.height');
  left: 0;
  right: 0;
  bottom: 0;
  height: auto;
  background-color: #fff;
  z-index: 99999;

  .wrapper {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: calc(v-bind('appConfig.bottomBar.height') + 10rem);
  }

  &__filters {
    padding: 0 $horizontal-padding;
  }

  &__filter-set {
    &:not(:first-child) {
      margin-top: 55px;
    }

    h2 {
      font-family: 'inter', sans-serif;
      font-weight: 700;
      font-size: 24px;
      margin-bottom: 30px;
    }
  }

  &__filter-set-option {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    label {
      color: #343434;
      width: 280px;
      font-family: 'inter', sans-serif;
      font-weight: 500;
      font-size: 16px;
      // line-height: 16px;
    }
  }

  &__filter-set-option {
    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    input[type="radio"] {
      appearance: none;
      width: 20px;
      height: 20px;
      border: 1px solid #1b262d;
      border-radius: 50%;
      position: relative;
      margin-left: 10px;
      cursor: pointer;
    }

    input[type="radio"]:checked {
      border-color: #0077C8;
    }

    input[type="radio"]::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #0077C8;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    input[type="radio"]:checked::before {
      opacity: 1;
    }

    input[type="checkbox"] {
      appearance: none;
      width: 20px;
      height: 20px;
      border: 1px solid #1b262d;
      // border-radius: 4px;
      position: relative;
      margin-left: 10px;
      cursor: pointer;
    }

    input[type="checkbox"]:checked {
      border-color: #0077C8;
    }

    input[type="checkbox"]::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      width: 10px;
      height: 10px;
      background-color: #0077C8;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    input[type="checkbox"]:checked::before {
      opacity: 1;
    }
  }

  &__actions {
    position: absolute;
    bottom: v-bind('appConfig.bottomBar.height');
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.75);
    padding: 30px 40px;
    z-index: 1;
  }

  &__apply-button {
    background: #0077C8;
    border-radius: 4px;
    color: #fff;
    width: 100%;
    padding: 24px 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
}
</style>
