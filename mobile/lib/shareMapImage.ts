import { type RefObject } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

type CaptureTarget = RefObject<unknown>;

async function waitForNextPaint() {
  await new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => resolve());
    });
  });
  // Extra beat so MapView / branding footer finish laying out before capture.
  await new Promise((resolve) => setTimeout(resolve, 120));
}

type ShareMapCopy = {
  dialogTitle?: string;
  unavailableTitle?: string;
  unavailableBody?: string;
};

/**
 * Capture a map view (with branding footer already visible) and open the system share sheet.
 */
export async function shareCapturedMap(
  viewRef: CaptureTarget,
  copy: ShareMapCopy = {},
): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert(
      copy.unavailableTitle ?? 'Sharing unavailable',
      copy.unavailableBody ?? 'Sharing is not available on this device.',
    );
    return;
  }

  await waitForNextPaint();

  const uri = await captureRef(viewRef, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
  });

  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    UTI: 'public.png',
    dialogTitle: copy.dialogTitle ?? 'Share map',
  });
}
