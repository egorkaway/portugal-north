import type { Messages } from "@/i18n/types";

export const pt: Messages = {
  site: { name: "Mobilidade Ibérica" },
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
    trip: "Viagem",
    lines: "Linhas",
    mobile: "Navegação móvel",
    main: "Navegação principal",
  },
  country: {
    label: "País",
    stationsIn: "Mostrar estações em",
    pt: "Portugal",
    es: "Espanha",
  },
  home: {
    heroSubtitle:
      "Estações de comboio e aeroportos em Portugal, do Minho ao Algarve, com linhas e hotéis com preços acessíveis perto.",
    heroSubtitleEs:
      "Estações de comboio e aeroportos na Espanha peninsular, com linhas e hotéis com preços acessíveis perto.",
    heroSubtitleAll:
      "Estações de comboio e aeroportos em Portugal e Espanha, com linhas e hotéis com preços acessíveis perto.",
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
    stationCount_one: "{{count}} estação e aeroporto",
    stationCount_other: "{{count}} estações e aeroportos",
    sortedByDistanceNote: " · Ordenado pela sua distância",
    topCommunityPicks: " · Melhores da comunidade primeiro",
    locationDenied: " · Acesso à localização negado",
    locationBlocked: "Localização bloqueada",
    locationUnsupported: " · Localização não suportada neste browser",
    locationError: " · Não foi possível obter a sua localização",
    bookingHint:
      ' · Clique em "Mais no Booking" para ver estadias com preços acessíveis num raio de 2 km',
    noResults: "Nenhuma estação corresponde à pesquisa.",
    switchingCountry: "A carregar estações…",
    showingRange: " · A mostrar {{from}}–{{to}} de {{total}}",
    paginationLabel: "Páginas da lista de estações",
    pageOf: "Página {{current}} de {{total}}",
    previousPage: "Anterior",
    nextPage: "Seguinte",
  },
  station: {
    stationPhotoAlt: "Estação de comboio de {{name}}",
    stationPhotoAltBy: "Fotografia de {{name}} por {{author}}",
    photoCreditBy: "Fotografia de {{author}}",
    budgetStays: "Estadias com preços acessíveis perto",
    hotelsIntro:
      "Vote a favor ou contra hotéis que conhece, ou indique se um alojamento pode estar encerrado. O feedback fica guardado neste browser.",
    noHotels: "Ainda não há hotéis recomendados para esta estação.",
    appleMaps: "Apple Maps",
    openStreetMap: "OpenStreetMap",
    downloadAreaMap: "Descarregar mapa da zona",
    areaMapAlt: "Mapa da zona de {{name}}",
    airportConnectionsTitle: "Ligações aéreas",
    airportConnectionsIntro:
      "{{destinations}} destinos com voos diretos na nossa última amostra de partidas.",
    airportConnectionsLegend:
      "As cores das linhas mostram a frequência de cada rota na amostra:",
    airportConnectionsLegendBusy: "5+ voos",
    airportConnectionsLegendModerate: "3–4 voos",
    airportConnectionsLegendLight: "1–2 voos",
    airportConnectionsMapAlt: "Mapa de ligações aéreas a partir de {{name}}",
    downloadConnectionsMap: "Descarregar mapa de ligações",
    airportConnectionsFlights_one: "{{count}} voo",
    airportConnectionsFlights_other: "{{count}} voos",
    berrymetWeather: "Tempo em {{city}}",
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
    nearestStationsNearby: "Estações mais próximas",
    nearestStationsIntro: "Outras paragens perto desta estação no mapa.",
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
  lines: {
    title: "Linhas ferroviárias",
    subtitle: "Todas as linhas nos nossos dados, as estações de cada uma e que comboios param",
    intro:
      "Explore as linhas ferroviárias de Portugal — e ainda as linhas transfronteiriças e de metro dos nossos dados. Cada linha mostra as suas estações com os serviços que aí param.",
    backToLines: "Voltar às linhas",
    portugalHeading: "Linhas ferroviárias de Portugal",
    spainHeading: "Linhas transfronteiriças e de Espanha",
    metroHeading: "Linhas de metro",
    stationCount_one: "{{count}} estação",
    stationCount_other: "{{count}} estações",
    lineCount_one: "{{count}} linha",
    lineCount_other: "{{count}} linhas",
    servicesLabel: "Serviços",
    historicBadge: "Histórica",
    orderingNote:
      "As estações estão listadas por ordem geográfica aproximada ao longo da linha, não pela sequência oficial de paragens.",
    servicesNote:
      "Os tipos de serviço são os registados para cada estação nos nossos dados e podem não refletir todos os comboios em todos os dias.",
    stationsHeading: "Estações desta linha",
    alsoOn: "Também em",
    noServiceData: "Sem dados de tipo de serviço",
    emptyLine: "Ainda não há estações registadas nesta linha.",
    viewAllLines: "Ver todas as linhas",
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
  trip: {
    title: "Viagem",
    subtitle: "Contagem decrescente e atrasos em direto do comboio que vai apanhar.",
    emptyTitle: "Sem viagem ativa",
    emptyBody:
      "Abra uma página de estação, toque em Apanhar numa partida e a viagem aparecerá aqui com contagens em direto.",
    departureCountdown: "Contagem para a partida",
    departed: "Partiu",
    departedAt: "Partiu às {{time}}",
    expectedDeparture: "Partida prevista às {{time}}",
    minutesAgo: "há {{minutes}} min",
    minutesAgoHours: "há {{hours}}h {{minutes}}m",
    minutesAgoHoursOnly: "há {{hours}}h",
    upcomingStops: "Próximas paragens",
    loadingStops: "A carregar paragens da rota…",
    stopsUnavailable: "As paragens seguintes estão temporariamente indisponíveis para este comboio.",
    stopTracking: "Parar de acompanhar",
    departureAt: "Parte às {{time}}",
    arrivalAt: "Chega às {{time}}",
    arrivesIn: "em {{minutes}} min",
    arrivesInHours: "em {{hours}}h {{minutes}}m",
    arrivesInHoursOnly: "em {{hours}}h",
    arrivingNow: "a chegar agora",
    historyTitle: "Comboios apanhados",
    historyEmpty: "Ainda não há viagens guardadas.",
    historyOriginLink: "Ver estação de origem",
    historyFinalLink: "Ver estação final",
    historyDelete: "Apagar",
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
    downloadStationCsv: "Descarregar CSV",
  },
  map: {
    title: "Mapa de atividade das estações",
    subtitle: "Hexágonos H3 dimensionados pelas partidas e chegadas amostradas em Portugal continental",
    intro:
      "Cada hexágono é uma célula H3 à volta de uma estação da nossa lista. As mais movimentadas e as de tráfego médio partilham hexágonos na resolução 7 (verde vs azul); as mais calmas usam hexágonos menores na resolução 9.",
    loading: "A carregar mapa…",
    unavailable: "Os dados de atividade das estações estão temporariamente indisponíveis.",
    legendTitle: "Atividade do hexágono",
    legendBusy: "Mais movimentada (H3 res. 7)",
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
    airportMad: "Madrid-Barajas",
    airportBarcelona: "Barcelona-El Prat",
    airportMalaga: "Málaga-Costa del Sol",
    airportAlicante: "Alicante-Elche",
    airportValencia: "Valência",
    airportSeville: "Sevilha",
    airportBilbao: "Bilbau",
    airportSantiago: "Santiago de Compostela",
    airportVigo: "Vigo",
    airportAsturias: "Astúrias",
    locateMe: "Mostrar a minha localização",
    overviewTitle: "Descarregar mapas de visão geral de Portugal",
    overviewIntro:
      "Mapas estáticos focados no continente português. O mapa de atividade corresponde à vista hexagonal acima; o de fiabilidade usa as mesmas pontuações de pontualidade da app móvel.",
    overviewActivityTitle: "Atividade das estações",
    overviewActivityAlt: "Mapa de Portugal continental com hexágonos H3 por atividade ferroviária amostrada",
    overviewActivityDownload: "Descarregar mapa de atividade",
    overviewReliabilityTitle: "Fiabilidade das estações",
    overviewReliabilityAlt:
      "Mapa de Portugal continental com estações por pontuação de pontualidade",
    overviewReliabilityDownload: "Descarregar mapa de fiabilidade",
  },
  tickets: {
    title: "Bilhetes e preços",
    subtitle: "Comboios CP e Renfe, passes de metro em Portugal e Espanha, e o que influencia o preço",
    overviewSubtitle:
      "Como comprar bilhetes de comboio e metro em Portugal e Espanha. Os preços variam consoante o tipo de serviço, a rota e a antecedência da compra.",
    overviewDisclaimer:
      "As tarifas mudam. Confirme sempre os preços atuais no site do operador ou na estação antes de viajar.",
    countryPortugal: "Portugal",
    countrySpain: "Espanha",
    portugalHowToBuyIntro:
      "Os comboios de longa distância da CP podem ser comprados online, na app da CP, nas bilheteiras ou a bordo em alguns Regionais (apenas dinheiro, sem garantia de lugar).",
    portoVigoRenfeNote:
      "Porto–Vigo (Celta): os bilhetes online vendem-se na Renfe, não na CP — não estão disponíveis no site nem na app da CP. As bilheteiras CP nas estações ainda podem vender esta rota.",
    portugalServiceAP:
      "Alfa Pendular — o serviço mais rápido nos corredores principais (Lisboa–Porto, também Faro e Braga); reserve com antecedência para melhor preço.",
    portugalServiceIC: "Intercidades — comboios interurbanos em Portugal.",
    portugalServiceR: "Regional — serviços locais e de linhas secundárias; muitas vezes sem reserva.",
    portugalServiceU: "Urbano — redes suburbanas em Lisboa e no Porto.",
    spainHowToBuyIntro:
      "A maioria dos bilhetes de longa distância vende-se na Renfe online, na app Renfe ou nas bilheteiras. As redes de suburbanos (Cercanías, Rodalies) e os metros urbanos têm bilhetes próprios — um bilhete Renfe não inclui automaticamente o metro.",
    spainServiceAVE:
      "AVE — comboios de alta velocidade nos corredores principais (ex.: Madrid–Barcelona, Madrid–Sevilha, Madrid–Galiza).",
    spainServiceAlvia: "Alvia / Intercity — comboios de longa distância fora da rede AVE.",
    spainServiceMedia: "Media Distancia — serviços regionais em linhas secundárias.",
    spainServiceCommuter:
      "Cercanías / Rodalies — suburbanos em Madrid, Barcelona e outras cidades.",
    usefulLinksTitle: "Ligações úteis",
    linkCpWebsiteTitle: "Site da CP",
    linkCpWebsiteBody: "Compre bilhetes Alfa Pendular, Intercidades e Regional online.",
    linkCpAppIosTitle: "App CP (iOS)",
    linkCpAppIosBody: "App oficial dos Comboios de Portugal para bilhetes no telemóvel.",
    linkCpAppAndroidTitle: "App CP (Android)",
    linkCpAppAndroidBody: "App oficial dos Comboios de Portugal para bilhetes no telemóvel.",
    linkAndanteTitle: "Andante (metro do Porto)",
    linkAndanteBody: "Cartão recarregável para o Metro do Porto e alguns autocarros.",
    linkMetroPortoTariffsTitle: "Tarifários Metro do Porto",
    linkMetroPortoTariffsBody: "Preços por zonas do Metro do Porto.",
    linkNaveganteTitle: "Navegante (Lisboa)",
    linkNaveganteBody:
      "Passe mensal para metro, autocarros, ferries e suburbanos em Lisboa.",
    linkMetroLisboaTariffsTitle: "Tarifários Metro de Lisboa",
    linkMetroLisboaTariffsBody: "Bilhetes avulsos e passes do Metro de Lisboa.",
    linkRenfeWebsiteTitle: "Site da Renfe",
    linkRenfeWebsiteBody: "Pesquise rotas e compre bilhetes AVE, longa distância e Media Distancia.",
    linkRenfeAppIosTitle: "App Renfe (iOS)",
    linkRenfeAppIosBody: "App oficial da Renfe para bilhetes e informação em direto.",
    linkRenfeAppAndroidTitle: "App Renfe (Android)",
    linkRenfeAppAndroidBody: "App oficial da Renfe para bilhetes e informação em direto.",
    linkCercaniasTitle: "Cercanías (suburbanos)",
    linkCercaniasBody:
      "Redes suburbanas em Madrid e outras cidades — muitas vezes com tarifas distintas do AVE.",
    linkRodaliesTitle: "Rodalies (Catalunha)",
    linkRodaliesBody: "Suburbanos em Barcelona e Girona, incluindo ligações ao aeroporto.",
    linkMetroMadridTitle: "Metro Madrid",
    linkMetroMadridBody: "Bilhetes e passes do metro de Madrid (separado da Renfe longa distância).",
    linkTmbBarcelonaTitle: "TMB (metro de Barcelona)",
    linkTmbBarcelonaBody: "Bilhetes de metro, autocarro e elétrico na área de Barcelona.",
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
      "Em muitos comboios que não sejam AP, por vezes dá para comprar a bordo — mas só em dinheiro, e as regras variam; compre antes de embarcar sempre que possível.",
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
    tipUrban: "Para deslocações curtas, Urbano/Regional costuma ter melhor valor — e cada pessoa precisa do seu cartão.",
    disclaimer:
      "Isto não é informação oficial de preços. Confirme sempre tarifas e regras atuais no site da CP.",
    metroTitle: "Metro e transportes locais (Porto e Lisboa)",
    metroIntro:
      "Os metros urbanos têm bilhetes à parte dos comboios da CP. No Porto e em Lisboa o preço depende das zonas que atravessa, não só da cor da linha.",
    metroCombineNote:
      "O bilhete da CP não inclui o metro. Use Andante ou navegante® no troço de metro, salvo produto combinado explícito da CP.",
    portugalLocalCardNote:
      "Nos comboios locais e suburbanos (e no metro), cada pessoa precisa do seu próprio cartão de viagem. Não dá para carregar bilhetes de várias pessoas no mesmo cartão quando viajam em grupo. Valide sempre o bilhete ou cartão antes de entrar — nos validadores ou nas cancelas.",
    portugalResidentPassNote:
      "Passes mais longos (muitas vezes de 30 ou 90 dias) estão por vezes reservados a residentes e podem exigir identificação local ou comprovativo de morada. Os turistas costumam só ter acesso a bilhetes ocasionais ou títulos curtos de 1 a 3 dias — confirme o que pode comprar antes de contar com um passe mensal.",
    metroPortoTitle: "Porto: Andante",
    metroPortoBody:
      "O Andante serve o Metro do Porto, autocarros da STCP e outros operadores na Área Metropolitana do Porto. Compre o cartão recarregável nas estações de metro ou Lojas Andante e carregue viagens, passes diários ou títulos mensais.",
    metroPortoZones:
      "As tarifas seguem zonas (Z1–Z8 no mapa metropolitano). Uma zona é o mínimo; aeroporto, Matosinhos e Póvoa de Varzim costumam passar mais zonas.",
    metroPortoTips:
      "Um cartão por pessoa — não partilhe um único Andante em grupo. Valide nas cancelas ou validadores à entrada.",
    metroPortoAndanteLink: "Informação Andante",
    metroPortoTariffsLink: "Tarifários Metro do Porto",
    metroLisboaTitle: "Lisboa: navegante®",
    metroLisboaBody:
      "O Metropolitano de Lisboa usa o sistema navegante® com a Carris (autocarros/elétricos), Fertagus e outros operadores na Área Metropolitana de Lisboa.",
    metroLisboaZones:
      "Os títulos vendem-se por anéis de zonas (ex.: Navegante Municipal no núcleo urbano, Metropolitano para anéis mais largos). Aeroporto, Amadora e Odivelas muitas vezes exigem um passe maior que um salto na Baixa.",
    metroLisboaTips:
      "Um cartão por pessoa — não pode colocar bilhetes de vários viajantes no mesmo navegante®. Carregue viagens nas máquinas e valide antes de viajar.",
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
      "Instalou Mobilidade Ibérica — ative estas funcionalidades opcionais para uma melhor experiência:",
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
    caminoTitle: "My Personal Camino de Santiago",
    caminoDesc:
      "App para iPhone para seguir o caminho e o seu progresso no Caminho de Santiago.",
    mapaTitle: "Map Your Travel",
    mapaDesc:
      "A app GetMapa para iPhone regista os sítios que visita e cria um mapa de viagem a partir das fotos.",
    portuGuessTitle: "PortuGuess",
    portuGuessDesc:
      "Aprenda português europeu com quizzes, listas de palavras e apps offline para iOS e Android.",
    sovnikTitle: "Sovnik",
    sovnikDesc:
      "Aprenda espanhol, português, galego, catalão, basco e outras línguas ibéricas com quizzes de vocabulário e apps móveis.",
    privacy: "Política de privacidade",
    stationMap: "Mapa de atividade das estações",
  },
  notFound: {
    title: "404",
    message: "Ups! Página não encontrada",
    home: "Voltar ao início",
  },
  meta: {
    siteName: "Mobilidade Ibérica",
    home: {
      title: "Mobilidade Ibérica: Estações e Hotéis com Preços Acessíveis",
      description:
        "Descubra estações de comboio e aeroportos em Portugal e Espanha, com linhas e hotéis com preços acessíveis a poucos minutos a pé.",
    },
    rankings: {
      title: "Rankings da Comunidade | Mobilidade Ibérica",
      description:
        "Veja que estações CP e hotéis os visitantes mais gostam ou menos gostam em Portugal.",
      ogDescription: "Rankings da comunidade para estações CP e hotéis com preços acessíveis em Portugal.",
    },
    tickets: {
      title: "Bilhetes e Preços | Mobilidade Ibérica",
      description:
        "Como comprar bilhetes de comboio em Portugal e Espanha — CP, Renfe, passes de metro e redes de suburbanos.",
      ogDescription:
        "Bilhetes CP e Renfe, passes de metro no Porto, Lisboa, Madrid e Barcelona.",
    },
    lines: {
      title: "Linhas Ferroviárias e Estações | Mobilidade Ibérica",
      description:
        "Explore todas as linhas ferroviárias de Portugal (e ainda linhas transfronteiriças e de metro), as estações de cada linha e que serviços — Alfa Pendular, Intercidades, Regional, Urbano — aí param.",
      ogDescription:
        "Linhas ferroviárias de Portugal com as estações de cada linha e os serviços que aí param.",
      lineTitle: "{{line}} — Estações e Serviços | {{site}}",
      lineDescription:
        "Todas as {{count}} estações da {{line}} e os serviços que aí param: {{services}}.",
      lineOgDescription:
        "{{line}}: {{count}} estações e serviços — {{services}}.",
    },
    map: {
      title: "Mapa de Atividade | Mobilidade Ibérica",
      description:
        "Mapa interativo das estações CP em Portugal continental com hexágonos H3 dimensionados por partidas e chegadas amostradas.",
      ogDescription:
        "Veja quais estações CP são mais movimentadas nas nossas amostras de partidas, num mapa H3 de Portugal.",
    },
    trip: {
      title: "Viagem | Mobilidade Ibérica",
      description:
        "Acompanhe o seu comboio CP com contagem decrescente para a partida e atrasos em direto depois de tocar em Apanhar numa estação.",
      ogDescription: "Acompanhamento de viagem com contagens e atrasos em direto.",
    },
    privacy: {
      title: "Política de Privacidade | Mobilidade Ibérica",
      description:
        "Como o verystays.com guarda votos, preferências do browser, localização opcional, analytics e consultas de partidas.",
      ogDescription:
        "O que Mobilidade Ibérica recolhe quando vota, filtra estações ou usa partidas CP em direto.",
    },
    notFound: {
      title: "Página não encontrada | Mobilidade Ibérica",
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
