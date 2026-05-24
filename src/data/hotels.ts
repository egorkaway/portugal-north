export interface Hotel {
  name: string;
  distanceKm: number;
  priceFrom: number; // EUR per night
  bookingUrl: string;
}

export type StationHotels = Record<string, Hotel[]>;

// Recommended budget hotels within ~2km of each station
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
    { name: "Hotel das Salinas", distanceKm: 1, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/das-salinas.html" },
  ],
  "Estarreja": [
    { name: "Residencial Estarreja", distanceKm: 0.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estarreja%2C+Portugal&order=price" },
    { name: "Casa do Anjo", distanceKm: 1, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estarreja%2C+Portugal&order=price" },
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
    { name: "Casa da Ponte Trofa", distanceKm: 1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Trofa%2C+Portugal&order=price" },
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
    { name: "Casa Rural Lousado", distanceKm: 1, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousado%2C+Portugal&order=price" },
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
    { name: "Pousada de São Teotónio", distanceKm: 1, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/pousada-de-sao-teotonio.html" },
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
    { name: "Hotel Mar Azul", distanceKm: 1, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esmoriz%2C+Portugal&order=price" },
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
  "Quintans": [
    { name: "Hotel das Américas (Aveiro)", distanceKm: 1.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quintans%2C+Aveiro%2C+Portugal&order=price" },
    { name: "Pensão da Praia (Ílhavo)", distanceKm: 2.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quintans%2C+Aveiro%2C+Portugal&order=price" },
  ],
  "Oiã": [
    { name: "Casa da Avó (Oiã)", distanceKm: 0.6, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oia%2C+Oliveira+do+Bairro%2C+Portugal&order=price" },
    { name: "Paloma Blanca Hotel", distanceKm: 1.4, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira+do+Bairro%2C+Portugal&order=price" },
  ],
  "Paraimo-Sangalhos": [
    { name: "Quinta dos Abrigueiros", distanceKm: 1.2, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sangalhos%2C+Portugal&order=price" },
    { name: "Hotel das Termas da Curia", distanceKm: 2, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Paraimo%2C+Portugal&order=price" },
  ],
  "Aguim": [
    { name: "Hotel das Termas da Curia", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aguim%2C+Portugal&order=price" },
    { name: "Pensão Lourenço", distanceKm: 1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Curia%2C+Portugal&order=price" },
  ],
  "Vilela-Fornos": [
    { name: "Hotel Oslo Coimbra", distanceKm: 2.5, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbra%2C+Portugal&order=price" },
    { name: "Quinta Rural Coimbra Norte", distanceKm: 1.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torre+de+Vilela%2C+Portugal&order=price" },
  ],
  "Adémia": [
    { name: "Hotel Oslo Coimbra", distanceKm: 2, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbra%2C+Portugal&order=price" },
    { name: "Ibis Coimbra Centro", distanceKm: 2.2, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbra%2C+Portugal&order=price" },
  ],
  "General Torres": [
    { name: "Hotel Ibis Porto Gaia", distanceKm: 1.2, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Nova+de+Gaia%2C+Portugal&order=price" },
    { name: "Porto Antas Hotel", distanceKm: 1.8, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porto%2C+Portugal&order=price" },
  ],
  "Coimbrões": [
    { name: "Hotel Ibis Porto Gaia", distanceKm: 1.5, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbr%C3%B5es%2C+Portugal&order=price" },
    { name: "Hotel Solverde Porto Gaia", distanceKm: 2, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Nova+de+Gaia%2C+Portugal&order=price" },
  ],
  "Valadares": [
    { name: "Hotel Solverde Porto Gaia", distanceKm: 1, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valadares%2C+Vila+Nova+de+Gaia&order=price" },
    { name: "Hotel Ibis Porto Gaia", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Nova+de+Gaia%2C+Portugal&order=price" },
  ],
  "Francelos": [
    { name: "Hotel Praia da Baía", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Francelos%2C+Portugal&order=price" },
    { name: "Hotel Ibis Porto Gaia", distanceKm: 2.2, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Nova+de+Gaia%2C+Portugal&order=price" },
  ],
  "Miramar": [
    { name: "Hotel Praia da Baía", distanceKm: 0.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Miramar%2C+Vila+Nova+de+Gaia&order=price" },
    { name: "Hotel Praia Gelo", distanceKm: 0.9, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Miramar%2C+Portugal&order=price" },
  ],
  "Aguda": [
    { name: "Hotel Praia Gelo", distanceKm: 0.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aguda%2C+Vila+Nova+de+Gaia&order=price" },
    { name: "Hotel Praia da Baía", distanceKm: 1.2, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aguda%2C+Portugal&order=price" },
  ],
  "Paramos": [
    { name: "Hotel Ibis Porto Gaia", distanceKm: 2.5, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Paramos%2C+Espinho&order=price" },
    { name: "Hotel Solverde Espinho", distanceKm: 1.5, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espinho%2C+Portugal&order=price" },
  ],
  "Soure": [
    { name: "Hotel Parque Serra da Lousã", distanceKm: 1.2, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Soure%2C+Portugal&order=price" },
    { name: "Residencial Central Soure", distanceKm: 0.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Soure%2C+Portugal&order=price" },
  ],
  "Caxarias": [
    { name: "Hotel Mira Serra", distanceKm: 1.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caxarias%2C+Our%C3%A9m&order=price" },
    { name: "Hotel Santo António", distanceKm: 1.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Our%C3%A9m%2C+Portugal&order=price" },
  ],
  "Lamarosa": [
    { name: "Hotel dos Templários", distanceKm: 1.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torres+Novas%2C+Portugal&order=price" },
    { name: "Hotel Lusitano", distanceKm: 1.2, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torres+Novas%2C+Portugal&order=price" },
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
    { name: "Quinta de Tamel", distanceKm: 1, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tamel%2C+Barcelos&order=price" },
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
  "São Pedro da Torre": [
    { name: "Hotels near São Pedro da Torre", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Pedro%20da%20Torre%2C%20Portugal&order=price" },
    { name: "Guest houses near São Pedro da Torre", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Pedro%20da%20Torre%2C%20Portugal&order=price" },
    { name: "Budget stays near São Pedro da Torre", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Pedro%20da%20Torre%2C%20Portugal&order=price" },
  ],
  "Carvalha": [
    { name: "Hotels near Carvalha", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carvalha%2C%20Portugal&order=price" },
    { name: "Guest houses near Carvalha", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carvalha%2C%20Portugal&order=price" },
    { name: "Budget stays near Carvalha", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carvalha%2C%20Portugal&order=price" },
  ],
  "Gondarém": [
    { name: "Hotels near Gondarém", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Gondar%C3%A9m%2C%20Portugal&order=price" },
    { name: "Guest houses near Gondarém", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Gondar%C3%A9m%2C%20Portugal&order=price" },
    { name: "Budget stays near Gondarém", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Gondar%C3%A9m%2C%20Portugal&order=price" },
  ],
  "Esqueiró": [
    { name: "Hotels near Esqueiró", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esqueir%C3%B3%2C%20Portugal&order=price" },
    { name: "Guest houses near Esqueiró", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esqueir%C3%B3%2C%20Portugal&order=price" },
    { name: "Budget stays near Esqueiró", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esqueir%C3%B3%2C%20Portugal&order=price" },
  ],
  "Seixas": [
    { name: "Hotels near Seixas", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Seixas%2C%20Portugal&order=price" },
    { name: "Guest houses near Seixas", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Seixas%2C%20Portugal&order=price" },
    { name: "Budget stays near Seixas", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Seixas%2C%20Portugal&order=price" },
  ],
  "Senhora da Agonia": [
    { name: "Hotels near Senhora da Agonia", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Senhora%20da%20Agonia%2C%20Portugal&order=price" },
    { name: "Guest houses near Senhora da Agonia", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Senhora%20da%20Agonia%2C%20Portugal&order=price" },
    { name: "Budget stays near Senhora da Agonia", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Senhora%20da%20Agonia%2C%20Portugal&order=price" },
  ],
  "Moledo do Minho": [
    { name: "Hotels near Moledo do Minho", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moledo%20do%20Minho%2C%20Portugal&order=price" },
    { name: "Guest houses near Moledo do Minho", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moledo%20do%20Minho%2C%20Portugal&order=price" },
    { name: "Budget stays near Moledo do Minho", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moledo%20do%20Minho%2C%20Portugal&order=price" },
  ],
  "Alvarães": [
    { name: "Hotels near Alvarães", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alvar%C3%A3es%2C%20Portugal&order=price" },
    { name: "Guest houses near Alvarães", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alvar%C3%A3es%2C%20Portugal&order=price" },
    { name: "Budget stays near Alvarães", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alvar%C3%A3es%2C%20Portugal&order=price" },
  ],
  "Senhora das Neves": [
    { name: "Hotels near Senhora das Neves", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Senhora%20das%20Neves%2C%20Portugal&order=price" },
    { name: "Guest houses near Senhora das Neves", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Senhora%20das%20Neves%2C%20Portugal&order=price" },
    { name: "Budget stays near Senhora das Neves", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Senhora%20das%20Neves%2C%20Portugal&order=price" },
  ],
  "Barroselas": [
    { name: "Hotels near Barroselas", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barroselas%2C%20Portugal&order=price" },
    { name: "Guest houses near Barroselas", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barroselas%2C%20Portugal&order=price" },
    { name: "Budget stays near Barroselas", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barroselas%2C%20Portugal&order=price" },
  ],
  "Carapecos": [
    { name: "Hotels near Carapecos", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carapecos%2C%20Portugal&order=price" },
    { name: "Guest houses near Carapecos", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carapecos%2C%20Portugal&order=price" },
    { name: "Budget stays near Carapecos", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carapecos%2C%20Portugal&order=price" },
  ],
  "Silva": [
    { name: "Hotels near Silva", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silva%2C%20Portugal&order=price" },
    { name: "Guest houses near Silva", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silva%2C%20Portugal&order=price" },
    { name: "Budget stays near Silva", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silva%2C%20Portugal&order=price" },
  ],
  "Midões": [
    { name: "Hotels near Midões", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mid%C3%B5es%2C%20Portugal&order=price" },
    { name: "Guest houses near Midões", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mid%C3%B5es%2C%20Portugal&order=price" },
    { name: "Budget stays near Midões", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mid%C3%B5es%2C%20Portugal&order=price" },
  ],
  "Carreira": [
    { name: "Hotels near Carreira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carreira%2C%20Portugal&order=price" },
    { name: "Guest houses near Carreira", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carreira%2C%20Portugal&order=price" },
    { name: "Budget stays near Carreira", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carreira%2C%20Portugal&order=price" },
  ],
  "Louro": [
    { name: "Hotels near Louro", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Louro%2C%20Portugal&order=price" },
    { name: "Guest houses near Louro", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Louro%2C%20Portugal&order=price" },
    { name: "Budget stays near Louro", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Louro%2C%20Portugal&order=price" },
  ],
  "Mouquim": [
    { name: "Hotels near Mouquim", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mouquim%2C%20Portugal&order=price" },
    { name: "Guest houses near Mouquim", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mouquim%2C%20Portugal&order=price" },
    { name: "Budget stays near Mouquim", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mouquim%2C%20Portugal&order=price" },
  ],
  "Portela": [
    { name: "Hotels near Portela", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portela%2C%20Portugal&order=price" },
    { name: "Guest houses near Portela", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portela%2C%20Portugal&order=price" },
    { name: "Budget stays near Portela", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portela%2C%20Portugal&order=price" },
  ],
  "São Romão": [
    { name: "Hotels near São Romão", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Rom%C3%A3o%2C%20Portugal&order=price" },
    { name: "Guest houses near São Romão", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Rom%C3%A3o%2C%20Portugal&order=price" },
    { name: "Budget stays near São Romão", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Rom%C3%A3o%2C%20Portugal&order=price" },
  ],
  "São Frutuoso": [
    { name: "Hotels near São Frutuoso", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Frutuoso%2C%20Portugal&order=price" },
    { name: "Guest houses near São Frutuoso", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Frutuoso%2C%20Portugal&order=price" },
    { name: "Budget stays near São Frutuoso", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Frutuoso%2C%20Portugal&order=price" },
  ],
  "Leandro": [
    { name: "Hotels near Leandro", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Leandro%2C%20Portugal&order=price" },
    { name: "Guest houses near Leandro", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Leandro%2C%20Portugal&order=price" },
    { name: "Budget stays near Leandro", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Leandro%2C%20Portugal&order=price" },
  ],
  "Travagem": [
    { name: "Hotels near Travagem", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Travagem%2C%20Portugal&order=price" },
    { name: "Guest houses near Travagem", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Travagem%2C%20Portugal&order=price" },
    { name: "Budget stays near Travagem", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Travagem%2C%20Portugal&order=price" },
  ],
  "Barrimau": [
    { name: "Hotels near Barrimau", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barrimau%2C%20Portugal&order=price" },
    { name: "Guest houses near Barrimau", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barrimau%2C%20Portugal&order=price" },
    { name: "Budget stays near Barrimau", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barrimau%2C%20Portugal&order=price" },
  ],
  "Esmeriz": [
    { name: "Hotels near Esmeriz", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esmeriz%2C%20Portugal&order=price" },
    { name: "Guest houses near Esmeriz", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esmeriz%2C%20Portugal&order=price" },
    { name: "Budget stays near Esmeriz", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Esmeriz%2C%20Portugal&order=price" },
  ],
  "Ferreiros": [
    { name: "Hotels near Ferreiros", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferreiros%2C%20Portugal&order=price" },
    { name: "Guest houses near Ferreiros", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferreiros%2C%20Portugal&order=price" },
    { name: "Budget stays near Ferreiros", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferreiros%2C%20Portugal&order=price" },
  ],
  "Mazagão": [
    { name: "Hotels near Mazagão", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mazag%C3%A3o%2C%20Portugal&order=price" },
    { name: "Guest houses near Mazagão", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mazag%C3%A3o%2C%20Portugal&order=price" },
    { name: "Budget stays near Mazagão", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mazag%C3%A3o%2C%20Portugal&order=price" },
  ],
  "Aveleda": [
    { name: "Hotels near Aveleda", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aveleda%2C%20Portugal&order=price" },
    { name: "Guest houses near Aveleda", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aveleda%2C%20Portugal&order=price" },
    { name: "Budget stays near Aveleda", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aveleda%2C%20Portugal&order=price" },
  ],
  "Tadim": [
    { name: "Hotels near Tadim", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tadim%2C%20Portugal&order=price" },
    { name: "Guest houses near Tadim", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tadim%2C%20Portugal&order=price" },
    { name: "Budget stays near Tadim", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tadim%2C%20Portugal&order=price" },
  ],
  "Ruílhe": [
    { name: "Hotels near Ruílhe", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ru%C3%ADlhe%2C%20Portugal&order=price" },
    { name: "Guest houses near Ruílhe", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ru%C3%ADlhe%2C%20Portugal&order=price" },
    { name: "Budget stays near Ruílhe", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ru%C3%ADlhe%2C%20Portugal&order=price" },
  ],
  "Arentim": [
    { name: "Hotels near Arentim", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Arentim%2C%20Portugal&order=price" },
    { name: "Guest houses near Arentim", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Arentim%2C%20Portugal&order=price" },
    { name: "Budget stays near Arentim", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Arentim%2C%20Portugal&order=price" },
  ],
  "Couto de Cambeses": [
    { name: "Hotels near Couto de Cambeses", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Couto%20de%20Cambeses%2C%20Portugal&order=price" },
    { name: "Guest houses near Couto de Cambeses", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Couto%20de%20Cambeses%2C%20Portugal&order=price" },
    { name: "Budget stays near Couto de Cambeses", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Couto%20de%20Cambeses%2C%20Portugal&order=price" },
  ],
  "Covas": [
    { name: "Hotels near Covas", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Covas%2C%20Portugal&order=price" },
    { name: "Guest houses near Covas", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Covas%2C%20Portugal&order=price" },
    { name: "Budget stays near Covas", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Covas%2C%20Portugal&order=price" },
  ],
  "Nespereira": [
    { name: "Hotels near Nespereira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nespereira%2C%20Portugal&order=price" },
    { name: "Guest houses near Nespereira", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nespereira%2C%20Portugal&order=price" },
    { name: "Budget stays near Nespereira", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nespereira%2C%20Portugal&order=price" },
  ],
  "Pereirinhas": [
    { name: "Hotels near Pereirinhas", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pereirinhas%2C%20Portugal&order=price" },
    { name: "Guest houses near Pereirinhas", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pereirinhas%2C%20Portugal&order=price" },
    { name: "Budget stays near Pereirinhas", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pereirinhas%2C%20Portugal&order=price" },
  ],
  "Cuca": [
    { name: "Hotels near Cuca", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cuca%2C%20Portugal&order=price" },
    { name: "Guest houses near Cuca", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cuca%2C%20Portugal&order=price" },
    { name: "Budget stays near Cuca", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cuca%2C%20Portugal&order=price" },
  ],
  "Giesteira": [
    { name: "Hotels near Giesteira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Giesteira%2C%20Portugal&order=price" },
    { name: "Guest houses near Giesteira", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Giesteira%2C%20Portugal&order=price" },
    { name: "Budget stays near Giesteira", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Giesteira%2C%20Portugal&order=price" },
  ],
  "Caniços": [
    { name: "Hotels near Caniços", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cani%C3%A7os%2C%20Portugal&order=price" },
    { name: "Guest houses near Caniços", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cani%C3%A7os%2C%20Portugal&order=price" },
    { name: "Budget stays near Caniços", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cani%C3%A7os%2C%20Portugal&order=price" },
  ],
  "Vila das Aves": [
    { name: "Hotels near Vila das Aves", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20das%20Aves%2C%20Portugal&order=price" },
    { name: "Guest houses near Vila das Aves", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20das%20Aves%2C%20Portugal&order=price" },
    { name: "Budget stays near Vila das Aves", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20das%20Aves%2C%20Portugal&order=price" },
  ],
  "Meinedo": [
    { name: "Hotels near Meinedo", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Meinedo%2C%20Portugal&order=price" },
    { name: "Guest houses near Meinedo", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Meinedo%2C%20Portugal&order=price" },
    { name: "Budget stays near Meinedo", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Meinedo%2C%20Portugal&order=price" },
  ],
  "Bustelo": [
    { name: "Hotels near Bustelo", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bustelo%2C%20Portugal&order=price" },
    { name: "Guest houses near Bustelo", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bustelo%2C%20Portugal&order=price" },
    { name: "Budget stays near Bustelo", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bustelo%2C%20Portugal&order=price" },
  ],
  "Recesinhos": [
    { name: "Hotels near Recesinhos", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Recesinhos%2C%20Portugal&order=price" },
    { name: "Guest houses near Recesinhos", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Recesinhos%2C%20Portugal&order=price" },
    { name: "Budget stays near Recesinhos", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Recesinhos%2C%20Portugal&order=price" },
  ],
  "Cabeda": [
    { name: "Hotels near Cabeda", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cabeda%2C%20Portugal&order=price" },
    { name: "Guest houses near Cabeda", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cabeda%2C%20Portugal&order=price" },
    { name: "Budget stays near Cabeda", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cabeda%2C%20Portugal&order=price" },
  ],
  "Suzão": [
    { name: "Hotels near Suzão", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Suz%C3%A3o%2C%20Portugal&order=price" },
    { name: "Guest houses near Suzão", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Suz%C3%A3o%2C%20Portugal&order=price" },
    { name: "Budget stays near Suzão", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Suz%C3%A3o%2C%20Portugal&order=price" },
  ],
  "Godim": [
    { name: "Hotels near Godim", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Godim%2C%20Portugal&order=price" },
    { name: "Guest houses near Godim", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Godim%2C%20Portugal&order=price" },
    { name: "Budget stays near Godim", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Godim%2C%20Portugal&order=price" },
  ],
  "Covelinhas": [
    { name: "Hotels near Covelinhas", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Covelinhas%2C%20Portugal&order=price" },
    { name: "Guest houses near Covelinhas", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Covelinhas%2C%20Portugal&order=price" },
    { name: "Budget stays near Covelinhas", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Covelinhas%2C%20Portugal&order=price" },
  ],
  "Caldas de Moledo": [
    { name: "Hotels near Caldas de Moledo", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas%20de%20Moledo%2C%20Portugal&order=price" },
    { name: "Guest houses near Caldas de Moledo", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas%20de%20Moledo%2C%20Portugal&order=price" },
    { name: "Budget stays near Caldas de Moledo", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas%20de%20Moledo%2C%20Portugal&order=price" },
  ],
  "Ferrão": [
    { name: "Hotels near Ferrão", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferr%C3%A3o%2C%20Portugal&order=price" },
    { name: "Guest houses near Ferrão", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferr%C3%A3o%2C%20Portugal&order=price" },
    { name: "Budget stays near Ferrão", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferr%C3%A3o%2C%20Portugal&order=price" },
  ],
  "Barqueiros": [
    { name: "Hotels near Barqueiros", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barqueiros%2C%20Portugal&order=price" },
    { name: "Guest houses near Barqueiros", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barqueiros%2C%20Portugal&order=price" },
    { name: "Budget stays near Barqueiros", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barqueiros%2C%20Portugal&order=price" },
  ],
  "Ermida": [
    { name: "Hotels near Ermida", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ermida%2C%20Portugal&order=price" },
    { name: "Guest houses near Ermida", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ermida%2C%20Portugal&order=price" },
    { name: "Budget stays near Ermida", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ermida%2C%20Portugal&order=price" },
  ],
  "Oleiros": [
    { name: "Hotels near Oleiros", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oleiros%2C%20Portugal&order=price" },
    { name: "Guest houses near Oleiros", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oleiros%2C%20Portugal&order=price" },
    { name: "Budget stays near Oleiros", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oleiros%2C%20Portugal&order=price" },
  ],
  "Irivo": [
    { name: "Hotels near Irivo", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Irivo%2C%20Portugal&order=price" },
    { name: "Guest houses near Irivo", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Irivo%2C%20Portugal&order=price" },
    { name: "Budget stays near Irivo", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Irivo%2C%20Portugal&order=price" },
  ],
  "Juncal": [
    { name: "Hotels near Juncal", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Juncal%2C%20Portugal&order=price" },
    { name: "Guest houses near Juncal", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Juncal%2C%20Portugal&order=price" },
    { name: "Budget stays near Juncal", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Juncal%2C%20Portugal&order=price" },
  ],
  "Mirão": [
    { name: "Hotels near Mirão", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mir%C3%A3o%2C%20Portugal&order=price" },
    { name: "Guest houses near Mirão", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mir%C3%A3o%2C%20Portugal&order=price" },
    { name: "Budget stays near Mirão", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mir%C3%A3o%2C%20Portugal&order=price" },
  ],
  "Porto Rei": [
    { name: "Hotels near Porto Rei", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porto%20Rei%2C%20Portugal&order=price" },
    { name: "Guest houses near Porto Rei", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porto%20Rei%2C%20Portugal&order=price" },
    { name: "Budget stays near Porto Rei", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porto%20Rei%2C%20Portugal&order=price" },
  ],
  "Leça do Balio": [
    { name: "Hotels near Leça do Balio", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Le%C3%A7a%20do%20Balio%2C%20Portugal&order=price" },
    { name: "Guest houses near Leça do Balio", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Le%C3%A7a%20do%20Balio%2C%20Portugal&order=price" },
    { name: "Budget stays near Leça do Balio", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Le%C3%A7a%20do%20Balio%2C%20Portugal&order=price" },
  ],
  "Águas Santas - Palmilheira": [
    { name: "Hotels near Águas Santas - Palmilheira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=%C3%81guas%20Santas%20-%20Palmilheira%2C%20Portugal&order=price" },
    { name: "Guest houses near Águas Santas - Palmilheira", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=%C3%81guas%20Santas%20-%20Palmilheira%2C%20Portugal&order=price" },
    { name: "Budget stays near Águas Santas - Palmilheira", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=%C3%81guas%20Santas%20-%20Palmilheira%2C%20Portugal&order=price" },
  ],
  "São Gemil": [
    { name: "Hotels near São Gemil", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Gemil%2C%20Portugal&order=price" },
    { name: "Guest houses near São Gemil", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Gemil%2C%20Portugal&order=price" },
    { name: "Budget stays near São Gemil", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Gemil%2C%20Portugal&order=price" },
  ],
  "São Mamede de Infesta": [
    { name: "Hotels near São Mamede de Infesta", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Mamede%20de%20Infesta%2C%20Portugal&order=price" },
    { name: "Guest houses near São Mamede de Infesta", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Mamede%20de%20Infesta%2C%20Portugal&order=price" },
    { name: "Budget stays near São Mamede de Infesta", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Mamede%20de%20Infesta%2C%20Portugal&order=price" },
  ],
  "Hospital São João": [
    { name: "Hotels near Hospital São João", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospital%20S%C3%A3o%20Jo%C3%A3o%2C%20Portugal&order=price" },
    { name: "Guest houses near Hospital São João", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospital%20S%C3%A3o%20Jo%C3%A3o%2C%20Portugal&order=price" },
    { name: "Budget stays near Hospital São João", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospital%20S%C3%A3o%20Jo%C3%A3o%2C%20Portugal&order=price" },
  ],
  "Arroteia": [
    { name: "Hotels near Arroteia", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Arroteia%2C%20Portugal&order=price" },
    { name: "Guest houses near Arroteia", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Arroteia%2C%20Portugal&order=price" },
    { name: "Budget stays near Arroteia", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Arroteia%2C%20Portugal&order=price" },
  ],
  "Madalena": [
    { name: "Hotels near Madalena", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Madalena%2C%20Portugal&order=price" },
    { name: "Guest houses near Madalena", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Madalena%2C%20Portugal&order=price" },
    { name: "Budget stays near Madalena", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Madalena%2C%20Portugal&order=price" },
  ],
  "Silvalde": [
    { name: "Hotels near Silvalde", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silvalde%2C%20Portugal&order=price" },
    { name: "Guest houses near Silvalde", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silvalde%2C%20Portugal&order=price" },
    { name: "Budget stays near Silvalde", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silvalde%2C%20Portugal&order=price" },
  ],
  "Espinho - Vouga": [
    { name: "Hotels near Espinho - Vouga", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espinho%20-%20Vouga%2C%20Portugal&order=price" },
    { name: "Guest houses near Espinho - Vouga", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espinho%20-%20Vouga%2C%20Portugal&order=price" },
    { name: "Budget stays near Espinho - Vouga", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espinho%20-%20Vouga%2C%20Portugal&order=price" },
  ],
  "São João da Madeira": [
    { name: "Hotels near São João da Madeira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Jo%C3%A3o%20da%20Madeira%2C%20Portugal&order=price" },
    { name: "Guest houses near São João da Madeira", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Jo%C3%A3o%20da%20Madeira%2C%20Portugal&order=price" },
    { name: "Budget stays near São João da Madeira", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Jo%C3%A3o%20da%20Madeira%2C%20Portugal&order=price" },
  ],
  "Vila da Feira": [
    { name: "Hotels near Vila da Feira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20da%20Feira%2C%20Portugal&order=price" },
    { name: "Guest houses near Vila da Feira", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20da%20Feira%2C%20Portugal&order=price" },
    { name: "Budget stays near Vila da Feira", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20da%20Feira%2C%20Portugal&order=price" },
  ],
  "Oliveira de Azeméis": [
    { name: "Hotels near Oliveira de Azeméis", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira%20de%20Azem%C3%A9is%2C%20Portugal&order=price" },
    { name: "Guest houses near Oliveira de Azeméis", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira%20de%20Azem%C3%A9is%2C%20Portugal&order=price" },
    { name: "Budget stays near Oliveira de Azeméis", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira%20de%20Azem%C3%A9is%2C%20Portugal&order=price" },
  ],
  "Rio Meão": [
    { name: "Hotels near Rio Meão", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio%20Me%C3%A3o%2C%20Portugal&order=price" },
    { name: "Guest houses near Rio Meão", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio%20Me%C3%A3o%2C%20Portugal&order=price" },
    { name: "Budget stays near Rio Meão", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio%20Me%C3%A3o%2C%20Portugal&order=price" },
  ],
  "São João de Ver": [
    { name: "Hotels near São João de Ver", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Jo%C3%A3o%20de%20Ver%2C%20Portugal&order=price" },
    { name: "Guest houses near São João de Ver", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Jo%C3%A3o%20de%20Ver%2C%20Portugal&order=price" },
    { name: "Budget stays near São João de Ver", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Jo%C3%A3o%20de%20Ver%2C%20Portugal&order=price" },
  ],
  "Mangualde": [
    { name: "Hotels near Mangualde", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mangualde%2C%20Portugal&order=price" },
    { name: "Guest houses near Mangualde", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mangualde%2C%20Portugal&order=price" },
    { name: "Budget stays near Mangualde", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mangualde%2C%20Portugal&order=price" },
  ],
  "Nelas": [
    { name: "Hotels near Nelas", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nelas%2C%20Portugal&order=price" },
    { name: "Guest houses near Nelas", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nelas%2C%20Portugal&order=price" },
    { name: "Budget stays near Nelas", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Nelas%2C%20Portugal&order=price" },
  ],
  "Gouveia": [
    { name: "Hotels near Gouveia", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Gouveia%2C%20Portugal&order=price" },
    { name: "Guest houses near Gouveia", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Gouveia%2C%20Portugal&order=price" },
    { name: "Budget stays near Gouveia", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Gouveia%2C%20Portugal&order=price" },
  ],
  "Celorico da Beira": [
    { name: "Hotels near Celorico da Beira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Celorico%20da%20Beira%2C%20Portugal&order=price" },
    { name: "Guest houses near Celorico da Beira", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Celorico%20da%20Beira%2C%20Portugal&order=price" },
    { name: "Budget stays near Celorico da Beira", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Celorico%20da%20Beira%2C%20Portugal&order=price" },
  ],
  "Fornos de Algodres": [
    { name: "Hotels near Fornos de Algodres", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Fornos%20de%20Algodres%2C%20Portugal&order=price" },
    { name: "Guest houses near Fornos de Algodres", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Fornos%20de%20Algodres%2C%20Portugal&order=price" },
    { name: "Budget stays near Fornos de Algodres", distanceKm: 1.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Fornos%20de%20Algodres%2C%20Portugal&order=price" },
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
    { name: "Pousada de Viseu", distanceKm: 1, priceFrom: 95, bookingUrl: "https://www.booking.com/hotel/pt/pousada-viseu.html" },
  ],
  "Évora": [
    { name: "Vitória Stone Hotel", distanceKm: 0.8, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/vitoria-stone.html" },
    { name: "Albergaria do Calvário", distanceKm: 1.3, priceFrom: 90, bookingUrl: "https://www.booking.com/hotel/pt/albergaria-do-calvario.html" },
  ],
  "Beja": [
    { name: "Hotel Bejense", distanceKm: 1, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/bejense.html" },
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
    { name: "Hotel Família Portimão", distanceKm: 1, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portim%C3%A3o&order=price" },
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
  "Agualva - Cacém": [
    { name: "Budget hotels · Agualva - Cacém", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Agualva%20-%20Cac%C3%A9m%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Agualva - Cacém", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Agualva%20-%20Cac%C3%A9m%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Agualva - Cacém", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Agualva%20-%20Cac%C3%A9m%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Alcantara - Mar": [
    { name: "Budget hotels · Alcantara - Mar", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alcantara%20-%20Mar%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Alcantara - Mar", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alcantara%20-%20Mar%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Alcantara - Mar", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alcantara%20-%20Mar%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Alcantara - Terra": [
    { name: "Budget hotels · Alcantara - Terra", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alcantara%20-%20Terra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Alcantara - Terra", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alcantara%20-%20Terra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Alcantara - Terra", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alcantara%20-%20Terra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Algés": [
    { name: "Budget hotels · Algés", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alg%C3%A9s%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Algés", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alg%C3%A9s%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Algés", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alg%C3%A9s%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Algueirão - Mem Martins": [
    { name: "Budget hotels · Algueirão - Mem Martins", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Algueir%C3%A3o%20-%20Mem%20Martins%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Algueirão - Mem Martins", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Algueir%C3%A3o%20-%20Mem%20Martins%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Algueirão - Mem Martins", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Algueir%C3%A3o%20-%20Mem%20Martins%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Alhandra": [
    { name: "Budget hotels · Alhandra", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alhandra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Alhandra", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alhandra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Alhandra", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alhandra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Alhos Vedros": [
    { name: "Budget hotels · Alhos Vedros", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alhos%20Vedros%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Alhos Vedros", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alhos%20Vedros%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Alhos Vedros", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alhos%20Vedros%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Alverca": [
    { name: "Budget hotels · Alverca", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alverca%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Alverca", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alverca%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Alverca", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alverca%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Amadora": [
    { name: "Budget hotels · Amadora", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Amadora%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Amadora", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Amadora%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Amadora", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Amadora%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Azambuja": [
    { name: "Budget hotels · Azambuja", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Azambuja%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Azambuja", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Azambuja%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Azambuja", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Azambuja%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Baixa da Banheira": [
    { name: "Budget hotels · Baixa da Banheira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Baixa%20da%20Banheira%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Baixa da Banheira", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Baixa%20da%20Banheira%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Baixa da Banheira", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Baixa%20da%20Banheira%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Barreiro-A": [
    { name: "Budget hotels · Barreiro-A", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barreiro-A%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Barreiro-A", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barreiro-A%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Barreiro-A", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barreiro-A%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Belém": [
    { name: "Budget hotels · Belém", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bel%C3%A9m%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Belém", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bel%C3%A9m%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Belém", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bel%C3%A9m%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Benfica": [
    { name: "Budget hotels · Benfica", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Benfica%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Benfica", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Benfica%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Benfica", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Benfica%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Bobadela": [
    { name: "Budget hotels · Bobadela", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bobadela%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Bobadela", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bobadela%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Bobadela", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bobadela%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Braco de Prata": [
    { name: "Budget hotels · Braco de Prata", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Braco%20de%20Prata%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Braco de Prata", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Braco%20de%20Prata%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Braco de Prata", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Braco%20de%20Prata%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Campolide": [
    { name: "Budget hotels · Campolide", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Campolide%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Campolide", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Campolide%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Campolide", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Campolide%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Carcavelos": [
    { name: "Budget hotels · Carcavelos", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carcavelos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Carcavelos", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carcavelos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Carcavelos", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carcavelos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Carregado": [
    { name: "Budget hotels · Carregado", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carregado%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Carregado", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carregado%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Carregado", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Carregado%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Castanheira do Ribatejo": [
    { name: "Budget hotels · Castanheira do Ribatejo", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Castanheira%20do%20Ribatejo%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Castanheira do Ribatejo", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Castanheira%20do%20Ribatejo%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Castanheira do Ribatejo", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Castanheira%20do%20Ribatejo%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Caxias": [
    { name: "Budget hotels · Caxias", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caxias%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Caxias", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caxias%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Caxias", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caxias%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Cruz Quebrada": [
    { name: "Budget hotels · Cruz Quebrada", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cruz%20Quebrada%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Cruz Quebrada", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cruz%20Quebrada%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Cruz Quebrada", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cruz%20Quebrada%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Entrecampos": [
    { name: "Budget hotels · Entrecampos", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Entrecampos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Entrecampos", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Entrecampos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Entrecampos", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Entrecampos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Espadanal da Azambuja": [
    { name: "Budget hotels · Espadanal da Azambuja", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espadanal%20da%20Azambuja%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Espadanal da Azambuja", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espadanal%20da%20Azambuja%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Espadanal da Azambuja", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espadanal%20da%20Azambuja%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Estoril": [
    { name: "Budget hotels · Estoril", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estoril%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Estoril", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estoril%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Estoril", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estoril%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Lavradio": [
    { name: "Budget hotels · Lavradio", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lavradio%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Lavradio", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lavradio%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Lavradio", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lavradio%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Marvila": [
    { name: "Budget hotels · Marvila", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Marvila%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Marvila", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Marvila%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Marvila", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Marvila%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Massama - Barcarena": [
    { name: "Budget hotels · Massama - Barcarena", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Massama%20-%20Barcarena%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Massama - Barcarena", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Massama%20-%20Barcarena%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Massama - Barcarena", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Massama%20-%20Barcarena%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Merces": [
    { name: "Budget hotels · Merces", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Merces%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Merces", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Merces%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Merces", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Merces%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Moita": [
    { name: "Budget hotels · Moita", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moita%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Moita", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moita%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Moita", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moita%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Monte Abraão": [
    { name: "Budget hotels · Monte Abraão", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Monte%20Abra%C3%A3o%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Monte Abraão", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Monte%20Abra%C3%A3o%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Monte Abraão", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Monte%20Abra%C3%A3o%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Monte Estoril": [
    { name: "Budget hotels · Monte Estoril", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Monte%20Estoril%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Monte Estoril", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Monte%20Estoril%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Monte Estoril", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Monte%20Estoril%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Moscavide": [
    { name: "Budget hotels · Moscavide", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moscavide%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Moscavide", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moscavide%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Moscavide", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Moscavide%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Oeiras": [
    { name: "Budget hotels · Oeiras", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oeiras%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Oeiras", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oeiras%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Oeiras", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oeiras%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Paço de Arcos": [
    { name: "Budget hotels · Paço de Arcos", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pa%C3%A7o%20de%20Arcos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Paço de Arcos", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pa%C3%A7o%20de%20Arcos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Paço de Arcos", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pa%C3%A7o%20de%20Arcos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Palmela": [
    { name: "Budget hotels · Palmela", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Palmela%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Palmela", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Palmela%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Palmela", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Palmela%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Parede": [
    { name: "Budget hotels · Parede", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Parede%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Parede", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Parede%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Parede", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Parede%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Penteado": [
    { name: "Budget hotels · Penteado", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Penteado%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Penteado", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Penteado%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Penteado", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Penteado%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Portela de Sintra": [
    { name: "Budget hotels · Portela de Sintra", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portela%20de%20Sintra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Portela de Sintra", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portela%20de%20Sintra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Portela de Sintra", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portela%20de%20Sintra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Povoa": [
    { name: "Budget hotels · Povoa", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Povoa%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Povoa", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Povoa%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Povoa", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Povoa%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Praça do Quebedo": [
    { name: "Budget hotels · Praça do Quebedo", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pra%C3%A7a%20do%20Quebedo%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Praça do Quebedo", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pra%C3%A7a%20do%20Quebedo%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Praça do Quebedo", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pra%C3%A7a%20do%20Quebedo%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Queluz - Belas": [
    { name: "Budget hotels · Queluz - Belas", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Queluz%20-%20Belas%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Queluz - Belas", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Queluz%20-%20Belas%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Queluz - Belas", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Queluz%20-%20Belas%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Reboleira": [
    { name: "Budget hotels · Reboleira", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Reboleira%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Reboleira", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Reboleira%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Reboleira", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Reboleira%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Reguengo - Vale da Pedra - Pontevel": [
    { name: "Budget hotels · Reguengo - Vale da Pedra - Pontevel", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Reguengo%20-%20Vale%20da%20Pedra%20-%20Pontevel%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Reguengo - Vale da Pedra - Pontevel", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Reguengo%20-%20Vale%20da%20Pedra%20-%20Pontevel%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Reguengo - Vale da Pedra - Pontevel", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Reguengo%20-%20Vale%20da%20Pedra%20-%20Pontevel%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Rio de Mouro": [
    { name: "Budget hotels · Rio de Mouro", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio%20de%20Mouro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Rio de Mouro", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio%20de%20Mouro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Rio de Mouro", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio%20de%20Mouro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Roma - Areeiro": [
    { name: "Budget hotels · Roma - Areeiro", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Roma%20-%20Areeiro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Roma - Areeiro", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Roma%20-%20Areeiro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Roma - Areeiro", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Roma%20-%20Areeiro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Sacavem": [
    { name: "Budget hotels · Sacavem", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sacavem%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Sacavem", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sacavem%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Sacavem", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sacavem%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Santa Cruz - Damaia": [
    { name: "Budget hotels · Santa Cruz - Damaia", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santa%20Cruz%20-%20Damaia%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Santa Cruz - Damaia", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santa%20Cruz%20-%20Damaia%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Santa Cruz - Damaia", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santa%20Cruz%20-%20Damaia%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Santa Iria": [
    { name: "Budget hotels · Santa Iria", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santa%20Iria%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Santa Iria", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santa%20Iria%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Santa Iria", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santa%20Iria%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Santo Amaro": [
    { name: "Budget hotels · Santo Amaro", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santo%20Amaro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Santo Amaro", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santo%20Amaro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Santo Amaro", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santo%20Amaro%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Santos": [
    { name: "Budget hotels · Santos", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Santos", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Santos", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santos%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Sete Rios": [
    { name: "Budget hotels · Sete Rios", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sete%20Rios%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Sete Rios", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sete%20Rios%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Sete Rios", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sete%20Rios%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Virtudes": [
    { name: "Budget hotels · Virtudes", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Virtudes%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Virtudes", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Virtudes%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Virtudes", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Virtudes%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Mafra": [
    { name: "Budget hotels · Mafra", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mafra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Guest houses · Mafra", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mafra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
    { name: "Hostels · Mafra", distanceKm: 1.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mafra%2C%20Portugal&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price" },
  ],
  "Pragal": [
    { name: "Holiday Inn Express Lisbon-Almada", distanceKm: 0.4, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pragal%2C+Almada&order=price" },
    { name: "Alojamento Pragal", distanceKm: 0.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pragal%2C+Almada&order=price" },
  ],
  "Pinhal Novo": [
    { name: "Hotel Pinhal Novo", distanceKm: 0.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pinhal+Novo&order=price" },
    { name: "Residencial Central", distanceKm: 0.7, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pinhal+Novo&order=price" },
  ],
  "Barreiro": [
    { name: "Hotel Barreiro", distanceKm: 0.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barreiro%2C+Portugal&order=price" },
    { name: "Alojamento Margem Sul", distanceKm: 1.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barreiro%2C+Portugal&order=price" },
  ],
  "Torres Vedras": [
    { name: "Hotel Império Jardim", distanceKm: 0.6, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torres+Vedras&order=price" },
    { name: "Hotel dos Arcos", distanceKm: 0.9, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torres+Vedras&order=price" },
  ],
  "Mira Sintra-Meleças": [
    { name: "Hotel Nova Sintra", distanceKm: 1.6, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mele%C3%A7as%2C+Sintra&order=price" },
    { name: "Casa de Meleças", distanceKm: 1.2, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mele%C3%A7as%2C+Sintra&order=price" },
  ],
  "Abrantes": [
    { name: "Hotel de Turismo de Abrantes", distanceKm: 1.5, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Abrantes&order=price" },
    { name: "Residencial Aliança", distanceKm: 0.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Abrantes&order=price" },
  ],
  "Portalegre": [
    { name: "Hotel Mansão Alto Alentejo", distanceKm: 1.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portalegre&order=price" },
    { name: "Rossio Hotel", distanceKm: 1.7, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portalegre&order=price" },
  ],
  "Elvas": [
    { name: "Hotel São João de Deus", distanceKm: 1.9, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Elvas&order=price" },
    { name: "Hotel D. Luís", distanceKm: 1.6, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Elvas&order=price" },
  ],
  "Vendas Novas": [
    { name: "Hotel Afonso", distanceKm: 0.7, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vendas+Novas&order=price" },
    { name: "Pensão Central", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vendas+Novas&order=price" },
  ],
  "Olhão": [
    { name: "Real Marina Hotel & Spa", distanceKm: 1.1, priceFrom: 80, bookingUrl: "https://www.booking.com/searchresults.html?ss=Olh%C3%A3o&order=price" },
    { name: "Hotel Ria-Sol", distanceKm: 0.5, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Olh%C3%A3o&order=price" },
  ],
  "Loulé": [
    { name: "Loulé Jardim Hotel", distanceKm: 1.9, priceFrom: 65, bookingUrl: "https://www.booking.com/searchresults.html?ss=Loul%C3%A9&order=price" },
    { name: "Casa Beny", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Loul%C3%A9&order=price" },
  ],
  "Silves": [
    { name: "Colina dos Mouros", distanceKm: 0.6, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silves%2C+Algarve&order=price" },
    { name: "Hotel Vila Sodré", distanceKm: 1.4, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silves%2C+Algarve&order=price" },
  ],
};
