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
import { theme } from '@/constants/theme';
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
  compact,
}: {
  active: boolean;
  activeStyle?: object;
  onPress: () => void;
  label: string;
  accessibilityLabel: string;
  icon?: { name: SymbolName; size?: number };
  compact?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.chip,
        compact && styles.chipCompact,
        active && (activeStyle ?? styles.chipActivePrimary),
      ]}
    >
      {icon ? (
        <SymbolView
          name={icon.name}
          size={icon.size ?? 14}
          tintColor={active ? '#fff' : theme.primaryMuted}
          weight="semibold"
        />
      ) : null}
      {!compact || !icon ? (
        <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
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
  const locationLabel = sortByDistance ? 'Sorted by distance' : 'Near me';

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
            placeholder="Search stations or lines"
            placeholderTextColor={theme.primaryMuted}
            style={styles.search}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search stations or lines"
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
          />
        ))}

        <View style={styles.divider} />

        <FilterChip
          active={voteFilter === 'up'}
          onPress={() => onVoteFilterToggle('up')}
          label="Up"
          accessibilityLabel="Upvoted"
          icon={{ name: ICONS.thumbsUp }}
          compact
        />
        <FilterChip
          active={voteFilter === 'down'}
          onPress={() => onVoteFilterToggle('down')}
          label="Down"
          accessibilityLabel="Downvoted"
          icon={{ name: ICONS.thumbsDown }}
          compact
        />
        <FilterChip
          active={voteFilter === 'none'}
          onPress={() => onVoteFilterToggle('none')}
          label="None"
          accessibilityLabel="Not voted"
          icon={{ name: ICONS.circle }}
          compact
        />

        <View style={styles.divider} />

        <FilterChip
          active={visitedFilter === 'visited'}
          activeStyle={styles.chipActiveVisited}
          onPress={() => onVisitedFilterToggle('visited')}
          label="Visited"
          accessibilityLabel="Visited stations"
          icon={{ name: ICONS.check }}
          compact
        />
        <FilterChip
          active={visitedFilter === 'notVisited'}
          activeStyle={styles.chipActiveVisited}
          onPress={() => onVisitedFilterToggle('notVisited')}
          label="New"
          accessibilityLabel="Not visited yet"
          icon={{ name: ICONS.mapPin }}
          compact
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
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    minHeight: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
  chipCompact: {
    width: 34,
    height: 34,
    minHeight: 34,
    paddingHorizontal: 0,
    paddingVertical: 0,
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
