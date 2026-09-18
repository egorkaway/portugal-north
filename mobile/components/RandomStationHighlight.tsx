import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import {
  getReliabilityScores,
  getSpainReliabilityScores,
  getStationImageUrl,
  getSummaryForStation,
  pageStations,
  stationToSlug,
  type Station,
} from '@/lib/stationData';
import { useCatalogRevision } from '@/lib/useCatalogRevision';
import {
  formatReliabilityScore,
  reliabilityScoreColor,
} from '@/lib/reliabilityScore';
import {
  pickRandomStationHighlight,
  stationHighlightScore,
  type StationHighlightCountry,
} from '@/lib/randomStationHighlight';

type Props = {
  country?: StationHighlightCountry;
  embedded?: boolean;
};

export function RandomStationHighlight({ country, embedded = false }: Props) {
  const router = useRouter();
  const { t, locale, plural } = useLocale();
  useCatalogRevision();
  const [station, setStation] = useState<Station | null>(null);
  const pickedRef = useRef(false);

  const portugal = getReliabilityScores();
  const spain = getSpainReliabilityScores();
  const scores = useMemo(
    () => ({
      portugalScores: portugal.scores,
      portugalMovements: portugal.movements,
      spainScores: spain.scores,
      spainMovements: spain.movements,
    }),
    [portugal, spain],
  );

  useEffect(() => {
    if (pickedRef.current) return;
    pickedRef.current = true;
    setStation(
      pickRandomStationHighlight(
        pageStations,
        scores,
        Math.random,
        country,
        (name) => Boolean(getSummaryForStation(name, 'en')),
      ),
    );
  }, [country, scores]);

  if (!station) return null;

  const summary = getSummaryForStation(station.name, locale);
  const reliability = stationHighlightScore(station, scores);
  const imageUrl = getStationImageUrl(station.name);
  const introKey =
    country === 'pt'
      ? 'rankings.stationHighlightIntroPt'
      : country === 'es'
        ? 'rankings.stationHighlightIntroEs'
        : 'rankings.stationHighlightIntro';

  return (
    <View style={[styles.wrap, embedded ? styles.embedded : styles.standalone]}>
      <Text style={styles.heading}>{t('rankings.stationHighlightTitle')}</Text>
      <Text style={styles.intro}>{t(introKey)}</Text>

      <Pressable
        style={styles.card}
        onPress={() => router.push(`/station/${stationToSlug(station.name)}`)}
        accessibilityRole="button"
        accessibilityLabel={station.name}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : null}
        <View style={styles.cardBody}>
          <Text style={styles.stationName}>{station.name}</Text>
          {summary ? <Text style={styles.summary}>{summary}</Text> : null}

          {reliability ? (
            <View style={styles.reliability}>
              <Text
                style={[
                  styles.score,
                  { color: reliabilityScoreColor(reliability.score) },
                ]}
              >
                {formatReliabilityScore(reliability.score)}/10
              </Text>
              {reliability.movements > 0 ? (
                <Text style={styles.samples}>
                  {plural('rankings.stationHighlightSamples', reliability.movements, {
                    count: reliability.movements,
                  })}
                </Text>
              ) : null}
            </View>
          ) : null}

          <Text style={styles.cta}>{t('rankings.stationHighlightCta')}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  standalone: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  embedded: {
    marginTop: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.primary,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  card: {
    marginTop: 4,
    backgroundColor: theme.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: theme.border,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.primary,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  reliability: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 4,
  },
  score: {
    fontSize: 28,
    fontWeight: '800',
  },
  samples: {
    fontSize: 12,
    color: theme.primaryMuted,
  },
  cta: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
});
