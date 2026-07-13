/** Shared ticket URLs — keep in sync with web i18n keys and mobile ticket guide. */
export const ticketUrls = {
  cpWebsite: "https://www.cp.pt/",
  cpAppIos: "https://apps.apple.com/app/comboios-de-portugal/id1105415627",
  cpAppAndroid: "https://play.google.com/store/apps/details?id=pt.cp.mobiapp",
  andante: "https://www.andante.pt/",
  metroPortoTariffs: "https://www.metrodoporto.pt/pt/viajar/tarifarios",
  navegante: "https://www.navegante.pt/",
  metroLisboaTariffs: "https://www.metrolisboa.pt/pt/comprar/tarifario",
  renfeWebsite: "https://www.renfe.com/es/en",
  renfeAppIos: "https://apps.apple.com/app/renfe/id444441829",
  renfeAppAndroid: "https://play.google.com/store/apps/details?id=com.renfeviajeros.ticket",
  cercanias: "https://www.renfe.com/es/en/suburban",
  rodalies: "https://rodalies.gencat.cat/en/inici/index.html",
  metroMadrid: "https://www.metromadrid.es/en",
  tmbBarcelona: "https://www.tmb.cat/en/home",
} as const;

export type TicketLinkDef = {
  titleKey: string;
  bodyKey: string;
  url: string;
};

export const portugalTicketLinks: TicketLinkDef[] = [
  {
    titleKey: "linkCpWebsiteTitle",
    bodyKey: "linkCpWebsiteBody",
    url: ticketUrls.cpWebsite,
  },
  {
    titleKey: "linkCpAppIosTitle",
    bodyKey: "linkCpAppIosBody",
    url: ticketUrls.cpAppIos,
  },
  {
    titleKey: "linkCpAppAndroidTitle",
    bodyKey: "linkCpAppAndroidBody",
    url: ticketUrls.cpAppAndroid,
  },
  {
    titleKey: "linkAndanteTitle",
    bodyKey: "linkAndanteBody",
    url: ticketUrls.andante,
  },
  {
    titleKey: "linkMetroPortoTariffsTitle",
    bodyKey: "linkMetroPortoTariffsBody",
    url: ticketUrls.metroPortoTariffs,
  },
  {
    titleKey: "linkNaveganteTitle",
    bodyKey: "linkNaveganteBody",
    url: ticketUrls.navegante,
  },
  {
    titleKey: "linkMetroLisboaTariffsTitle",
    bodyKey: "linkMetroLisboaTariffsBody",
    url: ticketUrls.metroLisboaTariffs,
  },
];

export const spainTicketLinks: TicketLinkDef[] = [
  {
    titleKey: "linkRenfeWebsiteTitle",
    bodyKey: "linkRenfeWebsiteBody",
    url: ticketUrls.renfeWebsite,
  },
  {
    titleKey: "linkRenfeAppIosTitle",
    bodyKey: "linkRenfeAppIosBody",
    url: ticketUrls.renfeAppIos,
  },
  {
    titleKey: "linkRenfeAppAndroidTitle",
    bodyKey: "linkRenfeAppAndroidBody",
    url: ticketUrls.renfeAppAndroid,
  },
  {
    titleKey: "linkCercaniasTitle",
    bodyKey: "linkCercaniasBody",
    url: ticketUrls.cercanias,
  },
  {
    titleKey: "linkRodaliesTitle",
    bodyKey: "linkRodaliesBody",
    url: ticketUrls.rodalies,
  },
  {
    titleKey: "linkMetroMadridTitle",
    bodyKey: "linkMetroMadridBody",
    url: ticketUrls.metroMadrid,
  },
  {
    titleKey: "linkTmbBarcelonaTitle",
    bodyKey: "linkTmbBarcelonaBody",
    url: ticketUrls.tmbBarcelona,
  },
];
