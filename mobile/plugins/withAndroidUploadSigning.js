const { withAppBuildGradle } = require("expo/config-plugins");

/**
 * Wire Play Store upload keystore from mobile/credentials/ into release signing.
 * Survives `expo prebuild` (android/ is regenerated).
 *
 * Expects:
 *   mobile/credentials/keystore.properties
 *   mobile/credentials/upload-keystore.jks
 */
function withAndroidUploadSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (contents.includes("verystaysUploadKeystoreProperties")) {
      return config;
    }

    const propsBlock = `
// VeryStays upload keystore (Play Store). Lives outside generated android/.
def verystaysUploadKeystorePropertiesFile = rootProject.file("../credentials/keystore.properties")
def verystaysUploadKeystoreProperties = new Properties()
if (verystaysUploadKeystorePropertiesFile.exists()) {
    verystaysUploadKeystoreProperties.load(new FileInputStream(verystaysUploadKeystorePropertiesFile))
}
`;

    if (!contents.includes("def projectRoot")) {
      throw new Error("withAndroidUploadSigning: unexpected app/build.gradle shape");
    }
    contents = contents.replace(
      "def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()",
      `def projectRoot = rootDir.getAbsoluteFile().getParentFile().getAbsolutePath()\n${propsBlock}`,
    );

    const releaseSigningConfig = `
        release {
            if (verystaysUploadKeystorePropertiesFile.exists()) {
                keyAlias verystaysUploadKeystoreProperties['keyAlias']
                keyPassword verystaysUploadKeystoreProperties['keyPassword']
                storeFile rootProject.file("../credentials/" + verystaysUploadKeystoreProperties['storeFile'])
                storePassword verystaysUploadKeystoreProperties['storePassword']
            }
        }`;

    contents = contents.replace(
      /signingConfigs \{\s*debug \{[\s\S]*?\}\s*\}/,
      (match) => {
        if (match.includes("release {")) return match;
        return match.replace(/\}\s*$/, `${releaseSigningConfig}\n    }`);
      },
    );

    contents = contents.replace(
      /release \{\s*\/\/ Caution![\s\S]*?signingConfig signingConfigs\.debug/,
      (match) =>
        match.replace(
          "signingConfig signingConfigs.debug",
          "signingConfig verystaysUploadKeystorePropertiesFile.exists() ? signingConfigs.release : signingConfigs.debug",
        ),
    );

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withAndroidUploadSigning;
