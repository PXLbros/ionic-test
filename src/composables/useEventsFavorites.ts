// src/composables/useEventFavorites.ts
import { ref } from 'vue';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { addUserEventFavorite, removeUserEventFavorite } from '@/services/api';
import { useAppStore } from '@/stores/app';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import type { Event, EventDate } from '@/types';

export function useEventFavorites() {
  const appStore = useAppStore();
  const dataStore = useDataStore();
  const { data } = storeToRefs(dataStore);
  const eventsData = computed(() => data.value?.nysfairWebsite?.events ?? []);

  const findEventDate = (eventId: number, startTimeUnix: number): EventDate | undefined => {
    const event = eventsData.value.find((event: Event) => event.id === eventId);
    return event?.dates.find((date: EventDate) => date.start_time_unix === startTimeUnix);
  };

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
      const deviceId = isNativePlatform ?
        appStore.pushNotifications.deviceId :
        appStore.getPersistentWebDeviceId();

      if (!deviceId) {
        throw new Error('Device ID not found');
      }

      const saveUserEventFavoriteData = {
        eventId,
        startTime: selectedStartTimeUnix,
        isFavorite: true,
        deviceId
      };

      const saveUserEventFavoriteSuccess = await addUserEventFavorite(saveUserEventFavoriteData);

      if (saveUserEventFavoriteSuccess) {
        appStore.openToast({ message: 'Event added to favorites', duration: 2000 });
        matchingDate.isFavorite = true;
      } else {
        appStore.openToast({ message: 'An error occurred while adding the event to favorites', duration: 2000 });
      }
    } catch (error) {
      console.error(error);
      appStore.openToast({ message: 'An error occurred while adding the event to favorites', duration: 2000 });
    } finally {
      matchingDate.isAddingToFavorites = false;
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
      const isNativePlatform = Capacitor.isNativePlatform();
      const saveUserEventFavoriteData = {
        eventId,
        startTime: selectedStartTimeUnix,
        isFavorite: false,
        deviceId: isNativePlatform ?
          appStore.pushNotifications.deviceId :
          appStore.getPersistentWebDeviceId()
      };

      if (!saveUserEventFavoriteData.deviceId) {
        throw new Error('Device ID not found');
      }

      const saveUserEventFavoriteSuccess = await removeUserEventFavorite(saveUserEventFavoriteData as any);

      if (saveUserEventFavoriteSuccess) {
        appStore.openToast({ message: 'Event removed from favorites', duration: 2000 });
        matchingDate.isFavorite = false;
      } else {
        appStore.openToast({ message: 'An error occurred while removing the event from favorites', duration: 2000 });
      }
    } catch (error) {
      console.error(error);
      appStore.openToast({ message: 'An error occurred while removing the event from favorites', duration: 2000 });
    } finally {
      matchingDate.isRemovingFromFavorites = false;
    }
  };

  return {
    toggleFavorite,
    findEventDate
  };
}
