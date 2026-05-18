export interface Hotel {
  name: string;
  distanceKm: number;
  priceFrom: number; // EUR per night
  bookingUrl: string;
}

export type StationHotels = Record<string, Hotel[]>;

// Curated list of budget hotels within ~2km of each station
// Prices are approximate starting rates in EUR
export const stationHotels: StationHotels = {
  "Pombal": [
    { name: "Hotel Cardal", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/cardal.html" },
    { name: "Residencial Marquês", distanceKm: 0.5, priceFrom: 30, bookingUrl: "https://www.booking.com/hotel/pt/residencial-marques-pombal.html" },
    { name: "Casa do Castelo", distanceKm: 1.2, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/casa-do-castelo-pombal.html" },
  ],
  "Alfarelos": [
    { name: "Casa da Azenha", distanceKm: 1.5, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alfarelos%2C+Portugal&order=price" },
    { name: "Quinta do Mosteiro", distanceKm: 1.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alfarelos%2C+Portugal&order=price" },
    { name: "Albergaria Alfarelos", distanceKm: 0.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alfarelos%2C+Portugal&order=price" },
  ],
  "Coimbra-B": [
    { name: "Stay Hotel Coimbra Centro", distanceKm: 1.5, priceFrom: 39, bookingUrl: "https://www.booking.com/hotel/pt/stay-coimbra-centro.html" },
    { name: "Bus Station Suites & Studios", distanceKm: 1.3, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/bus-station-suites-studios.html" },
    { name: "Hotel Mondego", distanceKm: 1.8, priceFrom: 42, bookingUrl: "https://www.booking.com/hotel/pt/mondego.html" },
  ],
  "Pampilhosa": [
    { name: "Residencial Pampilhosa", distanceKm: 0.3, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pampilhosa%2C+Portugal&order=price" },
    { name: "Casa Rural Pampilhosa", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pampilhosa%2C+Portugal&order=price" },
    { name: "Quinta da Mealhada", distanceKm: 1.9, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pampilhosa%2C+Portugal&order=price" },
  ],
  "Mealhada": [
    { name: "Hotel Residencial Familiar", distanceKm: 0.4, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mealhada%2C+Portugal&order=price" },
    { name: "Pensão Central Mealhada", distanceKm: 0.3, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mealhada%2C+Portugal&order=price" },
    { name: "Hotel D. Afonso", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mealhada%2C+Portugal&order=price" },
  ],
  "Aveiro": [
    { name: "Aveiro Train Guesthouse", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/hotel/pt/aveiro-train-guesthouse.html" },
    { name: "Aveiro White House", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/aveiro-white-house.html" },
    { name: "Hotel das Salinas", distanceKm: 1.0, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/das-salinas.html" },
  ],
  "Estarreja": [
    { name: "Residencial Estarreja", distanceKm: 0.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estarreja%2C+Portugal&order=price" },
    { name: "Casa do Anjo", distanceKm: 1.0, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estarreja%2C+Portugal&order=price" },
    { name: "Pensão São José", distanceKm: 0.8, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estarreja%2C+Portugal&order=price" },
  ],
  "Ovar": [
    { name: "Hotel Residencial Palanca Negra", distanceKm: 0.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ovar%2C+Portugal&order=price" },
    { name: "Pensão Albano", distanceKm: 0.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ovar%2C+Portugal&order=price" },
    { name: "Casa da Praça Ovar", distanceKm: 0.9, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ovar%2C+Portugal&order=price" },
  ],
  "Espinho": [
    { name: "Residencial São José", distanceKm: 0.4, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espinho%2C+Portugal&order=price" },
    { name: "Hotel Praiagolfe", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/praiagolfe.html" },
    { name: "Pensão Espinhense", distanceKm: 0.3, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espinho%2C+Portugal&order=price" },
  ],
  "Vila Nova de Gaia-Devesas": [
    { name: "Opohotel Porto Aeroporto", distanceKm: 1.5, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Devesas%2C+Vila+Nova+de+Gaia%2C+Portugal&order=price" },
    { name: "Gaia Guest House", distanceKm: 0.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Devesas%2C+Vila+Nova+de+Gaia%2C+Portugal&order=price" },
    { name: "Residencial Portucale Gaia", distanceKm: 1.2, priceFrom: 33, bookingUrl: "https://www.booking.com/searchresults.html?ss=Devesas%2C+Vila+Nova+de+Gaia%2C+Portugal&order=price" },
  ],
  "São Bento (Porto)": [
    { name: "Mystay Porto São Bento", distanceKm: 0.1, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/mystay-porto-sao-bento.html" },
    { name: "Mirandesa Guesthouse", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/mirandesa-guesthouse.html" },
    { name: "H.ö.H Guest House Porto", distanceKm: 0.5, priceFrom: 42, bookingUrl: "https://www.booking.com/hotel/pt/h-o-h-guest-house.html" },
  ],
  "Porto-Campanhã": [
    { name: "Campanha Boutique Station B&B", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/campanha-boutique-station.html" },
    { name: "ABC Hotel Porto Campanhã", distanceKm: 0.5, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/abc-porto.html" },
    { name: "Star Inn Porto", distanceKm: 1.5, priceFrom: 42, bookingUrl: "https://www.booking.com/hotel/pt/star-inn-porto.html" },
  ],
  "Ermesinde": [
    { name: "Residencial Ermesinde", distanceKm: 0.4, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ermesinde%2C+Portugal&order=price" },
    { name: "Guest House Ermesinde", distanceKm: 0.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ermesinde%2C+Portugal&order=price" },
    { name: "Casa do Valado", distanceKm: 1.5, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ermesinde%2C+Portugal&order=price" },
  ],
  "Trofa": [
    { name: "Residencial Trofa", distanceKm: 0.5, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Trofa%2C+Portugal&order=price" },
    { name: "Casa da Ponte Trofa", distanceKm: 1.0, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Trofa%2C+Portugal&order=price" },
    { name: "Hotel Trofa", distanceKm: 0.8, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Trofa%2C+Portugal&order=price" },
  ],
  "Santo Tirso": [
    { name: "Cidnay Hotel", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/cidnay.html" },
    { name: "Residencial São Rosendo", distanceKm: 0.4, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santo+Tirso%2C+Portugal&order=price" },
    { name: "Casa do Tojal", distanceKm: 1.5, priceFrom: 33, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santo+Tirso%2C+Portugal&order=price" },
  ],
  "Famalicão": [
    { name: "Hotel Fundador", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/fundador.html" },
    { name: "Residencial São Pedro", distanceKm: 0.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Famalicao%2C+Portugal&order=price" },
    { name: "Casa da Praça Famalicão", distanceKm: 0.6, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Famalicao%2C+Portugal&order=price" },
  ],
  "Nine": [
    { name: "Casa de Nine", distanceKm: 0.5, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nine%2C+Famalicao%2C+Portugal&order=price" },
    { name: "Quinta da Bouça", distanceKm: 1.5, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nine%2C+Famalicao%2C+Portugal&order=price" },
    { name: "Albergaria do Vale", distanceKm: 1.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nine%2C+Famalicao%2C+Portugal&order=price" },
  ],
  "Braga": [
    { name: "Basic Braga by Axis", distanceKm: 0.1, priceFrom: 41, bookingUrl: "https://www.booking.com/hotel/pt/basic-braga-by-axis.html" },
    { name: "ibis Braga Centro", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/ibis-braga.html" },
    { name: "Hotel Dona Sofia", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/dona-sofia.html" },
  ],
  "Lousado": [
    { name: "Pensão Lousado", distanceKm: 0.4, priceFrom: 22, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousado%2C+Portugal&order=price" },
    { name: "Casa Rural Lousado", distanceKm: 1.0, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousado%2C+Portugal&order=price" },
    { name: "Quinta do Vale", distanceKm: 1.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousado%2C+Portugal&order=price" },
  ],
  "Guimarães": [
    { name: "Hotel Dom João IV", distanceKm: 0.2, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/dom-joao-iv.html" },
    { name: "ibis Guimarães Centro", distanceKm: 0.8, priceFrom: 39, bookingUrl: "https://www.booking.com/hotel/pt/ibis-guimaraes.html" },
    { name: "B&B Hotel Guimarães", distanceKm: 1.2, priceFrom: 36, bookingUrl: "https://www.booking.com/hotel/pt/b-b-guimaraes.html" },
  ],
  "Valongo": [
    { name: "Residencial Valongo", distanceKm: 0.5, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valongo%2C+Portugal&order=price" },
    { name: "Casa do Campo Valongo", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valongo%2C+Portugal&order=price" },
    { name: "Pensão Valadares", distanceKm: 0.8, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valongo%2C+Portugal&order=price" },
  ],
  "Caíde": [
    { name: "Casa do Rio Caíde", distanceKm: 0.6, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caide%2C+Portugal&order=price" },
    { name: "Quinta da Ribeira", distanceKm: 1.5, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caide%2C+Portugal&order=price" },
    { name: "Albergaria do Tâmega", distanceKm: 1.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caide%2C+Portugal&order=price" },
  ],
  "Marco de Canaveses": [
    { name: "Hotel Marco", distanceKm: 0.5, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Marco+de+Canaveses%2C+Portugal&order=price" },
    { name: "Residencial São Pedro", distanceKm: 0.8, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Marco+de+Canaveses%2C+Portugal&order=price" },
    { name: "Casa da Serra", distanceKm: 1.5, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Marco+de+Canaveses%2C+Portugal&order=price" },
  ],
  "Livração": [
    { name: "Residencial Livração", distanceKm: 0.3, priceFrom: 22, bookingUrl: "https://www.booking.com/searchresults.html?ss=Livracao%2C+Portugal&order=price" },
    { name: "Casa do Monte", distanceKm: 1.2, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Livracao%2C+Portugal&order=price" },
    { name: "Quinta da Livração", distanceKm: 1.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Livracao%2C+Portugal&order=price" },
  ],
  "Amarante": [
    { name: "Residencial Estoril", distanceKm: 0.5, priceFrom: 30, bookingUrl: "https://www.booking.com/hotel/pt/residencial-estoril-amarante.html" },
    { name: "Hotel Navarras", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/navarras.html" },
    { name: "Casa da Calçada", distanceKm: 0.6, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/casa-da-calcada.html" },
  ],
  "Peso da Régua": [
    { name: "Hotel Régua Douro", distanceKm: 0.1, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/regua-douro.html" },
    { name: "Original Douro Hotel", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/original-douro.html" },
    { name: "Residencial Douro", distanceKm: 0.5, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/residencial-douro.html" },
  ],
  "Barcelos": [
    { name: "Residencial Arantes", distanceKm: 0.8, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barcelos%2C+Portugal&order=price" },
    { name: "Hotel do Terço", distanceKm: 0.5, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/do-terco.html" },
    { name: "Pensão Bagoeira", distanceKm: 0.6, priceFrom: 25, bookingUrl: "https://www.booking.com/hotel/pt/bagoeira.html" },
  ],
  "Viana do Castelo": [
    { name: "HI Viana do Castelo (Pousada de Juventude)", distanceKm: 1.5, priceFrom: 15, bookingUrl: "https://www.booking.com/hotel/pt/pousada-de-juventude-de-viana-do-castelo.html" },
    { name: "A Vianesa Guest House", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/a-vianesa.html" },
    { name: "Maca De Eva Hostel", distanceKm: 0.5, priceFrom: 25, bookingUrl: "https://www.booking.com/hotel/pt/maca-de-eva.html" },
  ],
  "Valença": [
    { name: "Hotel Val Flores", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/val-flores.html" },
    { name: "Residencial Ponte Seca", distanceKm: 0.4, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valenca%2C+Portugal&order=price" },
    { name: "Pousada de São Teotónio", distanceKm: 1.0, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/pousada-de-sao-teotonio.html" },
  ],
  "Cacia": [
    { name: "Casa de Cacia", distanceKm: 0.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cacia%2C+Aveiro%2C+Portugal&order=price" },
    { name: "Quinta do Salgueiro", distanceKm: 1.4, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cacia%2C+Aveiro%2C+Portugal&order=price" },
  ],
  "Salreu": [
    { name: "Casa Rural Salreu", distanceKm: 0.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Salreu%2C+Estarreja%2C+Portugal&order=price" },
    { name: "Quinta do Rio Antuã", distanceKm: 1.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Salreu%2C+Estarreja%2C+Portugal&order=price" },
  ],
  "Esmoriz": [
    { name: "Hotel Mar Azul", distanceKm: 1.0, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esmoriz%2C+Portugal&order=price" },
    { name: "Pensão Praia Esmoriz", distanceKm: 1.2, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esmoriz%2C+Portugal&order=price" },
    { name: "Residencial Costa Verde", distanceKm: 0.6, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esmoriz%2C+Portugal&order=price" },
  ],
  "Granja": [
    { name: "Solverde Hotel Granja", distanceKm: 0.7, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Granja%2C+Vila+Nova+de+Gaia%2C+Portugal&order=price" },
    { name: "Casa da Praia Granja", distanceKm: 0.4, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Granja%2C+Vila+Nova+de+Gaia%2C+Portugal&order=price" },
  ],
  "Darque": [
    { name: "Hotel Aliança Darque", distanceKm: 0.5, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Darque%2C+Viana+do+Castelo%2C+Portugal&order=price" },
    { name: "Casa do Rio Lima", distanceKm: 1.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Darque%2C+Viana+do+Castelo%2C+Portugal&order=price" },
  ],
  "Afife": [
    { name: "Casa do Adro de Afife", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Afife%2C+Portugal&order=price" },
    { name: "Quinta da Boa Viagem", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Afife%2C+Portugal&order=price" },
  ],
  "Vila Praia de Âncora": [
    { name: "Hotel Meira", distanceKm: 0.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Praia+de+Ancora%2C+Portugal&order=price" },
    { name: "Pensão Albergaria Quim Barreiros", distanceKm: 0.4, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Praia+de+Ancora%2C+Portugal&order=price" },
    { name: "Casa da Praça Âncora", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Praia+de+Ancora%2C+Portugal&order=price" },
  ],
  "Caminha": [
    { name: "Hotel Porta do Sol", distanceKm: 0.9, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/porta-do-sol-spa.html" },
    { name: "Design & Wine Hotel", distanceKm: 0.4, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/design-and-wine.html" },
    { name: "Residencial Galo D'Ouro", distanceKm: 0.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caminha%2C+Portugal&order=price" },
  ],
  "Mesão Frio": [
    { name: "Casa d'Alem", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mesao+Frio%2C+Portugal&order=price" },
    { name: "Quinta de São Bernardo", distanceKm: 1.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mesao+Frio%2C+Portugal&order=price" },
  ],
  "Pinhão": [
    { name: "Vintage House Hotel", distanceKm: 0.2, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/vintage-house.html" },
    { name: "Casa do Visconde de Chanceleiros", distanceKm: 1.8, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pinhao%2C+Portugal&order=price" },
    { name: "Quinta do Pôpa", distanceKm: 1.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pinhao%2C+Portugal&order=price" },
  ],
  "Tua": [
    { name: "Casa do Tua", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tua%2C+Portugal&order=price" },
    { name: "Quinta do Vallado (Régua)", distanceKm: 1.9, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tua%2C+Portugal&order=price" },
  ],
  "Vizela": [
    { name: "Hotel Bienestar Termas de Vizela", distanceKm: 0.5, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/bienestar-termas-de-vizela.html" },
    { name: "Residencial Sameiro", distanceKm: 0.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vizela%2C+Portugal&order=price" },
    { name: "Casa do Outeiro Vizela", distanceKm: 1.4, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vizela%2C+Portugal&order=price" },
  ],
};
