import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_TOAST_DURATION = 2500;

export interface AppStoreToastConfig {
  isOpen: boolean;
  message: string;
  duration?: number;
}

export interface PushNotificationsData {
  permissionStatus: string | null;
  didRegisterDevice: boolean;
  deviceId: string | null;
  getDeviceIdError: string | null;
}

interface AppStoreState {
  toast: AppStoreToastConfig;
  pushNotifications: PushNotificationsData;
}

export const useAppStore = defineStore('app', {
  state: (): AppStoreState => ({
    toast: {
      isOpen: false,
      message: '',
      duration: DEFAULT_TOAST_DURATION,
    },

    pushNotifications: {
      permissionStatus: null,
      didRegisterDevice: false,
      deviceId: null,
      getDeviceIdError: null,
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

    getPersistentWebDeviceId(): string {
      const storedDeviceId = localStorage.getItem('webDeviceId');

      if (storedDeviceId) {
        return storedDeviceId;
      }

      const newDeviceId = uuidv4();

      localStorage.setItem('webDeviceId', newDeviceId);

      return newDeviceId;
    },
  },
});
