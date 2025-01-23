import axios from 'axios';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

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
  listenersInitialized: boolean;
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
      listenersInitialized: false,
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

    async createUserDeviceToken({ deviceId }: { deviceId: string }) {
      const response = await axios.post(`${import.meta.env.VITE_STRAPI_API_URL}/user-device-tokens/create`, {
        deviceId,
      });

      if (response.data?.success !== true) {
        throw new Error();
      }
    },

    initializePushNotifications() {
      if (this.pushNotifications.listenersInitialized) {
        console.log('Push notification listeners already initialized');
        return;
      }

      const isNativePlatform = Capacitor.isNativePlatform();

      if (isNativePlatform) {
        // Add listeners only once
        PushNotifications.addListener('registration', async (token) => {
          console.log('Device registered with token:', token.value);
          try {
            await this.createUserDeviceToken({ deviceId: token.value });
            this.pushNotifications.deviceId = token.value;
          } catch (error) {
            console.error('Error saving token to backend:', error);
          }
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.error('Registration error:', error.error);
          this.pushNotifications.getDeviceIdError = error.error;
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Notification received:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Notification action performed:', notification);
        });

        this.pushNotifications.listenersInitialized = true; // Mark listeners as initialized
        console.log('Push notification listeners initialized');
      } else {
        console.warn('Skipped push notifications setup because app is not running on a native platform');
      }
    },

    async enablePushNotifications() {
      return new Promise((resolve, reject) => {
        const isNativePlatform = Capacitor.isNativePlatform();

        if (isNativePlatform) {
          PushNotifications.checkPermissions()
            .then((permStatus) => {
              if (permStatus.receive === 'prompt') {
                return PushNotifications.requestPermissions();
              }
              return permStatus;
            })
            .then((permStatus) => {
              if (permStatus.receive !== 'granted') {
                throw new Error('User denied permissions!');
              }

              this.pushNotifications.permissionStatus = permStatus.receive;

              return PushNotifications.register();
            })
            .then(() => {
              this.pushNotifications.didRegisterDevice = true;
              resolve(true); // Resolve once registration completes
            })
            .catch((error) => {
              console.error('Failed to enable push notifications:', error);
              reject(error); // Reject on error
            });
        } else {
          const deviceId = this.getPersistentWebDeviceId();

          this.createUserDeviceToken({ deviceId })
            .then(() => {
              this.pushNotifications.permissionStatus = 'granted';
              this.pushNotifications.didRegisterDevice = true;
              this.pushNotifications.deviceId = deviceId;

              resolve(true);
            })
            .catch((error) => {
              console.error('Failed to enable push notifications:', error);
              reject(error);
            });
        }
      });
    },

    async disablePushNotifications() {
      const deviceId = this.pushNotifications.deviceId;

      if (!deviceId) {
        console.warn('No device ID found, skipping push notifications disable');
        return;
      }

      try {
        const response = await axios.post(`${import.meta.env.VITE_STRAPI_API_URL}/user-device-tokens/delete`, {
          deviceId,
        });

        if (response.data?.success !== true) {
          throw new Error('Failed to delete device token');
        }

        console.log('Device token deleted successfully');
      } catch (error) {
        console.error('Failed to disable push notifications:', error);
      } finally {
        this.pushNotifications.permissionStatus = 'denied';
        this.pushNotifications.deviceId = null;
        this.pushNotifications.didRegisterDevice = false;
      }
    },
  },
});
