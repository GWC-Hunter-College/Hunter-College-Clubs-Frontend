import { createContext } from "react";

export type NavKey = "home" | "events" | "clubs" | "create" | "my-clubs";

export type MobileHeader =
  | { mode: "section" }
  | { mode: "detail"; title: string; backTo?: string; onShare?: () => void };

export type ShellState = {
  mobileHeader: MobileHeader;
  setMobileHeader: (header: MobileHeader) => void;
  navOverride: NavKey | null;
  setNavOverride: (key: NavKey | null) => void;
  /** The Event page replaces the mobile tab bar with its own fixed action bar. */
  hideMobileTabBar: boolean;
  setHideMobileTabBar: (hide: boolean) => void;
};

export const ShellContext = createContext<ShellState | null>(null);
