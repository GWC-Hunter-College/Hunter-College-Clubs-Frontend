import { useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { ShellContext, type MobileHeader, type NavKey } from "./context";

export function ShellProvider({ children }: PropsWithChildren) {
  const [mobileHeader, setMobileHeader] = useState<MobileHeader>({ mode: "section" });
  const [navOverride, setNavOverride] = useState<NavKey | null>(null);
  const [hideMobileTabBar, setHideMobileTabBar] = useState(false);
  const value = useMemo(
    () => ({ mobileHeader, setMobileHeader, navOverride, setNavOverride, hideMobileTabBar, setHideMobileTabBar }),
    [mobileHeader, navOverride, hideMobileTabBar],
  );
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
