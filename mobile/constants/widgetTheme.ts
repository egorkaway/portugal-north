/** Colors aligned with `constants/theme.ts` for widgets and Live Activities. */
export const widgetTheme = {
  primary: '#012841',
  primaryMuted: '#4A6274',
  accent: '#7EC8E3',
  background: '#F5F7F8',
  card: '#FFFFFF',
  onPrimary: '#FFFFFF',
  mutedOnPrimary: '#B8C5CE',
} as const;

export function getWidgetColors(colorScheme: 'light' | 'dark') {
  if (colorScheme === 'dark') {
    return {
      background: widgetTheme.primary,
      primary: widgetTheme.onPrimary,
      muted: widgetTheme.mutedOnPrimary,
      accent: widgetTheme.accent,
    };
  }

  return {
    background: widgetTheme.background,
    primary: widgetTheme.primary,
    muted: widgetTheme.primaryMuted,
    accent: widgetTheme.accent,
  };
}
