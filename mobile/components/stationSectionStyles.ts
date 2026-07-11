import { StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export const STATION_SECTION_PADDING = 16;

export const stationSectionStyles = StyleSheet.create({
  list: {
    gap: 8,
    paddingHorizontal: STATION_SECTION_PADDING,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 12,
  },
  cardMain: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.primary,
  },
  cardSubtitle: {
    fontSize: 15,
    color: theme.primary,
  },
  cardMeta: {
    fontSize: 12,
    color: theme.primaryMuted,
    marginTop: 2,
  },
  cardAside: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
  actionButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.background,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
  },
  empty: {
    paddingHorizontal: STATION_SECTION_PADDING,
    color: theme.primaryMuted,
    fontSize: 15,
  },
  loading: {
    paddingVertical: 24,
    paddingHorizontal: STATION_SECTION_PADDING,
    alignItems: 'center',
  },
});
