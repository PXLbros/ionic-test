import { AxiosError } from 'axios';
import { useDataStore } from '@/stores/data';
import * as Sentry from '@sentry/capacitor';
import { Preferences } from '@capacitor/preferences';
import { Site } from '@/types';
import { useStrapiApi } from '@/composables/useStrapiApi';

export const fetchData = async () => {
  const dataStore = useDataStore();
  const strapiApi = useStrapiApi();

  try {
    dataStore.isLoading = true;
    dataStore.setLoadError({ error: null });

    let data: any = {};

    const params: Record<string, any> = {};

    if (import.meta.env.VITE_NODE_ENV === 'local') {
      params.cache = 0;
    }

    const response = await strapiApi.get(
      '/data',
      {
        params,
      },
    );

    data = response.data?.data;

    if (!data) {
      throw new Error('Could not parse data');
    }

    const mobileAppData = data.strapi?.error ? null : data.strapi?.data || null;
    const nysfairWebsiteData = data.nysfairWebsite?.error ? null : await formatNYSFairWebsiteData(data.nysfairWebsite?.data) || null;
    const nysfairgroundsWebsiteData = data.nysfairgroundsWebsite?.error ? null : await formatNYSFairgroundsData(data.nysfairgroundsWebsite?.data) || null;

    const errors = {
      strapi: data.strapi?.error || null,
      nysfairWebsite: data.nysfairWebsite?.error || null,
      nysfairgroundsWebsite: data.nysfairgroundsWebsite?.error || null
    };

    dataStore.setData({
      data: {
        strapi: mobileAppData,
        nysfairWebsite: nysfairWebsiteData,
        nysfairgroundsWebsite: nysfairgroundsWebsiteData,
      },
      errors
    });
  } catch (error) {
    console.error('Error fetching data:', error);

    dataStore.setLoadError({ error });

    // Report error to Sentry
    if (Sentry && typeof Sentry.captureException === 'function') {
      Sentry.captureException(error);
    }
  } finally {
    dataStore.isLoading = false;
    dataStore.isInitiallyLoading = false;
  }
};

const getFavoriteEventsPreferenceKey = (site: Site) => {
  switch (site) {
    case 'nysfair':
      return 'favoriteNYSFairEvents';
    case 'nysfairgrounds':
      return 'favoriteNYSFairgroundsEvents';
    default:
      return '';
  }
}

const formatData = async ({ site, data }: { site: Site; data: any }) => {
  const favoriteEventsPreferenceKey = getFavoriteEventsPreferenceKey(site);

  let { value: favoriteNYSFairEventIds } = await Preferences.get({ key: favoriteEventsPreferenceKey });

  if (!favoriteNYSFairEventIds) {
    favoriteNYSFairEventIds = '[]';
  }

  const favoriteNYSFairEvents: { id: number; start_time_unix: number }[] = JSON.parse(favoriteNYSFairEventIds);

  if (data.events) {
    data.events = data.events.map((event: any) => {
      event.dates = event.dates?.map((date: any) => {
        const isFavorite = favoriteNYSFairEvents.some((favoritedEvent) => {
          return favoritedEvent.id === event.id && favoritedEvent.start_time_unix === date.start_time_unix;
        });

        return {
          ...date,
          isFavorite,
        };
      }) || [];

      return event;
    });
  }

  return data;
}

const formatNYSFairWebsiteData = async (data: any) => {
  return formatData({ site: 'nysfair', data });
};

const formatNYSFairgroundsData = async (data: any) => {
  return formatData({ site: 'nysfairgrounds', data });
};

export interface NYSFairFavoriteEventPreferencesApiItem {
  id: number;
  start_time_unix: number;
}

export const addUserEventFavorite = async ({
  deviceId,
  site,
  eventId,
  startTime,
}: {
  deviceId: string;
  site: Site;
  eventId: number | string;
  startTime: number;
}): Promise<boolean> => {
  const strapiApi = useStrapiApi();

  try {
    const favoriteEventsPreferenceKey = getFavoriteEventsPreferenceKey(site);

    const { value: favoriteNYSFairEventIds } = await Preferences.get({ key: favoriteEventsPreferenceKey });

    const favoriteEventPreferencesApiItems = JSON.parse(favoriteNYSFairEventIds || '[]');

    // Save to Strapi API
    const response = await strapiApi.post('/user-event-favorites/create', {
      deviceId,
      site,
      eventId,
      startTime,
    });

    if (response.data?.success !== true) {
      throw new Error();
    }

    // Save to Preferences API
    const favoriteExistsInPreferencesApi = favoriteEventPreferencesApiItems.some((favoritedEvent: NYSFairFavoriteEventPreferencesApiItem) => {
      return favoritedEvent.id === eventId && favoritedEvent.start_time_unix === startTime;
    });

    if (!favoriteExistsInPreferencesApi) {
      favoriteEventPreferencesApiItems.push({ id: eventId, start_time_unix: startTime });
    }

    await Preferences.set({
      key: favoriteEventsPreferenceKey,
      value: JSON.stringify(favoriteEventPreferencesApiItems),
    });

    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        console.warn('User event favorite already exists');

        return true;
      }
    }

    console.error(error);

    return false;
  }
}

export const removeUserEventFavorite = async ({
  deviceId,
  site,
  eventId,
  startTime,
}: {
  deviceId: string;
  site: Site;
  eventId: number | string;
  startTime: number;
}): Promise<boolean> => {
  const strapiApi = useStrapiApi();

  try {
    const favoriteEventsPreferenceKey = getFavoriteEventsPreferenceKey(site);

    const { value: favoriteNYSFairEventIds } = await Preferences.get({ key: favoriteEventsPreferenceKey });

    const favoriteEventPreferencesApiItems = JSON.parse(favoriteNYSFairEventIds || '[]');

    // Save to Preferences API
    const index = favoriteEventPreferencesApiItems.findIndex((favoritedEvent: NYSFairFavoriteEventPreferencesApiItem) => {
      return favoritedEvent.id === eventId && favoritedEvent.start_time_unix === startTime;
    });

    if (index !== -1) {
      favoriteEventPreferencesApiItems.splice(index, 1);
    }

    await Preferences.set({
      key: favoriteEventsPreferenceKey,
      value: JSON.stringify(favoriteEventPreferencesApiItems),
    });
  } catch (error) {
    console.error(error);

    return false;
  }

  try {
    // Save to Strapi API
    const response = await strapiApi.post('/user-event-favorites/delete', {
      deviceId,
      site,
      eventId,
      startTime,
    });

    if (response.data?.success !== true) {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
  }

  return true;
}
