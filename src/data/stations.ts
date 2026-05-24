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
  // Further additions
  { name: "Coimbra", lines: ["Ramal de Coimbra"], types: ["Urban", "Regional"], lat: 40.2050, lng: -8.4297 },
  { name: "Mogofores", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.4467, lng: -8.4719 },
  { name: "Avanca", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.8083, lng: -8.5917 },
  { name: "Penafiel", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.2050, lng: -8.2842 },
  { name: "Paredes", lines: ["Linha do Douro"], types: ["Urban", "Regional"], lat: 41.2061, lng: -8.3361 },
  { name: "Cete", lines: ["Linha do Douro"], types: ["Urban", "Regional"], lat: 41.1989, lng: -8.3744 },
  { name: "Recarei-Sobreira", lines: ["Linha do Douro"], types: ["Urban", "Regional"], lat: 41.1731, lng: -8.4364 },
  { name: "Vila Meã", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1850, lng: -8.0394 },
  { name: "Rio Mau", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1644, lng: -8.0786 },
  { name: "Águeda", lines: ["Linha do Vouga (historic)"], types: ["Inactive / Historic"], lat: 40.5775, lng: -8.4467 },
  { name: "Sernada do Vouga", lines: ["Linha do Vouga (historic)"], types: ["Inactive / Historic"], lat: 40.6889, lng: -8.4014 },
  { name: "Macinhata do Vouga", lines: ["Linha do Vouga (historic)"], types: ["Inactive / Historic"], lat: 40.6500, lng: -8.4639 },
  // Even more northern stops
  { name: "Cortegaça", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.9408, lng: -8.6356 },
  { name: "Taveiro", lines: ["Linha do Norte"], types: ["Regional"], lat: 40.1822, lng: -8.4731 },
  { name: "Lousada", lines: ["Linha do Douro"], types: ["Urban", "Regional"], lat: 41.2783, lng: -8.2811 },
  { name: "Vila Nova de Cerveira", lines: ["Linha do Minho"], types: ["Regional"], lat: 41.9419, lng: -8.7392 },
  { name: "Pocinho", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1361, lng: -7.1219 },
  { name: "Ferradosa", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1856, lng: -7.3489 },
  { name: "Vesúvio", lines: ["Linha do Douro"], types: ["Regional"], lat: 41.1583, lng: -7.2497 },
  { name: "Bragança", lines: ["Linha do Tua (historic)"], types: ["Inactive / Historic"], lat: 41.8061, lng: -6.7567 },
  // Lisbon area
  { name: "Lisboa Santa Apolónia", lines: ["Linha do Norte"], types: ["Alfa Pendular", "Intercidades", "Urban"], lat: 38.7139, lng: -9.1225 },
  { name: "Lisboa Oriente", lines: ["Linha do Norte", "Linha do Sul"], types: ["Alfa Pendular", "Intercidades", "Urban", "Regional"], lat: 38.7681, lng: -9.0994 },
  { name: "Lisboa Rossio", lines: ["Linha de Sintra"], types: ["Urban"], lat: 38.7144, lng: -9.1397 },
  { name: "Cais do Sodré", lines: ["Linha de Cascais"], types: ["Urban"], lat: 38.7058, lng: -9.1442 },
  { name: "Cascais", lines: ["Linha de Cascais"], types: ["Urban"], lat: 38.6967, lng: -9.4197 },
  { name: "Sintra", lines: ["Linha de Sintra"], types: ["Urban"], lat: 38.7989, lng: -9.3856 },
  { name: "Setúbal", lines: ["Linha do Sul"], types: ["Intercidades", "Urban", "Regional"], lat: 38.5292, lng: -8.8836 },
  // Centro & Linha do Oeste
  { name: "Entroncamento", lines: ["Linha do Norte", "Linha da Beira Baixa"], types: ["Alfa Pendular", "Intercidades", "Regional"], lat: 39.4661, lng: -8.4694 },
  { name: "Santarém", lines: ["Linha do Norte"], types: ["Alfa Pendular", "Intercidades", "Regional"], lat: 39.2369, lng: -8.6822 },
  { name: "Tomar", lines: ["Ramal de Tomar"], types: ["Regional"], lat: 39.6028, lng: -8.4128 },
  { name: "Caldas da Rainha", lines: ["Linha do Oeste"], types: ["Regional"], lat: 39.4047, lng: -9.1369 },
  { name: "Leiria", lines: ["Linha do Oeste"], types: ["Regional"], lat: 39.7472, lng: -8.8067 },
  { name: "Figueira da Foz", lines: ["Ramal de Alfarelos"], types: ["Regional"], lat: 40.1494, lng: -8.8556 },
  // Beira interior
  { name: "Castelo Branco", lines: ["Linha da Beira Baixa"], types: ["Intercidades", "Regional"], lat: 39.8200, lng: -7.5089 },
  { name: "Covilhã", lines: ["Linha da Beira Baixa"], types: ["Intercidades", "Regional"], lat: 40.2742, lng: -7.4969 },
  { name: "Guarda", lines: ["Linha da Beira Alta"], types: ["Intercidades", "Regional"], lat: 40.5378, lng: -7.2706 },
  { name: "Vilar Formoso", lines: ["Linha da Beira Alta"], types: ["Intercidades", "Regional"], lat: 40.6133, lng: -6.8358 },
  { name: "Viseu", lines: ["Linha do Dão (historic)"], types: ["Inactive / Historic"], lat: 40.6614, lng: -7.9111 },
  // Alentejo
  { name: "Évora", lines: ["Linha do Alentejo"], types: ["Intercidades", "Regional"], lat: 38.5719, lng: -7.9089 },
  { name: "Beja", lines: ["Linha do Alentejo"], types: ["Intercidades", "Regional"], lat: 38.0156, lng: -7.8639 },
  // Algarve
  { name: "Faro", lines: ["Linha do Algarve"], types: ["Alfa Pendular", "Intercidades", "Regional"], lat: 37.0186, lng: -7.9319 },
  { name: "Albufeira-Ferreiras", lines: ["Linha do Algarve"], types: ["Alfa Pendular", "Intercidades", "Regional"], lat: 37.1228, lng: -8.2278 },
  { name: "Tunes", lines: ["Linha do Algarve", "Linha do Sul"], types: ["Alfa Pendular", "Intercidades", "Regional"], lat: 37.1722, lng: -8.2628 },
  { name: "Lagos", lines: ["Linha do Algarve"], types: ["Regional"], lat: 37.1014, lng: -8.6722 },
  { name: "Portimão", lines: ["Linha do Algarve"], types: ["Regional"], lat: 37.1417, lng: -8.5333 },
  { name: "Tavira", lines: ["Linha do Algarve"], types: ["Regional"], lat: 37.1278, lng: -7.6500 },
  { name: "Vila Real de Santo António", lines: ["Linha do Algarve"], types: ["Regional"], lat: 37.1956, lng: -7.4153 },
  // Lisbon south bank & Oeste
  { name: "Pragal", lines: ["Linha do Sul"], types: ["Alfa Pendular", "Intercidades", "Urban"], lat: 38.6736, lng: -9.1633 },
  { name: "Pinhal Novo", lines: ["Linha do Sul", "Linha do Alentejo"], types: ["Intercidades", "Urban", "Regional"], lat: 38.6361, lng: -8.9117 },
  { name: "Barreiro", lines: ["Linha do Sul (historic terminus)"], types: ["Urban", "Regional"], lat: 38.6644, lng: -9.0742 },
  { name: "Torres Vedras", lines: ["Linha do Oeste"], types: ["Regional"], lat: 39.0928, lng: -9.2603 },
  { name: "Mira Sintra-Meleças", lines: ["Linha do Oeste", "Linha de Sintra"], types: ["Urban"], lat: 38.8056, lng: -9.3322 },
  // Beira Baixa & Alto Alentejo
  { name: "Abrantes", lines: ["Linha da Beira Baixa"], types: ["Intercidades", "Regional"], lat: 39.4675, lng: -8.2008 },
  { name: "Portalegre", lines: ["Linha do Leste"], types: ["Regional"], lat: 39.2517, lng: -7.4444 },
  { name: "Elvas", lines: ["Linha do Leste"], types: ["Regional"], lat: 38.8775, lng: -7.1758 },
  { name: "Vendas Novas", lines: ["Linha do Alentejo", "Ramal de Vendas Novas"], types: ["Regional"], lat: 38.6772, lng: -8.4533 },
  // Algarve additions
  { name: "Olhão", lines: ["Linha do Algarve"], types: ["Regional"], lat: 37.0289, lng: -7.8425 },
  { name: "Loulé", lines: ["Linha do Algarve"], types: ["Intercidades", "Regional"], lat: 37.0833, lng: -8.0411 },
  { name: "Silves", lines: ["Linha do Algarve"], types: ["Regional"], lat: 37.1922, lng: -8.4400 },
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
