<template>
    <ion-page>
        <ion-content>
            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-back-button default-href="/fair/music"></ion-back-button>
                    </ion-buttons>
                    <ion-title>Chevrolet Music Series</ion-title>
                </ion-toolbar>
            </ion-header>

            <div v-if="event" class="main">
                <div class="main__image">
                    <img v-if="event.featured_image" :src="event.featured_image" alt="">
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                        <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
                    </svg>
                </div>

                <div class="main__content">
                    <div class="group">
                        <div class="main__venue">{{ event.venue?.name }}</div>
                        <h1 class="main__title">{{ event.title }}</h1>
                        <div class="main__date">{{ formatEventDate(event.start_time) }}</div>
                    </div>
                    
                    <div class="main__description" v-html="event.description"></div>

                    <!-- Facts Sections -->
                    <div class="facts-section">
                        <h2 class="facts-title">Facts</h2>
                        <div class="facts-item">
                            <div class="facts-label">Label</div>
                            <div class="facts-value">fadfadfasdfl</div>
                        </div>
                    </div>

                    <div class="facts-section">
                        <h2 class="facts-title">Facts</h2>
                        <div class="facts-item">
                            <div class="facts-label">Label</div>
                            <div class="facts-value">fadfadfasdfl</div>
                        </div>
                    </div>

                    <div class="facts-section">
                        <h2 class="facts-title">Facts</h2>
                        <div class="facts-item">
                            <div class="facts-label">Label</div>
                            <div class="facts-value">fadfadfasdfl</div>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { useDataStore } from '@/stores/data';
import { computed } from 'vue';

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
    const cleanDateString = dateString.replace(/&nbsp;/g, ' ').trim();

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
const formatEventDate = (dateString: string): string => {
    try {
        const date = parseDateString(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    } catch (error) {
        console.error(`Error formatting date: ${dateString}`, error);
        return dateString; // Return original string if formatting fails
    }
};

// Get the specific event with transformed image URL
const event = computed<Event | undefined>(() => {
    const foundEvent = dataStore.data.nysfairWebsite.events.find(
        (e: Event) => e.id === eventId
    );

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
    padding: 30px;

    &__image {
        background-color: #EFF2F6;
        border-radius: 24px;
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
            border-radius: 24px;
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