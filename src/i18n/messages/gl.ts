import type { Messages } from "@/i18n/types";

export const gl: Messages = {
  site: { name: "Viaxe Ibérica Sostible" },
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
    home: "Inicio",
    rankings: "Rankings",
    tickets: "Billetes",
    map: "Mapa",
    trip: "Viaxe",
    mobile: "Navegación móbil",
    main: "Navegación principal",
  },
  country: {
    label: "País",
    stationsIn: "Mostrar estacións en",
    pt: "Portugal",
    es: "España",
  },
  home: {
    heroSubtitle:
      "Estacións de tren e aeroportos en Portugal, do Miño ao Algarve, con liñas e hoteis económicos preto.",
    heroSubtitleEs:
      "Estacións de tren e aeroportos na España peninsular, con liñas e hoteis económicos preto.",
    heroSubtitleAll:
      "Estacións de tren e aeroportos en Portugal e España, con liñas e hoteis económicos preto.",
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
    stationCount_one: "{{count}} estación e aeroporto",
    stationCount_other: "{{count}} estacións e aeroportos",
    sortedByDistanceNote: " · Ordenado pola túa distancia",
    topCommunityPicks: " · Mellores da comunidade primeiro",
    locationDenied: " · Acceso á localización denegado",
    locationBlocked: "Localización bloqueada",
    locationUnsupported: " · Localización non compatible con este navegador",
    locationError: " · Non foi posible obter a túa localización",
    bookingHint:
      ' · Preme "Máis en Booking" para ver aloxamentos con prezos razoables nun raio de 2 km',
    noResults: "Ningunha estación coincide coa busca.",
    switchingCountry: "Cargando estacións…",
    showingRange: " · Mostrando {{from}}–{{to}} de {{total}}",
    paginationLabel: "Páxinas da lista de estacións",
    pageOf: "Páxina {{current}} de {{total}}",
    previousPage: "Anterior",
    nextPage: "Seguinte",
  },
  station: {
    stationPhotoAlt: "Estación de tren de {{name}}",
    stationPhotoAltBy: "Foto de {{name}} de {{author}}",
    photoCreditBy: "Foto de {{author}}",
    budgetStays: "Aloxamentos con prezos razoables preto",
    hotelsIntro:
      "Vota a favor ou en contra de hoteis que coñezas, ou indica se un aloxamento pode estar pechado. O teu feedback queda gardado neste navegador.",
    noHotels: "Aínda non hai hoteis recomendados para esta estación.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    downloadAreaMap: "Descargar mapa da zona",
    areaMapAlt: "Mapa da zona de {{name}}",
    berrymetWeather: "Tempo en {{city}}",
    tripHistorian: "TripHistorian",
    metroDoPorto: "Metro do Porto",
    metroLisboa: "Metropolitano de Lisboa",
    searchBooking: "Buscar hoteis en Booking",
    moreOnBooking: "Máis en Booking",
    stationPage: "Páxina da estación",
    kmFromStation: "{{km}} km da estación",
    priceStartsAt: "Prezos desde {{price}} €",
    priceFromCompact: "€{{price}}+",
    viewOnBooking: "Ver en Booking",
    suggestClosed: "Suxerir que o hotel pode estar pechado",
    suggestedClosed: "Suxeriches que este hotel pode estar pechado",
    away: "a {{distance}}",
    longDistanceNearby: "Paradas de longa distancia máis próximas",
    longDistanceIntro:
      "Esta parada só ten servizo rexional ou urbano. Para trens Alfa Pendular ou Intercidades, proba estas estacións próximas:",
    nearestStationsNearby: "Estacións máis próximas",
    nearestStationsIntro: "Outras paradas preto desta estación no mapa.",
    yesimTitle: "eSIM de viaxe para o aeroporto",
    yesimBody:
      "Chega con datos móbiles listos — útil para mapas, apps de transporte e mensaxes antes de chegar ao centro.",
    yesimCta: "Obter eSIM Yesim",
    yesimNote: "Ligazón de socio · abre Yesim nun novo separador",
    reliabilityTitle: "Puntuación de fiabilidade",
    reliabilityBody:
      "Baseada nos atrasos acumulados das nosas mostras de saídas en tempo real na rede.",
    reliabilityScale: "10 = menos atrasos nos nosos datos · 1 = máis atrasos",
    reliabilityLoading: "Cargando puntuación de fiabilidade…",
  },
  departures: {
    title: "Próximas saídas",
    refresh: "Actualizar",
    unavailable: "Saídas en directo temporalmente non dispoñibles",
    none: "Non hai saídas nas próximas horas.",
    train: "tren",
    platform: "andeén",
    delayMin: "+{{minutes}} min",
    take: "Vou coller",
    taking: "A coller",
    leavesIn: "en {{minutes}} min",
    leavesInHours: "en {{hours}}h {{minutes}}m",
    leavesInHoursOnly: "en {{hours}}h",
    leavingNow: "saíndo agora",
    loadMore: "Mostrar máis trens",
    loadingMore: "A cargar…",
  },
  trip: {
    title: "Viaxe",
    subtitle: "Conta atrás e atrasos en directo do tren que vas coller.",
    emptyTitle: "Sen viaxe activa",
    emptyBody:
      "Abre unha páxina de estación, preme Coller nunha saída e a viaxe aparecerá aquí con contas atrás en directo.",
    departureCountdown: "Conta atrás para a saída",
    departed: "Partiu",
    departedAt: "Partiu ás {{time}}",
    expectedDeparture: "Saída prevista ás {{time}}",
    minutesAgo: "hai {{minutes}} min",
    minutesAgoHours: "hai {{hours}}h {{minutes}}m",
    minutesAgoHoursOnly: "hai {{hours}}h",
    upcomingStops: "Próximas paradas",
    loadingStops: "A cargar paradas da ruta…",
    stopsUnavailable: "As paradas seguintes non están dispoñibles temporalmente para este tren.",
    stopTracking: "Deixar de seguir",
    departureAt: "Sae ás {{time}}",
    arrivalAt: "Chega ás {{time}}",
    arrivesIn: "en {{minutes}} min",
    arrivesInHours: "en {{hours}}h {{minutes}}m",
    arrivesInHoursOnly: "en {{hours}}h",
    arrivingNow: "a chegar agora",
  },
  rankings: {
    title: "Rankings da comunidade",
    subtitle:
      "Votos da comunidade en estacións e hoteis, máis fiabilidade das estacións con atrasos CP en tempo real en Portugal",
    intro:
      "Os rankings provén dos votos nas estacións e nas listas de hoteis de cada páxina.",
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
    cachedFallback:
      "Os rankings da comunidade non están dispoñibles temporalmente — móstranse totais gardados da túa última visita.",
    cachedFallbackOffline:
      "Sen conexión — móstranse rankings da comunidade gardados da túa última visita. Os votos novos neste dispositivo sincronizaranse cando volvas estar en liña.",
    deviceFallback:
      "Os rankings da comunidade non están dispoñibles temporalmente — móstranse totais só cos teus votos neste dispositivo.",
    deviceFallbackOffline:
      "Sen conexión — móstranse rankings só cos teus votos neste dispositivo.",
    buildInfo: "Build {{buildNumber}}",
    reliabilityRankings: "Rankings de fiabilidade",
    reliabilityIntro:
      "Baseado nos atrasos acumulados das nosas mostras de saídas CP en tempo real. 10 = menos atrasos nos nosos datos; 1 = máis atrasos.",
    reliabilityLoading: "Cargando rankings de fiabilidade…",
    reliabilityUnavailable: "Os rankings de fiabilidade non están dispoñibles temporalmente.",
    noReliabilityData: "Aínda non hai datos de fiabilidade.",
    mostReliable: "Top 10 máis fiábeis",
    leastReliable: "Top 10 menos fiábeis",
    downloadReliabilityCsv: "Descargar CSV",
  },
  map: {
    title: "Mapa de actividade das estacións",
    subtitle: "Hexágonos H3 segundo saídas e chegadas mostreadas en Portugal continental",
    intro:
      "Cada hexágono é unha célula H3 arredor dunha estación da nosa lista. As estacións máis movidas (máis saídas e chegadas nas mostras CP) usan hexágonos maiores na resolución 5; as máis calmas usan hexágonos menores na resolución 9, con resolución 7 no medio.",
    loading: "Cargando mapa…",
    unavailable: "Os datos de actividade das estacións non están dispoñibles temporalmente.",
    legendTitle: "Tamaño do hexágono",
    legendBusy: "Máis movida (H3 res. 5)",
    legendMid: "Tráfico medio (H3 res. 7)",
    legendQuiet: "Máis calma (H3 res. 9)",
    tooltipMovements: "{{count}} saídas + chegadas (mostradas)",
    tooltipResolution: "Resolución H3 {{resolution}}",
    viewStation: "Ver estación",
    downloadGeoJson: "Descargar GeoJSON",
    legendAirports: "Aeroportos internacionais",
    airportLis: "Lisboa Humberto Delgado",
    airportPorto: "Porto Francisco Sá Carneiro",
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
    locateMe: "Mostrar a miña localización",
  },
  tickets: {
    title: "Billetes e prezos",
    subtitle: "CP, Andante no Porto, navegante® en Lisboa e o que influí no prezo",
    howToBuyTitle: "Como mercar billetes",
    howToBuyIntro:
      "A maioría da xente merca billetes en liña ou nas estacións. En rutas concorridas, mercar con antelación adoita ser máis seguro.",
    buyOnlineTitle: "Web",
    buyOnlineBody:
      "Usa o sitio oficial da CP para buscar rutas e mercar con tarxeta. Normalmente terás un PDF/QR para amosar a bordo.",
    buyOnlineLink: "Abrir web da CP",
    buyInAppTitle: "App",
    buyInAppBody:
      "A app da CP é práctica para cambios de última hora e para levar os billetes no móbil. Se falla, proba a web ou a billeteira.",
    buyInAppIos: "iPhone / iPad",
    buyInAppAndroid: "Android",
    buyAtStationTitle: "Na estación",
    buyAtStationBody:
      "As estacións grandes adoitan ter billeteiras e máquinas. Nas paradas pequenas pode haber horarios limitados.",
    buyOnboardNote:
      "En moitos trens que non sexan AP, ás veces pódese comprar a bordo — pero as regras varían, así que compra antes de subir cando poidas.",
    pricesTitle: "Resumo de prezos (aprox.)",
    pricesIntro:
      "Os prezos varían por distancia, tipo de servizo, hora/día e dispoñibilidade. Isto é unha guía práctica.",
    serviceTypesTitle: "Tipos de servizo",
    serviceAP: "AP (Alfa Pendular): máis rápido; a miúdo máis caro.",
    serviceIC: "IC (Intercidades): interurbano; normalmente algo máis barato ca AP.",
    serviceR: "R (Regional): máis lento; xeralmente máis barato e con máis paradas.",
    serviceU: "U (Urbano): cercanías (Lisboa/Porto); traxectos curtos.",
    moneySavingTitle: "Como aforrar",
    tipAdvance: "Merca con antelación cando poidas (sobre todo AP/IC).",
    tipFlexibility: "Sé flexible con día/hora — pequenos cambios poden afectar prezo/dispoñibilidade.",
    tipRailPass: "Se fas moitas viaxes longas, compara con pases (se aplica).",
    tipUrban: "Para traxectos curtos, Urbano/Regional adoita ter mellor valor.",
    disclaimer:
      "Isto non é información oficial de prezos. Confirma sempre tarifas e regras actuais na CP.",
    metroTitle: "Metro e transporte local (Porto e Lisboa)",
    metroIntro:
      "Os metros urbanos teñen billetes á parte dos trens da CP. No Porto e en Lisboa o prezo depende das zonas que atraveses, non só da cor da liña.",
    metroCombineNote:
      "O billete da CP non inclúe o metro. Usa Andante ou navegante® no tramo de metro, salvo produto combinado explícito da CP.",
    metroPortoTitle: "Porto: Andante",
    metroPortoBody:
      "O Andante cobre o Metro do Porto, autobuses STCP e outros operadores na área metropolitana. Compra a tarxeta recargable nas estacións de metro ou Lojas Andante e carga viaxes, pases diarios ou títulos mensuais.",
    metroPortoZones:
      "As tarifas seguen zonas (Z1–Z8 no mapa metropolitano). Unha zona é o mínimo; aeroporto, Matosinhos e Póvoa de Varzim adoitan cruzar máis zonas.",
    metroPortoTips:
      "Valida nos tornos á entrada. Hai billetes ocasionais en papel, pero a tarxeta é máis práctica para varias viaxes no mesmo día.",
    metroPortoAndanteLink: "Información Andante",
    metroPortoTariffsLink: "Tarifarios Metro do Porto",
    metroLisboaTitle: "Lisboa: navegante®",
    metroLisboaBody:
      "O Metropolitano de Lisboa comparte navegante® con Carris (autobuses/tranvías), Fertagus e outros operadores na área metropolitana.",
    metroLisboaZones:
      "Os títulos véndense por aneis de zonas (p. ex. Navegante Municipal no núcleo, Metropolitano para aneis máis amplos). Aeroporto, Amadora e Odivelas adoitan precisar un pase maior que un salto na Baixa.",
    metroLisboaTips:
      "Carga viaxes ocasionais ou pases diarios nas máquinas; hai tarxetas personalizadas nas estacións principais (navegante® na Hora).",
    metroLisboaNaveganteLink: "navegante®",
    metroLisboaTariffsLink: "Tarifarios Metropolitano de Lisboa",
    metroDisclaimer:
      "Os mapas de zonas e prezos cambian. Consulta os sitios oficiais antes de viaxar.",
  },
  pwa: {
    votesPendingSync:
      "{{count}} voto(s) gardado(s) neste dispositivo — sincronizaranse cando volvas estar en liña.",
    votesSyncing: "Sincronizando os teus votos gardados…",
    permissionsTitle: "Saca máis partido da app",
    permissionsBody:
      "Instalaches Viaxe Ibérica Sostible — activa estas funcións opcionais para unha mellor experiencia:",
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
    caminoTitle: "My Personal Camino de Santiago",
    caminoDesc:
      "App para iPhone para seguir o camiño e o teu progreso no Camiño de Santiago.",
    mapaTitle: "Map Your Travel",
    mapaDesc:
      "A app GetMapa para iPhone rexistra os lugares que visitas e crea un mapa de viaxe coas túas fotos.",
    portuGuessTitle: "PortuGuess",
    portuGuessDesc:
      "Aprende portugués europeo con cuestionarios, listas de palabras e apps sen conexión para iOS e Android.",
    sovnikTitle: "Sovnik",
    sovnikDesc:
      "Aprende galego, catalán, éuscaro e outras linguas ibéricas con cuestionarios de vocabulario e apps móbiles.",
    privacy: "Política de privacidade",
    stationMap: "Mapa de actividade das estacións",
  },
  notFound: {
    title: "404",
    message: "Vaia! Páxina non atopada",
    home: "Volver ao inicio",
  },
  meta: {
    siteName: "Viaxe Ibérica Sostible",
    home: {
      title: "Viaxe Ibérica Sostible: Estacións e hoteis con prezos razoables",
      description:
        "Descobre estacións de tren e aeroportos en Portugal e España, con liñas e hoteis con prezos razoables a poucos minutos a pé.",
    },
    rankings: {
      title: "Rankings da comunidade | Viaxe Ibérica Sostible",
      description:
        "Mira que estacións da CP e hoteis os visitantes valoran máis e menos en Portugal.",
      ogDescription: "Rankings da comunidade para estacións da CP e hoteis con prezos razoables en Portugal.",
    },
    tickets: {
      title: "Billetes e Prezos | Viaxe Ibérica Sostible",
      description:
        "Como mercar billetes de tren da CP en Portugal e o que adoita influír no prezo (AP, IC, Regional, Urbano).",
      ogDescription: "Guía rápida para mercar billetes da CP e entender os factores habituais de prezo.",
    },
    map: {
      title: "Mapa de Actividade | Viaxe Ibérica Sostible",
      description:
        "Mapa interactivo das estacións CP en Portugal continental con hexágonos H3 segundo saídas e chegadas mostreadas.",
      ogDescription:
        "Mira que estacións CP son máis movidas nas nosas mostras de saídas, nun mapa H3 de Portugal.",
    },
    trip: {
      title: "Viaxe | Viaxe Ibérica Sostible",
      description:
        "Segue o teu tren CP con conta atrás para a saída e atrasos en directo despois de premer Coller nunha estación.",
      ogDescription: "Seguimento de viaxe con contas atrás e atrasos en directo.",
    },
    privacy: {
      title: "Política de Privacidade | Viaxe Ibérica Sostible",
      description:
        "Como verystays.com almacena votos, preferencias do navegador, localización opcional, analítica e consultas de saídas.",
      ogDescription:
        "Que recolle Viaxe Ibérica Sostible cando votas, filtras estacións ou usas saídas CP en directo.",
    },
    notFound: {
      title: "Páxina non atopada | Viaxe Ibérica Sostible",
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
    budgetStay_one: "1 aloxamento con prezo razoable",
    budgetStay_other: "{{count}} aloxamentos con prezos razoables",
    fromPerNight: "desde {{price}} €/noite nun raio de 2 km, máis mapas e votos.",
    andMore: " e {{count}} máis",
  },
};
