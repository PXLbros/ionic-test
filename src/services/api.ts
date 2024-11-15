import axios from 'axios';
import { useDataStore } from '@/stores/data';

const API_URL = `${import.meta.env.VITE_STRAPI_API_URL}/data`;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

export const fetchData = async () => {
  const dataStore = useDataStore();

  try {
    dataStore.showLoader();
    dataStore.setLoadError({ error: null });

    const useFakeData = false;

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
