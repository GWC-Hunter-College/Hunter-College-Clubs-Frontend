import { useContext, useEffect } from "react";
import { ShellContext, type NavKey } from "./context";

function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within ShellProvider");
  return ctx;
}

export function useShellState() {
  return useShell();
}

/** Section pages don't need to call this; it's the default. Detail pages (club, event, create forms) call it. */
export function useMobileDetailHeader(title: string, backTo?: string, onShare?: () => void) {
  const { setMobileHeader } = useShell();
  useEffect(() => {
    setMobileHeader({ mode: "detail", title, backTo, onShare });
    return () => setMobileHeader({ mode: "section" });
  }, [title, backTo, onShare, setMobileHeader]);
}

/** Overrides the nav-highlight rule for pages whose active destination isn't derivable from the path alone. */
export function useNavOverride(key: NavKey | null) {
  const { setNavOverride } = useShell();
  useEffect(() => {
    setNavOverride(key);
    return () => setNavOverride(null);
  }, [key, setNavOverride]);
}
