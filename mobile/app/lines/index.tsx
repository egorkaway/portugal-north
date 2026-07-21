import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { BuildFooter } from '@/components/BuildFooter';
import { TrainTypeLabels } from '@/components/TrainTypeLabels';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import { getRailLines, type TrainLine } from '@/lib/trainLines';

function LineCard({ line }: { line: TrainLine }) {
  const router = useRouter();
  const { plural } = useLocale();

  return (
    <Pressable
      onPress={() => router.push(`/lines/${line.slug}` as Href)}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={line.name}
    >
      <View style={styles.cardMain}>
        <Text style={styles.cardTitle}>{line.name}</Text>
        <Text style={styles.cardMeta}>
          {plural('lines.stationCount', line.stations.length, {
            count: line.stations.length,
          })}
        </Text>
        <TrainTypeLabels types={line.serviceTypes} compact />
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function LineSection({ title, lines }: { title: string; lines: TrainLine[] }) {
  if (lines.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionList}>
        {lines.map((line) => (
          <LineCard key={line.slug} line={line} />
        ))}
      </View>
    </View>
  );
}

export default function LinesIndexScreen() {
  const { t } = useLocale();
  const lines = useMemo(() => getRailLines(), []);
  const railPt = useMemo(() => lines.filter((l) => l.country === 'pt'), [lines]);
  const railEs = useMemo(() => lines.filter((l) => l.country === 'es'), [lines]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>{t('lines.intro')}</Text>
      <LineSection title={t('lines.portugalHeading')} lines={railPt} />
      <LineSection title={t('lines.spainHeading')} lines={railEs} />
      <Text style={styles.note}>{t('lines.orderingNote')}</Text>
      <BuildFooter />
    </ScrollView>
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
  intro: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  sectionList: {
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 14,
  },
  cardMain: {
    flex: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
  },
  cardMeta: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
  chevron: {
    fontSize: 22,
    color: theme.primaryMuted,
    paddingLeft: 4,
  },
  note: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.primaryMuted,
  },
});
