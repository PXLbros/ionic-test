import { defineStore } from 'pinia';

interface DataStoreState {
  isLoading: boolean;
  loadError: Error | null;
  data: any | null;
}

export const useDataStore = defineStore('data', {
  state: (): DataStoreState => ({
    isLoading: false,
    loadError: null,
    data: null,
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

    setData({ data }: { data: any }) {
      this.data = data;
    },
  },
});
