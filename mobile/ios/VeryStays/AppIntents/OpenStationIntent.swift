import AppIntents
import UIKit

/// Opens a station page in VeryStays via deep link (Siri / Shortcuts).
struct OpenStationIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Station"
  static var description = IntentDescription("Open a train or airport station in VeryStays")
  static var openAppWhenRun = true

  @Parameter(title: "Station", requestValueDialog: "Which station?")
  var station: StationEntity

  static var parameterSummary: some ParameterSummary {
    Summary("Open \(\.$station) in VeryStays")
  }

  @MainActor
  func perform() async throws -> some IntentResult {
    guard let url = station.deepLinkURL else {
      return .result()
    }
    await UIApplication.shared.open(url)
    return .result()
  }
}

struct OpenMapIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Map"
  static var description = IntentDescription("Open the VeryStays station map")
  static var openAppWhenRun = true

  @MainActor
  func perform() async throws -> some IntentResult {
    guard let url = URL(string: "verystays://map") else {
      return .result()
    }
    await UIApplication.shared.open(url)
    return .result()
  }
}

struct OpenTripIntent: AppIntent {
  static var title: LocalizedStringResource = "Open Trip"
  static var description = IntentDescription("Open your active train trip in VeryStays")
  static var openAppWhenRun = true

  @MainActor
  func perform() async throws -> some IntentResult {
    guard let url = URL(string: "verystays://trip") else {
      return .result()
    }
    await UIApplication.shared.open(url)
    return .result()
  }
}
