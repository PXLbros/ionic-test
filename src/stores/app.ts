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

    async createUserDeviceToken({ deviceId }: { deviceId: string }) {
      const response = await axios.post(`${import.meta.env.VITE_STRAPI_API_URL}/user-device-tokens/create`, {
        deviceId,
      });

      if (response.data?.success !== true) {
        throw new Error();
      }
    },

    enablePushNotifications() {
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

              PushNotifications.addListener('registration', async (token) => {
                console.log('Device registered with token:', token.value);

                try {
                  await this.createUserDeviceToken({ deviceId: token.value });

                  this.pushNotifications.deviceId = token.value;

                  resolve(true); // Resolve the Promise here
                } catch (error) {
                  console.error('Error saving token to backend:', error);

                  reject(error); // Reject the Promise on backend error
                }
              });

              PushNotifications.addListener('registrationError', (error) => {
                console.error('Registration error:', error.error);
                this.pushNotifications.getDeviceIdError = error.error;
                reject(error.error); // Reject the Promise here
              });

              return PushNotifications.register();
            })
            .catch((error) => {
              console.error('Failed to enable push notifications:', error);

              reject(error); // Reject the Promise on general errors
            });
        } else {
          const deviceId = this.getPersistentWebDeviceId();

          this.createUserDeviceToken({ deviceId }).then(() => {
            this.pushNotifications.permissionStatus = 'granted';
            this.pushNotifications.didRegisterDevice = true;
            this.pushNotifications.deviceId = deviceId;

            resolve(true);
          }).catch((error) => {
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
        // Clear push notifications state
        this.pushNotifications.permissionStatus = 'denied';
        this.pushNotifications.deviceId = null;
        this.pushNotifications.didRegisterDevice = false;
      }
    },
  },
});
