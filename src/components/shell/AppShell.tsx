import type { PropsWithChildren } from "react";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./AppShell.module.css";
import TopNav from "./TopNav";
import Footer from "./Footer";
import MobileTopBar from "./MobileTopBar";
import MobileTabBar from "./MobileTabBar";
import { ShellProvider } from "./ShellContext";

/** ≥1024px: sticky top nav + footer. <1024px: mobile top bar + fixed bottom tab bar. */
export default function AppShell({ children }: PropsWithChildren) {
  return (
    <ShellProvider>
      <ShellChrome>{children}</ShellChrome>
    </ShellProvider>
  );
}

function ShellChrome({ children }: PropsWithChildren) {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true, { getInitialValueInEffect: false });

  return (
    <div className={classes.shell}>
      {isDesktop ? <TopNav /> : <MobileTopBar />}
      <main className={classes.main}>{children}</main>
      {isDesktop ? <Footer /> : <MobileTabBar />}
    </div>
  );
}
