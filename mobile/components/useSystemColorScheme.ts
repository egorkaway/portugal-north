import { useColorScheme as useRNColorScheme } from 'react-native';

/** Device light/dark preference (Map tab no longer follows this — app stays light). */
export function useSystemColorScheme(): 'light' | 'dark' {
  const scheme = useRNColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
