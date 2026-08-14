const { withAppBuildGradle } = require("expo/config-plugins");

const MARKER = "verystaysReleaseArtifactNames";

const GRADLE_SNIPPET = `
// ${MARKER}: name APK/AAB as VeryStays-<versionName>-<versionCode>.*
android.applicationVariants.configureEach { variant ->
    def artifactBase = "VeryStays-\${variant.versionName}-\${variant.versionCode}"

    variant.outputs.configureEach { output ->
        output.outputFileName = "\${artifactBase}.apk"
    }

    // Copy (do not rename) the signed AAB so AGP tasks that still expect
    // app-<variant>.aab keep working.
    def capName = variant.name.substring(0, 1).toUpperCase() + variant.name.substring(1)
    tasks.configureEach { task ->
        if (task.name != "sign\${capName}Bundle") return
        task.doLast {
            def outDir = file("\${project.layout.buildDirectory.get().asFile}/outputs/bundle/\${variant.name}")
            def candidates = [
                new File(outDir, "app-\${variant.name}.aab"),
                new File(outDir, "app-release.aab"),
                new File(outDir, "app-debug.aab"),
            ]
            def target = new File(outDir, "\${artifactBase}.aab")
            def source = candidates.find { it.exists() }
            if (source != null && source.canonicalFile != target.canonicalFile) {
                java.nio.file.Files.copy(
                    source.toPath(),
                    target.toPath(),
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING,
                )
                logger.lifecycle("Versioned bundle → \${target.name}")
            }
        }
    }
}
`;

/**
 * Name release/debug APK and AAB files:
 *   VeryStays-<versionName>-<versionCode>.apk|aab
 * Survives `expo prebuild`.
 */
function withAndroidReleaseArtifactNames(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    const markerIndex = contents.indexOf(`// ${MARKER}`);
    if (markerIndex !== -1) {
      contents = contents.slice(0, markerIndex).trimEnd();
    }

    contents = `${contents}\n${GRADLE_SNIPPET}\n`;
    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withAndroidReleaseArtifactNames;
