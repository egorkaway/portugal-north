import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { BuildFooter } from '@/components/BuildFooter';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import { getPrivacyContent } from '@/lib/privacyContent';

const URL_RE = /(https?:\/\/[^\s]+)/g;

function Paragraph({ text }: { text: string }) {
  const parts = useMemo(() => text.split(URL_RE), [text]);

  return (
    <Text style={styles.paragraph}>
      {parts.map((part, index) => {
        if (/^https?:\/\//.test(part)) {
          const href = part.replace(/[.,;:)]+$/, '');
          const trailing = part.slice(href.length);
          return (
            <Text key={`${index}-${href}`}>
              <Text style={styles.link} onPress={() => void Linking.openURL(href)}>
                {href}
              </Text>
              {trailing}
            </Text>
          );
        }
        return <Text key={`${index}-text`}>{part}</Text>;
      })}
    </Text>
  );
}

export default function PrivacyScreen() {
  const { locale } = useLocale();
  const content = useMemo(() => getPrivacyContent(locale), [locale]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>{content.subtitle}</Text>
      <Text style={styles.meta}>{content.lastUpdated}</Text>
      <Text style={styles.intro}>{content.intro}</Text>

      {content.sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.paragraphs.map((paragraph) => (
            <Paragraph key={`${section.id}-${paragraph.slice(0, 24)}`} text={paragraph} />
          ))}
        </View>
      ))}

      <Pressable onPress={() => void Linking.openURL('https://www.verystays.com/privacy')}>
        <Text style={styles.webLink}>verystays.com/privacy</Text>
      </Pressable>

      <BuildFooter />
    </ScrollView>
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
    gap: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
  },
  meta: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
    marginBottom: 8,
  },
  section: {
    gap: 8,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
  },
  link: {
    color: theme.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  webLink: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
