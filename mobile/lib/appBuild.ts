import Constants from 'expo-constants';

export function getAppBuildLabel(): string {
  const build =
    Constants.nativeBuildVersion ??
    Constants.expoConfig?.ios?.buildNumber ??
    (Constants.expoConfig?.android?.versionCode != null
      ? String(Constants.expoConfig.android.versionCode)
      : undefined);

  return build ? `Build ${build}` : '';
}
