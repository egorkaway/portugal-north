export interface Hotel {
  name: string;
  distanceKm: number;
  priceFrom: number; // EUR per night
  bookingUrl: string;
}

export type StationHotels = Record<string, Hotel[]>;

// Recommended budget hotels near each station (typically within ~2–5 km depending on OSM coverage)
// Prices are approximate starting rates in EUR
export const stationHotels: StationHotels = {
  "Pombal": [
    { name: "Hotel Cardal", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/cardal.html" },
    { name: "Cardal Hotel", distanceKm: 0, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cardal%20Hotel%2C%20Pombal%2C%20Portugal&order=price" },
    { name: "Hotel Pombalense", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Pombalense%2C%20Pombal%2C%20Portugal&order=price" },
  ],
  "Alfarelos": [
    { name: "Casa da Azenha", distanceKm: 1.5, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alfarelos%2C+Portugal&order=price" },
    { name: "Quinta do Mosteiro", distanceKm: 1.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alfarelos%2C+Portugal&order=price" },
    { name: "Albergaria Alfarelos", distanceKm: 0.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alfarelos%2C+Portugal&order=price" },
  ],
  "Coimbra-B": [
    { name: "Hotel Mondego", distanceKm: 1.8, priceFrom: 42, bookingUrl: "https://www.booking.com/hotel/pt/mondego.html" },
    { name: "Just Stay Coimbra", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Just%20Stay%20Coimbra%2C%20Coimbra-B%2C%20Portugal&order=price" },
    { name: "Hotel Vila Galé", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Vila%20Gal%C3%A9%2C%20Coimbra-B%2C%20Portugal&order=price" },
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
    { name: "Hotel As Américas", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20As%20Am%C3%A9ricas%2C%20Aveiro%2C%20Portugal&order=price" },
  ],
  "Canelas": [
    { name: "Motel Eclipse", distanceKm: 3.5, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Motel%20Eclipse%2C%20Canelas%2C%20Portugal&order=price" },
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
    { name: "Mirandesa Guesthouse", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/mirandesa-guesthouse.html" },
    { name: "Pensão Douro", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pens%C3%A3o%20Douro%2C%20S%C3%A3o%20Bento%20(Porto)%2C%20Portugal&order=price" },
    { name: "Casa dos Lóios by Shiadu", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20dos%20L%C3%B3ios%20by%20Shiadu%2C%20S%C3%A3o%20Bento%20(Porto)%2C%20Portugal&order=price" },
  ],
  "Porto-Campanhã": [
    { name: "Campanha Boutique Station B&B", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/campanha-boutique-station.html" },
    { name: "Hospedaria Porto", distanceKm: 0.1, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospedaria%20Porto%2C%20Porto-Campanh%C3%A3%2C%20Portugal&order=price" },
    { name: "Hotel Poveira", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Poveira%2C%20Porto-Campanh%C3%A3%2C%20Portugal&order=price" },
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
    { name: "ibis Braga Centro", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/ibis-braga.html" },
    { name: "Hotel Dona Sofia", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/dona-sofia.html" },
    { name: "Hotel da Estação", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20da%20Esta%C3%A7%C3%A3o%2C%20Braga%2C%20Portugal&order=price" },
  ],
  "Lousado": [
    { name: "Pensão Lousado", distanceKm: 0.4, priceFrom: 22, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousado%2C+Portugal&order=price" },
    { name: "Casa Rural Lousado", distanceKm: 1, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousado%2C+Portugal&order=price" },
    { name: "Quinta do Vale", distanceKm: 1.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousado%2C+Portugal&order=price" },
  ],
  "Guimarães": [
    { name: "ibis Guimarães Centro", distanceKm: 0.8, priceFrom: 39, bookingUrl: "https://www.booking.com/hotel/pt/ibis-guimaraes.html" },
    { name: "Ilha do Sabão", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ilha%20do%20Sab%C3%A3o%2C%20Guimar%C3%A3es%2C%20Portugal&order=price" },
    { name: "Hostel Prime", distanceKm: 0.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hostel%20Prime%2C%20Guimar%C3%A3es%2C%20Portugal&order=price" },
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
    { name: "Hotel Navarras", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/navarras.html" },
    { name: "Des Arts Hostel and Suites", distanceKm: 0.5, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Des%20Arts%20Hostel%20and%20Suites%2C%20Amarante%2C%20Portugal&order=price" },
    { name: "Casa do Fontanário Stay", distanceKm: 0.5, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20do%20Fontan%C3%A1rio%20Stay%2C%20Amarante%2C%20Portugal&order=price" },
  ],
  "Peso da Régua": [
    { name: "Hotel Régua Douro", distanceKm: 0.1, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/regua-douro.html" },
    { name: "Original Douro Hotel", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/original-douro.html" },
    { name: "Residencial Douro", distanceKm: 0.5, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/residencial-douro.html" },
  ],
  "Barcelos": [
    { name: "Residencial Arantes", distanceKm: 0.8, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barcelos%2C+Portugal&order=price" },
    { name: "Hotel Dom Nuno", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Dom%20Nuno%2C%20Barcelos%2C%20Portugal&order=price" },
    { name: "Albergue de Peregrinos Cidade de Barcelos", distanceKm: 0.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20de%20Peregrinos%20Cidade%20de%20Barcelos%2C%20Barcelos%2C%20Portugal&order=price" },
  ],
  "Viana do Castelo": [
    { name: "HI Viana do Castelo (Pousada de Juventude)", distanceKm: 1.5, priceFrom: 15, bookingUrl: "https://www.booking.com/hotel/pt/pousada-de-juventude-de-viana-do-castelo.html" },
    { name: "Residencial Santos", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Santos%2C%20Viana%20do%20Castelo%2C%20Portugal&order=price" },
    { name: "Casa Manuel Espregueira e Oliveira", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20Manuel%20Espregueira%20e%20Oliveira%2C%20Viana%20do%20Castelo%2C%20Portugal&order=price" },
  ],
  "Valença": [
    { name: "Hotel Val Flores", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/hotel/pt/val-flores.html" },
    { name: "Residencial Ponte Seca", distanceKm: 0.4, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valenca%2C+Portugal&order=price" },
    { name: "Residencial S. Gião", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20S.%20Gi%C3%A3o%2C%20Valen%C3%A7a%2C%20Portugal&order=price" },
  ],
  "Cacia": [
    { name: "Casa de Cacia", distanceKm: 0.5, priceFrom: 28, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cacia%2C+Aveiro%2C+Portugal&order=price" },
    { name: "Quinta do Salgueiro", distanceKm: 1.4, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cacia%2C+Aveiro%2C+Portugal&order=price" },
    { name: "Hotel João Padeiro", distanceKm: 0.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Jo%C3%A3o%20Padeiro%2C%20Cacia%2C%20Portugal&order=price" },
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
    { name: "Hotel Solverde Spa & Wellness Center", distanceKm: 0.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Solverde%20Spa%20%26%20Wellness%20Center%2C%20Granja%2C%20Portugal&order=price" },
  ],
  "Darque": [
    { name: "Hotel Aliança Darque", distanceKm: 0.5, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Darque%2C+Viana+do+Castelo%2C+Portugal&order=price" },
    { name: "Casa do Rio Lima", distanceKm: 1.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Darque%2C+Viana+do+Castelo%2C+Portugal&order=price" },
    { name: "Hotel Margarida Da Praça", distanceKm: 1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Margarida%20Da%20Pra%C3%A7a%2C%20Darque%2C%20Portugal&order=price" },
  ],
  "Areia-Darque": [
    { name: "Hotel do Cais", distanceKm: 0.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20do%20Cais%2C%20Viana+do+Castelo%2C+Portugal&order=price" },
    { name: "Residencial Maryjoe Darque", distanceKm: 1.5, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Maryjoe%20Darque%2C%20Viana+do+Castelo%2C+Portugal&order=price" },
    { name: "Hotel Aliança Darque", distanceKm: 1, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Alian%C3%A7a%20Darque%2C%20Viana+do+Castelo%2C+Portugal&order=price" },
  ],
  "Afife": [
    { name: "Casa do Adro de Afife", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Afife%2C+Portugal&order=price" },
    { name: "Quinta da Boa Viagem", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Afife%2C+Portugal&order=price" },
    { name: "Casa Penedo da Saudade", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20Penedo%20da%20Saudade%2C%20Afife%2C%20Portugal&order=price" },
  ],
  "Vila Praia de Âncora": [
    { name: "Hotel Meira", distanceKm: 0.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Praia+de+Ancora%2C+Portugal&order=price" },
    { name: "Pensão Albergaria Quim Barreiros", distanceKm: 0.4, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Praia+de+Ancora%2C+Portugal&order=price" },
    { name: "Casa da Praça Âncora", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Praia+de+Ancora%2C+Portugal&order=price" },
  ],
  "Caminha": [
    { name: "Residencial Galo D'Ouro", distanceKm: 0.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caminha%2C+Portugal&order=price" },
    { name: "Albergue Bom Caminha", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20Bom%20Caminha%2C%20Caminha%2C%20Portugal&order=price" },
    { name: "Turismo Rural - Casa de Leiras", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Turismo%20Rural%20-%20Casa%20de%20Leiras%2C%20Caminha%2C%20Portugal&order=price" },
  ],
  "Mesão Frio": [
    { name: "Casa d'Alem", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mesao+Frio%2C+Portugal&order=price" },
    { name: "Quinta de São Bernardo", distanceKm: 1.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mesao+Frio%2C+Portugal&order=price" },
    { name: "Solar da Rede", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Solar%20da%20Rede%2C%20Mes%C3%A3o%20Frio%2C%20Portugal&order=price" },
  ],
  "Pinhão": [
    { name: "Casa do Visconde de Chanceleiros", distanceKm: 1.8, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pinhao%2C+Portugal&order=price" },
    { name: "Quinta do Pôpa", distanceKm: 1.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pinhao%2C+Portugal&order=price" },
    { name: "Residencial Ponto Grande", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Ponto%20Grande%2C%20Pinh%C3%A3o%2C%20Portugal&order=price" },
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
    { name: "Casa Morais", distanceKm: 3.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20Morais%2C%20Souselas%2C%20Portugal&order=price" },
  ],
  "Curia": [
    { name: "Hotel das Termas da Curia", distanceKm: 0.6, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Curia%2C+Portugal&order=price" },
    { name: "Pensão Lourenço", distanceKm: 0.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Curia%2C+Portugal&order=price" },
    { name: "Curia Clube", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Curia%20Clube%2C%20Curia%2C%20Portugal&order=price" },
  ],
  "Oliveira do Bairro": [
    { name: "Paloma Blanca Hotel", distanceKm: 0.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira+do+Bairro%2C+Portugal&order=price" },
    { name: "Quinta do Pinheiro", distanceKm: 1.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira+do+Bairro%2C+Portugal&order=price" },
    { name: "Hotel Paraíso", distanceKm: 0.4, priceFrom: 38, bookingUrl: "https://www.booking.com/hotel/pt/paraiso.pt-pt.html" },
  ],
  "Quintans": [
    { name: "Hotel das Américas (Aveiro)", distanceKm: 1.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quintans%2C+Aveiro%2C+Portugal&order=price" },
    { name: "Pensão da Praia (Ílhavo)", distanceKm: 2.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quintans%2C+Aveiro%2C+Portugal&order=price" },
    { name: "Residencial João Capela", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Jo%C3%A3o%20Capela%2C%20Quintans%2C%20Portugal&order=price" },
  ],
  "Oiã": [
    { name: "Casa da Avó (Oiã)", distanceKm: 0.6, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oia%2C+Oliveira+do+Bairro%2C+Portugal&order=price" },
    { name: "Paloma Blanca Hotel", distanceKm: 1.4, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Oliveira+do+Bairro%2C+Portugal&order=price" },
    { name: "Residencial Ferpenta", distanceKm: 3.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Ferpenta%2C%20Oi%C3%A3%2C%20Portugal&order=price" },
  ],
  "Paraimo-Sangalhos": [
    { name: "Quinta dos Abrigueiros", distanceKm: 1.2, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sangalhos%2C+Portugal&order=price" },
    { name: "Hotel das Termas da Curia", distanceKm: 2, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Paraimo%2C+Portugal&order=price" },
    { name: "Estalagem de Sangalhos", distanceKm: 1.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estalagem%20de%20Sangalhos%2C%20Paraimo-Sangalhos%2C%20Portugal&order=price" },
  ],
  "Aguim": [
    { name: "Hotel das Termas da Curia", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aguim%2C+Portugal&order=price" },
    { name: "Pensão Lourenço", distanceKm: 1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Curia%2C+Portugal&order=price" },
    { name: "Palace Hotel da Curia", distanceKm: 1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Palace%20Hotel%20da%20Curia%2C%20Aguim%2C%20Portugal&order=price" },
  ],
  "Vilela-Fornos": [
    { name: "Hotel Oslo Coimbra", distanceKm: 2.5, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbra%2C+Portugal&order=price" },
    { name: "Quinta Rural Coimbra Norte", distanceKm: 1.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torre+de+Vilela%2C+Portugal&order=price" },
    { name: "Casa Morais", distanceKm: 0.4, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20Morais%2C%20Vilela-Fornos%2C%20Portugal&order=price" },
  ],
  "Adémia": [
    { name: "Hotel Oslo Coimbra", distanceKm: 2, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbra%2C+Portugal&order=price" },
    { name: "Ibis Coimbra Centro", distanceKm: 2.2, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbra%2C+Portugal&order=price" },
    { name: "Fonte dos Amores", distanceKm: 1.1, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Fonte%20dos%20Amores%2C%20Ad%C3%A9mia%2C%20Portugal&order=price" },
  ],
  "General Torres": [
    { name: "Hotel Ibis Porto Gaia", distanceKm: 1.2, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Nova+de+Gaia%2C+Portugal&order=price" },
    { name: "Porto Antas Hotel", distanceKm: 1.8, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porto%2C+Portugal&order=price" },
    { name: "Hostel Gaia Porto", distanceKm: 0.3, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hostel%20Gaia%20Porto%2C%20General%20Torres%2C%20Portugal&order=price" },
  ],
  "Coimbrões": [
    { name: "Hotel Ibis Porto Gaia", distanceKm: 1.5, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbr%C3%B5es%2C+Portugal&order=price" },
    { name: "Hotel Solverde Porto Gaia", distanceKm: 2, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Nova+de+Gaia%2C+Portugal&order=price" },
    { name: "Park Hotel Porto Gaia", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Park%20Hotel%20Porto%20Gaia%2C%20Coimbr%C3%B5es%2C%20Portugal&order=price" },
  ],
  "Valadares": [
    { name: "Hotel Solverde Porto Gaia", distanceKm: 1, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valadares%2C+Vila+Nova+de+Gaia&order=price" },
    { name: "Hotel Ibis Porto Gaia", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Nova+de+Gaia%2C+Portugal&order=price" },
    { name: "Porto Gaia Guest House", distanceKm: 3, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porto%20Gaia%20Guest%20House%2C%20Valadares%2C%20Portugal&order=price" },
  ],
  "Francelos": [
    { name: "Hotel Praia da Baía", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Francelos%2C+Portugal&order=price" },
    { name: "Hotel Ibis Porto Gaia", distanceKm: 2.2, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Nova+de+Gaia%2C+Portugal&order=price" },
  ],
  "Miramar": [
    { name: "Hotel Praia da Baía", distanceKm: 0.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Miramar%2C+Vila+Nova+de+Gaia&order=price" },
    { name: "Hotel Praia Gelo", distanceKm: 0.9, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Miramar%2C+Portugal&order=price" },
    { name: "Casa da Granja", distanceKm: 3.5, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20da%20Granja%2C%20Miramar%2C%20Portugal&order=price" },
  ],
  "Aguda": [
    { name: "Hotel Praia Gelo", distanceKm: 0.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aguda%2C+Vila+Nova+de+Gaia&order=price" },
    { name: "Hotel Praia da Baía", distanceKm: 1.2, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aguda%2C+Portugal&order=price" },
    { name: "Casa da Granja", distanceKm: 0.5, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20da%20Granja%2C%20Aguda%2C%20Portugal&order=price" },
  ],
  "Paramos": [
    { name: "Hotel Ibis Porto Gaia", distanceKm: 2.5, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Paramos%2C+Espinho&order=price" },
    { name: "Hotel Solverde Espinho", distanceKm: 1.5, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Espinho%2C+Portugal&order=price" },
    { name: "Pousada da Juventude Espinho", distanceKm: 1.7, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pousada%20da%20Juventude%20Espinho%2C%20Paramos%2C%20Portugal&order=price" },
  ],
  "Soure": [
    { name: "Hotel Parque Serra da Lousã", distanceKm: 1.2, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Soure%2C+Portugal&order=price" },
    { name: "Residencial Central Soure", distanceKm: 0.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Soure%2C+Portugal&order=price" },
  ],
  "Caxarias": [
    { name: "Hotel Mira Serra", distanceKm: 1.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caxarias%2C+Our%C3%A9m&order=price" },
    { name: "Hotel Santo António", distanceKm: 1.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Our%C3%A9m%2C+Portugal&order=price" },
    { name: "Alojamento Local Manalvo", distanceKm: 0.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alojamento%20Local%20Manalvo%2C%20Caxarias%2C%20Portugal&order=price" },
  ],
  "Lamarosa": [
    { name: "Hotel dos Templários", distanceKm: 1.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torres+Novas%2C+Portugal&order=price" },
    { name: "Hotel Lusitano", distanceKm: 1.2, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torres+Novas%2C+Portugal&order=price" },
  ],
  "Válega": [
    { name: "Casa da Igreja de Válega", distanceKm: 0.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valega%2C+Portugal&order=price" },
    { name: "Hotel Meia Lua (Ovar)", distanceKm: 1.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Valega%2C+Portugal&order=price" },
    { name: "Vintage Balcony - Guest House", distanceKm: 1.5, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vintage%20Balcony%20-%20Guest%20House%2C%20V%C3%A1lega%2C%20Portugal&order=price" },
  ],
  "Contumil": [
    { name: "Ibis Budget Porto Gaia", distanceKm: 1.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Contumil%2C+Porto&order=price" },
    { name: "Porto Antas Hotel", distanceKm: 0.9, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Contumil%2C+Porto&order=price" },
    { name: "AC Hotel Porto", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=AC%20Hotel%20Porto%2C%20Contumil%2C%20Portugal&order=price" },
  ],
  "Rio Tinto": [
    { name: "Hotel Rio Tinto", distanceKm: 0.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio+Tinto%2C+Portugal&order=price" },
    { name: "Hotel Premium Porto Downtown", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio+Tinto%2C+Portugal&order=price" },
    { name: "Gardenia Porto Guest House", distanceKm: 1.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Gardenia%20Porto%20Guest%20House%2C%20Rio%20Tinto%2C%20Portugal&order=price" },
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
    { name: "Casa do Avô Horácio", distanceKm: 0.7, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20do%20Av%C3%B4%20Hor%C3%A1cio%2C%20Carre%C3%A7o%2C%20Portugal&order=price" },
  ],
  "Areosa": [
    { name: "Hotel Axis Viana", distanceKm: 1.8, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Areosa%2C+Viana+do+Castelo&order=price" },
    { name: "Casa de Areosa", distanceKm: 0.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Areosa%2C+Viana+do+Castelo&order=price" },
    { name: "Quinta Boa Viagem", distanceKm: 0.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20Boa%20Viagem%2C%20Areosa%2C%20Portugal&order=price" },
  ],
  "Aregos": [
    { name: "Hotel Termas de São Vicente", distanceKm: 1.5, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas+de+Aregos%2C+Portugal&order=price" },
    { name: "Casa de Aregos", distanceKm: 0.7, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas+de+Aregos%2C+Portugal&order=price" },
    { name: "Pousada da Calçada", distanceKm: 1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pousada%20da%20Cal%C3%A7ada%2C%20Aregos%2C%20Portugal&order=price" },
  ],
  "Mosteirô": [
    { name: "Quinta de Mosteirô", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mosteiro%2C+Cinfaes&order=price" },
    { name: "Douro Cliff Hotel", distanceKm: 1.9, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mosteiro%2C+Cinfaes&order=price" },
    { name: "A Padaria Farmhouse", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=A%20Padaria%20Farmhouse%2C%20Mosteir%C3%B4%2C%20Portugal&order=price" },
  ],
  "Caldas de Vizela": [
    { name: "Hotel Bienestar Termas de Vizela", distanceKm: 0.4, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/bienestar-termas-de-vizela.html" },
    { name: "Casa das Caldas", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Caldas+de+Vizela%2C+Portugal&order=price" },
    { name: "Hotel Bienestar", distanceKm: 1.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Bienestar%2C%20Caldas%20de%20Vizela%2C%20Portugal&order=price" },
  ],
  "Lordelo": [
    { name: "Casa de Lordelo", distanceKm: 0.7, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lordelo%2C+Guimaraes&order=price" },
    { name: "Hotel Mestre de Avis", distanceKm: 1.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lordelo%2C+Guimaraes&order=price" },
    { name: "Casa de Sezim", distanceKm: 2.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20de%20Sezim%2C%20Lordelo%2C%20Portugal&order=price" },
  ],
  "Mirandela": [
    { name: "Hotel Dom Dinis Mirandela", distanceKm: 0.6, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mirandela%2C+Portugal&order=price" },
    { name: "Residencial Globo", distanceKm: 0.4, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mirandela%2C+Portugal&order=price" },
    { name: "Quinta do Ervedal", distanceKm: 1.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mirandela%2C+Portugal&order=price" },
  ],
  "Coimbra": [
    { name: "Ibis Coimbra Centro", distanceKm: 0.4, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/ibis-coimbra.html" },
    { name: "Hotel Avenida", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Avenida%2C%20Coimbra%2C%20Portugal&order=price" },
    { name: "Coimbra Portagem Hostel", distanceKm: 0.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Coimbra%20Portagem%20Hostel%2C%20Coimbra%2C%20Portugal&order=price" },
  ],
  "Mogofores": [
    { name: "Quinta dos Abrigueiros", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mogofores%2C+Portugal&order=price" },
    { name: "Curia Clube", distanceKm: 1.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Curia%20Clube%2C%20Mogofores%2C%20Portugal&order=price" },
    { name: "Hotel das Termas - Curia, Termas, Spa & Golf", distanceKm: 2.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20das%20Termas%20-%20Curia%2C%20Termas%2C%20Spa%20%26%20Golf%2C%20Mogofores%2C%20Portugal&order=price" },
  ],
  "Avanca": [
    { name: "Casa Egas Moniz", distanceKm: 0.9, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Avanca%2C+Portugal&order=price" },
    { name: "Hotel Estarreja", distanceKm: 1.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estarreja%2C+Portugal&order=price" },
    { name: "Hospedaria La Mirandeza", distanceKm: 3.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospedaria%20La%20Mirandeza%2C%20Avanca%2C%20Portugal&order=price" },
  ],
  "Penafiel": [
    { name: "Residencial Marques", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Penafiel%2C+Portugal&order=price" },
    { name: "Quinta do Quintino", distanceKm: 1.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20do%20Quintino%2C%20Penafiel%2C%20Portugal&order=price" },
    { name: "Quinta do Padrão", distanceKm: 2.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20do%20Padr%C3%A3o%2C%20Penafiel%2C%20Portugal&order=price" },
  ],
  "Paredes": [
    { name: "Hotel Comendador", distanceKm: 0.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Paredes%2C+Portugal&order=price" },
    { name: "Casa de Aveleda", distanceKm: 1.8, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Paredes%2C+Portugal&order=price" },
    { name: "Hotel de Paredes", distanceKm: 0.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20de%20Paredes%2C%20Paredes%2C%20Portugal&order=price" },
  ],
  "Cete": [
    { name: "Quinta de Cete", distanceKm: 0.7, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cete%2C+Paredes&order=price" },
    { name: "Hotel Zé do Telhado", distanceKm: 1.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Z%C3%A9%20do%20Telhado%2C%20Cete%2C%20Portugal&order=price" },
    { name: "Hotel de Paredes", distanceKm: 2.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20de%20Paredes%2C%20Cete%2C%20Portugal&order=price" },
  ],
  "Recarei-Sobreira": [
    { name: "Casa de Recarei", distanceKm: 1.1, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Recarei%2C+Paredes&order=price" },
    { name: "O Sonho", distanceKm: 3.3, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=O%20Sonho%2C%20Recarei-Sobreira%2C%20Portugal&order=price" },
  ],
  "Vila Meã": [
    { name: "Casa de Pousada", distanceKm: 0.8, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila+Mea%2C+Amarante&order=price" },
    { name: "Monverde Wine Experience", distanceKm: 1.9, priceFrom: 90, bookingUrl: "https://www.booking.com/hotel/pt/monverde-wine-experience.html" },
  ],
  "Rio Mau": [
    { name: "Casa do Ribeiro", distanceKm: 1.3, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rio+Mau%2C+Vila+do+Conde&order=price" },
  ],
  "Águeda": [
    { name: "Pensão Celeste", distanceKm: 0.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pens%C3%A3o%20Celeste%2C%20%C3%81gueda%2C%20Portugal&order=price" },
    { name: "Albergue de Peregrinos Santo António de Águeda/Celeste", distanceKm: 0.6, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20de%20Peregrinos%20Santo%20Ant%C3%B3nio%20de%20%C3%81gueda%2FCeleste%2C%20%C3%81gueda%2C%20Portugal&order=price" },
    { name: "Hostel and Friends", distanceKm: 0.6, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hostel%20and%20Friends%2C%20%C3%81gueda%2C%20Portugal&order=price" },
  ],
  "Sernada do Vouga": [
    { name: "Casa da Vereda", distanceKm: 1.5, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sernada+do+Vouga&order=price" },
  ],
  "Macinhata do Vouga": [
    { name: "Casa do Vouga", distanceKm: 1.2, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Macinhata+do+Vouga&order=price" },
    { name: "Hotel Alameda", distanceKm: 3.1, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Alameda%2C%20Macinhata%20do%20Vouga%2C%20Portugal&order=price" },
    { name: "Quinta da Fontoura", distanceKm: 3.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20da%20Fontoura%2C%20Macinhata%20do%20Vouga%2C%20Portugal&order=price" },
  ],
  "Cortegaça": [
    { name: "Hotel Praia Mar", distanceKm: 1.4, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cortega%C3%A7a%2C+Ovar&order=price" },
    { name: "Casa da Praia", distanceKm: 0.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cortega%C3%A7a%2C+Ovar&order=price" },
    { name: "Apartamentos Vista Mare", distanceKm: 1.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Apartamentos%20Vista%20Mare%2C%20Cortega%C3%A7a%2C%20Portugal&order=price" },
  ],
  "Taveiro": [
    { name: "Quinta de Taveiro", distanceKm: 1.1, priceFrom: 42, bookingUrl: "https://www.booking.com/searchresults.html?ss=Taveiro%2C+Coimbra&order=price" },
    { name: "Jantesta Guest House", distanceKm: 2.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Jantesta%20Guest%20House%2C%20Taveiro%2C%20Portugal&order=price" },
    { name: "Hotel Quinta das Lágrimas", distanceKm: 3.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Quinta%20das%20L%C3%A1grimas%2C%20Taveiro%2C%20Portugal&order=price" },
  ],
  "Lousada": [
    { name: "Casa de Juste", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousada%2C+Portugal&order=price" },
    { name: "Hotel Lousadense", distanceKm: 0.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lousada%2C+Portugal&order=price" },
    { name: "Quinta de Lourosa", distanceKm: 2.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20de%20Lourosa%2C%20Lousada%2C%20Portugal&order=price" },
  ],
  "Vila Nova de Cerveira": [
    { name: "Residencial Rainha do Gusmão", distanceKm: 0.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Rainha%20do%20Gusm%C3%A3o%2C%20Vila%20Nova%20de%20Cerveira%2C%20Portugal&order=price" },
    { name: "Minho Belo", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Minho%20Belo%2C%20Vila%20Nova%20de%20Cerveira%2C%20Portugal&order=price" },
    { name: "Pousada de Juventude Vila Nova de Cerveira", distanceKm: 0.7, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pousada%20de%20Juventude%20Vila%20Nova%20de%20Cerveira%2C%20Vila%20Nova%20de%20Cerveira%2C%20Portugal&order=price" },
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
    { name: "Tic Tac", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tic%20Tac%2C%20Bragan%C3%A7a%2C%20Portugal&order=price" },
    { name: "Tulipa", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tulipa%2C%20Bragan%C3%A7a%2C%20Portugal&order=price" },
  ],
  "São Pedro da Torre": [
    { name: "Alvorada Medieval", distanceKm: 0.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alvorada%20Medieval%2C%20S%C3%A3o%20Pedro%20da%20Torre%2C%20Portugal&order=price" },
    { name: "Hostal Residencial", distanceKm: 1.1, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hostal%20Residencial%2C%20S%C3%A3o%20Pedro%20da%20Torre%2C%20Portugal&order=price" },
    { name: "Residencial Marco de São Pedro", distanceKm: 1.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Marco%20de%20S%C3%A3o%20Pedro%2C%20S%C3%A3o%20Pedro%20da%20Torre%2C%20Portugal&order=price" },
  ],
  "Carvalha": [
    { name: "Residencial Costa Verde", distanceKm: 1.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Costa%20Verde%2C%20Carvalha%2C%20Portugal&order=price" },
    { name: "Hotel Minho", distanceKm: 1.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Minho%2C%20Carvalha%2C%20Portugal&order=price" },
    { name: "Padre Cruz", distanceKm: 2.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Padre%20Cruz%2C%20Carvalha%2C%20Portugal&order=price" },
  ],
  "Gondarém": [
    { name: "Vila D'Artes", distanceKm: 0.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20D'Artes%2C%20Gondar%C3%A9m%2C%20Portugal&order=price" },
    { name: "Estalagem da Boega", distanceKm: 0.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Estalagem%20da%20Boega%2C%20Gondar%C3%A9m%2C%20Portugal&order=price" },
    { name: "Hostel Albergue. Casa Gwendoline", distanceKm: 2.1, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hostel%20Albergue.%20Casa%20Gwendoline%2C%20Gondar%C3%A9m%2C%20Portugal&order=price" },
  ],
  "Esqueiró": [
    { name: "Vila D'Artes", distanceKm: 2.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20D'Artes%2C%20Esqueir%C3%B3%2C%20Portugal&order=price" },
    { name: "Albergue S. Bento", distanceKm: 2.5, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20S.%20Bento%2C%20Esqueir%C3%B3%2C%20Portugal&order=price" },
    { name: "Casas da Azenha", distanceKm: 2.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casas%20da%20Azenha%2C%20Esqueir%C3%B3%2C%20Portugal&order=price" },
  ],
  "Seixas": [
    { name: "Albergue S. Bento", distanceKm: 0.1, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20S.%20Bento%2C%20Seixas%2C%20Portugal&order=price" },
    { name: "Residencial São Pedro", distanceKm: 0.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20S%C3%A3o%20Pedro%2C%20Seixas%2C%20Portugal&order=price" },
    { name: "Albergue de Peregrinos - Caminha", distanceKm: 2.6, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20de%20Peregrinos%20-%20Caminha%2C%20Seixas%2C%20Portugal&order=price" },
  ],
  "Senhora da Agonia": [
    { name: "Albergue Bom Caminha", distanceKm: 0.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20Bom%20Caminha%2C%20Senhora%20da%20Agonia%2C%20Portugal&order=price" },
    { name: "Porta do Sol", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porta%20do%20Sol%2C%20Senhora%20da%20Agonia%2C%20Portugal&order=price" },
    { name: "Turismo Rural - Casa de Leiras", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Turismo%20Rural%20-%20Casa%20de%20Leiras%2C%20Senhora%20da%20Agonia%2C%20Portugal&order=price" },
  ],
  "Moledo do Minho": [
    { name: "Casa da Légua", distanceKm: 1.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20da%20L%C3%A9gua%2C%20Moledo%20do%20Minho%2C%20Portugal&order=price" },
    { name: "Aldeamento Turístico do Camarido", distanceKm: 1.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aldeamento%20Tur%C3%ADstico%20do%20Camarido%2C%20Moledo%20do%20Minho%2C%20Portugal&order=price" },
    { name: "Porta do Sol", distanceKm: 2.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porta%20do%20Sol%2C%20Moledo%20do%20Minho%2C%20Portugal&order=price" },
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
    { name: "Hotel Rural São Sebastião", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Rural%20S%C3%A3o%20Sebasti%C3%A3o%2C%20Barroselas%2C%20Portugal&order=price" },
    { name: "Hotel Rural Quinta de São Sebastião", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Rural%20Quinta%20de%20S%C3%A3o%20Sebasti%C3%A3o%2C%20Barroselas%2C%20Portugal&order=price" },
    { name: "Quinta de Malta", distanceKm: 3.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20de%20Malta%2C%20Barroselas%2C%20Portugal&order=price" },
  ],
  "Carapecos": [
    { name: "Aubergue Peregrinos a Recoleta", distanceKm: 1.9, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aubergue%20Peregrinos%20a%20Recoleta%2C%20Carapecos%2C%20Portugal&order=price" },
    { name: "Casa da Santiago", distanceKm: 2.9, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20da%20Santiago%2C%20Carapecos%2C%20Portugal&order=price" },
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
    { name: "Quinta da Granja", distanceKm: 0.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20da%20Granja%2C%20%C3%81guas%20Santas%20-%20Palmilheira%2C%20Portugal&order=price" },
    { name: "Pransor Águas Santas", distanceKm: 1.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pransor%20%C3%81guas%20Santas%2C%20%C3%81guas%20Santas%20-%20Palmilheira%2C%20Portugal&order=price" },
    { name: "Pensão Residencial Abê", distanceKm: 1.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pens%C3%A3o%20Residencial%20Ab%C3%AA%2C%20%C3%81guas%20Santas%20-%20Palmilheira%2C%20Portugal&order=price" },
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
    { name: "Alameda Guest House", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Alameda%20Guest%20House%2C%20Espinho%20-%20Vouga%2C%20Portugal&order=price" },
    { name: "A&Z", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=A%26Z%2C%20Espinho%20-%20Vouga%2C%20Portugal&order=price" },
    { name: "Surf House", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Surf%20House%2C%20Espinho%20-%20Vouga%2C%20Portugal&order=price" },
  ],
  "São João da Madeira": [
    { name: "Hotel A.S. São João da Madeira", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20A.S.%20S%C3%A3o%20Jo%C3%A3o%20da%20Madeira%2C%20S%C3%A3o%20Jo%C3%A3o%20da%20Madeira%2C%20Portugal&order=price" },
    { name: "Residencial Solar São João", distanceKm: 0.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Solar%20S%C3%A3o%20Jo%C3%A3o%2C%20S%C3%A3o%20Jo%C3%A3o%20da%20Madeira%2C%20Portugal&order=price" },
    { name: "Agocida da Santa Casa da Misericórdia", distanceKm: 0.5, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Agocida%20da%20Santa%20Casa%20da%20Miseric%C3%B3rdia%2C%20S%C3%A3o%20Jo%C3%A3o%20da%20Madeira%2C%20Portugal&order=price" },
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
    { name: "Residência Oliveira", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Resid%C3%AAncia%20Oliveira%2C%20Lisboa%20Santa%20Apol%C3%B3nia%2C%20Portugal&order=price" },
    { name: "The Editory Riverside Hotel", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=The%20Editory%20Riverside%20Hotel%2C%20Lisboa%20Santa%20Apol%C3%B3nia%2C%20Portugal&order=price" },
  ],
  "Lisboa Oriente": [
    { name: "Olissippo Oriente", distanceKm: 0.5, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/olissippo-oriente.html" },
    { name: "Hotel Moxy Lisboa Oriente", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Moxy%20Lisboa%20Oriente%2C%20Lisboa%20Oriente%2C%20Portugal&order=price" },
    { name: "Hotel Tivoli Oriente", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Tivoli%20Oriente%2C%20Lisboa%20Oriente%2C%20Portugal&order=price" },
  ],
  "Lisboa Rossio": [
    { name: "My Story Hotel Rossio", distanceKm: 0.1, priceFrom: 80, bookingUrl: "https://www.booking.com/hotel/pt/my-story-rossio.html" },
    { name: "Gat Rossio Hotel", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Gat%20Rossio%20Hotel%2C%20Lisboa%20Rossio%2C%20Portugal&order=price" },
    { name: "DownTown", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=DownTown%2C%20Lisboa%20Rossio%2C%20Portugal&order=price" },
  ],
  "Cais do Sodré": [
    { name: "LX Boutique Hotel", distanceKm: 0.2, priceFrom: 85, bookingUrl: "https://www.booking.com/hotel/pt/lx-boutique.html" },
    { name: "Sunset Destination Hostel", distanceKm: 0, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Sunset%20Destination%20Hostel%2C%20Cais%20do%20Sodr%C3%A9%2C%20Portugal&order=price" },
    { name: "Lost Lisbon :: Cais House", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lost%20Lisbon%20%3A%3A%20Cais%20House%2C%20Cais%20do%20Sodr%C3%A9%2C%20Portugal&order=price" },
  ],
  "Cascais": [
    { name: "Hotel Baia", distanceKm: 0.5, priceFrom: 90, bookingUrl: "https://www.booking.com/hotel/pt/baia.html" },
    { name: "Pergola House", distanceKm: 0.9, priceFrom: 75, bookingUrl: "https://www.booking.com/hotel/pt/pergola-house.html" },
    { name: "Cascais Bay Hostel", distanceKm: 0.1, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cascais%20Bay%20Hostel%2C%20Cascais%2C%20Portugal&order=price" },
  ],
  "Sintra": [
    { name: "Nova Sintra", distanceKm: 1.1, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/nova-sintra.html" },
    { name: "Monte da Lua", distanceKm: 0.1, priceFrom: 32, bookingUrl: "https://www.booking.com/searchresults.html?ss=Monte%20da%20Lua%2C%20Sintra%2C%20Portugal&order=price" },
    { name: "Chalet Saudade", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Chalet%20Saudade%2C%20Sintra%2C%20Portugal&order=price" },
  ],
  "Setúbal": [
    { name: "Hotel IBIS Setúbal", distanceKm: 0.9, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/ibis-setubal.html" },
    { name: "Aranguês", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Arangu%C3%AAs%2C%20Set%C3%BAbal%2C%20Portugal&order=price" },
    { name: "Lilac Homestay", distanceKm: 0.4, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lilac%20Homestay%2C%20Set%C3%BAbal%2C%20Portugal&order=price" },
  ],
  "Entroncamento": [
    { name: "Residencial Brasília", distanceKm: 0.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Entroncamento&order=price" },
    { name: "Hotel Gameiro", distanceKm: 0.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Gameiro%2C%20Entroncamento%2C%20Portugal&order=price" },
    { name: "Casa das Memórias", distanceKm: 2.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20das%20Mem%C3%B3rias%2C%20Entroncamento%2C%20Portugal&order=price" },
  ],
  "Santarém": [
    { name: "Casa da Alcáçova", distanceKm: 1.9, priceFrom: 80, bookingUrl: "https://www.booking.com/hotel/pt/casa-da-alcacova.html" },
    { name: "Pensão Coimbra", distanceKm: 0.3, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pens%C3%A3o%20Coimbra%2C%20Santar%C3%A9m%2C%20Portugal&order=price" },
    { name: "Santarem Hostel", distanceKm: 0.3, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Santarem%20Hostel%2C%20Santar%C3%A9m%2C%20Portugal&order=price" },
  ],
  "Tomar": [
    { name: "Hotel dos Templários", distanceKm: 0.6, priceFrom: 75, bookingUrl: "https://www.booking.com/hotel/pt/dos-templarios.html" },
    { name: "Hotel Kamanga", distanceKm: 0.4, priceFrom: 45, bookingUrl: "https://www.booking.com/hotel/pt/kamanga.html" },
    { name: "Artistic Guesthouse", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Artistic%20Guesthouse%2C%20Tomar%2C%20Portugal&order=price" },
  ],
  "Caldas da Rainha": [
    { name: "Sana Silver Coast Hotel", distanceKm: 0.9, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/sana-silver-coast.html" },
    { name: "Hotel Cristal Caldas", distanceKm: 0.7, priceFrom: 50, bookingUrl: "https://www.booking.com/hotel/pt/cristal-caldas.html" },
    { name: "Europeia Hotel", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Europeia%20Hotel%2C%20Caldas%20da%20Rainha%2C%20Portugal&order=price" },
  ],
  "Leiria": [
    { name: "São Francisco", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=S%C3%A3o%20Francisco%2C%20Leiria%2C%20Portugal&order=price" },
    { name: "Atlas Hostel", distanceKm: 0.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Atlas%20Hostel%2C%20Leiria%2C%20Portugal&order=price" },
    { name: "Eurosol Residence Hotel Apartamento", distanceKm: 0.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Eurosol%20Residence%20Hotel%20Apartamento%2C%20Leiria%2C%20Portugal&order=price" },
  ],
  "Figueira da Foz": [
    { name: "Hotel Costa de Prata", distanceKm: 0.8, priceFrom: 55, bookingUrl: "https://www.booking.com/hotel/pt/costa-de-prata.html" },
    { name: "Eurostars Oasis Plaza", distanceKm: 1.2, priceFrom: 65, bookingUrl: "https://www.booking.com/hotel/pt/eurostars-oasis-plaza.html" },
    { name: "Chet Odete", distanceKm: 0.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Chet%20Odete%2C%20Figueira%20da%20Foz%2C%20Portugal&order=price" },
  ],
  "Castelo Branco": [
    { name: "Pousada da Juventude", distanceKm: 0.6, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pousada%20da%20Juventude%2C%20Castelo%20Branco%2C%20Portugal&order=price" },
    { name: "Hotel Rainha Dona Amélia", distanceKm: 1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Rainha%20Dona%20Am%C3%A9lia%2C%20Castelo%20Branco%2C%20Portugal&order=price" },
    { name: "Guest House Esplanada", distanceKm: 1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Guest%20House%20Esplanada%2C%20Castelo%20Branco%2C%20Portugal&order=price" },
  ],
  "Covilhã": [
    { name: "Puralã - Wool Valley Hotel & SPA", distanceKm: 0.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pural%C3%A3%20-%20Wool%20Valley%20Hotel%20%26%20SPA%2C%20Covilh%C3%A3%2C%20Portugal&order=price" },
    { name: "Hotel Covilhã Dona Maria", distanceKm: 0.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Covilh%C3%A3%20Dona%20Maria%2C%20Covilh%C3%A3%2C%20Portugal&order=price" },
    { name: "Hotel Sol e Neve", distanceKm: 0.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Sol%20e%20Neve%2C%20Covilh%C3%A3%2C%20Portugal&order=price" },
  ],
  "Guarda": [
    { name: "Hotel Santos", distanceKm: 1.4, priceFrom: 40, bookingUrl: "https://www.booking.com/hotel/pt/santos.html" },
    { name: "Guesthouse da Sé", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Guesthouse%20da%20S%C3%A9%2C%20Guarda%2C%20Portugal&order=price" },
    { name: "Residência Filipe", distanceKm: 0.3, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Resid%C3%AAncia%20Filipe%2C%20Guarda%2C%20Portugal&order=price" },
  ],
  "Vilar Formoso": [
    { name: "Hotel Lusitano", distanceKm: 0.4, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vilar+Formoso&order=price" },
    { name: "Hotel Fronteira", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vilar+Formoso&order=price" },
    { name: "Quinta do Prado Verde", distanceKm: 0.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20do%20Prado%20Verde%2C%20Vilar%20Formoso%2C%20Portugal&order=price" },
  ],
  "Viseu": [
    { name: "Hotel Solar dos Pais", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Solar%20dos%20Pais%2C%20Viseu%2C%20Portugal&order=price" },
    { name: "Apartamentos \\\\\\\\", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Apartamentos%20%22O%20Fado%22%2C%20Viseu%2C%20Portugal&order=price" },
    { name: "Casa da Sé", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20da%20S%C3%A9%2C%20Viseu%2C%20Portugal&order=price" },
  ],
  "Évora": [
    { name: "Casa Morgado Esporão", distanceKm: 0, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20Morgado%20Espor%C3%A3o%2C%20%C3%89vora%2C%20Portugal&order=price" },
    { name: "Burgos Hostel", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Burgos%20Hostel%2C%20%C3%89vora%2C%20Portugal&order=price" },
    { name: "Mont'Sobro House", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mont'Sobro%20House%2C%20%C3%89vora%2C%20Portugal&order=price" },
  ],
  "Beja": [
    { name: "Hospedaria Santa Maria", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospedaria%20Santa%20Maria%2C%20Beja%2C%20Portugal&order=price" },
    { name: "Hospedaria Zé Maria", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospedaria%20Z%C3%A9%20Maria%2C%20Beja%2C%20Portugal&order=price" },
    { name: "Maria's Guesthouse", distanceKm: 0.2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Maria's%20Guesthouse%2C%20Beja%2C%20Portugal&order=price" },
  ],
  "Faro": [
    { name: "Pensão Residencial Oliveira", distanceKm: 0.1, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pens%C3%A3o%20Residencial%20Oliveira%2C%20Faro%2C%20Portugal&order=price" },
    { name: "City Rooms", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/hotel/pt/city-rooms-paris-private-room-by-hd.html" },
    { name: "Stay Hotels", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Stay%20Hotels%2C%20Faro%2C%20Portugal&order=price" },
  ],
  "Albufeira-Ferreiras": [
    { name: "Hotel Boa Vista", distanceKm: 1.2, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferreiras%2C+Albufeira&order=price" },
    { name: "Ália Albufeira", distanceKm: 1.8, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Ferreiras%2C+Albufeira&order=price" },
    { name: "Novochoro", distanceKm: 1.8, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Novochoro%2C%20Albufeira-Ferreiras%2C%20Portugal&order=price" },
  ],
  "Tunes": [
    { name: "Vila Galé Albacora", distanceKm: 1.9, priceFrom: 65, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tunes%2C+Algarve&order=price" },
    { name: "Casa de Tunes", distanceKm: 0.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Tunes%2C+Algarve&order=price" },
  ],
  "Lagos": [
    { name: "Lagos Avenida Hotel", distanceKm: 0.6, priceFrom: 70, bookingUrl: "https://www.booking.com/hotel/pt/lagos-avenida.html" },
    { name: "Cidade Velha", distanceKm: 0, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cidade%20Velha%2C%20Lagos%2C%20Portugal&order=price" },
    { name: "Riomar", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Riomar%2C%20Lagos%2C%20Portugal&order=price" },
  ],
  "Portimão": [
    { name: "Hotel Família Portimão", distanceKm: 1, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portim%C3%A3o&order=price" },
    { name: "Made Inn", distanceKm: 0.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Made%20Inn%2C%20Portim%C3%A3o%2C%20Portugal&order=price" },
    { name: "Aloha Hostel", distanceKm: 0.6, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Aloha%20Hostel%2C%20Portim%C3%A3o%2C%20Portugal&order=price" },
  ],
  "Tavira": [
    { name: "Residencial Princesa do Gilao", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Princesa%20do%20Gilao%2C%20Tavira%2C%20Portugal&order=price" },
    { name: "AP Maria Nova Lounge Hotel", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=AP%20Maria%20Nova%20Lounge%20Hotel%2C%20Tavira%2C%20Portugal&order=price" },
    { name: "Residencial Imperial", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Imperial%2C%20Tavira%2C%20Portugal&order=price" },
  ],
  "Vila Real de Santo António": [
    { name: "Hotel Guadiana", distanceKm: 0, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Guadiana%2C%20Vila%20Real%20de%20Santo%20Ant%C3%B3nio%2C%20Portugal&order=price" },
    { name: "The Sun Hostel", distanceKm: 0, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=The%20Sun%20Hostel%2C%20Vila%20Real%20de%20Santo%20Ant%C3%B3nio%2C%20Portugal&order=price" },
    { name: "Residencial Baixa Mar", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Baixa%20Mar%2C%20Vila%20Real%20de%20Santo%20Ant%C3%B3nio%2C%20Portugal&order=price" },
  ],
  "Aguieira": [
    { name: "Residencial Castro", distanceKm: 1.9, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20Castro%2C%20Aguieira%2C%20Portugal&order=price" },
    { name: "Residencial e Restaurante O Trindade", distanceKm: 2, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Residencial%20e%20Restaurante%20O%20Trindade%2C%20Aguieira%2C%20Portugal&order=price" },
    { name: "Pensão Celeste", distanceKm: 3.5, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pens%C3%A3o%20Celeste%2C%20Aguieira%2C%20Portugal&order=price" },
  ],
  "Albergaria dos Doze": [
    { name: "Quinta d'Oliveira", distanceKm: 5.9, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20d'Oliveira%2C%20Albergaria%20dos%20Doze%2C%20Portugal&order=price" },
    { name: "Albergue Farrius Bar", distanceKm: 7.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Albergue%20Farrius%20Bar%2C%20Albergaria%20dos%20Doze%2C%20Portugal&order=price" },
    { name: "Quinta do Chumbaria", distanceKm: 7.6, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20do%20Chumbaria%2C%20Albergaria%20dos%20Doze%2C%20Portugal&order=price" },
  ],
  "Alegria": [
    { name: "Hotel Pesqdouro", distanceKm: 4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Pesqdouro%2C%20Alegria%2C%20Portugal&order=price" },
    { name: "Dourovou - Ecoturismo Fluvial", distanceKm: 4.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Dourovou%20-%20Ecoturismo%20Fluvial%2C%20Alegria%2C%20Portugal&order=price" },
    { name: "Casa do Tua", distanceKm: 4.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Casa%20do%20Tua%2C%20Alegria%2C%20Portugal&order=price" },
  ],
  "Alferrarede": [
    { name: "HI Abrantes – Pousada de Juventude", distanceKm: 1.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=HI%20Abrantes%20%E2%80%93%20Pousada%20de%20Juventude%2C%20Alferrarede%2C%20Portugal&order=price" },
    { name: "Luna", distanceKm: 2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Luna%2C%20Alferrarede%2C%20Portugal&order=price" },
    { name: "Luna Hotel Turismo", distanceKm: 2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Luna%20Hotel%20Turismo%2C%20Alferrarede%2C%20Portugal&order=price" },
  ],
  "Agualva - Cacém": [
    { name: "Quinta do Scoto", distanceKm: 3.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20do%20Scoto%2C%20Agualva%20-%20Cac%C3%A9m%2C%20Portugal&order=price" },
    { name: "Guest House A.L.", distanceKm: 3.9, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Guest%20House%20A.L.%2C%20Agualva%20-%20Cac%C3%A9m%2C%20Portugal&order=price" },
    { name: "Pousada Dona Maria I", distanceKm: 3.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pousada%20Dona%20Maria%20I%2C%20Agualva%20-%20Cac%C3%A9m%2C%20Portugal&order=price" },
  ],
  "Alcantara - Mar": [
    { name: "LX Hostel", distanceKm: 0.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=LX%20Hostel%2C%20Alcantara%20-%20Mar%2C%20Portugal&order=price" },
    { name: "Hotel Infante Santo", distanceKm: 0.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Infante%20Santo%2C%20Alcantara%20-%20Mar%2C%20Portugal&order=price" },
    { name: "Vila Galé Ópera", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vila%20Gal%C3%A9%20%C3%93pera%2C%20Alcantara%20-%20Mar%2C%20Portugal&order=price" },
  ],
  "Alcantara - Terra": [
    { name: "Cheese & Wine Lapa", distanceKm: 0.6, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cheese%20%26%20Wine%20Lapa%2C%20Alcantara%20-%20Terra%2C%20Portugal&order=price" },
    { name: "Hotel Infante Santo", distanceKm: 0.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Infante%20Santo%2C%20Alcantara%20-%20Terra%2C%20Portugal&order=price" },
    { name: "LX Hostel", distanceKm: 0.7, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=LX%20Hostel%2C%20Alcantara%20-%20Terra%2C%20Portugal&order=price" },
  ],
  "Algés": [
    { name: "Palácio do Governador", distanceKm: 1.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pal%C3%A1cio%20do%20Governador%2C%20Alg%C3%A9s%2C%20Portugal&order=price" },
    { name: "MS Aparthotel", distanceKm: 1.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=MS%20Aparthotel%2C%20Alg%C3%A9s%2C%20Portugal&order=price" },
    { name: "AltisBelem Hotel & SPA", distanceKm: 1.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=AltisBelem%20Hotel%20%26%20SPA%2C%20Alg%C3%A9s%2C%20Portugal&order=price" },
  ],
  "Algueirão - Mem Martins": [
    { name: "Pensão Gare", distanceKm: 0, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pens%C3%A3o%20Gare%2C%20Algueir%C3%A3o%20-%20Mem%20Martins%2C%20Portugal&order=price" },
    { name: "alvor", distanceKm: 1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=alvor%2C%20Algueir%C3%A3o%20-%20Mem%20Martins%2C%20Portugal&order=price" },
    { name: "Lugar Saloio Sintra", distanceKm: 1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lugar%20Saloio%20Sintra%2C%20Algueir%C3%A3o%20-%20Mem%20Martins%2C%20Portugal&order=price" },
  ],
  "Alhandra": [
    { name: "Bombeiros Voluntários de Alhandra", distanceKm: 0.4, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Bombeiros%20Volunt%C3%A1rios%20de%20Alhandra%2C%20Alhandra%2C%20Portugal&order=price" },
    { name: "Hostel DP", distanceKm: 3.7, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hostel%20DP%2C%20Alhandra%2C%20Portugal&order=price" },
    { name: "Hospedaria Maioral", distanceKm: 3.9, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospedaria%20Maioral%2C%20Alhandra%2C%20Portugal&order=price" },
  ],
  "Pragal": [
    { name: "Holiday Inn Express Lisbon-Almada", distanceKm: 0.4, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pragal%2C+Almada&order=price" },
    { name: "Alojamento Pragal", distanceKm: 0.6, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pragal%2C+Almada&order=price" },
    { name: "Cyber Hostel Almada", distanceKm: 0.5, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Cyber%20Hostel%20Almada%2C%20Pragal%2C%20Portugal&order=price" },
  ],
  "Pinhal Novo": [
    { name: "Hotel Pinhal Novo", distanceKm: 0.5, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pinhal+Novo&order=price" },
    { name: "Residencial Central", distanceKm: 0.7, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pinhal+Novo&order=price" },
    { name: "Recanto Tropical", distanceKm: 3.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Recanto%20Tropical%2C%20Pinhal%20Novo%2C%20Portugal&order=price" },
  ],
  "Barreiro": [
    { name: "Hotel Barreiro", distanceKm: 0.9, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barreiro%2C+Portugal&order=price" },
    { name: "Alojamento Margem Sul", distanceKm: 1.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Barreiro%2C+Portugal&order=price" },
    { name: "Lisbon South Bed Hostel", distanceKm: 0.8, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lisbon%20South%20Bed%20Hostel%2C%20Barreiro%2C%20Portugal&order=price" },
  ],
  "Torres Vedras": [
    { name: "Hotel Império Jardim", distanceKm: 0.6, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torres+Vedras&order=price" },
    { name: "Hotel dos Arcos", distanceKm: 0.9, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Torres+Vedras&order=price" },
    { name: "Stay", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Stay%2C%20Torres%20Vedras%2C%20Portugal&order=price" },
  ],
  "Mira Sintra-Meleças": [
    { name: "Hotel Nova Sintra", distanceKm: 1.6, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mele%C3%A7as%2C+Sintra&order=price" },
    { name: "Casa de Meleças", distanceKm: 1.2, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mele%C3%A7as%2C+Sintra&order=price" },
    { name: "Lugar Saloio Sintra", distanceKm: 0.4, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lugar%20Saloio%20Sintra%2C%20Mira%20Sintra-Mele%C3%A7as%2C%20Portugal&order=price" },
  ],
  "Abrantes": [
    { name: "Hotel de Turismo de Abrantes", distanceKm: 1.5, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Abrantes&order=price" },
    { name: "Residencial Aliança", distanceKm: 0.8, priceFrom: 40, bookingUrl: "https://www.booking.com/searchresults.html?ss=Abrantes&order=price" },
    { name: "Luna", distanceKm: 0.7, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Luna%2C%20Abrantes%2C%20Portugal&order=price" },
  ],
  "Portalegre": [
    { name: "Hotel Mansão Alto Alentejo", distanceKm: 1.8, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portalegre&order=price" },
    { name: "Rossio Hotel", distanceKm: 1.7, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Portalegre&order=price" },
  ],
  "Elvas": [
    { name: "Hotel São João de Deus", distanceKm: 1.9, priceFrom: 60, bookingUrl: "https://www.booking.com/searchresults.html?ss=Elvas&order=price" },
    { name: "Hotel D. Luís", distanceKm: 1.6, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Elvas&order=price" },
    { name: "Dom Luis Hotel", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Dom%20Luis%20Hotel%2C%20Elvas%2C%20Portugal&order=price" },
  ],
  "Vendas Novas": [
    { name: "Hotel Afonso", distanceKm: 0.7, priceFrom: 45, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vendas+Novas&order=price" },
    { name: "Pensão Central", distanceKm: 0.6, priceFrom: 35, bookingUrl: "https://www.booking.com/searchresults.html?ss=Vendas+Novas&order=price" },
    { name: "Hotel Acez", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Acez%2C%20Vendas%20Novas%2C%20Portugal&order=price" },
  ],
  "Olhão": [
    { name: "Real Marina Hotel & Spa", distanceKm: 1.1, priceFrom: 80, bookingUrl: "https://www.booking.com/searchresults.html?ss=Olh%C3%A3o&order=price" },
    { name: "Hotel Ria-Sol", distanceKm: 0.5, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Olh%C3%A3o&order=price" },
    { name: "Pensão Boémia", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Pens%C3%A3o%20Bo%C3%A9mia%2C%20Olh%C3%A3o%2C%20Portugal&order=price" },
  ],
  "Loulé": [
    { name: "Loulé Jardim Hotel", distanceKm: 1.9, priceFrom: 65, bookingUrl: "https://www.booking.com/searchresults.html?ss=Loul%C3%A9&order=price" },
    { name: "Casa Beny", distanceKm: 1.8, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Loul%C3%A9&order=price" },
    { name: "Quinta dos Amigos", distanceKm: 0.9, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Quinta%20dos%20Amigos%2C%20Loul%C3%A9%2C%20Portugal&order=price" },
  ],
  "Silves": [
    { name: "Colina dos Mouros", distanceKm: 0.6, priceFrom: 55, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silves%2C+Algarve&order=price" },
    { name: "Hotel Vila Sodré", distanceKm: 1.4, priceFrom: 50, bookingUrl: "https://www.booking.com/searchresults.html?ss=Silves%2C+Algarve&order=price" },
    { name: "Horta Grande", distanceKm: 0.7, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Horta%20Grande%2C%20Silves%2C%20Portugal&order=price" },
  ],
  "Estádio do Dragão": [
    { name: "Porto Antas Hotel", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porto%20Antas%20Hotel%2C%20Est%C3%A1dio%20do%20Drag%C3%A3o%2C%20Portugal&order=price" },
    { name: "AC Hotel Porto", distanceKm: 0.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=AC%20Hotel%20Porto%2C%20Est%C3%A1dio%20do%20Drag%C3%A3o%2C%20Portugal&order=price" },
    { name: "Antas Ville", distanceKm: 0.6, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Antas%20Ville%2C%20Est%C3%A1dio%20do%20Drag%C3%A3o%2C%20Portugal&order=price" },
  ],
  "Campanhã (Metro)": [
    { name: "Peach Hostel & Suites", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Peach%20Hostel%20%26%20Suites%2C%20Campanh%C3%A3%20(Metro)%2C%20Portugal&order=price" },
    { name: "Hospedaria Porto", distanceKm: 0.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hospedaria%20Porto%2C%20Campanh%C3%A3%20(Metro)%2C%20Portugal&order=price" },
    { name: "Hotel Poveira", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Poveira%2C%20Campanh%C3%A3%20(Metro)%2C%20Portugal&order=price" },
  ],
  "Trindade (Metro)": [
    { name: "Hotel Porto Interface Trindade by Kavia", distanceKm: 0, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Porto%20Interface%20Trindade%20by%20Kavia%2C%20Trindade%20(Metro)%2C%20Portugal&order=price" },
    { name: "Rachel", distanceKm: 0.1, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Rachel%2C%20Trindade%20(Metro)%2C%20Portugal&order=price" },
    { name: "Porto Trindade Hotel", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Porto%20Trindade%20Hotel%2C%20Trindade%20(Metro)%2C%20Portugal&order=price" },
  ],
  "Estação Aeroporto": [
    { name: "Solar Antigo Porto Aeroporto", distanceKm: 1.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Solar%20Antigo%20Porto%20Aeroporto%2C%20Esta%C3%A7%C3%A3o%20Aeroporto%2C%20Portugal&order=price" },
    { name: "Singular", distanceKm: 1.5, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Singular%2C%20Esta%C3%A7%C3%A3o%20Aeroporto%2C%20Portugal&order=price" },
    { name: "Park Hotel Porto Aeroporto", distanceKm: 1.6, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Park%20Hotel%20Porto%20Aeroporto%2C%20Esta%C3%A7%C3%A3o%20Aeroporto%2C%20Portugal&order=price" },
  ],
  "Rato": [
    { name: "Back to Lisbon", distanceKm: 0.2, priceFrom: 25, bookingUrl: "https://www.booking.com/searchresults.html?ss=Back%20to%20Lisbon%2C%20Rato%2C%20Portugal&order=price" },
    { name: "Luxury Lisbon Palace - Fine Homes", distanceKm: 0.2, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Luxury%20Lisbon%20Palace%20-%20Fine%20Homes%2C%20Rato%2C%20Portugal&order=price" },
    { name: "Lisbon São Bento", distanceKm: 0.3, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lisbon%20S%C3%A3o%20Bento%2C%20Rato%2C%20Portugal&order=price" },
  ],
  "São Sebastião (Metro)": [
    { name: "Hotel Alif Avenidas", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Alif%20Avenidas%2C%20S%C3%A3o%20Sebasti%C3%A3o%20(Metro)%2C%20Portugal&order=price" },
    { name: "Lisbon Serviced Apartments", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Lisbon%20Serviced%20Apartments%2C%20S%C3%A3o%20Sebasti%C3%A3o%20(Metro)%2C%20Portugal&order=price" },
    { name: "Hotel Real Parque", distanceKm: 0.1, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Hotel%20Real%20Parque%2C%20S%C3%A3o%20Sebasti%C3%A3o%20(Metro)%2C%20Portugal&order=price" },
  ],
  "Aeroporto (Metro Lisboa)": [
    { name: "Star inn", distanceKm: 0.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Star%20inn%2C%20Aeroporto%20(Metro%20Lisboa)%2C%20Portugal&order=price" },
    { name: "Melíã Lisboa Aeroporto", distanceKm: 0.4, priceFrom: 38, bookingUrl: "https://www.booking.com/searchresults.html?ss=Mel%C3%AD%C3%A3%20Lisboa%20Aeroporto%2C%20Aeroporto%20(Metro%20Lisboa)%2C%20Portugal&order=price" },
    { name: "Terminus", distanceKm: 0.8, priceFrom: 30, bookingUrl: "https://www.booking.com/searchresults.html?ss=Terminus%2C%20Aeroporto%20(Metro%20Lisboa)%2C%20Portugal&order=price" },
  ],
};
