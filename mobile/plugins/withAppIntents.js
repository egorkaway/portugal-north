const { withDangerousMod, withXcodeProject, IOSConfig } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const SWIFT_FILES = [
  'StationCatalog.swift',
  'StationEntity.swift',
  'OpenStationIntent.swift',
  'VeryStaysShortcuts.swift',
];

const RESOURCE_FILE = 'stations-siri.json';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyAppIntentSources(projectRoot, platformProjectRoot) {
  const srcDir = path.join(projectRoot, 'ios', 'VeryStays', 'AppIntents');
  const destDir = path.join(platformProjectRoot, 'VeryStays', 'AppIntents');
  ensureDir(destDir);

  for (const file of SWIFT_FILES) {
    const from = path.join(srcDir, file);
    const to = path.join(destDir, file);
    if (fs.existsSync(from)) {
      fs.copyFileSync(from, to);
    }
  }

  const resourceSrc = path.join(projectRoot, 'ios', 'VeryStays', 'Resources', RESOURCE_FILE);
  const resourceDestDir = path.join(platformProjectRoot, 'VeryStays', 'Resources');
  ensureDir(resourceDestDir);
  if (fs.existsSync(resourceSrc)) {
    fs.copyFileSync(resourceSrc, path.join(resourceDestDir, RESOURCE_FILE));
  }
}

function addSwiftFileToVeryStays(project, fileName) {
  const groupName = 'VeryStays';
  const relativePath = `VeryStays/AppIntents/${fileName}`;
  const already = project.hasFile(relativePath) || project.hasFile(`AppIntents/${fileName}`);
  if (already) return;

  // Prefer Expo helper when available; fall back to raw pbx mutation.
  if (typeof IOSConfig?.XcodeUtils?.addBuildSourceFileToGroup === 'function') {
    IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
      filepath: relativePath,
      groupName,
      project,
      verbose: false,
    });
    return;
  }

  const fileRef = project.addFile(relativePath, project.findPBXGroupKey({ name: groupName }), {
    target: project.getFirstTarget().uuid,
    lastKnownFileType: 'sourcecode.swift',
  });
  if (fileRef) {
    project.addToPbxBuildFileSection(fileRef);
    const target = project.getFirstTarget();
    project.addToPbxSourcesBuildPhase(fileRef, target.uuid);
  }
}

function addResourceToVeryStays(project) {
  const relativePath = `VeryStays/Resources/${RESOURCE_FILE}`;
  if (project.hasFile(relativePath)) return;

  const groupName = 'VeryStays';
  const groupKey = project.findPBXGroupKey({ name: groupName });
  if (!groupKey) return;

  const fileRef = project.addResourceFile(relativePath, { target: project.getFirstTarget().uuid }, groupKey);
  if (!fileRef) {
    // Older xcode API: addFile + resources build phase
    const ref = project.addFile(relativePath, groupKey, {
      lastKnownFileType: 'text.json',
      target: project.getFirstTarget().uuid,
    });
    if (ref) {
      project.addToPbxBuildFileSection(ref);
      project.addToPbxResourcesBuildPhase(ref);
    }
  }
}

/**
 * Keeps App Intent Swift sources + stations-siri.json in the VeryStays app target
 * across prebuild, and copies them into the generated ios/ tree.
 */
function withAppIntents(config) {
  config = withDangerousMod(config, [
    'ios',
    async (cfg) => {
      copyAppIntentSources(cfg.modRequest.projectRoot, cfg.modRequest.platformProjectRoot);
      return cfg;
    },
  ]);

  config = withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    for (const file of SWIFT_FILES) {
      try {
        addSwiftFileToVeryStays(project, file);
      } catch (error) {
        console.warn(`[withAppIntents] could not add ${file}:`, error.message);
      }
    }
    try {
      addResourceToVeryStays(project);
    } catch (error) {
      console.warn('[withAppIntents] could not add stations-siri.json:', error.message);
    }
    return cfg;
  });

  return config;
}

module.exports = withAppIntents;
