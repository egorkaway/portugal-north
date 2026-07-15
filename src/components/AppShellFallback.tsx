import { useLayoutEffect, type ComponentType } from "react";

/** Keep the HTML static shell visible while route chunks load (no duplicate React fallback). */
export function AppShellFallback() {
  return null;
}

export function removeStaticAppShell(): void {
  document.getElementById("static-app-shell")?.remove();
  document.body.removeAttribute("data-shell");
}

export function useDismissStaticShell(): void {
  useLayoutEffect(() => {
    removeStaticAppShell();
  }, []);
}

export function withShellDismiss<P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> {
  function DismissShellWrapper(props: P) {
    useDismissStaticShell();
    return <Component {...props} />;
  }
  DismissShellWrapper.displayName = `DismissShell(${Component.displayName ?? Component.name ?? "Component"})`;
  return DismissShellWrapper;
}
