/** Colors aligned with `constants/theme.ts` for widgets and Live Activities. */
export const widgetTheme = {
  primary: '#012841',
  primaryMuted: '#3D5566',
  accent: '#7EC8E3',
  brandGreen: '#059669',
  background: '#FFFFFF',
  backgroundMuted: '#F5F7F8',
  card: '#FFFFFF',
  onPrimary: '#FFFFFF',
  mutedOnPrimary: '#C5D3DC',
  detail: '#2D4A5E',
} as const;

export type WidgetColorPalette = {
  background: string;
  primary: string;
  label: string;
  detail: string;
  footer: string;
};

export function getWidgetColors(colorScheme: 'light' | 'dark'): WidgetColorPalette {
  if (colorScheme === 'dark') {
    return {
      background: widgetTheme.primary,
      primary: widgetTheme.onPrimary,
      label: '#8FE3B8',
      detail: widgetTheme.mutedOnPrimary,
      footer: widgetTheme.onPrimary,
    };
  }

  return {
    background: widgetTheme.background,
    primary: widgetTheme.primary,
    label: widgetTheme.brandGreen,
    detail: widgetTheme.detail,
    footer: widgetTheme.primary,
  };
}
