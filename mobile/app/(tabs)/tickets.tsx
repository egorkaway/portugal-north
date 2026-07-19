import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { BuildFooter } from '@/components/BuildFooter';
import { usePurchases } from '@/components/PurchasesProvider';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import ticketGuide from '@/data/ticket-guide.json';

type TicketLink = {
  title: string;
  body: string;
  url: string;
};

type TicketCountry = {
  country: string;
  howToBuy: string;
  crossBorderNote?: string;
  serviceBullets: string[];
  links: TicketLink[];
};

const countries = ticketGuide.countries as TicketCountry[];

export default function TicketsScreen() {
  const { t } = useLocale();
  const { isPro, presentPaywall } = usePurchases();
  const [paywallBusy, setPaywallBusy] = useState(false);

  const openPaywall = async () => {
    if (paywallBusy) return;
    setPaywallBusy(true);
    try {
      await presentPaywall();
    } finally {
      setPaywallBusy(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('tickets.title')}</Text>
      <Text style={styles.subtitle}>{ticketGuide.subtitle}</Text>

      {countries.map((country) => (
        <CountrySection
          key={country.country}
          country={country.country}
          howToBuy={country.howToBuy}
          crossBorderNote={country.crossBorderNote}
          serviceBullets={country.serviceBullets}
          links={country.links}
          howToBuyTitle={t('tickets.howToBuy')}
          serviceTypesTitle={t('tickets.serviceTypes')}
          usefulLinksTitle={t('tickets.usefulLinks')}
          openLabel={t('tickets.open')}
        />
      ))}

      <Text style={styles.disclaimer}>{ticketGuide.disclaimer}</Text>

      <View style={styles.proCard}>
        <Text style={styles.proTitle}>
          {isPro ? t('tickets.proActiveTitle') : t('tickets.proTitle')}
        </Text>
        <Text style={styles.proBody}>
          {isPro ? t('tickets.proActiveBody') : t('tickets.proBody')}
        </Text>
        <Pressable
          style={[styles.proButton, paywallBusy ? styles.proButtonDisabled : null]}
          disabled={paywallBusy}
          onPress={() => void openPaywall()}
        >
          {paywallBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.proButtonText}>
              {isPro ? t('tickets.proManage') : t('tickets.proCta')}
            </Text>
          )}
        </Pressable>
      </View>

      <BuildFooter />
    </ScrollView>
  );
}

function CountrySection({
  country,
  howToBuy,
  crossBorderNote,
  serviceBullets,
  links,
  howToBuyTitle,
  serviceTypesTitle,
  usefulLinksTitle,
  openLabel,
}: {
  country: string;
  howToBuy: string;
  crossBorderNote?: string;
  serviceBullets: string[];
  links: TicketLink[];
  howToBuyTitle: string;
  serviceTypesTitle: string;
  usefulLinksTitle: string;
  openLabel: string;
}) {
  return (
    <View style={styles.countryBlock}>
      <Text style={styles.countryTitle}>{country}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{howToBuyTitle}</Text>
        <Text style={styles.body}>{howToBuy}</Text>
        {crossBorderNote ? (
          <View style={styles.noteCard}>
            <Text style={styles.noteText}>{crossBorderNote}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{serviceTypesTitle}</Text>
        {serviceBullets.map((text) => (
          <Bullet key={text} text={text} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{usefulLinksTitle}</Text>
        {links.map((link) => (
          <Pressable
            key={link.url}
            style={styles.linkCard}
            onPress={() => void Linking.openURL(link.url)}
          >
            <Text style={styles.linkTitle}>{link.title}</Text>
            <Text style={styles.linkBody}>{link.body}</Text>
            <Text style={styles.linkAction}>{openLabel}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.primary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
  },
  countryBlock: {
    gap: 16,
    paddingTop: 4,
  },
  countryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.primary,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  body: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
  },
  noteCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.primary,
  },
  linkCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 4,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
  },
  linkBody: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  linkAction: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
  disclaimer: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  proCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    gap: 8,
  },
  proTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.primary,
  },
  proBody: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  proButton: {
    marginTop: 6,
    alignSelf: 'stretch',
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  proButtonDisabled: {
    opacity: 0.7,
  },
  proButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
