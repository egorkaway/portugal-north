import { type RefObject } from 'react';
import { Alert, InteractionManager, Platform, Share } from 'react-native';
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

export type ShareCapturedCopy = {
  dialogTitle?: string;
  unavailableTitle?: string;
  unavailableBody?: string;
  /** Website URL (or other text) included alongside the image when the OS allows it. */
  message?: string;
};

async function shareImageFile(uri: string, dialogTitle: string): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('sharing-unavailable');
  }
  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    UTI: 'public.png',
    dialogTitle,
  });
}

/**
 * Capture a view and open the system share sheet.
 * When `message` is set on iOS, shares image + link via Share.share;
 * otherwise (and on Android) shares the image via expo-sharing (URL lives on the image footer).
 */
export async function shareCapturedView(
  viewRef: CaptureTarget,
  copy: ShareCapturedCopy = {},
): Promise<void> {
  await waitForNextPaint();

  const uri = await captureRef(viewRef, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
  });

  const dialogTitle = copy.dialogTitle ?? 'Share';

  if (copy.message && Platform.OS === 'ios') {
    try {
      await Share.share({ url: uri, message: copy.message });
      return;
    } catch {
      // Fall through to image-only share on unexpected failure (not dismiss).
    }
  }

  try {
    await shareImageFile(uri, dialogTitle);
  } catch (error) {
    if (error instanceof Error && error.message === 'sharing-unavailable') {
      Alert.alert(
        copy.unavailableTitle ?? 'Sharing unavailable',
        copy.unavailableBody ?? 'Sharing is not available on this device.',
      );
      return;
    }
    throw error;
  }
}

/** Capture a map view (with branding footer already visible) and share the image. */
export async function shareCapturedMap(
  viewRef: CaptureTarget,
  copy: ShareCapturedCopy = {},
): Promise<void> {
  await shareCapturedView(viewRef, {
    ...copy,
    dialogTitle: copy.dialogTitle ?? 'Share map',
    message: undefined,
  });
}
