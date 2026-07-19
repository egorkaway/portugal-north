import type { Messages } from "../i18n/types";
import { portugalTicketLinks, spainTicketLinks } from "./ticketLinks";

type TicketMessages = Messages["tickets"];

function resolveLink(
  tickets: TicketMessages,
  link: { titleKey: string; bodyKey: string; url: string },
) {
  const title = tickets[link.titleKey as keyof TicketMessages];
  const body = tickets[link.bodyKey as keyof TicketMessages];
  return {
    title: typeof title === "string" ? title : link.titleKey,
    body: typeof body === "string" ? body : link.bodyKey,
    url: link.url,
  };
}

/** Build the mobile ticket guide JSON from translated ticket messages. */
export function buildTicketGuide(tickets: TicketMessages) {
  return {
    subtitle: tickets.overviewSubtitle,
    disclaimer: tickets.overviewDisclaimer,
    countries: [
      {
        country: tickets.countryPortugal,
        howToBuy: tickets.portugalHowToBuyIntro,
        crossBorderNote: tickets.portoVigoRenfeNote,
        localCardNote: tickets.portugalLocalCardNote,
        residentPassNote: tickets.portugalResidentPassNote,
        serviceBullets: [
          tickets.portugalServiceAP,
          tickets.portugalServiceIC,
          tickets.portugalServiceR,
          tickets.portugalServiceU,
        ],
        links: portugalTicketLinks.map((link) => resolveLink(tickets, link)),
      },
      {
        country: tickets.countrySpain,
        howToBuy: tickets.spainHowToBuyIntro,
        serviceBullets: [
          tickets.spainServiceAVE,
          tickets.spainServiceAlvia,
          tickets.spainServiceMedia,
          tickets.spainServiceCommuter,
        ],
        links: spainTicketLinks.map((link) => resolveLink(tickets, link)),
      },
    ],
  };
}
