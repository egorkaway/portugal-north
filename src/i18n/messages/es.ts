import type { Messages } from "@/i18n/types";

export const es: Messages = {
  site: { name: "Portugal en Tren" },
  lang: {
    label: "Idioma",
    en: "English",
    pt: "Português",
    es: "Español",
  },
  nav: {
    allStations: "Todas las estaciones",
    backToStations: "Volver a estaciones",
    returnHome: "Volver al inicio",
  },
  home: {
    heroSubtitle:
      "Principales estaciones de CP del Miño al Algarve, con hoteles económicos a poca distancia a pie.",
    searchLabel: "Buscar estación o línea",
    searchPlaceholder: "Buscar estación o línea...",
    sortByDistance: "Ordenar por distancia",
    sortedByDistance: "Ordenado por distancia",
    locating: "Localizando...",
    yourVotes: "Tus votos:",
    upvoted: "Votado positivamente",
    downvoted: "Votado negativamente",
    notVoted: "Sin voto",
    stationCount_one: "{{count}} estación",
    stationCount_other: "{{count}} estaciones",
    sortedByDistanceNote: " · Ordenado por distancia desde ti",
    topCommunityPicks: " · Mejores de la comunidad primero",
    locationDenied: " · Acceso a la ubicación denegado",
    locationBlocked: "Ubicación bloqueada",
    locationUnsupported: " · Ubicación no compatible con este navegador",
    locationError: " · No se pudo obtener tu ubicación",
    bookingHint:
      ' · Pulsa "Más en Booking" para ver las 3 habitaciones más baratas en 2 km',
    noResults: "Ninguna estación coincide con la búsqueda.",
  },
  station: {
    stationPhotoAlt: "Estación de tren de {{name}}",
    budgetStays: "Alojamientos económicos cerca",
    hotelsIntro:
      "Vota a favor o en contra de hoteles que conoces, o indica si puede estar cerrado. Tu opinión se guarda en este navegador.",
    noHotels: "Aún no hay hoteles recomendados para esta estación.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    tripHistorian: "TripHistorian",
    searchBooking: "Buscar hoteles en Booking",
    moreOnBooking: "Más en Booking",
    stationPage: "Página de la estación",
    kmFromStation: "{{km}} km de la estación",
    eurosPerNightFrom: " euros por noche desde",
    viewOnBooking: "Ver en Booking",
    suggestClosed: "Sugerir que el hotel puede estar cerrado",
    suggestedClosed: "Has sugerido que este hotel puede estar cerrado",
    away: "a {{distance}}",
  },
  departures: {
    title: "Próximas salidas",
    refresh: "Actualizar",
    unavailable: "Salidas en directo temporalmente no disponibles",
    none: "No hay salidas en las próximas horas.",
    train: "tren",
    platform: "andén",
    delayMin: "+{{minutes}} min",
  },
  rankings: {
    title: "Rankings de la comunidad",
    subtitle: "Estaciones y hoteles según los votos de visitantes en Portugal",
    intro:
      "Los rankings provienen de los votos en las estaciones y en las listas de hoteles de cada página. Si el almacenamiento de votos falla, el mensaje inferior lo explica.",
    communityTitle: "Rankings de la comunidad",
    communityTeaser: "Mejores estaciones por votos globales. Hoteles en la página completa.",
    fullPage: "Página completa de rankings",
    viewFull: "Ver rankings completos de la comunidad",
    loading: "Cargando votos de la comunidad...",
    unavailableTitle: "Clasificaciones de la comunidad no disponibles",
    unavailableDetail:
      "Los votos en las tarjetas se guardan en tu navegador. Los totales globales requieren la API de Vercel y un Blob en este proyecto.",
    unavailableHint: "",
    retrying: "Reintentando...",
    tryAgain: "Intentar de nuevo",
    noVotesYet:
      "Aún no hay votos de la comunidad. Vota en estaciones y hoteles del sitio para crear los rankings.",
    stationRankings: "Rankings de estaciones",
    hotelRankings: "Rankings de hoteles",
    hotelLeaderboard:
      "Una clasificación nacional de todos los hoteles recomendados, en cualquier estación.",
    noStationVotes: "Aún sin votos en estaciones.",
    noHotelVotes: "Aún sin votos en hoteles.",
    voteTotalsStations:
      "{{up}} votos positivos y {{down}} negativos en {{items}} estaciones.",
    voteTotalsHotels: "{{up}} votos positivos y {{down}} negativos en {{items}} hoteles.",
    topUpvoted: "Más votados",
    mostDownvoted: "Más votados negativamente",
    noStationUpvotes: "Sin votos positivos. Vota en una tarjeta de estación para empezar.",
    noStationDownvotes: "Sin votos negativos.",
    noHotelUpvotes: "Sin votos positivos. Vota en una página de estación para valorar hoteles.",
    noHotelDownvotes: "Sin votos negativos.",
  },
  vote: {
    yourVoteOn: "Tu voto en {{subject}}",
    upvote: "Voto positivo en {{subject}}",
    downvote: "Voto negativo en {{subject}}",
    removeUpvote: "Quitar voto positivo",
    removeDownvote: "Quitar voto negativo",
    upvoteOnlyYou: "Voto positivo (solo tú lo ves)",
    downvoteOnlyYou: "Voto negativo (solo tú lo ves)",
  },
  imageVote: {
    question: "¿Esta foto representa {{name}}?",
    goodPhoto: "Buena foto",
    goodShort: "Buena",
    badPhoto: "No representa la estación",
    badShort: "No representa",
    rateLabel: "Valorar si la foto representa la estación",
    browserNote:
      "Tu elección se guarda en este navegador. Los totales de la comunidad ayudan a elegir mejores imágenes.",
    community: "Comunidad: {{summary}}",
    goodPhotos_one: "{{count}} buena foto",
    goodPhotos_other: "{{count}} buenas fotos",
    notRepresentative_one: "{{count}} no representativa",
    notRepresentative_other: "{{count}} no representativas",
  },
  footer: {
    title: "Por las vías de Portugal",
    subtitle:
      "Del Douro brumoso a la costa atlántica, con paradas clave y un lugar donde dormir cerca.",
    disclaimer: "No recomendamos estos hoteles, pero si te gustan, queremos saberlo.",
    alsoFromUs: "También nuestros",
    climaTitle: "Clima Ibérico",
    climaDesc:
      "Tiempo y alertas meteorológicas en España y Portugal. Consulta las condiciones antes de viajar.",
    mapaTitle: "Map Your Travel",
    mapaDesc:
      "La app GetMapa para iPhone registra los lugares que visitas y crea un mapa de viaje con tus fotos.",
    portuGuessTitle: "PortuGuess",
    portuGuessDesc:
      "Aprende portugués europeo con cuestionarios, listas de palabras y apps sin conexión para iOS y Android.",
  },
  notFound: {
    title: "404",
    message: "¡Vaya! Página no encontrada",
    home: "Volver al inicio",
  },
  meta: {
    siteName: "Portugal en Tren",
    home: {
      title: "Portugal en Tren: Estaciones y Hoteles Económicos",
      description:
        "Descubre estaciones de CP en Portugal, del Miño al Algarve, con líneas y hoteles económicos a poca distancia a pie.",
    },
    rankings: {
      title: "Rankings de la Comunidad | Portugal en Tren",
      description:
        "Mira qué estaciones CP y hoteles los visitantes valoran más y menos en Portugal.",
      ogDescription: "Rankings de la comunidad para estaciones CP y hoteles económicos en Portugal.",
    },
    notFound: {
      title: "Página no encontrada | Portugal en Tren",
      description:
        "La página que buscabas no existe. Vuelve al inicio para explorar estaciones de tren en Portugal.",
    },
    stationTitle: "Estación de {{name}} — Hoteles y Líneas | {{site}}",
    stationDescription: "{{services}} en {{name}} ({{lines}}). {{stays}}",
    stationOgWithHotels:
      "{{name}} ({{lines}}): {{services}}. Alojamientos desde {{price}} €/noche — {{names}}{{more}}.",
    stationOgNoHotels:
      "{{name}}: {{services}} en {{lines}}. Explora mapas y vota esta estación.",
    stationOgExplore: "Explora mapas y vota esta estación.",
    cpNetwork: "red CP",
    cpTrains: "trenes CP",
    mapsVotes: "Mapas, votos de la comunidad y detalles de la estación.",
    budgetStay_one: "1 alojamiento económico",
    budgetStay_other: "{{count}} alojamientos económicos",
    fromPerNight: "desde {{price}} €/noche en 2 km, más mapas y votos.",
    andMore: " y {{count}} más",
  },
};
