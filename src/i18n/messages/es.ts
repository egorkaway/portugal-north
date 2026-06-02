import type { Messages } from "@/i18n/types";

export const es: Messages = {
  site: { name: "Portugal en Tren" },
  lang: {
    label: "Idioma",
    en: "English",
    pt: "Português",
    es: "Español",
    gl: "Galego",
    ca: "Català",
  },
  nav: {
    allStations: "Todas las estaciones",
    backToStations: "Volver a estaciones",
    returnHome: "Volver al inicio",
    home: "Inicio",
    rankings: "Rankings",
    tickets: "Billetes",
    mobile: "Navegación móvil",
    main: "Navegación principal",
  },
  home: {
    heroSubtitle:
      "Principales estaciones de CP del Miño al Algarve, con hoteles con buen precio a poca distancia a pie.",
    searchLabel: "Buscar estación o línea",
    searchPlaceholder: "Buscar estación o línea...",
    filtersLabel: "Filtrar estaciones",
    sortByDistance: "Ordenar por distancia",
    sortedByDistance: "Ordenado por distancia",
    locating: "Localizando...",
    yourVotes: "Tus votos:",
    upvoted: "Votado positivamente",
    downvoted: "Votado negativamente",
    notVoted: "Sin voto",
    yourVisits: "Tus visitas:",
    visited: "Visitada",
    notVisitedYet: "Aún no visitada",
    stationCount_one: "{{count}} estación",
    stationCount_other: "{{count}} estaciones",
    sortedByDistanceNote: " · Ordenado por distancia desde ti",
    topCommunityPicks: " · Mejores de la comunidad primero",
    locationDenied: " · Acceso a la ubicación denegado",
    locationBlocked: "Ubicación bloqueada",
    locationUnsupported: " · Ubicación no compatible con este navegador",
    locationError: " · No se pudo obtener tu ubicación",
    bookingHint:
      ' · Pulsa "Más en Booking" para ver alojamientos con buen precio en un radio de 2 km',
    noResults: "Ninguna estación coincide con la búsqueda.",
  },
  station: {
    stationPhotoAlt: "Estación de tren de {{name}}",
    budgetStays: "Alojamientos con buen precio cerca",
    hotelsIntro:
      "Vota a favor o en contra de hoteles que conoces, o indica si puede estar cerrado. Tu opinión se guarda en este navegador.",
    noHotels: "Aún no hay hoteles recomendados para esta estación.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    tripHistorian: "TripHistorian",
    metroDoPorto: "Metro do Porto",
    metroLisboa: "Metropolitano de Lisboa",
    searchBooking: "Buscar hoteles en Booking",
    moreOnBooking: "Más en Booking",
    stationPage: "Página de la estación",
    kmFromStation: "{{km}} km de la estación",
    priceStartsAt: "Precios desde {{price}} €",
    viewOnBooking: "Ver en Booking",
    suggestClosed: "Sugerir que el hotel puede estar cerrado",
    suggestedClosed: "Has sugerido que este hotel puede estar cerrado",
    away: "a {{distance}}",
    yesimTitle: "eSIM de viaje para el aeropuerto",
    yesimBody:
      "Llega con datos móviles listos — útil para mapas, apps de transporte y mensajes antes de llegar al centro.",
    yesimCta: "Obtener eSIM Yesim",
    yesimNote: "Enlace de socio · abre Yesim en una pestaña nueva",
  },
  departures: {
    title: "Próximas salidas",
    refresh: "Actualizar",
    unavailable: "Salidas en directo temporalmente no disponibles",
    none: "No hay salidas en las próximas horas.",
    train: "tren",
    platform: "andén",
    delayMin: "+{{minutes}} min",
    take: "Lo tomo",
    taking: "Tomando",
    leavesIn: "en {{minutes}} min",
    leavesInHours: "en {{hours}}h {{minutes}}m",
    leavesInHoursOnly: "en {{hours}}h",
    leavingNow: "sale ahora",
    loadMore: "Mostrar más trenes",
    loadingMore: "Cargando…",
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
    offlineCached:
      "Sin conexión — mostrando rankings de la comunidad guardados de tu última visita. Los votos nuevos en este dispositivo se sincronizarán cuando vuelvas a estar en línea.",
    offlineDevice:
      "Sin conexión — mostrando rankings solo con tus votos en este dispositivo.",
  },
  tickets: {
    title: "Billetes y precios",
    subtitle: "CP, Andante en Oporto, navegante® en Lisboa y qué influye en el precio",
    howToBuyTitle: "Cómo comprar billetes",
    howToBuyIntro:
      "La mayoría de la gente compra billetes online o en estaciones. En rutas populares, comprar con antelación suele ser más seguro.",
    buyOnlineTitle: "Web",
    buyOnlineBody:
      "Usa el sitio oficial de CP para buscar rutas y comprar con tarjeta. Normalmente obtendrás un PDF/QR para mostrar a bordo.",
    buyOnlineLink: "Abrir web de CP",
    buyInAppTitle: "App",
    buyInAppBody:
      "La app de CP es práctica para cambios de última hora y para llevar los billetes en el móvil. Si falla, prueba la web o la taquilla.",
    buyInAppIos: "iPhone / iPad",
    buyInAppAndroid: "Android",
    buyAtStationTitle: "En la estación",
    buyAtStationBody:
      "Las estaciones grandes suelen tener taquillas y máquinas. En paradas pequeñas puede haber horarios limitados.",
    buyOnboardNote:
      "En muchos trenes que no sean AP, a veces se puede comprar a bordo — pero las reglas varían, así que compra antes de subir cuando puedas.",
    pricesTitle: "Resumen de precios (aprox.)",
    pricesIntro:
      "Los precios varían por distancia, tipo de servicio, hora/día y disponibilidad. Esto es una guía práctica.",
    serviceTypesTitle: "Tipos de servicio",
    serviceAP: "AP (Alfa Pendular): más rápido; a menudo más caro.",
    serviceIC: "IC (Intercidades): interurbano; normalmente algo más barato que AP.",
    serviceR: "R (Regional): más lento; generalmente más barato y con más paradas.",
    serviceU: "U (Urban): cercanías (Lisboa/Oporto); trayectos cortos.",
    moneySavingTitle: "Cómo ahorrar",
    tipAdvance: "Compra con antelación cuando puedas (sobre todo AP/IC).",
    tipFlexibility: "Sé flexible con día/hora — pequeños cambios pueden afectar precio/disponibilidad.",
    tipRailPass: "Si haces muchos trayectos largos, compara con pases (si aplica).",
    tipUrban: "Para trayectos cortos, Urban/Regional suele ser mejor valor.",
    disclaimer:
      "Esto no es información oficial de precios. Confirma siempre tarifas y reglas actuales en CP.",
    metroTitle: "Metro y transporte local (Oporto y Lisboa)",
    metroIntro:
      "Los metros urbanos tienen billetes aparte de los trenes de CP. En Oporto y Lisboa el precio depende de las zonas que cruces, no solo del color de la línea.",
    metroCombineNote:
      "El billete de CP no incluye el metro. Usa Andante o navegante® en el trayecto de metro, salvo producto combinado explícito de CP.",
    metroPortoTitle: "Oporto: Andante",
    metroPortoBody:
      "Andante cubre el Metro de Oporto, autobuses STCP y otros operadores en el área metropolitana. Compra la tarjeta recargable en estaciones de metro o Lojas Andante y carga viajes, pases diarios o títulos mensuales.",
    metroPortoZones:
      "Las tarifas siguen zonas (Z1–Z8 en el mapa metropolitano). Una zona es lo mínimo; aeropuerto, Matosinhos y Póvoa de Varzim suelen cruzar más zonas.",
    metroPortoTips:
      "Valida en los tornos al entrar. Hay billetes ocasionales en papel, pero la tarjeta es más práctica para varios viajes en un día.",
    metroPortoAndanteLink: "Información Andante",
    metroPortoTariffsLink: "Tarifas Metro do Porto",
    metroLisboaTitle: "Lisboa: navegante®",
    metroLisboaBody:
      "El Metropolitano de Lisboa comparte navegante® con Carris (autobuses/tranvías), Fertagus y otros operadores en el área metropolitana.",
    metroLisboaZones:
      "Los títulos se venden por anillos de zonas (p. ej. Navegante Municipal en el centro, Metropolitano para anillos más amplios). Aeropuerto, Amadora y Odivelas suelen requerir un pase mayor que un salto en Baixa.",
    metroLisboaTips:
      "Carga viajes ocasionales o pases diarios en las máquinas; hay tarjetas personalizadas en estaciones principales (navegante® na Hora).",
    metroLisboaNaveganteLink: "navegante®",
    metroLisboaTariffsLink: "Tarifas Metropolitano de Lisboa",
    metroDisclaimer:
      "Los mapas de zonas y precios cambian. Consulta los sitios oficiales antes de viajar.",
  },
  pwa: {
    votesPendingSync:
      "{{count}} voto(s) guardado(s) en este dispositivo — se sincronizarán cuando vuelvas a estar en línea.",
    votesSyncing: "Sincronizando tus votos guardados…",
    permissionsTitle: "Saca más partido a la app",
    permissionsBody:
      "Has instalado Portugal by Train — activa estas funciones opcionales para una mejor experiencia:",
    permissionsLocation:
      "Ubicación — ordenar estaciones por distancia en la página principal.",
    permissionsNotifications:
      "Notificaciones — para avisos sobre viajes y novedades (cuando estén disponibles).",
    permissionsEnable: "Activar",
    permissionsEnabling: "Abriendo ajustes…",
    permissionsNotNow: "Ahora no",
  },
  visited: {
    markVisited: "Marcar {{subject}} como visitada",
    markNotVisited: "Marcar {{subject}} como no visitada",
    visited: "Visitada",
    notVisited: "No visitada",
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
    privacy: "Política de privacidad",
  },
  notFound: {
    title: "404",
    message: "¡Vaya! Página no encontrada",
    home: "Volver al inicio",
  },
  meta: {
    siteName: "Portugal en Tren",
    home: {
      title: "Portugal en Tren: Estaciones y Hoteles con Buen Precio",
      description:
        "Descubre estaciones de CP en Portugal, del Miño al Algarve, con líneas y hoteles con buen precio a poca distancia a pie.",
    },
    rankings: {
      title: "Rankings de la Comunidad | Portugal en Tren",
      description:
        "Mira qué estaciones CP y hoteles los visitantes valoran más y menos en Portugal.",
      ogDescription: "Rankings de la comunidad para estaciones CP y hoteles con buen precio en Portugal.",
    },
    tickets: {
      title: "Billetes y Precios | Portugal en Tren",
      description:
        "Cómo comprar billetes de tren de CP en Portugal y qué suele influir en el precio (AP, IC, Regional, Urban).",
      ogDescription: "Guía rápida para comprar billetes de CP y entender los factores habituales de precio.",
    },
    privacy: {
      title: "Política de Privacidad | Portugal en Tren",
      description:
        "Cómo verystays.com guarda votos, preferencias del navegador, ubicación opcional, analítica y consultas de salidas.",
      ogDescription:
        "Qué recopila Portugal en Tren cuando votas, filtras estaciones o usas salidas CP en directo.",
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
    budgetStay_one: "1 alojamiento con buen precio",
    budgetStay_other: "{{count}} alojamientos con buen precio",
    fromPerNight: "desde {{price}} €/noche en 2 km, más mapas y votos.",
    andMore: " y {{count}} más",
  },
};
