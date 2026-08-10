#!/usr/bin/env bash
# Start the VeryStays Android debug build on a local emulator.
# Run this from a normal Terminal (not the Cursor agent sandbox).
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home}"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$JAVA_HOME/bin:$PATH"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AVD="${1:-Medium_Phone_API_36}"

if ! adb devices | grep -qE 'emulator-[0-9]+\s+device'; then
  echo "Starting emulator: $AVD"
  nohup emulator -avd "$AVD" -netdelay none -netspeed full >/tmp/verystays-emulator.log 2>&1 &
  echo "Waiting for boot…"
  for _ in $(seq 1 60); do
    if adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' | grep -q 1; then
      break
    fi
    sleep 5
  done
fi

adb wait-for-device
BOOT="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')"
if [[ "$BOOT" != "1" ]]; then
  echo "Emulator did not finish booting. See /tmp/verystays-emulator.log"
  exit 1
fi

echo "Building & installing VeryStays…"
cd "$ROOT"
npx expo run:android --no-bundler 2>/dev/null || npx expo run:android
