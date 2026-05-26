import { useCallback, useEffect, useState } from "react";
import { Bell, MapPin } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePwaInstalled } from "@/hooks/usePwaInstalled";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  getLocationPermissionStatus,
  getNotificationPermissionStatus,
  requestPwaPermissionsInSequence,
  shouldOfferPwaPermissions,
} from "@/lib/pwaPermissions";
import {
  dismissPwaPermissionsPrompt,
  isPwaPermissionsPromptDismissed,
  markPwaPermissionsAsked,
  wasPwaPermissionsAsked,
} from "@/lib/pwaPermissionsStorage";

export function PwaPermissionsPrompt() {
  const { t } = useLocale();
  const pwaInstalled = usePwaInstalled();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const evaluatePrompt = useCallback(async () => {
    if (!pwaInstalled) return;
    if (isPwaPermissionsPromptDismissed() || wasPwaPermissionsAsked()) return;

    const [location, notifications] = await Promise.all([
      getLocationPermissionStatus(),
      Promise.resolve(getNotificationPermissionStatus()),
    ]);

    if (shouldOfferPwaPermissions(location, notifications)) {
      setOpen(true);
    } else {
      markPwaPermissionsAsked();
    }
  }, [pwaInstalled]);

  useEffect(() => {
    void evaluatePrompt();
  }, [evaluatePrompt]);

  const handleEnable = async () => {
    setBusy(true);
    try {
      await requestPwaPermissionsInSequence();
    } finally {
      markPwaPermissionsAsked();
      setBusy(false);
      setOpen(false);
    }
  };

  const handleDismiss = () => {
    dismissPwaPermissionsPrompt();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !busy && setOpen(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("pwa.permissionsTitle")}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{t("pwa.permissionsBody")}</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{t("pwa.permissionsLocation")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{t("pwa.permissionsNotifications")}</span>
                </li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDismiss} disabled={busy}>
            {t("pwa.permissionsNotNow")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => void handleEnable()} disabled={busy}>
            {busy ? t("pwa.permissionsEnabling") : t("pwa.permissionsEnable")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
