const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const SWIFT_IMPORT = 'import UIKit\n';

const SWIFT_COLOR_HELPER = `
private extension Color {
  static let tripWidgetBackground = Color(
    uiColor: UIColor { traits in
      if traits.userInterfaceStyle == .dark {
        return UIColor(red: 1 / 255, green: 40 / 255, blue: 65 / 255, alpha: 1)
      }
      return UIColor(red: 1, green: 1, blue: 1, alpha: 1)
    }
  )
}
`;

const WRAPPED_ENTRY = `if #available(iOS 17.0, *) {
        Group {
          WidgetsEntryView(entry: entry)
        }
        .containerBackground(for: .widget) {
          Color.tripWidgetBackground
        }
      } else {
        WidgetsEntryView(entry: entry)
      }`;

/** Ensures TripWidget.swift adopts WidgetKit containerBackground after expo-widgets codegen. */
function withWidgetContainerBackground(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const swiftPath = path.join(
        config.modRequest.platformProjectRoot,
        'ExpoWidgetsTarget',
        'TripWidget.swift',
      );

      if (!fs.existsSync(swiftPath)) {
        return config;
      }

      let contents = fs.readFileSync(swiftPath, 'utf8');

      if (!contents.includes('import UIKit')) {
        contents = contents.replace('import SwiftUI\n', `import SwiftUI\n${SWIFT_IMPORT}`);
      }

      if (!contents.includes('tripWidgetBackground')) {
        contents = contents.replace(
          'internal import ExpoWidgets\n',
          `internal import ExpoWidgets\n${SWIFT_COLOR_HELPER}\n`,
        );
      }

      if (!contents.includes('.containerBackground(for: .widget)')) {
        contents = contents.replace(
          /StaticConfiguration\(kind: name, provider: WidgetsTimelineProvider\(name: name\)\) \{ entry in\n\s*WidgetsEntryView\(entry: entry\)\n\s*\}/,
          `StaticConfiguration(kind: name, provider: WidgetsTimelineProvider(name: name)) { entry in\n      ${WRAPPED_ENTRY}\n    }`,
        );
      }

      fs.writeFileSync(swiftPath, contents);
      return config;
    },
  ]);
}

module.exports = withWidgetContainerBackground;
