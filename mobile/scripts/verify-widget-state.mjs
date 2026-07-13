#!/usr/bin/env node
/**
 * Inspect the shared app-group UserDefaults used by expo-widgets.
 * Run after launching the app on a simulator.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const GROUP_ID = 'group.com.iberian.travel';
const APP_BUNDLE_ID = 'com.iberian.travel';
const WIDGET_KIND = 'TripWidget';

function sh(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

function findBootedSimulator() {
  const output = sh('xcrun simctl list devices booted');
  const match = output.match(/\(([0-9A-F-]{36})\) \(Booted\)/i);
  if (!match) {
    throw new Error('No booted iOS simulator found. Launch the app in Simulator first.');
  }
  return match[1];
}

function findAppGroupPlist(deviceId) {
  const root = path.join(
    process.env.HOME,
    'Library/Developer/CoreSimulator/Devices',
    deviceId,
    'data/Containers/Shared/AppGroup',
  );

  if (!fs.existsSync(root)) {
    throw new Error(`App group container root not found: ${root}`);
  }

  for (const entry of fs.readdirSync(root)) {
    const plistPath = path.join(root, entry, 'Library/Preferences', `${GROUP_ID}.plist`);
    if (!fs.existsSync(plistPath)) continue;

    const defaults = execSync(`plutil -convert json -o - ${JSON.stringify(plistPath)}`, {
      encoding: 'utf8',
    });
    const parsed = JSON.parse(defaults);
    const timeline = parsed[`__expo_widgets_${WIDGET_KIND}_timeline`];
    const layout = parsed[`__expo_widgets_${WIDGET_KIND}_layout`];

    if (timeline || layout) {
      return { plistPath, parsed };
    }
  }

  throw new Error(
    `Could not find ${GROUP_ID} defaults with widget keys. Open the app once, then tap Refresh widget on the Trip tab.`,
  );
}

function summarize(props) {
  if (!props || typeof props !== 'object') return '(missing props)';
  return `${props.mode ?? '?'} · ${props.headline ?? '?'} · ${props.stationName ?? '?'}`;
}

try {
  const deviceId = findBootedSimulator();
  const { plistPath, parsed } = findAppGroupPlist(deviceId);
  const layout = parsed[`__expo_widgets_${WIDGET_KIND}_layout`];
  const timeline = parsed[`__expo_widgets_${WIDGET_KIND}_timeline`] ?? [];

  console.log(`Simulator: ${deviceId}`);
  console.log(`App group plist: ${plistPath}`);
  console.log(`Layout registered: ${typeof layout === 'string' && layout.length > 0 ? 'yes' : 'no'}`);
  if (typeof layout === 'string') {
    console.log(`Layout length: ${layout.length} chars`);
  }

  if (!Array.isArray(timeline) || timeline.length === 0) {
    console.log('Timeline entries: 0');
    console.log('Status: widget data NOT seeded yet');
    process.exitCode = 1;
  } else {
    console.log(`Timeline entries: ${timeline.length}`);
    timeline.slice(0, 3).forEach((entry, index) => {
      console.log(`  [${index}] ${summarize(entry?.props)}`);
    });
    console.log('Status: widget data present');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
