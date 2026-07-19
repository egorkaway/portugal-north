import AppIntents
import Foundation

struct StationEntity: AppEntity, Identifiable {
  static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "Station")
  static var defaultQuery = StationEntityQuery()

  var id: String
  var name: String
  var lines: [String]
  var country: String

  var displayRepresentation: DisplayRepresentation {
    let lineBits = lines.prefix(2).joined(separator: " · ")
    let place = country == "es" ? "Spain" : "Portugal"
    let subtitle = lineBits.isEmpty ? place : "\(lineBits) · \(place)"
    return DisplayRepresentation(title: "\(name)", subtitle: "\(subtitle)")
  }

  init(id: String, name: String, lines: [String], country: String) {
    self.id = id
    self.name = name
    self.lines = lines
    self.country = country
  }

  init(record: SiriStationRecord) {
    self.init(id: record.id, name: record.name, lines: record.lines, country: record.country)
  }

  var deepLinkURL: URL? {
    URL(string: "verystays://station/\(id)")
  }
}

struct StationEntityQuery: EntityStringQuery {
  func entities(for identifiers: [StationEntity.ID]) async throws -> [StationEntity] {
    identifiers.compactMap { id in
      StationCatalog.station(id: id).map(StationEntity.init(record:))
    }
  }

  func entities(matching string: String) async throws -> [StationEntity] {
    StationCatalog.matching(string).prefix(25).map(StationEntity.init(record:))
  }

  func suggestedEntities() async throws -> [StationEntity] {
    let preferred = [
      "lisboa-oriente",
      "porto-campanha",
      "aveiro",
      "coimbra-b",
      "faro",
      "lisbon-airport-lis",
      "porto-airport-opo",
      "madrid-chamartin",
      "barcelona-sants",
      "santiago-de-compostela",
    ]
    let preferredEntities = preferred.compactMap { id in
      StationCatalog.station(id: id).map(StationEntity.init(record:))
    }
    if preferredEntities.count >= 8 {
      return preferredEntities
    }
    return Array(StationCatalog.all.prefix(20).map(StationEntity.init(record:)))
  }
}
