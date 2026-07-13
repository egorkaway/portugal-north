import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type TicketLink = {
  title: string;
  body: string;
  url: string;
};

const PORTUGAL_LINKS: TicketLink[] = [
  {
    title: 'CP website',
    body: 'Buy Alfa Pendular, Intercidades, and Regional tickets online.',
    url: 'https://www.cp.pt/',
  },
  {
    title: 'CP app (iOS)',
    body: 'Official Comboios de Portugal app for mobile tickets.',
    url: 'https://apps.apple.com/app/comboios-de-portugal/id1105415627',
  },
  {
    title: 'CP app (Android)',
    body: 'Official Comboios de Portugal app for mobile tickets.',
    url: 'https://play.google.com/store/apps/details?id=pt.cp.mobiapp',
  },
  {
    title: 'Andante (Porto metro)',
    body: 'Rechargeable card for Metro do Porto and some buses.',
    url: 'https://www.andante.pt/',
  },
  {
    title: 'Metro Porto tariffs',
    body: 'Current zone pricing for Metro do Porto.',
    url: 'https://www.metrodoporto.pt/pt/viajar/tarifarios',
  },
  {
    title: 'Navegante (Lisbon)',
    body: 'Monthly pass covering Metro, buses, ferries, and suburban trains in Lisbon.',
    url: 'https://www.navegante.pt/',
  },
  {
    title: 'Metro Lisboa tariffs',
    body: 'Single tickets and passes for Metro de Lisboa.',
    url: 'https://www.metrolisboa.pt/pt/comprar/tarifario',
  },
];

const SPAIN_LINKS: TicketLink[] = [
  {
    title: 'Renfe website',
    body: 'Search routes and buy AVE, long-distance, and Media Distancia tickets.',
    url: 'https://www.renfe.com/es/en',
  },
  {
    title: 'Renfe app (iOS)',
    body: 'Official Renfe app for tickets and live train info.',
    url: 'https://apps.apple.com/app/renfe/id444441829',
  },
  {
    title: 'Renfe app (Android)',
    body: 'Official Renfe app for tickets and live train info.',
    url: 'https://play.google.com/store/apps/details?id=com.renfeviajeros.ticket',
  },
  {
    title: 'Cercanías (commuter trains)',
    body: 'Suburban networks around Madrid and other cities — often separate from AVE fares.',
    url: 'https://www.renfe.com/es/en/suburban',
  },
  {
    title: 'Rodalies (Catalonia)',
    body: 'Commuter trains around Barcelona and Girona, including airport links.',
    url: 'https://rodalies.gencat.cat/en/inici/index.html',
  },
  {
    title: 'Metro Madrid',
    body: 'Tickets and passes for the Madrid metro (separate from Renfe long-distance).',
    url: 'https://www.metromadrid.es/en',
  },
  {
    title: 'TMB (Barcelona metro)',
    body: 'Metro, bus, and tram tickets in the Barcelona area.',
    url: 'https://www.tmb.cat/en/home',
  },
];

export default function TicketsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tickets</Text>
      <Text style={styles.subtitle}>
        How to buy train and metro tickets in Portugal and Spain. Prices vary by service type,
        route, and how far in advance you book.
      </Text>

      <CountrySection
        country="Portugal"
        howToBuy="Long-distance CP trains can be bought online, in the CP app, at station ticket offices, or onboard some Regional services (cash only, no seat guarantee)."
        serviceBullets={[
          'Alfa Pendular — fastest Lisbon–Porto service; book ahead for the best price.',
          'Intercidades — intercity trains across Portugal.',
          'Regional — local and branch-line services; often no reservation.',
          'Urban — suburban networks around Lisbon and Porto.',
        ]}
        links={PORTUGAL_LINKS}
      />

      <CountrySection
        country="Spain"
        howToBuy="Most long-distance tickets are sold by Renfe online, in the Renfe app, or at station counters. Commuter networks (Cercanías, Rodalies) and city metros use their own tickets — a Renfe ticket does not automatically include metro rides."
        serviceBullets={[
          'AVE — high-speed trains on major corridors (e.g. Madrid–Barcelona, Madrid–Seville, Madrid–Galicia).',
          'Alvia / Intercity — long-distance trains beyond the AVE network.',
          'Media Distancia — regional services on secondary lines.',
          'Cercanías / Rodalies — suburban trains around Madrid, Barcelona, and other cities.',
        ]}
        links={SPAIN_LINKS}
      />

      <Text style={styles.disclaimer}>
        Fares change. Always confirm current prices on the operator website or at the station
        before you travel.
      </Text>
    </ScrollView>
  );
}

function CountrySection({
  country,
  howToBuy,
  serviceBullets,
  links,
}: {
  country: string;
  howToBuy: string;
  serviceBullets: string[];
  links: TicketLink[];
}) {
  return (
    <View style={styles.countryBlock}>
      <Text style={styles.countryTitle}>{country}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to buy</Text>
        <Text style={styles.body}>{howToBuy}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service types</Text>
        {serviceBullets.map((text) => (
          <Bullet key={text} text={text} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Useful links</Text>
        {links.map((link) => (
          <Pressable
            key={link.url}
            style={styles.linkCard}
            onPress={() => void Linking.openURL(link.url)}
          >
            <Text style={styles.linkTitle}>{link.title}</Text>
            <Text style={styles.linkBody}>{link.body}</Text>
            <Text style={styles.linkAction}>Open</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.primary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
  },
  countryBlock: {
    gap: 16,
    paddingTop: 4,
  },
  countryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  body: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.primary,
  },
  linkCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 4,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
  },
  linkBody: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  linkAction: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
  disclaimer: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
});
