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
  "Souselas": [
    { name: "Casa de Souselas", distanceKm: 0.7, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Souselas%2C+Portugal&order=price" },
    { name: "Quinta Rural Coimbra Norte", distanceKm: 1.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Souselas%2C+Portugal&order=price" },
  ],
  "Curia": [
    { name: "Curia Palace Hotel", distanceKm: 0.4, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/curia-palace.html" },
    { name: "Hotel das Termas da Curia", distanceKm: 0.6, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Curia%2C+Portugal&order=price" },
    { name: "Pensão Lourenço", distanceKm: 0.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Curia%2C+Portugal&order=price" },
  ],
  "Oliveira do Bairro": [
    { name: "Paloma Blanca Hotel", distanceKm: 0.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira+do+Bairro%2C+Portugal&order=price" },
    { name: "Quinta do Pinheiro", distanceKm: 1.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira+do+Bairro%2C+Portugal&order=price" },
  ],
  "Válega": [
    { name: "Casa da Igreja de Válega", distanceKm: 0.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valega%2C+Portugal&order=price" },
    { name: "Hotel Meia Lua (Ovar)", distanceKm: 1.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valega%2C+Portugal&order=price" },
  ],
  "Contumil": [
    { name: "Ibis Budget Porto Gaia", distanceKm: 1.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Contumil%2C+Porto&order=price" },
    { name: "Porto Antas Hotel", distanceKm: 0.9, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Contumil%2C+Porto&order=price" },
  ],
  "Rio Tinto": [
    { name: "Hotel Rio Tinto", distanceKm: 0.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio+Tinto%2C+Portugal&order=price" },
    { name: "Hotel Premium Porto Downtown", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio+Tinto%2C+Portugal&order=price" },
  ],
  "Tamel": [
    { name: "Quinta de Tamel", distanceKm: 1.0, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tamel%2C+Barcelos&order=price" },
    { name: "Casa do Monte (Barcelos)", distanceKm: 1.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tamel%2C+Barcelos&order=price" },
  ],
  "Durrães": [
    { name: "Quinta de Durrães", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Durraes%2C+Portugal&order=price" },
    { name: "Casa do Lavrador", distanceKm: 1.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Durraes%2C+Portugal&order=price" },
  ],
  "Carreço": [
    { name: "Quinta do Paço d'Anha", distanceKm: 1.7, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carreco%2C+Portugal&order=price" },
    { name: "Casa da Eira de Cima", distanceKm: 0.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carreco%2C+Portugal&order=price" },
  ],
  "Areosa": [
    { name: "Hotel Axis Viana", distanceKm: 1.8, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Areosa%2C+Viana+do+Castelo&order=price" },
    { name: "Casa de Areosa", distanceKm: 0.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Areosa%2C+Viana+do+Castelo&order=price" },
  ],
  "Aregos": [
    { name: "Hotel Termas de São Vicente", distanceKm: 1.5, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas+de+Aregos%2C+Portugal&order=price" },
    { name: "Casa de Aregos", distanceKm: 0.7, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas+de+Aregos%2C+Portugal&order=price" },
  ],
  "Mosteirô": [
    { name: "Quinta de Mosteirô", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mosteiro%2C+Cinfaes&order=price" },
    { name: "Douro Cliff Hotel", distanceKm: 1.9, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mosteiro%2C+Cinfaes&order=price" },
  ],
  "Caldas de Vizela": [
    { name: "Hotel Bienestar Termas de Vizela", distanceKm: 0.4, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/bienestar-termas-de-vizela.html" },
    { name: "Casa das Caldas", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas+de+Vizela%2C+Portugal&order=price" },
  ],
  "Lordelo": [
    { name: "Casa de Lordelo", distanceKm: 0.7, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lordelo%2C+Guimaraes&order=price" },
    { name: "Hotel Mestre de Avis", distanceKm: 1.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lordelo%2C+Guimaraes&order=price" },
  ],
  "Mirandela": [
    { name: "Hotel Dom Dinis Mirandela", distanceKm: 0.6, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mirandela%2C+Portugal&order=price" },
    { name: "Residencial Globo", distanceKm: 0.4, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mirandela%2C+Portugal&order=price" },
    { name: "Quinta do Ervedal", distanceKm: 1.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mirandela%2C+Portugal&order=price" },
  ],
  "Coimbra": [
    { name: "Hotel Oslo Coimbra", distanceKm: 0.3, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/oslo-coimbra.html" },
    { name: "Ibis Coimbra Centro", distanceKm: 0.4, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/ibis-coimbra.html" },
    { name: "Serenata Hostel Coimbra", distanceKm: 0.6, priceFrom: 25, bookingUrl: "https://www.booking.com/hotel/pt/serenata-hostel-coimbra.html" },
  ],
  "Mogofores": [
    { name: "Quinta dos Abrigueiros", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mogofores%2C+Portugal&order=price" },
    { name: "Curia Palace Hotel", distanceKm: 1.4, priceFrom: 60, bookingUrl: "https://www.booking.com/hotel/pt/curia-palace.html" },
  ],
  "Avanca": [
    { name: "Casa Egas Moniz", distanceKm: 0.9, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Avanca%2C+Portugal&order=price" },
    { name: "Hotel Estarreja", distanceKm: 1.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estarreja%2C+Portugal&order=price" },
  ],
  "Penafiel": [
    { name: "Penafiel Park Hotel & Spa", distanceKm: 1.2, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/penafiel-park-amp-spa.html" },
    { name: "Residencial Marques", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Penafiel%2C+Portugal&order=price" },
  ],
  "Paredes": [
    { name: "Hotel Comendador", distanceKm: 0.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Paredes%2C+Portugal&order=price" },
    { name: "Casa de Aveleda", distanceKm: 1.8, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Paredes%2C+Portugal&order=price" },
  ],
  "Cete": [
    { name: "Quinta de Cete", distanceKm: 0.7, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cete%2C+Paredes&order=price" },
  ],
  "Recarei-Sobreira": [
    { name: "Casa de Recarei", distanceKm: 1.1, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Recarei%2C+Paredes&order=price" },
  ],
  "Vila Meã": [
    { name: "Casa de Pousada", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Mea%2C+Amarante&order=price" },
    { name: "Monverde Wine Experience", distanceKm: 1.9, priceFrom: 90, bookingUrl: "https://www.booking.com/hotel/pt/monverde-wine-experience.html" },
  ],
  "Rio Mau": [
    { name: "Casa do Ribeiro", distanceKm: 1.3, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio+Mau%2C+Vila+do+Conde&order=price" },
  ],
  "Águeda": [
    { name: "Hotel Conde d'Águeda", distanceKm: 0.4, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/conde-d-039-agueda.html" },
    { name: "Hotel Estalagem da Pateira", distanceKm: 1.7, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/estalagem-da-pateira.html" },
  ],
  "Sernada do Vouga": [
    { name: "Casa da Vereda", distanceKm: 1.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sernada+do+Vouga&order=price" },
  ],
  "Macinhata do Vouga": [
    { name: "Casa do Vouga", distanceKm: 1.2, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Macinhata+do+Vouga&order=price" },
  ],
  "Cortegaça": [
    { name: "Hotel Praia Mar", distanceKm: 1.4, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cortega%C3%A7a%2C+Ovar&order=price" },
    { name: "Casa da Praia", distanceKm: 0.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cortega%C3%A7a%2C+Ovar&order=price" },
  ],
  "Taveiro": [
    { name: "Quinta de Taveiro", distanceKm: 1.1, priceFrom: 42, bookingUrl: "https://www.booking.com/searchresults.html?ss=Taveiro%2C+Coimbra&order=price" },
  ],
  "Lousada": [
    { name: "Casa de Juste", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousada%2C+Portugal&order=price" },
    { name: "Hotel Lousadense", distanceKm: 0.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousada%2C+Portugal&order=price" },
  ],
  "Vila Nova de Cerveira": [
    { name: "Pousada de Vila Nova de Cerveira", distanceKm: 0.6, priceFrom: 80, bookingUrl: "https://www.booking.com/hotel/pt/pousada-de-vila-nova-de-cerveira.html" },
    { name: "Hotel Minho", distanceKm: 1.5, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/minho.html" },
  ],
  "Pocinho": [
    { name: "Casa do Pocinho", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pocinho%2C+Portugal&order=price" },
  ],
  "Ferradosa": [
    { name: "Quinta da Ferradosa", distanceKm: 1.3, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferradosa%2C+S%C3%A3o+Xisto&order=price" },
  ],
  "Vesúvio": [
    { name: "Quinta do Vesúvio", distanceKm: 1.6, priceFrom: 70, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ves%C3%BAvio%2C+Douro&order=price" },
  ],
  "Bragança": [
    { name: "Hotel Ibis Bragança", distanceKm: 1.4, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/ibis-braganca.html" },
    { name: "Tulipa Hotel", distanceKm: 0.7, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/tulipa-braganca.html" },
    { name: "Pousada de Bragança", distanceKm: 1.9, priceFrom: 95, bookingUrl: "https://www.booking.com/hotel/pt/pousada-de-braganca-sao-bartolomeu.html" },
  ],
  "Lisboa Santa Apolónia": [
    { name: "My Story Hotel Tejo", distanceKm: 0.6, priceFrom: 65, bookingUrl: "https://www.booking.com/hotel/pt/my-story-tejo.html" },
    { name: "Hotel Mundial", distanceKm: 1.2, priceFrom: 80, bookingUrl: "https://www.booking.com/hotel/pt/mundial.html" },
  ],
  "Lisboa Oriente": [
    { name: "Tryp Lisboa Oriente", distanceKm: 0.4, priceFrom: 75, bookingUrl: "https://www.booking.com/hotel/pt/tryp-lisboa-oriente.html" },
    { name: "Olissippo Oriente", distanceKm: 0.5, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/olissippo-oriente.html" },
  ],
  "Lisboa Rossio": [
    { name: "My Story Hotel Rossio", distanceKm: 0.1, priceFrom: 80, bookingUrl: "https://www.booking.com/hotel/pt/my-story-rossio.html" },
    { name: "Internacional Design Hotel", distanceKm: 0.2, priceFrom: 90, bookingUrl: "https://www.booking.com/hotel/pt/internacional-design.html" },
  ],
  "Cais do Sodré": [
    { name: "LX Boutique Hotel", distanceKm: 0.2, priceFrom: 85, bookingUrl: "https://www.booking.com/hotel/pt/lx-boutique.html" },
    { name: "The 7 Hotel", distanceKm: 0.5, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/the-7-cais-do-sodre.html" },
  ],
  "Cascais": [
    { name: "Hotel Baia", distanceKm: 0.5, priceFrom: 90, bookingUrl: "https://www.booking.com/hotel/pt/baia.html" },
    { name: "Pergola House", distanceKm: 0.9, priceFrom: 75, bookingUrl: "https://www.booking.com/hotel/pt/pergola-house.html" },
  ],
  "Sintra": [
    { name: "Sintra Bliss House", distanceKm: 0.6, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/sintra-bliss.html" },
    { name: "Nova Sintra", distanceKm: 1.1, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/nova-sintra.html" },
  ],
  "Setúbal": [
    { name: "Hotel do Sado", distanceKm: 1.4, priceFrom: 60, bookingUrl: "https://www.booking.com/hotel/pt/do-sado.html" },
    { name: "Hotel IBIS Setúbal", distanceKm: 0.9, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/ibis-setubal.html" },
  ],
  "Entroncamento": [
    { name: "Hotel Apolo XIX", distanceKm: 0.4, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/apolo-xix.html" },
    { name: "Residencial Brasília", distanceKm: 0.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Entroncamento&order=price" },
  ],
  "Santarém": [
    { name: "Hotel Alfageme", distanceKm: 1.6, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/alfageme.html" },
    { name: "Casa da Alcáçova", distanceKm: 1.9, priceFrom: 80, bookingUrl: "https://www.booking.com/hotel/pt/casa-da-alcacova.html" },
  ],
  "Tomar": [
    { name: "Hotel dos Templários", distanceKm: 0.6, priceFrom: 75, bookingUrl: "https://www.booking.com/hotel/pt/dos-templarios.html" },
    { name: "Hotel Kamanga", distanceKm: 0.4, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/kamanga.html" },
  ],
  "Caldas da Rainha": [
    { name: "Sana Silver Coast Hotel", distanceKm: 0.9, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/sana-silver-coast.html" },
    { name: "Hotel Cristal Caldas", distanceKm: 0.7, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/cristal-caldas.html" },
  ],
  "Leiria": [
    { name: "Hotel Eurosol Leiria", distanceKm: 0.3, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/eurosol-leiria.html" },
    { name: "Hotel Lis", distanceKm: 1.1, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/lis-leiria.html" },
  ],
  "Figueira da Foz": [
    { name: "Hotel Costa de Prata", distanceKm: 0.8, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/costa-de-prata.html" },
    { name: "Eurostars Oasis Plaza", distanceKm: 1.2, priceFrom: 65, bookingUrl: "https://www.booking.com/hotel/pt/eurostars-oasis-plaza.html" },
  ],
  "Castelo Branco": [
    { name: "Tryp Colina do Castelo", distanceKm: 1.5, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/tryp-colina-do-castelo.html" },
    { name: "Best Western Rainha D. Amélia", distanceKm: 1.2, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/rainha-d-amelia.html" },
  ],
  "Covilhã": [
    { name: "TRYP Covilhã Dona Maria", distanceKm: 1.8, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/tryp-covilha-dona-maria.html" },
    { name: "Hotel Solneve", distanceKm: 1.9, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/solneve.html" },
  ],
  "Guarda": [
    { name: "Hotel Lusitânia Congress & Spa", distanceKm: 1.6, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/lusitania-congress-spa.html" },
    { name: "Hotel Santos", distanceKm: 1.4, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/santos.html" },
  ],
  "Vilar Formoso": [
    { name: "Hotel Lusitano", distanceKm: 0.4, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vilar+Formoso&order=price" },
    { name: "Hotel Fronteira", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vilar+Formoso&order=price" },
  ],
  "Viseu": [
    { name: "Hotel Avenida Viseu", distanceKm: 0.5, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/avenida-viseu.html" },
    { name: "Pousada de Viseu", distanceKm: 1.0, priceFrom: 95, bookingUrl: "https://www.booking.com/hotel/pt/pousada-viseu.html" },
  ],
  "Évora": [
    { name: "Vitória Stone Hotel", distanceKm: 0.8, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/vitoria-stone.html" },
    { name: "Albergaria do Calvário", distanceKm: 1.3, priceFrom: 90, bookingUrl: "https://www.booking.com/hotel/pt/albergaria-do-calvario.html" },
  ],
  "Beja": [
    { name: "Hotel Bejense", distanceKm: 1.0, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/bejense.html" },
    { name: "Pousada Convento Beja", distanceKm: 1.4, priceFrom: 95, bookingUrl: "https://www.booking.com/hotel/pt/pousada-convento-beja.html" },
  ],
  "Faro": [
    { name: "Hotel Faro & Beach Club", distanceKm: 0.4, priceFrom: 75, bookingUrl: "https://www.booking.com/hotel/pt/faro.html" },
    { name: "Stay Hotel Faro Centro", distanceKm: 0.3, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/stay-faro-centro.html" },
  ],
  "Albufeira-Ferreiras": [
    { name: "Hotel Boa Vista", distanceKm: 1.2, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferreiras%2C+Albufeira&order=price" },
    { name: "Ália Albufeira", distanceKm: 1.8, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferreiras%2C+Albufeira&order=price" },
  ],
  "Tunes": [
    { name: "Vila Galé Albacora", distanceKm: 1.9, priceFrom: 65, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tunes%2C+Algarve&order=price" },
    { name: "Casa de Tunes", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tunes%2C+Algarve&order=price" },
  ],
  "Lagos": [
    { name: "Hotel Marina Rio", distanceKm: 0.4, priceFrom: 60, bookingUrl: "https://www.booking.com/hotel/pt/marina-rio.html" },
    { name: "Lagos Avenida Hotel", distanceKm: 0.6, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/lagos-avenida.html" },
  ],
  "Portimão": [
    { name: "Hotel Família Portimão", distanceKm: 1.0, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portim%C3%A3o&order=price" },
    { name: "AP Eva Senses", distanceKm: 1.8, priceFrom: 75, bookingUrl: "https://www.booking.com/hotel/pt/ap-eva-senses.html" },
  ],
  "Tavira": [
    { name: "Pousada Convento Tavira", distanceKm: 0.9, priceFrom: 85, bookingUrl: "https://www.booking.com/hotel/pt/pousada-convento-tavira.html" },
    { name: "Vila Galé Tavira", distanceKm: 1.6, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/vila-gale-tavira.html" },
  ],
  "Vila Real de Santo António": [
    { name: "Apolo Hotel", distanceKm: 0.5, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/apolo-vila-real.html" },
    { name: "Guadiana Hotel", distanceKm: 0.7, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/guadiana-vila-real.html" },
  ],
};
