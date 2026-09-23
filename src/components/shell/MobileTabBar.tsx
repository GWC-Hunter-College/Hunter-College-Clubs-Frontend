import { Link, useLocation } from "react-router-dom";
import classes from "./MobileTabBar.module.css";
import { DESTINATIONS, navKeyForPath } from "./destinations";
import { useShellState } from "./useShell";

export default function MobileTabBar() {
  const location = useLocation();
  const { navOverride } = useShellState();
  const activeKey = navOverride ?? navKeyForPath(location.pathname);

  return (
    <nav className={classes.bar} aria-label="Primary">
      {DESTINATIONS.map((dest) => {
        const isActive = dest.key === activeKey;
        const isCreate = dest.key === "create";
        return (
          <Link
            key={dest.key}
            to={dest.to}
            className={`${classes.tab} ${isActive ? classes.active : ""} ${isCreate ? classes.create : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className={classes.pill}>{dest.icon(20)}</span>
            <span className={`${classes.label} text-meta-mono-caps`}>{dest.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
