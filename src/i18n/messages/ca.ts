import type { Messages } from "@/i18n/types";

export const ca: Messages = {
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
    allStations: "Totes les estacions",
    backToStations: "Tornar a les estacions",
    returnHome: "Tornar a l'inici",
    home: "Inici",
    rankings: "Rankings",
    tickets: "Bitllets",
    mobile: "Navegació mòbil",
    main: "Navegació principal",
  },
  home: {
    heroSubtitle:
      "Principals estacions de CP del Minho a l'Algarve, amb hotels amb preus raonables a poca distància a peu.",
    searchLabel: "Cercar estació o línia",
    searchPlaceholder: "Cercar estació o línia...",
    filtersLabel: "Filtrar estacions",
    sortByDistance: "Ordenar per distància",
    sortedByDistance: "Ordenat per distància",
    locating: "Localitzant...",
    yourVotes: "Els teus vots:",
    upvoted: "Votat positivament",
    downvoted: "Votat negativament",
    notVoted: "Sense vot",
    yourVisits: "Les teves visites:",
    visited: "Visitada",
    notVisitedYet: "Encara no visitada",
    stationCount_one: "{{count}} estació",
    stationCount_other: "{{count}} estacions",
    sortedByDistanceNote: " · Ordenat per distància des de tu",
    topCommunityPicks: " · Millors de la comunitat primer",
    locationDenied: " · Accés a la ubicació denegat",
    locationBlocked: "Ubicació bloquejada",
    locationUnsupported: " · Ubicació no compatible amb aquest navegador",
    locationError: " · No s'ha pogut obtenir la teva ubicació",
    bookingHint:
      ' · Prem "Més a Booking" per veure allotjaments amb preus raonables en un radi de 2 km',
    noResults: "Cap estació coincideix amb la cerca.",
  },
  station: {
    stationPhotoAlt: "Estació de tren de {{name}}",
    budgetStays: "Allotjaments amb preus raonables a prop",
    hotelsIntro:
      "Vota a favor o en contra d'hotels que coneixes, o indica si un allotjament pot estar tancat. El teu feedback es desa en aquest navegador.",
    noHotels: "Encara no hi ha hotels recomanats per a aquesta estació.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    tripHistorian: "TripHistorian",
    metroDoPorto: "Metro do Porto",
    metroLisboa: "Metropolitano de Lisboa",
    searchBooking: "Cercar hotels a Booking",
    moreOnBooking: "Més a Booking",
    stationPage: "Pàgina de l'estació",
    kmFromStation: "{{km}} km de l'estació",
    priceStartsAt: "Preus des de {{price}} €",
    priceFromCompact: "€{{price}}+",
    viewOnBooking: "Veure a Booking",
    suggestClosed: "Suggerir que l'hotel pot estar tancat",
    suggestedClosed: "Has suggerit que aquest hotel pot estar tancat",
    away: "a {{distance}}",
    longDistanceNearby: "Parades de llarga distància més properes",
    longDistanceIntro:
      "Aquesta parada només té servei regional o urbà. Per als trens Alfa Pendular o Intercidades, prova aquestes estacions properes:",
    yesimTitle: "eSIM de viatge per a l'aeroport",
    yesimBody:
      "Arriba amb dades mòbils a punt — útil per a mapes, apps de transport i missatges abans d'arribar al centre.",
    yesimCta: "Obtenir eSIM Yesim",
    yesimNote: "Enllaç de soci · obre Yesim en una pestanya nova",
    reliabilityTitle: "Puntuació de fiabilitat",
    reliabilityBody:
      "Basada en els retards acumulats de les nostres mostres de sortides en {{runCount}} execucions de la xarxa.",
    reliabilityScale: "10 = menys retards en les nostres dades · 1 = més retards",
    reliabilityLoading: "Carregant puntuació de fiabilitat…",
  },
  departures: {
    title: "Pròximes sortides",
    refresh: "Actualitzar",
    unavailable: "Sortides en directe temporalment no disponibles",
    none: "No hi ha sortides en les properes hores.",
    train: "tren",
    platform: "andana",
    delayMin: "+{{minutes}} min",
    take: "L'agafo",
    taking: "Agafant",
    leavesIn: "en {{minutes}} min",
    leavesInHours: "en {{hours}}h {{minutes}}m",
    leavesInHoursOnly: "en {{hours}}h",
    leavingNow: "surt ara",
    loadMore: "Mostrar més trens",
    loadingMore: "Carregant…",
  },
  rankings: {
    title: "Rankings de la comunitat",
    subtitle: "Estacions i hotels segons els vots dels visitants a Portugal",
    intro:
      "Els rankings provenen dels vots a les estacions i a les llistes d'hotels de cada pàgina. Si l'emmagatzematge de vots falla, el missatge de sota ho explica.",
    communityTitle: "Rankings de la comunitat",
    communityTeaser: "Millors estacions per vots globals. Hotels a la pàgina completa.",
    fullPage: "Pàgina completa de rankings",
    viewFull: "Veure rankings complets de la comunitat",
    loading: "Carregant vots de la comunitat...",
    unavailableTitle: "Classificacions de la comunitat no disponibles",
    unavailableDetail:
      "Els vots a les targetes es desen al teu navegador. Els totals globals requereixen l'API de Vercel i un Blob en aquest projecte.",
    unavailableHint: "",
    retrying: "Reintentant...",
    tryAgain: "Tornar-ho a provar",
    noVotesYet:
      "Encara no hi ha vots de la comunitat. Vota a estacions i hotels del lloc per crear els rankings.",
    stationRankings: "Rankings d'estacions",
    hotelRankings: "Rankings d'hotels",
    hotelLeaderboard:
      "Una classificació nacional de tots els hotels recomanats, a qualsevol estació.",
    noStationVotes: "Encara sense vots a estacions.",
    noHotelVotes: "Encara sense vots a hotels.",
    voteTotalsStations:
      "{{up}} vots positius i {{down}} negatius en {{items}} estacions.",
    voteTotalsHotels: "{{up}} vots positius i {{down}} negatius en {{items}} hotels.",
    topUpvoted: "Més votats",
    mostDownvoted: "Més votats negativament",
    noStationUpvotes: "Sense vots positius. Vota en una targeta d'estació per començar.",
    noStationDownvotes: "Sense vots negatius.",
    noHotelUpvotes: "Sense vots positius. Vota en una pàgina d'estació per valorar hotels.",
    noHotelDownvotes: "Sense vots negatius.",
    cachedFallback:
      "Els rankings de la comunitat no estan disponibles temporalment — es mostren totals desats de la darrera visita.",
    cachedFallbackOffline:
      "Sense connexió — es mostren rankings de la comunitat desats de la darrera visita. Els vots nous en aquest dispositiu es sincronitzaran quan tornis a estar en línia.",
    deviceFallback:
      "Els rankings de la comunitat no estan disponibles temporalment — es mostren totals només dels teus vots en aquest dispositiu.",
    deviceFallbackOffline:
      "Sense connexió — es mostren rankings només amb els teus vots en aquest dispositiu.",
    buildInfo: "Build {{buildNumber}}",
  },
  tickets: {
    title: "Bitllets i preus",
    subtitle: "CP, Andante al Porto, navegante® a Lisboa i què influeix en el preu",
    howToBuyTitle: "Com comprar bitllets",
    howToBuyIntro:
      "La majoria de gent compra bitllets en línia o a les estacions. En rutes populars, comprar amb antelació sol ser més segur.",
    buyOnlineTitle: "Web",
    buyOnlineBody:
      "Fes servir el web oficial de la CP per buscar rutes i comprar amb targeta. Normalment obtindràs un PDF/QR per ensenyar a bord.",
    buyOnlineLink: "Obrir web de la CP",
    buyInAppTitle: "App",
    buyInAppBody:
      "L'app de la CP és pràctica per a canvis d'última hora i per portar els bitllets al mòbil. Si falla, prova el web o la taquilla.",
    buyInAppIos: "iPhone / iPad",
    buyInAppAndroid: "Android",
    buyAtStationTitle: "A l'estació",
    buyAtStationBody:
      "Les estacions grans solen tenir taquilles i màquines. A parades petites pot haver-hi horaris limitats.",
    buyOnboardNote:
      "En molts trens que no siguin AP, de vegades es pot comprar a bord — però les normes varien, així que compra abans de pujar quan puguis.",
    pricesTitle: "Resum de preus (aprox.)",
    pricesIntro:
      "Els preus varien per distància, tipus de servei, hora/dia i disponibilitat. Això és una guia pràctica.",
    serviceTypesTitle: "Tipus de servei",
    serviceAP: "AP (Alfa Pendular): més ràpid; sovint més car.",
    serviceIC: "IC (Intercidades): interurbà; normalment una mica més barat que AP.",
    serviceR: "R (Regional): més lent; generalment més barat i amb més parades.",
    serviceU: "U (Urbà): rodalies (Lisboa/Porto); trajectes curts.",
    moneySavingTitle: "Com estalviar",
    tipAdvance: "Compra amb antelació quan puguis (sobretot AP/IC).",
    tipFlexibility: "Sigues flexible amb dia/hora — petits canvis poden afectar preu/disponibilitat.",
    tipRailPass: "Si fas molts trajectes llargs, compara amb passis (si aplica).",
    tipUrban: "Per trajectes curts, Urbà/Regional sol tenir millor valor.",
    disclaimer:
      "Això no és informació oficial de preus. Confirma sempre tarifes i normes actuals a la CP.",
    metroTitle: "Metro i transport local (Porto i Lisboa)",
    metroIntro:
      "Els metros urbans tenen bitllets a part dels trens de CP. Al Porto i a Lisboa el preu depèn de les zones que travessis, no només del color de la línia.",
    metroCombineNote:
      "El bitllet de CP no inclou el metro. Fes servir Andante o navegante® al tram de metro, llevat de producte combinat explícit de CP.",
    metroPortoTitle: "Porto: Andante",
    metroPortoBody:
      "Andante cobreix el Metro do Porto, autobusos STCP i altres operadors a l'àrea metropolitana. Compra la targeta recarregable a estacions de metro o Lojas Andante i carrega viatges, passis diaris o títols mensuals.",
    metroPortoZones:
      "Les tarifes segueixen zones (Z1–Z8 al mapa metropolità). Una zona és el mínim; aeroport, Matosinhos i Póvoa de Varzim sovint creuen més zones.",
    metroPortoTips:
      "Valida als torniquets en entrar. Hi ha bitllets ocasionals en paper, però la targeta és més pràctica per a diversos viatges el mateix dia.",
    metroPortoAndanteLink: "Informació Andante",
    metroPortoTariffsLink: "Tarifes Metro do Porto",
    metroLisboaTitle: "Lisboa: navegante®",
    metroLisboaBody:
      "El Metropolitano de Lisboa comparteix navegante® amb Carris (autobusos/tramvies), Fertagus i altres operadors a l'àrea metropolitana.",
    metroLisboaZones:
      "Els títols es venen per anells de zones (p. ex. Navegante Municipal al nucli, Metropolitano per anells més amplis). Aeroport, Amadora i Odivelas sovint requereixen un passi més gran que un salt a la Baixa.",
    metroLisboaTips:
      "Carrega viatges ocasionals o passis diaris a les màquines; hi ha targetes personalitzades a estacions principals (navegante® na Hora).",
    metroLisboaNaveganteLink: "navegante®",
    metroLisboaTariffsLink: "Tarifes Metropolitano de Lisboa",
    metroDisclaimer:
      "Els mapes de zones i preus canvien. Consulta els llocs oficials abans de viatjar.",
  },
  pwa: {
    votesPendingSync:
      "{{count}} vot(s) desat(s) en aquest dispositiu — es sincronitzaran quan tornis a estar en línia.",
    votesSyncing: "Sincronitzant els teus vots desats…",
    permissionsTitle: "Treu més profit de l'app",
    permissionsBody:
      "Has instal·lat Portugal by Train — activa aquestes funcions opcionals per a una millor experiència:",
    permissionsLocation:
      "Ubicació — ordenar estacions per distància a la pàgina d'inici.",
    permissionsNotifications:
      "Notificacions — per avisos sobre viatges i novetats (quan estiguin disponibles).",
    permissionsEnable: "Activar",
    permissionsEnabling: "Obrint configuració…",
    permissionsNotNow: "Ara no",
  },
  visited: {
    markVisited: "Marcar {{subject}} com a visitada",
    markNotVisited: "Marcar {{subject}} com a no visitada",
    visited: "Visitada",
    notVisited: "No visitada",
  },
  vote: {
    yourVoteOn: "El teu vot a {{subject}}",
    upvote: "Vot positiu a {{subject}}",
    downvote: "Vot negatiu a {{subject}}",
    removeUpvote: "Treure vot positiu",
    removeDownvote: "Treure vot negatiu",
    upvoteOnlyYou: "Vot positiu (només tu ho veus)",
    downvoteOnlyYou: "Vot negatiu (només tu ho veus)",
  },
  imageVote: {
    question: "Aquesta foto representa {{name}}?",
    goodPhoto: "Bona foto",
    goodShort: "Bona",
    badPhoto: "No representa l'estació",
    badShort: "No representa",
    rateLabel: "Valorar si la foto representa l'estació",
    browserNote:
      "La teva elecció es desa en aquest navegador. Els totals de la comunitat ajuden a triar millors imatges.",
    community: "Comunitat: {{summary}}",
    goodPhotos_one: "{{count}} bona foto",
    goodPhotos_other: "{{count}} bones fotos",
    notRepresentative_one: "{{count}} no representativa",
    notRepresentative_other: "{{count}} no representatives",
  },
  footer: {
    title: "Per les vies de Portugal",
    subtitle:
      "Del Douro ennuvolat a la costa atlàntica, amb parades clau i un lloc on dormir a prop.",
    disclaimer: "No recomanem aquests hotels, però si t'agraden, volem saber-ho.",
    alsoFromUs: "També nostres",
    climaTitle: "Clima Ibérico",
    climaDesc:
      "Temps i alertes meteorològiques a Espanya i Portugal. Consulta les condicions abans de viatjar.",
    mapaTitle: "Map Your Travel",
    mapaDesc:
      "L'app GetMapa per a iPhone registra els llocs que visites i crea un mapa de viatge amb les teves fotos.",
    portuGuessTitle: "PortuGuess",
    portuGuessDesc:
      "Aprèn portuguès europeu amb qüestionaris, llistes de paraules i apps sense connexió per a iOS i Android.",
    privacy: "Política de privacitat",
  },
  notFound: {
    title: "404",
    message: "Vaja! Pàgina no trobada",
    home: "Tornar a l'inici",
  },
  meta: {
    siteName: "Portugal en tren",
    home: {
      title: "Portugal en tren: Estacions i hotels amb preus raonables",
      description:
        "Descobreix estacions de CP a Portugal, del Minho a l'Algarve, amb línies i hotels amb preus raonables a poca distància a peu.",
    },
    rankings: {
      title: "Rankings de la comunitat | Portugal en tren",
      description:
        "Mira quines estacions de CP i hotels els visitants valoren més i menys a Portugal.",
      ogDescription: "Rankings de la comunitat per a estacions de CP i hotels amb preus raonables a Portugal.",
    },
    tickets: {
      title: "Bitllets i Preus | Portugal en tren",
      description:
        "Com comprar bitllets de tren de la CP a Portugal i què sol influir en el preu (AP, IC, Regional, Urbà).",
      ogDescription: "Guia ràpida per comprar bitllets de la CP i entendre els factors habituals de preu.",
    },
    privacy: {
      title: "Política de Privacitat | Portugal en tren",
      description:
        "Com verystays.com emmagatzema vots, preferències del navegador, ubicació opcional, analítica i consultes de sortides.",
      ogDescription:
        "Què recull Portugal en tren quan votes, filtres estacions o uses sortides CP en directe.",
    },
    notFound: {
      title: "Pàgina no trobada | Portugal en tren",
      description:
        "La pàgina que buscaves no existeix. Torna a l'inici per explorar estacions de tren a Portugal.",
    },
    stationTitle: "Estació de {{name}} — Hotels i línies | {{site}}",
    stationDescription: "{{services}} a {{name}} ({{lines}}). {{stays}}",
    stationOgWithHotels:
      "{{name}} ({{lines}}): {{services}}. Allotjaments des de {{price}} €/nit — {{names}}{{more}}.",
    stationOgNoHotels:
      "{{name}}: {{services}} a {{lines}}. Explora mapes i vota aquesta estació.",
    stationOgExplore: "Explora mapes i vota aquesta estació.",
    cpNetwork: "xarxa CP",
    cpTrains: "trens CP",
    mapsVotes: "Mapes, vots de la comunitat i detalls de l'estació.",
    budgetStay_one: "1 allotjament amb preu raonable",
    budgetStay_other: "{{count}} allotjaments amb preus raonables",
    fromPerNight: "des de {{price}} €/nit en un radi de 2 km, més mapes i vots.",
    andMore: " i {{count}} més",
  },
};
