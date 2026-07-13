import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/constants/theme';
import { getAppBuildLabel } from '@/lib/appBuild';

type BuildFooterProps = {
  /** Pin to the bottom of the screen (map, loading states). */
  fixed?: boolean;
};

export function BuildFooter({ fixed = false }: BuildFooterProps) {
  const insets = useSafeAreaInsets();
  const label = getAppBuildLabel();

  if (!label) {
    return null;
  }

  if (fixed) {
    return (
      <View
        pointerEvents="none"
        style={[styles.fixed, { paddingBottom: Math.max(insets.bottom, 8) }]}
      >
        <Text style={styles.fixedText}>{label}</Text>
      </View>
    );
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
  fixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingTop: 8,
  },
  fixedText: {
    fontSize: 11,
    color: theme.primaryMuted,
    backgroundColor: 'rgba(255,255,255,0.92)',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
