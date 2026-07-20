const { withXcodeProject } = require('@expo/config-plugins');

const SUPPORTED_REGIONS = ['en', 'Base', 'pt', 'es', 'gl', 'ca', 'uk', 'ru'];

/**
 * Ensures Xcode knownRegions lists every app language so Settings → Language
 * and .lproj resources stay aligned across prebuilds.
 */
function withKnownRegions(config) {
  return withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const pbxProjectSection = project.pbxProjectSection();
    for (const key of Object.keys(pbxProjectSection)) {
      const entry = pbxProjectSection[key];
      if (!entry || typeof entry !== 'object' || !Array.isArray(entry.knownRegions)) continue;
      const merged = [...SUPPORTED_REGIONS];
      for (const region of entry.knownRegions) {
        if (!merged.includes(region)) merged.push(region);
      }
      entry.knownRegions = merged;
    }
    return cfg;
  });
}

module.exports = withKnownRegions;
