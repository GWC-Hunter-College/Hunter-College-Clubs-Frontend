import type { PropsWithChildren } from "react";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./AppShell.module.css";
import TopNav from "./TopNav";
import Footer from "./Footer";
import MobileTopBar from "./MobileTopBar";
import MobileTabBar from "./MobileTabBar";

/**
 * ≥1024px: sticky top nav + footer. <1024px: mobile top bar + fixed bottom tab bar.
 *
 * Note: this does NOT own ShellProvider. Pages call useMobileDetailHeader/useNavOverride at
 * their own top level, as a sibling of the <AppShell> they render — not a descendant of it —
 * so the provider has to wrap the router (see App.tsx), not live inside this component.
 */
export default function AppShell({ children }: PropsWithChildren) {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });

  return (
    <div className={classes.shell}>
      {isDesktop ? <TopNav /> : <MobileTopBar />}
      <main className={classes.main}>{children}</main>
      {isDesktop ? <Footer /> : <MobileTabBar />}
    </div>
  );
}
