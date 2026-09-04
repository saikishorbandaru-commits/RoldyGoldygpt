# RoldyGoldy Android / APK Build Guide

## 1. Install prerequisites
- Node.js 20+
- Android Studio (latest stable)
- Android SDK Platform 36
- JDK 21

## 2. Configure the production API
Copy `.env.android.example` to `.env.production` and set:

`VITE_API_BASE_URL=https://your-production-api-domain`

The packaged APK does **not** run `server.ts` inside the phone. The Express/Gemini backend must be deployed separately over HTTPS for AI bargain, scrap appraisal and try-on cutout endpoints.

## 3. Install packages and create/sync Android
```bash
npm install
npm run android:sync
```

This package already includes the RoldyGoldy Android scaffold and native permissions. `android:sync` refreshes Capacitor files and copies the production web build into the Android project.

## 4. Open Android Studio
```bash
npm run android:open
```

Wait for Gradle sync to finish.

## 5. Build a debug APK
Android Studio: Build > Build APK(s)

or:
```bash
npm run android:apk:debug
```

Expected output:
`android/app/build/outputs/apk/debug/app-debug.apk`

## 6. Build a Play Store release
Create a signing keystore and configure Android Studio's signing settings, then build a signed AAB (recommended for Play Store) or signed APK.

## Native permissions prepared
- Internet
- Camera
- Fine/coarse location
- Vibration / haptics
- Network state
- Image/media access where required by the Android version

## Important production checklist
- Use a real HTTPS backend URL.
- Replace placeholder signing configuration.
- Configure privacy policy and Play Console data safety declarations.
- Test camera, location, OTP, payment and Trial @Home flows on a physical Android device.
