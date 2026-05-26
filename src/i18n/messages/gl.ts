import type { Messages } from "@/i18n/types";

export const gl: Messages = {
  site: { name: "Portugal en tren" },
  lang: {
    label: "Idioma",
    en: "English",
    pt: "Português",
    es: "Español",
    gl: "Galego",
    ca: "Català",
  },
  nav: {
    allStations: "Todas as estacións",
    backToStations: "Volver ás estacións",
    returnHome: "Volver ao inicio",
  },
  home: {
    heroSubtitle:
      "Principais estacións da CP do Miño ao Algarve, con hoteis económicos a poucos minutos a pé.",
    searchLabel: "Buscar estación ou liña",
    searchPlaceholder: "Buscar estación ou liña...",
    filtersLabel: "Filtrar estacións",
    sortByDistance: "Ordenar por distancia",
    sortedByDistance: "Ordenado por distancia",
    locating: "Localizando...",
    yourVotes: "Os teus votos:",
    upvoted: "Voto positivo",
    downvoted: "Voto negativo",
    notVoted: "Sen voto",
    yourVisits: "As túas visitas:",
    visited: "Visitada",
    notVisitedYet: "Aínda non visitada",
    stationCount_one: "{{count}} estación",
    stationCount_other: "{{count}} estacións",
    sortedByDistanceNote: " · Ordenado pola túa distancia",
    topCommunityPicks: " · Mellores da comunidade primeiro",
    locationDenied: " · Acceso á localización denegado",
    locationBlocked: "Localización bloqueada",
    locationUnsupported: " · Localización non compatible con este navegador",
    locationError: " · Non foi posible obter a túa localización",
    bookingHint:
      ' · Preme "Máis en Booking" para ver os 3 cuartos máis baratos nun raio de 2 km',
    noResults: "Ningunha estación coincide coa busca.",
  },
  station: {
    stationPhotoAlt: "Estación de tren de {{name}}",
    budgetStays: "Aloxamentos económicos preto",
    hotelsIntro:
      "Vota a favor ou en contra de hoteis que coñezas, ou indica se un aloxamento pode estar pechado. O teu feedback queda gardado neste navegador.",
    noHotels: "Aínda non hai hoteis recomendados para esta estación.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    tripHistorian: "TripHistorian",
    searchBooking: "Buscar hoteis en Booking",
    moreOnBooking: "Máis en Booking",
    stationPage: "Páxina da estación",
    kmFromStation: "{{km}} km da estación",
    eurosPerNightFrom: " euros por noite desde",
    viewOnBooking: "Ver en Booking",
    suggestClosed: "Suxerir que o hotel pode estar pechado",
    suggestedClosed: "Suxeriches que este hotel pode estar pechado",
    away: "a {{distance}}",
  },
  departures: {
    title: "Próximas saídas",
    refresh: "Actualizar",
    unavailable: "Saídas en directo temporalmente non dispoñibles",
    none: "Non hai saídas nas próximas horas.",
    train: "tren",
    platform: "andeén",
    delayMin: "+{{minutes}} min",
  },
  rankings: {
    title: "Rankings da comunidade",
    subtitle: "Estacións e hoteis segundo os votos dos visitantes en Portugal",
    intro:
      "Os rankings provén dos votos nas estacións e nas listas de hoteis de cada páxina. Se o almacenamento de votos falla, a mensaxe de abaixo explícalo.",
    communityTitle: "Rankings da comunidade",
    communityTeaser: "Mellores estacións por votos globais. Hoteis na páxina completa.",
    fullPage: "Páxina completa de rankings",
    viewFull: "Ver rankings completos da comunidade",
    loading: "Cargando votos da comunidade...",
    unavailableTitle: "Clasificacións da comunidade non dispoñibles",
    unavailableDetail:
      "Os votos nas tarxetas quedan gardados no teu navegador. Os totais globais requiren a API de Vercel e un Blob neste proxecto.",
    unavailableHint: "",
    retrying: "Reintentando...",
    tryAgain: "Tentar de novo",
    noVotesYet:
      "Aínda non hai votos da comunidade. Vota en estacións e hoteis do sitio para crear os rankings.",
    stationRankings: "Rankings de estacións",
    hotelRankings: "Rankings de hoteis",
    hotelLeaderboard:
      "Unha clasificación nacional de todos os hoteis recomendados, en calquera estación.",
    noStationVotes: "Aínda sen votos en estacións.",
    noHotelVotes: "Aínda sen votos en hoteis.",
    voteTotalsStations:
      "{{up}} votos positivos e {{down}} negativos en {{items}} estacións.",
    voteTotalsHotels: "{{up}} votos positivos e {{down}} negativos en {{items}} hoteis.",
    topUpvoted: "Máis votados",
    mostDownvoted: "Máis votados negativamente",
    noStationUpvotes: "Sen votos positivos. Vota nunha tarxeta de estación para comezar.",
    noStationDownvotes: "Sen votos negativos.",
    noHotelUpvotes: "Sen votos positivos. Vota nunha páxina de estación para valorar hoteis.",
    noHotelDownvotes: "Sen votos negativos.",
    offlineCached:
      "Sen conexión — móstranse rankings da comunidade gardados da túa última visita. Os votos novos neste dispositivo sincronizaranse cando volvas estar en liña.",
    offlineDevice:
      "Sen conexión — móstranse rankings só cos teus votos neste dispositivo.",
  },
  pwa: {
    votesPendingSync:
      "{{count}} voto(s) gardado(s) neste dispositivo — sincronizaranse cando volvas estar en liña.",
    votesSyncing: "Sincronizando os teus votos gardados…",
    permissionsTitle: "Saca máis partido da app",
    permissionsBody:
      "Instalaches Portugal by Train — activa estas funcións opcionais para unha mellor experiencia:",
    permissionsLocation:
      "Localización — ordenar estacións por distancia na páxina de inicio.",
    permissionsNotifications:
      "Notificacións — para avisos sobre viaxes e novidades (cando estean dispoñibles).",
    permissionsEnable: "Activar",
    permissionsEnabling: "Abrindo axustes…",
    permissionsNotNow: "Agora non",
  },
  visited: {
    markVisited: "Marcar {{subject}} como visitada",
    markNotVisited: "Marcar {{subject}} como non visitada",
    visited: "Visitada",
    notVisited: "Non visitada",
  },
  vote: {
    yourVoteOn: "O teu voto en {{subject}}",
    upvote: "Voto positivo en {{subject}}",
    downvote: "Voto negativo en {{subject}}",
    removeUpvote: "Quitar voto positivo",
    removeDownvote: "Quitar voto negativo",
    upvoteOnlyYou: "Voto positivo (só ti o ves)",
    downvoteOnlyYou: "Voto negativo (só ti o ves)",
  },
  imageVote: {
    question: "Esta foto representa {{name}}?",
    goodPhoto: "Boa foto",
    goodShort: "Boa",
    badPhoto: "Non representa a estación",
    badShort: "Non representa",
    rateLabel: "Valorar se a foto representa a estación",
    browserNote:
      "A túa elección queda neste navegador. Os totais da comunidade axudan a escoller mellores imaxes.",
    community: "Comunidade: {{summary}}",
    goodPhotos_one: "{{count}} boa foto",
    goodPhotos_other: "{{count}} boas fotos",
    notRepresentative_one: "{{count}} non representativa",
    notRepresentative_other: "{{count}} non representativas",
  },
  footer: {
    title: "Polas vías de Portugal",
    subtitle:
      "Do Douro brumoso á costa atlántica, con paradas clave e un lugar onde durmir preto.",
    disclaimer: "Non recomendamos estes hoteis, pero se che gustan, queremos sabelo.",
    alsoFromUs: "Tamén nosos",
    climaTitle: "Clima Ibérico",
    climaDesc:
      "Tempo e alertas meteorolóxicas en España e Portugal. Consulta as condicións antes de viaxar.",
    mapaTitle: "Map Your Travel",
    mapaDesc:
      "A app GetMapa para iPhone rexistra os lugares que visitas e crea un mapa de viaxe coas túas fotos.",
    portuGuessTitle: "PortuGuess",
    portuGuessDesc:
      "Aprende portugués europeo con cuestionarios, listas de palabras e apps sen conexión para iOS e Android.",
  },
  notFound: {
    title: "404",
    message: "Vaia! Páxina non atopada",
    home: "Volver ao inicio",
  },
  meta: {
    siteName: "Portugal en tren",
    home: {
      title: "Portugal en tren: Estacións e hoteis económicos",
      description:
        "Descobre estacións da CP en Portugal, do Miño ao Algarve, con liñas e hoteis económicos a poucos minutos a pé.",
    },
    rankings: {
      title: "Rankings da comunidade | Portugal en tren",
      description:
        "Mira que estacións da CP e hoteis os visitantes valoran máis e menos en Portugal.",
      ogDescription: "Rankings da comunidade para estacións da CP e hoteis económicos en Portugal.",
    },
    notFound: {
      title: "Páxina non atopada | Portugal en tren",
      description:
        "A páxina que buscabas non existe. Volve ao inicio para explorar estacións de tren en Portugal.",
    },
    stationTitle: "Estación de {{name}} — Hoteis e liñas | {{site}}",
    stationDescription: "{{services}} en {{name}} ({{lines}}). {{stays}}",
    stationOgWithHotels:
      "{{name}} ({{lines}}): {{services}}. Aloxamentos desde {{price}} €/noite — {{names}}{{more}}.",
    stationOgNoHotels:
      "{{name}}: {{services}} na {{lines}}. Explora mapas e vota nesta estación.",
    stationOgExplore: "Explora mapas e vota nesta estación.",
    cpNetwork: "rede CP",
    cpTrains: "trens CP",
    mapsVotes: "Mapas, votos da comunidade e detalles da estación.",
    budgetStay_one: "1 aloxamento económico",
    budgetStay_other: "{{count}} aloxamentos económicos",
    fromPerNight: "desde {{price}} €/noite nun raio de 2 km, máis mapas e votos.",
    andMore: " e {{count}} máis",
  },
};
