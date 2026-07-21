import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BuildFooter } from '@/components/BuildFooter';
import { TrainTypeLabels } from '@/components/TrainTypeLabels';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import {
  getListedLinesForStation,
  getStationPathFromName,
  getTrainLineBySlug,
} from '@/lib/trainLines';

export default function LineDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { t, plural } = useLocale();
  const line = slug ? getTrainLineBySlug(slug) : undefined;

  if (!line) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>{t('lines.notFound')}</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>{t('common.goBack')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{line.name}</Text>
      <Text style={styles.meta}>
        {plural('lines.stationCount', line.stations.length, {
          count: line.stations.length,
        })}
      </Text>
      <TrainTypeLabels types={line.serviceTypes} compact />
      <Text style={styles.note}>{t('lines.servicesNote')}</Text>

      <Text style={styles.sectionTitle}>{t('lines.stationsHeading')}</Text>
      {line.stations.length === 0 ? (
        <Text style={styles.empty}>{t('lines.emptyLine')}</Text>
      ) : (
        <View style={styles.list}>
          {line.stations.map((station, index) => {
            const others = getListedLinesForStation(station).filter(
              (item) => item.slug !== line.slug,
            );
            return (
              <View key={station.name} style={styles.card}>
                <Pressable
                  onPress={() => router.push(getStationPathFromName(station.name) as Href)}
                  style={styles.cardPress}
                  accessibilityRole="button"
                  accessibilityLabel={station.name}
                >
                  <Text style={styles.index}>{index + 1}</Text>
                  <View style={styles.cardMain}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <TrainTypeLabels types={station.types} compact />
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
                {others.length > 0 ? (
                  <View style={styles.alsoOn}>
                    <Text style={styles.alsoOnLabel}>{t('lines.alsoOn')}: </Text>
                    {others.map((other, otherIndex) => (
                      <Text key={other.slug} style={styles.alsoOnText}>
                        {otherIndex > 0 ? ' · ' : ''}
                        <Text
                          style={styles.alsoOnLink}
                          onPress={() => router.push(`/lines/${other.slug}` as Href)}
                        >
                          {other.name}
                        </Text>
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}

      <Text style={styles.note}>{t('lines.orderingNote')}</Text>
      <Pressable style={styles.linkButton} onPress={() => router.push('/lines' as Href)}>
        <Text style={styles.linkButtonText}>{t('lines.viewAllLines')}</Text>
      </Pressable>
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
    gap: 10,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.primary,
  },
  meta: {
    fontSize: 14,
    color: theme.primaryMuted,
  },
  note: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.primaryMuted,
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  empty: {
    fontSize: 14,
    color: theme.primaryMuted,
  },
  list: {
    gap: 8,
  },
  card: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardPress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
  },
  index: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E8EEF2',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '700',
    color: theme.primaryMuted,
  },
  cardMain: {
    flex: 1,
    gap: 6,
  },
  stationName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary,
  },
  chevron: {
    fontSize: 22,
    color: theme.primaryMuted,
  },
  alsoOn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingLeft: 46,
  },
  alsoOnLabel: {
    fontSize: 12,
    color: theme.primaryMuted,
  },
  alsoOnText: {
    fontSize: 12,
    color: theme.primaryMuted,
  },
  alsoOnLink: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
    textDecorationLine: 'underline',
  },
  linkButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 8,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
