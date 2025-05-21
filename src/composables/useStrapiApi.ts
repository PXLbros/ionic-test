import axios, { AxiosInstance } from 'axios';
import { useLogger } from '@/composables/useLogger';

let apiInstance: AxiosInstance | null = null;

const logger = useLogger();

export function useStrapiApi(): AxiosInstance {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: import.meta.env.VITE_STRAPI_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Token': import.meta.env.VITE_STRAPI_API_TOKEN,
      },
    });

    apiInstance.interceptors.response.use(
      response => response,
      error => {
        logger.error(error);

        return Promise.reject(error);
      }
    );

    // logger.debug('Strapi API instance created', {
    //   URL: import.meta.env.VITE_STRAPI_API_URL,
    // });
  }

  return apiInstance;
}
