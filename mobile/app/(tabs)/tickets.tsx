import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

const LINKS = [
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

export default function TicketsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tickets</Text>
      <Text style={styles.subtitle}>
        How to buy train and metro tickets in Portugal. Prices vary by service type and how far
        in advance you book.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to buy</Text>
        <Text style={styles.body}>
          Long-distance CP trains can be bought online, in the CP app, at station ticket offices,
          or onboard Regional services (cash only, no seat guarantee).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service types</Text>
        <Bullet text="Alfa Pendular — fastest Lisbon–Porto service, book ahead for best price." />
        <Bullet text="Intercidades — intercity trains across Portugal." />
        <Bullet text="Regional — local and branch-line services; often no reservation." />
        <Bullet text="Urban — suburban networks around Lisbon and Porto." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Useful links</Text>
        {LINKS.map((link) => (
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

      <Text style={styles.disclaimer}>
        Fares change. Always confirm current prices on cp.pt or at the station before you travel.
      </Text>
    </ScrollView>
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
