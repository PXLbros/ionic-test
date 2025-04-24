import { defineStore } from 'pinia';

interface DataErrors {
  strapi: string | null;
  nysfairWebsite: string | null;
  nysfairgroundsWebsite: string | null;
}

interface DataStoreState {
  isInitiallyLoading: boolean;
  isLoading: boolean;
  loadError: Error | null;
  data: any | null;
  errors: DataErrors | null;
}

export const useDataStore = defineStore('data', {
  state: (): DataStoreState => ({
    isInitiallyLoading: false,
    isLoading: false,
    loadError: null,
    data: null,
    errors: null,
  }),

  getters: {
    nysfairTicketsUrl(state): string | null {
      let url = state.data.nysfairWebsite?.tickets?.etix_ticket_url || null;

      if (!url) {
        return null;
      }

      const partnerId = state.data.nysfairWebsite?.tickets?.partner_id || null;

      if (partnerId) {
        url = `${url}?partner_id=${partnerId}`;
      }

      return url;
    },
  },

  actions: {
    setLoadError({ error }: { error: any }) {
      this.loadError = error;
    },

    setData({ data, errors }: { data: any, errors: DataErrors }) {
      this.data = data;
      this.errors = errors;
    },
  },
});
