import type { Locale } from '@/i18n/types';
import privacyByLocaleJson from '@/data/privacy-by-locale.json';

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type PrivacyContent = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  intro: string;
  sections: PrivacySection[];
};

const privacyByLocale = privacyByLocaleJson as Record<string, PrivacyContent>;

export function getPrivacyContent(locale: Locale): PrivacyContent {
  return privacyByLocale[locale] ?? privacyByLocale.en;
}
