<template>
  <div class="events-list">
    <template v-if="props.events && props.events.length > 0">
      <div v-for="event in props.events" :key="event.id" class="events-list__event-item">
        <div class="content">
          <h3>{{ event.title }}</h3>
          <p>{{ props.showEventDate ? event.eventDate.start_time_formatted : event.start_time }} </p>
          <p>{{ event.venue.name }}</p>
          <p v-if="event.categories.length > 0">
            Categories: {{ event.categoryNames.join(', ') }}
          </p>
        </div>
        <div class="events-list__favorite-container">
          <button
            class="events-list__favorite-button"
            :class="{ 'events-list__favorite-button--is-favorite': event.dateDetails.isFavorite }"
            @click="toggleFavorite(event.id, event.dateDetails)"
            :disabled="event.dateDetails.isAddingToFavorites || event.dateDetails.isRemovingFromFavorites"
          >
            <ion-icon
              :icon="event.dateDetails.isFavorite ? heart : heartOutline"
              :class="{ 'loading': event.dateDetails.isAddingToFavorites || event.dateDetails.isRemovingFromFavorites }"
            ></ion-icon>
          </button>
        </div>
      </div>
    </template>

    <div v-else class="events-list__no-events">
      <p>{{ noEventsText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { addUserEventFavorite, removeUserEventFavorite } from '@/services/api';
import { IonIcon } from '@ionic/vue';
import { heart, heartOutline } from 'ionicons/icons';
import { Category, Event, EventDate } from '@/types';
import { FormattedEvent } from '@/utils/event';

const props = withDefaults(defineProps<{
  events: FormattedEvent[];
  categories: Category[];
  noEventsText?: string;
  showEventDate?: boolean;
}>(), {
  events: () => [],
  categories: () => [],
  noEventsText: 'No events',
  showEventDate: false,
});

const appStore = useAppStore();
const dataStore = useDataStore();
const { data } = storeToRefs(dataStore);
const eventsData = computed(() => data.value?.nysfairWebsite?.events ?? []);

const toggleFavorite = async (eventId: number, dateDetails: EventDate): Promise<void> => {
  if (!dateDetails) {
    console.warn('No date details provided for the event');
    return;
  }

  const selectedStartTimeUnix = dateDetails.start_time_unix;

  if (dateDetails.isFavorite) {
    await removeEventFromFavorites(eventId, selectedStartTimeUnix);
  } else {
    await addEventToFavorites(eventId, selectedStartTimeUnix);
  }
};

const addEventToFavorites = async (eventId: number, selectedStartTimeUnix: number): Promise<void> => {
  const matchingDate = findEventDate(eventId, selectedStartTimeUnix);

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

  matchingDate.isAddingToFavorites = true;

  try {
    const saveUserEventFavoriteData: { eventId: number; startTime: number; deviceId: string; isFavorite: boolean } = {
      eventId: eventId,
      startTime: selectedStartTimeUnix,
      isFavorite: true,
      deviceId: '',
    };

    const handleSaveUserEventFavoriting = ({ saveUserEventFavoriteSuccess, matchingDate }: { saveUserEventFavoriteSuccess: boolean; matchingDate: EventDate }) => {
      if (saveUserEventFavoriteSuccess) {
        appStore.openToast({ message: 'Event added to favorites', duration: 2000 });

        matchingDate.isFavorite = true;
      } else {
        appStore.openToast({ message: 'An error occurred while adding the event to favorites', duration: 2000 });
      }

      matchingDate.isAddingToFavorites = false;
    };

    // Send to API
    if (isNativePlatform) {
      // // Fetch the token
      // PushNotifications.addListener('registration', async (token: { value: string }) => {
      //   console.log('Device token:', token.value);

      //   saveUserEventFavoriteData.deviceId = token.value;

      //   // Send the event ID and token to the backend
      //   const saveUserEventFavoriteSuccess = await addUserEventFavorite(saveUserEventFavoriteData);

      //   handleSaveUserEventFavoriting({ saveUserEventFavoriteSuccess, matchingDate });
      // });

      // // Trigger registration if not already done
      // if (!appStore.pushNotifications.deviceId) {
      //   await PushNotifications.register();

      //   // Sleep for 1 second
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      // }

      if (!appStore.pushNotifications.deviceId) {
        throw new Error('Device ID not found');
      }

      saveUserEventFavoriteData.deviceId = appStore.pushNotifications.deviceId;
    } else {
      saveUserEventFavoriteData.deviceId = appStore.getPersistentWebDeviceId();
    }

    const saveUserEventFavoriteSuccess = await addUserEventFavorite(saveUserEventFavoriteData);

    handleSaveUserEventFavoriting({ saveUserEventFavoriteSuccess, matchingDate });
  } catch (error) {
    console.error(error);

    appStore.openToast({ message: 'An error occurred while adding the event to favorites', duration: 2000 });
  }
};

const removeEventFromFavorites = async (eventId: number, selectedStartTimeUnix: number): Promise<void> => {
  const matchingDate = findEventDate(eventId, selectedStartTimeUnix);

  if (!matchingDate) {
    console.warn('No matching date found for the selected start time.');
    return;
  }

  matchingDate.isRemovingFromFavorites = true;

  try {
    const saveUserEventFavoriteData: { eventId: number; startTime: number; deviceId: string; isFavorite: boolean } = {
      eventId: eventId,
      startTime: selectedStartTimeUnix,
      isFavorite: false,
      deviceId: '',
    };

    const handleSaveUserEventUnfavoriting = ({ saveUserEventFavoriteSuccess, matchingDate }: { saveUserEventFavoriteSuccess: boolean; matchingDate: EventDate }) => {
      if (saveUserEventFavoriteSuccess) {
        appStore.openToast({ message: 'Event removed from favorites', duration: 2000 });

        matchingDate.isFavorite = false;
      } else {
        appStore.openToast({ message: 'An error occurred while removing the event from favorites', duration: 2000 });
      }

      matchingDate.isRemovingFromFavorites = false;
    };

    const isNativePlatform = Capacitor.isNativePlatform();

    if (isNativePlatform) {
      // // Fetch the token
      // PushNotifications.addListener('registration', async (token: { value: string }) => {
      //   saveUserEventFavoriteData.deviceId = token.value;

      //   // Send the event ID and token to the backend
      //   const saveUserEventFavoriteSuccess = await removeUserEventFavorite(saveUserEventFavoriteData);

      //   handleSaveUserEventUnfavoriting({ saveUserEventFavoriteSuccess, matchingDate });
      // });

      // // Trigger registration if not already done
      // if (!appStore.pushNotifications.deviceId) {
      //   await PushNotifications.register();

      //   // Sleep for 1 second
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      // }

      if (!appStore.pushNotifications.deviceId) {
        throw new Error('Device ID not found');
      }

      saveUserEventFavoriteData.deviceId = appStore.pushNotifications.deviceId;
    } else {
      saveUserEventFavoriteData.deviceId = appStore.getPersistentWebDeviceId();
    }

    const saveUserEventFavoriteSuccess = await removeUserEventFavorite(saveUserEventFavoriteData);

    handleSaveUserEventUnfavoriting({ saveUserEventFavoriteSuccess, matchingDate });
  } catch (error) {
    console.error(error);

    appStore.openToast({ message: 'An error occurred while removing the event from favorites', duration: 2000 });
  }
};

const findEventDate = (eventId: number, startTimeUnix: number): EventDate | undefined => {
  const event = eventsData.value.find((event: Event) => event.id === eventId);

  return event?.dates.find((date: EventDate) => date.start_time_unix === startTimeUnix);
};
</script>

<style lang="scss" scoped>
.events-list {
  &__event-item {
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

      &:last-child {
        margin-top: 2px;
      }
    }
  }

  &__favorite-container {
    margin-top: 10px;
  }

  &__favorite-button {
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

    &--is-favorite {
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

  &__no-events {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: 18px;
    color: #666;
  }
}
</style>
