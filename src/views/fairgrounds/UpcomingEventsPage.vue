<template>
  <Fairgrounds
    title="Upcoming Events"
    :showMenuButton="true"
  >
      <div class="main" id="events">
        <div class="wrapper">
          <div class="main__header">
            <div class="main__header-toggles">
              <div class="filter">
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
          <div v-if="!isSearching" ref="dateScrollRef" class="date-scroll">
            <div
              v-for="(date, index) in dates"
              :key="date.toISOString()"
              :ref="el => { if (isSameMonth(date, selectedDate)) currentMonthRef = el as HTMLElement }"
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

        <!-- Calendar View -->
        <div v-if="viewMode === 'calendar'" class="calendar-view">
          <div class="calendar-header">
            <h2>{{ format(selectedDate, 'MMMM yyyy') }}</h2>
            <div class="calendar-nav">
              <button @click="navigateMonth(-1)">‹</button>
              <button @click="navigateMonth(1)">›</button>
            </div>
          </div>

          <div class="calendar-grid">
            <div class="calendar-weekdays">
              <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']"
                   :key="day"
                   class="weekday">
                {{ day }}
              </div>
            </div>

            <div v-if="calendarDays" class="calendar-days">
              <div v-for="day in calendarDays"
                  :key="day ? day.toISOString() : ''"
                   class="day"
                   :class="{
                    'has-events': day && hasEvents(day),
                    'active': day && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                   }"
                  @click="day && handleDateSelect(day)">
                <span class="date">{{ day ? format(day, 'd') : '' }}</span>
                <div v-if="day && hasEvents(day)" class="event-indicator"></div>
              </div>
            </div>
          </div>

          <!-- Events for selected day-->
          <div v-if="getEventsForDate(selectedDate).length > 0" class="day-events">
            <div v-for="event in getEventsForDate(selectedDate)"
                 :key="`${event.id}-${event.currentDate.date}`"
                 class="day-event">
                  <router-link class="cta" :to="`/fairgrounds/upcoming-events/${encodeURIComponent(event.id)}?date=${encodeURIComponent(event.currentDate.date)}`">
                  <div class="event-card__image">
                    <img :src="getEventImage(event) || '/api/placeholder/400/200'" alt="Event image" />
                  </div>
                  <div class="event-card__content">
                    <div class="event-card__meta">
                      <div class="event-card__date">
                        {{ format(parseISO(event.currentDate.date), 'EEE, MMM d, yyyy') }}
                      </div>
                      <span class="event-card__separator">•</span>
                      <div class="event-card__time">{{ getEventTime(event) }}</div>
                    </div>
                    <h3 class="event-card__title">{{ event.title }}</h3>
                  </div>
                </router-link>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="events-list">
          <div
            v-for="event in filteredEvents"
            :key="`${event.id}-${event.currentDate.date}`"
            class="event-card"
          >
              <router-link class="cta" :to="`/fairgrounds/upcoming-events/${encodeURIComponent(event.id)}?date=${encodeURIComponent(event.currentDate.date)}`">
              <div class="event-card__image">
                <img :src="getEventImage(event) || '/api/placeholder/400/200'" alt="Event image" />
              </div>
              <div class="event-card__content">
                <div class="event-card__meta">
                  <div class="event-card__date">
                    {{ format(parseISO(event.currentDate.date), 'EEE, MMM d, yyyy') }}
                  </div>
                  <span class="event-card__separator">•</span>
                  <div class="event-card__time">{{ getEventTime(event) }}</div>
                </div>
                <h2 class="event-card__title">{{ event.title }}</h2>
              </div>
            </router-link>
          </div>
        </div>

        <FGKeepInTouch />

        <SocialIcons type="fairgrounds" :social-data="dataStore.data.nysfairWebsite.social" />

      </div>
    </Fairgrounds>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useDataStore } from '@/stores/data';
import { listOutline } from 'ionicons/icons';
import { format, isSameMonth, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay } from 'date-fns';
import Fairgrounds from '@/layouts/fairgrounds.vue';

interface EventDate {
  date: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
}

interface EventImage {
  filename: string;
  title: string;
  url: string;
}

interface Event {
  id: string;
  title: string;
  eventDates: EventDate[];
  eventImage: EventImage[];
  eventBody: string;
  eventAdmission: string;
  uri: string;
  enabled: boolean;
}

interface EventWithCurrentDate extends Event {
  currentDate: EventDate;
}

// Test Events for now
const testEvents = [
  {
    id: '2345',
    title: 'Winter Festival 2024',
    enabled: true,
    eventDates: [{
      date: '2024-12-15T04:00:00+00:00',
      startTime: '2024-12-15T14:00:00+00:00',
      endTime: '2024-12-15T22:00:00+00:00'
    }],
    eventAdmission: '$10',
    eventImage: [{
      url: '/modal-img/News_NYSF.jpg',
      title: 'Winter Festival',
      filename: 'winter-fest.jpg'
    }]
  },
  {
    id: '1234',
    title: 'Holiday Market',
    enabled: true,
    eventDates: [{
      date: '2024-12-10T04:00:00+00:00',
      startTime: '2024-12-10T10:00:00+00:00',
      endTime: '2024-12-10T17:00:00+00:00'
    }],
    eventAdmission: 'Free',
    eventImage: [{
      url: '/modal-img/News_NYSF.jpg',
      title: 'Holiday Market',
      filename: 'holiday-market.jpg'
    }]
  },
  {
    id: '4443',
    title: 'New Year Concert',
    enabled: true,
    eventDates: [{
      date: '2024-12-31T04:00:00+00:00',
      startTime: '2024-12-31T20:00:00+00:00',
      endTime: '2025-01-01T01:00:00+00:00'
    }],
    eventAdmission: '$25',
    eventImage: [{
      url: '/modal-img/News_NYSF.jpg',
      title: 'New Year Concert',
      filename: 'nye-concert.jpg'
    }]
  }
];

// Store and Data
const dataStore = useDataStore();

// State
const selectedDate = ref(new Date());
const searchQuery = ref('');
const viewMode = ref<'list' | 'calendar'>('list');
const dateScrollRef = ref<HTMLElement | null>(null);
const currentMonthRef = ref<HTMLElement | null>(null);

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

onMounted(async () => {
  // Use a slight delay to ensure everything is rendered and measured
  setTimeout(scrollToSelectedMonth, 100);
});

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

// Generate next 12 months for the date scroll
const dates = computed(() => {
  const months: Date[] = [];
  const currentDate = new Date();

  // Add past 12 months
  for (let i = -12; i < 0; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    months.push(date);
  }

  // Add current month
  months.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));

  // Add future 12 months
  for (let i = 1; i <= 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    months.push(date);
  }

  return months;
});

// Update events computed property to combine real and test data
const combinedEvents = computed(() => {
  const historicalEvents = dataStore.data.nysfairgroundsWebsite.events;
  return [...historicalEvents, ...testEvents];
});

// Update existing events computed reference to use combinedEvents
const events = combinedEvents;

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

const filteredEvents = computed(() => {
  return events.value.flatMap((event: Event): EventWithCurrentDate[] => {
    if (!event.enabled) return [];
    if (!event.eventDates || event.eventDates.length === 0) return [];

    // If there's a search query, return event once if it matches
    if (searchQuery.value) {
      if (event.title.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return [{...event, currentDate: event.eventDates[0]}];
      }
      return [];
    }

    // Otherwise return event multiple times, once for each date in the selected month
    return event.eventDates.map(date => {
      const eventDate = parseISO(date.date);
      if (isSameMonth(eventDate, selectedDate.value) &&
          eventDate.getFullYear() === selectedDate.value.getFullYear()) {
        return {...event, currentDate: date};
      }
      return null;
    }).filter((event): event is EventWithCurrentDate => event !== null);
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

const eventsByDate = computed(() => {
  const eventMap = new Map<string, Event[]>();

  events.value.forEach(event => {
    if (event.eventDates?.[0]) {
      const dateKey = format(parseISO(event.eventDates[0].date), 'yyyy-MM-dd');
      if (!eventMap.has(dateKey)) {
        eventMap.set(dateKey, []);
      }
      eventMap.get(dateKey)?.push(event);
    }
  });

  return eventMap;
});

// Handlers
const handleDateSelect = (date: Date) => {
  selectedDate.value = date;
  // The watch on selectedDate will handle the scrolling
};

const hasEvents = (date: Date): boolean => {
  if (!date) return false;

  return events.value.some((event: Event) => {
    if (!event.enabled || !event.eventDates) return false;
    return event.eventDates.some((eventDate: EventDate) => {
      const parsedDate = parseISO(eventDate.date);
      return isSameDay(parsedDate, date);
    });
  });
};

const getEventsForDate = (date: Date): EventWithCurrentDate[] => {
  if (!date) return [];

  return events.value.flatMap((event: Event): EventWithCurrentDate[] => {
    if (!event.enabled || !event.eventDates) return [];

    const matchingDates = event.eventDates.filter((eventDate: EventDate) => {
      const parsedDate = parseISO(eventDate.date);
      return isSameDay(parsedDate, date);
    });

    return matchingDates.map((matchedDate: EventDate): EventWithCurrentDate => ({
      ...event,
      currentDate: matchedDate
    }));
  });
};

const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'calendar' : 'list';
};

const navigateMonth = (direction: number) => {
  const newDate = direction > 0
    ? addMonths(selectedDate.value, 1)
    : subMonths(selectedDate.value, 1);

  // Check if the new date is within bounds
  const currentDate = new Date();
  const minDate = subMonths(currentDate, 12);
  const maxDate = addMonths(currentDate, 12);

  if (newDate >= minDate && newDate <= maxDate) {
    selectedDate.value = newDate;
  }
};

const getEventTime = (event: EventWithCurrentDate): string => {
  const startTime = event.currentDate.startTime || '';
  const endTime = event.currentDate.endTime || '';
  if (startTime && endTime) {
    return `${format(parseISO(startTime), 'h:mm aaa')} - ${format(parseISO(endTime), 'h:mm aaa')}`;
  }
  return startTime ? format(parseISO(startTime), 'h:mm aaa') : '';
};

const getEventImage = (event: Event): string => {
  if (event.eventImage && event.eventImage.length > 0 && event.eventImage[0].url) {
    // Return the full URL directly
    return event.eventImage[0].url;
  }
  return '/api/placeholder/400/200';
};
</script>

<style lang="scss" scoped>

.main {
  padding-bottom: 70px;
  background-color: #19262D;

  .wrapper {
    background-color: #EBEDEF;
    padding-top: 20px;
  }

    &__header {
      display: flex;
      flex-direction: column;

      &-title {
        padding: 30px;
        color: #343434;
        font-size: 24px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        line-height: 28px;
        letter-spacing: 0.5px;
      }

      &-toggles {
        padding: 0 30px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;

        .filter {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          display: flex;
          gap: 5px;
        }
      }

      &-search {
        padding: 0 30px;
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
    padding: 20px 30px;
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
  .cta {
    text-decoration: none;
  }

  .events-list {
    padding: 20px;
    padding-bottom: 5px;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    background-color: #FFF;
  }
  .event-card {
      display: flex;
      flex-direction: column;
      margin-bottom: 30px;

      &__image {
          background-color: #EFF2F6;
          border-radius: 24px;
          height: 25vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          overflow: hidden;

          img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }
      }

      &__meta {
        display: flex;
        gap: 8px;
        align-items: center;

      }

      &__date {
        font-size: 12px;
        color: #343434;
        font-weight: 600;
        font-family: 'inter', sans-serif;
        line-height: 24px;
      }

      &__content {
          display: flex;
          flex-direction: column;
      }

      &__time {
        font-family: 'inter', sans-serif;
          font-size: 12px;
          color: #343434;
          font-weight: 600;
          line-height: 24px;
      }

      &__title {
          font-size: 22px;
          font-weight: 700;
          font-family: 'inter', sans-serif;
          color: #343434;
          margin: 0px;
          line-height: 28px;
      }

      &__location {
          font-size: 16px;
          color: #343434;
          font-weight: 600;
          line-height: 24px;
          letter-spacing: 0.5px;
          margin: 0px;
      }
  }

  .search-results-header {
    padding: 20px 30px;
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

        .day {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 10px;
          cursor: pointer;
          background-color: #F5F7FA;

          &.active {
            background-color: #3B71CA;
            color: white;
            margin: 0px !important;
          }

          &.has-events {
            color: white;
            background-color: #19262D;
            margin: 7px;

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
            margin: 0px !important;
            transition: all 0.2s ease-in-out;

            .event-indicator {
              display: block;
            }
          }

          .date {
            font-size: 16px;
            font-weight: 500;
          }
        }
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

</style>
