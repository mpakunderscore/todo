import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'space.mpak.todo',
    appName: 'Red Forest',
    webDir: 'dist',
    backgroundColor: '#000000',
    plugins: {
        "LocalNotifications": {
            "smallIcon": "ic_stat_logo_favicon",
            "iconColor": "#FFFFFF",
            "sound": "long_sound"
        },
        "SplashScreen": {
            "launchShowDuration": 0
        }
    },
    server: {
        // hostname: "forest.red",
        // androidScheme: "https"
    }
}

export default config;
