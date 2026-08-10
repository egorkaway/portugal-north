#!/bin/bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"
cd "$HOME/Dev/portugal-north/mobile"
echo "Starting Medium_Phone_API_36 emulator..."
emulator -avd Medium_Phone_API_36 -netdelay none -netspeed full &
echo "Waiting for device..."
adb wait-for-device
until [[ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; do sleep 2; done
echo "Installing APK..."
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
echo "Launching VeryStays..."
adb shell monkey -p com.iberian.travel -c android.intent.category.LAUNCHER 1
echo "Done. You can close this window."
