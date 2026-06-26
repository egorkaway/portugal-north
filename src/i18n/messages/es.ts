import type { Messages } from "@/i18n/types";

export const es: Messages = {
  site: { name: "Viaje Ibérico Sostenible" },
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
    map: "Mapa",
    mobile: "Navegación móvil",
    main: "Navegación principal",
  },
  country: {
    label: "País",
    stationsIn: "Mostrar estaciones en",
    pt: "Portugal",
    es: "España",
  },
  home: {
    heroSubtitle:
      "Estaciones de tren y aeropuertos en Portugal, del Miño al Algarve, con líneas y hoteles económicos cerca.",
    heroSubtitleEs:
      "Estaciones de tren y aeropuertos en la España peninsular, con líneas y hoteles económicos cerca.",
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
    stationCount_one: "{{count}} estación y aeropuerto",
    stationCount_other: "{{count}} estaciones y aeropuertos",
    sortedByDistanceNote: " · Ordenado por distancia desde ti",
    topCommunityPicks: " · Mejores de la comunidad primero",
    locationDenied: " · Acceso a la ubicación denegado",
    locationBlocked: "Ubicación bloqueada",
    locationUnsupported: " · Ubicación no compatible con este navegador",
    locationError: " · No se pudo obtener tu ubicación",
    bookingHint:
      ' · Pulsa "Más en Booking" para ver alojamientos con buen precio en un radio de 2 km',
    noResults: "Ninguna estación coincide con la búsqueda.",
    switchingCountry: "Cargando estaciones…",
    showingRange: " · Mostrando {{from}}–{{to}} de {{total}}",
    paginationLabel: "Páginas de la lista de estaciones",
    pageOf: "Página {{current}} de {{total}}",
    previousPage: "Anterior",
    nextPage: "Siguiente",
  },
  station: {
    stationPhotoAlt: "Estación de tren de {{name}}",
    budgetStays: "Alojamientos con buen precio cerca",
    hotelsIntro:
      "Vota a favor o en contra de hoteles que conoces, o indica si puede estar cerrado. Tu opinión se guarda en este navegador.",
    noHotels: "Aún no hay hoteles recomendados para esta estación.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    downloadAreaMap: "Descargar mapa de la zona",
    berrymetWeather: "Tiempo en {{city}}",
    tripHistorian: "TripHistorian",
    metroDoPorto: "Metro do Porto",
    metroLisboa: "Metropolitano de Lisboa",
    searchBooking: "Buscar hoteles en Booking",
    moreOnBooking: "Más en Booking",
    stationPage: "Página de la estación",
    kmFromStation: "{{km}} km de la estación",
    priceStartsAt: "Precios desde {{price}} €",
    priceFromCompact: "€{{price}}+",
    viewOnBooking: "Ver en Booking",
    suggestClosed: "Sugerir que el hotel puede estar cerrado",
    suggestedClosed: "Has sugerido que este hotel puede estar cerrado",
    away: "a {{distance}}",
    longDistanceNearby: "Paradas de larga distancia más cercanas",
    longDistanceIntro:
      "Esta parada solo tiene servicio regional o urbano. Para trenes Alfa Pendular o Intercidades, prueba estas estaciones cercanas:",
    yesimTitle: "eSIM de viaje para el aeropuerto",
    yesimBody:
      "Llega con datos móviles listos — útil para mapas, apps de transporte y mensajes antes de llegar al centro.",
    yesimCta: "Obtener eSIM Yesim",
    yesimNote: "Enlace de socio · abre Yesim en una pestaña nueva",
    reliabilityTitle: "Puntuación de fiabilidad",
    reliabilityBody:
      "Basada en los retrasos acumulados de nuestras muestras de salidas en tiempo real en la red.",
    reliabilityScale: "10 = menos retrasos en nuestros datos · 1 = más retrasos",
    reliabilityLoading: "Cargando puntuación de fiabilidad…",
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
    subtitle:
      "Votos de visitantes en estaciones y hoteles, más fiabilidad de estaciones según retrasos CP en tiempo real en Portugal",
    intro:
      "Los rankings provienen de los votos en las estaciones y en las listas de hoteles de cada página.",
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
    cachedFallback:
      "Los rankings de la comunidad no están disponibles temporalmente — mostrando totales guardados de tu última visita.",
    cachedFallbackOffline:
      "Sin conexión — mostrando rankings de la comunidad guardados de tu última visita. Los votos nuevos en este dispositivo se sincronizarán cuando vuelvas a estar en línea.",
    deviceFallback:
      "Los rankings de la comunidad no están disponibles temporalmente — mostrando totales solo de tus votos en este dispositivo.",
    deviceFallbackOffline:
      "Sin conexión — mostrando rankings solo con tus votos en este dispositivo.",
    buildInfo: "Build {{buildNumber}}",
    reliabilityRankings: "Rankings de fiabilidad",
    reliabilityIntro:
      "Basado en los retrasos acumulados de nuestras muestras de salidas CP en tiempo real. 10 = menos retrasos en nuestros datos; 1 = más retrasos.",
    reliabilityLoading: "Cargando rankings de fiabilidad…",
    reliabilityUnavailable: "Los rankings de fiabilidad no están disponibles temporalmente.",
    noReliabilityData: "Aún no hay datos de fiabilidad.",
    mostReliable: "Top 10 más fiables",
    leastReliable: "Top 10 menos fiables",
    downloadReliabilityCsv: "Descargar CSV",
  },
  map: {
    title: "Mapa de actividad de estaciones",
    subtitle: "Hexágonos H3 según salidas y llegadas muestreadas en Portugal continental",
    intro:
      "Cada hexágono es una celda H3 alrededor de una estación de nuestra lista. Las estaciones más activas (más salidas y llegadas en nuestras muestras CP) usan hexágonos mayores en resolución 5; las más tranquilas usan hexágonos menores en resolución 9, con resolución 7 en el medio.",
    loading: "Cargando mapa…",
    unavailable: "Los datos de actividad de estaciones no están disponibles temporalmente.",
    legendTitle: "Tamaño del hexágono",
    legendBusy: "Más activa (H3 res. 5)",
    legendMid: "Tráfico medio (H3 res. 7)",
    legendQuiet: "Más tranquila (H3 res. 9)",
    tooltipMovements: "{{count}} salidas + llegadas (muestreadas)",
    tooltipResolution: "Resolución H3 {{resolution}}",
    viewStation: "Ver estación",
    downloadGeoJson: "Descargar GeoJSON",
    legendAirports: "Aeropuertos internacionales",
    airportLis: "Lisboa Humberto Delgado",
    airportPorto: "Oporto Francisco Sá Carneiro",
    airportFaro: "Faro",
    airportMad: "Madrid-Barajas",
    airportBarcelona: "Barcelona-El Prat",
    airportMalaga: "Málaga-Costa del Sol",
    airportAlicante: "Alicante-Elche",
    airportValencia: "Valencia",
    airportSeville: "Sevilla",
    airportBilbao: "Bilbao",
    airportSantiago: "Santiago de Compostela",
    airportVigo: "Vigo",
    airportAsturias: "Asturias",
    locateMe: "Mostrar mi ubicación",
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
      "Has instalado Viaje Ibérico Sostenible — activa estas funciones opcionales para una mejor experiencia:",
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
    stationMap: "Mapa de actividad de estaciones",
  },
  notFound: {
    title: "404",
    message: "¡Vaya! Página no encontrada",
    home: "Volver al inicio",
  },
  meta: {
    siteName: "Viaje Ibérico Sostenible",
    home: {
      title: "Viaje Ibérico Sostenible: Estaciones y Hoteles con Buen Precio",
      description:
        "Descubre estaciones de tren y aeropuertos en Portugal y España, con líneas e hoteles económicos a poca distancia a pie.",
    },
    rankings: {
      title: "Rankings de la Comunidad | Viaje Ibérico Sostenible",
      description:
        "Mira qué estaciones CP y hoteles los visitantes valoran más y menos en Portugal.",
      ogDescription: "Rankings de la comunidad para estaciones CP y hoteles con buen precio en Portugal.",
    },
    tickets: {
      title: "Billetes y Precios | Viaje Ibérico Sostenible",
      description:
        "Cómo comprar billetes de tren de CP en Portugal y qué suele influir en el precio (AP, IC, Regional, Urban).",
      ogDescription: "Guía rápida para comprar billetes de CP y entender los factores habituales de precio.",
    },
    map: {
      title: "Mapa de Actividad | Viaje Ibérico Sostenible",
      description:
        "Mapa interactivo de estaciones CP en Portugal continental con hexágonos H3 según salidas y llegadas muestreadas.",
      ogDescription:
        "Mira qué estaciones CP son más activas en nuestras muestras de salidas, en un mapa H3 de Portugal.",
    },
    privacy: {
      title: "Política de Privacidad | Viaje Ibérico Sostenible",
      description:
        "Cómo verystays.com guarda votos, preferencias del navegador, ubicación opcional, analítica y consultas de salidas.",
      ogDescription:
        "Qué recopila Viaje Ibérico Sostenible cuando votas, filtras estaciones o usas salidas CP en directo.",
    },
    notFound: {
      title: "Página no encontrada | Viaje Ibérico Sostenible",
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
