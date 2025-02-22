import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';

import * as Sentry from '@sentry/capacitor';
import * as SentryVue from '@sentry/vue';

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

import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { Capacitor } from '@capacitor/core';

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

const initializeFirebase = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      console.warn('Firebase Analytics is only available on iOS/Android.');
      return;
    }

    console.log('Initializing Firebase Analytics...');

    await FirebaseAnalytics.setEnabled({ enabled: true });

    console.log('Firebase Analytics Initialized Successfully');
  } catch (error) {
    console.error('Firebase Initialization Error:', error);
  }
};

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

const appStore = useAppStore();

router.isReady().then(async () => {
  initializeFirebase().then(() => {
    // Get the initial route
    const initialRoute = router.currentRoute.value;

    // Log initial screen view
    if (initialRoute) {
      console.log('Initial Page Load:', initialRoute);

      FirebaseAnalytics.logEvent({
        name: 'screen_view',
        params: {
          screen_name: initialRoute.name || initialRoute.path,
        },
      });
    }

    router.afterEach((to) => {
      console.log('Route changed to: ', to);

      FirebaseAnalytics.logEvent({
        name: 'screen_view',
        params: {
          screen_name: to.name || to.path,
        }
      });
    });
  });

  app.mount('#app');

  // Initialize push notification listeners
  appStore.initializePushNotifications();

  // Trigger push notification registration
  appStore.enablePushNotifications();
});
