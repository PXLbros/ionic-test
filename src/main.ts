import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';

import * as Sentry from '@sentry/capacitor';
import * as SentryVue from '@sentry/vue';

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

const pinia = createPinia();

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia);

Sentry.init(
  {
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,

    environment: import.meta.env.VITE_NODE_ENV,

    integrations: [
      Sentry.browserTracingIntegration(),
      // Sentry.replayIntegration(),
    ],

    tracesSampleRate: 1.0, // 1.0 = Capture 100% of the transactions

    // // Capture Replay for 10% of all sessions,
    // // plus for 100% of sessions with an error
    // // Learn more at
    // // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
    // replaysSessionSampleRate: 0.1,
    // replaysOnErrorSampleRate: 1.0,
  },
  SentryVue.init
);

router.isReady().then(async () => {
  app.mount('#app');

  const isNativePlatform = Capacitor.isNativePlatform();

  if (isNativePlatform) {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();

    // Handle successful registration
    await PushNotifications.addListener('registration', (token) => {
      console.log('Device registered with token:', token.value);
      // Save the token to your backend (Strapi) if needed
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    // Handle foreground notifications
    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
    });

    // Handle notification actions (e.g., when a user clicks on a notification)
    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Notification action performed:', notification);
    });
  } else {
    console.warn('Skipped push notifications setup because app is not running on a native platform');
  }
});
