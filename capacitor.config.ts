import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.roldygoldy.app',
  appName: 'RoldyGoldy',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'api.bigdatacloud.net',
      '*.googleapis.com',
      '*.google.com',
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#21070D',
      showSpinner: false,
    },
    Camera: {
      permissions: ['camera', 'photos'],
    },
  },
};

export default config;
