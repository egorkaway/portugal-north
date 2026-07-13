import { useColorScheme as useRNColorScheme } from 'react-native';

/** Device light/dark preference — use only for map basemap appearance. */
export function useSystemColorScheme(): 'light' | 'dark' {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
