import type { Messages } from "@/i18n/types";

export const pt: Messages = {
  site: { name: "Portugal de Comboio" },
  lang: {
    label: "Idioma",
    en: "English",
    pt: "Português",
    es: "Español",
    gl: "Galego",
    ca: "Català",
  },
  nav: {
    allStations: "Todas as estações",
    backToStations: "Voltar às estações",
    returnHome: "Voltar ao início",
    home: "Início",
    rankings: "Rankings",
    tickets: "Bilhetes",
    map: "Mapa",
    mobile: "Navegação móvel",
    main: "Navegação principal",
  },
  home: {
    heroSubtitle:
      "Principais estações da CP do Minho ao Algarve, com hotéis com preços acessíveis a poucos minutos a pé.",
    searchLabel: "Pesquisar estação ou linha",
    searchPlaceholder: "Pesquisar estação ou linha...",
    filtersLabel: "Filtrar estações",
    sortByDistance: "Ordenar por distância",
    sortedByDistance: "Ordenado por distância",
    locating: "A localizar...",
    yourVotes: "Os seus votos:",
    upvoted: "Com voto positivo",
    downvoted: "Com voto negativo",
    notVoted: "Sem voto",
    yourVisits: "As suas visitas:",
    visited: "Visitada",
    notVisitedYet: "Ainda não visitada",
    stationCount_one: "{{count}} estação",
    stationCount_other: "{{count}} estações",
    sortedByDistanceNote: " · Ordenado pela sua distância",
    topCommunityPicks: " · Melhores da comunidade primeiro",
    locationDenied: " · Acesso à localização negado",
    locationBlocked: "Localização bloqueada",
    locationUnsupported: " · Localização não suportada neste browser",
    locationError: " · Não foi possível obter a sua localização",
    bookingHint:
      ' · Clique em "Mais no Booking" para ver estadias com preços acessíveis num raio de 2 km',
    noResults: "Nenhuma estação corresponde à pesquisa.",
  },
  station: {
    stationPhotoAlt: "Estação de comboio de {{name}}",
    budgetStays: "Estadias com preços acessíveis perto",
    hotelsIntro:
      "Vote a favor ou contra hotéis que conhece, ou indique se um alojamento pode estar encerrado. O feedback fica guardado neste browser.",
    noHotels: "Ainda não há hotéis recomendados para esta estação.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    tripHistorian: "TripHistorian",
    metroDoPorto: "Metro do Porto",
    metroLisboa: "Metropolitano de Lisboa",
    searchBooking: "Procurar hotéis no Booking",
    moreOnBooking: "Mais no Booking",
    stationPage: "Página da estação",
    kmFromStation: "{{km}} km da estação",
    priceStartsAt: "Preços desde {{price}} €",
    priceFromCompact: "€{{price}}+",
    viewOnBooking: "Ver no Booking",
    suggestClosed: "Sugerir que o hotel pode estar encerrado",
    suggestedClosed: "Sugeriu que este hotel pode estar encerrado",
    away: "a {{distance}}",
    longDistanceNearby: "Paragens de longa distância mais próximas",
    longDistanceIntro:
      "Esta paragem tem apenas serviço regional ou urbano. Para comboios Alfa Pendular ou Intercidades, experimente estas estações:",
    yesimTitle: "eSIM de viagem para o aeroporto",
    yesimBody:
      "Chegue com dados móveis ativos — útil para mapas, apps de transporte e mensagens antes de chegar ao centro.",
    yesimCta: "Obter eSIM Yesim",
    yesimNote: "Ligação de parceiro · abre a Yesim num novo separador",
    reliabilityTitle: "Pontuação de fiabilidade",
    reliabilityBody:
      "Com base nos atrasos acumulados das nossas amostras de partidas em tempo real na rede.",
    reliabilityScale: "10 = menos atrasos nos nossos dados · 1 = mais atrasos",
    reliabilityLoading: "A carregar pontuação de fiabilidade…",
  },
  departures: {
    title: "Próximas partidas",
    refresh: "Atualizar",
    unavailable: "Partidas em direto temporariamente indisponíveis",
    none: "Sem partidas nas próximas horas.",
    train: "comboio",
    platform: "plataforma",
    delayMin: "+{{minutes}} min",
    take: "Vou apanhar",
    taking: "A apanhar",
    leavesIn: "em {{minutes}} min",
    leavesInHours: "em {{hours}}h {{minutes}}m",
    leavesInHoursOnly: "em {{hours}}h",
    leavingNow: "a sair agora",
    loadMore: "Mostrar mais comboios",
    loadingMore: "A carregar…",
  },
  rankings: {
    title: "Rankings da comunidade",
    subtitle:
      "Votos da comunidade em estações e hotéis, mais fiabilidade das estações com base em atrasos CP em tempo real em Portugal",
    intro:
      "Os rankings vêm dos votos nas estações e nas listas de hotéis de cada página.",
    communityTitle: "Rankings da comunidade",
    communityTeaser: "Melhores estações por votos globais. Veja hotéis na página completa.",
    fullPage: "Página completa de rankings",
    viewFull: "Ver rankings completos da comunidade",
    loading: "A carregar votos da comunidade...",
    unavailableTitle: "Classificações da comunidade indisponíveis",
    unavailableDetail:
      "Os votos nos cartões continuam guardados no seu browser. Os totais globais precisam da API Vercel e de um Blob neste projeto.",
    unavailableHint: "",
    retrying: "A tentar de novo...",
    tryAgain: "Tentar novamente",
    noVotesYet:
      "Ainda não há votos da comunidade. Vote em estações e hotéis no site para construir os rankings.",
    stationRankings: "Rankings de estações",
    hotelRankings: "Rankings de hotéis",
    hotelLeaderboard:
      "Uma classificação nacional de todos os hotéis recomendados, em qualquer estação.",
    noStationVotes: "Ainda sem votos em estações.",
    noHotelVotes: "Ainda sem votos em hotéis.",
    voteTotalsStations:
      "{{up}} votos positivos e {{down}} negativos em {{items}} estações.",
    voteTotalsHotels: "{{up}} votos positivos e {{down}} negativos em {{items}} hotéis.",
    topUpvoted: "Mais votados",
    mostDownvoted: "Mais votados negativamente",
    noStationUpvotes: "Sem votos positivos. Vote num cartão de estação para começar.",
    noStationDownvotes: "Sem votos negativos.",
    noHotelUpvotes: "Sem votos positivos. Vote numa página de estação para classificar hotéis.",
    noHotelDownvotes: "Sem votos negativos.",
    cachedFallback:
      "Os rankings da comunidade estão temporariamente indisponíveis — a mostrar totais guardados da sua última visita.",
    cachedFallbackOffline:
      "Está offline — a mostrar rankings da comunidade guardados da sua última visita. Novos votos neste dispositivo serão sincronizados quando voltar a estar online.",
    deviceFallback:
      "Os rankings da comunidade estão temporariamente indisponíveis — a mostrar totais apenas dos seus votos neste dispositivo.",
    deviceFallbackOffline:
      "Está offline — a mostrar rankings apenas com os seus votos neste dispositivo.",
    buildInfo: "Build {{buildNumber}}",
    reliabilityRankings: "Rankings de fiabilidade",
    reliabilityIntro:
      "Com base nos atrasos acumulados das nossas amostras de partidas CP em tempo real. 10 = menos atrasos nos nossos dados; 1 = mais atrasos.",
    reliabilityLoading: "A carregar rankings de fiabilidade…",
    reliabilityUnavailable: "Os rankings de fiabilidade estão temporariamente indisponíveis.",
    noReliabilityData: "Ainda não há dados de fiabilidade.",
    mostReliable: "Top 10 mais fiáveis",
    leastReliable: "Top 10 menos fiáveis",
    downloadReliabilityCsv: "Descarregar CSV",
  },
  map: {
    title: "Mapa de atividade das estações",
    subtitle: "Hexágonos H3 dimensionados pelas partidas e chegadas amostradas em Portugal continental",
    intro:
      "Cada hexágono é uma célula H3 à volta de uma estação da nossa lista. Estações mais movimentadas (mais partidas e chegadas nas amostras CP) usam hexágonos maiores na resolução 5; as mais calmas usam hexágonos menores na resolução 9, com resolução 7 no meio.",
    loading: "A carregar mapa…",
    unavailable: "Os dados de atividade das estações estão temporariamente indisponíveis.",
    legendTitle: "Tamanho do hexágono",
    legendBusy: "Mais movimentada (H3 res. 5)",
    legendMid: "Tráfego médio (H3 res. 7)",
    legendQuiet: "Mais calma (H3 res. 9)",
    tooltipMovements: "{{count}} partidas + chegadas (amostradas)",
    tooltipResolution: "Resolução H3 {{resolution}}",
    viewStation: "Ver estação",
    downloadGeoJson: "Descarregar GeoJSON",
    legendAirports: "Aeroportos internacionais",
    airportLis: "Lisboa Humberto Delgado",
    airportPorto: "Porto Francisco Sá Carneiro",
    airportFaro: "Faro",
    locateMe: "Mostrar a minha localização",
  },
  tickets: {
    title: "Bilhetes e preços",
    subtitle: "CP, Andante no Porto, navegante® em Lisboa e o que influencia o preço",
    howToBuyTitle: "Como comprar bilhetes",
    howToBuyIntro:
      "A maioria das pessoas compra bilhetes online ou nas estações. Em rotas concorridas, comprar com antecedência costuma ser mais seguro.",
    buyOnlineTitle: "Website",
    buyOnlineBody:
      "Use o site oficial da CP para pesquisar trajetos e comprar com cartão. Normalmente recebe um PDF/QR para mostrar a bordo.",
    buyOnlineLink: "Abrir site da CP",
    buyInAppTitle: "App",
    buyInAppBody:
      "A app da CP é prática para alterações de última hora e para ter os bilhetes no telemóvel. Se houver problemas, tente o site ou a bilheteira.",
    buyInAppIos: "iPhone / iPad",
    buyInAppAndroid: "Android",
    buyAtStationTitle: "Na estação",
    buyAtStationBody:
      "As principais estações têm bilheteiras e muitas vezes máquinas. Em paragens pequenas pode haver horários limitados.",
    buyOnboardNote:
      "Em muitos comboios que não sejam AP, por vezes dá para comprar a bordo — mas as regras variam, por isso compre antes de embarcar sempre que possível.",
    pricesTitle: "Visão geral de preços (aproximada)",
    pricesIntro:
      "Os preços variam com a distância, o tipo de serviço, a hora/dia e a disponibilidade. Isto é um guia prático.",
    serviceTypesTitle: "Tipos de serviço",
    serviceAP: "AP (Alfa Pendular): mais rápido; muitas vezes mais caro.",
    serviceIC: "IC (Intercidades): interurbano; geralmente um pouco mais barato que AP.",
    serviceR: "R (Regional): mais lento; normalmente mais barato e com mais paragens.",
    serviceU: "U (Urbano): suburbanos (Lisboa/Porto); viagens curtas.",
    moneySavingTitle: "Como poupar",
    tipAdvance: "Compre mais cedo quando possível (sobretudo AP/IC).",
    tipFlexibility: "Seja flexível com dia/hora — pequenas mudanças podem alterar preço/disponibilidade.",
    tipRailPass: "Se fizer muitas viagens longas, compare com passes (quando aplicável).",
    tipUrban: "Para deslocações curtas, Urbano/Regional costuma ter melhor valor.",
    disclaimer:
      "Isto não é informação oficial de preços. Confirme sempre tarifas e regras atuais no site da CP.",
    metroTitle: "Metro e transportes locais (Porto e Lisboa)",
    metroIntro:
      "Os metros urbanos têm bilhetes à parte dos comboios da CP. No Porto e em Lisboa o preço depende das zonas que atravessa, não só da cor da linha.",
    metroCombineNote:
      "O bilhete da CP não inclui o metro. Use Andante ou navegante® no troço de metro, salvo produto combinado explícito da CP.",
    metroPortoTitle: "Porto: Andante",
    metroPortoBody:
      "O Andante serve o Metro do Porto, autocarros da STCP e outros operadores na Área Metropolitana do Porto. Compre o cartão recarregável nas estações de metro ou Lojas Andante e carregue viagens, passes diários ou títulos mensais.",
    metroPortoZones:
      "As tarifas seguem zonas (Z1–Z8 no mapa metropolitano). Uma zona é o mínimo; aeroporto, Matosinhos e Póvoa de Varzim costumam passar mais zonas.",
    metroPortoTips:
      "Valide nas catracas à entrada. Há bilhetes ocasionais em papel, mas o cartão é mais prático para várias viagens no mesmo dia.",
    metroPortoAndanteLink: "Informação Andante",
    metroPortoTariffsLink: "Tarifários Metro do Porto",
    metroLisboaTitle: "Lisboa: navegante®",
    metroLisboaBody:
      "O Metropolitano de Lisboa usa o sistema navegante® com a Carris (autocarros/elétricos), Fertagus e outros operadores na Área Metropolitana de Lisboa.",
    metroLisboaZones:
      "Os títulos vendem-se por anéis de zonas (ex.: Navegante Municipal no núcleo urbano, Metropolitano para anéis mais largos). Aeroporto, Amadora e Odivelas muitas vezes exigem um passe maior que um salto na Baixa.",
    metroLisboaTips:
      "Carregue viagens ocasionais ou passes diários nas máquinas; cartões personalizados estão disponíveis nas estações principais (navegante® na Hora).",
    metroLisboaNaveganteLink: "navegante®",
    metroLisboaTariffsLink: "Tarifários Metropolitano de Lisboa",
    metroDisclaimer:
      "Mapas de zonas e preços mudam. Confirme nos sites oficiais antes de viajar.",
  },
  pwa: {
    votesPendingSync:
      "{{count}} voto(s) guardado(s) neste dispositivo — serão sincronizados quando voltar a estar online.",
    votesSyncing: "A sincronizar os seus votos guardados…",
    permissionsTitle: "Tire mais partido da app",
    permissionsBody:
      "Instalou o Portugal by Train — ative estas funcionalidades opcionais para uma melhor experiência:",
    permissionsLocation:
      "Localização — ordenar estações por distância na página inicial.",
    permissionsNotifications:
      "Notificações — para avisos sobre viagens e novidades (quando estiverem disponíveis).",
    permissionsEnable: "Ativar",
    permissionsEnabling: "A abrir definições…",
    permissionsNotNow: "Agora não",
  },
  visited: {
    markVisited: "Marcar {{subject}} como visitada",
    markNotVisited: "Marcar {{subject}} como não visitada",
    visited: "Visitada",
    notVisited: "Não visitada",
  },
  vote: {
    yourVoteOn: "O seu voto em {{subject}}",
    upvote: "Voto positivo em {{subject}}",
    downvote: "Voto negativo em {{subject}}",
    removeUpvote: "Remover voto positivo",
    removeDownvote: "Remover voto negativo",
    upvoteOnlyYou: "Voto positivo (só você vê)",
    downvoteOnlyYou: "Voto negativo (só você vê)",
  },
  imageVote: {
    question: "Esta foto representa {{name}}?",
    goodPhoto: "Boa foto",
    goodShort: "Boa",
    badPhoto: "Não representa a estação",
    badShort: "Não representa",
    rateLabel: "Avaliar se a foto representa a estação",
    browserNote:
      "A sua escolha fica neste browser. Os totais da comunidade ajudam a escolher melhores imagens.",
    community: "Comunidade: {{summary}}",
    goodPhotos_one: "{{count}} boa foto",
    goodPhotos_other: "{{count}} boas fotos",
    notRepresentative_one: "{{count}} não representativa",
    notRepresentative_other: "{{count}} não representativas",
  },
  footer: {
    title: "Pelos carris de Portugal",
    subtitle:
      "Do Douro enevoado à costa atlântica, com paragens-chave e um sítio para dormir perto.",
    disclaimer: "Não recomendamos estes hotéis, mas se gostar, queremos saber.",
    alsoFromUs: "Também nossos",
    climaTitle: "Clima Ibérico",
    climaDesc:
      "Meteorologia e alertas em Espanha e Portugal. Confira as condições antes de viajar.",
    mapaTitle: "Map Your Travel",
    mapaDesc:
      "A app GetMapa para iPhone regista os sítios que visita e cria um mapa de viagem a partir das fotos.",
    portuGuessTitle: "PortuGuess",
    portuGuessDesc:
      "Aprenda português europeu com quizzes, listas de palavras e apps offline para iOS e Android.",
    privacy: "Política de privacidade",
    stationMap: "Mapa de atividade das estações",
  },
  notFound: {
    title: "404",
    message: "Ups! Página não encontrada",
    home: "Voltar ao início",
  },
  meta: {
    siteName: "Portugal de Comboio",
    home: {
      title: "Portugal de Comboio: Estações e Hotéis com Preços Acessíveis",
      description:
        "Descubra estações da CP de Portugal, do Minho ao Algarve, com linhas e hotéis com preços acessíveis a poucos minutos a pé.",
    },
    rankings: {
      title: "Rankings da Comunidade | Portugal de Comboio",
      description:
        "Veja que estações CP e hotéis os visitantes mais gostam ou menos gostam em Portugal.",
      ogDescription: "Rankings da comunidade para estações CP e hotéis com preços acessíveis em Portugal.",
    },
    tickets: {
      title: "Bilhetes e Preços | Portugal de Comboio",
      description:
        "Como comprar bilhetes CP, passes Andante e navegante® nos metros do Porto e Lisboa, e o que influencia as tarifas.",
      ogDescription:
        "Bilhetes CP, zonas Andante e navegante® nos metros do Porto e de Lisboa.",
    },
    map: {
      title: "Mapa de Atividade | Portugal de Comboio",
      description:
        "Mapa interativo das estações CP em Portugal continental com hexágonos H3 dimensionados por partidas e chegadas amostradas.",
      ogDescription:
        "Veja quais estações CP são mais movimentadas nas nossas amostras de partidas, num mapa H3 de Portugal.",
    },
    privacy: {
      title: "Política de Privacidade | Portugal de Comboio",
      description:
        "Como o verystays.com guarda votos, preferências do browser, localização opcional, analytics e consultas de partidas.",
      ogDescription:
        "O que o Portugal de Comboio recolhe quando vota, filtra estações ou usa partidas CP em direto.",
    },
    notFound: {
      title: "Página não encontrada | Portugal de Comboio",
      description:
        "A página que procurava não existe. Volte ao início para explorar estações de comboio em Portugal.",
    },
    stationTitle: "Estação de {{name}} — Hotéis e Linhas | {{site}}",
    stationDescription: "{{services}} em {{name}} ({{lines}}). {{stays}}",
    stationOgWithHotels:
      "{{name}} ({{lines}}): {{services}}. Estadias desde {{price}} €/noite — {{names}}{{more}}.",
    stationOgNoHotels:
      "{{name}}: {{services}} na {{lines}}. Explore mapas e vote nesta estação.",
    stationOgExplore: "Explore mapas e vote nesta estação.",
    cpNetwork: "rede CP",
    cpTrains: "comboios CP",
    mapsVotes: "Mapas, votos da comunidade e detalhes da estação.",
    budgetStay_one: "1 estadia com preço acessível",
    budgetStay_other: "{{count}} estadias com preços acessíveis",
    fromPerNight: "desde {{price}} €/noite num raio de 2 km, mais mapas e votos.",
    andMore: " e mais {{count}}",
  },
};
