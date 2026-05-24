import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";
import { pt } from "@/i18n/messages/pt";
import type { Locale, Messages } from "@/i18n/types";
import { LOCALE_STORAGE_KEY } from "@/i18n/types";

export type { Locale, Messages };
export { LOCALES, LOCALE_STORAGE_KEY } from "@/i18n/types";

const catalogs: Record<Locale, Messages> = { en, pt, es };

export function getMessages(locale: Locale): Messages {
  return catalogs[locale] ?? catalogs.en;
}

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "pt" || value === "es";
}

/** Prefer pt/es from browser languages; default to English. */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";

  const candidates = [
    ...(navigator.languages?.length ? navigator.languages : []),
    navigator.language,
  ].filter(Boolean);

  for (const tag of candidates) {
    const base = tag.split("-")[0]?.toLowerCase();
    if (base === "pt") return "pt";
    if (base === "es") return "es";
  }
  return "en";
}

export function readStoredLocale(): Locale | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return stored && isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function resolveInitialLocale(): Locale {
  return readStoredLocale() ?? detectBrowserLocale();
}

type TranslateParams = Record<string, string | number>;

function getNested(messages: Messages, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(locale: Locale) {
  const messages = getMessages(locale);

  function t(path: string, params?: TranslateParams): string {
    const template = getNested(messages, path);
    if (!template) return path;
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
