import { defineStore } from 'pinia';

interface DataErrors {
  strapi: string | null;
  nysfairWebsite: string | null;
  nysfairgroundsWebsite: string | null;
}

interface DataStoreState {
  isLoading: boolean;
  loadError: Error | null;
  data: any | null;
  errors: DataErrors | null;
}

export const useDataStore = defineStore('data', {
  state: (): DataStoreState => ({
    isLoading: false,
    loadError: null,
    data: null,
    errors: null,
  }),

  actions: {
    showLoader() {
      this.isLoading = true;
    },

    hideLoader() {
      this.isLoading = false;
    },

    setLoadError({ error }: { error: any }) {
      this.loadError = error;
    },

    setData({ data, errors }: { data: any, errors: DataErrors }) {
      this.data = data;
      this.errors = errors;
    },
  },
});
