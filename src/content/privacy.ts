import type { Locale } from "@/i18n";

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type PrivacyContent = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  intro: string;
  sections: PrivacySection[];
};

const en: PrivacyContent = {
  title: "Privacy policy",
  subtitle: "How Portugal by Train (verystays.com) handles your interactions",
  lastUpdated: "Last updated: 28 May 2026",
  intro:
    "Portugal by Train is a free travel guide at verystays.com. We do not ask you to create an account. This policy explains what happens when you vote, filter stations, use live departures, or browse the site.",
  sections: [
    {
      id: "collect",
      title: "What you enter and what we store",
      paragraphs: [
        "When you use the site, you may provide: thumbs up/down on stations, hotels, or station photos; a “visited” mark on stations; a “Taking” mark on a live departure; hotel closed reports; homepage search or filter choices; and an optional browser location if you turn on “Sort by distance”.",
        "Most of this stays on your device first. We do not ask for your name, email, or phone number to use the guide.",
      ],
    },
    {
      id: "device",
      title: "Data kept in your browser",
      paragraphs: [
        "Your votes and closed-hotel flags are saved in cookies on your device (up to one year, SameSite=Lax). Visited stations, planned departures (“Taking”), language choice, distance-sort preference, offline vote-sync queue, cached community totals, and PWA prompt dismissals are saved in localStorage. A random analytics ID may also be stored locally when analytics is enabled.",
        "You can clear this data at any time through your browser settings (cookies and site data). Clearing cookies removes your vote history on this device; community totals on the server are not reset.",
      ],
    },
    {
      id: "votes",
      title: "Community votes on our server",
      paragraphs: [
        "When you are online, vote changes are sent to our API at /api/votes. The server updates aggregate counts only — for example, how many upvotes Aveiro station has. We do not store which browser or person cast each vote, and the API payload does not include your name or account.",
        "Aggregated counts are kept in private storage on Vercel (Blob). They power community rankings and hotel ratings shown to all visitors. If vote storage is unavailable, your votes still work locally but may not affect global totals until sync succeeds.",
      ],
    },
    {
      id: "location",
      title: "Location",
      paragraphs: [
        "“Sort by distance” uses the browser Geolocation API only after you tap the control. Coordinates are used in your browser to sort the station list and are not sent to our servers. If you deny permission, no location is read.",
      ],
    },
    {
      id: "departures",
      title: "Live departures",
      paragraphs: [
        "Departure times are fetched from Comboios de Portugal (CP) using a public station code. We send the station code and how many departures to show — not your identity. CP’s own privacy terms apply to their service.",
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      paragraphs: [
        "We use Vercel Analytics for privacy-friendly, aggregate traffic metrics on the site.",
        "When configured, we also use PostHog to understand how the guide is used: page views, station pages opened, and vote actions (type of vote and station/hotel names, not free-text you type). PostHog receives a random anonymous ID stored in your browser; we do not use PostHog to collect passwords or payment data because the site has no login or checkout.",
        "You can limit analytics by blocking third-party scripts in your browser or using standard tracking protection. PostHog is only loaded when the site operator has set a PostHog project key in deployment settings.",
      ],
    },
    {
      id: "third-parties",
      title: "Third-party links and services",
      paragraphs: [
        "Hotel links go to Booking.com (or similar search URLs we generate). Map links open Apple Maps or OpenStreetMap. Ticket and metro pages link to CP, Andante, Metropolitano de Lisboa, and other official operators. Those sites have their own privacy policies and may set their own cookies when you leave verystays.com.",
        "Station photos may load from Wikimedia Commons or Pexels CDNs. Installing the site as a PWA uses a service worker that caches pages for offline use; that cache stays on your device.",
      ],
    },
    {
      id: "retention",
      title: "Retention and security",
      paragraphs: [
        "Device storage lasts until you clear it or until cookie expiry. Server-side vote totals persist until we reset or migrate project data. Analytics providers retain events according to their own policies and our configuration.",
        "Traffic is served over HTTPS. Vote storage uses private blob access; only our server code reads or writes aggregates.",
      ],
    },
    {
      id: "rights",
      title: "Your choices and rights",
      paragraphs: [
        "You can use most of the guide without voting or sharing location. You may clear site data in your browser, disable cookies for verystays.com, or stop using the site at any time.",
        "If you are in the EU/EEA or UK, you may have rights to access, rectify, or object to processing of personal data. Because we do not operate accounts, we typically cannot identify you from server logs alone; device-held data can be deleted by you directly.",
        "For privacy questions about this site, contact the operator at i@egor.one.",
      ],
    },
  ],
};

const pt: PrivacyContent = {
  title: "Política de privacidade",
  subtitle: "Como o Portugal by Train (verystays.com) trata as suas interações",
  lastUpdated: "Última atualização: 28 de maio de 2026",
  intro:
    "O Portugal by Train é um guia de viagens gratuito em verystays.com. Não pedimos registo. Esta política explica o que acontece quando vota, filtra estações, consulta partidas em direto ou navega no site.",
  sections: [
    {
      id: "collect",
      title: "O que introduz e o que guardamos",
      paragraphs: [
        "Ao usar o site, pode fornecer: votos positivos/negativos em estações, hotéis ou fotos; marcação de estação visitada; marcação «A apanhar» numa partida; reportes de hotel encerrado; pesquisa ou filtros na página inicial; e localização opcional se activar «Ordenar por distância».",
        "A maior parte fica primeiro no seu dispositivo. Não pedimos nome, e-mail ou telefone para usar o guia.",
      ],
    },
    {
      id: "device",
      title: "Dados guardados no browser",
      paragraphs: [
        "Os votos e reportes de hotel encerrado ficam em cookies (até um ano, SameSite=Lax). Estações visitadas, partidas planeadas, idioma, preferência de ordenação por distância, fila de sincronização offline, totais comunitários em cache e recusas de instalação PWA ficam em localStorage. Um ID anónimo de analytics pode também ser guardado localmente quando o analytics está activo.",
        "Pode apagar estes dados nas definições do browser (cookies e dados do site). Apagar cookies remove o histórico de votos neste dispositivo; os totais no servidor não são repostos.",
      ],
    },
    {
      id: "votes",
      title: "Votos da comunidade no servidor",
      paragraphs: [
        "Online, as alterações de voto são enviadas para /api/votes. O servidor actualiza apenas contagens agregadas — por exemplo, quantos votos positivos tem a estação de Aveiro. Não guardamos qual browser ou pessoa votou, e o pedido não inclui nome ou conta.",
        "As contagens agregadas ficam em armazenamento privado na Vercel (Blob) e alimentam rankings e classificações de hotéis. Se o armazenamento falhar, os votos locais continuam a funcionar mas podem não afectar totais globais até sincronizar.",
      ],
    },
    {
      id: "location",
      title: "Localização",
      paragraphs: [
        "«Ordenar por distância» usa a Geolocation API do browser só depois de carregar no botão. As coordenadas servem para ordenar a lista no browser e não são enviadas aos nossos servidores. Se recusar permissão, não lemos localização.",
      ],
    },
    {
      id: "departures",
      title: "Partidas em direto",
      paragraphs: [
        "Os horários vêm da CP com um código público de estação. Enviamos o código e quantas partidas mostrar — não a sua identidade. Aplicam-se os termos de privacidade da CP.",
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      paragraphs: [
        "Usamos Vercel Analytics para métricas agregadas de tráfego.",
        "Quando configurado, usamos PostHog para perceber uso do guia: páginas vistas, estações abertas e acções de voto (tipo e nomes de estação/hotel, sem texto livre). O PostHog recebe um ID anónimo no browser; não recolhemos passwords nem pagamentos porque não há login nem checkout.",
        "Pode limitar analytics bloqueando scripts de terceiros ou usando protecção de rastreio. O PostHog só é carregado se o operador definir a chave do projecto no deploy.",
      ],
    },
    {
      id: "third-parties",
      title: "Ligações e serviços de terceiros",
      paragraphs: [
        "Ligações a hotéis vão para Booking.com (ou pesquisas que geramos). Mapas abrem Apple Maps ou OpenStreetMap. A página de bilhetes liga à CP, Andante, Metropolitano de Lisboa e outros operadores oficiais. Esses sites têm políticas próprias e podem definir cookies quando sair de verystays.com.",
        "Fotos podem vir de Wikimedia Commons ou Pexels. Instalar como PWA usa um service worker que guarda páginas em cache no dispositivo.",
      ],
    },
    {
      id: "retention",
      title: "Conservação e segurança",
      paragraphs: [
        "Dados no dispositivo duram até os apagar ou expirarem cookies. Totais de votos no servidor mantêm-se até reset ou migração do projecto. Analytics segue políticas dos fornecedores.",
        "O tráfego usa HTTPS. Votos usam blob privado; só o nosso código lê ou escreve agregados.",
      ],
    },
    {
      id: "rights",
      title: "As suas escolhas e direitos",
      paragraphs: [
        "Pode usar o guia sem votar nem partilhar localização. Pode apagar dados do site, desactivar cookies para verystays.com ou deixar de usar o site.",
        "Se estiver na UE/EEE ou Reino Unido, pode ter direitos de acesso, rectificação ou oposição. Como não temos contas, normalmente não o identificamos só por logs do servidor; dados no dispositivo pode apagá-los directamente.",
        "Questões de privacidade: i@egor.one.",
      ],
    },
  ],
};

/** es / ca / gl — aligned with English; legal tone kept concise. */
const es: PrivacyContent = {
  ...en,
  title: "Política de privacidad",
  subtitle: "Cómo Portugal by Train (verystays.com) trata tus interacciones",
  lastUpdated: "Última actualización: 28 de mayo de 2026",
  intro:
    "Portugal by Train es una guía gratuita en verystays.com. No pedimos cuenta. Esta política explica qué ocurre cuando votas, filtras estaciones, consultas salidas en directo o navegas.",
  sections: en.sections.map((section) => {
    const map: Record<string, { title: string; paragraphs: string[] }> = {
      collect: {
        title: "Lo que introduces y lo que guardamos",
        paragraphs: [
          "Puedes enviar: votos en estaciones, hoteles o fotos; marcar estaciones visitadas; marcar «Tomando» en una salida; avisos de hotel cerrado; búsqueda o filtros; y ubicación opcional con «Ordenar por distancia».",
          "Casi todo queda primero en tu dispositivo. No pedimos nombre, correo ni teléfono.",
        ],
      },
      device: {
        title: "Datos en tu navegador",
        paragraphs: [
          "Votos y avisos de cierre van en cookies (hasta un año, SameSite=Lax). Visitas, salidas planeadas, idioma, orden por distancia, cola de sincronización, totales en caché e instalación PWA van en localStorage. Puede guardarse un ID anónimo de analytics.",
          "Puedes borrar estos datos en ajustes del navegador. Borrar cookies elimina votos locales; los totales del servidor no se reinician.",
        ],
      },
      votes: {
        title: "Votos comunitarios en el servidor",
        paragraphs: [
          "En línea, los cambios van a /api/votes. Solo actualizamos totales agregados. No guardamos quién votó ni incluimos nombre o cuenta.",
          "Los totales se guardan en almacenamiento privado Vercel (Blob) para rankings. Si falla, los votos locales siguen pero pueden no sumar al total global hasta sincronizar.",
        ],
      },
      location: {
        title: "Ubicación",
        paragraphs: [
          "«Ordenar por distancia» usa Geolocation solo tras pulsar el control. Las coordenadas ordenan la lista en el navegador y no se envían a nuestros servidores.",
        ],
      },
      departures: {
        title: "Salidas en directo",
        paragraphs: [
          "Horarios de CP con código de estación público. Enviamos código y límite de salidas, no tu identidad. Aplican los términos de CP.",
        ],
      },
      analytics: {
        title: "Analítica",
        paragraphs: [
          "Usamos Vercel Analytics para tráfico agregado.",
          "Con configuración, PostHog registra páginas vistas, estaciones abiertas y votos (tipo y nombres, sin texto libre) con un ID anónimo. No hay login ni pagos en el sitio.",
          "Puedes limitar analítica bloqueando scripts o con protección de rastreo. PostHog solo carga si hay clave de proyecto.",
        ],
      },
      "third-parties": {
        title: "Terceros",
        paragraphs: [
          "Enlaces a Booking.com, mapas (Apple/OSM) y operadores oficiales (CP, Andante, etc.). Esos sitios tienen sus propias políticas.",
          "Imágenes desde Wikimedia o Pexels. La PWA cachea páginas en tu dispositivo.",
        ],
      },
      retention: {
        title: "Conservación y seguridad",
        paragraphs: [
          "Datos locales hasta que los borres o expiren cookies. Totales en servidor hasta reset del proyecto. HTTPS y blob privado para votos.",
        ],
      },
      rights: {
        title: "Tus derechos",
        paragraphs: [
          "Puedes usar la guía sin votar ni compartir ubicación. Borra datos del sitio o deja de usarlo cuando quieras.",
          "En UE/Reino Unido puedes tener derechos GDPR; sin cuentas, no te identificamos solo por logs.",
          "Contacto: i@egor.one.",
        ],
      },
    };
    return { ...section, ...map[section.id] };
  }),
};

const ca: PrivacyContent = {
  ...es,
  title: "Política de privacitat",
  subtitle: "Com Portugal by Train (verystays.com) tracta les teves interaccions",
  lastUpdated: "Darrera actualització: 28 de maig de 2026",
  intro:
    "Portugal by Train és una guia gratuïta a verystays.com. No demanem compte. Aquesta política explica què passa quan votes, filtres estacions o consultes sortides en directe.",
};

const gl: PrivacyContent = {
  ...es,
  title: "Política de privacidade",
  subtitle: "Como Portugal by Train (verystays.com) trata as túas interaccións",
  lastUpdated: "Última actualización: 28 de maio de 2026",
  intro:
    "Portugal by Train é unha guía gratuíta en verystays.com. Non pedimos conta. Esta política explica o que ocorre cando votas, filtras estacións ou consultas saídas en directo.",
};

export const privacyByLocale: Record<Locale, PrivacyContent> = {
  en,
  pt,
  es,
  ca,
  gl,
};

export function getPrivacyContent(locale: Locale): PrivacyContent {
  return privacyByLocale[locale] ?? en;
}
