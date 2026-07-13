import WidgetKit
import SwiftUI
import UIKit
internal import ExpoWidgets

private extension Color {
  static let tripWidgetBackground = Color(
    uiColor: UIColor { traits in
      if traits.userInterfaceStyle == .dark {
        return UIColor(red: 1 / 255, green: 40 / 255, blue: 65 / 255, alpha: 1)
      }
      return UIColor(red: 245 / 255, green: 247 / 255, blue: 248 / 255, alpha: 1)
    }
  )
}

struct TripWidget: Widget {
  let name: String = "TripWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: name, provider: WidgetsTimelineProvider(name: name)) { entry in
      if #available(iOS 17.0, *) {
        WidgetsEntryView(entry: entry)
          .containerBackground(Color.tripWidgetBackground, for: .widget)
      } else {
        WidgetsEntryView(entry: entry)
      }
    }
    .configurationDisplayName("Train countdown")
    .description("Countdown to your next train, last trip taken, or nearest station.")
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryInline])
  }
}