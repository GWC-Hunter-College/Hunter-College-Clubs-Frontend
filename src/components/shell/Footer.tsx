import { Link } from "react-router-dom";
import classes from "./Footer.module.css";
import { DESTINATIONS } from "./destinations";

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.brand}>
        <span className={`${classes.wordmark} text-wordmark`}>
          HUNTER <span>CS</span>
        </span>
        <span className={`${classes.tagline} text-caption`}>Student clubs at Hunter College Computer Science</span>
      </div>
      <nav className={classes.links} aria-label="Footer">
        {DESTINATIONS.map((dest) => (
          <Link key={dest.key} to={dest.to} className="text-meta-mono-caps">
            {dest.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
