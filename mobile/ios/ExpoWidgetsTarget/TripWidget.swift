import WidgetKit
import SwiftUI
internal import ExpoWidgets

struct TripWidget: Widget {
  let name: String = "TripWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: name, provider: WidgetsTimelineProvider(name: name)) { entry in
      WidgetsEntryView(entry: entry)
    }
    .configurationDisplayName("Train countdown")
    .description("Countdown to your next train, last trip taken, or nearest station.")
    .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular, .accessoryInline])
  }
}