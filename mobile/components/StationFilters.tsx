import type { ComponentProps } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { TrainTypeDot } from '@/components/TrainTypeDot';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import { getTrainTypeAbbrev } from '@/lib/trainTypes';

type VoteFilter = 'up' | 'down' | 'none';
type VisitedFilter = 'visited' | 'notVisited';
type SymbolName = ComponentProps<typeof SymbolView>['name'];

const ICONS = {
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  location: { ios: 'location.fill', android: 'my_location', web: 'my_location' },
  thumbsUp: { ios: 'hand.thumbsup.fill', android: 'thumb_up', web: 'thumb_up' },
  thumbsDown: { ios: 'hand.thumbsdown.fill', android: 'thumb_down', web: 'thumb_down' },
  circle: { ios: 'circle', android: 'radio_button_unchecked', web: 'radio_button_unchecked' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  mapPin: { ios: 'mappin.and.ellipse', android: 'place', web: 'place' },
} as const satisfies Record<string, SymbolName>;

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  trainTypes: string[];
  typeFilter: string | null;
  onTypeToggle: (type: string) => void;
  voteFilter: VoteFilter | null;
  onVoteFilterToggle: (filter: VoteFilter) => void;
  visitedFilter: VisitedFilter | null;
  onVisitedFilterToggle: (filter: VisitedFilter) => void;
  sortByDistance: boolean;
  loadingLocation: boolean;
  onRequestLocation: () => void;
};

function FilterChip({
  active,
  activeStyle,
  onPress,
  label,
  accessibilityLabel,
  icon,
  trainType,
}: {
  active: boolean;
  activeStyle?: object;
  onPress: () => void;
  label: string;
  accessibilityLabel: string;
  icon?: { name: SymbolName; size?: number };
  trainType?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.chip, active && (activeStyle ?? styles.chipActivePrimary)]}
    >
      {trainType ? <TrainTypeDot type={trainType} size={7} /> : null}
      {icon ? (
        <SymbolView
          name={icon.name}
          size={icon.size ?? 14}
          tintColor={active ? '#fff' : theme.primaryMuted}
          weight="semibold"
        />
      ) : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function StationFilters({
  searchQuery,
  onSearchChange,
  trainTypes,
  typeFilter,
  onTypeToggle,
  voteFilter,
  onVoteFilterToggle,
  visitedFilter,
  onVisitedFilterToggle,
  sortByDistance,
  loadingLocation,
  onRequestLocation,
}: Props) {
  const { t } = useLocale();
  const locationLabel = sortByDistance
    ? t('home.sortedByDistance')
    : loadingLocation
      ? t('home.locating')
      : t('home.nearMe');
  const searchLabel = t('home.searchPlaceholder');

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <View style={styles.searchIcon} pointerEvents="none">
            <SymbolView
              name={ICONS.search}
              size={14}
              tintColor={theme.primaryMuted}
            />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder={searchLabel}
            placeholderTextColor={theme.primaryMuted}
            style={styles.search}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel={searchLabel}
          />
        </View>
        <Pressable
          onPress={() => void onRequestLocation()}
          accessibilityRole="button"
          accessibilityState={{ selected: sortByDistance }}
          accessibilityLabel={locationLabel}
          style={[styles.locationButton, sortByDistance && styles.locationButtonActive]}
        >
          {loadingLocation ? (
            <ActivityIndicator size="small" color={sortByDistance ? '#fff' : theme.primary} />
          ) : (
            <SymbolView
              name={ICONS.location}
              size={15}
              tintColor={sortByDistance ? '#fff' : theme.primary}
              weight="semibold"
            />
          )}
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {trainTypes.map((type) => (
          <FilterChip
            key={type}
            active={typeFilter === type}
            onPress={() => onTypeToggle(type)}
            label={getTrainTypeAbbrev(type)}
            accessibilityLabel={type}
            trainType={type}
          />
        ))}

        <View style={styles.divider} />

        <FilterChip
          active={voteFilter === 'up'}
          onPress={() => onVoteFilterToggle('up')}
          label={t('home.upvoted')}
          accessibilityLabel={t('home.upvoted')}
          icon={{ name: ICONS.thumbsUp }}
        />
        <FilterChip
          active={voteFilter === 'down'}
          onPress={() => onVoteFilterToggle('down')}
          label={t('home.downvoted')}
          accessibilityLabel={t('home.downvoted')}
          icon={{ name: ICONS.thumbsDown }}
        />
        <FilterChip
          active={voteFilter === 'none'}
          onPress={() => onVoteFilterToggle('none')}
          label={t('home.notVoted')}
          accessibilityLabel={t('home.notVoted')}
          icon={{ name: ICONS.circle }}
        />

        <View style={styles.divider} />

        <FilterChip
          active={visitedFilter === 'visited'}
          activeStyle={styles.chipActiveVisited}
          onPress={() => onVisitedFilterToggle('visited')}
          label={t('home.visited')}
          accessibilityLabel={t('home.visited')}
          icon={{ name: ICONS.check }}
        />
        <FilterChip
          active={visitedFilter === 'notVisited'}
          activeStyle={styles.chipActiveVisited}
          onPress={() => onVisitedFilterToggle('notVisited')}
          label={t('home.notVisited')}
          accessibilityLabel={t('home.notVisited')}
          icon={{ name: ICONS.mapPin }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchWrap: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  search: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingLeft: 32,
    paddingRight: 10,
    paddingVertical: 7,
    fontSize: 14,
    color: theme.primary,
    minHeight: 34,
  },
  locationButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.accent,
  },
  locationButtonActive: {
    backgroundColor: theme.primary,
  },
  filtersContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
  chipActivePrimary: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  chipActiveVisited: {
    backgroundColor: theme.success,
    borderColor: theme.success,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.primaryMuted,
  },
  chipTextActive: {
    color: '#fff',
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: theme.border,
    marginHorizontal: 2,
  },
});
