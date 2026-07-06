import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pandamandarin.app',
  appName: 'PandaMandarin',
  webDir: 'out',
  backgroundColor: '#F2F2F7',
  server: {
    iosScheme: 'pandamandarin',
    androidScheme: 'https',
  },
  plugins: {
    CapacitorHttp: { enabled: true },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#F2F2F7',
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#F2F2F7',
    },
  },
  ios: {
    contentInset: 'never',
    allowsLinkPreview: false,
    scrollEnabled: false,
    backgroundColor: '#F2F2F7',
  },
};

export default config;
