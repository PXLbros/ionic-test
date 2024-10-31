import axios from 'axios';
import { useDataStore } from '@/stores/data';

const API_URL = `${import.meta.env.VITE_STRAPI_API_URL}/data`;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

export const fetchData = async () => {
  const dataStore = useDataStore();

  try {
    dataStore.showLoader();
    dataStore.setLoadError({ error: null });

    const useFakeData = true;

    let data: any = {};

    if (useFakeData) {
      data = getFakeData();
    } else {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`
        }
      });

      data = response.data?.data;

      if (!data) {
        throw new Error('Could not parse data');
      }
    }

    const mobileAppData = data.mobileApp || null;
    const nysfairWebsiteData = data.nysfairWebsite || null;
    const nysfairgroundsWebsiteData = data.nysfairgroundsWebsite || null;

    dataStore.setData({
      data: {
        mobileApp: mobileAppData,
        nysfairWebsite: nysfairWebsiteData,
        nysfairgroundsWebsite: nysfairgroundsWebsiteData,
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error);

    dataStore.setLoadError({ error });
  } finally {
    dataStore.hideLoader();
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
    nysfairWebsite: null,
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
