export interface Station {
  name: string;
  lines: string[];
  types: string[];
  lat: number;
  lng: number;
}

export const stations: Station[] = [
  { name: "Pombal", lines: ["Linha do Norte"], types: ["Alfa Pendular", "Intercidades", "Regional"], lat: 39.9153, lng: -8.6283 },
  { name: "Alfarelos", lines: ["Linha do Norte"], types: ["Intercidades", "Regional"], lat: 40.1678, lng: -8.6514 },
  { name: "Coimbra-B", lines: ["Linha do Norte"], types: ["Alfa Pendular", "Intercidades", "Regional"], lat: 40.2117, lng: -8.4353 },
  { name: "Pampilhosa", lines: ["Linha do Norte", "Linha da Beira Alta"], types: ["Intercidades", "Regional"], lat: 40.3347, lng: -8.4028 },
  { name: "Mealhada", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.3783, lng: -8.4531 },
  { name: "Aveiro", lines: ["Linha do Norte"], types: ["Alfa Pendular", "Intercidades", "Regional"], lat: 40.6443, lng: -8.6455 },
  { name: "Estarreja", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.7536, lng: -8.5725 },
  { name: "Ovar", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.8608, lng: -8.6256 },
  { name: "Espinho", lines: ["Linha do Norte"], types: ["Regional"], lat: 41.0078, lng: -8.6403 },
  { name: "Vila Nova de Gaia-Devesas", lines: ["Linha do Norte"], types: ["Regional"], lat: 41.1236, lng: -8.6147 },
  { name: "São Bento (Porto)", lines: ["Linha do Minho", "Urban"], types: ["Urban", "Regional"], lat: 41.1456, lng: -8.6109 },
  { name: "Porto-Campanhã", lines: ["Linha do Norte", "Minho", "Douro"], types: ["Alfa Pendular", "Intercidades", "Urban", "Regional"], lat: 41.1489, lng: -8.5856 },
  { name: "Ermesinde", lines: ["Linha do Minho", "Douro"], types: ["Urban", "Regional"], lat: 41.2139, lng: -8.5528 },
  { name: "Trofa", lines: ["Linha do Minho"], types: ["Urban", "Regional"], lat: 41.3389, lng: -8.5600 },
  { name: "Santo Tirso", lines: ["Linha do Minho"], types: ["Urban", "Regional"], lat: 41.3450, lng: -8.4775 },
  { name: "Famalicão", lines: ["Linha do Minho"], types: ["Intercidades", "Regional"], lat: 41.4083, lng: -8.5219 },
  { name: "Nine", lines: ["Linha do Minho", "Braga"], types: ["Regional"], lat: 41.4200, lng: -8.5100 },
  { name: "Braga", lines: ["Linha de Braga"], types: ["Intercidades", "Regional"], lat: 41.5494, lng: -8.4344 },
  { name: "Lousado", lines: ["Linha de Guimarães"], types: ["Urban", "Regional"], lat: 41.3550, lng: -8.4950 },
  { name: "Guimarães", lines: ["Linha de Guimarães"], types: ["Urban", "Regional"], lat: 41.4400, lng: -8.2961 },
  { name: "Valongo", lines: ["Linha do Douro"], types: ["Urban", "Regional"], lat: 41.1900, lng: -8.4981 },
  { name: "Caíde", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1531, lng: -8.2886 },
  { name: "Marco de Canaveses", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1842, lng: -8.1508 },
  { name: "Livração", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1697, lng: -8.1167 },
  { name: "Amarante", lines: ["Linha do Tâmega (historic)"], types: ["Inactive / Historic"], lat: 41.2731, lng: -8.0833 },
  { name: "Peso da Régua", lines: ["Linha do Douro"], types: ["Intercidades", "Regional"], lat: 41.1636, lng: -7.7894 },
  { name: "Barcelos", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.5333, lng: -8.6167 },
  { name: "Viana do Castelo", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.6936, lng: -8.8389 },
  { name: "Valença", lines: ["Linha do Minho"], types: ["Regional"], lat: 42.0275, lng: -8.6425 },
  // Smaller / regional stops
  { name: "Cacia", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.6833, lng: -8.5972 },
  { name: "Salreu", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.7222, lng: -8.5806 },
  { name: "Esmoriz", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.9633, lng: -8.6356 },
  { name: "Granja", lines: ["Linha do Norte"], types: ["Regional"], lat: 41.0344, lng: -8.6483 },
  { name: "Darque", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.6822, lng: -8.8264 },
  { name: "Afife", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.7625, lng: -8.8506 },
  { name: "Vila Praia de Âncora", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.8133, lng: -8.8631 },
  { name: "Caminha", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.8722, lng: -8.8408 },
  { name: "Mesão Frio", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1614, lng: -7.8772 },
  { name: "Pinhão", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1894, lng: -7.5478 },
  { name: "Tua", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.2128, lng: -7.4178 },
  { name: "Vizela", lines: ["Linha de Guimarães"], types: ["Urban", "Regional"], lat: 41.3789, lng: -8.3014 },
  // Additional northern stops
  { name: "Souselas", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.2778, lng: -8.4108 },
  { name: "Curia", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.4322, lng: -8.4644 },
  { name: "Oliveira do Bairro", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.5128, lng: -8.4961 },
  { name: "Válega", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.8806, lng: -8.6097 },
  { name: "Contumil", lines: ["Linha do Minho", "Linha do Norte"], types: ["Urban", "Regional"], lat: 41.1656, lng: -8.5836 },
  { name: "Rio Tinto", lines: ["Linha do Minho"], types: ["Urban", "Regional"], lat: 41.1797, lng: -8.5683 },
  { name: "Tamel", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.5172, lng: -8.5642 },
  { name: "Durrães", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.5853, lng: -8.7136 },
  { name: "Carreço", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.7372, lng: -8.8628 },
  { name: "Areosa", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.7150, lng: -8.8533 },
  { name: "Aregos", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.0944, lng: -8.0481 },
  { name: "Mosteirô", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.0786, lng: -8.1283 },
  { name: "Caldas de Vizela", lines: ["Linha de Guimarães"], types: ["Urban", "Regional"], lat: 41.3811, lng: -8.3197 },
  { name: "Lordelo", lines: ["Linha de Guimarães"], types: ["Urban", "Regional"], lat: 41.3964, lng: -8.3461 },
  { name: "Mirandela", lines: ["Linha do Tua (historic)"], types: ["Inactive / Historic"], lat: 41.4869, lng: -7.1858 },
];

export function getAppleMapsUrl(station: Station): string {
  return `https://maps.apple.com/?q=${encodeURIComponent(station.name + " station Portugal")}&ll=${station.lat},${station.lng}&z=15`;
}

export function getOSMUrl(station: Station): string {
  return `https://www.openstreetmap.org/?mlat=${station.lat}&mlon=${station.lng}#map=16/${station.lat}/${station.lng}`;
}

export function getBookingSearchUrl(station: Station): string {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(station.name + ", Portugal")}&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price`;
}
