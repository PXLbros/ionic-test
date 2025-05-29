import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.studiocity.nysfair',
  appName: 'fairground-app',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Sentry: {
      dsn: process.env.VITE_SENTRY_DSN,
      environment: process.env.VITE_NODE_ENV,
    },
    FirebaseAnalytics: {
      autoCollectionEnabled: true, // Enables automatic event tracking
    },
    // SafeArea: {
    //   enabled: true,
    //   customColorsForSystemBars: true,
    //   statusBarColor: '#000000',
    //   statusBarContent: 'light',
    //   navigationBarColor: '#000000',
    //   navigationBarContent: 'light',
    //   offset: 0,
    // },
  },
};

export default config;
