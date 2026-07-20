import { getLocales } from 'expo-localization';
import { ca } from '@/i18n/messages/ca';
import { en } from '@/i18n/messages/en';
import { es } from '@/i18n/messages/es';
import { gl } from '@/i18n/messages/gl';
import { pt } from '@/i18n/messages/pt';
import { ru } from '@/i18n/messages/ru';
import { uk } from '@/i18n/messages/uk';
import type { Locale, MobileMessages } from '@/i18n/types';
import { LOCALES } from '@/i18n/types';

export type { Locale, MobileMessages };
export { LOCALES } from '@/i18n/types';

const catalogs: Record<Locale, MobileMessages> = { en, pt, es, gl, ca, uk, ru };

export function getMessages(locale: Locale): MobileMessages {
  return catalogs[locale] ?? catalogs.en;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefer first supported device / per-app language; default to English. */
export function detectDeviceLocale(): Locale {
  const candidates = getLocales()
    .flatMap((entry) => [entry.languageTag, entry.languageCode])
    .filter((value): value is string => Boolean(value));

  for (const tag of candidates) {
    const base = tag.toLowerCase().split('-')[0];
    // Include `en` so an English per-app preference is not skipped for a later device locale.
    if (isLocale(base)) return base;
  }
  return 'en';
}

/** Prefer explicit locale, otherwise device language. */
export async function resolveAppLocale(preferred?: Locale): Promise<Locale> {
  if (preferred && isLocale(preferred)) return preferred;
  return detectDeviceLocale();
}

type TranslateParams = Record<string, string | number>;

function getNested(messages: MobileMessages, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = messages;
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function createTranslator(locale: Locale) {
  const messages = getMessages(locale);
  const fallback = locale === 'en' ? null : catalogs.en;

  function t(path: string, params?: TranslateParams): string {
    const template =
      getNested(messages, path) ?? (fallback ? getNested(fallback, path) : undefined) ?? path;
    if (!params) return template;
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
      params[key] !== undefined ? String(params[key]) : `{{${key}}}`,
    );
  }

  function plural(path: string, count: number, params?: TranslateParams): string {
    const key = count === 1 ? `${path}_one` : `${path}_other`;
    return t(key, { ...params, count });
  }

  return { t, plural, locale, messages };
}

export type Translator = ReturnType<typeof createTranslator>;
