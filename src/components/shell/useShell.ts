import { useCallback, useContext, useEffect, useRef } from "react";
import { ShellContext, type NavKey } from "./context";

function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within ShellProvider");
  return ctx;
}

export function useShellState() {
  return useShell();
}

/**
 * Section pages don't need to call this; it's the default. Detail pages (club, event, create
 * forms) call it. `onShare` is read through a ref rather than depended on directly: callers
 * pass a plain closure that's a new function every render (e.g. `event ? handleShare : undefined`),
 * and depending on it directly re-triggers this effect every render, which loops forever since
 * the effect's own setState changes the very state that causes the re-render.
 */
export function useMobileDetailHeader(title: string, backTo?: string, onShare?: () => void) {
  const { setMobileHeader } = useShell();
  const onShareRef = useRef(onShare);
  onShareRef.current = onShare;
  const hasShare = Boolean(onShare);
  const stableOnShare = useCallback(() => onShareRef.current?.(), []);

  useEffect(() => {
    setMobileHeader({ mode: "detail", title, backTo, onShare: hasShare ? stableOnShare : undefined });
    return () => setMobileHeader({ mode: "section" });
  }, [title, backTo, hasShare, stableOnShare, setMobileHeader]);
}

/** Overrides the nav-highlight rule for pages whose active destination isn't derivable from the path alone. */
export function useNavOverride(key: NavKey | null) {
  const { setNavOverride } = useShell();
  useEffect(() => {
    setNavOverride(key);
    return () => setNavOverride(null);
  }, [key, setNavOverride]);
}

/** The Event page uses this to swap the mobile tab bar for its own fixed action bar. */
export function useHideMobileTabBar(hide: boolean) {
  const { setHideMobileTabBar } = useShell();
  useEffect(() => {
    setHideMobileTabBar(hide);
    return () => setHideMobileTabBar(false);
  }, [hide, setHideMobileTabBar]);
}
