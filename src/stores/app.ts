import { defineStore } from 'pinia';

const DEFAULT_TOAST_DURATION = 2500;

export interface AppStoreToastConfig {
  isOpen: boolean;
  message: string;
  duration?: number;
}

interface AppStoreState {
  toast: AppStoreToastConfig;
}

export const useAppStore = defineStore('app', {
  state: (): AppStoreState => ({
    toast: {
      isOpen: false,
      message: '',
      duration: DEFAULT_TOAST_DURATION,
    },
  }),

  actions: {
    openToast({ message, duration }: { message: string; duration?: number }) {
      this.toast = {
        isOpen: true,
        message,
        duration: duration || DEFAULT_TOAST_DURATION,
      };
    },

    closeToast() {
      this.toast = {
        isOpen: false,
        message: '',
        duration: DEFAULT_TOAST_DURATION,
      };
    },
  },
});
