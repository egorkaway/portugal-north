import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  createTranslator,
  detectDeviceLocale,
  type Locale,
  type Translator,
} from '@/i18n/index';

type LocaleContextValue = {
  locale: Locale;
  ready: boolean;
  t: Translator['t'];
  plural: Translator['plural'];
  messages: Translator['messages'];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function safeDetectDeviceLocale(): Locale {
  try {
    return detectDeviceLocale();
  } catch {
    return 'en';
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => safeDetectDeviceLocale());
  const [ready, setReady] = useState(false);

  const refreshFromDevice = useCallback(() => {
    setLocale(safeDetectDeviceLocale());
  }, []);

  useEffect(() => {
    refreshFromDevice();
    setReady(true);

    const onChange = (state: AppStateStatus) => {
      if (state === 'active') refreshFromDevice();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [refreshFromDevice]);

  const value = useMemo<LocaleContextValue>(() => {
    const { t, plural, messages } = createTranslator(locale);
    return { locale, ready, t, plural, messages };
  }, [locale, ready]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}
