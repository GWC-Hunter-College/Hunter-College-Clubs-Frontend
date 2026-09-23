import { Link, useLocation } from "react-router-dom";
import classes from "./TopNav.module.css";
import UserMenu from "./UserMenu";
import { DESTINATIONS, navKeyForPath } from "./destinations";
import { useShellState } from "./useShell";
import { useAuthInfo } from "../../types/auth";

export default function TopNav() {
  const location = useLocation();
  const auth = useAuthInfo();
  const { navOverride } = useShellState();
  const activeKey = navOverride ?? navKeyForPath(location.pathname);

  return (
    <nav className={classes.nav} aria-label="Primary">
      <div className={classes.left}>
        <Link to="/" className={`${classes.wordmark} text-wordmark`}>
          HUNTER <span>CS</span>
        </Link>
        <div className={classes.destinations}>
          {DESTINATIONS.map((dest) => {
            const isActive = dest.key === activeKey;
            return (
              <Link
                key={dest.key}
                to={dest.to}
                className={`${classes.item} ${isActive ? classes.active : ""} text-button-m`}
                aria-current={isActive ? "page" : undefined}
              >
                {dest.icon(20)}
                {dest.label}
              </Link>
            );
          })}
        </div>
      </div>
      <UserMenu auth={auth} />
    </nav>
  );
}
