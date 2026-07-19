import AppIntents

struct VeryStaysShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: OpenStationIntent(),
      phrases: [
        "Open \(\.$station) in \(.applicationName)",
        "Show \(\.$station) in \(.applicationName)",
        "Open station \(\.$station) with \(.applicationName)",
        "\(.applicationName) open \(\.$station)",
      ],
      shortTitle: "Open Station",
      systemImageName: "tram.fill"
    )

    AppShortcut(
      intent: OpenMapIntent(),
      phrases: [
        "Open map in \(.applicationName)",
        "Show station map in \(.applicationName)",
        "\(.applicationName) map",
      ],
      shortTitle: "Open Map",
      systemImageName: "map"
    )

    AppShortcut(
      intent: OpenTripIntent(),
      phrases: [
        "Open my trip in \(.applicationName)",
        "Show my train in \(.applicationName)",
        "\(.applicationName) trip",
      ],
      shortTitle: "Open Trip",
      systemImageName: "clock"
    )
  }
}
