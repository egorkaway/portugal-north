import type { Messages } from "@/i18n/types";

export const en: Messages = {
  site: { name: "Portugal by Train" },
  lang: {
    label: "Language",
    en: "English",
    pt: "Português",
    es: "Español",
    gl: "Galego",
    ca: "Català",
  },
  nav: {
    allStations: "All stations",
    backToStations: "Back to stations",
    returnHome: "Return to Home",
    home: "Home",
    rankings: "Rankings",
    tickets: "Tickets",
    map: "Map",
    mobile: "Mobile navigation",
    main: "Main navigation",
  },
  home: {
    heroSubtitle:
      "Major CP stations from the Minho to the Algarve, with budget hotels within walking distance.",
    searchLabel: "Search station or line",
    searchPlaceholder: "Search station or line...",
    filtersLabel: "Filter stations",
    sortByDistance: "Sort by distance",
    sortedByDistance: "Sorted by distance",
    locating: "Locating...",
    yourVotes: "Your votes:",
    upvoted: "Upvoted",
    downvoted: "Downvoted",
    notVoted: "Not voted yet",
    yourVisits: "Your visits:",
    visited: "Visited",
    notVisitedYet: "Not visited yet",
    stationCount_one: "{{count}} station",
    stationCount_other: "{{count}} stations",
    sortedByDistanceNote: " · Sorted by distance from you",
    topCommunityPicks: " · Top community picks first",
    locationDenied: " · Location access denied",
    locationBlocked: "Location blocked",
    locationUnsupported: " · Location not supported in this browser",
    locationError: " · Could not get your location",
    bookingHint:
      ' · Click "More on Booking" to find reasonably priced rooms within 2 km',
    noResults: "No stations match your search.",
  },
  station: {
    stationPhotoAlt: "{{name}} train station",
    budgetStays: "Budget stays nearby",
    hotelsIntro:
      "Upvote or downvote hotels you have tried, or suggest if a listing may be closed. Your feedback is saved in this browser.",
    noHotels: "No recommended hotels listed for this station yet.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    tripHistorian: "TripHistorian",
    metroDoPorto: "Metro do Porto",
    metroLisboa: "Metropolitano de Lisboa",
    searchBooking: "Search hotels on Booking",
    moreOnBooking: "More on Booking",
    stationPage: "Station page",
    kmFromStation: "{{km}} km from station",
    priceStartsAt: "Prices start at €{{price}}",
    priceFromCompact: "€{{price}}+",
    viewOnBooking: "View on Booking",
    suggestClosed: "Suggest hotel may be closed",
    suggestedClosed: "You suggested this hotel may be closed",
    away: "{{distance}} away",
    longDistanceNearby: "Nearest long-distance stops",
    longDistanceIntro:
      "This stop has regional or urban service only. For Alfa Pendular or Intercidades trains, try these nearby stations:",
    yesimTitle: "Travel eSIM for the airport",
    yesimBody:
      "Land with mobile data ready — useful for maps, ride apps, and messages before you reach the city centre.",
    yesimCta: "Get a Yesim eSIM",
    yesimNote: "Partner link · opens Yesim in a new tab",
    reliabilityTitle: "Reliability score",
    reliabilityBody:
      "Based on cumulative delays from our live departure samples across the network.",
    reliabilityScale: "10 = fewest delays in our data · 1 = most delays",
    reliabilityLoading: "Loading reliability score…",
  },
  departures: {
    title: "Next departures",
    refresh: "Refresh",
    unavailable: "Live departures are temporarily unavailable",
    none: "No upcoming departures found for the next few hours.",
    train: "train",
    platform: "platform",
    delayMin: "+{{minutes}} min",
    take: "Take",
    taking: "Taking",
    leavesIn: "in {{minutes}} min",
    leavesInHours: "in {{hours}}h {{minutes}}m",
    leavesInHoursOnly: "in {{hours}}h",
    leavingNow: "departing now",
    loadMore: "Show more trains",
    loadingMore: "Loading…",
  },
  rankings: {
    title: "Community rankings",
    subtitle:
      "Visitor votes for stations and hotels, plus station reliability from live CP delay data across Portugal",
    intro:
      "Rankings come from thumbs up and down on station cards and on hotel lists at each station page.",
    communityTitle: "Community rankings",
    communityTeaser: "Top stations by global votes. See hotel rankings on the full page.",
    fullPage: "Full rankings page",
    viewFull: "View full community rankings",
    loading: "Loading community votes...",
    unavailableTitle: "Community ratings unavailable",
    unavailableDetail: "Votes on station and hotel cards are still saved in your browser. Global totals require the Vercel API route and a Blob store on this project.",
    unavailableHint: "",
    retrying: "Retrying...",
    tryAgain: "Try again",
    noVotesYet:
      "No community votes recorded yet. Vote on stations and hotels across the site to help build the rankings.",
    stationRankings: "Station rankings",
    hotelRankings: "Hotel rankings",
    hotelLeaderboard:
      "One national leaderboard for every recommended hotel, no matter which station it serves.",
    noStationVotes: "No station votes yet.",
    noHotelVotes: "No hotel votes yet.",
    voteTotalsStations:
      "{{up}} upvotes and {{down}} downvotes across {{items}} stations.",
    voteTotalsHotels: "{{up}} upvotes and {{down}} downvotes across {{items}} hotels.",
    topUpvoted: "Top upvoted",
    mostDownvoted: "Most downvoted",
    noStationUpvotes: "No upvotes yet. Vote on a station card to get started.",
    noStationDownvotes: "No downvotes yet.",
    noHotelUpvotes: "No upvotes yet. Vote on a station page to rate hotels.",
    noHotelDownvotes: "No downvotes yet.",
    cachedFallback:
      "Community rankings are temporarily unavailable — showing saved totals from your last visit.",
    cachedFallbackOffline:
      "You're offline — showing community rankings saved from your last visit. New votes on this device will sync when you're back online.",
    deviceFallback:
      "Community rankings are temporarily unavailable — showing totals from your votes on this device only.",
    deviceFallbackOffline:
      "You're offline — showing rankings from your votes on this device only.",
    buildInfo: "Build {{buildNumber}}",
    reliabilityRankings: "Reliability rankings",
    reliabilityIntro:
      "Based on cumulative delays from our live CP departure samples. 10 means fewest delays in our data; 1 means most.",
    reliabilityLoading: "Loading reliability rankings…",
    reliabilityUnavailable: "Reliability rankings are temporarily unavailable.",
    noReliabilityData: "No reliability data yet.",
    mostReliable: "Top 10 most reliable",
    leastReliable: "Top 10 least reliable",
    downloadReliabilityCsv: "Download CSV",
  },
  map: {
    title: "Station activity map",
    subtitle: "H3 hexes sized by sampled departures and arrivals across mainland Portugal",
    intro:
      "Each hex is an H3 cell around a station in our list. Busier stations (more departures and arrivals in our CP samples) use larger hexes at resolution 5; quieter ones use smaller hexes at resolution 9, with resolution 7 in between.",
    loading: "Loading map…",
    unavailable: "Station activity data is temporarily unavailable.",
    legendTitle: "Hex size",
    legendBusy: "Busiest (H3 res. 5)",
    legendMid: "Mid traffic (H3 res. 7)",
    legendQuiet: "Quietest (H3 res. 9)",
    tooltipMovements: "{{count}} departures + arrivals (sampled)",
    tooltipResolution: "H3 resolution {{resolution}}",
    viewStation: "View station",
    downloadGeoJson: "Download GeoJSON",
    legendAirports: "International airports",
    airportLis: "Lisbon Humberto Delgado",
    airportPorto: "Porto Francisco Sá Carneiro",
    airportFaro: "Faro",
  },
  tickets: {
    title: "Tickets & prices",
    subtitle: "CP trains, Porto Andante, Lisbon navegante®, and what affects fares",
    howToBuyTitle: "How to buy tickets",
    howToBuyIntro:
      "Most visitors buy CP tickets online or at stations. For busy routes and peak times, buying earlier is usually safer.",
    buyOnlineTitle: "Website",
    buyOnlineBody:
      "Use CP’s official site to search routes, compare departures, and buy tickets with a card. You’ll typically get a PDF/QR to show on board.",
    buyOnlineLink: "Open CP website",
    buyInAppTitle: "Mobile app",
    buyInAppBody:
      "CP’s app is convenient for last-minute changes and keeping tickets on your phone. If you have issues, try the website or a station desk.",
    buyInAppIos: "iPhone / iPad",
    buyInAppAndroid: "Android",
    buyAtStationTitle: "At the station",
    buyAtStationBody:
      "Major stations have ticket desks and often machines. Smaller stops may have limited hours, so don’t assume you can always buy on arrival.",
    buyOnboardNote:
      "For many trains other than AP, you can often buy on board — but rules and availability vary, so try to buy before boarding when you can.",
    pricesTitle: "Price overview (rough)",
    pricesIntro:
      "Prices vary by route length, service type, time of day, and availability. These are typical patterns rather than guarantees.",
    serviceTypesTitle: "Service types",
    serviceAP: "AP (Alfa Pendular): fastest on main corridors; often pricier.",
    serviceIC: "IC (Intercidades): intercity; usually a bit cheaper than AP.",
    serviceR: "R (Regional): slower; generally cheaper and stops more.",
    serviceU: "U (Urban): commuter trains around Lisbon/Porto; short hops.",
    moneySavingTitle: "Ways to pay less",
    tipAdvance: "Book earlier when you can (especially AP/IC on popular routes).",
    tipFlexibility: "Be flexible with time/day — small shifts can change price/availability.",
    tipRailPass: "If you’re doing many long rides, compare against rail passes (when applicable).",
    tipUrban: "For short city hops, Urban/Regional tickets can be the best value.",
    disclaimer:
      "This is a practical overview, not official pricing. Always confirm current fares and rules on CP before you travel.",
    metroTitle: "Metro & local transit (Porto & Lisbon)",
    metroIntro:
      "City metros use separate tickets from CP trains. Both Porto and Lisbon use zone-based fares — what you pay depends on how many zones you cross, not the line colour alone.",
    metroCombineNote:
      "A CP ticket does not include metro rides. Use Andante or navegante® for the metro leg unless CP sells an explicit combined product for your trip.",
    metroPortoTitle: "Porto: Andante",
    metroPortoBody:
      "Andante covers Metro do Porto, STCP buses, and other operators in the Porto metropolitan area. Get a rechargeable card at metro stations or Lojas Andante, then load single trips, day passes, or monthly titles.",
    metroPortoZones:
      "Fares follow zones (Z1–Z8 on the metropolitan map). One zone is the cheapest; airport, Matosinhos, and Póvoa de Varzim trips often cross more zones.",
    metroPortoTips:
      "Validate at the gates when you enter. Occasional paper tickets exist, but the card is easier if you make several rides in a day.",
    metroPortoAndanteLink: "Andante card info",
    metroPortoTariffsLink: "Metro do Porto fares",
    metroLisboaTitle: "Lisbon: navegante®",
    metroLisboaBody:
      "Metropolitano de Lisboa shares the navegante® system with Carris (buses/trams), Fertagus, and other operators in the Lisbon metropolitan area.",
    metroLisboaZones:
      "Titles are sold by zone rings (e.g. Navegante Municipal for the city core, Metropolitano for wider rings). Airport, Amadora, and Odivelas often need a larger pass than a short hop in Baixa.",
    metroLisboaTips:
      "Load occasional trips or day passes at station machines; personalised cards are available at major stations (navegante® na Hora).",
    metroLisboaNaveganteLink: "navegante®",
    metroLisboaTariffsLink: "Metropolitano de Lisboa fares",
    metroDisclaimer:
      "Zone maps and prices change. Check the official operator sites before you travel.",
  },
  pwa: {
    votesPendingSync:
      "{{count}} vote(s) saved on this device — will sync when you are back online.",
    votesSyncing: "Syncing your saved votes…",
    permissionsTitle: "Get more from the app",
    permissionsBody:
      "You installed Portugal by Train — enable these optional features for a better experience:",
    permissionsLocation: "Location — sort stations by distance from you on the home page.",
    permissionsNotifications:
      "Notifications — we can alert you about trip ideas and updates (only if we add them later).",
    permissionsEnable: "Enable",
    permissionsEnabling: "Opening settings…",
    permissionsNotNow: "Not now",
  },
  visited: {
    markVisited: "Mark {{subject}} as visited",
    markNotVisited: "Mark {{subject}} as not visited",
    visited: "Visited",
    notVisited: "Not visited",
  },
  vote: {
    yourVoteOn: "Your vote on {{subject}}",
    upvote: "Upvote {{subject}}",
    downvote: "Downvote {{subject}}",
    removeUpvote: "Remove your upvote",
    removeDownvote: "Remove your downvote",
    upvoteOnlyYou: "Upvote (only you can see this)",
    downvoteOnlyYou: "Downvote (only you can see this)",
  },
  imageVote: {
    question: "Does this photo represent {{name}}?",
    goodPhoto: "Good photo",
    goodShort: "Good",
    badPhoto: "Doesn't represent station",
    badShort: "Not representative",
    rateLabel: "Rate whether the station photo is representative",
    browserNote:
      "Your choice is remembered in this browser. Community totals are stored on our server to help pick better images.",
    community: "Community: {{summary}}",
    goodPhotos_one: "{{count}} good photo",
    goodPhotos_other: "{{count}} good photos",
    notRepresentative_one: "{{count}} not representative",
    notRepresentative_other: "{{count}} not representative",
  },
  footer: {
    title: "Ride the rails of Portugal",
    subtitle:
      "From the misty Douro Valley to the Atlantic coast, with key stops and a place to sleep nearby.",
    disclaimer: "We do not recommend these hotels, but if you do, we want to know.",
    alsoFromUs: "Also from us",
    climaTitle: "Clima Ibérico",
    climaDesc:
      "Weather and meteorological alerts across Spain and Portugal. Check conditions before you travel.",
    mapaTitle: "Map Your Travel",
    mapaDesc:
      "GetMapa's iPhone app tracks the places you visit and builds a personal travel map from your trips and photos.",
    portuGuessTitle: "PortuGuess",
    portuGuessDesc:
      "Learn European Portuguese with quizzes, word lists, and offline apps for iOS and Android.",
    privacy: "Privacy policy",
    stationMap: "Station activity map",
  },
  notFound: {
    title: "404",
    message: "Oops! Page not found",
    home: "Return to Home",
  },
  meta: {
    siteName: "Portugal by Train",
    home: {
      title: "Portugal by Train: Stations & Budget Hotels",
      description:
        "Discover major train stations across Portugal, from the Minho to the Algarve, with line info and recommended budget hotels within walking distance.",
    },
    rankings: {
      title: "Community Rankings | Portugal by Train",
      description:
        "See which CP train stations and budget hotels visitors rate highest and lowest across Portugal.",
      ogDescription: "Community rankings for CP stations and budget hotels across Portugal.",
    },
    tickets: {
      title: "Tickets & Prices | Portugal by Train",
      description:
        "How to buy CP train tickets, Porto Andante and Lisbon navegante® metro passes, and what affects fares (zones, service type, booking time).",
      ogDescription:
        "CP tickets plus Andante and navegante® zone fares for Porto and Lisbon metros.",
    },
    map: {
      title: "Station Activity Map | Portugal by Train",
      description:
        "Interactive map of CP stations in mainland Portugal with H3 hexes sized by sampled departures and arrivals.",
      ogDescription:
        "See which CP stations are busiest in our live departure samples, on an H3 hex map of Portugal.",
    },
    privacy: {
      title: "Privacy Policy | Portugal by Train",
      description:
        "How verystays.com stores votes, browser preferences, optional location, analytics, and live departure lookups.",
      ogDescription:
        "What Portugal by Train collects when you vote, filter stations, or use live CP departures.",
    },
    notFound: {
      title: "Page Not Found | Portugal by Train",
      description:
        "The page you were looking for could not be found. Return to the homepage to explore train stations across Portugal.",
    },
    stationTitle: "{{name}} Train Station — Hotels & Lines | {{site}}",
    stationDescription: "{{services}} at {{name}} ({{lines}}). {{stays}}",
    stationOgWithHotels:
      "{{name}} ({{lines}}): {{services}}. Stays from €{{price}}/night — {{names}}{{more}}.",
    stationOgNoHotels:
      "{{name}}: {{services}} on {{lines}}. Explore maps and vote on this station.",
    stationOgExplore: "Explore maps and vote on this station.",
    cpNetwork: "CP network",
    cpTrains: "CP trains",
    mapsVotes: "Maps, community votes, and station details.",
    budgetStay_one: "1 budget stay",
    budgetStay_other: "{{count}} budget stays",
    fromPerNight: "from €{{price}}/night within 2 km, plus maps and community votes.",
    andMore: " and {{count}} more",
  },
};
