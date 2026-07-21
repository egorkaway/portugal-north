/** Mobile-only ticket guide (Russian). Synced into ticket-guides.json. */
export const ticketGuideRu = {
  subtitle:
    'Как покупать билеты на поезд и метро в Португалии и Испании. Цены зависят от типа сервиса, маршрута и того, насколько заранее вы бронируете.',
  disclaimer:
    'Тарифы меняются. Перед поездкой всегда проверяйте актуальные цены на сайте оператора или на вокзале.',
  countries: [
    {
      country: 'Португалия',
      howToBuy:
        'Билеты на поезда дальнего следования CP можно купить онлайн, в приложении CP, в кассах на вокзалах или в некоторых Regional прямо в поезде (только наличные, место не гарантируется).',
      crossBorderNote:
        'Porto–Vigo (Celta): онлайн-билеты продаёт Renfe, а не CP — их нет на сайте и в приложении CP. Кассы CP на вокзалах по-прежнему могут продать этот маршрут.',
      localCardNote:
        'Для местных и пригородных поездов (и метро) каждому пассажиру нужна своя проездная карта. Нельзя загрузить билеты нескольких людей на одну карту, когда едете группой. Всегда валидируйте билет или карту перед посадкой — на валидаторах или турникетах.',
      residentPassNote:
        'Более длинные абонементы (часто на 30 или 90 дней) иногда доступны только резидентам и могут требовать местное удостоверение или подтверждение адреса. Туристы обычно покупают разовые билеты или короткие билеты на 1–3 дня — проверьте, что можно купить, прежде чем рассчитывать на месячный проездной.',
      serviceBullets: [
        'Alfa Pendular — самый быстрый на главных коридорах (Лиссабон–Порту, также Фару и Брага); бронируйте заранее для лучшей цены.',
        'Intercidades — междугородние поезда по Португалии.',
        'Regional — местные и ветковые маршруты; часто без бронирования места.',
        'Urban — пригородные сети вокруг Лиссабона и Порту.',
      ],
      links: [
        {
          title: 'Сайт CP',
          body: 'Покупайте билеты Alfa Pendular, Intercidades и Regional онлайн.',
          url: 'https://www.cp.pt/',
        },
        {
          title: 'Приложение CP (iOS)',
          body: 'Официальное приложение Comboios de Portugal для мобильных билетов.',
          url: 'https://apps.apple.com/app/comboios-de-portugal/id1105415627',
        },
        {
          title: 'Приложение CP (Android)',
          body: 'Официальное приложение Comboios de Portugal для мобильных билетов.',
          url: 'https://play.google.com/store/apps/details?id=pt.cp.mobiapp',
        },
        {
          title: 'Andante (метро Порту)',
          body: 'Пополняемая карта для Metro do Porto и некоторых автобусов.',
          url: 'https://www.andante.pt/',
        },
        {
          title: 'Тарифы Metro Porto',
          body: 'Актуальные зонные тарифы Metro do Porto.',
          url: 'https://www.metrodoporto.pt/pt/viajar/tarifarios',
        },
        {
          title: 'Navegante (Лиссабон)',
          body: 'Месячный проездной на метро, автобусы, паромы и пригородные поезда в Лиссабоне.',
          url: 'https://www.navegante.pt/',
        },
        {
          title: 'Тарифы Metro Lisboa',
          body: 'Разовые билеты и проездные Metro de Lisboa.',
          url: 'https://www.metrolisboa.pt/pt/comprar/tarifario',
        },
      ],
    },
    {
      country: 'Испания',
      howToBuy:
        'Большинство билетов дальнего следования продаёт Renfe онлайн, в приложении Renfe или в кассах. Пригородные сети (Cercanías, Rodalies) и городское метро имеют собственные билеты — билет Renfe автоматически не включает метро.',
      serviceBullets: [
        'AVE — скоростные поезда на главных коридорах (напр. Мадрид–Барселона, Мадрид–Севилья, Мадрид–Галисия).',
        'Alvia / Intercity — поезда дальнего следования вне сети AVE.',
        'Media Distancia — региональные рейсы на второстепенных линиях.',
        'Cercanías / Rodalies — пригородные поезда вокруг Мадрида, Барселоны и других городов.',
      ],
      links: [
        {
          title: 'Сайт Renfe',
          body: 'Ищите маршруты и покупайте билеты AVE, дальнего следования и Media Distancia.',
          url: 'https://www.renfe.com/es/en',
        },
        {
          title: 'Приложение Renfe (iOS)',
          body: 'Официальное приложение Renfe для билетов и информации о поездах в реальном времени.',
          url: 'https://apps.apple.com/app/renfe/id444441829',
        },
        {
          title: 'Приложение Renfe (Android)',
          body: 'Официальное приложение Renfe для билетов и информации о поездах в реальном времени.',
          url: 'https://play.google.com/store/apps/details?id=com.renfeviajeros.ticket',
        },
        {
          title: 'Cercanías (пригородные поезда)',
          body: 'Пригородные сети вокруг Мадрида и других городов — часто отдельные тарифы от AVE.',
          url: 'https://www.renfe.com/es/en/suburban',
        },
        {
          title: 'Rodalies (Каталония)',
          body: 'Пригородные поезда вокруг Барселоны и Жироны, в том числе до аэропорта.',
          url: 'https://rodalies.gencat.cat/en/inici/index.html',
        },
        {
          title: 'Metro Madrid',
          body: 'Билеты и проездные мадридского метро (отдельно от Renfe дальнего следования).',
          url: 'https://www.metromadrid.es/en',
        },
        {
          title: 'TMB (метро Барселоны)',
          body: 'Билеты на метро, автобус и трамвай в районе Барселоны.',
          url: 'https://www.tmb.cat/en/home',
        },
      ],
    },
  ],
} as const;
