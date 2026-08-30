const { AndroidConfig, withAndroidManifest } = require('expo/config-plugins');

const BILLING_PERMISSION = 'com.android.vending.BILLING';
const PLAY_STORE_PACKAGE = 'com.android.vending';

function ensurePlayStoreQuery(androidManifest) {
  const manifest = androidManifest.manifest;
  if (!manifest.queries) {
    manifest.queries = [{}];
  }
  const queries = manifest.queries[0];
  if (!queries.package) {
    queries.package = [];
  }
  const already = queries.package.some(
    (item) => item.$?.['android:name'] === PLAY_STORE_PACKAGE,
  );
  if (!already) {
    queries.package.push({ $: { 'android:name': PLAY_STORE_PACKAGE } });
  }
  return androidManifest;
}

/**
 * Google Play Billing needs the BILLING permission plus a Play Store package
 * query so Android 11+ can see the store. Survives `expo prebuild`.
 */
function withAndroidPlayBilling(config) {
  config = AndroidConfig.Permissions.withPermissions(config, [BILLING_PERMISSION]);
  return withAndroidManifest(config, (cfg) => {
    cfg.modResults = ensurePlayStoreQuery(cfg.modResults);
    return cfg;
  });
}

module.exports = withAndroidPlayBilling;
