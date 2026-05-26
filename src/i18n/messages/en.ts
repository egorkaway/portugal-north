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
  },
  home: {
    heroSubtitle:
      "Major CP stations from the Minho to the Algarve, with budget hotels within walking distance.",
    searchLabel: "Search station or line",
    searchPlaceholder: "Search station or line...",
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
      ' · Click "More on Booking" to find the 3 cheapest rooms within 2 km',
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
    searchBooking: "Search hotels on Booking",
    moreOnBooking: "More on Booking",
    stationPage: "Station page",
    kmFromStation: "{{km}} km from station",
    eurosPerNightFrom: " euros per night from",
    viewOnBooking: "View on Booking",
    suggestClosed: "Suggest hotel may be closed",
    suggestedClosed: "You suggested this hotel may be closed",
    away: "{{distance}} away",
  },
  departures: {
    title: "Next departures",
    refresh: "Refresh",
    unavailable: "Live departures are temporarily unavailable",
    none: "No upcoming departures found for the next few hours.",
    train: "train",
    platform: "platform",
    delayMin: "+{{minutes}} min",
  },
  rankings: {
    title: "Community rankings",
    subtitle: "Stations and hotels ranked by visitor votes across Portugal",
    intro:
      "Rankings come from thumbs up and down on station cards and on hotel lists at each station page. If vote storage is misconfigured, the error below explains what went wrong.",
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
    offlineCached:
      "Offline — showing community rankings saved from your last visit. New votes on this device will sync when you are back online.",
    offlineDevice:
      "Offline — showing rankings from your votes on this device only.",
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
