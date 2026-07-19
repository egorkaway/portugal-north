import Foundation

/// Compact station row baked into the app for Siri / Shortcuts entity resolution.
struct SiriStationRecord: Codable, Hashable, Sendable {
  let id: String
  let name: String
  let lines: [String]
  let country: String
}

enum StationCatalog {
  private static let resourceName = "stations-siri"
  private static let resourceExtension = "json"

  private static let cached: [SiriStationRecord] = {
    guard
      let url = Bundle.main.url(forResource: resourceName, withExtension: resourceExtension),
      let data = try? Data(contentsOf: url),
      let decoded = try? JSONDecoder().decode([SiriStationRecord].self, from: data)
    else {
      return []
    }
    return decoded
  }()

  static var all: [SiriStationRecord] { cached }

  static func station(id: String) -> SiriStationRecord? {
    cached.first { $0.id == id }
  }

  static func matching(_ query: String) -> [SiriStationRecord] {
    let needle = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
    guard !needle.isEmpty else { return Array(cached.prefix(40)) }

    return cached.filter { station in
      station.name.lowercased().contains(needle)
        || station.id.contains(needle)
        || station.lines.contains { $0.lowercased().contains(needle) }
    }
  }
}
