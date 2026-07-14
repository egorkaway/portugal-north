import Constants from 'expo-constants';

export function getAppBuildLabel(): string {
  const version = Constants.expoConfig?.version ?? '1.0';
  const build =
    Constants.nativeBuildVersion ??
    Constants.expoConfig?.ios?.buildNumber ??
    (Constants.expoConfig?.android?.versionCode != null
      ? String(Constants.expoConfig.android.versionCode)
      : undefined);

  return build ? `${version} (${build})` : version;
}
