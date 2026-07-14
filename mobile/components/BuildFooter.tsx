import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { getAppBuildLabel } from '@/lib/appBuild';

/** Inline footer for scrollable pages — place at the end of scroll content. */
export function BuildFooter() {
  const label = getAppBuildLabel();

  if (!label) {
    return null;
  }

  return (
    <View style={styles.inline}>
      <Text style={styles.inlineText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inline: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  inlineText: {
    fontSize: 12,
    color: theme.primaryMuted,
  },
});
