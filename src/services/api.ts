import axios, { AxiosError } from 'axios';
import { useDataStore } from '@/stores/data';
import * as Sentry from '@sentry/capacitor';
import { Preferences } from '@capacitor/preferences';
import { Site } from '@/types';

export const fetchData = async () => {
  const dataStore = useDataStore();

  try {
    dataStore.isLoading = true;
    dataStore.setLoadError({ error: null });

    const useFakeData = false;

    let data: any = {};

    if (useFakeData) {
      data = getFakeData();
    } else {
      const response = await axios.get(`${import.meta.env.VITE_STRAPI_API_URL}/data${import.meta.env.VITE_NODE_ENV === 'local' ? '?cache=0' : ''}`);

      data = response.data?.data;

      if (!data) {
        throw new Error('Could not parse data');
      }
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

const getFakeData = () => {
  return {
    mobileApp: {
      customPages: [
        {
          id: 1,
          documentId: "ikq6q0pf3whuja1im4quhxry",
          Title: "Custom Page",
          Slug: "custom-page",
          Content: [
            {
              type: "paragraph",
              children: [
                {
                  text: "This is a custom break.",
                  type: "text",
                },
              ],
            },
            {
              type: "paragraph",
              children: [
                {
                  text: "A line break was made.",
                  type: "text",
                },
              ],
            },
          ],
          createdAt: "2024-09-23T22:50:46.518Z",
          updatedAt: "2024-09-23T22:50:46.518Z",
          publishedAt: null,
          locale: null,
        },
      ],
      homePage: {
        id: 1,
        documentId: "o483br5o9k2u3ufd7jjjjj4q",
        introText: [
          {
            type: "paragraph",
            children: [
              {
                text: "This is a FAKE intro text coming from ",
                type: "text",
              },
              {
                bold: true,
                text: "Strapi",
                type: "text",
                italic: true,
              },
              {
                text: ".",
                type: "text",
              },
            ],
          },
          {
            type: "paragraph",
            children: [
              {
                text: "This is another FAKE line.",
                type: "text",
              },
            ],
          },
        ],
        createdAt: "2024-09-23T22:53:27.227Z",
        updatedAt: "2024-09-23T23:01:43.402Z",
        publishedAt: null,
        locale: null,
      },
    },
    nysfairWebsite: {
      events: [
        {
          title: "Jamey Johnson",
          description:
            "Award-winning country music singer and songwriter Jamey Johnson makes his Great New York State Fair debut Tuesday, August 31 at 7 p.m. with the stage to be announced. Johnson’s song, “In Color,” earned awards from the Academy of Country Music and the Country Music Association. All Chevrolet Music Festival concerts are free with $3 Fair admission.\r\n\r\nJamey Johnson joins a lineup of more than 50 national touring shows presented in the Chevrolet Music Festival, the largest free music festival at any state fair in America.",
          permalink: "http://nys-fair.test:8001/event/jamey-johnson/",
          start_time: "August 31, 2021 7:00 PM",
          start_time_unix: 1630450800,
          duration: 60,
          venue: {
            name: "Chevy Court Concerts",
            description:
              '18 Days of free entertainment with two shows daily is scheduled for the Stan Colella Stage at Chevy Court for the 2021 New York State Fair. The lineup provides a wide-ranging mix of musical talent from country to nostalgia to today\'s popular music. Concerts at Chevy Court are sponsored by Chevrolet and are <strong>all free to Fairgoers with your Fair admission!</strong>\r\n\r\nSeating areas in Chevy Court are limited to first come – first seated. Make sure to check out all the rules in our <a href="https://nysfair.ny.gov/your-visit/concert-policy/">Concert Policy</a>.',
          },
          created_at: "2021-06-15 11:30:42",
        },
        {
          title: "Grandson",
          description:
            "Alt-rocker Grandson will bring his socially-charged music to the Chevy Park stage at the 2021 Great New York State Fair Monday, August 30. The singer and songwriter behind alternative chart hits such as “Blood // Water” and “One Step Closer” says he believes the world needs honest rock and roll. All Chevrolet Music Series concerts are free with $3 Fair admission.\r\n\r\nGrandson joins a lineup of more than 50 national touring shows presented in the Chevrolet Music Festival, the largest free music festival at any state fair in America.",
          permalink: "http://nys-fair.test:8001/event/grandson/",
          start_time: "August 30, 2021 7:00 PM",
          start_time_unix: 1630364400,
          duration: 60,
          venue: {
            name: "Chevy Court Concerts",
            description:
              '18 Days of free entertainment with two shows daily is scheduled for the Stan Colella Stage at Chevy Court for the 2021 New York State Fair. The lineup provides a wide-ranging mix of musical talent from country to nostalgia to today\'s popular music. Concerts at Chevy Court are sponsored by Chevrolet and are <strong>all free to Fairgoers with your Fair admission!</strong>\r\n\r\nSeating areas in Chevy Court are limited to first come – first seated. Make sure to check out all the rules in our <a href="https://nysfair.ny.gov/your-visit/concert-policy/">Concert Policy</a>.',
          },
          created_at: "2021-06-11 10:34:00",
        },
      ],
    },
    nysfairgroundsWebsite: {
      events: [
        {
          id: "4972",
          title:
            "Food Truck Drive-Thru! hosted by the Syracuse Food Truck Association",
        },
        {
          id: "4886",
          title: "Butcher Boys Fair Food Drive Thru",
        },
      ],
    },
  };
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

const getEventDatesKey = (site: Site) => {
  switch (site) {
    case 'nysfair':
      return 'dates';
    case 'nysfairgrounds':
      return 'eventDates';
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
    const eventDatesKey = getEventDatesKey(site);

    data.events = data.events.map((event: any) => {
      event[eventDatesKey] = event[eventDatesKey]?.map((date: any) => {
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
  try {
    const favoriteEventsPreferenceKey = getFavoriteEventsPreferenceKey(site);

    const { value: favoriteNYSFairEventIds } = await Preferences.get({ key: favoriteEventsPreferenceKey });

    const favoriteEventPreferencesApiItems = JSON.parse(favoriteNYSFairEventIds || '[]');

    // Save to Strapi API
    const response = await axios.post(`${import.meta.env.VITE_STRAPI_API_URL}/user-event-favorites/create`, {
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
    const response = await axios.post(`${import.meta.env.VITE_STRAPI_API_URL}/user-event-favorites/delete`, {
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
