import { Link } from "react-router-dom";
import classes from "./ClubCard.module.css";
import ClubLogo from "./ClubLogo";
import { ChipTag } from "./Pills";
import { clubTintGradient } from "../../lib/clubTint";
import type { Club } from "../../types/club";

type ClubCardProps = {
  club: Club;
  bannerSrc: string;
  mobile?: boolean;
};

/** Clubs directory card. Desktop: banner + overlapping logo. Mobile: horizontal, no banner. */
export default function ClubCard({ club, bannerSrc, mobile }: ClubCardProps) {
  if (mobile) {
    return (
      <Link to={`/club/${club.id}`} className={classes.mobileCard} state={{ origin: "clubs" }}>
        <ClubLogo clubId={club.id} name={club.name} logo={club.logo} size={64} />
        <div className={classes.mobileBody}>
          <h3 className={`${classes.mobileName} text-heading-m`}>{club.name}</h3>
          <p className={`${classes.mobileDesc} text-caption`}>{club.description}</p>
          {typeof club.memberCount === "number" && (
            <span className="text-meta-mono-caps" style={{ color: "var(--text-muted)" }}>
              {club.memberCount} MEMBERS
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/club/${club.id}`} className={classes.card} state={{ origin: "clubs" }}>
      <div className={classes.banner}>
        <img src={bannerSrc} alt="" />
        <div className={classes.bannerTint} style={{ background: clubTintGradient(club.id) }} />
        <div className={classes.bannerLogo}>
          <ClubLogo clubId={club.id} name={club.name} logo={club.logo} size={72} />
        </div>
      </div>
      <div className={classes.body}>
        <h3 className={`${classes.name} text-heading-m`}>{club.name}</h3>
        {club.tags.length > 0 && (
          <div className={classes.tags}>
            {club.tags.map((tag) => (
              <ChipTag key={tag}>{tag}</ChipTag>
            ))}
          </div>
        )}
        <p className={`${classes.desc} text-body-m`}>{club.description}</p>
        <div className={classes.footer}>
          {typeof club.memberCount === "number" ? (
            <span className={`${classes.members} text-meta-mono-caps`}>{club.memberCount} MEMBERS</span>
          ) : (
            <span />
          )}
          <span className="text-button-m" style={{ color: "var(--brand-primary)" }}>
            VIEW CLUB &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
