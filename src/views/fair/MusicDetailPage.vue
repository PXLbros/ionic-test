<template>
  <FairLayout title="Music" :showMenuButton="false">
    <div v-if="event" class="main">
      <div class="main__image">
        <img v-if="event.featured_image" :src="event.featured_image" alt="">

        <PlaceholderIcon v-else />
      </div>

      <div class="main__content">
        <div class="group">
          <div class="main__venue">{{ event.venue?.name }}</div>
          <h1 class="main__title">{{ event.title }}</h1>
          <div class="main__date" v-if="event.dates && event.dates.length > 0">{{ formatEventDate(event.dates) }} ({{event.duration}} min)</div>
          <div class="main__price" v-if="event.price">Price: ${{event.price || 'price not available'}}</div>
        </div>

        <div class="main__description" v-html="event.description"></div>
      </div>
    </div>
  </FairLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import PlaceholderIcon from '@/components/Icons/PlaceholderIcon.vue';
import FairLayout from '@/layouts/fair.vue';
import appConfig from '@/config/app';

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
    venue: Venue;
    featured_image?: string;
    duration?: number;
    price?: number;
}

interface Venue {
    name: string;
    slug: string;
    description?: string;
    latitude?: string;
    longitude?: string;
}

const route = useRoute();
const dataStore = useDataStore();
const eventId = parseInt(route.params.id as string);

// Parse date string function (same as music list page)
const parseDateString = (dateString: string): Date => {
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
    return new Date();
};

// Format date function with improved error handling
const formatEventDate = (dates: { start_time_date: string; start_time_time: string; start_time_unix: number; }[] | undefined): string => {
    if (!dates || dates.length === 0) {
        console.warn("No start_time provided, cannot be formatted");
        return "TBD";
    }

    const {start_time_date, start_time_time} = dates[0];
    if (!start_time_date || !start_time_time) {
        console.warn("Incomplete start_time data, cannot be formatted");
        return "TBD"
    }

    try {
        const dateString = `${start_time_date} ${start_time_time}`;
        const date = parseDateString(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    } catch (error) {
        console.error(`Error formatting date: ${start_time_date} ${start_time_time}`, error);
        return `${start_time_date} ${start_time_time}`;
    }
};

// Get the specific event with transformed image URL
const event = computed<Event | undefined>(() => {
        const foundEvent = dataStore.data.nysfairWebsite.events.find(
            (e: Event) => e.id === eventId
        );

        console.log("computed event", foundEvent);

        if (foundEvent) {
            return {
                ...foundEvent,
                featured_image: foundEvent.featured_image?.replace(
                    'http://nys-fair.test:8001/wp-content/uploads/',
                    'https://nysfair.ny.gov/wp-content/uploads/'
                )
            };
        }

        return undefined;
});
</script>

<style lang="scss" scoped>
ion-title {
    color: white;
}
ion-back-button {
    --color: white;
}
.main {
    padding: 20px;
    background: #FDD456;
    padding-bottom: v-bind('appConfig.bottomBar.height');

    &__image {
        background-color: #EFF2F6;
        border-radius: 10px;
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    &__venue {
        font-size: 12px;
        color: #343434;
        font-weight: 600;
        line-height: 28px;
    }

    &__title {
        font-size: 24px;
        font-weight: 700;
        color: #343434;
        margin: 0;
        line-height: 28px;
    }

    &__date {
        font-size: 16px;
        color: #343434;
        font-weight: 700;
        line-height: 24px;
        margin-top: 5px;
    }

    &__price {
        margin-top: 5px;
        font-weight: 600;
        color: #343434;
    }

    &__description {
        font-size: 16px;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: #343434;
        font-weight: 400;
        margin: 8px 0;
    }
}

.facts-section {
    padding: 16px 0;
    border-top: 1px solid #EFF2F6;

    &:last-child {
        border-bottom: 1px solid #EFF2F6;
    }
}

.facts-title {
    font-size: 16px;
    font-weight: 700;
    color: #343434;
    line-height: 28px;
    letter-spacing: 0.5px;
}

.facts-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.facts-label {
    font-size: 12px;
    color: #666;
    line-height: 28px;
    letter-spacing: 0.5px;

}

.facts-value {
    font-size: 16px;
    color: #343434;
    font-weight: 500;
}

:deep(ion-content) {
    --background: white;
}

:deep(ion-toolbar) {
    --color: #333;
}
</style>
