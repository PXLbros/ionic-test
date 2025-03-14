# NYSFair (Ionic)

## Build APK for Android testing

### Build app

```sh
ionic capacitor build android --prod
```

### Open Android Studio

Go to `Build` > `Build Bundle(s)/APK(s)` > `Build APK(s)`. Then locate at `android/app/build/outputs/apk/debug/app-debug.apk`

### Install on device

```
Go to Settings > Apps & notifications.
Tap Advanced > Special app access.
Tap Install unknown apps.
Select the app (like Chrome or File Manager) you'll use to install the APK.
Enable Allow from this source.
```
